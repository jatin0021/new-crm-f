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
  Menu,
  X,
  Copy,
  Check,
  Download,
  Key
} from 'lucide-react';

export default function Navbar({ activeTab = 'Home', setActiveTab = () => {}, currentUser = null, onLogout = () => {}, onOpenAuth = () => {} }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [copiedUid, setCopiedUid] = useState(false);

  const navItems = [
    { id: 'Home', label: 'Dashboard' },
    { id: 'Accounts', label: 'Accounts' },
    { id: 'Funds', label: 'Funds & Wallet' },
    { id: 'Trade', label: 'Trade', isNew: true },
    { id: 'Copy Trading', label: 'Copy Trading', isNew: true },
    { id: 'V-Wallet', label: 'V-Wallet' },
    { id: 'Webinar', label: 'Webinar' },
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'AR', name: 'العربية' },
    { code: 'ZH', name: '中文' },
    { code: 'FR', name: 'Français' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
      {/* Full-width header container with fluid edge-to-edge padding */}
      <div className="w-full px-3.5 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-4 lg:gap-8 shrink-0">
            {/* Logo */}
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

            {/* Desktop Nav Links (Segmented Bar Design) */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60">
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
                    {item.isNew && (
                      <span className={`px-1.5 py-0.5 text-[8px] font-black rounded-full leading-none tracking-wider uppercase inline-flex items-center justify-center ${
                        isActive 
                          ? 'bg-cyan-300 text-emerald-950 font-black' 
                          : 'bg-emerald-500 text-white animate-pulse-subtle'
                      }`}>
                        NEW
                      </span>
                    )}
                  </button>
                );
              })}

              {/* More Options Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-full transition-colors inline-flex items-center justify-center cursor-pointer"
                  title="More Navigation Options"
                >
                  <MoreHorizontal className="w-4.5 h-4.5" />
                </button>

                {showMoreMenu && (
                  <div 
                    className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setShowMoreMenu(false)}
                  >
                    <button 
                      onClick={() => { setActiveTab('IBProgramme'); setShowMoreMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-emerald-600" />
                      IB Affiliate Partner
                    </button>
                    <button 
                      onClick={() => { setActiveTab('Analysis'); setShowMoreMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <TrendingUp className="w-4 h-4 text-teal-600" />
                      Market Analysis & News
                    </button>
                    <button 
                      onClick={() => { setActiveTab('Support'); setShowMoreMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-cyan-600" />
                      Help & Support Center
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wallet Balance Display Button (Desktop) */}
            <button 
              onClick={() => setActiveTab('Funds')}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 rounded-full text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs">
                $
              </div>
              <span>$0.00 <span className="text-[10px] text-slate-400 font-mono font-medium">USD</span></span>
            </button>

            {/* Deposit Pill CTA (Visible on Mobile & Desktop) */}
            <button 
              onClick={() => setActiveTab('Funds')}
              className="px-3.5 sm:px-4.5 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold rounded-full transition-all shadow-md shadow-emerald-600/25 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>

            {/* Bonus / Rewards Icon (Desktop) */}
            <button className="hidden sm:flex p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer" title="Promotions & Bonuses">
              <Gift className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Bell Notifications (Desktop) */}
            <button className="hidden sm:flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Language Selector (Desktop) */}
            <div className="hidden sm:block relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-5 h-5" />
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
                      className={`w-full px-3.5 py-1.5 text-left text-xs font-medium flex items-center justify-between cursor-pointer ${
                        selectedLang === lang.code ? 'text-emerald-600 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] uppercase text-slate-400 font-mono">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Icon ONLY */}
            <div className="relative shrink-0">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-0.5 hover:ring-2 ring-emerald-500/30 rounded-full transition-all cursor-pointer select-none"
                title="User Profile & Settings"
              >
                {/* Avatar badge with online status indicator */}
                <div className="relative w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-xs shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-xs overflow-hidden">
                    {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : 'T'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  {/* Profile Header Row */}
                  <div 
                    onClick={() => { setActiveTab('KYC'); setShowUserMenu(false); }}
                    className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-md shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-sm">
                          {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : 'T'}
                        </div>
                      </div>
                      
                      {/* User Info & UID */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                          {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}` : (currentUser?.email ? currentUser.email.split('@')[0] : 'Trader User')}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-500 font-semibold">
                            UID: {currentUser?.id ? 10000000 + currentUser.id : '11529598'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const uid = currentUser?.id ? (10000000 + currentUser.id).toString() : '11529598';
                              navigator.clipboard.writeText(uid);
                              setCopiedUid(true);
                              setTimeout(() => setCopiedUid(false), 2000);
                            }}
                            className="p-1 hover:bg-slate-200/60 rounded-md text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                            title="Copy UID"
                          >
                            {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {copiedUid && <span className="text-[10px] font-bold text-emerald-600 animate-in fade-in">Copied!</span>}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Arrow */}
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 text-slate-400 flex items-center justify-center transition-all shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Horizontal Divider Line */}
                  <div className="my-2 border-t border-slate-100"></div>

                  {/* Menu List Options */}
                  <div className="space-y-1">
                    
                    {/* Download */}
                    <button
                      onClick={() => {
                        alert('Downloading MT5 Desktop & Mobile Trading Terminal...');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 group text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                        <Download className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs font-bold text-slate-800 group-hover:text-slate-900">
                          Download
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">
                          MT5 Trading Apps & Terminal
                        </span>
                      </div>
                    </button>

                    {/* Verification */}
                    <button
                      onClick={() => { setActiveTab('KYC'); setShowUserMenu(false); }}
                      className="w-full px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 group text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold text-slate-800 group-hover:text-slate-900">
                            Verification
                          </span>
                          <span className="block text-[10px] text-slate-400 font-medium">
                            Profile & Identity Status
                          </span>
                        </div>
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      </div>
                    </button>

                    {/* Account Credentials */}
                    <button
                      onClick={() => { setActiveTab('Accounts'); setShowUserMenu(false); }}
                      className="w-full px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 group text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-xs">
                        <Key className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs font-bold text-slate-800 group-hover:text-slate-900">
                          MT5 Credentials
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">
                          Account Logins & Passwords
                        </span>
                      </div>
                    </button>


                    {/* Logout */}
                    <button
                      onClick={() => { setShowUserMenu(false); onLogout(); }}
                      className="w-full px-3 py-2.5 rounded-2xl hover:bg-rose-50/80 transition-all flex items-center gap-3 group text-left cursor-pointer border-t border-slate-100 mt-1"
                    >
                      <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs font-bold text-rose-600 group-hover:text-rose-700">
                          Logout
                        </span>
                        <span className="block text-[10px] text-rose-400 font-medium">
                          Sign out of your session safely
                        </span>
                      </div>
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

      {/* Mobile Drawer Menu Navigation */}
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

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-2 pt-1">Navigation</p>
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
                  {item.isNew && (
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                      isActive ? 'bg-cyan-300 text-emerald-950' : 'bg-emerald-500 text-white'
                    }`}>
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Partner & Tools Links */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-2 pt-1">Resources & Services</p>
            <button 
              onClick={() => { setActiveTab('IBProgramme'); setShowMobileMenu(false); }}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-600" /> IB Affiliate Partner
            </button>
            <button 
              onClick={() => { setActiveTab('Analysis'); setShowMobileMenu(false); }}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-teal-600" /> Market Analysis & News
            </button>
            <button 
              onClick={() => { setActiveTab('Support'); setShowMobileMenu(false); }}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-cyan-600" /> Help & Support
            </button>
          </div>

          {/* Languages in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-2 pb-1.5">Language</p>
            <div className="grid grid-cols-3 gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setSelectedLang(lang.code); setShowMobileMenu(false); }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-colors cursor-pointer ${
                    selectedLang === lang.code ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </header>
  );
}

