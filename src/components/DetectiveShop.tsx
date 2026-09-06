import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShopItem } from '../types';
import { shopItems, getShopItemsByType, outdoorShopItems, hatItems, shoesItems, accessoryItems, allWearableItems, MYSTERY_BOX_IMAGE, MYSTERY_BOX_PRICE } from '../data/shopData';
import {
  SparklesIcon,
  CheckIcon,
  LockIcon,
  GiftBoxIcon,
  GlassesIcon,
  HatIcon,
  MagnifyingGlassIcon,
  BugIcon,
  PawPrintIcon,
  XIcon,
  LeafIcon,
  TreeIcon,
  FlowerIcon,
  CrownIcon,
  ShoeIcon,
  BackpackIcon,
} from './icons/Icons';

type ShopCategory = 'disguise' | 'outfit' | 'gadget' | 'pet' | 'hat' | 'shoes' | 'accessory' | 'outdoor';
type OutdoorSubtab = 'garden' | 'tree' | 'doorstep' | 'sky' | 'pathway';

interface DetectiveShopProps {
  onNavigateToMyDetective: () => void;
}

const categoryConfig: { type: ShopCategory; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { type: 'hat', label: 'Hats', icon: CrownIcon },
  { type: 'disguise', label: 'Disguises', icon: GlassesIcon },
  { type: 'accessory', label: 'Accessories', icon: BackpackIcon },
  { type: 'outfit', label: 'Outfits', icon: HatIcon },
  { type: 'shoes', label: 'Shoes', icon: ShoeIcon },
  { type: 'gadget', label: 'Gadgets', icon: MagnifyingGlassIcon },
  { type: 'pet', label: 'Pets', icon: BugIcon },
  { type: 'outdoor', label: 'Outdoor', icon: TreeIcon },
];

const outdoorSubtabs: { id: OutdoorSubtab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'garden', label: 'Garden', icon: FlowerIcon },
  { id: 'tree', label: 'Tree', icon: TreeIcon },
  { id: 'doorstep', label: 'Doorstep', icon: LeafIcon },
  { id: 'sky', label: 'Sky', icon: SparklesIcon },
  { id: 'pathway', label: 'Path', icon: LeafIcon },
];

// Zone label for display on item cards
const getZoneLabel = (type: string): string => {
  switch (type) {
    case 'hat': return 'Head';
    case 'disguise': return 'Face';
    case 'accessory': return 'Neck/Back';
    case 'outfit': return 'Body';
    case 'gadget': return 'Hand';
    case 'shoes': return 'Feet';
    case 'pet': return 'Companion';
    default: return '';
  }
};

