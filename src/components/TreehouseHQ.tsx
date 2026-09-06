import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { shopItems, getShopItemById, allWearableItems } from '../data/shopData';

import { backdrops, getEvolutionTier, getNextTier, HQ_STORAGE_KEYS, Backdrop } from '../data/hqData';
import { mysteries as allMysteries, characters } from '../data/gameData';
import { OutdoorPlacements, OutdoorZone } from '../types';
import { TreehouseFullView } from './TreehouseFullView';
import { DetectiveAvatar } from './DetectiveAvatar';
import {

  SparklesIcon,
  StarIcon,
  PlusIcon,
  CheckIcon,
  LockIcon,
  PawPrintIcon,
  ShopIcon,
  BadgeIcon,
  MagnifyingGlassIcon,
  XIcon,
  HeartIcon,
  WrenchIcon,
  BugIcon,
  ImageIcon,
} from './icons/Icons';

type ActivePanel = null | 'backdrop' | 'toolbench' | 'pet' | 'detective' | 'caseboard';

interface TreehouseHQProps {
  onNavigateToShop: () => void;
  onNavigateToMyDetective: () => void;
}

const defaultOutdoorPlacements: OutdoorPlacements = { garden: [], tree: [], doorstep: [], sky: [], pathway: [] };

export const TreehouseHQ: React.FC<TreehouseHQProps> = ({ onNavigateToShop, onNavigateToMyDetective }) => {
  const { playerState, progress, purchaseItem, addCoins } = useGame();

  const chosenDetective = useMemo(() => {
    if (!playerState.chosenDetectiveId) return null;
    return characters.find(c => c.id === playerState.chosenDetectiveId) || null;
  }, [playerState.chosenDetectiveId]);

  const totalEarned = useMemo(() => {
    const base = 45;
    const mysteryCoins = progress.completedMysteries.length * 10;
    const perfectGames = playerState.gameScores.filter(s => s.score === s.maxScore).length * 5;
    return base + mysteryCoins + perfectGames;
  }, [progress.completedMysteries.length, playerState.gameScores]);

  const currentTier = useMemo(() => getEvolutionTier(totalEarned), [totalEarned]);
  const nextTier = useMemo(() => getNextTier(totalEarned), [totalEarned]);

  // HQ State from localStorage
  const [selectedBackdrop, setSelectedBackdrop] = useState<string>(() => localStorage.getItem(HQ_STORAGE_KEYS.BACKDROP) || 'enchanted-forest');
  const [benchGadgets, setBenchGadgets] = useState<string[]>(() => {
    const saved = localStorage.getItem(HQ_STORAGE_KEYS.BENCH_GADGETS);
    return saved ? JSON.parse(saved) : [];
  });
  const [ownedBackdrops, setOwnedBackdrops] = useState<string[]>(() => {
    const saved = localStorage.getItem(HQ_STORAGE_KEYS.OWNED_BACKDROPS);
    return saved ? JSON.parse(saved) : ['enchanted-forest'];
  });
  const [evolutionSeen, setEvolutionSeen] = useState<string[]>(() => {
    const saved = localStorage.getItem(HQ_STORAGE_KEYS.EVOLUTION_SEEN);
    return saved ? JSON.parse(saved) : [];
  });
  const [outdoorPlacements, setOutdoorPlacements] = useState<OutdoorPlacements>(() => {
    const saved = localStorage.getItem(HQ_STORAGE_KEYS.OUTDOOR_PLACEMENTS);
    return saved ? JSON.parse(saved) : defaultOutdoorPlacements;
  });

  // UI State
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [showEvolutionAnim, setShowEvolutionAnim] = useState(false);
  const [petAnimating, setPetAnimating] = useState(false);
  const [gadgetAnimating, setGadgetAnimating] = useState<string | null>(null);
  const [selectedCaseCard, setSelectedCaseCard] = useState<string | null>(null);
  const [confirmBackdrop, setConfirmBackdrop] = useState<Backdrop | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [windowZoomAnim, setWindowZoomAnim] = useState(false);

  // Save to localStorage
  useEffect(() => { localStorage.setItem(HQ_STORAGE_KEYS.BACKDROP, selectedBackdrop); }, [selectedBackdrop]);
  useEffect(() => { localStorage.setItem(HQ_STORAGE_KEYS.BENCH_GADGETS, JSON.stringify(benchGadgets)); }, [benchGadgets]);
  useEffect(() => { localStorage.setItem(HQ_STORAGE_KEYS.OWNED_BACKDROPS, JSON.stringify(ownedBackdrops)); }, [ownedBackdrops]);
  useEffect(() => { localStorage.setItem(HQ_STORAGE_KEYS.EVOLUTION_SEEN, JSON.stringify(evolutionSeen)); }, [evolutionSeen]);
  useEffect(() => { localStorage.setItem(HQ_STORAGE_KEYS.OUTDOOR_PLACEMENTS, JSON.stringify(outdoorPlacements)); }, [outdoorPlacements]);

  useEffect(() => {
    if (!evolutionSeen.includes(currentTier.id) && currentTier.id !== 'rookie') {
      setShowEvolutionAnim(true);
      setEvolutionSeen(prev => [...prev, currentTier.id]);
      setTimeout(() => setShowEvolutionAnim(false), 4000);
    }
  }, [currentTier.id, evolutionSeen]);

  const currentBackdrop = useMemo(() => backdrops.find(b => b.id === selectedBackdrop) || backdrops[0], [selectedBackdrop]);

  const equippedItems = useMemo(() => {
    const accessories = playerState.avatar?.accessories || [];
    return accessories.map(id => allWearableItems.find(i => i.id === id) || shopItems.find(i => i.id === id)).filter(Boolean);
  }, [playerState.avatar]);


  const equippedPet = useMemo(() => equippedItems.find(i => i && i.type === 'pet'), [equippedItems]);
  const equippedOutfit = useMemo(() => equippedItems.find(i => i && i.type === 'outfit'), [equippedItems]);
  const equippedDisguises = useMemo(() => equippedItems.filter(i => i && i.type === 'disguise'), [equippedItems]);
  const ownedGadgets = useMemo(() => shopItems.filter(i => i.type === 'gadget' && playerState.ownedItems.includes(i.id)), [playerState.ownedItems]);
  const completedMysteryData = useMemo(() => progress.completedMysteries.map(id => allMysteries.find(m => m.id === id)).filter(Boolean), [progress.completedMysteries]);

  const handleBackdropPurchase = (backdrop: Backdrop) => {
    if (ownedBackdrops.includes(backdrop.id)) { setSelectedBackdrop(backdrop.id); return; }
    if (backdrop.price === 0) { setOwnedBackdrops(prev => [...prev, backdrop.id]); setSelectedBackdrop(backdrop.id); return; }
    setConfirmBackdrop(backdrop);
  };

  const confirmBackdropPurchase = () => {
    if (!confirmBackdrop) return;
    if (playerState.coins >= confirmBackdrop.price) {
      const success = purchaseItem(`backdrop-${confirmBackdrop.id}`, confirmBackdrop.price);
      if (success) { setOwnedBackdrops(prev => [...prev, confirmBackdrop.id]); setSelectedBackdrop(confirmBackdrop.id); }
    }
    setConfirmBackdrop(null);
  };

  const toggleBenchGadget = (gadgetId: string) => {
    setBenchGadgets(prev => {
      if (prev.includes(gadgetId)) return prev.filter(id => id !== gadgetId);
      if (prev.length >= 3) return [...prev.slice(1), gadgetId];
      return [...prev, gadgetId];
    });
  };

  const handleGadgetClick = (gadgetId: string) => { setGadgetAnimating(gadgetId); setTimeout(() => setGadgetAnimating(null), 800); };
  const handlePetTap = () => { if (equippedPet) { setPetAnimating(true); setTimeout(() => setPetAnimating(false), 1200); } };

  const handleWindowClick = () => { setWindowZoomAnim(true); setTimeout(() => { setShowFullView(true); setWindowZoomAnim(false); }, 400); };

  const handlePlaceOutdoorItem = (zone: OutdoorZone, itemId: string) => {
    setOutdoorPlacements(prev => ({ ...prev, [zone]: [...(prev[zone] || []), itemId] }));
  };

  const handleRemoveOutdoorItem = (zone: OutdoorZone, itemId: string) => {
    setOutdoorPlacements(prev => ({ ...prev, [zone]: (prev[zone] || []).filter(id => id !== itemId) }));
  };

  const tierLevel = currentTier.id === 'rookie' ? 0 : currentTier.id === 'junior' ? 1 : currentTier.id === 'super-sleuth' ? 2 : 3;

  if (showFullView) {
    return (
      <TreehouseFullView
        onClose={() => setShowFullView(false)}
        onNavigateToMyDetective={onNavigateToMyDetective}
        onNavigateToShop={onNavigateToShop}
        selectedBackdrop={selectedBackdrop}
        benchGadgets={benchGadgets}
        onToggleBenchGadget={toggleBenchGadget}
        outdoorPlacements={outdoorPlacements}
        onPlaceOutdoorItem={handlePlaceOutdoorItem}
        onRemoveOutdoorItem={handleRemoveOutdoorItem}
      />
    );
  }

  return (
    <section className="py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              My HQ
              <span className="text-lg font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: currentTier.color + '20', color: currentTier.color }}>{currentTier.name}</span>
            </h2>
            <p className="text-gray-500 mt-1">The Hidden Forest Treehouse</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white" style={{ background: `linear-gradient(135deg, ${currentTier.color}, ${currentTier.color}88)` }}>
              <BadgeIcon size={28} className="text-white" />
            </div>
            <span className="text-xs font-bold mt-1" style={{ color: currentTier.color }}>{currentTier.name}</span>
            {nextTier && <span className="text-[10px] text-gray-400">{nextTier.minPoints - totalEarned} pts to next</span>}
          </div>
        </div>

        {/* Evolution Progress Bar */}
        {nextTier && (
          <div className="mb-6 bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">HQ Level Progress</span>
              <span className="text-sm font-bold" style={{ color: currentTier.color }}>{totalEarned} / {nextTier.minPoints} pts</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, ((totalEarned - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100)}%`, background: `linear-gradient(90deg, ${currentTier.color}, ${currentTier.color}aa)` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Next: {nextTier.name} — {nextTier.features.join(', ')}</p>
          </div>
        )}

        {/* === TREEHOUSE ROOM === */}
        <div className={`relative bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${windowZoomAnim ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`} style={{ minHeight: '520px' }}>
          {showEvolutionAnim && (
            <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center">
              <div className="bg-white rounded-3xl p-8 text-center animate-bounce shadow-2xl max-w-sm mx-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${currentTier.color}, ${currentTier.color}88)` }}>
                  <SparklesIcon size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">HQ Level Up!</h3>
                <p className="text-gray-600 mb-1">Your treehouse evolved to</p>
                <p className="text-xl font-bold" style={{ color: currentTier.color }}>{currentTier.name}</p>
                <button onClick={() => setShowEvolutionAnim(false)} className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl">Amazing!</button>
              </div>
            </div>
          )}

          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 21px)' }} />

          {tierLevel >= 1 && (
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center gap-8 z-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/50" style={{ animation: `pulse ${1.5 + Math.random()}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
              ))}
              <div className="absolute top-3 left-4 right-4 h-px bg-amber-600/40" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-950 to-amber-800 z-[1]">
            {tierLevel >= 1 && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-purple-400/60 rounded-full blur-sm" />}
          </div>

          {/* Window */}
          <button onClick={handleWindowClick} onMouseEnter={() => setHoveredZone('window')} onMouseLeave={() => setHoveredZone(null)}
            className={`absolute top-8 left-1/2 -translate-x-1/2 w-[55%] h-[45%] rounded-2xl overflow-hidden z-10 transition-all duration-300 ${hoveredZone === 'window' ? 'ring-4 ring-yellow-400/60 shadow-xl shadow-yellow-400/20 scale-[1.03]' : ''}`}>
            <img src={currentBackdrop.image} alt={currentBackdrop.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-8 border-amber-600 rounded-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-amber-600 -translate-y-1/2 pointer-events-none" />
            <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-amber-600 -translate-x-1/2 pointer-events-none" />
            {tierLevel >= 1 && (<><div className="absolute top-0 left-0 w-6 h-full bg-gradient-to-r from-purple-400/40 to-transparent pointer-events-none" /><div className="absolute top-0 right-0 w-6 h-full bg-gradient-to-l from-purple-400/40 to-transparent pointer-events-none" /></>)}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all">
              <div className={`bg-white/90 backdrop-blur-sm text-gray-800 text-xs md:text-sm font-bold px-4 py-2 rounded-full shadow-lg transition-all ${hoveredZone === 'window' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                <SparklesIcon size={14} className="inline mr-1 text-purple-500" /> Click to Enter Treehouse
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              <ImageIcon size={12} className="inline mr-1" /> {currentBackdrop.name}
            </div>
          </button>

          {/* Detective */}
          <button onClick={onNavigateToMyDetective} onMouseEnter={() => setHoveredZone('detective')} onMouseLeave={() => setHoveredZone(null)}
            className={`absolute left-4 md:left-8 top-[30%] w-24 md:w-32 h-36 md:h-44 z-10 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${hoveredZone === 'detective' ? 'ring-4 ring-purple-400/60 shadow-xl shadow-purple-400/20 scale-105' : ''}`}>
            {chosenDetective ? (
              <div className="w-20 md:w-28 h-28 md:h-36 bg-gradient-to-b from-amber-500 to-amber-700 rounded-xl p-1.5 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                  <img src={chosenDetective.image} alt={chosenDetective.name} className="w-16 md:w-20 h-16 md:h-20 object-cover rounded-full border-2 border-white shadow-md" />
                  {equippedOutfit && <img src={equippedOutfit.image} alt="" className="absolute bottom-0 w-10 h-8 object-contain opacity-80" />}
                  <span className="text-[8px] md:text-[10px] font-bold text-purple-700 mt-0.5 truncate w-full text-center px-1">{chosenDetective.name}</span>
                </div>
              </div>
            ) : (
              <div className="w-20 md:w-28 h-28 md:h-36 bg-gradient-to-b from-amber-500 to-amber-700 rounded-xl p-1.5 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-purple-200/50 flex items-center justify-center animate-pulse"><PlusIcon size={20} className="text-purple-400" /></div>
                  <span className="text-[8px] text-purple-500 font-semibold mt-1">Choose Detective</span>
                </div>
              </div>
            )}
            <span className="text-[10px] md:text-xs font-bold text-white mt-1 bg-black/30 px-2 py-0.5 rounded-full">My Detective</span>
          </button>

          {/* Tool Bench */}
          <button onClick={() => setActivePanel(activePanel === 'toolbench' ? null : 'toolbench')} onMouseEnter={() => setHoveredZone('toolbench')} onMouseLeave={() => setHoveredZone(null)}
            className={`absolute right-4 md:right-8 top-[30%] w-28 md:w-36 h-36 md:h-44 z-10 flex flex-col items-center justify-end rounded-2xl transition-all duration-300 ${hoveredZone === 'toolbench' ? 'ring-4 ring-amber-400/60 shadow-xl shadow-amber-400/20 scale-105' : ''}`}>
            <div className="w-full h-20 md:h-24 bg-gradient-to-b from-amber-600 to-amber-800 rounded-xl shadow-lg relative border-2 border-amber-500/30">
              <div className="absolute -top-1 left-0 right-0 h-3 bg-amber-500 rounded-t-xl" />
              <div className="flex items-end justify-center gap-2 pt-4 px-2 h-full">
                {benchGadgets.length === 0 ? (
                  <div className="flex items-center justify-center w-full h-full"><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center animate-pulse"><PlusIcon size={16} className="text-white/60" /></div></div>
                ) : benchGadgets.map(gId => {
                  const gadget = getShopItemById(gId);
                  if (!gadget) return null;
                  return (
                    <button key={gId} onClick={(e) => { e.stopPropagation(); handleGadgetClick(gId); }}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden transition-all ${gadgetAnimating === gId ? 'scale-125 rotate-12' : 'hover:scale-110'}`}>
                      <img src={gadget.image} alt={gadget.name} className="w-full h-full object-contain" />
                    </button>
                  );
                })}
              </div>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white mt-1 bg-black/30 px-2 py-0.5 rounded-full"><WrenchIcon size={10} className="inline mr-1" /> Tool Bench</span>
          </button>

          {/* Pet Corner */}
          <button onClick={() => { if (equippedPet) handlePetTap(); else setActivePanel(activePanel === 'pet' ? null : 'pet'); }}
            onMouseEnter={() => setHoveredZone('pet')} onMouseLeave={() => setHoveredZone(null)}
            className={`absolute right-6 md:right-12 bottom-6 w-20 md:w-28 h-20 md:h-28 z-10 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${hoveredZone === 'pet' ? 'ring-4 ring-pink-400/60 shadow-xl shadow-pink-400/20 scale-105' : ''}`}>
            <div className="w-16 md:w-24 h-10 md:h-14 bg-gradient-to-t from-pink-400 to-pink-300 rounded-[50%] shadow-lg relative flex items-center justify-center">
              {equippedPet ? (
                <div className={`transition-all duration-300 ${petAnimating ? 'animate-bounce' : 'animate-pulse'}`}>
                  <img src={equippedPet.image} alt={equippedPet.name} className="w-12 md:w-16 h-12 md:h-16 object-contain -mt-6 md:-mt-8 drop-shadow-lg" />
                  {petAnimating && [...Array(5)].map((_, i) => (
                    <div key={i} className="absolute text-pink-500 animate-ping" style={{ top: `${-20 - Math.random() * 30}px`, left: `${Math.random() * 40 - 10}px`, animationDelay: `${i * 0.15}s`, fontSize: '12px' }}>
                      <HeartIcon size={14} filled className="text-pink-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse -mt-4"><PlusIcon size={14} className="text-white/60" /></div>
              )}
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white mt-1 bg-black/30 px-2 py-0.5 rounded-full"><BugIcon size={10} className="inline mr-1" /> Pet Corner</span>
          </button>

          {/* Case Board */}
          <button onClick={() => setActivePanel(activePanel === 'caseboard' ? null : 'caseboard')} onMouseEnter={() => setHoveredZone('caseboard')} onMouseLeave={() => setHoveredZone(null)}
            className={`absolute left-2 md:left-4 bottom-28 w-24 md:w-40 h-28 md:h-36 z-10 transition-all duration-300 ${hoveredZone === 'caseboard' ? 'ring-4 ring-amber-400/60 shadow-xl shadow-amber-400/20 scale-105' : ''}`}>
            <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-400 rounded-xl border-4 border-amber-600 shadow-lg p-1.5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(139,69,19,0.3) 1px, transparent 1px)', backgroundSize: '6px 6px' }} />
              <div className="grid grid-cols-2 gap-1 h-full relative z-10">
                {completedMysteryData.slice(0, 4).map((m, i) => m && (
                  <div key={m.id} className="bg-white/80 rounded-md p-0.5 text-center shadow-sm" style={{ transform: `rotate(${(i % 2 === 0 ? -2 : 2)}deg)` }}>
                    <div className="text-[7px] md:text-[9px] font-bold text-gray-700 truncate px-0.5">{m.title.split(' ').slice(0, 3).join(' ')}</div>
                    <div className="flex justify-center"><StarIcon size={8} className="text-yellow-500" filled /></div>
                  </div>
                ))}
                {completedMysteryData.length === 0 && <div className="col-span-2 flex items-center justify-center h-full"><span className="text-[9px] text-amber-700/60 font-semibold">Solve mysteries!</span></div>}
              </div>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white mt-1 bg-black/30 px-2 py-0.5 rounded-full block text-center">Case Board</span>
          </button>

          {/* Lantern */}
          <div className="absolute top-6 right-[15%] w-6 h-10 z-[5]">
            <div className="w-4 h-1 bg-amber-600 mx-auto" />
            <div className="w-6 h-8 bg-gradient-to-b from-yellow-300 to-amber-400 rounded-b-lg mx-auto shadow-lg shadow-yellow-400/30" />
          </div>

          {tierLevel >= 2 && (
            <div className="absolute top-[55%] right-[5%] w-16 md:w-20 z-[5]">
              <div className="bg-amber-700 rounded-sm p-1 space-y-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-0.5">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex-1 h-3 rounded-sm" style={{ backgroundColor: ['#DC2626','#2563EB','#059669','#7C3AED','#D97706'][Math.floor(Math.random()*5)] }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panels */}
        {activePanel === 'backdrop' && (
          <div className="mt-4 bg-white rounded-3xl shadow-xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Change Backdrop</h3>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={20} className="text-gray-500" /></button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3">
              {backdrops.map(backdrop => {
                const owned = ownedBackdrops.includes(backdrop.id) || backdrop.price === 0;
                const active = selectedBackdrop === backdrop.id;
                const canBuy = playerState.coins >= backdrop.price;
                return (
                  <button key={backdrop.id} onClick={() => handleBackdropPurchase(backdrop)}
                    className={`flex-shrink-0 w-36 md:w-44 rounded-2xl overflow-hidden transition-all border-3 ${active ? 'border-purple-500 shadow-lg shadow-purple-200 scale-105' : 'border-transparent shadow-md hover:shadow-lg hover:scale-105'}`}>
                    <div className="relative aspect-video">
                      <img src={backdrop.image} alt={backdrop.name} className="w-full h-full object-cover" />
                      {!owned && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><LockIcon size={24} className="text-white" /></div>}
                      {active && <div className="absolute top-1 right-1 bg-purple-500 text-white p-1 rounded-full"><CheckIcon size={12} /></div>}
                    </div>
                    <div className="p-2 bg-white text-center">
                      <p className="text-xs font-bold text-gray-700 truncate">{backdrop.name}</p>
                      {!owned ? <div className={`flex items-center justify-center gap-1 text-xs font-bold mt-1 ${canBuy ? 'text-amber-600' : 'text-gray-400'}`}><PawPrintIcon size={12} />{backdrop.price} pts</div> : <span className="text-[10px] text-green-600 font-semibold">{backdrop.price === 0 ? 'Free' : 'Owned'}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activePanel === 'toolbench' && (
          <div className="mt-4 bg-white rounded-3xl shadow-xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Tool Bench</h3>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={20} className="text-gray-500" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Select up to 3 gadgets to display on your bench.</p>
            {ownedGadgets.length === 0 ? (
              <div className="text-center py-8"><WrenchIcon size={40} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500 font-semibold mb-2">No gadgets yet!</p><button onClick={onNavigateToShop} className="text-purple-600 font-semibold hover:text-purple-700">Visit the Shop →</button></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ownedGadgets.map(gadget => {
                  const onBench = benchGadgets.includes(gadget.id);
                  return (
                    <button key={gadget.id} onClick={() => toggleBenchGadget(gadget.id)}
                      className={`rounded-2xl overflow-hidden transition-all border-3 ${onBench ? 'border-amber-400 shadow-lg bg-amber-50' : 'border-transparent shadow-md hover:shadow-lg bg-white'}`}>
                      <div className="aspect-square p-3"><img src={gadget.image} alt={gadget.name} className="w-full h-full object-contain" /></div>
                      <div className="p-2 text-center"><p className="text-xs font-bold text-gray-700">{gadget.name}</p><p className={`text-[10px] font-semibold ${onBench ? 'text-amber-600' : 'text-gray-400'}`}>{onBench ? 'On Bench' : 'Tap to place'}</p></div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activePanel === 'pet' && !equippedPet && (
          <div className="mt-4 bg-white rounded-3xl shadow-xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Pet Corner</h3>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={20} className="text-gray-500" /></button>
            </div>
            <div className="text-center py-8">
              <BugIcon size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-semibold mb-2">No pet adopted yet!</p>
              <button onClick={onNavigateToShop} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"><ShopIcon size={20} /> Visit the Shop</button>
            </div>
          </div>
        )}

        {activePanel === 'caseboard' && (
          <div className="mt-4 bg-white rounded-3xl shadow-xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Case Board</h3>
              <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={20} className="text-gray-500" /></button>
            </div>
            {completedMysteryData.length === 0 ? (
              <div className="text-center py-8"><MagnifyingGlassIcon size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-600 font-semibold mb-2">No cases solved yet!</p></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {completedMysteryData.map((mystery) => {
                  if (!mystery) return null;
                  const isSelected = selectedCaseCard === mystery.id;
                  return (
                    <button key={mystery.id} onClick={() => setSelectedCaseCard(isSelected ? null : mystery.id)}
                      className={`bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 transition-all text-left ${isSelected ? 'border-amber-400 shadow-lg scale-105' : 'border-amber-200 hover:border-amber-300 hover:shadow-md'}`}>
                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2 shadow-sm" />
                      <h4 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">{mystery.title}</h4>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">{mystery.wordFamily}</span>
                      <div className="flex gap-0.5 mt-2">{[1,2,3].map(s => <StarIcon key={s} size={12} className="text-yellow-500" filled />)}</div>
                      {isSelected && <div className="mt-3 pt-3 border-t border-amber-200"><p className="text-xs text-gray-600">{mystery.description}</p></div>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button onClick={() => setActivePanel(activePanel === 'backdrop' ? null : 'backdrop')} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold px-6 py-3 rounded-2xl hover:from-indigo-600 hover:to-blue-600 transition-all shadow-md text-sm"><ImageIcon size={18} /> Change Backdrop</button>
          <button onClick={onNavigateToShop} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md text-sm"><ShopIcon size={18} /> Visit Shop</button>
          <button onClick={onNavigateToMyDetective} className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 font-bold px-6 py-3 rounded-2xl hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md text-sm"><BadgeIcon size={18} /> My Detective</button>
        </div>

        {/* HQ Info Cards */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center"><ImageIcon size={20} className="text-purple-600" /></div>
            <p className="text-sm font-bold text-gray-700">Backdrops</p>
            <p className="text-xs text-gray-500">{ownedBackdrops.length} / {backdrops.length} owned</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center"><WrenchIcon size={20} className="text-amber-600" /></div>
            <p className="text-sm font-bold text-gray-700">Gadgets</p>
            <p className="text-xs text-gray-500">{ownedGadgets.length} owned, {benchGadgets.length} on bench</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-pink-100 rounded-full flex items-center justify-center"><BugIcon size={20} className="text-pink-600" /></div>
            <p className="text-sm font-bold text-gray-700">Pet</p>
            <p className="text-xs text-gray-500">{equippedPet ? equippedPet.name : 'None yet'}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center"><MagnifyingGlassIcon size={20} className="text-green-600" /></div>
            <p className="text-sm font-bold text-gray-700">Cases Solved</p>
            <p className="text-xs text-gray-500">{completedMysteryData.length} on the board</p>
          </div>
        </div>
      </div>

      {/* Backdrop Purchase Confirmation Modal */}
      {confirmBackdrop && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="w-full h-32 rounded-2xl overflow-hidden mb-4"><img src={confirmBackdrop.image} alt={confirmBackdrop.name} className="w-full h-full object-cover" /></div>
              <h3 className="text-xl font-bold text-gray-800">{confirmBackdrop.name}</h3>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between"><span className="text-gray-600 font-semibold">Cost:</span><div className="flex items-center gap-2 text-amber-700 font-bold text-lg"><PawPrintIcon size={20} />{confirmBackdrop.price} pts</div></div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200"><span className="text-gray-600 font-semibold">Balance:</span><span className="font-bold text-gray-700">{playerState.coins} pts</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmBackdrop(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
              <button onClick={confirmBackdropPurchase} disabled={playerState.coins < confirmBackdrop.price}
                className={`flex-1 py-3 rounded-xl font-bold ${playerState.coins >= confirmBackdrop.price ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Buy!</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
