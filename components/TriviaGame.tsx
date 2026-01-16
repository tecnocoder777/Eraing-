
import React, { useState, useEffect } from 'react';
import { generateTriviaQuestion } from '../services/geminiService.ts';
import { TriviaQuestion } from '../types.ts';
import { Brain, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

interface TriviaGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

const TriviaGame: React.FC<TriviaGameProps> = ({ onComplete, onClose }) => {
  const [question, setQuestion] = useState<TriviaQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);

  const loadQuestion = async () => {
    setLoading(true);
    setResult(null);
    setSelectedOption(null);
    try {
      const q = await generateTriviaQuestion();
      setQuestion(q);
    } catch (error) {
      console.error("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedOption !== null || !question) return; // Prevent double click
    setSelectedOption(index);

    if (index === question.correctAnswerIndex) {
      setResult('correct');
      setStreak(s => s + 1);
      setTimeout(() => {
        onComplete(20 + (streak * 5)); // Base reward + streak bonus
      }, 500);
    } else {
      setResult('incorrect');
      setStreak(0);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-slate-400">
        <Loader2 className="animate-spin text-brand-400" size={40} />
        <p>Asking Gemini for a question...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-4">Failed to load question.</p>
        <button onClick={loadQuestion} className="bg-brand-600 px-6 py-2 rounded-lg text-white">Retry</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-brand-400">
          <Brain size={20} />
          <span className="font-bold">AI Trivia</span>
        </div>
        <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-400">
          Streak: <span className="text-white font-bold">{streak}</span>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-6 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl"></div>

        <span className={`text-xs font-bold uppercase tracking-wider mb-2 block ${
            question.difficulty === 'hard' ? 'text-red-400' : 
            question.difficulty === 'medium' ? 'text-yellow-400' : 'text-green-400'
        }`}>
            {question.difficulty} Difficulty
        </span>
        <h3 className="text-xl font-semibold text-white leading-relaxed">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          let stateStyles = "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750";
          
          if (selectedOption !== null) {
            if (idx === question.correctAnswerIndex) {
              stateStyles = "bg-green-500/20 border-green-500 text-green-400";
            } else if (selectedOption === idx) {
              stateStyles = "bg-red-500/20 border-red-500 text-red-400";
            } else {
              stateStyles = "bg-slate-800/50 border-transparent text-slate-500 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleAnswer(idx)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 font-medium flex items-center justify-between ${stateStyles}`}
            >
              <span>{option}</span>
              {selectedOption !== null && idx === question.correctAnswerIndex && <CheckCircle size={20} />}
              {selectedOption !== null && idx === selectedOption && idx !== question.correctAnswerIndex && <XCircle size={20} />}
            </button>
          );
        })}
      </div>

      {result && (
        <div className="mt-8 flex gap-3 animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={loadQuestion}
            className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20"
          >
            <RefreshCw size={18} />
            Next Question
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default TriviaGame;
