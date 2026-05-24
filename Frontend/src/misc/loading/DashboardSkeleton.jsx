"use client";

import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

import { motion } from "framer-motion";

const loadingSteps = [
  "Collecting Reddit discussions...",
  "Running sentiment analysis...",
  "Generating trading signals...",
  "Analyzing market momentum...",
  "Generating AI insights...",
];

export default function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* AI Status */}
      <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {/* Spinner */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />

          <div>
            <h2 className="text-xl font-bold text-white">
              AI Market Analysis Running
            </h2>

            <p className="mt-1 text-zinc-400">
              Processing realtime sentiment and market data
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-3">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.2,
              }}
              className="flex items-center gap-3 text-sm text-zinc-300"
            >
              <div className="h-2 w-2 rounded-full bg-purple-400" />

              {step}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <Skeleton
          height={50}
          width={260}
          baseColor="#111827"
          highlightColor="#1f2937"
        />

        <div className="mt-6">
          <Skeleton
            height={32}
            width={180}
            baseColor="#111827"
            highlightColor="#1f2937"
          />
        </div>

        <div className="mt-8 space-y-3">
          <Skeleton
            height={18}
            baseColor="#111827"
            highlightColor="#1f2937"
          />

          <Skeleton
            height={18}
            width="85%"
            baseColor="#111827"
            highlightColor="#1f2937"
          />
        </div>
      </div>

      {/* KPI Skeletons */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <Skeleton
              circle
              width={50}
              height={50}
              baseColor="#111827"
              highlightColor="#1f2937"
            />

            <div className="mt-6">
              <Skeleton
                height={18}
                width={120}
                baseColor="#111827"
                highlightColor="#1f2937"
              />

              <div className="mt-4">
                <Skeleton
                  height={40}
                  width={160}
                  baseColor="#111827"
                  highlightColor="#1f2937"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <Skeleton
          height={28}
          width={220}
          baseColor="#111827"
          highlightColor="#1f2937"
        />

        <div className="mt-8">
          <Skeleton
            height={320}
            baseColor="#111827"
            highlightColor="#1f2937"
          />
        </div>
      </div>
    </motion.div>
  );
}