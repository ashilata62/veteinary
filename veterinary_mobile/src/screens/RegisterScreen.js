import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ExpoClipboard from 'expo-clipboard';
import api from '../config/api';

const darkTheme = {
  bg: '#0b1329',
  cardBg: '#111c38',
  cardBorder: '#1e2d54',
  primary: '#14b8a6',
  primaryDark: '#0d9488',
  primaryLight: '#2dd4bf',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  badgeBg: '#1e293b',
  gold: '#f59e0b',
  danger: '#ef4444',
  success: '#10b981',
  inputBg: '#0f172a',
};

const PLAN_SPECS = {
  'free-trial': {
    key: 'free-trial',
    name: 'Free Trial',
    price: '₹0',
    cycle: 'for 7 Days',
    badge: '7-Day Free Trial',
    btnText: 'Start 7-Day Free Trial',
    features: [
      'Full platform feature access',
      'Up to 7 days free usage',
      'No credit card required',
      'Digital patient & medical records',
    ],
  },
  starter: {
    key: 'starter',
    name: 'Starter Plan',
    price: '₹599',
    cycle: 'per month',
    badge: 'Starter',
    btnText: 'Proceed with Starter Plan',
    features: [
      'Basic clinic management',
      'Up to 100 active pets',
      'Email appointment reminders',
      'Billing & POS invoice creation',
    ],
  },
  standard: {
    key: 'standard',
    name: 'Standard Plan',
    price: '₹799',
    cycle: 'per month',
    badge: 'Most Popular',
    btnText: 'Proceed with Standard Plan',
    features: [
      'Complete features for growing clinics',
      'Up to 500 active pets',
      'WhatsApp + Email reminders',
      'Pharmacy & Inventory tracking',
    ],
  },
  pro: {
    key: 'pro',
    name: 'Pro Plan',
    price: '₹1,299',
    cycle: 'per month',
    badge: 'Unlimited',
    btnText: 'Proceed with Pro Plan',
    features: [
      'Advanced multi-clinic management',
      'Unlimited active pet records',
      'Custom reports & analytics',
      'Priority 24/7 dedicated support',
    ],
  },
  custom: {
    key: 'custom',
    name: 'Custom Plan',
    price: 'Custom',
    cycle: 'tailored pricing',
    badge: 'Enterprise',
    btnText: 'Request Custom Plan',
    features: [
      'SaaS with full customization',
      'Personal domain & branding',
      'AI & automation features',
      'Dedicated account manager',
    ],
  },
};

