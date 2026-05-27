import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Timer, ShieldOff, BarChart3, Gift, ArrowRight, Sparkles, Flame, Target } from "lucide-react";
import { getDailyChallenge } from "@/lib/challenges";
import { useStore } from "@/lib/store";
import { getTodayMinutes, getMinutesDelta, isDailyChallengeBonusAvailable } from "@/lib/stats";

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
    <Shell>
      <header className="mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="page-subtitle">Hola, estudiante</p>
          <h1 className="page-title mt-2">Hoy es un buen día para enfocarse.</h1>
        </div>
        <Link
          to="/timer"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-background shadow-xl transition-transform active:scale-[0.98] sm:w-auto sm:py-3 sm:hover:scale-105"
        >
          Iniciar sesión
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <StatCard label="Minutos hoy" value={String(minutesToday)} sub={getMinutesDelta(store)} color="var(--peach)" />
        <StatCard
          label="Racha"
          value={store.streak > 0 ? `${store.streak}d` : "0d"}
          sub={store.streak > 0 ? "Sigue así" : "Empieza hoy"}
          subIcon={store.streak > 0 ? Flame : undefined}
          color="var(--mint)"
        />
        <StatCard label="Puntos" value={String(store.points)} sub="Canjea en recompensas" color="var(--lilac)" />
      </section>

      <section className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-2">
        <Link
          to="/timer"
          className="group relative overflow-hidden rounded-3xl bg-foreground p-5 text-background sm:p-8"
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-peach/40 blur-2xl" />
          <Timer className="h-7 w-7 sm:h-8 sm:w-8" />
          <h2 className="mt-4 font-display text-2xl sm:mt-6 sm:text-3xl">Pantalla de Enfoque</h2>
          <p className="mt-2 max-w-sm text-sm text-background/70">
            Pomodoro con minijuegos para mantener tu mente activa entre bloques.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm sm:mt-6">
            Entrar <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

        <div className="grid gap-3 sm:gap-4">
          <ActionCard
            to="/challenges"
            icon={Target}
            title="Retos de desconexión"
            desc="Aléjate del celular y gana puntos."
            bg="var(--peach)"
          />
          <ActionCard
            to="/blocker"
            icon={ShieldOff}
            title="Configurar bloqueo"
            desc="Elige qué apps silenciar."
            bg="var(--sky)"
          />
          <ActionCard to="/stats" icon={BarChart3} title="Ver impacto" desc="Gráficas semanales." bg="var(--mint)" />
          <ActionCard to="/rewards" icon={Gift} title="Recompensas" desc="Canjea tus puntos." bg="var(--butter)" />
        </div>
      </section>

      <Link
        to="/challenges"
        className="glass mt-5 flex items-start gap-3 rounded-3xl p-4 transition active:scale-[0.99] sm:mt-6 sm:items-center sm:gap-4 sm:p-6 sm:hover:bg-white/80"
      >
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary sm:mt-0 sm:h-6 sm:w-6" />
        <div className="min-w-0 flex-1 text-sm text-foreground/80">
          <span className="font-semibold">{dailyDone ? "Reto del día completado" : "Reto del día:"}</span>
          {!dailyDone && (
            <>
              {` ${daily.name} — ${daily.desc} `}
              <span className="font-semibold text-primary">
                +{daily.points} pts (+25 bonus)
              </span>
            </>
          )}
        </div>
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground sm:mt-0" />
      </Link>
    </Shell>
  );
}

function StatCard({ label, value, sub, subIcon: SubIcon, color }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card p-4 shadow-sm sm:rounded-3xl sm:p-6">
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full sm:h-24 sm:w-24"
        style={{ background: color, opacity: 0.6 }}
      />
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">{label}</p>
      <p className="mt-1.5 font-display text-3xl sm:mt-2 sm:text-5xl">{value}</p>
      <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground sm:text-xs">
        {SubIcon && <SubIcon className="h-3 w-3 text-primary" />}
        {sub}
      </p>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, desc, bg }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm transition-all active:scale-[0.99] sm:gap-4 sm:rounded-3xl sm:p-5 sm:hover:-translate-y-0.5 sm:hover:shadow-lg"
    >
      <div
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl"
        style={{ background: bg }}
      >
        <Icon className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold sm:text-base">{title}</div>
        <div className="text-[11px] text-muted-foreground sm:text-xs">{desc}</div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
