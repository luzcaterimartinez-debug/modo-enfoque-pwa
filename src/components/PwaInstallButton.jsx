import { Download, Share, X } from "lucide-react";
import { useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { usePwaInstall } from "@/hooks/use-pwa-install";

export function PwaInstallButton({ variant = "primary", className = "" }) {
  const hydrated = useHydrated();
  const { showInstall, isIos, promptInstall } = usePwaInstall();
  const [iosHelp, setIosHelp] = useState(false);

  if (!hydrated || !showInstall) return null;

  const onClick = async () => {
    if (isIos) {
      setIosHelp(true);
      return;
    }
    await promptInstall();
  };

  const base =
    variant === "sidebar"
      ? "flex w-full min-h-11 items-center justify-center gap-2 rounded-2xl bg-primary/15 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/25"
      : "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-medium text-foreground shadow-sm transition active:scale-[0.98] sm:w-auto sm:hover:bg-primary/20";

  return (
    <>
      <button type="button" onClick={onClick} className={`${base} ${className}`.trim()}>
        <Download className="h-4 w-4" />
        Descargar app
      </button>

      {iosHelp && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-foreground/30 p-3 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-ios-title"
        >
          <div className="glass w-full max-w-md rounded-2xl p-5 sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="pwa-ios-title" className="font-display text-xl">
                  Instalar en iPhone
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Abre el menú <b>Compartir</b>{" "}
                  <Share className="inline h-4 w-4 align-text-bottom" /> en Safari y elige{" "}
                  <b>Añadir a pantalla de inicio</b>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIosHelp(false)}
                aria-label="Cerrar"
                className="touch-target shrink-0 rounded-full bg-white/70 p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIosHelp(false)}
              className="mt-5 min-h-11 w-full rounded-full bg-foreground px-4 py-2 text-sm text-background"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
