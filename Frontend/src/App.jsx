// import Dashboard from "./pages/Dashboard";

// function App() {
//   return <Dashboard />;
// }

// export default App;

import { act, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import { Activity, LayoutGrid, Bell, X } from "lucide-react";

import AppHeader from "./Header.jsx";
import SearchModal from "./Search.jsx";
import Sidebar from "./Sidebar.jsx";
import DashboardView from "./Dashboard.jsx";
import NotificationsView from "./Notification.jsx";
import { fetchTickerData } from "./services/api";
import { TICKERS } from "./Utils.jsx";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
);

export default function App() {
  const [activeTicker, setActiveTicker] = useState("GME");
  const [displayedTicker, setDisplayedTicker] = useState("GME");
  const [activeView, setActiveView] = useState("dashboard");
  const [cache, setCache] = useState({});
  const [data, setData] = useState([]);
  const [loadingTicker, setLoadingTicker] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Mobile Sidebar State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [subscriptions, setSubscriptions] = useState(
    TICKERS.reduce((acc, t) => ({ ...acc, [t]: false }), {}),
  );

  useEffect(() => {
    async function fetchData() {
      // =========================
      // Cached ticker
      // =========================

      if (cache[activeTicker]) {
        setLoadingTicker(null);

        setData(cache[activeTicker]);

        setDisplayedTicker(activeTicker);

        return;
      }

      // =========================
      // New ticker
      // =========================

      setLoadingTicker(activeTicker);

      try {
        const result = await fetchTickerData(activeTicker);

        if (!result.success) {
          console.error(result.error);

          return;
        }

        setCache((prev) => ({
          ...prev,

          [activeTicker]: result.data,
        }));

        // IMPORTANT:
        // Update ONLY after fetch finishes

        setData(result.data);

        setDisplayedTicker(activeTicker);
      } finally {
        setLoadingTicker(null);
      }
    }

    if (activeView === "dashboard") {
      fetchData();
    }
  }, [activeTicker, activeView]);

  const handleToggleSubscription = (ticker) => {
    setSubscriptions((prev) => ({ ...prev, [ticker]: !prev[ticker] }));
  };

  const handleSelectTicker = (ticker) => {
    setActiveTicker(ticker);
    setActiveView("dashboard");
    setMobileSidebarOpen(false);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setMobileSidebarOpen(false);
  };

  return (
    // Set min-h-screen and flex-col for the root container
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <AppHeader
        onSearch={() => setSearchOpen(true)}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        tickers={TICKERS}
        onSelect={handleSelectTicker}
      />

      {/* --- MOBILE SIDEBAR (Working) --- */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Sidebar Container */}
          <div className="relative w-72 bg-slate-900 h-[100dvh] shadow-2xl flex flex-col border-r border-slate-800">
            <div className="p-4 flex justify-end border-b border-slate-800 flex-shrink-0">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <Sidebar
                active={activeTicker}
                subscriptions={subscriptions}
                onToggleSubscription={handleToggleSubscription}
                onSelect={handleSelectTicker}
                activeView={activeView}
                onViewChange={handleViewChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: flex flex-1 overflow-hidden ensures it takes up remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- DESKTOP SIDEBAR FIX --- */}
        {/* Added flex-shrink-0 and h-full/min-h-0 to the wrapper */}
        <div className="hidden md:block w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 ">
          <Sidebar
            active={activeTicker}
            subscriptions={subscriptions}
            onToggleSubscription={handleToggleSubscription}
            onSelect={handleSelectTicker}
            activeView={activeView}
            onViewChange={handleViewChange}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-full md:max-w-7xl mx-auto pb-24 md:pb-8">
          {activeView === "dashboard" ? (
            <DashboardView
              data={data}
              ticker={displayedTicker}
              activeTicker={activeTicker}
              onSubscribe={() => handleToggleSubscription(activeTicker)}
              isSubscribed={subscriptions[activeTicker]}
              loading={!!loadingTicker}
            />
          ) : (
            <NotificationsView
              subscriptions={subscriptions}
              activeTicker={activeTicker}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 md:hidden">
        <div className="flex justify-around items-center h-16 safe-area-bottom">
          <button
            className={`flex flex-col items-center justify-center p-2 w-full ${
              activeView === "dashboard"
                ? "text-sky-400"
                : "text-slate-400 hover:text-sky-300"
            }`}
            onClick={() => handleViewChange("dashboard")}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Dashboard</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-2 w-full ${
              activeView === "notifications"
                ? "text-sky-400"
                : "text-slate-400 hover:text-sky-300"
            }`}
            onClick={() => handleViewChange("notifications")}
          >
            <Bell className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Alerts</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
