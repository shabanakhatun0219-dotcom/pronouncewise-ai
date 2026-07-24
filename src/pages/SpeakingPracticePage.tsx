import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Mic,
  Send,
  Volume2,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Lightbulb,
  Award,
  RefreshCw,
  Zap,
  VolumeX,
  Target,
  FileText
} from 'lucide-react';
import { TUTOR_SCENARIOS } from '../data/mockData';
import { generateAcousticReport } from '../services/acousticAnalysis';
import { TutorScenario, TutorMessage } from '../types';
import { askAITutorAPI } from '../services/api';
import { speakText, startAudioRecording, SpeechRecognizer, AudioRecorderState } from '../services/audioService';
import { useUser } from '../context/UserContext';
import { AudioVisualizer } from '../components/AudioVisualizer';

export const SpeakingPracticePage: React.FC = () => {
  const { t } = useTranslation();
  const { recordPracticeResult } = useUser();
  const [activeScenario, setActiveScenario] = useState<TutorScenario>(TUTOR_SCENARIOS[0]);

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: TUTOR_SCENARIOS[0].initialMessage,
      timestamp: 'Just now'
    }
  ]);

  const [latestFeedback, setLatestFeedback] = useState<{
    fluencyScore: number;
    confidenceScore: number;
    pronunciationScore: number;
    pronunciationCorrection: string;
    grammarCorrection: string;
    vocabSuggestion: string;
    improvementTip: string;
  }>({
    fluencyScore: 88,
    confidenceScore: 92,
    pronunciationScore: 90,
    pronunciationCorrection: 'Clean vowel duration and smooth stress cadence.',
    grammarCorrection: 'Your subject-verb agreement and sentence structure were accurate.',
    vocabSuggestion: 'Use domain-specific vocabulary to elevate phrasing.',
    improvementTip: TUTOR_SCENARIOS[0].improvementTips[0]
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recorderState, setRecorderState] = useState<AudioRecorderState | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>();
  const [isThinking, setIsThinking] = useState(false);

  const handleSelectScenario = (scen: TutorScenario) => {
    setActiveScenario(scen);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: scen.initialMessage,
        timestamp: 'Just now'
      }
    ]);
    setLatestFeedback({
      fluencyScore: 88,
      confidenceScore: 90,
      pronunciationScore: 89,
      pronunciationCorrection: 'Ready for real-time speech analysis.',
      grammarCorrection: 'Grammar polish will appear after your response.',
      vocabSuggestion: 'Vocabulary suggestions will appear after your response.',
      improvementTip: scen.improvementTips[0]
    });
  };

  const handleSendUserMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: TutorMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    // Call AI Tutor backend API
    const aiResp = await askAITutorAPI(
      textToSend,
      activeScenario.title,
      messages,
      activeScenario.accent
    );

    const aiMsg: TutorMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResp.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      grammarCorrection: aiResp.grammarCorrection,
      vocabSuggestion: aiResp.vocabSuggestion,
      pronunciationCorrection: aiResp.pronunciationCorrection,
      fluencyScore: aiResp.fluencyScore,
      confidenceScore: aiResp.confidenceScore,
      pronunciationScore: aiResp.score || 88,
      improvementTip: aiResp.improvementTip
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);

    // Update real-time turn analytics
    setLatestFeedback({
      fluencyScore: aiResp.fluencyScore || 88,
      confidenceScore: aiResp.confidenceScore || 92,
      pronunciationScore: aiResp.score || 88,
      pronunciationCorrection: aiResp.pronunciationCorrection || 'Crisp vowel production and clear consonant articulation.',
      grammarCorrection: aiResp.grammarCorrection || 'Grammatical structure was accurate and polished.',
      vocabSuggestion: aiResp.vocabSuggestion || 'Strong vocabulary usage for this scenario context.',
      improvementTip: aiResp.improvementTip || activeScenario.improvementTips[0]
    });

    const acousticReport = generateAcousticReport(userText, aiResp.score || 88, 'English');

    recordPracticeResult(activeScenario.title, aiResp.score || 88, 'AI Tutor Dialogue', {
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

    // Automatically speak AI tutor reply
    speakText(aiResp.text, activeScenario.accent);
  };

  const handleStartVoiceRecording = async () => {
    try {
      const state = await startAudioRecording((ana) => setAnalyser(ana));
      setRecorderState(state);
      setIsRecording(true);

      const recognizer = new SpeechRecognizer();
      if (recognizer.isSupported) {
        recognizer.start((transcript, isFinal) => {
          setInputMessage(transcript);
          if (isFinal) {
            handleStopVoiceRecording(transcript);
          }
        });
      }
    } catch {
      alert('Microphone permission required.');
    }
  };

  const handleStopVoiceRecording = async (overrideText?: string) => {
    if (!recorderState) return;
    setIsRecording(false);
    await recorderState.stopRecording();

    const finalText = overrideText || inputMessage;
    if (finalText.trim()) {
      handleSendUserMessage(finalText);
    }
  };

  const getAccentFlag = (accent: string) => {
    if (accent === 'UK') return '🇬🇧';
    if (accent === 'AU') return '🇦🇺';
    return '🇺🇸';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60">
          <Bot className="w-3.5 h-3.5 text-indigo-500" />
          {t('tutor.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('tutor.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Practice 5 real-life conversational scenarios with real-time pronunciation corrections, fluency ratings, grammar feedback, and AI voice dialogue.
        </p>
      </div>

      {/* 5 Real-Life Scenario Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {TUTOR_SCENARIOS.map((scen) => {
          const isSelected = activeScenario.id === scen.id;
          return (
            <button
              key={scen.id}
              onClick={() => handleSelectScenario(scen)}
              className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-indigo-500 shadow-xl scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{scen.icon}</span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {scen.difficulty}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm leading-snug mb-1 line-clamp-1">{scen.title}</h3>
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {scen.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 dark:border-slate-700/50 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <img src={scen.tutorAvatar} alt={scen.tutorName} className="w-5 h-5 rounded-full object-cover border border-white/40" />
                  <span className="font-bold">{scen.tutorName}</span>
                </div>
                <span className="font-semibold opacity-90">{scen.accent} {getAccentFlag(scen.accent)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Voice Conversation & Real-Time Feedback Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Voice Conversation & Session Transcript (7 cols) */}
        <div className="lg:col-span-7 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col h-[580px]">
          {/* Active Tutor Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-4 mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeScenario.tutorAvatar} alt={activeScenario.tutorName} className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {activeScenario.icon} {activeScenario.title}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    Tutor {activeScenario.tutorName}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> AI Voice Active
                  </span>
                  <span>•</span>
                  <span>{activeScenario.accent} Accent {getAccentFlag(activeScenario.accent)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectScenario(activeScenario)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Reset Conversation Transcript"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Session Transcript Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <div className="text-center py-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-800">
                <FileText className="w-3 h-3 text-slate-400" /> Session Transcript ({messages.length} turns)
              </span>
            </div>

            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isAi
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gradient-to-tr from-purple-600 to-blue-600 text-white'
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[82%] space-y-1.5 ${isAi ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAi
                          ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-tl-none border border-slate-200/60 dark:border-slate-800'
                          : 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                      }`}
                    >
                      {m.text}
                    </div>

                    <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isAi ? 'justify-start' : 'justify-end'}`}>
                      <span>{m.timestamp}</span>
                      {isAi && (
                        <button
                          onClick={() => speakText(m.text, activeScenario.accent)}
                          className="hover:text-indigo-500 font-bold flex items-center gap-1 transition-colors text-indigo-600 dark:text-indigo-400"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Listen AI Voice
                        </button>
                      )}
                      {m.pronunciationScore && (
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                          {m.pronunciationScore}% Accuracy
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-indigo-500 font-medium italic py-2 animate-pulse">
                <Bot className="w-4 h-4 text-indigo-500 animate-bounce" />
                <span>Tutor {activeScenario.tutorName} is evaluating your speech and generating voice response...</span>
              </div>
            )}
          </div>

          {/* Recording Visualizer bar if recording */}
          {isRecording && (
            <div className="py-2 shrink-0">
              <AudioVisualizer analyserNode={analyser} isRecording={isRecording} height={50} />
            </div>
          )}

          {/* Input Controls */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 shrink-0">
            <button
              onClick={isRecording ? () => handleStopVoiceRecording() : handleStartVoiceRecording}
              className={`p-3 sm:p-3.5 rounded-2xl text-white font-bold transition-all shrink-0 flex items-center gap-2 ${
                isRecording
                  ? 'bg-rose-500 animate-pulse ring-4 ring-rose-300 dark:ring-rose-900'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-indigo-500/20 shadow-md'
              }`}
              title={isRecording ? "Stop Recording" : "Speak with Voice"}
            >
              {isRecording ? <VolumeX className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="hidden sm:inline text-xs font-bold">
                {isRecording ? 'Stop & Evaluate' : 'Speak Voice'}
              </span>
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendUserMessage(inputMessage);
              }}
              placeholder={t('tutor.typeOrSpeak')}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={() => handleSendUserMessage(inputMessage)}
              disabled={!inputMessage.trim() || isThinking}
              className="p-3 sm:p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-40 shrink-0 shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Real-time Feedback & Analytics Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-time Performance Scores Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Real-time Speech Analytics
                </h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                Turn Analysis
              </span>
            </div>

            {/* Fluency Score & Confidence Score Dual Meters */}
            <div className="grid grid-cols-2 gap-3">
              {/* Fluency Score */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Fluency Score
                </span>
                <div className="text-2xl font-black text-indigo-900 dark:text-indigo-200">
                  {latestFeedback.fluencyScore} <span className="text-xs text-indigo-400 font-extrabold">/ 100</span>
                </div>
                <div className="w-full bg-indigo-200/60 dark:bg-indigo-900/60 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${latestFeedback.fluencyScore}%` }}
                  />
                </div>
              </div>

              {/* Confidence Score */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Confidence Score
                </span>
                <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                  {latestFeedback.confidenceScore} <span className="text-xs text-emerald-400 font-extrabold">/ 100</span>
                </div>
                <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/60 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${latestFeedback.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Real-time Pronunciation Correction Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                Real-Time Pronunciation Correction
              </span>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                {latestFeedback.pronunciationCorrection}
              </p>
            </div>
          </div>

          {/* Grammar & Vocabulary Suggestions Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-2.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Grammar & Vocabulary Feedback
              </h3>
            </div>

            {/* Grammar Polish */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Grammar Polish
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {latestFeedback.grammarCorrection}
              </p>
            </div>

            {/* Vocabulary Upgrade */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" /> Vocabulary Suggestion
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {latestFeedback.vocabSuggestion}
              </p>
            </div>
          </div>

          {/* Personalized Improvement Tips Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-700/80 pb-2.5">
              <Award className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Personalized Improvement Tips
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 space-y-2">
              <span className="text-xs font-extrabold text-purple-900 dark:text-purple-200 block">
                {activeScenario.icon} {activeScenario.title} Strategy
              </span>
              <ul className="space-y-1.5">
                {activeScenario.improvementTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-purple-800 dark:text-purple-300 flex items-start gap-1.5 leading-relaxed font-medium">
                    <span className="text-purple-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
