import React, { useState } from 'react';
import { 
  Bell, 
  Globe, 
  ChevronDown, 
  ChevronRight,
  Wallet, 
  User, 
  LogOut, 
  ShieldCheck, 
  TrendingUp,
  Users,
  HelpCircle,
  Sparkles,
  Zap,
  Menu,
  X,
  Copy,
  Check,
  UserCheck,
  FileCheck,
  Search,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export default function Navbar({ 
  activeTab = 'Home', 
  setActiveTab = () => {}, 
  currentUser = null, 
  onLogout = () => {}, 
  onOpenAuth = () => {},
  isSidebarCollapsed = false,
  setIsSidebarCollapsed = () => {}
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [copiedUid, setCopiedUid] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Categorized Sidebar Navigation Sections
  const navSections = [
    {
      title: 'Main Menu',
      items: [
        { id: 'Home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'Accounts', label: 'Accounts', icon: UserCheck },
        { id: 'Funds', label: 'Funds & Wallet', icon: Wallet },
        { id: 'IbPortal', label: 'IB Partner Portal', icon: Users },
        { id: 'Analysis', label: 'Market Analysis', icon: TrendingUp },
        { id: 'Trade', label: 'Trade Terminal', icon: Zap, isNew: true, color: 'text-amber-400' },
        { id: 'Copy Trading', label: 'Copy Trading', icon: Sparkles, isNew: true, color: 'text-teal-300' }
      ]
    },
    {
      title: 'Tools & Support',
      items: [
        { id: 'Support', label: 'Support & Help', icon: HelpCircle, color: 'text-cyan-300' },
        { id: 'KYC', label: 'KYC Verification', icon: FileCheck, color: 'text-emerald-300' }
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { id: 'Profile', label: 'Profile & Security', icon: ShieldCheck, color: 'text-teal-300' }
      ]
    }
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'AR', name: 'العربية' },
    { code: 'ZH', name: '中文' },
    { code: 'FR', name: 'Français' },
  ];

  // Active Tab Title Lookup for Topbar Context
  const getTabTitle = (tabId) => {
    switch (tabId) {
      case 'Home': return 'Dashboard';
      case 'Accounts': return 'Accounts & Portfolios';
      case 'Funds': return 'Funds & Wallet Management';
      case 'IbPortal': return 'IB Partner Portal';
      case 'Analysis': return 'Market Analysis & Insights';
      case 'Trade': return 'Trade Terminal';
      case 'Copy Trading': return 'Copy Trading & Social';
      case 'Support': return 'Client Support & Helpdesk';
      case 'KYC': return 'KYC Verification';
      case 'Profile': return 'Profile & Security';
      default: return tabId;
    }
  };

  const isKycVerified = ['verified', 'approved', 'passed', 'completed'].includes((currentUser?.kyc_status || '').toLowerCase());
  const isKycPending = ['pending', 'in_review', 'under_review'].includes((currentUser?.kyc_status || '').toLowerCase());
  const isKycRejected = ['rejected', 'failed', 'declined'].includes((currentUser?.kyc_status || '').toLowerCase());

  // Filter items by search query if typed
  const filterItem = (item) => {
    if (!searchQuery.trim()) return true;
    return item.label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <>
      {/* ==================== 1. FIXED DESKTOP LEFT SIDEBAR ==================== */}
      <aside 
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-30 bg-gradient-to-b from-[#06241b] via-[#091f18] to-[#040e0b] text-slate-200 border-r border-emerald-900/40 shadow-2xl transition-all duration-300 select-none overflow-hidden ${
          isSidebarCollapsed ? 'w-20' : 'w-64 xl:w-70'
        }`}
      >
        {/* Subtle Ambient Radial Green Glow Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-800/20 via-transparent to-transparent pointer-events-none" />

        {/* Sidebar Brand Header */}
        <div className={`h-16 border-b border-emerald-900/40 flex items-center shrink-0 relative z-10 ${
          isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4'
        }`}>
          {!isSidebarCollapsed ? (
            <>
              {/* Expanded: Logo + Brand Title */}
              <div 
                onClick={() => setActiveTab('Home')}
                className="flex items-center gap-3 cursor-pointer group overflow-hidden"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-950/60 group-hover:scale-105 transition-all duration-200 shrink-0 relative">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative">
                    <span className="text-xl font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-cyan-300">V</span>
                    <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  </div>
                </div>

                <div className="flex flex-col truncate">
                  <span className="font-black text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1 leading-none">
                    Vintage<span className="text-emerald-400 font-extrabold">CRM</span>
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-emerald-300/70 font-bold leading-none mt-1">
                    Institutional Portal
                  </span>
                </div>
              </div>

              {/* Sidebar Collapse Toggle Button */}
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 text-emerald-300/70 hover:text-white hover:bg-emerald-900/40 rounded-xl transition-all cursor-pointer ml-2 shrink-0"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4.5 h-4.5" />
              </button>
            </>
          ) : (
            /* Collapsed: Perfectly Centered Logo Button with Hover Expand Action */
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-950/60 hover:scale-105 transition-all cursor-pointer relative group flex items-center justify-center shrink-0"
              title="Expand Sidebar"
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative">
                <span className="text-xl font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-cyan-300 group-hover:opacity-20 transition-opacity">V</span>
                <PanelLeftOpen className="w-5 h-5 text-emerald-400 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              </div>

              {/* Floating Tooltip */}
              <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-emerald-300 text-xs font-bold rounded-lg shadow-2xl border border-emerald-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
                <PanelLeftOpen className="w-3.5 h-3.5" />
                <span>Expand Sidebar</span>
              </div>
            </button>
          )}
        </div>

        {/* Sidebar Search Area */}
        <div className="px-3.5 pt-4 pb-2 relative z-10">
          {!isSidebarCollapsed ? (
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-emerald-400/60 pointer-events-none" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-emerald-950/40 text-slate-100 placeholder-emerald-400/50 text-xs rounded-xl pl-8 pr-7 py-2 border border-emerald-900/50 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition-all font-medium"
              />
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <span className="absolute right-2.5 text-[9px] font-mono text-emerald-400/60 border border-emerald-900/60 rounded px-1 py-0.2">
                  ⌘F
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/50 text-emerald-300 hover:text-white transition-all cursor-pointer group relative"
              title="Search menu (Expand Sidebar)"
            >
              <Search className="w-4 h-4" />
              <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-emerald-300 text-xs font-bold rounded-lg shadow-2xl border border-emerald-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Search Menu (⌘F)
              </div>
            </button>
          )}
        </div>

        {/* Sidebar Categorized Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 no-scrollbar relative z-10">
          {navSections.map((section, idx) => {
            const visibleItems = section.items.filter(filterItem);
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-3 text-[10px] uppercase font-black tracking-wider text-emerald-400/70 mb-1.5">
                    {section.title}
                  </div>
                )}

                {visibleItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;

                  // Expanded Sidebar Item View
                  if (!isSidebarCollapsed) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 cursor-pointer select-none ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/60 border border-emerald-400/30 scale-[1.01]'
                            : 'text-slate-300 hover:text-white hover:bg-emerald-900/30 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <IconComp 
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-white' : item.color || 'text-slate-400 group-hover:text-emerald-400'
                            }`} 
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.isNew && (
                            <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider ${
                              isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              NEW
                            </span>
                          )}
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          )}
                        </div>
                      </button>
                    );
                  }

                  // Collapsed Sidebar Icon View (Perfectly Centered)
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer relative group ${
                        isActive
                          ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-400/50 scale-105'
                          : 'text-slate-300 hover:text-white hover:bg-emerald-900/30'
                      }`}
                    >
                      <IconComp 
                        className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-white' : item.color || 'text-slate-400 group-hover:text-emerald-300'
                        }`} 
                      />

                      {/* Tooltip on Collapsed Icon Hover */}
                      <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl border border-emerald-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.isNew && (
                          <span className="px-1.5 py-0.2 text-[8px] font-black bg-emerald-500 text-white rounded">NEW</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Bottom User Profile Card */}
        <div className="mt-auto border-t border-emerald-900/40 p-3 bg-emerald-950/60 shrink-0 relative z-10">
          {!isSidebarCollapsed ? (
            <div className="p-2.5 bg-emerald-950/40 rounded-2xl border border-emerald-900/50 flex items-center justify-between gap-2">
              <div 
                onClick={() => setActiveTab('Profile')}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : 'T'}
                </div>

                <div className="flex flex-col truncate min-w-0">
                  <span className="text-xs font-bold text-slate-100 truncate group-hover:text-emerald-400 transition-colors">
                    {currentUser?.first_name || 'Trader'} {currentUser?.last_name || ''}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded ${
                      isKycVerified ? 'bg-emerald-500/20 text-emerald-300' :
                      isKycPending ? 'bg-amber-500/20 text-amber-300' :
                      isKycRejected ? 'bg-rose-500/20 text-rose-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {isKycVerified ? 'Verified ✅' : isKycPending ? 'Pending ⏳' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-2 bg-emerald-950/40 rounded-2xl border border-emerald-900/50">
              <div 
                onClick={() => setActiveTab('Profile')}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-md group relative"
              >
                {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : 'T'}
                <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl border border-emerald-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {currentUser?.first_name || 'Trader'} ({isKycVerified ? 'Verified ✅' : 'Unverified'})
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer group relative"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-rose-300 text-xs font-bold rounded-lg shadow-2xl border border-rose-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Sign Out
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ==================== 2. MAIN CONTENT TOPBAR HEADER ==================== */}
      <header className={`sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all duration-300 w-full ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64 xl:pl-70'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Toggle & Page Breadcrumb / Title */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle Icon */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Navigation Drawer"
            >
              {showMobileMenu ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>

            {/* Current Context Page Title & Subtitle */}
            <div className="flex flex-col">
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Portal</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-emerald-600 font-extrabold">{activeTab}</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {getTabTitle(activeTab)}
              </h1>
            </div>
          </div>

          {/* Right: Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Wallet Balance Display Pill */}
            <button 
              onClick={() => setActiveTab('Funds')}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 rounded-full text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-[11px] shadow-xs">
                $
              </div>
              <span>$0.00 <span className="text-[10px] text-slate-400 font-mono font-medium">USD</span></span>
            </button>

            {/* Deposit CTA Button */}
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
            <button 
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer" 
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile Avatar Dropdown */}
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

              {/* User Dropdown Menu */}
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
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        isKycVerified
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200/60'
                          : isKycPending
                          ? 'bg-amber-100 text-amber-800 border-amber-200/60 animate-pulse'
                          : isKycRejected
                          ? 'bg-rose-100 text-rose-800 border-rose-200/60'
                          : 'bg-slate-100 text-slate-700 border-slate-200/60'
                      }`}>
                        {isKycVerified ? 'Verified ✅' : isKycPending ? 'Pending ⏳' : isKycRejected ? 'Rejected ❌' : 'Not Verified'}
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

          </div>

        </div>
      </header>

      {/* ==================== 3. MOBILE NAVIGATION DRAWER ==================== */}
      {showMobileMenu && (
        <div className="lg:hidden">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40"
          />

          {/* Slide-out Drawer */}
          <div className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-gradient-to-b from-[#06241b] via-[#091f18] to-[#040e0b] text-slate-200 z-50 p-4 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 border-r border-emerald-900/40 overflow-y-auto no-scrollbar">
            
            {/* Mobile Drawer Brand Header */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px]">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <span className="text-lg font-serif italic font-black text-emerald-400">V</span>
                  </div>
                </div>
                <span className="font-black text-base text-white">
                  Vintage<span className="text-emerald-400">CRM</span>
                </span>
              </div>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Balance Header in Drawer */}
            <div className="my-4 p-3 bg-emerald-950/40 rounded-2xl border border-emerald-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  $
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-emerald-300/70 block leading-tight">Wallet Balance</span>
                  <span className="text-xs font-extrabold text-white">$0.00 USD</span>
                </div>
              </div>
              <button 
                onClick={() => { setActiveTab('Funds'); setShowMobileMenu(false); }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs cursor-pointer"
              >
                Top Up
              </button>
            </div>

            {/* Mobile Categorized Nav Links */}
            <div className="flex-1 space-y-4">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-wider text-emerald-400/70 px-2">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs' : 'text-slate-300 hover:bg-emerald-900/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : item.color || 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.isNew && (
                          <span className={`px-1.5 py-0.5 text-[8px] font-black rounded ${
                            isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            NEW
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Mobile Drawer Bottom User Footer */}
            <div className="pt-4 border-t border-emerald-900/40 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser?.first_name ? currentUser.first_name.charAt(0).toUpperCase() : 'T'}
                </div>
                <div className="truncate text-xs font-bold text-white">
                  {currentUser?.first_name || 'Trader'} {currentUser?.last_name || ''}
                </div>
              </div>
              <button
                onClick={() => { onLogout(); setShowMobileMenu(false); }}
                className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}


