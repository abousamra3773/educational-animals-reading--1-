import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { ShopItem } from '../types';
import { allWearableItems, getShopItemsByType } from '../data/shopData';
import { characters } from '../data/gameData';
import { DetectiveAvatar, DRESS_UP_ZONES, DressUpZone } from './DetectiveAvatar';
import {
  SparklesIcon,
  CheckIcon,
  ShopIcon,
  GlassesIcon,
  HatIcon,
  MagnifyingGlassIcon,
  BugIcon,
  DiceIcon,
  PawPrintIcon,
  XIcon,
  CrownIcon,
  ShoeIcon,
  BackpackIcon,
} from './icons/Icons';

type EquipCategory = 'hat' | 'disguise' | 'accessory' | 'outfit' | 'shoes' | 'gadget' | 'pet';

interface MyDetectiveProps {
  onNavigateToShop: () => void;
  onNavigateToDetectives?: () => void;
}

const categoryTabs: { type: EquipCategory; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { type: 'hat', label: 'Hats', icon: CrownIcon },
  { type: 'disguise', label: 'Disguises', icon: GlassesIcon },
  { type: 'accessory', label: 'Accessories', icon: BackpackIcon },
  { type: 'outfit', label: 'Outfits', icon: HatIcon },
  { type: 'shoes', label: 'Shoes', icon: ShoeIcon },
  { type: 'gadget', label: 'Gadgets', icon: MagnifyingGlassIcon },
  { type: 'pet', label: 'Pets', icon: BugIcon },
];

// Zone label mapping for display
const getZoneLabel = (type: string): string => {
  switch (type) {
    case 'hat': return 'Head';
    case 'disguise': return 'Face';
    case 'accessory': return 'Neck/Back';
    case 'outfit': return 'Body';
    case 'gadget': return 'Hand';
    case 'shoes': return 'Feet';
    case 'pet': return 'Companion';
    default: return 'Item';
  }
};

