import { Priority, Task, ExtractionResult } from '../types';

/**
 * Generates a random ID
 */
const generateId = (): string => Math.random().toString(36).substring(2, 9);

/**
 * Keyword definitions for rule-based analysis
 */
const KEYWORDS = {
  highPriority: [
    '至急', '緊急', '直ちに', 'すぐ', '今日中', '本日中', 'ASAP', 'Urgent', 'Immediately', 'Today', 'Critical', 'Must'
  ],
  mediumPriority: [
    '今週中', '早め', 'なるべく', '確認次第', 'This week', 'Soon', 'Pending', 'Next steps'
  ],
  actionMarkers: [
    // Japanese Action Verbs/Nouns
    'する', '確認', '対応', '作成', '修正', '提出', '調査', '検討', '連絡', '実装', 'テスト', 'デプロイ',
    // English Action Verbs
    'Fix', 'Update', 'Check', 'Review', 'Create', 'Deploy', 'Investigate', 'Contact', 'Send', 'Build', 'Test',
    // Markers
    'TODO', 'Task', 'Action', '課題', 'タスク'
  ]
};

/**
 * Determines priority based on text content
 */
const determinePriority = (text: string): Priority => {
  const lowerText = text.toLowerCase();
  
  // Check High Priority
  if (KEYWORDS.highPriority.some(k => text.includes(k) || lowerText.includes(k.toLowerCase()))) {
    return Priority.HIGH;
  }
  
  // Check Medium Priority
  if (KEYWORDS.mediumPriority.some(k => text.includes(k) || lowerText.includes(k.toLowerCase()))) {
    return Priority.MEDIUM;
  }

  return Priority.LOW;
};

/**
 * Checks if a line resembles a task
 */
const isTask = (text: string): boolean => {
  // If it starts with a checkbox-like pattern or bullet point followed by action
  if (/^[-*•]\s?\[\s?\]/.test(text)) return true; // - [ ] style
  if (/^TODO[:\s]/.test(text)) return true; // TODO: style

  // Check for action keywords
  const lowerText = text.toLowerCase();
  return KEYWORDS.actionMarkers.some(k => text.includes(k) || lowerText.includes(k.toLowerCase()));
};

/**
 * Cleans the text (removes bullets, extra spaces)
 */
const cleanText = (text: string): string => {
  return text
    .replace(/^[-*•]\s?(\[\s?\])?\s?/, '') // Remove bullets and checkboxes
    .replace(/^(TODO|Task|Action)[:\s]+/, '') // Remove prefixes
    .trim();
};

/**
 * Main extraction function
 */
export const extractTasksFromNotes = (rawText: string): ExtractionResult => {
  if (!rawText) {
    return {
      tasks: [],
      stats: { total: 0, high: 0, medium: 0, low: 0 }
    };
  }

  const lines = rawText.split(/\n+/);
  const tasks: Task[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Logic: If line looks like a task OR contains strong keywords
    if (isTask(trimmed)) {
      const priority = determinePriority(trimmed);
      tasks.push({
        id: generateId(),
        title: cleanText(trimmed),
        priority,
        isCompleted: false,
        originalText: trimmed
      });
    }
  });

  // Calculate stats
  const stats = {
    total: tasks.length,
    high: tasks.filter(t => t.priority === Priority.HIGH).length,
    medium: tasks.filter(t => t.priority === Priority.MEDIUM).length,
    low: tasks.filter(t => t.priority === Priority.LOW).length,
  };

  return { tasks, stats };
};