import {
  DictionaryEntry,
  Challenge,
  WeakSound,
  TutorScenario,
  Achievement,
  UserProfile
} from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  targetAccent: 'US',
  nativeLanguage: 'Spanish',
  level: 'B2',
  streakDays: 14,
  xpPoints: 3450,
  minutesPracticedToday: 16,
  dailyGoalMinutes: 20,
  wordsMastered: 142,
  practiceSessions: 24,
  overallScore: 86,
  subscriptionPlan: 'Pro',
  joinedDate: 'January 2026'
};

export const SAMPLE_DICTIONARY: DictionaryEntry[] = [
  {
    word: 'Pronunciation',
    ipaUS: '/prəˌnʌn.siˈeɪ.ʃən/',
    ipaUK: '/prəˌnʌn.siˈeɪ.ʃn̩/',
    partOfSpeech: 'noun',
    definition: 'The way in which a word or a language is spoken or articulated.',
    difficulty: 'B1',
    syllables: ['pro', 'NUN', 'ci', 'a', 'tion'],
    stressedSyllableIndex: 1,
    examples: [
      'Her English pronunciation improved dramatically after using AI feedback.',
      'Check the dictionary if you are unsure about the pronunciation of a word.'
    ],
    synonyms: ['articulation', 'enunciation', 'elocution', 'diction'],
    antonyms: ['mispronunciation', 'mumbling'],
    pronunciationTip: 'Notice that "pronunciation" uses "NUN" in the second syllable, unlike "pronounce" which uses "NOUN".',
    commonTrap: 'Avoid saying "pro-NOUN-ci-ation". The second syllable is "nun", rhyming with "run".'
  },
  {
    word: 'Schedule',
    ipaUS: '/ˈskedʒ.uːl/',
    ipaUK: '/ˈʃed.juːl/',
    partOfSpeech: 'noun / verb',
    definition: 'A plan that gives expected times for different things to happen.',
    difficulty: 'A2',
    syllables: ['SKE', 'dule'],
    stressedSyllableIndex: 0,
    examples: [
      'I need to organize my study schedule for the upcoming speaking exam.',
      'The flight is scheduled to arrive at 4:00 PM.'
    ],
    synonyms: ['timetable', 'agenda', 'roster', 'program'],
    antonyms: ['disorganization'],
    pronunciationTip: 'In American English it starts with a "sk" sound (/sk/), while in British English it traditionally starts with "sh" (/ʃ/).',
    commonTrap: 'Do not drop the ending "l" sound. Ensure your tongue touches the roof of your mouth for the final /l/.'
  },
  {
    word: 'Phenomenon',
    ipaUS: '/fəˈnɑː.mə.nɑːn/',
    ipaUK: '/fəˈnɒm.ɪ.nən/',
    partOfSpeech: 'noun',
    definition: 'A fact or situation that is observed to exist or happen, especially one whose cause is in question.',
    difficulty: 'C1',
    syllables: ['phe', 'NOM', 'e', 'non'],
    stressedSyllableIndex: 1,
    examples: [
      'Bilingualism is a fascinating cognitive phenomenon.',
      'Northern lights are a breathtaking natural phenomenon.'
    ],
    synonyms: ['occurrence', 'event', 'wonder', 'marvel'],
    antonyms: ['normality', 'regularity'],
    pronunciationTip: 'Place primary stress squarely on the second syllable "NOM" with a short relaxed vowel sound.',
    commonTrap: 'The plural form is "phenomena" (/fəˈnɑː.mə.nə/), not "phenomenons".'
  },
  {
    word: 'Thoroughly',
    ipaUS: '/ˈθɝː.oʊ.li/',
    ipaUK: '/ˈθʌr.ə.li/',
    partOfSpeech: 'adverb',
    definition: 'In a complete and detailed manner; with great care and attention to detail.',
    difficulty: 'B2',
    syllables: ['THOR', 'ough', 'ly'],
    stressedSyllableIndex: 0,
    examples: [
      'She thoroughly reviewed all the IPA phonetic symbols before the test.',
      'Make sure you wash your hands thoroughly.'
    ],
    synonyms: ['completely', 'rigorously', 'meticulously', 'exhaustively'],
    antonyms: ['superficially', 'partially', 'carelessly'],
    pronunciationTip: 'Start with an unvoiced /θ/ (tongue between teeth with gentle air blow). Do not confuse with "through" or "tough".',
    commonTrap: 'Non-native speakers often confuse "thoroughly" with "throughly" or "thoughtfully".'
  },
  {
    word: 'Entrepreneur',
    ipaUS: '/ˌɑːn.trə.prəˈnɝː/',
    ipaUK: '/ˌɒn.trə.prəˈnɜːr/',
    partOfSpeech: 'noun',
    definition: 'A person who sets up a business or businesses, taking on financial risks in the hope of profit.',
    difficulty: 'B2',
    syllables: ['on', 'tre', 'pre', 'NEUR'],
    stressedSyllableIndex: 3,
    examples: [
      'The tech entrepreneur pitched a revolutionary AI startup to venture capitalists.',
      'Being an entrepreneur requires resilience and vision.'
    ],
    synonyms: ['founder', 'businessperson', 'innovator'],
    antonyms: ['employee'],
    pronunciationTip: 'Derived from French. Stress falls on the final syllable "NEUR" (/nɝː/).',
    commonTrap: 'Avoid stressing the second syllable. Keep the primary accent on the very last syllable.'
  },
  {
    word: 'Comfortable',
    ipaUS: '/ˈkʌm.fɚ.tə.bəl/',
    ipaUK: '/ˈkʌm.fə.tə.bəl/',
    partOfSpeech: 'adjective',
    definition: 'Providing physical ease and relaxation; free from stress or fear.',
    difficulty: 'A2',
    syllables: ['COMF', 'ta', 'ble'],
    stressedSyllableIndex: 0,
    examples: [
      'I feel much more comfortable speaking English in public now.',
      'These noise-canceling headphones are extremely comfortable.'
    ],
    synonyms: ['cozy', 'relaxed', 'pleasant', 'easy'],
    antonyms: ['uncomfortable', 'painful', 'awkward'],
    pronunciationTip: 'Native speakers usually pronounce this with 3 syllables ("COMF-ter-bul"), dropping the "or" sound.',
    commonTrap: 'Saying "com-for-ta-ble" with 4 full syllables sounds unnatural.'
  }
];

