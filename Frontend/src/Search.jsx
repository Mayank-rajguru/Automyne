import { useState } from "react";

function SearchModal({ isOpen, onClose, tickers, onSelect }) {
  const [query, setQuery] = useState("");
  
  if (!isOpen) return null;

  const filtered = tickers.filter(t => 
    t.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl mx-4 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for stocks... (e.g., GME, AMC, PLTR)"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            autoFocus
          />
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((ticker) => (
              <button
                key={ticker}
                onClick={() => {
                  onSelect(ticker);
                  onClose();
                  setQuery("");
                }}
                className="w-full px-4 py-3 rounded-lg hover:bg-slate-800/60 text-left transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-white">{ticker}</div>
                  <div className="text-xs text-slate-400">Click to view analysis</div>
                </div>
                <div className="text-sky-400 opacity-0 group-hover:opacity-100 transition">
                  View →
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">No stocks found</div>
          )}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={() => {
              onClose();
              setQuery("");
            }}
            className="w-full py-2 text-sm text-slate-400 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;