export const MyDetective: React.FC<MyDetectiveProps> = ({ onNavigateToShop, onNavigateToDetectives }) => {
  const { playerState, updateAvatar } = useGame();
  const [selectedTab, setSelectedTab] = useState<EquipCategory>('hat');
  const [showSparkle, setShowSparkle] = useState(false);
  const [equipAnimItem, setEquipAnimItem] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // Get chosen detective character
  const chosenDetective = useMemo(() => {
    if (!playerState.chosenDetectiveId) return null;
    return characters.find(c => c.id === playerState.chosenDetectiveId) || null;
  }, [playerState.chosenDetectiveId]);

  // Equipped items state - keyed by category
  const [equippedItems, setEquippedItems] = useState<Record<EquipCategory, string[]>>(() => {
    const equipped: Record<EquipCategory, string[]> = {
      hat: [],
      disguise: [],
      accessory: [],
      outfit: [],
      shoes: [],
      gadget: [],
      pet: [],
    };
    if (playerState.avatar?.accessories) {
      playerState.avatar.accessories.forEach(acc => {
        const item = allWearableItems.find(i => i.id === acc);
        if (item && item.type in equipped) {
          equipped[item.type as EquipCategory].push(item.id);
        }
      });
    }
    return equipped;
  });

  // Get all owned wearable items
  const ownedItems = useMemo(() => {
    return allWearableItems.filter(item => playerState.ownedItems.includes(item.id));
  }, [playerState.ownedItems]);

  const ownedByCategory = useMemo(() => {
    return {
      hat: ownedItems.filter(i => i.type === 'hat'),
      disguise: ownedItems.filter(i => i.type === 'disguise'),
      accessory: ownedItems.filter(i => i.type === 'accessory'),
      outfit: ownedItems.filter(i => i.type === 'outfit'),
      shoes: ownedItems.filter(i => i.type === 'shoes'),
      gadget: ownedItems.filter(i => i.type === 'gadget'),
      pet: ownedItems.filter(i => i.type === 'pet'),
    };
  }, [ownedItems]);

  // All equipped item objects for display
  const allEquippedItems = useMemo(() => {
    const ids = Object.values(equippedItems).flat();
    return allWearableItems.filter(i => ids.includes(i.id));
  }, [equippedItems]);

  const isEquipped = (itemId: string) => {
    return Object.values(equippedItems).flat().includes(itemId);
  };

  const handleToggleEquip = (item: ShopItem) => {
    const category = item.type as EquipCategory;
    if (!(category in equippedItems)) return;
    const currentEquipped = equippedItems[category];

    let newEquipped: Record<EquipCategory, string[]>;

    if (category === 'disguise') {
      // Disguises can stack
      if (currentEquipped.includes(item.id)) {
        newEquipped = { ...equippedItems, disguise: currentEquipped.filter(id => id !== item.id) };
      } else {
        newEquipped = { ...equippedItems, disguise: [...currentEquipped, item.id] };
      }
    } else {
      // All other categories: one at a time
      if (currentEquipped.includes(item.id)) {
        newEquipped = { ...equippedItems, [category]: [] };
      } else {
        newEquipped = { ...equippedItems, [category]: [item.id] };
      }
    }

    setEquippedItems(newEquipped);

    // Equip animation
    if (!currentEquipped.includes(item.id)) {
      setEquipAnimItem(item.id);
      setTimeout(() => setEquipAnimItem(null), 700);
    }

    // Update avatar accessories
    const allAccessories = Object.values(newEquipped).flat();
    if (playerState.avatar) {
      updateAvatar({ ...playerState.avatar, accessories: allAccessories });
    }
  };

  const handleSurpriseMe = () => {
    if (ownedItems.length === 0) return;
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 1200);

    const newEquipped: Record<EquipCategory, string[]> = { hat: [], disguise: [], accessory: [], outfit: [], shoes: [], gadget: [], pet: [] };
    (Object.keys(newEquipped) as EquipCategory[]).forEach(cat => {
      const items = ownedByCategory[cat];
      if (items.length > 0) {
        if (cat === 'disguise') {
          const count = Math.min(items.length, Math.floor(Math.random() * 2) + 1);
          const shuffled = [...items].sort(() => Math.random() - 0.5);
          newEquipped.disguise = shuffled.slice(0, count).map(i => i.id);
        } else {
          const randomItem = items[Math.floor(Math.random() * items.length)];
          newEquipped[cat] = [randomItem.id];
        }
      }
    });

    setEquippedItems(newEquipped);
    const allAccessories = Object.values(newEquipped).flat();
    if (playerState.avatar) {
      updateAvatar({ ...playerState.avatar, accessories: allAccessories });
    }
  };

  const handleZoneClick = (zone: DressUpZone) => {
    setActiveZone(zone.id === activeZone ? null : zone.id);
    // Switch to the matching tab
    if (zone.itemType in equippedItems) {
      setSelectedTab(zone.itemType as EquipCategory);
    }
  };

  const handleClearAll = () => {
    const newEquipped: Record<EquipCategory, string[]> = { hat: [], disguise: [], accessory: [], outfit: [], shoes: [], gadget: [], pet: [] };
    setEquippedItems(newEquipped);
    if (playerState.avatar) {
      updateAvatar({ ...playerState.avatar, accessories: [] });
    }
  };

  const currentTabItems = ownedByCategory[selectedTab];

  // If no detective chosen, show prompt
  if (!chosenDetective) {
    return (
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Detective</h2>
            <p className="text-gray-600 text-lg">Customize your detective look!</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 rounded-3xl p-12 text-center shadow-lg">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <MagnifyingGlassIcon size={56} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Detective Chosen Yet!</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Visit the Detectives page to choose your detective partner. Pick from Mabel Mouse, Bella Bunny, Oliver Owl, and more!
            </p>
            {onNavigateToDetectives && (
              <button
                onClick={onNavigateToDetectives}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg text-lg"
              >
                <SparklesIcon size={22} />
                Choose a Detective
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Detective</h2>
          <p className="text-gray-600 text-lg">Dress up your detective like a doll!</p>
        </div>

        {/* Main Dress-Up Area */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left: Full-Body Avatar Display */}
          <div className={`relative bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 rounded-3xl p-6 shadow-lg flex-shrink-0 flex flex-col items-center justify-center overflow-hidden ${showSparkle ? 'animate-pulse' : ''}`}
            style={{ minHeight: '520px', minWidth: '300px' }}>
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            {/* Spotlight effect */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.3) 0%, transparent 60%)'
            }} />

            {/* Stage/platform */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-gradient-to-t from-purple-200/60 to-transparent rounded-[50%]" />

            {/* The Full-Body Avatar */}
            <div className="relative z-10 mt-4">
              <DetectiveAvatar
                character={chosenDetective}
                equippedItems={allEquippedItems}
                size="xl"
                showZones={true}
                activeZone={activeZone}
                onZoneClick={handleZoneClick}
                animatingItemId={equipAnimItem}
                showSparkle={showSparkle}
              />
            </div>

            {/* Character info */}
            <div className="mt-4 text-center z-10">
              <span className="text-sm text-purple-600 font-semibold">{chosenDetective.animal} Detective</span>
            </div>

            {/* Equipped items summary tags */}
            {allEquippedItems.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1.5 mt-3 z-10 max-w-[280px]">
                {allEquippedItems.map(item => (
                  <span key={item.id} className="bg-white/80 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm border border-purple-100">
                    {item.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-3 z-10">Tap zones or items below to dress up!</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 z-10 flex-wrap justify-center">
              <button onClick={handleSurpriseMe} disabled={ownedItems.length === 0}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 font-bold px-4 py-2.5 rounded-xl hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                <DiceIcon size={16} /> Surprise Me!
              </button>
              <button onClick={handleClearAll} disabled={allEquippedItems.length === 0}
                className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 font-bold px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                <XIcon size={16} /> Clear All
              </button>
              <button onClick={onNavigateToShop}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-4 py-2.5 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md text-sm">
                <ShopIcon size={16} /> Shop
              </button>
            </div>
          </div>

          {/* Right: Items Tray / Wardrobe */}
          <div className="flex-1 bg-white rounded-3xl shadow-lg p-5 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Wardrobe</h3>
              <div className="flex items-center gap-2">
                <PawPrintIcon size={16} className="text-amber-500" />
                <span className="text-sm font-bold text-amber-600">{ownedItems.length} items</span>
              </div>
            </div>

            {/* Dress-up zone hint */}
            <div className="bg-purple-50 rounded-2xl p-3 mb-4 border border-purple-100">
              <p className="text-xs text-purple-600 font-semibold text-center">
                <SparklesIcon size={12} className="inline mr-1" />
                Tap items below to equip them, or tap zones on your detective!
              </p>
            </div>

            {ownedItems.length === 0 ? (
              <div className="text-center py-12">
                <ShopIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-semibold mb-2">No items yet!</p>
                <p className="text-gray-400 mb-4">Visit the shop to buy cool detective gear!</p>
                <button onClick={onNavigateToShop}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md">
                  <ShopIcon size={20} /> Go to Shop
                </button>
              </div>
            ) : (
              <>
                {/* Category pill tabs */}
                <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2 flex-wrap">
                  {categoryTabs.map(({ type, label, icon: Icon }) => {
                    const count = ownedByCategory[type].length;
                    const equippedCount = equippedItems[type].length;
                    return (
                      <button key={type} onClick={() => { setSelectedTab(type); setActiveZone(null); }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap transition-all
                          ${selectedTab === type ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}>
                        <Icon size={14} />
                        {label}
                        {count > 0 && (
                          <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${selectedTab === type ? 'bg-white/20' : 'bg-gray-200'}`}>{count}</span>
                        )}
                        {equippedCount > 0 && (
                          <span className="ml-0.5 w-2 h-2 bg-green-400 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Items grid */}
                {currentTabItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No {selectedTab === 'shoes' ? 'shoes' : selectedTab + 's'} owned yet.</p>
                    <button onClick={onNavigateToShop} className="mt-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors text-sm">
                      Browse {selectedTab === 'shoes' ? 'shoes' : selectedTab + 's'} in shop
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentTabItems.map(item => {
                      const equipped = isEquipped(item.id);
                      return (
                        <button key={item.id} onClick={() => handleToggleEquip(item)}
                          className={`rounded-2xl overflow-hidden transition-all duration-300 border-3 relative group
                            ${equipped ? 'border-purple-400 shadow-lg shadow-purple-200 scale-[1.02] ring-2 ring-purple-300/50' : 'border-transparent shadow-md hover:shadow-lg hover:scale-[1.02]'}`}>
                          <div className={`aspect-square p-3 ${equipped ? 'bg-purple-50' : 'bg-gray-50'} relative`}>
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-xl" />
                            {/* Overlay showing where it goes */}
                            <div className={`absolute inset-0 flex items-end justify-center pb-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                              <span className="bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {getZoneLabel(item.type)}
                              </span>
                            </div>
                          </div>
                          <div className={`p-2 text-center ${equipped ? 'bg-purple-100' : 'bg-white'}`}>
                            <p className="text-xs font-bold text-gray-700 truncate">{item.name}</p>
                            <p className={`text-[10px] font-semibold mt-0.5 ${equipped ? 'text-purple-600' : 'text-gray-400'}`}>
                              {equipped ? 'Tap to remove' : 'Tap to wear'}
                            </p>
                          </div>
                          {equipped && (
                            <div className="absolute top-1.5 right-1.5 bg-purple-500 text-white p-1 rounded-full shadow-md">
                              <CheckIcon size={10} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
