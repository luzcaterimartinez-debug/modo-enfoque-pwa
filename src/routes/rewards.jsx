const _jsxFileName = "";import {jsxDEV as _jsxDEV, Fragment as _Fragment} from "react/jsx-dev-runtime";import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import {
  Gift,
  Lock,
  Check,
  Flame,
  Smartphone,
  Film,
  Coffee,
  BookOpen,
  Palmtree,
  Calculator,
  Flower2,
  Star,
  Gem,

} from "lucide-react";
import { STREAK_MEDALS, useStore } from "@/lib/store";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Recompensas — Modo Enfoque" },
      { name: "description", content: "Canjea tus puntos y desbloquea medallas por racha." },
    ],
  }),
  component: RewardsPage,
});


const REWARDS = [
  { name: "30 min de redes", cost: 50, icon: Smartphone, desc: "Tiempo libre merecido." },
  { name: "Un episodio de tu serie", cost: 100, icon: Film, desc: "Disfruta sin culpa." },
  { name: "Salida con amigos", cost: 250, icon: Coffee, desc: "Recompensa social." },
  { name: "Compra un libro", cost: 400, icon: BookOpen, desc: "Sigue creciendo." },
  { name: "Día libre de estudio", cost: 600, icon: Palmtree, desc: "Descansa la mente." },
  { name: "Regalo personal", cost: 1000, icon: Gift, desc: "Tu gran meta." },
];

const ACHIEVEMENTS = [
  { name: "Maestro del cálculo", desc: "100 puntos en Math", icon: Calculator, check: (s) => s.points >= 100 },
  { name: "Mente sin redes", desc: "1 día sin abrir Instagram", icon: Flower2, check: () => false },
  { name: "Estudiante estrella", desc: "30 bloques completados", icon: Star, check: (s) => s.blocks >= 30 },
  { name: "Coleccionista", desc: "1000 puntos totales", icon: Gem, check: (s) => s.points >= 1000 },
];

