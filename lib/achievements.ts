import type { GameData } from './types';

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  condition: (state: GameData) => boolean;
  reward: { stars?: number; gems?: number };
};

export const achievements: Achievement[] = [
  { id: 'first_step', title: 'Первый шаг', desc: 'Выполни 1 квест', icon: '🌱', condition: s => s.totalQuestsDone >= 1, reward: { stars: 10 } },
  { id: 'week_warrior', title: 'Неделя силы', desc: 'Стрик 7 дней', icon: '⚔️', condition: s => s.streak >= 7, reward: { stars: 50, gems: 5 } },
  { id: 'month_master', title: 'Месяц дисциплины', desc: 'Стрик 30 дней', icon: '🏆', condition: s => s.streak >= 30, reward: { stars: 200, gems: 20 } },
  { id: 'centurion', title: 'Центурион', desc: '100 выполненных квестов', icon: '💯', condition: s => s.totalQuestsDone >= 100, reward: { stars: 300, gems: 30 } },
  { id: 'lvl_5', title: 'Уровень 5', desc: 'Достигни 5 уровня', icon: '⭐', condition: s => s.level >= 5, reward: { stars: 50 } },
  { id: 'lvl_10', title: 'Уровень 10', desc: 'Достигни 10 уровня', icon: '🌟', condition: s => s.level >= 10, reward: { stars: 100, gems: 10 } },
  { id: 'lvl_20', title: 'Уровень 20', desc: 'Достигни 20 уровня', icon: '✨', condition: s => s.level >= 20, reward: { stars: 300, gems: 30 } },
  { id: 'lvl_50', title: 'Легенда', desc: 'Достигни 50 уровня', icon: '👑', condition: s => s.level >= 50, reward: { stars: 1000, gems: 100 } },
  { id: 'iron_will', title: 'Железная воля', desc: '10 тренировок', icon: '💪', condition: s => (s.categoryCount.fitness ?? 0) >= 10, reward: { stars: 80 } },
  { id: 'book_worm', title: 'Книжный червь', desc: '10 сессий чтения', icon: '📖', condition: s => (s.categoryCount.mind ?? 0) >= 10, reward: { stars: 80 } },
  { id: 'maestro', title: 'Маэстро', desc: '10 сессий музыки', icon: '🎼', condition: s => (s.categoryCount.creativity ?? 0) >= 10, reward: { stars: 80 } },
  { id: 'home_keeper', title: 'Хранитель дома', desc: '10 уборок', icon: '🏠', condition: s => (s.categoryCount.chores ?? 0) >= 10, reward: { stars: 80 } },
  { id: 'early_bird', title: 'Ранняя пташка', desc: 'Квест выполнен до 8:00', icon: '🌅', condition: s => s.hasEarlyBird, reward: { stars: 30 } },
  { id: 'night_owl', title: 'Полуночник', desc: 'Квест выполнен после 23:00', icon: '🌙', condition: s => s.hasNightOwl, reward: { stars: 30 } },
  { id: 'perfectionist', title: 'Перфекционист', desc: 'Все квесты за день', icon: '💎', condition: s => s.perfectDays >= 1, reward: { stars: 100, gems: 10 } },
  { id: 'perfect_week', title: 'Идеальная неделя', desc: '7 идеальных дней', icon: '🏅', condition: s => s.perfectDays >= 7, reward: { stars: 500, gems: 50 } },
  { id: 'rich', title: 'Богач', desc: 'Накопи 1000 звёзд', icon: '💰', condition: s => s.stars >= 1000, reward: { gems: 20 } },
  { id: 'collector', title: 'Коллекционер', desc: 'Купи 5 предметов', icon: '🎁', condition: s => s.inventory.length >= 5, reward: { stars: 100 } },
  { id: 'fashionista', title: 'Модник', desc: 'Смени аватар 3 раза', icon: '👗', condition: s => s.avatarChanges >= 3, reward: { stars: 80 } },
  { id: 'marathon', title: 'Марафонец', desc: '60-минутный квест', icon: '🏃‍♂️', condition: s => s.hasLongQuest, reward: { stars: 50, gems: 5 } },
];