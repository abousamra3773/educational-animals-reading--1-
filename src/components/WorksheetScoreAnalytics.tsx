import React, { useMemo } from 'react';
import { Mystery, WorksheetScore, GameScore } from '../types';
import {
  TrendUpIcon, TrendDownIcon, CheckIcon, BookIcon, TargetIcon, StarIcon,
  FileTextIcon, ChartIcon
} from './icons/Icons';

interface WorksheetScoreAnalyticsProps {
  worksheetScores: WorksheetScore[];
  gameScores: GameScore[];
  mysteries: Mystery[];
  completedMysteries: string[];
}

// Simple bar chart component
const MiniBarChart: React.FC<{
  data: { label: string; value: number; color: string }[];
  maxValue?: number;
}> = ({ data, maxValue }) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-gray-600">{item.value}%</span>
          <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
            <div
              className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500 ${item.color}`}
              style={{ height: `${Math.max(4, (item.value / max) * 100)}%` }}
            />
          </div>
          <span className="text-[9px] text-gray-500 text-center leading-tight truncate w-full">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Trend line component
const TrendLine: React.FC<{
  data: number[];
  color: string;
  height?: number;
}> = ({ data, color, height = 40 }) => {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 200;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4);
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
};

export const WorksheetScoreAnalytics: React.FC<WorksheetScoreAnalyticsProps> = ({
  worksheetScores,
  gameScores,
  mysteries,
  completedMysteries,
}) => {
  const analytics = useMemo(() => {
    // Worksheet analytics
    const wsScoresByMystery: Record<string, WorksheetScore[]> = {};
    worksheetScores.forEach(s => {
      if (!wsScoresByMystery[s.mysteryId]) wsScoresByMystery[s.mysteryId] = [];
      wsScoresByMystery[s.mysteryId].push(s);
    });

    const wsOverallPct = worksheetScores.length > 0
      ? Math.round(worksheetScores.reduce((sum, s) => sum + (s.percentage || 0), 0) / worksheetScores.length)
      : 0;

    // Section averages
    const sectionAvgs = {
      fillInBlank: worksheetScores.length > 0
        ? Math.round(worksheetScores.reduce((sum, s) => sum + (s.fillInBlank.max > 0 ? (s.fillInBlank.score / s.fillInBlank.max) * 100 : 0), 0) / worksheetScores.length)
        : 0,
      wordMatching: worksheetScores.length > 0
        ? Math.round(worksheetScores.reduce((sum, s) => sum + (s.wordMatching.max > 0 ? (s.wordMatching.score / s.wordMatching.max) * 100 : 0), 0) / worksheetScores.length)
        : 0,
      sentenceCompletion: worksheetScores.length > 0
        ? Math.round(worksheetScores.reduce((sum, s) => sum + (s.sentenceCompletion.max > 0 ? (s.sentenceCompletion.score / s.sentenceCompletion.max) * 100 : 0), 0) / worksheetScores.length)
        : 0,
      comprehension: worksheetScores.length > 0
        ? Math.round(worksheetScores.reduce((sum, s) => sum + (s.comprehension.max > 0 ? (s.comprehension.score / s.comprehension.max) * 100 : 0), 0) / worksheetScores.length)
        : 0,
    };

    // Game analytics
    const gameOverallPct = gameScores.length > 0
      ? Math.round(gameScores.reduce((sum, s) => sum + (s.maxScore > 0 ? (s.score / s.maxScore) * 100 : 0), 0) / gameScores.length)
      : 0;

    const gameTypeAvgs: Record<string, number> = {};
    const gameTypes = ['comprehension', 'word-family', 'story-sequencing', 'choose-right-word', 'sentence-builder'];
    gameTypes.forEach(type => {
      const scores = gameScores.filter(s => s.gameType === type);
      gameTypeAvgs[type] = scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + (s.maxScore > 0 ? (s.score / s.maxScore) * 100 : 0), 0) / scores.length)
        : 0;
    });

    // Combined score
    const totalEntries = worksheetScores.length + gameScores.length;
    const combinedPct = totalEntries > 0
      ? Math.round(
          (worksheetScores.reduce((sum, s) => sum + (s.percentage || 0), 0) +
           gameScores.reduce((sum, s) => sum + (s.maxScore > 0 ? (s.score / s.maxScore) * 100 : 0), 0)) /
          totalEntries
        )
      : 0;

    // Trend data (worksheet scores over time)
    const wsTrend = worksheetScores
      .slice()
      .sort((a, b) => new Date(a.scoredAt).getTime() - new Date(b.scoredAt).getTime())
      .map(s => s.percentage || 0);

    // Trend data (game scores over time)
    const gameTrend = gameScores
      .slice()
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
      .map(s => s.maxScore > 0 ? Math.round((s.score / s.maxScore) * 100) : 0);

    // Per-mystery combined view
    const mysteryAnalytics = completedMysteries.map(id => {
      const mystery = mysteries.find(m => m.id === id);
      const wsScores = wsScoresByMystery[id] || [];
      const gScores = gameScores.filter(s => s.mysteryId === id);

      const wsAvg = wsScores.length > 0
        ? Math.round(wsScores.reduce((sum, s) => sum + (s.percentage || 0), 0) / wsScores.length)
        : null;
      const gAvg = gScores.length > 0
        ? Math.round(gScores.reduce((sum, s) => sum + (s.maxScore > 0 ? (s.score / s.maxScore) * 100 : 0), 0) / gScores.length)
        : null;

      return {
        id,
        title: mystery?.title || 'Unknown',
        wordFamily: mystery?.wordFamily || '',
        worksheetAvg: wsAvg,
        gameAvg: gAvg,
        worksheetCount: wsScores.length,
        gameCount: gScores.length,
      };
    });

    // Improvement detection
    const wsImproving = wsTrend.length >= 2 && wsTrend[wsTrend.length - 1] > wsTrend[0];
    const gameImproving = gameTrend.length >= 2 && gameTrend[gameTrend.length - 1] > gameTrend[0];

    return {
      wsOverallPct,
      gameOverallPct,
      combinedPct,
      sectionAvgs,
      gameTypeAvgs,
      wsTrend,
      gameTrend,
      mysteryAnalytics,
      wsImproving,
      gameImproving,
      totalWorksheets: worksheetScores.length,
      totalGames: gameScores.length,
    };
  }, [worksheetScores, gameScores, mysteries, completedMysteries]);

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return 'text-green-600';
    if (pct >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (pct: number) => {
    if (pct >= 80) return 'bg-green-100 text-green-700';
    if (pct >= 60) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  if (analytics.totalWorksheets === 0 && analytics.totalGames === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <FileTextIcon className="mx-auto mb-3 text-gray-300" size={48} />
        <p className="font-medium text-gray-500">No scores recorded yet</p>
        <p className="text-sm mt-2">Complete mysteries and enter worksheet scores to see combined analytics!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Combined Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <ChartIcon size={20} />
            <span className="text-sm font-medium text-white/80">Combined Score</span>
          </div>
          <p className="text-4xl font-bold">{analytics.combinedPct}%</p>
          <p className="text-sm text-white/70 mt-1">
            {analytics.totalWorksheets + analytics.totalGames} total activities
          </p>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <FileTextIcon size={20} />
            <span className="text-sm font-medium text-white/80">Worksheet Avg</span>
          </div>
          <p className="text-4xl font-bold">{analytics.wsOverallPct}%</p>
          <div className="flex items-center gap-1 mt-1">
            {analytics.wsImproving ? (
              <TrendUpIcon size={14} className="text-green-300" />
            ) : analytics.wsTrend.length >= 2 ? (
              <TrendDownIcon size={14} className="text-red-300" />
            ) : null}
            <span className="text-sm text-white/70">{analytics.totalWorksheets} worksheets</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TargetIcon size={20} />
            <span className="text-sm font-medium text-white/80">Digital Games Avg</span>
          </div>
          <p className="text-4xl font-bold">{analytics.gameOverallPct}%</p>
          <div className="flex items-center gap-1 mt-1">
            {analytics.gameImproving ? (
              <TrendUpIcon size={14} className="text-green-300" />
            ) : analytics.gameTrend.length >= 2 ? (
              <TrendDownIcon size={14} className="text-red-300" />
            ) : null}
            <span className="text-sm text-white/70">{analytics.totalGames} games</span>
          </div>
        </div>
      </div>

      {/* Worksheet Section Breakdown */}
      {analytics.totalWorksheets > 0 && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileTextIcon size={20} className="text-violet-600" />
            Worksheet Section Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Fill-in-Blank', value: analytics.sectionAvgs.fillInBlank, color: 'violet' },
              { label: 'Word Matching', value: analytics.sectionAvgs.wordMatching, color: 'blue' },
              { label: 'Sentence Comp.', value: analytics.sectionAvgs.sentenceCompletion, color: 'amber' },
              { label: 'Comprehension', value: analytics.sectionAvgs.comprehension, color: 'emerald' },
            ].map((section) => {
              const colorMap: Record<string, { bg: string; fill: string; text: string }> = {
                violet: { bg: 'bg-violet-50', fill: 'bg-violet-500', text: 'text-violet-700' },
                blue: { bg: 'bg-blue-50', fill: 'bg-blue-500', text: 'text-blue-700' },
                amber: { bg: 'bg-amber-50', fill: 'bg-amber-500', text: 'text-amber-700' },
                emerald: { bg: 'bg-emerald-50', fill: 'bg-emerald-500', text: 'text-emerald-700' },
              };
              const c = colorMap[section.color];
              return (
                <div key={section.label} className={`${c.bg} rounded-xl p-4 text-center`}>
                  <p className={`text-3xl font-bold ${c.text}`}>{section.value}%</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">{section.label}</p>
                  <div className="h-2 bg-white rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${c.fill} rounded-full transition-all`}
                      style={{ width: `${section.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trend Charts */}
      {(analytics.wsTrend.length >= 2 || analytics.gameTrend.length >= 2) && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendUpIcon size={20} className="text-green-600" />
            Progress Trends
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {analytics.wsTrend.length >= 2 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-violet-700">Worksheet Scores Over Time</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${analytics.wsImproving ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {analytics.wsImproving ? 'Improving' : 'Needs Focus'}
                  </span>
                </div>
                <div className="bg-violet-50 rounded-xl p-4">
                  <TrendLine data={analytics.wsTrend} color="#7c3aed" height={50} />
                </div>
              </div>
            )}
            {analytics.gameTrend.length >= 2 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-700">Digital Game Scores Over Time</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${analytics.gameImproving ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {analytics.gameImproving ? 'Improving' : 'Needs Focus'}
                  </span>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <TrendLine data={analytics.gameTrend} color="#2563eb" height={50} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Per-Mystery Combined View */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookIcon size={20} className="text-purple-600" />
          Online vs. Offline Progress by Mystery
        </h3>
        {analytics.mysteryAnalytics.length > 0 ? (
          <div className="space-y-3">
            {analytics.mysteryAnalytics.map((ma) => (
              <div key={ma.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{ma.title}</p>
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                      {ma.wordFamily}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Worksheet Score */}
                  <div className="bg-white rounded-lg p-3 border border-violet-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FileTextIcon size={14} className="text-violet-500" />
                      <span className="text-xs font-semibold text-violet-700">Printed Worksheets</span>
                    </div>
                    {ma.worksheetAvg !== null ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(ma.worksheetAvg)}`}>
                          {ma.worksheetAvg}%
                        </span>
                        <span className="text-xs text-gray-400">({ma.worksheetCount} scored)</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No scores yet</span>
                    )}
                  </div>

                  {/* Game Score */}
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <TargetIcon size={14} className="text-blue-500" />
                      <span className="text-xs font-semibold text-blue-700">Digital Games</span>
                    </div>
                    {ma.gameAvg !== null ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(ma.gameAvg)}`}>
                          {ma.gameAvg}%
                        </span>
                        <span className="text-xs text-gray-400">({ma.gameCount} games)</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No games yet</span>
                    )}
                  </div>
                </div>

                {/* Comparison bar */}
                {(ma.worksheetAvg !== null || ma.gameAvg !== null) && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                      {ma.worksheetAvg !== null && (
                        <div
                          className="h-full bg-violet-500 rounded-l-full"
                          style={{ width: `${ma.worksheetAvg / 2}%` }}
                          title={`Worksheets: ${ma.worksheetAvg}%`}
                        />
                      )}
                      {ma.gameAvg !== null && (
                        <div
                          className="h-full bg-blue-500 rounded-r-full"
                          style={{ width: `${ma.gameAvg / 2}%` }}
                          title={`Games: ${ma.gameAvg}%`}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-violet-500" />
                        Worksheet
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Digital
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Complete mysteries to see per-mystery analytics.</p>
        )}
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <StarIcon size={20} filled className="text-amber-500" />
          Learning Insights
        </h3>
        <div className="space-y-3">
          {/* Strongest section */}
          {analytics.totalWorksheets > 0 && (() => {
            const sections = [
              { name: 'Fill-in-the-Blank', value: analytics.sectionAvgs.fillInBlank },
              { name: 'Word Matching', value: analytics.sectionAvgs.wordMatching },
              { name: 'Sentence Completion', value: analytics.sectionAvgs.sentenceCompletion },
              { name: 'Comprehension', value: analytics.sectionAvgs.comprehension },
            ];
            const strongest = sections.reduce((a, b) => a.value >= b.value ? a : b);
            const weakest = sections.reduce((a, b) => a.value <= b.value ? a : b);
            return (
              <>
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendUpIcon size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      Strongest area: <strong>{strongest.name}</strong> ({strongest.value}%)
                    </p>
                    <p className="text-sm text-green-600 mt-0.5">Keep up the great work in this area!</p>
                  </div>
                </div>
                {weakest.value < 70 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendDownIcon size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-amber-800">
                        Area to improve: <strong>{weakest.name}</strong> ({weakest.value}%)
                      </p>
                      <p className="text-sm text-amber-600 mt-0.5">Try extra practice with {weakest.name.toLowerCase()} exercises.</p>
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* Online vs offline comparison */}
          {analytics.totalWorksheets > 0 && analytics.totalGames > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ChartIcon size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800">
                  {analytics.wsOverallPct > analytics.gameOverallPct
                    ? `Worksheet scores (${analytics.wsOverallPct}%) are higher than digital games (${analytics.gameOverallPct}%)`
                    : analytics.wsOverallPct < analytics.gameOverallPct
                    ? `Digital game scores (${analytics.gameOverallPct}%) are higher than worksheets (${analytics.wsOverallPct}%)`
                    : `Worksheet and digital game scores are evenly matched (${analytics.wsOverallPct}%)`
                  }
                </p>
                <p className="text-sm text-blue-600 mt-0.5">
                  {analytics.wsOverallPct > analytics.gameOverallPct
                    ? 'Your child may benefit from more interactive digital practice.'
                    : analytics.wsOverallPct < analytics.gameOverallPct
                    ? 'Printed worksheets offer great handwriting and focus practice.'
                    : 'A balanced approach is working well!'}
                </p>
              </div>
            </div>
          )}

          {analytics.totalWorksheets === 0 && analytics.totalGames > 0 && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileTextIcon size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-purple-800">
                  Try printed worksheets for offline practice!
                </p>
                <p className="text-sm text-purple-600 mt-0.5">
                  Print worksheets from the Parent Section and enter scores here to see combined analytics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
