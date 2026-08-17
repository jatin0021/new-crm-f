import React, { useState } from 'react';
import { 
  Bell, 
  Globe, 
  ChevronDown, 
  ChevronRight,
  Wallet, 
  Gift, 
  MoreHorizontal, 
  User, 
  LogOut, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  Users,
  HelpCircle,
  Sparkles,
  Zap,
  Menu,
  X,
  Copy,
  Check,
  Download,
  Key,
  UserCheck,
  Lock,
  FileCheck
} from 'lucide-react';

export default function Navbar({ activeTab = 'Home', setActiveTab = () => {}, currentUser = null, onLogout = () => {}, onOpenAuth = () => {} }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [copiedUid, setCopiedUid] = useState(false);

  // Centered Primary Nav Links (Dashboard, Accounts, Funds, IB Partner Portal, Market Analysis)
  const navItems = [
    { id: 'Home', label: 'Dashboard' },
    { id: 'Accounts', label: 'Accounts' },
    { id: 'Funds', label: 'Funds & Wallet' },
    { id: 'IbPortal', label: 'IB Partner Portal' },
    { id: 'Analysis', label: 'Market Analysis' }
  ];

  // Secondary Nav Links inside "More Options" Dropdown (Trade, Copy Trading, Support, KYC, Profile)
  const moreNavItems = [
    { id: 'Trade', label: 'Trade Terminal', icon: Zap, color: 'text-amber-500', isNew: true },
    { id: 'Copy Trading', label: 'Copy Trading / Social', icon: Sparkles, color: 'text-teal-600', isNew: true },
    { id: 'Support', label: 'Client Support & Help', icon: HelpCircle, color: 'text-cyan-600' },
    { id: 'KYC', label: 'KYC Verification', icon: FileCheck, color: 'text-indigo-600' },
    { id: 'Profile', label: 'Profile & Security', icon: ShieldCheck, color: 'text-blue-600' }
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'AR', name: 'العربية' },
    { code: 'ZH', name: '中文' },
    { code: 'FR', name: 'Français' },
  ];

  const isMoreTabActive = moreNavItems.some(item => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
      {/* Full-width header container */}
      <div className="w-full px-3.5 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Left: Brand Logo */}
          <div 
            onClick={() => { setActiveTab('Home'); setShowMobileMenu(false); }} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 p-[2px] shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-all duration-200 relative overflow-hidden">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative">
                <span className="text-xl sm:text-2xl tracking-tighter font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-cyan-300">V</span>
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg lg:text-xl tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1 leading-none">
                Vintage<span className="text-emerald-600 font-extrabold">CRM</span>
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-none mt-0.5">
                Institutional Portal
              </span>
            </div>
          </div>

          {/* Middle: Centered Desktop Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 mx-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 inline-flex items-center justify-center gap-1.5 leading-none select-none cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* More Options Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-full transition-all inline-flex items-center justify-center gap-1 cursor-pointer select-none ${
                  isMoreTabActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
                title="More Navigation Options"
              >
                <MoreHorizontal className="w-4 h-4" />
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {showMoreMenu && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowMoreMenu(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-100 mb-1">
                    More Applications & Tools
                  </div>

                  {moreNavItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button 
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setShowMoreMenu(false); }}
                        className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className={`w-4 h-4 ${item.color}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.isNew && (
                          <span className="px-1.5 py-0.5 text-[8px] font-black rounded-full uppercase bg-emerald-500 text-white">
                            NEW
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Wallet Balance Display Button */}
            <button 
              onClick={() => setActiveTab('Funds')}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 rounded-full text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs">
                $
              </div>
              <span>$0.00 <span className="text-[10px] text-slate-400 font-mono font-medium">USD</span></span>
            </button>

            {/* Deposit Pill CTA */}
            <button 
              onClick={() => setActiveTab('Funds')}
              className="px-3.5 sm:px-4.5 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold rounded-full transition-all shadow-md shadow-emerald-600/25 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors inline-flex items-center justify-center cursor-pointer text-xs font-bold gap-1"
                title="Change Language"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">{selectedLang}</span>
              </button>

              {showLangMenu && (
                <div 
                  className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in duration-150"
                  onMouseLeave={() => setShowLangMenu(false)}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.code); setShowLangMenu(false); }}
                      className={`w-full px-3.5 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        selectedLang === lang.code ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <button className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile Avatar / Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all border border-slate-200/80 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : 'T'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:block" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 mb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {currentUser?.first_name || 'Trader'} {currentUser?.last_name || ''}
                      </p>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200/60">
                        {currentUser?.kyc_status === 'verified' ? 'Verified' : 'Verified'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      {currentUser?.email || 'trader@example.com'}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>UID: <strong>891029</strong></span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('891029');
                          setCopiedUid(true);
                          setTimeout(() => setCopiedUid(false), 2000);
                        }}
                        className="text-emerald-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        {copiedUid ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUid ? 'Copied' : 'Copy UID'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button 
                      onClick={() => { setActiveTab('Profile'); setShowUserMenu(false); }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Security</span>
                    </button>

                    <button 
                      onClick={() => { setActiveTab('KYC'); setShowUserMenu(false); }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>KYC Verification</span>
                    </button>

                    <div className="my-1 border-t border-slate-100"></div>

                    <button 
                      onClick={() => { onLogout(); setShowUserMenu(false); }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Icon */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {showMobileMenu ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 shadow-xl animate-in slide-in-from-top-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
          
          {/* Quick Balance Header in Mobile Drawer */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                $
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Wallet Balance</span>
                <span className="text-sm font-extrabold text-slate-900">$0.00 USD</span>
              </div>
            </div>
            <button 
              onClick={() => { setActiveTab('Funds'); setShowMobileMenu(false); }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs"
            >
              Top Up
            </button>
          </div>

          {/* Primary Mobile Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-2 pt-1">Core Navigation</p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Mobile Navigation Links */}
          <div className="space-y-1 border-t border-slate-100 pt-2">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-2">Applications & Tools</p>
            {moreNavItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isNew && (
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                      isActive ? 'bg-cyan-300 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}

    </header>
  );
}
