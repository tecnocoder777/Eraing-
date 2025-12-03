import React, { useState } from 'react';
import { Gamepad2, Brain, Disc, MousePointerClick, PlayCircle } from 'lucide-react';
import TriviaGame from './TriviaGame';
import { AdModal } from './ui/AdModal';
import { BannerAd } from './ui/BannerAd';

interface GamesProps {
  onEarn: (amount: number, source: string) => void;
}

const Games: React.FC<GamesProps> = ({ onEarn }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [spinCooldown, setSpinCooldown] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const handleTriviaComplete = (score: number) => {
    onEarn(score, "Trivia Reward");
  };

  const handleSpinWheel = () => {
    if(spinCooldown) return;
    setSpinCooldown(true);
    
    // Simulate spin duration
    setTimeout(() => {
        const rewards = [10, 20, 50, 100, 0, 5];
        const win = rewards[Math.floor(Math.random() * rewards.length)];
        if (win > 0) onEarn(win, "Lucky Wheel");
        setSpinCooldown(false);
        if (win === 0) alert("Bad luck! Try again.");
    }, 2000);
  };

  const handleClicker = () => {
     onEarn(1, "Tap Mining");
  };

  const handleWatchAd = () => {
    setShowAd(true);
  };

  const handleAdReward = () => {
    onEarn(25, "Ad Watched");
  };

  if (activeGame === 'trivia') {
    return <TriviaGame onComplete={handleTriviaComplete} onClose={() => setActiveGame(null)} />;
  }

  return (
    <div className="pb-20">
      <AdModal 
        isOpen={showAd} 
        onClose={() => setShowAd(false)} 
        onReward={handleAdReward} 
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Arcade</h2>
        <p className="text-slate-400 text-sm">Play games to stack up coins.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Trivia Card */}
        <div 
            onClick={() => setActiveGame('trivia')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-3xl relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
        >
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
                <Brain size={100} />
            </div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-1">AI Trivia</h3>
                <p className="text-indigo-100 mb-4">Challenge your knowledge powered by Gemini.</p>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white font-medium">Top Rated</span>
            </div>
        </div>

        {/* Watch Ad for Coins */}
        <div 
            onClick={handleWatchAd}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-3xl relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
        >
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
                <PlayCircle size={100} />
            </div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-1">Watch & Earn</h3>
                <p className="text-emerald-100 mb-4">Watch a short video to earn coins instantly.</p>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white font-medium">+25 Coins</span>
            </div>
        </div>

        <BannerAd />

        {/* Spin Wheel */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl flex items-center justify-between">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">Lucky Wheel</h3>
                <p className="text-slate-400 text-sm mb-3">Spin daily for free rewards.</p>
                <button 
                    disabled={spinCooldown}
                    onClick={handleSpinWheel}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${spinCooldown ? 'bg-slate-700 text-slate-500' : 'bg-brand-500 hover:bg-brand-400 text-slate-900'}`}
                >
                    {spinCooldown ? 'Spinning...' : 'Spin Now'}
                </button>
            </div>
            <div className={`text-brand-500 ${spinCooldown ? 'animate-spin' : ''}`}>
                <Disc size={64} />
            </div>
        </div>

        {/* Clicker / Mining */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl flex items-center justify-between">
             <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Coin Miner</h3>
                <p className="text-slate-400 text-sm mb-3">Tap to mine coins manually.</p>
             </div>
             <button 
                onClick={handleClicker}
                className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 h-16 w-16 rounded-full flex items-center justify-center border-4 border-slate-600 active:scale-90 transition-all shadow-lg shadow-black/40"
             >
                <MousePointerClick className="text-white" />
             </button>
        </div>
      </div>
    </div>
  );
};

export default Games;
