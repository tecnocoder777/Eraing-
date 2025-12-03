export interface UserState {
  balance: number;
  xp: number;
  level: number;
  history: Transaction[];
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'earn' | 'spend';
  date: string;
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  xpReward: number;
  type: 'daily' | 'ai-challenge' | 'video' | 'survey';
  completed: boolean;
  cooldown?: number; // timestamp when it resets
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
