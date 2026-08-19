import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import api from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('Fingerprint'); // 'Fingerprint', 'FaceID', 'Iris'

  useEffect(() => {
    loadStoredAuth();
    checkBiometricHardware();
  }, []);

  const checkBiometricHardware = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supported = hasHardware && isEnrolled;
      setIsBiometricSupported(supported);

      if (supported) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('FaceID');
        } else {
          setBiometricType('Fingerprint');
        }
        
        const enabledSetting = await AsyncStorage.getItem('petcare_biometrics_enabled');
        setIsBiometricEnabled(enabledSetting === 'true');
      }
    } catch (e) {
      console.warn('Error checking biometric hardware:', e);
    }
  };

  const loadStoredAuth = async () => {
    try {
      // Securely load token, load user object from normal async storage
      const storedToken = await SecureStore.getItemAsync('petcare_token');
      const storedUser = await AsyncStorage.getItem('petcare_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      // Fallback to AsyncStorage if SecureStore fails
      try {
        const storedToken = await AsyncStorage.getItem('petcare_token');
        const storedUser = await AsyncStorage.getItem('petcare_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (innerErr) {
        console.error('Failed to load auth state:', innerErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeRole = (r) => {
    if (!r) return null;
    const str = r.toString().trim().toLowerCase();
    if (str.includes('super')) return 'SUPER_ADMIN';
    if (str.includes('reception') || str.includes('demor')) return 'Receptionist';
    if (str.includes('assistant')) return 'Pet Assistant';
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
    if (em.includes('assistant')) return 'Pet Assistant';
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

      if (!jwtToken) {
        return { success: false, error: 'Invalid credentials. Please check your email and password.' };
      }

      const detectedRole = detectRole(email, userData?.role);
      const userObj = userData ? { ...userData, role: detectedRole } : {
        email,
        name: getStaffName(detectedRole, email),
        role: detectedRole,
      };
      
      // Save token securely (keys must be alphanumeric + . - _ only)
      await SecureStore.setItemAsync('petcare_token', jwtToken);
      await AsyncStorage.setItem('petcare_user', JSON.stringify(userObj));

      setToken(jwtToken);
      setUser(userObj);
      return { success: true };
    } catch (error) {
      // If it's a 401/403 auth error, surface it to the user — do NOT auto-fallback
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        return { success: false, error: 'Invalid email or password. Please try again.' };
      }
      if (status === 404) {
        return { success: false, error: 'Account not found. Please check your email.' };
      }

      // Network error / backend offline → use demo fallback
      console.warn('[AuthContext] Backend offline or network error. Using demo fallback.', error?.message);
      const detectedRole = detectRole(email, null);
      const mockUser = {
        id: 1,
        name: getStaffName(detectedRole, email),
        email: email,
        role: detectedRole,
        clinicName: 'PetCare SaaS Control Platform'
      };
      const mockToken = 'mock-petcare-jwt-token';

      await SecureStore.setItemAsync('petcare_token', mockToken);
      await AsyncStorage.setItem('petcare_user', JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);
      return { success: true, isDemo: true };
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      if (!isBiometricSupported) {
        return { success: false, error: 'Biometrics not supported or enrolled on this device.' };
      }

      // Check if we have a saved token
      const storedToken = await SecureStore.getItemAsync('petcare_token');
      const storedUserStr = await AsyncStorage.getItem('petcare_user');
      
      if (!storedToken || !storedUserStr) {
        return { success: false, error: 'No credentials saved. Please log in with password first.' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate with ${biometricType === 'FaceID' ? 'Face ID' : 'Fingerprint'}`,
        fallbackLabel: 'Use PIN/Password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const storedUser = JSON.parse(storedUserStr);
        setToken(storedToken);
        setUser(storedUser);
        return { success: true };
      }

      return { success: false, error: 'Authentication failed.' };
    } catch (e) {
      console.error('Biometric authentication error:', e);
      return { success: false, error: e.message };
    }
  };

  const setBiometricPreference = async (enabled) => {
    try {
      await AsyncStorage.setItem('petcare_biometrics_enabled', enabled ? 'true' : 'false');
      setIsBiometricEnabled(enabled);
    } catch (e) {
      console.error('Failed to save biometric preference:', e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('petcare_token');
      await AsyncStorage.removeItem('petcare_user');
      setToken(null);
      setUser(null);
    } catch (e) {
      // Fallback
      try {
        await AsyncStorage.removeItem('petcare_token');
        await AsyncStorage.removeItem('petcare_user');
        setToken(null);
        setUser(null);
      } catch (innerErr) {
        console.error('Logout error:', innerErr);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isBiometricSupported,
        isBiometricEnabled,
        biometricType,
        login,
        authenticateWithBiometrics,
        setBiometricPreference,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
