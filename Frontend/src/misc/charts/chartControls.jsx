"use client";

import { motion } from "framer-motion";

const TIMEFRAMES = [
  "7D",
  "14D",
  "30D",
  "90D",
];

export default function ChartControls({
  timeframe,
  setTimeframe,
  showSentiment,
  setShowSentiment,
  smoothLines,
  setSmoothLines,
}) {
  return (
    <motion.div
      layout
      className="mb-5 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between"
    >
      {/* Timeframes */}
      <div>
        <p className="mb-3 text-sm text-zinc-400">
          Timeframe
        </p>

        <div className="flex flex-wrap gap-2">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() =>
                setTimeframe(tf)
              }
              className={`rounded-full px-4 py-2 text-sm transition-all duration-300
              ${
                timeframe === tf
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-black/20 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4">
        {/* Sentiment Toggle */}
        <button
          onClick={() =>
            setShowSentiment(
              !showSentiment
            )
          }
          className={`rounded-2xl px-4 py-3 text-sm transition-all
          ${
            showSentiment
              ? "bg-purple-500/20 text-purple-300"
              : "bg-black/20 text-zinc-400"
          }`}
        >
          Sentiment Overlay
        </button>

        {/* Smoothing Toggle */}
        <button
          onClick={() =>
            setSmoothLines(
              !smoothLines
            )
          }
          className={`rounded-2xl px-4 py-3 text-sm transition-all
          ${
            smoothLines
              ? "bg-cyan-500/20 text-cyan-300"
              : "bg-black/20 text-zinc-400"
          }`}
        >
          Smooth Curves
        </button>
      </div>
    </motion.div>
  );
}