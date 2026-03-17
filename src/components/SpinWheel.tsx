"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { categories, type Language, type Mode } from "@/data/categories";

interface SpinWheelProps {
  language: Language;
  mode: Mode;
}

export default function SpinWheel({ language, mode }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [slotItems, setSlotItems] = useState<string[]>([]);
  const [showSlot, setShowSlot] = useState(false);
  const [revealCard, setRevealCard] = useState(false);
  const usedRef = useRef<Set<string>>(new Set());

  const fireConfetti = useCallback(() => {
    const colors = ["#a855f7", "#ec4899", "#3b82f6", "#f97316", "#10b981", "#facc15"];

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.3, y: 0.6 },
      colors,
      startVelocity: 45,
      gravity: 0.9,
      ticks: 200,
    });
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.7, y: 0.6 },
      colors,
      startVelocity: 45,
      gravity: 0.9,
      ticks: 200,
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: 0.5, y: 0.3 },
        colors,
        startVelocity: 30,
        gravity: 1,
        ticks: 150,
      });
    }, 300);
  }, []);

  const getRandomCategory = useCallback((): string => {
    const pool = categories[language][mode];
    const available = pool.filter((c) => !usedRef.current.has(c));
    if (available.length === 0) {
      usedRef.current.clear();
      return pool[Math.floor(Math.random() * pool.length)];
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    usedRef.current.add(pick);
    return pick;
  }, [language, mode]);

  const buildSlotSequence = useCallback(
    (final: string): string[] => {
      const pool = categories[language][mode];
      const fakes = Array.from({ length: 18 }, () => pool[Math.floor(Math.random() * pool.length)]);
      return [...fakes, final];
    },
    [language, mode]
  );

  const spin = useCallback(async () => {
    if (spinning) return;
    setSpinning(true);
    setRevealCard(false);
    setShowSlot(true);

    const audio = new Audio("/gemido.mp3");
    audio.play().catch(() => {});

    const chosen = getRandomCategory();
    const sequence = buildSlotSequence(chosen);
    setSlotItems(sequence);

    await new Promise((r) => setTimeout(r, 2600));

    audio.pause();
    audio.currentTime = 0;

    setShowSlot(false);
    setResult(chosen);

    await new Promise((r) => setTimeout(r, 100));
    setRevealCard(true);
    fireConfetti();
    setSpinning(false);
  }, [spinning, getRandomCategory, buildSlotSequence, fireConfetti]);

  const labelSpin = language === "pt" ? "GIRAR" : "SPIN";
  const labelHint = language === "pt" ? "Toque para sortear uma categoria" : "Tap to draw a category";

  return (
    <div className="flex flex-col items-center gap-8">
      <AnimatePresence>
        {showSlot && (
          <motion.div
            key="slot"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative overflow-hidden rounded-2xl border border-purple-500/30"
            style={{
              width: 340,
              height: 100,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 0 40px rgba(168,85,247,0.4)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)" }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}
            />

            <motion.div
              animate={{ y: -(slotItems.length - 1) * 60 + 20 }}
              transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center"
              style={{ paddingTop: 20 }}
            >
              {slotItems.map((item, i) => (
                <div
                  key={i}
                  className="flex h-[60px] w-full items-center justify-center px-4 text-center text-sm font-semibold text-white/80"
                >
                  {item}
                </div>
              ))}
            </motion.div>

            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[2px] -translate-y-1/2"
              style={{ background: "linear-gradient(90deg, transparent, #a855f7, #ec4899, #a855f7, transparent)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealCard && result && (
          <motion.div
            key="card"
            initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ perspective: 800 }}
            className="w-80 rounded-3xl border border-purple-400/30 p-8 text-center"
          >
            <div
              className="rounded-3xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.15))",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 40px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-300/70">
                {language === "pt" ? "Categoria" : "Category"}
              </p>
              <p
                className="text-2xl font-black leading-tight text-white"
                style={{ textShadow: "0 0 20px rgba(168,85,247,0.8)" }}
              >
                {result}
              </p>
              <div
                className="mx-auto mt-4 h-1 w-16 rounded-full"
                style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSlot && (
        <div className="flex flex-col items-center gap-5">
          <motion.button
            onClick={spin}
            disabled={spinning}
            whileHover={!spinning ? { scale: 1.05 } : {}}
            whileTap={!spinning ? { scale: 0.95 } : {}}
            animate={spinning ? {} : { boxShadow: ["0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.2)", "0 0 50px rgba(168,85,247,0.9), 0 0 80px rgba(236,72,153,0.5)", "0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.2)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-28 w-28 cursor-pointer items-center justify-center rounded-full text-xl font-black text-white disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
              boxShadow: "0 8px 30px rgba(168,85,247,0.5), inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.3)",
              transform: "perspective(300px) translateZ(0px)",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)",
              }}
            />
            <span className="relative z-10 tracking-widest">{labelSpin}</span>
          </motion.button>

          {!result && !spinning && (
            <p className="text-xs text-white/30">{labelHint}</p>
          )}

        </div>
      )}
    </div>
  );
}
