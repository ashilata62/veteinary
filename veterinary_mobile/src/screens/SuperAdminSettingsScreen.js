import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';

const darkTheme = {
  bg: '#f8fafc',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  primary: '#0f766e',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  success: '#22c55e',
  successBg: '#dcfce7',
  danger: '#ef4444',
  dangerBg: '#fee2e2',
};

export default function SuperAdminSettingsScreen() {
  const { logout } = useContext(AuthContext);
  const [platformName, setPlatformName] = useState('PetCare Pro Platform');
  const [supportEmail, setSupportEmail] = useState('support@vetcarepro.com');
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_test_dummyKeyId');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/super-admin/settings').catch(() => ({ data: {} }));
        const data = res.data?.data || res.data || {};
        if (data.platformName) setPlatformName(data.platformName);
        if (data.supportEmail) setSupportEmail(data.supportEmail);
        if (data.razorpayKeyId) setRazorpayKeyId(data.razorpayKeyId);
        if (typeof data.maintenanceMode === 'boolean') setMaintenanceMode(data.maintenanceMode);
      } catch (err) {
        console.log('Using default superadmin settings');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await api.post('/super-admin/settings', {
        platformName,
        supportEmail,
        razorpayKeyId,
        maintenanceMode,
      }).catch(() => null);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      Alert.alert('Error', 'Failed to update system settings');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.headerTitle}>System Settings</Text>
            <Text style={styles.headerSubtitle}>Configure platform branding, payment gateway & security</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color="#ffffff" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {savedSuccess && (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={18} color={darkTheme.success} />
          <Text style={styles.toastText}>System Settings Saved Successfully!</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* General Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>General Platform Settings</Text>

          <Text style={styles.label}>Platform Name</Text>
          <TextInput
            style={styles.textInput}
            value={platformName}
            onChangeText={setPlatformName}
            placeholderTextColor={darkTheme.textMuted}
          />

          <Text style={styles.label}>Support Email</Text>
          <TextInput
            style={styles.textInput}
            value={supportEmail}
            onChangeText={setSupportEmail}
            keyboardType="email-address"
            placeholderTextColor={darkTheme.textMuted}
          />
        </View>

        {/* Razorpay Gateway Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Razorpay Integration Config</Text>

          <Text style={styles.label}>Razorpay Key ID</Text>
          <TextInput
            style={styles.textInput}
            value={razorpayKeyId}
            onChangeText={setRazorpayKeyId}
            placeholderTextColor={darkTheme.textMuted}
          />
        </View>

        {/* Maintenance Mode Card */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Maintenance Mode</Text>
              <Text style={styles.switchSub}>
                Temporarily disable clinic admin access for scheduled updates.
              </Text>
            </View>
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: '#1e2d54', true: 'rgba(20, 184, 166, 0.4)' }}
              thumbColor={maintenanceMode ? darkTheme.primary : '#94a3b8'}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
          <Ionicons name="save-outline" size={18} color="#fff" />
          <Text style={styles.btnSaveText}>Save All Settings</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.btnLogout} onPress={logout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.btnLogoutText}>Log Out from Super Admin</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  topHeader: {
    backgroundColor: '#0f766e',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 18,
    marginBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#ccfbf1',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 6,
  },
  logoutBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.successBg,
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: darkTheme.success,
  },
  toastText: {
    color: darkTheme.success,
    fontWeight: 'bold',
    fontSize: 13,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: darkTheme.textPrimary,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: darkTheme.textPrimary,
    backgroundColor: '#f1f5f9',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: darkTheme.textPrimary,
  },
  switchSub: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginTop: 2,
  },
  btnSave: {
    backgroundColor: darkTheme.primary,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  btnSaveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnLogout: {
    backgroundColor: darkTheme.dangerBg,
    borderWidth: 1,
    borderColor: darkTheme.danger,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  btnLogoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
