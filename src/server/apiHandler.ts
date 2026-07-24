import { GoogleGenAI } from '@google/genai';

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export async function handlePronounceEval(reqBody: any) {
  const { targetText, userTranscript, accent } = reqBody || {};
  const ai = getGeminiClient();

  if (!ai) {
    // Fallback response handled on client
    return null;
  }

  try {
    const prompt = `Analyze the English pronunciation of the target word/sentence "${targetText}" spoken as "${userTranscript || targetText}" in ${accent || 'US'} accent.
Return a valid JSON object with:
- word: string
- userTranscript: string
- overallScore: number (0 to 100)
- clarityScore: number
- rhythmScore: number
- intonationScore: number (0 to 100)
- pitchScore: number (0 to 100)
- speechRateWpm: number (e.g. 135)
- wordStress: string (e.g. "Primary stress on syllable 2")
- fluencyScore: number (0 to 100)
- confidenceScore: number (0 to 100)
- volumeLevel: string (e.g. "74 dB (Optimal)")
- pitchAnalysis: object with fields:
  - overallScore: number
  - pitchScore: number
  - intonationScore: number
  - speechRateWpm: number
  - wordStress: string
  - fluencyScore: number
  - confidenceScore: number
  - volumeLevel: string
  - pitchData: array of objects { time: string, userPitch: number (Hz), nativePitch: number (Hz), status: "optimal"|"flat"|"too_high"|"too_low", wordLabel: string }
  - highlightedSections: array of objects { section: string, issue: "flat"|"too_high"|"too_low", message: string }
  - aiSuggestions: string array of actionable suggestions
- aiFeedback: detailed actionable advice string
- mouthTip: specific mouth/tongue positioning tip
- syllables: string array of syllables
- stressedSyllableIndex: number
- recommendedPractice: sentence or drill
- phonemes: array of objects { symbol, ipa, isCorrect (boolean), score (number), tip, type ("vowel"|"consonant") }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (err) {
    console.error('Gemini pronounce eval error:', err);
  }

  return null;
}

export async function handleAITutor(reqBody: any) {
  const { userMessage, scenarioTitle, history, accent } = reqBody || {};
  const ai = getGeminiClient();

  if (!ai) return null;

  try {
    const prompt = `You are a supportive, high-level English Speech & Pronunciation Tutor conducting a roleplay scenario: "${scenarioTitle}" in ${accent || 'US'} accent.
User said: "${userMessage}".
Respond as the tutor in natural English.
Return JSON with:
- text: string (your spoken response)
- grammarCorrection: string or null (if user made a grammar error)
- vocabSuggestion: string or null (higher level vocabulary alternative)
- score: number (0-100 fluency rating for this turn)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (err) {
    console.error('Gemini AI tutor error:', err);
  }

  return null;
}

export async function handleDictionaryLookup(reqBody: any) {
  const { word } = reqBody || {};
  const ai = getGeminiClient();

  if (!ai) return null;

  try {
    const prompt = `Provide dictionary and IPA phonetic data for the English word "${word}".
Return JSON object matching:
{
  "word": string,
  "ipaUS": string (e.g. /.../),
  "ipaUK": string,
  "partOfSpeech": string,
  "definition": string,
  "difficulty": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  "syllables": string array,
  "stressedSyllableIndex": number,
  "examples": string array,
  "synonyms": string array,
  "antonyms": string array,
  "pronunciationTip": string,
  "commonTrap": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (err) {
    console.error('Gemini dictionary error:', err);
  }

  return null;
}
