import React, { useState } from 'react';
import { useAppState, PageView } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Activity, 
  User, 
  UserCheck, 
  Building2, 
  Radio, 
  Info, 
  Menu, 
  X, 
  PhoneCall,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  Mic
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, currentDayState, activeAlerts } = useAppState();
  const { user, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Count active early warning alerts in the district (backend or simulation)
  const activeAlertsCount = activeAlerts.length > 0
    ? activeAlerts.length
    : currentDayState.signals.filter(s => s.activeAlert).length;

  const navLinks: { id: PageView; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    { id: 'home', label: 'Home', icon: <Activity className="w-4 h-4" /> },
    { 
      id: 'voice_assistant', 
      label: 'Voice Assistant', 
      icon: <Mic className="w-4 h-4 text-[#0F9D8B] animate-pulse" />,
      badge: 'Voice AI',
      badgeColor: 'bg-[#0F9D8B] text-white'
    },
    { id: 'screening_citizen', label: 'Self Screen', icon: <User className="w-4 h-4" /> },
    { id: 'screening_worker', label: 'ASHA Worker', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'facilities', label: 'Facilities', icon: <Building2 className="w-4 h-4" /> },
    { 
      id: 'dashboard', 
      label: 'Health Pressure', 
      icon: <Radio className="w-4 h-4 text-teal-600" />,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount} Alert${activeAlertsCount > 1 ? 's' : ''}` : undefined,
      badgeColor: 'bg-red-600 text-white animate-pulse'
    },
    { id: 'about', label: 'About & Vision', icon: <Info className="w-4 h-4" /> }
  ];


  const handleNavClick = (pageId: PageView) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo with Custom Mark on White */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            aria-label="SwasthyaNet Home"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src="/logos/logo-white-bg.png" 
                alt="SwasthyaNet logo mark" 
                className="w-full h-full object-contain"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
                  Swasthya<span className="text-[#0F9D8B]">Net</span>
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  PSE13
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-normal hidden sm:block font-body">
                From screening individuals to protecting communities.
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer font-body ${
                    isActive 
                      ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={isActive ? 'text-teal-700' : 'text-slate-500'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Group: Auth Buttons + Call 108 Emergency + Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* User Auth Buttons (Log In & Register) */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer font-body"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-all cursor-pointer font-body"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#0F9D8B]" />
                  <span>Register</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0F9D8B] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 z-50 text-xs animate-in fade-in duration-100">
                    <div className="p-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono capitalize">{user.role} · {user.village}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Immediate Emergency 108 Action */}
            <a
              href="tel:108"
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-3 sm:px-3.5 py-2 rounded-lg shadow-sm transition-all cursor-pointer font-body"
              title="Immediate Emergency Ambulance Helpline"
            >
              <PhoneCall className="w-4 h-4 animate-bounce shrink-0" />
              <span>108</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top duration-200 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer font-body ${
                    isActive 
                      ? 'bg-teal-50 text-teal-900 border border-teal-200' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-teal-700' : 'text-slate-500'}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Auth Buttons */}
          {!user ? (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0F9D8B] text-white text-xs font-bold"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-semibold">{user.name} ({user.role})</span>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 font-bold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
