import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';
import { getApiUrl } from '../../config/api';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  FileText, 
  QrCode, 
  Smartphone, 
  Laptop, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Camera, 
  Check, 
  Copy, 
  Download, 
  Scale, 
  Cookie, 
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import PasswordStrengthBar from '../../components/common/PasswordStrengthBar';
import TwoFactorAuthModal from '../../components/common/TwoFactorAuthModal';
import ComplianceDocModal from '../../components/common/ComplianceDocModal';

export default function ProfileSecurityPage({ defaultSubTab = 'profile' }) {
  const { showAlert, alertSuccess, alertError, alertWarning, alertInfo } = useAlert();
  const [activeSubTab, setActiveSubTab] = useState(defaultSubTab);

  // Profile Form State
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: 'United States',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    two_factor_enabled: false
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // 2FA State
  const [show2FaSetup, setShow2FaSetup] = useState(false);
  const [show2FaVerifyModal, setShow2FaVerifyModal] = useState(false);
  const [show2FaDisableModal, setShow2FaDisableModal] = useState(false);
  const [totpSetupData, setTotpSetupData] = useState(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Password Change State
  const [passData, setPassData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Active Sessions State
  const [sessions, setSessions] = useState([
    { id: 1, ip_address: '127.0.0.1', user_agent: 'Chrome 128 (Windows PC)', device_info: 'Windows PC (Current Session)', last_active: 'Just now', is_current: true },
    { id: 2, ip_address: '198.51.100.42', user_agent: 'Safari iOS (iPhone 15)', device_info: 'iPhone Workstation', last_active: '2 hours ago', is_current: false }
  ]);

  // KYC State (Manual Document Upload)
  const [kycStatus, setKycStatus] = useState('unverified'); // 'unverified' | 'pending' | 'action_required' | 'verified' | 'rejected'
  const [submittingKyc, setSubmittingKyc] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [manualDocCategory, setManualDocCategory] = useState('Proof of Identity');
  const [manualIdType, setManualIdType] = useState('ID Card');
  const [manualDocsList, setManualDocsList] = useState([]);

  // Compliance Doc Modal State
  const [activeDocType, setActiveDocType] = useState(null);

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'United Arab Emirates',
    'Canada', 'Australia', 'Singapore', 'France', 'Saudi Arabia', 'Japan', 'India'
  ];

  // Helper to fetch KYC documents and status
  const fetchKycStatus = async () => {
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const kycRes = await fetch(getApiUrl('/api/kyc/status'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (kycRes.ok) {
        const kycData = await kycRes.json();
        if (kycData.data?.kyc_status) {
          setKycStatus(kycData.data.kyc_status);
          setManualDocsList(kycData.data.manual_documents || []);

          // Sync crm_user in localStorage so live account creation checks pick up verified status immediately
          const userStr = localStorage.getItem('crm_user');
          if (userStr) {
            try {
              const u = JSON.parse(userStr);
              if (u.kyc_status !== kycData.data.kyc_status) {
                u.kyc_status = kycData.data.kyc_status;
                localStorage.setItem('crm_user', JSON.stringify(u));
              }
            } catch (err) {}
          }
        }
      }
    } catch (e) {
      console.warn('KYC fetch warning:', e.message);
    }
  };

  // Fetch Profile & KYC Status on Mount & Poll Every 3 Seconds for Real-Time Approval Updates
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
        const res = await fetch(getApiUrl('/api/user/profile'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.profile) {
            setProfile(prev => ({ ...prev, ...data.data.profile }));
            setKycStatus(data.data.profile.kyc_status || 'unverified');
          }
          await fetchKycStatus();
        } else if (res.status === 404 || res.status === 401 || res.status === 403) {
          localStorage.removeItem('crm_user');
          localStorage.removeItem('crm_jwt_token');
          sessionStorage.removeItem('crm_user');
          sessionStorage.removeItem('crm_jwt_token');
          window.location.href = '/login';
        }
      } catch (e) {
        console.warn('Profile fetch warning:', e.message);
      }
    };

    fetchProfileData();
    const interval = setInterval(() => {
      fetchProfileData();
      fetchKycStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 1. Profile Save Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch(getApiUrl('/api/user/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      const data = await res.json();
      if (res.ok && (data.ok || data.success)) {
        setProfileMsg({ type: 'success', text: 'Trader profile information updated successfully!' });
        // Update stored user object
        try {
          const stored = localStorage.getItem('crm_user') || sessionStorage.getItem('crm_user');
          if (stored) {
            const u = JSON.parse(stored);
            const updated = { ...u, ...profile };
            if (localStorage.getItem('crm_user')) localStorage.setItem('crm_user', JSON.stringify(updated));
            if (sessionStorage.getItem('crm_user')) sessionStorage.setItem('crm_user', JSON.stringify(updated));
          }
        } catch (err) {}
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Failed to update profile details.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Server connection error.' });
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. Setup 2FA Handler
  const handleInit2FA = async () => {
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch(getApiUrl('/api/user/2fa/setup'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setTotpSetupData(data.data);
        setShow2FaSetup(true);
      }
    } catch (err) {
      alertError('Failed to initialize 2FA setup.');
    }
  };

  // Verify TOTP Challenge
  const handleVerify2FATotp = async (otpCode) => {
    if (!totpSetupData) return;
    const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
    const res = await fetch(getApiUrl('/api/user/2fa/verify'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        secret: totpSetupData.secret,
        token: otpCode,
        backup_codes: totpSetupData.backup_codes
      })
    });

    const data = await res.json();
    if (!res.ok || (!data.ok && !data.success)) {
      throw new Error(data.message || 'Invalid 6-digit TOTP code');
    }

    setProfile(prev => ({ ...prev, two_factor_enabled: true }));
    setShow2FaSetup(false);
  };

  // Disable 2FA Handler
  const handleDisable2FA = async (otpCode) => {
    const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
    const res = await fetch(getApiUrl('/api/user/2fa/disable'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token: otpCode })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to deactivate 2FA');
    }

    setProfile(prev => ({ ...prev, two_factor_enabled: false }));
    setShow2FaDisableModal(false);
  };

  // 3. Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (passData.new_password !== passData.confirm_password) {
      setPassMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passData.new_password.length < 8) {
      setPassMsg({ type: 'error', text: 'New password must be at least 8 characters long' });
      return;
    }

    setSavingPass(true);
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch(getApiUrl('/api/user/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passData.current_password,
          new_password: passData.new_password
        })
      });

      const data = await res.json();
      if (res.ok && (data.ok || data.success)) {
        setPassMsg({ type: 'success', text: 'Password updated successfully!' });
        setPassData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        setPassMsg({ type: 'error', text: data.message || 'Failed to change password.' });
      }
    } catch (err) {
      setPassMsg({ type: 'error', text: 'Server connection error.' });
    } finally {
      setSavingPass(false);
    }
  };

  // 4. Revoke Session Handler
  const handleRevokeSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleRevokeAllOthers = () => {
    setSessions(prev => prev.filter(s => s.is_current));
  };

  // 5. Submit KYC Documents Handler (Manual Document Upload)
  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alertWarning('Please select an image or document file to proceed with verification.');
      return;
    }
    if (uploadFile.size > 15 * 1024 * 1024) {
      alertWarning('File size exceeds maximum limit of 15MB.');
      return;
    }

    setSubmittingKyc(true);
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('documentType', manualDocCategory);
      formData.append('idType', manualIdType);

      const res = await fetch(getApiUrl('/api/kyc/upload'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json().catch(() => ({ message: `HTTP ${res.status} ${res.statusText}` }));
      if (res.ok && (data.ok || data.success || data.data)) {
        setKycStatus(data.data?.kyc_status || 'pending');
        alertSuccess(`Document uploaded successfully! Category: ${manualDocCategory}`);
        setUploadFile(null);
        await fetchKycStatus();
      } else {
        alertError(data.message || data.error || 'KYC document upload failed.');
      }
    } catch (err) {
      alertError(`Upload error: ${err.message || 'Network error'}`);
    } finally {
      setSubmittingKyc(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trader Profile & Security Hub</h1>
            <p className="text-xs text-slate-500 font-medium">Manage personal information, TOTP 2FA, password controls, active sessions, and compliance docs.</p>
          </div>
        </div>

        {/* Real-time KYC Status Header Badge */}
        <div className="flex items-center gap-2">
          {kycStatus === 'verified' && (
            <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Identity Verified
            </span>
          )}
          {kycStatus === 'pending' && (
            <span className="px-3.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black inline-flex items-center gap-1.5 animate-pulse">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Verification Pending Review
            </span>
          )}
          {kycStatus === 'unverified' && (
            <span className="px-3.5 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-black inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-400" /> Identity Unverified
            </span>
          )}
        </div>
      </div>

      {/* Segmented Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'profile' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Trader Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'security' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & 2FA</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'kyc' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Identity Verification (KYC)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('compliance')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'compliance' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Regulatory Disclosures</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: TRADER PROFILE MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Personal Information & Address</h2>
            <p className="text-xs text-slate-500 font-medium">Update your account profile, date of birth, and residential contact details.</p>
          </div>

          {profileMsg.text && (
            <div className={`px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={profile.first_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={profile.last_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Country of Residence</label>
                <select
                  value={profile.country}
                  onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                >
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Address Row */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Residential Street Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                placeholder="742 Evergreen Terrace, Suite 400"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Springfield"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">State / Province</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Oregon"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Postal Code</label>
                <input
                  type="text"
                  value={profile.postal_code}
                  onChange={(e) => setProfile(prev => ({ ...prev, postal_code: e.target.value }))}
                  placeholder="97477"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-extrabold text-xs rounded-full shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile Information'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: SECURITY, 2FA & ACTIVE SESSION CONTROL */}
      {/* ========================================================================= */}
      {activeSubTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Section A: Two-Factor Authentication (2FA) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-600" />
                  Two-Factor Authentication (TOTP 2FA)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Secure your account with 6-digit OTP codes from Google Authenticator or Authy.</p>
              </div>

              {profile.two_factor_enabled ? (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2FA Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-extrabold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Disabled
                </span>
              )}
            </div>

            {/* 2FA Enable/Disable Actions */}
            {!profile.two_factor_enabled ? (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Protect your trading funds and account credentials against unauthorized access. Every sign-in and withdrawal will require a 6-digit TOTP challenge token.
                </p>

                {!show2FaSetup ? (
                  <button
                    onClick={handleInit2FA}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-full shadow-md shadow-emerald-600/25 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Configure TOTP 2FA</span>
                  </button>
                ) : (
                  <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 animate-in fade-in">
                    <h4 className="text-sm font-extrabold text-emerald-400">Scan QR Code with Google Authenticator</h4>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* SVG/Canvas Simulated QR Code */}
                      <div className="w-36 h-36 bg-white p-2 rounded-2xl flex items-center justify-center shrink-0 border-2 border-emerald-500 shadow-md">
                        <QrCode className="w-28 h-28 text-slate-900" />
                      </div>

                      <div className="space-y-2 text-xs">
                        <span className="text-slate-400 block font-semibold">Or enter secret key manually:</span>
                        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono font-bold text-emerald-300">
                          <span>{totpSetupData?.secret || 'JBSWY3DPEHPK3PXP'}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(totpSetupData?.secret || 'JBSWY3DPEHPK3PXP');
                              setCopiedSecret(true);
                              setTimeout(() => setCopiedSecret(false), 2000);
                            }}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">Scan the QR code or enter secret, then click below to verify the 6-digit TOTP code.</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setShow2FaVerifyModal(true)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-full shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Complete 2FA Setup</span>
                      </button>
                      <button
                        onClick={() => setShow2FaSetup(false)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-full text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50/80 border border-emerald-200 p-5 rounded-2xl space-y-3">
                <p className="text-xs text-emerald-900 font-semibold">
                  Two-Factor Authentication is currently protecting your trader profile and withdrawal workflows.
                </p>
                <button
                  onClick={() => setShow2FaDisableModal(true)}
                  className="px-4 py-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-700 border border-rose-300 font-extrabold text-xs rounded-full transition-all cursor-pointer"
                >
                  Deactivate 2FA Protection
                </button>
              </div>
            )}
          </div>

          {/* Section B: Password Change Portal */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                Password Change Portal
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Verify current password and update to new password standards.</p>
            </div>

            {passMsg.text && (
              <div className={`px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Current Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={passData.current_password}
                    onChange={(e) => setPassData(prev => ({ ...prev, current_password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Password *</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={passData.new_password}
                  onChange={(e) => setPassData(prev => ({ ...prev, new_password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
                <PasswordStrengthBar password={passData.new_password} />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password *</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={passData.confirm_password}
                  onChange={(e) => setPassData(prev => ({ ...prev, confirm_password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={savingPass}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-full shadow-md shadow-emerald-600/25 hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer"
              >
                {savingPass ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Section C: Privacy & Active Session Control */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-emerald-600" />
                  Active Browser Sessions & Remote Controls
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Inspect current login sessions, IP addresses, and revoke unknown devices.</p>
              </div>

              <button
                onClick={handleRevokeAllOthers}
                className="px-3.5 py-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-700 border border-rose-300 font-extrabold text-xs rounded-full transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout All Other Devices</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {sessions.map(session => (
                <div key={session.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      {session.device_info.includes('Mobile') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{session.device_info}</span>
                        {session.is_current && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-black uppercase">Current Device</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">IP: {session.ip_address} • Last Active: {session.last_active}</span>
                    </div>
                  </div>

                  {!session.is_current && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="px-3 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: IDENTITY VERIFICATION (MANUAL DOCUMENT UPLOAD) */}
      {/* ========================================================================= */}
      {activeSubTab === 'kyc' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">Personal Identity Verification (KYC)</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Upload official proof of identity or proof of address documents for manual compliance review.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                ['verified', 'approved'].includes(kycStatus.toLowerCase())
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : kycStatus === 'pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                  : kycStatus === 'rejected'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                KYC Status: {kycStatus}
              </span>
            </div>
          </div>

          {/* MANUAL DOCUMENT UPLOAD FORM CARD */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Document Upload Portal</h3>
                <p className="text-xs text-slate-500 font-medium">Supported formats: JPG, PNG, PDF (Max file size: 5MB)</p>
              </div>
            </div>

            <form onSubmit={handleSubmitKyc} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">1. Document Category *</label>
                  <select
                    value={manualDocCategory}
                    onChange={(e) => setManualDocCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Proof of Identity">Proof of Identity</option>
                    <option value="Proof of Address">Proof of Address</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">2. Document Type *</label>
                  <select
                    value={manualIdType}
                    onChange={(e) => setManualIdType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                  >
                    {manualDocCategory === 'Proof of Identity' ? (
                      <>
                        <option value="ID Card">National ID Card</option>
                        <option value="Passport">Passport</option>
                        <option value="Driver License">Driver License</option>
                      </>
                    ) : (
                      <>
                        <option value="Utility Bill">Utility Bill</option>
                        <option value="Bank Statement">Bank Statement</option>
                        <option value="Tax Document">Tax Document</option>
                        <option value="Passport">Passport</option>
                        <option value="ID Card">ID Card</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">3. Select File *</label>
                <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center bg-white transition-all">
                  <input
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.webp,.bmp,.gif,.pdf"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <FileText className="w-8 h-8 text-emerald-600" />
                    {uploadFile ? (
                      <div>
                        <p className="text-xs font-black text-emerald-700">{uploadFile.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">Click or drag image / document to attach</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Supports any image format (JPG, PNG, WEBP, GIF) & PDF up to 15MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingKyc}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {submittingKyc ? 'Uploading & Submitting...' : 'Submit Verification Document'}
              </button>

            </form>
          </div>

          {/* SUBMITTED DOCUMENTS HISTORY LOG */}
          {manualDocsList.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Submitted Document Log</h4>
              <div className="divide-y divide-slate-100 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                {manualDocsList.map(doc => (
                  <div key={doc.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900">{doc.document_type} ({doc.id_type})</span>
                      <span className="text-[10px] text-slate-400 block font-mono">Submitted: {new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.status}
                      </span>
                      <a
                        href={`/api/kyc/documents/${doc.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: REGULATORY DISCLOSURES & COMPLIANCE DOCUMENTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'compliance' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-black text-slate-900">Regulatory Policies & Legal Disclosures</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Read and download official regulatory disclosures, execution agreements, and privacy terms.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Risk Disclosure Policy */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">Risk Disclosure Policy</h3>
                  <span className="text-[10px] text-slate-400 font-mono">REG-RDP-2026</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Regulatory risk notice detailing margin leverage risks, market volatility, and liquidity disclosures.</p>
              <button
                onClick={() => setActiveDocType('risk')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Open Document Reader
              </button>
            </div>

            {/* Cookie Policy */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">Cookie Policy & Consent Manager</h3>
                  <span className="text-[10px] text-slate-400 font-mono">REG-CKP-2026</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Information on technical cookies, analytics, and affiliate tracking preferences.</p>
              <button
                onClick={() => setActiveDocType('cookie')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Manage Cookie Preferences
              </button>
            </div>

            {/* Order Execution Policy */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">Order Execution & Terms Policy</h3>
                  <span className="text-[10px] text-slate-400 font-mono">REG-OEP-2026</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Comprehensive statement on MT5 ECN/STP execution principles, order handling, and slippage standards.</p>
              <button
                onClick={() => setActiveDocType('execution')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Open Terms Reader
              </button>
            </div>

            {/* Privacy & AML Disclosures */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-emerald-300 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">Privacy & AML Compliance Policy</h3>
                  <span className="text-[10px] text-slate-400 font-mono">REG-AML-2026</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Anti-Money Laundering (AML/CTF) disclosures, data encryption rules, and GDPR compliance rights.</p>
              <button
                onClick={() => setActiveDocType('privacy')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Open Compliance Disclosure
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2FA Verification Modal */}
      <TwoFactorAuthModal
        isOpen={show2FaVerifyModal}
        onClose={() => setShow2FaVerifyModal(false)}
        onVerify={handleVerify2FATotp}
        title="Activate 2FA TOTP Protection"
        subtitle="Enter the 6-digit TOTP code generated by your Authenticator app"
      />

      {/* 2FA Disable Modal */}
      <TwoFactorAuthModal
        isOpen={show2FaDisableModal}
        onClose={() => setShow2FaDisableModal(false)}
        onVerify={handleDisable2FA}
        title="Deactivate Two-Factor Authentication"
        subtitle="Enter your 6-digit TOTP code to confirm 2FA deactivation"
      />

      {/* Regulatory Document Reader Modal */}
      <ComplianceDocModal
        isOpen={!!activeDocType}
        onClose={() => setActiveDocType(null)}
        docType={activeDocType || 'risk'}
      />

    </div>
  );
}
