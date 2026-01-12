
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', leads: 40, outreach: 24 },
  { name: 'Tue', leads: 30, outreach: 13 },
  { name: 'Wed', leads: 20, outreach: 98 },
  { name: 'Thu', leads: 27, outreach: 39 },
  { name: 'Fri', leads: 18, outreach: 48 },
  { name: 'Sat', leads: 23, outreach: 38 },
  { name: 'Sun', leads: 34, outreach: 43 },
];

const StatCard = ({ title, value, change, icon, color }: any) => (
  <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <i className={`fas ${icon} text-white`}></i>
      </div>
      <span className={`text-sm font-bold ${change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, Agent</h1>
          <p className="text-slate-400 mt-2">Here is what's happening with your prospects today.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="New Leads Found" value="128" change="+12%" icon="fa-users" color="bg-blue-600" />
        <StatCard title="Response Rate" value="24.5%" change="+3.2%" icon="fa-paper-plane" color="bg-purple-600" />
        <StatCard title="Potential Revenue" value="$42,500" change="+8%" icon="fa-wallet" color="bg-emerald-600" />
        <StatCard title="Average Deal Size" value="$1,200" change="-2%" icon="fa-chart-line" color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Discovery Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Market Trends</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Restaurants</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5">
                  <div className="bg-indigo-500 h-full w-[75%]"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400">75%</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Real Estate</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5">
                  <div className="bg-rose-500 h-full w-[45%]"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400">45%</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Legal Services</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5">
                  <div className="bg-emerald-500 h-full w-[60%]"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400">60%</span>
            </div>
          </div>
          <div className="mt-8 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
            <p className="text-xs text-indigo-300 font-medium">AI INSIGHT</p>
            <p className="text-sm text-slate-300 mt-1">Local dental clinics in North Jersey show a 40% lack of mobile-responsive sites this month.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
