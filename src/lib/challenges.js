import {
  Smartphone,
  Plane,
  Moon,
  Utensils,
  Sun,
  Ban,
  Footprints,
  BookOpen,
  PenLine,
  TreePine,
  Coffee,
} from "lucide-react";

const H = 3600;

export const CHALLENGE_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "detox", label: "Desconexión" },
  { id: "offline", label: "Sin pantalla" },
  { id: "habit", label: "Hábitos" },
];

export const CHALLENGES = [
  {
    id: "phone-away-10",
    name: "Suelta el celular 1 h",
    desc: "Una hora con el teléfono boca abajo, sin tocarlo.",
    category: "detox",
    durationSec: 1 * H,
    points: 25,
    icon: Smartphone,
    tip: "Pon el celular en otra habitación si puedes.",
  },
  {
    id: "phone-away-20",
    name: "Suelta el celular 2 h",
    desc: "Dos horas completamente offline.",
    category: "detox",
    durationSec: 2 * H,
    points: 50,
    icon: Smartphone,
    tip: "Ideal para una tarde de estudio profundo.",
  },
  {
    id: "phone-away-30",
    name: "Suelta el celular 3 h",
    desc: "Tres horas lejos de las notificaciones.",
    category: "detox",
    durationSec: 3 * H,
    points: 80,
    icon: Ban,
    tip: "Activa modo avión para evitar tentaciones.",
  },
  {
    id: "airplane-15",
    name: "Modo avión 1 h",
    desc: "Una hora sin señal ni distracciones externas.",
    category: "detox",
    durationSec: 1 * H,
    points: 45,
    icon: Plane,
    tip: "Puedes usar reloj o timer físico mientras tanto.",
  },
  {
    id: "social-break-30",
    name: "2 h sin redes",
    desc: "Nada de Instagram, TikTok ni WhatsApp.",
    category: "detox",
    durationSec: 2 * H,
    points: 55,
    icon: Ban,
    tip: "Cierra las apps antes de empezar el reto.",
  },
  {
    id: "walk-no-phone",
    name: "Camina 1 h sin celular",
    desc: "Una hora caminando, el teléfono en casa.",
    category: "offline",
    durationSec: 1 * H,
    points: 40,
    icon: Footprints,
    tip: "Observa tu entorno en lugar de la pantalla.",
  },
  {
    id: "read-paper",
    name: "Lee 2 h en papel",
    desc: "Dos horas con un libro físico o cuaderno.",
    category: "offline",
    durationSec: 2 * H,
    points: 45,
    icon: BookOpen,
    tip: "Subraya o toma notas a mano para retener más.",
  },
  {
    id: "journal-offline",
    name: "Escribe 1 h a mano",
    desc: "Una hora de diario o apuntes sin teclado.",
    category: "offline",
    durationSec: 1 * H,
    points: 30,
    icon: PenLine,
    tip: "Anota cómo te sientes al desconectarte.",
  },
  {
    id: "nature-break",
    name: "1 h al aire libre",
    desc: "Una hora fuera, sin mirar el celular.",
    category: "offline",
    durationSec: 1 * H,
    points: 40,
    icon: TreePine,
    tip: "Balcón, parque o patio — cualquier espacio abierto.",
  },
  {
    id: "coffee-offline",
    name: "Pausa consciente 1 h",
    desc: "Una hora tomando algo sin pantalla.",
    category: "offline",
    durationSec: 1 * H,
    points: 25,
    icon: Coffee,
    tip: "Prueba a saborear sin hacer scroll.",
  },
  {
    id: "no-phone-meal",
    name: "Comida sin pantallas",
    desc: "Una comida entera sin mirar el celular.",
    category: "habit",
    durationSec: null,
    confirmSec: 10,
    points: 35,
    icon: Utensils,
    tip: "Conversar o comer en silencio también cuenta.",
  },
  {
    id: "morning-no-scroll",
    name: "1 h sin scroll matutino",
    desc: "La primera hora del día sin redes.",
    category: "habit",
    durationSec: 1 * H,
    points: 60,
    icon: Sun,
    tip: "Desayuna, estírate o planifica el día primero.",
  },
  {
    id: "bedtime-detox",
    name: "1 h de desconexión nocturna",
    desc: "Una hora antes de dormir sin pantallas.",
    category: "habit",
    durationSec: 1 * H,
    points: 50,
    icon: Moon,
    tip: "La luz azul interrumpe el sueño reparador.",
  },
];

export function getChallenge(id) {
  return CHALLENGES.find((c) => c.id === id);
}

export function getDailyChallenge() {
  const day = new Date().getUTCDate();
  return CHALLENGES[day % CHALLENGES.length];
}

export function formatDuration(sec) {
  if (sec === null) return "Manual";
  const hours = Math.floor(sec / 3600);
  const minutes = Math.round((sec % 3600) / 60);
  if (hours >= 1 && minutes === 0) return `${hours} h`;
  if (hours >= 1) return `${hours} h ${minutes} min`;
  if (minutes >= 1) return `${minutes} min`;
  return `${sec} s`;
}

export function formatCountdown(remainingMs) {
  const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  if (hh > 0) {
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}
