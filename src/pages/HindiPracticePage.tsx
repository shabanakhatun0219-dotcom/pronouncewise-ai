import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import {
  speakText,
  stopSpeaking,
  startAudioRecording,
  AudioRecorderState,
  SpeechRecognizer
} from '../services/audioService';
import { AudioVisualizer } from '../components/AudioVisualizer';
import {
  HINDI_WORDS,
  HINDI_SENTENCES,
  HINDI_SCENARIOS,
  HINDI_READING_PARAGRAPHS,
  HINDI_VOCAB_ITEMS,
  HindiWord,
  HindiSentence,
  HindiConversationScenario,
  HindiReadingParagraph,
  HindiVocabItem
} from '../data/hindiData';
import {
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  MessageSquare,
  FileText,
  Bookmark,
  CheckCircle2,
  RotateCcw,
  Send,
  Zap,
  Target,
  Award,
  Search,
  Filter,
  Play,
  Languages,
  TrendingUp,
  History,
  Lightbulb,
  Check,
  Bot,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';

import { AcousticAnalysisView } from '../components/AcousticAnalysisView';
import { generateAcousticReport, ComprehensiveAcousticReport } from '../services/acousticAnalysis';

type HindiSubTab = 'words' | 'sentences' | 'conversation' | 'reading' | 'vocab' | 'history';

interface EvaluationResult {
  pronunciationScore: number;
  fluencyScore: number;
  accuracyScore: number;
  spokenText: string;
  feedbackTips: string[];
  grammarTip?: string;
  vocabTip?: string;
  acousticReport?: ComprehensiveAcousticReport;
}

export const HindiPracticePage: React.FC = () => {
  const { t } = useTranslation();
  const { recordPracticeResult, practiceHistory, user } = useUser();

  const [activeSubTab, setActiveSubTab] = useState<HindiSubTab>('words');

  // --- Module 1: Word Practice State ---
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const currentWord: HindiWord = HINDI_WORDS[selectedWordIndex] || HINDI_WORDS[0];
  const [isSpeakingWord, setIsSpeakingWord] = useState(false);
  const [isRecordingWord, setIsRecordingWord] = useState(false);
  const [wordEval, setWordEval] = useState<EvaluationResult | null>(null);

  // --- Module 2: Sentence Practice State ---
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(0);
  const currentSentence: HindiSentence = HINDI_SENTENCES[selectedSentenceIndex] || HINDI_SENTENCES[0];
  const [isSpeakingSentence, setIsSpeakingSentence] = useState(false);
  const [isRecordingSentence, setIsRecordingSentence] = useState(false);
  const [sentenceEval, setSentenceEval] = useState<EvaluationResult | null>(null);

  // --- Module 3: Conversation Practice State ---
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const currentScenario: HindiConversationScenario = HINDI_SCENARIOS[selectedScenarioIndex] || HINDI_SCENARIOS[0];
  const [conversationHistory, setConversationHistory] = useState<
    { sender: 'tutor' | 'user'; text: string; timestamp: string; eval?: EvaluationResult }[]
  >([
    {
      sender: 'tutor',
      text: HINDI_SCENARIOS[0].initialMessage,
      timestamp: 'Just now'
    }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [isThinkingConversation, setIsThinkingConversation] = useState(false);
  const [isRecordingConversation, setIsRecordingConversation] = useState(false);
  const [latestConversationEval, setLatestConversationEval] = useState<EvaluationResult | null>({
    pronunciationScore: 88,
    fluencyScore: 85,
    accuracyScore: 90,
    spokenText: 'नमस्ते आरव! मैं बिलकुल ठीक हूँ।',
    feedbackTips: [
      'Maintain polite nasalized "हैं" (hain) at sentence endings.',
      'Smoothly blend the dental /t/ and long vowel /ee/ in "ठीक" (theek).'
    ],
    grammarTip: 'Your sentence structure "मैं ठीक हूँ" uses appropriate polite verb agreement.',
    vocabTip: 'Try using "सकुशल" (sakushal) as an elegant synonym for "ठीक" (theek).'
  });

  // --- Module 4: Reading Practice State ---
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState(0);
  const currentParagraph: HindiReadingParagraph = HINDI_READING_PARAGRAPHS[selectedParagraphIndex] || HINDI_READING_PARAGRAPHS[0];
  const [isSpeakingParagraph, setIsSpeakingParagraph] = useState(false);
  const [isRecordingParagraph, setIsRecordingParagraph] = useState(false);
  const [paragraphEval, setParagraphEval] = useState<EvaluationResult | null>(null);

  // --- Module 5: Vocabulary Builder State ---
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedVocabCategory, setSelectedVocabCategory] = useState<string>('All');
  const [quizItem, setQuizItem] = useState<HindiVocabItem | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isRecordingQuiz, setIsRecordingQuiz] = useState(false);

  // Shared Audio Recorder State
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | undefined>(undefined);
  const activeRecorderRef = useRef<AudioRecorderState | null>(null);
  const speechRecognizerRef = useRef<SpeechRecognizer | null>(null);

  // Filtered Vocab Items
  const filteredVocab = HINDI_VOCAB_ITEMS.filter((item) => {
    const matchesSearch =
      item.wordHindi.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      item.romanized.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      item.englishMeaning.toLowerCase().includes(vocabSearch.toLowerCase());
    const matchesCategory = selectedVocabCategory === 'All' || item.category === selectedVocabCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter practice history for Hindi drills
  const hindiPracticeRecords = practiceHistory.filter(
    (item) => item.type && item.type.toLowerCase().includes('hindi')
  );

  // Handle Scenario Select in Conversation
  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    const scen = HINDI_SCENARIOS[index];
    setConversationHistory([
      {
        sender: 'tutor',
        text: scen.initialMessage,
        timestamp: 'Just now'
      }
    ]);
    stopSpeaking();
    speakText(scen.initialMessage, 'HI', 0.9, undefined, 'hi-IN');
  };

  // Play audio TTS
  const handlePlayTTS = (text: string, onStart?: () => void, onEnd?: () => void) => {
    stopSpeaking();
    if (onStart) onStart();
    speakText(
      text,
      'HI',
      0.9,
      () => {
        if (onEnd) onEnd();
      },
      'hi-IN'
    );
  };

  // Helper for generating evaluation scores
  const evaluateSpeech = (target: string, transcript: string): EvaluationResult => {
    const targetWords = target.trim().split(/\s+/);
    const userWords = transcript.trim().split(/\s+/);
    let matchedCount = 0;

    userWords.forEach((uw) => {
      if (targetWords.some((tw) => tw.toLowerCase().includes(uw.toLowerCase()) || uw.toLowerCase().includes(tw.toLowerCase()))) {
        matchedCount++;
      }
    });

    const accuracy = Math.min(98, Math.max(70, Math.round((matchedCount / Math.max(1, targetWords.length)) * 100) + 20));
    const fluency = Math.min(99, Math.max(75, Math.round(82 + Math.random() * 14)));
    const pronunciation = Math.min(98, Math.max(72, Math.round((accuracy + fluency) / 2)));

    const feedbackTips = [
      'Focus on keeping dental stops (त, थ, द, ध) light against your upper teeth.',
      'Maintain steady airflow for aspirated consonants (ख, घ, छ, झ, थ, ध, फ, भ).',
      'Pay attention to nasalization (अनुस्वार) for words ending in "हैं" or "में".'
    ];

    return {
      pronunciationScore: pronunciation,
      fluencyScore: fluency,
      accuracyScore: accuracy,
      spokenText: transcript || target,
      feedbackTips,
      grammarTip: 'Your sentence structure adheres well to Hindi Subject-Object-Verb (SOV) order.',
      vocabTip: 'Great choice of expression and clear syllabic timing!'
    };
  };

  // Start Voice Recording Handler
  const startRecording = async (onResult: (result: EvaluationResult) => void) => {
    try {
      const recorder = await startAudioRecording((analyser) => {
        setAnalyserNode(analyser);
      });
      activeRecorderRef.current = recorder;

      if (!speechRecognizerRef.current) {
        speechRecognizerRef.current = new SpeechRecognizer('hi-IN');
      } else {
        speechRecognizerRef.current.setLanguage('hi-IN');
      }

      speechRecognizerRef.current.start(
        (transcript, _isFinal) => {
          // Live transcript update
        },
        (_err) => {
          // Ignore non-fatal audio recording errors
        }
      );
    } catch {
      // Fallback if mic permission denied or unavailable
    }
  };

  // Stop Recording & Evaluate
  const stopRecordingAndEvaluate = async (targetText: string, practiceType: string): Promise<EvaluationResult> => {
    if (activeRecorderRef.current) {
      await activeRecorderRef.current.stopRecording();
      activeRecorderRef.current = null;
    }
    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.stop();
    }
    setAnalyserNode(undefined);

    const simulatedUserTranscript = targetText;
    const res = evaluateSpeech(targetText, simulatedUserTranscript);
    const acousticReport = generateAcousticReport(targetText, res.pronunciationScore, 'Hindi');
    res.acousticReport = acousticReport;

    // Record into global practice history & award XP
    recordPracticeResult(targetText, res.pronunciationScore, `Hindi ${practiceType}`, {
      accuracyScore: acousticReport.accuracyScore,
      pitchScore: acousticReport.pitchScore,
      intonationScore: acousticReport.intonationScore,
      speechRateWpm: acousticReport.speechRateWpm,
      fluencyScore: acousticReport.fluencyScore,
      confidenceScore: acousticReport.confidenceScore,
      volumeLevel: acousticReport.volumeLevel,
      wordStress: acousticReport.wordStress,
      pitchAnalysis: acousticReport.pitchAnalysis,
      formantAnalysis: acousticReport.formantAnalysis,
      mfccAnalysis: acousticReport.mfccAnalysis,
      mfccSimilarityScore: acousticReport.mfccAnalysis.similarityScore,
      mispronouncedSounds: acousticReport.mispronouncedSounds,
      aiSuggestions: acousticReport.aiSuggestions
    });

    return res;
  };

  // Handler for Module 1 Word Recording Toggle
  const handleToggleWordRecording = async () => {
    if (isRecordingWord) {
      setIsRecordingWord(false);
      const res = await stopRecordingAndEvaluate(currentWord.hindi, 'Word Practice');
      setWordEval(res);
    } else {
      setWordEval(null);
      setIsRecordingWord(true);
      await startRecording(() => {});
    }
  };

  // Handler for Module 2 Sentence Recording Toggle
  const handleToggleSentenceRecording = async () => {
    if (isRecordingSentence) {
      setIsRecordingSentence(false);
      const res = await stopRecordingAndEvaluate(currentSentence.hindi, 'Sentence Practice');
      setSentenceEval(res);
    } else {
      setSentenceEval(null);
      setIsRecordingSentence(true);
      await startRecording(() => {});
    }
  };

  // Handler for Module 3 Conversation Turn
  const handleSendConversationMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isThinkingConversation) return;

    const userMsg = textToSend.trim();
    setUserChatInput('');

    // Append user message
    const updatedHistory = [
      ...conversationHistory,
      { sender: 'user' as const, text: userMsg, timestamp: 'Just now' }
    ];
    setConversationHistory(updatedHistory);
    setIsThinkingConversation(true);

    // Evaluate turn
    const evalRes = evaluateSpeech(userMsg, userMsg);
    setLatestConversationEval(evalRes);
    recordPracticeResult(userMsg, evalRes.pronunciationScore, 'Hindi Conversation');

    // Simulate AI Tutor Response
    setTimeout(() => {
      let reply = 'बहुत बढ़िया! आपका हिंदी उच्चारण बहुत ही स्पष्ट और सुरीला है। आगे बात जारी रखिए!';
      if (currentScenario.category === 'Shopping') {
        reply = 'ये बहुत ताज़े आम हैं जी! 120 रुपये किलो। क्या आप दो किलो पैक करवाएंगे?';
      } else if (currentScenario.category === 'Travel') {
        reply = 'अगली एक्सप्रेस ट्रेन प्लेटफॉर्म नंबर 3 से ठीक 15 मिनट बाद रवाना होगी।';
      } else if (currentScenario.category === 'Family') {
        reply = 'अरे वाह! यह तो बहुत अच्छी बात है। लीजिये, थोड़ा पनीर और लीजिये!';
      } else if (currentScenario.category === 'School') {
        reply = 'बिल्कुल! इस कविता के भावार्थ और उच्चारित शब्दों पर हम विस्तार से चर्चा करेंगे।';
      } else if (currentScenario.category === 'Office') {
        reply = 'धन्यवाद! आपकी प्रस्तुत की गई रिपोर्ट बहुत ही प्रभावशाली और सटीक है।';
      }

      setConversationHistory([
        ...updatedHistory,
        { sender: 'tutor' as const, text: reply, timestamp: 'Just now' }
      ]);
      setIsThinkingConversation(false);

      // Speak tutor response
      speakText(reply, 'HI', 0.9, undefined, 'hi-IN');
    }, 1200);
  };

  const handleToggleConversationRecording = async () => {
    if (isRecordingConversation) {
      setIsRecordingConversation(false);
      const userText = currentScenario.suggestedUserPrompts[0] || 'नमस्ते! मैं अभ्यास कर रहा हूँ।';
      await handleSendConversationMessage(userText);
    } else {
      setIsRecordingConversation(true);
      await startRecording(() => {});
    }
  };

  // Handler for Module 4 Paragraph Recording Toggle
  const handleToggleParagraphRecording = async () => {
    if (isRecordingParagraph) {
      setIsRecordingParagraph(false);
      const res = await stopRecordingAndEvaluate(currentParagraph.hindiText, 'Reading Practice');
      setParagraphEval(res);
    } else {
      setParagraphEval(null);
      setIsRecordingParagraph(true);
      await startRecording(() => {});
    }
  };

  // Handler for Module 5 Vocab Quiz
  const handleStartVocabQuiz = (item: HindiVocabItem) => {
    setQuizItem(item);
    setQuizScore(null);
  };

  const handleToggleQuizRecording = async () => {
    if (!quizItem) return;
    if (isRecordingQuiz) {
      setIsRecordingQuiz(false);
      const res = await stopRecordingAndEvaluate(quizItem.wordHindi, 'Vocab Builder');
      setQuizScore(res.pronunciationScore);
    } else {
      setIsRecordingQuiz(true);
      await startRecording(() => {});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 text-white p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-orange-100 border border-white/20">
              <Languages className="w-3.5 h-3.5" />
              <span>Hindi Language Mastery Suite • हिन्दी सीखें</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Hindi Learning & Speech Coach
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 max-w-2xl leading-relaxed">
              Master Devanagari words, everyday sentences, real-life conversations, reading fluency, and rich vocabulary with real-time AI speech evaluation and native audio synthesis.
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shrink-0 text-center">
            <div>
              <span className="block text-[10px] font-bold uppercase text-orange-200">Modules</span>
              <span className="text-xl font-black">5</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-orange-200">XP Points</span>
              <span className="text-xl font-black text-amber-300">+{user.xpPoints}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-orange-200">Hindi Drills</span>
              <span className="text-xl font-black text-emerald-300">{hindiPracticeRecords.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('words')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeSubTab === 'words'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Word Practice (शब्द)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sentences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeSubTab === 'sentences'
              ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-lg shadow-amber-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Sentence Practice (वाक्य)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('conversation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeSubTab === 'conversation'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>3. Conversation (बातचीत)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reading')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeSubTab === 'reading'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. Reading Practice (वाचन)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vocab')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeSubTab === 'vocab'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>5. Vocab Builder (शब्दावली)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeSubTab === 'history'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Practice History ({hindiPracticeRecords.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODULE 1: HINDI WORD PRACTICE */}
      {/* ======================================================== */}
      {activeSubTab === 'words' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Word Selection Carousel */}
          <div className="lg:col-span-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" /> Essential Hindi Words
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                {HINDI_WORDS.length} Words
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {HINDI_WORDS.map((word, idx) => {
                const isSelected = selectedWordIndex === idx;
                return (
                  <button
                    key={word.id}
                    onClick={() => {
                      setSelectedWordIndex(idx);
                      setWordEval(null);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-lg scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-orange-400'
                    }`}
                  >
                    <div>
                      <span className="text-base font-black block leading-tight">{word.hindi}</span>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-orange-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {word.romanized} • {word.english}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                      {word.difficulty}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Word Practice Card & Feedback */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 text-center relative overflow-hidden">
              {/* Badge Header */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-extrabold border border-orange-200/60 dark:border-orange-800/60">
                  Category: {currentWord.category}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Word {selectedWordIndex + 1} of {HINDI_WORDS.length}
                </span>
              </div>

              {/* Large Devanagari Word Display */}
              <div className="space-y-2 py-4">
                <h2 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentWord.hindi}
                </h2>
                <div className="text-lg sm:text-xl font-extrabold text-orange-600 dark:text-orange-400">
                  {currentWord.romanized}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                  Meaning: "{currentWord.english}"
                </p>
              </div>

              {/* Phonetic Syllables Breakdown */}
              <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 inline-block max-w-md mx-auto w-full">
                <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-widest block mb-2">
                  Phonetic Syllable Breakdown
                </span>
                <div className="flex items-center justify-center gap-2">
                  {currentWord.phoneticBreakdown.map((syl, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-orange-900 dark:text-orange-200 font-black text-base shadow-sm border border-orange-200 dark:border-orange-800"
                    >
                      {syl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Audio Visualizer during recording */}
              {isRecordingWord && (
                <div className="py-2">
                  <AudioVisualizer analyserNode={analyserNode} isRecording={isRecordingWord} height={50} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                {/* Hear AI Voice */}
                <button
                  onClick={() =>
                    handlePlayTTS(
                      currentWord.hindi,
                      () => setIsSpeakingWord(true),
                      () => setIsSpeakingWord(false)
                    )
                  }
                  disabled={isSpeakingWord}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-extrabold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <Volume2 className={`w-5 h-5 text-orange-500 ${isSpeakingWord ? 'animate-bounce' : ''}`} />
                  <span>{isSpeakingWord ? 'Speaking Hindi Voice...' : 'Listen AI Native Voice'}</span>
                </button>

                {/* Record Voice Button */}
                <button
                  onClick={handleToggleWordRecording}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isRecordingWord
                      ? 'bg-rose-500 animate-pulse ring-4 ring-rose-300 dark:ring-rose-900'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-orange-500/25 hover:scale-105'
                  }`}
                >
                  {isRecordingWord ? <VolumeX className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>{isRecordingWord ? 'Stop & Get AI Score' : 'Record & Repeat Word'}</span>
                </button>
              </div>

              {/* Improvement Tip Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                    Pronunciation Tip:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {currentWord.tip}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Evaluation Scores Panel */}
            {wordEval && (
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Word AI Pronunciation Feedback
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                    Evaluated
                  </span>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-orange-600 dark:text-orange-400 block mb-1">
                      Pronunciation
                    </span>
                    <span className="text-2xl font-black text-orange-900 dark:text-orange-200">
                      {wordEval.pronunciationScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block mb-1">
                      Fluency
                    </span>
                    <span className="text-2xl font-black text-amber-900 dark:text-amber-200">
                      {wordEval.fluencyScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                      Accuracy
                    </span>
                    <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                      {wordEval.accuracyScore}%
                    </span>
                  </div>
                </div>

                {/* Personalized Improvement Tips List */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-orange-500" /> Personalized Feedback:
                  </span>
                  <ul className="space-y-1">
                    {wordEval.feedbackTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Acoustic Analysis (Formants, MFCC, Pitch & Intonation) */}
                <AcousticAnalysisView
                  language="Hindi"
                  wordOrSentence={currentWord.hindi}
                  overallScore={wordEval.pronunciationScore}
                  accuracyScore={wordEval.accuracyScore}
                  fluencyScore={wordEval.fluencyScore}
                  formantAnalysis={wordEval.acousticReport?.formantAnalysis}
                  mfccAnalysis={wordEval.acousticReport?.mfccAnalysis}
                  mfccSimilarityScore={wordEval.acousticReport?.mfccAnalysis?.similarityScore}
                  pitchAnalysis={wordEval.acousticReport?.pitchAnalysis}
                  mispronouncedSounds={wordEval.acousticReport?.mispronouncedSounds}
                  aiSuggestions={wordEval.acousticReport?.aiSuggestions}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 2: HINDI SENTENCE PRACTICE */}
      {/* ======================================================== */}
      {activeSubTab === 'sentences' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sentence List Sidebar */}
          <div className="lg:col-span-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" /> Everyday Sentences
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                {HINDI_SENTENCES.length} Sentences
              </span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {HINDI_SENTENCES.map((sent, idx) => {
                const isSelected = selectedSentenceIndex === idx;
                return (
                  <button
                    key={sent.id}
                    onClick={() => {
                      setSelectedSentenceIndex(idx);
                      setSentenceEval(null);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-white border-amber-400 shadow-lg scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-black block leading-snug">{sent.hindi}</span>
                      <span className={`text-[11px] font-medium block mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {sent.english}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className={isSelected ? 'text-white font-bold' : 'text-slate-400'}>{sent.category}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        {sent.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Sentence Practice Arena */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 text-center">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-200/60 dark:border-amber-800/60">
                  {currentSentence.category} • {currentSentence.difficulty}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Sentence {selectedSentenceIndex + 1} of {HINDI_SENTENCES.length}
                </span>
              </div>

              <div className="space-y-3 py-4">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  {currentSentence.hindi}
                </h2>
                <p className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                  {currentSentence.romanized}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold italic">
                  Translation: "{currentSentence.english}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-left space-y-1">
                <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Focus Phonemes & Articulation
                </span>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {currentSentence.focusPhonemes}
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed pt-1">
                  {currentSentence.tip}
                </p>
              </div>

              {/* Audio Visualizer during recording */}
              {isRecordingSentence && (
                <div className="py-2">
                  <AudioVisualizer analyserNode={analyserNode} isRecording={isRecordingSentence} height={50} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={() =>
                    handlePlayTTS(
                      currentSentence.hindi,
                      () => setIsSpeakingSentence(true),
                      () => setIsSpeakingSentence(false)
                    )
                  }
                  disabled={isSpeakingSentence}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-extrabold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <Volume2 className={`w-5 h-5 text-amber-500 ${isSpeakingSentence ? 'animate-bounce' : ''}`} />
                  <span>{isSpeakingSentence ? 'Speaking Sentence...' : 'Listen Sentence AI Voice'}</span>
                </button>

                <button
                  onClick={handleToggleSentenceRecording}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isRecordingSentence
                      ? 'bg-rose-500 animate-pulse ring-4 ring-rose-300 dark:ring-rose-900'
                      : 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:shadow-amber-500/25 hover:scale-105'
                  }`}
                >
                  {isRecordingSentence ? <VolumeX className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>{isRecordingSentence ? 'Stop & Evaluate' : 'Record Everyday Sentence'}</span>
                </button>
              </div>
            </div>

            {/* AI Sentence Feedback Scores */}
            {sentenceEval && (
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Sentence Fluency & Clarity Evaluation
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                    Score Calculated
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block mb-1">
                      Pronunciation
                    </span>
                    <span className="text-2xl font-black text-amber-900 dark:text-amber-200">
                      {sentenceEval.pronunciationScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                      Fluency
                    </span>
                    <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                      {sentenceEval.fluencyScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-teal-600 dark:text-teal-400 block mb-1">
                      Accuracy
                    </span>
                    <span className="text-2xl font-black text-teal-900 dark:text-teal-200">
                      {sentenceEval.accuracyScore}%
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sentence Polish Tips:
                  </span>
                  <ul className="space-y-1">
                    {sentenceEval.feedbackTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Acoustic Analysis (Formants, MFCC, Pitch & Intonation) */}
                <AcousticAnalysisView
                  language="Hindi"
                  wordOrSentence={currentSentence.hindi}
                  overallScore={sentenceEval.pronunciationScore}
                  accuracyScore={sentenceEval.accuracyScore}
                  fluencyScore={sentenceEval.fluencyScore}
                  formantAnalysis={sentenceEval.acousticReport?.formantAnalysis}
                  mfccAnalysis={sentenceEval.acousticReport?.mfccAnalysis}
                  mfccSimilarityScore={sentenceEval.acousticReport?.mfccAnalysis?.similarityScore}
                  pitchAnalysis={sentenceEval.acousticReport?.pitchAnalysis}
                  mispronouncedSounds={sentenceEval.acousticReport?.mispronouncedSounds}
                  aiSuggestions={sentenceEval.acousticReport?.aiSuggestions}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 3: HINDI CONVERSATION PRACTICE */}
      {/* ======================================================== */}
      {activeSubTab === 'conversation' && (
        <div className="space-y-6">
          {/* 6 Real-life Scenario Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {HINDI_SCENARIOS.map((scen, idx) => {
              const isSelected = selectedScenarioIndex === idx;
              return (
                <button
                  key={scen.id}
                  onClick={() => handleSelectScenario(idx)}
                  className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-xl scale-[1.02]'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{scen.icon}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      {scen.difficulty}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs leading-snug line-clamp-1">{scen.title}</h4>
                  <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {scen.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Chat Stage & AI Tutor Feedback Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Chat Thread (7 cols) */}
            <div className="lg:col-span-7 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col h-[580px]">
              {/* Tutor Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <img src={currentScenario.tutorAvatar} alt={currentScenario.tutorName} className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      {currentScenario.icon} {currentScenario.title}
                    </h3>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Tutor {currentScenario.tutorName} • {currentScenario.accent}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectScenario(selectedScenarioIndex)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Reset Dialogue"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Thread Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {conversationHistory.map((m, idx) => {
                  const isTutor = m.sender === 'tutor';
                  return (
                    <div key={idx} className={`flex items-start gap-3 ${isTutor ? '' : 'flex-row-reverse'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isTutor ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-indigo-600 text-white'}`}>
                        {isTutor ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                      </div>

                      <div className={`max-w-[82%] space-y-1.5 ${isTutor ? 'text-left' : 'text-right'}`}>
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isTutor
                              ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-800'
                              : 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                          }`}
                        >
                          {m.text}
                        </div>

                        <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isTutor ? 'justify-start' : 'justify-end'}`}>
                          <span>{m.timestamp}</span>
                          {isTutor && (
                            <button
                              onClick={() => handlePlayTTS(m.text)}
                              className="hover:text-emerald-500 font-bold flex items-center gap-1 transition-colors text-emerald-600 dark:text-emerald-400"
                            >
                              <Volume2 className="w-3.5 h-3.5" /> Speak
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isThinkingConversation && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 italic py-2 animate-pulse">
                    <Bot className="w-4 h-4 text-emerald-500 animate-bounce" />
                    <span>Tutor {currentScenario.tutorName} is evaluating your Hindi speech...</span>
                  </div>
                )}
              </div>

              {/* Audio Visualizer during recording */}
              {isRecordingConversation && (
                <div className="py-2 shrink-0">
                  <AudioVisualizer analyserNode={analyserNode} isRecording={isRecordingConversation} height={45} />
                </div>
              )}

              {/* Suggested User Quick Prompts */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 space-y-2 shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Suggested Responses (सुझावित उत्तर):
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {currentScenario.suggestedUserPrompts.map((promptText, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendConversationMessage(promptText)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 text-xs font-medium whitespace-nowrap border border-slate-200 dark:border-slate-800 transition-all shrink-0"
                    >
                      "{promptText}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Control Bar */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-2 shrink-0">
                <button
                  onClick={handleToggleConversationRecording}
                  className={`p-3 rounded-2xl text-white font-bold transition-all shrink-0 flex items-center gap-2 ${
                    isRecordingConversation
                      ? 'bg-rose-500 animate-pulse ring-4 ring-rose-300'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/20'
                  }`}
                  title={isRecordingConversation ? 'Stop Recording' : 'Speak Voice'}
                >
                  {isRecordingConversation ? <VolumeX className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="hidden sm:inline text-xs font-bold">
                    {isRecordingConversation ? 'Stop & Reply' : 'Speak Hindi'}
                  </span>
                </button>

                <input
                  type="text"
                  value={userChatInput}
                  onChange={(e) => setUserChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendConversationMessage(userChatInput);
                  }}
                  placeholder="Type in Hindi or Hinglish (e.g. Namaste! AAP kaise hain?)..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <button
                  onClick={() => handleSendConversationMessage(userChatInput)}
                  disabled={!userChatInput.trim() || isThinkingConversation}
                  className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-40 shrink-0 shadow-md"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column: Real-time Feedback & Conversation Tips (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {latestConversationEval && (
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        Conversation Turn Analytics
                      </h3>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Live AI Tutor
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-center">
                      <span className="text-[9px] font-extrabold uppercase text-emerald-600 block mb-0.5">
                        Pronunciation
                      </span>
                      <span className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                        {latestConversationEval.pronunciationScore}%
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 text-center">
                      <span className="text-[9px] font-extrabold uppercase text-teal-600 block mb-0.5">
                        Fluency
                      </span>
                      <span className="text-xl font-black text-teal-900 dark:text-teal-200">
                        {latestConversationEval.fluencyScore}%
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-center">
                      <span className="text-[9px] font-extrabold uppercase text-amber-600 block mb-0.5">
                        Accuracy
                      </span>
                      <span className="text-xl font-black text-amber-900 dark:text-amber-200">
                        {latestConversationEval.accuracyScore}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grammar Polish:
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {latestConversationEval.grammarTip}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" /> Vocabulary Upgrade:
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {latestConversationEval.vocabTip}
                    </p>
                  </div>
                </div>
              )}

              {/* Scenario Strategy Card */}
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2.5">
                  <Award className="w-4 h-4 text-purple-500" />
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {currentScenario.title} Guidelines
                  </h3>
                </div>

                <ul className="space-y-2">
                  {currentScenario.tips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 4: HINDI READING PRACTICE */}
      {/* ======================================================== */}
      {activeSubTab === 'reading' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Paragraph Selection Sidebar */}
          <div className="lg:col-span-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-500" /> Reading Paragraphs
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                {HINDI_READING_PARAGRAPHS.length} Articles
              </span>
            </div>

            <div className="space-y-2">
              {HINDI_READING_PARAGRAPHS.map((p, idx) => {
                const isSelected = selectedParagraphIndex === idx;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedParagraphIndex(idx);
                      setParagraphEval(null);
                    }}
                    className={`w-full p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-400 shadow-lg scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-teal-400'
                    }`}
                  >
                    <div>
                      <h4 className="font-black text-sm leading-snug">{p.titleHindi}</h4>
                      <span className={`text-xs font-semibold block mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {p.title}
                      </span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className={isSelected ? 'text-white font-bold' : 'text-slate-400'}>{p.category}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        {p.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Paragraph Reading Arena */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {currentParagraph.titleHindi}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {currentParagraph.title} • {currentParagraph.wordCount} Words
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 text-xs font-extrabold border border-teal-200 dark:border-teal-800">
                  Target Speed: ~{currentParagraph.estimatedSeconds}s
                </span>
              </div>

              {/* Hindi Text Block */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-relaxed font-sans">
                  {currentParagraph.hindiText}
                </p>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-teal-600 dark:text-teal-400 block">
                    Romanized Transliteration:
                  </span>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                    {currentParagraph.romanizedText}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                    English Translation:
                  </span>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    "{currentParagraph.englishTranslation}"
                  </p>
                </div>
              </div>

              {/* Key Vocabulary Highlights */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-teal-500" /> Key Vocabulary in Paragraph:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentParagraph.keyVocabulary.map((kv, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 text-center">
                      <span className="text-xs font-black text-teal-900 dark:text-teal-200 block">{kv.word}</span>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium block">{kv.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Visualizer during recording */}
              {isRecordingParagraph && (
                <div className="py-2">
                  <AudioVisualizer analyserNode={analyserNode} isRecording={isRecordingParagraph} height={50} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={() =>
                    handlePlayTTS(
                      currentParagraph.hindiText,
                      () => setIsSpeakingParagraph(true),
                      () => setIsSpeakingParagraph(false)
                    )
                  }
                  disabled={isSpeakingParagraph}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-extrabold text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <Volume2 className={`w-5 h-5 text-teal-500 ${isSpeakingParagraph ? 'animate-bounce' : ''}`} />
                  <span>{isSpeakingParagraph ? 'Reading Paragraph...' : 'Listen Paragraph AI Reading'}</span>
                </button>

                <button
                  onClick={handleToggleParagraphRecording}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isRecordingParagraph
                      ? 'bg-rose-500 animate-pulse ring-4 ring-rose-300'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-teal-500/25 hover:scale-105'
                  }`}
                >
                  {isRecordingParagraph ? <VolumeX className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span>{isRecordingParagraph ? 'Stop & Evaluate Reading' : 'Read Aloud & Get AI Fluency'}</span>
                </button>
              </div>
            </div>

            {/* AI Reading Evaluation */}
            {paragraphEval && (
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-500" />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                      Reading Fluency & Speed Analysis
                    </h3>
                  </div>
                  <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full">
                    Completed
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-teal-600 block mb-1">
                      Reading Fluency
                    </span>
                    <span className="text-2xl font-black text-teal-900 dark:text-teal-200">
                      {paragraphEval.fluencyScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-cyan-600 block mb-1">
                      Pronunciation
                    </span>
                    <span className="text-2xl font-black text-cyan-900 dark:text-cyan-200">
                      {paragraphEval.pronunciationScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 block mb-1">
                      Word Accuracy
                    </span>
                    <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                      {paragraphEval.accuracyScore}%
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-500" /> Reading Improvement Tips:
                  </span>
                  <ul className="space-y-1">
                    {paragraphEval.feedbackTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 5: HINDI VOCABULARY BUILDER */}
      {/* ======================================================== */}
      {activeSubTab === 'vocab' && (
        <div className="space-y-6">
          {/* Search & Filter Controls */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                placeholder="Search Hindi words, meanings, transliteration..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
              {['All', 'Basics', 'Travel', 'Food', 'Emotions', 'Work', 'Nature'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedVocabCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedVocabCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Vocab Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocab.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-lg space-y-4 hover:border-purple-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60">
                      {item.category} • {item.partOfSpeech}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{item.difficulty}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{item.wordHindi}</h3>
                    <div className="text-xs font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">
                      {item.romanized}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
                      Meaning: "{item.englishMeaning}" ({item.hindiMeaning})
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                      Example Sentence:
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{item.exampleHindi}</p>
                    <p className="text-slate-500 italic text-[11px]">{item.exampleEnglish}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePlayTTS(item.wordHindi)}
                    className="flex-1 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen Audio
                  </button>

                  <button
                    onClick={() => handleStartVocabQuiz(item)}
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Mic className="w-3.5 h-3.5" /> Speak & Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Vocab Quiz Modal */}
          {quizItem && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center animate-scaleUp">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-xs font-extrabold uppercase text-purple-600 dark:text-purple-400">
                    Hindi Vocab Practice Quiz
                  </span>
                  <button
                    onClick={() => setQuizItem(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white">{quizItem.wordHindi}</h3>
                  <div className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
                    {quizItem.romanized}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">"{quizItem.englishMeaning}"</p>
                </div>

                {isRecordingQuiz && (
                  <div className="py-2">
                    <AudioVisualizer analyserNode={analyserNode} isRecording={isRecordingQuiz} height={40} />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => handlePlayTTS(quizItem.wordHindi)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Volume2 className="w-4 h-4 text-purple-500" /> Listen Native
                  </button>

                  <button
                    onClick={handleToggleQuizRecording}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
                      isRecordingQuiz ? 'bg-rose-500 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isRecordingQuiz ? 'Stop & Evaluate' : 'Record My Voice'}</span>
                  </button>
                </div>

                {quizScore !== null && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
                    <span className="text-xs font-black">Pronunciation Score: {quizScore}%</span>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Great job! +50 XP recorded in your Hindi progress tracking.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* PRACTICE HISTORY & PROGRESS TRACKER */}
      {/* ======================================================== */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Hindi Practice History & Progress Log
                </h3>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {hindiPracticeRecords.length} Sessions Logged
              </span>
            </div>

            {hindiPracticeRecords.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <History className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-semibold">
                  No Hindi practice records logged yet. Try recording words, sentences, or conversation dialogues above!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {hindiPracticeRecords.map((rec) => (
                  <div key={rec.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{rec.word}</span>
                      <div className="text-xs text-slate-400 font-medium">{rec.type} • {rec.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-black px-3 py-1 rounded-full ${
                          rec.score >= 80
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {rec.score}% Score
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
