import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Mic,
  Volume2,
  Sparkles,
  RotateCcw,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Radio,
  Sliders
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { PhonemeBreakdown } from '../components/PhonemeBreakdown';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { evaluatePronunciationAPI } from '../services/api';
import { startAudioRecording, speakText, SpeechRecognizer, AudioRecorderState } from '../services/audioService';
import { PronunciationResult } from '../types';
import { useUser } from '../context/UserContext';
import confetti from 'canvas-confetti';

export const PronunciationChecker: React.FC = () => {
  const { t } = useTranslation();
  const { toggleSaveWord, savedWords, recordPracticeResult } = useUser();
  const [inputText, setInputText] = useState('Pronunciation');
  const [accent, setAccent] = useState<'US' | 'UK'>('US');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const [isRecording, setIsRecording] = useState(false);
  const [recorderState, setRecorderState] = useState<AudioRecorderState | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>();
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);

  const presetSamples = [
    'Pronunciation',
    'Schedule',
    'Phenomenon',
    'Thoroughly',
    'Entrepreneur',
    'I would like to order a cup of coffee'
  ];

  const handleStartRecording = async () => {
    try {
      setResult(null);
      setLiveTranscript('');

      const state = await startAudioRecording((ana) => {
        setAnalyser(ana);
      });
      setRecorderState(state);
      setIsRecording(true);

      // Try browser speech recognizer
      const recognizer = new SpeechRecognizer();
      if (recognizer.isSupported) {
        recognizer.start((transcript) => {
          setLiveTranscript(transcript);
        });
      }
    } catch {
      alert('Microphone access denied. Please grant microphone permissions in your browser.');
    }
  };

  const handleStopRecording = async () => {
    if (!recorderState) return;
    setIsRecording(false);
    setIsEvaluating(true);

    await recorderState.stopRecording();

    // Use live transcript if caught, or fallback to target text
    const finalTranscript = liveTranscript || inputText;
    const res = await evaluatePronunciationAPI(inputText, finalTranscript, accent);

    setResult(res);
    setIsEvaluating(false);

    // Record practice result & update user stats automatically
    recordPracticeResult(inputText, res.overallScore, 'AI Pronunciation Check');

    if (res.overallScore >= 85) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const isSaved = savedWords.includes(inputText.trim());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          {t('checker.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('checker.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('checker.subtitle')}
        </p>
      </div>

      {/* Target Word Input Card */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('checker.inputPlaceholder')}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Accent Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setAccent('US')}
                className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                  accent === 'US'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🇺🇸 US
              </button>
              <button
                onClick={() => setAccent('UK')}
                className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                  accent === 'UK'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🇬🇧 UK
              </button>
            </div>

            {/* Native Playback */}
            <button
              onClick={() => speakText(inputText, accent, playbackSpeed)}
              className="px-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all shrink-0"
              title="Listen Native Pronunciation"
            >
              <Volume2 className="w-5 h-5" />
              <span className="hidden sm:inline">{t('checker.listen')}</span>
            </button>

            {/* Save word */}
            <button
              onClick={() => toggleSaveWord(inputText.trim())}
              className={`p-3.5 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="Bookmark Word"
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Speed Controls & Preset Tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Speed:
            </span>
            {[0.75, 1.0, 1.25].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  playbackSpeed === spd
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-400">Presets:</span>
            {presetSamples.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(preset);
                  setResult(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recording Stage & Live Waveform */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6">
        <AudioVisualizer analyserNode={analyser} isRecording={isRecording} height={90} />

        {liveTranscript && (
          <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 max-w-md mx-auto">
            Detected: "{liveTranscript}"
          </div>
        )}

        {/* Big Mic Button */}
        <div className="flex flex-col items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isEvaluating}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${
              isRecording
                ? 'bg-rose-500 ring-8 ring-rose-500/30 animate-pulse'
                : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:shadow-blue-500/30 ring-8 ring-blue-500/10'
            }`}
          >
            <Mic className="w-10 h-10" />
          </motion.button>

          <p className="text-xs font-extrabold text-slate-600 dark:text-slate-300 mt-4 uppercase tracking-wider">
            {isRecording
              ? t('checker.recordingActive')
              : isEvaluating
              ? t('checker.evaluating')
              : t('checker.tapToRecord')}
          </p>
        </div>
      </div>

      {/* Evaluation Result View */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Score Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex flex-col items-center justify-center md:border-r border-slate-200/80 dark:border-slate-700/80 pr-0 md:pr-8">
              <ScoreGauge score={result.overallScore} size={170} strokeWidth={14} sublabel="Overall Pronunciation Score" />
            </div>

            <div className="md:col-span-2 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  AI Feedback Summary
                </span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900">
                  {result.aiFeedback}
                </p>
              </div>

              {/* Score Sub-metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Clarity</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">{result.clarityScore}%</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Rhythm</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">{result.rhythmScore}%</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Intonation</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">{result.intonationScore}%</span>
                </div>
              </div>

              {/* Mouth tip notice */}
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Mouth Positioning Advice:</strong>
                  {result.mouthTip}
                </div>
              </div>
            </div>
          </div>

          {/* Phoneme Breakdown */}
          <PhonemeBreakdown
            phonemes={result.phonemes}
            syllables={result.syllables}
            stressedSyllableIndex={result.stressedSyllableIndex}
            word={result.word}
          />
        </motion.div>
      )}
    </div>
  );
};
