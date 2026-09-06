import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Mystery, UserProgress, AccessibilitySettings, Badge, Avatar, PlayerState, TownLocation, GameScore } from '../types';
import { mysteries as initialMysteries, badges as initialBadges } from '../data/gameData';
import { townLocations as initialTownLocations } from '../data/townData';
import { supabase } from '@/lib/supabase';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  activeDays: string[]; // Array of 'YYYY-MM-DD'
}

interface GameContextType {
  mysteries: Mystery[];
  progress: UserProgress;
  accessibility: AccessibilitySettings;
  currentMystery: Mystery | null;
  currentPage: number;
  isPlaying: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncError: string | null;
  playerState: PlayerState;
  townLocations: TownLocation[];
  streakData: StreakData;
  showStreakModal: boolean;
  pointsToast: { show: boolean; amount: number; message: string };
  setShowStreakModal: (show: boolean) => void;
  setCurrentMystery: (mystery: Mystery | null) => void;
  setCurrentPage: (page: number) => void;
  completeMystery: (mysteryId: string, stars: number) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  setIsPlaying: (playing: boolean) => void;
  resetProgress: () => void;
  syncWithCloud: () => Promise<boolean>;
  loadFromCloud: () => Promise<boolean>;
  updateAvatar: (avatar: Avatar) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  purchaseItem: (itemId: string, price: number) => boolean;
  completeOnboarding: () => void;
  addGameScore: (score: Omit<GameScore, 'completedAt'>) => void;
  getGameScores: (mysteryId?: string) => GameScore[];
  getTotalScore: () => { total: number; max: number; percentage: number };
  recordActivity: () => void;
  setChosenDetective: (characterId: string) => void;
  showPointsToast: (amount: number, message: string) => void;
}


const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROGRESS: 'wordWhiskerProgress',
  ACCESSIBILITY: 'wordWhiskerAccessibility',
  PLAYER_STATE: 'wordWhiskerPlayerState',
  TOWN_LOCATIONS: 'wordWhiskerTownLocations',
  LAST_SYNC: 'wordWhiskerLastSync',
  SESSION: 'wordWhiskerSession',
  STREAK: 'wordWhiskerStreak'
};

const defaultProgress: UserProgress = {
  completedMysteries: [],
  badges: initialBadges,
  wordFamiliesMastered: [],
  totalStars: 0
};

const defaultAccessibility: AccessibilitySettings = {
  textSize: 'medium',
  highContrast: false,
  audioSpeed: 0.85
};

const defaultPlayerState: PlayerState = {
  avatar: null,
  coins: 45,
  currentLevel: 1,
  ownedItems: [],
  hasCompletedOnboarding: false,
  gameScores: [],
  chosenDetectiveId: null,
};



const getTodayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayString = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  activeDays: []
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [mysteries, setMysteries] = useState<Mystery[]>(initialMysteries);
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        badges: initialBadges.map(badge => {
          const savedBadge = parsed.badges?.find((b: Badge) => b.id === badge.id);
          return savedBadge || badge;
        })
      };
    }
    return defaultProgress;
  });
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
    return saved ? JSON.parse(saved) : defaultAccessibility;
  });
  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAYER_STATE);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultPlayerState, ...parsed, gameScores: parsed.gameScores || [] };
    }
    return defaultPlayerState;
  });
  const [townLocations, setTownLocations] = useState<TownLocation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOWN_LOCATIONS);
    return saved ? JSON.parse(saved) : initialTownLocations;
  });

  // Streak state
  const [streakData, setStreakData] = useState<StreakData>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultStreakData;
      }
    }
    return defaultStreakData;
  });
  const [showStreakModal, setShowStreakModal] = useState(false);
  const streakInitializedRef = useRef(false);

  const [currentMystery, setCurrentMystery] = useState<Mystery | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  });
  const [syncError, setSyncError] = useState<string | null>(null);
  
  const shouldSyncRef = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Record daily activity and update streak
  const recordActivity = useCallback(() => {
    const today = getTodayString();
    const yesterday = getYesterdayString();

    setStreakData(prev => {
      // Already recorded today
      if (prev.lastActiveDate === today) {
        return prev;
      }

      let newStreak: number;
      const isConsecutive = prev.lastActiveDate === yesterday;

      if (isConsecutive) {
        // Consecutive day - increment streak
        newStreak = prev.currentStreak + 1;
      } else if (prev.lastActiveDate === '') {
        // First ever activity
        newStreak = 1;
      } else {
        // Streak broken - reset to 1
        newStreak = 1;
      }

      const newLongest = Math.max(prev.longestStreak, newStreak);
      const newActiveDays = prev.activeDays.includes(today) 
        ? prev.activeDays 
        : [...prev.activeDays, today];

      const newData: StreakData = {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today,
        activeDays: newActiveDays
      };

      return newData;
    });
  }, []);

  // Initialize streak on mount - record today's activity
  useEffect(() => {
    if (!streakInitializedRef.current) {
      streakInitializedRef.current = true;
      const today = getTodayString();
      const yesterday = getYesterdayString();
      
      // Check if this is a new day visit
      if (streakData.lastActiveDate !== today) {
        const isConsecutive = streakData.lastActiveDate === yesterday;
        
        // Record activity
        recordActivity();
        
        // Show modal after a short delay (only for consecutive days or first visit)
        if (isConsecutive || streakData.lastActiveDate === '') {
          setTimeout(() => {
            setShowStreakModal(true);
          }, 1500);
        } else if (streakData.currentStreak > 0) {
          // Streak was broken, still show modal but with reset message
          setTimeout(() => {
            setShowStreakModal(true);
          }, 1500);
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save streak data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streakData));
  }, [streakData]);

  // Sync streak to cloud when authenticated
  useEffect(() => {
    const syncStreak = async () => {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!session || !streakData.lastActiveDate) return;
      
      try {
        const sessionData = JSON.parse(session);
        await supabase.functions.invoke('streak-sync', {
          body: {
            action: 'save',
            token: sessionData.token,
            streakData: {
              currentStreak: streakData.currentStreak,
              longestStreak: streakData.longestStreak,
              lastActiveDate: streakData.lastActiveDate,
              activeDays: streakData.activeDays
            }
          }
        });
      } catch (error) {
        console.warn('Streak sync error:', error);
      }
    };

    // Debounce streak sync
    const timeout = setTimeout(syncStreak, 3000);
    return () => clearTimeout(timeout);
  }, [streakData]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    shouldSyncRef.current = true;
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(accessibility));
    shouldSyncRef.current = true;
  }, [accessibility]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYER_STATE, JSON.stringify(playerState));
    shouldSyncRef.current = true;
  }, [playerState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOWN_LOCATIONS, JSON.stringify(townLocations));
  }, [townLocations]);

  useEffect(() => {
    setMysteries(initialMysteries.map(m => ({
      ...m,
      completed: progress.completedMysteries.includes(m.id),
      stars: progress.completedMysteries.includes(m.id) ? 3 : 0
    })));
  }, [progress.completedMysteries]);

  useEffect(() => {
    setTownLocations(prevLocations => 
      prevLocations.map(location => {
        const locationMysteries = location.mysteryIds;
        const completedInLocation = locationMysteries.filter(id => 
          progress.completedMysteries.includes(id)
        );
        return {
          ...location,
          visited: completedInLocation.length > 0,
          completed: completedInLocation.length === locationMysteries.length
        };
      })
    );
  }, [progress.completedMysteries]);

  const syncWithCloud = useCallback(async (): Promise<boolean> => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!session) return true;

    setIsSyncing(true);
    setSyncError(null);
    
    try {
      const sessionData = JSON.parse(session);
      
      const { data, error } = await supabase.functions.invoke('sync-progress', {
        body: {
          action: 'save',
          token: sessionData.token,
          progress: {
            completedMysteries: progress.completedMysteries,
            wordFamiliesMastered: progress.wordFamiliesMastered,
            totalStars: progress.totalStars
          },
          badges: progress.badges.filter(b => b.earned).map(b => ({
            id: b.id,
            earned: b.earned,
            earnedDate: b.earnedDate
          })),
          playerState: {
            avatar: playerState.avatar,
            coins: playerState.coins,
            currentLevel: playerState.currentLevel,
            ownedItems: playerState.ownedItems,
            hasCompletedOnboarding: playerState.hasCompletedOnboarding,
            gameScores: playerState.gameScores
          },
          accessibility: accessibility
        }
      });

      if (error) {
        console.warn('Cloud sync error (using local storage):', error);
      }

      const now = new Date().toISOString();
      setLastSyncedAt(now);
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
      shouldSyncRef.current = false;
      return true;
    } catch (error) {
      console.warn('Sync error (using local storage):', error);
      return true;
    } finally {
      setIsSyncing(false);
    }
  }, [progress, playerState, accessibility]);

  const loadFromCloud = useCallback(async (): Promise<boolean> => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!session) return true;

    setIsSyncing(true);
    setSyncError(null);
    
    try {
      const sessionData = JSON.parse(session);
      
      // Load progress
      const { data, error } = await supabase.functions.invoke('sync-progress', {
        body: { 
          action: 'load', 
          token: sessionData.token 
        }
      });

      if (error) {
        console.warn('Cloud load error (using local storage):', error);
        return true;
      }

      if (data && data.progress && data.progress.completedMysteries?.length > 0) {
        const updatedBadges = initialBadges.map(badge => {
          const earnedBadge = data.earnedBadges?.find((b: any) => b.id === badge.id);
          if (earnedBadge) {
            return { ...badge, earned: true, earnedDate: earnedBadge.earnedAt || earnedBadge.earnedDate };
          }
          return badge;
        });

        setProgress({
          completedMysteries: data.progress.completedMysteries || [],
          wordFamiliesMastered: data.progress.wordFamiliesMastered || [],
          totalStars: data.progress.totalStars || 0,
          badges: updatedBadges
        });

        if (data.playerState) {
          setPlayerState({
            avatar: data.playerState.avatar || null,
            coins: data.playerState.coins || 0,
            currentLevel: data.playerState.currentLevel || 1,
            ownedItems: data.playerState.ownedItems || [],
            hasCompletedOnboarding: data.playerState.hasCompletedOnboarding || false,
            gameScores: data.playerState.gameScores || []
          });
        }

        if (data.accessibility) {
          setAccessibility({
            textSize: data.accessibility.textSize || 'medium',
            highContrast: data.accessibility.highContrast || false,
            audioSpeed: data.accessibility.audioSpeed ?? 0.85
          });
        }
      }

      // Load streak data from cloud
      try {
        const { data: streakResult } = await supabase.functions.invoke('streak-sync', {
          body: {
            action: 'load',
            token: sessionData.token
          }
        });

        if (streakResult?.streakData) {
          const cloudStreak = streakResult.streakData;
          // Use cloud data if it has more active days (more complete)
          setStreakData(prev => {
            if (cloudStreak.activeDays.length > prev.activeDays.length) {
              return cloudStreak;
            }
            return prev;
          });
        }
      } catch (e) {
        console.warn('Streak load error:', e);
      }

      const now = new Date().toISOString();
      setLastSyncedAt(now);
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
      shouldSyncRef.current = false;
      return true;
    } catch (error) {
      console.warn('Load from cloud error (using local storage):', error);
      return true;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync student progress to classroom_students for teacher dashboard
  const classroomSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!session) return;

    // Debounce classroom progress sync
    if (classroomSyncTimeoutRef.current) {
      clearTimeout(classroomSyncTimeoutRef.current);
    }

    classroomSyncTimeoutRef.current = setTimeout(async () => {
      try {
        const storedUser = localStorage.getItem('wordWhiskerUser');
        if (!storedUser) return;
        const userData = JSON.parse(storedUser);
        
        const totalGames = playerState.gameScores.length;
        const avgScore = totalGames > 0
          ? Math.round(playerState.gameScores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / totalGames)
          : 0;

        await supabase.functions.invoke('sync-student-progress', {
          body: {
            action: 'sync',
            user_id: userData.id,
            progress: {
              completedMysteries: progress.completedMysteries,
              wordFamiliesMastered: progress.wordFamiliesMastered,
              totalStars: progress.totalStars,
              gamesPlayed: totalGames,
              averageScore: avgScore,
              streakDays: streakData.currentStreak,
              coins: playerState.coins,
              gameScores: playerState.gameScores.slice(-50)
            }
          }
        });
      } catch (error) {
        console.warn('Classroom progress sync error:', error);
      }
    }, 8000);

    return () => {
      if (classroomSyncTimeoutRef.current) {
        clearTimeout(classroomSyncTimeoutRef.current);
      }
    };
  }, [progress, playerState, streakData.currentStreak]);

  useEffect(() => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (session && shouldSyncRef.current) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        syncWithCloud();
      }, 5000);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [progress, playerState, accessibility, syncWithCloud]);


  // Points toast state
  const [pointsToast, setPointsToast] = useState<{ show: boolean; amount: number; message: string }>({ show: false, amount: 0, message: '' });

  const showPointsToastFn = useCallback((amount: number, message: string) => {
    setPointsToast({ show: true, amount, message });
    setTimeout(() => setPointsToast({ show: false, amount: 0, message: '' }), 3500);
  }, []);

  const setChosenDetective = useCallback((characterId: string) => {
    setPlayerState(prev => ({ ...prev, chosenDetectiveId: characterId }));
  }, []);

  const completeMystery = (mysteryId: string, stars: number) => {

    const mystery = mysteries.find(m => m.id === mysteryId);
    if (!mystery) return;

    // Avoid double-counting if already completed
    const isNew = !progress.completedMysteries.includes(mysteryId);


    const newCompletedMysteries = progress.completedMysteries.includes(mysteryId)
      ? progress.completedMysteries
      : [...progress.completedMysteries, mysteryId];

    const newWordFamilies = progress.wordFamiliesMastered.includes(mystery.wordFamily)
      ? progress.wordFamiliesMastered
      : [...progress.wordFamiliesMastered, mystery.wordFamily];

    const newTotalStars = progress.totalStars + stars;
    const coinsEarned = 10 + (stars === 3 ? 5 : 0);
    if (isNew) {
      setPlayerState(prev => ({
        ...prev,
        coins: prev.coins + coinsEarned
      }));
      // Show points toast
      showPointsToastFn(coinsEarned, `You earned ${coinsEarned} Whisker Points!`);
    }

    const updatedBadges = progress.badges.map(badge => {
      if (badge.earned) return badge;
      
      switch (badge.id) {
        case 'first-mystery':
          return newCompletedMysteries.length >= 1 
            ? { ...badge, earned: true, earnedDate: new Date().toISOString() }
            : badge;
        case 'word-wizard':
          return newWordFamilies.length >= 3
            ? { ...badge, earned: true, earnedDate: new Date().toISOString() }
            : badge;
        case 'super-sleuth':
          return newCompletedMysteries.length >= 5
            ? { ...badge, earned: true, earnedDate: new Date().toISOString() }
            : badge;
        case 'star-collector':
          return newTotalStars >= 10
            ? { ...badge, earned: true, earnedDate: new Date().toISOString() }
            : badge;
        case 'detective-master':
          return newCompletedMysteries.length >= initialMysteries.length
            ? { ...badge, earned: true, earnedDate: new Date().toISOString() }
            : badge;
        default:
          return badge;
      }
    });

    setProgress({
      completedMysteries: newCompletedMysteries,
      badges: updatedBadges,
      wordFamiliesMastered: newWordFamilies,
      totalStars: newTotalStars
    });

    // Also record activity when completing a mystery
    recordActivity();
  };

  const addGameScore = (score: Omit<GameScore, 'completedAt'>) => {
    const newScore: GameScore = {
      ...score,
      completedAt: new Date().toISOString()
    };

    setPlayerState(prev => ({
      ...prev,
      gameScores: [...prev.gameScores, newScore]
    }));

    if (score.score === score.maxScore) {
      setPlayerState(prev => ({
        ...prev,
        coins: prev.coins + 5
      }));
    }

    // Record activity when playing games
    recordActivity();
  };

  const getGameScores = (mysteryId?: string): GameScore[] => {
    if (mysteryId) {
      return playerState.gameScores.filter(s => s.mysteryId === mysteryId);
    }
    return playerState.gameScores;
  };

  const getTotalScore = () => {
    const total = playerState.gameScores.reduce((sum, s) => sum + s.score, 0);
    const max = playerState.gameScores.reduce((sum, s) => sum + s.maxScore, 0);
    const percentage = max > 0 ? Math.round((total / max) * 100) : 0;
    return { total, max, percentage };
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...settings }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    setPlayerState(defaultPlayerState);
    setTownLocations(initialTownLocations);
    setStreakData(defaultStreakData);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.PLAYER_STATE);
    localStorage.removeItem(STORAGE_KEYS.TOWN_LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    localStorage.removeItem(STORAGE_KEYS.STREAK);
    setLastSyncedAt(null);
  };

  const updateAvatar = (avatar: Avatar) => {
    setPlayerState(prev => ({ ...prev, avatar }));
  };

  const addCoins = (amount: number) => {
    setPlayerState(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const spendCoins = (amount: number): boolean => {
    if (playerState.coins >= amount) {
      setPlayerState(prev => ({ ...prev, coins: prev.coins - amount }));
      return true;
    }
    return false;
  };

  const purchaseItem = (itemId: string, price: number): boolean => {
    if (playerState.ownedItems.includes(itemId)) return false;
    if (playerState.coins < price) return false;
    
    setPlayerState(prev => ({
      ...prev,
      coins: prev.coins - price,
      ownedItems: [...prev.ownedItems, itemId]
    }));
    return true;
  };

  const completeOnboarding = () => {
    setPlayerState(prev => ({ ...prev, hasCompletedOnboarding: true }));
  };

  return (
    <GameContext.Provider value={{
      mysteries,
      progress,
      accessibility,
      currentMystery,
      currentPage,
      isPlaying,
      isSyncing,
      lastSyncedAt,
      syncError,
      playerState,
      townLocations,
      streakData,
      showStreakModal,
      pointsToast,
      setShowStreakModal,
      setCurrentMystery,
      setCurrentPage,
      completeMystery,
      updateAccessibility,
      setIsPlaying,
      resetProgress,
      syncWithCloud,
      loadFromCloud,
      updateAvatar,
      addCoins,
      spendCoins,
      purchaseItem,
      completeOnboarding,
      addGameScore,
      getGameScores,
      getTotalScore,
      recordActivity,
      setChosenDetective,
      showPointsToast: showPointsToastFn,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
