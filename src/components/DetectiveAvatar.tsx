import React, { useState } from 'react';
import { Character, ShopItem } from '../types';
import { SparklesIcon } from './icons/Icons';

// Positioning map for each item type on the full-body avatar
// Values are percentages relative to the avatar container
interface ItemPosition {
  top: string;
  left: string;
  width: string;
  height: string;
  zIndex: number;
  rotation?: string;
}

const getItemPosition = (item: ShopItem): ItemPosition => {
  // Specific positions per item ID for precise paper-doll placement
  switch (item.id) {
    // HATS — top of head (above disguises)
    case 'hat-detective':
      return { top: '-4%', left: '18%', width: '64%', height: '22%', zIndex: 28 };
    case 'hat-wizard':
      return { top: '-14%', left: '14%', width: '72%', height: '32%', zIndex: 28 };
    case 'hat-crown':
      return { top: '-2%', left: '22%', width: '56%', height: '18%', zIndex: 28 };
    case 'hat-pirate':
      return { top: '-6%', left: '16%', width: '68%', height: '24%', zIndex: 28 };

    // DISGUISES — head/face area
    case 'disguise-moustache':
      return { top: '32%', left: '30%', width: '40%', height: '14%', zIndex: 25 };
    case 'disguise-spyglasses':
      return { top: '22%', left: '22%', width: '56%', height: '16%', zIndex: 26 };
    case 'disguise-wig':
      return { top: '2%', left: '15%', width: '70%', height: '26%', zIndex: 24 };
    case 'disguise-mask':
      return { top: '18%', left: '25%', width: '50%', height: '18%', zIndex: 27 };
    case 'disguise-cloak':
      return { top: '15%', left: '5%', width: '90%', height: '65%', zIndex: 12, rotation: '0deg' };

    // OUTFITS — body area
    case 'outfit-detective':
      return { top: '35%', left: '10%', width: '80%', height: '40%', zIndex: 15 };
    case 'outfit-tuxedo':
      return { top: '35%', left: '12%', width: '76%', height: '38%', zIndex: 15 };
    case 'outfit-explorer':
      return { top: '34%', left: '14%', width: '72%', height: '36%', zIndex: 15 };
    case 'outfit-cape':
      return { top: '25%', left: '0%', width: '100%', height: '55%', zIndex: 11, rotation: '0deg' };

    // ACCESSORIES — various positions
    case 'accessory-scarf':
      return { top: '30%', left: '20%', width: '60%', height: '16%', zIndex: 22 };
    case 'accessory-backpack':
      return { top: '32%', left: '-8%', width: '40%', height: '32%', zIndex: 9, rotation: '5deg' };
    case 'accessory-badge':
      return { top: '42%', left: '18%', width: '22%', height: '14%', zIndex: 23 };
    case 'accessory-bowtie':
      return { top: '33%', left: '32%', width: '36%', height: '12%', zIndex: 22 };

    // GADGETS — right hand area
    case 'gadget-magnifying':
      return { top: '45%', left: '68%', width: '32%', height: '22%', zIndex: 30, rotation: '-15deg' };
    case 'gadget-spyglass':
      return { top: '40%', left: '65%', width: '36%', height: '18%', zIndex: 30, rotation: '-20deg' };
    case 'gadget-notebook':
      return { top: '50%', left: '65%', width: '30%', height: '20%', zIndex: 30, rotation: '5deg' };
    case 'gadget-decoder':
      return { top: '48%', left: '70%', width: '26%', height: '16%', zIndex: 30 };

    // SHOES — feet area
    case 'shoes-sneakers':
      return { top: '82%', left: '14%', width: '72%', height: '18%', zIndex: 20 };
    case 'shoes-boots':
      return { top: '78%', left: '12%', width: '76%', height: '22%', zIndex: 20 };
    case 'shoes-slippers':
      return { top: '84%', left: '16%', width: '68%', height: '16%', zIndex: 20 };
    case 'shoes-rollerskates':
      return { top: '80%', left: '10%', width: '80%', height: '22%', zIndex: 20 };

    // PETS — bottom left companion area
    case 'pet-butterfly':
      return { top: '10%', left: '-10%', width: '30%', height: '20%', zIndex: 35, rotation: '-10deg' };
    case 'pet-firefly':
      return { top: '5%', left: '-8%', width: '25%', height: '18%', zIndex: 35 };
    case 'pet-dragonfly':
      return { top: '8%', left: '-12%', width: '28%', height: '18%', zIndex: 35, rotation: '5deg' };

    default:
      // Fallback positions by type
      if (item.type === 'hat') return { top: '-4%', left: '18%', width: '64%', height: '22%', zIndex: 28 };
      if (item.type === 'disguise') return { top: '15%', left: '20%', width: '60%', height: '20%', zIndex: 25 };
      if (item.type === 'accessory') return { top: '32%', left: '20%', width: '60%', height: '16%', zIndex: 22 };
      if (item.type === 'outfit') return { top: '35%', left: '10%', width: '80%', height: '40%', zIndex: 15 };
      if (item.type === 'gadget') return { top: '45%', left: '65%', width: '32%', height: '22%', zIndex: 30 };
      if (item.type === 'shoes') return { top: '82%', left: '14%', width: '72%', height: '18%', zIndex: 20 };
      if (item.type === 'pet') return { top: '10%', left: '-10%', width: '28%', height: '20%', zIndex: 35 };
      return { top: '30%', left: '30%', width: '40%', height: '30%', zIndex: 20 };
  }
};

