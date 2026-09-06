import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { useTranslatedMysteries } from '../hooks/useTranslatedMystery';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { MysteryCard } from './MysteryCard';
import { CharacterCard } from './CharacterCard';
import { ProgressDashboard } from './ProgressDashboard';
import { ReadingInterface } from './ReadingInterface';
import { ParentSection } from './ParentSection';
import { ParentDashboard } from './ParentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { Footer } from './Footer';
import { AuthModal } from './AuthModal';
import { TownMap } from './TownMap';
import { DetectiveShop } from './DetectiveShop';
import { MyDetective } from './MyDetective';
import { TreehouseHQ } from './TreehouseHQ';
import { StreakModal } from './StreakModal';
import { StreakCalendar } from './StreakCalendar';
import { characters } from '../data/gameData';
import { Mystery } from '../types';

import { 
  MagnifyingGlassIcon, 
  SparklesIcon, 
  StarIcon, 
  BookIcon, 
  MapIcon,
  PawPrintIcon,
  ShopIcon,
  ChartIcon,
  FlameIcon,
  TreehouseIcon,
} from './icons/Icons';



type View = 'home' | 'mysteries' | 'characters' | 'progress' | 'parents' | 'teachers' | 'shop' | 'my-detective' | 'my-hq';



const AppContent: React.FC = () => {
  const { mysteries: rawMysteries, accessibility, progress, loadFromCloud, playerState, streakData, showStreakModal, setShowStreakModal, pointsToast } = useGame();

  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { isSpanish } = useLanguage();
  
  // Apply translations to mysteries when in Spanish mode
  const translatedMysteries = useTranslatedMysteries(rawMysteries);
  const mysteries = translatedMysteries;

  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedMystery, setSelectedMystery] = useState<Mystery | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTownMap, setShowTownMap] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const mysteriesRef = useRef<HTMLDivElement>(null);

  const filteredMysteries = difficultyFilter === 'all' 
    ? mysteries 
    : mysteries.filter(m => m.difficulty === difficultyFilter);


  // Load progress from cloud when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadFromCloud();
    }
  }, [isAuthenticated, authLoading, loadFromCloud]);

  const scrollToMysteries = () => {
    setCurrentView('mysteries');
    setTimeout(() => {
      mysteriesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Apply high contrast mode
  useEffect(() => {
    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [accessibility.highContrast]);

  const handleSelectMysteryFromMap = (mystery: Mystery) => {
    setSelectedMystery(mystery);
    setShowTownMap(false);
  };

  // If playing a mystery, show the reading interface
  if (selectedMystery) {
    return (
      <ReadingInterface
        mystery={selectedMystery}
        onComplete={() => setSelectedMystery(null)}
        onExit={() => setSelectedMystery(null)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${accessibility.highContrast ? 'bg-white' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50'}`}>
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Floating Buttons - Right Side */}
      <div className="fixed top-20 right-4 z-30 flex flex-col gap-3">
        {/* Parent Dashboard Button (for parents) */}
        {isAuthenticated && user?.role === 'parent' && (
          <button
            onClick={() => setShowParentDashboard(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
            title="Parent Dashboard"
          >
            <ChartIcon size={24} />
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Parent Dashboard
            </span>
          </button>
        )}
        
        {/* Map Button */}
        <button
          onClick={() => setShowTownMap(true)}
          className="bg-gradient-to-r from-amber-400 to-orange-400 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
          title="Open Town Map"
        >
          <MapIcon size={24} />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Town Map
          </span>
        </button>
      </div>

      {/* Home View */}
      {currentView === 'home' && (
        <>
          <HeroSection onStartPlaying={scrollToMysteries} />
          
          {/* Welcome to Tangle Tail Town Banner */}
          <section className="py-8 px-4 bg-gradient-to-r from-amber-100 to-orange-100">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-800 mb-2">
                Welcome to Tangle Tail Town!
              </h2>
              <p className="text-amber-700 mb-4">
                Explore the village, solve mysteries, and learn new words with your animal detective friends!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setShowTownMap(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <MapIcon size={20} />
                  Explore the Town
                </button>
                <button
                  onClick={() => setCurrentView('my-hq')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <TreehouseIcon size={20} />
                  My Treehouse HQ
                </button>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <ShopIcon size={20} />
                  Detective Shop
                </button>
              </div>

            </div>
          </section>

          {/* Daily Streak Banner (show if streak > 0) */}
          {streakData.currentStreak > 0 && (
            <section className="py-6 px-4">
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => setShowStreakModal(true)}
                  className="w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FlameIcon className="text-white" size={32} filled />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-bold text-xl">
                          {streakData.currentStreak} Day Streak!
                        </p>
                        <p className="text-white/80 text-sm">
                          {streakData.currentStreak >= 7 
                            ? "You're on fire! Keep the streak going!" 
                            : "Come back tomorrow to keep your streak alive!"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-white/80 text-xs font-semibold">Best Streak</p>
                      <p className="text-white font-bold text-2xl">{streakData.longestStreak}</p>
                    </div>
                  </div>
                </button>
              </div>
            </section>
          )}
          
          {/* Features Section */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                How It Works
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    icon: MagnifyingGlassIcon,
                    title: 'Choose a Mystery',
                    description: 'Pick an exciting case to solve with your favorite animal detective.',
                    color: 'bg-purple-100 text-purple-600'
                  },
                  {
                    icon: BookIcon,
                    title: 'Learn New Words',
                    description: 'Practice vocabulary words before each story. Tap to hear them!',
                    color: 'bg-teal-100 text-teal-600'
                  },
                  {
                    icon: PawPrintIcon,
                    title: 'Earn Whisker Points',
                    description: 'Complete stories and games to earn Whisker Points!',
                    color: 'bg-amber-100 text-amber-600'
                  },
                  {
                    icon: ShopIcon,
                    title: 'Customize Detective',
                    description: 'Spend points in the shop to customize your detective!',
                    color: 'bg-pink-100 text-pink-600'
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
                    >
                      <div className={`w-14 h-14 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon size={28} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Featured Mysteries */}
          <section className="py-16 px-4 bg-white/50">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Featured Mysteries</h2>
                <button
                  onClick={() => setCurrentView('mysteries')}
                  className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  See All →
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mysteries.slice(0, 3).map((mystery) => (
                  <MysteryCard
                    key={mystery.id}
                    mystery={mystery}
                    onClick={() => setSelectedMystery(mystery)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Meet the Detectives Preview */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Meet the Detectives</h2>
                <button
                  onClick={() => setCurrentView('characters')}
                  className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  See All →
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.slice(0, 3).map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            </div>
          </section>

          {/* Stats Banner */}
          {progress.totalStars > 0 && (
            <section className="py-12 px-4 bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-2xl font-bold mb-6">Your Detective Journey</h2>
                <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
                  <div>
                    <p className="text-4xl font-bold">{progress.totalStars}</p>
                    <p className="text-white/80">Stars Earned</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">{progress.completedMysteries.length}</p>
                    <p className="text-white/80">Cases Solved</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">{progress.wordFamiliesMastered.length}</p>
                    <p className="text-white/80">Word Families</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">{playerState.coins}</p>
                    <p className="text-white/80">Whisker Points</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <FlameIcon className="text-orange-300" size={24} filled />
                      <p className="text-4xl font-bold">{streakData.currentStreak}</p>
                    </div>
                    <p className="text-white/80">Day Streak</p>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-6 flex-wrap">
                  <button
                    onClick={() => setShowProgressModal(true)}
                    className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors"
                  >
                    View Full Progress
                  </button>
                  <button
                    onClick={() => setCurrentView('shop')}
                    className="bg-purple-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-800 transition-colors flex items-center gap-2"
                  >
                    <ShopIcon size={20} />
                    Visit Shop
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Mysteries View */}
      {currentView === 'mysteries' && (
        <section ref={mysteriesRef} className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Choose Your Mystery
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Pick a case to solve and discover new word families!
              </p>
              
              {/* Difficulty Filter */}
              <div className="flex justify-center gap-3 flex-wrap">
                {[
                  { value: 'all', label: 'All Mysteries' },
                  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700' },
                  { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700' },
                  { value: 'hard', label: 'Tricky', color: 'bg-rose-100 text-rose-700' }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setDifficultyFilter(filter.value as typeof difficultyFilter)}
                    className={`
                      px-5 py-2 rounded-full font-semibold transition-all duration-300
                      ${difficultyFilter === filter.value
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : filter.color || 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMysteries.map((mystery) => (
                <MysteryCard
                  key={mystery.id}
                  mystery={mystery}
                  onClick={() => setSelectedMystery(mystery)}
                />
              ))}
            </div>

            {filteredMysteries.length === 0 && (
              <div className="text-center py-12">
                <SparklesIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">No mysteries found with this filter.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Characters View */}
      {currentView === 'characters' && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Meet the Detectives
              </h2>
              <p className="text-gray-600 text-lg">
                Get to know our friendly animal detective team!
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop View */}
      {currentView === 'shop' && (
        <DetectiveShop onNavigateToMyDetective={() => setCurrentView('my-detective')} />
      )}

      {/* My Detective View */}
      {currentView === 'my-detective' && (
        <MyDetective 
          onNavigateToShop={() => setCurrentView('shop')} 
          onNavigateToDetectives={() => setCurrentView('characters')}
        />
      )}


      {/* My HQ View */}
      {currentView === 'my-hq' && (
        <TreehouseHQ 
          onNavigateToShop={() => setCurrentView('shop')} 
          onNavigateToMyDetective={() => setCurrentView('my-detective')}
        />
      )}


      {/* Progress View */}
      {currentView === 'progress' && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                My Detective Progress
              </h2>
              <p className="text-gray-600 text-lg">
                See how far you've come on your reading adventure!
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Stars', value: progress.totalStars, icon: StarIcon, color: 'bg-yellow-100 text-yellow-600' },
                { label: 'Cases Solved', value: progress.completedMysteries.length, icon: MagnifyingGlassIcon, color: 'bg-green-100 text-green-600' },
                { label: 'Word Families', value: progress.wordFamiliesMastered.length, icon: BookIcon, color: 'bg-purple-100 text-purple-600' },
                { label: 'Whisker Pts', value: playerState.coins, icon: PawPrintIcon, color: 'bg-amber-100 text-amber-600' },
                { label: 'Day Streak', value: streakData.currentStreak, icon: FlameIcon, color: 'bg-orange-100 text-orange-600' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-5 shadow-lg text-center">
                    <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Reading Streak Calendar */}
            <div className="mb-8">
              <StreakCalendar
                activeDays={streakData.activeDays}
                currentStreak={streakData.currentStreak}
                longestStreak={streakData.longestStreak}
              />
            </div>

            {/* Shop CTA */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 mb-8 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Customize Your Detective!</h3>
              <p className="text-white/80 mb-4">Spend your Whisker Points on disguises, outfits, gadgets, and pets!</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setCurrentView('shop')}
                  className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors inline-flex items-center gap-2"
                >
                  <ShopIcon size={20} />
                  Open Detective Shop
                </button>
                <button
                  onClick={() => setCurrentView('my-detective')}
                  className="bg-purple-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-800 transition-colors inline-flex items-center gap-2"
                >
                  <SparklesIcon size={20} />
                  My Detective
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">My Badges</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {progress.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`
                      p-4 rounded-2xl text-center transition-all duration-300
                      ${badge.earned
                        ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200'
                        : 'bg-gray-50 border-2 border-gray-100 opacity-50'
                      }
                    `}
                  >
                    <div className={`text-4xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <p className={`font-bold text-sm ${badge.earned ? 'text-amber-700' : 'text-gray-400'}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Word Families */}
            {progress.wordFamiliesMastered.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Word Families Mastered</h3>
                <div className="flex flex-wrap gap-3">
                  {progress.wordFamiliesMastered.map((family) => (
                    <span
                      key={family}
                      className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 px-5 py-2 rounded-full font-bold"
                    >
                      {family}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Parents View */}
      {currentView === 'parents' && (
        <ParentSection 
          onOpenAuth={() => setShowAuthModal(true)} 
          onOpenDashboard={() => setShowParentDashboard(true)}
        />
      )}

      {/* Teachers View */}
      {currentView === 'teachers' && (
        <TeacherDashboard 
          onOpenAuth={() => setShowAuthModal(true)} 
        />
      )}

      <Footer onNavigate={(view) => {
        if (view === 'parentDashboard') {
          setShowParentDashboard(true);
        } else if (view === 'shop') {
          setCurrentView('shop');
        } else if (view === 'my-detective') {
          setCurrentView('my-detective');
        } else if (view === 'my-hq') {
          setCurrentView('my-hq');
        } else if (view === 'mysteries' || view === 'characters' || view === 'progress' || view === 'parents' || view === 'home' || view === 'teachers') {
          setCurrentView(view as View);
        }
      }} />



      {/* Streak Modal */}
      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        currentStreak={streakData.currentStreak}
        longestStreak={streakData.longestStreak}
        isNewDay={true}
      />

      {/* Progress Modal */}
      {showProgressModal && (
        <ProgressDashboard 
          onClose={() => setShowProgressModal(false)} 
          onOpenAuth={() => {
            setShowProgressModal(false);
            setShowAuthModal(true);
          }}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Town Map Modal */}
      <TownMap
        isOpen={showTownMap}
        onClose={() => setShowTownMap(false)}
        onSelectMystery={handleSelectMysteryFromMap}
      />

      {showParentDashboard && (
        <ParentDashboard onClose={() => setShowParentDashboard(false)} />
      )}

      {/* Whisker Points Toast */}
      {pointsToast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-bounce">
          <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-lg">
            <PawPrintIcon size={24} />
            <span>+{pointsToast.amount} Whisker Points!</span>
            <SparklesIcon size={20} className="text-yellow-700" />
          </div>
        </div>
      )}
    </div>
  );
};



export default function AppLayout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