export const WEAK_SOUNDS: WeakSound[] = [
  {
    id: 'th-unvoiced',
    symbol: '/θ/',
    name: 'Unvoiced TH',
    exampleWord: 'Think, Third, Mouth',
    accuracy: 64,
    practiceCount: 38,
    tip: 'Place tip of tongue gently between teeth and blow soft air. Do not make a /t/ or /s/ sound.'
  },
  {
    id: 'r-glide',
    symbol: '/r/',
    name: 'American R Sound',
    exampleWord: 'Red, World, Water',
    accuracy: 71,
    practiceCount: 52,
    tip: 'Curl tip of tongue slightly backward in the middle of your mouth without touching the palate.'
  },
  {
    id: 'v-fricative',
    symbol: '/v/',
    name: 'Voiced V Sound',
    exampleWord: 'Voice, Very, Travel',
    accuracy: 78,
    practiceCount: 29,
    tip: 'Touch upper teeth gently to lower lip and vibrate your vocal cords. Distinguish from /b/.'
  },
  {
    id: 'i-short',
    symbol: '/ɪ/',
    name: 'Short I Vowel',
    exampleWord: 'Ship, Bit, Sit',
    accuracy: 69,
    practiceCount: 41,
    tip: 'Relax your mouth muscles. Short /ɪ/ is shorter and lower pitch than long /iː/ (sheep).'
  }
];

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'twister-1',
    title: 'Peter Piper Picked',
    type: 'tongue_twister',
    difficulty: 'B2',
    content: 'Peter Piper picked a peck of pickled peppers.',
    ipa: '/ˈpiː.tər ˈpaɪ.pər pɪkt ə pek əv ˈpɪk.əld ˈpep.ərz/',
    targetScore: 85,
    xpReward: 150,
    completed: false
  },
  {
    id: 'minimal-1',
    title: 'Ship vs. Sheep',
    type: 'minimal_pair',
    difficulty: 'A2',
    content: 'Ship',
    secondaryContent: 'Sheep',
    ipa: '/ʃɪp/ vs /ʃiːp/',
    targetScore: 90,
    xpReward: 100,
    completed: true,
    userBestScore: 94
  },
  {
    id: 'twister-2',
    title: 'Seashells on the Seashore',
    type: 'tongue_twister',
    difficulty: 'C1',
    content: 'She sells seashells by the seashore.',
    ipa: '/ʃiː selz ˈsiː.ʃelz baɪ ðə ˈsiː.ʃɔːr/',
    targetScore: 88,
    xpReward: 200,
    completed: false
  },
  {
    id: 'sentence-1',
    title: 'Executive Presentation',
    type: 'sentence',
    difficulty: 'B2',
    content: 'We thoroughly evaluated the quarterly financial schedule and market opportunities.',
    ipa: '/wiː ˈθɝː.oʊ.li ɪˈvæl.ju.eɪ.tɪd ðə ˈkwɔːr.tər.li faɪˈnæn.ʃəl ˈskedʒ.uːl/',
    targetScore: 80,
    xpReward: 120,
    completed: false
  }
];

