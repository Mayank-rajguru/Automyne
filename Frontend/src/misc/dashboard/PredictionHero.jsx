"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BrainCircuit,
} from "lucide-react";

export default function PredictionHero({
  prediction,
  loading,
  ticker,
}) {
  const signal = prediction?.final_signal || "Neutral";

  const confidence =
    prediction?.confidence ??
    (signal === "Bullish"
      ? 78
      : signal === "Bearish"
      ? 72
      : 50);

  const sentiment =
    prediction?.avg_sentiment?.toFixed(2) || "0.00";

  const price =
    prediction?.close_price?.toFixed(2) || "0.00";

  const summary =
    prediction?.summary ||
    "AI is analyzing market sentiment and trading activity.";

  const signalConfig = {
    Bullish: {
      color: "text-green-400",
      bg: "from-green-500/20 to-emerald-500/10",
      border: "border-green-500/30",
      icon: TrendingUp,
    },

    Bearish: {
      color: "text-red-400",
      bg: "from-red-500/20 to-orange-500/10",
      border: "border-red-500/30",
      icon: TrendingDown,
    },

    Neutral: {
      color: "text-yellow-400",
      bg: "from-yellow-500/20 to-zinc-500/10",
      border: "border-yellow-500/30",
      icon: Minus,
    },
  };

  const current = signalConfig[signal];
  const Icon = current.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={ticker}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        className={`relative overflow-hidden rounded-3xl border ${current.border}
        bg-gradient-to-br ${current.bg}
        backdrop-blur-xl p-8 shadow-2xl`}
      >
        {/* Glow Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-purple-500 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-black/30 p-3">
                <BrainCircuit className="h-6 w-6 text-purple-300" />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                  AI Prediction
                </p>

                <h1 className="text-4xl font-bold text-white">
                  {ticker}
                </h1>
              </div>
            </div>

            {/* Signal */}
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${current.color}
              bg-black/30`}
            >
              <Icon className="h-4 w-4" />
              {signal}
            </div>

            {/* Summary */}
            <p className="max-w-2xl leading-relaxed text-zinc-300">
              {summary}
            </p>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-4 lg:min-w-[320px]">
            {/* Confidence */}
            <motion.div
              layout
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >
              <p className="text-sm text-zinc-400">
                Confidence
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {confidence}%
              </h2>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${confidence}%`,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500"
                />
              </div>
            </motion.div>

            {/* Price */}
            <motion.div
              layout
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >
              <p className="text-sm text-zinc-400">
                Current Price
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                ${price}
              </h2>
            </motion.div>

            {/* Sentiment */}
            <motion.div
              layout
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >
              <p className="text-sm text-zinc-400">
                Sentiment Score
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {sentiment}
              </h2>
            </motion.div>

            {/* Momentum */}
            <motion.div
              layout
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >
              <p className="text-sm text-zinc-400">
                Momentum
              </p>

              <h2 className={`mt-2 text-2xl font-bold ${current.color}`}>
                {signal === "Bullish"
                  ? "Rising"
                  : signal === "Bearish"
                  ? "Falling"
                  : "Stable"}
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <div className="space-y-4 text-center">
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />

              <p className="text-zinc-300">
                Running AI market analysis...
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}