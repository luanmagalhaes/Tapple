"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpinWheel from "@/components/SpinWheel";
import PlayerSetup, { type Player, WIN_SCORE } from "@/components/ScoreOverlay";
import type { Language } from "@/data/categories";

const DISCO = ["#a855f7", "#ec4899", "#f97316", "#10b981", "#3b82f6", "#facc15"];
const BG_IMAGES = ["/karina.png", "/karina2.png", "/karina3.png", "/iguana1.png", "/karina4.png"];

function MiniWheel({ players, onSelect }: { players: Player[]; onSelect: (id: number) => void }) {
  const n = players.length;
  const radius = n <= 2 ? 55 : n <= 4 ? 70 : 90;
  const size = 38;
  const containerSize = (radius + size / 2 + 10) * 2;

  return (
    <div className="relative" style={{ width: containerSize, height: containerSize }}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {players.map((p, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <motion.button
              key={p.id}
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              whileTap={{ scale: 0.85 }}
              onClick={() => onSelect(p.id)}
              className="absolute flex flex-col items-center gap-0.5"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: -size / 2,
                marginTop: -size / 2,
                x,
                y,
              }}
            >
              <div
                className="relative flex items-center justify-center rounded-full text-xs font-black text-white"
                style={{
                  width: size,
                  height: size,
                  background: p.color,
                  boxShadow: `0 0 14px ${p.color}80`,
                }}
              >
                {p.name.trim() ? p.name.trim()[0].toUpperCase() : p.id + 1}
                <motion.div
                  key={p.score}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                  style={{ background: "#0d0d1a", border: `2px solid ${p.color}` }}
                >
                  {p.score}
                </motion.div>
              </div>
              <span
                className="max-w-[60px] truncate text-center text-[9px] font-bold text-white/70"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
              >
                {p.name}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

function ScoreModal({
  player,
  lang,
  onAdd,
  onClose,
}: {
  player: Player;
  lang: string;
  onAdd: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", zIndex: 100 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.7, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-5 rounded-3xl"
        style={{
          background: "rgba(20,20,40,0.98)",
          border: `2px solid ${player.color}60`,
          boxShadow: `0 0 60px ${player.color}40`,
          minWidth: 300,
          padding: "56px 48px 40px",
        }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black text-white"
          style={{ background: player.color, boxShadow: `0 0 30px ${player.color}80` }}
        >
          {player.name.trim() ? player.name.trim()[0].toUpperCase() : player.id + 1}
        </div>
        <p className="text-lg font-black text-white">{player.name}</p>
        <div className="text-center">
          <p className="mb-1 text-sm text-white/50">
            {lang === "pt" ? "Pontuação atual" : "Current score"}
          </p>
          <p className="text-5xl font-black text-white">{player.score}</p>
          <div className="mt-3 flex justify-center gap-2">
            {Array.from({ length: WIN_SCORE }).map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full transition-all"
                style={{
                  background: i < player.score ? player.color : "rgba(255,255,255,0.15)",
                  boxShadow: i < player.score ? `0 0 6px ${player.color}` : "none",
                }}
              />
            ))}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="w-full rounded-2xl py-4 text-xl font-black text-white"
          style={{
            background: `linear-gradient(135deg, ${player.color}, ${player.color}bb)`,
            boxShadow: `0 4px 20px ${player.color}60`,
            minWidth: 200,
          }}
        >
          +1 {lang === "pt" ? "ponto" : "point"}
        </motion.button>
        <button
          onClick={onClose}
          className="text-sm text-white/30 transition-colors hover:text-white/60"
        >
          {lang === "pt" ? "Cancelar" : "Cancel"}
        </button>
      </motion.div>
    </motion.div>
  );
}

function PacmanOverlay({
  winner,
  others,
  onDone,
}: {
  winner: Player;
  others: Player[];
  onDone: () => void;
}) {
  const N = others.length;
  const PSIZE = 56;
  const spacing = Math.min(72, 300 / Math.max(N, 1));
  const totalWidth = spacing * (N - 1);
  const positions = others.map((_, i) => i * spacing - totalWidth / 2);

  const [eatenIds, setEatenIds] = useState<Set<number>>(new Set());
  const [pacX, setPacX] = useState(-totalWidth / 2 - spacing * 2);
  const [pacScale, setPacScale] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await new Promise((r) => setTimeout(r, 300));
      for (let i = 0; i < others.length; i++) {
        if (cancelled) return;
        setPacX(positions[i]);
        await new Promise((r) => setTimeout(r, 480));
        if (cancelled) return;
        setEatenIds((prev) => new Set([...prev, others[i].id]));
        setPacScale((s) => s + 0.12);
        new Audio("/chomp.mp3").play().catch(() => {});
        await new Promise((r) => setTimeout(r, 180));
      }
      if (cancelled) return;
      setPacX(totalWidth / 2 + spacing * 2);
      await new Promise((r) => setTimeout(r, 300));
      if (!cancelled) new Audio("/veado.mp3").play().catch(() => {});
      await new Promise((r) => setTimeout(r, 400));
      if (!cancelled) onDone();
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center gap-10"
      style={{ background: "rgba(13,13,26,0.96)", zIndex: 100 }}
    >
      <p className="text-xl font-black text-white/60">nom nom nom... 😋</p>

      <div
        className="relative flex items-center justify-center"
        style={{ height: PSIZE + 16, width: Math.max(totalWidth + spacing * 4, 200) }}
      >
        {others.map((p, i) => (
          <AnimatePresence key={p.id}>
            {!eatenIds.has(p.id) && (
              <motion.div
                key="alive"
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute flex items-center justify-center rounded-full font-black text-white"
                style={{
                  width: PSIZE,
                  height: PSIZE,
                  background: p.color,
                  left: "50%",
                  marginLeft: positions[i] - PSIZE / 2,
                  fontSize: PSIZE * 0.32,
                  boxShadow: `0 0 14px ${p.color}80`,
                }}
              >
                {p.name.trim() ? p.name.trim()[0].toUpperCase() : p.id + 1}
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        <motion.div
          animate={{ x: pacX, scale: pacScale }}
          transition={{ duration: 0.42, ease: "easeInOut" }}
          className="absolute flex items-center justify-center"
          style={{ left: "50%", marginLeft: -PSIZE / 2 }}
        >
          <svg width={PSIZE} height={PSIZE} viewBox="0 0 100 100">
            <motion.path
              animate={{
                d: [
                  "M50,50 L95,20 A45,45 0 1,0 95,80 Z",
                  "M50,50 L95,49 A45,45 0 1,0 95,51 Z",
                  "M50,50 L95,20 A45,45 0 1,0 95,80 Z",
                ],
              }}
              transition={{ duration: 0.28, repeat: Infinity, ease: "easeInOut" }}
              fill={winner.color}
            />
          </svg>
          <span
            className="pointer-events-none absolute font-black text-white"
            style={{ fontSize: PSIZE * 0.3, marginLeft: -PSIZE * 0.07 }}
          >
            {winner.name.trim() ? winner.name.trim()[0].toUpperCase() : winner.id + 1}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function WinScreen({
  winner,
  lang,
  onReset,
}: {
  winner: Player;
  lang: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 text-center"
      style={{ background: "rgba(13,13,26,0.96)", zIndex: 100 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [0.5, 3], opacity: [0.7, 0] }}
          transition={{ duration: 2, delay: i * 0.7, repeat: Infinity }}
          className="pointer-events-none absolute rounded-full"
          style={{ width: 160, height: 160, border: `3px solid ${winner.color}` }}
        />
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full text-5xl font-black text-white"
        style={{
          background: winner.color,
          boxShadow: `0 0 80px ${winner.color}, 0 0 160px ${winner.color}60`,
        }}
      >
        {winner.name.trim() ? winner.name.trim()[0].toUpperCase() : winner.id + 1}
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-xl font-black text-white"
      >
        {winner.name}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="relative z-10 text-5xl font-black leading-tight"
        style={{
          background: `linear-gradient(90deg, ${DISCO.join(", ")})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {lang === "pt" ? "GANHOU! 🎉" : "YOU WIN! 🎉"}
      </motion.h2>
      {DISCO.map((color, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute h-3 w-3 rounded-full"
          animate={{ y: [0, -150, 0], x: [0, Math.sin(i * 1.1) * 120, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
          style={{ background: color }}
        />
      ))}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="relative z-10 mt-4 rounded-2xl border border-white/20 bg-white/10 text-lg font-black text-white"
        style={{ padding: "16px 48px" }}
      >
        {lang === "pt" ? "Jogar novamente" : "Play again"}
      </motion.button>
    </motion.div>
  );
}

function ManageModal({
  players,
  lang,
  onNewGame,
  onResetScores,
  onClose,
}: {
  players: Player[];
  lang: string;
  onNewGame: () => void;
  onResetScores: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", zIndex: 100 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 rounded-3xl"
        style={{
          background: "rgba(20,20,40,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 40px rgba(168,85,247,0.2)",
          minWidth: 300,
          maxWidth: 360,
          padding: "40px 36px 32px",
        }}
      >
        <p className="text-center text-lg font-black text-white">
          {lang === "pt" ? "Pontuação" : "Scoreboard"}
        </p>
        <div className="flex flex-col gap-2">
          {players.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                style={{ background: p.color }}
              >
                {p.name.trim() ? p.name.trim()[0].toUpperCase() : p.id + 1}
              </div>
              <span className="flex-1 truncate text-sm font-bold text-white/80">{p.name}</span>
              <div className="flex gap-1">
                {Array.from({ length: WIN_SCORE }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: i < p.score ? p.color : "rgba(255,255,255,0.12)",
                      boxShadow: i < p.score ? `0 0 5px ${p.color}` : "none",
                    }}
                  />
                ))}
              </div>
              <span className="w-6 text-right text-sm font-black text-white">{p.score}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <button
            onClick={onResetScores}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-black text-white/70 transition-colors hover:bg-white/10"
          >
            {lang === "pt" ? "Zerar pontuação" : "Reset scores"}
          </button>
          <button
            onClick={onNewGame}
            className="w-full rounded-2xl border border-red-400/20 bg-red-400/10 py-3 text-sm font-black text-red-300 transition-colors hover:bg-red-400/20"
          >
            {lang === "pt" ? "Novo jogo (trocar jogadores)" : "New game (change players)"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = (searchParams.get("lang") ?? "pt") as Language;
  const mode = (searchParams.get("mode") ?? "cute") as "cute" | "adult";

  const [players, setPlayers] = useState<Player[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [gamePhase, setGamePhase] = useState<"playing" | "pacman" | "win">("playing");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tapple_players");
      if (saved) setPlayers(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem("tapple_players", JSON.stringify(players));
    } else {
      localStorage.removeItem("tapple_players");
    }
  }, [players]);

  const addPoint = useCallback(
    (id: number) => {
      setSelectedId(null);
      setPlayers((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, score: p.score + 1 } : p));
        const w = next.find((p) => p.score >= WIN_SCORE);
        if (w) {
          setWinner(w);
          setGamePhase("pacman");
        }
        return next;
      });
    },
    []
  );

  const resetScores = () => {
    setPlayers([]);
    setWinner(null);
    setGamePhase("playing");
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-4"
      style={{ background: "#0d0d1a" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gridAutoRows: "260px",
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
        >
          {Array.from({ length: 40 }, (_, i) => (
            <img
              key={i}
              src={BG_IMAGES[i % BG_IMAGES.length]}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(13,13,26,0.55)" }}
      />

      <div
        className="blob-animation pointer-events-none absolute left-[-15%] top-[-15%] h-[500px] w-[500px] opacity-15"
        style={{ background: "radial-gradient(circle, #a855f7, transparent)", filter: "blur(80px)" }}
      />
      <div
        className="blob-animation pointer-events-none absolute bottom-[-15%] right-[-10%] h-[400px] w-[400px] opacity-15"
        style={{
          background: "radial-gradient(circle, #ec4899, transparent)",
          filter: "blur(70px)",
          animationDelay: "3s",
        }}
      />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => router.push(`/?lang=${lang}`)}
        className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 text-base text-white/50 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/80"
        style={{ padding: "14px 28px" }}
      >
        ← {lang === "pt" ? "Voltar" : "Back"}
      </motion.button>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => players.length > 0 ? setShowManage(true) : setShowSetup(true)}
        className="absolute right-6 top-6 z-10 flex flex-col items-center gap-0.5 transition-transform hover:scale-110 active:scale-95"
      >
        <span className="text-4xl">🏆</span>
        <span className="text-xs font-semibold text-white/50">{lang === "pt" ? "Pontuação" : "Score"}</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        <h1
          className="text-5xl font-black tracking-widest sm:text-6xl"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))",
          }}
        >
          TAPPLE
        </h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="text-sm">{lang === "pt" ? "🇧🇷" : "🇺🇸"}</span>
          <span className="text-sm text-white/30">{lang === "pt" ? "Português" : "English"}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10"
      >
        <SpinWheel language={lang} mode={mode} />
      </motion.div>

      <AnimatePresence>
        {players.length > 0 && gamePhase === "playing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10"
          >
            <MiniWheel players={players} onSelect={setSelectedId} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showManage && (
          <ManageModal
            players={players}
            lang={lang}
            onResetScores={() => {
              setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
              setWinner(null);
              setGamePhase("playing");
              setShowManage(false);
            }}
            onNewGame={() => {
              setPlayers([]);
              setWinner(null);
              setGamePhase("playing");
              setShowManage(false);
              setShowSetup(true);
            }}
            onClose={() => setShowManage(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSetup && (
          <PlayerSetup
            lang={lang}
            onReady={(p) => {
              setPlayers(p);
              setWinner(null);
              setGamePhase("playing");
              setShowSetup(false);
            }}
            onClose={() => setShowSetup(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedId !== null && gamePhase === "playing" && (
          <ScoreModal
            player={players.find((p) => p.id === selectedId)!}
            lang={lang}
            onAdd={() => addPoint(selectedId)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gamePhase === "pacman" && winner && (
          <PacmanOverlay
            winner={winner}
            others={players.filter((p) => p.id !== winner.id)}
            onDone={() => setGamePhase("win")}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gamePhase === "win" && winner && (
          <WinScreen winner={winner} lang={lang} onReset={resetScores} />
        )}
      </AnimatePresence>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense>
      <GameContent />
    </Suspense>
  );
}
