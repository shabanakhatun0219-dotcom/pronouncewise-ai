import React from 'react';
import { Phoneme } from '../types';
import { CheckCircle2, AlertCircle, Volume2, Info } from 'lucide-react';
import { speakText } from '../services/audioService';

interface PhonemeBreakdownProps {
  phonemes: Phoneme[];
  syllables?: string[];
  stressedSyllableIndex?: number;
  word: string;
}

export const PhonemeBreakdown: React.FC<PhonemeBreakdownProps> = ({
  phonemes,
  syllables,
  stressedSyllableIndex = 0,
  word
}) => {
  return (
    <div className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Phonetic & Mouth Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            IPA Breakdown & Phoneme Accuracy
          </p>
        </div>

        <button
          onClick={() => speakText(word)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-xl transition-all"
        >
          <Volume2 className="w-4 h-4" />
          Play Word
        </button>
      </div>

      {/* Syllable Stress Display */}
      {syllables && syllables.length > 0 && (
        <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Syllable Structure:
          </div>
          <div className="flex items-center gap-1.5">
            {syllables.map((syll, idx) => {
              const isStressed = idx === stressedSyllableIndex;
              return (
                <span
                  key={idx}
                  className={`px-2.5 py-1 text-sm font-semibold rounded-lg transition-all ${
                    isStressed
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isStressed ? syll.toUpperCase() : syll}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Phonemes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {phonemes.map((ph, idx) => {
          const isHigh = ph.score >= 80;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isHigh
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                    {ph.symbol}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                    {ph.type}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {isHigh ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span
                    className={`text-xs font-extrabold ${
                      isHigh ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {ph.score}%
                  </span>
                </div>
              </div>

              {ph.tip && (
                <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-xs text-slate-600 dark:text-slate-300">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{ph.tip}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
