import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { Mystery, WorksheetScore } from '../types';
import { BookIcon, SettingsIcon, CheckIcon, StarIcon, UsersIcon, PawPrintIcon, CloudIcon, TargetIcon, ChartIcon, PrinterIcon, FileTextIcon } from './icons/Icons';
import { WorksheetGenerator } from './WorksheetGenerator';
import { WorksheetScoreEntry } from './WorksheetScoreEntry';
import { JoinClassroom } from './JoinClassroom';
import { supabase } from '@/lib/supabase';


interface ChildProgress {
  id: string;
  displayName: string;
  createdAt: string;
  progress: {
    completed_mysteries: string[];
    word_families_mastered: string[];
    total_stars: number;
  };
  badges: { badge_id: string; earned_at: string }[];
  gameScores?: { gameType: string; score: number; maxScore: number }[];
}

interface ParentSectionProps {
  onOpenAuth: () => void;
  onOpenDashboard?: () => void;
}

export const ParentSection: React.FC<ParentSectionProps> = ({ onOpenAuth, onOpenDashboard }) => {
  const { progress, mysteries, resetProgress, playerState, getTotalScore, isSyncing, lastSyncedAt, syncWithCloud } = useGame();
  const { user, isAuthenticated, getChildren } = useAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [children, setChildren] = useState<ChildProgress[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [worksheetMystery, setWorksheetMystery] = useState<Mystery | null>(null);
  const [worksheetScores, setWorksheetScores] = useState<WorksheetScore[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);

  const completedMysteries = mysteries.filter(m => 
    progress.completedMysteries.includes(m.id)
  );

  const totalScore = getTotalScore();

  // Get a consistent userId for score storage
  const getUserId = useCallback((): string => {
    if (isAuthenticated && user?.id) return user.id;
    // Use a local identifier for non-authenticated users
    let localId = localStorage.getItem('wordWhiskerLocalUserId');
    if (!localId) {
      localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('wordWhiskerLocalUserId', localId);
    }
    return localId;
  }, [isAuthenticated, user]);

  // Load worksheet scores
  const loadWorksheetScores = useCallback(async () => {
    setIsLoadingScores(true);
    const userId = getUserId();

    try {
      // Try loading from database
      const { data, error } = await supabase.functions.invoke('worksheet-scores', {
        body: { action: 'load', userId },
      });

      if (!error && data?.scores && data.scores.length > 0) {
        const mapped: WorksheetScore[] = data.scores.map((s: any) => ({
          id: s.id,
          mysteryId: s.mystery_id,
          fillInBlank: { score: s.fill_in_blank_score, max: s.fill_in_blank_max },
          wordMatching: { score: s.word_matching_score, max: s.word_matching_max },
          sentenceCompletion: { score: s.sentence_completion_score, max: s.sentence_completion_max },
          comprehension: { score: s.comprehension_score, max: s.comprehension_max },
          notes: s.notes || '',
          scoredAt: s.scored_at,
          totalScore: s.fill_in_blank_score + s.word_matching_score + s.sentence_completion_score + s.comprehension_score,
          totalMax: s.fill_in_blank_max + s.word_matching_max + s.sentence_completion_max + s.comprehension_max,
          percentage: Math.round(
            ((s.fill_in_blank_score + s.word_matching_score + s.sentence_completion_score + s.comprehension_score) /
            Math.max(1, s.fill_in_blank_max + s.word_matching_max + s.sentence_completion_max + s.comprehension_max)) * 100
          ),
        }));
        setWorksheetScores(mapped);
        setIsLoadingScores(false);
        return;
      }
    } catch (err) {
      console.warn('Failed to load from cloud, using local:', err);
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem('wordWhiskerWorksheetScores');
      if (saved) {
        const parsed: WorksheetScore[] = JSON.parse(saved);
        setWorksheetScores(parsed);
      }
    } catch { /* ignore */ }

    setIsLoadingScores(false);
  }, [getUserId]);

  // Load scores on mount and when completed mysteries change
  useEffect(() => {
    loadWorksheetScores();
  }, [loadWorksheetScores, progress.completedMysteries]);


  // Load children for parent accounts
  useEffect(() => {
    if (isAuthenticated && user?.role === 'parent') {
      loadChildren();
    }
  }, [isAuthenticated, user]);

  const loadChildren = async () => {
    setIsLoadingChildren(true);
    const childrenData = await getChildren();
    setChildren(childrenData);
    setIsLoadingChildren(false);
  };

  const handlePrint = () => {
    window.print();
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
    return date.toLocaleDateString();
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Parent & Teacher Corner
          </h2>
          <p className="text-gray-600 text-lg">
            Track progress, manage accounts, and download practice materials.
          </p>
        </div>

        {/* Detailed Analytics Dashboard CTA (for parent accounts) */}
        {isAuthenticated && user?.role === 'parent' && onOpenDashboard && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ChartIcon className="text-white" size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Detailed Analytics Dashboard</h3>
                <p className="text-white/90">
                  View reading time analytics, game performance trends, vocabulary progress, set daily goals, and get personalized recommendations.
                </p>
              </div>
              <button
                onClick={onOpenDashboard}
                className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors flex-shrink-0 flex items-center gap-2"
              >
                <ChartIcon size={20} />
                Open Dashboard
              </button>
            </div>
          </div>
        )}



        {/* Cloud Sync Banner */}
        {!isAuthenticated ? (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <PawPrintIcon className="text-white" size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Save Progress to the Cloud</h3>
                <p className="text-white/90">
                  Create an account to sync progress across devices, track multiple children, and never lose your detective badges!
                </p>
              </div>
              <button
                onClick={onOpenAuth}
                className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors flex-shrink-0"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSyncing ? 'bg-purple-100' : 'bg-green-100'
                }`}>
                  <CloudIcon className={isSyncing ? 'text-purple-500' : 'text-green-500'} size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {isSyncing ? 'Syncing Progress...' : 'Progress Saved to Cloud'}
                  </h3>
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
        )}

        {/* Join Classroom Section */}
        <div className="mb-8">
          <JoinClassroom onOpenAuth={onOpenAuth} />
        </div>


        {/* Children Management (Parent accounts only) */}
        {isAuthenticated && user?.role === 'parent' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="text-teal-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">My Children's Progress</h3>
              </div>
              <button
                onClick={() => setShowAddChild(true)}
                className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-teal-600 transition-colors"
              >
                + Add Child
              </button>
            </div>

            {isLoadingChildren ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
              </div>
            ) : children.length > 0 ? (
              <div className="space-y-4">
                {children.map((child) => (
                  <div key={child.id} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {child.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{child.displayName}</h4>
                        <p className="text-sm text-gray-500">
                          Joined {new Date(child.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                          <StarIcon size={18} filled />
                          {child.progress.total_stars}
                        </div>
                        <p className="text-sm text-gray-500">
                          {child.progress.completed_mysteries.length} mysteries
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((child.progress.completed_mysteries.length / mysteries.length) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${(child.progress.completed_mysteries.length / mysteries.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Badges */}
                    {child.badges.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {child.badges.slice(0, 5).map((badge) => (
                          <span key={badge.badge_id} className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                            {badge.badge_id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <UsersIcon className="mx-auto mb-3 text-gray-300" size={48} />
                <p>No children accounts linked yet.</p>
                <p className="text-sm mt-2">Add a child account to track their progress!</p>
              </div>
            )}

            {/* Add Child Modal */}
            {showAddChild && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Add Child Account</h3>
                  <p className="text-gray-600 mb-4">
                    To link a child's account, have them sign up with your parent account ID:
                  </p>
                  <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">Your Parent ID:</p>
                    <p className="font-mono font-bold text-purple-700 break-all">{user.id}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    When creating a child account, they can enter this ID to link their progress to your parent dashboard.
                  </p>
                  <button
                    onClick={() => setShowAddChild(false)}
                    className="w-full bg-purple-500 text-white font-semibold py-3 rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Progress Report */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BookIcon className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {isAuthenticated ? `${user?.displayName}'s Progress` : 'Progress Report'}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Mysteries Completed</span>
                <span className="font-bold text-purple-600">
                  {progress.completedMysteries.length} / {mysteries.length}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Stars Earned</span>
                <span className="font-bold text-yellow-500 flex items-center gap-1">
                  {progress.totalStars}
                  <StarIcon size={18} filled className="text-yellow-400" />
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Word Families Mastered</span>
                <span className="font-bold text-teal-600">
                  {progress.wordFamiliesMastered.length}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Badges Earned</span>
                <span className="font-bold text-amber-600">
                  {progress.badges.filter(b => b.earned).length} / {progress.badges.length}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Coins Collected</span>
                <span className="font-bold text-amber-600">
                  {playerState.coins}
                </span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="w-full mt-6 bg-purple-100 text-purple-700 font-semibold py-3 rounded-xl hover:bg-purple-200 transition-colors"
            >
              Print Progress Report
            </button>
          </div>

          {/* Game Performance */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TargetIcon className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Game Performance</h3>
            </div>

            {playerState.gameScores.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
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
                    <p className="text-xs text-gray-500">Games</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-3">Performance by Game Type</h4>
                  <div className="space-y-2">
                    {['comprehension', 'word-family', 'story-sequencing', 'choose-right-word'].map(gameType => {
                      const scores = playerState.gameScores.filter(s => s.gameType === gameType);
                      if (scores.length === 0) return null;
                      const avgScore = Math.round(scores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / scores.length);
                      return (
                        <div key={gameType} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">{gameType.replace(/-/g, ' ')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  avgScore >= 80 ? 'bg-green-500' : avgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${avgScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 w-10">{avgScore}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <TargetIcon className="mx-auto mb-3 text-gray-300" size={48} />
                <p>No games played yet.</p>
                <p className="text-sm mt-2">Complete story games to track performance!</p>
              </div>
            )}
          </div>

          {/* Word Families Learned */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <CheckIcon className="text-teal-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Word Families Learned</h3>
            </div>

            {progress.wordFamiliesMastered.length > 0 ? (
              <div className="space-y-3">
                {progress.wordFamiliesMastered.map((family) => {
                  const relatedMystery = mysteries.find(m => m.wordFamily === family);
                  return (
                    <div key={family} className="p-4 bg-teal-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-teal-700 text-lg">{family}</span>
                        <CheckIcon className="text-teal-500" size={20} />
                      </div>
                      {relatedMystery && (
                        <p className="text-sm text-gray-600">
                          Words: {relatedMystery.words.join(', ')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No word families mastered yet.</p>
                <p className="text-sm mt-2">Complete mysteries to learn word families!</p>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <SettingsIcon className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-700 mb-2">Reset Progress</p>
                <p className="text-sm text-gray-500 mb-3">
                  Clear all progress and start fresh. This cannot be undone.
                </p>
                {showResetConfirm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        resetProgress();
                        setShowResetConfirm(false);
                      }}
                      className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full bg-red-100 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Reset All Progress
                  </button>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="font-semibold text-blue-700 mb-2">Accessibility</p>
                <p className="text-sm text-gray-600">
                  Use the settings button (gear icon) in the top navigation to adjust text size, 
                  enable high contrast mode, and change audio speed.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Completed Mysteries with Worksheet Generator & Score Entry */}
        <div className="mt-6 bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <StarIcon className="text-green-600" size={24} filled />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Completed Mysteries</h3>
                <p className="text-sm text-gray-500">Print worksheets and enter scores for each completed mystery</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              {worksheetScores.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  <span className="text-sm font-medium text-indigo-600">{worksheetScores.length} scores recorded</span>
                </div>
              )}
              {completedMysteries.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-lg">
                  <FileTextIcon className="text-violet-500" size={16} />
                  <span className="text-sm font-medium text-violet-600">{completedMysteries.length} worksheets</span>
                </div>
              )}
            </div>
          </div>

          {completedMysteries.length > 0 ? (
            <div className="space-y-4">
              {completedMysteries.map((mystery) => {
                const mysteryWsScores = worksheetScores.filter(s => s.mysteryId === mystery.id);
                const latestScore = mysteryWsScores.length > 0 ? mysteryWsScores[0] : null;
                return (
                  <div key={mystery.id} className="group bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 hover:border-green-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <img
                        src={mystery.detective.image}
                        alt={mystery.detective.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-800">{mystery.title}</p>
                          {latestScore && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              (latestScore.percentage || 0) >= 80 ? 'bg-green-100 text-green-700' :
                              (latestScore.percentage || 0) >= 60 ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              Worksheet: {latestScore.percentage}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
                            {mystery.wordFamily}
                          </span>
                          <span className="text-xs text-gray-500">{mystery.words.length} words</span>
                          <span className="text-xs text-gray-500">{mystery.detective.name}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((star) => (
                              <StarIcon key={star} size={12} filled className="text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setWorksheetMystery(mystery)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 active:scale-95 transition-all shadow-sm hover:shadow-md flex-shrink-0"
                      >
                        <PrinterIcon size={16} />
                        <span className="hidden sm:inline">Print Worksheets</span>
                        <span className="sm:hidden">Print</span>
                      </button>
                    </div>

                    {/* Worksheet types preview */}
                    <div className="mt-3 flex flex-wrap gap-2 pl-[72px]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Fill-in-the-Blank
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="16" x="4" y="4" rx="2"/><rect width="12" height="16" x="8" y="4" rx="2"/></svg>
                        Flashcards
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                        Comprehension
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 border border-purple-200 rounded-lg text-xs text-purple-700 font-medium">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                        Word Matching
                      </span>
                    </div>

                    {/* Worksheet Score Entry */}
                    <div className="pl-[72px]">
                      <WorksheetScoreEntry
                        mystery={mystery}
                        existingScores={worksheetScores}
                        userId={getUserId()}
                        onScoreSaved={loadWorksheetScores}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FileTextIcon className="text-gray-300" size={36} />
              </div>
              <p className="font-medium text-gray-500">No mysteries completed yet.</p>
              <p className="text-sm mt-2">Complete mysteries to unlock printable practice worksheets!</p>
              <p className="text-xs mt-4 text-gray-400">
                Each worksheet includes fill-in-the-blank, vocabulary flashcards, word matching, and comprehension questions.
                <br />After printing and completing worksheets, enter scores here to track offline learning progress.
              </p>
            </div>
          )}
        </div>


        {/* Quick Practice Sheet (all mysteries) */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-6 print:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BookIcon className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Quick Word Family Checklist</h3>
              <p className="text-sm text-gray-500">A simple overview of all word families</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mysteries.slice(0, 6).map((mystery) => {
              const isCompleted = progress.completedMysteries.includes(mystery.id);
              return (
                <div key={mystery.id} className={`border-2 rounded-xl p-4 ${isCompleted ? 'border-green-300 bg-green-50' : 'border-dashed border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-purple-600">{mystery.wordFamily}</p>
                    {isCompleted && <CheckIcon className="text-green-500" size={18} />}
                  </div>
                  <div className="space-y-2">
                    {mystery.words.slice(0, 6).map((word) => (
                      <div key={word} className="flex items-center gap-2">
                        <div className={`w-4 h-4 border-2 rounded ${isCompleted ? 'border-green-400 bg-green-400' : 'border-gray-300'}`}>
                          {isCompleted && (
                            <svg viewBox="0 0 16 16" fill="white" className="w-full h-full">
                              <path d="M13.3 4.3L6 11.6 2.7 8.3l1-1L6 9.6l6.3-6.3 1 1z"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${isCompleted ? 'text-green-700 font-medium' : 'text-gray-700'}`}>{word}</span>
                      </div>
                    ))}
                    {mystery.words.length > 6 && (
                      <p className="text-xs text-gray-400 pl-6">+{mystery.words.length - 6} more</p>
                    )}
                  </div>
                  {isCompleted && (
                    <button
                      onClick={() => setWorksheetMystery(mystery)}
                      className="w-full mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-xs font-semibold hover:bg-violet-200 transition-colors"
                    >
                      <PrinterIcon size={12} />
                      Print Worksheets
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={handlePrint}
            className="w-full mt-6 bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-colors print:hidden"
          >
            Print Checklist
          </button>
        </div>
      </div>

      {/* Worksheet Generator Modal */}
      {worksheetMystery && (
        <WorksheetGenerator
          mystery={worksheetMystery}
          onClose={() => setWorksheetMystery(null)}
        />
      )}
    </section>
  );
};

