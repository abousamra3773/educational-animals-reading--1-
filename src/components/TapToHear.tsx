import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useGame } from '../context/GameContext';
import { MicrophoneIcon, SpeakerIcon } from './icons/Icons';

interface TapToHearProps {
  text: string;
  className?: string;
  highlightOnPlay?: boolean;
  size?: 'small' | 'medium' | 'large';
  speaker?: string; // Character name for voice selection
}

export const TapToHear: React.FC<TapToHearProps> = ({ 
  text, 
  className = '',
  highlightOnPlay = true,
  size = 'medium',
  speaker
}) => {
  const { speak, isLoading, isPlaying } = useTextToSpeech();
  const { accessibility } = useGame();
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleClick = async () => {
    if (highlightOnPlay) {
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), text.length * 80 + 1000);
    }
    await speak(text, { speed: accessibility.audioSpeed, speaker });
  };

  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        rounded-full
        transition-all duration-300
        ${isPlaying 
          ? 'bg-teal-500 text-white animate-pulse shadow-lg scale-110' 
          : 'bg-teal-100 text-teal-600 hover:bg-teal-200 hover:scale-105'
        }
        ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        ${isHighlighted ? 'ring-4 ring-yellow-300' : ''}
        ${className}
      `}
      aria-label={`Listen to: ${text}`}
      title="Tap to hear"
    >
      {isPlaying ? (
        <SpeakerIcon size={iconSizes[size]} />
      ) : (
        <MicrophoneIcon size={iconSizes[size]} />
      )}
    </button>
  );
};

// Component for a single word with its own microphone icon
interface WordWithMicProps {
  word: string;
  isHighlighted?: boolean;
  onWordClick?: () => void;
  className?: string;
  showMic?: boolean;
  speaker?: string;
}

export const WordWithMic: React.FC<WordWithMicProps> = ({
  word,
  isHighlighted = false,
  onWordClick,
  className = '',
  showMic = true,
  speaker
}) => {
  const { speak, isLoading, isPlaying } = useTextToSpeech();
  const { accessibility } = useGame();
  const [localHighlight, setLocalHighlight] = useState(false);

  const handleMicClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalHighlight(true);
    await speak(word, { speed: accessibility.audioSpeed, speaker });
    setTimeout(() => setLocalHighlight(false), 500);
  };

  const handleWordClick = () => {
    if (onWordClick) {
      onWordClick();
    }
  };

  const isCurrentlyHighlighted = isHighlighted || localHighlight || isPlaying;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span
        onClick={handleWordClick}
        className={`
          cursor-pointer px-2 py-1 rounded-lg transition-all duration-150
          ${isCurrentlyHighlighted 
            ? 'bg-yellow-300 scale-110 font-bold shadow-md transform' 
            : 'hover:bg-yellow-100'
          }
        `}
      >
        {word}
      </span>
      {showMic && (
        <button
          onClick={handleMicClick}
          disabled={isLoading}
          className={`
            inline-flex items-center justify-center
            p-1 rounded-full transition-all duration-150
            ${isPlaying 
              ? 'bg-teal-500 text-white animate-pulse scale-110' 
              : 'bg-teal-50 text-teal-500 hover:bg-teal-100 hover:scale-110'
            }
            ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
          `}
          aria-label={`Listen to: ${word}`}
          title={`Tap to hear "${word}"`}
        >
          {isPlaying ? (
            <SpeakerIcon size={14} />
          ) : (
            <MicrophoneIcon size={14} />
          )}
        </button>
      )}
    </span>
  );
};

// Enhanced sentence component with word-by-word highlighting
// Uses real-time audio synchronization for accurate highlighting
interface TapToHearSentenceProps {
  text: string;
  className?: string;
  textClassName?: string;
  showWordMics?: boolean;
  speaker?: string; // Character name for voice selection
}

export const TapToHearSentence: React.FC<TapToHearSentenceProps> = ({
  text,
  className = '',
  textClassName = '',
  showWordMics = false,
  speaker
}) => {
  const { speakWithHighlight, isPlaying, isLoading, stop } = useTextToSpeech();
  const { accessibility } = useGame();
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const isPlayingRef = useRef(false);
  
  const words = text.split(' ');

  // Keep track of playing state for cleanup
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isPlayingRef.current) {
        stop();
      }
    };
  }, [stop]);

  const handlePlaySentence = useCallback(async () => {
    if (isPlaying) {
      stop();
      setActiveWordIndex(-1);
      return;
    }
    
    // Reset highlight
    setActiveWordIndex(-1);
    
    await speakWithHighlight(
      text, 
      (index) => {
        // Update the highlighted word as the audio plays
        setActiveWordIndex(index);
      },
      { speed: accessibility.audioSpeed, speaker }
    );
  }, [text, speakWithHighlight, accessibility.audioSpeed, speaker, isPlaying, stop]);

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Main sentence microphone */}
      <button
        onClick={handlePlaySentence}
        disabled={isLoading}
        className={`
          flex-shrink-0 inline-flex items-center justify-center
          p-3 rounded-full transition-all duration-300
          ${isPlaying 
            ? 'bg-teal-500 text-white animate-pulse shadow-lg scale-110' 
            : 'bg-teal-100 text-teal-600 hover:bg-teal-200 hover:scale-105'
          }
          ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
        aria-label={`Listen to sentence: ${text}`}
        title="Tap to hear the whole sentence"
      >
        {isPlaying ? (
          <SpeakerIcon size={24} />
        ) : (
          <MicrophoneIcon size={24} />
        )}
      </button>

      {/* Words with individual highlighting */}
      <p className={`flex flex-wrap items-center gap-x-1 gap-y-2 leading-relaxed ${textClassName}`}>
        {words.map((word, index) => (
          <HighlightableWord
            key={index}
            word={word}
            isHighlighted={activeWordIndex === index}
            showMic={showWordMics}
            speaker={speaker}
          />
        ))}
      </p>
    </div>
  );
};

