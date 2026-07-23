import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Challenge,
  WeakSound,
  Achievement,
  PracticeRecord,
  WeeklyScore
} from '../types';
import { DAILY_CHALLENGES, WEAK_SOUNDS, ACHIEVEMENTS, INITIAL_USER_PROFILE } from '../data/mockData';

export interface UserDataStore {
  user: UserProfile;
  savedWords: string[];
  challenges: Challenge[];
  practiceHistory: PracticeRecord[];
  achievements: Achievement[];
  weeklyProgress: WeeklyScore[];
  weakSounds: WeakSound[];
}

export const createFreshUserData = (name: string, email: string): UserDataStore => ({
  user: {
    name: name.trim() || 'New Learner',
    email: email.trim().toLowerCase(),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetAccent: 'US',
    nativeLanguage: 'English',
    level: 'A1',
    streakDays: 0,
    xpPoints: 0,
    minutesPracticedToday: 0,
    dailyGoalMinutes: 15,
    wordsMastered: 0,
    practiceSessions: 0,
    overallScore: 0,
    subscriptionPlan: 'Free',
    joinedDate: 'Just now'
  },
  savedWords: [],
  challenges: DAILY_CHALLENGES.map(c => ({
    ...c,
    completed: false,
    userBestScore: 0
  })),
  practiceHistory: [],
  achievements: ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: false,
    progress: 0,
    unlockedAt: undefined
  })),
  weeklyProgress: [
    { day: 'Mon', score: 0 },
    { day: 'Tue', score: 0 },
    { day: 'Wed', score: 0 },
    { day: 'Thu', score: 0 },
    { day: 'Fri', score: 0 },
    { day: 'Sat', score: 0 },
    { day: 'Sun', score: 0 }
  ],
  weakSounds: WEAK_SOUNDS.map(w => ({
    ...w,
    accuracy: 0,
    practiceCount: 0
  }))
});

// Preloaded demo user for instant explore experience
export const createDemoUserData = (): UserDataStore => ({
  user: { ...INITIAL_USER_PROFILE, practiceSessions: 24, overallScore: 86 },
  savedWords: ['Pronunciation', 'Phenomenon', 'Thoroughly'],
  challenges: DAILY_CHALLENGES,
  practiceHistory: [
    { id: '1', word: 'Pronunciation', score: 92, date: '2 hours ago', type: 'Pronunciation Check' },
    { id: '2', word: 'Phenomenon', score: 85, date: 'Yesterday', type: 'Dictionary Drill' },
    { id: '3', word: 'Schedule', score: 78, date: '2 days ago', type: 'Voice Tutor' }
  ],
  achievements: ACHIEVEMENTS,
  weeklyProgress: [
    { day: 'Mon', score: 78 },
    { day: 'Tue', score: 82 },
    { day: 'Wed', score: 85 },
    { day: 'Thu', score: 80 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 91 },
    { day: 'Sun', score: 94 }
  ],
  weakSounds: WEAK_SOUNDS
});

