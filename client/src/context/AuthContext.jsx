import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { signInWithGooglePopup } from '../config/firebase';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup Axios interceptor to handle access token expiry (auto renews with refresh cookie)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Exclude auth path endpoints to avoid refresh loops
        const isAuthRequest = originalRequest.url.includes('/api/auth');
        
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
          originalRequest._retry = true;
          try {
            console.log('Access token expired. Attempting token refresh...');
            const { data } = await axios.post('/api/auth/refresh');
            if (data.success) {
              setUser(data.user);
              // Retry the original request
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.warn('Refresh session expired. Logging out.');
            setUser(null);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Check login status on app mount
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const { data } = await axios.get('/api/auth/profile');
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        // Session expired or guest
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Standard password login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Standard password signup
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      if (data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Signup failed' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Trigger Firebase Google Popup and authenticate on our server
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const idToken = await signInWithGooglePopup();
      const { data } = await axios.post('/api/auth/firebase-google', { idToken });
      
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || 'Google Auth verification failed' };
    } catch (error) {
      console.error('Google Sign In Process Error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Google Authentication failed.',
      };
    } finally {
      setLoading(false);
    }
  };



  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
