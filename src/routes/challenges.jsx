import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useRef, useState } from "react";
import {
  CHALLENGES,
  CHALLENGE_CATEGORIES,
  formatDuration,
  getChallenge,
} from "@/lib/challenges";
import {
  cancelDetoxChallenge,
  completeChallenge,
  finishExpiredDetox,
  isChallengeDoneToday,
  pauseDetoxChallenge,
  recordDetoxViolation,
  resumeDetoxChallenge,
  startDetoxChallenge,
  useStore,
} from "@/lib/store";
import { getDetoxProgress, getDetoxRemaining, MAX_DETOX_VIOLATIONS } from "@/lib/detox-strict";
import { usePageVisibility } from "@/lib/fullscreen";
import { Check, Clock, Play, ShieldAlert, Star, X } from "lucide-react";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Retos — Modo Enfoque" },
      { name: "description", content: "Retos de desconexión digital y actividades sin pantalla." },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const [store, update] = useStore();
  const [category, setCategory] = useState("all");
  const [confirmId, setConfirmId] = useState(null);
  const [confirmReady, setConfirmReady] = useState(false);
  const [confirmLeft, setConfirmLeft] = useState(0);
  const [toast, setToast] = useState(null);
  const [failMsg, setFailMsg] = useState(null);
  const [now, setNow] = useState(Date.now());
  const pageVisible = usePageVisibility();
  const prevVisible = useRef(pageVisible);

  const active = store.activeDetox ? getChallenge(store.activeDetox.challengeId) : null;
  const remaining = getDetoxRemaining(store.activeDetox, now);
  const paused = !!store.activeDetox?.paused;
  const violations = store.activeDetox?.violations ?? 0;

  useEffect(() => {
    const result = finishExpiredDetox();
    if (result?.ok) {
      setToast(`¡Reto completado! +${result.points} pts`);
      update({});
    }
  }, [now, update]);

  useEffect(() => {
    if (!store.activeDetox || paused) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [store.activeDetox, paused]);

  useEffect(() => {
    const wasVisible = prevVisible.current;
    prevVisible.current = pageVisible;
    if (pageVisible || wasVisible || !store.activeDetox || store.activeDetox.paused) return;

    const result = recordDetoxViolation();
    update({});
    if (result.failed) {
      setFailMsg("Reto fallido: saliste de la app demasiadas veces.");
    } else {
      setToast(`Reto pausado (${result.violations}/${MAX_DETOX_VIOLATIONS} avisos)`);
    }
  }, [pageVisible, store.activeDetox, update]);

  useEffect(() => {
    if (!toast && !failMsg) return;
    const id = setTimeout(() => {
      setToast(null);
      setFailMsg(null);
    }, 4000);
    return () => clearTimeout(id);
  }, [toast, failMsg]);

  useEffect(() => {
    if (!confirmId) {
      setConfirmReady(false);
      setConfirmLeft(0);
      return;
    }
    const c = getChallenge(confirmId);
    const wait = c?.confirmSec ?? 8;
    setConfirmReady(false);
    setConfirmLeft(wait);
    const id = setInterval(() => {
      setConfirmLeft((n) => {
        if (n <= 1) {
          setConfirmReady(true);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [confirmId]);

  const filtered = category === "all" ? CHALLENGES : CHALLENGES.filter((c) => c.category === category);
  const completedToday = CHALLENGES.filter((c) => isChallengeDoneToday(c.id, store)).length;

  const startTimer = (c) => {
    if (!c.durationSec || isChallengeDoneToday(c.id, store)) return;
    startDetoxChallenge(c.id, c.durationSec);
    update({});
  };

  const confirmInstant = (c) => {
    if (!confirmReady) return;
    const result = completeChallenge(c.id, c.points, c.durationSec || 0);
    if (result.ok) {
      setToast(`¡Reto completado! +${result.points} pts`);
      update({});
    }
    setConfirmId(null);
  };

  const cancelActive = () => {
    cancelDetoxChallenge();
    update({});
    setToast("Reto cancelado — sin puntos.");
  };

  const resumeActive = () => {
    resumeDetoxChallenge();
    update({});
    setNow(Date.now());
  };

  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  const progress = active?.durationSec ? getDetoxProgress(store.activeDetox, active.durationSec, now) : 0;

  return (
    <Shell>
      <header className="mb-4 sm:mb-6">
        <p className="page-subtitle">Retos</p>
        <h1 className="page-title mt-1">Aléjate de la tecnología.</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Modo estricto: el temporizador se pausa si cambias de pestaña. Tres avisos y el reto se cancela.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2 sm:mb-5">
        <span className="glass flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:px-4">
          <Check className="h-3.5 w-3.5 text-primary" />
          {completedToday} / {CHALLENGES.length} hoy
        </span>
        <span className="glass flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:px-4">
          <Star className="h-3.5 w-3.5 text-primary" />
          {store.points} pts
        </span>
        <span className="glass flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:px-4">
          <ShieldAlert className="h-3.5 w-3.5 text-primary" />
          Estricto
        </span>
      </div>

      {toast && (
        <div className="mb-4 rounded-2xl bg-mint/70 px-4 py-3 text-sm font-medium sm:rounded-3xl">{toast}</div>
      )}
      {failMsg && (
        <div className="mb-4 rounded-2xl bg-destructive/15 px-4 py-3 text-sm font-medium text-destructive sm:rounded-3xl">
          {failMsg}
        </div>
      )}

      {active && store.activeDetox && (remaining > 0 || paused) && (
        <section className="glass mb-5 rounded-2xl p-4 sm:mb-6 sm:rounded-3xl sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">
                {paused ? "Reto pausado" : "Reto en curso"}
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl">{active.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{active.tip}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Avisos: {violations}/{MAX_DETOX_VIOLATIONS}
              </p>
            </div>
            <button
              type="button"
              onClick={cancelActive}
              aria-label="Cancelar reto"
              className="touch-target shrink-0 rounded-full bg-white/70 p-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex flex-col items-center sm:mt-6">
            <div className="relative grid aspect-square w-full max-w-[12rem] place-items-center sm:max-w-[14rem]">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="oklch(0.72 0.13 25)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
                />
              </svg>
              <div className="text-center">
                <div className="font-display text-5xl tabular-nums sm:text-6xl">
                  {mm}:{ss}
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
                  {paused ? "Vuelve aquí" : "Deja el celular"}
                </p>
              </div>
            </div>

            {paused ? (
              <div className="mt-4 flex flex-col items-center gap-3">
                <p className="max-w-sm text-center text-xs text-muted-foreground sm:text-sm">
                  Saliste de la app o cambiaste de pestaña. Mantén esta pantalla visible para completar el reto.
                </p>
                <button
                  type="button"
                  onClick={resumeActive}
                  className="min-h-11 rounded-full bg-foreground px-6 py-2.5 text-sm text-background"
                >
                  Continuar reto
                </button>
              </div>
            ) : (
              <p className="mt-4 max-w-sm text-center text-xs text-muted-foreground sm:text-sm">
                Pon el teléfono boca abajo y no cambies de pestaña. El tiempo solo avanza mientras estés aquí.
              </p>
            )}
          </div>
        </section>
      )}

      <div className="stat-scroll mb-4 sm:mb-5">
        {CHALLENGE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 rounded-full px-3 py-2 text-xs sm:px-4 sm:text-sm ${
              category === cat.id ? "bg-foreground text-background" : "bg-white/70"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <ChallengeCard
            key={c.id}
            challenge={c}
            done={isChallengeDoneToday(c.id, store)}
            active={store.activeDetox?.challengeId === c.id}
            disabled={!!store.activeDetox && store.activeDetox.challengeId !== c.id}
            onStart={() => startTimer(c)}
            onConfirm={() => setConfirmId(c.id)}
          />
        ))}
      </div>

      {confirmId &&
        (() => {
          const c = getChallenge(confirmId);
          if (!c) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-3 backdrop-blur-sm sm:items-center">
              <div className="glass w-full max-w-md rounded-2xl p-5 sm:rounded-3xl sm:p-6">
                <h3 className="font-display text-xl">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                <p className="mt-3 text-sm">
                  Confirma solo si lo completaste de verdad. Espera unos segundos antes de marcar.
                </p>
                {!confirmReady && (
                  <p className="mt-3 rounded-xl bg-white/60 px-3 py-2 text-center text-sm tabular-nums">
                    Podrás confirmar en {confirmLeft}s…
                  </p>
                )}
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="min-h-11 flex-1 rounded-full bg-white/70 px-4 py-2 text-sm"
                  >
                    Aún no
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmInstant(c)}
                    disabled={!confirmReady}
                    className={`min-h-11 flex-1 rounded-full px-4 py-2 text-sm ${
                      confirmReady
                        ? "bg-foreground text-background"
                        : "cursor-not-allowed bg-border text-muted-foreground"
                    }`}
                  >
                    Sí, completado
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </Shell>
  );
}

function ChallengeCard({ challenge: c, done, active, disabled, onStart, onConfirm }) {
  const Icon = c.icon;
  const isTimer = c.durationSec !== null;

  return (
    <div className={`glass relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5 ${done ? "opacity-70" : ""}`}>
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-sky/50 blur-xl" />
      <div className="flex items-start gap-3">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl ${
            done ? "bg-mint" : "bg-white/80"
          }`}
        >
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base leading-snug sm:text-lg">{c.name}</h3>
          <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{c.desc}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 rounded-full bg-peach/50 px-2.5 py-1 text-[10px] font-semibold sm:text-xs">
          <Star className="h-3 w-3" />
          {c.points} pts
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 text-[10px] sm:text-xs">
          <Clock className="h-3 w-3" />
          {formatDuration(c.durationSec)}
        </span>
        {isTimer && (
          <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-medium text-primary sm:text-xs">
            Estricto
          </span>
        )}
      </div>

      <div className="mt-4">
        {done ? (
          <span className="flex items-center justify-center gap-1 rounded-full bg-mint px-4 py-2.5 text-xs font-medium sm:text-sm">
            <Check className="h-3.5 w-3.5" />
            Completado hoy
          </span>
        ) : active ? (
          <span className="block rounded-full bg-primary/20 px-4 py-2.5 text-center text-xs font-medium text-primary sm:text-sm">
            En progreso…
          </span>
        ) : (
          <button
            type="button"
            onClick={isTimer ? onStart : onConfirm}
            disabled={disabled}
            className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm ${
              disabled ? "cursor-not-allowed bg-border text-muted-foreground" : "bg-foreground text-background"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            {isTimer ? "Iniciar reto" : "Marcar completado"}
          </button>
        )}
      </div>
    </div>
  );
}
