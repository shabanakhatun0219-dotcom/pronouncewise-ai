export type AccentType = 'US' | 'UK' | 'AU';
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Phoneme {
  symbol: string;
  ipa: string;
  isCorrect: boolean;
  score: number; // 0 - 100
  tip?: string;
  type: 'vowel' | 'consonant' | 'diphthong';
}

export interface PronunciationResult {
  word: string;
  userTranscript: string;
  overallScore: number;
  clarityScore: number;
  rhythmScore: number;
  intonationScore: number;
  phonemes: Phoneme[];
  aiFeedback: string;
  mouthTip: string;
  syllables: string[];
  stressedSyllableIndex: number;
  recommendedPractice: string;
}

export interface DictionaryEntry {
  word: string;
  ipaUS: string;
  ipaUK: string;
  partOfSpeech: string;
  definition: string;
  difficulty: DifficultyLevel;
  syllables: string[];
  stressedSyllableIndex: number;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  pronunciationTip: string;
  commonTrap?: string;
}

export interface TutorMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  audioUrl?: string;
  grammarCorrection?: string;
  vocabSuggestion?: string;
  pronunciationScore?: number;
  pronunciationCorrection?: string;
  fluencyScore?: number;
  confidenceScore?: number;
  improvementTip?: string;
  phoneticNotes?: string;
}

export interface TutorScenario {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  tutorName: string;
  tutorAvatar: string;
  accent: AccentType;
  difficulty: DifficultyLevel;
  initialMessage: string;
  improvementTips: string[];
}

export interface WeakSound {
  id: string;
  symbol: string;
  name: string;
  exampleWord: string;
  accuracy: number; // percentage
  practiceCount: number;
  tip: string;
}

export interface Challenge {
  id: string;
  title: string;
  type: 'tongue_twister' | 'minimal_pair' | 'sentence' | 'word';
  difficulty: DifficultyLevel;
  content: string;
  secondaryContent?: string; // For minimal pairs (e.g. ship vs sheep)
  ipa?: string;
  targetScore: number;
  xpReward: number;
  completed: boolean;
  userBestScore?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 - 100
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  targetAccent: AccentType;
  nativeLanguage: string;
  level: DifficultyLevel;
  streakDays: number;
  xpPoints: number;
  minutesPracticedToday: number;
  dailyGoalMinutes: number;
  wordsMastered: number;
  practiceSessions: number;
  overallScore: number;
  subscriptionPlan: 'Free' | 'Pro' | 'Enterprise';
  joinedDate: string;
}

export interface PracticeRecord {
  id: string;
  word: string;
  score: number;
  date: string;
  type: string;
}

export interface WeeklyScore {
  day: string;
  score: number;
}
