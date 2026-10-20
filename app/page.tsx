"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Star, Flame, Gem, Home, ShoppingBag, Map, Trophy, Lock } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { shopItems } from "@/lib/data";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [reward, setReward] = useState<{ xp: number; stars: number } | null>(null);

  const { quests, xp, stars, gems, level, avatar, inventory, isMounted, completeQuest, buyItem } = useGame();
  const maxXp = 1000;

  const handleComplete = (id: string) => {
    const res = completeQuest(id);
    if (res) {
      setReward(res);
      setTimeout(() => setReward(null), 3000);
    }
  };

  // Пока не смонтировались — рендерим заглушку, чтобы не было hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFBF7] text-[#7B9B75]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#B5E2A8] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFBF7] text-[#4A4A4A]">
      <aside className="w-64 bg-white border-r border-[#E8E2D9] flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#A8D5A2] flex items-center justify-center text-white font-bold">LH</div>
          <h1 className="text-2xl font-bold text-[#7B9B75]">Little Hero</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {[
            { id: "home", icon: <Home size={20} />, label: "Home" },
            { id: "journey", icon: <Map size={20} />, label: "Journey" },
            { id: "shop", icon: <ShoppingBag size={20} />, label: "Shop" },
            { id: "achievements", icon: <Trophy size={20} />, label: "Achievements" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl transition ${activeTab === item.id ? 'bg-[#F0F6EC] text-[#7B9B75] font-semibold' : 'text-[#9E9E9E] hover:bg-[#F5F2EC]'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-[#FFF9F0] p-4 rounded-3xl border border-[#FCEACB]">
          <p className="text-sm text-[#D19A65]">Be proud of how far you&apos;ve come! 🌱</p>
        </div>
      </aside>

      {/* ТУДУ: вынести сайдбар и основной контент в отдельные компоненты */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Good morning! 🌅</h2>
            <p className="text-[#9E9E9E] mt-1">Let&apos;s make today an adventure!</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E8E2D9]">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold">{stars}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E8E2D9]">
              <Gem size={18} className="text-blue-400 fill-blue-400" />
              <span className="font-bold">{gems}</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* вынести в компонент экран главная */}
            {activeTab === "home" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* создать компонент персонаж */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E2D9] relative overflow-hidden flex flex-col items-center">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#E8F3DF] to-transparent opacity-50"></div>

                    <div className="relative w-48 h-48 flex items-center justify-center z-10 mb-4">
                      <div className="absolute inset-0 bg-[#B5E2A8] rounded-full shadow-inner border-4 border-white" />
                      <div className="relative text-7xl z-10">{avatar}</div>

                      {/* комп кастомизация */}
                      {inventory.includes('g1') && (
                        <div className="absolute -bottom-2 -right-2 text-4xl z-20 drop-shadow-lg">🗡️</div>
                      )}
                      {inventory.includes('g2') && (
                        <div className="absolute -top-2 -left-2 text-4xl z-20 drop-shadow-lg">🧢</div>
                      )}

                      <div className="absolute -bottom-4 bg-white px-4 py-1 rounded-full shadow-md border border-[#E8E2D9] font-bold text-[#7B9B75] z-30">
                        Level {level}
                      </div>
                    </div>

                    <div className="w-full max-w-md mt-4">
                      <div className="flex justify-between text-sm font-semibold mb-1 text-[#9E9E9E]">
                        <span>XP</span>
                        <span>{xp} / {maxXp}</span>
                      </div>
                      <div className="w-full h-4 bg-[#F0F6EC] rounded-full overflow-hidden border border-[#E8E2D9]">
                        <motion.div className="h-full bg-gradient-to-r from-[#B5E2A8] to-[#F7CA63]" initial={{ width: 0 }} animate={{ width: `${(xp / maxXp) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* комп квесты */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Daily Quests</h3>
                    <div className="space-y-3">
                      {quests.map((quest) => (
                        <div key={quest.id} className={`flex items-center p-4 bg-white rounded-2xl border transition-all ${quest.completed ? 'opacity-60 border-transparent bg-[#F9F9F9]' : 'border-[#E8E2D9] hover:border-[#B5E2A8]'}`}>
                          <div className="w-12 h-12 rounded-xl bg-[#F0F6EC] flex items-center justify-center text-2xl mr-4">{quest.icon}</div>
                          <div className="flex-1">
                            <h4 className={`font-bold ${quest.completed ? 'line-through text-[#9E9E9E]' : ''}`}>{quest.title}</h4>
                            <p className="text-sm text-[#9E9E9E]">{quest.desc}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold text-[#7B9B75] bg-[#F0F6EC] px-2 py-1 rounded-md">+{quest.xp} XP</div>
                            <button onClick={() => handleComplete(quest.id)} disabled={quest.completed} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${quest.completed ? 'bg-[#B5E2A8] text-white' : 'border-2 border-[#E8E2D9] text-transparent hover:border-[#B5E2A8]'}`}>
                              <CheckCircle2 size={20} className={quest.completed ? 'opacity-100' : 'opacity-0'} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D9]">
                    <h3 className="text-lg font-bold mb-4">Current Streak</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl font-extrabold">7</span>
                      <span className="text-lg text-[#9E9E9E]">days</span>
                      <Flame size={40} className="text-orange-400 fill-orange-400 ml-auto animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* вынести в скрин шоп */}
            {activeTab === "shop" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Shop 🌿</h2>
                  <span className="text-[#9E9E9E]">Spend stars. Treat yourself.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shopItems.map((item) => {
                    const isOwned = inventory.includes(item.id);
                    const canAfford = stars >= item.price;
                    return (
                      <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D9] flex flex-col items-center text-center hover:shadow-md transition">
                        <div className="w-24 h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center text-5xl mb-4 border border-[#E8E2D9]">
                          {item.icon}
                        </div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-sm text-[#9E9E9E] mb-4">{item.desc}</p>

                        <button
                          onClick={() => buyItem(item.id, item.price, item.icon, item.category)}
                          disabled={isOwned || !canAfford}
                          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition
                            ${isOwned ? 'bg-[#F0F6EC] text-[#7B9B75]' : canAfford ? 'bg-[#F7CA63] text-white hover:bg-[#F3A649]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          {isOwned ? 'Owned' : (
                            <>
                              <Star size={16} className="fill-white" /> {item.price}
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* вынести в скрин JOURNEY */}
            {activeTab === "journey" && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Growth Garden 🌱</h2>
                <p className="text-[#9E9E9E] mb-8">Nurture small habits, watch big changes bloom.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Strength', 'Mind', 'Creativity'].map((branch) => (
                    <div key={branch} className="bg-white rounded-3xl p-6 border border-[#E8E2D9]">
                      <h3 className="font-bold text-center mb-6 text-lg">{branch}</h3>
                      <div className="space-y-4">
                        {[1, 2, 3].map((node) => (
                          <div key={node} className={`flex flex-col items-center p-4 rounded-2xl border-2 ${node === 1 ? 'border-[#B5E2A8] bg-[#F0F6EC]' : 'border-[#E8E2D9] bg-[#FDFBF7] opacity-60'}`}>
                            <span className="text-3xl mb-2">{node === 1 ? '🔥' : '🔒'}</span>
                            <span className="text-sm font-bold">{node === 1 ? 'Unlocked' : 'Locked'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* скрин ДОСТИЖЕНИЯ */}
            {activeTab === "achievements" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Achievements 🏆</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: 'First Step', icon: '🌱', unlocked: true },
                    { title: 'Week Warrior', icon: '⚔️', unlocked: true },
                    { title: 'Early Bird', icon: '🌅', unlocked: true },
                    { title: 'Mountain Climber', icon: '⛰️', unlocked: false },
                  ].map((ach, i) => (
                    <div key={i} className={`flex flex-col items-center p-6 rounded-3xl border ${ach.unlocked ? 'bg-white border-[#E8E2D9]' : 'bg-[#F5F2EC] border-transparent opacity-50'}`}>
                      <div className={`text-5xl mb-3 ${!ach.unlocked && 'grayscale'}`}>{ach.icon}</div>
                      <h4 className="font-bold text-sm text-center">{ach.title}</h4>
                      {!ach.unlocked && <Lock size={14} className="text-[#9E9E9E] mt-2" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* компонент модалки наград */}
      <AnimatePresence>
        {reward && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20 }} className="bg-[#FFF9F0] rounded-[40px] p-8 max-w-sm w-full text-center border-4 border-white shadow-2xl">
              <h2 className="text-3xl font-extrabold text-[#D19A65] mb-2">Great job!</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-6xl font-extrabold text-[#F7CA63]">+{reward.xp}</span>
                <span className="text-4xl font-extrabold text-[#A8A2E8]">XP</span>
              </div>
              <button onClick={() => setReward(null)} className="w-full py-4 bg-[#F7CA63] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#F3A649] transition">
                Keep going! ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}