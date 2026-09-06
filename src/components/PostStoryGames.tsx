import React, { useState, useMemo } from 'react';
import { Mystery } from '../types';
import { GameResult } from '../types/games';
import { generateGameData } from '../data/gamesData';
import { getSpanishLearningData } from '../data/spanishLearningData';
import { WordFamilyMatch } from './games/WordFamilyMatch';
import { VerbConjugationGame } from './games/VerbConjugationGame';
import { SentenceBuilder } from './games/SentenceBuilder';
import { ChooseRightWord } from './games/ChooseRightWord';
import { StorySequencing } from './games/StorySequencing';
import { ComprehensionQuiz } from './games/ComprehensionQuiz';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { TapToHear } from './TapToHear';
import { 
  SparklesIcon, 
  StarIcon, 
  ChevronRightIcon,
  HomeIcon,
  GamepadIcon,
  CheckCircleIcon,
  CoinIcon
} from './icons/Icons';

interface PostStoryGamesProps {
  mystery: Mystery;
  onComplete: () => void;
  onExit: () => void;
}

type GameStep = 'intro' | 'word-family-match' | 'verb-conjugation' | 'sentence-builder' | 'choose-right-word' | 'story-sequencing' | 'comprehension-quiz' | 'results';

// English mode: Word Family Match is first game
const ENGLISH_GAME_SEQUENCE: GameStep[] = [
  'intro',
  'word-family-match',
  'story-sequencing',
  'choose-right-word',
  'comprehension-quiz',
  'results'
];

// Spanish mode: Verb Conjugation Game replaces Word Family Match
const SPANISH_GAME_SEQUENCE: GameStep[] = [
  'intro',
  'verb-conjugation',
  'story-sequencing',
  'choose-right-word',
  'comprehension-quiz',
  'results'
];

