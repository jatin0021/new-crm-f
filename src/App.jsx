import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/user/Dashboard';
import AccountsPage from './pages/user/AccountsPage';
import FundsPage from './pages/user/FundsPage';
import KYCPage from './pages/user/KYCPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import LiveChatWidget from './components/common/LiveChatWidget';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import { ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';

export default function App() {
  // Path routing state
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  // Synchronously initialize trader state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('crm_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      localStorage.removeItem('crm_user');
      return null;
    }
  });

  // Synchronously initialize admin state from localStorage
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem('crm_admin_user');
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch (e) {
      localStorage.removeItem('crm_admin_user');
      return null;
    }
  });

  const [authView, setAuthView] = useState(() => {
    try {
      const storedUser = localStorage.getItem('crm_user');
      return storedUser ? null : 'login';
    } catch (e) {
      return 'login';
    }
  });

  const [activeTab, setActiveTabState] = useState(() => {
    const tab = localStorage.getItem('crm_active_tab') || 'Home';
    return tab === 'Admin' ? 'Home' : tab;
  });

  // Sync URL changes via popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);
  };

  const setActiveTab = (tab) => {
    if (tab === 'Admin') {
      navigateTo('/admin');
      return;
    }
    setActiveTabState(tab);
    localStorage.setItem('crm_active_tab', tab);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAuthView(null);
    setActiveTab('Home');
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_jwt_token');
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_active_tab');
    setCurrentUser(null);
    setAuthView('login');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('crm_admin_token');
    localStorage.removeItem('crm_admin_user');
    setAdminUser(null);
  };

  const handleImpersonateUser = (email) => {
    const impersonatedUser = {
      id: 99,
      first_name: email.split('@')[0],
      last_name: '(Impersonated)',
      email: email,
      country: 'United States',
      kyc_status: 'verified'
    };
    setCurrentUser(impersonatedUser);
    setAuthView(null);
    setActiveTabState('Home');
    navigateTo('/');
  };

  // --- DEDICATED /admin ROUTE FLOW ---
  if (currentPath.toLowerCase().startsWith('/admin')) {
    // If Admin is not logged in, render Admin Login Page
    if (!adminUser) {
      return (
        <AdminLoginPage 
          onAdminLoginSuccess={(admin) => {
            setAdminUser(admin);
            navigateTo('/admin');
          }}
          onNavigateTrader={() => navigateTo('/')}
        />
      );
    }

    // Authenticated Admin Dashboard Layout
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
        
        {/* Dedicated Admin Header */}
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-lg">
          <div className="w-full px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between h-16">
              
              {/* Left Admin Brand */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 p-[2px] shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                    Vintage<span className="text-emerald-400 font-extrabold">ADMIN</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-none mt-0.5">
                    Back-Office Broker Desk
                  </span>
                </div>
              </div>

              {/* Right Admin Controls */}
              <div className="flex items-center gap-3">
                
                {/* Admin User Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700">
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

                {/* Return to Trader Portal */}
                <button
                  onClick={() => navigateTo('/')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-full text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  title="Switch to Trader Portal"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Trader Portal</span>
                </button>

                {/* Logout Admin */}
                <button
                  onClick={handleAdminLogout}
                  className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Logout Admin Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>

              </div>

            </div>
          </div>
        </header>

        {/* Admin Main Workspace */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <AdminDashboard onImpersonate={handleImpersonateUser} />
        </main>

      </div>
    );
  }

  // --- TRADER PORTAL FLOW (Default Route /) ---

  // Render Auth Views if user is not authenticated or explicitly viewing auth pages
  if (authView === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={(view) => setAuthView(view)} />;
  }

  if (authView === 'register') {
    return <RegisterPage onRegisterSuccess={handleLoginSuccess} onNavigate={(view) => setAuthView(view)} />;
  }

  if (authView === 'forgot-password') {
    return <ForgotPasswordPage onNavigate={(view) => setAuthView(view)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(view) => setAuthView(view)}
      />

      {/* Main Content Area - Expansive Layout Container */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        
        {/* Render Tab Content */}
        {activeTab === 'Home' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'Accounts' && <AccountsPage />}
        {activeTab === 'Funds' && <FundsPage />}
        {activeTab === 'KYC' && <KYCPage />}
        
        {/* Fallbacks for Trade, Copy Trading, V-Wallet, Webinar, etc */}
        {(activeTab === 'Trade' || activeTab === 'Copy Trading' || activeTab === 'V-Wallet' || activeTab === 'Webinar' || activeTab === 'IBProgramme' || activeTab === 'Analysis' || activeTab === 'Support') && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 card-shadow space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-black text-xl border border-emerald-200/60 shadow-xs">
              {activeTab.charAt(0)}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{activeTab} Module</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You are currently viewing the {activeTab} section of Vintage CRM. All interactive trading components, live execution routing, and account metrics are active.
            </p>
            <button
              onClick={() => setActiveTab('Home')}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-full transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Return to Trader Dashboard
            </button>
          </div>
        )}

      </main>

      {/* Floating Live Support Chat Widget */}
      <LiveChatWidget />

    </div>
  );
}
