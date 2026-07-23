import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Mic,
  Sparkles,
  ArrowRight,
  Volume2,
  Bot,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { speakText } from '../services/audioService';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onOpenQuickMic: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  onOpenQuickMic
}) => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      qKey: 'landing.faq1Q',
      aKey: 'landing.faq1A'
    },
    {
      qKey: 'landing.faq2Q',
      aKey: 'landing.faq2A'
    },
    {
      qKey: 'landing.faq3Q',
      aKey: 'landing.faq3A'
    }
  ];

  return (
    <div className="w-full space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 pb-12 overflow-hidden">
        {/* Glow backdrop shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-extrabold tracking-wide uppercase shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
            <span>{t('landing.heroTag')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto"
          >
            {t('landing.heroTitle1')}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t('landing.heroTitle2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            {t('landing.heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => setActiveTab('checker')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-extrabold text-base shadow-xl hover:shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <span>{t('landing.startFree')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenQuickMic}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-extrabold text-base border border-slate-200 dark:border-slate-700 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
            >
              <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{t('landing.tryChecker')}</span>
            </button>
          </motion.div>

          {/* Live Interactive Hero Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 max-w-3xl mx-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl relative text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Live AI Speech Assessment Demo
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                US Accent 🇺🇸
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Target Word</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">Phenomenon</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono ml-2">/fəˈnɑː.mə.nɑːn/</span>
                  </div>
                  <button
                    onClick={() => speakText('Phenomenon')}
                    className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Phoneme Accuracy</span>
                    <span className="text-emerald-500">92% Match</span>
                  </div>
                  <div className="flex gap-2">
                    {['/fə/', '/ˈnɑː/', '/mə/', '/nɑːn/'].map((ph, i) => (
                      <span
                        key={i}
                        className={`flex-1 text-center py-2 text-xs font-bold font-mono rounded-xl border ${
                          i === 1
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {ph}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  💡 "Great stress placement on the primary syllable '/ˈnɑː/'."
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <ScoreGauge score={92} size={130} strokeWidth={11} sublabel="Overall Score" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t('landing.feature1Title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            {t('landing.feature1Desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-4 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('landing.feature1Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.feature1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-4 hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('landing.feature2Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.feature2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-4 hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('landing.feature3Title')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('landing.feature3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {t('landing.faqTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('landing.faqSubtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white"
                >
                  <span>{t(faq.qKey)}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                    {t(faq.aKey)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
