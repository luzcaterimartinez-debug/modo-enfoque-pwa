import { useBlocker, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { ShieldAlert } from "lucide-react";

export function DetoxRouteGuard() {
  const [store] = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const active = !!store.activeDetox;

  useEffect(() => {
    if (active && pathname !== "/challenges") {
      navigate({ to: "/challenges", replace: true });
    }
  }, [active, pathname, navigate]);

  const blocker = useBlocker({
    shouldBlockFn: ({ next }) => active && next.pathname !== "/challenges",
    withResolver: true,
  });

  useEffect(() => {
    if (blocker.status === "blocked") setOpen(true);
  }, [blocker.status]);

  const dismiss = () => {
    setOpen(false);
    if (blocker.status === "blocked") blocker.reset();
  };

  if (!open || blocker.status !== "blocked") return null;

  return (
    <div className="focus-mode__dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="detox-block-title">
      <div className="glass w-full max-w-sm rounded-2xl p-5 sm:rounded-3xl">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15">
            <ShieldAlert className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 id="detox-block-title" className="font-display text-xl">
              Reto en curso
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tienes un reto activo. Termínalo o cancélalo antes de ir a otra sección.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="mt-5 min-h-11 w-full rounded-full bg-foreground px-4 py-2 text-sm text-background"
        >
          Seguir con el reto
        </button>
      </div>
    </div>
  );
}

export function notifyDetoxNavBlocked() {
  window.dispatchEvent(new CustomEvent("detox-nav-blocked"));
}
