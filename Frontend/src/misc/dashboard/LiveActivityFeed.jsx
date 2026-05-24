"use client";

import { motion, AnimatePresence } from "framer-motion";

import {
  TrendingUp,
  TrendingDown,
  BrainCircuit,
  Activity,
  Radar,
} from "lucide-react";

const getActivityItems = (prediction) => {
  if (!prediction) return [];

  const signal = prediction.final_signal || "Neutral";

  const sentiment = Number(prediction.avg_sentiment || 0);

  const bullishVotes = prediction.bullish_votes || 0;

  const bearishVotes = prediction.bearish_votes || 0;

  return [
    {
      id: 1,
      icon: BrainCircuit,
      title: "AI Sentiment Analysis Completed",
      description:
        sentiment > 0
          ? "Market sentiment trending positive."
          : "Market sentiment trending cautious.",
      color: "text-purple-400",
      time: "Now",
    },

    {
      id: 2,
      icon: signal === "Bullish" ? TrendingUp : TrendingDown,
      title: `Signal Changed → ${signal}`,
      description:
        signal === "Bullish"
          ? "Bullish momentum indicators strengthened."
          : "Bearish pressure detected.",
      color: signal === "Bullish" ? "text-green-400" : "text-red-400",
      time: "2m ago",
    },

    {
      id: 3,
      icon: Activity,
      title: "Momentum Scan Completed",
      description: `${bullishVotes} bullish indicators vs ${bearishVotes} bearish indicators.`,
      color: "text-cyan-400",
      time: "5m ago",
    },

    {
      id: 4,
      icon: Radar,
      title: "Market Volatility Updated",
      description: "Realtime monitoring systems remain active.",
      color: "text-yellow-400",
      time: "Live",
    },
  ];
};

export default function LiveActivityFeed({ prediction, liveEvents = [] }) {
  const items = [...realtimeItems, ...getActivityItems(prediction)];
  const realtimeItems = liveEvents.map((event, index) => ({
    id: `live-${index}`,
    title: event.event,
    description: `Signal strength ${event.signal_strength}% | Sentiment shift ${event.sentiment_shift}`,
    color: "text-cyan-400",
    time: "Live",
  }));
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Activity</h2>

          <p className="mt-1 text-sm text-zinc-400">
            Realtime AI system events
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          LIVE
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        <AnimatePresence>
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{
                  x: 4,
                }}
                className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-black/20 p-4 transition-all hover:border-white/10"
              >
                {/* Icon */}
                <div className="rounded-2xl bg-black/30 p-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title}</h3>

                    <span className="text-xs text-zinc-500">{item.time}</span>
                  </div>

                  <p className="mt-1 text-sm text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