// Separate component for highlightable words to optimize re-renders
interface HighlightableWordProps {
  word: string;
  isHighlighted: boolean;
  showMic: boolean;
  speaker?: string;
}

const HighlightableWord: React.FC<HighlightableWordProps> = ({
  word,
  isHighlighted,
  showMic,
  speaker
}) => {
  const { speak, isLoading, isPlaying } = useTextToSpeech();
  const { accessibility } = useGame();
  const [localHighlight, setLocalHighlight] = useState(false);

  const handleMicClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalHighlight(true);
    await speak(word, { speed: accessibility.audioSpeed, speaker });
    // Keep highlight a bit longer for visual feedback
    setTimeout(() => setLocalHighlight(false), 800);
  };

  const isCurrentlyHighlighted = isHighlighted || localHighlight;

  return (
    <span className="inline-flex items-center gap-0.5">
      <span
        className={`
          inline-block px-2 py-1 rounded-lg transition-all duration-100
          ${isCurrentlyHighlighted 
            ? 'bg-yellow-300 font-bold shadow-lg scale-110 transform ring-2 ring-yellow-400' 
            : ''
          }
        `}
      >
        {word}
      </span>
      {showMic && (
        <button
          onClick={handleMicClick}
          disabled={isLoading}
          className={`
            inline-flex items-center justify-center
            p-0.5 rounded-full transition-all duration-150
            ${isPlaying 
              ? 'bg-teal-500 text-white animate-pulse scale-110' 
              : 'bg-teal-50 text-teal-500 hover:bg-teal-100 hover:scale-110'
            }
            ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
          `}
          aria-label={`Listen to: ${word}`}
          title={`Tap to hear "${word}"`}
        >
          {isPlaying ? (
            <SpeakerIcon size={12} />
          ) : (
            <MicrophoneIcon size={12} />
          )}
        </button>
      )}
    </span>
  );
};

// Legacy component for backwards compatibility
interface TapToHearTextProps {
  text: string;
  className?: string;
  textClassName?: string;
  speaker?: string;
}

export const TapToHearText: React.FC<TapToHearTextProps> = ({
  text,
  className = '',
  textClassName = '',
  speaker
}) => {
  return (
    <TapToHearSentence
      text={text}
      className={className}
      textClassName={textClassName}
      showWordMics={false}
      speaker={speaker}
    />
  );
};

// Word choice button with microphone for mystery word options
interface WordChoiceWithMicProps {
  word: string;
  isSelected?: boolean;
  onSelect: () => void;
  className?: string;
  speaker?: string;
}

export const WordChoiceWithMic: React.FC<WordChoiceWithMicProps> = ({
  word,
  isSelected = false,
  onSelect,
  className = '',
  speaker
}) => {
  const { speak, isLoading, isPlaying } = useTextToSpeech();
  const { accessibility } = useGame();
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleMicClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHighlighted(true);
    await speak(word, { speed: accessibility.audioSpeed, speaker });
    setTimeout(() => setIsHighlighted(false), 800);
  };

  const isCurrentlyHighlighted = isHighlighted || isPlaying;

  return (
    <div 
      className={`
        relative inline-flex items-center gap-2 
        px-4 py-3 rounded-2xl font-bold text-lg 
        transition-all duration-300 cursor-pointer
        ${isSelected
          ? 'bg-green-500 text-white scale-105 shadow-lg'
          : isCurrentlyHighlighted
            ? 'bg-yellow-300 text-gray-800 scale-105 shadow-lg ring-4 ring-yellow-400'
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-105'
        }
        ${className}
      `}
      onClick={onSelect}
    >
      <span>{word}</span>
      
      {/* Microphone button for individual word */}
      <button
        onClick={handleMicClick}
        disabled={isLoading}
        className={`
          inline-flex items-center justify-center
          p-1.5 rounded-full transition-all duration-150
          ${isPlaying 
            ? 'bg-white/30 text-white animate-pulse' 
            : isSelected
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
          }
          ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
        aria-label={`Listen to: ${word}`}
        title={`Tap to hear "${word}"`}
      >
        {isPlaying ? (
          <SpeakerIcon size={16} />
        ) : (
          <MicrophoneIcon size={16} />
        )}
      </button>

      {/* Check mark for selected words */}
      {isSelected && (
        <svg 
          className="w-5 h-5 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      )}
    </div>
  );
};
