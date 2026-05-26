import { useCallback, useEffect, useState } from "react";

export function isFullscreenActive() {
  if (typeof document === "undefined") return false;
  return !!document.fullscreenElement;
}

export async function enterFullscreen(el) {
  if (typeof document === "undefined" || !el) return false;
  try {
    if (document.fullscreenElement) return true;
    await el.requestFullscreen();
    return true;
  } catch {
    return false;
  }
}

export async function exitFullscreen() {
  if (typeof document === "undefined") return;
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {
    /* ignore */
  }
}

export function useFullscreen(ref) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const enter = useCallback(async () => {
    const ok = await enterFullscreen(ref.current);
    setActive(ok || isFullscreenActive());
    return ok;
  }, [ref]);

  const exit = useCallback(async () => {
    await exitFullscreen();
    setActive(false);
  }, []);

  return { active, enter, exit };
}

export function usePageVisibility() {
  const [visible, setVisible] = useState(
    typeof document === "undefined" ? true : !document.hidden,
  );

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}
