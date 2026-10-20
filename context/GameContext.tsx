"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialQuests } from '@/lib/data';
import { achievements } from '@/lib/achievements';
import type { GameData, ActivityEntry } from '@/lib/types';

const getTodayString = () => new Date().toISOString().split('T')[0];
const getYesterdayString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
};

const defaultState: GameData = {
    quests: initialQuests,
    xp: 0,
    stars: 200,
    gems: 5,
    level: 1,
    avatar: '🌱',
    equippedAvatarId: 'av1',
    inventory: ['av1'],
    equippedGear: [],
    lastReset: '',
    lastQuestDate: '',
    streak: 0,
    totalQuestsDone: 0,
    unlockedAchievements: [],
    categoryCount: {},
    perfectDays: 0,
    avatarChanges: 0,
    hasEarlyBird: false,
    hasNightOwl: false,
    hasLongQuest: false,
    activityLog: [],
};

type CompleteResult = {
    xp: number;
    stars: number;
    levelUps: number;
    allCompleted: boolean;
    unlockedAchievement: string | null;
};

type GameState = GameData & {
    isMounted: boolean;
    completeQuest: (id: string, variantIndex: number) => CompleteResult | null;
    buyItem: (itemId: string, price: number, icon: string, category: string) => boolean;
    equipAvatar: (itemId: string, icon: string) => void;
    toggleGear: (itemId: string) => void;
    dailyChestOpened: boolean;
    openDailyChest: () => number;
};

const GameContext = createContext<GameState | undefined>(undefined);

const checkAchievements = (state: GameData): { state: GameData; unlocked: string | null } => {
    const unlocked = [...state.unlockedAchievements];
    let stars = state.stars;
    let gems = state.gems;
    let newlyUnlocked: string | null = null;

    achievements.forEach(a => {
        if (!unlocked.includes(a.id) && a.condition(state)) {
            unlocked.push(a.id);
            stars += a.reward.stars || 0;
            gems += a.reward.gems || 0;
            newlyUnlocked = a.title;
        }
    });

    return { state: { ...state, unlockedAchievements: unlocked, stars, gems }, unlocked: newlyUnlocked };
};

