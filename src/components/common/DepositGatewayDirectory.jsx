import React, { useState } from 'react';
import { QrCode, CreditCard, Landmark, Zap, ShieldCheck, ArrowRight, Smartphone, Coins, Wallet, SmartphoneNfc, Users } from 'lucide-react';

export default function DepositGatewayDirectory({
  selectedGateway = 'usdt_trc20',
  onSelectGateway = () => {}
}) {
  const [activeDepositTab, setActiveDepositTab] = useState('gateway'); // 'gateway' | 'crypto' | 'wire' | 'upi' | 'local'

  const categoriesMap = {
    gateway: {
      id: 'gateway',
      title: 'Gateway',
      icon: CreditCard,
      items: [
        { id: 'cregis_crypto', name: 'Instant Merchant Gateway', badge: 'Auto Checkout', speed: 'Instant', limit: '$20 - $500,000', icon: Zap, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        { id: 'card_visa_mastercard', name: 'Credit / Debit Card Gateway', badge: 'Visa / Mastercard', speed: 'Instant Fiat', limit: '$20 - $10,000', icon: CreditCard, color: 'text-slate-900 bg-slate-100 border-slate-300' }
      ]
    },
    crypto: {
      id: 'crypto',
      title: 'Cryptocurrency',
      icon: QrCode,
      items: [
        { id: 'usdt_trc20', name: 'USDT TRC20/BEP20', badge: 'Low Fee', speed: 'Instant', limit: 'Cryptocurrency', icon: QrCode, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        { id: 'usdt_erc20', name: 'USDT (ERC-20)', badge: 'Ethereum', speed: '5-10 Mins', limit: '$50 - $250,000', icon: QrCode, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
        { id: 'btc_onchain', name: 'Bitcoin (BTC)', badge: 'On-Chain', speed: '2-3 Confirmations', limit: '$100 - $500,000', icon: Coins, color: 'text-orange-600 bg-orange-50 border-orange-200' },
        { id: 'eth_native', name: 'Ethereum (ETH)', badge: 'Native ETH', speed: '12 Confirmations', limit: '$50 - $250,000', icon: Coins, color: 'text-blue-600 bg-blue-50 border-blue-200' },
        { id: 'manual_crypto', name: 'Other / Manual Crypto', badge: 'Manual TXID', speed: '15-30 Mins', limit: '$10 - $50,000', icon: QrCode, color: 'text-purple-600 bg-purple-50 border-purple-200' }
      ]
    },
    wire: {
      id: 'wire',
      title: 'Wire Transfer',
      icon: Landmark,
      items: [
        { id: 'bank_wire', name: 'International Bank Wire', badge: 'SWIFT / IBAN', speed: '1-2 Business Days', limit: '$500 - $1,000,000', icon: Landmark, color: 'text-teal-800 bg-teal-50 border-teal-300' }
      ]
    },
    upi: {
      id: 'upi',
      title: 'UPI / UPI QR',
      icon: Smartphone,
      items: [
        { id: 'upi_qr', name: 'UPI Direct / PhonePe / GPay QR', badge: 'INR Instant', speed: 'Instant QR', limit: '₹500 - ₹200,000', icon: Smartphone, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' }
      ]
    },
    local: {
      id: 'local',
      title: 'Local Depositor',
      icon: Users,
      items: [
        { id: 'local_depositor', name: 'Local P2P Cash Agent', badge: 'Regional Desk', speed: 'Same Day Desk', limit: '$100 - $50,000', icon: Users, color: 'text-amber-700 bg-amber-50 border-amber-200' }
      ]
    }
  };

  const tabs = [
    { id: 'gateway', label: 'Gateway', count: categoriesMap.gateway.items.length, icon: CreditCard },
    { id: 'crypto', label: 'Cryptocurrency', count: categoriesMap.crypto.items.length, icon: QrCode },
    { id: 'wire', label: 'Wire Transfer', count: categoriesMap.wire.items.length, icon: Landmark },
    { id: 'upi', label: 'UPI / UPI QR', count: categoriesMap.upi.items.length, icon: Smartphone },
    { id: 'local', label: 'Local Depositor', count: categoriesMap.local.items.length, icon: Users }
  ];

  const currentCategory = categoriesMap[activeDepositTab] || categoriesMap.gateway;

  return (
    <div className="space-y-6 text-left">
      
      {/* Category Method Filter Tabs matching Screenshot 1 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {tabs.map(t => {
          const IconC = t.icon;
          const isActive = activeDepositTab === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveDepositTab(t.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <IconC className="w-4 h-4" />
              <span>{t.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCategory.items.map(item => {
          const isSelected = selectedGateway === item.id;
          const IconComp = item.icon;

          return (
            <div
              key={item.id}
              onClick={() => onSelectGateway(item.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                isSelected 
                  ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-md scale-[1.01]' 
                  : 'border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold border shrink-0 ${item.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs">{item.name}</h5>
                    <span className="text-[10px] text-slate-400 font-semibold">Processing <strong className="text-slate-700">{item.speed}</strong></span>
                  </div>
                </div>

                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {item.badge}
                </span>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Processing:</span>
                  <span className="font-bold text-slate-800">{item.speed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fee:</span>
                  <span className="font-bold text-emerald-600">0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Limits:</span>
                  <span className="font-bold text-slate-800">{item.limit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
