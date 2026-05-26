import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Timer, Target, ShieldOff, BarChart3, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { finishExpiredDetox, useStore } from "@/lib/store";
import { notifyDetoxNavBlocked } from "@/components/DetoxRouteGuard";

const nav = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/timer", label: "Enfoque", icon: Timer },
  { to: "/challenges", label: "Retos", icon: Target },
  { to: "/blocker", label: "Bloqueo", icon: ShieldOff },
  { to: "/stats", label: "Impacto", icon: BarChart3 },
  { to: "/rewards", label: "Premios", icon: Gift },
];

function NavItem({ item, active, locked, compact }) {
  const Icon = item.icon;
  const className = compact
    ? `flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition sm:flex-none sm:rounded-full sm:px-2 ${
        active ? "bg-foreground text-background" : locked ? "text-muted-foreground/40" : "text-muted-foreground"
      }`
    : `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
        active ? "bg-foreground text-background shadow-lg" : locked ? "opacity-40" : "hover:bg-white/60"
      }`;

  if (locked) {
    return (
      <button
        type="button"
        aria-label={`${item.label} (bloqueado — reto en curso)`}
        onClick={notifyDetoxNavBlocked}
        className={className}
      >
        <Icon className={compact ? "h-[18px] w-[18px] sm:h-4 sm:w-4" : "h-4 w-4"} />
        {compact ? <span className="text-[10px] font-medium leading-none sm:hidden">{item.label}</span> : item.label}
      </button>
    );
  }

  return (
    <Link to={item.to} aria-label={item.label} className={className}>
      <Icon className={compact ? "h-[18px] w-[18px] sm:h-4 sm:w-4" : "h-4 w-4"} />
      {compact ? <span className="text-[10px] font-medium leading-none sm:hidden">{item.label}</span> : item.label}
    </Link>
  );
}

export function Shell({ children }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [store] = useStore();
  const [navToast, setNavToast] = useState(false);
  const detoxActive = !!store.activeDetox;

  useEffect(() => {
    finishExpiredDetox();
    const id = setInterval(finishExpiredDetox, 5000);
    return () => clearInterval(id);
  }, [path]);

  useEffect(() => {
    const show = () => {
      setNavToast(true);
      window.setTimeout(() => setNavToast(false), 3200);
    };
    window.addEventListener("detox-nav-blocked", show);
    return () => window.removeEventListener("detox-nav-blocked", show);
  }, []);

  const isLocked = (to) => detoxActive && to !== "/challenges";

  return (
    <div className="relative min-h-screen min-h-dvh overflow-x-clip">
      <div
        className="blob hidden sm:block"
        style={{ width: 480, height: 480, top: -120, left: -120, background: "var(--peach)" }}
      />
      <div
        className="blob hidden sm:block"
        style={{ width: 520, height: 520, bottom: -160, right: -120, background: "var(--lilac)" }}
      />
      <div className="blob" style={{ width: 240, height: 240, top: -80, left: -60, background: "var(--peach)" }} />
      <div className="blob" style={{ width: 280, height: 280, bottom: 80, right: -80, background: "var(--lilac)" }} />

      {navToast && (
        <div className="fixed left-1/2 top-3 z-[150] w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl bg-butter/90 px-4 py-3 text-center text-sm shadow-lg backdrop-blur-sm sm:top-4">
          Reto en curso — quédate en <b>Retos</b> hasta terminar o cancelar.
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-screen min-h-dvh max-w-7xl flex-col gap-4 px-3 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] pt-3 sm:gap-6 sm:px-4 sm:pb-4 sm:pt-4 md:flex-row md:p-8 md:pb-8">
        <header className="flex items-center justify-between md:hidden">
          {isLocked("/") ? (
            <button type="button" onClick={notifyDetoxNavBlocked} className="flex items-center gap-2.5 opacity-60">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-lg text-primary-foreground">
                M
              </div>
              <div>
                <div className="font-display text-base leading-none">Modo Enfoque</div>
                <div className="text-[10px] text-muted-foreground">Reto activo</div>
              </div>
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-lg text-primary-foreground">
                M
              </div>
              <div>
                <div className="font-display text-base leading-none">Modo Enfoque</div>
                <div className="text-[10px] text-muted-foreground">Estudia con calma</div>
              </div>
            </Link>
          )}
        </header>

        <aside className="glass sticky top-8 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col rounded-3xl p-6 md:flex">
          {isLocked("/") ? (
            <button
              type="button"
              onClick={notifyDetoxNavBlocked}
              className="mb-10 flex items-center gap-2 opacity-60"
            >
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary font-display text-xl text-primary-foreground">
                M
              </div>
              <div>
                <div className="font-display text-xl leading-none">Modo Enfoque</div>
                <div className="text-xs text-muted-foreground">Reto activo</div>
              </div>
            </button>
          ) : (
            <Link to="/" className="mb-10 flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary font-display text-xl text-primary-foreground">
                M
              </div>
              <div>
                <div className="font-display text-xl leading-none">Modo Enfoque</div>
                <div className="text-xs text-muted-foreground">Estudia con calma</div>
              </div>
            </Link>
          )}

          <nav className="flex flex-col gap-1">
            {nav.map((n) => (
              <NavItem
                key={n.to}
                item={n}
                active={path === n.to}
                locked={isLocked(n.to)}
                compact={false}
              />
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-butter/60 p-4 text-xs text-foreground/70">
            {detoxActive ? "Reto en curso — navegación bloqueada." : '"La disciplina vale más que la motivación."'}
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>

        <nav
          className="glass fixed bottom-3 left-3 right-3 z-20 flex items-center justify-around rounded-2xl p-1.5 shadow-lg sm:bottom-4 sm:left-1/2 sm:right-auto sm:w-auto sm:-translate-x-1/2 sm:justify-center sm:gap-0.5 sm:rounded-full sm:p-2 md:hidden"
          style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
        >
          {nav.map((n) => (
            <NavItem key={n.to} item={n} active={path === n.to} locked={isLocked(n.to)} compact />
          ))}
        </nav>
      </div>
    </div>
  );
}
