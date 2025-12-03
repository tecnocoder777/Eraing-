import React from 'react';
import { UserState } from '../types';
import { CreditCard, Wallet as WalletIcon, ArrowRight, Lock } from 'lucide-react';

interface WalletProps {
  user: UserState;
}

const Wallet: React.FC<WalletProps> = ({ user }) => {
  const conversionRate = 0.001; // 1000 coins = $1
  const usdValue = (user.balance * conversionRate).toFixed(2);
  const minWithdraw = 10.00;
  const progress = Math.min(100, (parseFloat(usdValue) / minWithdraw) * 100);

  return (
    <div className="pb-20">
      <div className="mb-8 text-center">
        <p className="text-slate-400 text-sm mb-2">Total Earnings</p>
        <h1 className="text-5xl font-bold text-white mb-2">${usdValue}</h1>
        <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
           <span className="w-2 h-2 rounded-full bg-brand-500"></span>
           <span className="text-xs text-slate-300">{user.balance.toLocaleString()} Coins</span>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-end mb-4">
             <div>
                <h3 className="font-bold text-white">Withdrawal Progress</h3>
                <p className="text-xs text-slate-400">Minimum payout is ${minWithdraw}</p>
             </div>
             <span className="text-brand-400 font-bold">{Math.floor(progress)}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 mb-2">
            <div className="bg-brand-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <h3 className="text-white font-bold mb-4">Payout Methods</h3>
      <div className="space-y-3">
        {['PayPal', 'Amazon Gift Card', 'Crypto (USDT)'].map((method) => (
            <div key={method} className="bg-slate-800 p-4 rounded-xl flex items-center justify-between opacity-75 hover:opacity-100 transition-opacity cursor-not-allowed">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-700 p-3 rounded-lg text-slate-300">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <p className="text-slate-200 font-medium">{method}</p>
                        <p className="text-xs text-slate-500">Fee: 2%</p>
                    </div>
                </div>
                {parseFloat(usdValue) >= minWithdraw ? (
                    <ArrowRight className="text-slate-400" />
                ) : (
                    <Lock size={16} className="text-slate-600" />
                )}
            </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-brand-900/20 border border-brand-900/50 rounded-xl text-center">
        <p className="text-brand-200 text-sm">
            Keep playing games and completing AI challenges to reach the payout threshold faster!
        </p>
      </div>
    </div>
  );
};

export default Wallet;
