
import React from 'react';
import { UserState } from '../types.ts';
import { Coins, Zap, Trophy, TrendingUp } from 'lucide-react';
import { BannerAd } from './ui/BannerAd.tsx';

interface DashboardProps {
  user: UserState;
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header / Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 shadow-2xl text-white">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Coins size={120} />
        </div>
        
        <div className="relative z-10">
          <p className="text-brand-100 font-medium mb-1">Total Balance</p>
          <h1 className="text-5xl font-bold mb-4 tracking-tight flex items-center gap-2">
            {user.balance.toLocaleString()} <span className="text-2xl text-brand-200">©</span>
          </h1>
          
          <div className="flex gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1">
              <div className="flex items-center gap-2 text-brand-100 text-sm mb-1">
                <Trophy size={14} /> Level {user.level}
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div 
                  className="bg-brand-300 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(user.xp % 1000) / 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Placeholder */}
      <BannerAd />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('games')}
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          <div className="bg-purple-500/20 p-3 rounded-full group-hover:bg-purple-500/30 transition-colors">
            <Zap className="text-purple-400" size={24} />
          </div>
          <span className="font-semibold text-slate-200">Play Games</span>
          <span className="text-xs text-slate-400">Earn +500/hr</span>
        </button>

        <button 
          onClick={() => onNavigate('tasks')}
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          <div className="bg-emerald-500/20 p-3 rounded-full group-hover:bg-emerald-500/30 transition-colors">
            <TrendingUp className="text-emerald-400" size={24} />
          </div>
          <span className="font-semibold text-slate-200">Complete Tasks</span>
          <span className="text-xs text-slate-400">3 New Available</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-slate-400 font-medium mb-3 uppercase text-xs tracking-wider">Recent Activity</h3>
        <div className="space-y-3">
          {user.history.length === 0 ? (
            <div className="text-slate-600 text-center py-8 bg-slate-800/50 rounded-2xl border border-slate-800">
              No activity yet. Start earning!
            </div>
          ) : (
            user.history.slice(0, 5).map((tx) => (
              <div key={tx.id} className="bg-slate-800 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === 'earn' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {tx.type === 'earn' ? <TrendingUp size={16} /> : <Coins size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{tx.title}</p>
                    <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <span className={`font-bold ${tx.type === 'earn' ? 'text-green-400' : 'text-slate-400'}`}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
