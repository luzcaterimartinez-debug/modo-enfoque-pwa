import { useCallback, useSyncExternalStore } from "react";
import { Flame, Leaf, Trophy } from "lucide-react";
import { getChallenge, getDailyChallenge } from "@/lib/challenges";

const KEY = "enfoque-store-v2";

const DEFAULT = {
  points: 0,
  blocks: 0,
  streak: 0,
  bestStreak: 0,
  lastBlockDate: null,
  gameScore: 0,
  claimed: [],
  completedChallenges: [],
  activeDetox: null,
  dailyMinutes: {},
  dailyBlocks: {},
  dailyChallengeId: null,
  dailyChallengeDate: null,
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function migrate(parsed) {
  if (parsed.dailyMinutes) return parsed;
  return {
    ...parsed,
    dailyMinutes: {},
    dailyBlocks: {},
    bestStreak: parsed.bestStreak ?? parsed.streak ?? 0,
    dailyChallengeId: null,
    dailyChallengeDate: null,
  };
}

let cachedRaw = null;
let cachedState = DEFAULT;

function buildState(parsed) {
  return {
    ...DEFAULT,
    ...parsed,
    completedChallenges: parsed.completedChallenges ?? [],
    activeDetox: parsed.activeDetox ?? null,
    dailyMinutes: parsed.dailyMinutes ?? {},
    dailyBlocks: parsed.dailyBlocks ?? {},
  };
}

function read() {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem("enfoque-store-v1");
    if (!raw) {
      cachedRaw = "";
      cachedState = DEFAULT;
      return DEFAULT;
    }
    if (raw === cachedRaw) return cachedState;
    cachedRaw = raw;
    cachedState = buildState(migrate(JSON.parse(raw)));
    return cachedState;
  } catch {
    cachedRaw = null;
    cachedState = DEFAULT;
    return DEFAULT;
  }
}

function write(s) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(s);
  if (raw === cachedRaw) return;
  localStorage.setItem(KEY, raw);
  localStorage.removeItem("enfoque-store-v1");
  cachedRaw = raw;
  cachedState = s;
  window.dispatchEvent(new CustomEvent("enfoque-store"));
}

function subscribe(callback) {
  const onExternalStorage = () => {
    cachedRaw = null;
    callback();
  };
  window.addEventListener("enfoque-store", callback);
  window.addEventListener("storage", onExternalStorage);
  return () => {
    window.removeEventListener("enfoque-store", callback);
    window.removeEventListener("storage", onExternalStorage);
  };
}

export function useStore() {
  const state = useSyncExternalStore(subscribe, read, () => DEFAULT);

  const update = useCallback((patch) => {
    const cur = read();
    const next = { ...cur, ...(typeof patch === "function" ? patch(cur) : patch) };
    write(next);
  }, []);

  return [state, update];
}

export function addGameScore(delta) {
  const cur = read();
  write({ ...cur, gameScore: cur.gameScore + delta });
}

function bumpDaily(cur, minutes, blocks = 0) {
  const d = today();
  return {
    dailyMinutes: {
      ...cur.dailyMinutes,
      [d]: (cur.dailyMinutes[d] || 0) + minutes,
    },
    dailyBlocks: blocks
      ? { ...cur.dailyBlocks, [d]: (cur.dailyBlocks[d] || 0) + blocks }
      : cur.dailyBlocks,
  };
}

export function completeBlock(minutes) {
  const cur = read();
  const d = today();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak =
    cur.lastBlockDate === d ? cur.streak :
    cur.lastBlockDate === yesterday ? cur.streak + 1 :
    1;
  const blockPoints = minutes * 2;
  const gained = blockPoints + cur.gameScore;
  const daily = bumpDaily(cur, minutes, 1);

  write({
    ...cur,
    ...daily,
    points: cur.points + gained,
    blocks: cur.blocks + 1,
    streak,
    bestStreak: Math.max(cur.bestStreak || 0, streak),
    lastBlockDate: d,
    gameScore: 0,
  });

  return { gained, streak, blockPoints, gameBonus: cur.gameScore };
}

