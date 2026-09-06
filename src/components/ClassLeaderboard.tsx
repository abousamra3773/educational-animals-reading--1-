import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  TrophyIcon, StarIcon, BookIcon, TargetIcon, FlameIcon,
  CrownIcon, MedalIcon, ArrowUpIcon, ArrowDownIcon,
  EyeIcon, EyeOffIcon, ShieldIcon, ZapIcon, AwardIcon,
  MagnifyingGlassIcon, LoaderIcon, CheckIcon
} from './icons/Icons';

// Types
interface StudentProgress {
  completedMysteries: string[];
  wordFamiliesMastered: string[];
  totalStars: number;
  gamesPlayed: number;
  averageScore: number;
  lastActive: string;
  streakDays: number;
}

interface ClassroomStudent {
  id: string;
  classroom_id: string;
  name: string;
  grade: string;
  added_at: string;
  notes: string;
  linked_user_id: string | null;
  progress: StudentProgress;
}

interface LeaderboardEntry {
  student: ClassroomStudent;
  value: number;
  rank: number;
  previousRank: number | null;
  rankChange: number; // positive = moved up, negative = moved down, 0 = no change
}

type LeaderboardCategory = 'stars' | 'mysteries' | 'scores' | 'streaks' | 'wordFamilies';
type TimeView = 'allTime' | 'weekly';

interface ClassLeaderboardProps {
  students: ClassroomStudent[];
  classroomId: string;
  classroomName: string;
  leaderboardEnabled: boolean;
  onToggleLeaderboard: (enabled: boolean) => void;
}

// Achievement badge definitions
const ACHIEVEMENT_BADGES = [
  { id: 'star_collector_10', name: 'Star Collector', description: '10+ stars earned', icon: StarIcon, threshold: 10, category: 'stars' as const, color: 'from-yellow-400 to-amber-500' },
  { id: 'star_master_25', name: 'Star Master', description: '25+ stars earned', icon: StarIcon, threshold: 25, category: 'stars' as const, color: 'from-amber-400 to-orange-500' },
  { id: 'star_legend_50', name: 'Star Legend', description: '50+ stars earned', icon: CrownIcon, threshold: 50, category: 'stars' as const, color: 'from-orange-400 to-red-500' },
  { id: 'mystery_solver_3', name: 'Mystery Solver', description: '3+ mysteries solved', icon: MagnifyingGlassIcon, threshold: 3, category: 'mysteries' as const, color: 'from-blue-400 to-indigo-500' },
  { id: 'super_detective_6', name: 'Super Detective', description: '6+ mysteries solved', icon: ShieldIcon, threshold: 6, category: 'mysteries' as const, color: 'from-indigo-400 to-purple-500' },
  { id: 'master_detective_10', name: 'Master Detective', description: '10+ mysteries solved', icon: AwardIcon, threshold: 10, category: 'mysteries' as const, color: 'from-purple-400 to-pink-500' },
  { id: 'high_scorer_80', name: 'High Scorer', description: '80%+ average score', icon: TargetIcon, threshold: 80, category: 'scores' as const, color: 'from-green-400 to-emerald-500' },
  { id: 'perfect_score_95', name: 'Perfectionist', description: '95%+ average score', icon: ZapIcon, threshold: 95, category: 'scores' as const, color: 'from-emerald-400 to-teal-500' },
  { id: 'streak_3', name: 'On a Roll', description: '3+ day streak', icon: FlameIcon, threshold: 3, category: 'streaks' as const, color: 'from-orange-400 to-red-500' },
  { id: 'streak_7', name: 'Week Warrior', description: '7+ day streak', icon: FlameIcon, threshold: 7, category: 'streaks' as const, color: 'from-red-400 to-rose-500' },
  { id: 'streak_14', name: 'Unstoppable', description: '14+ day streak', icon: FlameIcon, threshold: 14, category: 'streaks' as const, color: 'from-rose-400 to-pink-500' },
  { id: 'word_family_3', name: 'Word Explorer', description: '3+ word families', icon: BookIcon, threshold: 3, category: 'wordFamilies' as const, color: 'from-purple-400 to-violet-500' },
  { id: 'word_family_6', name: 'Word Wizard', description: '6+ word families', icon: BookIcon, threshold: 6, category: 'wordFamilies' as const, color: 'from-violet-400 to-indigo-500' },
];