export const DetectiveShop: React.FC<DetectiveShopProps> = ({ onNavigateToMyDetective }) => {
  const { playerState, purchaseItem, addCoins } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('hat');
  const [selectedOutdoorSub, setSelectedOutdoorSub] = useState<OutdoorSubtab>('garden');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchasedItemName, setPurchasedItemName] = useState('');

  const [mysteryBoxSpinning, setMysteryBoxSpinning] = useState(false);
  const [mysteryBoxResult, setMysteryBoxResult] = useState<ShopItem | null>(null);
  const [mysteryBoxBonusPoints, setMysteryBoxBonusPoints] = useState(false);
  const [showMysteryResult, setShowMysteryResult] = useState(false);

  const categoryItems = selectedCategory === 'outdoor'
    ? outdoorShopItems.filter(i => i.subtype === selectedOutdoorSub)
    : getShopItemsByType(selectedCategory);

  const isItemOwned = (itemId: string) => playerState.ownedItems.includes(itemId);
  const canAfford = (price: number) => playerState.coins >= price;

  const handleBuyClick = (item: ShopItem) => {
    if (isItemOwned(item.id)) return;
    setSelectedItem(item);
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedItem) return;
    const success = purchaseItem(selectedItem.id, selectedItem.price);
    if (success) {
      setPurchasedItemName(selectedItem.name);
      setPurchaseSuccess(true);
      setTimeout(() => { setPurchaseSuccess(false); setShowConfirmation(false); setSelectedItem(null); }, 1800);
    }
  };

  const handleMysteryBox = () => {
    if (!canAfford(MYSTERY_BOX_PRICE) || mysteryBoxSpinning) return;
    const unownedItems = allWearableItems.filter(item => !isItemOwned(item.id));
    if (unownedItems.length === 0) {
      if (playerState.coins >= MYSTERY_BOX_PRICE) {
        setMysteryBoxSpinning(true);
        setTimeout(() => {
          addCoins(-MYSTERY_BOX_PRICE + 10);
          setMysteryBoxBonusPoints(true);
          setMysteryBoxResult(null);
          setShowMysteryResult(true);
          setMysteryBoxSpinning(false);
        }, 2000);
      }
      return;
    }
    setMysteryBoxSpinning(true);
    const randomItem = unownedItems[Math.floor(Math.random() * unownedItems.length)];
    setTimeout(() => {
      const success = purchaseItem(randomItem.id, MYSTERY_BOX_PRICE);
      if (success) { setMysteryBoxResult(randomItem); setMysteryBoxBonusPoints(false); setShowMysteryResult(true); }
      setMysteryBoxSpinning(false);
    }, 2000);
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Detective Shop</h2>
          <p className="text-gray-600 text-lg">Spend your Whisker Points on cool gear!</p>
          <div className="inline-flex items-center gap-2 mt-3 bg-gradient-to-r from-amber-100 to-yellow-100 px-5 py-2 rounded-full">
            <PawPrintIcon size={20} className="text-amber-600" />
            <span className="font-bold text-amber-700 text-lg">{playerState.coins} Whisker Points</span>
          </div>
        </div>

        {/* Mystery Box Banner */}
        <div className={`relative mb-8 rounded-3xl overflow-hidden cursor-pointer transition-all hover:shadow-2xl ${mysteryBoxSpinning ? 'animate-pulse' : 'hover:scale-[1.01]'}`} onClick={handleMysteryBox}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-pink-500/80 to-amber-500/90 z-10" />
          <img src={MYSTERY_BOX_IMAGE} alt="Mystery Box" className="w-full h-48 md:h-56 object-cover" />
          <div className="absolute inset-0 z-20 flex items-center justify-between px-6 md:px-12">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1"><GiftBoxIcon size={32} className="text-yellow-300" /><h3 className="text-2xl md:text-3xl font-bold">Mystery Box</h3></div>
              <p className="text-white/80 text-sm md:text-base max-w-md">Open for a surprise! Get a random wearable item you don't own yet!</p>
            </div>
            <div className="text-right">
              <div className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${canAfford(MYSTERY_BOX_PRICE) ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 hover:from-yellow-300 hover:to-amber-300 shadow-lg' : 'bg-gray-400/50 text-white/60 cursor-not-allowed'}`}>
                {mysteryBoxSpinning ? <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-amber-900 border-t-transparent rounded-full animate-spin" />Opening...</div> : <div className="flex items-center gap-2"><PawPrintIcon size={20} />{MYSTERY_BOX_PRICE} pts</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categoryConfig.map(({ type, label, icon: Icon }) => (
            <button key={type} onClick={() => setSelectedCategory(type)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base whitespace-nowrap transition-all ${selectedCategory === type ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 shadow-md'}`}>
              <Icon size={22} />{label}
            </button>
          ))}
        </div>

        {/* Outdoor Subtabs */}
        {selectedCategory === 'outdoor' && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {outdoorSubtabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setSelectedOutdoorSub(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${selectedOutdoorSub === id ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md' : 'bg-green-50 text-green-700 hover:bg-green-100 shadow-sm'}`}>
                <Icon size={16} />{label}
              </button>
            ))}
          </div>
        )}

        {/* Outdoor info banner */}
        {selectedCategory === 'outdoor' && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><TreeIcon size={22} className="text-green-600" /></div>
            <div>
              <p className="text-sm font-semibold text-green-800">Outdoor Decorations</p>
              <p className="text-xs text-green-600">Buy items to decorate the outside of your treehouse! Place them in the Outdoor view from My HQ.</p>
            </div>
          </div>
        )}

        {/* Wearable category info banner */}
        {selectedCategory !== 'outdoor' && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              {(() => {
                const cfg = categoryConfig.find(c => c.type === selectedCategory);
                const Icon = cfg?.icon || SparklesIcon;
                return <Icon size={22} className="text-purple-600" />;
              })()}
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-800">
                {selectedCategory === 'hat' && 'Hats — Worn on top of your detective\'s head'}
                {selectedCategory === 'disguise' && 'Disguises — Worn on your detective\'s face'}
                {selectedCategory === 'accessory' && 'Accessories — Worn around neck, chest, or back'}
                {selectedCategory === 'outfit' && 'Outfits — Worn on your detective\'s body'}
                {selectedCategory === 'shoes' && 'Shoes — Worn on your detective\'s feet'}
                {selectedCategory === 'gadget' && 'Gadgets — Held in your detective\'s hand'}
                {selectedCategory === 'pet' && 'Pets — A companion that follows your detective'}
              </p>
              <p className="text-xs text-purple-600">Buy items and dress up your detective in My Detective!</p>
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {categoryItems.map((item) => {
            const owned = isItemOwned(item.id);
            const affordable = canAfford(item.price);
            const zoneLabel = getZoneLabel(item.type);
            return (
              <div key={item.id} className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${owned ? 'ring-3 ring-green-400' : affordable ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'opacity-75'}`} onClick={() => !owned && handleBuyClick(item)}>
                <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 p-3 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-2xl" />
                  {/* Zone placement label */}
                  {zoneLabel && !item.subtype && (
                    <div className="absolute top-2 left-2 bg-purple-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {zoneLabel}
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-bold text-gray-800 text-sm md:text-base truncate">{item.name}</h4>
                  {item.subtype && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold capitalize">{item.subtype}</span>}
                  <div className="mt-2">
                    {owned ? (
                      <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-bold text-sm"><CheckIcon size={16} /> Owned</div>
                    ) : affordable ? (
                      <button onClick={(e) => { e.stopPropagation(); handleBuyClick(item); }}
                        className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 font-bold py-2 px-4 rounded-xl hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md text-sm">
                        <div className="flex items-center justify-center gap-1"><PawPrintIcon size={14} />{item.price} pts</div>
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-400 px-4 py-1.5 rounded-full font-bold text-sm"><LockIcon size={14} />{item.price} pts</div>
                    )}
                  </div>
                </div>
                {owned && <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-md"><CheckIcon size={14} /></div>}
                {!owned && !affordable && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-3xl"><div className="bg-white/90 rounded-full p-3 shadow-lg"><LockIcon size={24} className="text-gray-400" /></div></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Visit My Detective Button */}
        <div className="text-center mt-10">
          <button onClick={onNavigateToMyDetective} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl text-lg">
            <SparklesIcon size={24} /> Go to My Detective
          </button>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {showConfirmation && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in duration-200">
            {purchaseSuccess ? (
              <div className="text-center py-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center animate-bounce"><SparklesIcon size={40} className="text-white" /></div>
                  {[...Array(8)].map((_, i) => <div key={i} className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`, left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`, animationDelay: `${i * 0.1}s` }} />)}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">You got it!</h3>
                <p className="text-gray-600">{purchasedItemName} is now yours!</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-28 h-28 mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-3 mb-4 shadow-inner">
                    <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedItem.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{selectedItem.description}</p>
                  {getZoneLabel(selectedItem.type) && !selectedItem.subtype && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
                      Placement: {getZoneLabel(selectedItem.type)}
                    </span>
                  )}
                  {selectedItem.subtype && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold capitalize mt-1 inline-block">{selectedItem.subtype}</span>}
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between"><span className="text-gray-600 font-semibold">Cost:</span><div className="flex items-center gap-2 text-amber-700 font-bold text-lg"><PawPrintIcon size={20} /><span>{selectedItem.price} pts</span></div></div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200"><span className="text-gray-600 font-semibold">Your balance:</span><span className="font-bold text-gray-700">{playerState.coins} pts</span></div>
                  {!canAfford(selectedItem.price) && <p className="text-red-500 text-sm mt-2 text-center font-semibold">You need {selectedItem.price - playerState.coins} more points!</p>}
                </div>
                <p className="text-center text-gray-700 font-semibold mb-4">Are you sure?</p>
                <div className="flex gap-3">
                  <button onClick={() => { setShowConfirmation(false); setSelectedItem(null); }} className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-base">Cancel</button>
                  <button onClick={handleConfirmPurchase} disabled={!canAfford(selectedItem.price)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors text-base ${canAfford(selectedItem.price) ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 hover:from-amber-300 hover:to-yellow-300 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Yes, Buy!</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mystery Box Result Modal */}
      {showMysteryResult && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in duration-200 text-center">
            {mysteryBoxBonusPoints ? (
              <><div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center"><PawPrintIcon size={40} className="text-white" /></div><h3 className="text-2xl font-bold text-gray-800 mb-2">Bonus Points!</h3><p className="text-gray-600 mb-6">You own everything! Here's 10 bonus Whisker Points!</p></>
            ) : mysteryBoxResult ? (
              <><div className="relative w-28 h-28 mx-auto mb-4"><div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-3 shadow-inner"><img src={mysteryBoxResult.image} alt={mysteryBoxResult.name} className="w-full h-full object-contain rounded-xl" /></div></div><h3 className="text-2xl font-bold text-gray-800 mb-1">You got...</h3><p className="text-xl font-bold text-purple-600 mb-1">{mysteryBoxResult.name}!</p><p className="text-xs text-purple-500 font-semibold mb-2">Goes on: {getZoneLabel(mysteryBoxResult.type)}</p><p className="text-gray-500 text-sm mb-6">{mysteryBoxResult.description}</p></>
            ) : null}
            <button onClick={() => setShowMysteryResult(false)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md text-base">Awesome!</button>
          </div>
        </div>
      )}
    </section>
  );
};
