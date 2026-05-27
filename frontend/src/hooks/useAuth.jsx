// 로그인 상태 전역 관리
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작할 때 토큰 있으면 자동 로그인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    authAPI.me()
      .then(res => setUser(res.data))
      .catch(()  => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await authAPI.login({ username, password });
    localStorage.setItem('token', res.data.token);
    setUser({ username: res.data.username });
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const register = useCallback(async (username, password, password2) => {
    const res = await authAPI.register({ username, password, password2 });
    localStorage.setItem('token', res.data.token);
    setUser({ username: res.data.username });
    return res.data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);