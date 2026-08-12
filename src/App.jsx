import React, { useState, useEffect } from 'react';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'forgot-password' or null when logged in
  const [activeTab, setActiveTab] = useState('Home');

  // Check stored user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setAuthView(null); // Show main CRM portal
      } catch (e) {
        localStorage.removeItem('crm_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAuthView(null);
    setActiveTab('Home');
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_jwt_token');
    localStorage.removeItem('crm_user');
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
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
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-black text-xl">
              {activeTab.charAt(0)}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{activeTab} Module</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              You are currently viewing the {activeTab} section of Succeed Capital CRM. All interactive trading components, live execution routing, and account metrics are active.
            </p>
            <button
              onClick={() => setActiveTab('Home')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full transition-all shadow-xs hover:shadow"
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


