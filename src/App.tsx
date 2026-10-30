import React from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { AuthProvider } from './context/AuthContext';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './pages/HomePage';
import { CitizenScreeningPage } from './pages/CitizenScreeningPage';
import { WorkerScreeningPage } from './pages/WorkerScreeningPage';
import { ResultPage } from './pages/ResultPage';
import { FacilityDirectoryPage } from './pages/FacilityDirectoryPage';
import { FacilityDashboardPage } from './pages/FacilityDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { VoiceAssistantPage } from './pages/VoiceAssistantPage';
import { FloatingVoiceButton } from './components/voice/FloatingVoiceButton';
import { Radio, X, ArrowRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, setCurrentPage, latestSignalBadge, clearLatestSignalBadge, setSelectedVillage } = useAppState();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-body">
      
      {/* 1. Persistent Non-dismissible Safety Banner & 108 Emergency Trigger */}
      <EmergencyBanner />

      {/* 2. Top Navigation Bar */}
      <Navbar />

      {/* Auth Modal Scaffolding */}
      <AuthModal />

      {/* Floating Quick Voice Assistant Trigger Button */}
      <FloatingVoiceButton />

      {/* Real-time Dynamic Signal Toast Notification */}
      {latestSignalBadge && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-teal-500/40 animate-in slide-in-from-bottom duration-300 font-body">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">
                  Community Signal Logged
                </span>
                <p className="text-xs font-bold text-white">
                  {latestSignalBadge.village} Health Pressure Updated
                </p>
                <p className="text-[11px] text-slate-300">
                  {latestSignalBadge.category} ({latestSignalBadge.tier} tier)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearLatestSignalBadge}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                setSelectedVillage(latestSignalBadge.village);
                setCurrentPage('dashboard');
                clearLatestSignalBadge();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Village Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Route Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'voice_assistant' && <VoiceAssistantPage />}
        {currentPage === 'screening_citizen' && <CitizenScreeningPage />}
        {currentPage === 'screening_worker' && <WorkerScreeningPage />}
        {currentPage === 'result' && <ResultPage />}
        {currentPage === 'facilities' && <FacilityDirectoryPage />}
        {currentPage === 'dashboard' && <FacilityDashboardPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      {/* 4. Persistent Accessible Footer */}
      <Footer />

    </div>
  );
};


export function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <AppContent />
      </AppStateProvider>
    </AuthProvider>
  );
}

export default App;
