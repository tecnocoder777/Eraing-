import React from 'react';

export const BannerAd: React.FC = () => {
  return (
    <div className="w-full flex justify-center my-4 select-none">
      <div className="w-[320px] h-[50px] bg-slate-200 border border-slate-300 relative flex items-center justify-center overflow-hidden shadow-sm">
        <span className="absolute top-0 left-0 bg-[#4285F4] text-white text-[10px] px-1.5 py-0.5">Ad</span>
        <div className="flex flex-col items-center justify-center h-full">
           <span className="text-slate-500 text-xs font-bold font-sans">Test Ad: Nice Job!</span>
           <span className="text-slate-400 text-[10px]">Google AdMob</span>
        </div>
        <div className="absolute bottom-0 right-0 border-l border-t border-slate-300 bg-slate-100 px-1">
            <span className="text-[8px] text-slate-400">i</span>
        </div>
      </div>
    </div>
  );
};