const CATEGORY_CONFIG: Record<LeaderboardCategory, {
  label: string;
  icon: React.FC<any>;
  color: string;
  gradient: string;
  getValue: (p: StudentProgress) => number;
  format: (v: number) => string;
}> = {
  stars: {
    label: 'Total Stars',
    icon: StarIcon,
    color: 'text-yellow-500',
    gradient: 'from-yellow-400 to-amber-500',
    getValue: (p) => p?.totalStars || 0,
    format: (v) => `${v}`,
  },
  mysteries: {
    label: 'Mysteries Solved',
    icon: MagnifyingGlassIcon,
    color: 'text-blue-500',
    gradient: 'from-blue-400 to-indigo-500',
    getValue: (p) => p?.completedMysteries?.length || 0,
    format: (v) => `${v}`,
  },
  scores: {
    label: 'Highest Score',
    icon: TargetIcon,
    color: 'text-green-500',
    gradient: 'from-green-400 to-emerald-500',
    getValue: (p) => p?.averageScore || 0,
    format: (v) => `${v}%`,
  },
  streaks: {
    label: 'Longest Streak',
    icon: FlameIcon,
    color: 'text-orange-500',
    gradient: 'from-orange-400 to-red-500',
    getValue: (p) => p?.streakDays || 0,
    format: (v) => `${v}d`,
  },
  wordFamilies: {
    label: 'Word Families',
    icon: BookIcon,
    color: 'text-purple-500',
    gradient: 'from-purple-400 to-violet-500',
    getValue: (p) => p?.wordFamiliesMastered?.length || 0,
    format: (v) => `${v}`,
  },
};

