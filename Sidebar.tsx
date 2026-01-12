
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'search', icon: 'fa-magnifying-glass', label: 'Prospector' },
    { id: 'leads', icon: 'fa-address-book', label: 'My Leads' },
    { id: 'chat', icon: 'fa-robot', label: 'AI Strategy' },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-rocket text-xl text-white"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">LeadGen AI</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Credits Remaining</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">840 / 1000</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[84%]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
