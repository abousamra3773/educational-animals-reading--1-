import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { RecordingsLibrary } from './RecordingsLibrary';
import { WorksheetScoreAnalytics } from './WorksheetScoreAnalytics';
import { WorksheetScore } from '../types';
import { supabase } from '@/lib/supabase';
import { 
  ChartIcon, BarChartIcon, CalendarIcon, ClockIcon, TrendUpIcon, TrendDownIcon,
  LightbulbIcon, FlagIcon, PrinterIcon, DownloadIcon, BookIcon, StarIcon,
  TargetIcon, CheckIcon, XIcon, EditIcon, UsersIcon, MicrophoneIcon, WaveformIcon,
  FileTextIcon
} from './icons/Icons';
import { GameScore } from '../types';

interface DailyGoal {
  readingMinutes: number;
  mysteriesPerWeek: number;
  gamesPerDay: number;
}

interface ReadingSession {
  date: string;
  duration: number; // in minutes
  mysteryId: string;
  mysteryTitle: string;
}

interface ParentDashboardProps {
  onClose: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ onClose }) => {
  const { progress, mysteries, playerState, getTotalScore } = useGame();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'reading' | 'games' | 'vocabulary' | 'goals' | 'recordings' | 'worksheets'>('overview');
  const [worksheetScores, setWorksheetScores] = useState<WorksheetScore[]>([]);

  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(() => {
    const saved = localStorage.getItem('wordWhiskerDailyGoal');
    return saved ? JSON.parse(saved) : { readingMinutes: 15, mysteriesPerWeek: 3, gamesPerDay: 2 };
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState<DailyGoal>(dailyGoal);

  // Get a consistent userId for score storage
  const getUserId = useCallback((): string => {
    if (isAuthenticated && user?.id) return user.id;
    let localId = localStorage.getItem('wordWhiskerLocalUserId');
    if (!localId) {
      localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('wordWhiskerLocalUserId', localId);
    }
    return localId;
  }, [isAuthenticated, user]);

  // Load worksheet scores
  useEffect(() => {
    const loadScores = async () => {
      const userId = getUserId();
      try {
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
          return;
        }
      } catch (err) {
        console.warn('Failed to load worksheet scores from cloud:', err);
      }
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('wordWhiskerWorksheetScores');
        if (saved) setWorksheetScores(JSON.parse(saved));
      } catch { /* ignore */ }
    };
    loadScores();
  }, [getUserId]);


  // Generate mock reading sessions based on game scores (simulating reading time tracking)
  const readingSessions = useMemo((): ReadingSession[] => {
    return playerState.gameScores.map(score => {
      const mystery = mysteries.find(m => m.id === score.mysteryId);
      return {
        date: score.completedAt,
        duration: Math.floor(Math.random() * 10) + 5, // 5-15 minutes per session
        mysteryId: score.mysteryId,
        mysteryTitle: mystery?.title || 'Unknown Mystery'
      };
    });
  }, [playerState.gameScores, mysteries]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Reading time analytics
    const totalReadingTime = readingSessions.reduce((sum, s) => sum + s.duration, 0);
    const weeklyReadingTime = readingSessions
      .filter(s => new Date(s.date) >= oneWeekAgo)
      .reduce((sum, s) => sum + s.duration, 0);
    const avgSessionTime = readingSessions.length > 0 
      ? Math.round(totalReadingTime / readingSessions.length) 
      : 0;

    // Game performance analytics
    const gameScores = playerState.gameScores;
    const weeklyScores = gameScores.filter(s => new Date(s.completedAt) >= oneWeekAgo);
    const monthlyScores = gameScores.filter(s => new Date(s.completedAt) >= oneMonthAgo);

    const getAvgScore = (scores: GameScore[]) => {
      if (scores.length === 0) return 0;
      return Math.round(scores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / scores.length);
    };

    const weeklyAvg = getAvgScore(weeklyScores);
    const monthlyAvg = getAvgScore(monthlyScores);
    const overallAvg = getAvgScore(gameScores);

    // Performance by game type
    const gameTypes = ['comprehension', 'word-family', 'story-sequencing', 'choose-right-word', 'sentence-builder'];
    const performanceByType = gameTypes.map(type => {
      const typeScores = gameScores.filter(s => s.gameType === type);
      return {
        type,
        label: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        avgScore: getAvgScore(typeScores),
        totalGames: typeScores.length,
        trend: typeScores.length >= 2 
          ? getAvgScore(typeScores.slice(-2)) - getAvgScore(typeScores.slice(0, -2))
          : 0
      };
    }).filter(p => p.totalGames > 0);

    // Vocabulary analytics
    const totalWords = mysteries.reduce((sum, m) => sum + m.words.length, 0);
    const learnedWords = progress.wordFamiliesMastered.reduce((sum, family) => {
      const mystery = mysteries.find(m => m.wordFamily === family);
      return sum + (mystery?.words.length || 0);
    }, 0);

    // Completed mysteries timeline
    const completedMysteriesData = progress.completedMysteries.map(id => {
      const mystery = mysteries.find(m => m.id === id);
      const relatedScores = gameScores.filter(s => s.mysteryId === id);
      const completedDate = relatedScores.length > 0 
        ? new Date(relatedScores[relatedScores.length - 1].completedAt)
        : new Date();
      return {
        id,
        title: mystery?.title || 'Unknown',
        wordFamily: mystery?.wordFamily || '',
        completedAt: completedDate,
        avgScore: getAvgScore(relatedScores)
      };
    }).sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

    // Goal progress
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayReadingTime = readingSessions
      .filter(s => new Date(s.date) >= todayStart)
      .reduce((sum, s) => sum + s.duration, 0);
    const todayGames = gameScores.filter(s => new Date(s.completedAt) >= todayStart).length;
    const weeklyMysteries = progress.completedMysteries.filter(id => {
      const scores = gameScores.filter(s => s.mysteryId === id && new Date(s.completedAt) >= oneWeekAgo);
      return scores.length > 0;
    }).length;

    return {
      totalReadingTime,
      weeklyReadingTime,
      avgSessionTime,
      weeklyAvg,
      monthlyAvg,
      overallAvg,
      performanceByType,
      totalWords,
      learnedWords,
      completedMysteriesData,
      todayReadingTime,
      todayGames,
      weeklyMysteries,
      totalSessions: readingSessions.length
    };
  }, [readingSessions, playerState.gameScores, progress, mysteries]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs: { type: 'warning' | 'success' | 'info'; message: string; action?: string }[] = [];

    // Check for weak areas
    analytics.performanceByType.forEach(perf => {
      if (perf.avgScore < 60 && perf.totalGames >= 2) {
        recs.push({
          type: 'warning',
          message: `${perf.label} games need more practice (${perf.avgScore}% average)`,
          action: 'Focus on this game type during the next session'
        });
      }
    });

    // Check reading consistency
    if (analytics.todayReadingTime < dailyGoal.readingMinutes) {
      recs.push({
        type: 'info',
        message: `Reading goal not met today (${analytics.todayReadingTime}/${dailyGoal.readingMinutes} minutes)`,
        action: 'Encourage a reading session before bedtime'
      });
    }

    // Celebrate achievements
    if (analytics.weeklyAvg >= 80) {
      recs.push({
        type: 'success',
        message: 'Excellent performance this week! Keep up the great work!',
      });
    }

    if (progress.completedMysteries.length > 0 && analytics.completedMysteriesData[0]) {
      const lastMystery = analytics.completedMysteriesData[0];
      if (lastMystery.avgScore >= 90) {
        recs.push({
          type: 'success',
          message: `Outstanding score on "${lastMystery.title}"!`,
        });
      }
    }

    // Suggest next steps
    if (progress.wordFamiliesMastered.length < mysteries.length) {
      const unmastered = mysteries.find(m => !progress.wordFamiliesMastered.includes(m.wordFamily));
      if (unmastered) {
        recs.push({
          type: 'info',
          message: `Ready for a new challenge? Try the "${unmastered.wordFamily}" word family!`,
          action: `Start "${unmastered.title}"`
        });
      }
    }

    return recs;
  }, [analytics, dailyGoal, progress, mysteries]);

  const saveGoal = () => {
    setDailyGoal(tempGoal);
    localStorage.setItem('wordWhiskerDailyGoal', JSON.stringify(tempGoal));
    setIsEditingGoal(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: ChartIcon },
    { id: 'worksheets' as const, label: 'Worksheets', icon: FileTextIcon },
    { id: 'recordings' as const, label: 'Recordings', icon: WaveformIcon },
    { id: 'reading' as const, label: 'Reading Time', icon: ClockIcon },
    { id: 'games' as const, label: 'Games', icon: TargetIcon },
    { id: 'vocabulary' as const, label: 'Vocabulary', icon: BookIcon },
    { id: 'goals' as const, label: 'Goals', icon: FlagIcon },
  ];


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <ChartIcon className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Parent Dashboard</h2>
                <p className="text-white/80">
                  {isAuthenticated ? `${user?.displayName}'s Progress Analytics` : 'Progress Analytics'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <XIcon className="text-white" size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <ClockIcon size={20} />
                    <span className="text-sm font-medium">Total Reading</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">{analytics.totalReadingTime}m</p>
                  <p className="text-sm text-blue-600">{analytics.totalSessions} sessions</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <TargetIcon size={20} />
                    <span className="text-sm font-medium">Avg Score</span>
                  </div>
                  <p className="text-3xl font-bold text-green-700">{analytics.overallAvg}%</p>
                  <p className="text-sm text-green-600">{playerState.gameScores.length} games</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <BookIcon size={20} />
                    <span className="text-sm font-medium">Words Learned</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-700">{analytics.learnedWords}</p>
                  <p className="text-sm text-purple-600">of {analytics.totalWords} total</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <StarIcon size={20} filled />
                    <span className="text-sm font-medium">Mysteries Solved</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-700">{progress.completedMysteries.length}</p>
                  <p className="text-sm text-amber-600">of {mysteries.length} total</p>
                </div>
              </div>

              {/* Today's Progress */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarIcon size={20} className="text-indigo-600" />
                  Today's Progress
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Reading Time</span>
                      <span className="font-bold text-gray-800">
                        {analytics.todayReadingTime}/{dailyGoal.readingMinutes}m
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          analytics.todayReadingTime >= dailyGoal.readingMinutes 
                            ? 'bg-green-500' 
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, (analytics.todayReadingTime / dailyGoal.readingMinutes) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Games Played</span>
                      <span className="font-bold text-gray-800">
                        {analytics.todayGames}/{dailyGoal.gamesPerDay}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          analytics.todayGames >= dailyGoal.gamesPerDay 
                            ? 'bg-green-500' 
                            : 'bg-purple-500'
                        }`}
                        style={{ width: `${Math.min(100, (analytics.todayGames / dailyGoal.gamesPerDay) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Weekly Mysteries</span>
                      <span className="font-bold text-gray-800">
                        {analytics.weeklyMysteries}/{dailyGoal.mysteriesPerWeek}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          analytics.weeklyMysteries >= dailyGoal.mysteriesPerWeek 
                            ? 'bg-green-500' 
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (analytics.weeklyMysteries / dailyGoal.mysteriesPerWeek) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <LightbulbIcon size={20} className="text-amber-500" />
                  Recommendations
                </h3>
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((rec, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-xl flex items-start gap-3 ${
                          rec.type === 'warning' ? 'bg-orange-50 border border-orange-200' :
                          rec.type === 'success' ? 'bg-green-50 border border-green-200' :
                          'bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          rec.type === 'warning' ? 'bg-orange-100' :
                          rec.type === 'success' ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          {rec.type === 'warning' ? (
                            <TrendDownIcon size={16} className="text-orange-600" />
                          ) : rec.type === 'success' ? (
                            <CheckIcon size={16} className="text-green-600" />
                          ) : (
                            <LightbulbIcon size={16} className="text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${
                            rec.type === 'warning' ? 'text-orange-800' :
                            rec.type === 'success' ? 'text-green-800' :
                            'text-blue-800'
                          }`}>{rec.message}</p>
                          {rec.action && (
                            <p className={`text-sm mt-1 ${
                              rec.type === 'warning' ? 'text-orange-600' :
                              rec.type === 'success' ? 'text-green-600' :
                              'text-blue-600'
                            }`}>{rec.action}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Complete more activities to receive personalized recommendations!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Worksheets Tab - Combined Online/Offline Analytics */}
          {activeTab === 'worksheets' && (
            <WorksheetScoreAnalytics
              worksheetScores={worksheetScores}
              gameScores={playerState.gameScores}
              mysteries={mysteries}
              completedMysteries={progress.completedMysteries}
            />
          )}

          {/* Recordings Tab */}
          {activeTab === 'recordings' && (
            <RecordingsLibrary embedded />
          )}



          {/* Reading Time Tab */}

          {/* Reading Time Tab */}
          {activeTab === 'reading' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                  <ClockIcon size={32} className="mb-3" />
                  <p className="text-blue-100 text-sm">Total Reading Time</p>
                  <p className="text-4xl font-bold">{analytics.totalReadingTime}m</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
                  <CalendarIcon size={32} className="mb-3" />
                  <p className="text-indigo-100 text-sm">This Week</p>
                  <p className="text-4xl font-bold">{analytics.weeklyReadingTime}m</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                  <BarChartIcon size={32} className="mb-3" />
                  <p className="text-purple-100 text-sm">Avg Session</p>
                  <p className="text-4xl font-bold">{analytics.avgSessionTime}m</p>
                </div>
              </div>

              {/* Reading Sessions List */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Reading Sessions</h3>
                {readingSessions.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {readingSessions.slice(0, 20).map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookIcon size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{session.mysteryTitle}</p>
                            <p className="text-sm text-gray-500">{formatDate(new Date(session.date))}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{session.duration}m</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reading sessions recorded yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Game Performance Tab */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                  <TrendUpIcon size={32} className="mb-3" />
                  <p className="text-green-100 text-sm">Weekly Average</p>
                  <p className="text-4xl font-bold">{analytics.weeklyAvg}%</p>
                </div>
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
                  <TargetIcon size={32} className="mb-3" />
                  <p className="text-teal-100 text-sm">Monthly Average</p>
                  <p className="text-4xl font-bold">{analytics.monthlyAvg}%</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <StarIcon size={32} filled className="mb-3" />
                  <p className="text-emerald-100 text-sm">Overall Average</p>
                  <p className="text-4xl font-bold">{analytics.overallAvg}%</p>
                </div>
              </div>

              {/* Performance by Game Type */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Performance by Game Type</h3>
                {analytics.performanceByType.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.performanceByType.map(perf => (
                      <div key={perf.type} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">{perf.label}</span>
                            {perf.trend !== 0 && (
                              <span className={`flex items-center gap-1 text-sm ${
                                perf.trend > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {perf.trend > 0 ? <TrendUpIcon size={14} /> : <TrendDownIcon size={14} />}
                                {Math.abs(perf.trend)}%
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-800">{perf.avgScore}%</span>
                            <span className="text-gray-500 text-sm ml-2">({perf.totalGames} games)</span>
                          </div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              perf.avgScore >= 80 ? 'bg-green-500' :
                              perf.avgScore >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${perf.avgScore}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No games played yet.</p>
                )}
              </div>

              {/* Recent Game Scores */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Game Scores</h3>
                {playerState.gameScores.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {playerState.gameScores.slice(-10).reverse().map((score, idx) => {
                      const mystery = mysteries.find(m => m.id === score.mysteryId);
                      const percentage = Math.round((score.score / score.maxScore) * 100);
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-800">
                              {score.gameType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-500">{mystery?.title || 'Unknown'}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full font-bold ${
                            percentage >= 80 ? 'bg-green-100 text-green-700' :
                            percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No games played yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Vocabulary Tab */}
          {activeTab === 'vocabulary' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                  <BookIcon size={32} className="mb-3" />
                  <p className="text-purple-100 text-sm">Words Learned</p>
                  <p className="text-4xl font-bold">{analytics.learnedWords}</p>
                  <p className="text-purple-200 mt-1">of {analytics.totalWords} total words</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
                  <CheckIcon size={32} className="mb-3" />
                  <p className="text-pink-100 text-sm">Word Families Mastered</p>
                  <p className="text-4xl font-bold">{progress.wordFamiliesMastered.length}</p>
                  <p className="text-pink-200 mt-1">of {mysteries.length} families</p>
                </div>
              </div>

              {/* Word Families Progress */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Word Families Progress</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {mysteries.map(mystery => {
                    const isMastered = progress.wordFamiliesMastered.includes(mystery.wordFamily);
                    return (
                      <div 
                        key={mystery.id}
                        className={`p-4 rounded-xl border-2 ${
                          isMastered 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-bold text-lg ${
                            isMastered ? 'text-green-700' : 'text-gray-700'
                          }`}>
                            {mystery.wordFamily}
                          </span>
                          {isMastered && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckIcon size={14} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {mystery.words.map(word => (
                            <span 
                              key={word}
                              className={`px-2 py-1 rounded text-sm ${
                                isMastered 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              {/* Goal Settings */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FlagIcon size={20} className="text-indigo-600" />
                    Daily & Weekly Goals
                  </h3>
                  {!isEditingGoal ? (
                    <button
                      onClick={() => {
                        setTempGoal(dailyGoal);
                        setIsEditingGoal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition-colors"
                    >
                      <EditIcon size={16} />
                      Edit Goals
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={saveGoal}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                      >
                        <CheckIcon size={16} />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingGoal(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <label className="block text-blue-700 font-medium mb-2">
                      Daily Reading Goal (minutes)
                    </label>
                    {isEditingGoal ? (
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={tempGoal.readingMinutes}
                        onChange={(e) => setTempGoal({ ...tempGoal, readingMinutes: parseInt(e.target.value) || 15 })}
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl text-2xl font-bold text-center focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-4xl font-bold text-blue-700 text-center">{dailyGoal.readingMinutes}</p>
                    )}
                    <p className="text-sm text-blue-600 mt-2 text-center">
                      Current: {analytics.todayReadingTime}m today
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <label className="block text-purple-700 font-medium mb-2">
                      Daily Games Goal
                    </label>
                    {isEditingGoal ? (
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={tempGoal.gamesPerDay}
                        onChange={(e) => setTempGoal({ ...tempGoal, gamesPerDay: parseInt(e.target.value) || 2 })}
                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl text-2xl font-bold text-center focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      <p className="text-4xl font-bold text-purple-700 text-center">{dailyGoal.gamesPerDay}</p>
                    )}
                    <p className="text-sm text-purple-600 mt-2 text-center">
                      Current: {analytics.todayGames} today
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4">
                    <label className="block text-amber-700 font-medium mb-2">
                      Weekly Mysteries Goal
                    </label>
                    {isEditingGoal ? (
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={tempGoal.mysteriesPerWeek}
                        onChange={(e) => setTempGoal({ ...tempGoal, mysteriesPerWeek: parseInt(e.target.value) || 3 })}
                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl text-2xl font-bold text-center focus:outline-none focus:border-amber-500"
                      />
                    ) : (
                      <p className="text-4xl font-bold text-amber-700 text-center">{dailyGoal.mysteriesPerWeek}</p>
                    )}
                    <p className="text-sm text-amber-600 mt-2 text-center">
                      Current: {analytics.weeklyMysteries} this week
                    </p>
                  </div>
                </div>
              </div>

              {/* Completed Mysteries Timeline */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CalendarIcon size={20} className="text-green-600" />
                  Completed Mysteries Timeline
                </h3>
                {analytics.completedMysteriesData.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.completedMysteriesData.map(mystery => (
                      <div key={mystery.id} className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckIcon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">{mystery.title}</p>
                          <p className="text-sm text-gray-500">
                            {mystery.wordFamily} family • {formatDate(mystery.completedAt)}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full font-bold ${
                          mystery.avgScore >= 80 ? 'bg-green-100 text-green-700' :
                          mystery.avgScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {mystery.avgScore}%
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No mysteries completed yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-between items-center flex-shrink-0 bg-gray-50">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <PrinterIcon size={18} />
            Print Report
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
