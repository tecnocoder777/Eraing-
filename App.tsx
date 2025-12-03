import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Games from './components/Games';
import Wallet from './components/Wallet';
import { Confetti } from './components/ui/Confetti';
import { UserState, Task, Transaction } from './types';

// Mock Initial Data
const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Daily Login', description: 'Check in to earn', reward: 50, xpReward: 10, type: 'daily', completed: false },
  { id: '2', title: 'Watch Video', description: 'Watch a short ad', reward: 30, xpReward: 5, type: 'video', completed: false },
  { id: '3', title: 'Creative Challenge', description: 'AI writing contest', reward: 100, xpReward: 50, type: 'ai-challenge', completed: false },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('cq_user');
    return saved ? JSON.parse(saved) : {
      balance: 1250,
      xp: 450,
      level: 3,
      history: [
        { id: 'tx_0', title: 'Welcome Bonus', amount: 1000, type: 'earn', date: new Date().toISOString() }
      ]
    };
  });

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  useEffect(() => {
    localStorage.setItem('cq_user', JSON.stringify(user));
  }, [user]);

  const addTransaction = (amount: number, title: string) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      title,
      amount,
      type: 'earn',
      date: new Date().toISOString()
    };

    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
      xp: prev.xp + Math.floor(amount / 5),
      history: [newTx, ...prev.history]
    }));
    
    setShowConfetti(true);
  };

  const handleCompleteTask = (task: Task, bonus: number = 0) => {
    if (task.completed) return;

    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: true } : t));
    addTransaction(task.reward + bonus, `Task: ${task.title}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard user={user} onNavigate={setActiveTab} />;
      case 'tasks':
        return <Tasks tasks={tasks} onCompleteTask={handleCompleteTask} />;
      case 'games':
        return <Games onEarn={(amount, source) => addTransaction(amount, source)} />;
      case 'wallet':
        return <Wallet user={user} />;
      default:
        return <Dashboard user={user} onNavigate={setActiveTab} />;
    }
  };

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Layout activeTab={activeTab} onNavigate={setActiveTab}>
        {renderContent()}
      </Layout>
    </>
  );
};

export default App;
