import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SpanishVerb, VerbConjugation, distractorConjugations } from '../../data/spanishLearningData';
import { TapToHear } from '../TapToHear';
import { 
  SparklesIcon, 
  StarIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CoinIcon,
  ChevronRightIcon
} from '../icons/Icons';

interface VerbConjugationGameProps {
  verbs: SpanishVerb[];
  onComplete: (score: number, maxScore: number) => void;
}

type SubjectKey = 'yo' | 'tu' | 'el';

interface RoundData {
  verb: SpanishVerb;
  targetSubject: SubjectKey;
  subjectLabel: string;
  subjectEmoji: string;
  correctAnswer: string;
  options: string[];
}

const SUBJECT_INFO: Record<SubjectKey, { label: string; emoji: string; description: string }> = {
  yo: { label: 'yo', emoji: '🙋', description: 'I' },
  tu: { label: 'tú', emoji: '🫵', description: 'you' },
  el: { label: 'él / ella', emoji: '👤', description: 'he / she' },
};

const NUM_ROUNDS = 3;
const POINTS_PER_ROUND = 3; // 3 subjects per round
const MAX_SCORE = NUM_ROUNDS * POINTS_PER_ROUND;

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateDistractors(
  correctForm: string,
  subject: SubjectKey,
  currentVerbInfinitive: string
): string[] {
  const distractors: string[] = [];
  const distractorKeys = Object.keys(distractorConjugations).filter(
    k => k !== currentVerbInfinitive
  );
  
  const shuffledKeys = shuffleArray(distractorKeys);
  
  for (const key of shuffledKeys) {
    const conj = distractorConjugations[key];
    const form = conj[subject];
    if (form && form !== correctForm && !distractors.includes(form)) {
      distractors.push(form);
    }
    if (distractors.length >= 2) break;
  }
  
  // If we still need more distractors, generate plausible-looking ones
  while (distractors.length < 2) {
    const suffixes = subject === 'yo' ? ['o', 'oy'] : subject === 'tu' ? ['as', 'es', 'is'] : ['a', 'e', 'en'];
    const suffix = suffixes[distractors.length % suffixes.length];
    const stem = correctForm.slice(0, Math.max(2, correctForm.length - 2));
    const fake = stem + suffix;
    if (fake !== correctForm && !distractors.includes(fake)) {
      distractors.push(fake);
    } else {
      distractors.push(correctForm + 'n');
    }
  }
  
  return distractors;
}

