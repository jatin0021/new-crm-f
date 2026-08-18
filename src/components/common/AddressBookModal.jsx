import React, { useState, useEffect } from 'react';
import { useAlert } from '../../context/AlertContext';
import { Bookmark, Plus, Check, X, ShieldCheck, QrCode, Landmark, CreditCard } from 'lucide-react';

export default function AddressBookModal({
  isOpen = false,
  onClose = () => {},
  onSelectAddress = () => {}
}) {
  const { alertError, alertSuccess } = useAlert();
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'My Binance TRC20 Wallet', method: 'crypto_usdt', network: 'TRC20', address: 'T9zXX9Kpq7aK9qP8291mLaZ387nK', is_whitelisted: true },
    { id: 2, label: 'Personal Barclays IBAN', method: 'bank_wire', network: 'NATIVE', address: 'GB82 BARC 2020 1530 9018 29', is_whitelisted: true }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newMethod, setNewMethod] = useState('crypto_usdt');
  const [newNetwork, setNewNetwork] = useState('TRC20');
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchAddressBook = async () => {
      try {
        const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
        const res = await fetch('/api/financials/address-book', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.addresses && data.data.addresses.length > 0) {
            setAddresses(data.data.addresses);
          }
        }
      } catch (e) {}
    };
    fetchAddressBook();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('crm_jwt_token') || sessionStorage.getItem('crm_jwt_token');
      const res = await fetch('/api/financials/address-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          label: newLabel,
          method: newMethod,
          network: newNetwork,
          address: newAddress
        })
      });

      const data = await res.json();
      if (res.ok && data.data?.entry) {
        setAddresses(prev => [data.data.entry, ...prev]);
        setShowAddForm(false);
        setNewLabel('');
        setNewAddress('');
        alertSuccess('Withdrawal address saved to address book!');
      } else {
        alertError(data.message || 'Failed to save address');
      }
    } catch (e) {
      alertError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 max-w-lg w-full text-white space-y-5 shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Whitelisted Address Book</h3>
              <p className="text-xs text-slate-400">Save and select verified withdrawal destinations.</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-full cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'View Saved' : 'Add New'}</span>
          </button>
        </div>

        {/* Form or List */}
        {showAddForm ? (
          <form onSubmit={handleSaveAddress} className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 animate-in fade-in">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Friendly Address Label *</label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. My Ledger Cold Storage"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Payment Method</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white cursor-pointer"
                >
                  <option value="crypto_usdt">Crypto USDT</option>
                  <option value="bank_wire">Bank Wire IBAN</option>
                  <option value="skrill">Skrill E-Wallet</option>
                  <option value="neteller">Neteller E-Wallet</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Network</label>
                <select
                  value={newNetwork}
                  onChange={(e) => setNewNetwork(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white cursor-pointer"
                >
                  <option value="TRC20">TRC20 (Tron)</option>
                  <option value="ERC20">ERC20 (Ethereum)</option>
                  <option value="BEP20">BEP20 (BSC)</option>
                  <option value="NATIVE">Native Bank</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Destination Address / IBAN *</label>
              <input
                type="text"
                required
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="TRC20 address or IBAN number"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-full shadow-md cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save & Whitelist Address'}
            </button>
          </form>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {addresses.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAddress(item);
                  onClose();
                }}
                className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-white group-hover:text-emerald-400 transition-colors">{item.label}</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                      {item.network || 'TRC20'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 truncate block mt-0.5">{item.address}</span>
                </div>

                <span className="text-xs font-bold text-emerald-400 shrink-0">Use Address</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
