"use client";

import { motion } from "framer-motion";

import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldAlert,
} from "lucide-react";

export default function AIInsightsPanel({
  prediction,
}) {
  if (!prediction) return null;

  const signal =
    prediction.final_signal || "Neutral";

  const bullishVotes =
    prediction.bullish_votes || 0;

  const bearishVotes =
    prediction.bearish_votes || 0;

  const sentiment =
    Number(
      prediction.avg_sentiment || 0
    );

  const confidence =
    Math.max(
      bullishVotes,
      bearishVotes
    ) * 25;

  const insights = [];

  // Signal insight
  if (signal === "Bullish") {
    insights.push({
      icon: TrendingUp,
      title: "Bullish Momentum",
      description:
        "Positive sentiment indicators and momentum signals suggest upward market bias.",
      color: "text-green-400",
      bg: "from-green-500/20 to-emerald-500/10",
    });
  }

  if (signal === "Bearish") {
    insights.push({
      icon: TrendingDown,
      title: "Bearish Pressure",
      description:
        "Negative market sentiment and weakening momentum indicate downside pressure.",
      color: "text-red-400",
      bg: "from-red-500/20 to-orange-500/10",
    });
  }

  // Sentiment insight
  insights.push({
    icon: BrainCircuit,
    title: "Sentiment Analysis",
    description:
      sentiment > 0
        ? "Social sentiment remains positive across recent discussions."
        : "Community sentiment remains cautious or negative.",
    color: "text-purple-400",
    bg: "from-purple-500/20 to-pink-500/10",
  });

  // Confidence insight
  insights.push({
    icon: Activity,
    title: "Prediction Confidence",
    description: `Model confidence estimated around ${confidence}% based on signal agreement.`,
    color: "text-cyan-400",
    bg: "from-cyan-500/20 to-blue-500/10",
  });

  // Risk insight
  insights.push({
    icon: ShieldAlert,
    title: "Risk Assessment",
    description:
      bullishVotes === bearishVotes
        ? "Mixed indicators detected. Market conditions remain uncertain."
        : "Current market indicators show directional consistency.",
    color: "text-yellow-400",
    bg: "from-yellow-500/20 to-orange-500/10",
  });

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-purple-500/20 p-3">
          <BrainCircuit className="h-6 w-6 text-purple-300" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Insights
          </h2>

          <p className="text-sm text-zinc-400">
            Model interpretation and reasoning
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.bg} p-5`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-black/20 p-2">
                  <Icon
                    className={`h-5 w-5 ${item.color}`}
                  />
                </div>

                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-zinc-300">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}