export default function RegisterScreen({ navigation, route }) {
  const initialPlan = route.params?.plan || 'free-trial';
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);

  useEffect(() => {
    if (route.params?.plan && PLAN_SPECS[route.params.plan]) {
      setSelectedPlan(route.params.plan);
    }
  }, [route.params?.plan]);

  const [formData, setFormData] = useState({
    clinicName: '',
    adminName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, fieldName) => {
    try {
      await ExpoClipboard.setStringAsync(String(text));
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      Alert.alert('Copied', String(text));
    }
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: darkTheme.textMuted, percent: '0%' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[@$!%*?&]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: darkTheme.danger, percent: '33%' };
    if (score === 3 || score === 4) return { score: 2, label: 'Medium', color: darkTheme.gold, percent: '66%' };
    return { score: 3, label: 'Strong', color: darkTheme.success, percent: '100%' };
  };

  const passStrength = getPasswordStrength(formData.password);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'clinicName':
        if (!value.trim()) error = 'Clinic name is required';
        else if (value.trim().length < 3) error = 'Min 3 characters required';
        break;
      case 'adminName':
        if (!value.trim()) error = 'Admin full name is required';
        else if (value.trim().length < 3) error = 'Min 3 characters required';
        break;
      case 'email':
        if (!value.trim()) error = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = 'Enter a valid email address';
        break;
      case 'mobile':
        const cleanMob = value.replace(/[^0-9]/g, '');
        if (!value.trim()) error = 'Mobile number is required';
        else if (cleanMob.length < 10) error = 'Enter at least 10-digit mobile number';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Min 8 characters required';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          error = 'Must include uppercase, lowercase, number & special symbol';
        }
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));

    if (name === 'password' && formData.confirmPassword) {
      if (formData.confirmPassword !== value) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleRegister = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Validation Error', 'Please fix the errors in the form before submitting.');
      return;
    }

    setLoading(true);

    const payload = {
      businessName: formData.clinicName.trim(),
      adminName: formData.adminName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.replace(/[^0-9]/g, ''),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      selectedPlan,
    };

    try {
      const res = await api.post('/auth/register', payload);
      setLoading(false);

      if (res.data && res.data.status === 'success') {
        const respData = res.data.data;
        setSuccessData({
          email: respData.email || formData.email,
          adminId: respData.adminId || `ADM-${Math.floor(100000 + Math.random() * 900000)}`,
          tenantId: respData.tenantId || 'TEN-C7A2E88A-93F4-4B51-B827',
          businessName: respData.businessName || formData.clinicName,
          adminName: respData.adminName || formData.adminName,
          planName: PLAN_SPECS[selectedPlan]?.name || 'Free Trial',
        });
        setShowSuccessModal(true);
      } else {
        Alert.alert('Registration Failed', res.data.message || 'Something went wrong.');
      }
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Network error occurred.';
      Alert.alert('Registration Failed', msg);
    }
  };

  const currentPlan = PLAN_SPECS[selectedPlan] || PLAN_SPECS['free-trial'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Clinic Registration</Text>
          <Text style={styles.headerSub}>Create your PetCare Pro account</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
          
          {/* PLAN SELECTION TABS */}
          <Text style={styles.sectionLabel}>SELECT YOUR PLAN</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plansScroll}
          >
            {Object.values(PLAN_SPECS).map((plan) => {
              const isSelected = selectedPlan === plan.key;
              return (
                <TouchableOpacity
                  key={plan.key}
                  style={[
                    styles.planTabCard,
                    isSelected && styles.planTabCardActive,
                  ]}
                  onPress={() => setSelectedPlan(plan.key)}
                  activeOpacity={0.8}
                >
                  {plan.badge === 'Most Popular' && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>POPULAR</Text>
                    </View>
                  )}
                  <Text style={[styles.planTabName, isSelected && { color: darkTheme.primary }]}>
                    {plan.name}
                  </Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planTabPrice}>{plan.price}</Text>
                    <Text style={styles.planTabCycle}>{plan.cycle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* SELECTED PLAN FEATURES PREVIEW */}
          <View style={styles.planDetailsCard}>
            <View style={styles.planHeaderRow}>
              <Ionicons name="shield-checkmark" size={20} color={darkTheme.primary} />
              <Text style={styles.planDetailsTitle}>{currentPlan.name} Included Features:</Text>
            </View>
            {currentPlan.features.map((feat, idx) => (
              <View key={idx} style={styles.planFeatItem}>
                <Ionicons name="checkmark-circle" size={16} color={darkTheme.primary} />
                <Text style={styles.planFeatText}>{feat}</Text>
              </View>
            ))}
          </View>

          {/* REGISTRATION FORM */}
          <Text style={styles.sectionLabel}>CLINIC & ADMIN DETAILS</Text>

          {/* Clinic Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Clinic / Business Name *</Text>
            <View style={[styles.inputBox, errors.clinicName ? styles.inputError : null]}>
              <MaterialCommunityIcons name="office-building" size={20} color={darkTheme.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. City Pet Hospital & Clinic"
                placeholderTextColor={darkTheme.textMuted}
                value={formData.clinicName}
                onChangeText={(val) => handleChange('clinicName', val)}
              />
            </View>
            {errors.clinicName ? <Text style={styles.errorText}>{errors.clinicName}</Text> : null}
          </View>

          {/* Admin Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Admin Full Name *</Text>
            <View style={[styles.inputBox, errors.adminName ? styles.inputError : null]}>
              <Ionicons name="person-outline" size={20} color={darkTheme.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Dr. Rahul Sharma"
                placeholderTextColor={darkTheme.textMuted}
                value={formData.adminName}
                onChangeText={(val) => handleChange('adminName', val)}
              />
            </View>
            {errors.adminName ? <Text style={styles.errorText}>{errors.adminName}</Text> : null}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={[styles.inputBox, errors.email ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={20} color={darkTheme.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. doctor@cityvet.com"
                placeholderTextColor={darkTheme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(val) => handleChange('email', val)}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Mobile */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number *</Text>
            <View style={[styles.inputBox, errors.mobile ? styles.inputError : null]}>
              <Ionicons name="call-outline" size={20} color={darkTheme.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 9876543210"
                placeholderTextColor={darkTheme.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.mobile}
                onChangeText={(val) => handleChange('mobile', val)}
              />
            </View>
            {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={[styles.inputBox, errors.password ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={20} color={darkTheme.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={darkTheme.textMuted}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(val) => handleChange('password', val)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={darkTheme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            {formData.password ? (
              <View style={styles.strengthBox}>
                <View style={styles.strengthBarBg}>
                  <View style={[styles.strengthBarFill, { width: passStrength.percent, backgroundColor: passStrength.color }]} />
                </View>
                <Text style={[styles.strengthLabel, { color: passStrength.color }]}>
                  Strength: {passStrength.label}
                </Text>
              </View>
            ) : null}
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={[styles.inputBox, errors.confirmPassword ? styles.inputError : null]}>
              <Ionicons name="shield-outline" size={20} color={darkTheme.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={darkTheme.textMuted}
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(val) => handleChange('confirmPassword', val)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={darkTheme.textSecondary} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>{currentPlan.btnText}</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          {/* ALREADY HAVE ACCOUNT */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already registered your clinic?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}> Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* SUCCESS CREDENTIALS MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={48} color={darkTheme.success} />
            </View>

            <Text style={styles.modalTitle}>Registration Successful!</Text>
            <Text style={styles.modalSub}>
              Your clinic account has been created successfully under the <Text style={{ fontWeight: 'bold', color: darkTheme.primary }}>{successData?.planName}</Text>.
            </Text>

            <View style={styles.credentialsBox}>
              <View style={styles.credRow}>
                <Text style={styles.credKey}>Clinic Name:</Text>
                <Text style={styles.credVal}>{successData?.businessName}</Text>
              </View>
              <View style={styles.credRow}>
                <Text style={styles.credKey}>Admin Name:</Text>
                <Text style={styles.credVal}>{successData?.adminName}</Text>
              </View>

              {/* Copyable: Email */}
              <View style={styles.credRow}>
                <Text style={styles.credKey}>Email / Username:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <Text style={[styles.credVal, { flex: 1 }]}>{successData?.email}</Text>
                  <TouchableOpacity onPress={() => copyToClipboard(successData?.email, 'email')}>
                    <Ionicons
                      name={copiedField === 'email' ? 'checkmark-circle' : 'copy-outline'}
                      size={18}
                      color={copiedField === 'email' ? darkTheme.success : darkTheme.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Copyable: Admin ID */}
              <View style={styles.credRow}>
                <Text style={styles.credKey}>Admin ID:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <Text style={[styles.credVal, { color: darkTheme.primary, fontWeight: 'bold', flex: 1 }]}>{successData?.adminId}</Text>
                  <TouchableOpacity onPress={() => copyToClipboard(successData?.adminId, 'adminId')}>
                    <Ionicons
                      name={copiedField === 'adminId' ? 'checkmark-circle' : 'copy-outline'}
                      size={18}
                      color={copiedField === 'adminId' ? darkTheme.success : darkTheme.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Copyable: Tenant ID */}
              <View style={styles.credRow}>
                <Text style={styles.credKey}>Tenant ID:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <Text style={[styles.credVal, { fontSize: 11, color: darkTheme.textSecondary, flex: 1 }]}>{successData?.tenantId}</Text>
                  <TouchableOpacity onPress={() => copyToClipboard(successData?.tenantId, 'tenantId')}>
                    <Ionicons
                      name={copiedField === 'tenantId' ? 'checkmark-circle' : 'copy-outline'}
                      size={18}
                      color={copiedField === 'tenantId' ? darkTheme.success : darkTheme.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.modalDoneBtnText}>Proceed to Admin Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: darkTheme.bg,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.cardBorder,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: darkTheme.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginTop: 2,
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: darkTheme.primary,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  plansScroll: {
    gap: 12,
    paddingTop: 14,
    paddingBottom: 12,
  },
  planTabCard: {
    width: 145,
    backgroundColor: darkTheme.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: darkTheme.cardBorder,
    position: 'relative',
    marginTop: 4,
  },
  planTabCardActive: {
    borderColor: darkTheme.primary,
    backgroundColor: '#122544',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 8,
    backgroundColor: darkTheme.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 10,
    elevation: 4,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  planTabName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planTabPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planTabCycle: {
    fontSize: 10,
    color: darkTheme.textSecondary,
  },
  planDetailsCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    marginBottom: 20,
    gap: 8,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  planDetailsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  planFeatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planFeatText: {
    fontSize: 12,
    color: darkTheme.textSecondary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.inputBg,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputError: {
    borderColor: darkTheme.danger,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    color: darkTheme.danger,
    fontSize: 11,
    marginTop: 4,
  },
  strengthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  strengthBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: darkTheme.cardBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: darkTheme.primary,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: darkTheme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: darkTheme.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: darkTheme.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: darkTheme.cardBg,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  successIconCircle: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  credentialsBox: {
    width: '100%',
    backgroundColor: darkTheme.inputBg,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    marginBottom: 20,
  },
  credRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  credKey: {
    fontSize: 12,
    color: darkTheme.textMuted,
  },
  credVal: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  modalDoneBtn: {
    width: '100%',
    backgroundColor: darkTheme.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDoneBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
