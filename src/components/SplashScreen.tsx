"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#a855f7", "#ec4899", "#f97316", "#10b981", "#3b82f6", "#facc15", "#ef4444"];

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("tapple_splash")) {
      sessionStorage.setItem("tapple_splash", "1");
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3200);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#0d0d1a" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute"
            style={{
              width: 800,
              height: 800,
              borderRadius: "50%",
              background: `conic-gradient(from 0deg, ${COLORS.join(", ")})`,
              opacity: 0.18,
              filter: "blur(40px)",
            }}
          />

          {COLORS.map((color, i) => (
            <motion.div
              key={color}
              animate={{ scale: [0.6, 2.5], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, delay: i * 0.35, repeat: Infinity, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                border: `2px solid ${color}`,
                boxShadow: `0 0 18px ${color}`,
              }}
            />
          ))}

          {COLORS.map((color, i) => (
            <motion.div
              key={i}
              className="absolute h-3 w-3 rounded-full"
              animate={{
                x: [0, Math.cos((i / COLORS.length) * Math.PI * 2) * 200],
                y: [0, Math.sin((i / COLORS.length) * Math.PI * 2) * 200],
                opacity: [0, 1, 0],
                scale: [0, 1.4, 0],
              }}
              transition={{ duration: 1.6, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: color, filter: `blur(3px)`, boxShadow: `0 0 12px ${color}` }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.15 }}
            className="relative overflow-hidden rounded-full"
            style={{
              width: 220,
              height: 220,
              border: "4px solid rgba(255,255,255,0.25)",
              boxShadow: "0 0 60px rgba(168,85,247,0.7), 0 0 120px rgba(236,72,153,0.4)",
            }}
          >
            <img src="/karina5.png" alt="" className="h-full w-full object-cover" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 text-6xl font-black tracking-widest"
            style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(168,85,247,0.8))",
            }}
          >
            TAPPLE
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
