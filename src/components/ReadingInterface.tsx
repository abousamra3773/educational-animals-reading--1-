import React, { useState } from 'react';
import { Mystery } from '../types';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { getSpanishLearningData } from '../data/spanishLearningData';
import { TapToHearSentence, WordChoiceWithMic, TapToHear } from './TapToHear';
import { VocabularyIntro } from './VocabularyIntro';
import { PostStoryGames } from './PostStoryGames';
import { StorySceneInterface } from './StorySceneInterface';
import { VoiceRecorder } from './VoiceRecorder';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  HomeIcon, 
  StarIcon,
  SparklesIcon,
  MicrophoneIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from './icons/Icons';

interface ReadingInterfaceProps {
  mystery: Mystery;
  onComplete: () => void;
  onExit: () => void;
}

type ReadingPhase = 'vocabulary' | 'story' | 'games' | 'celebration';

export const ReadingInterface: React.FC<ReadingInterfaceProps> = ({ 
  mystery, 
  onComplete, 
  onExit 
}) => {
  const { accessibility, completeMystery, playerState } = useGame();
  const { isSpanish, t } = useLanguage();
  const [phase, setPhase] = useState<ReadingPhase>('vocabulary');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [recordingSaved, setRecordingSaved] = useState(false);

  const avatarName = playerState.avatar?.name || 'Detective';
  const hasScenes = mystery.scenes && mystery.scenes.length > 0;
  const currentPage = mystery.story[currentPageIndex];
  const isLastPage = currentPageIndex === mystery.story.length - 1;
  const isFirstPage = currentPageIndex === 0;

  // Get Spanish learning data for vocabulary display
  const spanishData = isSpanish ? getSpanishLearningData(mystery.id) : null;

  const textSizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl'
  };

  const handleRecordingSaved = () => {
    setRecordingSaved(true);
    setTimeout(() => setRecordingSaved(false), 3000);
  };

  const handleWordSelect = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^a-záéíóúñü]/g, '');
    if (!selectedWords.includes(cleanWord)) {
      setSelectedWords([...selectedWords, cleanWord]);
    }
  };

  const handleNext = () => {
    if (isLastPage) {
      setShowCelebration(true);
      completeMystery(mystery.id, 3);
      setTimeout(() => {
        setShowCelebration(false);
        setPhase('games');
      }, 3000);
    } else {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstPage) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleStartStory = () => {
    setPhase('story');
  };

  const handleSceneComplete = () => {
    setShowCelebration(true);
    completeMystery(mystery.id, 3);
    setTimeout(() => {
      setShowCelebration(false);
      setPhase('games');
    }, 3000);
  };

  const handleGamesComplete = () => {
    onComplete();
  };

  const handleSkipGames = () => {
    onComplete();
  };

  // Show vocabulary intro first
  if (phase === 'vocabulary') {
    return (
      <VocabularyIntro 
        mystery={mystery} 
        onContinue={handleStartStory}
      />
    );
  }

  // Show post-story games
  if (phase === 'games') {
    return (
      <PostStoryGames
        mystery={mystery}
        onComplete={handleGamesComplete}
        onExit={handleSkipGames}
      />
    );
  }

  // Show celebration
  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center z-50">
        <div className="text-center animate-bounce">
          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <StarIcon 
                key={i} 
                size={64} 
                filled 
                className="text-yellow-300 animate-pulse" 
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {t('celebration.mysterySolved')}
          </h1>
          <p className="text-2xl text-white/90">
            {t('celebration.greatWork')} {avatarName}!
          </p>
          <p className="text-xl text-white/80 mt-2">
            {t('celebration.coinsEarned')}
          </p>
          <p className="text-lg text-white/70 mt-4">
            {t('celebration.playGames')}
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <SparklesIcon className="text-yellow-200 animate-spin" size={32} />
            <SparklesIcon className="text-yellow-200 animate-spin" size={32} style={{ animationDelay: '0.5s' }} />
            <SparklesIcon className="text-yellow-200 animate-spin" size={32} style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    );
  }

  // Use scene-based interface for mysteries with scenes
  if (phase === 'story' && hasScenes) {
    return (
      <StorySceneInterface
        mystery={mystery}
        onComplete={handleSceneComplete}
        onExit={onExit}
      />
    );
  }

  // Determine what words to show in the sidebar
  const displayWords = isSpanish && spanishData ? spanishData.allWords : mystery.words;
  const wordFamilyLabel = isSpanish && spanishData 
    ? t('words.vocabAndVerbs')
    : `${mystery.wordFamily} ${t('words.family')}`;

  // Original page-based story interface for mysteries without scenes
  return (
    <div className={`min-h-screen ${accessibility.highContrast ? 'bg-white' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-semibold"
          >
            <HomeIcon size={24} />
            <span className="hidden sm:inline">{t('reading.exit')}</span>
          </button>

          <div className="flex items-center gap-3">
            <img src={mystery.detective.image} alt={mystery.detective.name} className="w-10 h-10 rounded-full border-2 border-purple-200" />
            <div>
              <h1 className="font-bold text-gray-800">{mystery.title}</h1>
              <p className="text-sm text-gray-500">{t('mystery.with')} {mystery.detective.name}</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${isSpanish ? 'bg-emerald-100' : 'bg-purple-100'} px-4 py-2 rounded-full`}>
            {isSpanish && <span className="text-sm">🇪🇸</span>}
            <span className={`font-bold ${isSpanish ? 'text-emerald-700 text-sm' : 'text-purple-700'}`}>
              {isSpanish ? t('words.vocabAndVerbs') : mystery.wordFamily}
            </span>
            {!isSpanish && (
              <TapToHear 
                text={`The ${mystery.wordFamily} word family`} 
                size="small" 
                highlightOnPlay={false}
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {mystery.story.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentPageIndex ? 'bg-purple-500 scale-125' : index < currentPageIndex ? 'bg-green-400' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {/* Story Card */}
        <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 border-4 ${accessibility.highContrast ? 'border-black' : 'border-purple-100'}`}>
          <div className="text-center mb-6">
            <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold">
              {t('reading.page')} {currentPageIndex + 1} {t('reading.of')} {mystery.story.length}
            </span>
          </div>

          <TapToHearSentence
            text={currentPage.text}
            className="mb-8"
            textClassName={`${textSizeClasses[accessibility.textSize]} ${accessibility.highContrast ? 'text-black' : 'text-gray-800'} leading-relaxed font-medium`}
            showWordMics={false}
            speaker="narrator"
          />

          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500">
            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('interactive.tapSentence')}</span>
          </div>

          {currentPage.clue && (
            <div className={`bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-5 ${accessibility.highContrast ? 'bg-yellow-100 border-black' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="bg-amber-400 p-2 rounded-full flex-shrink-0">
                  <SparklesIcon className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-amber-700">{t('reading.detectiveClue')}</p>
                    <TapToHear text={currentPage.clue} size="small" highlightOnPlay={false} />
                  </div>
                  <p className={`text-amber-800 ${accessibility.textSize === 'xlarge' ? 'text-xl' : 'text-lg'}`}>
                    {currentPage.clue}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voice Recording Section */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <button
            onClick={() => setShowRecorder(!showRecorder)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${showRecorder ? 'bg-red-500' : 'bg-red-100'}`}>
                <MicrophoneIcon size={20} className={showRecorder ? 'text-white' : 'text-red-500'} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">{t('reading.recordReading')}</h3>
                <p className="text-sm text-gray-500">{t('reading.practiceReading')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {recordingSaved && (
                <span className="text-green-600 text-sm font-semibold animate-pulse">{t('reading.recordingSaved')}</span>
              )}
              {showRecorder ? <ChevronUpIcon size={24} className="text-gray-400" /> : <ChevronDownIcon size={24} className="text-gray-400" />}
            </div>
          </button>
          {showRecorder && (
            <div className="p-4 pt-0">
              <VoiceRecorder
                mysteryId={mystery.id}
                mysteryTitle={mystery.title}
                pageNumber={currentPageIndex + 1}
                pageText={currentPage.text}
                childName={avatarName}
                onRecordingSaved={handleRecordingSaved}
              />
            </div>
          )}
        </div>

        {/* Word Practice Section - adapts for Spanish */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {isSpanish && spanishData ? (
            // Spanish mode: Show vocabulary and verbs
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <h3 className="font-bold text-gray-700 text-center">
                  {t('words.vocabAndVerbs')}:
                </h3>
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                {t('words.tapEachWord')}
              </p>
              
              {/* Vocabulary words */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2 text-center">{t('vocab.vocabulario')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {spanishData.vocabulario.map((vocab) => (
                    <WordChoiceWithMic
                      key={vocab.spanish}
                      word={vocab.spanish}
                      isSelected={selectedWords.includes(vocab.spanish.toLowerCase())}
                      onSelect={() => handleWordSelect(vocab.spanish)}
                    />
                  ))}
                </div>
              </div>

              {/* Verbs */}
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 text-center">{t('vocab.verbos')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {spanishData.verbos.map((verb) => (
                    <WordChoiceWithMic
                      key={verb.infinitive}
                      word={verb.infinitive}
                      isSelected={selectedWords.includes(verb.infinitive.toLowerCase())}
                      onSelect={() => handleWordSelect(verb.infinitive)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            // English mode: Show word family
            <>
              <div className="flex items-center justify-center gap-3 mb-4">
                <h3 className="font-bold text-gray-700 text-center">
                  {t('words.inFamily')} {mystery.wordFamily} {t('words.family')}
                </h3>
                <TapToHear 
                  text={`These are words in the ${mystery.wordFamily} family. Tap each word to hear it.`} 
                  size="small" 
                  highlightOnPlay={false}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                {t('words.tapEachWord')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {mystery.words.map((word) => (
                  <WordChoiceWithMic
                    key={word}
                    word={word}
                    isSelected={selectedWords.includes(word)}
                    onSelect={() => handleWordSelect(word)}
                  />
                ))}
              </div>
            </>
          )}

          {selectedWords.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-green-600 font-semibold">
                {t('words.found')} {selectedWords.length} {t('words.ofWords')} {displayWords.length} {t('words.words')}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 max-w-xs mx-auto">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(selectedWords.length / displayWords.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={isFirstPage}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${isFirstPage ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl'}`}
          >
            <ChevronLeftIcon size={24} />
            {t('reading.back')}
          </button>

          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${isLastPage ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'}`}
          >
            {isLastPage ? t('reading.solveMystery') : t('reading.next')}
            <ChevronRightIcon size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};