export const VerbConjugationGame: React.FC<VerbConjugationGameProps> = ({
  verbs,
  onComplete,
}) => {
  // Pick 3 random verbs for the 3 rounds
  const gameVerbs = useMemo(() => {
    const shuffled = shuffleArray(verbs);
    return shuffled.slice(0, NUM_ROUNDS);
  }, [verbs]);

  const [currentRound, setCurrentRound] = useState(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [answeredSubjects, setAnsweredSubjects] = useState<Record<SubjectKey, boolean | null>>({
    yo: null, tu: null, el: null
  });
  const [animateIn, setAnimateIn] = useState(true);

  const subjects: SubjectKey[] = ['yo', 'tu', 'el'];
  const currentSubject = subjects[currentSubjectIndex];
  const currentVerb = gameVerbs[currentRound];

  // Generate options for the current subject
  const currentOptions = useMemo(() => {
    if (!currentVerb) return [];
    const correct = currentVerb.conjugations[currentSubject];
    const distractors = generateDistractors(correct, currentSubject, currentVerb.infinitive);
    return shuffleArray([correct, ...distractors]);
  }, [currentVerb, currentSubject]);

  // Trigger entrance animation
  useEffect(() => {
    setAnimateIn(true);
    const timer = setTimeout(() => setAnimateIn(false), 400);
    return () => clearTimeout(timer);
  }, [currentRound, currentSubjectIndex]);

  const handleSelectAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return; // Already answered
    
    const correct = currentVerb.conjugations[currentSubject];
    const wasCorrect = answer === correct;
    
    setSelectedAnswer(answer);
    setIsCorrect(wasCorrect);
    
    if (wasCorrect) {
      setScore(prev => prev + 1);
      setRoundScore(prev => prev + 1);
    }
    
    setAnsweredSubjects(prev => ({
      ...prev,
      [currentSubject]: wasCorrect
    }));

    // Auto-advance after a delay
    setTimeout(() => {
      if (currentSubjectIndex < 2) {
        // Move to next subject
        setCurrentSubjectIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Round complete - show summary
        setShowRoundSummary(true);
      }
    }, 1200);
  }, [selectedAnswer, currentVerb, currentSubject, currentSubjectIndex]);

  const handleNextRound = useCallback(() => {
    if (currentRound < NUM_ROUNDS - 1) {
      setCurrentRound(prev => prev + 1);
      setCurrentSubjectIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowRoundSummary(false);
      setRoundScore(0);
      setAnsweredSubjects({ yo: null, tu: null, el: null });
    } else {
      // Game complete
      setIsGameComplete(true);
      setTimeout(() => {
        onComplete(score, MAX_SCORE);
      }, 2500);
    }
  }, [currentRound, score, onComplete]);

  if (!currentVerb) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <p className="text-gray-500">No hay verbos disponibles para este misterio.</p>
      </div>
    );
  }

  // Game Complete Screen
  if (isGameComplete) {
    const isPerfect = score === MAX_SCORE;
    const percentage = Math.round((score / MAX_SCORE) * 100);
    const bonusCoins = isPerfect ? 10 : 0;
    
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
        <div className="text-center">
          {/* Celebration header */}
          <div className="mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isPerfect 
                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 animate-bounce' 
                : 'bg-gradient-to-br from-emerald-400 to-blue-500'
            }`}>
              <SparklesIcon className="text-white" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isPerfect ? '¡Perfecto!' : percentage >= 70 ? '¡Muy Bien!' : '¡Buen Intento!'}
            </h2>
            <p className="text-gray-600 text-lg">
              {isPerfect 
                ? 'You conjugated every verb perfectly!' 
                : `You got ${score} out of ${MAX_SCORE} conjugations right!`
              }
            </p>
          </div>

          {/* Score display */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 mb-6">
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3].map(i => (
                <StarIcon 
                  key={i} 
                  size={36} 
                  filled={i <= Math.ceil((score / MAX_SCORE) * 3)} 
                  className={i <= Math.ceil((score / MAX_SCORE) * 3) ? 'text-yellow-400' : 'text-gray-200'} 
                />
              ))}
            </div>
            <div className="text-4xl font-bold text-emerald-600 mb-1">{score} / {MAX_SCORE}</div>
            <p className="text-emerald-700 text-sm">Conjugaciones Correctas</p>
          </div>

          {/* Bonus coins for perfect score */}
          {isPerfect && (
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-4 mb-6 flex items-center justify-center gap-3 animate-pulse">
              <CoinIcon className="text-yellow-500" size={32} />
              <div>
                <p className="font-bold text-amber-700 text-lg">+{bonusCoins} Bonus Coins!</p>
                <p className="text-amber-600 text-sm">Perfect conjugation bonus</p>
              </div>
            </div>
          )}

          {/* Verbs practiced */}
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-500 font-medium">Verbos practicados:</p>
            {gameVerbs.map((verb, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-700">{verb.infinitive}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-600 italic">{verb.english}</span>
                </div>
                <TapToHear text={verb.infinitive} size="small" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Round Summary Screen
  if (showRoundSummary) {
    const isPerfectRound = roundScore === 3;
    
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
            isPerfectRound ? 'bg-yellow-100' : 'bg-emerald-100'
          }`}>
            {isPerfectRound ? (
              <StarIcon className="text-yellow-500" size={20} filled />
            ) : (
              <CheckCircleIcon className="text-emerald-500" size={20} />
            )}
            <span className={`font-bold ${isPerfectRound ? 'text-yellow-700' : 'text-emerald-700'}`}>
              {isPerfectRound ? '¡Ronda Perfecta!' : '¡Ronda Completa!'}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {currentVerb.infinitive}
          </h3>
          <p className="text-gray-500 italic mb-4">{currentVerb.english}</p>
        </div>

        {/* Conjugation table review */}
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-5 mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">
            Conjugation Review
          </h4>
          <div className="space-y-3">
            {subjects.map((subj) => {
              const wasCorrect = answeredSubjects[subj];
              const info = SUBJECT_INFO[subj];
              const conjugatedForm = currentVerb.conjugations[subj];
              
              return (
                <div 
                  key={subj}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    wasCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{info.emoji}</span>
                    <div>
                      <span className="font-bold text-gray-800">{info.label}</span>
                      <span className="text-gray-400 text-sm ml-1">({info.description})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${wasCorrect ? 'text-green-700' : 'text-red-600'}`}>
                      {conjugatedForm}
                    </span>
                    <TapToHear text={`${info.label} ${conjugatedForm}`} size="small" />
                    {wasCorrect ? (
                      <CheckCircleIcon className="text-green-500" size={20} />
                    ) : (
                      <XCircleIcon className="text-red-400" size={20} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Example sentence */}
        {currentVerb.example && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <TapToHear text={currentVerb.example} size="small" />
            <p className="text-blue-800 italic text-sm flex-1">
              "{currentVerb.example}"
            </p>
          </div>
        )}

        {/* Score and next button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Ronda {currentRound + 1} de {NUM_ROUNDS} — Puntos: {score}/{(currentRound + 1) * 3}
          </div>
          <button
            onClick={handleNextRound}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {currentRound < NUM_ROUNDS - 1 ? 'Siguiente Verbo' : 'Ver Resultados'}
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Main Game Screen - Conjugation Challenge
  const subjectInfo = SUBJECT_INFO[currentSubject];
  const correctAnswer = currentVerb.conjugations[currentSubject];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-4">
          <SparklesIcon className="text-emerald-500" size={20} />
          <span className="font-bold text-emerald-700">Conjugación de Verbos</span>
          <span className="text-sm ml-1">🇪🇸</span>
        </div>
        
        {/* Round indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {Array.from({ length: NUM_ROUNDS }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < currentRound 
                  ? 'bg-emerald-500' 
                  : i === currentRound 
                    ? 'bg-emerald-500 ring-4 ring-emerald-200 scale-125' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            Ronda {currentRound + 1}/{NUM_ROUNDS}
          </span>
        </div>
      </div>

      {/* Verb Card */}
      <div className={`bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-6 text-white text-center transition-all duration-300 ${
        animateIn ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
      }`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <TapToHear 
            text={currentVerb.infinitive} 
            size="medium"
            className="!bg-white/20 !text-white hover:!bg-white/30"
          />
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {currentVerb.infinitive}
          </h2>
        </div>
        <p className="text-white/80 text-lg italic">
          {currentVerb.english}
        </p>
        {currentVerb.example && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <TapToHear 
              text={currentVerb.example} 
              size="small"
              className="!bg-white/15 !text-white/80 hover:!bg-white/25"
            />
            <p className="text-white/60 text-sm italic">
              "{currentVerb.example}"
            </p>
          </div>
        )}
      </div>

      {/* Subject Progress Dots */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {subjects.map((subj, i) => {
          const info = SUBJECT_INFO[subj];
          const answered = answeredSubjects[subj];
          const isCurrent = i === currentSubjectIndex;
          
          return (
            <div 
              key={subj}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isCurrent 
                  ? 'bg-emerald-100 border-2 border-emerald-400 scale-110 shadow-md' 
                  : answered === true 
                    ? 'bg-green-100 border-2 border-green-300'
                    : answered === false
                      ? 'bg-red-50 border-2 border-red-200'
                      : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <span className="text-lg">{info.emoji}</span>
              <span className={`font-semibold text-sm ${
                isCurrent ? 'text-emerald-700' : answered === true ? 'text-green-700' : answered === false ? 'text-red-500' : 'text-gray-400'
              }`}>
                {info.label}
              </span>
              {answered === true && <CheckCircleIcon className="text-green-500" size={16} />}
              {answered === false && <XCircleIcon className="text-red-400" size={16} />}
            </div>
          );
        })}
      </div>

      {/* Question */}
      <div className="text-center mb-6">
        <p className="text-gray-600 text-lg">
          How do you say <span className="font-bold text-purple-600">"{currentVerb.english}"</span> for:
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-3xl">{subjectInfo.emoji}</span>
          <span className="text-2xl font-bold text-gray-800">{subjectInfo.label}</span>
          <span className="text-gray-400">({subjectInfo.description})</span>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {currentOptions.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === correctAnswer;
          const showResult = selectedAnswer !== null;
          
          let buttonStyle = '';
          if (showResult) {
            if (isCorrectOption) {
              buttonStyle = 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400 text-green-800 scale-105 shadow-lg';
            } else if (isSelected && !isCorrectOption) {
              buttonStyle = 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 text-red-600 opacity-70';
            } else {
              buttonStyle = 'bg-gray-50 border-2 border-gray-200 text-gray-400 opacity-50';
            }
          } else {
            buttonStyle = 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 text-gray-800 hover:border-emerald-400 hover:from-emerald-50 hover:to-blue-50 hover:scale-105 hover:shadow-lg cursor-pointer';
          }
          
          return (
            <button
              key={`${option}-${index}`}
              onClick={() => handleSelectAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                relative p-5 rounded-2xl font-bold text-xl transition-all duration-300
                ${buttonStyle}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-400 font-normal">
                  {subjectInfo.label}
                </span>
                <span>{option}</span>
                
                {/* Audio button */}
                {!showResult && (
                  <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                    <TapToHear text={`${subjectInfo.label} ${option}`} size="small" />
                  </div>
                )}
                
                {/* Result icons */}
                {showResult && isCorrectOption && (
                  <CheckCircleIcon className="text-green-500" size={24} />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <XCircleIcon className="text-red-400" size={24} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback message */}
      {selectedAnswer !== null && (
        <div className={`text-center p-4 rounded-2xl transition-all duration-300 ${
          isCorrect 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100' 
            : 'bg-gradient-to-r from-red-50 to-rose-50'
        }`}>
          <div className="flex items-center justify-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircleIcon className="text-green-500" size={24} />
                <span className="font-bold text-green-700 text-lg">
                  ¡Correcto! {subjectInfo.label} {correctAnswer}
                </span>
              </>
            ) : (
              <>
                <XCircleIcon className="text-red-400" size={24} />
                <span className="font-bold text-red-600 text-lg">
                  La respuesta es: {subjectInfo.label} {correctAnswer}
                </span>
              </>
            )}
            <TapToHear text={`${subjectInfo.label} ${correctAnswer}`} size="small" />
          </div>
        </div>
      )}

      {/* Score tracker */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <span>Puntos esta ronda: {roundScore}/3</span>
        <span>Total: {score}/{MAX_SCORE}</span>
      </div>
    </div>
  );
};
