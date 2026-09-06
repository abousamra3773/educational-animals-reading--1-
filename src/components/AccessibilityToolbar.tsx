import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { SettingsIcon, XIcon, SpeakerIcon, MicrophoneIcon } from './icons/Icons';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

// Turtle SVG icon for slow speed
const TurtleIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 28 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none">
    {/* Shell */}
    <ellipse cx="32" cy="34" rx="18" ry="14" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
    {/* Shell pattern */}
    <path d="M32 20v28" stroke="#16a34a" strokeWidth="1.5" opacity="0.5" />
    <path d="M20 28c6 4 18 4 24 0" stroke="#16a34a" strokeWidth="1.5" opacity="0.5" />
    <path d="M20 38c6-4 18-4 24 0" stroke="#16a34a" strokeWidth="1.5" opacity="0.5" />
    {/* Head */}
    <circle cx="50" cy="34" r="6" fill="#86efac" stroke="#16a34a" strokeWidth="2" />
    {/* Eye */}
    <circle cx="52" cy="32" r="1.5" fill="#16a34a" />
    {/* Legs */}
    <ellipse cx="22" cy="46" rx="4" ry="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
    <ellipse cx="42" cy="46" rx="4" ry="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
    <ellipse cx="20" cy="26" rx="3" ry="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
    <ellipse cx="44" cy="26" rx="3" ry="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
    {/* Tail */}
    <path d="M14 36c-3 0-5-1-4-3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Rabbit SVG icon for fast speed
const RabbitIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 28 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none">
    {/* Left ear */}
    <ellipse cx="24" cy="14" rx="5" ry="14" fill="#f9a8d4" stroke="#ec4899" strokeWidth="2" />
    <ellipse cx="24" cy="14" rx="2.5" ry="10" fill="#fce7f3" />
    {/* Right ear */}
    <ellipse cx="38" cy="12" rx="5" ry="14" fill="#f9a8d4" stroke="#ec4899" strokeWidth="2" />
    <ellipse cx="38" cy="12" rx="2.5" ry="10" fill="#fce7f3" />
    {/* Head */}
    <circle cx="31" cy="34" r="14" fill="#f9a8d4" stroke="#ec4899" strokeWidth="2" />
    {/* Eyes */}
    <circle cx="26" cy="31" r="2.5" fill="white" />
    <circle cx="26" cy="31" r="1.5" fill="#1e293b" />
    <circle cx="36" cy="31" r="2.5" fill="white" />
    <circle cx="36" cy="31" r="1.5" fill="#1e293b" />
    {/* Nose */}
    <ellipse cx="31" cy="36" rx="2" ry="1.5" fill="#ec4899" />
    {/* Mouth */}
    <path d="M29 38c1 1.5 3 1.5 4 0" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
    {/* Whiskers */}
    <line x1="19" y1="34" x2="26" y2="36" stroke="#ec4899" strokeWidth="1" />
    <line x1="19" y1="38" x2="26" y2="37" stroke="#ec4899" strokeWidth="1" />
    <line x1="36" y1="36" x2="43" y2="34" stroke="#ec4899" strokeWidth="1" />
    <line x1="36" y1="37" x2="43" y2="38" stroke="#ec4899" strokeWidth="1" />
    {/* Cheeks */}
    <circle cx="22" cy="36" r="3" fill="#fda4af" opacity="0.5" />
    <circle cx="40" cy="36" r="3" fill="#fda4af" opacity="0.5" />
    {/* Body hint */}
    <ellipse cx="31" cy="52" rx="10" ry="7" fill="#f9a8d4" stroke="#ec4899" strokeWidth="2" />
    {/* Feet */}
    <ellipse cx="24" cy="58" rx="5" ry="3" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
    <ellipse cx="38" cy="58" rx="5" ry="3" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
  </svg>
);

