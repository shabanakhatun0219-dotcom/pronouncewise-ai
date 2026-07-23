import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Flame,
  Zap,
  Volume2,
  Mic,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Target
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Challenge } from '../types';
import { speakText, startAudioRecording, AudioRecorderState } from '../services/audioService';
import { evaluatePronunciationAPI } from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';
import { ACHIEVEMENTS } from '../data/mockData';
import confetti from 'canvas-confetti';

export const ChallengesPage: React.FC = () => {
  const { t } = useTranslation();
  const { challenges, completeChallenge } = useUser();
  const [activeTab, setActiveTab] = useState<'twisters' | 'minimal' | 'sentences' | 'badges'>('twisters');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recorderState, setRecorderState] = useState<AudioRecorderState | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalScore, setEvalScore] = useState<number | null>(null);

  const twisters = challenges.filter(c => c.type === 'tongue_twister');
  const minimalPairs = challenges.filter(c => c.type === 'minimal_pair');
  const sentences = challenges.filter(c => c.type === 'sentence');

  const handleStartChallengeRecord = async () => {
    if (!selectedChallenge) return;
    try {
      setEvalScore(null);
      const state = await startAudioRecording();
      setRecorderState(state);
      setIsRecording(true);
    } catch {
      alert('Microphone permission required.');
    }
  };

  const handleStopChallengeRecord = async () => {
    if (!recorderState || !selectedChallenge) return;
    setIsRecording(false);
    setIsEvaluating(true);

    await recorderState.stopRecording();

    const res = await evaluatePronunciationAPI(selectedChallenge.content, selectedChallenge.content);
    setEvalScore(res.overallScore);
    setIsEvaluating(false);

    if (res.overallScore >= selectedChallenge.targetScore) {
      completeChallenge(selectedChallenge.id, res.overallScore);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          {t('challenges.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('challenges.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('challenges.subtitle')}
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('twisters')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'twisters' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t('challenges.twisters')}
          </button>
          <button
            onClick={() => setActiveTab('minimal')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'minimal' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t('challenges.minimalPairs')}
          </button>
          <button
            onClick={() => setActiveTab('sentences')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'sentences' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t('challenges.sentences')}
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'badges' ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t('challenges.badges')}
          </button>
        </div>
      </div>

      {/* Challenges List */}
      {activeTab !== 'badges' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTab === 'twisters' ? twisters : activeTab === 'minimal' ? minimalPairs : sentences).map((ch) => (
            <div
              key={ch.id}
              className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    {ch.difficulty} • Target {ch.targetScore}%
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Zap className="w-3.5 h-3.5 fill-current" /> +{ch.xpReward} XP
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{ch.title}</h3>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                    "{ch.content}" {ch.secondaryContent && ` vs "${ch.secondaryContent}"`}
                  </p>
                  {ch.ipa && <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">{ch.ipa}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  onClick={() => speakText(ch.content)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
                  title="Listen Example"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setEvalScore(null);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all ${
                    ch.completed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105'
                  }`}
                >
                  {ch.completed ? `Passed (${ch.userBestScore}%)` : 'Start Drill'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Badges & Achievements Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border shadow-lg text-center space-y-3 ${
                ach.unlocked
                  ? 'bg-white dark:bg-slate-800 border-amber-300/80 dark:border-amber-700/80'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md ${
                  ach.unlocked
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                    : 'bg-slate-400 dark:bg-slate-700'
                }`}
              >
                {ach.unlocked ? <Award className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
              </div>

              <h3 className="text-sm font-black text-slate-900 dark:text-white">{ach.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{ach.description}</p>

              {ach.unlocked && (
                <span className="inline-block text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                  Unlocked {ach.unlockedAt}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Interactive Challenge Modal */}
      {selectedChallenge && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-center"
            >
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  {selectedChallenge.type.replace('_', ' ')}
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedChallenge.title}
                </h2>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200 italic mt-3 font-serif">
                  "{selectedChallenge.content}"
                </p>
              </div>

              {evalScore === null ? (
                <div className="space-y-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={isRecording ? handleStopChallengeRecord : handleStartChallengeRecord}
                    disabled={isEvaluating}
                    className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white shadow-xl transition-all ${
                      isRecording ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </motion.button>
                  <p className="text-xs text-slate-500">
                    {isRecording ? 'Recording... speak phrase clearly' : isEvaluating ? 'Evaluating...' : 'Tap mic and recite phrase'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ScoreGauge score={evalScore} size={140} strokeWidth={12} />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {evalScore >= selectedChallenge.targetScore
                      ? '🎉 Target passed! You earned XP!'
                      : 'Nice try! Try again to hit the target score.'}
                  </p>
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};
