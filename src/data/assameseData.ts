export interface AssameseWord {
  id: string;
  assamese: string;
  romanized: string;
  english: string;
  category: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  phoneticBreakdown: string[];
  tip: string;
}

export interface AssameseSentence {
  id: string;
  assamese: string;
  romanized: string;
  english: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusPhonemes: string;
  tip: string;
}

export interface AssameseConversationScenario {
  id: string;
  title: string;
  category: 'Greetings' | 'Shopping' | 'Travel' | 'Family' | 'School' | 'College' | 'Office';
  icon: string;
  tutorName: string;
  tutorAvatar: string;
  accent: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  initialMessage: string;
  suggestedUserPrompts: string[];
  tips: string[];
}

export interface AssameseReadingParagraph {
  id: string;
  title: string;
  titleAssamese: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  assameseText: string;
  romanizedText: string;
  englishTranslation: string;
  estimatedSeconds: number;
  wordCount: number;
  keyVocabulary: { word: string; meaning: string }[];
  readingTips: string[];
}

export interface AssameseVocabItem {
  id: string;
  wordAssamese: string;
  romanized: string;
  englishMeaning: string;
  assameseMeaning: string;
  partOfSpeech: string;
  category: 'Basics' | 'Travel' | 'Food' | 'Emotions' | 'Work' | 'Nature';
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  exampleAssamese: string;
  exampleRomanized: string;
  exampleEnglish: string;
}

export const ASSAMESE_WORDS: AssameseWord[] = [
  {
    id: 'aw1',
    assamese: 'নমস্কাৰ',
    romanized: 'Namaskar',
    english: 'Hello / Greetings',
    category: 'Greetings',
    difficulty: 'A1',
    phoneticBreakdown: ['ন', 'মস্', 'কাৰ'],
    tip: 'Press lips lightly for /m/ and articulate the final alveolar /r/ cleanly with a respectful posture.'
  },
  {
    id: 'aw2',
    assamese: 'ধন্যবাদ',
    romanized: 'Dhonyobad',
    english: 'Thank you',
    category: 'Courtesy',
    difficulty: 'A1',
    phoneticBreakdown: ['ধন্', 'য', 'বাদ'],
    tip: 'Pronounce the aspirated dental /dh/ smoothly and end with a crisp voiced dental /d/.'
  },
  {
    id: 'aw3',
    assamese: 'স্বাগতম',
    romanized: 'Xwagotom',
    english: 'Welcome',
    category: 'Courtesy',
    difficulty: 'A1',
    phoneticBreakdown: ['স্বা', 'গ', 'তম'],
    tip: 'In Assamese, initial "স্ব" starts with a soft velar fricative /x/ sound.'
  },
  {
    id: 'aw4',
    assamese: 'বন্ধু',
    romanized: 'Bondhu',
    english: 'Friend',
    category: 'People',
    difficulty: 'A1',
    phoneticBreakdown: ['বন্', 'ধু'],
    tip: 'Keep the nasal conjunct /ndh/ voiced and finish with a short rounded /u/ vowel.'
  },
  {
    id: 'aw5',
    assamese: 'শুভাকংক্ষা',
    romanized: 'Xubhakongkxa',
    english: 'Best Wishes',
    category: 'Greetings',
    difficulty: 'B1',
    phoneticBreakdown: ['শু', 'ভা', 'কং', 'ক্ষা'],
    tip: 'Pronounce initial /x/ and conjunct /kxa/ with guttural clarity.'
  },
  {
    id: 'aw6',
    assamese: 'পৰিয়াল',
    romanized: 'Poriyal',
    english: 'Family',
    category: 'People',
    difficulty: 'A1',
    phoneticBreakdown: ['প', 'ৰি', 'য়াল'],
    tip: 'Flap the alveolar /r/ gently and glide smoothly into the final syllable /yal/.'
  },
  {
    id: 'aw7',
    assamese: 'সংস্কৃতি',
    romanized: 'Xongskriti',
    english: 'Culture',
    category: 'Abstract',
    difficulty: 'A2',
    phoneticBreakdown: ['সং', 'স্কৃ', 'তি'],
    tip: 'The nasalization /ong/ in সং combines with a crisp conjunct /skri/.'
  },
  {
    id: 'aw8',
    assamese: 'সৌন্দৰ্য',
    romanized: 'Xoundorjo',
    english: 'Beauty',
    category: 'Abstract',
    difficulty: 'A2',
    phoneticBreakdown: ['সৌন', 'দৰ্', 'য'],
    tip: 'Dipthong /ou/ with guttural /x/ and palatal glide /jo/.'
  },
  {
    id: 'aw9',
    assamese: 'সফলতা',
    romanized: 'Xofolota',
    english: 'Success',
    category: 'Abstract',
    difficulty: 'A2',
    phoneticBreakdown: ['স', 'ফ', 'ল', 'তা'],
    tip: 'Aspirated labial /f/ sound in "fol" followed by dental /ta/.'
  },
  {
    id: 'aw10',
    assamese: 'প্ৰকৃতি',
    romanized: 'Prokriti',
    english: 'Nature',
    category: 'Environment',
    difficulty: 'B1',
    phoneticBreakdown: ['প্ৰ', 'কৃ', 'তি'],
    tip: 'Blend the initial stop /pr/ and vocalic conjunct /kri/ crisply.'
  },
  {
    id: 'aw11',
    assamese: 'অনুগ্ৰহ',
    romanized: 'Onugroh',
    english: 'Pleasure / Favor',
    category: 'Courtesy',
    difficulty: 'B1',
    phoneticBreakdown: ['অ', 'নু', 'গ্ৰহ'],
    tip: 'Soft open vowel /o/ with conjunct /groh/.'
  },
  {
    id: 'aw12',
    assamese: 'আত্মবিশ্বাস',
    romanized: 'Aatmobixxax',
    english: 'Self-Confidence',
    category: 'Abstract',
    difficulty: 'B2',
    phoneticBreakdown: ['আৎ', 'ম', 'বিষ্', 'ৱাস'],
    tip: 'Maintain steady pacing for the cluster /tm/ and soft fricatives.'
  }
];

