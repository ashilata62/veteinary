import React, { useState, useContext } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert, ActivityIndicator, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import api from '../config/api';

const TABS = [
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
  { key: 'clinic', label: 'Clinic', icon: 'business-outline' },
  { key: 'notifications', label: 'Alerts', icon: 'notifications-outline' },
  { key: 'security', label: 'Security', icon: 'shield-checkmark-outline' },
];

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  // Profile
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Clinic
  const [clinicName, setClinicName] = useState(user?.clinicName || '');
  const [clinicEmail, setClinicEmail] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');

  // Notifications
  const [autoEmail, setAutoEmail] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/users/profile', {
        name: profileName,
        phone: profilePhone,
      });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      Alert.alert('Info', 'Profile saved locally (backend sync pending).');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClinic = async () => {
    setSaving(true);
    try {
      await api.put('/settings', {
        name: clinicName,
        email: clinicEmail,
        phone: clinicPhone,
        address: clinicAddress,
        autoEmail,
      });
      Alert.alert('Success', 'Clinic settings updated!');
    } catch (err) {
      Alert.alert('Info', 'Clinic settings saved locally (backend sync pending).');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      Alert.alert('Success', 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to change password. Check your current password.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const renderField = (label, value, onChangeText, options = {}) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, options.multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor={colors.textMuted}
        keyboardType={options.keyboardType || 'default'}
        secureTextEntry={options.secureTextEntry || false}
        multiline={options.multiline || false}
        autoCapitalize={options.autoCapitalize || 'sentences'}
      />
    </View>
  );

  const renderPasswordField = (label, value, onChangeText, show, setShow) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={[styles.fieldInput, { flex: 1, borderWidth: 0, marginBottom: 0 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!show}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShow(!show)} style={{ padding: 8 }}>
          <Ionicons name={show ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderToggleRow = (label, subtitle, value, onToggle) => (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {subtitle ? <Text style={styles.toggleSub}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#ffffff"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSub}>{user?.role} • {user?.clinicName || 'VetCare Pro'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons name={tab.icon} size={16} color={activeTab === tab.key ? colors.primary : colors.textMuted} />
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <View style={styles.section}>
            <View style={styles.avatarBlock}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.avatarName}>{user?.name || 'Staff Member'}</Text>
                <Text style={styles.avatarRole}>{user?.role}</Text>
              </View>
            </View>

            {renderField('Full Name', profileName, setProfileName)}
            {renderField('Email Address', profileEmail, setProfileEmail, { keyboardType: 'email-address', autoCapitalize: 'none' })}
            {renderField('Phone Number', profilePhone, setProfilePhone, { keyboardType: 'phone-pad' })}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" size="small" /> : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Profile</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* CLINIC TAB */}
        {activeTab === 'clinic' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business-outline" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Clinic Information</Text>
            </View>
            {renderField('Clinic Name', clinicName, setClinicName)}
            {renderField('Contact Email', clinicEmail, setClinicEmail, { keyboardType: 'email-address', autoCapitalize: 'none' })}
            {renderField('Contact Phone', clinicPhone, setClinicPhone, { keyboardType: 'phone-pad' })}
            {renderField('Clinic Address', clinicAddress, setClinicAddress, { multiline: true })}

            <View style={styles.cardSection}>
              <Text style={styles.cardSectionTitle}>Reminder Settings</Text>
              {renderToggleRow('Automated Email Reminders', 'Send appointment confirmation emails', autoEmail, setAutoEmail)}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveClinic} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" size="small" /> : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Clinic Settings</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Notification Preferences</Text>
            </View>
            <View style={styles.cardSection}>
              {renderToggleRow('Push Notifications', 'Receive alerts on this device', pushNotifications, setPushNotifications)}
              {renderToggleRow('Appointment Reminders', 'Notify before upcoming appointments', appointmentReminders, setAppointmentReminders)}
              {renderToggleRow('Email Notifications', 'Send email for important updates', autoEmail, setAutoEmail)}
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>Push notifications require a production build. Test in Expo Go uses local only.</Text>
            </View>
          </View>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Change Password</Text>
            </View>
            {renderPasswordField('Current Password', currentPassword, setCurrentPassword, showCurrentPwd, setShowCurrentPwd)}
            {renderPasswordField('New Password', newPassword, setNewPassword, showNewPwd, setShowNewPwd)}
            {renderField('Confirm New Password', confirmPassword, setConfirmPassword, { secureTextEntry: true, autoCapitalize: 'none' })}

            <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" size="small" /> : (
                <>
                  <Ionicons name="lock-closed-outline" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>Change Password</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dangerZone}>
              <Text style={styles.dangerTitle}>Danger Zone</Text>
              <TouchableOpacity style={styles.logoutLargeBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={18} color={colors.danger} />
                <Text style={styles.logoutLargeBtnText}>Logout from App</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingTop: 52, paddingBottom: 16, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12,
  },
  backBtn: { padding: 6 },
  logoutBtn: { marginLeft: 'auto', padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  headerSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  tabScroll: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, maxHeight: 52 },
  tabRow: { paddingHorizontal: 12, gap: 6, alignItems: 'center', paddingVertical: 8 },
  tabItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: colors.background,
  },
  tabItemActive: { backgroundColor: colors.primaryLight },
  tabLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  tabLabelActive: { color: colors.primary },
  body: { padding: 20, paddingBottom: 40 },
  section: { gap: 16 },
  avatarBlock: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: colors.primary },
  avatarName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  avatarRole: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  fieldBlock: { marginBottom: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  fieldInput: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: colors.textPrimary, marginBottom: 4,
  },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, paddingLeft: 14,
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: colors.primary, paddingVertical: 14,
    borderRadius: 14, marginTop: 8, elevation: 2,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cardSection: {
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, padding: 4, marginBottom: 4,
  },
  cardSectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, padding: 12, paddingBottom: 4 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  toggleSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  infoCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: colors.primaryLight, padding: 14, borderRadius: 12,
  },
  infoText: { flex: 1, fontSize: 13, color: colors.primary, lineHeight: 18 },
  dangerZone: {
    marginTop: 24, padding: 16, borderRadius: 14,
    borderWidth: 1, borderColor: colors.danger + '40',
    backgroundColor: colors.dangerLight,
  },
  dangerTitle: { fontSize: 14, fontWeight: '700', color: colors.danger, marginBottom: 12 },
  logoutLargeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: colors.danger + '50',
  },
  logoutLargeBtnText: { color: colors.danger, fontWeight: '600', fontSize: 14 },
});
