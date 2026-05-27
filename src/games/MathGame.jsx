import { useEffect, useState } from "react";
import { addGameScore } from "@/lib/store";

function gen() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * 3)];
  const ans = op === "+" ? a + b : op === "-" ? a - b : a * b;
  return { a, b, op, ans };
}

export function MathGame() {
  const [q, setQ] = useState(gen());
  const [val, setVal] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (val && Number(val) === q.ans) {
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
      addGameScore(10);
      setMsg("¡Correcto! +10");
      setTimeout(() => {
        setQ(gen());
        setVal("");
        setMsg(null);
      }, 500);
    }
  }, [val, q]);

  const skip = () => {
    setStreak(0);
    setQ(gen());
    setVal("");
  };

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-between text-sm">
        <span className="rounded-full bg-butter px-3 py-1">Puntos: {score}</span>
        <span className="rounded-full bg-peach px-3 py-1">Racha: {streak}</span>
      </div>
      <div className="my-6 font-display text-4xl sm:my-8 sm:text-5xl">
        {q.a} {q.op} {q.b} = ?
      </div>
      <input
        autoFocus
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-center text-xl outline-none focus:border-primary sm:text-2xl"
        placeholder="Respuesta"
      />
      {msg && <p className="mt-2 text-sm font-semibold text-primary">{msg}</p>}
      <button type="button" onClick={skip} className="mt-4 text-xs text-muted-foreground underline">
        Saltar
      </button>
    </div>
  );
}
