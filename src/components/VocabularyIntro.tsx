import React, { useState, useCallback } from 'react';
import { Mystery } from '../types';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { getSpanishLearningData, SpanishVocabWord, SpanishVerb } from '../data/spanishLearningData';
import { BookIcon, ChevronRightIcon, SparklesIcon } from './icons/Icons';

interface VocabularyIntroProps {
  mystery: Mystery;
  onContinue: () => void;
}

// English word family card
interface WordCardProps {
  word: string;
  wordFamily: string;
  audioSpeed: number;
  index: number;
  onPlayed: (word: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, wordFamily, audioSpeed, index, onPlayed }) => {
  const { speak, isPlaying, isLoading } = useTextToSpeech();
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handlePlayWord = useCallback(async () => {
    if (isPlaying || isLoading) return;
    setIsHighlighted(true);
    onPlayed(word);
    await speak(word, { speed: audioSpeed, speaker: 'narrator' });
    setTimeout(() => setIsHighlighted(false), 500);
  }, [word, audioSpeed, isPlaying, isLoading, speak, onPlayed]);

  const familyPart = wordFamily.replace('-', '');
  const wordStart = word.slice(0, word.length - familyPart.length);
  const wordEnd = word.slice(word.length - familyPart.length);
  const isActive = isHighlighted || isPlaying;

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 transform ${isActive ? 'scale-110 z-10' : 'hover:scale-105'}`}
      onClick={handlePlayWord}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-200 ${isActive ? 'border-teal-400 bg-teal-50 shadow-teal-200 shadow-xl' : 'border-purple-100 hover:border-purple-300 hover:shadow-xl'}`}>
        <div className="text-center mb-3">
          <span className={`text-3xl md:text-4xl font-bold transition-colors duration-200 ${isActive ? 'text-teal-600' : 'text-gray-700'}`}>{wordStart}</span>
          <span className={`text-3xl md:text-4xl font-bold transition-colors duration-200 ${isActive ? 'text-teal-500' : 'text-purple-500'}`}>{wordEnd}</span>
        </div>
        <div className="flex justify-center">
          <button className={`p-3 rounded-full transition-all duration-200 ${isPlaying ? 'bg-teal-500 text-white animate-pulse' : isLoading ? 'bg-teal-300 text-white' : 'bg-teal-100 text-teal-600 hover:bg-teal-200'}`} aria-label={`Listen to ${word}`} disabled={isLoading}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              )}
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Tap to hear</p>
      </div>
      {isActive && (
        <div className="absolute -top-2 -right-2">
          <SparklesIcon className="text-yellow-400 animate-spin" size={24} />
        </div>
      )}
    </div>
  );
};

// Spanish vocabulary card - shows Spanish word with English translation
interface SpanishVocabCardProps {
  vocab: SpanishVocabWord;
  audioSpeed: number;
  index: number;
  onPlayed: (word: string) => void;
}

const SpanishVocabCard: React.FC<SpanishVocabCardProps> = ({ vocab, audioSpeed, index, onPlayed }) => {
  const { speak, isPlaying, isLoading } = useTextToSpeech();
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handlePlay = useCallback(async () => {
    if (isPlaying || isLoading) return;
    setIsHighlighted(true);
    onPlayed(vocab.spanish);
    // Speak the Spanish word
    await speak(vocab.spanish, { speed: audioSpeed, speaker: 'narrator' });
    setTimeout(() => setIsHighlighted(false), 500);
  }, [vocab.spanish, audioSpeed, isPlaying, isLoading, speak, onPlayed]);

  const isActive = isHighlighted || isPlaying;

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 transform ${isActive ? 'scale-105 z-10' : 'hover:scale-105'}`}
      onClick={handlePlay}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`bg-white rounded-2xl p-5 shadow-lg border-2 transition-all duration-200 ${isActive ? 'border-emerald-400 bg-emerald-50 shadow-emerald-200 shadow-xl' : 'border-emerald-100 hover:border-emerald-300 hover:shadow-xl'}`}>
        {/* Article + Spanish word */}
        <div className="text-center mb-2">
          {vocab.article && (
            <span className={`text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>{vocab.article} </span>
          )}
          <span className={`text-2xl md:text-3xl font-bold transition-colors duration-200 ${isActive ? 'text-emerald-600' : 'text-gray-800'}`}>
            {vocab.spanish}
          </span>
        </div>
        
        {/* English translation */}
        <div className="text-center mb-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{vocab.english}</span>
        </div>

        {/* Microphone */}
        <div className="flex justify-center">
          <button className={`p-2.5 rounded-full transition-all duration-200 ${isPlaying ? 'bg-emerald-500 text-white animate-pulse' : isLoading ? 'bg-emerald-300 text-white' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`} aria-label={`Listen to ${vocab.spanish}`} disabled={isLoading}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              )}
            </svg>
          </button>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-1.5">Toca para escuchar</p>
      </div>
      {isActive && (
        <div className="absolute -top-2 -right-2">
          <SparklesIcon className="text-yellow-400 animate-spin" size={24} />
        </div>
      )}
    </div>
  );
};

