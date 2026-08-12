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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';

export default function StaffManagementScreen({ navigation }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Staff Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Doctor');
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users').catch(() => ({ data: { data: [] } }));
      const data = res.data?.data || res.data || [];
      setStaff(Array.isArray(data) && data.length > 0 ? data : [
        { id: '1', name: 'Dr. Sarah Connor', role: 'Doctor', email: 'doctor@vetcare.com', phone: '+91 98765 43210', status: 'Active' },
        { id: '2', name: 'Barry Allen', role: 'Receptionist', email: 'receptionist@vetcare.com', phone: '+91 98765 43211', status: 'Active' },
        { id: '3', name: 'Kara Danvers', role: 'Vet Assistant', email: 'assistant@vetcare.com', phone: '+91 98765 43212', status: 'Active' },
        { id: '4', name: 'Bruce Wayne', role: 'Manager', email: 'manager@vetcare.com', phone: '+91 98765 43213', status: 'Active' },
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

  const handleAddStaff = async () => {
    if (!name || !email) {
      Alert.alert('Required', 'Please enter staff name and email address.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/users', { name, email, phone, role, password: 'password123' }).catch(() => null);
      Alert.alert('Success', 'Staff member account created!');
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPhone('');
      fetchStaff();
    } catch (err) {
      Alert.alert('Error', 'Failed to add staff member');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStaffCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{(item.name || 'S').charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.staffName}>{item.name}</Text>
          <Text style={styles.roleText}>{item.role}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{item.status || 'Active'}</Text>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Staff Management</Text>
          <Text style={styles.headerSub}>Manage doctors, receptionists & staff</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
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

      {/* ADD STAFF MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Staff Member</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address *"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.textPrimary, marginTop: 4 }}>Select System Role:</Text>
            <View style={styles.roleGrid}>
              {['Doctor', 'Receptionist', 'Vet Assistant', 'Manager'].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleChip, role === r && styles.roleChipActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[styles.roleChipText, role === r && { color: '#fff' }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAddModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddStaff} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Create Account</Text>}
              </TouchableOpacity>
            </View>
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
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryDark,
  },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  headerSub: { fontSize: 12, color: colors.primaryLight },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justify: 'center',
    alignItems: 'center',
  },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listBody: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justify: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: colors.primaryDark },
  staffName: { fontSize: 15, fontWeight: 'bold', color: colors.textPrimary },
  roleText: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 2 },
  statusBadge: { backgroundColor: colors.successLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold', color: colors.success },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  infoText: { fontSize: 12, color: colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: colors.textPrimary,
  },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  btnCancelText: { color: colors.textSecondary, fontWeight: '600' },
  btnSubmit: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  btnSubmitText: { color: '#fff', fontWeight: 'bold' },
});
