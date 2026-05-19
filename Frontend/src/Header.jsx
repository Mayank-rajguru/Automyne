import { TrendingUp, Search, Menu } from "lucide-react";

function AppHeader({ onSearch, searchOpen, setSearchOpen, onMenuClick }) {
  return (
    <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          
          {/* LEFT SIDE: Menu Button + Logo */}
          <div className="flex items-center gap-4">
            
            {/* Mobile Menu Toggle (Visible only on mobile) */}
            <button 
              onClick={onMenuClick} 
              className="text-slate-300 md:hidden p-1 hover:text-white transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Logo and App Name */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  Automyne
                </h1>
                <p className="text-xs text-slate-500">AI-Powered Market Intelligence</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  Automyne
                </h1>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Search Button */}
          <div className="flex items-center gap-3">
            
            {/* Desktop Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex px-4 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-700/50 text-slate-300 text-sm items-center gap-2 transition"
            >
              <Search className="w-4 h-4" />
              Search Stocks
            </button>
            
            {/* Mobile Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden text-slate-300 p-1 hover:text-white transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;