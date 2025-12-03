import React from 'react';
import { Check, AlertCircle, Clock, CheckCircle2, ListTodo } from 'lucide-react';
import { Task, Priority, ExtractionResult } from '../types';

interface TaskResultProps {
  result: ExtractionResult;
  onReset: () => void;
  onToggleComplete: (id: string) => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  switch (priority) {
    case Priority.HIGH:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5" />
          高 / High
        </span>
      );
    case Priority.MEDIUM:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          中 / Medium
        </span>
      );
    case Priority.LOW:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          低 / Low
        </span>
      );
    default:
      return null;
  }
};

const TaskResult: React.FC<TaskResultProps> = ({ result, onReset, onToggleComplete }) => {
  const { tasks, stats } = result;

  if (tasks.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12">
        <p className="text-slate-500 mb-4">タスクが見つかりませんでした。</p>
        <button onClick={onReset} className="text-indigo-600 font-medium hover:underline">
          戻る
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="text-sm text-slate-500 mb-1">Total</div>
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl shadow-sm border border-rose-100 text-center">
          <div className="text-sm text-rose-600 mb-1">High</div>
          <div className="text-2xl font-bold text-rose-700">{stats.high}</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl shadow-sm border border-amber-100 text-center">
          <div className="text-sm text-amber-600 mb-1">Medium</div>
          <div className="text-2xl font-bold text-amber-700">{stats.medium}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl shadow-sm border border-slate-100 text-center">
          <div className="text-sm text-slate-600 mb-1">Low</div>
          <div className="text-2xl font-bold text-slate-700">{stats.low}</div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-indigo-500" />
            抽出されたタスク一覧
          </h3>
          <button onClick={onReset} className="text-sm text-slate-500 hover:text-indigo-600 font-medium">
            新しく入力する
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {tasks.map((task, index) => (
            <div 
              key={task.id} 
              className={`
                group p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer
                ${task.isCompleted ? 'bg-slate-50' : ''}
              `}
              onClick={() => onToggleComplete(task.id)}
            >
              <div className={`
                mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                ${task.isCompleted 
                  ? 'bg-indigo-500 border-indigo-500 text-white' 
                  : 'border-slate-300 group-hover:border-indigo-400'
                }
              `}>
                {task.isCompleted && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p className={`
                    text-base font-medium leading-relaxed transition-all duration-300
                    ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}
                  `}>
                    {task.title}
                  </p>
                  <div className="flex-shrink-0">
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pb-12">
         <button 
           onClick={() => window.print()}
           className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
         >
           🖨️ 印刷 / PDF保存
         </button>
      </div>
    </div>
  );
};

export default TaskResult;