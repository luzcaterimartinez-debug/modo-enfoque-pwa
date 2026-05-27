import { useEffect, useState } from "react";
import { addGameScore } from "@/lib/store";
import {
  BookOpen,
  Pencil,
  Brain,
  BookMarked,
  Lightbulb,
  FlaskConical,
  PartyPopper,
  HelpCircle,
} from "lucide-react";

const SYMBOLS = [
  { id: "book", icon: BookOpen },
  { id: "pencil", icon: Pencil },
  { id: "brain", icon: Brain },
  { id: "bookmarked", icon: BookMarked },
  { id: "lightbulb", icon: Lightbulb },
  { id: "flask", icon: FlaskConical },
];

export function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [pick, setPick] = useState(null);
  const [moves, setMoves] = useState(0);

  const reset = () => {
    const deck = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((s, id) => ({ id, symbolId: s.id, flipped: false, matched: false }));
    setCards(deck);
    setPick(null);
    setMoves(0);
  };

  useEffect(reset, []);

  const click = (i) => {
    if (cards[i].flipped || cards[i].matched) return;
    const next = cards.map((c, j) => (j === i ? { ...c, flipped: true } : c));
    setCards(next);
    if (pick === null) setPick(i);
    else {
      setMoves((m) => m + 1);
      if (next[pick].symbolId === next[i].symbolId) {
        addGameScore(15);
        setTimeout(
          () => setCards((cs) => cs.map((c, j) => (j === i || j === pick ? { ...c, matched: true } : c))),
          400,
        );
      } else {
        setTimeout(
          () => setCards((cs) => cs.map((c, j) => (j === i || j === pick ? { ...c, flipped: false } : c))),
          700,
        );
      }
      setPick(null);
    }
  };

  const done = cards.every((c) => c.matched);
  const symbolMap = Object.fromEntries(SYMBOLS.map((s) => [s.id, s.icon]));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Movimientos: {moves}</span>
        <button type="button" onClick={reset} className="rounded-full bg-foreground px-3 py-1 text-xs text-background">
          Reiniciar
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {cards.map((c, i) => {
          const visible = c.flipped || c.matched;
          const Icon = symbolMap[c.symbolId];
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => click(i)}
              className={`grid aspect-square place-items-center rounded-xl transition-all sm:rounded-2xl ${
                visible ? "bg-mint" : "bg-foreground/90"
              } ${c.matched ? "opacity-60" : ""}`}
            >
              {visible ? (
                <Icon className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
              ) : (
                <HelpCircle className="h-4 w-4 text-background/40 sm:h-5 sm:w-5" />
              )}
            </button>
          );
        })}
      </div>
      {done && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary">
          <PartyPopper className="h-4 w-4" />
          ¡Completado!
        </p>
      )}
    </div>
  );
}