export const ASSAMESE_SENTENCES: AssameseSentence[] = [
  {
    id: 'as1',
    assamese: 'আপুনি কেনেকৈ আছে?',
    romanized: 'Apuni kenekoi ase?',
    english: 'How are you?',
    category: 'Greetings',
    difficulty: 'Beginner',
    focusPhonemes: 'A-pu-ni / ke-ne-koi / a-se',
    tip: 'Use polite honorific "আপুনি" (Apuni) with a gentle rising intonation.'
  },
  {
    id: 'as2',
    assamese: 'মোৰ নাম ৰাহুল।',
    romanized: 'Mor naam Rahul.',
    english: 'My name is Rahul.',
    category: 'Greetings',
    difficulty: 'Beginner',
    focusPhonemes: 'Mor / naam / Ra-hul',
    tip: 'Pronounce the long vowel in "naam" cleanly and end firmly.'
  },
  {
    id: 'as3',
    assamese: 'আপোনাক লগ পাই বহুত ভাল লাগিল।',
    romanized: 'Aponak log pai bohut bhal lagil.',
    english: 'Nice to meet you.',
    category: 'Social',
    difficulty: 'Beginner',
    focusPhonemes: 'A-po-nak / bo-hut / bhal / la-gil',
    tip: 'Aspirated labial /bh/ in "ভাল" (bhal) pronounced with open resonance.'
  },
  {
    id: 'as4',
    assamese: 'আজিকালি বতৰ বহুত ধুনীয়া।',
    romanized: 'Azikali botor bohut dhuniya.',
    english: 'The weather is very beautiful nowadays.',
    category: 'Daily',
    difficulty: 'Intermediate',
    focusPhonemes: 'bo-tor / dhu-ni-ya',
    tip: 'Aspirated dental /dh/ in "ধুনীয়া" (dhuniya) meaning pretty or lovely.'
  },
  {
    id: 'as5',
    assamese: 'আপুনি মোক অলপ সহায় কৰিব পাৰিবনে?',
    romanized: 'Apuni mok olop xohai korib poribone?',
    english: 'Could you please help me a little?',
    category: 'Courtesy',
    difficulty: 'Intermediate',
    focusPhonemes: 'o-lop / xo-hai / po-ri-bo-ne',
    tip: 'Gentle fricative /x/ in "সহায়" (xohai) and polite question marker "-নে" at sentence end.'
  },
  {
    id: 'as6',
    assamese: 'মই অসমীয়া শিকি বহুত ভাল পাওঁ।',
    romanized: 'Moi Axomiya xiki bohut bhal paong.',
    english: 'I really enjoy learning Assamese.',
    category: 'Academic',
    difficulty: 'Intermediate',
    focusPhonemes: 'Moi / A-xo-mi-ya / xi-ki / pa-ong',
    tip: 'Nasalized final diphthong /pa-ong/ in "পাওঁ".'
  },
  {
    id: 'as7',
    assamese: 'সুপ্রভাত! আপোনাৰ দিনটো শুভ আৰু আনন্দময় হওক।',
    romanized: 'Xuprobhat! Aponar dinto xubho aru anondomoy houk.',
    english: 'Good morning! May your day be blissful and joyous.',
    category: 'Greetings',
    difficulty: 'Advanced',
    focusPhonemes: 'Xu-pro-bhat / a-non-do-moy',
    tip: 'Clear articulation of conjunct /pr/ in "সুপ্রভাত" and harmonious flow.'
  },
  {
    id: 'as8',
    assamese: 'নিয়মীয়া অনুশীলনেই সফলতাৰ মূল চাবিকাঠি।',
    romanized: 'Niyomiya onuxilonei xofolotar mul sabikathi.',
    english: 'Regular practice is the main key to success.',
    category: 'Workplace',
    difficulty: 'Advanced',
    focusPhonemes: 'o-nu-xi-lo-nei / sa-bi-ka-thi',
    tip: 'Articulate the retroflex aspirate /th/ in "চাবিকাঠি" crisply.'
  }
];