export const STREAK_MEDALS = [
  { threshold: 3, name: "Racha de 3", desc: "3 bloques en racha", icon: Leaf },
  { threshold: 7, name: "Racha de 7", desc: "7 bloques en racha", icon: Flame },
  { threshold: 14, name: "Racha de 14", desc: "14 bloques en racha", icon: Trophy },
];

export function isChallengeDoneToday(id, store = read()) {
  return store.completedChallenges.some((c) => c.id === id && c.date === today());
}

export function startDetoxChallenge(challengeId, durationSec) {
  const cur = read();
  write({
    ...cur,
    activeDetox: {
      challengeId,
      endsAt: Date.now() + durationSec * 1000,
      violations: 0,
      paused: false,
      pausedRemaining: null,
    },
  });
}

export function pauseDetoxChallenge() {
  const cur = read();
  const detox = cur.activeDetox;
  if (!detox || detox.paused) return;
  const remaining = Math.max(0, detox.endsAt - Date.now());
  write({
    ...cur,
    activeDetox: { ...detox, paused: true, pausedRemaining: remaining },
  });
}

export function resumeDetoxChallenge() {
  const cur = read();
  const detox = cur.activeDetox;
  if (!detox || !detox.paused || detox.pausedRemaining == null) return;
  write({
    ...cur,
    activeDetox: {
      ...detox,
      paused: false,
      endsAt: Date.now() + detox.pausedRemaining,
      pausedRemaining: null,
    },
  });
}

export function recordDetoxViolation() {
  const cur = read();
  const detox = cur.activeDetox;
  if (!detox || detox.paused) {
    return { failed: false, violations: detox?.violations ?? 0 };
  }

  const violations = (detox.violations ?? 0) + 1;
  const remaining = Math.max(0, detox.endsAt - Date.now());

  if (violations >= 3) {
    write({ ...cur, activeDetox: null });
    return { failed: true, violations };
  }

  write({
    ...cur,
    activeDetox: {
      ...detox,
      violations,
      paused: true,
      pausedRemaining: remaining,
    },
  });
  return { failed: false, violations };
}

export function cancelDetoxChallenge() {
  const cur = read();
  write({ ...cur, activeDetox: null });
}

export function failDetoxChallenge() {
  cancelDetoxChallenge();
}

export function completeChallenge(challengeId, points, durationSec = 0) {
  const cur = read();
  const d = today();
  if (cur.completedChallenges.some((c) => c.id === challengeId && c.date === d)) {
    return { ok: false, reason: "already" };
  }

  const challengeMinutes = durationSec ? Math.round(durationSec / 60) : 0;
  const dailyChallenge = getDailyChallenge();
  const dailyBonus =
    challengeId === dailyChallenge.id &&
    (cur.dailyChallengeDate !== d || cur.dailyChallengeId !== challengeId)
      ? 25
      : 0;
  const daily = bumpDaily(cur, challengeMinutes);

  write({
    ...cur,
    ...daily,
    points: cur.points + points + dailyBonus,
    completedChallenges: [...cur.completedChallenges, { id: challengeId, date: d }],
    activeDetox: cur.activeDetox?.challengeId === challengeId ? null : cur.activeDetox,
    dailyChallengeId: dailyBonus ? challengeId : cur.dailyChallengeId,
    dailyChallengeDate: dailyBonus ? d : cur.dailyChallengeDate,
  });

  return { ok: true, points: points + dailyBonus };
}

export function finishExpiredDetox() {
  const cur = read();
  if (!cur.activeDetox || cur.activeDetox.paused) return null;
  if (cur.activeDetox.endsAt > Date.now()) return null;
  const challenge = getChallenge(cur.activeDetox.challengeId);
  if (!challenge) {
    write({ ...cur, activeDetox: null });
    return null;
  }
  if (isChallengeDoneToday(challenge.id, cur)) {
    write({ ...cur, activeDetox: null });
    return null;
  }
  return completeChallenge(challenge.id, challenge.points, challenge.durationSec || 0);
}
