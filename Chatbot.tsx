
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your LeadGen Strategy partner. Need help crafting a pitch, researching a market, or choosing a tech stack? Ask me anything." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await chatWithAI(input);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <i className="fas fa-brain text-white"></i>
          </div>
          <div>
            <h2 className="font-bold text-white">Strategy Assistant</h2>
            <p className="text-xs text-indigo-400 font-medium">Powered by Gemini 3 Pro (Thinking Mode)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none border border-slate-700 p-4 max-w-[80%]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
                <span className="text-xs text-slate-400 italic">Thinking deeply...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-6 bg-slate-900/80 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your strategic question..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white w-12 rounded-xl transition-all flex items-center justify-center"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-4 uppercase font-bold tracking-widest">
          Complex reasoning enabled • Thinking budget: 32,768 tokens
        </p>
      </form>
    </div>
  );
};

export default Chatbot;
