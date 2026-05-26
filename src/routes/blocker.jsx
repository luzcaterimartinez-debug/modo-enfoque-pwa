const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime";import { createFileRoute } from "@tanstack/react-router";
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

  const toggle = (i) => setApps(apps.map((a, j) => j === i ? { ...a, blocked: !a.blocked } : a));
  const add = () => { if (newApp.trim()) { setApps([...apps, { name: newApp, icon: Smartphone, blocked: true }]); setNewApp(""); } };
  const remove = (i) => setApps(apps.filter((_, j) => j !== i));

  return (
    _jsxDEV(Shell, { children: [
      _jsxDEV('header', { className: "mb-4 sm:mb-6" , children: [
        _jsxDEV('p', { className: "page-subtitle", children: "Configuración"}, void 0, false, {fileName: _jsxFileName, lineNumber: 57}, this)
        , _jsxDEV('h1', { className: "page-title mt-1" , children: "Bloqueo de distracciones"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 58}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 56}, this)

      , _jsxDEV('div', { className: "grid gap-4 sm:gap-6 md:grid-cols-[1.4fr_1fr]"   , children: [
        _jsxDEV('section', { className: "glass rounded-2xl card-padding sm:rounded-3xl"   , children: [
          _jsxDEV('div', { className: "mb-3 flex items-center justify-between gap-2 sm:mb-4"     , children: [
            _jsxDEV('h2', { className: "font-display text-xl sm:text-2xl"  , children: "Aplicaciones"}, void 0, false, {fileName: _jsxFileName, lineNumber: 64}, this)
            , _jsxDEV('span', { className: "shrink-0 text-[10px] text-muted-foreground sm:text-xs"   , children: [apps.filter(a => a.blocked).length, " bloqueadas" ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 65}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 63}, this)

          , _jsxDEV('div', { className: "grid gap-2" , children: 
            apps.map((a, i) => {
              const Icon = a.icon;
              return (
                _jsxDEV('div', { className: `flex items-center gap-2.5 rounded-xl p-2.5 sm:gap-3 sm:rounded-2xl sm:p-3 ${a.blocked ? "bg-peach/40" : "bg-white/60"}`, children: [
                  _jsxDEV('div', { className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white sm:h-10 sm:w-10 sm:rounded-xl"         , children: 
                    _jsxDEV(Icon, { className: "h-4 w-4 text-foreground sm:h-5 sm:w-5"    ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 74}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 73}, this)
                  , _jsxDEV('span', { className: "min-w-0 flex-1 truncate text-sm font-medium"    , children: a.name}, void 0, false, {fileName: _jsxFileName, lineNumber: 76}, this)
                  , _jsxDEV('button', {
                    onClick: () => toggle(i),
                    'aria-label': a.blocked ? "Desbloquear" : "Bloquear",
                    className: `relative h-7 w-12 shrink-0 rounded-full sm:h-6 sm:w-11 ${a.blocked ? "bg-foreground" : "bg-border"}`,
 children: 
                    _jsxDEV('span', { className: `absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all sm:h-5 sm:w-5 ${a.blocked ? "left-5 sm:left-5" : "left-0.5"}`,}, void 0, false, {fileName: _jsxFileName, lineNumber: 82}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 77}, this)
                  , _jsxDEV('button', { onClick: () => remove(i), 'aria-label': "Eliminar", className: "touch-target shrink-0 text-muted-foreground hover:text-destructive"   , children: 
                    _jsxDEV(X, { className: "h-4 w-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 85}, this )
                  }, void 0, false, {fileName: _jsxFileName, lineNumber: 84}, this)
                ]}, i, true, {fileName: _jsxFileName, lineNumber: 72}, this)
              );
            })
          }, void 0, false, {fileName: _jsxFileName, lineNumber: 68}, this)

          , _jsxDEV('div', { className: "mt-3 flex gap-2 sm:mt-4"   , children: [
            _jsxDEV('input', {
              value: newApp,
              onChange: (e) => setNewApp(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && add(),
              placeholder: "Añadir aplicación..." ,
              className: "min-h-11 flex-1 rounded-full border-2 border-border bg-white/80 px-4 py-2 text-sm outline-none focus:border-primary"          ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 93}, this
            )
            , _jsxDEV('button', { onClick: add, 'aria-label': "Añadir", className: "touch-target grid shrink-0 place-items-center rounded-full bg-foreground text-background"      , children: 
              _jsxDEV(Plus, { className: "h-4 w-4" ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 101}, this )
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 100}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 92}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 62}, this)

        , _jsxDEV('section', { className: "space-y-3 sm:space-y-4" , children: [
          _jsxDEV('div', { className: "glass rounded-2xl card-padding sm:rounded-3xl"   , children: [
            _jsxDEV(ShieldOff, { className: "h-6 w-6 text-primary"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 108}, this )
            , _jsxDEV('h3', { className: "mt-3 font-display text-xl"  , children: "Modo estricto" }, void 0, false, {fileName: _jsxFileName, lineNumber: 109}, this)
            , _jsxDEV('p', { className: "mt-1 text-xs text-muted-foreground"  , children: "No podrás desactivar el bloqueo hasta terminar la sesión."        }, void 0, false, {fileName: _jsxFileName, lineNumber: 110}, this)
            , _jsxDEV('button', {
              onClick: () => setStrict(!strict),
              className: `relative mt-4 h-7 w-12 rounded-full transition ${strict ? "bg-primary" : "bg-border"}`,
 children: 
              _jsxDEV('span', { className: `absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${strict ? "left-5" : "left-0.5"}`,}, void 0, false, {fileName: _jsxFileName, lineNumber: 115}, this )
            }, void 0, false, {fileName: _jsxFileName, lineNumber: 111}, this)
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 107}, this)

          , _jsxDEV('div', { className: "glass rounded-2xl card-padding sm:rounded-3xl"   , children: [
            _jsxDEV('h3', { className: "font-display text-lg sm:text-xl"  , children: "Programar"}, void 0, false, {fileName: _jsxFileName, lineNumber: 120}, this)
            , _jsxDEV('label', { className: "mt-3 block text-xs text-muted-foreground"   , children: "Hora de inicio"  }, void 0, false, {fileName: _jsxFileName, lineNumber: 121}, this)
            , _jsxDEV('input', { type: "time", value: schedule, onChange: (e) => setSchedule(e.target.value),
              className: "mt-1 w-full rounded-2xl border-2 border-border bg-white/80 px-3 py-2 outline-none focus:border-primary"         ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 122}, this )
            , _jsxDEV('label', { className: "mt-3 block text-xs text-muted-foreground"   , children: ["Duración: " , duration, " min" ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 124}, this)
            , _jsxDEV('input', { type: "range", min: 15, max: 180, step: 15, value: duration, onChange: (e) => setDuration(+e.target.value),
              className: "mt-2 w-full accent-foreground"  ,}, void 0, false, {fileName: _jsxFileName, lineNumber: 125}, this )
          ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 119}, this)

          , _jsxDEV('button', { className: "min-h-11 w-full rounded-full bg-foreground py-3 text-background shadow-lg"      , children: "Guardar configuración" }, void 0, false, {fileName: _jsxFileName, lineNumber: 129}, this)
        ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 106}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 61}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 55}, this)
  );
}
