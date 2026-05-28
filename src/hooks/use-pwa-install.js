import { useCallback, useEffect, useState } from "react";

let deferredPrompt = null;

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const installed = isStandalone();
    setIsInstalled(installed);
    if (installed) return;

    setIsIos(isIosDevice());

    const onBeforeInstall = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setCanInstall(true);
    };

    const onInstalled = () => {
      deferredPrompt = null;
      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      deferredPrompt = null;
      setCanInstall(false);
      setIsInstalled(true);
      return true;
    }
    return false;
  }, []);

  const showInstall = !isInstalled && (canInstall || isIos);

  return { canInstall, isInstalled, isIos, showInstall, promptInstall };
}
