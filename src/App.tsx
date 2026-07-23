import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider, useUser } from './context/UserContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MicModal } from './components/MicModal';

import { LandingPage } from './pages/LandingPage';
import { PronunciationChecker } from './pages/PronunciationChecker';
import { DictionaryPage } from './pages/DictionaryPage';
import { SpeakingPracticePage } from './pages/SpeakingPracticePage';
import { HindiPracticePage } from './pages/HindiPracticePage';
import { AssamesePracticePage } from './pages/AssamesePracticePage';
import { DashboardPage } from './pages/DashboardPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AppContent() {
  const { isAuthenticated } = useUser();
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'checker', 'dictionary', 'practice', 'hindi', 'assamese', 'dashboard', 'challenges', 'profile', 'login', 'register'].includes(hash)) {
        return hash;
      }
    }
    return 'landing';
  });
  const [quickMicOpen, setQuickMicOpen] = useState(false);

  // Sync hash routing
  const changeTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'checker', 'dictionary', 'practice', 'hindi', 'assamese', 'dashboard', 'challenges', 'profile', 'login', 'register'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirect authenticated user away from login/register
  useEffect(() => {
    if (isAuthenticated && (activeTab === 'login' || activeTab === 'register')) {
      changeTab('dashboard');
    }
  }, [isAuthenticated, activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-500 selection:text-white font-sans antialiased">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={changeTab}
        onOpenQuickMic={() => setQuickMicOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={changeTab}
            onOpenQuickMic={() => setQuickMicOpen(true)}
          />
        )}
        {activeTab === 'checker' && <PronunciationChecker />}
        {activeTab === 'dictionary' && <DictionaryPage />}
        {activeTab === 'practice' && <SpeakingPracticePage />}
        {activeTab === 'hindi' && <HindiPracticePage />}
        {activeTab === 'assamese' && <AssamesePracticePage />}
        
        {/* Auth Pages */}
        {activeTab === 'login' && <LoginPage setActiveTab={changeTab} />}
        {activeTab === 'register' && <RegisterPage setActiveTab={changeTab} />}

        {/* Protected User-Only Pages */}
        {activeTab === 'dashboard' && (
          isAuthenticated ? (
            <DashboardPage
              setActiveTab={changeTab}
              onOpenQuickMic={() => setQuickMicOpen(true)}
            />
          ) : (
            <LoginPage setActiveTab={changeTab} />
          )
        )}
        {activeTab === 'challenges' && <ChallengesPage />}
        {activeTab === 'profile' && (
          isAuthenticated ? (
            <ProfilePage />
          ) : (
            <LoginPage setActiveTab={changeTab} />
          )
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={changeTab} />

      {/* Floating Quick Practice Mic Modal */}
      <MicModal
        isOpen={quickMicOpen}
        onClose={() => setQuickMicOpen(false)}
        initialWord="Pronunciation"
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}