function RewardsPage() {
  const [store, update] = useStore();

  const claim = (r) => {
    if (store.points >= r.cost && !store.claimed.includes(r.name)) {
      update((s) => ({ points: s.points - r.cost, claimed: [...s.claimed, r.name] }));
    }
  };

  return (
    _jsxDEV(Shell, { children: [
      _jsxDEV('header', { className: "mb-4 space-y-3 sm:mb-6 sm:space-y-0 sm:flex sm:flex-wrap sm:items-end sm:justify-between sm:gap-4"        , children: [
        _jsxDEV('div', { className: "min-w-0", children: [
          _jsxDEV('p', { className: "page-subtitle", children: "Recompensas"}, void 0, false, {fileName: _jsxFileName, lineNumber: 61}, this)
          , _jsxDEV('h1', { className: "page-title mt-1" , children: "Celebra cada logro."  }, void 0, false, {fileName: _jsxFileName, lineNumber: 62}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 60}, this)
        , _jsxDEV('div', { className: "stat-scroll sm:flex sm:flex-wrap sm:gap-3"   , children: [
          _jsxDEV('div', { className: "glass flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 sm:px-5 sm:py-3"         , children: [
            _jsxDEV(Flame, { className: "h-4 w-4 text-primary sm:h-5 sm:w-5"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 66}, this )
            , _jsxDEV('span', { className: "font-display text-xl sm:text-2xl"  , children: store.streak}, void 0, false, {fileName: _jsxFileName, lineNumber: 67}, this)
            , _jsxDEV('span', { className: "text-[10px] text-muted-foreground sm:text-xs"  , children: "racha"}, void 0, false, {fileName: _jsxFileName, lineNumber: 68}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 65}, this)
          , _jsxDEV('div', { className: "glass flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 sm:px-5 sm:py-3"         , children: [
            _jsxDEV(Gift, { className: "h-4 w-4 text-primary sm:h-5 sm:w-5"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 71}, this )
            , _jsxDEV('span', { className: "font-display text-xl sm:text-2xl"  , children: store.points}, void 0, false, {fileName: _jsxFileName, lineNumber: 72}, this)
            , _jsxDEV('span', { className: "text-[10px] text-muted-foreground sm:text-xs"  , children: "puntos"}, void 0, false, {fileName: _jsxFileName, lineNumber: 73}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 70}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 64}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 59}, this)

      , _jsxDEV('section', { className: "mb-5 sm:mb-6" , children: [
        _jsxDEV('h2', { className: "mb-3 font-display text-xl sm:text-2xl"   , children: "Medallas por racha"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 79}, this)
        , _jsxDEV('div', { className: "grid gap-3 sm:grid-cols-3"  , children: 
          STREAK_MEDALS.map((m) => {
            const unlocked = store.streak >= m.threshold;
            const progress = Math.min(100, (store.streak / m.threshold) * 100);
            const MedalIcon = m.icon;
            return (
              _jsxDEV('div', { className: `relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5 ${unlocked ? "glass" : "bg-white/30"}`, children: [
                _jsxDEV('div', { className: "flex items-center gap-3"  , children: [
                  _jsxDEV('div', { className: `grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${unlocked ? "bg-peach" : "bg-border/50 grayscale"}`, children: 
                    _jsxDEV(MedalIcon, { className: "h-6 w-6 text-foreground sm:h-7 sm:w-7"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 89}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 88}, this)
                  , _jsxDEV('div', { className: "min-w-0 flex-1" , children: [
                    _jsxDEV('div', { className: "flex items-center gap-2 font-display text-base sm:text-lg"     , children: [
                      m.name
                      , unlocked ? _jsxDEV(Check, { className: "h-4 w-4 text-primary"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 94}, this ) : _jsxDEV(Lock, { className: "h-3 w-3 text-muted-foreground"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 94}, this )
                    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 92}, this)
                    , _jsxDEV('div', { className: "text-xs text-muted-foreground" , children: m.desc}, void 0, false, {fileName: _jsxFileName, lineNumber: 96}, this)
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 91}, this)
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 87}, this)
                , _jsxDEV('div', { className: "mt-3 h-2 overflow-hidden rounded-full bg-white/60"    , children: 
                  _jsxDEV('div', { className: "h-full bg-gradient-to-r from-peach to-primary"   , style: { width: `${progress}%` },}, void 0, false, {fileName: _jsxFileName, lineNumber: 100}, this )
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 99}, this)
                , _jsxDEV('div', { className: "mt-1 text-right text-[10px] text-muted-foreground"   , children: [
                  Math.min(store.streak, m.threshold), " / "  , m.threshold, " bloques"
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 102}, this)
              ]}, m.name, true, {fileName: _jsxFileName, lineNumber: 86}, this)
            );
          })
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 80}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 78}, this)

      , _jsxDEV('section', { className: "mb-5 sm:mb-6" , children: [
        _jsxDEV('h2', { className: "mb-3 font-display text-xl sm:text-2xl"   , children: "Canjea tus puntos"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 112}, this)
        , _jsxDEV('div', { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"   , children: 
          REWARDS.map((r) => {
            const can = store.points >= r.cost;
            const got = store.claimed.includes(r.name);
            const RewardIcon = r.icon;
            return (
              _jsxDEV('div', { className: "glass relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5"      , children: [
                _jsxDEV('div', { className: "absolute -right-6 -top-6 h-20 w-20 rounded-full bg-butter/60 blur-xl"       ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 120}, this )
                , _jsxDEV(RewardIcon, { className: "h-8 w-8 text-primary sm:h-9 sm:w-9"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 121}, this )
                , _jsxDEV('h3', { className: "mt-2 font-display text-base sm:mt-3 sm:text-lg"    , children: r.name}, void 0, false, {fileName: _jsxFileName, lineNumber: 122}, this)
                , _jsxDEV('p', { className: "text-[11px] text-muted-foreground sm:text-xs"  , children: r.desc}, void 0, false, {fileName: _jsxFileName, lineNumber: 123}, this)
                , _jsxDEV('div', { className: "mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-4"      , children: [
                  _jsxDEV('span', { className: "rounded-full bg-peach/60 px-3 py-1 text-[11px] font-semibold sm:text-xs"      , children: [r.cost, " pts" ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 125}, this)
                  , _jsxDEV('button', {
                    onClick: () => claim(r),
                    disabled: !can || got,
                    className: `flex min-h-9 items-center gap-1 rounded-full px-3 py-2 text-[11px] sm:px-4 sm:text-xs ${
                      got ? "bg-mint text-foreground" :
                      can ? "bg-foreground text-background hover:scale-105" :
                      "bg-border text-muted-foreground cursor-not-allowed"
                    }`,
 children: 
                    got ? (
                      _jsxDEV(_Fragment, { children: [
                        _jsxDEV(Check, { className: "h-3 w-3" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 137}, this ), "Canjeado"

                      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 136}, this)
                    ) : can ? "Canjear" : "Faltan puntos"
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 126}, this)
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 124}, this)
              ]}, r.name, true, {fileName: _jsxFileName, lineNumber: 119}, this)
            );
          })
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 113}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 111}, this)

      , _jsxDEV('section', { children: [
        _jsxDEV('h2', { className: "mb-3 font-display text-xl sm:text-2xl"   , children: "Insignias"}, void 0, false, {fileName: _jsxFileName, lineNumber: 150}, this)
        , _jsxDEV('div', { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"   , children: 
          ACHIEVEMENTS.map((a) => {
            const unlocked = a.check(store);
            const BadgeIcon = a.icon;
            return (
              _jsxDEV('div', { className: `flex items-center gap-3 rounded-2xl p-3 sm:gap-4 sm:rounded-3xl sm:p-4 ${unlocked ? "glass" : "bg-white/30"}`, children: [
                _jsxDEV('div', { className: `grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${unlocked ? "bg-butter" : "bg-border/50 grayscale"}`, children: 
                  _jsxDEV(BadgeIcon, { className: "h-5 w-5 text-foreground sm:h-6 sm:w-6"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 158}, this )
                }, void 0, false, {fileName: _jsxFileName, lineNumber: 157}, this)
                , _jsxDEV('div', { className: "min-w-0 flex-1" , children: [
                  _jsxDEV('div', { className: "flex items-center gap-2 text-sm font-semibold sm:text-base"     , children: [
                    a.name
                    , unlocked ? _jsxDEV(Check, { className: "h-3 w-3 text-primary"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 163}, this ) : _jsxDEV(Lock, { className: "h-3 w-3 text-muted-foreground"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 163}, this )
                  ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 161}, this)
                  , _jsxDEV('div', { className: "text-xs text-muted-foreground" , children: a.desc}, void 0, false, {fileName: _jsxFileName, lineNumber: 165}, this)
                ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 160}, this)
              ]}, a.name, true, {fileName: _jsxFileName, lineNumber: 156}, this)
            );
          })
        }, void 0, false, {fileName: _jsxFileName, lineNumber: 151}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 149}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 58}, this)
  );
}
