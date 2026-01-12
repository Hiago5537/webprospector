
import React, { useState } from 'react';
import { searchLeads, analyzeLead, researchCompetitors, draftEmails } from '../services/geminiService';
import { BusinessLead, WebsiteStatus, Competitor, CRMStatus } from '../types';

interface LeadSearchProps {
  onSaveLead: (lead: BusinessLead) => void;
}

const LeadSearch: React.FC<LeadSearchProps> = ({ onSaveLead }) => {
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<BusinessLead | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [emails, setEmails] = useState<{direct: string, story: string, urgent: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'competitors' | 'emails'>('analysis');
  const [analyzing, setAnalyzing] = useState(false);

  const handleDetectLocation = () => {
    setDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Em um app real, usaríamos reverse geocoding aqui. 
          // Para o MVP, preenchemos com "Perto de mim" e passamos as coordenadas.
          setLocation(`Minha localização atual`);
          setDetecting(false);
        },
        () => {
          alert("Não foi possível detectar sua localização.");
          setDetecting(false);
        }
      );
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !location) return;
    setLoading(true);
    
    let coords;
    if (location.includes("Minha localização")) {
      coords = await new Promise<{lat: number, lng: number}>((resolve) => {
        navigator.geolocation.getCurrentPosition(p => resolve({lat: p.coords.latitude, lng: p.coords.longitude}));
      });
    }

    const results = await searchLeads(niche, location, coords);
    setLeads(results);
    setLoading(false);
  };

  const handleLeadClick = async (lead: BusinessLead) => {
    setSelectedLead(lead);
    setAnalyzing(true);
    setAnalysis(null);
    setCompetitors([]);
    setEmails(null);
    setActiveTab('analysis');

    try {
      const [ana, comp] = await Promise.all([
        analyzeLead(lead),
        researchCompetitors(lead)
      ]);
      setAnalysis(ana);
      setCompetitors(comp);
      const draftRes = await draftEmails(lead, ana);
      setEmails(draftRes);
    } catch (err) {
      setAnalysis("Erro ao processar inteligência do lead.");
    } finally {
      setAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-map-marked-alt text-indigo-500"></i> Local Business Prospector
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20">
            <i className="fas fa-check-circle"></i> GOOGLE MAPS GROUNDING ACTIVE
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <i className="fas fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input
              type="text"
              placeholder="Ramo (ex: Pizzaria, Dentista)"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex-1 min-w-[200px] relative">
            <i className="fas fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input
              type="text"
              placeholder="Cidade ou Bairro"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-12 py-3 text-white focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button 
              type="button"
              onClick={handleDetectLocation}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300"
              title="Detectar minha localização"
            >
              <i className={`fas ${detecting ? 'fa-spinner fa-spin' : 'fa-crosshairs'}`}></i>
            </button>
          </div>
          <button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-search mr-2"></i>}
            Prospectar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {leads.length === 0 && !loading && (
            <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
              <i className="fas fa-map-pin text-3xl text-slate-700 mb-4"></i>
              <p className="text-slate-500 text-sm px-8">Use a barra acima para buscar empresas diretamente do Google Maps.</p>
            </div>
          )}
          {leads.map(lead => (
            <div 
              key={lead.id}
              onClick={() => handleLeadClick(lead)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${selectedLead?.id === lead.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">{lead.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <i className="fas fa-map-marker-alt text-[10px]"></i> {lead.location}
                  </p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter ${
                  lead.status === WebsiteStatus.NO_WEBSITE ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                }`}>
                  {lead.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Digital Health:</span>
                    <span className="text-xs font-bold text-white">{lead.auditScore}%</span>
                  </div>
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${lead.auditScore}%` }}></div>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-3xl flex flex-col min-h-[600px] shadow-2xl">
          {selectedLead ? (
            <>
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-600/20">
                    {selectedLead.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">{selectedLead.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-xs text-slate-500">{selectedLead.industry}</span>
                       <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                       <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLead.name + " " + selectedLead.location)}`} target="_blank" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                         <i className="fas fa-external-link-alt text-[10px] mr-1"></i> Ver no Google Maps
                       </a>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onSaveLead({...selectedLead, crmStatus: CRMStatus.NEW})}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <i className="fas fa-save"></i> Adicionar ao CRM
                </button>
              </div>

              <div className="flex border-b border-slate-800 bg-slate-900/20">
                {(['analysis', 'competitors', 'emails'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                      activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"></div>}
                  </button>
                ))}
              </div>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-gradient-to-b from-transparent to-slate-900/20">
                {analyzing ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-6 py-20">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <i className="fas fa-brain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse text-2xl"></i>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold mb-1 tracking-wide">Gerando Inteligência Competitiva</p>
                      <p className="text-slate-400 text-xs italic">Cruzando dados de mercado do Google Meu Negócio...</p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    {activeTab === 'analysis' && (
                      <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                          <i className="fas fa-chart-line text-indigo-500"></i>
                          <h4 className="font-bold text-white uppercase text-xs tracking-widest">Diagnóstico Digital</h4>
                        </div>
                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                          {analysis || "Selecione um lead para iniciar a auditoria baseada em dados reais do Google."}
                        </div>
                      </div>
                    )}

                    {activeTab === 'competitors' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {competitors.length > 0 ? competitors.map((c, i) => (
                          <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 group hover:border-indigo-500/50 transition-all">
                            <h5 className="font-bold text-white mb-1 group-hover:text-indigo-400">{c.name}</h5>
                            <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" className="text-[10px] text-slate-500 hover:text-indigo-400 hover:underline mb-4 block truncate">
                              {c.website}
                            </a>
                            <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
                              <p className="text-[10px] text-indigo-400 font-black uppercase mb-2 tracking-tighter">Sinal de Alerta / Vantagem</p>
                              <p className="text-xs text-slate-300 italic leading-relaxed">"{c.advantage}"</p>
                            </div>
                          </div>
                        )) : (
                          <div className="col-span-2 text-center py-10 opacity-50">
                            <i className="fas fa-users-slash text-2xl mb-2"></i>
                            <p className="text-xs">Nenhum competidor direto identificado nesta região.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'emails' && emails && (
                      <div className="space-y-6">
                        {Object.entries(emails as Record<string, string>).map(([type, text]) => (
                          <div key={type} className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                            <div className="px-5 py-4 bg-slate-800/40 flex justify-between items-center border-b border-slate-800">
                              <span className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.2em]">{type} approach</span>
                              <button 
                                onClick={() => copyToClipboard(text)}
                                className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
                              >
                                <i className="far fa-copy"></i> Copiar
                              </button>
                            </div>
                            <div className="p-6 text-sm text-slate-300 italic whitespace-pre-wrap leading-relaxed">
                              {text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-12 opacity-50">
              <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-8 border border-slate-800">
                <i className="fas fa-map-location-dot text-4xl text-slate-700"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Lead Intelligence Hub</h3>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                Busque por empresas locais para extrair diagnósticos profundos do Google Meu Negócio e gerar estratégias de conversão.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadSearch;
