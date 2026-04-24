import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Decode token to get basic info quickly
          const decoded = jwtDecode(token);
          
          // Verify with backend if needed, or just trust the token structure temporarily
          setUser({ id: decoded.id, role: decoded.role });
        } catch (error) {
          console.error('Invalid token during init');
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, user: userData } = response.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
