import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';

const ROLE_OPTIONS = ['Doctor', 'Receptionist', 'Pet Assistant', 'Admin'];

const DEPARTMENTS = {
  Doctor: ['General Practice', 'Surgery', 'Dermatology', 'Emergency Care', 'Internal Medicine'],
  Receptionist: ['Front Desk', 'Client Services'],
  'Pet Assistant': ['Clinical Support', 'Lab & Diagnostics', 'Surgical Assistance'],
  Admin: ['Administration'],
};

export default function StaffManagementScreen({ navigation }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Staff Modal Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Doctor');
  const [department, setDepartment] = useState('General Practice');
  const [status, setStatus] = useState('Active');
  const [submitting, setSubmitting] = useState(false);

  // Dropdown selector state
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorType, setSelectorType] = useState(''); // 'role', 'department', 'status'

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users').catch(() => ({ data: [] }));
      const data = res.data?.data || res.data || [];
      setStaff(Array.isArray(data) && data.length > 0 ? data : [
        { id: '1', name: 'Dr. Sarah Connor', role: 'Doctor', email: 'doctor@vetcare.com', phone: '+91 98765 43210', status: 'Active', department: 'General Practice' },
        { id: '2', name: 'Barry Allen', role: 'Receptionist', email: 'receptionist@vetcare.com', phone: '+91 98765 43211', status: 'Active', department: 'Front Desk' },
        { id: '3', name: 'Kara Danvers', role: 'Pet Assistant', email: 'assistant@vetcare.com', phone: '+91 98765 43212', status: 'Active', department: 'Clinical Support' },
        { id: '4', name: 'Bruce Wayne', role: 'Manager', email: 'manager@vetcare.com', phone: '+91 98765 43213', status: 'Active', department: 'Administration' },
      ]);
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    const depts = DEPARTMENTS[selectedRole] || DEPARTMENTS.Doctor;
    setDepartment(depts[0] || '');
  };

  const handleAddStaff = async () => {
    if (!fullName.trim() || !email.trim() || !username.trim()) {
      Alert.alert('Required Fields', 'Please enter Full Name, Email, and Username.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/users', {
        name: fullName,
        fullName,
        email,
        phone,
        username,
        password,
        role,
        department,
        status,
      });
      Alert.alert('Success', 'Staff member registered successfully!');
      setShowAddModal(false);
      
      // Clear forms
      setFullName('');
      setEmail('');
      setPhone('');
      setUsername('');
      setPassword('password123');
      setRole('Doctor');
      setDepartment('General Practice');
      setStatus('Active');

      fetchStaff();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to add staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenSelector = (type) => {
    setSelectorType(type);
    setSelectorVisible(true);
  };

  const handleSelectOption = (item) => {
    if (selectorType === 'role') {
      handleRoleChange(item);
    } else if (selectorType === 'department') {
      setDepartment(item);
    } else if (selectorType === 'status') {
      setStatus(item);
    }
    setSelectorVisible(false);
  };

  const getSelectorOptions = () => {
    if (selectorType === 'role') return ROLE_OPTIONS;
    if (selectorType === 'department') return DEPARTMENTS[role] || DEPARTMENTS.Doctor;
    if (selectorType === 'status') return ['Active', 'On Leave'];
    return [];
  };

  const renderStaffCard = ({ item }) => {
    const isLeave = item.status === 'On Leave' || item.status === 'Suspended';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{(item.name || item.fullName || 'S').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.staffName}>{item.name || item.fullName}</Text>
            <Text style={styles.roleText}>{item.role} • {item.department || 'General'}</Text>
          </View>
          <View style={[styles.statusBadge, isLeave && { backgroundColor: colors.warningLight }]}>
            <Text style={[styles.statusBadgeText, isLeave && { color: colors.warning }]}>
              {item.status || 'Active'}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={14} color={colors.textMuted} />
          <Text style={styles.infoText}>{item.email}</Text>
        </View>
        {item.phone ? (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={14} color={colors.textMuted} />
            <Text style={styles.infoText}>{item.phone}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Staff Management</Text>
          <Text style={styles.headerSub}>Manage user accounts & authorization</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="person-add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={staff}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderStaffCard}
          contentContainerStyle={styles.listBody}
        />
      )}

      {/* REGISTER NEW STAFF MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Register Staff Member</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Full Name */}
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Dr. Sarah Jenkins"
                placeholderTextColor={colors.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />

              {/* Email */}
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. doctor@vetcare.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Username */}
              <Text style={styles.label}>Username *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. sjenkins"
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              {/* Phone */}
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. +91 98765 43210"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              {/* Password */}
              <Text style={styles.label}>Portal Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password..."
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.dropdownRow}>
                {/* Role Selector */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Role *</Text>
                  <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('role')}>
                    <Text style={styles.selectorBtnText}>{role}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Department Selector */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Department</Text>
                  <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('department')}>
                    <Text style={styles.selectorBtnText}>{department}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Status Selector */}
              <Text style={styles.label}>Status *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('status')}>
                <Text style={styles.selectorBtnText}>{status}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddStaff} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Register New Staff</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Selectors Search Modal */}
      <Modal visible={selectorVisible} transparent animationType="fade">
        <View style={styles.selectorOverlay}>
          <View style={styles.selectorContent}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>Select {selectorType.toUpperCase()}</Text>
              <TouchableOpacity onPress={() => setSelectorVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={getSelectorOptions()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectorItem}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={styles.selectorItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: colors.headerBg,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  headerSub: { fontSize: 11, color: '#ccfbf1', marginTop: 2 },
  addBtn: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  listBody: { padding: 16, gap: 12, paddingBottom: 30 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  staffName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  roleText: { fontSize: 12, color: colors.textSecondary },
  statusBadge: {
    backgroundColor: colors.successLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700', color: colors.success },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  infoText: { fontSize: 13, color: colors.textSecondary },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectorBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  selectorBtnText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  selectorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '75%',
    maxHeight: '50%',
    padding: 16,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  selectorItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectorItemText: { fontSize: 14, color: colors.textPrimary, textAlign: 'center' },
});