export const TUTOR_SCENARIOS: TutorScenario[] = [
  {
    id: 'college_presentation',
    title: 'College Presentation',
    icon: '🎓',
    category: 'Academic & Public Speaking',
    description: 'Practice presenting a project or seminar with real-time AI feedback on structure, slide transitions, and pace.',
    tutorName: 'Dr. Sarah',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    accent: 'US',
    difficulty: 'B2',
    initialMessage: "Welcome to your seminar rehearsal! Whenever you're ready, start with your project introduction and main thesis statement.",
    improvementTips: [
      'Use signposting phrases like "First, I will outline..." and "Moving to the data..."',
      'Maintain an even cadence of 130-150 words per minute during slide transitions.',
      'Emphasize key academic terms with pitch elevation rather than volume.'
    ]
  },
  {
    id: 'job_interview',
    title: 'Job Interview',
    icon: '💼',
    category: 'Career & HR',
    description: 'Simulate HR interview questions and improve speaking confidence, STAR method answers, and professional vocabulary.',
    tutorName: 'Emma',
    tutorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    accent: 'US',
    difficulty: 'B2',
    initialMessage: "Hi! Welcome to your mock HR interview. Let's start with a classic question: Could you introduce yourself and highlight a major accomplishment in your career?",
    improvementTips: [
      'Structure behavioral answers using STAR (Situation, Task, Action, Result).',
      'Articulate past-tense verb endings clearly (e.g. "managed", "implemented").',
      'Avoid filler words like "um", "like", or "you know" when formulating thoughts.'
    ]
  },
  {
    id: 'travel_airport',
    title: 'Travel & Airport Conversation',
    icon: '✈️',
    category: 'Travel & Hospitality',
    description: 'Practice common conversations at airports, check-in desks, hotels, and while asking for directions.',
    tutorName: 'Alex',
    tutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    accent: 'UK',
    difficulty: 'A2',
    initialMessage: "Good day! Welcome to London Heathrow Check-in. May I see your passport and flight booking confirmation?",
    improvementTips: [
      'Master courteous British intonation for requests e.g., "Could you please tell me...?"',
      'Practice numerical clarity for gate numbers, flight times, and room numbers.',
      'Use polite hedging: "Excuse me", "Would you mind...", "Pardon me".'
    ]
  },
  {
    id: 'office_meeting',
    title: 'Office Meeting',
    icon: '🏢',
    category: 'Workplace & Business',
    description: 'Practice professional communication, team discussions, project updates, and politely sharing opinions.',
    tutorName: 'David',
    tutorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    accent: 'US',
    difficulty: 'B1',
    initialMessage: "Thanks everyone for joining today's team sync! Let me hand it over to you for your project update.",
    improvementTips: [
      'Use collaborative language like "I agree with your point, and to build on that..."',
      'Keep updates concise using bullet-point speech patterns.',
      'Use professional vocabulary like "milestones", "blockers", and "action items".'
    ]
  },
  {
    id: 'daily_conversation',
    title: 'Daily Conversation',
    icon: '🗣️',
    category: 'Everyday Life',
    description: 'Practice everyday English conversations such as introducing yourself, talking with friends, ordering food, and shopping.',
    tutorName: 'Maya',
    tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    accent: 'AU',
    difficulty: 'A1',
    initialMessage: "G'day! Great to meet you! What do you like to do on weekends, or what kind of food do you enjoy ordering?",
    improvementTips: [
      'Focus on casual contractions e.g. "I\'d like", "What\'s your...", "I\'m going to".',
      'Practice friendly, rising intonation when asking open questions.',
      'Use common conversational fillers like "That sounds great!", "Really?", "I see!"'
    ]
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Maintain a 14-day daily practice streak',
    iconName: 'Flame',
    unlocked: true,
    unlockedAt: '1 day ago',
    progress: 100
  },
  {
    id: 'phoneme_pro',
    title: 'Phoneme Perfectionist',
    description: 'Score 95%+ on 20 different words in AI Checker',
    iconName: 'Target',
    unlocked: true,
    unlockedAt: '3 days ago',
    progress: 100
  },
  {
    id: 'voice_veteran',
    title: 'Voice Veteran',
    description: 'Accumulate over 120 minutes of active speech recording',
    iconName: 'Mic',
    unlocked: false,
    progress: 68
  },
  {
    id: 'accent_ace',
    title: 'Accent Ace',
    description: 'Complete 10 AI Tutor scenarios with B2+ fluency rating',
    iconName: 'Award',
    unlocked: false,
    progress: 40
  }
];
