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

export interface PitchDataPoint {
  time: string; // e.g. '0.2s', 'Word 1', etc.
  userPitch: number; // Hz or normalized value 0-250
  nativePitch: number; // Baseline target pitch Hz
  status: 'optimal' | 'flat' | 'too_high' | 'too_low';
  wordLabel?: string;
}

export interface PitchSectionHighlight {
  section: string;
  issue: 'flat' | 'too_high' | 'too_low';
  message: string;
}

export interface PitchIntonationAnalysis {
  overallScore: number;
  pitchScore: number;
  intonationScore: number;
  speechRateWpm: number;
  wordStress: string;
  fluencyScore: number;
  confidenceScore: number;
  volumeLevel: string; // e.g., "74 dB (Optimal)"
  pitchData: PitchDataPoint[];
  highlightedSections: PitchSectionHighlight[];
  aiSuggestions: string[];
}

export interface FormantVowelData {
  vowel: string;          // e.g., '/i:/', '/u:/', 'आ', 'অ'
  vowelName: string;      // e.g., 'Long E (High Front)', 'Open A'
  userF1: number;         // Hz e.g. 320 (Jaw openness/tongue height)
  targetF1: number;       // Hz e.g. 300
  userF2: number;         // Hz e.g. 2250 (Tongue advancement / frontness)
  targetF2: number;       // Hz e.g. 2300
  userF3: number;         // Hz e.g. 2950 (Lip rounding & retroflex resonance)
  targetF3: number;       // Hz e.g. 3000
  score: number;          // 0 - 100
  status: 'optimal' | 'needs_adjustment';
  feedback: string;       // e.g., "Lower jaw slightly to lower F1 frequency towards target."
}

export interface FormantAnalysis {
  overallFormantScore: number;
  vowels: FormantVowelData[];
  needsImprovementVowels: string[];
}

export interface MfccCoeff {
  coefficientIndex: number; // 1 to 13
  label: string;            // e.g., 'C1: Spectral Power', 'C2: High/Low Tilt'
  userValue: number;        // -1.0 to +1.0 normalized cepstral coefficient
  targetValue: number;      // Reference native model value
  diff: number;             // Absolute difference
}

export interface MfccAnalysis {
  similarityScore: number;   // 0 - 100 %
  coefficients: MfccCoeff[];
  phoneticDifferences: string[]; // Timbral divergence messages
  aiFeedback: string;
}

export interface PronunciationResult {
  word: string;
  userTranscript: string;
  overallScore: number;
  accuracyScore?: number;
  clarityScore: number;
  rhythmScore: number;
  intonationScore: number;
  pitchScore?: number;
  speechRateWpm?: number;
  wordStress?: string;
  fluencyScore?: number;
  confidenceScore?: number;
  volumeLevel?: string;
  pitchAnalysis?: PitchIntonationAnalysis;
  formantAnalysis?: FormantAnalysis;
  mfccAnalysis?: MfccAnalysis;
  mfccSimilarityScore?: number;
  mispronouncedSounds?: string[];
  aiSuggestions?: string[];
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
  accuracyScore?: number;
  pitchScore?: number;
  intonationScore?: number;
  speechRateWpm?: number;
  fluencyScore?: number;
  confidenceScore?: number;
  volumeLevel?: string;
  wordStress?: string;
  pitchAnalysis?: PitchIntonationAnalysis;
  formantAnalysis?: FormantAnalysis;
  mfccAnalysis?: MfccAnalysis;
  mfccSimilarityScore?: number;
  mispronouncedSounds?: string[];
  aiSuggestions?: string[];
  date: string;
  type: string;
}

export interface WeeklyScore {
  day: string;
  score: number;
}
