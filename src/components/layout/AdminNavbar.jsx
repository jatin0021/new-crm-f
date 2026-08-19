import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  DollarSign, 
  Terminal, 
  Server, 
  Settings, 
  LogOut, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Search, 
  X, 
  Menu, 
  ChevronRight,
  ShieldAlert,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function AdminNavbar({ 
  adminTab = 'users', 
  setAdminTab = () => {}, 
  adminUser = {}, 
  onAdminLogout = () => {},
  isAdminSidebarCollapsed = false,
  setIsAdminSidebarCollapsed = () => {},
  usersCount = 0,
  pendingKycCount = 0
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Categorized Admin Navigation Sections
  const navSections = [
    {
      title: 'User Management',
      items: [
        { id: 'users', label: 'Traders & Impersonation', icon: Users, count: usersCount },
        { id: 'kyc', label: 'KYC Verifications', icon: ShieldCheck, count: pendingKycCount, isPendingBadge: true }
      ]
    },
    {
      title: 'Operations & Analytics',
      items: [
        { id: 'analytics', label: 'Executive Analytics & KPIs', icon: BarChart3, color: 'text-amber-400' },
        { id: 'financial_ops', label: 'Financial Ops & Gateways', icon: DollarSign, color: 'text-emerald-400' },
        { id: 'terminal', label: 'Terminal & Risk Control', icon: Terminal, color: 'text-cyan-400' }
      ]
    },
    {
      title: 'System & Security',
      items: [
        { id: 'health', label: 'System Infrastructure', icon: Server, color: 'text-teal-300' },
        { id: 'profile', label: 'Admin Profile & Security', icon: Settings, color: 'text-indigo-400' }
      ]
    }
  ];

  // Tab Title Lookup
  const getTabTitle = (tabId) => {
    switch (tabId) {
      case 'users': return 'Traders & Impersonation Desk';
      case 'kyc': return 'KYC Verification Desk';
      case 'analytics': return 'Executive Analytics & KPIs';
      case 'financial_ops': return 'Financial Ops & Payment Gateways';
      case 'terminal': return 'Terminal & Risk Management Desk';
      case 'health': return 'System Infrastructure & Health';
      case 'profile': return 'Admin Profile & Security';
      default: return 'Back-Office Admin Console';
    }
  };

  const filterItem = (item) => {
    if (!searchQuery.trim()) return true;
    return item.label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <>
      {/* ==================== 1. FIXED DESKTOP ADMIN LEFT SIDEBAR ==================== */}
      <aside 
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-30 bg-gradient-to-b from-[#06241b] via-[#091f18] to-[#040e0b] text-slate-200 border-r border-emerald-900/40 shadow-2xl transition-all duration-300 select-none overflow-hidden ${
          isAdminSidebarCollapsed ? 'w-20' : 'w-64 xl:w-70'
        }`}
      >
        {/* Ambient Radial Green Glow Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-800/20 via-transparent to-transparent pointer-events-none" />

        {/* Sidebar Admin Brand Header */}
        <div className={`h-16 border-b border-emerald-900/40 flex items-center shrink-0 relative z-10 ${
          isAdminSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4'
        }`}>
          {!isAdminSidebarCollapsed ? (
            <>
              {/* Expanded: Admin Logo + Brand Title */}
              <div className="flex items-center gap-3 group overflow-hidden cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-950/60 shrink-0 relative">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div className="flex flex-col truncate">
                  <span className="font-black text-base tracking-tight text-white flex items-center gap-1 leading-none">
                    Vintage<span className="text-emerald-400 font-extrabold">ADMIN</span>
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-emerald-300/70 font-bold leading-none mt-1">
                    Back-Office Broker Desk
                  </span>
                </div>
              </div>

              {/* Sidebar Collapse Toggle Button */}
              <button
                onClick={() => setIsAdminSidebarCollapsed(true)}
                className="p-1.5 text-emerald-300/70 hover:text-white hover:bg-emerald-900/40 rounded-xl transition-all cursor-pointer ml-2 shrink-0"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4.5 h-4.5" />
              </button>
            </>
          ) : (
            /* Collapsed: Single Centered Logo Button with Hover Expand Action */
            <button
              onClick={() => setIsAdminSidebarCollapsed(false)}
              className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-950/60 hover:scale-105 transition-all cursor-pointer relative group flex items-center justify-center shrink-0"
              title="Expand Sidebar"
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative">
                <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:opacity-20 transition-opacity" />
                <PanelLeftOpen className="w-5 h-5 text-emerald-400 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Floating Tooltip */}
              <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-emerald-300 text-xs font-bold rounded-lg shadow-2xl border border-emerald-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
                <PanelLeftOpen className="w-3.5 h-3.5" />
                <span>Expand Admin Sidebar</span>
              </div>
            </button>
          )}
        </div>

        {/* Sidebar Search Area */}
        <div className="px-3.5 pt-4 pb-2 relative z-10">
          {!isAdminSidebarCollapsed ? (
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-emerald-400/60 pointer-events-none" />
              <input
                type="text"
                placeholder="Search admin..."
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
              onClick={() => setIsAdminSidebarCollapsed(false)}
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/50 text-emerald-300 hover:text-white transition-all cursor-pointer group relative"
              title="Search menu (Expand Sidebar)"
            >
              <Search className="w-4 h-4" />
              <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-emerald-300 text-xs font-bold rounded-lg shadow-2xl border border-emerald-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Search Admin (⌘F)
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
                {!isAdminSidebarCollapsed && (
                  <div className="px-3 text-[10px] uppercase font-black tracking-wider text-emerald-400/70 mb-1.5">
                    {section.title}
                  </div>
                )}

                {visibleItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = adminTab === item.id;

                  // Expanded Sidebar Item
                  if (!isAdminSidebarCollapsed) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => setAdminTab(item.id)}
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

                        {item.count !== undefined && (
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded-full ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  }

                  // Collapsed Sidebar Centered Icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setAdminTab(item.id)}
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

                      {/* Tooltip on Collapsed Hover */}
                      <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl border border-emerald-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.count !== undefined && (
                          <span className="px-1.5 py-0.2 text-[8px] font-black bg-emerald-500 text-white rounded">
                            {item.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Bottom Admin User Profile Card */}
        <div className="mt-auto border-t border-emerald-900/40 p-3 bg-emerald-950/60 shrink-0 relative z-10">
          {!isAdminSidebarCollapsed ? (
            <div className="p-2.5 bg-emerald-950/40 rounded-2xl border border-emerald-900/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  A
                </div>

                <div className="flex flex-col truncate min-w-0">
                  <span className="text-xs font-bold text-slate-100 truncate">
                    {adminUser.email || 'admin@vintagecrm.com'}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {adminUser.role || 'Super Admin'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onAdminLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer shrink-0"
                title="Logout Admin Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-2 bg-emerald-950/40 rounded-2xl border border-emerald-900/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs shadow-md group relative">
                A
                <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-2xl border border-emerald-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {adminUser.email || 'admin@vintagecrm.com'} ({adminUser.role || 'Super Admin'})
                </div>
              </div>

              <button
                onClick={onAdminLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors cursor-pointer group relative"
                title="Logout Admin Session"
              >
                <LogOut className="w-4 h-4" />
                <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-rose-300 text-xs font-bold rounded-lg shadow-2xl border border-rose-800/60 z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Logout Admin
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ==================== 2. MAIN CONTENT ADMIN TOPBAR HEADER ==================== */}
      <header className={`sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/90 shadow-md transition-all duration-300 w-full ${
        isAdminSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64 xl:pl-70'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Toggle & Context Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Navigation Drawer"
            >
              {showMobileMenu ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>

            <div className="flex flex-col">
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Admin Console</span>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <span className="text-emerald-400 font-extrabold">{adminTab}</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white leading-tight">
                {getTabTitle(adminTab)}
              </h1>
            </div>
          </div>

          {/* Right: Controls & Admin Logout */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Admin Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                A
              </div>
              <span className="text-xs font-bold text-slate-200">
                {adminUser.email || 'admin@vintagecrm.com'}
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                {adminUser.role || 'Super Admin'}
              </span>
            </div>

            {/* Logout Admin */}
            <button
              onClick={onAdminLogout}
              className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Logout Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* ==================== 3. MOBILE ADMIN DRAWER ==================== */}
      {showMobileMenu && (
        <div className="lg:hidden">
          <div 
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40"
          />

          <div className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-gradient-to-b from-[#06241b] via-[#091f18] to-[#040e0b] text-slate-200 z-50 p-4 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 border-r border-emerald-900/40 overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px]">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <span className="font-black text-base text-white">
                  Vintage<span className="text-emerald-400">ADMIN</span>
                </span>
              </div>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 my-4">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-[10px] uppercase font-black tracking-wider text-emerald-400/70 px-2">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const IconComp = item.icon;
                    const isActive = adminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setAdminTab(item.id); setShowMobileMenu(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs' : 'text-slate-300 hover:bg-emerald-900/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : item.color || 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-emerald-900/40 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  A
                </div>
                <div className="truncate text-xs font-bold text-white">
                  {adminUser.email || 'admin@vintagecrm.com'}
                </div>
              </div>
              <button
                onClick={() => { onAdminLogout(); setShowMobileMenu(false); }}
                className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl cursor-pointer"
                title="Logout Admin"
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