export function GameProvider({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);
    const [state, setState] = useState<GameData>(defaultState);
    const [dailyChestOpened, setDailyChestOpened] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const today = getTodayString();
            const saved = localStorage.getItem('liferpg-state');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved) as Partial<GameData>;
                    const hasValidQuests =
                        Array.isArray(parsed.quests) &&
                        parsed.quests.length > 0 &&
                        Array.isArray(parsed.quests[0]?.variants);

                    // Сброс стрика, если вчера не было активности
                    let streak = parsed.streak ?? 0;
                    if (parsed.lastQuestDate && parsed.lastQuestDate !== today && parsed.lastQuestDate !== getYesterdayString()) {
                        streak = 0;
                    }

                    const shouldReset = parsed.lastReset !== today;

                    setState({
                        ...defaultState,
                        ...parsed,
                        quests: (!hasValidQuests || shouldReset)
                            ? initialQuests.map(q => ({ ...q, completed: false }))
                            : parsed.quests!,
                        streak,
                        lastReset: today,
                    });
                } catch {
                    setState({ ...defaultState, lastReset: today });
                }
            } else {
                setState(prev => ({ ...prev, lastReset: today }));
            }
            setIsMounted(true);
        }, 0);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        localStorage.setItem('liferpg-state', JSON.stringify(state));
    }, [state, isMounted]);

    useEffect(() => {
        if (!isMounted) return;
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const timer = setTimeout(() => {
            const today = getTodayString();
            setState(prev => ({
                ...prev,
                quests: prev.quests.map(q => ({ ...q, completed: false, completedVariant: undefined })),
                lastReset: today,
            }));
            setDailyChestOpened(false);
        }, midnight.getTime() - now.getTime());
        return () => clearTimeout(timer);
    }, [state.lastReset, isMounted]);

    const completeQuest = (id: string, variantIndex: number): CompleteResult | null => {
        const quest = state.quests.find(q => q.id === id);
        if (!quest || quest.completed || !quest.variants) return null;

        const variant = quest.variants[variantIndex];
        if (!variant) return null;

        const streakBonus = 1 + state.streak * 0.05;
        const earnedXp = Math.round(variant.xp * streakBonus);

        const now = new Date();
        const today = getTodayString();
        const hour = now.getHours();

        let newXp = state.xp + earnedXp;
        let newLevel = state.level;
        let levelUps = 0;
        while (newXp >= 1000) {
            newXp -= 1000;
            newLevel += 1;
            levelUps += 1;
        }

        const categoryCount = { ...state.categoryCount };
        categoryCount[quest.category] = (categoryCount[quest.category] || 0) + 1;

        const newQuests = state.quests.map(q =>
            q.id === id ? { ...q, completed: true, completedVariant: variantIndex } : q
        );
        const allCompleted = newQuests.every(q => q.completed);

        let newStreak = state.streak;
        if (state.lastQuestDate === today) {
            newStreak = state.streak;
        } else if (state.lastQuestDate === getYesterdayString()) {
            newStreak = state.streak + 1;
        } else if (state.streak === 0) {
            newStreak = 1;
        } else {
            newStreak = 1;
        }

        const newActivity: ActivityEntry = {
            date: today,
            questId: quest.id,
            category: quest.category,
            xp: earnedXp,
        };

        let newState: GameData = {
            ...state,
            quests: newQuests,
            xp: newXp,
            level: newLevel,
            stars: state.stars + variant.stars + (allCompleted ? 10 : 0),
            gems: state.gems + (allCompleted ? 1 : 0),
            totalQuestsDone: state.totalQuestsDone + 1,
            streak: newStreak,
            lastQuestDate: today,
            categoryCount,
            perfectDays: allCompleted ? state.perfectDays + 1 : state.perfectDays,
            hasEarlyBird: state.hasEarlyBird || hour < 8,
            hasNightOwl: state.hasNightOwl || hour >= 23,
            hasLongQuest: state.hasLongQuest || variant.label.includes('60'),
            activityLog: [...state.activityLog.slice(-200), newActivity], // храним последние 200
        };

        const { state: withAch, unlocked } = checkAchievements(newState);
        newState = withAch;
        setState(newState);

        return {
            xp: earnedXp,
            stars: variant.stars + (allCompleted ? 10 : 0),
            levelUps,
            allCompleted,
            unlockedAchievement: unlocked,
        };
    };

    const buyItem = (itemId: string, price: number, icon: string, category: string) => {
        if (state.stars >= price && !state.inventory.includes(itemId)) {
            setState(prev => ({
                ...prev,
                stars: prev.stars - price,
                inventory: [...prev.inventory, itemId],
                avatar: category === 'avatar' ? icon : prev.avatar,
                equippedAvatarId: category === 'avatar' ? itemId : prev.equippedAvatarId,
            }));
            return true;
        }
        return false;
    };

    const equipAvatar = (itemId: string, icon: string) => {
        if (!state.inventory.includes(itemId)) return;
        setState(prev => ({
            ...prev,
            avatar: icon,
            equippedAvatarId: itemId,
            avatarChanges: prev.avatarChanges + 1,
        }));
    };

    const toggleGear = (itemId: string) => {
        if (!state.inventory.includes(itemId)) return;
        setState(prev => ({
            ...prev,
            equippedGear: prev.equippedGear.includes(itemId)
                ? prev.equippedGear.filter(id => id !== itemId)
                : [...prev.equippedGear, itemId],
        }));
    };

    const openDailyChest = (): number => {
        if (dailyChestOpened) return 0;
        const reward = Math.floor(Math.random() * 90) + 10;
        setState(prev => ({ ...prev, stars: prev.stars + reward }));
        setDailyChestOpened(true);
        return reward;
    };

    return (
        <GameContext.Provider value={{
            ...state,
            isMounted,
            completeQuest,
            buyItem,
            equipAvatar,
            toggleGear,
            dailyChestOpened,
            openDailyChest,
        }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};