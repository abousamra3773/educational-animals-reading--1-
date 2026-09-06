import React from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon, TrophyIcon, BookIcon, CheckIcon, CloudIcon, CoinIcon, TargetIcon } from './icons/Icons';

interface ProgressDashboardProps {
  onClose: () => void;
  onOpenAuth?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onClose, onOpenAuth }) => {
  const { progress, mysteries, playerState, isSyncing, lastSyncedAt, syncWithCloud, getTotalScore, getGameScores } = useGame();
  const { isAuthenticated, user } = useAuth();

  const completedCount = progress.completedMysteries.length;
  const totalMysteries = mysteries.length;
  const progressPercent = Math.round((completedCount / totalMysteries) * 100);
  const totalScore = getTotalScore();
  const recentScores = getGameScores().slice(-10).reverse();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatLastSync = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return formatDate(dateStr);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">My Detective Progress</h2>
              {isAuthenticated && user && (
                <p className="text-white/80 text-sm mt-1">
                  Welcome back, {user.displayName}!
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cloud Sync Status */}
          {isAuthenticated ? (
            <div className="bg-white rounded-2xl p-4 shadow-md border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSyncing ? 'bg-purple-100' : 'bg-green-100'
                  }`}>
                    <CloudIcon className={isSyncing ? 'text-purple-500' : 'text-green-500'} size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {isSyncing ? 'Syncing...' : 'Progress Saved to Cloud'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last synced: {formatLastSync(lastSyncedAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => syncWithCloud()}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-xl hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <CloudIcon className="text-gray-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Save Your Progress</p>
                    <p className="text-sm text-gray-600">
                      Sign in to save progress across devices
                    </p>
                  </div>
                </div>
                {onOpenAuth && (
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <StarIcon className="text-yellow-500" size={24} filled />
              </div>
              <p className="text-2xl font-bold text-gray-800">{progress.totalStars}</p>
              <p className="text-sm text-gray-500">Stars Earned</p>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckIcon className="text-green-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
              <p className="text-sm text-gray-500">Cases Solved</p>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookIcon className="text-purple-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{progress.wordFamiliesMastered.length}</p>
              <p className="text-sm text-gray-500">Word Families</p>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow-md">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CoinIcon className="text-amber-500" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{playerState.coins}</p>
              <p className="text-sm text-gray-500">Coins</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700">Overall Progress</span>
              <span className="text-purple-600 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {completedCount} of {totalMysteries} mysteries solved
            </p>
          </div>

          {/* Game Scores Summary */}
          {playerState.gameScores.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <TargetIcon className="text-blue-500" size={24} />
                <h3 className="font-semibold text-gray-700">Game Performance</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{totalScore.total}</p>
                  <p className="text-xs text-gray-500">Total Score</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{totalScore.percentage}%</p>
                  <p className="text-xs text-gray-500">Accuracy</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">{playerState.gameScores.length}</p>
                  <p className="text-xs text-gray-500">Games Played</p>
                </div>
              </div>

              {recentScores.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Recent Games</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {recentScores.map((score, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 capitalize">
                            {score.gameType.replace(/-/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${
                            score.score === score.maxScore ? 'text-green-600' : 'text-gray-700'
                          }`}>
                            {score.score}/{score.maxScore}
                          </span>
                          {score.score === score.maxScore && (
                            <StarIcon className="text-yellow-500" size={14} filled />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Word Families Mastered */}
          {progress.wordFamiliesMastered.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h3 className="font-semibold text-gray-700 mb-3">Word Families Mastered</h3>
              <div className="flex flex-wrap gap-2">
                {progress.wordFamiliesMastered.map((family) => (
                  <span
                    key={family}
                    className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 px-4 py-2 rounded-full font-bold text-sm"
                  >
                    {family}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <TrophyIcon className="text-amber-500" size={24} />
              <h3 className="font-semibold text-gray-700">My Badges</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {progress.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`
                    p-4 rounded-2xl text-center transition-all duration-300
                    ${badge.earned
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200'
                      : 'bg-gray-50 border-2 border-gray-100 opacity-50'
                    }
                  `}
                >
                  <div className={`text-3xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <p className={`font-semibold text-sm ${badge.earned ? 'text-amber-700' : 'text-gray-400'}`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                  {badge.earned && badge.earnedDate && (
                    <p className="text-xs text-amber-600 mt-2">
                      Earned {formatDate(badge.earnedDate)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Avatar Info */}
          {playerState.avatar && (
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h3 className="font-semibold text-gray-700 mb-3">My Detective</h3>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  playerState.avatar.color || 'bg-purple-100'
                }`}>
                  {playerState.avatar.animalType === 'fox' && '🦊'}
                  {playerState.avatar.animalType === 'bunny' && '🐰'}
                  {playerState.avatar.animalType === 'owl' && '🦉'}
                  {playerState.avatar.animalType === 'cat' && '🐱'}
                  {playerState.avatar.animalType === 'bear' && '🐻'}
                  {playerState.avatar.animalType === 'raccoon' && '🦝'}
                  {playerState.avatar.animalType === 'squirrel' && '🐿️'}
                  {playerState.avatar.animalType === 'deer' && '🦌'}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{playerState.avatar.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{playerState.avatar.animalType} Detective</p>
                  {playerState.ownedItems.length > 0 && (
                    <p className="text-xs text-purple-600 mt-1">
                      {playerState.ownedItems.length} items owned
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
