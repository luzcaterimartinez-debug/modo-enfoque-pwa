import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Calculator,
  Type,
  Wind,
  Flame,
  Star,
  Gamepad2,
  Maximize2,
  Minimize2,
  AlertTriangle,
} from "lucide-react";
import { MemoryGame } from "@/games/MemoryGame";
import { MathGame } from "@/games/MathGame";
import { WordGame } from "@/games/WordGame";
import { BreathGame } from "@/games/BreathGame";
import { completeBlock, useStore } from "@/lib/store";
import { enterFullscreen, exitFullscreen, useFullscreen, usePageVisibility } from "@/lib/fullscreen";

export const Route = createFileRoute("/timer")({
  head: () => ({
    meta: [
      { title: "Enfoque — Modo Enfoque" },
      { name: "description", content: "Temporizador con minijuegos para estudiar mejor." },
    ],
  }),
  component: TimerPage,
});

const PRESETS = [15, 25, 45];
const GAMES = [
  { id: "memory", label: "Memoria", icon: Brain, comp: MemoryGame },
  { id: "math", label: "Cálculo", icon: Calculator, comp: MathGame },
  { id: "word", label: "Palabras", icon: Type, comp: WordGame },
  { id: "breath", label: "Respiración", icon: Wind, comp: BreathGame },
];

