import { TICKERS } from "./Utils.jsx";
import { Bell, CheckCircle, Activity, Sparkles } from "lucide-react";

function Sidebar({ active, subscriptions, onToggleSubscription, onSelect, activeView, onViewChange }) {
  const subscribedTickers = TICKERS.filter(t => subscriptions[t]);
  
  return (
    // CHANGED: w-72 -> w-full, added h-full. 
    // This ensures it fills the parent container from App.jsx completely.
    <aside className="w-full h-full border-r border-slate-800/50 bg-slate-950/40 backdrop-blur-xl flex flex-col">
      
      {/* Navigation Section */}
      <div className="p-6 border-b border-slate-800/50">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Navigation
        </h2>
        <div className="space-y-2">
          <button
            onClick={() => onViewChange("dashboard")}
            className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-3 ${
              activeView === "dashboard"
                ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => onViewChange("notifications")}
            className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-3 ${
              activeView === "notifications"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
            {subscribedTickers.length > 0 && (
              <span className="ml-auto bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                {subscribedTickers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Stock List */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Subscribed Stocks
        </h2>
        {subscribedTickers.length > 0 ? (
          <div className="space-y-2">
            {subscribedTickers.map((ticker) => (
              <button
                key={ticker}
                onClick={() => onSelect(ticker)}
                className={`w-full px-4 py-3 rounded-lg text-left transition group ${
                  active === ticker
                    ? "bg-slate-800/60 border border-slate-700"
                    : "hover:bg-slate-800/30 border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{ticker}</div>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs text-slate-500 mt-1">Subscribed</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500 text-center py-8">
            No subscriptions yet. Subscribe to stocks to get AI-powered alerts!
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-800/50">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            All Available Stocks
          </h2>
          <div className="flex flex-wrap gap-2">
            {TICKERS.map((ticker) => (
              <button
                key={ticker}
                onClick={() => onSelect(ticker)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  active === ticker
                    ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                    : subscriptions[ticker]
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:border-sky-500/30"
                }`}
              >
                {ticker}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / AI Promo */}
      <div className="p-6 border-t border-slate-800/50 bg-slate-950/60 mt-auto">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20">
          <Sparkles className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-sky-300 mb-1">AI-Powered Insights</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Our LLM analyzes millions of data points from Reddit, news, and market data.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;