export const ASSAMESE_SCENARIOS: AssameseConversationScenario[] = [
  {
    id: 'ascen-greetings',
    title: 'Friendly Assamese Greetings (নমস্কাৰ আৰু সোঁৱৰণী)',
    category: 'Greetings',
    icon: '🤝',
    tutorName: 'Jonali (জোনালী)',
    tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Assamese (মান্য অসমীয়া)',
    difficulty: 'Beginner',
    description: 'Practice warm everyday Assamese greetings, asking about health, family, and home.',
    initialMessage: 'নমস্কাৰ বন্ধু! আপুনি কেনেকৈ আছে? বহু দিনৰ মূৰত দেখা পালোঁ! ঘৰত সকলো কুশলে আছেনে?',
    suggestedUserPrompts: [
      'নমস্কাৰ জোনালী! মই ভালে আছোঁ, আপুনি কেমন আছে?',
      'ঘৰত সকলো ভালে আছে। আপোনাৰ খবৰ কি?',
      'হাঁ! আজি বহু দিনৰ পিছত লগ পাই বহুত ভাল লাগিল।'
    ],
    tips: [
      'Use polite honorific pronoun "আপুনি" (Apuni) for elders or respected peers.',
      'Acknowledge with "ভালে আছোঁ" (Bhale asong) meaning "I am well".'
    ]
  },
  {
    id: 'ascen-shopping',
    title: 'Guwahati Market & Gamosa (বজাৰ আৰু কিনা-বেচা)',
    category: 'Shopping',
    icon: '🛍️',
    tutorName: 'Bora Kai (বৰা কাই)',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Assamese (মান্য অসমীয়া)',
    difficulty: 'Intermediate',
    description: 'Shop for authentic traditional Assamese Gamosa, silk, tea, and fresh fruits.',
    initialMessage: 'নমস্কাৰ! আমাৰ দোকানলৈ স্বাগতম। আজি আপোনাক কি লাগে? তাজা অৰ্গেনিক চাহ পাত নে অসমীয়া ফুলাম গামোচা?',
    suggestedUserPrompts: [
      'নমস্কাৰ! এই ফুলাম গামোচাখনৰ দাম কিমান?',
      'মোক কিছু ভাল অসমীয়া চাহ পাত দেখুৱাওক।',
      'আপুনি কিবা ৰেহাই (discount) দিব পাৰিবনে?'
    ],
    tips: [
      'Ask prices using "দাম কিমান?" (Daam kiman?).',
      'Address local shopkeepers respectfully with "কাই" (Kai/Brother) or "বাইদেউ" (Baideu/Sister).'
    ]
  },
  {
    id: 'ascen-school',
    title: 'Assamese Literature Class (বিদ্যালয়)',
    category: 'School',
    icon: '🏫',
    tutorName: 'Barua Sir (বৰুৱা ছাৰ)',
    tutorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Assamese (মান্য অসমীয়া)',
    difficulty: 'Intermediate',
    description: 'Discuss Assamese poetry, Lakshminath Bezbaroa stories, and grammar with your teacher.',
    initialMessage: 'সুপ্রভাত ছাত্ৰ-ছাত্ৰীসকল! আজি আমি লক্ষ্মীনাথ বেজবৰুৱাৰ কবিতা আৰু শুদ্ধ উচ্চাৰণ অনুশীলন কৰিম। আপোনালোক সাজুনে?',
    suggestedUserPrompts: [
      'সুপ্রভাত ছাৰ! অ’ আমি অনুশীলনৰ বাবে সাজু আছোঁ।',
      'ছাৰ, এই শব্দটোৰ উচ্চাৰণত মোৰ অলপ অসুবিধা হৈছে।',
      'আজিৰ শ্ৰেণীৰ গৃহকাৰ্য (homework) কি আছিল ছাৰ?'
    ],
    tips: [
      'Address teachers with "ছাৰ" (Sir) or "বাইদেউ" (Baideu).',
      'Maintain clear enunciation for Assamese conjunct characters.'
    ]
  },
  {
    id: 'ascen-college',
    title: 'Cotton University Campus Sync (মহাবিদ্যালয়)',
    category: 'College',
    icon: '🎓',
    tutorName: 'Anuran (অনুৰণ)',
    tutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Assamese (মান্য অসমীয়া)',
    difficulty: 'Intermediate',
    description: 'Discuss college fest preparations, assignments, and campus life with classmates.',
    initialMessage: 'কৌ ভাই! কালিলৈ আমাৰ মহাবিদ্যালয়ৰ সাংস্কৃতিক মহোৎসৱ সম্পৰ্কে কি প্লেন? তুমি গান গোৱাত ভাগ ল’বানে?',
    suggestedUserPrompts: [
      'নমস্কাৰ অনুৰণ! মই জ্যোতি সংগীত গোৱাত ভাগ ল’বলৈ ভাবিছোঁ।',
      'আমাৰ বিভাগৰ প্ৰদৰ্শনী প্ৰস্তুতি বহুত ভাল হৈছে।',
      'লাইব্ৰেৰীৰ পৰা কিতাপখন আনিবলৈ মনত আছে নে?'
    ],
    tips: [
      'Friendly informal banter uses "তুমি" (Tumi) or "ভাই" (Bhai).',
      'Express cultural pride in music and arts.'
    ]
  },
  {
    id: 'ascen-office',
    title: 'Corporate Team Sync (কাৰ্যালয়)',
    category: 'Office',
    icon: '💼',
    tutorName: 'Priyanki (প্ৰিয়াংকী)',
    tutorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Assamese (মান্য অসমীয়া)',
    difficulty: 'Advanced',
    description: 'Deliver project status updates and collaborate on business goals in formal Assamese.',
    initialMessage: 'নমস্কাৰ টীম! আজিৰ কাৰ্যালয়ৰ বৈঠকত আমি এই মাহৰ প্ৰকল্পৰ অগ্ৰগতি পৰ্যালোচনা কৰিম। কোনে প্ৰতিবেদন দাখিল কৰিব?',
    suggestedUserPrompts: [
      'নমস্কাৰ প্ৰিয়াংকী! মই আজিৰ অগ্ৰগতিৰ প্ৰতিবেদন দাখিল কৰিব বিচাৰোঁ।',
      'আমাৰ দলে সফলভাৱে লক্ষ্যত উপনীত হৈছে।',
      'প্ৰকল্পৰ সময়সীমা সম্পৰ্কে মোৰ এটি পৰামৰ্শ আছে।'
    ],
    tips: [
      'Use formal business terminology like "প্ৰকল্প" (Project) and "প্ৰতিবেদন" (Report).',
      'Maintain an executive, professional speaking pace.'
    ]
  },
  {
    id: 'ascen-travel',
    title: 'Kaziranga & Ferry Ride (যাত্ৰা আৰু ভ্ৰমণ)',
    category: 'Travel',
    icon: '🦏',
    tutorName: 'Manas (মানস)',
    tutorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Assamese (মান্য অসমীয়া)',
    difficulty: 'Intermediate',
    description: 'Book Kaziranga National Park safari and inquire about Brahmaputra river cruise.',
    initialMessage: 'নমস্কাৰ যাত্ৰীদেৱ! পৰ্যটন তথ্য কেন্দ্ৰলৈ স্বাগতম। কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যান আৰু ব্ৰহ্মপুত্ৰৰ নাৱেৰে ভ্ৰমণৰ বাবে আপোনাক কি তথ্য লাগে?',
    suggestedUserPrompts: [
      'নমস্কাৰ! কাজিৰঙাত জীপ ছাফাৰীৰ সময়সূচী কি?',
      'ব্ৰহ্মপুত্ৰৰ ফেৰী জাহাজৰ টিকট ক’ত পাব পাৰি?',
      'আজিৰ বতৰ ভ্ৰমণৰ বাবে অনুকূল হ’বনে?'
    ],
    tips: [
      'Inquire locations using "ক’ত পাব পাৰি?" (Kot pab pori?).',
      'Ask timing with "সময়সূচী কি?" (Xomoysusi ki?).'
    ]
  },
  {
    id: 'ascen-family',
    title: 'Warm Assam Household & Tea (পৰিয়াল)',
    category: 'Family',
    icon: '🏠',
    tutorName: 'Madhavi Baideu (মাধৱী বাইদেউ)',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Assamese (মান্য অসমীয়া)',
    difficulty: 'Beginner',
    description: 'Enjoy traditional Assam hospitality, fresh Pitha, and warm ginger tea with host family.',
    initialMessage: 'আহক আহক! আমাৰ ঘৰলৈ আপোনাক আদৰণি জনালোঁ। আজি আপোনাৰ বাবে গৰম লাল চা আৰু তিল পিঠা বনাইছোঁ। চেনি কিমান ল’ব?',
    suggestedUserPrompts: [
      'ধন্যবাদ বাইদেউ! সকলো বস্তু বহুত সুস্বাদু দেখা গৈছে।',
      'মই কম চেনি থকা লাল চা খাবলৈ ভাল পাম।',
      'আপোনালোকৰ আপ্যায়নৰ বাবে অশেষ ধন্যবাদ!'
    ],
    tips: [
      'Compliment host delicacies with "বহুত সুস্বাদু" (Bohut xuswadu).',
      'Express gratitude with "অশেষ ধন্যবাদ" (Oxex dhonyobad).'
    ]
  }
];