function TimerPage() {
  const [minutes, setMinutes] = useState(25);
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [game, setGame] = useState("memory");
  const [reward, setReward] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [exitConfirm, setExitConfirm] = useState(false);
  const [tabPaused, setTabPaused] = useState(false);
  const [store] = useStore();
  const focusRef = useRef(null);
  const { active: fsActive, enter: enterFs, exit: exitFs } = useFullscreen(focusRef);
  const pageVisible = usePageVisibility();

  const sessionActive = focusMode && gamesOpen;
  const Game = GAMES.find((g) => g.id === game)?.comp;

  useEffect(() => {
    if (!running) setSecs(minutes * 60);
  }, [minutes, running]);

  useEffect(() => {
    if (!running || tabPaused) return;
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running, tabPaused]);

  useEffect(() => {
    if (secs === 0 && running) {
      setRunning(false);
      setGamesOpen(false);
      setFocusMode(false);
      setTabPaused(false);
      exitFullscreen();
      const r = completeBlock(minutes);
      setReward(r);
    }
  }, [secs, running, minutes]);

  useEffect(() => {
    if (!sessionActive || !running || pageVisible) return;
    setRunning(false);
    setTabPaused(true);
  }, [pageVisible, sessionActive, running]);

  const leaveFocus = async () => {
    setRunning(false);
    setTabPaused(false);
    setFocusMode(false);
    setGamesOpen(false);
    setExitConfirm(false);
    await exitFs();
    await exitFullscreen();
  };

  const start = async () => {
    setRunning(true);
    setGamesOpen(true);
    setFocusMode(true);
    setTabPaused(false);
    setExitConfirm(false);
    await enterFs();
  };

  const pause = () => setRunning(false);

  const resume = () => {
    setTabPaused(false);
    setRunning(true);
  };

  const reset = async () => {
    setRunning(false);
    setGamesOpen(false);
    setFocusMode(false);
    setTabPaused(false);
    setExitConfirm(false);
    setSecs(minutes * 60);
    await exitFs();
    await exitFullscreen();
  };

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const progress = 1 - secs / (minutes * 60 || 1);

  const timerBlock = (
    <div
      className={`glass relative flex w-full flex-col items-center justify-center rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-8 ${
        sessionActive ? "" : "mx-auto max-w-lg py-8 sm:py-12 md:py-16"
      }`}
    >
      {!sessionActive && (
        <div className="mb-2 text-center">
          <p className="page-subtitle">Pantalla de enfoque</p>
          <h1 className="mt-2 font-display text-2xl leading-tight sm:text-3xl md:text-4xl">
            Respira, concéntrate, avanza.
          </h1>
        </div>
      )}

      <div
        className={`mb-4 flex w-full justify-center gap-2 sm:mb-6 ${
          !running ? "" : "pointer-events-none opacity-60"
        }`}
      >
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setMinutes(p);
              setRunning(false);
              setGamesOpen(false);
              setFocusMode(false);
            }}
            className={`touch-target rounded-full px-3 py-2 text-xs sm:px-4 sm:text-sm ${
              minutes === p ? "bg-foreground text-background" : "bg-white/70"
            }`}
          >
            {p} min
          </button>
        ))}
      </div>

      <div
        className={`relative grid aspect-square w-full place-items-center ${
          sessionActive ? "max-w-[14rem] sm:max-w-[16rem]" : "max-w-[15rem] sm:max-w-xs md:max-w-sm"
        }`}
      >
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
            style={{ transition: "stroke-dashoffset 0.5s" }}
          />
        </svg>
        <div className="text-center">
          <div
            className={`font-display tabular-nums ${
              sessionActive ? "text-5xl sm:text-6xl md:text-7xl" : "text-6xl sm:text-7xl md:text-8xl"
            }`}
          >
            {mm}:{ss}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
            {tabPaused ? "Pausado (pestaña)" : running ? "Enfocando" : "En pausa"}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
        {tabPaused ? (
          <button
            type="button"
            onClick={resume}
            className="flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-lg sm:px-6"
          >
            <Play className="h-4 w-4" />
            Volver al enfoque
          </button>
        ) : (
          <button
            type="button"
            onClick={() => (running ? pause() : start())}
            className="flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background shadow-lg sm:px-6"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pausar" : "Iniciar"}
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="touch-target grid place-items-center rounded-full bg-white/80"
          aria-label="Reiniciar"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        {sessionActive && (
          <button
            type="button"
            onClick={() => (fsActive ? exitFs() : enterFs())}
            className="touch-target grid place-items-center rounded-full bg-white/80"
            aria-label={fsActive ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {fsActive ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        )}
      </div>

      {!sessionActive && (
        <div className="stat-scroll mt-6 w-full justify-center sm:mt-8">
          <span className="glass flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:px-4">
            <Flame className="h-3.5 w-3.5 text-primary" />
            Racha: <b>{store.streak}</b>
          </span>
          <span className="glass flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:px-4">
            <Star className="h-3.5 w-3.5 text-primary" />
            Puntos: <b>{store.points}</b>
          </span>
        </div>
      )}
    </div>
  );

  const gamesPanel = Game && (
    <div className="glass rounded-2xl p-4 sm:rounded-3xl sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
        <h2 className="font-display text-xl sm:text-2xl">Minijuegos de estudio</h2>
        <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs">
          {running && !tabPaused ? "Activos" : "En pausa"}
        </span>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:grid-cols-4">
        {GAMES.map((g) => {
          const Icon = g.icon;
          const active = g.id === game;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGame(g.id)}
              className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-[11px] sm:rounded-2xl sm:p-3 sm:text-xs ${
                active ? "bg-foreground text-background" : "bg-white/70 hover:bg-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {g.label}
            </button>
          );
        })}
      </div>
      <div className="rounded-xl bg-white/70 p-3 sm:rounded-2xl sm:p-4">
        <Game />
      </div>
    </div>
  );

  if (sessionActive) {
    return (
      <div ref={focusRef} className="focus-mode">
        <div className="focus-mode__blobs" aria-hidden="true">
          <div className="blob" style={{ width: 320, height: 320, top: -100, left: -80, background: "var(--peach)" }} />
          <div className="blob" style={{ width: 360, height: 360, bottom: -120, right: -100, background: "var(--lilac)" }} />
        </div>

        <header className="focus-mode__header">
          <div>
            <p className="page-subtitle">Modo enfoque</p>
            <h1 className="font-display text-lg sm:text-xl">Sin distracciones</h1>
          </div>
          <div className="stat-scroll max-w-[60vw] justify-end sm:max-w-none">
            <span className="glass flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] sm:text-xs">
              <Flame className="h-3.5 w-3.5 text-primary" />
              {store.streak}
            </span>
            <span className="glass flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] sm:text-xs">
              <Star className="h-3.5 w-3.5 text-primary" />
              {store.points}
            </span>
            <span className="glass flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] sm:text-xs">
              <Gamepad2 className="h-3.5 w-3.5 text-primary" />+{store.gameScore}
            </span>
          </div>
        </header>

        {tabPaused && (
          <div className="focus-mode__alert">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="text-sm">
              Cambiaste de pestaña. El temporizador se pausó — vuelve aquí para continuar.
            </p>
          </div>
        )}

        <div className="focus-mode__body">
          <div className="grid w-full max-w-6xl gap-4 sm:gap-6 lg:grid-cols-[1.1fr_1fr]">
            {timerBlock}
            {gamesPanel}
          </div>
        </div>

        <footer className="focus-mode__footer">
          <button
            type="button"
            onClick={() => setExitConfirm(true)}
            className="rounded-full bg-white/80 px-4 py-2 text-xs sm:text-sm"
          >
            Salir del modo enfoque
          </button>
        </footer>

        {exitConfirm && (
          <div className="focus-mode__dialog-backdrop">
            <div className="glass w-full max-w-sm rounded-2xl p-5 sm:rounded-3xl">
              <h3 className="font-display text-xl">¿Salir del enfoque?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Se pausará la sesión y volverás a la vista normal.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setExitConfirm(false)}
                  className="min-h-11 flex-1 rounded-full bg-white/70 px-4 py-2 text-sm"
                >
                  Seguir enfocando
                </button>
                <button
                  type="button"
                  onClick={leaveFocus}
                  className="min-h-11 flex-1 rounded-full bg-foreground px-4 py-2 text-sm text-background"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Shell>
      {reward && (
        <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-mint/60 p-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl">
          <div className="min-w-0">
            <b>¡Bloque completado!</b> Ganaste <b>+{reward.gained} pts</b> ({reward.blockPoints} del bloque ·{" "}
            {reward.gameBonus} de minijuegos) · Racha: {reward.streak}
          </div>
          <button
            type="button"
            onClick={() => setReward(null)}
            className="shrink-0 self-start rounded-full bg-foreground px-4 py-2 text-xs text-background sm:self-auto sm:px-3 sm:py-1"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="flex min-h-[50vh] items-center justify-center sm:min-h-[60vh]">{timerBlock}</div>

      <p className="mx-auto mt-4 max-w-md text-center text-xs text-muted-foreground sm:text-sm">
        Al iniciar entras en <b>modo enfoque a pantalla completa</b>. Si cambias de pestaña, el temporizador se pausa
        automáticamente.
      </p>
    </Shell>
  );
}
