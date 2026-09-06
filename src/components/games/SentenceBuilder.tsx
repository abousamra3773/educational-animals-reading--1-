import React, { useState, useEffect } from 'react';
import { TapToHear } from '../TapToHear';
import { CheckCircleIcon, RefreshIcon, SparklesIcon } from '../icons/Icons';

interface SentenceBuilderProps {
  originalSentence: string;
  onComplete: (score: number, maxScore: number) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  originalSentence,
  onComplete,
}) => {
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Clean and split the sentence into words
    const words = originalSentence
      .replace(/[.,!?]/g, '')
      .split(' ')
      .filter(w => w.length > 0);
    // Shuffle the words
    setAvailableWords(words.sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsCorrect(null);
  }, [originalSentence]);

  const handleWordSelect = (word: string, index: number) => {
    // Remove from available and add to selected
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
    setSelectedWords([...selectedWords, word]);
    setIsCorrect(null);
  };

  const handleWordDeselect = (word: string, index: number) => {
    // Remove from selected and add back to available
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
    setIsCorrect(null);
  };

  const handleCheck = () => {
    const builtSentence = selectedWords.join(' ');
    const cleanOriginal = originalSentence.replace(/[.,!?]/g, '');
    const correct = builtSentence.toLowerCase() === cleanOriginal.toLowerCase();
    setIsCorrect(correct);
    setAttempts(prev => prev + 1);

    if (correct) {
      setTimeout(() => {
        // Score based on attempts: 3 points for first try, 2 for second, 1 for third+
        const score = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
        onComplete(score, 3);
      }, 1500);
    }
  };

  const handleReset = () => {
    const words = originalSentence
      .replace(/[.,!?]/g, '')
      .split(' ')
      .filter(w => w.length > 0);
    setAvailableWords(words.sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsCorrect(null);
  };

  const canCheck = availableWords.length === 0 && selectedWords.length > 0;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-full mb-4">
          <SparklesIcon className="text-teal-500" size={20} />
          <span className="font-bold text-teal-700">Sentence Builder</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Build the sentence!
        </h2>
        <p className="text-gray-600">
          Put the words in the right order to make a sentence
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <TapToHear 
            text="Put the words in the correct order to build the sentence from the story."
            size="small"
          />
        </div>
      </div>

      {/* Selected Words Area (Sentence being built) */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Your sentence:</p>
        <div 
          className={`
            min-h-20 p-4 rounded-2xl border-2 border-dashed transition-all duration-300
            ${isCorrect === true 
              ? 'border-green-400 bg-green-50' 
              : isCorrect === false 
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50'
            }
          `}
        >
          {selectedWords.length === 0 ? (
            <p className="text-gray-400 text-center">Tap words below to build your sentence</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <button
                  key={`selected-${index}`}
                  onClick={() => handleWordDeselect(word, index)}
                  disabled={isCorrect === true}
                  className={`
                    px-4 py-2 rounded-xl font-semibold transition-all duration-200
                    ${isCorrect === true
                      ? 'bg-green-200 text-green-800 cursor-default'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-105 cursor-pointer'
                    }
                  `}
                >
                  {word}
                </button>
              ))}
              {isCorrect === true && <span className="text-2xl">.</span>}
            </div>
          )}
        </div>
      </div>

      {/* Available Words */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Available words:</p>
        <div className="min-h-16 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          {availableWords.length === 0 ? (
            <p className="text-amber-600 text-center">All words used! Check your sentence.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableWords.map((word, index) => (
                <button
                  key={`available-${index}`}
                  onClick={() => handleWordSelect(word, index)}
                  className="px-4 py-2 bg-white rounded-xl font-semibold text-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {word}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      {isCorrect !== null && (
        <div className={`text-center mb-4 p-3 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="text-green-500" size={24} />
              <span className="font-bold text-green-700">Perfect! That's the correct sentence!</span>
            </div>
          ) : (
            <div>
              <p className="font-bold text-red-700 mb-1">Not quite right. Try again!</p>
              <p className="text-red-600 text-sm">Tap words to move them back and rearrange.</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleReset}
          disabled={isCorrect === true}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          <RefreshIcon size={20} />
          Reset
        </button>
        <button
          onClick={handleCheck}
          disabled={!canCheck || isCorrect === true}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
            ${canCheck && isCorrect !== true
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <CheckCircleIcon size={20} />
          Check
        </button>
      </div>

      {/* Hint after failed attempts */}
      {attempts >= 2 && isCorrect === false && (
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            Hint: The sentence starts with "{originalSentence.split(' ')[0]}"
          </p>
        </div>
      )}
    </div>
  );
};
