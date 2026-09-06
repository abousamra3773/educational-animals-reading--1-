import React, { useState } from 'react';
import { TapToHear } from '../TapToHear';
import { CheckCircleIcon, XCircleIcon, SparklesIcon } from '../icons/Icons';

interface ChooseRightWordProps {
  questions: {
    sentence: string;
    blank: string;
    correctAnswer: string;
    options: string[];
  }[];
  onComplete: (score: number, maxScore: number) => void;
}

export const ChooseRightWord: React.FC<ChooseRightWordProps> = ({
  questions,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showNext, setShowNext] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectAnswer = (answer: string) => {
    if (selectedAnswer) return; // Already answered

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    }

    setShowNext(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score, questions.length);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowNext(false);
    }
  };

  // Replace blank with underline in sentence
  const displaySentence = currentQuestion.sentence.replace('_____', '______');

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
          <SparklesIcon className="text-amber-500" size={20} />
          <span className="font-bold text-amber-700">Choose the Right Word</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Fill in the blank!
        </h2>
        <p className="text-gray-600">
          Pick the word that makes sense in the sentence
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + (showNext ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-amber-200">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TapToHear 
            text={currentQuestion.sentence.replace('_____', currentQuestion.correctAnswer)}
            size="small"
          />
          <span className="text-sm text-gray-500">Listen to the sentence</span>
        </div>
        <p className="text-xl md:text-2xl font-medium text-gray-800 text-center leading-relaxed">
          {displaySentence}
        </p>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentQuestion.correctAnswer;
          
          let buttonStyle = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-400 hover:bg-amber-50';
          
          if (selectedAnswer) {
            if (isCorrectAnswer) {
              buttonStyle = 'bg-green-100 border-2 border-green-400 text-green-700';
            } else if (isSelected && !isCorrectAnswer) {
              buttonStyle = 'bg-red-100 border-2 border-red-300 text-red-600';
            } else {
              buttonStyle = 'bg-gray-50 border-2 border-gray-200 text-gray-400';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={!!selectedAnswer}
              className={`
                relative p-4 rounded-2xl font-bold text-lg transition-all duration-300
                ${buttonStyle}
                ${!selectedAnswer ? 'hover:scale-105 shadow-md hover:shadow-lg cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className="flex items-center justify-center gap-2">
                {option}
                {selectedAnswer && isCorrectAnswer && (
                  <CheckCircleIcon className="text-green-500" size={20} />
                )}
                {selectedAnswer && isSelected && !isCorrectAnswer && (
                  <XCircleIcon className="text-red-400" size={20} />
                )}
              </span>
              {!selectedAnswer && (
                <div className="absolute -top-1 -right-1">
                  <TapToHear text={option} size="small" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selectedAnswer && (
        <div className={`text-center mb-4 p-4 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-amber-100'}`}>
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="text-green-500" size={24} />
              <span className="font-bold text-green-700">Correct! Great job!</span>
            </div>
          ) : (
            <div>
              <p className="font-bold text-amber-700">
                The correct answer is: <span className="text-green-600">{currentQuestion.correctAnswer}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Next Button */}
      {showNext && (
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            {isLastQuestion ? 'Finish!' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};
