import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Globe, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">PronounceAI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> English US / UK
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO 27001
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">{t('footer.product')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('checker')} className="hover:text-white transition-colors">
                  {t('nav.checker')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dictionary')} className="hover:text-white transition-colors">
                  {t('nav.dictionary')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('practice')} className="hover:text-white transition-colors">
                  {t('nav.practice')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('challenges')} className="hover:text-white transition-colors">
                  {t('nav.challenges')}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">{t('footer.accountTools')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('login')} className="hover:text-white transition-colors">
                  {t('nav.login')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('register')} className="hover:text-white transition-colors">
                  {t('nav.signup')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                  {t('nav.dashboard')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('profile')} className="hover:text-white transition-colors">
                  {t('nav.profile')}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Accent */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Accents & Models</h4>
            <p className="text-xs text-slate-400 mb-3">
              Powered by Gemini AI audio & speech intelligence. Supporting Received Pronunciation (UK) and General American (US).
            </p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-300">🇺🇸 General US</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-300">🇬🇧 British RP</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 PronounceAI Technologies Inc. {t('footer.rights')}</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for confident speech
          </p>
        </div>
      </div>
    </footer>
  );
};