interface UserContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  challenges: Challenge[];
  weakSounds: WeakSound[];
  savedWords: string[];
  practiceHistory: PracticeRecord[];
  achievements: Achievement[];
  weeklyProgress: WeeklyScore[];
  addXP: (amount: number) => void;
  incrementPracticeTime: (minutes: number) => void;
  recordPracticeResult: (word: string, score: number, type?: string) => void;
  toggleSaveWord: (word: string) => void;
  completeChallenge: (challengeId: string, score: number) => void;
  updateUserAccent: (accent: 'US' | 'UK' | 'AU') => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeEmail, setActiveEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pronounce_ai_active_email');
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('pronounce_ai_auth');
      if (savedAuth !== null) return savedAuth === 'true';
    }
    return false;
  });

  // Current User Full Dataset State
  const [userDataStore, setUserDataStore] = useState<UserDataStore>(() => {
    if (typeof window !== 'undefined' && activeEmail) {
      const savedStore = localStorage.getItem(`pronounce_ai_userData_${activeEmail.toLowerCase()}`);
      if (savedStore) {
        try {
          return JSON.parse(savedStore);
        } catch {
          /* fallback */
        }
      }
    }
    // Default initial fallback
    return createDemoUserData();
  });

  // Save changes to localStorage whenever activeEmail or userDataStore changes
  useEffect(() => {
    if (activeEmail && userDataStore) {
      localStorage.setItem(`pronounce_ai_userData_${activeEmail.toLowerCase()}`, JSON.stringify(userDataStore));
      localStorage.setItem('pronounce_ai_active_email', activeEmail);
    }
  }, [activeEmail, userDataStore]);

  useEffect(() => {
    localStorage.setItem('pronounce_ai_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const login = async (email: string, _password: string, _rememberMe = false) => {
    await new Promise(res => setTimeout(res, 600));

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Check if user dataset already exists for this email
    const existingDataStr = localStorage.getItem(`pronounce_ai_userData_${cleanEmail}`);
    let loadedStore: UserDataStore;

    if (existingDataStr) {
      try {
        loadedStore = JSON.parse(existingDataStr);
      } catch {
        const derivedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
        const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
        loadedStore = createFreshUserData(formattedName, cleanEmail);
      }
    } else {
      // Create fresh brand new data for newly logged in account
      const derivedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      loadedStore = createFreshUserData(formattedName, cleanEmail);
    }

    setActiveEmail(cleanEmail);
    setUserDataStore(loadedStore);
    setIsAuthenticated(true);

    return { success: true };
  };

  const register = async (name: string, email: string, _password: string) => {
    await new Promise(res => setTimeout(res, 600));

    if (!name.trim()) {
      return { success: false, message: 'Full name is required.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Always create a fresh, clean, brand new dataset for a newly registered user
    const freshStore = createFreshUserData(name.trim(), cleanEmail);

    setActiveEmail(cleanEmail);
    setUserDataStore(freshStore);
    setIsAuthenticated(true);

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveEmail(null);
  };

  const addXP = (amount: number) => {
    setUserDataStore(prev => ({
      ...prev,
      user: {
        ...prev.user,
        xpPoints: prev.user.xpPoints + amount
      }
    }));
  };

  const incrementPracticeTime = (minutes: number) => {
    setUserDataStore(prev => ({
      ...prev,
      user: {
        ...prev.user,
        minutesPracticedToday: prev.user.minutesPracticedToday + minutes,
        streakDays: prev.user.streakDays === 0 ? 1 : prev.user.streakDays
      }
    }));
  };

  const recordPracticeResult = (word: string, score: number, type = 'Pronunciation Practice') => {
    setUserDataStore(prev => {
      const newSessions = prev.user.practiceSessions + 1;
      const newXP = prev.user.xpPoints + (score >= 80 ? 50 : 20);
      const isNewMastered = score >= 80 && !prev.practiceHistory.some(p => p.word.toLowerCase() === word.toLowerCase() && p.score >= 80);
      const newWordsMastered = isNewMastered ? prev.user.wordsMastered + 1 : prev.user.wordsMastered;

      // Recalculate average overall score
      const allScores = [...prev.practiceHistory.map(p => p.score), score];
      const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

      const newHistoryItem: PracticeRecord = {
        id: Date.now().toString(),
        word,
        score,
        date: 'Just now',
        type
      };

      // Update weekly progress
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayName = days[new Date().getDay()];
      const updatedWeekly = prev.weeklyProgress.map(w =>
        w.day === todayName ? { ...w, score: Math.max(w.score, score) } : w
      );

      // Check achievements
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'streak_master') {
          const p = Math.min(100, Math.round((prev.user.streakDays / 14) * 100));
          return { ...ach, progress: p, unlocked: p >= 100 };
        }
        if (ach.id === 'phoneme_pro' && score >= 90) {
          const count90 = allScores.filter(s => s >= 90).length;
          const p = Math.min(100, Math.round((count90 / 20) * 100));
          return { ...ach, progress: p, unlocked: p >= 100 };
        }
        if (ach.id === 'voice_veteran') {
          const p = Math.min(100, Math.round((newSessions / 30) * 100));
          return { ...ach, progress: p, unlocked: p >= 100 };
        }
        return ach;
      });

      return {
        ...prev,
        user: {
          ...prev.user,
          streakDays: prev.user.streakDays === 0 ? 1 : prev.user.streakDays,
          xpPoints: newXP,
          minutesPracticedToday: prev.user.minutesPracticedToday + 2,
          practiceSessions: newSessions,
          wordsMastered: newWordsMastered,
          overallScore: avgScore
        },
        practiceHistory: [newHistoryItem, ...prev.practiceHistory],
        weeklyProgress: updatedWeekly,
        achievements: updatedAchievements
      };
    });
  };

  const toggleSaveWord = (word: string) => {
    setUserDataStore(prev => {
      const exists = prev.savedWords.includes(word);
      const updated = exists
        ? prev.savedWords.filter(w => w !== word)
        : [...prev.savedWords, word];
      return {
        ...prev,
        savedWords: updated
      };
    });
  };

  const completeChallenge = (challengeId: string, score: number) => {
    setUserDataStore(prev => {
      let earnedXP = 0;
      const updatedChallenges = prev.challenges.map(c => {
        if (c.id === challengeId) {
          if (!c.completed) earnedXP = c.xpReward;
          return {
            ...c,
            completed: true,
            userBestScore: Math.max(c.userBestScore || 0, score)
          };
        }
        return c;
      });

      return {
        ...prev,
        user: {
          ...prev.user,
          xpPoints: prev.user.xpPoints + earnedXP,
          practiceSessions: prev.user.practiceSessions + 1
        },
        challenges: updatedChallenges
      };
    });
  };

  const updateUserAccent = (accent: 'US' | 'UK' | 'AU') => {
    setUserDataStore(prev => ({
      ...prev,
      user: {
        ...prev.user,
        targetAccent: accent
      }
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user: userDataStore.user,
        isAuthenticated,
        challenges: userDataStore.challenges,
        weakSounds: userDataStore.weakSounds,
        savedWords: userDataStore.savedWords,
        practiceHistory: userDataStore.practiceHistory,
        achievements: userDataStore.achievements,
        weeklyProgress: userDataStore.weeklyProgress,
        addXP,
        incrementPracticeTime,
        recordPracticeResult,
        toggleSaveWord,
        completeChallenge,
        updateUserAccent,
        login,
        register,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
