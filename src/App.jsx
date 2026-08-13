import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/user/Dashboard';
import AccountsPage from './pages/user/AccountsPage';
import FundsPage from './pages/user/FundsPage';
import KYCPage from './pages/user/KYCPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LiveChatWidget from './components/common/LiveChatWidget';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

export default function App() {
  // Synchronously initialize state from localStorage to prevent auth screen flash on refresh
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('crm_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      localStorage.removeItem('crm_user');
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
    return localStorage.getItem('crm_active_tab') || 'Home';
  });

  const setActiveTab = (tab) => {
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
        {activeTab === 'Admin' && <AdminDashboard onImpersonate={(user) => { alert(`Switched session: Impersonating ${user}`); setActiveTab('Home'); }} />}
        
        {/* Fallbacks for Trade, Copy Trading, V-Wallet, Webinar */}
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