// Spanish verb card
interface SpanishVerbCardProps {
  verb: SpanishVerb;
  audioSpeed: number;
  index: number;
  onPlayed: (word: string) => void;
}

const SpanishVerbCard: React.FC<SpanishVerbCardProps> = ({ verb, audioSpeed, index, onPlayed }) => {
  const { speak, isPlaying, isLoading } = useTextToSpeech();
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handlePlay = useCallback(async () => {
    if (isPlaying || isLoading) return;
    setIsHighlighted(true);
    onPlayed(verb.infinitive);
    await speak(verb.infinitive, { speed: audioSpeed, speaker: 'narrator' });
    setTimeout(() => setIsHighlighted(false), 500);
  }, [verb.infinitive, audioSpeed, isPlaying, isLoading, speak, onPlayed]);

  const isActive = isHighlighted || isPlaying;

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 transform ${isActive ? 'scale-105 z-10' : 'hover:scale-105'}`}
      onClick={handlePlay}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`bg-white rounded-2xl p-5 shadow-lg border-2 transition-all duration-200 ${isActive ? 'border-blue-400 bg-blue-50 shadow-blue-200 shadow-xl' : 'border-blue-100 hover:border-blue-300 hover:shadow-xl'}`}>
        {/* Infinitive */}
        <div className="text-center mb-1">
          <span className={`text-2xl md:text-3xl font-bold transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>
            {verb.infinitive}
          </span>
        </div>
        
        {/* English translation */}
        <div className="text-center mb-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{verb.english}</span>
        </div>

        {/* Conjugation */}
        {verb.conjugation && (
          <div className="text-center mb-2">
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              él/ella {verb.conjugation}
            </span>
          </div>
        )}

        {/* Microphone */}
        <div className="flex justify-center">
          <button className={`p-2.5 rounded-full transition-all duration-200 ${isPlaying ? 'bg-blue-500 text-white animate-pulse' : isLoading ? 'bg-blue-300 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`} aria-label={`Listen to ${verb.infinitive}`} disabled={isLoading}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              )}
            </svg>
          </button>
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-1.5">Toca para escuchar</p>
      </div>
      {isActive && (
        <div className="absolute -top-2 -right-2">
          <SparklesIcon className="text-yellow-400 animate-spin" size={24} />
        </div>
      )}
    </div>
  );
};

