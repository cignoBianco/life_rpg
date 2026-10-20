import type { Quest } from './data';

export type Category = 'fitness' | 'mind' | 'creativity' | 'spirit' | 'chores';

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
  streak: number;
  totalQuestsDone: number;
  unlockedAchievements: string[];
  categoryCount: Record<string, number>;
  perfectDays: number;
  avatarChanges: number;
  hasEarlyBird: boolean;
  hasNightOwl: boolean;
  hasLongQuest: boolean;
};