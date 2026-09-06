import React, { useState, useEffect } from 'react';
import { TapToHear } from '../TapToHear';
import { CheckCircleIcon, XCircleIcon, SparklesIcon } from '../icons/Icons';
import { SpanishVocabWord, SpanishVerb } from '../../data/spanishLearningData';

interface WordFamilyMatchProps {
  wordFamily: string;
  correctWords: string[];
  distractorWords: string[];
  onComplete: (score: number, maxScore: number) => void;
  isSpanishMode?: boolean;
  spanishVocab?: SpanishVocabWord[];
  spanishVerbs?: SpanishVerb[];
}

export const WordFamilyMatch: React.FC<WordFamilyMatchProps> = ({
  wordFamily,
  correctWords,
  distractorWords,
  onComplete,
  isSpanishMode = false,
  spanishVocab,
  spanishVerbs,
}) => {
  const [allWords, setAllWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect' | null>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Build a lookup map for Spanish words to show translations
  const spanishWordMap = React.useMemo(() => {
    const map: Record<string, { english: string; type: string }> = {};
    if (spanishVocab) {
      spanishVocab.forEach(v => {
        map[v.spanish] = { english: v.english, type: 'noun' };
      });
    }
    if (spanishVerbs) {
      spanishVerbs.forEach(v => {
        map[v.infinitive] = { english: v.english, type: 'verb' };
      });
    }
    return map;
  }, [spanishVocab, spanishVerbs]);

  useEffect(() => {
    const combined = [...correctWords, ...distractorWords];
    setAllWords(combined.sort(() => Math.random() - 0.5));
  }, [correctWords, distractorWords]);

  const handleWordClick = (word: string) => {
    if (feedback[word] || isComplete) return;

    const isCorrect = correctWords.includes(word);
    setSelectedWords([...selectedWords, word]);
    setFeedback({ ...feedback, [word]: isCorrect ? 'correct' : 'incorrect' });

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const newSelectedCorrect = [...selectedWords, word].filter(w => correctWords.includes(w));
    if (newSelectedCorrect.length === correctWords.length) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete(score + (isCorrect ? 1 : 0), correctWords.length);
      }, 1500);
    }
  };

  // Title and instructions based on mode
  const title = isSpanishMode ? 'Vocabulario Match' : 'Word Family Match';
  const subtitle = isSpanishMode 
    ? '¡Encuentra todas las palabras del cuento!'
    : `Find all the ${wordFamily} words!`;
  const instruction = isSpanishMode
    ? 'Toca las palabras que aprendiste en la historia'
    : `Tap the words that belong to the ${wordFamily} family`;
  const completionMsg = isSpanishMode
    ? '¡Excelente! ¡Encontraste todas las palabras!'
    : `Great job! You found all the ${wordFamily} words!`;
  const hintMsg = isSpanishMode
    ? 'Pista: Busca las palabras de vocabulario y verbos que aprendiste'
    : `Hint: Look for words that end with "${wordFamily}"`;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isSpanishMode ? 'bg-emerald-100' : 'bg-purple-100'}`}>
          <SparklesIcon className={isSpanishMode ? 'text-emerald-500' : 'text-purple-500'} size={20} />
          <span className={`font-bold ${isSpanishMode ? 'text-emerald-700' : 'text-purple-700'}`}>{title}</span>
          {isSpanishMode && <span className="text-sm">🇪🇸</span>}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isSpanishMode ? (
            subtitle
          ) : (
            <>Find all the <span className="text-purple-600">{wordFamily}</span> words!</>
          )}
        </h2>
        <p className="text-gray-600">{instruction}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <TapToHear 
            text={isSpanishMode 
              ? `Encuentra todas las palabras de vocabulario que aprendiste en la historia.`
              : `Find all the words that end with ${wordFamily}. Tap on each word that belongs to this word family.`
            }
            size="small"
          />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{isSpanishMode ? 'Encontradas' : 'Found'}: {score} / {correctWords.length}</span>
          <span>{Math.round((score / correctWords.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${isSpanishMode ? 'bg-gradient-to-r from-emerald-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
            style={{ width: `${(score / correctWords.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Word Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {allWords.map((word, index) => {
          const wordFeedback = feedback[word];
          const spanishInfo = spanishWordMap[word];
          
          return (
            <button
              key={`${word}-${index}`}
              onClick={() => handleWordClick(word)}
              disabled={!!wordFeedback || isComplete}
              className={`
                relative p-4 rounded-2xl font-bold text-lg transition-all duration-300
                ${!wordFeedback 
                  ? `bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 hover:scale-105 shadow-md hover:shadow-lg cursor-pointer ${isSpanishMode ? 'hover:from-emerald-50 hover:to-blue-50' : 'hover:from-purple-50 hover:to-pink-50'}`
                  : wordFeedback === 'correct'
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border-2 border-green-300'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 text-red-400 border-2 border-red-200 opacity-60'
                }
              `}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="flex items-center gap-2">
                  {word}
                  {wordFeedback === 'correct' && <CheckCircleIcon className="text-green-500" size={20} />}
                  {wordFeedback === 'incorrect' && <XCircleIcon className="text-red-400" size={20} />}
                </span>
                {/* Show English translation hint for Spanish words when revealed */}
                {isSpanishMode && spanishInfo && wordFeedback === 'correct' && (
                  <span className="text-xs text-green-600 font-normal">({spanishInfo.english})</span>
                )}
                {/* Show type badge for Spanish mode */}
                {isSpanishMode && spanishInfo && !wordFeedback && (
                  <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${spanishInfo.type === 'verb' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {spanishInfo.type === 'verb' ? 'verbo' : 'nombre'}
                  </span>
                )}
              </span>
              {!wordFeedback && (
                <div className="absolute -top-1 -right-1">
                  <TapToHear text={word} size="small" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="text-center animate-bounce">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${isSpanishMode ? 'bg-gradient-to-r from-emerald-100 to-blue-100' : 'bg-gradient-to-r from-green-100 to-emerald-100'}`}>
            <CheckCircleIcon className="text-green-500" size={24} />
            <span className="font-bold text-green-700 text-lg">{completionMsg}</span>
          </div>
        </div>
      )}

      {/* Hint */}
      {!isComplete && score === 0 && (
        <div className="text-center text-gray-500 text-sm">{hintMsg}</div>
      )}
    </div>
  );
};
