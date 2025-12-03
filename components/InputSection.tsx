import React, { useState } from 'react';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';

interface InputSectionProps {
  onExtract: (text: string, folder: string, title: string) => void;
  isProcessing: boolean;
  existingFolders?: string[];
}

const InputSection: React.FC<InputSectionProps> = ({ onExtract, isProcessing, existingFolders = [] }) => {
  const [text, setText] = useState('');
  const [folder, setFolder] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');

  const handleSubmit = () => {
    if (!text.trim() || !folder.trim() || !title.trim()) return;
    onExtract(text, folder.trim(), title.trim());
  };

  const handleSample = () => {
    const sample = `
2024-05-20 定例MTG議事録

■ 決定事項
- デザイン案Bを採用する

■ ディスカッション
- パフォーマンス改善が必要
- 新機能のリリース日は来月に延期

■ TODO / ネクストアクション
- [ ] 至急：ログイン画面のバグを修正する (担当: 田中)
- API仕様書を今週中に更新して共有 (担当: 佐藤)
- 競合他社の調査を行う
- サーバー費用の見積もり確認
- 本日中にクライアントへメール返信が必要
    `;
    setText(sample.trim());
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          議事録入力
        </h2>
        <button 
          onClick={handleSample}
          className="text-sm text-slate-500 hover:text-indigo-600 underline decoration-dotted underline-offset-4"
        >
          サンプルを入力
        </button>
      </div>

      {/* タイトル入力欄 */}
      <div className="mb-4">
        <label htmlFor="input-title" className="block text-sm font-medium text-slate-700 mb-1">タイトル</label>
        <input
          id="input-title"
          type="text"
          className="w-full p-2 rounded border border-slate-200 bg-slate-50 text-slate-700"
          placeholder="議事録タイトルを入力"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      {/* フォルダー選択欄 */}
      <div className="mb-4">
        <label htmlFor="input-folder" className="block text-sm font-medium text-slate-700 mb-1">フォルダー</label>
        <div className="flex gap-2">
          <input
            id="input-folder"
            type="text"
            className="flex-1 p-2 rounded border border-slate-200 bg-slate-50 text-slate-700"
            placeholder="新しいフォルダー名を入力"
            value={folder}
            onChange={e => {
              setFolder(e.target.value);
              setSelectedFolder('');
            }}
          />
          {existingFolders.length > 0 && (
            <select
              id="select-folder"
              className="p-2 rounded border border-slate-200 bg-slate-50 text-slate-700"
              value={selectedFolder}
              onChange={e => {
                setSelectedFolder(e.target.value);
                setFolder(e.target.value);
              }}
            >
              <option value="">既存から選択</option>
              {existingFolders.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <textarea
        className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-base leading-relaxed"
        placeholder="ここに議事録を貼り付けてください...&#13;&#13;例：&#13;- 至急：バグ修正&#13;- 今週中に資料作成&#13;- デザイン確認"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || !folder.trim() || !title.trim() || isProcessing}
          className={`
            group flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white shadow-lg shadow-indigo-500/20
            transition-all duration-300 transform active:scale-95
            ${!text.trim() || !folder.trim() || !title.trim() || isProcessing 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'
            }
          `}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              解析中...
            </span>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              タスクを抽出する
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;