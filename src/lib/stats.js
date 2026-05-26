const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}


export function getTodayMinutes(store) {
  return store.dailyMinutes[dateKey()] || 0;
}

export function getYesterdayMinutes(store) {
  return store.dailyMinutes[dateKey(addDays(new Date(), -1))] || 0;
}

export function getMinutesDelta(store) {
  const today = getTodayMinutes(store);
  const yesterday = getYesterdayMinutes(store);
  const diff = today - yesterday;
  if (diff > 0) return `+${diff} vs ayer`;
  if (diff < 0) return `${diff} vs ayer`;
  return "Igual que ayer";
}

export function getWeeklyMinutesChart(store) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i - 6);
    const key = dateKey(d);
    return {
      day: DAY_LABELS[d.getDay()],
      min: store.dailyMinutes[key] || 0,
    };
  });
}

export function getWeeklyTrend(store) {
  const today = new Date();
  return Array.from({ length: 4 }, (_, i) => {
    const end = addDays(today, -i * 7);
    const start = addDays(end, -6);
    let focus = 0;
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      focus += store.dailyMinutes[dateKey(d)] || 0;
    }
    return { w: `S${4 - i}`, focus };
  }).reverse();
}

export function getWeekTotalMinutes(store) {
  const today = new Date();
  let total = 0;
  for (let i = 0; i < 7; i++) {
    total += store.dailyMinutes[dateKey(addDays(today, -i))] || 0;
  }
  return total;
}

export function getWeekBlocks(store) {
  const today = new Date();
  let total = 0;
  for (let i = 0; i < 7; i++) {
    total += store.dailyBlocks[dateKey(addDays(today, -i))] || 0;
  }
  return total;
}

export function getBestDayThisWeek(store) {
  const chart = getWeeklyMinutesChart(store);
  const best = chart.reduce((a, b) => (b.min > a.min ? b : a), { day: "—", min: 0 });
  return best.min > 0 ? { day: best.day, min: best.min } : { day: "—", min: 0 };
}

export function getWeekGrowth(store) {
  const today = new Date();
  let thisWeek = 0;
  let lastWeek = 0;
  for (let i = 0; i < 7; i++) thisWeek += store.dailyMinutes[dateKey(addDays(today, -i))] || 0;
  for (let i = 7; i < 14; i++) lastWeek += store.dailyMinutes[dateKey(addDays(today, -i))] || 0;
  if (lastWeek === 0) return thisWeek > 0 ? "Primeros datos" : "Sin datos aún";
  const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  if (pct > 0) return `↑ ${pct}%`;
  if (pct < 0) return `↓ ${Math.abs(pct)}%`;
  return "Sin cambio";
}

export function getDistribution(store) {
  const weekFocus = getWeekTotalMinutes(store);
  const weekChallenges = getWeekChallengeCount(store);
  const challengeMin = weekChallenges * 15;
  const study = Math.max(0, weekFocus - challengeMin);
  return [
    { name: "Estudio", value: study, color: "oklch(0.86 0.09 50)" },
    { name: "Retos offline", value: challengeMin, color: "oklch(0.88 0.09 310)" },
    { name: "Pendiente", value: Math.max(0, 300 - weekFocus), color: "oklch(0.88 0.08 160)" },
  ].filter((d) => d.value > 0);
}

function getWeekChallengeCount(store) {
  const today = new Date();
  const keys = new Set();
  for (let i = 0; i < 7; i++) keys.add(dateKey(addDays(today, -i)));
  return store.completedChallenges.filter((c) => keys.has(c.date)).length;
}

export function getHabits(store) {
  const blocksToday = store.dailyBlocks[dateKey()] || 0;
  const challengesToday = store.completedChallenges.filter((c) => c.date === dateKey()).length;
  const detoxToday = store.completedChallenges.filter(
    (c) => c.date === dateKey() && c.id.includes("phone-away"),
  ).length;

  return [
    {
      text: "3 bloques de estudio diarios",
      value: `${Math.min(100, Math.round((blocksToday / 3) * 100))}%`,
    },
    {
      text: "Retos de desconexión hoy",
      value: `${Math.min(100, challengesToday * 33)}%`,
    },
    {
      text: "Tiempo lejos del celular",
      value: detoxToday > 0 ? "Sí" : "No",
    },
    {
      text: "Bloques totales",
      value: String(store.blocks),
    },
  ];
}

export function isDailyChallengeBonusAvailable(store, dailyId) {
  return store.dailyChallengeDate !== dateKey() || store.dailyChallengeId !== dailyId;
}