export const ASSAMESE_READING_PARAGRAPHS: AssameseReadingParagraph[] = [
  {
    id: 'arp1',
    title: 'Bihu Festival & Assam Cultural Heritage',
    titleAssamese: 'অসমৰ সংস্কৃতি আৰু বিহু উৎসৱ',
    category: 'Culture',
    difficulty: 'Beginner',
    assameseText: 'অসম এখন চহকী আৰু বৈচিত্ৰ্যময় সাংস্কৃতিক ঐতিহ্যৰে ভৰপূৰ ৰাজ্য। অসমৰ জাতীয় উৎসৱ বিহু সমগ্ৰ ৰাজ্যতে বৰ উলোহ-মালোহেৰে উদযাপন কৰা হয়। ৰঙালী বিহু, কঙালী বিহু আৰু ভোগালী বিহু অসমীয়া সমাজ জীৱনৰ মুখ্য প্ৰাণস্পন্দন। ঢোল, পেপা আৰু গগনাৰ সুৰে সমগ্ৰ পৰিবেশ মুখৰিত কৰি তোলে।',
    romanizedText: 'Axom ekxon sohoki aru boositromoy xongskritik oitihyore bhorpur rajyo. Axomor jatiyo utxob Bihu xomogro rajyote bor ulohor-malohere udjapan kora hoy. Rongali Bihu, Kongali Bihu aru Bhogali Bihu Axomiya xomaz ziwonor mukhyo pranspondon. Dhol, Pepa aru Gogonar xure xomogro poribex mukhorito kori tole.',
    englishTranslation: 'Assam is a state filled with a rich and diverse cultural heritage. The national festival of Assam, Bihu, is celebrated with immense joy across the state. Rongali Bihu, Kongali Bihu, and Bhogali Bihu are the core heartbeat of Assamese social life. The melodies of Dhol, Pepa, and Gogona resonate throughout the environment.',
    estimatedSeconds: 38,
    wordCount: 48,
    keyVocabulary: [
      { word: 'ঐতিহ্য (Oitihyo)', meaning: 'Heritage' },
      { word: 'জাতীয় উৎসৱ (Jatiyo Utxob)', meaning: 'National Festival' },
      { word: 'প্ৰাণস্পন্দন (Pranspondon)', meaning: 'Heartbeat / Pulse' },
      { word: 'পৰিবেশ (Poribex)', meaning: 'Environment' }
    ],
    readingTips: [
      'Pause gently after punctuation like sentence stops (|).',
      'Articulate traditional instrument names like "ঢোল", "পেপা", "গগনা" with authentic rhythm.'
    ]
  },
  {
    id: 'arp2',
    title: 'Kaziranga & One-Horned Rhino Conservation',
    titleAssamese: 'কাজিৰঙা আৰু অসমৰ প্ৰকৃতি',
    category: 'Nature',
    difficulty: 'Intermediate',
    assameseText: 'কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যান অসমৰ গৌৰৱ আৰু বিশ্ব ঐতিহ্য ক্ষেত্ৰ। এই বিশ্বপ্ৰসিদ্ধ উদ্যানখন পৃথিৱীৰ বিখ্যাত এশিঙীয়া গঁড়ৰ প্ৰধান বাসস্থান। সেউজীয়া বনাঞ্চল, বিল আৰু ব্ৰহ্মপুত্ৰ নদীৰ পাৰে কাজিৰঙাক এক অতুলনীয় প্ৰাকৃতিক সুষমা প্ৰদান কৰিছে। বনৰীয়া জীৱ-জন্তু আৰু জৈৱ-বৈচিত্ৰ্য সংৰক্ষণ কৰাটো আমাৰ পৰম কৰ্তব্য।',
    romanizedText: 'Kaziranga rastriyo udyan Axomor gourob aru bixxo oitihyo kxetro. Ei bixxoprosiddho udyankxon prithibir bikhyaat exingiya goror prodhan baxsthan. Xeuziya bonanchal, bil aru Brahmaputra nodir pare Kazirangak ek otulniyo prakritik xuxoma prodan korise. Bonoriya ziw-zontu aru zoiwo-boositryo xongrokxon korato amar porom kortobyo.',
    englishTranslation: 'Kaziranga National Park is the pride of Assam and a UNESCO World Heritage Site. This world-renowned park is the primary habitat of the famous one-horned rhinoceros. Green forests, wetlands, and the banks of the Brahmaputra River endow Kaziranga with peerless natural splendor. Conserving wildlife and biodiversity is our sacred duty.',
    estimatedSeconds: 45,
    wordCount: 54,
    keyVocabulary: [
      { word: 'এশিঙীয়া গঁড় (Exingiya Gor)', meaning: 'One-horned Rhinoceros' },
      { word: 'বাসস্থান (Baxsthan)', meaning: 'Habitat' },
      { word: 'জৈৱ-বৈচিত্ৰ্য (Zoiwo-Boositryo)', meaning: 'Biodiversity' },
      { word: 'সংৰক্ষণ (Xongrokxon)', meaning: 'Conservation' }
    ],
    readingTips: [
      'Pronounce the conjunct character "ক্ষ" (kx) crisply in "ক্ষেত্ৰ" and "সংৰক্ষণ".',
      'Keep a steady, informative documentary reading tone.'
    ]
  },
  {
    id: 'arp3',
    title: 'The Great Legacy of Assamese Literature',
    titleAssamese: 'অসমীয়া ভাষা আৰু সাহিত্যৰ গুৰুত্ব',
    category: 'Education',
    difficulty: 'Advanced',
    assameseText: 'অসমীয়া ভাষা এক প্ৰাচীন আৰু সমৃদ্ধ ভাষা, যাৰ ইতিহাস সাহিত্যিক আৰু সাংস্কৃতিক অৱদানেৰে উজ্জ্বল। মহাপুৰুষ শ্ৰীমন্ত শংকৰদেৱ আৰু মাধৱদেৱৰ বৰগীত, অংকীয়া নাট আৰু ব্যাকৰণে অসমীয়া ভাষাক এক সুদৃঢ় ভেটি প্ৰদান কৰিছিল। আধুনিক যুগত সাহিত্যৰ বিকাশ আৰু ডিজিটেল মাধ্যমৰ জৰিয়তে ভাষাটোক বিশ্বমঞ্চত প্ৰতিষ্ঠা কৰা উচিত।',
    romanizedText: 'Axomiya bhasa ek prasin aru xomriddho bhasa, zar itihax xahityik aru xongskritik obodanere ujjwol. Mohapurux Srimanta Sankardev aru Madhavdeva Borgeet, Ankiya Naat aru byakorone Axomiya bhasak ek xudridho bheti prodan korisil. Aadhunik xugot xahityor bikax aru digital madhyomor zoriyote bhasatok bixxomoncot protistha korato usit.',
    englishTranslation: 'The Assamese language is an ancient and rich language whose history shines with literary and cultural contributions. The Borgeets, Ankiya Naats, and grammar of Srimanta Sankardev and Madhavdev laid a firm foundation for the language. In the modern era, expanding literature and leveraging digital media should establish the language on the global stage.',
    estimatedSeconds: 52,
    wordCount: 60,
    keyVocabulary: [
      { word: 'প্ৰাচীন (Prasin)', meaning: 'Ancient' },
      { word: 'সুদৃঢ় ভেটি (Xudridho Bheti)', meaning: 'Firm Foundation' },
      { word: 'বিকাশ (Bikax)', meaning: 'Development / Growth' },
      { word: 'বিশ্বমঞ্চ (Bixxomonco)', meaning: 'Global Stage' }
    ],
    readingTips: [
      'Maintain clear enunciation for historical names like "শ্ৰীমন্ত শংকৰদেৱ".',
      'Aim for a dignified, fluent reading speed of 115-130 words per minute.'
    ]
  }
];

