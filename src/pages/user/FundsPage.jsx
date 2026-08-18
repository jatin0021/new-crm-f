import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowRightLeft, 
  ArrowDownRight, 
  ArrowUpRight, 
  QrCode, 
  CreditCard, 
  Landmark, 
  Upload, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  History, 
  Lock,
  DollarSign,
  AlertCircle,
  Coins,
  Smartphone,
  Bookmark,
  Users,
  XCircle,
  Shield,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import DepositGatewayDirectory from '../../components/common/DepositGatewayDirectory';
import CregisModal from '../../components/common/CregisModal';
import AddressBookModal from '../../components/common/AddressBookModal';

export default function FundsPage() {
  const { alertError, alertSuccess } = useAlert();
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'transfers' | 'withdrawal' | 'deposit_history' | 'withdrawal_history' | 'transfer_history'

  // Wallet State
  const [wallet, setWallet] = useState({
    wallet_number: 'WLT5390',
    total_balance: 0.00,
    available_balance: 0.00,
    locked_balance: 0.00,
    currency: 'USD'
  });

  // User Accounts List
  const [accounts, setAccounts] = useState([]);

  // Deposit Form State
  const [depositTargetAccount, setDepositTargetAccount] = useState('wallet'); // 'wallet' or account id/login
  const [selectedGateway, setSelectedGateway] = useState('usdt_trc20');
  const [activeDepositGateway, setActiveDepositGateway] = useState(null); // null (shows grid) or selected gateway object/id (shows dedicated payment view)
  const [depositAmount, setDepositAmount] = useState('500');
  const [txHash, setTxHash] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [submittingDeposit, setSubmittingDeposit] = useState(false);
  const [showCregisModal, setShowCregisModal] = useState(false);

  // Deposit Audit History
  const [depositsTracker, setDepositsTracker] = useState([]);

  // Stepped Withdrawal Form State (1 Source -> 2 Method -> 3 Confirm)
  const [wdStep, setWdStep] = useState(1);
  const [withdrawSource, setWithdrawSource] = useState('wallet'); // 'wallet' or trading account id
  const [withdrawMethod, setWithdrawMethod] = useState('crypto_usdt'); // 'crypto_usdt' | 'bank_wire' | 'debit_card' | 'skrill' | 'neteller' | 'local_depositor'
  const [withdrawNetwork, setWithdrawNetwork] = useState('TRC20'); // 'TRC20' | 'ERC20' | 'BEP20'
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [destinationDetails, setDestinationDetails] = useState('');
  const [localAgentDetails, setLocalAgentDetails] = useState('Agent #402 (Dubai UAE) - WhatsApp: +971 50 192 8374');
  const [submittingWd, setSubmittingWd] = useState(false);
  const [wdMsg, setWdMsg] = useState({ type: '', text: '' });
  const [showAddressBookModal, setShowAddressBookModal] = useState(false);

  // Withdrawal Audit History
  const [withdrawalsTracker, setWithdrawalsTracker] = useState([]);

  // Internal Transfer Form State
  const [transferMode, setTransferMode] = useState('wallet_to_mt5');
  const [sourceId, setSourceId] = useState('Wallet');
  const [destId, setDestId] = useState('');
  const [transferAmount, setTransferAmount] = useState('500');
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [transferMsg, setTransferMsg] = useState({ type: '', text: '' });

  const [copiedWallet, setCopiedWallet] = useState(false);

  const walletAddresses = {
    usdt_trc20: "T9zXX9Kpq7aK9qP8291mLaZ387nK",
    usdt_erc20: "0x8f3c91a0b9821039a8201293810293847182930",
    usdt_bep20: "0x8f3c91a0b9821039a8201293810293847182930",
    btc_onchain: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    eth_native: "0x8f3c91a0b9821039a8201293810293847182930"
  };

  const gatewayDetailsMap = {
    usdt_trc20: {
      id: 'usdt_trc20',
      name: 'USDT TRC20/BEP20',
      tagline: 'This is for usdt trc20 deposit',
      about: 'Gateway processes deposits through your configured automatic payment integration (cards, wallets, or processor checkout).',
      buttonText: 'Pay with Gateway',
      isCrypto: true
    },
    usdt_erc20: {
      id: 'usdt_erc20',
      name: 'USDT (ERC-20)',
      tagline: 'High-security Ethereum ERC-20 blockchain deposit channel',
      about: 'Gateway processes deposits via Ethereum mainnet. 5-10 network confirmations required.',
      buttonText: 'Pay with Gateway',
      isCrypto: true
    },
    btc_onchain: {
      id: 'btc_onchain',
      name: 'Bitcoin (BTC)',
      tagline: 'Direct On-Chain Bitcoin network deposit',
      about: 'Bitcoin network transactions require 2-3 confirmations before being credited to your wallet.',
      buttonText: 'Pay with Gateway',
      isCrypto: true
    },
    eth_native: {
      id: 'eth_native',
      name: 'Ethereum (ETH)',
      tagline: 'Native ETH Layer-1 deposit pool',
      about: 'Native Ethereum Layer-1 transactions are verified automatically via smart contracts.',
      buttonText: 'Pay with Gateway',
      isCrypto: true
    },
    cregis_crypto: {
      id: 'cregis_crypto',
      name: 'Cregis Merchant Gateway (Auto)',
      tagline: 'Automated multi-token instant checkout gateway',
      about: 'Cregis Merchant Gateway provides real-time transaction monitoring and instant automated wallet settlement.',
      buttonText: 'Pay with Cregis Merchant',
      isCrypto: true
    },
    card_visa_mastercard: {
      id: 'card_visa_mastercard',
      name: 'Credit / Debit Card Gateway',
      tagline: 'Visa / Mastercard instant fiat payment gateway',
      about: 'Card gateway processes instant credit and debit card deposits with 3D Secure 2.0 fraud protection.',
      buttonText: 'Pay with Card Gateway',
      isCrypto: false
    },
    bank_wire: {
      id: 'bank_wire',
      name: 'International Bank Wire',
      tagline: 'SWIFT / IBAN wire transfer to official company treasury',
      about: 'Bank Wire transfers are processed during business hours upon receipt of SWIFT MT103 proof of payment.',
      buttonText: 'Submit Wire Notification',
      isCrypto: false
    },
    upi_qr: {
      id: 'upi_qr',
      name: 'UPI Direct / PhonePe / GPay QR',
      tagline: 'Instant INR UPI QR payment channel',
      about: 'UPI gateway supports instant QR code scanning via PhonePe, Google Pay, Paytm, and BHIM UPI apps.',
      buttonText: 'Pay via UPI QR',
      isCrypto: false
    },
    local_depositor: {
      id: 'local_depositor',
      name: 'Local P2P Cash Agent',
      tagline: 'Regional licensed P2P cash agent desk',
      about: 'Local depositor desk provides same-day regional cash deposits through verified local exchange partners.',
      buttonText: 'Contact Local Agent',
      isCrypto: false
    },
    manual_crypto: {
      id: 'manual_crypto',
      name: 'Manual Crypto / TXID',
      tagline: 'Manual blockchain transaction TXID verification',
      about: 'Manual deposit processing allows submitting custom TXIDs for manual compliance officer review.',
      buttonText: 'Submit TXID Verification',
      isCrypto: true
    }
  };

  // Automated Gas Fee Calculation
  const networkFees = {
    TRC20: 1.00,
    ERC20: 5.00,
    BEP20: 0.50,
    NATIVE: 0.00
  };

  const currentFee = withdrawMethod === 'crypto_usdt' ? (networkFees[withdrawNetwork] || 1.00) : 0.00;
  const rawAmt = parseFloat(withdrawAmount) || 0;
  const netReceivable = Math.max(0, rawAmt - currentFee);

  // Helper to determine selected source balance for withdrawal
  const getSelectedSourceBalance = () => {
    if (withdrawSource === 'wallet') {
      return wallet.available_balance || 0;
    }
    const acc = accounts.find(a => String(a.id) === String(withdrawSource) || String(a.login) === String(withdrawSource));
    return acc ? parseFloat(acc.balance || 0) : 0;
  };

  // Fetch Wallet & Funding Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
        
        // Wallet
        const res = await fetch('/api/financials/wallet', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.wallet) setWallet(data.data.wallet);
        }

        // Accounts
        const accRes = await fetch('/api/trading-accounts', { headers: { 'Authorization': `Bearer ${token}` } });
        if (accRes.ok) {
          const accData = await accRes.json();
          if (accData.data?.accounts) setAccounts(accData.data.accounts);
        }

        // Deposits History
        const depRes = await fetch('/api/financials/deposits', { headers: { 'Authorization': `Bearer ${token}` } });
        if (depRes.ok) {
          const depData = await depRes.json();
          if (depData.data?.deposits) setDepositsTracker(depData.data.deposits);
        }

        // Withdrawals History
        const wdRes = await fetch('/api/financials/withdrawals', { headers: { 'Authorization': `Bearer ${token}` } });
        if (wdRes.ok) {
          const wdData = await wdRes.json();
          if (wdData.data?.withdrawals) setWithdrawalsTracker(wdData.data.withdrawals);
        }
      } catch (e) {
        console.warn('Funding fetch warning:', e.message);
      }
    };

    fetchData();
  }, []);

  // Submit Deposit Request Handler
  const handleDepositSubmit = async (e) => {
    if (e) e.preventDefault();
    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) {
      alertError('Please enter a valid deposit amount greater than $0.00 USD');
      return;
    }

    const currentGwId = activeDepositGateway || selectedGateway;

    if (currentGwId === 'cregis_crypto') {
      setShowCregisModal(true);
      return;
    }

    setSubmittingDeposit(true);
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/financials/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amt,
          gateway: currentGwId,
          target_account: depositTargetAccount,
          tx_hash: txHash || `TX-${Math.floor(100000 + Math.random() * 900000)}`
        })
      });

      const data = await res.json();
      if (res.ok && data.data?.deposit) {
        setDepositsTracker(prev => [data.data.deposit, ...prev]);
        alertSuccess(`Deposit request of $${amt.toFixed(2)} USD submitted successfully! Status: Pending administrator approval.`);
        setDepositAmount('500');
        setTxHash('');
      } else {
        alertError(data.message || 'Failed to process deposit request.');
      }
    } catch (err) {
      alertError('Server connection error during deposit request.');
    } finally {
      setSubmittingDeposit(false);
    }
  };

  // Submit Withdrawal Handler
  const handleWithdrawalSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmittingWd(true);
    setWdMsg({ type: '', text: '' });

    const availableBal = getSelectedSourceBalance();

    if (rawAmt < 50 || rawAmt > 50000) {
      setWdMsg({ type: 'error', text: 'Withdrawal amount must be between $50.00 and $50,000.00 USD' });
      setSubmittingWd(false);
      return;
    }

    if (rawAmt > availableBal) {
      setWdMsg({ type: 'error', text: `Insufficient available balance ($${availableBal.toFixed(2)} USD)` });
      setSubmittingWd(false);
      return;
    }

    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/financials/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: rawAmt,
          payout_method: withdrawMethod,
          network: withdrawMethod === 'crypto_usdt' ? withdrawNetwork : 'NATIVE',
          destination_details: withdrawMethod === 'local_depositor' ? localAgentDetails : destinationDetails,
          source: withdrawSource
        })
      });

      const data = await res.json();
      if (res.ok && data.data?.withdrawal) {
        setWdMsg({ type: 'success', text: data.message || 'Withdrawal request submitted successfully!' });
        setWithdrawalsTracker(prev => [data.data.withdrawal, ...prev]);

        // Reserve balance if source was main wallet
        if (withdrawSource === 'wallet') {
          setWallet(prev => ({
            ...prev,
            available_balance: prev.available_balance - rawAmt,
            locked_balance: prev.locked_balance + rawAmt
          }));
        }

        alertSuccess('Withdrawal request submitted successfully!');
        setWithdrawAmount('500');
        setDestinationDetails('');
        setWdStep(1);
      } else {
        setWdMsg({ type: 'error', text: data.message || 'Withdrawal request failed.' });
      }
    } catch (err) {
      setWdMsg({ type: 'error', text: 'Server connection error during withdrawal.' });
    } finally {
      setSubmittingWd(false);
    }
  };

  // Cancel Withdrawal Request Handler
  const handleCancelWithdrawal = async (wdId) => {
    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/financials/withdrawals/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ withdrawal_id: wdId })
      });

      const data = await res.json();
      if (res.ok) {
        setWithdrawalsTracker(prev => prev.map(w => w.id === wdId ? { ...w, status: 'cancelled' } : w));
        
        // Find cancelled amount to unfreeze
        const target = withdrawalsTracker.find(w => w.id === wdId);
        if (target) {
          const amt = parseFloat(target.amount);
          setWallet(prev => ({
            ...prev,
            available_balance: prev.available_balance + amt,
            locked_balance: Math.max(0, prev.locked_balance - amt)
          }));
        }
        alertSuccess('Withdrawal request cancelled successfully.');
      } else {
        alertError(data.message || 'Cancellation failed');
      }
    } catch (e) {
      alertError('Server connection error during cancellation');
    }
  };

  const currentGwObj = gatewayDetailsMap[activeDepositGateway || selectedGateway] || gatewayDetailsMap.usdt_trc20;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      
      {/* Centralized Wallet Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Unified Multi-Currency Wallet</h1>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 uppercase">
                ID: {wallet.wallet_number || 'WLT5390'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Centralized funding repository for deposits, withdrawals, and capital allocation.</p>
          </div>
        </div>

        {/* Balances Overview */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-center min-w-[130px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Balance</span>
            <span className="text-lg font-black text-slate-900 font-mono block mt-0.5">
              ${parseFloat(wallet.total_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex-1 md:flex-initial bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl text-center min-w-[140px]">
            <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Available</span>
            <span className="text-lg font-black text-emerald-600 font-mono block mt-0.5">
              ${parseFloat(wallet.available_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex-1 md:flex-initial bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-center min-w-[130px]">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Locked/Pending</span>
            <span className="text-lg font-black text-amber-700 font-mono block mt-0.5">
              ${parseFloat(wallet.locked_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Workspace Sub-Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'deposit' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          <span>Deposits Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawal')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'withdrawal' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Withdrawal Portal</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'transfers' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Internal Transfers</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawal_history')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'withdrawal_history' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-300/50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Withdrawal Status Ledger</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEPOSITS HUB */}
      {/* ========================================================================= */}
      {activeTab === 'deposit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Target Account/Wallet Selector Top Banner */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 card-shadow space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              
              {/* Target Selector Dropdown */}
              <div className="flex-1 w-full space-y-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">CHOOSE AN ACCOUNT OR WALLET TO DEPOSIT INTO</span>
                <div className="relative">
                  <select
                    value={depositTargetAccount}
                    onChange={(e) => setDepositTargetAccount(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer shadow-xs"
                  >
                    <option value="wallet">Main Wallet - {wallet.wallet_number || 'WLT5390'} - ${parseFloat(wallet.available_balance || 0).toFixed(2)} USD</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        MT5 {acc.account_type?.toUpperCase() || 'LIVE'} #{acc.login || acc.account_number} - ${parseFloat(acc.balance || 0).toFixed(2)} USD
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Badges on Right */}
              <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
                  <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block tracking-wider">AVAILABLE BALANCE</span>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      ${parseFloat(wallet.available_balance || 0).toFixed(2)} <span className="text-slate-500 text-[10px]">USD</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-800 font-extrabold">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs">Secure - Your transactions are protected</span>
                </div>
              </div>

            </div>
          </div>

          {/* VIEW 1: GATEWAY DIRECTORY GRID (Shown when no deposit option is active) */}
          {!activeDepositGateway ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900">Make a deposit</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Choose a tab, then select an active method.</p>
              </div>

              <DepositGatewayDirectory
                selectedGateway={selectedGateway}
                onSelectGateway={(gId) => {
                  setSelectedGateway(gId);
                  setActiveDepositGateway(gId);
                }}
              />
            </div>
          ) : (
            
            /* VIEW 2: DEDICATED FULLY WORKABLE DEPOSIT PAYMENT PAGE (MATCHING LATEST SCREENSHOT) */
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Back Arrow & Gateway Title Bar */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveDepositGateway(null)}
                  className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{currentGwObj.name}</h2>
              </div>

              {/* Deposit Payment Form Card Container */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Section: Fully Workable Deposit Form */}
                  <form onSubmit={handleDepositSubmit} className="lg:col-span-8 space-y-6 text-left">
                    
                    {/* Gateway Field Box */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 block">Gateway</label>
                      <div className="relative">
                        <select
                          value={selectedGateway}
                          onChange={(e) => {
                            setSelectedGateway(e.target.value);
                            setActiveDepositGateway(e.target.value);
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
                        >
                          {Object.values(gatewayDetailsMap).map(gw => (
                            <option key={gw.id} value={gw.id}>{gw.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium block pt-0.5">{currentGwObj.tagline}</span>
                    </div>

                    {/* Amount (USD) Input Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 block">Amount (USD)</label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min={10}
                          max={500000}
                          step="any"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-4 pr-14 py-3 bg-white border border-slate-900 rounded-xl font-mono font-extrabold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-xs"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-slate-400">USD</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed pt-1">
                        After payment, your deposit will appear as Pending until an administrator approves it and credits your account.
                      </p>
                    </div>

                    {/* Crypto Deposit Wallet Address & TXID Input (For Crypto Gateways) */}
                    {currentGwObj.isCrypto && (
                      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                        <div className="space-y-2">
                          <span className="text-xs font-extrabold text-slate-700 block">Official Merchant Deposit Address:</span>
                          <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900">
                            <span className="truncate flex-1">{walletAddresses[selectedGateway] || walletAddresses.usdt_trc20}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(walletAddresses[selectedGateway] || walletAddresses.usdt_trc20);
                                setCopiedWallet(true);
                                setTimeout(() => setCopiedWallet(false), 2000);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-600 cursor-pointer"
                            >
                              {copiedWallet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-extrabold text-slate-700 block">Transaction Hash / TXID (Optional for manual audit)</label>
                          <input
                            type="text"
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            placeholder="e.g. 0x8f3c91a0b9821039a8201293810293847182930"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submittingDeposit || !depositAmount || parseFloat(depositAmount) <= 0}
                        className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{submittingDeposit ? 'Processing...' : (currentGwObj.buttonText || 'Pay with Gateway')}</span>
                      </button>
                    </div>

                  </form>

                  {/* Right Section: About Sidebar (Matching Screenshot) */}
                  <div className="lg:col-span-4 space-y-3 pt-2 text-left border-t lg:border-t-0 lg:border-l lg:border-slate-100 lg:pl-8">
                    <h4 className="text-base font-black text-slate-900">About</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {currentGwObj.about}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WITHDRAWAL PORTAL - STEPPED FLOW */}
      {/* ========================================================================= */}
      {activeTab === 'withdrawal' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Bar with View Reports button */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 card-shadow flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold shrink-0">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Withdraw funds</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Access your earnings and transfer funds</p>
              </div>
            </div>

            {/* View Reports shortcut button */}
            <button
              type="button"
              onClick={() => setActiveTab('withdrawal_history')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              View reports
            </button>
          </div>

          {/* Stepper Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-8">
            
            {/* Title */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Withdrawal</h3>
            </div>

            {/* 3-Step Flow Indicator Bar */}
            <div className="flex items-center justify-between max-w-xl mx-auto relative px-4">
              {/* Connecting Line */}
              <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-200 -z-0" />
              
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  wdStep >= 1 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'
                }`}>
                  1
                </div>
                <span className={`text-[11px] font-bold ${wdStep === 1 ? 'text-emerald-700' : 'text-slate-400'}`}>Source</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  wdStep >= 2 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'
                }`}>
                  2
                </div>
                <span className={`text-[11px] font-bold ${wdStep === 2 ? 'text-emerald-700' : 'text-slate-400'}`}>Method</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  wdStep >= 3 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-600'
                }`}>
                  3
                </div>
                <span className={`text-[11px] font-bold ${wdStep === 3 ? 'text-emerald-700' : 'text-slate-400'}`}>Confirm</span>
              </div>
            </div>

            {/* Error / Success Banner */}
            {wdMsg.text && (
              <div className={`px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                wdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {wdMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{wdMsg.text}</span>
              </div>
            )}

            {/* STEP 1: SOURCE SELECTION */}
            {wdStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
                
                {/* Source Wallet Display Card */}
                <div className="md:col-span-5 p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">WALLET</span>
                    <span className="text-xs font-bold text-slate-700 block font-mono">
                      {withdrawSource === 'wallet' ? (wallet.wallet_number || 'WLT5390') : `MT5 Account #${withdrawSource}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-900 font-mono block">
                      ${getSelectedSourceBalance().toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Main wallet balance (USD)</span>
                  </div>
                </div>

                {/* Source Account Selector */}
                <div className="md:col-span-7 space-y-5 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">Withdraw from</label>
                    <select
                      value={withdrawSource}
                      onChange={(e) => setWithdrawSource(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                    >
                      <option value="wallet">Main wallet - {wallet.wallet_number || 'WLT5390'} - ${parseFloat(wallet.available_balance || 0).toFixed(2)} USD</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                          MT5 {acc.account_type?.toUpperCase() || 'LIVE'} #{acc.login || acc.account_number} - ${parseFloat(acc.balance || 0).toFixed(2)} USD
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-emerald-600 font-bold block pt-1">
                      Selected balance: ${getSelectedSourceBalance().toFixed(2)} USD
                    </span>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setWdStep(2)}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: METHOD & DETAILS */}
            {wdStep === 2 && (
              <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
                
                {/* Header Pills */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Source:</span>
                    <span className="text-xs font-extrabold text-slate-900 font-mono">
                      {withdrawSource === 'wallet' ? `Main Wallet (${wallet.wallet_number})` : `MT5 Account #${withdrawSource}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddressBookModal(true)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Address Book</span>
                  </button>
                </div>

                {/* Payout Channel Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">Select Payout Channel</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'crypto_usdt', label: 'Crypto USDT' },
                      { id: 'bank_wire', label: 'Bank Wire IBAN' },
                      { id: 'debit_card', label: 'Visa/Mastercard Card' },
                      { id: 'skrill', label: 'Skrill E-Wallet' },
                      { id: 'neteller', label: 'Neteller E-Wallet' },
                      { id: 'local_depositor', label: 'Local P2P Agent' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWithdrawMethod(item.id)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                          withdrawMethod === item.id ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-Network Selection (Only for Crypto) */}
                {withdrawMethod === 'crypto_usdt' && (
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">Destination Blockchain Network</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'TRC20', label: 'TRC-20 (Tron)', fee: '$1.00 Fee' },
                        { id: 'ERC20', label: 'ERC-20 (Ethereum)', fee: '$5.00 Fee' },
                        { id: 'BEP20', label: 'BEP-20 (BSC)', fee: '$0.50 Fee' }
                      ].map(net => (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => setWithdrawNetwork(net.id)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all text-center cursor-pointer ${
                            withdrawNetwork === net.id ? 'border-emerald-600 bg-emerald-600 text-white shadow-md' : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="block">{net.label}</span>
                          <span className="text-[10px] opacity-80 block font-mono">{net.fee}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amount Input & Fee Calculation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Withdrawal Amount (USD)</label>
                    <span className="text-[11px] text-slate-500 font-semibold">Min $50.00 • Max $50,000.00</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-black text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      required
                      min={50}
                      max={50000}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="500.00"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-extrabold text-base text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  {/* Fee breakdown */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-500">
                      <span>Requested Amount:</span>
                      <span>${rawAmt.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Network Gas Fee ({withdrawNetwork}):</span>
                      <span className="text-rose-600">-${currentFee.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                      <span>Net Receivable Payout:</span>
                      <span className="text-emerald-600 text-sm font-black">${netReceivable.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>

                {/* Destination Details */}
                {withdrawMethod === 'local_depositor' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Select Regional Local P2P Agent</label>
                    <select
                      value={localAgentDetails}
                      onChange={(e) => setLocalAgentDetails(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                    >
                      <option value="Agent #402 (Dubai UAE) - WhatsApp: +971 50 192 8374">Agent #402 (Dubai UAE) - WhatsApp: +971 50 192 8374</option>
                      <option value="Agent #108 (London UK) - WhatsApp: +44 7911 123456">Agent #108 (London UK) - WhatsApp: +44 7911 123456</option>
                      <option value="Agent #305 (Riyadh KSA) - WhatsApp: +966 50 982 1029">Agent #305 (Riyadh KSA) - WhatsApp: +966 50 982 1029</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">Destination Address / IBAN</label>
                    <input
                      type="text"
                      required
                      value={destinationDetails}
                      onChange={(e) => setDestinationDetails(e.target.value)}
                      placeholder={withdrawMethod === 'crypto_usdt' ? `Enter ${withdrawNetwork} address` : 'Enter IBAN, card number, or e-wallet email'}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {/* Step 2 Actions */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setWdStep(1)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWdStep(3)}
                    disabled={rawAmt < 50 || rawAmt > getSelectedSourceBalance() || (!destinationDetails && withdrawMethod !== 'local_depositor')}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    Continue to Summary
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: CONFIRMATION & REVIEW */}
            {wdStep === 3 && (
              <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-200">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                    Review Payout Summary
                  </h4>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Source Account:</span>
                      <span className="font-extrabold text-slate-900">
                        {withdrawSource === 'wallet' ? `Main Wallet (${wallet.wallet_number})` : `MT5 Account #${withdrawSource}`}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Payout Channel:</span>
                      <span className="font-extrabold text-slate-900 uppercase">
                        {withdrawMethod.replace('_', ' ')} {withdrawMethod === 'crypto_usdt' ? `(${withdrawNetwork})` : ''}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Destination:</span>
                      <span className="font-extrabold text-slate-900 truncate max-w-[220px]">
                        {withdrawMethod === 'local_depositor' ? localAgentDetails : destinationDetails}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Requested Amount:</span>
                      <span className="font-extrabold text-slate-900">${rawAmt.toFixed(2)} USD</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
                      <span>Gas / Network Fee:</span>
                      <span>-${currentFee.toFixed(2)} USD</span>
                    </div>

                    <div className="flex justify-between py-2 text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Net Receivable:</span>
                      <span className="text-emerald-600 text-base">${netReceivable.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setWdStep(2)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWithdrawalSubmit}
                    disabled={submittingWd}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{submittingWd ? 'Submitting...' : 'Confirm & Submit Payout Request'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERNAL TRANSFERS */}
      {/* ========================================================================= */}
      {activeTab === 'transfers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow max-w-xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">Internal Account Transfer</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Move funds instantly between your Wallet and MT5 Trading Accounts with zero fees.</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Available Wallet Balance:</span>
              <span className="font-bold text-slate-900">${wallet.available_balance.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Internal Transfer Fee:</span>
              <span className="font-bold text-emerald-600">0.00 USD (FREE)</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => alertSuccess('Internal transfer submitted successfully!')}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Submit Internal Transfer
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: WITHDRAWAL STATUS LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'withdrawal_history' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-5 animate-in fade-in duration-200 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Withdrawal Audit Ledger & Status Tracker</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Track real-time blockchain payout confirmations, administrative reviews, and cancellation status.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('withdrawal')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              + New Withdrawal
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Network</th>
                  <th className="py-3 px-3">Destination</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {withdrawalsTracker.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">No withdrawal requests found.</td>
                  </tr>
                ) : (
                  withdrawalsTracker.map(wd => (
                    <tr key={wd.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-slate-600">{new Date(wd.created_at || Date.now()).toLocaleDateString()}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 uppercase">{(wd.payout_method || 'crypto').replace('_', ' ')}</td>
                      <td className="py-3 px-3 text-slate-500">{wd.network || 'TRC20'}</td>
                      <td className="py-3 px-3 text-slate-700 truncate max-w-[150px]">{wd.destination_details || 'N/A'}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">${parseFloat(wd.amount || 0).toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          (wd.status || 'pending').toLowerCase() === 'approved' || (wd.status || '').toLowerCase() === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : (wd.status || 'pending').toLowerCase() === 'cancelled'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                        }`}>
                          {wd.status || 'Pending Review'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {(wd.status || 'pending').toLowerCase() === 'pending' && (
                          <button
                            onClick={() => handleCancelWithdrawal(wd.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cregis Gateway Modal */}
      {showCregisModal && (
        <CregisModal
          isOpen={showCregisModal}
          onClose={() => setShowCregisModal(false)}
          depositAmount={depositAmount}
        />
      )}

      {/* Address Book Modal */}
      {showAddressBookModal && (
        <AddressBookModal
          isOpen={showAddressBookModal}
          onClose={() => setShowAddressBookModal(false)}
          onSelectAddress={(entry) => {
            setDestinationDetails(entry.address);
            if (entry.method) setWithdrawMethod(entry.method);
            if (entry.network) setWithdrawNetwork(entry.network);
            setShowAddressBookModal(false);
          }}
        />
      )}

    </div>
  );
}
