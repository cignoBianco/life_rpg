"use client";
import { createContext, useContext, useState, useEffect, ReactNode, startTransition } from 'react';
import { initialQuests, Quest } from '@/lib/data';

const defaultState = {
    quests: initialQuests,
    xp: 480,
    stars: 1250,
    gems: 32,
    level: 12,
    avatar: '🌱',
    inventory: [] as string[],
    lastReset: "",
};

type GameData = typeof defaultState;

type GameState = GameData & {
    isMounted: boolean;
    completeQuest: (id: string) => { xp: number; stars: number } | null;
    buyItem: (itemId: string, price: number, icon: string, category: string) => boolean;
};

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);
    const [state, setState] = useState<GameData>(defaultState);

    useEffect(() => {
        const loadState = () => {
            const today = new Date().toISOString().split('T')[0];
            const saved = localStorage.getItem("liferpg-state");

            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const shouldReset = parsed.lastReset !== today;

                    // startTransition, чтобы React не ругался на синхронный вызов
                    startTransition(() => {
                        setState({
                            quests: shouldReset
                                ? initialQuests.map(q => ({ ...q, completed: false }))
                                : (parsed.quests || initialQuests),
                            xp: parsed.xp ?? 480,
                            stars: parsed.stars ?? 1250,
                            gems: parsed.gems ?? 32,
                            level: parsed.level ?? 12,
                            avatar: parsed.avatar || '🌱',
                            inventory: parsed.inventory || [],
                            lastReset: today,
                        });
                    });
                } catch (e) {
                    console.error("Failed to parse state", e);
                }
            } else {
                startTransition(() => {
                    setState(prev => ({ ...prev, lastReset: today }));
                });
            }

            setIsMounted(true);
        };

        // Вызываем асинхронно, чтобы убрать синхронность из тела эффекта --- "Calling setState synchronously within an effect"
        const timeoutId = setTimeout(loadState, 0);

        return () => clearTimeout(timeoutId);
    }, []);

    // Сохраняем в localStorage только когда смонтировались
    useEffect(() => {
        if (!isMounted) return;
        localStorage.setItem("liferpg-state", JSON.stringify(state));
    }, [state, isMounted]);

    // Таймер на полночь ТУДУ мб сделать крон
    useEffect(() => {
        if (!isMounted) return;

        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const msUntilMidnight = midnight.getTime() - now.getTime();

        const timer = setTimeout(() => {
            const today = new Date().toISOString().split('T')[0];
            setState(prev => ({
                ...prev,
                quests: prev.quests.map(q => ({ ...q, completed: false })),
                lastReset: today,
            }));
        }, msUntilMidnight);

        return () => clearTimeout(timer);
    }, [state.lastReset, isMounted]);

    const maxXp = 1000;

    const completeQuest = (id: string) => {
        const quest = state.quests.find((q) => q.id === id);
        if (!quest || quest.completed) return null;

        let newXp = state.xp + quest.xp;
        let newLevel = state.level;
        if (newXp >= maxXp) {
            newXp -= maxXp;
            newLevel += 1;
        }

        setState(prev => ({
            ...prev,
            quests: prev.quests.map((q) => (q.id === id ? { ...q, completed: true } : q)),
            xp: newXp,
            level: newLevel,
            stars: prev.stars + quest.stars,
        }));

        return { xp: quest.xp, stars: quest.stars };
    };

    const buyItem = (itemId: string, price: number, icon: string, category: string) => {
        if (state.stars >= price && !state.inventory.includes(itemId)) {
            setState(prev => ({
                ...prev,
                stars: prev.stars - price,
                inventory: [...prev.inventory, itemId],
                avatar: category === 'avatar' ? icon : prev.avatar,
            }));
            return true;
        }
        return false;
    };

    return (
        <GameContext.Provider value={{
            ...state,
            isMounted,
            completeQuest,
            buyItem
        }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within GameProvider");
    return context;
};