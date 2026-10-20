import type { Quest } from './data';

export type Category = 'fitness' | 'mind' | 'creativity' | 'spirit' | 'chores';

export const categoryLabels: Record<Category, { label: string; icon: string; color: string }> = {
    fitness: { label: 'Спорт', icon: '💪', color: '#F5C5C5' },
    mind: { label: 'Образование', icon: '🧠', color: '#C5D8F5' },
    creativity: { label: 'Творчество', icon: '🎨', color: '#D5C5F5' },
    spirit: { label: 'Дух', icon: '🧘', color: '#C5F5D8' },
    chores: { label: 'Быт', icon: '🏠', color: '#F5E5C5' },
};

export type ActivityEntry = {
    date: string;
    questId: string;
    category: string;
    xp: number;
};

export type GameData = {
  quests: Quest[];
  xp: number;
  stars: number;
  gems: number;
  level: number;
  avatar: string;
  equippedAvatarId: string;
  inventory: string[];
  equippedGear: string[];
  lastReset: string;
  lastQuestDate: string; 
  streak: number;
  totalQuestsDone: number;
  unlockedAchievements: string[];
  categoryCount: Record<string, number>;
  perfectDays: number;
  avatarChanges: number;
  hasEarlyBird: boolean;
  hasNightOwl: boolean;
  hasLongQuest: boolean;
  activityLog: ActivityEntry[]; 
};