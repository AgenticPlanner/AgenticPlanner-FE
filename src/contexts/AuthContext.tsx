import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserMe } from '@/types/api';
import { loginUser, registerUser } from '@/api/auth';
import { getMe } from '@/api/users';

interface AuthContextValue {
  user: UserMe | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 토큰 있으면 유저 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    // 이전 사용자 세션 데이터 제거 (다른 계정 노출 방지)
    sessionStorage.removeItem('agentSessionId');
    sessionStorage.removeItem('agentMessages');
    await loginUser(username, password);
    const me = await getMe();
    setUser(me);
  };

  const register = async (email: string, password: string, username: string) => {
    await registerUser(email, password, username);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
