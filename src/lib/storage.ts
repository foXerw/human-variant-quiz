import { useSyncExternalStore } from "react";
import type { Answers, SharePrivacy } from "@/lib/types";

/**
 * sessionStorage 响应式封装（v3）。
 *
 * 隐私设计决策：答题数据只存在于当前标签页的会话中——
 * - 刷新、同标签页内 /quiz ↔ /result 跳转：进度保留（满足“刷新不丢”验收标准）；
 * - 关闭标签页：浏览器自动销毁，设备上不留任何历史答案记录；
 * - 不使用 localStorage：它持久到手动清除，对匿名娱乐测评是不必要的留存负债。
 *
 * 首次访问时自动清除 v1/v2 时代写入 localStorage 的遗留数据。
 * 站点无后端、无 Cookie，答案从不离开这台设备。
 */

const ANSWERS_KEY = "hvq:answers:v3";
const PRIVACY_KEY = "hvq:privacy:v3";

/** 旧版本使用过的持久化键（localStorage），升级后一次性清除 */
const LEGACY_KEYS = ["hvq:answers:v1", "hvq:answers:v2", "hvq:privacy:v1"];

const EMPTY_ANSWERS: Answers = {};

let legacyPurged = false;
function purgeLegacy(): void {
  if (legacyPurged) return;
  legacyPurged = true;
  try {
    for (const key of LEGACY_KEYS) window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

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
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* 隐私模式 / 配额不足时静默失败，页面内 React 状态仍可正常答题 */
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
  purgeLegacy();
  answerListeners.add(onChange);
  return () => answerListeners.delete(onChange);
}

function setAnswers(next: Answers): void {
  const raw = JSON.stringify(next);
  writeItem(ANSWERS_KEY, raw);
  answersRawCache = raw;
  answersCache = next;
  answerListeners.forEach((l) => l());
}

/** 答题进度（仅当前标签页会话内有效） */
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
  return () => privacyListeners.delete(onChange);
}

function setPrivacyValue(next: SharePrivacy): void {
  writeItem(PRIVACY_KEY, next);
  privacyRawCache = next;
  privacyCache = next;
  privacyListeners.forEach((l) => l());
}

/** 分享隐私级别（默认 "scores"：只公开得分；同样仅会话内记忆） */
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
