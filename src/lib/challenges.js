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

 












export const CHALLENGE_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "detox", label: "Desconexión" },
  { id: "offline", label: "Sin pantalla" },
  { id: "habit", label: "Hábitos" },
];

export const CHALLENGES = [
  {
    id: "phone-away-10",
    name: "Suelta el celular 10 min",
    desc: "Deja el teléfono boca abajo y no lo toques.",
    category: "detox",
    durationSec: 10 * 60,
    points: 25,
    icon: Smartphone,
    tip: "Pon el celular en otra habitación si puedes.",
  },
  {
    id: "phone-away-20",
    name: "Suelta el celular 20 min",
    desc: "Veinte minutos completamente offline.",
    category: "detox",
    durationSec: 20 * 60,
    points: 50,
    icon: Smartphone,
    tip: "Ideal para una pausa profunda entre bloques de estudio.",
  },
  {
    id: "phone-away-30",
    name: "Suelta el celular 30 min",
    desc: "Media hora lejos de las notificaciones.",
    category: "detox",
    durationSec: 30 * 60,
    points: 80,
    icon: Ban,
    tip: "Activa modo avión para evitar tentaciones.",
  },
  {
    id: "airplane-15",
    name: "Modo avión 15 min",
    desc: "Sin señal, sin distracciones externas.",
    category: "detox",
    durationSec: 15 * 60,
    points: 45,
    icon: Plane,
    tip: "Puedes usar reloj o timer físico mientras tanto.",
  },
  {
    id: "social-break-30",
    name: "30 min sin redes",
    desc: "Nada de Instagram, TikTok ni WhatsApp.",
    category: "detox",
    durationSec: 30 * 60,
    points: 55,
    icon: Ban,
    tip: "Cierra las apps antes de empezar el reto.",
  },
  {
    id: "walk-no-phone",
    name: "Camina sin celular",
    desc: "15 minutos caminando, el teléfono en casa.",
    category: "offline",
    durationSec: 15 * 60,
    points: 40,
    icon: Footprints,
    tip: "Observa tu entorno en lugar de la pantalla.",
  },
  {
    id: "read-paper",
    name: "Lee en papel",
    desc: "20 minutos con un libro físico o cuaderno.",
    category: "offline",
    durationSec: 20 * 60,
    points: 45,
    icon: BookOpen,
    tip: "Subraya o toma notas a mano para retener más.",
  },
  {
    id: "journal-offline",
    name: "Escribe a mano",
    desc: "10 minutos de diario o apuntes sin teclado.",
    category: "offline",
    durationSec: 10 * 60,
    points: 30,
    icon: PenLine,
    tip: "Anota cómo te sientes al desconectarte.",
  },
  {
    id: "nature-break",
    name: "Aire libre",
    desc: "15 minutos fuera, sin mirar el celular.",
    category: "offline",
    durationSec: 15 * 60,
    points: 40,
    icon: TreePine,
    tip: "Balcón, parque o patio — cualquier espacio abierto.",
  },
  {
    id: "coffee-offline",
    name: "Pausa consciente",
    desc: "10 minutos tomando algo sin pantalla.",
    category: "offline",
    durationSec: 10 * 60,
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
    name: "Mañana sin scroll",
    desc: "Los primeros 30 min del día sin redes.",
    category: "habit",
    durationSec: 30 * 60,
    points: 60,
    icon: Sun,
    tip: "Desayuna, estírate o planifica el día primero.",
  },
  {
    id: "bedtime-detox",
    name: "Desconexión nocturna",
    desc: "30 min antes de dormir sin pantallas.",
    category: "habit",
    durationSec: 30 * 60,
    points: 50,
    icon: Moon,
    tip: "La luz azul interrumpe el sueño reparador.",
  },
];

export function getChallenge(id) {
  return CHALLENGES.find((c) => c.id === id);
}

export function getDailyChallenge() {
  const day = new Date().getDate();
  return CHALLENGES[day % CHALLENGES.length];
}

export function formatDuration(sec) {
  if (sec === null) return "Manual";
  if (sec < 3600) return `${Math.round(sec / 60)} min`;
  return `${Math.round(sec / 3600)} h`;
}