export const PostStoryGames: React.FC<PostStoryGamesProps> = ({
  mystery,
  onComplete,
  onExit,
}) => {
  const { addCoins, addGameScore } = useGame();
  const { isSpanish, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<GameStep>('intro');
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [gameData] = useState(() => 
    generateGameData(mystery.id, mystery.wordFamily, mystery.words, mystery.story, mystery.scenes)
  );

  // Get Spanish learning data for vocabulary match game
  const spanishData = isSpanish ? getSpanishLearningData(mystery.id) : null;

  // Choose the right game sequence based on language
  const GAME_SEQUENCE = useMemo(() => {
    return isSpanish ? SPANISH_GAME_SEQUENCE : ENGLISH_GAME_SEQUENCE;
  }, [isSpanish]);

  const GAME_NAMES: Record<GameStep, string> = {
    'intro': isSpanish ? '¡Prepárate!' : 'Get Ready!',
    'word-family-match': isSpanish ? 'Vocabulario Match' : 'Word Family Match',
    'verb-conjugation': 'Conjugación de Verbos',
    'sentence-builder': isSpanish ? 'Constructor de Oraciones' : 'Sentence Builder',
    'choose-right-word': isSpanish ? 'Elige la Palabra Correcta' : 'Choose the Right Word',
    'story-sequencing': isSpanish ? 'Orden de la Historia' : 'Story Sequencing',
    'comprehension-quiz': isSpanish ? 'Quiz de Lectura' : 'Reading Quiz',
    'results': isSpanish ? 'Tus Resultados' : 'Your Results'
  };

  const currentStepIndex = GAME_SEQUENCE.indexOf(currentStep);
  const totalGames = GAME_SEQUENCE.length - 2;

  const handleGameComplete = (gameType: string, score: number, maxScore: number) => {
    setGameResults(prev => [...prev, { gameType, score, maxScore, completed: true }]);
    addGameScore({
      mysteryId: mystery.id,
      gameType: gameType as 'comprehension' | 'word-family' | 'sentence-builder' | 'story-sequencing' | 'choose-right-word' | 'verb-conjugation',

      score,
      maxScore
    });

    // Award bonus coins for perfect verb conjugation score
    if (gameType === 'verb-conjugation' && score === maxScore) {
      addCoins(10);
    }

    setTimeout(() => {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < GAME_SEQUENCE.length) {
        setCurrentStep(GAME_SEQUENCE[nextIndex]);
      }
    }, 1000);
  };

  const handleSkipToResults = () => setCurrentStep('results');

  const calculateTotalScore = () => gameResults.reduce((total, result) => total + result.score, 0);
  const calculateMaxScore = () => gameResults.reduce((total, result) => total + result.maxScore, 0);
  const calculateStars = () => {
    const percentage = calculateMaxScore() > 0 ? (calculateTotalScore() / calculateMaxScore()) * 100 : 0;
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  const handleFinish = () => {
    const bonusCoins = calculateStars() * 5;
    if (bonusCoins > 0) addCoins(bonusCoins);
    onComplete();
  };

  // Intro Screen
  if (currentStep === 'intro') {
    const introLabel = isSpanish && spanishData
      ? `Vocabulario y Verbos`
      : `${mystery.wordFamily} word family`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
          <div className="mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isSpanish ? 'bg-gradient-to-br from-emerald-500 to-blue-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
              <GamepadIcon className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isSpanish ? '¡Gran Trabajo Leyendo!' : 'Great Job Reading!'}
            </h1>
            <p className="text-gray-600 text-lg">
              {isSpanish ? '¡Ahora juguemos para practicar lo que aprendiste!' : "Now let's play some games to practice what you learned!"}
            </p>
          </div>

          <div className={`rounded-2xl p-4 mb-6 ${isSpanish ? 'bg-gradient-to-r from-emerald-50 to-blue-50' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <TapToHear 
                text={isSpanish 
                  ? `¡Gran trabajo leyendo ${mystery.title}! Ahora juguemos para practicar la conjugación de verbos en español.`
                  : `Great job reading ${mystery.title}! Now let's play some fun games to practice the ${mystery.wordFamily} word family.`
                }
                size="small"
              />
              <span className="text-sm text-gray-500">{isSpanish ? 'Escuchar' : 'Listen'}</span>
            </div>
            <p className={`font-semibold ${isSpanish ? 'text-emerald-700' : 'text-purple-700'}`}>
              {isSpanish ? (
                <>Practica <span className="text-blue-600">{introLabel}</span></>
              ) : (
                <>Practice the <span className="text-pink-600">{mystery.wordFamily}</span> word family</>
              )}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <p className="text-gray-500 text-sm font-medium">
              {isSpanish ? 'Juegos que jugarás:' : "Games you'll play:"}
            </p>
            {GAME_SEQUENCE.slice(1, -1).map((game, index) => (
              <div key={game} className={`flex items-center gap-3 rounded-xl p-3 ${
                game === 'verb-conjugation' 
                  ? 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200' 
                  : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  game === 'verb-conjugation'
                    ? 'bg-gradient-to-br from-emerald-500 to-blue-500 text-white'
                    : isSpanish ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium text-gray-700 flex-1 text-left">{GAME_NAMES[game]}</span>
                {game === 'verb-conjugation' && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={onExit} className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              {isSpanish ? 'Quizás Después' : 'Maybe Later'}
            </button>
            <button
              onClick={() => setCurrentStep(GAME_SEQUENCE[1])}
              className={`flex-1 px-6 py-3 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${isSpanish ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'}`}
            >
              {isSpanish ? '¡A Jugar!' : "Let's Play!"}
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentStep === 'results') {
    const totalScore = calculateTotalScore();
    const maxScore = calculateMaxScore();
    const stars = calculateStars();
    const bonusCoins = stars * 5;

    // Check if verb conjugation had a perfect score for extra bonus display
    const verbConjResult = gameResults.find(r => r.gameType === 'verb-conjugation');
    const hadPerfectConjugation = verbConjResult && verbConjResult.score === verbConjResult.maxScore;

    const resultLabels = isSpanish
      ? { amazing: '¡Increíble!', great: '¡Gran Trabajo!', good: '¡Buen Intento!', keep: '¡Sigue Practicando!', completed: '¡Completaste todos los juegos!', total: 'Puntos Totales', bonus: 'Monedas de Bonus', performance: 'Por tu gran desempeño', back: 'Volver a Misterios' }
      : { amazing: 'Amazing!', great: 'Great Job!', good: 'Good Try!', keep: 'Keep Practicing!', completed: 'You completed all the learning games!', total: 'Total Points', bonus: 'Bonus Coins!', performance: 'For your great performance', back: 'Back to Mysteries' };

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((i) => (
                <StarIcon key={i} size={48} filled={i <= stars} className={i <= stars ? 'text-yellow-400' : 'text-gray-200'} />
              ))}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {stars === 3 ? resultLabels.amazing : stars === 2 ? resultLabels.great : stars === 1 ? resultLabels.good : resultLabels.keep}
            </h1>
            <p className="text-gray-600">{resultLabels.completed}</p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-bold text-amber-600 mb-2">{totalScore} / {maxScore}</div>
            <p className="text-amber-700">{resultLabels.total}</p>
          </div>

          {bonusCoins > 0 && (
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-4 mb-4 flex items-center justify-center gap-3">
              <CoinIcon className="text-yellow-500" size={32} />
              <div>
                <p className="font-bold text-amber-700 text-lg">+{bonusCoins} {resultLabels.bonus}</p>
                <p className="text-amber-600 text-sm">{resultLabels.performance}</p>
              </div>
            </div>
          )}

          {/* Extra bonus for perfect conjugation */}
          {hadPerfectConjugation && (
            <div className="bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl p-4 mb-4 flex items-center justify-center gap-3">
              <SparklesIcon className="text-emerald-500" size={28} />
              <div>
                <p className="font-bold text-emerald-700 text-lg">+10 Conjugation Bonus!</p>
                <p className="text-emerald-600 text-sm">Perfect verb conjugations earned extra coins</p>
              </div>
            </div>
          )}

          <div className="space-y-2 mb-6">
            {gameResults.map((result, index) => (
              <div key={index} className={`flex items-center justify-between rounded-xl p-3 ${
                result.gameType === 'verb-conjugation' 
                  ? 'bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200' 
                  : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className={result.gameType === 'verb-conjugation' ? 'text-emerald-500' : 'text-green-500'} size={20} />
                  <span className="font-medium text-gray-700">{GAME_NAMES[result.gameType as GameStep] || result.gameType}</span>
                  {result.gameType === 'verb-conjugation' && result.score === result.maxScore && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">PERFECT</span>
                  )}
                </div>
                <span className={`font-bold ${result.gameType === 'verb-conjugation' ? 'text-emerald-600' : 'text-purple-600'}`}>
                  {result.score}/{result.maxScore}
                </span>
              </div>
            ))}
          </div>

          <button onClick={handleFinish} className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <HomeIcon size={24} />
            {resultLabels.back}
          </button>
        </div>
      </div>
    );
  }

  // Game Screens
  return (
    <div className={`min-h-screen ${isSpanish ? 'bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50'}`}>
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onExit} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-semibold">
            <HomeIcon size={24} />
            <span className="hidden sm:inline">{t('reading.exit')}</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {isSpanish ? 'Juego' : 'Game'} {currentStepIndex} {t('reading.of')} {totalGames}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  isSpanish 
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`} 
                style={{ width: `${(currentStepIndex / totalGames) * 100}%` }} 
              />
            </div>
          </div>
          <button onClick={handleSkipToResults} className="text-gray-500 hover:text-purple-600 transition-colors text-sm font-medium">
            {isSpanish ? 'Ir a Resultados' : 'Skip to Results'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Verb Conjugation Game - Spanish mode only */}
        {currentStep === 'verb-conjugation' && isSpanish && spanishData && (
          <VerbConjugationGame
            verbs={spanishData.verbos}
            onComplete={(score, maxScore) => handleGameComplete('verb-conjugation', score, maxScore)}
          />
        )}

        {/* Word Family Match - English mode only */}
        {currentStep === 'word-family-match' && (
          <WordFamilyMatch
            wordFamily={mystery.wordFamily}
            correctWords={gameData.wordFamilyMatch.correctWords}
            distractorWords={gameData.wordFamilyMatch.distractorWords}
            onComplete={(score, maxScore) => handleGameComplete('word-family', score, maxScore)}
          />
        )}

        {currentStep === 'sentence-builder' && gameData.sentenceBuilder[0] && (
          <SentenceBuilder
            originalSentence={gameData.sentenceBuilder[0].originalSentence}
            onComplete={(score, maxScore) => handleGameComplete('sentence-builder', score, maxScore)}
          />
        )}

        {currentStep === 'choose-right-word' && (
          <ChooseRightWord
            questions={gameData.chooseRightWord}
            onComplete={(score, maxScore) => handleGameComplete('choose-right-word', score, maxScore)}
          />
        )}

        {currentStep === 'story-sequencing' && (
          <StorySequencing
            events={gameData.storySequencing.events}
            onComplete={(score, maxScore) => handleGameComplete('story-sequencing', score, maxScore)}
          />
        )}

        {currentStep === 'comprehension-quiz' && (
          <ComprehensionQuiz
            questions={gameData.comprehensionQuiz}
            onComplete={(score, maxScore) => handleGameComplete('comprehension', score, maxScore)}
          />
        )}
      </main>
    </div>
  );
};
