import React, { useState } from 'react';
import { TapToHear } from '../TapToHear';
import { CheckCircleIcon, XCircleIcon, QuizIcon, SparklesIcon } from '../icons/Icons';

interface ComprehensionQuizProps {
  questions: {
    question: string;
    correctAnswer: string;
    options: string[];
  }[];
  onComplete: (score: number, maxScore: number) => void;
}

export const ComprehensionQuiz: React.FC<ComprehensionQuizProps> = ({
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
    if (selectedAnswer) return;

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

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
          <QuizIcon className="text-indigo-500" size={20} />
          <span className="font-bold text-indigo-700">Reading Quiz</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Let's check what you remember!
        </h2>
        <p className="text-gray-600">
          Answer questions about the story
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}/{currentIndex + (showNext ? 1 : 0)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + (showNext ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-indigo-200">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TapToHear text={currentQuestion.question} size="small" />
          <span className="text-sm text-gray-500">Listen to the question</span>
        </div>
        <p className="text-xl md:text-2xl font-medium text-gray-800 text-center">
          {currentQuestion.question}
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentQuestion.correctAnswer;
          
          let buttonStyle = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50';
          
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
                w-full p-4 rounded-2xl font-semibold text-lg transition-all duration-300
                flex items-center justify-between
                ${buttonStyle}
                ${!selectedAnswer ? 'hover:scale-[1.02] shadow-md hover:shadow-lg cursor-pointer' : 'cursor-default'}
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${selectedAnswer 
                    ? isCorrectAnswer 
                      ? 'bg-green-500 text-white' 
                      : isSelected 
                        ? 'bg-red-400 text-white'
                        : 'bg-gray-200 text-gray-500'
                    : 'bg-indigo-100 text-indigo-600'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
              <div className="flex items-center gap-2">
                {!selectedAnswer && <TapToHear text={option} size="small" />}
                {selectedAnswer && isCorrectAnswer && (
                  <CheckCircleIcon className="text-green-500" size={24} />
                )}
                {selectedAnswer && isSelected && !isCorrectAnswer && (
                  <XCircleIcon className="text-red-400" size={24} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selectedAnswer && (
        <div className={`text-center mb-4 p-4 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-amber-100'}`}>
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2">
              <SparklesIcon className="text-green-500" size={24} />
              <span className="font-bold text-green-700">That's right! Great memory!</span>
              <SparklesIcon className="text-green-500" size={24} />
            </div>
          ) : (
            <p className="font-bold text-amber-700">
              The correct answer is: <span className="text-green-600">{currentQuestion.correctAnswer}</span>
            </p>
          )}
        </div>
      )}

      {/* Next Button */}
      {showNext && (
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            {isLastQuestion ? 'See Results!' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
};
