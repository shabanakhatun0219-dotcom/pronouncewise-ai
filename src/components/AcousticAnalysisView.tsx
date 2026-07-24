import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  TrendingUp,
  Volume2,
  Gauge,
  Zap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Radio,
  BarChart3,
  Flame,
  Globe
} from 'lucide-react';
import {
  FormantAnalysis,
  FormantVowelData,
  MfccAnalysis,
  MfccCoeff,
  PitchIntonationAnalysis,
  PitchDataPoint
} from '../types';

export interface AcousticAnalysisViewProps {
  language?: 'English' | 'Hindi' | 'Assamese';
  wordOrSentence?: string;
  overallScore?: number;
  accuracyScore?: number;
  fluencyScore?: number;
  confidenceScore?: number;
  pitchScore?: number;
  intonationScore?: number;
  speechRateWpm?: number;
  wordStress?: string;
  volumeLevel?: string;
  formantAnalysis?: FormantAnalysis;
  mfccAnalysis?: MfccAnalysis;
  mfccSimilarityScore?: number;
  pitchAnalysis?: PitchIntonationAnalysis;
  mispronouncedSounds?: string[];
  aiSuggestions?: string[];
}

export const AcousticAnalysisView: React.FC<AcousticAnalysisViewProps> = ({
  language = 'English',
  wordOrSentence = 'Target Phrase',
  overallScore = 86,
  accuracyScore = 88,
  fluencyScore = 85,
  confidenceScore = 90,
  pitchScore = 84,
  intonationScore = 82,
  speechRateWpm = 132,
  wordStress = 'Primary stress on syllable 1',
  volumeLevel = '74 dB (Optimal)',
  formantAnalysis,
  mfccAnalysis,
  mfccSimilarityScore,
  pitchAnalysis,
  mispronouncedSounds,
  aiSuggestions
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'formants' | 'mfcc' | 'pitch' | 'suggestions'>('overview');
  const [selectedVowel, setSelectedVowel] = useState<FormantVowelData | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Fallback defaults if props are missing
  const effectiveFormants: FormantAnalysis = formantAnalysis || {
    overallFormantScore: 88,
    needsImprovementVowels: ['/i:/'],
    vowels: [
      {
        vowel: '/i:/',
        vowelName: 'High Front Vowel',
        userF1: 320,
        targetF1: 300,
        userF2: 2240,
        targetF2: 2300,
        userF3: 2950,
        targetF3: 3000,
        score: 82,
        status: 'needs_adjustment',
        feedback: 'Spread lips wider and elevate tongue blade slightly to raise F2 frequency.'
      },
      {
        vowel: '/ɑ:/',
        vowelName: 'Low Back Vowel',
        userF1: 740,
        targetF1: 750,
        userF2: 1120,
        targetF2: 1100,
        userF3: 2580,
        targetF3: 2600,
        score: 92,
        status: 'optimal',
        feedback: 'Excellent open mouth aperture and back tongue constriction.'
      },
      {
        vowel: '/u:/',
        vowelName: 'High Back Vowel',
        userF1: 330,
        targetF1: 320,
        userF2: 820,
        targetF2: 800,
        userF3: 2210,
        targetF3: 2200,
        score: 89,
        status: 'optimal',
        feedback: 'Good lip protrusion lowering F2 properly.'
      }
    ]
  };

  const effectiveMfcc: MfccAnalysis = mfccAnalysis || {
    similarityScore: mfccSimilarityScore || 87,
    aiFeedback: `Spectral timbral profile matches native ${language} speech models with 87% cepstral correlation.`,
    phoneticDifferences: [
      'Minor C3-C5 cepstral deviation indicating slight vowel resonance variance.',
      'C1 log-energy envelope exhibits smooth vocal projection.'
    ],
    coefficients: Array.from({ length: 13 }).map((_, i) => ({
      coefficientIndex: i + 1,
      label: `C${i + 1}: ${
        i === 0 ? 'Log Energy' : i === 1 ? 'Spectral Slope' : i < 5 ? `Formant ${i - 1} Peak` : `Timbral Filter ${i + 1}`
      }`,
      userValue: parseFloat((Math.sin((i + 1) * 0.7) * 0.75).toFixed(3)),
      targetValue: parseFloat((Math.sin((i + 1) * 0.7) * 0.8).toFixed(3)),
      diff: parseFloat((Math.abs(Math.sin((i + 1) * 0.7) * 0.05)).toFixed(3))
    }))
  };

  const effectivePitch: PitchIntonationAnalysis = pitchAnalysis || {
    overallScore,
    pitchScore,
    intonationScore,
    speechRateWpm,
    wordStress,
    fluencyScore,
    confidenceScore,
    volumeLevel,
    pitchData: [
      { time: '0.1s', userPitch: 165, nativePitch: 160, status: 'optimal', wordLabel: 'Start' },
      { time: '0.3s', userPitch: 220, nativePitch: 215, status: 'optimal', wordLabel: 'Nucleus' },
      { time: '0.5s', userPitch: 150, nativePitch: 180, status: 'flat', wordLabel: 'Mid' },
      { time: '0.7s', userPitch: 245, nativePitch: 210, status: 'too_high', wordLabel: 'Release' }
    ],
    highlightedSections: [
      { section: 'Middle Syllable', issue: 'flat', message: 'Pitch is slightly flat. Elevate vocal tone by +20 Hz on stressed vowel.' }
    ],
    aiSuggestions: [
      'Vary pitch height across clauses to sound more conversational.',
      'Maintain steady airflow on sentence final vowels.'
    ]
  };

  const effectiveMispronounced = mispronouncedSounds || ['/i:/ (High Front Vowel)', 'Retroflex consonant resonance'];
  const effectiveSuggestions = aiSuggestions || [
    'Adjust jaw openness on long vowels to match target F1 frequency.',
    'Sustain a natural speech rate around 130 WPM for crisp articulation.',
    'Emphasize primary stressed syllable with both pitch height and duration.'
  ];

  // SVG Chart dimensions for 2D Vowel Space Chart (F1 vs F2)
  // F1 range: 200 Hz to 900 Hz (Y axis, inverted so low F1 = top = high vowel)
  // F2 range: 700 Hz to 2500 Hz (X axis, inverted so high F2 = left = front vowel)
  const chartW = 420;
  const chartH = 240;
  const chartPad = 40;

  const getVowelX = (f2: number) => {
    const minF2 = 700;
    const maxF2 = 2500;
    const clamped = Math.max(minF2, Math.min(maxF2, f2));
    // Inverted X: 2500 Hz on left, 700 Hz on right
    return chartW - chartPad - ((clamped - minF2) / (maxF2 - minF2)) * (chartW - chartPad * 2);
  };

  const getVowelY = (f1: number) => {
    const minF1 = 200;
    const maxF1 = 900;
    const clamped = Math.max(minF1, Math.min(maxF1, f1));
    // Inverted Y: 200 Hz on top (high vowel), 900 Hz on bottom (open vowel)
    return chartPad + ((clamped - minF1) / (maxF1 - minF1)) * (chartH - chartPad * 2);
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Acoustic Formant & MFCC Analysis
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                <Globe className="w-3 h-3" /> {language}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formants (F1, F2, F3), 13 MFCC cepstral coefficients, pitch contour & acoustic spectrum for "{wordOrSentence}"
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {isExpanded ? 'Collapse Analysis' : 'Expand Acoustic Details'}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Top Key Indicator Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                  Overall Score
                </span>
                <span className="text-xl font-black text-purple-700 dark:text-purple-300">
                  {overallScore}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Formant Match (F1-F3)
                </span>
                <span className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                  {effectiveFormants.overallFormantScore}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  MFCC Similarity
                </span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300">
                  {effectiveMfcc.similarityScore}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Pitch & Intonation
                </span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                  {pitchScore}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Speech Rate WPM
                </span>
                <span className="text-xl font-black text-amber-700 dark:text-amber-300">
                  {speechRateWpm} <span className="text-xs font-bold text-slate-500">WPM</span>
                </span>
              </div>
            </div>

            {/* Tab Navigation Controls */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Full Metrics Grid
              </button>

              <button
                onClick={() => setActiveTab('formants')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'formants'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Formant Vowel Chart (F1, F2, F3)
              </button>

              <button
                onClick={() => setActiveTab('mfcc')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'mfcc'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> MFCC Cepstral Profile (1-13)
              </button>

              <button
                onClick={() => setActiveTab('pitch')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'pitch'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Pitch & Intonation Contour
              </button>

              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'suggestions'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Feedback ({effectiveSuggestions.length})
              </button>
            </div>

            {/* TAB 1: Full Metrics Grid */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pronunciation Score</span>
                    <Award className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <div className="text-xl font-black text-purple-600 dark:text-purple-400">{overallScore}%</div>
                  <p className="text-[10px] text-slate-500">Overall Accuracy</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Accuracy Score</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{accuracyScore}%</div>
                  <p className="text-[10px] text-slate-500">Phonetic Articulation</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Fluency Score</span>
                    <Sliders className="w-3.5 h-3.5 text-cyan-500" />
                  </div>
                  <div className="text-xl font-black text-cyan-600 dark:text-cyan-400">{fluencyScore}%</div>
                  <p className="text-[10px] text-slate-500">Smooth Speech Delivery</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Confidence Score</span>
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="text-xl font-black text-rose-600 dark:text-rose-400">{confidenceScore}%</div>
                  <p className="text-[10px] text-slate-500">Vocal Power & Projection</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pitch Score</span>
                    <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <div className="text-xl font-black text-purple-600 dark:text-purple-400">{pitchScore}%</div>
                  <p className="text-[10px] text-slate-500">Frequency Curve Match</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Intonation Score</span>
                    <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{intonationScore}%</div>
                  <p className="text-[10px] text-slate-500">Melodic Rhythm</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Formant Accuracy</span>
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400">{effectiveFormants.overallFormantScore}%</div>
                  <p className="text-[10px] text-slate-500">Vowel Acoustic Resonances</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">MFCC Cepstrum</span>
                    <BarChart3 className="w-3.5 h-3.5 text-teal-500" />
                  </div>
                  <div className="text-xl font-black text-teal-600 dark:text-teal-400">{effectiveMfcc.similarityScore}%</div>
                  <p className="text-[10px] text-slate-500">Timbral Spectrum Fit</p>
                </div>
              </div>
            )}

            {/* TAB 2: Formant Analysis & 2D Vowel Chart (F1, F2, F3) */}
            {activeTab === 'formants' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* 2D Vowel Space Chart (F1 vs F2) */}
                <div className="lg:col-span-6 bg-slate-900 text-white p-5 rounded-3xl relative overflow-hidden shadow-inner flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-purple-400" /> 2D Vowel Space Chart (F1 vs F2 Plane)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        F1: Openness (Jaw) | F2: Frontness (Tongue)
                      </span>
                    </div>

                    <div className="relative w-full flex justify-center py-2">
                      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-md h-56 drop-shadow">
                        {/* Quadrant grid lines */}
                        <line x1={chartPad} y1={chartH / 2} x2={chartW - chartPad} y2={chartH / 2} stroke="#334155" strokeDasharray="4 4" />
                        <line x1={chartW / 2} y1={chartPad} x2={chartW / 2} y2={chartH - chartPad} stroke="#334155" strokeDasharray="4 4" />

                        {/* Axis Labels */}
                        <text x={chartPad + 10} y={chartPad + 12} fill="#a855f7" fontSize="10" fontWeight="bold">← FRONT (High F2)</text>
                        <text x={chartW - chartPad - 80} y={chartPad + 12} fill="#94a3b8" fontSize="10" fontWeight="bold">BACK (Low F2) →</text>
                        <text x={chartPad + 10} y={chartH - chartPad - 6} fill="#10b981" fontSize="10" fontWeight="bold">↓ OPEN JAW (High F1)</text>
                        <text x={chartPad + 10} y={chartPad + 30} fill="#60a5fa" fontSize="10" fontWeight="bold">↑ HIGH TONGUE (Low F1)</text>

                        {/* Render Vowels on Chart */}
                        {effectiveFormants.vowels.map((v, idx) => {
                          const ux = getVowelX(v.userF2);
                          const uy = getVowelY(v.userF1);
                          const tx = getVowelX(v.targetF2);
                          const ty = getVowelY(v.targetF1);
                          const isSelected = selectedVowel?.vowel === v.vowel;

                          return (
                            <g key={idx} className="cursor-pointer group" onClick={() => setSelectedVowel(v)}>
                              {/* Connection vector line from user dot to target circle */}
                              <line
                                x1={ux}
                                y1={uy}
                                x2={tx}
                                y2={ty}
                                stroke={v.status === 'optimal' ? '#10b981' : '#f43f5e'}
                                strokeWidth="2"
                                strokeDasharray="3 3"
                              />

                              {/* Target Reference Circle */}
                              <circle cx={tx} cy={ty} r="10" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.8" />
                              <circle cx={tx} cy={ty} r="3" fill="#10b981" />

                              {/* User Position Dot */}
                              <circle
                                cx={ux}
                                cy={uy}
                                r={isSelected ? "9" : "7"}
                                fill={v.status === 'optimal' ? '#38bdf8' : '#f43f5e'}
                                stroke="#0f172a"
                                strokeWidth="2"
                                className="transition-all"
                              />

                              {/* Label */}
                              <text
                                x={ux}
                                y={uy - 12}
                                fill="#ffffff"
                                fontSize="11"
                                fontWeight="black"
                                textAnchor="middle"
                              >
                                {v.vowel}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span> User Formant</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-emerald-400 inline-block"></span> Native Reference Target</span>
                    <span className="text-purple-300">Click vowel marker to inspect</span>
                  </div>
                </div>

                {/* Formant Frequency Table (F1, F2, F3 in Hz) */}
                <div className="lg:col-span-6 space-y-3">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Formant Resonances (F1, F2, F3)
                  </h4>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {effectiveFormants.vowels.map((v, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedVowel(v)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          selectedVowel?.vowel === v.vowel
                            ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-400 dark:border-purple-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-purple-600 text-white">
                              {v.vowel}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {v.vowelName}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            v.status === 'optimal'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {v.score}% Match
                          </span>
                        </div>

                        {/* Hz Grid */}
                        <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-white/80 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-100 dark:border-slate-700/60 mb-2">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-sans">F1 (Jaw Height)</span>
                            <span className="font-bold text-purple-600 dark:text-purple-400">{v.userF1} Hz</span>
                            <span className="text-[9px] text-slate-400"> (T: {v.targetF1})</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-sans">F2 (Tongue Position)</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{v.userF2} Hz</span>
                            <span className="text-[9px] text-slate-400"> (T: {v.targetF2})</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-sans">F3 (Lip Rounding)</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{v.userF3} Hz</span>
                            <span className="text-[9px] text-slate-400"> (T: {v.targetF3})</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          {v.feedback}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MFCC Analysis Heatmap (Coefficients 1-13) */}
            {activeTab === 'mfcc' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="text-sm font-black text-teal-300 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-teal-400" />
                        Mel-Frequency Cepstral Coefficients (MFCC 1-13)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Acoustic spectral envelope extraction comparing user timbral resonance against native speaker models
                      </p>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-300 font-black text-xs">
                      Similarity Score: {effectiveMfcc.similarityScore}%
                    </div>
                  </div>

                  {/* 13 Coefficient Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                    {effectiveMfcc.coefficients.map((coeff) => {
                      const matchPct = Math.max(0, Math.min(100, Math.round(100 - coeff.diff * 100)));
                      return (
                        <div key={coeff.coefficientIndex} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-extrabold text-slate-200">{coeff.label}</span>
                            <span className="font-mono text-[10px] text-teal-400 font-bold">{matchPct}% Match</span>
                          </div>

                          {/* Dual progress bar comparison */}
                          <div className="space-y-1 pt-1">
                            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden relative">
                              <div
                                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-1.5 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(10, (coeff.userValue + 1) * 50))}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                              <span>User: {coeff.userValue}</span>
                              <span>Target: {coeff.targetValue}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* MFCC Phonetic Differences & AI Cepstral Feedback */}
                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/60 space-y-2">
                  <h5 className="text-xs font-black text-teal-900 dark:text-teal-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    AI Cepstral Analysis Feedback
                  </h5>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {effectiveMfcc.aiFeedback}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-teal-200/60 dark:border-teal-900/60">
                    <span className="text-[10px] font-extrabold uppercase text-teal-700 dark:text-teal-400 block">
                      Timbral & Phonetic Observations:
                    </span>
                    {effectiveMfcc.phoneticDifferences.map((diffNote, idx) => (
                      <p key={idx} className="text-xs text-teal-900 dark:text-teal-300 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        {diffNote}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Pitch & Intonation Contour */}
            {activeTab === 'pitch' && (
              <div className="space-y-4">
                <div className="bg-slate-900 text-white p-5 rounded-3xl relative overflow-hidden shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3 border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-purple-300 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-purple-400" /> Pitch Contour Comparison (Hz)
                    </span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1 text-purple-400 font-semibold">
                        <span className="w-3 h-0.5 bg-purple-400 rounded-full inline-block"></span> User Pitch
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <span className="w-3 h-0.5 border-b border-dashed border-emerald-400 inline-block"></span> Native Target
                      </span>
                    </div>
                  </div>

                  {/* Pitch Line Graph */}
                  <div className="relative w-full overflow-x-auto">
                    <svg viewBox="0 0 500 160" className="w-full h-40">
                      {[0.3, 0.6].map((r, i) => (
                        <line key={i} x1="30" y1={r * 160} x2="470" y2={r * 160} stroke="#334155" strokeDasharray="4 4" />
                      ))}

                      {/* Native Pitch Line */}
                      <path
                        d="M 50 110 L 170 45 L 300 95 L 430 60"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />

                      {/* User Pitch Line */}
                      <path
                        d="M 50 105 L 170 50 L 300 115 L 430 40"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Pitch Dots */}
                      {effectivePitch.pitchData.map((pt, i) => {
                        const cx = 50 + i * 125;
                        return (
                          <g key={i}>
                            <circle cx={cx} cy={80 + (i % 2 === 0 ? -25 : 20)} r="6" fill="#a855f7" stroke="#0f172a" strokeWidth="2" />
                            <text x={cx} y="150" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                              {pt.wordLabel || pt.time}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Pitch Section Highlights */}
                {effectivePitch.highlightedSections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-xs block">{sec.section}</span>
                      <p className="text-xs">{sec.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Mispronounced Sounds & AI Improvement Suggestions */}
            {activeTab === 'suggestions' && (
              <div className="space-y-4">
                {/* Mispronounced Sounds */}
                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/60 space-y-2">
                  <h5 className="text-xs font-black text-rose-900 dark:text-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Mispronounced Sounds & Articulatory Traps
                  </h5>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {effectiveMispronounced.map((sound, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-extrabold text-xs shadow-sm"
                      >
                        ⚠️ {sound}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Actionable Suggestions */}
                <div className="space-y-2">
                  <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Actionable Speech Improvement Coaching
                  </h5>
                  {effectiveSuggestions.map((sug, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 flex items-start gap-3 text-xs text-purple-950 dark:text-purple-200"
                    >
                      <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
