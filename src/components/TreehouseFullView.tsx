import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { shopItems, getShopItemById, outdoorShopItems, allWearableItems } from '../data/shopData';

import { backdrops, getEvolutionTier, TREEHOUSE_EXTERIOR_IMAGE } from '../data/hqData';
import { mysteries as allMysteries, characters } from '../data/gameData';
import { OutdoorPlacements, OutdoorZone } from '../types';
import { DetectiveAvatar } from './DetectiveAvatar';
import {

  SparklesIcon,
  StarIcon,
  PlusIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  XIcon,
  HeartIcon,
  WrenchIcon,
  BugIcon,
  ChevronLeftIcon,
  HomeIcon,
  LeafIcon,
  TreeIcon,
} from './icons/Icons';

interface TreehouseFullViewProps {
  onClose: () => void;
  onNavigateToMyDetective: () => void;
  onNavigateToShop: () => void;
  selectedBackdrop: string;
  benchGadgets: string[];
  onToggleBenchGadget: (gadgetId: string) => void;
  outdoorPlacements: OutdoorPlacements;
  onPlaceOutdoorItem: (zone: OutdoorZone, itemId: string) => void;
  onRemoveOutdoorItem: (zone: OutdoorZone, itemId: string) => void;
}

const OUTDOOR_ZONES: { id: OutdoorZone; label: string; position: string; description: string }[] = [
  { id: 'garden', label: 'Garden', position: 'absolute bottom-[8%] left-[5%] w-[25%] h-[18%]', description: 'Plant flowers, mushrooms & crystals' },
  { id: 'tree', label: 'Tree Decor', position: 'absolute top-[15%] left-[15%] w-[20%] h-[25%]', description: 'Hang lanterns, chimes & banners' },
  { id: 'doorstep', label: 'Doorstep', position: 'absolute bottom-[28%] left-[38%] w-[24%] h-[15%]', description: 'Welcome mat, signs & plants' },
  { id: 'sky', label: 'Sky', position: 'absolute top-[3%] right-[5%] w-[30%] h-[20%]', description: 'Fireflies, balloons & rainbow' },
  { id: 'pathway', label: 'Pathway', position: 'absolute bottom-[3%] left-[30%] w-[40%] h-[12%]', description: 'Stepping stones, flowers & fence' },
];

