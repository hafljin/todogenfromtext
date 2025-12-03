import React, { useState, useEffect } from 'react';
import TaskResult from './components/TaskResult';
import Home from './components/Home';
import { extractTasksFromNotes } from './utils/extractor';
import { ExtractionResult, TaskGroup } from './types';
import { Layers, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [groups, setGroups] = useState<TaskGroup[]>([]); // 議事録グループ一覧
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null); // 選択中グループ

  // Simulate a slight delay to make it feel like "work" is being done
  // 新規議事録（タスクグループ）作成
  const handleExtract = (text: string, folder: string, title: string) => {
    setTimeout(() => {
      const extracted = extractTasksFromNotes(text);
      // Sort tasks: High > Medium > Low
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      extracted.tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      // 各タスクにfolderを付与
      const tasksWithFolder = extracted.tasks.map(t => ({ ...t, folder }));
      const newGroup: TaskGroup = {
        id: `${Date.now()}`,
        title,
        folder,
        tasks: tasksWithFolder,
        createdAt: new Date().toISOString(),
      };
      setGroups(prev => [...prev, newGroup]);
      setSelectedGroupId(newGroup.id);
      setResult(extracted);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedGroupId(null);
  };

  const handleToggleComplete = (id: string) => {
    if (!result || !selectedGroupId) return;
    const updatedTasks = result.tasks.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setResult({ ...result, tasks: updatedTasks });
    // グループ内のタスクも更新
    setGroups(prev => prev.map(g =>
      g.id === selectedGroupId ? { ...g, tasks: updatedTasks } : g
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">
              Minutes to Tasks
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            <Bot className="w-3.5 h-3.5" />
            <span>Auto-Extractor</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-12">
          {/* ホーム画面: グループ一覧 */}
          {!selectedGroupId && (
            <Home
              groups={groups}
              onSelectGroup={id => {
                setSelectedGroupId(id);
                const group = groups.find(g => g.id === id);
                if (group) {
                  setResult({ tasks: group.tasks, stats: { total: group.tasks.length, high: group.tasks.filter(t => t.priority === 'HIGH').length, medium: group.tasks.filter(t => t.priority === 'MEDIUM').length, low: group.tasks.filter(t => t.priority === 'LOW').length } });
                }
              }}
              onAddGroup={(folder, title, text) => handleExtract(text, folder, title)}
            />
          )}

          {/* 詳細/作成画面 */}
          {selectedGroupId && result && (
            <TaskResult 
              result={result} 
              onReset={handleReset} 
              onToggleComplete={handleToggleComplete}
            />
          )}

          {/* 新規作成画面（ダイアログのみで表示） */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 Minutes to Tasks Tool. All logic runs locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;