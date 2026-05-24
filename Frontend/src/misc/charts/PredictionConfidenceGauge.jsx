"use client";

import { motion } from "framer-motion";

export default function PredictionConfidenceGauge({
  prediction,
}) {
  if (!prediction) return null;

  const bullishVotes =
    prediction.bullish_votes || 0;

  const bearishVotes =
    prediction.bearish_votes || 0;

  const signal =
    prediction.final_signal || "Neutral";

  const confidence =
    Math.min(
      100,
      Math.max(
        bullishVotes,
        bearishVotes
      ) * 25
    );

  const radius = 90;

  const stroke = 12;

  const normalizedRadius =
    radius - stroke * 0.5;

  const circumference =
    normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference -
    (confidence / 100) *
      circumference;

  const signalColors = {
    Bullish: "#22c55e",
    Bearish: "#ef4444",
    Neutral: "#eab308",
  };

  const color =
    signalColors[signal];

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Prediction Confidence
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          AI signal certainty estimation
        </p>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Glow */}
          <div
            className="absolute h-56 w-56 rounded-full blur-3xl opacity-20"
            style={{
              background: color,
            }}
          />

          {/* SVG */}
          <svg
            height={radius * 2}
            width={radius * 2}
            className="-rotate-90"
          >
            {/* Background */}
            <circle
              stroke="rgba(255,255,255,0.08)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />

            {/* Progress */}
            <motion.circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeDasharray={`${circumference} ${circumference}`}
              initial={{
                strokeDashoffset:
                  circumference,
              }}
              animate={{
                strokeDashoffset,
              }}
              transition={{
                duration: 1.4,
                ease: "easeOut",
              }}
            />
          </svg>

          {/* Center */}
          <div className="absolute flex flex-col items-center">
            <motion.h2
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="text-5xl font-black text-white"
            >
              {confidence}%
            </motion.h2>

            <p
              className="mt-2 text-sm font-medium"
              style={{
                color,
              }}
            >
              {signal}
            </p>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-10 grid w-full grid-cols-2 gap-4">
          <div className="rounded-2xl bg-black/20 p-4 text-center">
            <p className="text-sm text-zinc-400">
              Bullish Votes
            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-400">
              {bullishVotes}
            </h3>
          </div>

          <div className="rounded-2xl bg-black/20 p-4 text-center">
            <p className="text-sm text-zinc-400">
              Bearish Votes
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-400">
              {bearishVotes}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
}