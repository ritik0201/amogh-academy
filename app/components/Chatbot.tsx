"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Hi there! 👋 Welcome to Amogh Academy. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await res.json();
      
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please call us directly!" }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "An error occurred. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-[22rem] sm:w-[24rem] h-[500px] max-h-[80vh] flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 transition-all origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 [mask-image:linear-gradient(45deg,transparent,white)] pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-full shadow-sm backdrop-blur-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Amogh Support</h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1.5 mt-0.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse relative"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors relative z-10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 relative space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 relative shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.02)]">
            <div className="relative flex items-center shadow-sm">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..." 
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium text-slate-900 transition-all placeholder-slate-400"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <div 
        className="relative group block"
        onMouseEnter={() => !isOpen && setIsOpen(true)}
      >
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-4 rounded-full shadow-xl shadow-blue-500/30 transition-all duration-300 z-10 flex items-center justify-center
            ${isOpen ? 'bg-slate-800 hover:bg-slate-700 rotate-90 scale-95' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-110 hover:shadow-blue-500/50'}`}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white transition-transform -rotate-90" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-7 h-7 text-white fill-current opacity-90" />
              <div className="absolute -top-1.5 -right-1.5">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-blue-500"></span>
                </span>
              </div>
            </div>
          )}
        </button>
        
        {/* Helper text tooltip next to the button asking for attention */}
        {!isOpen && (
           <div className="absolute top-1/2 -translate-y-1/2 right-[100%] mr-4 bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 text-sm font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none">
             Have a question? 👋
             <div className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 bg-white border-t border-r border-slate-100 transform rotate-45"></div>
           </div>
        )}
      </div>

    </div>
  );
}
