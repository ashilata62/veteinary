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
  Linking,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';

export default function PetOwnersScreen({ navigation }) {
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await api.get('/owners').catch(() => ({ data: { data: [] } }));
      const data = res.data?.data || res.data || [];
      setOwners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching owners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const filteredOwners = owners.filter(o => {
    const term = search.toLowerCase();
    return (
      (o.name || '').toLowerCase().includes(term) ||
      (o.phone || '').toLowerCase().includes(term) ||
      (o.email || '').toLowerCase().includes(term)
    );
  });

  const handleAddOwner = async () => {
    if (!name || !phone) {
      Alert.alert('Required Fields', 'Please enter owner name and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/owners', { name, phone, email, address });
      Alert.alert('Success', 'Pet Owner added successfully!');
      setShowAddModal(false);
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      fetchOwners();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add pet owner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCall = (ph) => {
    if (ph) Linking.openURL(`tel:${ph}`).catch(() => Alert.alert('Phone', ph));
  };

  const handleEmail = (em) => {
    if (em) Linking.openURL(`mailto:${em}`).catch(() => Alert.alert('Email', em));
  };

  const handleWhatsApp = (ph) => {
    const clean = (ph || '').replace(/[^0-9]/g, '');
    if (clean) Linking.openURL(`https://wa.me/91${clean}`).catch(() => Alert.alert('WhatsApp', ph));
  };

  const renderOwnerCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{(item.name || 'O').charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.ownerName}>{item.name}</Text>
          <Text style={styles.petsCount}>{item.pets_count || 1} Registered Pet(s)</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={14} color={colors.textMuted} />
        <Text style={styles.infoText}>{item.phone || 'No phone'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={14} color={colors.textMuted} />
        <Text style={styles.infoText}>{item.email || 'No email'}</Text>
      </View>

      {item.address ? (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={styles.infoText}>{item.address}</Text>
        </View>
      ) : null}

      {/* QUICK ACTIONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.btnAction} onPress={() => handleCall(item.phone)}>
          <Ionicons name="call" size={16} color={colors.primary} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnAction} onPress={() => handleWhatsApp(item.phone)}>
          <Ionicons name="logo-whatsapp" size={16} color={colors.success} />
          <Text style={[styles.actionText, { color: colors.success }]}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnAction} onPress={() => handleEmail(item.email)}>
          <Ionicons name="mail" size={16} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.secondary }]}>Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Pet Owners Directory</Text>
          <Text style={styles.headerSub}>Manage clients & contact details</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by owner name, phone, or email..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredOwners}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderOwnerCard}
          contentContainerStyle={styles.listBody}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No Pet Owners Found</Text>
            </View>
          }
        />
      )}

      {/* ADD OWNER MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Pet Owner</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Mobile Phone Number *"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Residential Address"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAddModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddOwner} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Save Owner</Text>}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listBody: { paddingHorizontal: 16, paddingBottom: 24, gap: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    justify: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: colors.primaryDark },
  ownerName: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  petsCount: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoText: { fontSize: 13, color: colors.textSecondary },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  btnAction: {
    flex: 1,
    backgroundColor: colors.background,
    height: 36,
    borderRadius: 8,
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 12, color: colors.textMuted, fontSize: 15 },
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
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  btnCancelText: { color: colors.textSecondary, fontWeight: '600' },
  btnSubmit: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  btnSubmitText: { color: '#fff', fontWeight: 'bold' },
});
