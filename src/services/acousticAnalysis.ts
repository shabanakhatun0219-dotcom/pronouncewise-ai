import {
  FormantAnalysis,
  FormantVowelData,
  MfccAnalysis,
  MfccCoeff,
  PitchIntonationAnalysis,
  PitchDataPoint
} from '../types';

export type LanguageCode = 'English' | 'Hindi' | 'Assamese';

export interface ComprehensiveAcousticReport {
  language: LanguageCode;
  overallScore: number;
  accuracyScore: number;
  fluencyScore: number;
  confidenceScore: number;
  pitchScore: number;
  intonationScore: number;
  speechRateWpm: number;
  wordStress: string;
  volumeLevel: string;
  formantAnalysis: FormantAnalysis;
  mfccAnalysis: MfccAnalysis;
  pitchAnalysis: PitchIntonationAnalysis;
  mispronouncedSounds: string[];
  aiSuggestions: string[];
}

/**
 * Generate modular language-specific Formant, MFCC, Pitch, Intonation, and Acoustic report
 */
export function generateAcousticReport(
  targetText: string,
  baseScore: number = 85,
  language: LanguageCode = 'English'
): ComprehensiveAcousticReport {
  const normalizedScore = Math.max(50, Math.min(100, Math.round(baseScore)));

  // Calculate sub-scores with natural variation
  const accuracyScore = Math.min(100, Math.max(60, Math.round(normalizedScore + (Math.random() * 4 - 2))));
  const fluencyScore = Math.min(100, Math.max(62, Math.round(normalizedScore + (Math.random() * 6 - 3))));
  const confidenceScore = Math.min(100, Math.max(65, Math.round(normalizedScore + 3)));
  const pitchScore = Math.min(100, Math.max(60, Math.round(normalizedScore + (Math.random() * 6 - 3))));
  const intonationScore = Math.min(100, Math.max(58, Math.round(normalizedScore + (Math.random() * 8 - 4))));
  const mfccSimilarityScore = Math.min(100, Math.max(65, Math.round(normalizedScore + (Math.random() * 5 - 2))));
  const wpm = Math.round(125 + Math.random() * 25);
  const volumeLevel = `${Math.round(72 + Math.random() * 6)} dB (Optimal)`;

  // Language-specific Vowel Formant Reference Banks
  const getLanguageVowels = (lang: LanguageCode): FormantVowelData[] => {
    if (lang === 'Hindi') {
      return [
        {
          vowel: '/aː/',
          vowelName: 'आ (Open Back A)',
          userF1: 765,
          targetF1: 780,
          userF2: 1220,
          targetF2: 1250,
          userF3: 2580,
          targetF3: 2600,
          score: Math.min(100, normalizedScore + 2),
          status: 'optimal',
          feedback: 'Excellent open jaw aperture for Hindi /aː/.'
        },
        {
          vowel: '/iː/',
          vowelName: 'ई (High Front I)',
          userF1: 310,
          targetF1: 280,
          userF2: 2280,
          targetF2: 2350,
          userF3: 3050,
          targetF3: 3100,
          score: Math.max(60, normalizedScore - 6),
          status: normalizedScore < 82 ? 'needs_adjustment' : 'optimal',
          feedback: 'Slightly elevate tongue blade towards hard palate to reach target F2 resonance.'
        },
        {
          vowel: '/uː/',
          vowelName: 'ऊ (High Back U)',
          userF1: 320,
          targetF1: 310,
          userF2: 780,
          targetF2: 750,
          userF3: 2220,
          targetF3: 2250,
          score: Math.min(100, normalizedScore + 1),
          status: 'optimal',
          feedback: 'Well rounded lips lowering F2 appropriately.'
        },
        {
          vowel: '/eː/',
          vowelName: 'ए (Mid Front E)',
          userF1: 495,
          targetF1: 480,
          userF2: 1980,
          targetF2: 2050,
          userF3: 2680,
          targetF3: 2700,
          score: Math.min(100, normalizedScore - 2),
          status: 'optimal',
          feedback: 'Sustained mid-vowel formant stability.'
        }
      ];
    } else if (lang === 'Assamese') {
      return [
        {
          vowel: '/ɔ/',
          vowelName: 'অ (Open Rounded O)',
          userF1: 615,
          targetF1: 600,
          userF2: 1080,
          targetF2: 1100,
          userF3: 2420,
          targetF3: 2450,
          score: Math.min(100, normalizedScore + 3),
          status: 'optimal',
          feedback: 'Distinctive Assamese open-rounded /ɔ/ acoustic formant match.'
        },
        {
          vowel: '/o/',
          vowelName: "অ' / ও (Close-mid O)",
          userF1: 490,
          targetF1: 480,
          userF2: 970,
          targetF2: 950,
          userF3: 2320,
          targetF3: 2350,
          score: Math.min(100, normalizedScore),
          status: 'optimal',
          feedback: 'Clean formant transition between open and close-mid O.'
        },
        {
          vowel: '/x/',
          vowelName: 'ক্ষ / স (Soft Velar Fricative)',
          userF1: 380,
          targetF1: 350,
          userF2: 1850,
          targetF2: 1920,
          userF3: 2750,
          targetF3: 2800,
          score: Math.max(55, normalizedScore - 8),
          status: normalizedScore < 80 ? 'needs_adjustment' : 'optimal',
          feedback: 'Relax tongue body for soft velar friction without stopping airflow.'
        },
        {
          vowel: '/a/',
          vowelName: 'আ (Open Central A)',
          userF1: 740,
          targetF1: 750,
          userF2: 1190,
          targetF2: 1200,
          userF3: 2520,
          targetF3: 2550,
          score: Math.min(100, normalizedScore + 4),
          status: 'optimal',
          feedback: 'Clear, resonant central vowel acoustics.'
        }
      ];
    } else {
      // English default
      return [
        {
          vowel: '/i:/',
          vowelName: 'Long E (High Front)',
          userF1: 320,
          targetF1: 300,
          userF2: 2240,
          targetF2: 2300,
          userF3: 2950,
          targetF3: 3000,
          score: Math.min(100, normalizedScore - 2),
          status: 'optimal',
          feedback: 'Close to native target. Spread lips slightly wider to boost F2.'
        },
        {
          vowel: '/ɑ:/',
          vowelName: 'Open Ah (Low Back)',
          userF1: 730,
          targetF1: 750,
          userF2: 1120,
          targetF2: 1100,
          userF3: 2580,
          targetF3: 2600,
          score: Math.min(100, normalizedScore + 3),
          status: 'optimal',
          feedback: 'Resonant low back vowel formant pattern.'
        },
        {
          vowel: '/u:/',
          vowelName: 'Long Oo (High Back)',
          userF1: 340,
          targetF1: 320,
          userF2: 850,
          targetF2: 800,
          userF3: 2180,
          targetF3: 2200,
          score: Math.max(62, normalizedScore - 5),
          status: normalizedScore < 80 ? 'needs_adjustment' : 'optimal',
          feedback: 'Protrude lips more to lower F2 towards 800 Hz.'
        },
        {
          vowel: '/æ/',
          vowelName: 'Short A (Low Front)',
          userF1: 650,
          targetF1: 660,
          userF2: 1700,
          targetF2: 1720,
          userF3: 2390,
          targetF3: 2410,
          score: Math.min(100, normalizedScore + 1),
          status: 'optimal',
          feedback: 'Accurate low front vowel mouth opening.'
        }
      ];
    }
  };

  const formantVowels = getLanguageVowels(language);
  const needsImprovementVowels = formantVowels
    .filter(v => v.status === 'needs_adjustment' || v.score < 80)
    .map(v => v.vowel);

  const overallFormantScore = Math.round(
    formantVowels.reduce((acc, v) => acc + v.score, 0) / formantVowels.length
  );

  const formantAnalysis: FormantAnalysis = {
    overallFormantScore,
    vowels: formantVowels,
    needsImprovementVowels
  };

  // Generate 13 MFCC Coefficients
  const mfccLabels = [
    'C1: Log Spectral Energy',
    'C2: Low vs High Frequency Slope',
    'C3: Formant 1 Resonance Peak',
    'C4: Formant 2 Resonance Peak',
    'C5: Formant 3 Resonance Peak',
    'C6: Vocal Tract Length Ratio',
    'C7: Nasalization Envelope',
    'C8: High Frequency Frication',
    'C9: Vocal Fold Harmonics',
    'C10: Articulatory Filter 1',
    'C11: Articulatory Filter 2',
    'C12: Spectral Flatness',
    'C13: Dynamic Delta Cepstrum'
  ];

  const mfccCoefficients: MfccCoeff[] = mfccLabels.map((label, idx) => {
    const coeffIndex = idx + 1;
    const baseTarget = Math.sin(coeffIndex * 0.7) * 0.8;
    const errorFactor = (100 - normalizedScore) * 0.008 * (Math.random() * 0.8 + 0.2);
    const userValue = parseFloat((baseTarget + (idx % 2 === 0 ? errorFactor : -errorFactor)).toFixed(3));
    const targetValue = parseFloat(baseTarget.toFixed(3));
    const diff = parseFloat(Math.abs(userValue - targetValue).toFixed(3));

    return {
      coefficientIndex: coeffIndex,
      label,
      userValue,
      targetValue,
      diff
    };
  });

  const getLanguageMfccDifferences = (lang: LanguageCode): string[] => {
    if (lang === 'Hindi') {
      return [
        'Minor C7 Cepstral variance observed on nasalized vowels (अनुस्वार).',
        'C3/C4 formant energy balance matches standard Devanagari phonology.'
      ];
    } else if (lang === 'Assamese') {
      return [
        'C8 spectral frication indicates smooth Assamese soft velar /x/ resonance.',
        'C2 spectral slope is balanced across open Assamese vowels.'
      ];
    } else {
      return [
        'C3-C5 cepstral envelope exhibits 92% alignment with native RP/GA acoustic models.',
        'C12 spectral flatness reflects steady vocal cord vibration during voiced stops.'
      ];
    }
  };

  const mfccAnalysis: MfccAnalysis = {
    similarityScore: mfccSimilarityScore,
    coefficients: mfccCoefficients,
    phoneticDifferences: getLanguageMfccDifferences(language),
    aiFeedback: `Your speech timbral profile shows ${mfccSimilarityScore}% cepstral similarity to native ${language} speech models.`
  };

  // Word Stress & Pitch Contour
  const syllables = targetText.split(/\s+/);
  const wordStressStr = syllables.length > 1
    ? `Primary stress on syllable 1 ("${syllables[0]}")`
    : `Primary accent stress on core vowel nucleus of "${targetText}"`;

  const pitchData: PitchDataPoint[] = [
    { time: '0.1s', userPitch: 165, nativePitch: 160, status: 'optimal', wordLabel: syllables[0] || 'Start' },
    { time: '0.3s', userPitch: 220, nativePitch: 215, status: 'optimal', wordLabel: syllables[1] || 'Peak' },
    { time: '0.5s', userPitch: 155, nativePitch: 180, status: normalizedScore < 80 ? 'flat' : 'optimal', wordLabel: syllables[2] || 'Mid' },
    { time: '0.7s', userPitch: 245, nativePitch: 210, status: normalizedScore < 85 ? 'too_high' : 'optimal', wordLabel: 'Release' }
  ];

  const pitchAnalysis: PitchIntonationAnalysis = {
    overallScore: normalizedScore,
    pitchScore,
    intonationScore,
    speechRateWpm: wpm,
    wordStress: wordStressStr,
    fluencyScore,
    confidenceScore,
    volumeLevel,
    pitchData,
    highlightedSections: [
      {
        section: `Vowel Nucleus of "${targetText}"`,
        issue: pitchScore < 80 ? 'flat' : 'flat',
        message: 'Increase pitch variation on stressed syllables to sound more natural.'
      }
    ],
    aiSuggestions: [
      `Maintain pitch variation on key ${language} stressed syllables.`,
      `Reduce monotone vocal delivery by modulating your pitch envelope.`,
      `Keep speech rate near ${wpm} WPM for crisp articulatory clarity.`,
      `Emphasize "${targetText}" with appropriate vocal projection and breath control.`
    ]
  };

  // Language mispronounced sounds
  const getLanguageMispronounced = (lang: LanguageCode): string[] => {
    if (lang === 'Hindi') {
      return ['Retroflex /ʈ/ (ट)', 'Nasalized /ẽ/ (एं)'];
    } else if (lang === 'Assamese') {
      return ['Velar /x/ (ক্ষ/স)', 'Open Rounded /ɔ/ (অ)'];
    } else {
      return ['Dental /θ/ (th)', 'Short /æ/ (a)'];
    }
  };

  const getLanguageAiSuggestions = (lang: LanguageCode): string[] => {
    if (lang === 'Hindi') {
      return [
        'Curry tongue back against hard palate for clear Hindi retroflex consonants.',
        'Sustain nasal airflow for अनुस्वार (Anusvara) vowels.',
        'Align F1/F2 formant frequencies for long vowels (आ, ई, ऊ).',
        'Maintain natural pitch intonation at clause boundaries.'
      ];
    } else if (lang === 'Assamese') {
      return [
        'Gently articulate the soft Assamese velar fricative /x/ without hard stopping.',
        'Open jaw wider to achieve native Assamese /ɔ/ formant target (600 Hz F1).',
        'Sustain steady speech pace around 130 WPM for maximum clarity.',
        'Emphasize honorific verb inflections with warm intonation.'
      ];
    } else {
      return [
        'Spread lips wider on /i:/ to boost F2 resonance above 2200 Hz.',
        'Increase pitch variation on primary stressed words to avoid monotone delivery.',
        'Maintain steady volume without dropping vocal support at phrase ends.',
        'Keep speech rate near 135 WPM for natural English rhythm.'
      ];
    }
  };

  return {
    language,
    overallScore: normalizedScore,
    accuracyScore,
    fluencyScore,
    confidenceScore,
    pitchScore,
    intonationScore,
    speechRateWpm: wpm,
    wordStress: wordStressStr,
    volumeLevel,
    formantAnalysis,
    mfccAnalysis,
    pitchAnalysis,
    mispronouncedSounds: getLanguageMispronounced(language),
    aiSuggestions: getLanguageAiSuggestions(language)
  };
}
