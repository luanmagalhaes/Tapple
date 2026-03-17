"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Language } from "@/data/categories";
import SplashScreen from "@/components/SplashScreen";

const languages = [
  {
    code: "pt" as Language,
    label: "Português",
    flag: "🇧🇷",
    image: "/lula.png",
    subtitle: "Categorias em Português",
    gradient: "from-green-500 via-emerald-400 to-yellow-400",
    glow: "rgba(52, 211, 153, 0.6)",
    border: "border-emerald-400/40",
  },
  {
    code: "en" as Language,
    label: "English",
    flag: "🇺🇸",
    image: "/trump.png",
    subtitle: "Categories in English",
    gradient: "from-blue-500 via-indigo-400 to-purple-400",
    glow: "rgba(99, 102, 241, 0.6)",
    border: "border-indigo-400/40",
  },
];

const modes = {
  pt: [
    {
      code: "cute",
      label: "Fofinho",
      emoji: "🐶",
      image: "/karina17.png",
      sign: null,
      subtitle: "Para toda a família",
      gradient: "from-pink-400 via-rose-300 to-orange-300",
      glow: "rgba(251, 113, 133, 0.6)",
      border: "border-rose-400/40",
    },
    {
      code: "adult",
      label: "Proibidão 🔞",
      emoji: "",
      image: "/karina18.png",
      sign: null,
      subtitle: "+18",
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      glow: "rgba(239, 68, 68, 0.6)",
      border: "border-red-500/40",
    },
  ],
  en: [
    {
      code: "cute",
      label: "Cute",
      emoji: "🐶",
      image: "/karina17.png",
      sign: null,
      subtitle: "For the whole family",
      gradient: "from-pink-400 via-rose-300 to-orange-300",
      glow: "rgba(251, 113, 133, 0.6)",
      border: "border-rose-400/40",
    },
    {
      code: "adult",
      label: "Naughty 🔞",
      emoji: "",
      image: "/karina18.png",
      sign: null,
      subtitle: "+18",
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      glow: "rgba(239, 68, 68, 0.6)",
      border: "border-red-500/40",
    },
  ],
};

const DISCO_COLORS = [
  "#a855f7",
  "#ec4899",
  "#f97316",
  "#10b981",
  "#3b82f6",
  "#facc15",
  "#ef4444",
];

