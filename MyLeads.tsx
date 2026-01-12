
import React from 'react';
import { BusinessLead, CRMStatus } from '../types';

interface MyLeadsProps {
  leads: BusinessLead[];
  onUpdateStatus: (id: string, status: CRMStatus) => void;
  onRemoveLead: (id: string) => void;
}

const MyLeads: React.FC<MyLeadsProps> = ({ leads, onUpdateStatus, onRemoveLead }) => {
  const columns = [
    { status: CRMStatus.NEW, label: 'New Prospects', color: 'bg-blue-500' },
    { status: CRMStatus.CONTACTED, label: 'Contacted', color: 'bg-purple-500' },
    { status: CRMStatus.MEETING, label: 'Meetings', color: 'bg-amber-500' },
    { status: CRMStatus.CLOSED, label: 'Closed Won', color: 'bg-emerald-500' },
  ];

  const getLeadsByStatus = (status: CRMStatus) => leads.filter(l => l.crmStatus === status);

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar min-h-[70vh]">
      {columns.map(col => (
        <div key={col.status} className="flex-shrink-0 w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">{col.label}</h3>
            </div>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {getLeadsByStatus(col.status).length}
            </span>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex-1 space-y-4">
            {getLeadsByStatus(col.status).map(lead => (
              <div key={lead.id} className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl shadow-lg group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                  <button onClick={() => onRemoveLead(lead.id)} className="text-slate-600 hover:text-rose-500 transition-colors">
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mb-4">{lead.industry}</p>
                
                <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-800/50">
                   <select 
                    value={lead.crmStatus}
                    onChange={(e) => onUpdateStatus(lead.id, e.target.value as CRMStatus)}
                    className="bg-slate-800 text-[10px] text-slate-300 rounded px-2 py-1 outline-none border-none cursor-pointer"
                   >
                     {Object.values(CRMStatus).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                   <button className="text-[10px] bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded hover:bg-indigo-600/40 transition-all font-bold">
                     Details
                   </button>
                </div>
              </div>
            ))}
            {getLeadsByStatus(col.status).length === 0 && (
              <div className="h-40 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Empty</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyLeads;
