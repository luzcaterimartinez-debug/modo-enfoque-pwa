const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime";import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Timer, ShieldOff, BarChart3, Gift, ArrowRight, Sparkles, Flame, Target, } from "lucide-react";
import { getDailyChallenge } from "@/lib/challenges";
import { useStore } from "@/lib/store";
import {
  getTodayMinutes,
  getMinutesDelta,
  isDailyChallengeBonusAvailable,
} from "@/lib/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Modo Enfoque — Dashboard" },
      { name: "description", content: "Controla el uso del celular y mejora tu concentración con Modo Enfoque." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [store] = useStore();
  const daily = getDailyChallenge();
  const minutesToday = getTodayMinutes(store);
  const dailyDone = !isDailyChallengeBonusAvailable(store, daily.id);

  return (
    _jsxDEV(Shell, { children: [
      _jsxDEV('header', { className: "mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between"        , children: [
        _jsxDEV('div', { className: "min-w-0", children: [
          _jsxDEV('p', { className: "page-subtitle", children: "Hola, estudiante" }, void 0, false, {fileName: _jsxFileName, lineNumber: 25}, this)
          , _jsxDEV('h1', { className: "page-title mt-2" , children: "Hoy es un buen día para enfocarse."      }, void 0, false, {fileName: _jsxFileName, lineNumber: 26}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 24}, this)
        , _jsxDEV(Link, { to: "/timer", className: "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-background shadow-xl transition-transform active:scale-[0.98] sm:w-auto sm:py-3 sm:hover:scale-105"                , children: ["Iniciar sesión "
            , _jsxDEV(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1"   ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 29}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 28}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 23}, this)

      , _jsxDEV('section', { className: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"    , children: [
        _jsxDEV(StatCard, { label: "Minutos hoy" , value: String(minutesToday), sub: getMinutesDelta(store)  , color: "var(--peach)",}, void 0, false, {fileName: _jsxFileName, lineNumber: 34}, this )
        , _jsxDEV(StatCard, { label: "Racha", value: store.streak > 0 ? `${store.streak}d` : "0d", sub: store.streak > 0 ? "Sigue así" : "Empieza hoy" , subIcon: store.streak > 0 ? Flame : undefined, color: "var(--mint)",}, void 0, false, {fileName: _jsxFileName, lineNumber: 35}, this )
        , _jsxDEV(StatCard, { label: "Puntos", value: String(store.points), sub: "Canjea en recompensas"  , color: "var(--lilac)",}, void 0, false, {fileName: _jsxFileName, lineNumber: 36}, this )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 33}, this)

      , _jsxDEV('section', { className: "mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2"     , children: [
        _jsxDEV(Link, { to: "/timer", className: "group relative overflow-hidden rounded-3xl bg-foreground p-5 text-background sm:p-8"       , children: [
          _jsxDEV('div', { className: "absolute -right-10 -top-10 h-48 w-48 rounded-full bg-peach/40 blur-2xl"       ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 41}, this )
          , _jsxDEV(Timer, { className: "h-7 w-7 sm:h-8 sm:w-8"   ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 42}, this )
          , _jsxDEV('h2', { className: "mt-4 font-display text-2xl sm:mt-6 sm:text-3xl"    , children: "Pantalla de Enfoque"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 43}, this)
          , _jsxDEV('p', { className: "mt-2 max-w-sm text-sm text-background/70"   , children: "Pomodoro con minijuegos para mantener tu mente activa entre bloques."         }, void 0, false, {fileName: _jsxFileName, lineNumber: 44}, this)
          , _jsxDEV('span', { className: "mt-5 inline-flex items-center gap-2 text-sm sm:mt-6"     , children: ["Entrar " , _jsxDEV(ArrowRight, { className: "h-4 w-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 45}, this )]}, void 0, true, {fileName: _jsxFileName, lineNumber: 45}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 40}, this)

        , _jsxDEV('div', { className: "grid gap-3 sm:gap-4"  , children: [
          _jsxDEV(ActionCard, { to: "/challenges", icon: Target, title: "Retos de desconexión"  , desc: "Aléjate del celular y gana puntos."     , bg: "var(--peach)",}, void 0, false, {fileName: _jsxFileName, lineNumber: 49}, this )
          , _jsxDEV(ActionCard, { to: "/blocker", icon: ShieldOff, title: "Configurar bloqueo" , desc: "Elige qué apps silenciar."   , bg: "var(--sky)",}, void 0, false, {fileName: _jsxFileName, lineNumber: 50}, this )
          , _jsxDEV(ActionCard, { to: "/stats", icon: BarChart3, title: "Ver impacto" , desc: "Gráficas semanales." , bg: "var(--mint)",}, void 0, false, {fileName: _jsxFileName, lineNumber: 51}, this )
          , _jsxDEV(ActionCard, { to: "/rewards", icon: Gift, title: "Recompensas", desc: "Canjea tus puntos."  , bg: "var(--butter)",}, void 0, false, {fileName: _jsxFileName, lineNumber: 52}, this )
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 48}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 39}, this)

      , _jsxDEV(Link, { to: "/challenges", className: "glass mt-5 flex items-start gap-3 rounded-3xl p-4 transition active:scale-[0.99] sm:mt-6 sm:items-center sm:gap-4 sm:p-6 sm:hover:bg-white/80"             , children: [
        _jsxDEV(Sparkles, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary sm:mt-0 sm:h-6 sm:w-6"       ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 57}, this )
        , _jsxDEV('div', { className: "min-w-0 flex-1 text-sm text-foreground/80"   , children: [
          _jsxDEV('span', { className: "font-semibold", children: dailyDone ? "Reto del día completado" : "Reto del día:"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 59}, this), dailyDone ? "" : ` ${daily.name} — ${daily.desc} `
          , !dailyDone && _jsxDEV('span', { className: "font-semibold text-primary" , children: ["+", daily.points, " pts (+25 bonus)"]}, void 0, true, {fileName: _jsxFileName, lineNumber: 60}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 58}, this)
        , _jsxDEV(ArrowRight, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground sm:mt-0"     ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 62}, this )
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 56}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 22}, this)
  );
}

function StatCard({ label, value, sub, subIcon: SubIcon, color }) {
  return (
    _jsxDEV('div', { className: "relative overflow-hidden rounded-2xl bg-card p-4 shadow-sm sm:rounded-3xl sm:p-6"       , children: [
      _jsxDEV('div', { className: "absolute -right-6 -top-6 h-20 w-20 rounded-full sm:h-24 sm:w-24"       , style: { background: color, opacity: 0.6 },}, void 0, false, {fileName: _jsxFileName, lineNumber: 71}, this )
      , _jsxDEV('p', { className: "text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs"    , children: label}, void 0, false, {fileName: _jsxFileName, lineNumber: 72}, this)
      , _jsxDEV('p', { className: "mt-1.5 font-display text-3xl sm:mt-2 sm:text-5xl"    , children: value}, void 0, false, {fileName: _jsxFileName, lineNumber: 73}, this)
      , _jsxDEV('p', { className: "mt-1 flex items-center gap-1 text-[10px] text-muted-foreground sm:text-xs"      , children: [
        SubIcon && _jsxDEV(SubIcon, { className: "h-3 w-3 text-primary"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 75}, this )
        , sub
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 74}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 70}, this)
  );
}

function ActionCard({ to, icon: Icon, title, desc, bg }) {
  return (
    _jsxDEV(Link, { to: to, className: "group flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm transition-all active:scale-[0.99] sm:gap-4 sm:rounded-3xl sm:p-5 sm:hover:-translate-y-0.5 sm:hover:shadow-lg"              , children: [
      _jsxDEV('div', { className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl"        , style: { background: bg }, children: 
        _jsxDEV(Icon, { className: "h-5 w-5 text-foreground sm:h-6 sm:w-6"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 86}, this )
      }, void 0, false, {fileName: _jsxFileName, lineNumber: 85}, this)
      , _jsxDEV('div', { className: "min-w-0 flex-1" , children: [
        _jsxDEV('div', { className: "text-sm font-semibold sm:text-base"  , children: title}, void 0, false, {fileName: _jsxFileName, lineNumber: 89}, this)
        , _jsxDEV('div', { className: "text-[11px] text-muted-foreground sm:text-xs"  , children: desc}, void 0, false, {fileName: _jsxFileName, lineNumber: 90}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 88}, this)
      , _jsxDEV(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"     ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 92}, this )
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 84}, this)
  );
}
