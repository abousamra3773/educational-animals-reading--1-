import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mystery, StoryScene, DialogueLine } from '../types';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { getCharacterAvatar, getSpeakerDisplayName } from '../data/characterAvatars';
import { 
  ChevronRightIcon, 
  HomeIcon, 
  SearchIcon,
  SparklesIcon,
  MicrophoneIcon,
  SpeakerIcon
} from './icons/Icons';

interface StorySceneInterfaceProps {
  mystery: Mystery;
  onComplete: () => void;
  onExit: () => void;
}

function getSpeakerVoiceId(speaker: string): string {
  return speaker;
}

interface DialogueLineComponentProps {
  line: DialogueLine;
  avatarName: string;
  textSizeClass: string;
  highContrast: boolean;
  audioSpeed: number;
}

const DialogueLineComponent: React.FC<DialogueLineComponentProps> = ({
  line,
  avatarName,
  textSizeClass,
  highContrast,
  audioSpeed
}) => {
  const { speakWithHighlight, isPlaying, isLoading, stop } = useTextToSpeech();
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const isPlayingRef = useRef(false);
  const { t } = useLanguage();
  
  const characterAvatar = getCharacterAvatar(line.speaker);
  const displayName = getSpeakerDisplayName(line.speaker, avatarName);
  const words = line.text.split(' ');

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (isPlayingRef.current) {
        stop();
      }
    };
  }, [stop]);

  const handlePlayDialogue = useCallback(async () => {
    if (isPlaying) {
      stop();
      setActiveWordIndex(-1);
      return;
    }
    setActiveWordIndex(-1);
    await speakWithHighlight(
      line.text,
      (index) => {
        setActiveWordIndex(index);
      },
      { 
        speed: audioSpeed,
        speaker: line.speaker
      }
    );
  }, [line.text, line.speaker, speakWithHighlight, audioSpeed, isPlaying, stop]);

  const getSpeakerBgColor = (): string => {
    if (line.speaker === 'narrator') return 'bg-gray-50 border-gray-200';
    if (line.speaker === 'detective') return 'bg-purple-50 border-purple-200';
    if (line.speaker.toLowerCase().includes('jake')) return 'bg-green-50 border-green-200';
    if (line.speaker.toLowerCase().includes('pancake')) return 'bg-orange-50 border-orange-200';
    if (line.speaker.toLowerCase().includes('bella')) return 'bg-pink-50 border-pink-200';
    if (line.speaker.toLowerCase().includes('batty')) return 'bg-indigo-50 border-indigo-200';
    if (line.speaker.toLowerCase().includes('matt')) return 'bg-amber-50 border-amber-200';
    if (line.speaker.toLowerCase().includes('oliver')) return 'bg-blue-50 border-blue-200';
    if (line.speaker.toLowerCase().includes('piggy')) return 'bg-rose-50 border-rose-200';
    if (line.speaker.toLowerCase().includes('misty')) return 'bg-slate-50 border-slate-200';
    if (line.speaker.toLowerCase().includes('sheepy')) return 'bg-stone-50 border-stone-200';
    if (line.speaker.toLowerCase().includes('benny')) return 'bg-yellow-50 border-yellow-200';
    if (line.speaker.toLowerCase().includes('mabel')) return 'bg-rose-50 border-rose-200';
    if (line.speaker.toLowerCase().includes('finn')) return 'bg-orange-50 border-orange-200';

    return 'bg-blue-50 border-blue-200';
  };

  return (
    <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${getSpeakerBgColor()} ${isPlaying ? 'ring-2 ring-teal-300 shadow-lg' : ''}`}>
      <div className="flex items-start gap-4">
        {characterAvatar && (
          <div className="flex-shrink-0">
            <div className={`w-14 h-14 rounded-full overflow-hidden ring-4 ${characterAvatar.color} shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}>
              <img src={characterAvatar.image} alt={displayName} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-bold ${characterAvatar?.textColor || 'text-gray-700'}`}>{displayName}</span>
            {line.speaker === 'narrator' && (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{t('reading.narrator')}</span>
            )}
            {line.emotion && (
              <span className="text-xs bg-white/60 text-gray-500 px-2 py-0.5 rounded-full capitalize">{line.emotion}</span>
            )}
          </div>
          <div className="flex items-start gap-3">
            <button
              onClick={handlePlayDialogue}
              disabled={isLoading}
              className={`flex-shrink-0 inline-flex items-center justify-center p-2.5 rounded-full transition-all duration-300 ${isPlaying ? 'bg-teal-500 text-white animate-pulse shadow-lg scale-110' : 'bg-teal-100 text-teal-600 hover:bg-teal-200 hover:scale-105'} ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
              aria-label={`Listen to ${displayName} say: ${line.text}`}
              title={`Hear ${displayName}'s voice`}
            >
              {isPlaying ? <SpeakerIcon size={20} /> : <MicrophoneIcon size={20} />}
            </button>
            <p className={`flex flex-wrap items-center gap-x-1 gap-y-1 leading-relaxed ${textSizeClass} ${line.speaker === 'narrator' ? 'italic' : ''} ${highContrast ? 'text-black' : 'text-gray-800'}`}>
              {words.map((word, index) => (
                <span key={index} className={`inline-block px-1 py-0.5 rounded transition-all duration-100 ${activeWordIndex === index ? 'bg-yellow-300 font-bold shadow-md scale-110 transform ring-2 ring-yellow-400' : ''}`}>
                  {word}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReadAllSceneButtonProps {
  dialogue: DialogueLine[];
  audioSpeed: number;
}

const ReadAllSceneButton: React.FC<ReadAllSceneButtonProps> = ({ dialogue, audioSpeed }) => {
  const { speakWithHighlight, isPlaying, isLoading, stop } = useTextToSpeech();
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [isReadingAll, setIsReadingAll] = useState(false);
  const isCancelledRef = useRef(false);
  const { t } = useLanguage();

  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      stop();
    };
  }, [stop]);

  const handleReadAll = useCallback(async () => {
    if (isReadingAll) {
      isCancelledRef.current = true;
      stop();
      setIsReadingAll(false);
      setCurrentLineIndex(-1);
      return;
    }
    isCancelledRef.current = false;
    setIsReadingAll(true);
    for (let i = 0; i < dialogue.length; i++) {
      if (isCancelledRef.current) break;
      setCurrentLineIndex(i);
      await new Promise<void>((resolve) => {
        speakWithHighlight(
          dialogue[i].text,
          (wordIdx) => { if (wordIdx === -1) resolve(); },
          { speed: audioSpeed, speaker: dialogue[i].speaker }
        );
        setTimeout(() => resolve(), 30000);
      });
      if (!isCancelledRef.current && i < dialogue.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }
    setIsReadingAll(false);
    setCurrentLineIndex(-1);
  }, [dialogue, speakWithHighlight, audioSpeed, isReadingAll, stop]);

  return (
    <button
      onClick={handleReadAll}
      disabled={isLoading && !isReadingAll}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${isReadingAll ? 'bg-teal-500 text-white shadow-lg animate-pulse' : 'bg-teal-100 text-teal-700 hover:bg-teal-200 hover:shadow-md'}`}
      title={isReadingAll ? 'Stop reading' : 'Read entire scene aloud with character voices'}
    >
      {isReadingAll ? (
        <>
          <SpeakerIcon size={18} />
          <span>{t('reading.stop')} ({currentLineIndex + 1}/{dialogue.length})</span>
        </>
      ) : (
        <>
          <MicrophoneIcon size={18} />
          <span>{t('reading.readSceneAloud')}</span>
        </>
      )}
    </button>
  );
};

export const StorySceneInterface: React.FC<StorySceneInterfaceProps> = ({
  mystery,
  onComplete,
  onExit
}) => {
  const { accessibility, playerState } = useGame();
  const { isSpanish, t } = useLanguage();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);
  const [foundClue, setFoundClue] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const scenes = mystery.scenes || [];
  const currentScene = scenes[currentSceneIndex];
  const isLastScene = currentSceneIndex === scenes.length - 1;
  const avatarName = playerState.avatar?.name || 'Detective';

  const textSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

  useEffect(() => {
    setShowDialogue(false);
    setFoundClue(false);
    const timer = setTimeout(() => setShowDialogue(true), 500);
    return () => clearTimeout(timer);
  }, [currentSceneIndex]);

  const handleContinue = () => {
    if (currentScene?.isInteractive && !foundClue) return;
    if (isLastScene) {
      onComplete();
    } else {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentScene?.isInteractive || foundClue) return;
    const img = e.currentTarget.querySelector('img');
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    const imgNaturalWidth = img.naturalWidth || containerWidth;
    const imgNaturalHeight = img.naturalHeight || containerHeight;
    const imgAspect = imgNaturalWidth / imgNaturalHeight;
    const containerAspect = containerWidth / containerHeight;
    let renderedWidth: number, renderedHeight: number, offsetX: number, offsetY: number;
    if (imgAspect > containerAspect) {
      renderedWidth = containerWidth;
      renderedHeight = containerWidth / imgAspect;
      offsetX = 0;
      offsetY = (containerHeight - renderedHeight) / 2;
    } else {
      renderedHeight = containerHeight;
      renderedWidth = containerHeight * imgAspect;
      offsetX = (containerWidth - renderedWidth) / 2;
      offsetY = 0;
    }
    const x = ((clickX - offsetX) / renderedWidth) * 100;
    const y = ((clickY - offsetY) / renderedHeight) * 100;
    const target = currentScene.interactiveTarget;
    if (target?.position) {
      const { x: tx, y: ty, width, height } = target.position;
      const padding = 5;
      if (x >= (tx - padding) && x <= (tx + width + padding) && y >= (ty - padding) && y <= (ty + height + padding)) {
        setFoundClue(true);
      }
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentScene?.isInteractive || foundClue) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMagnifierPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setShowMagnifier(true);
  };

  const handleImageMouseLeave = () => setShowMagnifier(false);

  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-pink-50">
        <p className="text-xl text-gray-600">{t('reading.loadingStory')}</p>
      </div>
    );
  }

  // Label for the header
  const familyLabel = isSpanish ? t('words.vocabAndVerbs') : `${mystery.wordFamily} Word Family`;

  return (
    <div className={`min-h-screen ${accessibility.highContrast ? 'bg-white' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50'}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onExit} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-semibold">
            <HomeIcon size={24} />
            <span className="hidden sm:inline">{t('reading.exit')}</span>
          </button>
          <div className="text-center">
            <h1 className="font-bold text-gray-800 text-lg">{mystery.title}</h1>
            <p className={`text-sm font-medium ${isSpanish ? 'text-emerald-600' : 'text-purple-600'}`}>
              {isSpanish && <span className="mr-1">🇪🇸</span>}
              {familyLabel}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${isSpanish ? 'bg-emerald-100' : 'bg-purple-100'} px-3 py-1.5 rounded-full`}>
            <span className={`text-sm font-semibold ${isSpanish ? 'text-emerald-700' : 'text-purple-700'}`}>
              {t('reading.scene')} {currentSceneIndex + 1} {t('reading.of')} {scenes.length}
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <div className="flex gap-2">
          {scenes.map((_, index) => (
            <div key={index} className={`h-2 flex-1 rounded-full transition-all duration-500 ${index < currentSceneIndex ? 'bg-green-400' : index === currentSceneIndex ? 'bg-purple-500' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {currentScene.headerText && (
          <div className="mb-4 p-4 bg-amber-100 border-2 border-amber-300 rounded-2xl">
            <div className="flex items-center gap-3">
              <SearchIcon className="text-amber-600 flex-shrink-0" size={28} />
              <p className={`${textSizeClasses[accessibility.textSize]} text-amber-800 font-semibold`}>{currentScene.headerText}</p>
            </div>
          </div>
        )}

        {/* Scene Image */}
        <div 
          className={`relative rounded-3xl overflow-hidden shadow-2xl mb-6 border-4 ${accessibility.highContrast ? 'border-black' : 'border-purple-200'} ${currentScene.isInteractive && !foundClue ? 'cursor-pointer' : ''}`}
          onClick={handleImageClick}
          onMouseMove={handleImageMouseMove}
          onMouseLeave={handleImageMouseLeave}
        >
          <img src={currentScene.image} alt={`Scene ${currentSceneIndex + 1}`} className={`w-full ${currentScene.isInteractive ? 'object-contain bg-gray-900/5' : 'object-cover'}`} style={{ maxHeight: '450px' }} />
          {currentScene.isInteractive && !foundClue && showMagnifier && (
            <div className="absolute pointer-events-none transition-opacity" style={{ left: magnifierPosition.x - 30, top: magnifierPosition.y - 30, width: 60, height: 60 }}>
              <div className="w-full h-full rounded-full border-4 border-amber-400 bg-amber-100/30 flex items-center justify-center">
                <SearchIcon className="text-amber-600" size={24} />
              </div>
            </div>
          )}
          {currentScene.isInteractive && foundClue && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-pulse">
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
                <SparklesIcon className="text-yellow-500 mx-auto mb-2" size={48} />
                <p className="text-2xl font-bold text-green-600">{t('interactive.youFoundIt')}</p>
              </div>
            </div>
          )}
          {currentScene.isInteractive && !foundClue && currentScene.interactiveTarget && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <p className="text-amber-700 font-medium flex items-center gap-2">
                <SearchIcon size={18} />
                {currentScene.interactiveTarget.hint}
              </p>
            </div>
          )}
        </div>

        {/* Dialogue Section */}
        <div className={`bg-white rounded-3xl shadow-xl p-6 mb-6 border-4 ${accessibility.highContrast ? 'border-black' : 'border-purple-100'} transition-opacity duration-500 ${showDialogue ? 'opacity-100' : 'opacity-0'}`}>
          {showDialogue && currentScene.dialogue.length > 1 && (
            <div className="flex justify-end mb-4">
              <ReadAllSceneButton dialogue={currentScene.dialogue} audioSpeed={accessibility.audioSpeed} />
            </div>
          )}
          <div className="space-y-4">
            {currentScene.dialogue.map((line, index) => (
              <div key={index} style={{ animationDelay: `${index * 0.2}s`, animation: showDialogue ? 'fadeInUp 0.5s ease-out forwards' : 'none' }}>
                <DialogueLineComponent line={line} avatarName={avatarName} textSizeClass={textSizeClasses[accessibility.textSize]} highContrast={accessibility.highContrast} audioSpeed={accessibility.audioSpeed} />
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={currentScene.isInteractive && !foundClue}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${currentScene.isInteractive && !foundClue ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : isLastScene ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'}`}
          >
            {isLastScene ? t('reading.completeStory') : t('reading.continue')}
            <ChevronRightIcon size={24} />
          </button>
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
