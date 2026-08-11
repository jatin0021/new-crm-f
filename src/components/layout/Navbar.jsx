import React, { useState } from 'react';
import { 
  Bell, 
  Globe, 
  ChevronDown, 
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
  X
} from 'lucide-react';

export default function Navbar({ activeTab = 'Home', setActiveTab = () => {} }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Full-width header container with fluid edge-to-edge padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-6 xl:gap-8">
            
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <div 
              onClick={() => { setActiveTab('Home'); setShowMobileMenu(false); }} 
              className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 flex items-center justify-center text-white font-extrabold shadow-sm group-hover:scale-105 transition-all duration-200 relative overflow-hidden">
                <span className="text-xl tracking-tighter font-serif italic">S</span>
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1 leading-none">
                  Succeed<span className="text-indigo-600 font-semibold">CRM</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold leading-none mt-0.5">
                  Capital Broker
                </span>
              </div>
            </div>

            {/* Desktop Nav Links - Fixed Vertical Alignment & Padding */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative px-3.5 py-2 text-xs font-bold rounded-full transition-all duration-150 inline-flex items-center justify-center gap-1.5 leading-none select-none ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.isNew && (
                      <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-full leading-none tracking-wider uppercase inline-flex items-center justify-center ${
                        isActive 
                          ? 'bg-amber-400 text-slate-950 font-black' 
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
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors inline-flex items-center justify-center"
                  title="More Navigation Options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {showMoreMenu && (
                  <div 
                    className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setShowMoreMenu(false)}
                  >
                    <button 
                      onClick={() => { setActiveTab('IBProgramme'); setShowMoreMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <Users className="w-4 h-4 text-indigo-500" />
                      IB Affiliate Partner
                    </button>
                    <button 
                      onClick={() => { setActiveTab('Analysis'); setShowMoreMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Market Analysis & News
                    </button>
                    <button 
                      onClick={() => { setActiveTab('Support'); setShowMoreMenu(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      Help & Support Center
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Wallet Balance Display Button */}
            <button 
              onClick={() => setActiveTab('Funds')}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full text-xs font-bold text-slate-800 transition-all hover:border-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-[11px]">
                $
              </div>
              <span>$0.00 <span className="text-[10px] text-slate-400 font-mono font-medium">USD</span></span>
            </button>

            {/* Deposit Pill CTA */}
            <button 
              onClick={() => setActiveTab('Funds')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-full transition-all shadow-xs hover:shadow active:scale-95 flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>

            {/* Bonus / Rewards Icon */}
            <button className="p-2 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-full transition-colors relative" title="Promotions & Bonuses">
              <Gift className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Bell Notifications */}
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 text-xs font-bold"
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
                      className={`w-full px-3.5 py-1.5 text-left text-xs font-medium flex items-center justify-between ${
                        selectedLang === lang.code ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] uppercase text-slate-400 font-mono">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 p-0.5 hover:ring-2 ring-indigo-500/20 rounded-full transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-700 shadow-xs">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Logged in as</p>
                    <p className="text-xs font-bold text-slate-900 truncate">john.trader@succeed.com</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 w-max px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Trader
                    </div>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => { setActiveTab('KYC'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      Profile Verification
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Pending</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('Accounts'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      MT5 Account Credentials
                    </button>
                    <button 
                      onClick={() => { setActiveTab('Admin'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center justify-between"
                    >
                      Back-Office Admin Portal
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.isNew && (
                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-500 text-white rounded-full">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button 
              onClick={() => { setActiveTab('IBProgramme'); setShowMobileMenu(false); }}
              className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-indigo-500" /> IB Affiliate Partner
            </button>
            <button 
              onClick={() => { setActiveTab('Analysis'); setShowMobileMenu(false); }}
              className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Market Analysis & News
            </button>
            <button 
              onClick={() => { setActiveTab('Support'); setShowMobileMenu(false); }}
              className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" /> Help & Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

