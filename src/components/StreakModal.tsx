import React, { useEffect, useState } from 'react';
import { FlameIcon, SparklesIcon, StarIcon, TrophyIcon } from './icons/Icons';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  longestStreak: number;
  isNewDay: boolean;
}

const motivationalMessages = [
  { min: 1, max: 1, title: "Welcome Back!", message: "You started a new reading streak today! Come back tomorrow to keep it going!" },
  { min: 2, max: 2, title: "Day 2!", message: "You came back! That's the hardest part. Keep going, detective!" },
  { min: 3, max: 4, title: "On a Roll!", message: "You're building a great reading habit! Your detective skills are growing!" },
  { min: 5, max: 6, title: "Fantastic!", message: "Five days strong! You're becoming a super reader!" },
  { min: 7, max: 9, title: "One Week!", message: "A whole week of reading! You're an amazing detective!" },
  { min: 10, max: 13, title: "Incredible!", message: "Double digits! Your reading streak is legendary!" },
  { min: 14, max: 20, title: "Two Weeks!", message: "You've been reading for two whole weeks! That's super impressive!" },
  { min: 21, max: 29, title: "Three Weeks!", message: "Almost a month! You're one of the best detectives in town!" },
  { min: 30, max: 59, title: "One Month!", message: "A whole month of daily reading! You're a reading champion!" },
  { min: 60, max: 89, title: "Two Months!", message: "Sixty days of reading! You're unstoppable!" },
  { min: 90, max: Infinity, title: "LEGENDARY!", message: "Over 90 days! You're a true reading legend!" },
];

const getStreakMessage = (streak: number) => {
  return motivationalMessages.find(m => streak >= m.min && streak <= m.max) || motivationalMessages[0];
};

const getStreakColor = (streak: number): string => {
  if (streak >= 30) return 'from-yellow-400 via-orange-500 to-red-500';
  if (streak >= 14) return 'from-orange-400 to-red-500';
  if (streak >= 7) return 'from-orange-400 to-amber-500';
  if (streak >= 3) return 'from-amber-400 to-orange-400';
  return 'from-amber-300 to-orange-300';
};

const getFlameSize = (streak: number): string => {
  if (streak >= 30) return 'w-24 h-24';
  if (streak >= 14) return 'w-20 h-20';
  if (streak >= 7) return 'w-18 h-18';
  return 'w-16 h-16';
};

export const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose, currentStreak, longestStreak, isNewDay }) => {
  const [showContent, setShowContent] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 100);
      setTimeout(() => setShowSparkles(true), 500);
    } else {
      setShowContent(false);
      setShowSparkles(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const message = getStreakMessage(currentStreak);
  const gradientColor = getStreakColor(currentStreak);
  const isNewRecord = currentStreak >= longestStreak && currentStreak > 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-500 ${showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className={`bg-gradient-to-br ${gradientColor} p-8 text-center relative overflow-hidden`}>
          {/* Sparkle effects */}
          {showSparkles && (
            <>
              <div className="absolute top-4 left-6 animate-pulse">
                <SparklesIcon className="text-white/60" size={20} />
              </div>
              <div className="absolute top-8 right-8 animate-pulse" style={{ animationDelay: '0.3s' }}>
                <StarIcon className="text-white/50" size={16} filled />
              </div>
              <div className="absolute bottom-6 left-10 animate-pulse" style={{ animationDelay: '0.6s' }}>
                <StarIcon className="text-white/40" size={14} filled />
              </div>
              <div className="absolute bottom-4 right-6 animate-pulse" style={{ animationDelay: '0.9s' }}>
                <SparklesIcon className="text-white/50" size={18} />
              </div>
            </>
          )}

          {/* Flame icon with animation */}
          <div className={`mx-auto mb-4 ${getFlameSize(currentStreak)} flex items-center justify-center`}>
            <div className="animate-bounce">
              <FlameIcon className="text-white drop-shadow-lg" size={currentStreak >= 30 ? 80 : currentStreak >= 14 ? 64 : 56} filled />
            </div>
          </div>

          {/* Streak count */}
          <div className="relative">
            <p className="text-6xl font-black text-white drop-shadow-md mb-1">
              {currentStreak}
            </p>
            <p className="text-white/90 font-bold text-lg">
              {currentStreak === 1 ? 'Day Streak' : 'Day Streak!'}
            </p>
          </div>

          {/* New record badge */}
          {isNewRecord && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <TrophyIcon className="text-white" size={16} />
              <span className="text-white font-bold text-sm">New Personal Record!</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{message.title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{message.message}</p>

          {/* Stats row */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FlameIcon className="text-orange-500" size={18} filled />
                <span className="text-2xl font-bold text-gray-800">{currentStreak}</span>
              </div>
              <p className="text-xs text-gray-500 font-semibold">Current</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrophyIcon className="text-amber-500" size={18} />
                <span className="text-2xl font-bold text-gray-800">{longestStreak}</span>
              </div>
              <p className="text-xs text-gray-500 font-semibold">Best</p>
            </div>
          </div>

          {/* Milestone progress */}
          {currentStreak < 7 && (
            <div className="bg-orange-50 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-orange-700">Next milestone: 7 days</span>
                <span className="text-sm font-bold text-orange-600">{currentStreak}/7</span>
              </div>
              <div className="h-3 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((currentStreak / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          {currentStreak >= 7 && currentStreak < 30 && (
            <div className="bg-orange-50 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-orange-700">Next milestone: 30 days</span>
                <span className="text-sm font-bold text-orange-600">{currentStreak}/30</span>
              </div>
              <div className="h-3 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((currentStreak / 30) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-3 bg-gradient-to-r ${gradientColor} text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-lg shadow-lg`}
          >
            Keep Reading!
          </button>
        </div>
      </div>
    </div>
  );
};
