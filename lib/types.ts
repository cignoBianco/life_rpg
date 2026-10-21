import type { Quest } from './data';

export type ActivityEntry = {
  date: string;
  questId: string;
  category: string;
  xp: number;
};

export type GameData = {
  quests: Quest[];
  customQuests: Quest[];
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
  lastChestOpened: string;
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