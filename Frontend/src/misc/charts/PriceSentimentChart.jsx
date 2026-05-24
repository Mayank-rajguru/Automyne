"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { motion } from "framer-motion";

export default function PriceSentimentChart({
  data = [],
  showSentiment = true,
  smoothLines = true,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
      }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Price vs Sentiment</h2>

          <p className="mt-1 text-sm text-zinc-400">
            AI market sentiment correlation
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />

            {/* Axes */}
            <XAxis dataKey="date" stroke="#888" tick={{ fill: "#888" }} />

            <YAxis yAxisId="left" stroke="#888" tick={{ fill: "#888" }} />

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888"
              tick={{ fill: "#888" }}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                color: "white",
              }}
            />

            {/* Legend */}
            <Legend />

            {/* Sentiment Area */}
            {showSentiment && (
              <Area
                yAxisId="left"
                type={smoothLines ? "monotone" : "linear"}
                dataKey="avg_sentiment"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.18}
                strokeWidth={3}
                animationDuration={1000}
              />
            )}

            {/* Price Line */}
            <Line
              yAxisId="right"
              type={smoothLines ? "monotone" : "linear"}
              dataKey="Close"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