// Zone label mapping for item types
const getZoneLabel = (type: string): string => {
  switch (type) {
    case 'hat': return 'Hat';
    case 'disguise': return 'Face';
    case 'accessory': return 'Accessory';
    case 'outfit': return 'Body';
    case 'gadget': return 'Hand';
    case 'shoes': return 'Feet';
    case 'pet': return 'Pet';
    default: return 'Item';
  }
};

// Dress-up zone definitions for interactive highlights
export interface DressUpZone {
  id: string;
  label: string;
  itemType: 'hat' | 'disguise' | 'outfit' | 'gadget' | 'pet' | 'shoes' | 'accessory';
  top: string;
  left: string;
  width: string;
  height: string;
}

export const DRESS_UP_ZONES: DressUpZone[] = [
  { id: 'hat', label: 'Hat', itemType: 'hat', top: '-6%', left: '16%', width: '68%', height: '22%' },
  { id: 'head', label: 'Face', itemType: 'disguise', top: '14%', left: '18%', width: '64%', height: '22%' },
  { id: 'accessory', label: 'Accessory', itemType: 'accessory', top: '30%', left: '15%', width: '70%', height: '14%' },
  { id: 'body', label: 'Body', itemType: 'outfit', top: '38%', left: '10%', width: '80%', height: '32%' },
  { id: 'hand', label: 'Hand', itemType: 'gadget', top: '40%', left: '65%', width: '35%', height: '28%' },
  { id: 'feet', label: 'Feet', itemType: 'shoes', top: '78%', left: '10%', width: '80%', height: '22%' },
  { id: 'companion', label: 'Pet', itemType: 'pet', top: '2%', left: '-12%', width: '35%', height: '25%' },
];

interface DetectiveAvatarProps {
  character: Character;
  equippedItems: ShopItem[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showZones?: boolean;
  activeZone?: string | null;
  onZoneClick?: (zone: DressUpZone) => void;
  animatingItemId?: string | null;
  showSparkle?: boolean;
  className?: string;
  idleAnimation?: boolean;
}

export const DetectiveAvatar: React.FC<DetectiveAvatarProps> = ({
  character,
  equippedItems,
  size = 'lg',
  showZones = false,
  activeZone = null,
  onZoneClick,
  animatingItemId = null,
  showSparkle = false,
  className = '',
  idleAnimation = true,
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'w-28 h-40',
    md: 'w-40 h-56',
    lg: 'w-56 h-80',
    xl: 'w-72 h-[420px]',
  };

  const avatarImage = character.fullBodyImage || character.image;

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Sparkle overlay */}
      {showSparkle && (
        <div className="absolute inset-0 z-[50] pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.6}s`, animationDuration: `${0.4 + Math.random() * 0.4}s`,
            }} />
          ))}
        </div>
      )}

      {/* Shadow under character */}
      <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[60%] h-[6%] bg-black/15 rounded-[50%] blur-sm" />

      {/* Base character - full body image */}
      <div className={`absolute inset-0 z-[10] ${idleAnimation ? 'animate-avatar-idle' : ''}`}>
        <img
          src={avatarImage}
          alt={character.name}
          className="w-full h-full object-contain drop-shadow-xl"
          draggable={false}
        />
      </div>

      {/* Equipped items layered on top */}
      {equippedItems.map((item) => {
        const pos = getItemPosition(item);
        const isAnimating = animatingItemId === item.id;
        return (
          <div
            key={item.id}
            className={`absolute transition-all duration-500 ${isAnimating ? 'animate-equip-bounce' : ''} ${idleAnimation ? 'animate-avatar-idle' : ''}`}
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              height: pos.height,
              zIndex: pos.zIndex,
              transform: pos.rotation ? `rotate(${pos.rotation})` : undefined,
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain drop-shadow-lg"
              style={{ filter: item.type === 'outfit' || item.type === 'disguise' || item.type === 'hat' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : undefined }}
              draggable={false}
            />
            {/* Glow effect for newly equipped items */}
            {isAnimating && (
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md animate-ping" />
            )}
          </div>
        );
      })}

      {/* Interactive dress-up zones (shown when editing) */}
      {showZones && DRESS_UP_ZONES.map((zone) => {
        const isActive = activeZone === zone.id;
        const hasItem = equippedItems.some(i => i.type === zone.itemType);
        return (
          <button
            key={zone.id}
            onClick={() => onZoneClick?.(zone)}
            className={`absolute rounded-2xl transition-all duration-300 border-2 border-dashed cursor-pointer group
              ${isActive
                ? 'border-purple-400 bg-purple-400/15 shadow-lg shadow-purple-400/20'
                : hasItem
                  ? 'border-transparent hover:border-purple-300/50 hover:bg-purple-300/5'
                  : 'border-white/20 hover:border-purple-300/50 hover:bg-purple-300/10 animate-pulse'
              }`}
            style={{
              top: zone.top,
              left: zone.left,
              width: zone.width,
              height: zone.height,
              zIndex: 40,
              animationDuration: hasItem ? undefined : '2s',
            }}
          >
            {!hasItem && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-purple-600">{zone.label}</span>
                </div>
              </div>
            )}
            {isActive && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md">
                {zone.label}
              </div>
            )}
          </button>
        );
      })}

      {/* Name tag */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-[45]">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1">
          <SparklesIcon size={10} />
          {character.name}
        </div>
      </div>
    </div>
  );
};
