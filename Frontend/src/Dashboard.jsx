import { Bell, TrendingUp, Activity, AlertCircle, Sparkles } from "lucide-react";
import { Line } from "react-chartjs-2";

import { computeSentimentReturnCorrelation, sentimentLabel, sentimentColor } from "./Utils";
import KpiCard from "./components/cards.jsx";

function DashboardView({ data, ticker, onSubscribe, isSubscribed }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-pulse" />
          <div className="text-slate-400">Loading market data...</div>
        </div>
      </div>
    );
  }

  const last = data[data.length - 1];
  const window = data.slice(-30);
  const firstInWindow = window[0];
  
  const avgSentiment = window.reduce((sum, d) => sum + (d.avg_sentiment || 0), 0) / window.length;
  const totalPosts = window.reduce((sum, d) => sum + (d.num_posts || 0), 0);
  const corr = computeSentimentReturnCorrelation(window);
  const monthlyReturn = firstInWindow && last ? ((last.Close - firstInWindow.Close) / firstInWindow.Close) * 100 : NaN;

  // Chart
  const labels = data.map((d) => d.Date);
  const prices = data.map((d) => d.Close);
  const sentiments = data.map((d) => d.avg_sentiment);
  
  const chartData = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: prices,
        yAxisID: "yPrice",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0,
        borderColor: "rgba(56,189,248,1)",
        backgroundColor: "rgba(56,189,248,0.1)",
        fill: true
      },
      {
        label: "Sentiment Score",
        data: sentiments,
        yAxisID: "ySentiment",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0,
        borderColor: "rgba(16,185,129,1)",
        backgroundColor: "rgba(16,185,129,0.1)",
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#e5e7eb",
          font: { size: 12, weight: 500 },
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(100, 116, 139, 0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (ctx) => {
            const label = ctx.dataset.label || "";
            const v = ctx.parsed.y;
            if (label.includes("Sentiment")) return `${label}: ${v.toFixed(3)}`;
            return `${label}: $${v.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", maxTicksLimit: 8, font: { size: 11 } },
        grid: { color: "rgba(51, 65, 85, 0.3)", drawBorder: false }
      },
      yPrice: {
        position: "left",
        ticks: { color: "#56ccf2", font: { size: 11 } },
        grid: { color: "rgba(51, 65, 85, 0.3)", drawBorder: false }
      },
      ySentiment: {
        position: "right",
        min: -1,
        max: 1,
        ticks: { color: "#10b981", font: { size: 11 } },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Subscribe Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{ticker} Analysis</h2>
          <p className="text-sm text-slate-400">
            Real-time sentiment tracking from Reddit & social media
          </p>
        </div>
        <button
          onClick={onSubscribe}
          className={`px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 ${
            isSubscribed
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
        >
          <Bell className="w-4 h-4" />
          {isSubscribed ? "Subscribed" : "Subscribe for Alerts"}
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Current Price"
          value={`$${last.Close.toFixed(2)}`}
          subtitle={`Last updated: ${last.Date}`}
          trend={monthlyReturn}
          color="sky"
        />
        <KpiCard
          title="Sentiment Score"
          value={avgSentiment.toFixed(3)}
          subtitle={sentimentLabel(avgSentiment)}
          color="emerald"
        />
        <KpiCard
          title="Community Activity"
          value={totalPosts.toLocaleString()}
          subtitle="Total posts (30 days)"
          color="amber"
        />
        <KpiCard
          title="Correlation"
          value={Number.isNaN(corr) ? "N/A" : corr.toFixed(3)}
          subtitle="Sentiment vs. Returns"
          color="purple"
        />
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Price & Sentiment Trends</h3>
          <p className="text-sm text-slate-400">Historical correlation analysis</p>
        </div>
        <div className="h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white mb-1">Sentiment Trend</div>
                <div className="text-sm text-slate-400">
                  30-day average sentiment is <span className={sentimentColor(avgSentiment)}>{sentimentLabel(avgSentiment)}</span> with a score of {avgSentiment.toFixed(3)}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white mb-1">Activity Level</div>
                <div className="text-sm text-slate-400">
                  {totalPosts.toLocaleString()} posts analyzed over the past 30 days
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white mb-1">Predictive Signal</div>
                <div className="text-sm text-slate-400">
                  Sentiment-return correlation: {Number.isNaN(corr) ? "Insufficient data" : `${corr.toFixed(3)} (${Math.abs(corr) > 0.4 ? "Strong" : "Moderate"} signal)`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0 text-sky-400 font-semibold text-xs">
                1
              </div>
              <div>
                <span className="text-white font-medium">Multi-Source Data Ingestion:</span> We collect data from Reddit, Twitter, news APIs, and SEC filings in real-time.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 font-semibold text-xs">
                2
              </div>
              <div>
                <span className="text-white font-medium">AI Sentiment Analysis:</span> FinBERT and our custom LLM analyze sentiment, extract key themes, and identify market signals.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-semibold text-xs">
                3
              </div>
              <div>
                <span className="text-white font-medium">Intelligent Alerts:</span> Get notified when significant sentiment shifts, volume spikes, or news events occur for your subscribed stocks.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400 font-semibold text-xs">
                4
              </div>
              <div>
                <span className="text-white font-medium">Predictive Modeling:</span> Our system learns correlations between sentiment and price movements to provide actionable insights.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-200/90">
            <span className="font-semibold">Research Prototype:</span> This is a demonstration using historical 2021 data from Kaggle. Not financial advice. In production, this would analyze real-time data across multiple sources.
          </div>
        </div>
      </div>
    </div>
  );
}


export default DashboardView;