import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@vetcare_token');
      const storedUser = await AsyncStorage.getItem('@vetcare_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load auth state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeRole = (r) => {
    if (!r) return null;
    const str = r.toString().trim().toLowerCase();
    if (str.includes('super')) return 'SUPER_ADMIN';
    if (str.includes('reception') || str.includes('demor')) return 'Receptionist';
    if (str.includes('assistant')) return 'Vet Assistant';
    if (str.includes('manager')) return 'Manager';
    if (str.includes('admin')) return 'Admin';
    if (str.includes('doctor') || str.includes('doc')) return 'Doctor';
    return r;
  };

  const detectRole = (email, userRole) => {
    const em = (email || '').toLowerCase();
    const ur = (userRole || '').toString().toLowerCase();

    if (em.includes('superadmin') || ur.includes('super')) {
      return 'SUPER_ADMIN';
    }
    if (userRole) return normalizeRole(userRole);
    if (em.includes('reception') || em.includes('demor')) return 'Receptionist';
    if (em.includes('assistant')) return 'Vet Assistant';
    if (em.includes('manager')) return 'Manager';
    if (em.includes('admin')) return 'Admin';
    return 'Doctor';
  };

  const getStaffName = (role, email) => {
    const r = (role || '').toLowerCase();
    if (r.includes('super')) return 'Super Administrator';
    if (r.includes('reception')) return 'Barry Allen';
    if (r.includes('assistant')) return 'Kara Danvers';
    if (r.includes('manager')) return 'Bruce Wayne';
    if (r.includes('admin')) return 'Diana Prince';
    return 'Dr. Sarah Connor';
  };

  const login = async (email, password) => {
    try {
      const endpoint = email.includes('superadmin') ? '/super-admin/login' : '/auth/login';
      const response = await api.post(endpoint, { email, password });
      const payload = response.data?.data || response.data || {};
      const jwtToken = payload.token || response.data?.token;
      const userData = payload.user || response.data?.user;

      const detectedRole = detectRole(email, userData?.role);
      const userObj = userData ? { ...userData, role: detectedRole } : {
        email,
        name: getStaffName(detectedRole, email),
        role: detectedRole,
      };
      
      await AsyncStorage.setItem('@vetcare_token', jwtToken || 'demo-jwt-token');
      await AsyncStorage.setItem('@vetcare_user', JSON.stringify(userObj));

      setToken(jwtToken || 'demo-jwt-token');
      setUser(userObj);
      return { success: true };
    } catch (error) {
      // Fallback demo login for offline/testing
      const detectedRole = detectRole(email, null);
      const mockUser = {
        id: 1,
        name: getStaffName(detectedRole, email),
        email: email,
        role: detectedRole,
        clinicName: 'VetCare SaaS Control Platform'
      };
      const mockToken = 'mock-vetcare-jwt-token';

      await AsyncStorage.setItem('@vetcare_token', mockToken);
      await AsyncStorage.setItem('@vetcare_user', JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);
      return { success: true, isDemo: true };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@vetcare_token');
      await AsyncStorage.removeItem('@vetcare_user');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
