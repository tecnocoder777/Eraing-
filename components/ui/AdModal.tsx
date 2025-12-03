import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Star } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: () => void;
}

export const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose, onReward }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [rewardGranted, setRewardGranted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(5);
      setRewardGranted(false);
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (!rewardGranted) {
                onReward();
                setRewardGranted(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      {/* Ad Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
        <div className="bg-black/60 backdrop-blur-md text-white/90 px-3 py-1 rounded-md text-xs font-bold border border-white/10">
            Ad · 0:{timeLeft.toString().padStart(2, '0')}
        </div>
        {timeLeft === 0 ? (
          <button 
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white backdrop-blur-sm transition-all animate-in zoom-in"
          >
            <X size={24} />
          </button>
        ) : (
           <div className="text-white/50 text-xs font-medium pt-2 pr-2">
             Reward in {timeLeft}s
           </div>
        )}
      </div>

      {/* Simulated Ad Content */}
      <div className="flex-1 bg-gradient-to-b from-indigo-900 to-slate-900 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
         {/* Background elements */}
         <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse-fast"></div>
         <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse-fast"></div>

         <div className="z-10 bg-white p-6 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-8 transform transition-transform hover:scale-105 duration-500">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto flex items-center justify-center text-4xl shadow-inner">
                ⚡
            </div>
         </div>
         
         <h2 className="text-3xl font-bold text-white mb-2 z-10">Thunder VPN</h2>
         <div className="flex justify-center gap-1 text-yellow-400 mb-6 z-10">
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
         </div>
         
         <p className="text-indigo-200 mb-8 max-w-xs z-10 leading-relaxed">
            Protect your privacy with the world's fastest VPN. Download now for a free trial!
         </p>
         
         <button className="bg-[#4285F4] text-white font-bold py-4 px-10 rounded-xl flex items-center gap-2 hover:bg-[#3367D6] transition-colors w-full max-w-xs justify-center shadow-lg shadow-blue-500/30 z-10">
            Install <ExternalLink size={18} />
         </button>
         
         <div className="absolute bottom-6 text-[10px] text-white/30 font-mono">
            Google AdMob Test Ad: 4.6.0
         </div>
      </div>
    </div>
  );
};
