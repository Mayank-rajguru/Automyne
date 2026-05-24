"use client";

import CountUp from "react-countup";

import { motion } from "framer-motion";

import {
  TrendingUp,
  Activity,
  Brain,
  BarChart3,
} from "lucide-react";

const cards = [
  {
    key: "close_price",
    label: "Current Price",
    prefix: "$",
    icon: TrendingUp,
    color: "from-green-500/20 to-emerald-500/10",
    border: "border-green-500/20",
  },

  {
    key: "avg_sentiment",
    label: "Sentiment Score",
    icon: Brain,
    color: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/20",
  },

  {
    key: "bullish_votes",
    label: "Bullish Votes",
    icon: Activity,
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
  },

  {
    key: "bearish_votes",
    label: "Bearish Votes",
    icon: BarChart3,
    color: "from-red-500/20 to-orange-500/10",
    border: "border-red-500/20",
  },
];

export default function KPISection({
  prediction,
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        const value =
          Number(prediction?.[card.key]) || 0;

        return (
          <motion.div
            key={card.key}
            layout
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              scale: 1.03,
            }}
            className={`relative overflow-hidden rounded-3xl border ${card.border}
            bg-gradient-to-br ${card.color}
            p-6 backdrop-blur-xl`}
          >
            {/* Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-2xl bg-black/20 p-3">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
              </div>

              <p className="text-sm text-zinc-400">
                {card.label}
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                {card.prefix}

                <CountUp
                  end={value}
                  duration={1.2}
                  decimals={
                    card.key === "avg_sentiment"
                      ? 2
                      : 0
                  }
                />
              </h2>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}