function DiscoTransition({ image }: { image: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: "rgba(0,0,0,0.92)" }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${DISCO_COLORS.join(", ")})`,
          opacity: 0.25,
          filter: "blur(30px)",
        }}
      />

      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [0.8, 2.8], opacity: [0.6, 0] }}
          transition={{
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            width: 320,
            height: 320,
            border: `3px solid ${DISCO_COLORS[i % DISCO_COLORS.length]}`,
            boxShadow: `0 0 20px ${DISCO_COLORS[i % DISCO_COLORS.length]}`,
          }}
        />
      ))}

      {DISCO_COLORS.map((color, i) => (
        <motion.div
          key={color}
          animate={{
            x: [0, Math.cos((i / DISCO_COLORS.length) * Math.PI * 2) * 160],
            y: [0, Math.sin((i / DISCO_COLORS.length) * Math.PI * 2) * 160],
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-8 w-8 rounded-full"
          style={{
            background: color,
            filter: "blur(4px)",
            boxShadow: `0 0 16px ${color}`,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
        className="relative overflow-hidden rounded-full"
        style={{
          width: 280,
          height: 280,
          border: "4px solid rgba(255,255,255,0.3)",
          boxShadow:
            "0 0 60px rgba(168,85,247,0.6), 0 0 120px rgba(236,72,153,0.3)",
        }}
      >
        <img src={image} alt="" className="h-full w-full object-cover" />
      </motion.div>
    </motion.div>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [transitioning, setTransitioning] = useState<string | null>(null);

  useEffect(() => {
    const lang = searchParams.get("lang") as Language | null;
    if (lang && (lang === "pt" || lang === "en")) {
      setSelectedLang(lang);
    }
  }, [searchParams]);

  const handleLangSelect = (lang: Language) => {
    const image = languages.find((l) => l.code === lang)?.image ?? null;
    if (image) {
      setTransitioning(image);
      setTimeout(() => {
        setTransitioning(null);
        setSelectedLang(lang);
      }, 3000);
    } else {
      setSelectedLang(lang);
    }
  };

  const handleModeSelect = (mode: string) => {
    router.push(`/game?lang=${selectedLang}&mode=${mode}`);
  };

  return (
    <>
      <SplashScreen />
      <AnimatePresence>
        {transitioning && <DiscoTransition key="disco" image={transitioning} />}
      </AnimatePresence>
      <main
        className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-6"
        style={{ background: "#0d0d1a" }}
      >
        <div
          className="blob-animation pointer-events-none absolute left-[-10%] top-[-10%] h-[400px] w-[400px] opacity-20"
          style={{
            background: "radial-gradient(circle, #a855f7, transparent)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="blob-animation pointer-events-none absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] opacity-20"
          style={{
            background: "radial-gradient(circle, #3b82f6, transparent)",
            filter: "blur(60px)",
            animationDelay: "4s",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <h1
            className="text-5xl font-black tracking-widest sm:text-7xl"
            style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))",
            }}
          >
            TAPPLE
          </h1>
          <motion.p
            key={selectedLang ? "mode" : "lang"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-lg text-white/50"
          >
            {selectedLang
              ? selectedLang === "pt"
                ? "Escolha o modo"
                : "Choose a mode"
              : "Choose your language"}
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedLang ? (
            <motion.div
              key="languages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8"
            >
              {languages.map((lang, i) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.15,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.06, y: -6 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleLangSelect(lang.code)}
                  className={`relative flex w-72 cursor-pointer flex-col items-center gap-4 rounded-3xl border ${lang.border} p-6 backdrop-blur-md transition-all duration-300 sm:w-64 sm:p-8`}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                    }}
                  />
                  {lang.image ? (
                    <div
                      className="relative w-full overflow-hidden rounded-2xl"
                      style={{ height: 120 }}
                    >
                      <img
                        src={lang.image}
                        alt={lang.label}
                        className="h-full w-full object-cover object-center"
                      />
                      <span className="absolute right-2 top-2 text-2xl drop-shadow-lg">
                        {lang.flag}
                      </span>
                    </div>
                  ) : (
                    <span className="text-6xl">{lang.flag}</span>
                  )}
                  <div className="text-center">
                    <p
                      className={`text-2xl font-black bg-gradient-to-r ${lang.gradient} bg-clip-text text-transparent`}
                    >
                      {lang.label}
                    </p>
                    <p className="mt-1 text-sm text-white/40">
                      {lang.subtitle}
                    </p>
                  </div>
                  <div
                    className={`h-1 w-20 rounded-full bg-gradient-to-r ${lang.gradient}`}
                    style={{ boxShadow: `0 0 12px ${lang.glow}` }}
                  />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="modes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8"
            >
              {modes[selectedLang].map((m, i) => (
                <motion.button
                  key={m.code}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.15,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.06, y: -6 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleModeSelect(m.code)}
                  className={`relative flex w-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border ${m.border} p-4 sm:p-8 backdrop-blur-md transition-all duration-300`}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                    }}
                  />
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.label}
                      className="w-full rounded-2xl object-contain"
                      style={{ maxHeight: 180 }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-5xl">{m.emoji}</span>
                    </div>
                  )}
                  <div className="text-center">
                    <p
                      className={`text-xl font-black bg-gradient-to-r ${m.gradient} bg-clip-text text-transparent`}
                    >
                      {m.label}
                    </p>
                    <p className="mt-0.5 text-xs sm:text-base text-white/40">{m.subtitle}</p>
                  </div>
                  <div
                    className={`h-1 w-16 rounded-full bg-gradient-to-r ${m.gradient}`}
                    style={{ boxShadow: `0 0 12px ${m.glow}` }}
                  />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-white/20"
        >
          Spin the wheel. Pick a category. Beat your friends.
        </motion.p>

        <AnimatePresence>
          {selectedLang && (
            <motion.button
              key="back"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => setSelectedLang(null)}
              className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/50 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/80"
              style={{ padding: "14px 28px" }}
            >
              ← {selectedLang === "pt" ? "Voltar" : "Back"}
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
