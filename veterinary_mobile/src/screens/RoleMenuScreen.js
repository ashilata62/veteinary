import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RoleMenuScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const rawRole = user?.role || 'Doctor';

  const canonicalRole = (r) => {
    if (!r) return 'Doctor';
    const str = r.toString().toLowerCase();
    if (str.includes('super')) return 'SUPER_ADMIN';
    if (str.includes('reception') || str.includes('demor')) return 'Receptionist';
    if (str.includes('assistant')) return 'Pet Assistant';
    if (str.includes('manager')) return 'Manager';
    if (str.includes('admin')) return 'Admin';
    return 'Doctor';
  };

  const activeRole = canonicalRole(rawRole);

  // Exact Role-Based Menu Matrix matching web Sidebar.jsx
  const menuConfig = [
    { id: 'DashboardScreen', label: 'Dashboard', icon: 'speedometer-outline', roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Pet Assistant'] },
    { id: 'Appointments', label: activeRole === 'Doctor' || activeRole === 'Pet Assistant' ? 'My Appointments' : 'Appointments', icon: 'calendar-outline', roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Pet Assistant'] },
    { id: 'HomeVisits', label: activeRole === 'Doctor' ? 'Home Visits' : 'Home Visit Appointments', icon: 'navigate-outline', roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Pet Assistant'] },
    { id: 'Hospitalization', label: 'Hospitalization', icon: 'bed-outline', roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Pet Assistant'] },
    { id: 'PetOwners', label: 'Pet Owners', icon: 'people-outline', roles: ['Admin', 'Manager', 'Receptionist'] },
    { id: 'Pets', label: activeRole === 'Doctor' || activeRole === 'Pet Assistant' ? 'Patients' : 'Pets', icon: 'paw-outline', roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Pet Assistant'] },
    { id: 'MedicalRecords', label: 'Medical Records', icon: 'fitness-outline', roles: ['Admin', 'Manager', 'Doctor', 'Pet Assistant'] },
    { id: 'TreatmentNotes', label: 'Treatment Notes', icon: 'document-text-outline', roles: ['Doctor'] },
    { id: 'AssistanceTasks', label: 'Assistance Tasks', icon: 'checkbox-outline', roles: ['Pet Assistant'] },
    { id: 'Prescriptions', label: 'Prescriptions', icon: 'journal-outline', roles: ['Doctor'] },
    { id: 'DoctorRevenue', label: 'My Revenue', icon: 'bar-chart-outline', roles: ['Doctor'] },
    { id: 'Billing', label: 'Billing & POS', icon: 'card-outline', roles: ['Admin', 'Manager', 'Receptionist', 'Doctor'] },
    { id: 'Inventory', label: 'Inventory', icon: 'cube-outline', roles: ['Admin', 'Manager', 'Receptionist'] },
    { id: 'Reminders', label: 'Email Reminders', icon: 'mail-outline', roles: ['Admin', 'Manager', 'Receptionist'] },
    { id: 'StaffManagement', label: 'Staff Management', icon: 'person-add-outline', roles: ['Admin'] },
    { id: 'Attendance', label: 'Attendance', icon: 'time-outline', roles: ['Admin', 'Manager'] },
    { id: 'Reports', label: 'Reports & Analytics', icon: 'stats-chart-outline', roles: ['Admin', 'Manager'] },
    { id: 'Notifications', label: 'Notifications', icon: 'notifications-outline', roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Pet Assistant'] },
    { id: 'Settings', label: 'Settings', icon: 'settings-outline', roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Pet Assistant'] },
    { id: 'Profile', label: 'My Profile', icon: 'person-circle-outline', roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Pet Assistant'] },
    { id: 'Support', label: 'Support', icon: 'headset-outline', roles: ['Admin'] },
  ];

  const getRoleColor = (roleName) => {
    const r = (roleName || '').toLowerCase();
    if (r.includes('admin')) return '#0f766e';
    if (r.includes('reception')) return '#0d9488';
    if (r.includes('assistant')) return '#052e16';
    if (r.includes('manager')) return '#0e7490';
    return '#065f46';
  };

  const allowedItems = menuConfig.filter(m => m.roles.includes(activeRole));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={getRoleColor(activeRole)} />

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: getRoleColor(activeRole) }]}>
        <View style={styles.userRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={24} color={getRoleColor(activeRole)} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || 'Staff Member'}</Text>
            <Text style={styles.userRole}>ROLE: {activeRole.toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        <Text style={styles.secTitle}>Role Navigation Menu ({activeRole} - {allowedItems.length} Modules)</Text>

        <View style={styles.menuGrid}>
          {allowedItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => {
                if (item.id === 'DashboardScreen') navigation.navigate('Dashboard');
                else navigation.navigate(item.id);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel} numberOfLines={2}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryDark,
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 17, fontWeight: 'bold', color: '#ffffff' },
  userRole: { fontSize: 11, color: colors.primaryLight, fontWeight: '700', marginTop: 2 },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: { padding: 16, paddingBottom: 40 },
  secTitle: { fontSize: 12, fontWeight: 'bold', color: colors.primary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 14 },
  menuGrid: { gap: 10 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  chevron: { marginLeft: 'auto' },
  btnBottomLogout: {
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: colors.dangerLight,
    borderRadius: 12,
  },
  btnBottomLogoutText: { color: colors.danger, fontWeight: 'bold', fontSize: 14 },
});
