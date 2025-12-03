import React, { useState } from 'react';
import { TaskGroup } from '../types';
import InputSection from './InputSection';


interface HomeProps {
  groups: TaskGroup[];
  onSelectGroup: (id: string) => void;
  onAddGroup: (folder: string, title: string, text: string) => void;
}

const Home: React.FC<HomeProps> = ({ groups, onSelectGroup, onAddGroup }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // フォルダー順・タイトル順でソート
  const sortedGroups = [...groups].sort((a, b) => {
    if (a.folder === b.folder) {
      return a.title.localeCompare(b.title);
    }
    return a.folder.localeCompare(b.folder);
  });

  // 既存フォルダー一覧
  const existingFolders = Array.from(new Set(groups.map(g => g.folder)));

  return (
    <div className="max-w-4xl mx-auto py-8 relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">タスク一覧</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600"
          onClick={() => setShowDialog(true)}
        >
          <span className="text-xl font-bold">＋</span> 新規追加
        </button>
      </div>
      <div className="space-y-4">
        {sortedGroups.map(group => (
          <div key={group.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold">{group.title}</div>
              <div className="text-sm text-slate-500">フォルダー: {group.folder}</div>
              <div className="text-xs text-slate-400">作成日: {new Date(group.createdAt).toLocaleString()}</div>
            </div>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => onSelectGroup(group.id)}
            >
              詳細を見る
            </button>
          </div>
        ))}
        {sortedGroups.length === 0 && (
          <div className="text-slate-400 text-center py-8">タスクグループがありません</div>
        )}
      </div>

      {/* ダイアログ */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-2xl"
              onClick={() => setShowDialog(false)}
              aria-label="閉じる"
            >×</button>
            <InputSection
              onExtract={(text, folder, title) => {
                setIsProcessing(true);
                onAddGroup(folder, title, text);
                setIsProcessing(false);
                setShowDialog(false);
              }}
              isProcessing={isProcessing}
              existingFolders={existingFolders}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
