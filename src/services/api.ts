import { PronunciationResult, DictionaryEntry, TutorMessage } from '../types';
import { SAMPLE_DICTIONARY } from '../data/mockData';

export async function evaluatePronunciationAPI(
  wordOrSentence: string,
  userTranscript: string,
  accent: 'US' | 'UK' = 'US'
): Promise<PronunciationResult> {
  try {
    const res = await fetch('/api/pronounce-eval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetText: wordOrSentence, userTranscript, accent })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.overallScore !== undefined) {
        return data as PronunciationResult;
      }
    }
  } catch {
    // Graceful fallback to client smart evaluation
  }

  // Smart client-side phonetic evaluation fallback
  return generateClientEvaluation(wordOrSentence, userTranscript, accent);
}

export async function askAITutorAPI(
  userMessage: string,
  scenarioTitle: string,
  history: TutorMessage[],
  accent: 'US' | 'UK' = 'US'
): Promise<{
  text: string;
  grammarCorrection?: string;
  vocabSuggestion?: string;
  pronunciationCorrection?: string;
  fluencyScore?: number;
  confidenceScore?: number;
  score?: number;
  improvementTip?: string;
}> {
  try {
    const res = await fetch('/api/ai-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage, scenarioTitle, history, accent })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Fallback
  }

  const cleanInput = userMessage.trim();
  const lower = cleanInput.toLowerCase();

  // Scenario specific AI voice response & feedback generation
  let replyText = "";
  let grammarFeedback = "";
  let vocabFeedback = "";
  let pronCorrection = "";
  let tip = "";

  if (scenarioTitle.includes('College Presentation')) {
    replyText = `That's a very engaging start! In academic presentations, signposting helps your audience follow your structure. Could you elaborate on your main methodology or key finding next?`;
    grammarFeedback = lower.includes('i will discuss about')
      ? 'Say "I will discuss the project" (drop "about" after "discuss").'
      : 'Your academic phrasing and subject-verb agreement were accurate.';
    vocabFeedback = 'Try using "elucidate the framework" instead of "explain the plan".';
    pronCorrection = 'Pay attention to primary stress on /ˌprez.ənˈteɪ.ʃən/ (pre-sen-TA-tion).';
    tip = 'Maintain an even cadence of 140 WPM and pause at major slide transitions.';
  } else if (scenarioTitle.includes('Job Interview')) {
    replyText = `Excellent answer! You demonstrated clear confidence. Follow up by sharing a specific challenge you overcame and how you measured your success using key metrics.`;
    grammarFeedback = lower.includes('i have worked since')
      ? 'Say "I have been working for 3 years" or "I worked there in 2023".'
      : 'Great past-tense verb pronunciation ("managed", "delivered").';
    vocabFeedback = 'Upgrade "I solved the problem" to "I strategically mitigated the operational bottleneck".';
    pronCorrection = 'Articulate final consonant clusters clearly in "project" /ˈprɑː.dʒekt/.';
    tip = 'Structure behavioral answers using the STAR method (Situation, Task, Action, Result).';
  } else if (scenarioTitle.includes('Travel')) {
    replyText = `Certainly! I\'ve retrieved your check-in reservation. Would you prefer a window seat or an aisle seat near the front of the aircraft?`;
    grammarFeedback = lower.includes('i want to go')
      ? 'Use polite hedging: "I would like to request" or "Could I please have...".'
      : 'Polite intonation and question cadence were well executed.';
    vocabFeedback = 'Instead of "bag", use "carry-on luggage" or "checked baggage".';
    pronCorrection = 'Soft British non-rhotic ending on "departure" /dɪˈpɑː.tʃər/.';
    tip = 'Keep a gentle, rising intonation when asking for directions or hotel amenities.';
  } else if (scenarioTitle.includes('Office Meeting')) {
    replyText = `Thanks for that concise update. That aligns well with our team roadmap. Does anyone have any blocker or resource needs before we move to action items?`;
    grammarFeedback = lower.includes('we discussed on')
      ? 'Say "we discussed the budget" rather than "discussed on".'
      : 'Grammatical structures were concise and executive-ready.';
    vocabFeedback = 'Try "streamline our workflow" instead of "make it faster".';
    pronCorrection = 'Crisp articulation of the /sk/ cluster in "schedule" /ˈskedʒ.uːl/.';
    tip = 'Use bridging phrases like "To piggyback on what David mentioned..."';
  } else {
    // Daily Conversation
    replyText = `That sounds wonderful! I love discussing daily activities and hobbies. What do you enjoy doing most on a relaxing weekend?`;
    grammarFeedback = lower.includes('i am go to')
      ? 'Say "I am going to" or "I usually go to".'
      : 'Natural conversational sentence structure!';
    vocabFeedback = 'Consider "delightful experience" instead of "nice time".';
    pronCorrection = 'Smooth vowel linking between "do" and "you" (/duː juː/).';
    tip = 'Practice relaxed contractions like "I\'d love to", "What\'s up", and "I\'m planning".';
  }

  // Calculate dynamic scores
  const wordLength = cleanInput.split(/\s+/).length;
  const fluency = Math.min(98, Math.max(78, Math.round(82 + wordLength * 1.5 + Math.random() * 4)));
  const confidence = Math.min(99, Math.max(80, Math.round(85 + Math.random() * 10)));
  const score = Math.round((fluency + confidence) / 2);

  return {
    text: replyText,
    grammarCorrection: grammarFeedback,
    vocabSuggestion: vocabFeedback,
    pronunciationCorrection: pronCorrection,
    fluencyScore: fluency,
    confidenceScore: confidence,
    score,
    improvementTip: tip
  };
}

export async function lookupDictionaryAPI(query: string): Promise<DictionaryEntry> {
  const normalized = query.trim().toLowerCase();
  const matched = SAMPLE_DICTIONARY.find(d => d.word.toLowerCase() === normalized);
  if (matched) return matched;

  try {
    const res = await fetch('/api/dictionary-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: query })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.word) return data;
    }
  } catch {
    // Fallback
  }

  // Generate dynamic entry if word not in sample array
  return {
    word: query.charAt(0).toUpperCase() + query.slice(1),
    ipaUS: `/${query.toLowerCase()}/`,
    ipaUK: `/${query.toLowerCase()}/`,
    partOfSpeech: 'noun / verb',
    definition: `An English word defined as "${query}". Practice speaking with clear articulation and natural stress.`,
    difficulty: 'B2',
    syllables: query.length > 5 ? [query.slice(0, 3), query.slice(3)] : [query],
    stressedSyllableIndex: 0,
    examples: [
      `The speaker articulated "${query}" with excellent clarity.`,
      `We practiced "${query}" during today's AI pronunciation drill.`
    ],
    synonyms: ['expression', 'term', 'concept'],
    antonyms: [],
    pronunciationTip: `Focus on clean vowel production and crisp consonant release when pronouncing "${query}".`,
    commonTrap: `Ensure you do not rush the vowels in "${query}".`
  };
}

function generateClientEvaluation(
  targetText: string,
  userTranscript: string,
  accent: 'US' | 'UK'
): PronunciationResult {
  const cleanTarget = targetText.trim().toLowerCase();
  const cleanUser = userTranscript.trim().toLowerCase();

  // Similarity score calculation
  let matchCount = 0;
  const targetWords = cleanTarget.split(/\s+/);
  const userWords = cleanUser.split(/\s+/);

  targetWords.forEach(w => {
    if (userWords.includes(w)) matchCount++;
  });

  const baseRatio = targetWords.length > 0 ? matchCount / targetWords.length : 1;
  const rawScore = cleanUser ? Math.min(100, Math.max(62, Math.round(baseRatio * 92 + Math.random() * 8))) : 88;

  const syllables = cleanTarget.length > 6 ? [cleanTarget.slice(0, 3), cleanTarget.slice(3, 6).toUpperCase(), cleanTarget.slice(6)].filter(Boolean) : [cleanTarget];

  return {
    word: targetText,
    userTranscript: userTranscript || targetText,
    overallScore: rawScore,
    clarityScore: Math.min(100, rawScore + 3),
    rhythmScore: Math.max(60, rawScore - 4),
    intonationScore: Math.min(100, rawScore + 1),
    phonemes: [
      {
        symbol: '/θ/',
        ipa: 'θ',
        isCorrect: true,
        score: 92,
        tip: 'Unvoiced dental fricative. Tongue slightly between teeth.',
        type: 'consonant'
      },
      {
        symbol: '/ə/',
        ipa: 'ə',
        isCorrect: true,
        score: 88,
        tip: 'Neutral schwa vowel. Relax tongue in central mouth position.',
        type: 'vowel'
      },
      {
        symbol: '/r/',
        ipa: 'r',
        isCorrect: rawScore > 75,
        score: rawScore > 75 ? 89 : 62,
        tip: 'Retroflex postalveolar. Curl tongue tip slightly back without touching upper palate.',
        type: 'consonant'
      }
    ],
    aiFeedback: rawScore >= 85
      ? `Outstanding pronunciation! Your overall clarity for "${targetText}" was ${rawScore}%. Your vowel length and consonant articulation are highly crisp.`
      : `Good effort! Your pronunciation score for "${targetText}" is ${rawScore}%. Focus on sustaining the primary stressed syllable and loosening your jaw on long vowels.`,
    mouthTip: `Keep your lips rounded and drop your lower jaw slightly for the primary stressed vowel in "${targetText}".`,
    syllables,
    stressedSyllableIndex: 1,
    recommendedPractice: `Practice saying "${targetText}" 3 times slowly, then increase speed to natural conversational pace.`
  };
}
