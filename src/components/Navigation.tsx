import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { LanguageToggle } from './LanguageToggle';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import {
  PawPrintIcon,
  FlameIcon,
  TrophyIcon,
  UsersIcon,
  GraduationCapIcon,
  MagnifyingGlassIcon,
  ShopIcon,
  ChartIcon,
  TreehouseIcon,
  SparklesIcon,
  StarIcon,
  PlusIcon,
  LogOutIcon,
} from './icons/Icons';

type View = 'home' | 'mysteries' | 'characters' | 'progress' | 'parents' | 'teachers' | 'shop' | 'my-detective' | 'my-hq';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onOpenAuth: () => void;
}

interface Learner {
  id: string;
  name: string;
  avatar: string;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, onOpenAuth }) => {
  const { progress, playerState, streakData, setShowStreakModal } = useGame();
  const { isAuthenticated, user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [learners] = useState<Learner[]>([
    { id: '1', name: 'Lily', avatar: '🐱' },
    { id: '2', name: 'Max', avatar: '🐶' },
  ]);
  const [activeLearner, setActiveLearner] = useState<Learner>(learners[0]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const getFlameColor = () => {
    const streak = streakData.currentStreak;
    if (streak >= 30) return 'text-red-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-amber-500';
    if (streak >= 3) return 'text-orange-400';
    if (streak >= 1) return 'text-amber-400';
    return 'text-gray-400';
  };

  const getStreakBgColor = () => {
    const streak = streakData.currentStreak;
    if (streak >= 30) return 'bg-red-50 hover:bg-red-100';
    if (streak >= 14) return 'bg-orange-50 hover:bg-orange-100';
    if (streak >= 7) return 'bg-amber-50 hover:bg-amber-100';
    if (streak >= 1) return 'bg-orange-50 hover:bg-orange-100';
    return 'bg-gray-50 hover:bg-gray-100';
  };

  const navItems = [
    { id: 'home' as View, label: 'Home', icon: SparklesIcon },
    { id: 'mysteries' as View, label: 'Mysteries', icon: MagnifyingGlassIcon },
    { id: 'characters' as View, label: 'Detectives', icon: PawPrintIcon },
    { id: 'shop' as View, label: 'Shop', icon: ShopIcon },
    { id: 'my-detective' as View, label: 'My Detective', icon: StarIcon },
    { id: 'my-hq' as View, label: 'Treehouse', icon: TreehouseIcon },
    { id: 'progress' as View, label: 'Progress', icon: ChartIcon },
    { id: 'parents' as View, label: 'Parents', icon: UsersIcon },
    { id: 'teachers' as View, label: 'Teachers', icon: GraduationCapIcon },
  ];

  const isParent = user?.role === 'parent';

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2">
          {/* Logo */}
          <button
            onClick={() => onViewChange('home')}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <PawPrintIcon className="text-white" size={20} />
            </div>
            <span className="hidden sm:block text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
              Word and Whisker
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-2 rounded-xl font-semibold text-sm
                    transition-all duration-300
                    ${isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.id === 'progress' && progress.totalStars > 0 && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      {progress.totalStars}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Coins pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
              <PawPrintIcon size={18} className="text-amber-600" />
              <span className="font-bold text-amber-700 text-sm">{playerState.coins}</span>
            </div>

            {/* Streak Button */}
            <button
              onClick={() => setShowStreakModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${getStreakBgColor()}`}
              title={`${streakData.currentStreak} day streak`}
            >
              <div className={streakData.currentStreak > 0 ? 'animate-pulse' : ''}>
                <FlameIcon className={getFlameColor()} size={20} filled={streakData.currentStreak > 0} />
              </div>
              <span className={`font-bold text-sm ${streakData.currentStreak > 0 ? 'text-orange-700' : 'text-gray-500'}`}>
                {streakData.currentStreak}
              </span>
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <>
                {/* Learner button + dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-base">
                      {activeLearner ? activeLearner.avatar : user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col items-start leading-tight">
                      <span className="font-bold text-purple-700 text-sm max-w-24 truncate">
                        {activeLearner ? activeLearner.name : user.displayName}
                      </span>
                      <span className="text-[10px] text-purple-500">
                        {isParent ? 'Family Account' : 'Detective'}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-64 z-50">
                      {/* Current user */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                          <span className="text-lg">{activeLearner?.avatar || '👤'}</span>
                          {activeLearner?.name || user.displayName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <span
                          className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isParent ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {isParent ? 'Parent • Family Account' : 'Detective Account'}
                        </span>
                      </div>

                      {/* Learner switcher */}
                      {isParent && (
                        <div className="px-2 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase px-2 py-1">Switch Learner</p>
                          {learners.map((l) => (
                            <button
                              key={l.id}
                              onClick={() => { setActiveLearner(l); setShowUserMenu(false); }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-purple-50 transition-colors ${
                                activeLearner?.id === l.id ? 'bg-purple-50 ring-1 ring-purple-200' : ''
                              }`}
                            >
                              <span className="text-lg">{l.avatar}</span>
                              <span className="font-semibold text-gray-700">{l.name}</span>
                              {activeLearner?.id === l.id && (
                                <span className="ml-auto text-purple-600 text-xs font-bold">✓ Active</span>
                              )}
                            </button>
                          ))}
                          <button
                            onClick={() => { setShowUserMenu(false); onViewChange('parents'); }}
                            className="w-full mt-1 px-3 py-2 rounded-xl text-left text-purple-600 hover:bg-purple-50 text-sm font-semibold flex items-center gap-2"
                          >
                            <PlusIcon size={16} />
                            Add Child / Learner
                          </button>
                        </div>
                      )}

                      {/* Links */}
                      <div className="py-1">
                        <button
                          onClick={() => { onViewChange('progress'); setShowUserMenu(false); }}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                          <TrophyIcon size={18} />
                          My Progress
                        </button>
                        {isParent && (
                          <button
                            onClick={() => { onViewChange('parents'); setShowUserMenu(false); }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                          >
                            <UsersIcon size={18} />
                            Manage Family
                          </button>
                        )}
                        <button
                          onClick={() => { onViewChange('teachers'); setShowUserMenu(false); }}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                          <GraduationCapIcon size={18} />
                          Teacher Dashboard
                        </button>
                      </div>

                      {/* Big obvious Sign Out */}
                      <div className="px-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold transition-colors flex items-center gap-2"
                        >
                          <LogOutIcon size={18} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Always-visible Sign Out button (desktop) */}
                <button
                  onClick={handleSignOut}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
                  title="Sign Out"
                >
                  <LogOutIcon size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-white border-2 border-purple-200 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                >
                  Sign Up
                </button>
              </>
            )}

            <LanguageToggle compact />
            <AccessibilityToolbar />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden flex items-center gap-1 py-2 border-t border-gray-100 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0
                  transition-all duration-300
                  ${isActive ? 'text-purple-600' : 'text-gray-400 hover:text-purple-500'}
                `}
              >
                <Icon size={20} />
                <span className="text-[10px] font-semibold whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
