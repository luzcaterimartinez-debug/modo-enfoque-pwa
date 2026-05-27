import { useState } from "react";
import { addGameScore } from "@/lib/store";

const WORDS = [
  { scrambled: "DIESTRO", answer: "ESTUDIO" },
  { scrambled: "QUEONFE", answer: "ENFOQUE" },
  { scrambled: "PEMTOI", answer: "TIEMPO" },
  { scrambled: "TEMNE", answer: "MENTE" },
  { scrambled: "BROLI", answer: "LIBRO" },
  { scrambled: "CINOCANTRECON", answer: "CONCENTRACION" },
  { scrambled: "TALMEA", answer: "METAL" },
  { scrambled: "PRENRADE", answer: "APRENDER" },
];

export function WordGame() {
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState(null);
  const w = WORDS[i % WORDS.length];

  const check = () => {
    if (val.toUpperCase().trim() === w.answer) {
      setScore((s) => s + 20);
      addGameScore(20);
      setMsg("¡Excelente! +20");
      setTimeout(() => {
        setI((x) => x + 1);
        setVal("");
        setMsg(null);
      }, 700);
    } else {
      setMsg("Intenta de nuevo");
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4 inline-block rounded-full bg-lilac px-3 py-1 text-sm">Puntos: {score}</div>
      <p className="mb-2 text-sm text-muted-foreground">Ordena las letras:</p>
      <div className="my-4 break-all font-display text-2xl tracking-[0.15em] sm:my-6 sm:text-4xl sm:tracking-[0.3em]">
        {w.scrambled}
      </div>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        className="min-h-11 w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-center uppercase outline-none focus:border-primary"
        placeholder="Palabra"
      />
      <button
        type="button"
        onClick={check}
        className="mt-4 min-h-11 w-full rounded-full bg-foreground py-2.5 text-background"
      >
        Comprobar
      </button>
      {msg && <p className="mt-2 text-sm font-semibold text-primary">{msg}</p>}
    </div>
  );
}
