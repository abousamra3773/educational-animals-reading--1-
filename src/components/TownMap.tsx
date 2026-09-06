import React, { useState } from 'react';
import { TownLocation, Mystery } from '../types';
import { townLocations, townMapImage } from '../data/townData';
import { useGame } from '../context/GameContext';
import { 
  XIcon, 
  StarIcon, 
  CheckCircleIcon, 
  LockIcon,
  MapPinIcon 
} from './icons/Icons';

interface TownMapProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMystery: (mystery: Mystery) => void;
}

interface LocationCardProps {
  location: TownLocation;
  mysteries: Mystery[];
  completedMysteries: string[];
  onSelectMystery: (mystery: Mystery) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ 
  location, 
  mysteries, 
  completedMysteries,
  onSelectMystery 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const locationMysteries = mysteries.filter(m => 
    location.mysteryIds.includes(m.id)
  );
  
  const completedCount = locationMysteries.filter(m => 
    completedMysteries.includes(m.id)
  ).length;
  
  const isCompleted = completedCount === locationMysteries.length && locationMysteries.length > 0;
  const hasVisited = completedCount > 0;

  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300
        ${isExpanded ? 'ring-2 ring-purple-400' : ''}
        ${isCompleted ? 'ring-2 ring-green-400' : ''}
      `}
    >
      {/* Location Image & Info */}
      <div 
        className="relative cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img 
          src={location.image} 
          alt={location.name}
          className="w-full h-32 object-cover"
        />
        
        {/* Completed Badge */}
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
            <CheckCircleIcon size={20} />
          </div>
        )}
        
        {/* Progress Badge */}
        {!isCompleted && hasVisited && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {completedCount}/{locationMysteries.length}
          </div>
        )}

        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-lg">{location.name}</h3>
          <p className="text-gray-500 text-sm">{location.description}</p>
        </div>
      </div>

      {/* Expanded Mysteries List */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 py-3">Mysteries at this location:</p>
          <div className="space-y-2">
            {locationMysteries.map((mystery) => {
              const isCompleted = completedMysteries.includes(mystery.id);
              return (
                <button
                  key={mystery.id}
                  onClick={() => onSelectMystery(mystery)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl transition-all
                    ${isCompleted 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-purple-50 border border-purple-200 hover:bg-purple-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={mystery.detective.image}
                      alt={mystery.detective.name}
                      className="w-10 h-10 rounded-full border-2 border-white shadow"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{mystery.title}</p>
                      <p className="text-xs text-gray-500">{mystery.wordFamily} words</p>
                    </div>
                  </div>
                  
                  {isCompleted ? (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((i) => (
                        <StarIcon key={i} size={16} filled className="text-yellow-400" />
                      ))}
                    </div>
                  ) : (
                    <span className="text-purple-600 font-semibold text-sm">Play →</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const TownMap: React.FC<TownMapProps> = ({ isOpen, onClose, onSelectMystery }) => {
  const { mysteries, progress } = useGame();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  if (!isOpen) return null;

  const totalMysteries = mysteries.length;
  const completedCount = progress.completedMysteries.length;
  const progressPercent = (completedCount / totalMysteries) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPinIcon size={32} />
              <div>
                <h2 className="text-2xl font-bold">Tangle Tail Town</h2>
                <p className="text-white/80">Level 1 - Explore the village!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XIcon size={28} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-amber-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-white/80 mt-2">
            {completedCount} of {totalMysteries} mysteries solved
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-2 p-4 bg-white/50">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              viewMode === 'list' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Location List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              viewMode === 'map' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Town Map
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {viewMode === 'list' ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {townLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  mysteries={mysteries}
                  completedMysteries={progress.completedMysteries}
                  onSelectMystery={(mystery) => {
                    onSelectMystery(mystery);
                    onClose();
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="relative">
              <img 
                src={townMapImage} 
                alt="Tangle Tail Town Map"
                className="w-full rounded-2xl shadow-lg"
              />
              
              {/* Location Markers */}
              {townLocations.map((location) => {
                const locationMysteries = mysteries.filter(m => 
                  location.mysteryIds.includes(m.id)
                );
                const completedCount = locationMysteries.filter(m => 
                  progress.completedMysteries.includes(m.id)
                ).length;
                const isCompleted = completedCount === locationMysteries.length;

                return (
                  <button
                    key={location.id}
                    className={`
                      absolute transform -translate-x-1/2 -translate-y-1/2
                      p-2 rounded-full shadow-lg transition-all hover:scale-110
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : completedCount > 0
                          ? 'bg-amber-500 text-white'
                          : 'bg-purple-500 text-white'
                      }
                    `}
                    style={{ 
                      left: `${location.position.x}%`, 
                      top: `${location.position.y}%` 
                    }}
                    title={location.name}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon size={24} />
                    ) : (
                      <MapPinIcon size={24} />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/50 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Complete all mysteries to unlock <span className="font-bold text-purple-600">Level 2: Whisker Woods!</span>
          </p>
        </div>
      </div>
    </div>
  );
};
