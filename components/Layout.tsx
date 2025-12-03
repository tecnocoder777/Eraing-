import React from 'react';
import { Home, Gamepad2, CheckSquare, Wallet } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'games', icon: Gamepad2, label: 'Games' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-brand-500 selection:text-white">
      <main className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-slate-900 overflow-hidden">
        {/* Top Gradient Mesh for visual flair */}
        <div className="absolute top-0 left-0 w-full h-64 bg-brand-600/10 rounded-b-[3rem] blur-3xl pointer-events-none"></div>
        
        <div className="p-6 relative z-10 h-full overflow-y-auto">
             {children}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 pb-safe pt-2 px-6 pb-4 z-50">
          <div className="flex justify-between items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                    isActive ? 'text-brand-400 -translate-y-1' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
};

export default Layout;
