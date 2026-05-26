import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Ban, Droplets, Brain } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  getWeeklyMinutesChart,
  getWeeklyTrend,
  getWeekTotalMinutes,
  getWeekBlocks,
  getBestDayThisWeek,
  getWeekGrowth,
  getDistribution,
  getHabits,
} from "@/lib/stats";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Impacto — Modo Enfoque" },
      { name: "description", content: "Gráficas de tu progreso de concentración." },
    ],
  }),
  component: StatsPage,
});

const HABIT_ICONS = [BookOpen, Ban, Droplets, Brain];

function StatsPage() {
  const [store] = useStore();
  const weekly = getWeeklyMinutesChart(store);
  const trend = getWeeklyTrend(store);
  const distribution = getDistribution(store);
  const habits = getHabits(store);
  const best = getBestDayThisWeek(store);
  const weekTotal = getWeekTotalMinutes(store);
  const weekBlocks = getWeekBlocks(store);
  const hasData = weekTotal > 0 || store.blocks > 0;

  return (
    <Shell>
      <header className="mb-4 sm:mb-6">
        <p className="page-subtitle">Impacto</p>
        <h1 className="page-title mt-1">Tu progreso esta semana.</h1>
        {!hasData && (
          <p className="mt-2 text-sm text-muted-foreground">
            Completa un bloque de enfoque o un reto para ver tus estadísticas aquí.
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <Kpi label="Total enfocado" value={`${weekTotal} min`} sub={getWeekGrowth(store)} />
        <Kpi label="Mejor día" value={best.day} sub={best.min > 0 ? `${best.min} min` : "Sin datos"} />
        <Kpi label="Bloques" value={String(weekBlocks)} sub="esta semana" />
        <Kpi
          label="Racha"
          value={store.streak > 0 ? `${store.streak} días` : "0 días"}
          sub={store.bestStreak > 0 ? `Récord: ${store.bestStreak}` : "Empieza hoy"}
        />
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
        <ChartCard title="Minutos por día">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <XAxis dataKey="day" stroke="oklch(0.5 0.03 290)" />
              <YAxis stroke="oklch(0.5 0.03 290)" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Bar dataKey="min" fill="oklch(0.72 0.13 25)" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Enfoque semanal">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <XAxis dataKey="w" stroke="oklch(0.5 0.03 290)" />
              <YAxis stroke="oklch(0.5 0.03 290)" allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Line type="monotone" dataKey="focus" stroke="oklch(0.72 0.13 25)" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="glass rounded-2xl card-padding sm:rounded-3xl">
          <h2 className="mb-3 font-display text-lg sm:mb-4 sm:text-xl">Distribución del tiempo</h2>
          {distribution.length > 0 ? (
            <>
              <div className="h-[200px] w-full sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={distribution} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={4}>
                      {distribution.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs">
                {distribution.map((d) => (
                  <span key={d.name} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">Sin actividad registrada esta semana.</p>
          )}
        </div>

        <div className="glass rounded-2xl card-padding sm:rounded-3xl">
          <h2 className="mb-3 font-display text-lg sm:mb-4 sm:text-xl">Hábitos logrados</h2>
          <ul className="space-y-2 text-sm sm:space-y-3">
            {habits.map(({ text, value }, i) => {
              const Icon = HABIT_ICONS[i];
              return (
                <li key={text} className="flex items-center gap-2.5 rounded-xl bg-white/60 p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3">
                  <Icon className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                  <span className="min-w-0 flex-1 text-[13px] leading-snug sm:text-sm">{text}</span>
                  <span className="shrink-0 rounded-full bg-mint px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:text-xs">{value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Shell>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="glass rounded-2xl card-padding sm:rounded-3xl">
      <h2 className="mb-3 font-display text-lg sm:mb-4 sm:text-xl">{title}</h2>
      <div className="h-[200px] w-full sm:h-[240px]">{children}</div>
    </div>
  );
}

function Kpi({ label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-4 sm:rounded-3xl sm:p-5">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">{label}</p>
      <p className="mt-1 font-display text-2xl sm:text-3xl">{value}</p>
      <p className="text-[10px] text-primary sm:text-xs">{sub}</p>
    </div>
  );
}
