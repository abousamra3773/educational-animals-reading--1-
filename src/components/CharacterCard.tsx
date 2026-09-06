import React, { useState } from 'react';
import { Character } from '../types';
import { useGame } from '../context/GameContext';
import { TapToHear } from './TapToHear';
import { SparklesIcon, CheckIcon } from './icons/Icons';

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const { playerState, setChosenDetective } = useGame();

  const isChosen = playerState.chosenDetectiveId === character.id;

  const handleChoose = () => {
    setShowConfirm(true);
  };

  const confirmChoice = () => {
    setChosenDetective(character.id);
    setShowConfirm(false);
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 1500);
  };

  return (
    <div
      className={`
        relative bg-white rounded-3xl overflow-hidden
        shadow-lg hover:shadow-2xl transition-all duration-500
        transform hover:scale-[1.03]
        border-4 ${isChosen ? 'border-amber-400 shadow-amber-200/50' : 'border-white hover:border-purple-200'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* MY DETECTIVE Badge */}
      {isChosen && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
          <CheckIcon size={12} />
          MY DETECTIVE
        </div>
      )}

      {/* Sparkle animation on choose */}
      {showSparkle && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Character Image */}
      <div className={`relative h-56 ${character.color} overflow-hidden`}>
        <img
          src={character.image}
          alt={character.name}
          className={`
            w-full h-full object-cover transition-transform duration-700
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
        />
        
        {/* Sparkle effect on hover */}
        {isHovered && (
          <div className="absolute top-4 right-4 animate-bounce">
            <SparklesIcon className="text-yellow-400" size={28} />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{character.name}</h3>
          <TapToHear text={`Hi! I'm ${character.name}. ${character.personality}`} size="small" />
        </div>

        <div className="mb-3">
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
            {character.animal} Detective
          </span>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-500 font-medium">Specialty:</p>
          <p className="text-sm text-purple-600 font-semibold">{character.specialty}</p>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {character.personality}
        </p>

        {/* Choose This Detective Button */}
        {isChosen ? (
          <div className="w-full py-2.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2">
            <CheckIcon size={16} />
            Your Active Detective
          </div>
        ) : (
          <button
            onClick={handleChoose}
            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg text-sm"
          >
            Choose This Detective
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 rounded-3xl">
          <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-[90%] text-center">
            <img src={character.image} alt={character.name} className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-purple-200 object-cover" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Choose {character.name}?
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Do you want {character.name} as your detective?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmChoice}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md text-sm"
              >
                Yes!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
