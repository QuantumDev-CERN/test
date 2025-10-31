import { RoadmapTab } from './types';

export const ROADMAP_TABS: RoadmapTab[] = [
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'dsa', label: 'DSA', icon: '📊' },
  { id: 'webdev', label: 'Web Dev', icon: '🌐' },
];

export const COLORS = {
  GREEN: { bg: '#22c55e', border: '#16a34a' },
  ORANGE: { bg: '#f59e0b', border: '#d97706' },
  BLUE: { bg: '#3b82f6', border: '#2563eb' },
  PURPLE: { bg: '#8b5cf6', border: '#7c3aed' },
  PINK: { bg: '#ec4899', border: '#db2777' },
  INDIGO: { bg: '#6366f1', border: '#4f46e5' },
};

export const EDGE_STYLE = {
  stroke: '#6366f1',
  strokeWidth: 3,
};