export const ASSAMESE_VOCAB_ITEMS: AssameseVocabItem[] = [
  {
    id: 'av1',
    wordAssamese: 'নমস্কাৰ',
    romanized: 'Namaskar',
    englishMeaning: 'Hello / Greetings',
    assameseMeaning: 'আদৰণি, প্ৰণাম',
    partOfSpeech: 'Interjection / Noun',
    category: 'Basics',
    difficulty: 'A1',
    exampleAssamese: 'নমস্কাৰ! আপুনি আজি কেনেকৈ আছে?',
    exampleRomanized: 'Namaskar! Apuni azi kenekoi ase?',
    exampleEnglish: 'Hello! How are you doing today?'
  },
  {
    id: 'av2',
    wordAssamese: 'ধন্যবাদ',
    romanized: 'Dhonyobad',
    englishMeaning: 'Thank you',
    assameseMeaning: 'কৃতজ্ঞতা জ্ঞাপন',
    partOfSpeech: 'Noun / Interjection',
    category: 'Basics',
    difficulty: 'A1',
    exampleAssamese: 'আপোনাৰ বহুমূলীয়া সহায়ৰ বাবে অশেষ ধন্যবাদ।',
    exampleRomanized: 'Aponar bohumuliyo xohaior babe oxex dhonyobad.',
    exampleEnglish: 'Thank you very much for your valuable help.'
  },
  {
    id: 'av3',
    wordAssamese: 'ভ্ৰমণ',
    romanized: 'Bhromon',
    englishMeaning: 'Travel / Tour',
    assameseMeaning: 'যাত্ৰা, পৰ্যটন',
    partOfSpeech: 'Noun',
    category: 'Travel',
    difficulty: 'A1',
    exampleAssamese: 'অসম ভ্ৰমণৰ অভিজ্ঞতা অত্যন্ত মনোৰম।',
    exampleRomanized: 'Axom bhromonor obhigyota otyonto monorom.',
    exampleEnglish: 'The experience of traveling in Assam is truly delightful.'
  },
  {
    id: 'av4',
    wordAssamese: 'সুস্বাদু',
    romanized: 'Xuswadu',
    englishMeaning: 'Delicious / Tasty',
    assameseMeaning: 'সোৱাদযুক্ত, তৃপ্তিকৰ',
    partOfSpeech: 'Adjective',
    category: 'Food',
    difficulty: 'A2',
    exampleAssamese: 'মায়ে আজি বহুত সুস্বাদু মাছৰ টেঙা বনাব।',
    exampleRomanized: 'Maye azi bohut xuswadu masor tenga bonabo.',
    exampleEnglish: 'Mother will make a very delicious sour fish curry today.'
  },
  {
    id: 'av5',
    wordAssamese: 'আনন্দ',
    romanized: 'Anondo',
    englishMeaning: 'Joy / Happiness',
    assameseMeaning: 'হাঁহি-ফুৰ্তি, উল্লাস',
    partOfSpeech: 'Noun',
    category: 'Emotions',
    difficulty: 'A2',
    exampleAssamese: 'বিহুৰ বতৰত সকলোৰে মন আনন্দৰে ভৰি পৰে।',
    exampleRomanized: 'Bihur botorot xokolore mon anondore bhori pore.',
    exampleEnglish: 'During the Bihu season, everyone\'s heart fills with joy.'
  },
  {
    id: 'av6',
    wordAssamese: 'সফলতা',
    romanized: 'Xofolota',
    englishMeaning: 'Success',
    assameseMeaning: 'কামিয়াবী, জয়',
    partOfSpeech: 'Noun',
    category: 'Work',
    difficulty: 'A2',
    exampleAssamese: 'কঠিন পৰিশ্ৰমেই সফলতাৰ আচল চাবিকাঠি।',
    exampleRomanized: 'Kathin porixromei xofolotar asol sabikathi.',
    exampleEnglish: 'Hard work is the real key to success.'
  },
  {
    id: 'av7',
    wordAssamese: 'পৰিবেশ',
    romanized: 'Poribex',
    englishMeaning: 'Environment / Atmosphere',
    assameseMeaning: 'চাৰিওফালৰ বাতাবৰণ',
    partOfSpeech: 'Noun',
    category: 'Nature',
    difficulty: 'B1',
    exampleAssamese: 'আজি ৰাতিপুৱাৰ পৰিবেশটো বহুত শান্ত আৰু সুন্দৰ।',
    exampleRomanized: 'Azi ratipuar poribexto bohut xanto aru xundor.',
    exampleEnglish: 'This morning\'s atmosphere is very peaceful and beautiful.'
  },
  {
    id: 'av8',
    wordAssamese: 'প্ৰেৰণা',
    romanized: 'Prerona',
    englishMeaning: 'Inspiration / Motivation',
    assameseMeaning: 'উৎসাহ, উদীপনা',
    partOfSpeech: 'Noun',
    category: 'Emotions',
    difficulty: 'B1',
    exampleAssamese: 'মহৎ লোকৰ চিন্তা-ধাৰণাই আমাক জীৱনত আগবাঢ়িবলৈ প্ৰেৰণা যোগায়।',
    exampleRomanized: 'Mohot lokor cinta-dharonai amak ziwonot agbarhiboloi prerona xogay.',
    exampleEnglish: 'The ideas of noble people inspire us to move forward in life.'
  },
  {
    id: 'av9',
    wordAssamese: 'হস্তশিল্প',
    romanized: 'Xostoxilpo',
    englishMeaning: 'Handicraft / Artisan Goods',
    assameseMeaning: 'হাতৰ শিল্পকৰ্ম',
    partOfSpeech: 'Noun',
    category: 'Travel',
    difficulty: 'B2',
    exampleAssamese: 'অসমৰ বাঁহ আৰু বেতৰ হস্তশিল্প বিশ্ব বিখ্যাত।',
    exampleRomanized: 'Axomor bah aru betor xostoxilpo bixxo bikhyaat.',
    exampleEnglish: 'Assam\'s bamboo and cane handicrafts are world-famous.'
  },
  {
    id: 'av10',
    wordAssamese: 'সৌহাৰ্দ্য',
    romanized: 'Xouhardyo',
    englishMeaning: 'Friendship / Goodwill',
    assameseMeaning: 'মিত্ৰতা, সদ্ভাৱনা',
    partOfSpeech: 'Noun',
    category: 'Basics',
    difficulty: 'A1',
    exampleAssamese: 'মানুহৰ মাজত সৌহাৰ্দ্য আৰু সম্প্ৰীতি বৰ্তাই ৰখা উচিত।',
    exampleRomanized: 'Manuhor mazot xouhardyo aru xompriti bortay rokha usit.',
    exampleEnglish: 'Goodwill and harmony should be maintained among people.'
  }
];