// Speed wave animation bars
const SpeedWaves: React.FC<{ speed: number; isPlaying: boolean }> = ({ speed, isPlaying }) => {
  // Number of bars based on speed
  const barCount = 5;
  const activeLevel = Math.round(((speed - 0.5) / 0.7) * barCount);
  
  return (
    <div className="flex items-end gap-0.5 h-4">
      {Array.from({ length: barCount }).map((_, i) => {
        const isActive = i < activeLevel;
        const height = 4 + (i * 3);
        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              isActive 
                ? isPlaying 
                  ? 'animate-pulse bg-teal-500' 
                  : 'bg-teal-400'
                : 'bg-gray-200'
            }`}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
};

const SAMPLE_SENTENCES = [
  "The quick brown fox jumped over the lazy dog.",
  "Jake the Snake found a clue in the old bakery!",
  "Pancake the Cat loves to solve mysteries.",
  "Can you help us find the missing recipe?",
  "The detective followed the trail of paw prints.",
];

const SPEED_LABELS = [
  { min: 0.5, max: 0.59, label: 'Very Slow', color: 'text-green-600', description: 'Extra time for each word — great for early learners' },
  { min: 0.6, max: 0.74, label: 'Slow', color: 'text-green-500', description: 'Gentle pace with clear word highlighting' },
  { min: 0.75, max: 0.89, label: 'Steady', color: 'text-teal-500', description: 'Natural reading pace — recommended for most readers' },
  { min: 0.9, max: 1.04, label: 'Normal', color: 'text-blue-500', description: 'Conversational speed for confident readers' },
  { min: 1.05, max: 1.2, label: 'Fast', color: 'text-purple-500', description: 'Quick pace for advanced readers' },
];

function getSpeedLabel(speed: number) {
  return SPEED_LABELS.find(s => speed >= s.min && speed <= s.max) || SPEED_LABELS[2];
}

// Get gradient position percentage for the slider thumb
function getSliderPercent(speed: number): number {
  return ((speed - 0.5) / 0.7) * 100;
}

export const AccessibilityToolbar: React.FC = () => {
  const { accessibility, updateAccessibility } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const { speak, speakWithHighlight, isPlaying, isLoading, stop } = useTextToSpeech();
  const [previewWords, setPreviewWords] = useState<string[]>([]);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const textSizes = [
    { value: 'small', label: 'A', size: 'text-sm', description: 'Small' },
    { value: 'medium', label: 'A', size: 'text-base', description: 'Medium' },
    { value: 'large', label: 'A', size: 'text-lg', description: 'Large' },
    { value: 'xlarge', label: 'A', size: 'text-xl', description: 'Extra Large' }
  ] as const;

  const currentSpeedLabel = getSpeedLabel(accessibility.audioSpeed);
  const sliderPercent = getSliderPercent(accessibility.audioSpeed);

  // Pick a random sample sentence
  const getSampleSentence = useCallback(() => {
    return SAMPLE_SENTENCES[Math.floor(Math.random() * SAMPLE_SENTENCES.length)];
  }, []);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    updateAccessibility({ audioSpeed: Math.round(newSpeed * 100) / 100 });
  }, [updateAccessibility]);

  const handlePreview = useCallback(async () => {
    if (isPreviewing || isPlaying) {
      stop();
      setIsPreviewing(false);
      setHighlightedWordIndex(-1);
      setPreviewWords([]);
      return;
    }

    const sentence = getSampleSentence();
    const words = sentence.split(' ');
    setPreviewWords(words);
    setIsPreviewing(true);
    setHighlightedWordIndex(0);

    try {
      await speakWithHighlight(
        sentence,
        (index: number) => {
          setHighlightedWordIndex(index);
        },
        { speed: accessibility.audioSpeed, speaker: 'narrator' }
      );
    } catch (err) {
      console.error('Preview error:', err);
    } finally {
      // Small delay before clearing to let the last word show
      setTimeout(() => {
        setIsPreviewing(false);
        setHighlightedWordIndex(-1);
        setPreviewWords([]);
      }, 500);
    }
  }, [isPreviewing, isPlaying, stop, getSampleSentence, speakWithHighlight, accessibility.audioSpeed]);

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stop();
      setIsPreviewing(false);
      setHighlightedWordIndex(-1);
      setPreviewWords([]);
    }
  }, [isOpen, stop]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-purple-200"
        aria-label="Accessibility settings"
      >
        <SettingsIcon className="text-purple-500" size={24} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 bg-white rounded-3xl shadow-2xl p-6 w-[340px] z-50 border-4 border-purple-100 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-purple-700">Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-purple-50 rounded-full transition-colors"
            >
              <XIcon className="text-purple-400" size={20} />
            </button>
          </div>

          {/* Text Size */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-3">
              Text Size
            </label>
            <div className="flex gap-2">
              {textSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => updateAccessibility({ textSize: size.value })}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${
                    accessibility.textSize === size.value
                      ? 'bg-purple-500 text-white shadow-lg scale-105'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  } ${size.size}`}
                  title={size.description}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-3">
              High Contrast
            </label>
            <button
              onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
              className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${
                accessibility.highContrast
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {accessibility.highContrast ? 'On' : 'Off'}
            </button>
          </div>

          {/* Reading Speed Slider */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-1">
              <MicrophoneIcon size={18} className="text-teal-500" />
              Reading Speed
            </label>
            <p className="text-xs text-gray-400 mb-4">
              Adjust how fast words are read aloud
            </p>

            {/* Speed indicator with turtle and rabbit */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 transition-transform duration-300" style={{ 
                transform: accessibility.audioSpeed <= 0.6 ? 'scale(1.15)' : 'scale(0.9)',
                opacity: accessibility.audioSpeed <= 0.7 ? 1 : 0.5
              }}>
                <TurtleIcon size={36} />
              </div>

              {/* Slider container */}
              <div className="flex-1 relative">
                {/* Speed label badge */}
                <div 
                  className="absolute -top-7 transition-all duration-300 pointer-events-none"
                  style={{ left: `calc(${sliderPercent}% - 24px)` }}
                >
                  <span className={`text-xs font-bold ${currentSpeedLabel.color} bg-white px-2 py-0.5 rounded-full shadow-sm border whitespace-nowrap`}>
                    {currentSpeedLabel.label}
                  </span>
                </div>

                {/* Custom slider */}
                <div className="relative h-8 flex items-center">
                  {/* Track background */}
                  <div className="absolute inset-x-0 h-3 rounded-full bg-gradient-to-r from-green-200 via-teal-200 via-blue-200 to-purple-200" />
                  
                  {/* Active track fill */}
                  <div 
                    className="absolute left-0 h-3 rounded-full bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 transition-all duration-150"
                    style={{ width: `${sliderPercent}%` }}
                  />

                  {/* Tick marks */}
                  <div className="absolute inset-x-0 h-3 flex items-center justify-between px-0.5">
                    {[0.5, 0.7, 0.85, 1.0, 1.2].map((tick) => (
                      <div 
                        key={tick} 
                        className={`w-0.5 h-2 rounded-full transition-colors ${
                          tick <= accessibility.audioSpeed ? 'bg-white/60' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Range input */}
                  <input
                    ref={sliderRef}
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.05"
                    value={accessibility.audioSpeed}
                    onChange={handleSpeedChange}
                    className="absolute inset-0 w-full h-8 opacity-0 cursor-pointer z-10"
                    aria-label="Reading speed"
                  />

                  {/* Custom thumb */}
                  <div 
                    className="absolute w-6 h-6 bg-white rounded-full shadow-lg border-3 border-teal-400 pointer-events-none transition-all duration-150 flex items-center justify-center"
                    style={{ 
                      left: `calc(${sliderPercent}% - 12px)`,
                      borderWidth: '3px'
                    }}
                  >
                    <SpeedWaves speed={accessibility.audioSpeed} isPlaying={isPreviewing} />
                  </div>
                </div>

                {/* Speed value labels */}
                <div className="flex justify-between mt-1 px-0.5">
                  <span className="text-[10px] text-gray-400">0.5x</span>
                  <span className="text-[10px] text-gray-400">0.85x</span>
                  <span className="text-[10px] text-gray-400">1.2x</span>
                </div>
              </div>

              <div className="flex-shrink-0 transition-transform duration-300" style={{ 
                transform: accessibility.audioSpeed >= 1.0 ? 'scale(1.15)' : 'scale(0.9)',
                opacity: accessibility.audioSpeed >= 0.9 ? 1 : 0.5
              }}>
                <RabbitIcon size={36} />
              </div>
            </div>

            {/* Current speed description */}
            <div className="text-center mt-2 mb-3">
              <p className={`text-xs font-medium ${currentSpeedLabel.color}`}>
                {currentSpeedLabel.description}
              </p>
            </div>

            {/* Preview section */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-4 border border-teal-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-teal-700">Preview Speed</span>
                <button
                  onClick={handlePreview}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isPreviewing
                      ? 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-200'
                      : isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                        : 'bg-teal-500 text-white hover:bg-teal-600 shadow-md hover:shadow-lg active:scale-95'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading...
                    </>
                  ) : isPreviewing ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                      </svg>
                      Stop
                    </>
                  ) : (
                    <>
                      <SpeakerIcon size={14} />
                      Listen
                    </>
                  )}
                </button>
              </div>

              {/* Preview sentence display */}
              <div className="min-h-[48px] flex items-center justify-center">
                {previewWords.length > 0 ? (
                  <p className="text-sm leading-relaxed text-center">
                    {previewWords.map((word, i) => (
                      <span
                        key={i}
                        className={`inline-block mx-0.5 px-1 py-0.5 rounded transition-all duration-150 ${
                          i === highlightedWordIndex
                            ? 'bg-yellow-300 text-gray-900 font-bold scale-110 shadow-sm'
                            : i < highlightedWordIndex
                              ? 'text-teal-700'
                              : 'text-gray-500'
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 text-center italic">
                    Tap "Listen" to hear a sample sentence at the current speed
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Help text */}
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-2">
              <SpeakerIcon size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-700">
                <p className="font-semibold mb-1">Tip for Parents:</p>
                <p>
                  Start with "Slow" or "Steady" for beginning readers. Each word highlights 
                  as it's read aloud. Increase the speed as your child's reading improves!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
