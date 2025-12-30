import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const initAuth = async () => {
      try {
        const data = await authService.refreshToken();
        setAccessToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('accessToken', data.accessToken);
        console.log('Session restored from refresh token');
      } catch (error) {
        try {
          const storedUser = localStorage.getItem('user');
          const storedToken = localStorage.getItem('accessToken');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            if (storedToken) {
              setAccessToken(storedToken);
              console.log('User and token loaded from localStorage');
            } else {
              console.log('User loaded from localStorage (no token - limited session)');
            }
          }
        } catch (e) {
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    console.log('Attempting login for:', credentials.email);
    try {
      const data = await authService.login(credentials);
      console.log('Login successful:', data.user);
      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      return data;
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    console.log('Attempting registration for:', userData.email);
    try {
      const data = await authService.register(userData);
      console.log('Registration successful:', data.user);
      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      return data;
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    try {
      if (accessToken) {
        await authService.logout(accessToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      console.log('Logged out successfully');
    }
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('User updated:', updates);
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
