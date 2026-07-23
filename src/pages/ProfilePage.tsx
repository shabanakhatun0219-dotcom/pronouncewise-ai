import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUserAccent } = useUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('profile.subtitle')}
        </p>
      </div>

      {/* User Header Card */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-600 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
                {user.subscriptionPlan} Plan
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email} • Native {user.nativeLanguage}</p>
            <p className="text-[11px] text-slate-400">Member since {user.joinedDate}</p>
          </div>
        </div>

        {/* Target Accent Preference Picker */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center sm:text-left">
            {t('profile.targetAccent')}
          </span>
          <div className="flex gap-2">
            {(['US', 'UK', 'AU'] as const).map((acc) => (
              <button
                key={acc}
                onClick={() => updateUserAccent(acc)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  user.targetAccent === acc
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {acc === 'US' ? '🇺🇸 US' : acc === 'UK' ? '🇬🇧 UK' : '🇦🇺 AU'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
