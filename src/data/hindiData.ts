export interface HindiWord {
  id: string;
  hindi: string;
  romanized: string;
  english: string;
  category: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  phoneticBreakdown: string[];
  tip: string;
}

export interface HindiSentence {
  id: string;
  hindi: string;
  romanized: string;
  english: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusPhonemes: string;
  tip: string;
}

export interface HindiConversationScenario {
  id: string;
  title: string;
  category: 'Greetings' | 'Shopping' | 'Travel' | 'Family' | 'School' | 'Office';
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

export interface HindiReadingParagraph {
  id: string;
  title: string;
  titleHindi: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  hindiText: string;
  romanizedText: string;
  englishTranslation: string;
  estimatedSeconds: number;
  wordCount: number;
  keyVocabulary: { word: string; meaning: string }[];
  readingTips: string[];
}

export interface HindiVocabItem {
  id: string;
  wordHindi: string;
  romanized: string;
  englishMeaning: string;
  hindiMeaning: string;
  partOfSpeech: string;
  category: 'Basics' | 'Travel' | 'Food' | 'Emotions' | 'Work' | 'Nature';
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  exampleHindi: string;
  exampleRomanized: string;
  exampleEnglish: string;
}

export const HINDI_WORDS: HindiWord[] = [
  {
    id: 'w1',
    hindi: 'नमस्ते',
    romanized: 'Namaste',
    english: 'Hello / Greetings',
    category: 'Greetings',
    difficulty: 'A1',
    phoneticBreakdown: ['ना', 'मस्', 'ते'],
    tip: 'Press lips together briefly for /m/ and stress the final /te/ syllable with palms joined gesture.'
  },
  {
    id: 'w2',
    hindi: 'धन्यवाद',
    romanized: 'Dhanyavaad',
    english: 'Thank you',
    category: 'Courtesy',
    difficulty: 'A1',
    phoneticBreakdown: ['धन्', 'य', 'वाद्'],
    tip: 'Aspirate the initial aspirated dental /dh/ and elongate the long vowel /aa/ in "vaad".'
  },
  {
    id: 'w3',
    hindi: 'स्वागतम्',
    romanized: 'Swagatam',
    english: 'Welcome',
    category: 'Courtesy',
    difficulty: 'A1',
    phoneticBreakdown: ['स्वा', 'ग', 'तम्'],
    tip: 'Blend the /sw/ smoothly without inserting a vowel break before the /g/.'
  },
  {
    id: 'w4',
    hindi: 'मित्र',
    romanized: 'Mitra',
    english: 'Friend',
    category: 'People',
    difficulty: 'A1',
    phoneticBreakdown: ['मि', 'त्र'],
    tip: 'Keep the short vowel /i/ crisp and articulate the conjunct dental /tr/ sharply.'
  },
  {
    id: 'w5',
    hindi: 'सफलता',
    romanized: 'Saphalta',
    english: 'Success',
    category: 'Abstract',
    difficulty: 'A2',
    phoneticBreakdown: ['स', 'फ', 'ल', 'ता'],
    tip: 'Aspirate the /ph/ as an unvoiced labial aspirate, distinct from English /f/.'
  },
  {
    id: 'w6',
    hindi: 'शांति',
    romanized: 'Shanti',
    english: 'Peace',
    category: 'Abstract',
    difficulty: 'A1',
    phoneticBreakdown: ['शां', 'ति'],
    tip: 'Soft retroflex palatal /sh/ with nasalized vowel /aṁ/.'
  },
  {
    id: 'w7',
    hindi: 'ज्ञान',
    romanized: 'Gyaan',
    english: 'Knowledge',
    category: 'Education',
    difficulty: 'A2',
    phoneticBreakdown: ['ज्ञा', 'न'],
    tip: 'The conjunct character ज्ञ (jña) is pronounced as /gya/ in modern Hindi.'
  },
  {
    id: 'w8',
    hindi: 'स्वादिष्ट',
    romanized: 'Swaadisht',
    english: 'Delicious',
    category: 'Food',
    difficulty: 'A2',
    phoneticBreakdown: ['स्वा', 'दिष्', 'ट'],
    tip: 'Curled tongue retroflex /ṣṭ/ at the end gives this word its crisp texture.'
  },
  {
    id: 'w9',
    hindi: 'परिवार',
    romanized: 'Parivaar',
    english: 'Family',
    category: 'People',
    difficulty: 'A1',
    phoneticBreakdown: ['प', 'रि', 'वार'],
    tip: 'Flap the /r/ lightly with tongue tip against alveolar ridge.'
  },
  {
    id: 'w10',
    hindi: 'प्रकृति',
    romanized: 'Prakriti',
    english: 'Nature',
    category: 'Environment',
    difficulty: 'B1',
    phoneticBreakdown: ['प्र', 'कृ', 'ति'],
    tip: 'Vowel /ṛ/ in कृ is vocalic r, pronounced /kri/.'
  },
  {
    id: 'w11',
    hindi: 'शुभकामनाएं',
    romanized: 'Shubhkaamnaayein',
    english: 'Best Wishes',
    category: 'Greetings',
    difficulty: 'B1',
    phoneticBreakdown: ['शुभ', 'काम', 'नाएं'],
    tip: 'Elongate the nasalized diphthong /ayein/ at the end.'
  },
  {
    id: 'w12',
    hindi: 'आत्मविश्वास',
    romanized: 'Aatmanirbhar',
    english: 'Self-Confidence',
    category: 'Abstract',
    difficulty: 'B2',
    phoneticBreakdown: ['आत्', 'म', 'विश्', 'वास'],
    tip: 'Keep the consonant cluster /tm/ and palatal /shv/ clear and deliberate.'
  }
];

export const HINDI_SENTENCES: HindiSentence[] = [
  {
    id: 's1',
    hindi: 'आप कैसे हैं?',
    romanized: 'Aap kaise hain?',
    english: 'How are you?',
    category: 'Greetings',
    difficulty: 'Beginner',
    focusPhonemes: 'Aap / kaise / hain (Nasalized /ain/)',
    tip: 'Keep the polite nasalized "हैं" (hain) at sentence end with gentle rising pitch.'
  },
  {
    id: 's2',
    hindi: 'मेरा नाम राहुल है।',
    romanized: 'Mera naam Rahul hai.',
    english: 'My name is Rahul.',
    category: 'Greetings',
    difficulty: 'Beginner',
    focusPhonemes: 'Me-ra / naam / hai',
    tip: 'Pronounce long /aa/ in "naam" and crisp /e/ in "mera".'
  },
  {
    id: 's3',
    hindi: 'आपसे मिलकर बहुत खुशी हुई।',
    romanized: 'Aapse milkar bahut khushi hui.',
    english: 'Nice to meet you.',
    category: 'Social',
    difficulty: 'Beginner',
    focusPhonemes: 'mil-kar / ba-hut / khu-shi',
    tip: 'The aspirated /kh/ in "khushi" is pronounced softly from the back of the throat.'
  },
  {
    id: 's4',
    hindi: 'आज का मौसम बहुत सुहावना है।',
    romanized: 'Aaj ka mausam bahut suhaavna hai.',
    english: 'Today\'s weather is very pleasant.',
    category: 'Daily',
    difficulty: 'Intermediate',
    focusPhonemes: 'mau-sam / su-haav-na',
    tip: 'Soft /s/ and rhythmic cadence in "suhaavna" (suh-aav-na).'
  },
  {
    id: 's5',
    hindi: 'क्या आप मेरी मदद कर सकते हैं?',
    romanized: 'Kya aap meri madad kar sakte hain?',
    english: 'Can you help me?',
    category: 'Courtesy',
    difficulty: 'Intermediate',
    focusPhonemes: 'Kya / ma-dad / sak-te',
    tip: 'Dental /d/ in "madad" pronounced with tongue touching upper teeth.'
  },
  {
    id: 's6',
    hindi: 'मुझे हिंदी बोलना और सीखना बहुत पसंद है।',
    romanized: 'Mujhe Hindi bolna aur seekhna bahut pasand hai.',
    english: 'I really enjoy speaking and learning Hindi.',
    category: 'Academic',
    difficulty: 'Intermediate',
    focusPhonemes: 'Mo-jhe / seekh-na / pa-sand',
    tip: 'Aspirated /jh/ in "mujhe" and dental nasal /nd/ in "pasand".'
  },
  {
    id: 's7',
    hindi: 'शुभ प्रभात! आपका दिन मंगलमय और सुखद हो।',
    romanized: 'Shubh prabhat! Aapka din mangalmay aur sukhad ho.',
    english: 'Good morning! May your day be blissful and pleasant.',
    category: 'Greetings',
    difficulty: 'Advanced',
    focusPhonemes: 'Shubh / pra-bhat / man-gal-may',
    tip: 'Clear articulation of initial aspirated /bh/ and conjunct /pr/ in "prabhat".'
  },
  {
    id: 's8',
    hindi: 'सफलता का रहस्य निरंतर प्रयास और लगन में है।',
    romanized: 'Saphalta ka rahasya nirantar prayas aur lagan mein hai.',
    english: 'The secret of success lies in continuous effort and dedication.',
    category: 'Workplace',
    difficulty: 'Advanced',
    focusPhonemes: 'ra-has-ya / ni-ran-tar / pra-yas',
    tip: 'Maintain steady pacing for literary conjuncts in "rahasya" and "nirantar".'
  }
];

export const HINDI_SCENARIOS: HindiConversationScenario[] = [
  {
    id: 'hscen-greetings',
    title: 'Warm Friends Greeting (अभिवादन)',
    category: 'Greetings',
    icon: '🤝',
    tutorName: 'Aarav (आरव)',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Hindi (खड़ी बोली)',
    difficulty: 'Beginner',
    description: 'Practice everyday friendly greetings, asking about health, work, and family in Hindi.',
    initialMessage: 'नमस्ते दोस्त! आप कैसे हैं? काफी दिनों बाद मिलना हुआ। सब कैसा चल रहा है?',
    suggestedUserPrompts: [
      'नमस्ते आरव! मैं बिलकुल ठीक हूँ, आप बताओ?',
      'सब बहुत अच्छा चल रहा है। आप कैसे हैं?',
      'हाँ! आज बहुत दिनों बाद मिलकर बहुत खुशी हुई।'
    ],
    tips: [
      'Use polite greetings like "नमस्ते" (Namaste) or "नमस्कार" (Namaskar).',
      'End respectful verbs with "हैं" (hain) when speaking politely.'
    ]
  },
  {
    id: 'hscen-shopping',
    title: 'Market & Bargaining (खरीदारी)',
    category: 'Shopping',
    icon: '🛍️',
    tutorName: 'Priya (प्रिया)',
    tutorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Hindi (खड़ी बोली)',
    difficulty: 'Intermediate',
    description: 'Buy fresh fruits, handicrafts, or clothes at an Indian market and ask for prices.',
    initialMessage: 'नमस्ते जी! हमारी दुकान में आपका स्वागत है। बताइए आज आपको क्या चाहिए? ताज़े फल या हस्तशिल्प?',
    suggestedUserPrompts: [
      'नमस्ते! ये आम कितने रुपये किलो हैं?',
      'मुझे कुछ ताज़े फल और हस्तशिल्प देखने हैं।',
      'क्या आप इसमें कुछ छूट (discount) दे सकती हैं?'
    ],
    tips: [
      'Ask price using "कितने का है?" (Kitne ka hai?).',
      'Use polite terms like "भैया/दीदी" when addressing shopkeepers.'
    ]
  },
  {
    id: 'hscen-travel',
    title: 'Railway & City Travel (यात्रा)',
    category: 'Travel',
    icon: '🚆',
    tutorName: 'Vikram (विक्रम)',
    tutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Hindi (खड़ी बोली)',
    difficulty: 'Intermediate',
    description: 'Ask for directions, buy train tickets, and inquire about tourist spots in India.',
    initialMessage: 'नमस्कार यात्री जी! रेलवे पूछताछ केंद्र पर आपका स्वागत है। आप कहाँ की यात्रा करना चाहते हैं?',
    suggestedUserPrompts: [
      'नमस्ते! मुझे जयपुर के लिए दो टिकट चाहिए।',
      'अगली ट्रेन कितने बजे छूटेगी?',
      'क्या आप मुझे निकटतम मेट्रो स्टेशन का रास्ता बता सकते हैं?'
    ],
    tips: [
      'Use "कहाँ है?" (Kahan hai?) for asking directions.',
      'Inquire time using "कितने बजे?" (Kitne baje?).'
    ]
  },
  {
    id: 'hscen-family',
    title: 'Host Family Dinner (परिवार)',
    category: 'Family',
    icon: '🏠',
    tutorName: 'Sunita Aunty (सुनीता आंटी)',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Hindi (खड़ी बोली)',
    difficulty: 'Beginner',
    description: 'Enjoy a warm home-cooked Indian dinner with host family members.',
    initialMessage: 'आइए आइए! घर पर आपका स्वागत है। आज हमने आपके लिए गरम-गरम पनीर और रोटियाँ बनाई हैं। आप चाय लेंगे या ठंडा?',
    suggestedUserPrompts: [
      'धन्यवाद आंटी! सब कुछ बहुत ही स्वादिष्ट लग रहा है।',
      'मैं थोड़ी अदरक वाली चाय लेना पसंद करूँगा।',
      'खाना सचमुच बहुत स्वादिष्ट बना है!'
    ],
    tips: [
      'Compliment food using "बहुत स्वादिष्ट है" (Bahut swaadisht hai).',
      'Express hospitality and respect with elders.'
    ]
  },
  {
    id: 'hscen-school',
    title: 'Hindi Classroom Discussion (विद्यालय)',
    category: 'School',
    icon: '🏫',
    tutorName: 'Guruji Dev (देव गुरुजी)',
    tutorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Hindi (खड़ी बोली)',
    difficulty: 'Intermediate',
    description: 'Discuss Hindi poetry, grammar, and literary assignments with your teacher.',
    initialMessage: 'सुप्रभात विद्यार्थियों! आज की कक्षा में हम हिंदी व्याकरण और कविताओं के उच्चारण का अभ्यास करेंगे। क्या आप तैयार हैं?',
    suggestedUserPrompts: [
      'सुप्रभात गुरुजी! जी हाँ, हम अभ्यास के लिए तैयार हैं।',
      'गुरुजी, मुझे इस शब्द के उच्चारण में थोड़ी कठिनाई हो रही है।',
      'क्या आप मुझे आज का गृहकार्य (homework) दोबारा समझा सकते हैं?'
    ],
    tips: [
      'Address teachers with honorific "गुरुजी" (Guruji) or "सर/मैडम".',
      'Use formal Hindi vocabulary for classroom context.'
    ]
  },
  {
    id: 'hscen-office',
    title: 'Office Team Sync (कार्यालय)',
    category: 'Office',
    icon: '💼',
    tutorName: 'Kavita (कविता)',
    tutorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    accent: 'Standard Hindi (खड़ी बोली)',
    difficulty: 'Advanced',
    description: 'Deliver project status updates and collaborate on quarterly strategy in formal Hindi.',
    initialMessage: 'नमस्कार टीम! आज की बैठक में हम चालू तिमाही के प्रोजेक्ट अपडेट्स और नई रणनीतियों पर चर्चा करेंगे। कौन शुरुआत करेगा?',
    suggestedUserPrompts: [
      'नमस्ते कविता! मैं आज की रिपोर्ट प्रस्तुत करना चाहता हूँ।',
      'हमारी टीम ने इस महीने का लक्ष्य सफलतापूर्वक पूरा कर लिया है।',
      'प्रोजेक्ट की समयसीमा के बारे में मेरा एक सुझाव है।'
    ],
    tips: [
      'Incorporate professional Hindi business terms like "प्रोजेक्ट" (Project) and "लक्ष्य" (Goal).',
      'Speak with clear, structured articulation and executive presence.'
    ]
  }
];

export const HINDI_READING_PARAGRAPHS: HindiReadingParagraph[] = [
  {
    id: 'rp1',
    title: 'Indian Culture & Festival Diversity',
    titleHindi: 'भारतीय संस्कृति और त्योहार',
    category: 'Culture',
    difficulty: 'Beginner',
    hindiText: 'भारत एक महान और समृद्ध सांस्कृतिक धरोहर वाला देश है। यहाँ विभिन्न संस्कृतियों, भाषाओं और त्योहारों का सुंदर संगम देखने को मिलता है। दिवाली, होली और ईद जैसे त्योहार सभी लोग आपस में मिलकर बड़े उत्साह से मनाते हैं। प्रेम और भाईचारे की यह भावना ही भारत की असली पहचान है।',
    romanizedText: 'Bharat ek mahan aur samriddh sanskritik dharohar wala desh hai. Yahan vividh sanskritiyon, bhashaon aur tyoharon ka sundar sangam dekhne ko milta hai. Diwali, Holi aur Eid jaise tyohar sabhi log aapas mein milkar bade utsah se manate hain. Prem aur bhaichare ki yeh bhavna hi Bharat ki asli pehchan hai.',
    englishTranslation: 'India is a country with a great and rich cultural heritage. A beautiful confluence of diverse cultures, languages, and festivals can be seen here. Festivals like Diwali, Holi, and Eid are celebrated with great enthusiasm together by everyone. This feeling of love and brotherhood is the true identity of India.',
    estimatedSeconds: 35,
    wordCount: 45,
    keyVocabulary: [
      { word: 'धरोहर (Dharohar)', meaning: 'Heritage' },
      { word: 'संगम (Sangam)', meaning: 'Confluence / Union' },
      { word: 'उत्साह (Utsah)', meaning: 'Enthusiasm' },
      { word: 'भाईचारा (Bhaichara)', meaning: 'Brotherhood' }
    ],
    readingTips: [
      'Pause slightly after full stops (।) and commas (,) to maintain natural cadence.',
      'Pronounce long vowels clearly in words like "महान" (Mahan) and "त्योहारों" (Tyoharon).'
    ]
  },
  {
    id: 'rp2',
    title: 'Environment & Nature Conservation',
    titleHindi: 'पर्यावरण और प्रकृति सुरक्षा',
    category: 'Nature',
    difficulty: 'Intermediate',
    hindiText: 'प्रकृति मनुष्य के जीवन का मुख्य आधार है। हरे-भरे पेड़, नदियाँ और स्वच्छ वायु हमारे स्वस्थ अस्तित्व के लिए अनिवार्य हैं। परंतु आधुनिक युग में बढ़ता प्रदूषण और वनों की कटाई प्रकृति के लिए गंभीर संकट उत्पन्न कर रही है। हमें वृक्षारोपण और पर्यावरण संरक्षण का संकल्प लेना चाहिए।',
    romanizedText: 'Prakriti manushya ke jeevan ka mukhya aadhar hai. Hare-bhare ped, nadiyan aur swachh vayu hamare swasth astitva ke liye anivarya hain. Parantu aadhunik yug mein badhta pradushan aur vanon ki katai prakriti ke liye gambhir sankat utpann kar rahi hai. Humein vriksharopan aur paryavaran sanrakshan ka sankalp lena chahiye.',
    englishTranslation: 'Nature is the primary foundation of human life. Lush green trees, rivers, and clean air are essential for our healthy existence. However, growing pollution and deforestation in the modern era are creating serious threats to nature. We must pledge to plant trees and protect our environment.',
    estimatedSeconds: 42,
    wordCount: 52,
    keyVocabulary: [
      { word: 'अस्तित्व (Astitva)', meaning: 'Existence' },
      { word: 'अनिवार्य (Anivarya)', meaning: 'Essential / Mandatory' },
      { word: 'प्रदूषण (Pradushan)', meaning: 'Pollution' },
      { word: 'वृक्षारोपण (Vriksharopan)', meaning: 'Tree Plantation' }
    ],
    readingTips: [
      'Emphasize the conjunct /kṣ/ and /tr/ in "प्रकृति" (Prakriti) and "वृक्षारोपण" (Vriksharopan).',
      'Keep a calm, authoritative newsreader tone during environmental readings.'
    ]
  },
  {
    id: 'rp3',
    title: 'The Value of Modern Education',
    titleHindi: 'शिक्षा का वास्तविक महत्व',
    category: 'Education',
    difficulty: 'Advanced',
    hindiText: 'शिक्षा केवल किताबी ज्ञान प्राप्त करने का साधन नहीं है, बल्कि यह व्यक्ति के चरित्र निर्माण और नैतिक मूल्यों का विकास करती है। एक शिक्षित समाज ही राष्ट्र की प्रगति और समृद्धि की नींव रखता है। डिजिटल तकनीक ने शिक्षा को हर व्यक्ति तक पहुँचाने में महत्वपूर्ण योगदान दिया है।',
    romanizedText: 'Shiksha keval kitabi gyaan prapt karne ka sadhan nahin hai, balki yeh vyakti ke charitra nirman aur naitik moolyon ka vikas karti hai. Ek shikshit samaj hi rashtra ki pragati aur samriddhi ki neev rakhta hai. Digital takneek ne shiksha ko har vyakti tak pahunchane mein mahatvapurna yogdan diya hai.',
    englishTranslation: 'Education is not merely a tool for gaining bookish knowledge, but it builds personal character and moral values. Only an educated society lays the foundation of national progress and prosperity. Digital technology has played a vital role in making education accessible to everyone.',
    estimatedSeconds: 50,
    wordCount: 58,
    keyVocabulary: [
      { word: 'चरित्र (Charitra)', meaning: 'Character' },
      { word: 'नैतिक मूल्य (Naitik Moolya)', meaning: 'Moral Values' },
      { word: 'समृद्धि (Samriddhi)', meaning: 'Prosperity' },
      { word: 'योगदान (Yogdan)', meaning: 'Contribution' }
    ],
    readingTips: [
      'Enunciate formal Sanskritized Hindi terms cleanly like "सामर्थ्य" and "नैतिक मूल्य".',
      'Aim for a comfortable speed of 120-140 words per minute.'
    ]
  }
];

export const HINDI_VOCAB_ITEMS: HindiVocabItem[] = [
  {
    id: 'v1',
    wordHindi: 'नमस्ते',
    romanized: 'Namaste',
    englishMeaning: 'Hello / Greetings',
    hindiMeaning: 'अभिवादन, प्रणाम',
    partOfSpeech: 'Interjection / Noun',
    category: 'Basics',
    difficulty: 'A1',
    exampleHindi: 'नमस्ते! आप आज कैसे हैं?',
    exampleRomanized: 'Namaste! Aap aaj kaise hain?',
    exampleEnglish: 'Hello! How are you today?'
  },
  {
    id: 'v2',
    wordHindi: 'धन्यवाद',
    romanized: 'Dhanyavaad',
    englishMeaning: 'Thank you',
    hindiMeaning: 'आभार प्रकट करना',
    partOfSpeech: 'Noun / Interjection',
    category: 'Basics',
    difficulty: 'A1',
    exampleHindi: 'आपकी सहायता के लिए बहुत-बहुत धन्यवाद।',
    exampleRomanized: 'Aapki sahayata ke liye bahut-bahut dhanyavaad.',
    exampleEnglish: 'Thank you very much for your help.'
  },
  {
    id: 'v3',
    wordHindi: 'यात्रा',
    romanized: 'Yaatra',
    englishMeaning: 'Journey / Travel',
    hindiMeaning: 'सफ़र, पर्यटन',
    partOfSpeech: 'Noun',
    category: 'Travel',
    difficulty: 'A1',
    exampleHindi: 'आपकी भारत यात्रा मंगलमय हो।',
    exampleRomanized: 'Aapki Bharat yaatra mangalmay ho.',
    exampleEnglish: 'Have a pleasant trip to India.'
  },
  {
    id: 'v4',
    wordHindi: 'स्वादिष्ट',
    romanized: 'Swaadisht',
    englishMeaning: 'Delicious / Tasty',
    hindiMeaning: 'ज़ायदेदार, रुचिकर',
    partOfSpeech: 'Adjective',
    category: 'Food',
    difficulty: 'A2',
    exampleHindi: 'माँ ने बहुत ही स्वादिष्ट व्यंजन बनाया है।',
    exampleRomanized: 'Maan ne bahut hi swaadisht vyanjan banaya hai.',
    exampleEnglish: 'Mother has prepared a very delicious meal.'
  },
  {
    id: 'v5',
    wordHindi: 'आनंद',
    romanized: 'Aanand',
    englishMeaning: 'Joy / Delight',
    hindiMeaning: 'खुशी, प्रसन्नता',
    partOfSpeech: 'Noun',
    category: 'Emotions',
    difficulty: 'A2',
    exampleHindi: 'प्रकृति की गोद में शांति और आनंद मिलता है।',
    exampleRomanized: 'Prakriti ki god mein shanti aur aanand milta hai.',
    exampleEnglish: 'In nature\'s lap, one finds peace and joy.'
  },
  {
    id: 'v6',
    wordHindi: 'सफलता',
    romanized: 'Saphalta',
    englishMeaning: 'Success',
    hindiMeaning: 'कामयाबी, विजय',
    partOfSpeech: 'Noun',
    category: 'Work',
    difficulty: 'A2',
    exampleHindi: 'कठिन परिश्रम ही सफलता की कुंजी है।',
    exampleRomanized: 'Kathin parishram hi saphalta ki kunji hai.',
    exampleEnglish: 'Hard work is the key to success.'
  },
  {
    id: 'v7',
    wordHindi: 'वातावरण',
    romanized: 'Vaataavaran',
    englishMeaning: 'Environment / Atmosphere',
    hindiMeaning: 'पर्यावरण, परिवेश',
    partOfSpeech: 'Noun',
    category: 'Nature',
    difficulty: 'B1',
    exampleHindi: 'आज सुबह का वातावरण बहुत ही स्वच्छ और मनमोहक है।',
    exampleRomanized: 'Aaj subah ka vaataavaran bahut hi swachh aur manmohak hai.',
    exampleEnglish: 'This morning\'s atmosphere is very clean and charming.'
  },
  {
    id: 'v8',
    wordHindi: 'प्रेरणा',
    romanized: 'Prerna',
    englishMeaning: 'Inspiration / Motivation',
    hindiMeaning: 'उत्साह, प्रोत्साहन',
    partOfSpeech: 'Noun',
    category: 'Emotions',
    difficulty: 'B1',
    exampleHindi: 'महान लोगों के विचार हमें जीवन में आगे बढ़ने की प्रेरणा देते हैं।',
    exampleRomanized: 'Mahan logon ke vichar humein jeevan mein aage badhne ki prerna dete hain.',
    exampleEnglish: 'The thoughts of great people give us inspiration to move forward in life.'
  },
  {
    id: 'v9',
    wordHindi: 'हस्तशिल्प',
    romanized: 'Hastashilp',
    englishMeaning: 'Handicraft / Artisan Goods',
    hindiMeaning: 'हाथ की कारीगरी',
    partOfSpeech: 'Noun',
    category: 'Travel',
    difficulty: 'B2',
    exampleHindi: 'भारतीय हस्तशिल्प पूरी दुनिया में प्रसिद्ध है।',
    exampleRomanized: 'Bharatiya hastashilp poori duniya mein prasiddh hai.',
    exampleEnglish: 'Indian handicraft is famous all over the world.'
  },
  {
    id: 'v10',
    wordHindi: 'मित्रता',
    romanized: 'Mitrata',
    englishMeaning: 'Friendship',
    hindiMeaning: 'दोस्ती, भ्रातृत्व',
    partOfSpeech: 'Noun',
    category: 'Basics',
    difficulty: 'A1',
    exampleHindi: 'सच्ची मित्रता जीवन का सबसे अनमोल उपहार है।',
    exampleRomanized: 'Sacchi mitrata jeevan ka sabse anmol uphar hai.',
    exampleEnglish: 'True friendship is life\'s most priceless gift.'
  }
];
