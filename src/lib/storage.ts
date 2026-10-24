import { useSyncExternalStore } from "react";
import type { Answers, SharePrivacy } from "@/lib/types";

/**
 * localStorage 响应式封装（基于 useSyncExternalStore）。
 * 数据只存在用户自己的浏览器里，站点不收集、不上传任何信息。
 * SSR / hydration 阶段返回空快照，挂载后自动切换到真实数据，
 * 因此不需要“effect 里 setState”的恢复模式。
 */

// v2：评分框架 v2（好极/常模参照）与 v1 手填分值不兼容，旧进度作废
const ANSWERS_KEY = "hvq:answers:v2";
const PRIVACY_KEY = "hvq:privacy:v1";

const EMPTY_ANSWERS: Answers = {};

function parseAnswers(raw: string | null): Answers {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    const answers: Answers = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v === 0 || v === 1) answers[k] = v;
    }
    return answers;
  } catch {
    return {};
  }
}

function readItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* 隐私模式 / 存储空间不足时静默失败，不影响答题 */
  }
}

// ---------- 答案 store ----------

const answerListeners = new Set<() => void>();
let answersRawCache: string | null | undefined;
let answersCache: Answers = EMPTY_ANSWERS;

function answersSnapshot(): Answers {
  const raw = readItem(ANSWERS_KEY);
  if (raw !== answersRawCache) {
    answersRawCache = raw;
    answersCache = parseAnswers(raw);
  }
  return answersCache;
}

function subscribeAnswers(onChange: () => void): () => void {
  answerListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    answerListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function setAnswers(next: Answers): void {
  const raw = JSON.stringify(next);
  writeItem(ANSWERS_KEY, raw);
  answersRawCache = raw;
  answersCache = next;
  answerListeners.forEach((l) => l());
}

/** 答题进度（读写响应式；跨标签页 storage 事件也会同步） */
export function useAnswers(): [Answers, typeof setAnswers] {
  const answers = useSyncExternalStore(
    subscribeAnswers,
    answersSnapshot,
    () => EMPTY_ANSWERS,
  );
  return [answers, setAnswers];
}

// ---------- 分享隐私偏好 store ----------

const privacyListeners = new Set<() => void>();
let privacyRawCache: string | null | undefined;
let privacyCache: SharePrivacy = "scores";

function privacySnapshot(): SharePrivacy {
  const raw = readItem(PRIVACY_KEY);
  if (raw !== privacyRawCache) {
    privacyRawCache = raw;
    privacyCache = raw === "details" ? "details" : "scores"; // 默认隐私保护：只展示得分
  }
  return privacyCache;
}

function subscribePrivacy(onChange: () => void): () => void {
  privacyListeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    privacyListeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function setPrivacyValue(next: SharePrivacy): void {
  writeItem(PRIVACY_KEY, next);
  privacyRawCache = next;
  privacyCache = next;
  privacyListeners.forEach((l) => l());
}

/** 分享隐私级别（默认 "scores"：只公开得分） */
export function usePrivacy(): [SharePrivacy, typeof setPrivacyValue] {
  const privacy = useSyncExternalStore(
    subscribePrivacy,
    privacySnapshot,
    () => "scores" as SharePrivacy,
  );
  return [privacy, setPrivacyValue];
}

// ---------- 挂载标志 ----------

const noopSubscribe = () => () => {};

/** hydration 是否完成：SSR/首帧为 false，挂载后为 true（无需 effect） */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
