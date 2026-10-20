export type Quest = {
  id: string;
  title: string;
  desc: string;
  xp: number;
  stars: number;
  icon: string;
  completed: boolean;
};

export const initialQuests: Quest[] = [
  { id: '1', title: 'Workout', desc: 'Do a 20 minute workout', xp: 25, stars: 1, icon: '🏋️', completed: false },
  { id: '2', title: 'Read', desc: 'Read for 20 minutes', xp: 20, stars: 1, icon: '📖', completed: false },
  { id: '3', title: 'Practice Piano', desc: 'Play for 15 minutes', xp: 20, stars: 1, icon: '🎹', completed: false },
  { id: '4', title: 'Water Plants', desc: 'Take care of your plants', xp: 15, stars: 1, icon: '🪴', completed: false },
];

export type ShopItem = {
  id: string;
  title: string;
  desc: string;
  price: number;
  icon: string;
  category: 'avatar' | 'gear' | 'boost';
};

export const shopItems: ShopItem[] = [
  { id: 'av1', title: 'Little Sprout', desc: 'Your starting form', price: 0, icon: '🌱', category: 'avatar' },
  { id: 'av2', title: 'Cozy Bear', desc: 'Warm and ready for winter', price: 300, icon: '🐻', category: 'avatar' },
  { id: 'av3', title: 'Ninja Cat', desc: 'Silent but deadly productive', price: 500, icon: '🐱‍👤', category: 'avatar' },
  { id: 'av4', title: 'Wise Owl', desc: 'Knowledge is power', price: 800, icon: '🦉', category: 'avatar' },
  { id: 'g1', title: 'Little Sword', desc: 'For brave to-do lists', price: 400, icon: '🗡️', category: 'gear' },
  { id: 'g2', title: 'Cozy Beanie', desc: 'Keep your thoughts warm', price: 350, icon: '🧢', category: 'gear' },
  { id: 'b1', title: 'XP Potion', desc: 'Double XP for 1 hour', price: 250, icon: '🧪', category: 'boost' },
];