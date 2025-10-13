import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from '../utils/auth';

export const useAuth = () => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    
    if (token && userData) {
      setUserState(userData);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, token } = response.data.data;
      
      setToken(token);
      setUser(userData);
      setUserState(userData);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, token } = response.data.data;
      
      setToken(token);
      setUser(newUser);
      setUserState(newUser);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.data.user;
      
      setUser(updatedUser);
      setUserState(updatedUser);
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isAdmin
  };
};
