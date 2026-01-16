
import React, { useState } from 'react';
import { Task } from '../types.ts';
import { CheckCircle, Play, PenTool, Loader2, Coins } from 'lucide-react';
import { generateCreativeTask, gradeCreativeSubmission } from '../services/geminiService.ts';
import { AdModal } from './ui/AdModal.tsx';
import { BannerAd } from './ui/BannerAd.tsx';

interface TasksProps {
  tasks: Task[];
  onCompleteTask: (task: Task, bonus?: number) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onCompleteTask }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [aiPrompt, setAiPrompt] = useState<{ prompt: string, criteria: string } | null>(null);
  const [submission, setSubmission] = useState("");
  const [grading, setGrading] = useState(false);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  
  // Ad State
  const [showAd, setShowAd] = useState(false);
  const [pendingAdTask, setPendingAdTask] = useState<Task | null>(null);

  const startTask = async (task: Task) => {
    setActiveTask(task);
    if (task.type === 'ai-challenge') {
      setLoadingPrompt(true);
      const promptData = await generateCreativeTask();
      setAiPrompt(promptData);
      setLoadingPrompt(false);
    } else if (task.type === 'video') {
      // Trigger Ad Flow
      setPendingAdTask(task);
      setShowAd(true);
    }
  };

  const handleAdReward = () => {
    if (pendingAdTask) {
        onCompleteTask(pendingAdTask);
        setPendingAdTask(null);
    }
  };

  const submitAiChallenge = async () => {
    if (!activeTask || !aiPrompt) return;
    setGrading(true);
    const result = await gradeCreativeSubmission(aiPrompt.prompt, submission);
    
    // Calculate reward based on score
    const rewardMultiplier = result.score / 5; // Score 5 = 1x, Score 10 = 2x
    const finalBonus = Math.floor(activeTask.reward * (rewardMultiplier - 1));
    
    alert(`AI Grade: ${result.score}/10\nFeedback: ${result.feedback}`);
    
    onCompleteTask(activeTask, Math.max(0, finalBonus));
    setGrading(false);
    setActiveTask(null);
    setSubmission("");
    setAiPrompt(null);
  };

  const completeStandardTask = (task: Task) => {
    // For other non-video standard tasks
    const btn = document.getElementById(`btn-${task.id}`);
    if(btn) btn.innerText = "Verifying...";
    
    setTimeout(() => {
        onCompleteTask(task);
    }, 1500);
  };

  return (
    <div className="pb-20">
      <AdModal 
        isOpen={showAd} 
        onClose={() => setShowAd(false)} 
        onReward={handleAdReward} 
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Available Tasks</h2>
        <p className="text-slate-400 text-sm">Complete challenges to earn coins.</p>
      </div>
      
      <BannerAd />

      {/* Active Task Overlay (AI Challenge) */}
      {activeTask && activeTask.type === 'ai-challenge' && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm p-6 flex items-center justify-center">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-brand-400">Creative Challenge</h3>
              <button 
                onClick={() => setActiveTask(null)}
                className="text-slate-500 hover:text-white"
              >✕</button>
            </div>
            
            {loadingPrompt ? (
               <div className="py-12 flex flex-col items-center text-slate-400">
                 <Loader2 className="animate-spin mb-2" />
                 Generating challenge...
               </div>
            ) : (
              <>
                <div className="bg-slate-900/50 p-4 rounded-xl mb-4 border border-slate-700/50">
                  <p className="text-white font-medium mb-1">{aiPrompt?.prompt}</p>
                  <p className="text-xs text-slate-400 italic">{aiPrompt?.criteria}</p>
                </div>
                
                <textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mb-4 focus:outline-none focus:border-brand-500 h-32 resize-none"
                  placeholder="Type your response here..."
                />

                <button
                  onClick={submitAiChallenge}
                  disabled={grading || !submission.trim()}
                  className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {grading ? <Loader2 className="animate-spin" /> : <PenTool size={18} />}
                  {grading ? "AI is Grading..." : "Submit for Evaluation"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`bg-slate-800 border p-4 rounded-2xl flex items-center justify-between transition-all ${task.completed ? 'border-slate-800 opacity-50' : 'border-slate-700 hover:border-slate-600'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                task.type === 'ai-challenge' ? 'bg-purple-500/20 text-purple-400' :
                task.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
                'bg-brand-500/20 text-brand-400'
              }`}>
                {task.type === 'ai-challenge' ? <PenTool size={20} /> : 
                 task.type === 'video' ? <Play size={20} /> : 
                 <CheckCircle size={20} />}
              </div>
              <div>
                <h4 className="font-semibold text-slate-200">{task.title}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                   <Coins size={12} className="text-brand-400" />
                   <span className="text-brand-100">{task.reward} Coins</span>
                   <span>• {task.description}</span>
                </div>
              </div>
            </div>

            {!task.completed && (
              <button 
                id={`btn-${task.id}`}
                onClick={() => ['ai-challenge', 'video'].includes(task.type) ? startTask(task) : completeStandardTask(task)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {task.type === 'video' ? 'Watch' : 'Start'}
              </button>
            )}
            
            {task.completed && (
               <div className="text-green-500 font-medium text-sm flex items-center gap-1">
                 <CheckCircle size={14} /> Done
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
