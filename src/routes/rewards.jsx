import { createFileRoute } from "@tanstack/react-router";
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
    <Shell>
      <header className="mb-4 space-y-3 sm:mb-6 sm:flex sm:flex-wrap sm:items-end sm:justify-between sm:gap-4 sm:space-y-0">
        <div className="min-w-0">
          <p className="page-subtitle">Recompensas</p>
          <h1 className="page-title mt-1">Celebra cada logro.</h1>
        </div>
        <div className="stat-scroll sm:flex sm:flex-wrap sm:gap-3">
          <div className="glass flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 sm:px-5 sm:py-3">
            <Flame className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <span className="font-display text-xl sm:text-2xl">{store.streak}</span>
            <span className="text-[10px] text-muted-foreground sm:text-xs">racha</span>
          </div>
          <div className="glass flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 sm:px-5 sm:py-3">
            <Gift className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <span className="font-display text-xl sm:text-2xl">{store.points}</span>
            <span className="text-[10px] text-muted-foreground sm:text-xs">puntos</span>
          </div>
        </div>
      </header>

      <section className="mb-5 sm:mb-6">
        <h2 className="mb-3 font-display text-xl sm:text-2xl">Medallas por racha</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {STREAK_MEDALS.map((m) => {
            const unlocked = store.streak >= m.threshold;
            const progress = Math.min(100, (store.streak / m.threshold) * 100);
            const MedalIcon = m.icon;
            return (
              <div
                key={m.name}
                className={`relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5 ${unlocked ? "glass" : "bg-white/30"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${unlocked ? "bg-peach" : "bg-border/50 grayscale"}`}
                  >
                    <MedalIcon className="h-6 w-6 text-foreground sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-display text-base sm:text-lg">
                      {m.name}
                      {unlocked ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/60">
                  <div className="h-full bg-gradient-to-r from-peach to-primary" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-1 text-right text-[10px] text-muted-foreground">
                  {Math.min(store.streak, m.threshold)} / {m.threshold} bloques
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-5 sm:mb-6">
        <h2 className="mb-3 font-display text-xl sm:text-2xl">Canjea tus puntos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REWARDS.map((r) => {
            const can = store.points >= r.cost;
            const got = store.claimed.includes(r.name);
            const RewardIcon = r.icon;
            return (
              <div key={r.name} className="glass relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-butter/60 blur-xl" />
                <RewardIcon className="h-8 w-8 text-primary sm:h-9 sm:w-9" />
                <h3 className="mt-2 font-display text-base sm:mt-3 sm:text-lg">{r.name}</h3>
                <p className="text-[11px] text-muted-foreground sm:text-xs">{r.desc}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-4">
                  <span className="rounded-full bg-peach/60 px-3 py-1 text-[11px] font-semibold sm:text-xs">
                    {r.cost} pts
                  </span>
                  <button
                    type="button"
                    onClick={() => claim(r)}
                    disabled={!can || got}
                    className={`flex min-h-9 items-center gap-1 rounded-full px-3 py-2 text-[11px] sm:px-4 sm:text-xs ${
                      got
                        ? "bg-mint text-foreground"
                        : can
                          ? "bg-foreground text-background hover:scale-105"
                          : "cursor-not-allowed bg-border text-muted-foreground"
                    }`}
                  >
                    {got ? (
                      <>
                        <Check className="h-3 w-3" />
                        Canjeado
                      </>
                    ) : can ? (
                      "Canjear"
                    ) : (
                      "Faltan puntos"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl sm:text-2xl">Insignias</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = a.check(store);
            const BadgeIcon = a.icon;
            return (
              <div
                key={a.name}
                className={`flex items-center gap-3 rounded-2xl p-3 sm:gap-4 sm:rounded-3xl sm:p-4 ${unlocked ? "glass" : "bg-white/30"}`}
              >
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${unlocked ? "bg-butter" : "bg-border/50 grayscale"}`}
                >
                  <BadgeIcon className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                    {a.name}
                    {unlocked ? (
                      <Check className="h-3 w-3 text-primary" />
                    ) : (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{a.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}
