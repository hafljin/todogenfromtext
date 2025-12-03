export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  isCompleted: boolean;
  folder: string; // フォルダー名
  originalText?: string;
}

// 議事録やタスクグループ単位で管理したい場合の型
export interface TaskGroup {
  id: string;
  title: string;
  folder: string;
  tasks: Task[];
  createdAt: string;
}

export interface ExtractionResult {
  tasks: Task[];
  stats: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
}