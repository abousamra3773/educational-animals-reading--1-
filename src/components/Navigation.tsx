import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import { LanguageToggle } from './LanguageToggle';
import { 
  HomeIcon, 
  BookIcon, 
  UsersIcon, 
  TrophyIcon, 
  MagnifyingGlassIcon,
  PawPrintIcon,
  CloudIcon,
  FlameIcon,
  GraduationCapIcon,
  ShoppingBagIcon,
  BadgeIcon,
  TreehouseIcon,
} from './icons/Icons';

type View = 'home' | 'mysteries' | 'characters' | 'progress' | 'parents' | 'teachers' | 'shop' | 'my-detective' | 'my-hq';


interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onOpenAuth: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, onOpenAuth }) => {
  const { progress, isSyncing, lastSyncedAt, syncError, syncWithCloud, streakData, setShowStreakModal, playerState } = useGame();
  const { user, isAuthenticated, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSyncStatus, setShowSyncStatus] = useState(false);

  const navItems = [
    { id: 'home' as View, label: 'Home', icon: HomeIcon },
    { id: 'mysteries' as View, label: 'Mysteries', icon: MagnifyingGlassIcon },
    { id: 'characters' as View, label: 'Detectives', icon: UsersIcon },
    { id: 'shop' as View, label: 'Shop', icon: ShoppingBagIcon },
    { id: 'my-detective' as View, label: 'My Detective', icon: BadgeIcon },
    { id: 'my-hq' as View, label: 'My HQ', icon: TreehouseIcon },
    { id: 'progress' as View, label: 'My Progress', icon: TrophyIcon },
    { id: 'parents' as View, label: 'Parents', icon: BookIcon },
    { id: 'teachers' as View, label: 'Teachers', icon: GraduationCapIcon },
  ];



  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const handleManualSync = async () => {
    await syncWithCloud();
  };

  const formatLastSync = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  // Determine flame color based on streak
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

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => onViewChange('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <PawPrintIcon className="text-white" size={20} />
            </div>
            <span className="hidden sm:block text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
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
                    flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm
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
          <div className="flex items-center gap-2 md:gap-3">
            {/* Whisker Points Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
              <PawPrintIcon size={18} className="text-amber-600" />
              <span className="font-bold text-amber-700 text-sm">{playerState.coins}</span>
            </div>

            {/* Streak Button */}
            <button
              onClick={() => setShowStreakModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${getStreakBgColor()} group relative`}
              title={`${streakData.currentStreak} day streak`}
            >
              <div className={`${streakData.currentStreak > 0 ? 'animate-pulse' : ''}`}>
                <FlameIcon 
                  className={getFlameColor()} 
                  size={20} 
                  filled={streakData.currentStreak > 0} 
                />
              </div>
              <span className={`font-bold text-sm ${streakData.currentStreak > 0 ? 'text-orange-700' : 'text-gray-500'}`}>
                {streakData.currentStreak}
              </span>
              
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {streakData.currentStreak > 0 
                  ? `${streakData.currentStreak} day streak!` 
                  : 'Start your streak!'}
              </span>
            </button>

            {/* Sync Status Button (only when authenticated) */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowSyncStatus(!showSyncStatus)}
                  className={`
                    hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl transition-colors
                    ${isSyncing 
                      ? 'bg-purple-100 text-purple-600' 
                      : syncError 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }
                  `}
                >
                  {isSyncing ? (
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                  ) : (
                    <CloudIcon size={18} />
                  )}
                  <span className="text-xs font-semibold">
                    {isSyncing ? 'Syncing...' : syncError ? 'Sync Error' : 'Synced'}
                  </span>
                </button>

                {showSyncStatus && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-4 w-64 z-50">
                    <div className="flex items-center gap-2 mb-3">
                      <CloudIcon size={20} className="text-purple-500" />
                      <h4 className="font-semibold text-gray-800">Cloud Sync</h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`font-semibold ${
                          isSyncing ? 'text-purple-600' : syncError ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {isSyncing ? 'Syncing...' : syncError ? 'Error' : 'Up to date'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last sync:</span>
                        <span className="font-semibold text-gray-700">
                          {formatLastSync(lastSyncedAt)}
                        </span>
                      </div>
                      {syncError && (
                        <p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">
                          {syncError}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleManualSync}
                      disabled={isSyncing}
                      className="w-full mt-3 px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-xl hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </button>

                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Your progress is automatically saved to the cloud
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Auth Button / User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block font-semibold text-purple-700 max-w-24 truncate">
                    {user.displayName}
                  </span>
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-56 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user.displayName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.role === 'parent' 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {user.role === 'parent' ? 'Parent Account' : 'Detective Account'}
                      </span>
                    </div>
                    <button
                      onClick={() => { onViewChange('progress'); setShowUserMenu(false); }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                    >
                      <TrophyIcon size={18} />
                      My Progress
                    </button>
                    {user.role === 'parent' && (
                      <button
                        onClick={() => { onViewChange('parents'); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                      >
                        <UsersIcon size={18} />
                        Manage Children
                      </button>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}

            {/* Language Toggle */}
            <LanguageToggle compact />

            <AccessibilityToolbar />
          </div>

        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden flex items-center justify-around py-2 border-t border-gray-100 overflow-x-auto">
          {navItems.slice(0, 7).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-2 py-2 rounded-xl flex-shrink-0
                  transition-all duration-300
                  ${isActive
                    ? 'text-purple-600'
                    : 'text-gray-400 hover:text-purple-500'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
          {/* Teachers on mobile */}
          <button
            onClick={() => onViewChange('teachers')}
            className={`
              flex flex-col items-center gap-1 px-2 py-2 rounded-xl flex-shrink-0
              transition-all duration-300
              ${currentView === 'teachers'
                ? 'text-purple-600'
                : 'text-gray-400 hover:text-purple-500'
              }
            `}
          >
            <GraduationCapIcon size={20} />
            <span className="text-[10px] font-semibold">Teachers</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
