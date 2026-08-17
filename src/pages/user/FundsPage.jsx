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
  XCircle
} from 'lucide-react';
import DepositGatewayDirectory from '../../components/common/DepositGatewayDirectory';
import CregisModal from '../../components/common/CregisModal';
import AddressBookModal from '../../components/common/AddressBookModal';

export default function FundsPage() {
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'transfers' | 'withdrawal' | 'deposit_history' | 'withdrawal_history' | 'transfer_history'

  // Wallet State
  const [wallet, setWallet] = useState({
    wallet_number: 'W-90182',
    total_balance: 2500.00,
    available_balance: 2500.00,
    locked_balance: 0.00,
    currency: 'USD'
  });

  // User Accounts List
  const [accounts, setAccounts] = useState([
    { login: 501928, type: 'Live Standard ECN', balance: 15400.50, free_margin: 12400.00, currency: 'USD' },
    { login: 725249, type: 'Live VIP ECN', balance: 0.00, free_margin: 0.00, currency: 'EUR' }
  ]);

  // Deposit Form State
  const [selectedGateway, setSelectedGateway] = useState('usdt_trc20');
  const [depositAmount, setDepositAmount] = useState('500');
  const [txHash, setTxHash] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [submittingDeposit, setSubmittingDeposit] = useState(false);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState('');
  const [showCregisModal, setShowCregisModal] = useState(false);

  // Deposit Audit History
  const [depositsTracker, setDepositsTracker] = useState([
    { id: 501, amount: 1000.00, currency: 'USD', gateway: 'usdt_trc20', tx_hash: '0x8f3c91a0b9821039a82', status: 'approved', created_at: '2026-08-16 10:15' },
    { id: 502, amount: 500.00, currency: 'USD', gateway: 'card_visa_mastercard', tx_hash: 'CH_PAY_881029', status: 'approved', created_at: '2026-08-15 16:45' }
  ]);

  // Withdrawal Form State
  const [withdrawMethod, setWithdrawMethod] = useState('crypto_usdt'); // 'crypto_usdt' | 'bank_wire' | 'debit_card' | 'skrill' | 'neteller' | 'local_depositor'
  const [withdrawNetwork, setWithdrawNetwork] = useState('TRC20'); // 'TRC20' | 'ERC20' | 'BEP20'
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [destinationDetails, setDestinationDetails] = useState('');
  const [localAgentDetails, setLocalAgentDetails] = useState('Agent #402 (Dubai UAE) - WhatsApp: +971 50 192 8374');
  const [submittingWd, setSubmittingWd] = useState(false);
  const [wdMsg, setWdMsg] = useState({ type: '', text: '' });
  const [showAddressBookModal, setShowAddressBookModal] = useState(false);

  // Withdrawal Audit History
  const [withdrawalsTracker, setWithdrawalsTracker] = useState([
    { id: 701, amount: 500.00, network_fee: 1.00, net_amount: 499.00, currency: 'USD', payout_method: 'crypto_usdt', network: 'TRC20', destination_details: 'T9zXX9Kpq7aK9qP8291mLaZ387nK', status: 'pending', created_at: '2026-08-17 14:20' },
    { id: 702, amount: 200.00, network_fee: 0.00, net_amount: 200.00, currency: 'USD', payout_method: 'bank_wire', network: 'NATIVE', destination_details: 'IBAN: GB82 BARC 2020 1530 9018', status: 'approved', created_at: '2026-08-15 11:30' }
  ]);

  // Internal Transfer Form State
  const [transferMode, setTransferMode] = useState('wallet_to_mt5');
  const [sourceId, setSourceId] = useState('Wallet');
  const [destId, setDestId] = useState('501928');
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
          if (accData.data?.accounts && accData.data.accounts.length > 0) setAccounts(accData.data.accounts);
        }

        // Withdrawals History
        const wdRes = await fetch('/api/financials/withdrawals', { headers: { 'Authorization': `Bearer ${token}` } });
        if (wdRes.ok) {
          const wdData = await wdRes.json();
          if (wdData.data?.withdrawals && wdData.data.withdrawals.length > 0) setWithdrawalsTracker(wdData.data.withdrawals);
        }
      } catch (e) {
        console.warn('Funding fetch warning:', e.message);
      }
    };

    fetchData();
  }, []);

  // Submit Withdrawal Handler
  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setSubmittingWd(true);
    setWdMsg({ type: '', text: '' });

    if (rawAmt < 50 || rawAmt > 50000) {
      setWdMsg({ type: 'error', text: 'Withdrawal amount must be between $50.00 and $50,000.00 USD' });
      setSubmittingWd(false);
      return;
    }

    if (rawAmt > wallet.available_balance) {
      setWdMsg({ type: 'error', text: `Insufficient available wallet balance ($${wallet.available_balance.toFixed(2)} USD)` });
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
          destination_details: withdrawMethod === 'local_depositor' ? localAgentDetails : destinationDetails
        })
      });

      const data = await res.json();
      if (res.ok && data.data?.withdrawal) {
        setWdMsg({ type: 'success', text: data.message || 'Withdrawal request submitted successfully!' });
        setWithdrawalsTracker(prev => [data.data.withdrawal, ...prev]);

        // Reserve balance in locked_balance
        setWallet(prev => ({
          ...prev,
          available_balance: prev.available_balance - rawAmt,
          locked_balance: prev.locked_balance + rawAmt
        }));

        setWithdrawAmount('500');
        setDestinationDetails('');
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
      } else {
        alert(data.message || 'Cancellation failed');
      }
    } catch (e) {
      alert('Server connection error during cancellation');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      
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
                ID: {wallet.wallet_number || 'W-90182'}
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Deposits Directory & Funding Channels</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Select your funding channel to deposit cash into your CRM wallet.</p>
            </div>

            <DepositGatewayDirectory
              selectedGateway={selectedGateway}
              onSelectGateway={(g) => setSelectedGateway(g)}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WITHDRAWAL PORTAL (MULTI-NETWORK, GAS FEES, ADDRESS BOOK) */}
      {/* ========================================================================= */}
      {activeTab === 'withdrawal' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Submit Withdrawal Request</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Withdraw funds directly to your whitelisted crypto wallet, bank IBAN, or e-wallet.</p>
            </div>

            {/* Address Book Picker Button */}
            <button
              onClick={() => setShowAddressBookModal(true)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-extrabold text-xs rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Bookmark className="w-4 h-4 text-emerald-600" />
              <span>Address Book</span>
            </button>
          </div>

          {wdMsg.text && (
            <div className={`px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              wdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {wdMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{wdMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleWithdrawalSubmit} className="space-y-5">
            
            {/* Payout Channel Method Selector */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">1. Select Payout Channel</label>
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
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">2. Destination Blockchain Network</label>
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

            {/* Withdrawal Amount & Automated Blockchain Gas Fee Calculation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">3. Withdrawal Amount (USD)</label>
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

              {/* Automated Fee Breakdown Box */}
              <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs font-mono">
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

            {/* Destination Address Input / Local Agent Selection */}
            {withdrawMethod === 'local_depositor' ? (
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Select Regional Local P2P Agent</label>
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
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">4. Destination Address / IBAN / Account Email</label>
                  <button
                    type="button"
                    onClick={() => setShowAddressBookModal(true)}
                    className="text-[11px] text-emerald-600 hover:underline font-bold cursor-pointer"
                  >
                    Select Saved Address
                  </button>
                </div>
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

            <button
              type="submit"
              disabled={submittingWd || rawAmt < 50 || rawAmt > wallet.available_balance}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-full transition-all shadow-lg shadow-emerald-600/25 active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{submittingWd ? 'Submitting Payout Request...' : `Submit Payout Request ($${netReceivable.toFixed(2)} Net)`}</span>
            </button>

          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERNAL TRANSFERS */}
      {/* ========================================================================= */}
      {activeTab === 'transfers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
          <div>
            <h2 className="text-xl font-black text-slate-900">Instant Internal Capital Transfer</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Move funds instantly with zero processing fees between wallet and MT5 trading accounts.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 block uppercase tracking-wider">1. Select Transfer Direction</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => { setTransferMode('wallet_to_mt5'); setSourceId('Wallet'); }}
                className={`py-3 px-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                  transferMode === 'wallet_to_mt5' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Wallet → MT5 Account
              </button>

              <button
                type="button"
                onClick={() => { setTransferMode('mt5_to_wallet'); setDestId('Wallet'); }}
                className={`py-3 px-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                  transferMode === 'mt5_to_wallet' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                MT5 Account → Wallet
              </button>

              <button
                type="button"
                onClick={() => setTransferMode('account_to_account')}
                className={`py-3 px-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                  transferMode === 'account_to_account' ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                MT5 Account → MT5 Account
              </button>
            </div>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setSubmittingTransfer(true);
            try {
              const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
              const res = await fetch('/api/financials/internal-transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                  transfer_type: transferMode,
                  source_id: transferMode === 'wallet_to_mt5' ? 'Wallet' : sourceId,
                  destination_id: transferMode === 'mt5_to_wallet' ? 'Wallet' : destId,
                  amount: parseFloat(transferAmount)
                })
              });
              const data = await res.json();
              if (res.ok && (data.ok || data.success)) setTransferMsg({ type: 'success', text: data.message });
              else setTransferMsg({ type: 'error', text: data.message });
            } catch (err) {
              setTransferMsg({ type: 'error', text: 'Server connection error.' });
            } finally {
              setSubmittingTransfer(false);
            }
          }} className="space-y-5">
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">Transfer Amount (USD)</label>
              <input
                type="number"
                required
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="500.00"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-extrabold text-base text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submittingTransfer}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-full transition-all shadow-lg shadow-emerald-600/25 cursor-pointer"
            >
              <span>Execute Transfer</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REAL-TIME WITHDRAWAL STATUS LEDGER WITH CANCELLATION TRIGGER */}
      {/* ========================================================================= */}
      {activeTab === 'withdrawal_history' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow space-y-4 animate-in fade-in duration-200 text-left">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              Real-Time Withdrawal Status Ledger
            </h3>
            <p className="text-xs text-slate-500 font-medium">Audit table tracking withdrawal requests, gas fee deductions, TXID hash details, and cancellation triggers.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3">Withdrawal ID</th>
                  <th className="py-3 px-3">Payout Method</th>
                  <th className="py-3 px-3">Destination Address</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3 text-right">Fee</th>
                  <th className="py-3 px-3 text-right">Net Payout</th>
                  <th className="py-3 px-3 text-right">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {withdrawalsTracker.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">#WD-{w.id}</td>
                    <td className="py-3 px-3 uppercase font-extrabold text-emerald-700">
                      {w.payout_method.replace(/_/g, ' ')} ({w.network || 'TRC20'})
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 max-w-[150px] truncate">{w.destination_details}</td>
                    <td className="py-3 px-3 text-slate-500">{w.created_at}</td>
                    <td className="py-3 px-3 text-right font-mono text-rose-600">-${parseFloat(w.network_fee || 0).toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900">${parseFloat(w.net_amount || w.amount).toFixed(2)} USD</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase ${
                        w.status === 'approved' || w.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800' 
                          : w.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {w.status === 'pending' ? (
                        <button
                          onClick={() => handleCancelWithdrawal(w.id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancel
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cregis Crypto Modal */}
      <CregisModal
        isOpen={showCregisModal}
        onClose={() => setShowCregisModal(false)}
        amount={parseFloat(depositAmount)}
        tokenType={selectedGateway.toUpperCase()}
        onSuccess={() => {
          setWallet(prev => ({
            ...prev,
            total_balance: prev.total_balance + parseFloat(depositAmount),
            available_balance: prev.available_balance + parseFloat(depositAmount)
          }));
          setDepositSuccessMsg(`Cregis Payment of $${depositAmount} USD confirmed on blockchain!`);
          setTimeout(() => setDepositSuccessMsg(''), 4000);
        }}
      />

      {/* Address Book Modal */}
      <AddressBookModal
        isOpen={showAddressBookModal}
        onClose={() => setShowAddressBookModal(false)}
        onSelectAddress={(entry) => {
          setDestinationDetails(entry.address);
          if (entry.network) setWithdrawNetwork(entry.network);
          if (entry.method) setWithdrawMethod(entry.method);
        }}
      />

    </div>
  );
}
