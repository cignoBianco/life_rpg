"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Star,
  Flame,
  Gem,
  Home,
  ShoppingBag,
  Map,
  Trophy,
  Lock,
  Gift,
  Target,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { shopItems } from "@/lib/data";
import { achievements } from "@/lib/achievements";
import type { Quest } from "@/lib/data";

// Выносим карточку квеста отдельно, чтобы использовать useState по правилам React
function QuestItem({
  quest,
  onComplete,
}: {
  quest: Quest;
  onComplete: (id: string, variantIndex: number) => void;
}) {
  const [showVariants, setShowVariants] = useState(false);

  return (
    <div
      className={`p-4 bg-white rounded-2xl border transition-all ${quest.completed
        ? "opacity-60 border-transparent bg-[#F9F9F9]"
        : "border-[#E8E2D9] hover:border-[#B5E2A8]"
        }`}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-xl bg-[#F0F6EC] flex items-center justify-center text-2xl mr-4 shrink-0">
          {quest.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold truncate ${quest.completed ? "line-through text-[#9E9E9E]" : ""
              }`}
          >
            {quest.title}
          </h4>
          <p className="text-sm text-[#9E9E9E] truncate">{quest.desc}</p>
        </div>
        {quest.completed ? (
          <div className="flex items-center gap-2 text-[#7B9B75] font-bold shrink-0 ml-2">
            <CheckCircle2 size={20} />
            <span className="text-sm">{quest.variants[quest.completedVariant ?? 0]?.label}</span>
          </div>
        ) : (
          <button
            onClick={() => setShowVariants((v) => !v)}
            className="px-3 py-1 bg-[#F0F6EC] text-[#7B9B75] rounded-lg text-sm font-bold shrink-0 ml-2 hover:bg-[#E2F0DC] transition"
          >
            {showVariants ? "Скрыть" : "Выбрать"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showVariants && !quest.completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mt-3">
              {quest.variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onComplete(quest.id, i);
                    setShowVariants(false);
                  }}
                  className="px-3 py-1.5 bg-[#FDFBF7] border border-[#E8E2D9] rounded-lg text-xs font-semibold hover:bg-[#F0F6EC] hover:border-[#B5E2A8] transition flex items-center gap-1"
                >
                  {v.label}
                  <span className="text-[#7B9B75]">+{v.xp} XP</span>
                  <span className="text-yellow-500 flex items-center">
                    <Star size={10} className="fill-yellow-400 text-yellow-400 mr-0.5" />
                    {v.stars}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [reward, setReward] = useState<{
    xp: number;
    stars: number;
    levelUps: number;
    unlockedAchievement: string | null;
  } | null>(null);
  const [chestReward, setChestReward] = useState<number | null>(null);

  const {
    quests,
    xp,
    stars,
    gems,
    level,
    avatar,
    inventory,
    isMounted,
    equippedAvatarId,
    equippedGear,
    streak,
    unlockedAchievements,
    completeQuest,
    buyItem,
    equipAvatar,
    toggleGear,
    dailyChestOpened,
    openDailyChest,
  } = useGame();

  const maxXp = 1000;

  const handleComplete = (id: string, variantIndex: number) => {
    const res = completeQuest(id, variantIndex);
    if (res) {
      setReward({
        xp: res.xp,
        stars: res.stars,
        levelUps: res.levelUps,
        unlockedAchievement: res.unlockedAchievement,
      });
      setTimeout(() => setReward(null), 3500);
    }
  };

  const handleChest = () => {
    const rewardAmount = openDailyChest();
    if (rewardAmount > 0) {
      setChestReward(rewardAmount);
      setTimeout(() => setChestReward(null), 3000);
    }
  };

  // Заглушка для SSR/hydration
  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFBF7]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#B5E2A8] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const equippedGearIcons = shopItems.filter((i) => equippedGear.includes(i.id));
  const nextAchievement = achievements.find((a) => !unlockedAchievements.includes(a.id));

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFBF7] text-[#4A4A4A]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[#E8E2D9] flex-col p-6 hidden md:flex shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#A8D5A2] flex items-center justify-center text-white font-bold">
            LH
          </div>
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
              className={`flex items-center gap-3 p-3 rounded-2xl transition ${activeTab === item.id
                ? "bg-[#F0F6EC] text-[#7B9B75] font-semibold"
                : "text-[#9E9E9E] hover:bg-[#F5F2EC]"
                }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-[#FFF9F0] p-4 rounded-3xl border border-[#FCEACB]">
          <p className="text-sm text-[#D19A65]">Be proud of how far you&apos;ve come! 🌱</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Good morning! 🌅</h2>
            <p className="text-[#9E9E9E] mt-1">Let&apos;s make today an adventure!</p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <div className="flex items-center gap-2 bg-white px-3 md:px-4 py-2 rounded-full shadow-sm border border-[#E8E2D9]">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold">{stars}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 md:px-4 py-2 rounded-full shadow-sm border border-[#E8E2D9]">
              <Gem size={18} className="text-blue-400 fill-blue-400" />
              <span className="font-bold">{gems}</span>
            </div>
          </div>
        </header>

        {/* ROUTING */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/*  HOME  */}
            {activeTab === "home" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* CHARACTER */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E8E2D9] relative overflow-hidden flex flex-col items-center">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#E8F3DF] to-transparent opacity-50" />

                    <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center z-10 mb-6">
                      <div className="absolute inset-0 bg-[#B5E2A8] rounded-full shadow-inner border-4 border-white" />
                      <div className="relative text-6xl md:text-7xl z-10">{avatar}</div>

                      {/* Equipped gear */}
                      {equippedGearIcons.map((g, i) => (
                        <motion.div
                          key={g.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute text-3xl md:text-4xl z-20 drop-shadow-lg"
                          style={{
                            bottom: i % 2 === 0 ? "-8px" : "auto",
                            top: i % 2 === 1 ? "-8px" : "auto",
                            right: i % 2 === 0 ? "-8px" : "auto",
                            left: i % 2 === 1 ? "-8px" : "auto",
                          }}
                        >
                          {g.icon}
                        </motion.div>
                      ))}

                      <div className="absolute -bottom-4 bg-white px-4 py-1 rounded-full shadow-md border border-[#E8E2D9] font-bold text-[#7B9B75] z-30 whitespace-nowrap">
                        Level {level}
                      </div>
                    </div>

                    <div className="w-full max-w-md mt-2">
                      <div className="flex justify-between text-sm font-semibold mb-1 text-[#9E9E9E]">
                        <span>XP</span>
                        <span>
                          {xp} / {maxXp}
                        </span>
                      </div>
                      <div className="w-full h-4 bg-[#F0F6EC] rounded-full overflow-hidden border border-[#E8E2D9]">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#B5E2A8] to-[#F7CA63]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(xp / maxXp) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* DAILY CHEST */}
                  <div className="bg-gradient-to-br from-[#F7CA63] to-[#F3A649] p-6 rounded-3xl text-white shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift size={28} />
                      <h3 className="text-xl font-bold">Ежедневный сундук</h3>
                    </div>
                    <p className="text-white/90 text-sm mb-4">
                      Открой и получи случайную награду — от 10 до 100 звёзд!
                    </p>
                    <button
                      onClick={handleChest}
                      disabled={dailyChestOpened}
                      className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold transition ${dailyChestOpened
                        ? "bg-white/40 text-white/80 cursor-not-allowed"
                        : "bg-white text-[#F3A649] hover:bg-[#FFF9F0]"
                        }`}
                    >
                      {dailyChestOpened ? "Уже открыт сегодня" : "Открыть сундук 🎁"}
                    </button>
                  </div>

                  {/* QUESTS */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Daily Quests</h3>
                      <span className="text-sm text-[#9E9E9E]">
                        Выполнено: {quests.filter((q) => q.completed).length} / {quests.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {quests.map((quest) => (
                        <QuestItem key={quest.id} quest={quest} onComplete={handleComplete} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* SIDEBAR RIGHT */}
                <div className="space-y-6">
                  {/* STREAK */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D9]">
                    <h3 className="text-lg font-bold mb-4">Current Streak</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl font-extrabold">{streak}</span>
                      <span className="text-lg text-[#9E9E9E]">days</span>
                      <Flame
                        size={40}
                        className={`ml-auto ${streak > 0 ? "text-orange-400 fill-orange-400 animate-pulse" : "text-gray-300"
                          }`}
                      />
                    </div>
                    {streak > 0 && (
                      <p className="text-sm text-[#7B9B75] font-semibold bg-[#F0F6EC] p-2 rounded-lg">
                        🔥 Бонус XP: +{streak * 5}%
                      </p>
                    )}
                  </div>

                  {/* NEXT ACHIEVEMENT */}
                  {nextAchievement && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D9]">
                      <div className="flex items-center gap-2 mb-3">
                        <Target size={18} className="text-[#7B9B75]" />
                        <h3 className="text-sm font-bold text-[#9E9E9E]">Следующая цель</h3>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-4xl">{nextAchievement.icon}</div>
                        <div>
                          <p className="font-bold">{nextAchievement.title}</p>
                          <p className="text-xs text-[#9E9E9E]">{nextAchievement.desc}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {nextAchievement.reward.stars && (
                          <span className="text-xs bg-[#FFF9F0] text-[#D19A65] px-2 py-1 rounded-md font-semibold">
                            ⭐ +{nextAchievement.reward.stars}
                          </span>
                        )}
                        {nextAchievement.reward.gems && (
                          <span className="text-xs bg-[#EEF4FF] text-blue-500 px-2 py-1 rounded-md font-semibold">
                            💎 +{nextAchievement.reward.gems}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/*  SHOP  */}
            {activeTab === "shop" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Shop 🌿</h2>
                  <span className="text-[#9E9E9E]">Spend stars. Treat yourself.</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shopItems.map((item) => {
                    const isOwned = inventory.includes(item.id);
                    const isEquipped =
                      item.category === "avatar"
                        ? equippedAvatarId === item.id
                        : equippedGear.includes(item.id);
                    const canAfford = stars >= item.price;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D9] flex flex-col items-center text-center hover:shadow-md transition"
                      >
                        <div className="w-24 h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center text-5xl mb-4 border border-[#E8E2D9]">
                          {item.icon}
                        </div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-sm text-[#9E9E9E] mb-4">{item.desc}</p>

                        {isOwned ? (
                          <button
                            onClick={() =>
                              item.category === "avatar"
                                ? equipAvatar(item.id, item.icon)
                                : toggleGear(item.id)
                            }
                            className={`w-full py-3 rounded-xl font-bold transition ${isEquipped
                              ? "bg-[#F0F6EC] text-[#7B9B75]"
                              : "bg-[#E8F3DF] text-[#5A7B54] hover:bg-[#D8EBCB]"
                              }`}
                          >
                            {isEquipped ? "✓ Надето" : "Надеть"}
                          </button>
                        ) : (
                          <button
                            onClick={() => buyItem(item.id, item.price, item.icon, item.category)}
                            disabled={!canAfford}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${canAfford
                              ? "bg-[#F7CA63] text-white hover:bg-[#F3A649]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                          >
                            <Star size={16} className={canAfford ? "fill-white" : "fill-gray-400"} />
                            {item.price}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/*  JOURNEY  */}
            {activeTab === "journey" && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Growth Garden 🌱</h2>
                <p className="text-[#9E9E9E] mb-8">
                  Nurture small habits, watch big changes bloom.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Strength", icon: "💪", color: "#F5C5C5" },
                    { name: "Mind", icon: "🧠", color: "#C5D8F5" },
                    { name: "Creativity", icon: "🎨", color: "#D5C5F5" },
                  ].map((branch) => (
                    <div
                      key={branch.name}
                      className="bg-white rounded-3xl p-6 border border-[#E8E2D9]"
                    >
                      <div
                        className="rounded-xl py-2 mb-6 text-center font-bold text-lg text-[#4A4A4A]"
                        style={{ backgroundColor: branch.color }}
                      >
                        {branch.icon} {branch.name}
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((node) => (
                          <div
                            key={node}
                            className={`flex flex-col items-center p-4 rounded-2xl border-2 ${node === 1
                              ? "border-[#B5E2A8] bg-[#F0F6EC]"
                              : "border-[#E8E2D9] bg-[#FDFBF7] opacity-60"
                              }`}
                          >
                            <span className="text-3xl mb-2">
                              {node === 1 ? "🔥" : "🔒"}
                            </span>
                            <span className="text-sm font-bold">
                              {node === 1 ? "Unlocked" : "Locked"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/*  ACHIEVEMENTS  */}
            {activeTab === "achievements" && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Achievements 🏆</h2>
                <p className="text-[#9E9E9E] mb-6">
                  Получено: {unlockedAchievements.length} / {achievements.length}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {achievements.map((ach) => {
                    const isUnlocked = unlockedAchievements.includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        className={`flex flex-col items-center p-4 md:p-6 rounded-3xl border text-center transition ${isUnlocked
                          ? "bg-white border-[#E8E2D9]"
                          : "bg-[#F5F2EC] border-transparent opacity-60"
                          }`}
                      >
                        <div className={`text-4xl md:text-5xl mb-2 ${!isUnlocked ? "grayscale" : ""}`}>
                          {ach.icon}
                        </div>
                        <h4 className="font-bold text-sm">{ach.title}</h4>
                        <p className="text-xs text-[#9E9E9E] mt-1 mb-2">{ach.desc}</p>
                        {isUnlocked ? (
                          <span className="text-xs font-bold text-[#7B9B75]">✓ Получено</span>
                        ) : (
                          <Lock size={14} className="text-[#9E9E9E]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* REWARD MODAL */}
      <AnimatePresence>
        {reward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setReward(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFF9F0] rounded-[40px] p-8 max-w-sm w-full text-center border-4 border-white shadow-2xl"
            >
              <h2 className="text-3xl font-extrabold text-[#D19A65] mb-2">
                {reward.levelUps > 0 ? "Уровень повышен! 🎉" : "Great job! ✨"}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-5xl md:text-6xl font-extrabold text-[#F7CA63]">
                  +{reward.xp}
                </span>
                <span className="text-3xl md:text-4xl font-extrabold text-[#A8A2E8]">XP</span>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-[#D19A65] font-bold">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />+{reward.stars}
                </div>
                {reward.levelUps > 0 && (
                  <div className="flex items-center gap-1 text-[#7B9B75] font-bold">
                    ⬆️ +{reward.levelUps} lvl
                  </div>
                )}
              </div>

              {reward.unlockedAchievement && (
                <div className="bg-[#F0F6EC] border border-[#B5E2A8] rounded-2xl p-3 mb-4 text-sm">
                  <p className="font-bold text-[#7B9B75]">🏆 Ачивка!</p>
                  <p className="text-[#5A7B54]">{reward.unlockedAchievement}</p>
                </div>
              )}

              <button
                onClick={() => setReward(null)}
                className="w-full py-4 bg-[#F7CA63] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#F3A649] transition"
              >
                Keep going! ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHEST REWARD TOAST */}
      <AnimatePresence>
        {chestReward !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#F7CA63] text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 flex items-center gap-2"
          >
            🎁 +{chestReward} звёзд!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}