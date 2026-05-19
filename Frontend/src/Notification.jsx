import { Bell, Activity, AlertCircle, Sparkles } from "lucide-react";
import { TICKERS, generateNotifications } from "./Utils.jsx";


function NotificationsView({ subscriptions, activeTicker }) {
  const subscribedTickers = TICKERS.filter(t => subscriptions[t]);
  const allNotifications = subscribedTickers.flatMap(t => generateNotifications(t));

  const severityIcon = (severity) => {
    if (severity === "high") return <AlertCircle className="w-5 h-5 text-rose-400" />;
    if (severity === "medium") return <Activity className="w-5 h-5 text-amber-400" />;
    return <Bell className="w-5 h-5 text-sky-400" />;
  };

  const severityColor = (severity) => {
    if (severity === "high") return "border-rose-500/30 bg-rose-500/5";
    if (severity === "medium") return "border-amber-500/30 bg-amber-500/5";
    return "border-sky-500/30 bg-sky-500/5";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Notification Center</h2>
        <p className="text-sm text-slate-400">
          AI-powered alerts for your subscribed stocks
        </p>
      </div>

      {subscribedTickers.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-sm p-12 text-center">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Active Subscriptions</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Subscribe to stocks from the dashboard to start receiving intelligent alerts about sentiment shifts, volume spikes, and market-moving news.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-slate-400">Subscribed to:</span>
            {subscribedTickers.map(t => (
              <span key={t} className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                {t}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            {allNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`rounded-2xl border p-6 backdrop-blur-sm transition hover:border-slate-700 ${severityColor(notif.severity)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {severityIcon(notif.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-white mb-1">
                          {notif.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-300 font-medium">
                            {notif.ticker}
                          </span>
                          <span>•</span>
                          <span>{notif.time}</span>
                          <span>•</span>
                          <span className="capitalize">{notif.type}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">
                      {notif.summary}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-500">Sources:</span>
                      {notif.sources.map((source, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-slate-800/40 text-slate-400">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-sky-200/90">
                <span className="font-semibold">Production Features:</span> In the live system, you'll receive real-time push notifications via email/SMS when significant events occur. Our LLM will provide 2-3 bullet summaries of complex market movements.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationsView;