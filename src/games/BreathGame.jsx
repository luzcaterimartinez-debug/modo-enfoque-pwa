import { useEffect, useState } from "react";
import { addGameScore } from "@/lib/store";

export function BreathGame() {
  const [phase, setPhase] = useState("inhala");
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const seq = ["inhala", "manten", "exhala"];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % 3;
      setPhase(seq[idx]);
      if (idx === 0) {
        setCycles((c) => c + 1);
        addGameScore(5);
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const scale = phase === "inhala" ? 1.4 : phase === "exhala" ? 0.7 : 1.4;

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-8">
      <div className="relative grid h-44 w-44 place-items-center sm:h-56 sm:w-56">
        <div
          className="absolute h-36 w-36 rounded-full bg-gradient-to-br from-mint to-sky transition-transform duration-[4000ms] ease-in-out sm:h-44 sm:w-44"
          style={{ transform: `scale(${scale})` }}
        />
        <span className="relative font-display text-2xl capitalize text-foreground sm:text-3xl">{phase}</span>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Ciclos completados: {cycles}</p>
    </div>
  );
}