export const TreehouseFullView: React.FC<TreehouseFullViewProps> = ({
  onClose, onNavigateToMyDetective, onNavigateToShop, selectedBackdrop,
  benchGadgets, onToggleBenchGadget, outdoorPlacements, onPlaceOutdoorItem, onRemoveOutdoorItem,
}) => {
  const { playerState, progress } = useGame();
  const [petAnimating, setPetAnimating] = useState(false);
  const [gadgetAnimating, setGadgetAnimating] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [showCaseGallery, setShowCaseGallery] = useState(false);
  const [showToolPanel, setShowToolPanel] = useState(false);
  const [selectedCaseCard, setSelectedCaseCard] = useState<string | null>(null);
  const [enterAnim, setEnterAnim] = useState(true);
  const [viewMode, setViewMode] = useState<'inside' | 'outside'>('inside');
  const [slideDirection, setSlideDirection] = useState<'none' | 'left' | 'right'>('none');
  const [selectedOutdoorZone, setSelectedOutdoorZone] = useState<OutdoorZone | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setEnterAnim(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const chosenDetective = useMemo(() => {
    if (!playerState.chosenDetectiveId) return null;
    return characters.find(c => c.id === playerState.chosenDetectiveId) || null;
  }, [playerState.chosenDetectiveId]);

  const currentBackdrop = useMemo(() => backdrops.find(b => b.id === selectedBackdrop) || backdrops[0], [selectedBackdrop]);

  const totalEarned = useMemo(() => {
    const base = 45;
    const mysteryCoins = progress.completedMysteries.length * 10;
    const perfectGames = playerState.gameScores.filter(s => s.score === s.maxScore).length * 5;
    return base + mysteryCoins + perfectGames;
  }, [progress.completedMysteries.length, playerState.gameScores]);

  const currentTier = useMemo(() => getEvolutionTier(totalEarned), [totalEarned]);
  const tierLevel = currentTier.id === 'rookie' ? 0 : currentTier.id === 'junior' ? 1 : currentTier.id === 'super-sleuth' ? 2 : 3;

  const equippedItems = useMemo(() => {
    const accessories = playerState.avatar?.accessories || [];
    return accessories.map(id => allWearableItems.find(i => i.id === id) || shopItems.find(i => i.id === id)).filter(Boolean);
  }, [playerState.avatar]);


  const equippedPet = useMemo(() => equippedItems.find(i => i && i.type === 'pet'), [equippedItems]);
  const equippedOutfit = useMemo(() => equippedItems.find(i => i && i.type === 'outfit'), [equippedItems]);
  const equippedDisguises = useMemo(() => equippedItems.filter(i => i && i.type === 'disguise'), [equippedItems]);

  const ownedGadgets = useMemo(() => shopItems.filter(i => i.type === 'gadget' && playerState.ownedItems.includes(i.id)), [playerState.ownedItems]);
  const completedMysteryData = useMemo(() => progress.completedMysteries.map(id => allMysteries.find(m => m.id === id)).filter(Boolean), [progress.completedMysteries]);

  const ownedOutdoorItems = useMemo(() => outdoorShopItems.filter(i => playerState.ownedItems.includes(i.id)), [playerState.ownedItems]);

  const handlePetTap = useCallback(() => {
    if (equippedPet) { setPetAnimating(true); setTimeout(() => setPetAnimating(false), 1500); }
  }, [equippedPet]);

  const handleGadgetClick = useCallback((gadgetId: string) => {
    setGadgetAnimating(gadgetId); setTimeout(() => setGadgetAnimating(null), 800);
  }, []);

  const toggleView = (mode: 'inside' | 'outside') => {
    if (mode === viewMode) return;
    setSlideDirection(mode === 'outside' ? 'left' : 'right');
    setTimeout(() => { setViewMode(mode); setSlideDirection('none'); }, 400);
  };

  // Get items placed in a zone
  const getZoneItems = (zone: OutdoorZone) => {
    return (outdoorPlacements[zone] || []).map(id => getShopItemById(id)).filter(Boolean);
  };

  // Count total outdoor decorations
  const totalOutdoorItems = Object.values(outdoorPlacements).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-500 ${enterAnim ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`} style={{ background: '#1a0f05' }}>
      {/* === TOP BAR WITH TOGGLE === */}
      <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="flex items-center gap-2 bg-amber-800/80 hover:bg-amber-700 backdrop-blur-sm text-white font-bold px-4 py-2.5 rounded-xl shadow-xl transition-all hover:scale-105 border border-amber-600/50">
          <ChevronLeftIcon size={20} /><span className="text-sm">Exit Room</span>
        </button>

        {/* Indoor/Outdoor Toggle */}
        <div className="flex items-center bg-black/40 backdrop-blur-md rounded-2xl p-1 border border-white/10">
          <button onClick={() => toggleView('inside')} className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${viewMode === 'inside' ? 'bg-amber-600 text-white shadow-lg' : 'text-white/60 hover:text-white/80'}`}>
            <HomeIcon size={16} /> Inside
          </button>
          <button onClick={() => toggleView('outside')} className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${viewMode === 'outside' ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/60 hover:text-white/80'}`}>
            <LeafIcon size={16} /> Outside
          </button>
        </div>

        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTier.color }}>
            <SparklesIcon size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold">{currentTier.name}</span>
        </div>
      </div>

      {/* === VIEW CONTAINER with slide transition === */}
      <div className={`relative w-full h-full overflow-hidden transition-transform duration-400 ${slideDirection === 'left' ? '-translate-x-full opacity-0' : slideDirection === 'right' ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        {viewMode === 'inside' ? (
          /* ============ INTERIOR VIEW ============ */
          <div className="relative w-full h-full overflow-hidden">
            {/* BACKDROP through window */}
            <div className="absolute top-[8%] left-[22%] right-[22%] bottom-[35%] z-0 rounded-xl overflow-hidden">
              <img src={currentBackdrop.image} alt={currentBackdrop.name} className="w-full h-full object-cover" style={{ filter: 'brightness(0.8) saturate(1.1)' }} />
              {/* Window frame */}
              <div className="absolute inset-0 border-[10px] border-amber-700 rounded-xl pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-2.5 bg-amber-700 -translate-y-1/2 pointer-events-none" />
              <div className="absolute left-1/2 top-0 bottom-0 w-2.5 bg-amber-700 -translate-x-1/2 pointer-events-none" />
              {tierLevel >= 1 && (<><div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-purple-500/30 to-transparent pointer-events-none" /><div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-purple-500/30 to-transparent pointer-events-none" /></>)}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/40 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">{currentBackdrop.name}</div>
            </div>

            {/* Ambient golden glow overlay */}
            <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,200,100,0.08) 0%, transparent 60%)' }} />

            {/* CURVED WOODEN WALLS */}
            {/* Left wall - organic tree interior */}
            <div className="absolute top-0 left-0 w-[22%] h-full z-[2] pointer-events-none overflow-hidden">
              <div className="w-full h-full" style={{ background: 'linear-gradient(to right, #6B4226 0%, #8B6914 40%, #A0782C 70%, transparent 100%)', borderRadius: '0 30% 20% 0' }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(15deg, transparent, transparent 18px, rgba(0,0,0,0.15) 18px, rgba(0,0,0,0.15) 19px)' }} />
                {/* Wood knots */}
                <div className="absolute top-[20%] left-[30%] w-6 h-4 bg-amber-900/40 rounded-full" />
                <div className="absolute top-[55%] left-[50%] w-5 h-3 bg-amber-900/30 rounded-full" />
                <div className="absolute top-[80%] left-[20%] w-4 h-3 bg-amber-900/35 rounded-full" />
              </div>
            </div>
            {/* Right wall */}
            <div className="absolute top-0 right-0 w-[22%] h-full z-[2] pointer-events-none overflow-hidden">
              <div className="w-full h-full" style={{ background: 'linear-gradient(to left, #6B4226 0%, #8B6914 40%, #A0782C 70%, transparent 100%)', borderRadius: '30% 0 0 20%' }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(-15deg, transparent, transparent 18px, rgba(0,0,0,0.15) 18px, rgba(0,0,0,0.15) 19px)' }} />
                <div className="absolute top-[30%] right-[30%] w-5 h-4 bg-amber-900/35 rounded-full" />
                <div className="absolute top-[65%] right-[45%] w-4 h-3 bg-amber-900/30 rounded-full" />
              </div>
            </div>

            {/* CEILING with wooden beams */}
            <div className="absolute top-0 left-0 right-0 h-[10%] z-[3] pointer-events-none" style={{ background: 'linear-gradient(to bottom, #5C3A1E 0%, #7B5A2E 60%, transparent 100%)', borderRadius: '0 0 40% 40%' }}>
              {/* Ceiling beams */}
              <div className="absolute bottom-0 left-[15%] right-[15%] h-3 bg-amber-800/60 rounded-b-lg" />
              <div className="absolute bottom-1 left-[35%] right-[35%] h-2 bg-amber-700/40 rounded-b-lg" />
            </div>

            {/* FAIRY LIGHTS on ceiling */}
            <div className="absolute top-[7%] left-[12%] right-[12%] z-[8] flex items-center justify-between">
              <svg className="absolute top-2 left-0 right-0 w-full h-8" viewBox="0 0 800 30" preserveAspectRatio="none">
                <path d="M0,12 Q100,22 200,10 Q300,0 400,14 Q500,24 600,8 Q700,0 800,16" stroke="rgba(139,92,42,0.5)" strokeWidth="2" fill="none" />
              </svg>
              {[...Array(14)].map((_, i) => (
                <div key={i} className="relative" style={{ animation: `pulse ${1.2 + (i % 5) * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/60" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-yellow-200 animate-ping opacity-30" />
                </div>
              ))}
            </div>

            {/* WOODEN PLANK FLOOR */}
            <div className="absolute bottom-0 left-0 right-0 h-[33%] z-[4] pointer-events-none overflow-hidden">
              <div className="w-full h-full" style={{ background: 'linear-gradient(to top, #3D2510 0%, #5C3A1E 30%, #7B5A2E 60%, #8B6914 80%, transparent 100%)' }}>
                {/* Horizontal plank lines */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 h-px bg-black/15" style={{ bottom: `${i * 12 + 5}%` }} />
                ))}
                {/* Vertical plank seams */}
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 w-px bg-black/10" style={{ left: `${i * 8.5 + 2}%` }} />
                ))}
                {/* Wood grain texture */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 55px, rgba(0,0,0,0.12) 55px, rgba(0,0,0,0.12) 56px)' }} />
              </div>
              {/* RUG */}
              <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[45%] h-[40%] rounded-[50%] overflow-hidden" style={{ background: 'radial-gradient(ellipse, rgba(147,51,234,0.35) 0%, rgba(234,179,8,0.25) 50%, rgba(147,51,234,0.15) 80%, transparent 100%)' }}>
                <div className="absolute inset-[15%] rounded-[50%] border-2 border-purple-400/20" />
                <div className="absolute inset-[30%] rounded-[50%] border border-yellow-400/15" />
              </div>
            </div>

            {/* HANGING LANTERNS */}
            <div className="absolute top-[10%] left-[8%] z-[7]">
              <div className="w-3 h-6 bg-amber-700 mx-auto rounded-t-sm" />
              <div className="w-8 h-12 bg-gradient-to-b from-yellow-300/90 to-amber-500/80 rounded-b-xl mx-auto shadow-lg shadow-yellow-400/40 relative animate-pulse" style={{ animationDuration: '3s' }}>
                <div className="absolute inset-1 bg-yellow-200/40 rounded-b-lg" />
              </div>
            </div>
            <div className="absolute top-[10%] right-[8%] z-[7]">
              <div className="w-3 h-6 bg-amber-700 mx-auto rounded-t-sm" />
              <div className="w-8 h-12 bg-gradient-to-b from-yellow-300/90 to-amber-500/80 rounded-b-xl mx-auto shadow-lg shadow-yellow-400/40 relative animate-pulse" style={{ animationDuration: '4s' }}>
                <div className="absolute inset-1 bg-yellow-200/40 rounded-b-lg" />
              </div>
            </div>

            {/* ROPE LADDER on left wall */}
            <div className="absolute left-[5%] top-[40%] bottom-[33%] w-8 z-[6] pointer-events-none">
              <div className="absolute left-1 top-0 bottom-0 w-1 bg-amber-700/60 rounded" />
              <div className="absolute right-1 top-0 bottom-0 w-1 bg-amber-700/60 rounded" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute left-0 right-0 h-1.5 bg-amber-600/50 rounded" style={{ top: `${i * 18 + 5}%` }} />
              ))}
            </div>

            {/* POTTED MUSHROOMS / PLANTS in floor corners */}
            {tierLevel >= 1 && (
              <>
                <div className="absolute bottom-[33%] left-[5%] z-[9] w-10 h-10">
                  <div className="w-8 h-5 bg-amber-700/70 rounded-t-lg mx-auto" />
                  <div className="w-6 h-3 bg-green-600/60 rounded-full mx-auto -mt-1 animate-pulse" style={{ animationDuration: '4s' }} />
                </div>
                <div className="absolute bottom-[33%] right-[5%] z-[9] w-10 h-10">
                  <div className="w-8 h-5 bg-amber-700/70 rounded-t-lg mx-auto" />
                  <div className="w-5 h-4 bg-purple-500/40 rounded-full mx-auto -mt-2 animate-pulse" style={{ animationDuration: '3s' }} />
                  <div className="w-3 h-3 bg-purple-400/50 rounded-full mx-auto -mt-3 ml-1" />
                </div>
              </>
            )}

            {/* === CASE BOARD (Left Wall) - Cork board with wooden frame === */}
            <button onClick={() => setShowCaseGallery(true)} onMouseEnter={() => setHoveredZone('caseboard')} onMouseLeave={() => setHoveredZone(null)}
              className={`absolute left-[2%] top-[20%] w-[20%] h-[35%] z-[10] transition-all duration-300 cursor-pointer group ${hoveredZone === 'caseboard' ? 'scale-105' : ''}`}>
              <div className="w-full h-full relative">
                {/* Wooden frame */}
                <div className="absolute inset-0 bg-amber-800 rounded-lg shadow-2xl p-1.5">
                  {/* Cork surface */}
                  <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-400 rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(139,69,19,0.4) 1px, transparent 1px)', backgroundSize: '6px 6px' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-b-md shadow-md z-20">CASE BOARD</div>
                    <div className="grid grid-cols-2 gap-1 p-1.5 pt-5 h-full relative z-10">
                      {completedMysteryData.slice(0, 6).map((m, i) => m && (
                        <div key={m.id} className="bg-white/90 rounded p-0.5 text-center shadow-sm relative" style={{ transform: `rotate(${(i % 2 === 0 ? -3 : 3)}deg)` }}>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full shadow-sm z-10 border border-red-700" />
                          <div className="text-[6px] md:text-[8px] font-bold text-gray-700 truncate px-0.5 mt-1">{m.title.split(' ').slice(0, 3).join(' ')}</div>
                          <div className="flex justify-center gap-0.5 mt-0.5">{[1,2,3].map(s => <StarIcon key={s} size={6} className="text-yellow-500" filled />)}</div>
                        </div>
                      ))}
                      {completedMysteryData.length === 0 && (
                        <div className="col-span-2 flex flex-col items-center justify-center h-full">
                          <MagnifyingGlassIcon size={20} className="text-amber-600/40 mb-1" />
                          <span className="text-[8px] text-amber-700/60 font-semibold">Solve mysteries!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none ${hoveredZone === 'caseboard' ? 'ring-4 ring-yellow-400/50 shadow-xl shadow-yellow-400/20' : ''}`} />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">View Cases</span>
            </button>

            {/* === DETECTIVE - Full Body Avatar standing in room === */}
            <button onClick={() => { onClose(); setTimeout(onNavigateToMyDetective, 100); }} onMouseEnter={() => setHoveredZone('detective')} onMouseLeave={() => setHoveredZone(null)}
              className={`absolute left-[26%] bottom-[20%] z-[15] transition-all duration-300 cursor-pointer group ${hoveredZone === 'detective' ? 'scale-105' : ''}`}>
              {chosenDetective ? (
                <div className="relative">
                  <DetectiveAvatar
                    character={chosenDetective}
                    equippedItems={equippedItems.filter(Boolean) as any[]}
                    size="md"
                    showZones={false}
                    idleAnimation={true}
                  />
                  <div className={`absolute -inset-2 rounded-2xl transition-all duration-300 pointer-events-none ${hoveredZone === 'detective' ? 'ring-4 ring-purple-400/40 shadow-xl shadow-purple-400/20' : ''}`} />
                </div>
              ) : (
                <div className="w-24 h-36 md:w-32 md:h-44 bg-gradient-to-b from-amber-600/60 to-amber-800/60 rounded-xl p-1.5 shadow-2xl flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-purple-200/30 flex items-center justify-center animate-pulse">
                    <PlusIcon size={24} className="text-purple-400" />
                  </div>
                  <span className="text-[9px] text-purple-300 font-semibold mt-2">Choose Detective</span>
                </div>
              )}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">My Detective</span>
            </button>


            {/* === TOOL BENCH (Right Wall) - Wooden workbench on floor === */}
            <button onClick={() => setShowToolPanel(true)} onMouseEnter={() => setHoveredZone('toolbench')} onMouseLeave={() => setHoveredZone(null)}
              className={`absolute right-[3%] bottom-[33%] w-[24%] h-[28%] z-[10] transition-all duration-300 cursor-pointer group ${hoveredZone === 'toolbench' ? 'scale-105' : ''}`}>
              <div className="w-full h-full relative">
                {/* Back panel */}
                <div className="absolute top-0 left-[5%] right-[5%] h-[50%] bg-gradient-to-b from-amber-700/80 to-amber-800/60 rounded-t-lg">
                  <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 9px)' }} />
                </div>
                {/* Bench top surface */}
                <div className="absolute top-[45%] left-0 right-0 h-[12%] bg-gradient-to-b from-amber-500 to-amber-600 rounded-lg shadow-lg z-10">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 21px)' }} />
                </div>
                {/* Legs */}
                <div className="absolute bottom-0 left-[10%] w-3 h-[45%] bg-amber-700 rounded-b" />
                <div className="absolute bottom-0 right-[10%] w-3 h-[45%] bg-amber-700 rounded-b" />
                {/* Gadgets on bench */}
                <div className="absolute top-[10%] left-[10%] right-[10%] h-[35%] flex items-end justify-center gap-2 z-20">
                  {benchGadgets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full">
                      <WrenchIcon size={20} className="text-white/30 mb-0.5" />
                      <span className="text-[7px] text-white/40 font-semibold">Place gadgets</span>
                    </div>
                  ) : benchGadgets.map(gId => {
                    const gadget = getShopItemById(gId);
                    if (!gadget) return null;
                    return (
                      <button key={gId} onClick={(e) => { e.stopPropagation(); handleGadgetClick(gId); }}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden transition-all drop-shadow-lg ${gadgetAnimating === gId ? 'scale-125 rotate-12 animate-bounce' : 'hover:scale-110'}`}>
                        <img src={gadget.image} alt={gadget.name} className="w-full h-full object-contain" />
                      </button>
                    );
                  })}
                </div>
                <div className="absolute top-[46%] left-1/2 -translate-x-1/2 bg-amber-700/80 text-amber-100 text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-30">
                  <WrenchIcon size={8} className="inline mr-0.5" /> Tool Bench
                </div>
              </div>
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${hoveredZone === 'toolbench' ? 'ring-4 ring-amber-400/50 shadow-xl shadow-amber-400/20' : ''}`} />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Manage Gadgets</span>
            </button>

            {/* === PET CORNER (Bottom Right) - Cozy cushioned nook === */}
            <button onClick={handlePetTap} onMouseEnter={() => setHoveredZone('pet')} onMouseLeave={() => setHoveredZone(null)}
              className={`absolute right-[8%] bottom-[8%] z-[15] transition-all duration-300 cursor-pointer group ${hoveredZone === 'pet' ? 'scale-110' : ''}`}>
              <div className="relative">
                {/* Soft bed/cushion */}
                <div className="w-28 h-16 md:w-36 md:h-20 relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[70%] bg-gradient-to-t from-pink-400/80 to-pink-300/60 rounded-[50%] shadow-xl border-2 border-pink-300/40" />
                  <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-pink-200/30 rounded-[50%]" />
                  {equippedPet ? (
                    <div className={`absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 transition-all ${petAnimating ? 'animate-bounce' : ''}`}>
                      <img src={equippedPet.image} alt={equippedPet.name} className="w-14 h-14 md:w-18 md:h-18 object-contain drop-shadow-xl" style={{ animation: petAnimating ? 'none' : 'petFloat 3s ease-in-out infinite' }} />
                      {petAnimating && [...Array(8)].map((_, i) => (
                        <div key={i} className="absolute animate-ping" style={{ top: `${-15 - Math.random() * 40}px`, left: `${Math.random() * 50 - 10}px`, animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }}>
                          <HeartIcon size={14} filled className="text-pink-500" />
                        </div>
                      ))}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-pink-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap backdrop-blur-sm">{equippedPet.name}</div>
                    </div>
                  ) : (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                      <BugIcon size={18} className="text-white/40" />
                    </div>
                  )}
                </div>
              </div>
              <div className={`absolute -inset-3 rounded-3xl transition-all duration-300 pointer-events-none ${hoveredZone === 'pet' ? 'ring-4 ring-pink-400/40' : ''}`} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{equippedPet ? 'Tap to pet!' : 'Visit Shop'}</span>
            </button>

            {/* Bookshelves (tier >= 2) */}
            {tierLevel >= 2 && (
              <div className="absolute top-[22%] right-[24%] z-[6]">
                <div className="bg-amber-700/80 rounded-lg p-1 space-y-1 shadow-lg">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-2.5 h-4 rounded-sm shadow-sm" style={{ backgroundColor: ['#DC2626','#2563EB','#059669','#7C3AED','#D97706'][(i*5+j)%5] }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ============ EXTERIOR / OUTDOOR VIEW ============ */
          <div className="relative w-full h-full overflow-hidden">
            {/* Background - enchanted forest */}
            <div className="absolute inset-0 z-0">
              <img src={TREEHOUSE_EXTERIOR_IMAGE} alt="Treehouse Exterior" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-indigo-900/20" />
            </div>

            {/* Placed outdoor items per zone */}
            {OUTDOOR_ZONES.map(zone => {
              const items = getZoneItems(zone.id);
              return (
                <button key={zone.id} onClick={() => setSelectedOutdoorZone(zone.id)}
                  onMouseEnter={() => setHoveredZone(`outdoor-${zone.id}`)} onMouseLeave={() => setHoveredZone(null)}
                  className={`${zone.position} z-[10] transition-all duration-300 cursor-pointer group rounded-2xl ${hoveredZone === `outdoor-${zone.id}` ? 'ring-2 ring-white/30 bg-white/5' : ''}`}>
                  {items.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-center gap-1 w-full h-full p-1">
                      {items.map((item, idx) => item && (
                        <div key={item.id + idx} className="w-10 h-10 md:w-14 md:h-14 drop-shadow-lg" style={{ animation: `petFloat ${2.5 + idx * 0.5}s ease-in-out infinite`, animationDelay: `${idx * 0.3}s` }}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse border-2 border-dashed border-white/20">
                        <PlusIcon size={20} className="text-white/50" />
                      </div>
                      <span className="text-[9px] text-white/60 font-semibold mt-1 bg-black/20 px-2 py-0.5 rounded-full">{zone.label}</span>
                    </div>
                  )}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80 bg-black/50 px-2 py-0.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{zone.description}</span>
                </button>
              );
            })}

            {/* Outdoor items count */}
            <div className="absolute bottom-4 left-4 z-[20] bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <TreeIcon size={16} className="text-green-400" />
                <span className="text-sm font-bold">{totalOutdoorItems} decoration{totalOutdoorItems !== 1 ? 's' : ''} placed</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* === OUTDOOR ZONE PANEL === */}
      {selectedOutdoorZone && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LeafIcon size={22} className="text-green-600" />
                {OUTDOOR_ZONES.find(z => z.id === selectedOutdoorZone)?.label || 'Zone'}
              </h3>
              <button onClick={() => setSelectedOutdoorZone(null)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={20} className="text-gray-500" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{OUTDOOR_ZONES.find(z => z.id === selectedOutdoorZone)?.description}</p>

            {/* Currently placed items */}
            {(outdoorPlacements[selectedOutdoorZone] || []).length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Placed Items:</h4>
                <div className="flex flex-wrap gap-2">
                  {(outdoorPlacements[selectedOutdoorZone] || []).map(itemId => {
                    const item = getShopItemById(itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain rounded" />
                        <span className="text-xs font-semibold text-gray-700">{item.name}</span>
                        <button onClick={() => onRemoveOutdoorItem(selectedOutdoorZone, itemId)} className="text-red-400 hover:text-red-600 ml-1"><XIcon size={14} /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available items to place */}
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Available Items:</h4>
            {(() => {
              const zoneItems = ownedOutdoorItems.filter(i => i.subtype === selectedOutdoorZone && !(outdoorPlacements[selectedOutdoorZone] || []).includes(i.id));
              if (zoneItems.length === 0) return (
                <div className="text-center py-6">
                  <LeafIcon size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm font-semibold mb-2">No items for this zone yet!</p>
                  <button onClick={() => { setSelectedOutdoorZone(null); onClose(); setTimeout(onNavigateToShop, 100); }} className="text-purple-600 font-semibold hover:text-purple-700 text-sm">Visit the Shop →</button>
                </div>
              );
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {zoneItems.map(item => (
                    <button key={item.id} onClick={() => { onPlaceOutdoorItem(selectedOutdoorZone, item.id); }}
                      className="rounded-2xl overflow-hidden border-2 border-transparent shadow-md hover:shadow-lg hover:border-green-400 bg-white transition-all">
                      <div className="aspect-square p-2"><img src={item.image} alt={item.name} className="w-full h-full object-contain" /></div>
                      <div className="p-2 text-center">
                        <p className="text-xs font-bold text-gray-700">{item.name}</p>
                        <p className="text-[10px] text-green-600 font-semibold">Tap to place</p>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* === CASE GALLERY OVERLAY === */}
      {showCaseGallery && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl shadow-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><MagnifyingGlassIcon size={24} className="text-amber-600" /> Case Board</h3>
              <button onClick={() => setShowCaseGallery(false)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={24} className="text-gray-500" /></button>
            </div>
            {completedMysteryData.length === 0 ? (
              <div className="text-center py-16"><MagnifyingGlassIcon size={56} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-600 font-semibold text-lg mb-2">No cases solved yet!</p></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {completedMysteryData.map((mystery) => {
                  if (!mystery) return null;
                  const isSelected = selectedCaseCard === mystery.id;
                  return (
                    <button key={mystery.id} onClick={() => setSelectedCaseCard(isSelected ? null : mystery.id)}
                      className={`bg-white rounded-2xl p-4 border-2 transition-all text-left relative ${isSelected ? 'border-amber-400 shadow-lg scale-105' : 'border-amber-200 hover:border-amber-300 hover:shadow-md'}`}>
                      <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2 shadow-sm border border-red-700" />
                      <h4 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2">{mystery.title}</h4>
                      <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold inline-block mb-2">{mystery.wordFamily}</span>
                      <div className="flex gap-0.5">{[1,2,3].map(s => <StarIcon key={s} size={14} className="text-yellow-500" filled />)}</div>
                      {isSelected && <div className="mt-3 pt-3 border-t border-amber-200"><p className="text-xs text-gray-600">{mystery.description}</p></div>}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-6 text-center"><p className="text-sm text-gray-500 font-medium">{completedMysteryData.length} case{completedMysteryData.length !== 1 ? 's' : ''} solved</p></div>
          </div>
        </div>
      )}

      {/* === TOOL BENCH PANEL === */}
      {showToolPanel && (
        <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><WrenchIcon size={22} className="text-amber-600" /> Tool Bench</h3>
              <button onClick={() => setShowToolPanel(false)} className="p-2 hover:bg-gray-100 rounded-full"><XIcon size={20} className="text-gray-500" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Select up to 3 gadgets to display on your bench.</p>
            {ownedGadgets.length === 0 ? (
              <div className="text-center py-10"><WrenchIcon size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500 font-semibold mb-2">No gadgets yet!</p>
                <button onClick={() => { setShowToolPanel(false); onClose(); setTimeout(onNavigateToShop, 100); }} className="text-purple-600 font-semibold hover:text-purple-700">Visit the Shop →</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ownedGadgets.map(gadget => {
                  const onBench = benchGadgets.includes(gadget.id);
                  return (
                    <button key={gadget.id} onClick={() => onToggleBenchGadget(gadget.id)}
                      className={`rounded-2xl overflow-hidden transition-all border-3 relative ${onBench ? 'border-amber-400 shadow-lg bg-amber-50' : 'border-transparent shadow-md hover:shadow-lg bg-white'}`}>
                      <div className="aspect-square p-3"><img src={gadget.image} alt={gadget.name} className="w-full h-full object-contain" /></div>
                      <div className="p-2 text-center">
                        <p className="text-xs font-bold text-gray-700">{gadget.name}</p>
                        <p className={`text-[10px] font-semibold ${onBench ? 'text-amber-600' : 'text-gray-400'}`}>{onBench ? 'On Bench' : 'Tap to place'}</p>
                      </div>
                      {onBench && <div className="absolute top-1 right-1 bg-amber-500 text-white p-0.5 rounded-full"><CheckIcon size={10} /></div>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes petFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};
