import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Search,
  Volume2,
  Bookmark,
  BookOpen,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import { SAMPLE_DICTIONARY } from '../data/mockData';
import { lookupDictionaryAPI } from '../services/api';
import { DictionaryEntry } from '../types';
import { speakText } from '../services/audioService';
import { useUser } from '../context/UserContext';

export const DictionaryPage: React.FC = () => {
  const { t } = useTranslation();
  const { savedWords, toggleSaveWord } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEntry, setActiveEntry] = useState<DictionaryEntry>(SAMPLE_DICTIONARY[0]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const entry = await lookupDictionaryAPI(searchQuery.trim());
    setActiveEntry(entry);
    setIsSearching(false);
  };

  const isSaved = savedWords.includes(activeEntry.word);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/60">
          <BookOpen className="w-3.5 h-3.5 text-purple-500" />
          {t('dictionary.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('dictionary.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('dictionary.subtitle')}
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('dictionary.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold text-xs shadow-md hover:shadow-purple-500/20 transition-all shrink-0"
        >
          {isSearching ? '...' : t('dictionary.searchBtn')}
        </button>
      </form>

      {/* Quick Word Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="font-semibold text-slate-400">Popular:</span>
        {SAMPLE_DICTIONARY.map((dict) => (
          <button
            key={dict.word}
            onClick={() => setActiveEntry(dict)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeEntry.word === dict.word
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {dict.word}
          </button>
        ))}
      </div>

      {/* Main Word Card */}
      <motion.div
        key={activeEntry.word}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-700/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {activeEntry.word}
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-xs">
                {activeEntry.difficulty}
              </span>
              <span className="text-xs text-slate-400 italic">
                ({activeEntry.partOfSpeech})
              </span>
            </div>

            {/* Phonetic Audio Row */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <button
                onClick={() => speakText(activeEntry.word, 'US')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>US 🇺🇸 {activeEntry.ipaUS}</span>
              </button>

              <button
                onClick={() => speakText(activeEntry.word, 'UK')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>UK 🇬🇧 {activeEntry.ipaUK}</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => toggleSaveWord(activeEntry.word)}
            className={`p-3.5 rounded-2xl border transition-all flex items-center gap-2 font-bold text-xs ${
              isSaved
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{isSaved ? 'Saved to Vocabulary' : 'Save Word'}</span>
          </button>
        </div>

        {/* Syllable Stress Map */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Syllables & Accent Stress
          </span>
          <div className="flex items-center gap-2">
            {activeEntry.syllables.map((syl, i) => {
              const isStressed = i === activeEntry.stressedSyllableIndex;
              return (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-xl text-sm font-bold font-mono transition-all ${
                    isStressed
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md ring-2 ring-purple-500/30'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isStressed ? `${syl.toUpperCase()} (Primary)` : syl}
                </div>
              );
            })}
          </div>
        </div>

        {/* Definition */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Definition
          </span>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {activeEntry.definition}
          </p>
        </div>

        {/* Example Sentences */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Example Sentences
          </span>
          <div className="space-y-2">
            {activeEntry.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300"
              >
                <span>"{ex}"</span>
                <button
                  onClick={() => speakText(ex)}
                  className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-200 transition-all shrink-0"
                  title="Listen sentence"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Synonyms & Antonyms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {activeEntry.synonyms.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400 block">Synonyms</span>
              <div className="flex flex-wrap gap-1.5">
                {activeEntry.synonyms.map((syn, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeEntry.antonyms.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400 block">Antonyms</span>
              <div className="flex flex-wrap gap-1.5">
                {activeEntry.antonyms.map((ant, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold"
                  >
                    {ant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pronunciation Trap / Tip */}
        {activeEntry.commonTrap && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-extrabold block">Common Pronunciation Trap:</strong>
              {activeEntry.commonTrap}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
