const _jsxFileName = "";import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime";import { useEffect, useState } from "react";
import { addGameScore } from "@/lib/store";


function gen() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ["+", "-", "×"] ;
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
      setTimeout(() => { setQ(gen()); setVal(""); setMsg(null); }, 500);
    }
  }, [val, q]);


  const skip = () => { setStreak(0); setQ(gen()); setVal(""); };

  return (
    _jsxDEV('div', { className: "text-center", children: [
      _jsxDEV('div', { className: "mb-4 flex justify-between text-sm"   , children: [
        _jsxDEV('span', { className: "rounded-full bg-butter px-3 py-1"   , children: ["Puntos: " , score]}, void 0, true, {fileName: _jsxFileName, lineNumber: 37}, this)
        , _jsxDEV('span', { className: "rounded-full bg-peach px-3 py-1"   , children: ["Racha: " , streak]}, void 0, true, {fileName: _jsxFileName, lineNumber: 38}, this)
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 36}, this)
      , _jsxDEV('div', { className: "my-6 font-display text-4xl sm:my-8 sm:text-5xl"    , children: [
        q.a, " " , q.op, " " , q.b, " = ?"
      ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 40}, this)
      , _jsxDEV('input', {
        autoFocus: true,
        type: "number",
        value: val,
        onChange: (e) => setVal(e.target.value),
        className: "w-full rounded-2xl border-2 border-border bg-white px-4 py-3 text-center text-xl outline-none focus:border-primary sm:text-2xl"           ,
        placeholder: "Respuesta",}, void 0, false, {fileName: _jsxFileName, lineNumber: 43}, this
      )
      , msg && _jsxDEV('p', { className: "mt-2 text-sm font-semibold text-primary"   , children: msg}, void 0, false, {fileName: _jsxFileName, lineNumber: 51}, this)
      , _jsxDEV('button', { onClick: skip, className: "mt-4 text-xs text-muted-foreground underline"   , children: "Saltar"}, void 0, false, {fileName: _jsxFileName, lineNumber: 52}, this)
    ]}, void 0, true, {fileName: _jsxFileName, lineNumber: 35}, this)
  );
}