export const ClassLeaderboard: React.FC<ClassLeaderboardProps> = ({
  students,
  classroomId,
  classroomName,
  leaderboardEnabled,
  onToggleLeaderboard,
}) => {
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('stars');
  const [timeView, setTimeView] = useState<TimeView>('allTime');
  const [previousRanks, setPreviousRanks] = useState<Record<string, Record<string, number>>>({});
  const [isLoadingSnapshots, setIsLoadingSnapshots] = useState(false);
  const [savingSnapshot, setSavingSnapshot] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [animatingRanks, setAnimatingRanks] = useState(false);

  // Load previous rank snapshots
  const loadPreviousRanks = useCallback(async () => {
    if (!classroomId) return;
    setIsLoadingSnapshots(true);
    try {
      // Get yesterday's snapshot
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('leaderboard_snapshots')
        .select('*')
        .eq('classroom_id', classroomId)
        .eq('snapshot_date', dateStr);

      if (error) throw error;

      const rankMap: Record<string, Record<string, number>> = {};
      (data || []).forEach((snap: any) => {
        if (!rankMap[snap.category]) rankMap[snap.category] = {};
        rankMap[snap.category][snap.student_id] = snap.rank;
      });
      setPreviousRanks(rankMap);
    } catch (err) {
      console.error('Failed to load previous ranks:', err);
    } finally {
      setIsLoadingSnapshots(false);
    }
  }, [classroomId]);

  useEffect(() => {
    loadPreviousRanks();
  }, [loadPreviousRanks]);

  // Save today's snapshot
  const saveSnapshot = useCallback(async () => {
    if (!classroomId || students.length === 0) return;
    setSavingSnapshot(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const categories: LeaderboardCategory[] = ['stars', 'mysteries', 'scores', 'streaks', 'wordFamilies'];

      const snapshots: any[] = [];
      categories.forEach(cat => {
        const config = CATEGORY_CONFIG[cat];
        const sorted = [...students]
          .map(s => ({ id: s.id, value: config.getValue(s.progress) }))
          .sort((a, b) => b.value - a.value);

        sorted.forEach((entry, idx) => {
          const prevRank = previousRanks[cat]?.[entry.id] ?? null;
          snapshots.push({
            classroom_id: classroomId,
            student_id: entry.id,
            category: cat,
            value: entry.value,
            rank: idx + 1,
            previous_rank: prevRank,
            snapshot_date: today,
          });
        });
      });

      const { error } = await supabase
        .from('leaderboard_snapshots')
        .upsert(snapshots, { onConflict: 'classroom_id,student_id,category,snapshot_date' });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to save snapshot:', err);
    } finally {
      setSavingSnapshot(false);
    }
  }, [classroomId, students, previousRanks]);

  // Build leaderboard entries
  const leaderboardEntries: LeaderboardEntry[] = useMemo(() => {
    const config = CATEGORY_CONFIG[activeCategory];
    const entries = students.map(student => ({
      student,
      value: config.getValue(student.progress),
    }));

    // Sort descending
    entries.sort((a, b) => b.value - a.value);

    // Assign ranks (handle ties)
    let currentRank = 1;
    return entries.map((entry, idx) => {
      if (idx > 0 && entry.value < entries[idx - 1].value) {
        currentRank = idx + 1;
      }
      const prevRank = previousRanks[activeCategory]?.[entry.student.id] ?? null;
      const rankChange = prevRank !== null ? prevRank - currentRank : 0;

      return {
        ...entry,
        rank: currentRank,
        previousRank: prevRank,
        rankChange,
      };
    });
  }, [students, activeCategory, previousRanks]);

  // Get student achievements
  const getStudentBadges = (student: ClassroomStudent) => {
    return ACHIEVEMENT_BADGES.filter(badge => {
      const config = CATEGORY_CONFIG[badge.category];
      const value = config.getValue(student.progress);
      return value >= badge.threshold;
    });
  };

  // Trigger animation when category changes
  useEffect(() => {
    setAnimatingRanks(true);
    const timer = setTimeout(() => setAnimatingRanks(false), 600);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const config = CATEGORY_CONFIG[activeCategory];
  const CategoryIcon = config.icon;

  // Podium rendering for top 3
  const renderPodium = () => {
    if (leaderboardEntries.length < 3) return null;
    const top3 = leaderboardEntries.slice(0, 3);
    // Reorder for podium: [2nd, 1st, 3rd]
    const podiumOrder = [top3[1], top3[0], top3[2]];
    const podiumHeights = ['h-24', 'h-32', 'h-20'];
    const podiumColors = [
      'from-gray-300 to-gray-400',
      'from-yellow-300 to-amber-400',
      'from-amber-600 to-amber-700',
    ];
    const podiumLabels = ['2nd', '1st', '3rd'];
    const avatarSizes = ['w-12 h-12', 'w-16 h-16', 'w-11 h-11'];
    const avatarGradients = [
      'from-gray-400 to-gray-500',
      'from-yellow-400 to-amber-500',
      'from-amber-500 to-orange-600',
    ];

    return (
      <div className="flex items-end justify-center gap-2 sm:gap-4 mb-8 px-4">
        {podiumOrder.map((entry, idx) => {
          if (!entry) return null;
          const badges = getStudentBadges(entry.student);
          return (
            <div key={entry.student.id} className="flex flex-col items-center" style={{ animationDelay: `${idx * 150}ms` }}>
              {/* Crown for 1st place */}
              {idx === 1 && (
                <div className="mb-1 animate-bounce">
                  <CrownIcon size={28} className="text-yellow-500" />
                </div>
              )}

              {/* Avatar */}
              <div className={`${avatarSizes[idx]} rounded-full bg-gradient-to-br ${avatarGradients[idx]} flex items-center justify-center text-white font-bold shadow-lg mb-2 ring-2 ring-white ${
                idx === 1 ? 'text-xl ring-4 ring-yellow-200' : 'text-sm'
              }`}>
                {entry.student.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + value */}
              <p className={`font-bold text-gray-800 text-center truncate max-w-[80px] sm:max-w-[100px] ${idx === 1 ? 'text-sm' : 'text-xs'}`}>
                {entry.student.name.split(' ')[0]}
              </p>
              <p className={`font-bold ${config.color} ${idx === 1 ? 'text-lg' : 'text-sm'}`}>
                {config.format(entry.value)}
              </p>

              {/* Badge count */}
              {badges.length > 0 && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  <AwardIcon size={10} className="text-amber-500" />
                  <span className="text-[10px] text-amber-600 font-bold">{badges.length}</span>
                </div>
              )}

              {/* Podium block */}
              <div className={`${podiumHeights[idx]} w-20 sm:w-24 bg-gradient-to-t ${podiumColors[idx]} rounded-t-xl flex items-start justify-center pt-2 mt-1 shadow-inner`}>
                <span className="text-white font-bold text-sm opacity-90">{podiumLabels[idx]}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Rank change indicator
  const RankChangeIndicator: React.FC<{ change: number }> = ({ change }) => {
    if (change === 0) {
      return <span className="text-gray-400 text-xs font-medium px-1.5 py-0.5 bg-gray-50 rounded-full">--</span>;
    }
    if (change > 0) {
      return (
        <span className="flex items-center gap-0.5 text-green-600 text-xs font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
          <ArrowUpIcon size={10} />
          {change}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 text-red-500 text-xs font-bold bg-red-50 px-1.5 py-0.5 rounded-full">
        <ArrowDownIcon size={10} />
        {Math.abs(change)}
      </span>
    );
  };

  // Rank badge styling
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-sm';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm';
    return 'bg-gray-100 text-gray-600';
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <TrophyIcon className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Add students to see the leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with visibility toggle */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <TrophyIcon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Class Leaderboard</h3>
              <p className="text-gray-500 text-sm">{classroomName} — {students.length} students</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save snapshot button */}
            <button
              onClick={saveSnapshot}
              disabled={savingSnapshot}
              className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {savingSnapshot ? <LoaderIcon size={12} /> : <CheckIcon size={12} />}
              {savingSnapshot ? 'Saving...' : 'Save Snapshot'}
            </button>

            {/* Visibility toggle */}
            <button
              onClick={() => onToggleLeaderboard(!leaderboardEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                leaderboardEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
            >
              {leaderboardEnabled ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
              {leaderboardEnabled ? 'Visible to Students' : 'Hidden from Students'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(CATEGORY_CONFIG) as LeaderboardCategory[]).map(cat => {
          const catConfig = CATEGORY_CONFIG[cat];
          const CatIcon = catConfig.icon;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? `bg-gradient-to-r ${catConfig.gradient} text-white shadow-md`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <CatIcon size={16} filled={activeCategory === cat && cat === 'stars'} />
              <span className="hidden sm:inline">{catConfig.label}</span>
              <span className="sm:hidden">{catConfig.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Time View Toggle + Badges Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white rounded-xl border border-gray-200 p-1">
          {(['allTime', 'weekly'] as TimeView[]).map(view => (
            <button
              key={view}
              onClick={() => setTimeView(view)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                timeView === view
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {view === 'allTime' ? 'All Time' : 'This Week'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowBadges(!showBadges)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            showBadges
              ? 'bg-amber-100 text-amber-700'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <AwardIcon size={16} />
          Badges
        </button>
      </div>

      {/* Achievement Badges Panel */}
      {showBadges && (
        <div className="bg-white rounded-2xl shadow-md p-5 border border-amber-100">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AwardIcon size={18} className="text-amber-500" />
            Achievement Badges
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ACHIEVEMENT_BADGES.map(badge => {
              const BadgeIcon = badge.icon;
              const earnedCount = students.filter(s => {
                const catConfig = CATEGORY_CONFIG[badge.category];
                return catConfig.getValue(s.progress) >= badge.threshold;
              }).length;

              return (
                <div
                  key={badge.id}
                  className={`relative rounded-xl p-3 text-center transition-all ${
                    earnedCount > 0
                      ? 'bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 shadow-sm'
                      : 'bg-gray-50 border border-gray-100 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                    <BadgeIcon size={18} className="text-white" filled={badge.icon === StarIcon || badge.icon === FlameIcon} />
                  </div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">{badge.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{badge.description}</p>
                  {earnedCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {earnedCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Podium for top 3 */}
      {leaderboardEntries.length >= 3 && (
        <div className="bg-white rounded-2xl shadow-md pt-6 pb-0 overflow-hidden">
          <div className="text-center mb-4">
            <h4 className="font-bold text-gray-800 flex items-center justify-center gap-2">
              <CategoryIcon size={18} className={config.color} filled={activeCategory === 'stars' || activeCategory === 'streaks'} />
              Top 3 — {config.label}
            </h4>
          </div>
          {renderPodium()}
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <MedalIcon size={18} className="text-indigo-500" />
            Full Rankings
            {isLoadingSnapshots && <LoaderIcon size={14} className="text-gray-400" />}
          </h4>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-2.5 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Student</div>
          <div className="col-span-2">{config.label}</div>
          <div className="col-span-1">Change</div>
          <div className="col-span-4">Badges Earned</div>
        </div>

        {/* Entries */}
        <div className="divide-y divide-gray-50">
          {leaderboardEntries.map((entry, idx) => {
            const badges = getStudentBadges(entry.student);
            const isTop3 = entry.rank <= 3;

            return (
              <div
                key={entry.student.id}
                className={`grid grid-cols-2 md:grid-cols-12 gap-3 px-5 py-3.5 items-center transition-all duration-500 hover:bg-gray-50 ${
                  animatingRanks ? 'animate-fade-in' : ''
                } ${isTop3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}`}
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Rank */}
                <div className="md:col-span-1 flex items-center">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankStyle(entry.rank)}`}>
                    {entry.rank}
                  </span>
                </div>

                {/* Student */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                    entry.student.linked_user_id
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 ring-2 ring-green-200'
                      : 'bg-gradient-to-br from-blue-400 to-indigo-400'
                  }`}>
                    {entry.student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate text-sm">{entry.student.name}</p>
                    <p className="text-xs text-gray-400">{entry.student.grade}</p>
                  </div>
                </div>

                {/* Value */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${config.color}`}>
                      {config.format(entry.value)}
                    </span>
                    {/* Progress bar relative to leader */}
                    {leaderboardEntries[0]?.value > 0 && (
                      <div className="hidden md:block flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-16">
                        <div
                          className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-700`}
                          style={{ width: `${(entry.value / leaderboardEntries[0].value) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Rank Change */}
                <div className="hidden md:flex md:col-span-1 items-center">
                  <RankChangeIndicator change={entry.rankChange} />
                </div>

                {/* Badges */}
                <div className="hidden md:flex md:col-span-4 items-center gap-1 flex-wrap">
                  {badges.length > 0 ? (
                    badges.slice(0, 5).map(badge => {
                      const BadgeIcon = badge.icon;
                      return (
                        <div
                          key={badge.id}
                          className={`w-7 h-7 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-sm`}
                          title={`${badge.name}: ${badge.description}`}
                        >
                          <BadgeIcon size={12} className="text-white" filled={badge.icon === StarIcon || badge.icon === FlameIcon} />
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-300">No badges yet</span>
                  )}
                  {badges.length > 5 && (
                    <span className="text-xs text-gray-500 font-semibold ml-1">+{badges.length - 5}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(CATEGORY_CONFIG) as LeaderboardCategory[]).map(cat => {
          const catConfig = CATEGORY_CONFIG[cat];
          const CatIcon = catConfig.icon;
          const values = students.map(s => catConfig.getValue(s.progress));
          const max = Math.max(...values, 0);
          const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
          const leader = leaderboardEntries.length > 0 && activeCategory === cat
            ? leaderboardEntries[0].student.name.split(' ')[0]
            : '';

          return (
            <div
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                activeCategory === cat ? 'border-blue-300 shadow-md' : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CatIcon size={16} className={catConfig.color} filled={cat === 'stars' || cat === 'streaks'} />
                <span className="text-xs font-semibold text-gray-500">{catConfig.label}</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{catConfig.format(max)}</p>
              <p className="text-[10px] text-gray-400">Best | Avg: {catConfig.format(avg)}</p>
            </div>
          );
        })}
      </div>

      {/* Leaderboard disabled notice */}
      {!leaderboardEnabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <EyeOffIcon size={20} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Leaderboard is hidden from students</p>
            <p className="text-amber-600 text-xs">Students and parents cannot see the leaderboard. Only you can view it here. Toggle visibility above to share with the class.</p>
          </div>
        </div>
      )}
    </div>
  );
};
