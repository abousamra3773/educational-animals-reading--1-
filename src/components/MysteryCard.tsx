import React from 'react';
import { Mystery } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { StarIcon, CheckIcon, MagnifyingGlassIcon } from './icons/Icons';

interface MysteryCardProps {
  mystery: Mystery;
  onClick: () => void;
}

export const MysteryCard: React.FC<MysteryCardProps> = ({ mystery, onClick }) => {
  const { isSpanish, t } = useLanguage();

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    hard: 'bg-rose-100 text-rose-700 border-rose-200'
  };

  const difficultyLabels = {
    easy: t('mystery.easy'),
    medium: t('mystery.medium'),
    hard: t('mystery.hard')
  };

  // In Spanish mode, show "Vocabulario" badge instead of word family
  const badgeLabel = isSpanish ? 'Vocabulario' : mystery.wordFamily;
  const badgeColor = isSpanish 
    ? 'font-bold text-emerald-700 text-sm' 
    : 'font-bold text-purple-700 text-lg';
  const badgeBg = isSpanish
    ? 'bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5'
    : 'bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md';

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full bg-white rounded-3xl overflow-hidden
        shadow-lg hover:shadow-2xl transition-all duration-300
        transform hover:scale-[1.02] hover:-translate-y-1
        border-4 ${mystery.completed ? 'border-green-300' : isSpanish ? 'border-emerald-100' : 'border-purple-100'}
        text-left
      `}
    >
      {/* Completed Badge */}
      {mystery.completed && (
        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white p-2 rounded-full shadow-lg">
          <CheckIcon size={20} />
        </div>
      )}

      {/* Spanish mode indicator */}
      {isSpanish && (
        <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-lg text-xs font-bold flex items-center gap-1">
          <span>🇪🇸</span>
          <span>ES</span>
        </div>
      )}

      {/* Detective Image */}
      <div className={`relative h-40 ${mystery.detective.color} overflow-hidden`}>
        <img
          src={mystery.detective.image}
          alt={mystery.detective.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Badge */}
        <div className={`absolute bottom-3 left-3 ${badgeBg}`}>
          {isSpanish && (
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
          <span className={badgeColor}>{badgeLabel}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
            {mystery.title}
          </h3>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex-shrink-0 ${difficultyColors[mystery.difficulty]}`}>
            {difficultyLabels[mystery.difficulty]}
          </span>
        </div>

        {/* Tagline */}
        {mystery.tagline && (
          <p className="text-purple-600 font-medium text-sm mb-2 italic">
            {mystery.tagline}
          </p>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {mystery.description}
        </p>

        {/* Detective Info */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-200">
            <img src={mystery.detective.image} alt={mystery.detective.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-sm text-gray-500">{t('mystery.with')} {mystery.detective.name}</span>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {[1, 2, 3].map((star) => (
              <StarIcon
                key={star}
                size={20}
                filled={mystery.completed && star <= 3}
                className={mystery.completed ? 'text-yellow-400' : 'text-gray-200'}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:text-purple-700">
            <MagnifyingGlassIcon size={18} />
            <span>{mystery.completed ? t('mystery.playAgain') : t('mystery.startCase')}</span>
          </div>
        </div>
      </div>
    </button>
  );
};
