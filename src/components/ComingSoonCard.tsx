import React from 'react';
import { ComingSoonLesson } from '../types';
import { SparklesIcon } from './icons/Icons';

interface ComingSoonCardProps {
  lesson: ComingSoonLesson;
}

export const ComingSoonCard: React.FC<ComingSoonCardProps> = ({ lesson }) => {
  return (
    <div
      aria-disabled="true"
      role="listitem"
      className="
        relative w-full bg-white/70 rounded-3xl overflow-hidden
        shadow-md border-4 border-dashed border-gray-200
        text-left opacity-80 cursor-not-allowed select-none
      "
    >
      {/* Coming Soon badge */}
      <div className="absolute top-4 right-4 z-10 bg-gray-400 text-white px-3 py-1 rounded-full shadow text-xs font-bold uppercase tracking-wide">
        Coming Soon
      </div>

      {/* Header area (greyed, no detective art) */}
      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center text-gray-400">
          <SparklesIcon size={32} />
        </div>

        {/* Word family badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow">
          <span className="font-bold text-gray-500 text-lg">{lesson.wordFamily}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-500">{lesson.title}</h3>
        </div>

        <p className="text-gray-500 font-medium text-sm mb-2 italic">{lesson.group}</p>

        <p className="text-gray-400 text-sm mb-4">
          A new mystery for this word family is on the way. Check back soon!
        </p>

        <div className="flex items-center justify-end">
          <span className="text-sm font-semibold text-gray-400">Not ready yet</span>
        </div>
      </div>
    </div>
  );
};
