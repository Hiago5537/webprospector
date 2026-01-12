
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import LeadSearch from './components/LeadSearch.tsx';
import Chatbot from './components/Chatbot.tsx';
import MyLeads from './components/MyLeads.tsx';
import { BusinessLead, CRMStatus } from './types.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [savedLeads, setSavedLeads] = useState<BusinessLead[]>(() => {
    try {
      const saved = localStorage.getItem('leadgen_leads');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Falha ao carregar leads do localStorage:", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('leadgen_leads', JSON.stringify(savedLeads));
    } catch (e) {
      console.error("Falha ao salvar leads:", e);
    }
  }, [savedLeads]);

  const handleSaveLead = (lead: BusinessLead) => {
    if (savedLeads.find(l => l.name === lead.name)) {
      alert("Lead já salvo!");
      return;
    }
    setSavedLeads(prev => [...prev, lead]);
    alert("Lead adicionado ao CRM!");
  };

  const handleUpdateLeadStatus = (id: string, status: CRMStatus) => {
    setSavedLeads(prev => prev.map(l => l.id === id ? { ...l, crmStatus: status } : l));
  };

  const handleRemoveLead = (id: string) => {
    if (window.confirm("Deseja remover este lead?")) {
      setSavedLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <LeadSearch onSaveLead={handleSaveLead} />;
      case 'chat':
        return <Chatbot />;
      case 'leads':
        return (
          <div className="animate-fadeIn">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white">Lead Pipeline</h1>
              <p className="text-slate-400 mt-2">Acompanhe seu progresso de prospecção e estágios de conversão.</p>
            </header>
            <MyLeads 
              leads={savedLeads} 
              onUpdateStatus={handleUpdateLeadStatus} 
              onRemoveLead={handleRemoveLead}
            />
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                SISTEMA ONLINE: OPERACIONAL
             </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right">
                <p className="text-sm font-bold text-white">Alex Morgan</p>
                <p className="text-xs text-slate-500">Agência Pro</p>
              </div>
              <img src="https://picsum.photos/40/40?random=1" className="w-10 h-10 rounded-xl border border-slate-700" alt="Profile" />
            </div>
          </div>
        </header>
        {renderContent()}
      </main>
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${activeTab === 'chat' ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}`}
        >
          <i className="fas fa-robot text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
