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
  CheckCircle,
  HelpCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { PitchIntonationAnalysis as PitchAnalysisType, PitchDataPoint } from '../types';

interface PitchIntonationAnalysisProps {
  analysis?: PitchAnalysisType;
  wordOrSentence?: string;
  overallScore?: number;
  pitchScore?: number;
  intonationScore?: number;
  speechRateWpm?: number;
  wordStress?: string;
  fluencyScore?: number;
  confidenceScore?: number;
  volumeLevel?: string;
}

export const PitchIntonationAnalysisView: React.FC<PitchIntonationAnalysisProps> = ({
  analysis,
  wordOrSentence = 'Target Phrase',
  overallScore = 85,
  pitchScore = 88,
  intonationScore = 82,
  speechRateWpm = 135,
  wordStress = 'Primary stress on syllable 2',
  fluencyScore = 86,
  confidenceScore = 90,
  volumeLevel = '74 dB (Optimal)'
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'highlights' | 'suggestions'>('graph');
  const [hoveredPoint, setHoveredPoint] = useState<PitchDataPoint | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  // Fallback / Normalized analysis data if analysis prop is partial or undefined
  const effectiveAnalysis: PitchAnalysisType = analysis || {
    overallScore,
    pitchScore,
    intonationScore,
    speechRateWpm,
    wordStress,
    fluencyScore,
    confidenceScore,
    volumeLevel,
    pitchData: [
      { time: '0.1s', userPitch: 165, nativePitch: 160, status: 'optimal', wordLabel: 'Pro' },
      { time: '0.3s', userPitch: 215, nativePitch: 220, status: 'optimal', wordLabel: 'NUN' },
      { time: '0.5s', userPitch: 150, nativePitch: 180, status: 'flat', wordLabel: 'ci' },
      { time: '0.7s', userPitch: 250, nativePitch: 205, status: 'too_high', wordLabel: 'a' },
      { time: '0.9s', userPitch: 125, nativePitch: 145, status: 'too_low', wordLabel: 'tion' }
    ],
    highlightedSections: [
      {
        section: "Syllable 3 ('ci-')",
        issue: 'flat',
        message: 'Pitch is too flat here. Try lifting your intonation slightly to match natural English cadence.'
      },
      {
        section: "Syllable 4 ('-a-')",
        issue: 'too_high',
        message: 'Pitch spike detected (+45Hz above native envelope). Keep vowel transition smooth.'
      },
      {
        section: "Syllable 5 ('-tion')",
        issue: 'too_low',
        message: 'Pitch dropped too sharply at the word end. Sustain vocal breath support until release.'
      }
    ],
    aiSuggestions: [
      'Increase pitch variation on key stressed syllables to sound more natural.',
      'Reduce monotone speech on transitional vowels.',
      'Stress the highlighted syllable "NUN" with clear pitch elevation.',
      'Maintain steady volume without rushing the final consonant cluster.'
    ]
  };

  const data = effectiveAnalysis.pitchData || [];
  const maxPitch = Math.max(...data.map(d => Math.max(d.userPitch, d.nativePitch)), 260);
  const minPitch = Math.min(...data.map(d => Math.min(d.userPitch, d.nativePitch)), 100);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = 40;

  const getX = (index: number) => {
    if (data.length <= 1) return svgWidth / 2;
    return padding + (index / (data.length - 1)) * (svgWidth - padding * 2);
  };

  const getY = (val: number) => {
    const range = maxPitch - minPitch || 1;
    return svgHeight - padding - ((val - minPitch) / range) * (svgHeight - padding * 2);
  };

  // Build SVG path strings
  const userPathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.userPitch)}`).join(' ');
  const nativePathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.nativePitch)}`).join(' ');

  const getStatusColor = (status: PitchDataPoint['status']) => {
    switch (status) {
      case 'flat':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      case 'too_high':
        return 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
      case 'too_low':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
      default:
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    }
  };

  const getStatusDotColor = (status: PitchDataPoint['status']) => {
    switch (status) {
      case 'flat': return '#f59e0b';
      case 'too_high': return '#f43f5e';
      case 'too_low': return '#3b82f6';
      default: return '#10b981';
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 transition-all">
      {/* Title & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Pitch & Intonation Analysis
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                AI Real-Time
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acoustic pitch contour, intonation envelope, word stress & vocal feedback for "{wordOrSentence}"
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showDetails ? 'Collapse Analysis' : 'Expand Analysis'}
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Metric Grid - 8 Key Analysis Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Overall Pronunciation Score */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/60 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Overall Score</span>
                  <Award className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {effectiveAnalysis.overallScore}%
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Target Accuracy</p>
              </div>

              {/* Pitch Score */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-slate-900 dark:to-purple-950/40 border border-purple-100 dark:border-purple-900/60 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Pitch Score</span>
                  <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400">
                  {effectiveAnalysis.pitchScore}%
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Frequency Curve Match</p>
              </div>

              {/* Intonation Score */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Intonation Score</span>
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {effectiveAnalysis.intonationScore}%
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Melodic Cadence</p>
              </div>

              {/* Speech Rate WPM */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-900 dark:to-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Speech Rate</span>
                  <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {effectiveAnalysis.speechRateWpm} <span className="text-xs font-bold text-slate-500">WPM</span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Conversational Pace</p>
              </div>

              {/* Word Stress */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-900 dark:to-amber-950/40 border border-amber-100 dark:border-amber-900/60 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Word Stress</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xs font-extrabold text-amber-700 dark:text-amber-300 truncate" title={effectiveAnalysis.wordStress}>
                  {effectiveAnalysis.wordStress}
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Syllable Emphasis</p>
              </div>

              {/* Fluency Score */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50/50 dark:from-slate-900 dark:to-cyan-950/40 border border-cyan-100 dark:border-cyan-900/60 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Fluency</span>
                  <Sliders className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                <div className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                  {effectiveAnalysis.fluencyScore}%
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Pause & Linking</p>
              </div>

              {/* Confidence Score */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/50 dark:from-slate-900 dark:to-rose-950/40 border border-rose-100 dark:border-rose-900/60 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Confidence</span>
                  <CheckCircle className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-xl font-black text-rose-600 dark:text-rose-400">
                  {effectiveAnalysis.confidenceScore}%
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Vocal Projection</p>
              </div>

              {/* Volume Level */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-slate-900 dark:to-violet-950/40 border border-violet-100 dark:border-violet-900/60 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Volume Level</span>
                  <Volume2 className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div className="text-xs font-extrabold text-violet-700 dark:text-violet-300 truncate" title={effectiveAnalysis.volumeLevel}>
                  {effectiveAnalysis.volumeLevel}
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Mic Amplitude</p>
              </div>
            </div>

            {/* View Selector Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <button
                onClick={() => setActiveTab('graph')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'graph'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Pitch Curve Graph
              </button>

              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'highlights'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" /> Pitch Highlights ({effectiveAnalysis.highlightedSections.length})
              </button>

              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'suggestions'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Suggestions ({effectiveAnalysis.aiSuggestions.length})
              </button>
            </div>

            {/* TAB 1: Pitch Contour Graph Comparison */}
            {activeTab === 'graph' && (
              <div className="space-y-4">
                <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden shadow-inner">
                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-semibold text-purple-400">
                        <span className="w-3 h-0.5 bg-purple-400 rounded-full inline-block"></span>
                        User Pitch (Hz)
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                        <span className="w-3 h-0.5 border-b border-dashed border-emerald-400 inline-block"></span>
                        Native Target Pitch (Hz)
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Optimal
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Too Flat
                      </span>
                      <span className="flex items-center gap-1 text-rose-400">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Too High
                      </span>
                      <span className="flex items-center gap-1 text-blue-400">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Too Low
                      </span>
                    </div>
                  </div>

                  {/* SVG Line Graph */}
                  <div className="relative w-full overflow-x-auto">
                    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 drop-shadow">
                      {/* Grid Lines */}
                      {[0.25, 0.5, 0.75].map((r, i) => (
                        <line
                          key={i}
                          x1={padding}
                          y1={padding + r * (svgHeight - padding * 2)}
                          x2={svgWidth - padding}
                          y2={padding + r * (svgHeight - padding * 2)}
                          stroke="#334155"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Native Target Line */}
                      <path
                        d={nativePathD}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        opacity="0.85"
                      />

                      {/* User Pitch Line */}
                      <path
                        d={userPathD}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Points */}
                      {data.map((pt, idx) => {
                        const cx = getX(idx);
                        const cy = getY(pt.userPitch);
                        const color = getStatusDotColor(pt.status);
                        return (
                          <g key={idx} className="cursor-pointer group" onMouseEnter={() => setHoveredPoint(pt)}>
                            <circle
                              cx={cx}
                              cy={cy}
                              r={hoveredPoint === pt ? "8" : "6"}
                              fill={color}
                              stroke="#0f172a"
                              strokeWidth="2"
                              className="transition-all"
                            />
                            {/* Word label at bottom */}
                            <text
                              x={cx}
                              y={svgHeight - 12}
                              fill="#94a3b8"
                              fontSize="11"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {pt.wordLabel || pt.time}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Hovered point details banner */}
                  {hoveredPoint && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between text-xs text-slate-200"
                    >
                      <span className="font-bold">
                        {hoveredPoint.wordLabel ? `Syllables/Word "${hoveredPoint.wordLabel}" (${hoveredPoint.time})` : hoveredPoint.time}
                      </span>
                      <div className="flex items-center gap-3">
                        <span>User: <strong className="text-purple-400">{hoveredPoint.userPitch} Hz</strong></span>
                        <span>Native: <strong className="text-emerald-400">{hoveredPoint.nativePitch} Hz</strong></span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(hoveredPoint.status)}`}>
                          {hoveredPoint.status.replace('_', ' ')}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Highlighted Pitch Sections */}
            {activeTab === 'highlights' && (
              <div className="space-y-3">
                {effectiveAnalysis.highlightedSections.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    No pitch irregularities detected. Your pitch contour closely matches native target speech!
                  </div>
                ) : (
                  effectiveAnalysis.highlightedSections.map((sec, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                        sec.issue === 'flat'
                          ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                          : sec.issue === 'too_high'
                          ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                          : 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                      }`}
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs">{sec.section}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/80 dark:bg-slate-900/80 border border-current">
                            {sec.issue === 'flat' ? 'Too Flat (Monotone)' : sec.issue === 'too_high' ? 'Too High (Spike)' : 'Too Low (Drop)'}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{sec.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: AI Pitch & Intonation Suggestions */}
            {activeTab === 'suggestions' && (
              <div className="space-y-3">
                {effectiveAnalysis.aiSuggestions.map((sug, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 flex items-start gap-3 text-xs text-purple-950 dark:text-purple-200"
                  >
                    <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{sug}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
