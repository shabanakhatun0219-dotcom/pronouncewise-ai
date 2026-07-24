import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Flame,
  Zap,
  Clock,
  Award,
  Play,
  BookOpen,
  ArrowRight,
  BarChart2,
  Sparkles,
  Bookmark,
  Target,
  Mic,
  TrendingUp,
  History,
  Activity
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  onOpenQuickMic: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  onOpenQuickMic
}) => {
  const { t } = useTranslation();
  const { user, practiceHistory, savedWords, weeklyProgress } = useUser();

  const isNewUser = user.practiceSessions === 0 && user.xpPoints === 0 && user.minutesPracticedToday === 0;

  // Pitch & Intonation average calculations
  const pitchScores = practiceHistory.map(p => p.pitchScore).filter((s): s is number => typeof s === 'number');
  const avgPitchScore = pitchScores.length > 0 ? Math.round(pitchScores.reduce((a, b) => a + b, 0) / pitchScores.length) : 86;

  const intonationScores = practiceHistory.map(p => p.intonationScore).filter((s): s is number => typeof s === 'number');
  const avgIntonationScore = intonationScores.length > 0 ? Math.round(intonationScores.reduce((a, b) => a + b, 0) / intonationScores.length) : 83;

  const beginnerLessons = [
    {
      id: 'lesson-1',
      title: 'Foundational English Vowel Sounds',
      level: 'A1 Beginner',
      duration: '5 mins',
      category: 'Phonetic Fundamentals',
      actionTab: 'checker'
    },
    {
      id: 'lesson-2',
      title: 'Minimal Pairs Practice: Ship vs. Sheep',
      level: 'A1 Beginner',
      duration: '4 mins',
      category: 'Audio Contrast',
      actionTab: 'challenges'
    },
    {
      id: 'lesson-3',
      title: 'Daily Greetings & Conversational Stress',
      level: 'A1 Beginner',
      duration: '8 mins',
      category: 'AI Tutor Conversation',
      actionTab: 'practice'
    },
    {
      id: 'lesson-4',
      title: 'Assamese Learning (অসমীয়া শিকন)',
      level: 'All Levels',
      duration: '10 mins',
      category: 'Assamese Speech & Vocab',
      actionTab: 'assamese'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Level {user.level} • {user.targetAccent} Accent Target
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('dashboard.welcomeBack', { name: user.name })}
          </h1>

          <p className="text-sm text-blue-100 font-medium leading-relaxed">
            {isNewUser
              ? t('dashboard.newUserWelcome')
              : t('dashboard.activeUserMsg', { minutes: user.minutesPracticedToday })}
          </p>
        </div>

        <button
          onClick={onOpenQuickMic}
          className="px-6 py-3.5 rounded-2xl bg-white text-blue-700 font-extrabold text-xs shadow-xl hover:bg-blue-50 transition-all flex items-center gap-2.5 z-10 shrink-0"
        >
          <Play className="w-4 h-4 fill-current text-blue-600" />
          <span>{isNewUser ? t('dashboard.startFirstPractice') : t('dashboard.resumeDrill')}</span>
        </button>
      </div>

      {/* Primary 6 Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.streak')}</span>
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.streakDays} <span className="text-xs text-slate-400 font-medium">{t('dashboard.days')}</span>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate">
            {user.streakDays > 0 ? t('dashboard.activeStreak', { days: user.streakDays }) : t('dashboard.noStreak')}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-purple-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.totalXp')}</span>
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.xpPoints} <span className="text-xs text-slate-400 font-medium">XP</span>
          </div>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold truncate">
            {user.xpPoints > 0 ? `${user.xpPoints} ${t('dashboard.points')}` : `0 ${t('dashboard.points')}`}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-blue-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.practice')}</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.minutesPracticedToday} <span className="text-xs text-slate-400 font-medium">/ {user.dailyGoalMinutes}m</span>
          </div>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate">
            {user.minutesPracticedToday > 0 ? t('dashboard.goal', { percent: Math.round((user.minutesPracticedToday/user.dailyGoalMinutes)*100) }) : '0m'}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.mastered')}</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.wordsMastered}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
            {user.wordsMastered > 0 ? t('dashboard.words80') : '0'}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-indigo-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.sessions')}</span>
            <Target className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.practiceSessions || 0}
          </div>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">
            {user.practiceSessions > 0 ? 'Recorded' : '0'}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[11px] font-bold text-slate-400 uppercase">{t('dashboard.accuracy')}</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.overallScore ? `${user.overallScore}%` : '0%'}
          </div>
          <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold truncate">
            {user.overallScore > 0 ? t('dashboard.avgScore') : t('dashboard.noScore')}
          </p>
        </div>
      </div>

      {/* Pitch & Intonation Real-Time Analysis Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-purple-800/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30">
              Acoustic Pitch & Intonation Overview
            </span>
            <h3 className="text-base font-extrabold text-white">
              Pitch Match: <span className="text-purple-300">{avgPitchScore}%</span> • Intonation Cadence: <span className="text-indigo-300">{avgIntonationScore}%</span>
            </h3>
            <p className="text-xs text-purple-200/80">
              Real-time frequency contour tracking, word stress emphasis & speech rate feedback across sessions.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('checker')}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 shrink-0 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Practice Pitch Contour
        </button>
      </div>

      {/* Recommended Lessons for New & Beginner Learners */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> {t('dashboard.recommendedTitle')}
            </h3>
            <p className="text-xs text-slate-400">{t('dashboard.recommendedSubtitle', { level: user.level })}</p>
          </div>
          <button
            onClick={() => setActiveTab('checker')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {t('dashboard.exploreAll')} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {beginnerLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-blue-400 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    {lesson.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{lesson.duration}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lesson.title}</h4>
                <p className="text-[11px] text-slate-400">{lesson.category}</p>
              </div>

              <button
                onClick={() => setActiveTab(lesson.actionTab)}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> {t('dashboard.startLesson')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Progress Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-600" /> {t('dashboard.weeklyTitle')}
              </h3>
              <p className="text-xs text-slate-400">{t('dashboard.weeklySubtitle')}</p>
            </div>
            {user.overallScore > 0 ? (
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                {t('dashboard.activeProgress')}
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                {t('dashboard.freshDashboard')}
              </span>
            )}
          </div>

          {/* SVG Bar Chart */}
          <div className="flex items-end justify-between h-48 pt-6 px-2 border-b border-slate-100 dark:border-slate-700/60">
            {weeklyProgress.map((d, i) => {
              const heightPct = d.score > 0 ? (d.score / 100) * 100 : 8; // min visible bar
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.score}%
                  </div>
                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-700/50 rounded-xl h-36 flex items-end p-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`w-full rounded-lg ${
                        d.score > 0
                          ? 'bg-gradient-to-t from-blue-600 to-purple-600'
                          : 'bg-slate-200 dark:bg-slate-600/40'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.day}</span>
                </div>
              );
            })}
          </div>

          {isNewUser && (
            <p className="text-xs text-center text-slate-400 italic">
              {t('dashboard.noDataWeekly')}
            </p>
          )}
        </div>

        {/* Saved Words & Recent Activity Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity Card */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" /> {t('dashboard.recentActivity')}
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">{practiceHistory.length} Sessions</span>
            </div>

            {practiceHistory.length === 0 ? (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center space-y-3">
                <Mic className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('dashboard.noRecentActivity')}
                </p>
                <button
                  onClick={() => setActiveTab('checker')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  {t('dashboard.launchChecker')}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {practiceHistory.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.word}</span>
                        <span className="text-[10px] text-slate-400 block">{item.type} • {item.date}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold shrink-0 ${
                        item.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.score}%
                      </span>
                    </div>

                    {/* Pitch & Intonation metric pill if present */}
                    {(item.pitchScore || item.intonationScore) && (
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                        <span>Pitch: {item.pitchScore ?? 86}%</span>
                        <span>•</span>
                        <span>Intonation: {item.intonationScore ?? 83}%</span>
                        {item.speechRateWpm && <span>• {item.speechRateWpm} WPM</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Words Card */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500" /> {t('dashboard.savedWords')}
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">{savedWords.length} Saved</span>
            </div>

            {savedWords.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">
                {t('dashboard.noSavedWords')}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {savedWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
