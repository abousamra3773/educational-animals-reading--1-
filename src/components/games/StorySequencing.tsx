import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useGame } from '../../context/GameContext';
import { CheckCircleIcon, RefreshIcon, SparklesIcon, ChevronUpIcon, ChevronDownIcon, MicrophoneIcon, SpeakerIcon } from '../icons/Icons';

interface StorySequencingProps {
  events: {
    id: number;
    text: string;
    correctOrder: number;
  }[];
  onComplete: (score: number, maxScore: number) => void;
}

// Individual event card with word-by-word highlighting on microphone click
interface EventCardProps {
  event: { id: number; text: string; correctOrder: number };
  index: number;
  isChecked: boolean;
  isCorrect: boolean;
  isInCorrectPosition: boolean;
  isInWrongPosition: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  index,
  isChecked,
  isCorrect,
  isInCorrectPosition,
  isInWrongPosition,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const { speakWithHighlight, isPlaying, isLoading, stop } = useTextToSpeech();
  const { accessibility } = useGame();
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const isPlayingRef = useRef(false);
  
  const words = event.text.split(' ');

  // Track playing state for cleanup
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

  const handlePlayWithHighlight = useCallback(async () => {
    if (isPlaying) {
      stop();
      setActiveWordIndex(-1);
      return;
    }
    
    setActiveWordIndex(-1);
    
    await speakWithHighlight(
      event.text,
      (wordIndex) => {
        setActiveWordIndex(wordIndex);
      },
      { speed: accessibility.audioSpeed, speaker: 'narrator' }
    );

  }, [event.text, speakWithHighlight, accessibility.audioSpeed, isPlaying, stop]);

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-2xl transition-all duration-300
        ${isInCorrectPosition 
          ? 'bg-green-100 border-2 border-green-300' 
          : isInWrongPosition
            ? 'bg-red-50 border-2 border-red-200'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200'
        }
      `}
    >
      {/* Order Number */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0
        ${isInCorrectPosition 
          ? 'bg-green-500 text-white' 
          : isInWrongPosition
            ? 'bg-red-400 text-white'
            : 'bg-purple-500 text-white'
        }
      `}>
        {index + 1}
      </div>

      {/* Event Text with word-by-word highlighting */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium leading-relaxed flex flex-wrap gap-x-1 gap-y-0.5 ${isInWrongPosition ? 'text-red-700' : 'text-gray-800'}`}>
          {words.map((word, wordIdx) => (
            <span
              key={wordIdx}
              className={`
                inline-block px-1 py-0.5 rounded transition-all duration-100
                ${activeWordIndex === wordIdx 
                  ? 'bg-yellow-300 font-bold shadow-md scale-110 transform ring-2 ring-yellow-400' 
                  : ''
                }
              `}
            >
              {word}
            </span>
          ))}
        </p>
      </div>

      {/* Audio Button - now with word highlighting */}
      <button
        onClick={handlePlayWithHighlight}
        disabled={isLoading}
        className={`
          flex-shrink-0 inline-flex items-center justify-center
          p-2 rounded-full transition-all duration-300
          ${isPlaying 
            ? 'bg-teal-500 text-white animate-pulse shadow-lg scale-110' 
            : 'bg-teal-100 text-teal-600 hover:bg-teal-200 hover:scale-105'
          }
          ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
        aria-label={`Listen to: ${event.text}`}
        title="Tap to hear with word highlighting"
      >
        {isPlaying ? (
          <SpeakerIcon size={18} />
        ) : (
          <MicrophoneIcon size={18} />
        )}
      </button>

      {/* Move Buttons */}
      {!isCorrect && (
        <div className="flex flex-col gap-1">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp || isCorrect}
            className={`
              p-1 rounded-lg transition-all
              ${!canMoveUp || isCorrect
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-purple-100 hover:text-purple-600'
              }
            `}
          >
            <ChevronUpIcon size={20} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown || isCorrect}
            className={`
              p-1 rounded-lg transition-all
              ${!canMoveDown || isCorrect
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-purple-100 hover:text-purple-600'
              }
            `}
          >
            <ChevronDownIcon size={20} />
          </button>
        </div>
      )}

      {/* Feedback Icons */}
      {isChecked && (
        <div className="flex-shrink-0">
          {isInCorrectPosition ? (
            <CheckCircleIcon className="text-green-500" size={24} />
          ) : (
            <span className="text-red-500 font-bold text-sm">#{event.correctOrder}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Main "Read All" button that reads all events in sequence with word highlighting
interface ReadAllButtonProps {
  events: { id: number; text: string; correctOrder: number }[];
}

const ReadAllButton: React.FC<ReadAllButtonProps> = ({ events }) => {
  const { speakWithHighlight, isPlaying, isLoading, stop } = useTextToSpeech();
  const { accessibility } = useGame();
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(-1);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const isPlayingRef = useRef(false);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      if (isPlayingRef.current) {
        stop();
      }
    };
  }, [stop]);

  const handleReadAll = useCallback(async () => {
    if (isPlaying) {
      stop();
      setCurrentEventIndex(-1);
      setActiveWordIndex(-1);
      isCancelledRef.current = true;
      return;
    }

    isCancelledRef.current = false;

    // Read each event sequentially
    for (let i = 0; i < events.length; i++) {
      if (isCancelledRef.current) break;
      
      setCurrentEventIndex(i);
      setActiveWordIndex(-1);

      await new Promise<void>((resolve) => {
        speakWithHighlight(
          events[i].text,
          (wordIdx) => {
            setActiveWordIndex(wordIdx);
            if (wordIdx === -1) {
              // Speech ended for this event
              resolve();
            }
          },
          { speed: accessibility.audioSpeed, speaker: 'narrator' }
        );
        
        // Fallback timeout in case onWordHighlight(-1) doesn't fire
        setTimeout(() => resolve(), 30000);
      });

      // Small pause between events
      if (!isCancelledRef.current && i < events.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setCurrentEventIndex(-1);
    setActiveWordIndex(-1);
  }, [events, speakWithHighlight, accessibility.audioSpeed, isPlaying, stop]);


  return (
    <div>
      <button
        onClick={handleReadAll}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300
          ${isPlaying 
            ? 'bg-teal-500 text-white animate-pulse shadow-lg' 
            : 'bg-teal-100 text-teal-700 hover:bg-teal-200 hover:shadow-md'
          }
          ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
        title="Listen to all events read aloud"
      >
        {isPlaying ? (
          <>
            <SpeakerIcon size={20} />
            <span>Stop Reading</span>
          </>
        ) : (
          <>
            <MicrophoneIcon size={20} />
            <span>Read All Aloud</span>
          </>
        )}
      </button>
      {currentEventIndex >= 0 && (
        <p className="text-sm text-teal-600 mt-1 text-center">
          Reading event {currentEventIndex + 1} of {events.length}...
        </p>
      )}
    </div>
  );
};

export const StorySequencing: React.FC<StorySequencingProps> = ({
  events,
  onComplete,
}) => {
  const [orderedEvents, setOrderedEvents] = useState<typeof events>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Shuffle events initially
    const shuffled = [...events].sort(() => Math.random() - 0.5);
    setOrderedEvents(shuffled);
  }, [events]);

  const moveUp = (index: number) => {
    if (index === 0 || isChecked) return;
    const newOrder = [...orderedEvents];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrderedEvents(newOrder);
    setIsChecked(false);
  };

  const moveDown = (index: number) => {
    if (index === orderedEvents.length - 1 || isChecked) return;
    const newOrder = [...orderedEvents];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrderedEvents(newOrder);
    setIsChecked(false);
  };

  const handleCheck = () => {
    setAttempts(prev => prev + 1);
    const correct = orderedEvents.every((event, index) => event.correctOrder === index + 1);
    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setTimeout(() => {
        const score = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
        onComplete(score, 3);
      }, 1500);
    }
  };

  const handleReset = () => {
    const shuffled = [...events].sort(() => Math.random() - 0.5);
    setOrderedEvents(shuffled);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full mb-4">
          <SparklesIcon className="text-rose-500" size={20} />
          <span className="font-bold text-rose-700">Story Sequencing</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Put the story in order!
        </h2>
        <p className="text-gray-600 mb-3">
          Use the arrows to arrange the events from first to last
        </p>
        
        {/* Read All button with highlighting */}
        <div className="flex items-center justify-center gap-3">
          <ReadAllButton events={orderedEvents} />
        </div>
        
        {/* Helper text */}
        <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tap any microphone to hear the sentence with word-by-word highlighting!
        </p>
      </div>

      {/* Story Events */}
      <div className="space-y-3 mb-6">
        {orderedEvents.map((event, index) => {
          const isInCorrectPosition = isChecked && event.correctOrder === index + 1;
          const isInWrongPosition = isChecked && event.correctOrder !== index + 1;

          return (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              isChecked={isChecked}
              isCorrect={isCorrect}
              isInCorrectPosition={isInCorrectPosition}
              isInWrongPosition={isInWrongPosition}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
              canMoveUp={index > 0}
              canMoveDown={index < orderedEvents.length - 1}
            />
          );
        })}
      </div>

      {/* Feedback Message */}
      {isChecked && (
        <div className={`text-center mb-4 p-4 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-amber-100'}`}>
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="text-green-500" size={24} />
              <span className="font-bold text-green-700">Perfect! You got the story order right!</span>
            </div>
          ) : (
            <div>
              <p className="font-bold text-amber-700 mb-1">Not quite right!</p>
              <p className="text-amber-600 text-sm">The numbers show where each event should be. Try again!</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleReset}
          disabled={isCorrect}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          <RefreshIcon size={20} />
          Shuffle
        </button>
        <button
          onClick={handleCheck}
          disabled={isCorrect}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
            ${!isCorrect
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <CheckCircleIcon size={20} />
          Check Order
        </button>
      </div>
    </div>
  );
};