export const VocabularyIntro: React.FC<VocabularyIntroProps> = ({ mystery, onContinue }) => {
  const { accessibility } = useGame();
  const { isSpanish, t } = useLanguage();
  const [wordsHeard, setWordsHeard] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'vocabulario' | 'verbos'>('vocabulario');

  // Get Spanish learning data if in Spanish mode
  const spanishData = isSpanish ? getSpanishLearningData(mystery.id) : null;

  const handleWordPlayed = useCallback((word: string) => {
    setWordsHeard(prev => {
      const newSet = new Set(prev);
      newSet.add(word);
      return newSet;
    });
  }, []);

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl'
  };

  const totalWords = isSpanish && spanishData
    ? spanishData.vocabulario.length + spanishData.verbos.length
    : mystery.words.length;

  // ===== SPANISH MODE =====
  if (isSpanish && spanishData) {
    return (
      <div className={`min-h-screen ${accessibility.highContrast ? 'bg-white' : 'bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50'}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full">
                <BookIcon className="text-emerald-600" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">{mystery.title}</h1>
                <p className="text-sm text-gray-500">{t('mystery.with')} {mystery.detective.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
              <span className="text-lg">🇪🇸</span>
              <span className="font-bold text-emerald-700">{t('words.vocabAndVerbs')}</span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
              <SparklesIcon size={28} />
              <h2 className={`font-bold ${textSizeClasses[accessibility.textSize]}`}>
                {t('vocab.titleSpanish')}
              </h2>
              <SparklesIcon size={28} />
            </div>
            <p className={`text-gray-600 ${accessibility.textSize === 'xlarge' ? 'text-xl' : 'text-lg'} max-w-2xl mx-auto`}>
              {t('vocab.descriptionSpanish')}
            </p>
          </div>

          {/* Detective Helper */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <img src={mystery.detective.image} alt={mystery.detective.name} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
            <div className="bg-white rounded-2xl p-4 shadow-lg max-w-md relative">
              <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
              <p className={`text-gray-700 ${accessibility.textSize === 'xlarge' ? 'text-lg' : 'text-base'}`}>
                "¡Hola! Soy {mystery.detective.name}. ¡Aprendamos estas palabras en español juntos! 
                Toca cada tarjeta para escuchar la pronunciación."
              </p>
            </div>
          </div>

          {/* Tab Switcher: Vocabulario / Verbos */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab('vocabulario')}
              className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'vocabulario'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 shadow-md'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{t('vocab.vocabulario')}</span>
                <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm">{spanishData.vocabulario.length}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('verbos')}
              className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'verbos'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-blue-50 shadow-md'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{t('vocab.verbos')}</span>
                <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm">{spanishData.verbos.length}</span>
              </div>
            </button>
          </div>

          {/* Vocabulary Tab */}
          {activeTab === 'vocabulario' && (
            <>
              <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-4 mb-6 text-center">
                <p className="text-emerald-700 font-semibold text-lg">{t('vocab.learnTheseWords')}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-8">
                {spanishData.vocabulario.map((vocab, index) => (
                  <SpanishVocabCard
                    key={vocab.spanish}
                    vocab={vocab}
                    audioSpeed={accessibility.audioSpeed}
                    index={index}
                    onPlayed={handleWordPlayed}
                  />
                ))}
              </div>
            </>
          )}

          {/* Verbs Tab */}
          {activeTab === 'verbos' && (
            <>
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 mb-6 text-center">
                <p className="text-blue-700 font-semibold text-lg">{t('vocab.learnTheseVerbs')}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-8">
                {spanishData.verbos.map((verb, index) => (
                  <SpanishVerbCard
                    key={verb.infinitive}
                    verb={verb}
                    audioSpeed={accessibility.audioSpeed}
                    index={index}
                    onPlayed={handleWordPlayed}
                  />
                ))}
              </div>
            </>
          )}

          {/* Progress */}
          <div className="text-center mb-8">
            <p className="text-gray-500 mb-2">
              {t('vocab.wordsPracticed')} {wordsHeard.size} {t('words.ofWords')} {totalWords}
            </p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-blue-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(wordsHeard.size / totalWords) * 100}%` }}
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600"
            >
              <span>{t('vocab.startStory')}</span>
              <ChevronRightIcon size={28} />
            </button>
            <p className="text-gray-400 text-sm mt-4">{t('vocab.tapWordsHint')}</p>
          </div>
        </main>
      </div>
    );
  }

  // ===== ENGLISH MODE (original) =====
  return (
    <div className={`min-h-screen ${accessibility.highContrast ? 'bg-white' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50'}`}>
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <BookIcon className="text-purple-600" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">{mystery.title}</h1>
              <p className="text-sm text-gray-500">with {mystery.detective.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
            <span className="font-bold text-purple-700 text-lg">{mystery.wordFamily}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <SparklesIcon size={28} />
            <h2 className={`font-bold ${textSizeClasses[accessibility.textSize]}`}>Let's Learn New Words!</h2>
            <SparklesIcon size={28} />
          </div>
          <p className={`text-gray-600 ${accessibility.textSize === 'xlarge' ? 'text-xl' : 'text-lg'} max-w-2xl mx-auto`}>
            Before we start the story, let's practice the <span className="font-bold text-purple-600">{mystery.wordFamily}</span> word family! 
            Tap each word to hear how it sounds.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <img src={mystery.detective.image} alt={mystery.detective.name} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
          <div className="bg-white rounded-2xl p-4 shadow-lg max-w-md relative">
            <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
            <p className={`text-gray-700 ${accessibility.textSize === 'xlarge' ? 'text-lg' : 'text-base'}`}>
              "Hi! I'm {mystery.detective.name}. Let's learn these words together! 
              Tap the microphone on each word to hear me say it."
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 text-center">
          <p className="text-gray-600 mb-2">All these words end with:</p>
          <span className="text-5xl md:text-6xl font-bold text-purple-600">{mystery.wordFamily}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {mystery.words.map((word, index) => (
            <WordCard key={word} word={word} wordFamily={mystery.wordFamily} audioSpeed={accessibility.audioSpeed} index={index} onPlayed={handleWordPlayed} />
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-500 mb-2">Words practiced: {wordsHeard.size} of {mystery.words.length}</p>
          <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-teal-400 to-green-400 h-3 rounded-full transition-all duration-500" style={{ width: `${(wordsHeard.size / mystery.words.length) * 100}%` }} />
          </div>
        </div>

        <div className="text-center">
          <button onClick={onContinue} className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
            <span>Start the Story!</span>
            <ChevronRightIcon size={28} />
          </button>
          <p className="text-gray-400 text-sm mt-4">You can always tap words in the story to hear them again!</p>
        </div>
      </main>
    </div>
  );
};
