export type QuestVariant = { label: string; xp: number; stars: number };

export type Quest = {
  id: string;
  title: string;
  desc: string;
  category: 'fitness' | 'mind' | 'creativity' | 'spirit' | 'chores';
  icon: string;
  variants: QuestVariant[];
  completed: boolean;
  completedVariant?: number;
};

export const initialQuests: Quest[] = [
  { id: 'f1', title: 'Тренировка', desc: 'Силовая или кардио', category: 'fitness', icon: '🏋️',
    variants: [{ label: '20 мин', xp: 20, stars: 1 }, { label: '30 мин', xp: 35, stars: 2 }, { label: '40 мин', xp: 50, stars: 3 }, { label: '60 мин', xp: 75, stars: 5 }],
    completed: false },
  { id: 'f2', title: 'Плавание', desc: 'Бассейн или открытая вода', category: 'fitness', icon: '🏊',
    variants: [{ label: '20 мин', xp: 25, stars: 2 }, { label: '30 мин', xp: 40, stars: 3 }, { label: '40 мин', xp: 55, stars: 4 }, { label: '60 мин', xp: 80, stars: 5 }],
    completed: false },
  { id: 'f3', title: 'Бег', desc: 'Улица или дорожка', category: 'fitness', icon: '🏃',
    variants: [{ label: '20 мин', xp: 20, stars: 1 }, { label: '30 мин', xp: 35, stars: 2 }, { label: '40 мин', xp: 50, stars: 3 }, { label: '60 мин', xp: 75, stars: 5 }],
    completed: false },
  { id: 'f4', title: 'Растяжка', desc: 'Йога, стретчинг', category: 'fitness', icon: '🧘',
    variants: [{ label: '20 мин', xp: 15, stars: 1 }, { label: '30 мин', xp: 25, stars: 2 }],
    completed: false },
  { id: 'f5', title: 'Калистеника', desc: 'Турник, брусья, пол', category: 'fitness', icon: '💪',
    variants: [{ label: '20 мин', xp: 25, stars: 2 }, { label: '30 мин', xp: 40, stars: 3 }, { label: '60 мин', xp: 70, stars: 4 }],
    completed: false },
  { id: 'f6', title: 'Прогулка с ребёнком', desc: 'Свежий воздух', category: 'fitness', icon: '🚶',
    variants: [{ label: '20 мин', xp: 15, stars: 1 }, { label: '30 мин', xp: 25, stars: 2 }, { label: '60 мин', xp: 45, stars: 3 }],
    completed: false },
  { id: 'm1', title: 'Чтение статьи', desc: 'Полезный контент', category: 'mind', icon: '📰',
    variants: [{ label: '1 статья', xp: 10, stars: 1 }, { label: '3 статьи', xp: 25, stars: 2 }],
    completed: false },
  { id: 'm2', title: 'Чтение учебника', desc: 'Глубокая работа', category: 'mind', icon: '📚',
    variants: [{ label: '20 мин', xp: 20, stars: 1 }, { label: '30 мин', xp: 30, stars: 2 }, { label: '60 мин', xp: 60, stars: 4 }],
    completed: false },
  { id: 'm3', title: 'Иностранный язык', desc: 'Duolingo, учебник, сериал', category: 'mind', icon: '🌍',
    variants: [{ label: '15 мин', xp: 15, stars: 1 }, { label: '30 мин', xp: 30, stars: 2 }, { label: '60 мин', xp: 60, stars: 4 }],
    completed: false },
  { id: 'm4', title: 'Работа над проектом', desc: 'Код, дизайн, тексты', category: 'mind', icon: '💻',
    variants: [{ label: '30 мин', xp: 40, stars: 3 }, { label: '60 мин', xp: 80, stars: 5 }, { label: '90 мин', xp: 120, stars: 8 }],
    completed: false },
  { id: 'c1', title: 'Фортепиано', desc: 'Гаммы, пьесы', category: 'creativity', icon: '🎹',
    variants: [{ label: '20 мин', xp: 20, stars: 1 }, { label: '30 мин', xp: 30, stars: 2 }, { label: '40 мин', xp: 40, stars: 3 }, { label: '60 мин', xp: 60, stars: 4 }],
    completed: false },
  { id: 'c2', title: 'Рисование', desc: 'Скетч, скетчбук', category: 'creativity', icon: '🎨',
    variants: [{ label: '20 мин', xp: 20, stars: 1 }, { label: '40 мин', xp: 40, stars: 3 }, { label: '60 мин', xp: 60, stars: 4 }],
    completed: false },
  { id: 'c3', title: 'Блоггинг', desc: 'Пост, заметка', category: 'creativity', icon: '✍️',
    variants: [{ label: '1 пост', xp: 30, stars: 2 }, { label: '2 поста', xp: 60, stars: 4 }],
    completed: false },
  { id: 'c4', title: 'Запись видео', desc: 'Съёмка, монтаж', category: 'creativity', icon: '🎥',
    variants: [{ label: '15 мин', xp: 25, stars: 2 }, { label: '30 мин', xp: 50, stars: 3 }],
    completed: false },
  { id: 's1', title: 'Уборка', desc: 'Быстрая или генеральная', category: 'chores', icon: '🧹',
    variants: [{ label: '15 мин', xp: 15, stars: 1 }, { label: '30 мин', xp: 30, stars: 2 }, { label: '60 мин', xp: 60, stars: 4 }],
    completed: false },
  { id: 's2', title: 'Полить цветы', desc: 'Забота о растениях', category: 'chores', icon: '🪴',
    variants: [{ label: 'Все', xp: 10, stars: 1 }],
    completed: false },
];

export type ShopItem = {
  id: string;
  title: string;
  desc: string;
  price: number;
  icon: string;
  category: 'avatar' | 'gear' | 'boost';
  className?: string;
};

export const shopItems: ShopItem[] = [
  { id: 'av1', title: 'Little Sprout', desc: 'Твоя изначальная форма', price: 0, icon: '🌱', category: 'avatar' },
  { id: 'av2', title: 'Cozy Bear', desc: 'Тёплый и уютный', price: 300, icon: '🐻', category: 'avatar' },
  { id: 'av3', title: 'Ninja Cat', desc: 'Тихий, но продуктивный', price: 500, icon: '🐱‍👤', category: 'avatar' },
  { id: 'av4', title: 'Wise Owl', desc: 'Знание — сила', price: 800, icon: '🦉', category: 'avatar' },
  { id: 'av5', title: 'Dragon', desc: 'Огненная мотивация', price: 1500, icon: '🐉', category: 'avatar' },
  { id: 'g1', title: 'Little Sword', desc: 'Для смелых дел', price: 400, icon: '🗡️', category: 'gear' },
  { id: 'g2', title: 'Cozy Beanie', desc: 'Тёплые мысли', price: 350, icon: '🧢', category: 'gear', className: 'cap' },
  { id: 'g3', title: 'Magic Cloak', desc: 'Скрытность +10', price: 600, icon: '🧥', category: 'gear' },
  { id: 'g4', title: 'Shield', desc: 'Защита от прокрастинации', price: 700, icon: '🛡️', category: 'gear' },
  { id: 'b1', title: 'XP Potion', desc: 'x2 XP на час', price: 250, icon: '🧪', category: 'boost' },
  { id: 'b2', title: 'Streak Freeze', desc: 'Заморозка стрика на день', price: 500, icon: '❄️', category: 'boost' },
];