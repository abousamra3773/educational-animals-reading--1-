import React, { useState, useEffect } from 'react';
import { Mystery, WorksheetScore, WorksheetScoreSection } from '../types';
import { supabase } from '@/lib/supabase';
import {
  CheckIcon, XIcon, EditIcon, StarIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon
} from './icons/Icons';

interface WorksheetScoreEntryProps {
  mystery: Mystery;
  existingScores: WorksheetScore[];
  userId: string;
  onScoreSaved: () => void;
}

const STORAGE_KEY = 'wordWhiskerWorksheetScores';

function getLocalScores(): WorksheetScore[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveLocalScores(scores: WorksheetScore[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

const ScoreSlider: React.FC<{
  label: string;
  color: string;
  value: WorksheetScoreSection;
  onChange: (val: WorksheetScoreSection) => void;
}> = ({ label, color, value, onChange }) => {
  const pct = value.max > 0 ? Math.round((value.score / value.max) * 100) : 0;
  const colorMap: Record<string, { bg: string; fill: string; text: string; ring: string; light: string }> = {
    violet: { bg: 'bg-violet-50', fill: 'bg-violet-500', text: 'text-violet-700', ring: 'ring-violet-300', light: 'bg-violet-100' },
    blue: { bg: 'bg-blue-50', fill: 'bg-blue-500', text: 'text-blue-700', ring: 'ring-blue-300', light: 'bg-blue-100' },
    amber: { bg: 'bg-amber-50', fill: 'bg-amber-500', text: 'text-amber-700', ring: 'ring-amber-300', light: 'bg-amber-100' },
    emerald: { bg: 'bg-emerald-50', fill: 'bg-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-300', light: 'bg-emerald-100' },
  };
  const c = colorMap[color] || colorMap.violet;

  return (
    <div className={`${c.bg} rounded-xl p-3`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${c.text}`}>{label}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.light} ${c.text}`}>
          {pct}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ ...value, score: Math.max(0, value.score - 1) })}
            className={`w-7 h-7 rounded-lg ${c.light} ${c.text} font-bold text-lg flex items-center justify-center hover:opacity-80 transition-opacity`}
          >
            -
          </button>
          <input
            type="number"
            min={0}
            max={value.max}
            value={value.score}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 0;
              onChange({ ...value, score: Math.min(value.max, Math.max(0, v)) });
            }}
            className={`w-12 h-8 text-center font-bold ${c.text} bg-white border-2 border-transparent focus:border-current rounded-lg text-sm outline-none`}
          />
          <button
            type="button"
            onClick={() => onChange({ ...value, score: Math.min(value.max, value.score + 1) })}
            className={`w-7 h-7 rounded-lg ${c.light} ${c.text} font-bold text-lg flex items-center justify-center hover:opacity-80 transition-opacity`}
          >
            +
          </button>
          <span className="text-xs text-gray-400 ml-1">/ {value.max}</span>
        </div>
        <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden">
          <div
            className={`h-full ${c.fill} rounded-full transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const WorksheetScoreEntry: React.FC<WorksheetScoreEntryProps> = ({
  mystery,
  existingScores,
  userId,
  onScoreSaved,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);

  const [fillInBlank, setFillInBlank] = useState<WorksheetScoreSection>({ score: 0, max: 6 });
  const [wordMatching, setWordMatching] = useState<WorksheetScoreSection>({ score: 0, max: 6 });
  const [sentenceCompletion, setSentenceCompletion] = useState<WorksheetScoreSection>({ score: 0, max: 4 });
  const [comprehension, setComprehension] = useState<WorksheetScoreSection>({ score: 0, max: 6 });
  const [notes, setNotes] = useState('');

  const mysteryScores = existingScores.filter(s => s.mysteryId === mystery.id);
  const latestScore = mysteryScores.length > 0 ? mysteryScores[0] : null;

  const resetForm = () => {
    setFillInBlank({ score: 0, max: 6 });
    setWordMatching({ score: 0, max: 6 });
    setSentenceCompletion({ score: 0, max: 4 });
    setComprehension({ score: 0, max: 6 });
    setNotes('');
    setEditingScoreId(null);
  };

  const loadScoreIntoForm = (score: WorksheetScore) => {
    setFillInBlank(score.fillInBlank);
    setWordMatching(score.wordMatching);
    setSentenceCompletion(score.sentenceCompletion);
    setComprehension(score.comprehension);
    setNotes(score.notes || '');
    setEditingScoreId(score.id || null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const scoreData: WorksheetScore = {
      mysteryId: mystery.id,
      fillInBlank,
      wordMatching,
      sentenceCompletion,
      comprehension,
      notes,
      scoredAt: new Date().toISOString(),
    };

    // Calculate totals
    scoreData.totalScore = fillInBlank.score + wordMatching.score + sentenceCompletion.score + comprehension.score;
    scoreData.totalMax = fillInBlank.max + wordMatching.max + sentenceCompletion.max + comprehension.max;
    scoreData.percentage = scoreData.totalMax > 0 ? Math.round((scoreData.totalScore / scoreData.totalMax) * 100) : 0;

    try {
      // Try to save to database
      const action = editingScoreId ? 'update' : 'save';
      const { data, error } = await supabase.functions.invoke('worksheet-scores', {
        body: {
          action,
          userId,
          mysteryId: mystery.id,
          scoreId: editingScoreId,
          scores: {
            fillInBlank,
            wordMatching,
            sentenceCompletion,
            comprehension,
            notes,
            scoredAt: scoreData.scoredAt,
          },
        },
      });

      if (error) {
        console.warn('Cloud save failed, saving locally:', error);
      }

      // Also save locally as backup
      const localScores = getLocalScores();
      if (editingScoreId) {
        const idx = localScores.findIndex(s => s.id === editingScoreId);
        if (idx >= 0) {
          localScores[idx] = { ...scoreData, id: editingScoreId };
        }
      } else {
        const newId = data?.score?.id || `local-${Date.now()}`;
        localScores.unshift({ ...scoreData, id: newId });
      }
      saveLocalScores(localScores);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditing(false);
      resetForm();
      onScoreSaved();
    } catch (err) {
      console.warn('Save error, saving locally:', err);
      // Save locally as fallback
      const localScores = getLocalScores();
      const newId = `local-${Date.now()}`;
      localScores.unshift({ ...scoreData, id: newId });
      saveLocalScores(localScores);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditing(false);
      resetForm();
      onScoreSaved();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (scoreId: string) => {
    try {
      await supabase.functions.invoke('worksheet-scores', {
        body: { action: 'delete', userId, scoreId },
      });
    } catch (err) {
      console.warn('Cloud delete failed:', err);
    }

    // Remove locally too
    const localScores = getLocalScores().filter(s => s.id !== scoreId);
    saveLocalScores(localScores);
    onScoreSaved();
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return 'text-green-600 bg-green-100';
    if (pct >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (pct: number) => {
    if (pct >= 90) return 'Excellent!';
    if (pct >= 80) return 'Great Job!';
    if (pct >= 70) return 'Good Work';
    if (pct >= 60) return 'Keep Trying';
    return 'Needs Practice';
  };

  return (
    <div className="mt-3">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl hover:border-indigo-200 transition-all group"
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span className="text-sm font-semibold text-indigo-700">
            Worksheet Scores
          </span>
          {latestScore && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getScoreColor(latestScore.percentage || 0)}`}>
              {latestScore.percentage}%
            </span>
          )}
          {mysteryScores.length > 0 && (
            <span className="text-xs text-gray-400">
              ({mysteryScores.length} {mysteryScores.length === 1 ? 'entry' : 'entries'})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <CheckIcon size={12} /> Saved!
            </span>
          )}
          {isExpanded ? <ChevronUpIcon size={16} className="text-indigo-400" /> : <ChevronDownIcon size={16} className="text-indigo-400" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-2 bg-white border border-indigo-100 rounded-xl overflow-hidden">
          {/* Existing Scores */}
          {mysteryScores.length > 0 && !isEditing && (
            <div className="p-4">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Score History</h4>
              <div className="space-y-2">
                {mysteryScores.map((score) => {
                  const pct = score.percentage || 0;
                  return (
                    <div key={score.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${getScoreColor(pct)}`}>
                        {pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">{getScoreLabel(pct)}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(score.scoredAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>Fill: {score.fillInBlank.score}/{score.fillInBlank.max}</span>
                          <span>Match: {score.wordMatching.score}/{score.wordMatching.max}</span>
                          <span>Sent: {score.sentenceCompletion.score}/{score.sentenceCompletion.max}</span>
                          <span>Comp: {score.comprehension.score}/{score.comprehension.max}</span>
                        </div>
                        {score.notes && (
                          <p className="text-xs text-gray-400 mt-1 truncate">{score.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            loadScoreIntoForm(score);
                            setIsEditing(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit score"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          onClick={() => score.id && handleDelete(score.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete score"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Score Entry Form */}
          {isEditing ? (
            <div className="p-4 border-t border-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-700">
                  {editingScoreId ? 'Edit Worksheet Score' : 'Enter Worksheet Score'}
                </h4>
                <button
                  onClick={() => { setIsEditing(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <ScoreSlider
                  label="Fill-in-the-Blank"
                  color="violet"
                  value={fillInBlank}
                  onChange={setFillInBlank}
                />
                <ScoreSlider
                  label="Word Matching"
                  color="blue"
                  value={wordMatching}
                  onChange={setWordMatching}
                />
                <ScoreSlider
                  label="Sentence Completion"
                  color="amber"
                  value={sentenceCompletion}
                  onChange={setSentenceCompletion}
                />
                <ScoreSlider
                  label="Comprehension"
                  color="emerald"
                  value={comprehension}
                  onChange={setComprehension}
                />

                {/* Overall Score Preview */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-indigo-700">Overall Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-700">
                        {fillInBlank.score + wordMatching.score + sentenceCompletion.score + comprehension.score}
                      </span>
                      <span className="text-sm text-indigo-400">
                        / {fillInBlank.max + wordMatching.max + sentenceCompletion.max + comprehension.max}
                      </span>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                        getScoreColor(
                          Math.round(
                            ((fillInBlank.score + wordMatching.score + sentenceCompletion.score + comprehension.score) /
                            (fillInBlank.max + wordMatching.max + sentenceCompletion.max + comprehension.max)) * 100
                          )
                        )
                      }`}>
                        {Math.round(
                          ((fillInBlank.score + wordMatching.score + sentenceCompletion.score + comprehension.score) /
                          (fillInBlank.max + wordMatching.max + sentenceCompletion.max + comprehension.max)) * 100
                        )}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Struggled with matching but did great on comprehension..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none"
                    rows={2}
                  />
                </div>

                {/* Save / Cancel Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckIcon size={16} />
                    )}
                    {isSaving ? 'Saving...' : editingScoreId ? 'Update Score' : 'Save Score'}
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); resetForm(); }}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-indigo-50">
              <button
                onClick={() => { resetForm(); setIsEditing(true); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-100 transition-colors border-2 border-dashed border-indigo-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {mysteryScores.length > 0 ? 'Add Another Score' : 'Enter Worksheet Score'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
