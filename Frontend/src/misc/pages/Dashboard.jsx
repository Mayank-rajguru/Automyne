"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import PredictionHero from "../../components/dashboard/PredictionHero";
import PriceSentimentChart from "../charts/PriceSentimentChart";
import KPISection from "../../components/dashboard/KPISection";
import DashboardSkeleton from "../../components/loading/DashboardSkeleton";
import AIInsightsPanel from "../../components/dashboard/AIInsightsPanel";
import LiveActivityFeed from "../../components/dashboard/LiveActivityFeed";
import ChartControls from "../charts/ChartControls";
import PredictionConfidenceGauge from "../charts/PredictionConfidenceGauge";
import {
  connectLiveSocket,
  subscribeToLiveEvents,
} from "../services/liveSocket";

const DEFAULT_TICKERS = ["GME", "AMC", "PLTR", "SPY", "QQQ"];

export default function Dashboard() {
  const [ticker, setTicker] = useState("GME");

  const [input, setInput] = useState("GME");

  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [chartData, setChartData] = useState([]);

  const [transitioning, setTransitioning] = useState(false);

  const [timeframe, setTimeframe] = useState("30D");

  const [showSentiment, setShowSentiment] = useState(true);

  const [smoothLines, setSmoothLines] = useState(true);

  const [liveEvents, setLiveEvents] = useState([]);

  const fetchPrediction = async (selectedTicker) => {
    try {
      setTransitioning(true);

      await new Promise((resolve) => setTimeout(resolve, 250));

      setLoading(true);

      setError("");

      const response = await axios.post("http://localhost:8000/run-pipeline", {
        ticker: selectedTicker,
      });

      const data = response.data;

      setChartData(data.chart_data || []);

      setPrediction({
        ...data.latest_signal,
        summary: data.summary,
      });

      setTicker(selectedTicker);
    } catch (err) {
      console.error(err);

      setError(err?.response?.data?.detail || "Failed to fetch prediction");
    } finally {
      setLoading(false);

      setTimeout(() => {
        setTransitioning(false);
      }, 300);
    }
  };

  useEffect(() => {
    fetchPrediction("GME");
  }, []);
  useEffect(() => {
    connectLiveSocket();

    const unsubscribe = subscribeToLiveEvents((event) => {
      setLiveEvents((prev) => [event, ...prev.slice(0, 9)]);
    });

    return unsubscribe;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    fetchPrediction(input.toUpperCase());
  };

  const filteredChartData = chartData.slice(
    -(timeframe === "7D"
      ? 7
      : timeframe === "14D"
        ? 14
        : timeframe === "30D"
          ? 30
          : 90),
  );
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-5xl font-black tracking-tight">Automyne</h1>

            <p className="mt-2 text-zinc-400">
              AI-powered market sentiment intelligence
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="Enter ticker..."
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 outline-none backdrop-blur-md transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
            />

            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold transition-all hover:scale-[1.03]"
            >
              Analyze
            </button>
          </form>
        </motion.div>

        {/* Quick Tickers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          {DEFAULT_TICKERS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setInput(t);

                fetchPrediction(t);
              }}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                ticker === t
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {/* Error */}
        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard */}
        <AnimatePresence mode="wait">
          {loading || transitioning ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <DashboardSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key={ticker}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
              }}
              className="space-y-8"
            >
              {/* Hero */}
              <PredictionHero
                ticker={ticker}
                prediction={prediction}
                loading={loading}
              />
              {/* KPI */}
              <KPISection prediction={prediction} />
              {/* Chart */}
              <div>
                <ChartControls
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                  showSentiment={showSentiment}
                  setShowSentiment={setShowSentiment}
                  smoothLines={smoothLines}
                  setSmoothLines={setSmoothLines}
                />

                <div className="grid gap-8 xl:grid-cols-3">
                  <div className="xl:col-span-2">
                    <PriceSentimentChart
                      data={filteredChartData}
                      showSentiment={showSentiment}
                      smoothLines={smoothLines}
                    />
                  </div>

                  <PredictionConfidenceGauge prediction={prediction} />
                </div>
              </div>
              <div className="grid gap-8 xl:grid-cols-2">
                <AIInsightsPanel prediction={prediction} />

                <LiveActivityFeed
                  prediction={prediction}
                  liveEvents={liveEvents}
                />
              </div>{" "}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
