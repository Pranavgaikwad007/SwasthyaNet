import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  role: 'citizen' | 'worker' | 'facility_admin';
  village: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (emailOrPhone: string, password?: string) => Promise<boolean>;
  register: (name: string, emailOrPhone: string, role: 'citizen' | 'worker', village: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'swasthyanet_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (emailOrPhone: string): Promise<boolean> => {
    const isWorker = emailOrPhone.toLowerCase().includes('asha') || emailOrPhone.toLowerCase().includes('worker');
    const name = emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Community Member';
    const role: 'citizen' | 'worker' = isWorker ? 'worker' : 'citizen';
    const village = 'Rampur';

    const newUser: UserProfile = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name,
      emailOrPhone,
      role,
      village,
      isLoggedIn: true
    };
    setUser(newUser);
    setIsAuthModalOpen(false);

    // Notify backend -> records a login alert and may send an email to the configured recipient
    try {
      await api.notifyLogin({
        name,
        email_or_phone: emailOrPhone,
        role,
        village,
        login_method: 'Email/Password Login'
      });
    } catch (e) {
      console.warn('Login notification dispatch:', e);
    }

    return true;
  };

  const register = async (name: string, emailOrPhone: string, role: 'citizen' | 'worker', village: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name,
      emailOrPhone,
      role,
      village,
      isLoggedIn: true
    };
    setUser(newUser);
    setIsAuthModalOpen(false);

    // Notify backend -> records a login alert and may send an email to the configured recipient
    try {
      await api.notifyLogin({
        name,
        email_or_phone: emailOrPhone,
        role,
        village,
        login_method: 'New User Registration'
      });
    } catch (e) {
      console.warn('Registration notification dispatch:', e);
    }

    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr_g_${Date.now().toString().slice(-6)}`,
      name: 'Google Verified User',
      emailOrPhone: 'user.swasthyanet@gmail.com',
      role: 'citizen',
      village: 'Rampur',
      isLoggedIn: true
    };
    setUser(newUser);
    setIsAuthModalOpen(false);

    // Notify backend -> records a login alert and may send an email to the configured recipient
    try {
      await api.notifyLogin({
        name: newUser.name,
        email_or_phone: newUser.emailOrPhone,
        role: newUser.role,
        village: newUser.village,
        login_method: 'Google OAuth Sign-In'
      });
    } catch (e) {
      console.warn('Google login notification dispatch:', e);
    }

    return true;
  };

  const loginWithOtp = async (phone: string, otp: string): Promise<boolean> => {
    if (!otp || otp.length < 4) return false;
    const name = `User (+91 ${phone.slice(-4)})`;
    const newUser: UserProfile = {
      id: `usr_otp_${Date.now().toString().slice(-6)}`,
      name,
      emailOrPhone: phone,
      role: 'citizen',
      village: 'Rampur',
      isLoggedIn: true
    };
    setUser(newUser);
    setIsAuthModalOpen(false);

    // Notify backend -> records a login alert and may send an email to the configured recipient
    try {
      await api.notifyLogin({
        name,
        email_or_phone: phone,
        role: 'citizen',
        village: 'Rampur',
        login_method: 'Phone OTP Verification'
      });
    } catch (e) {
      console.warn('OTP login notification dispatch:', e);
    }

    return true;
  };

  const logout = () => {
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        loginWithOtp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
