import React, { useState } from 'react';
import { MessageSquare, X, Send, User, Bot, Headset, Sparkles } from 'lucide-react';

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hello! Welcome to Vintage CRM Support. How can we assist with your trading account or deposits today?', time: '12:30 PM' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQuestions = ['Deposit Help', 'MT5 Login Issue', 'Verification Status'];

  const handleSendMessage = (textToSend = null) => {
    const queryText = textToSend || inputMessage;
    if (!queryText || !queryText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputMessage('');

    // Simulate Agent Auto Response after 1 sec
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: 'Thank you! A dedicated senior support desk officer has received your message and will respond shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 p-4 text-white flex items-center justify-between border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-bold">
                  <Headset className="w-4.5 h-4.5" />
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight text-white">Institutional Client Desk</h4>
                <p className="text-[11px] text-emerald-300 flex items-center gap-1.5 font-bold mt-0.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span> Live 24/7 Support
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[78%] p-3.5 rounded-2xl text-xs font-medium ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-900 border border-slate-200/80 shadow-xs rounded-bl-xs'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] mt-1 block font-mono text-right font-semibold ${
                    msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Pill Buttons */}
          <div className="px-3 py-1.5 bg-slate-100/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-full text-[10px] font-bold text-slate-700 hover:text-emerald-700 whitespace-nowrap cursor-pointer transition-all shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Footer Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center justify-center transition-all shrink-0 shadow-md shadow-emerald-600/25 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-600/30 hover:shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer relative"
        title="Live Support Chat"
      >
        <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
        <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
      </button>

    </div>
  );
}

