import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// LoginScreen uses web-style premium glassmorphic colors (light card on dark teal/blue background)
const colors = {
  background: '#090d16',      // Deep space dark blue (web bg)
  surface: 'rgba(255, 255, 255, 0.92)', // Premium glassmorphic white card
  card: 'rgba(255, 255, 255, 0.92)',
  primary: '#0f766e',        // Web Teal
  primaryDark: '#042f2e',    // Deep Teal bg
  primaryLight: '#ccfbf1',   // Soft teal for badges/biometric
  textPrimary: '#0f172a',    // Dark slate text inside card
  textSecondary: '#475569',  // Slate gray
  textMuted: '#64748b',      // Muted label slate
  border: '#e2e8f0',         // Soft light border
  divider: '#e2e8f0',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  success: '#16a34a',
  warning: '#d97706',
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('doctor@vetcare.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { 
    login, 
    authenticateWithBiometrics, 
    isBiometricSupported, 
    isBiometricEnabled, 
    biometricType 
  } = useContext(AuthContext);

  useEffect(() => {
    // Auto-prompt biometrics if enabled on startup
    const autoBiometric = async () => {
      if (isBiometricSupported && isBiometricEnabled) {
        setTimeout(async () => {
          const res = await authenticateWithBiometrics();
          if (res.success) {
            console.log('[LoginScreen] Auto-biometric authentication successful.');
          }
        }, 1000);
      }
    };
    autoBiometric();
  }, [isBiometricSupported, isBiometricEnabled]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }
    
    // Validation Rules matching web validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Invalid email format (e.g. user@example.com)');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (!res.success) {
        // Show error from backend (wrong password, account not found, etc.)
        setErrorMsg(res.error || 'Login failed. Please check your credentials.');
      } else if (res.isDemo) {
        console.log('[LoginScreen] Backend offline. Logged in with demo fallback credentials.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authenticateWithBiometrics();
      if (!res.success) {
        setErrorMsg(res.error || 'Biometric authentication failed.');
      }
    } catch (err) {
      setErrorMsg('Biometric authentication encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Background */}
        <View style={styles.headerBackground}>
          {/* Top Left Back to Home Button */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 48, left: 16, flexDirection: 'row', alignItems: 'center', gap: 4, zIndex: 10, padding: 8 }}
            onPress={() => navigation.navigate('Landing')}
          >
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
            <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: 'bold' }}>Home</Text>
          </TouchableOpacity>

          <View style={[styles.logoCircle, { backgroundColor: 'transparent' }]}>
            <Image source={require('../../assets/icon.png')} style={{ width: 56, height: 56, borderRadius: 14, resizeMode: 'contain' }} />
          </View>
          <Text style={styles.appName}>VetCare Pro</Text>
          <Text style={styles.appTagline}>Veterinary Practice Management</Text>
        </View>

        {/* Card Form */}
        <View style={styles.cardContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to access your clinic portal</Text>

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="doctor@vetcare.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Login Action Row with Biometric Option */}
          <View style={styles.loginActionsRow}>
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {isBiometricSupported && (
              <TouchableOpacity
                style={styles.biometricBtn}
                onPress={handleBiometricLogin}
                activeOpacity={0.7}
                disabled={loading}
              >
                <MaterialCommunityIcons 
                  name={biometricType === 'FaceID' ? 'face-recognition' : 'fingerprint'} 
                  size={28} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Demo Accounts Selector */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Role Login:</Text>
            <View style={styles.demoRow}>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => setDemoUser('admin@vetcarepro.com')}
              >
                <Text style={styles.demoChipText}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => setDemoUser('manager@vetcarepro.com')}
              >
                <Text style={styles.demoChipText}>Manager</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => setDemoUser('demodoctor@gmail.com')}
              >
                <Text style={styles.demoChipText}>Doctor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => setDemoUser('demoR@gmail.com')}
              >
                <Text style={styles.demoChipText}>Receptionist</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => setDemoUser('assistant@vetcarepro.com')}
              >
                <Text style={styles.demoChipText}>Vet Assistant</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoChip, { backgroundColor: '#f3e8ff', borderColor: '#c084fc', borderWidth: 1 }]}
                onPress={() => setDemoUser('superadmin@vetcarepro.com')}
              >
                <Text style={[styles.demoChipText, { color: '#7e22ce' }]}>Super Admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Navigation Links for New Users / Landing Page */}
          <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.divider, gap: 12 }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justify: 'center',
                alignItems: 'center',
                gap: 8,
                backgroundColor: colors.primaryLight,
                paddingVertical: 12,
                borderRadius: 12,
              }}
              onPress={() => navigation.navigate('Landing')}
            >
              <Ionicons name="home-outline" size={18} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: 'bold' }}>Back to Home Page (Landing)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 4 }}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>New Clinic?</Text>
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 13 }}>Register Clinic Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerNote}>VetCare Clinic Management v1.0.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerBackground: {
    backgroundColor: colors.primaryDark,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  cardContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#f1f5f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  loginActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  loginBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  biometricBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
  },
  demoSection: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 16,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  demoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  demoChip: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  demoChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  footerNote: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 30,
  },
});
