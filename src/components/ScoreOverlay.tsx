"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const PLAYER_COLORS = [
  "#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f97316", "#facc15",
  "#06b6d4", "#84cc16", "#f43f5e", "#8b5cf6", "#14b8a6", "#fb923c",
];
export const WIN_SCORE = 5;

export interface Player {
  id: number;
  color: string;
  name: string;
  score: number;
}

export default function PlayerSetup({
  lang,
  onReady,
  onClose,
}: {
  lang: string;
  onReady: (players: Player[]) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"count" | "names">("count");
  const [numPlayers, setNumPlayers] = useState(0);
  const [names, setNames] = useState<string[]>([]);

  const handleCountSelect = (n: number) => {
    setNumPlayers(n);
    setNames(
      Array.from({ length: n }, (_, i) =>
        lang === "pt" ? `Jogador ${i + 1}` : `Player ${i + 1}`
      )
    );
    setStep("names");
  };

  const handleStart = () => {
    const players: Player[] = names.map((name, i) => ({
      id: i,
      color: PLAYER_COLORS[i],
      name: name.trim() || (lang === "pt" ? `Jogador ${i + 1}` : `Player ${i + 1}`),
      score: 0,
    }));
    onReady(players);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "rgba(13,13,26,0.97)", backdropFilter: "blur(20px)" }}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-2xl text-white/40 transition-colors hover:text-white/80"
      >
        ✕
      </button>

      <AnimatePresence mode="wait">
        {step === "count" && (
          <motion.div
            key="count"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <h2 className="text-3xl font-black text-white">
              {lang === "pt" ? "Quantos jogadores?" : "How many players?"}
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n, idx) => (
                <motion.button
                  key={n}
                  whileHover={{ scale: 1.12, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCountSelect(n)}
                  className="h-14 w-14 rounded-2xl text-2xl font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${PLAYER_COLORS[idx % PLAYER_COLORS.length]}, ${PLAYER_COLORS[(idx + 4) % PLAYER_COLORS.length]})`,
                    boxShadow: `0 4px 16px ${PLAYER_COLORS[idx % PLAYER_COLORS.length]}80`,
                  }}
                >
                  {n}
                </motion.button>
              ))}
            </div>
            <p className="text-sm text-white/30">
              {lang === "pt"
                ? `Primeiro a ${WIN_SCORE} pontos vence!`
                : `First to ${WIN_SCORE} points wins!`}
            </p>
          </motion.div>
        )}

        {step === "names" && (
          <motion.div
            key="names"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
          >
            <h2 className="text-2xl font-black text-white">
              {lang === "pt" ? "Nomes dos jogadores" : "Player names"}
            </h2>
            <div className="flex w-full flex-col gap-3">
              {names.map((name, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-black text-white"
                    style={{ background: PLAYER_COLORS[i] }}
                  >
                    {name.trim() ? name.trim()[0].toUpperCase() : i + 1}
                  </div>
                  <input
                    type="text"
                    value={name}
                    maxLength={12}
                    onChange={(e) => {
                      const next = [...names];
                      next[i] = e.target.value;
                      setNames(next);
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 text-base text-white outline-none focus:border-white/30"
                    style={{ caretColor: PLAYER_COLORS[i], padding: "14px 20px" }}
                    placeholder={lang === "pt" ? `Jogador ${i + 1}` : `Player ${i + 1}`}
                  />
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="w-full rounded-2xl py-4 text-lg font-black text-white"
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                boxShadow: "0 4px 20px rgba(168,85,247,0.5)",
              }}
            >
              {lang === "pt" ? "Começar!" : "Start!"}
            </motion.button>
            <button
              onClick={() => setStep("count")}
              className="text-sm text-white/30 hover:text-white/60"
            >
              ← {lang === "pt" ? "Voltar" : "Back"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
