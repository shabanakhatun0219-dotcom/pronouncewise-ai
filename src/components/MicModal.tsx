import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Volume2, Sparkles, RotateCcw } from 'lucide-react';
import { startAudioRecording, speakText, AudioRecorderState } from '../services/audioService';
import { evaluatePronunciationAPI } from '../services/api';
import { PronunciationResult } from '../types';
import { AudioVisualizer } from './AudioVisualizer';
import { ScoreGauge } from './ScoreGauge';
import confetti from 'canvas-confetti';

interface MicModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWord?: string;
  onResultSuccess?: (result: PronunciationResult) => void;
}

export const MicModal: React.FC<MicModalProps> = ({
  isOpen,
  onClose,
  initialWord = 'Pronunciation',
  onResultSuccess
}) => {
  const [word, setWord] = useState(initialWord);
  const [isRecording, setIsRecording] = useState(false);
  const [recorderState, setRecorderState] = useState<AudioRecorderState | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);

  if (!isOpen) return null;

  const handleStartRecord = async () => {
    try {
      setResult(null);
      const state = await startAudioRecording((ana) => {
        setAnalyser(ana);
      });
      setRecorderState(state);
      setIsRecording(true);
    } catch {
      alert('Microphone access denied or not available. Please allow mic permissions.');
    }
  };

  const handleStopRecord = async () => {
    if (!recorderState) return;
    setIsRecording(false);
    setIsEvaluating(true);

    await recorderState.stopRecording();

    // Call API for analysis
    const evalData = await evaluatePronunciationAPI(word, word);
    setResult(evalData);
    setIsEvaluating(false);

    if (evalData.overallScore >= 85) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    if (onResultSuccess) {
      onResultSuccess(evalData);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50">
              <Sparkles className="w-3.5 h-3.5" />
              AI Voice Assessment
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              Practice Pronunciation
            </h2>
          </div>

          {/* Word Input & Speaker */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-5 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Type word or phrase..."
              className="bg-transparent font-bold text-xl text-slate-900 dark:text-white focus:outline-none w-full"
            />
            <button
              onClick={() => speakText(word)}
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shrink-0 ml-2"
              title="Listen Native Pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Live Waveform or Score Output */}
          {!result ? (
            <div className="flex flex-col items-center justify-center py-4">
              <AudioVisualizer analyserNode={analyser} isRecording={isRecording} height={80} />

              {/* Big Animated Mic Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? handleStopRecord : handleStartRecord}
                disabled={isEvaluating}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                  isRecording
                    ? 'bg-rose-500 ring-8 ring-rose-500/30 animate-pulse'
                    : 'bg-gradient-to-tr from-blue-600 to-purple-600 hover:shadow-blue-500/25 ring-8 ring-blue-500/10'
                }`}
              >
                <Mic className="w-8 h-8" />
              </motion.button>

              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-3">
                {isRecording ? 'Click to stop & analyze' : isEvaluating ? 'Evaluating with AI...' : 'Tap mic and speak phrase'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2 space-y-4">
              <ScoreGauge score={result.overallScore} size={140} strokeWidth={12} />

              <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                {result.aiFeedback}
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
