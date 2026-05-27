import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useState } from "react";
import {
  ShieldOff,
  Plus,
  X,
  Camera,
  Music,
  Play,
  MessageCircle,
  Twitter,
  Film,
  Headphones,
  Ghost,
  Smartphone,
} from "lucide-react";

export const Route = createFileRoute("/blocker")({
  head: () => ({
    meta: [
      { title: "Bloqueo — Modo Enfoque" },
      { name: "description", content: "Configura qué aplicaciones bloquear durante tu sesión de estudio." },
    ],
  }),
  component: BlockerPage,
});

const DEFAULT = [
  { name: "Instagram", icon: Camera, blocked: true },
  { name: "TikTok", icon: Music, blocked: true },
  { name: "YouTube", icon: Play, blocked: false },
  { name: "WhatsApp", icon: MessageCircle, blocked: true },
  { name: "Twitter / X", icon: Twitter, blocked: true },
  { name: "Netflix", icon: Film, blocked: false },
  { name: "Spotify", icon: Headphones, blocked: false },
  { name: "Snapchat", icon: Ghost, blocked: true },
];

function BlockerPage() {
  const [apps, setApps] = useState(DEFAULT);
  const [strict, setStrict] = useState(true);
  const [schedule, setSchedule] = useState("18:00");
  const [duration, setDuration] = useState(60);
  const [newApp, setNewApp] = useState("");

  const toggle = (i) => setApps(apps.map((a, j) => (j === i ? { ...a, blocked: !a.blocked } : a)));
  const add = () => {
    if (newApp.trim()) {
      setApps([...apps, { name: newApp, icon: Smartphone, blocked: true }]);
      setNewApp("");
    }
  };
  const remove = (i) => setApps(apps.filter((_, j) => j !== i));

  return (
    <Shell>
      <header className="mb-4 sm:mb-6">
        <p className="page-subtitle">Configuración</p>
        <h1 className="page-title mt-1">Bloqueo de distracciones</h1>
      </header>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-[1.4fr_1fr]">
        <section className="glass rounded-2xl card-padding sm:rounded-3xl">
          <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
            <h2 className="font-display text-xl sm:text-2xl">Aplicaciones</h2>
            <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs">
              {apps.filter((a) => a.blocked).length} bloqueadas
            </span>
          </div>

          <div className="grid gap-2">
            {apps.map((a, i) => {
              const Icon = a.icon;
              return (
                <div
                  key={`${a.name}-${i}`}
                  className={`flex items-center gap-2.5 rounded-xl p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3 ${a.blocked ? "bg-peach/40" : "bg-white/60"}`}
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white sm:h-10 sm:w-10 sm:rounded-xl">
                    <Icon className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{a.name}</span>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-label={a.blocked ? "Desbloquear" : "Bloquear"}
                    className={`relative h-7 w-12 shrink-0 rounded-full sm:h-6 sm:w-11 ${a.blocked ? "bg-foreground" : "bg-border"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all sm:h-5 sm:w-5 ${a.blocked ? "left-5 sm:left-5" : "left-0.5"}`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Eliminar"
                    className="touch-target shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex gap-2 sm:mt-4">
            <input
              value={newApp}
              onChange={(e) => setNewApp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Añadir aplicación..."
              className="min-h-11 flex-1 rounded-full border-2 border-border bg-white/80 px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={add}
              aria-label="Añadir"
              className="touch-target grid shrink-0 place-items-center rounded-full bg-foreground text-background"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="space-y-3 sm:space-y-4">
          <div className="glass rounded-2xl card-padding sm:rounded-3xl">
            <ShieldOff className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Modo estricto</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              No podrás desactivar el bloqueo hasta terminar la sesión.
            </p>
            <button
              type="button"
              onClick={() => setStrict(!strict)}
              className={`relative mt-4 h-7 w-12 rounded-full transition ${strict ? "bg-primary" : "bg-border"}`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${strict ? "left-5" : "left-0.5"}`}
              />
            </button>
          </div>

          <div className="glass rounded-2xl card-padding sm:rounded-3xl">
            <h3 className="font-display text-lg sm:text-xl">Programar</h3>
            <label className="mt-3 block text-xs text-muted-foreground">Hora de inicio</label>
            <input
              type="time"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="mt-1 w-full rounded-2xl border-2 border-border bg-white/80 px-3 py-2 outline-none focus:border-primary"
            />
            <label className="mt-3 block text-xs text-muted-foreground">Duración: {duration} min</label>
            <input
              type="range"
              min={15}
              max={180}
              step={15}
              value={duration}
              onChange={(e) => setDuration(+e.target.value)}
              className="mt-2 w-full accent-foreground"
            />
          </div>

          <button type="button" className="min-h-11 w-full rounded-full bg-foreground py-3 text-background shadow-lg">
            Guardar configuración
          </button>
        </section>
      </div>
    </Shell>
  );
}
