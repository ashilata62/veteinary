import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function HomeVisitsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [visits, setVisits] = useState([]);
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  // Book Visit Modal
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [address, setAddress] = useState('');
  const [travelFee, setTravelFee] = useState('250');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vRes, oRes, pRes, uRes] = await Promise.all([
        api.get('/home-visits').catch(() => ({ data: { data: [] } })),
        api.get('/owners').catch(() => ({ data: { data: [] } })),
        api.get('/pets').catch(() => ({ data: { data: [] } })),
        api.get('/users').catch(() => ({ data: { data: [] } })),
      ]);

      const vData = vRes.data?.data || vRes.data || [];
      const oData = oRes.data?.data || oRes.data || [];
      const pData = pRes.data?.data || pRes.data || [];
      const uData = uRes.data?.data || uRes.data || [];

      setVisits(Array.isArray(vData) ? vData : []);
      setOwners(Array.isArray(oData) ? oData : []);
      setPets(Array.isArray(pData) ? pData : []);
      setDoctors(Array.isArray(uData) ? uData.filter(u => u.role === 'Doctor' || u.role === 'doctor') : []);
    } catch (err) {
      console.error('Error fetching home visits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredVisits = visits.filter(v => {
    if (activeTab === 'All') return true;
    return (v.visit_status || v.status || '').toLowerCase() === activeTab.toLowerCase();
  });

  const handleBookVisit = async () => {
    if (!address || !visitDate) {
      Alert.alert('Required Fields', 'Please enter visit address and date.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        owner_id: selectedOwner || owners[0]?.id || 1,
        pet_id: selectedPet || pets[0]?.id || 1,
        doctor_id: selectedDoctor || doctors[0]?.id || null,
        appointment_date: visitDate,
        appointment_time: visitTime || '10:00 AM',
        address,
        travel_fee: parseFloat(travelFee) || 0,
        notes,
      };
      await api.post('/home-visits', payload);
      Alert.alert('Success', 'Home Visit booked successfully!');
      setShowBookModal(false);
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to book visit');
    } finally {
      setSubmitting(false);
    }
  };

  const openMap = (visitAddress) => {
    const query = encodeURIComponent(visitAddress || 'Indore MP');
    Linking.openURL(`https://maps.google.com/?q=${query}`).catch(() => {
      Alert.alert('Address', visitAddress);
    });
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/home-visits/${id}`, { visit_status: status });
      Alert.alert('Updated', `Visit marked as ${status}`);
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const renderVisitCard = ({ item }) => {
    const isCompleted = (item.visit_status || item.status) === 'Completed';
    const isPending = (item.visit_status || item.status) === 'Pending';

    return (
      <View style={styles.visitCard}>
        <View style={styles.cardHeader}>
          <View style={styles.badgeHome}>
            <Ionicons name="home-outline" size={14} color={colors.secondary} />
            <Text style={styles.badgeHomeText}>Home Visit</Text>
          </View>
          <View style={[styles.statusPill, isCompleted ? styles.statusSuccess : isPending ? styles.statusWarning : styles.statusInfo]}>
            <Text style={[styles.statusText, isCompleted ? { color: colors.success } : isPending ? { color: colors.warning } : { color: colors.info }]}>
              {item.visit_status || item.status || 'Scheduled'}
            </Text>
          </View>
        </View>

        <Text style={styles.petName}>{item.petName || item.pet_name || 'Pet Patient'}</Text>
        <Text style={styles.ownerText}>Owner: {item.ownerName || item.owner_name || 'Client Owner'}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
          <Text style={styles.infoText}>{item.appointment_date ? item.appointment_date.split('T')[0] : 'Today'} at {item.appointment_time || '10:00 AM'}</Text>
        </View>

        <TouchableOpacity style={styles.infoRow} onPress={() => openMap(item.address)}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary, fontWeight: '600' }]} numberOfLines={1}>
            {item.address || 'Click to open Map location'}
          </Text>
        </TouchableOpacity>

        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Doctor: {item.doctorName || item.doctor_name || 'Unassigned'}</Text>
          <Text style={styles.feeValue}>Fee: ₹{item.travel_fee || item.travelFee || 250}</Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.btnMapNav} onPress={() => openMap(item.address)}>
            <Ionicons name="navigate-outline" size={16} color="#fff" />
            <Text style={styles.btnMapNavText}>Navigate</Text>
          </TouchableOpacity>

          {!isCompleted && (
            <TouchableOpacity style={styles.btnComplete} onPress={() => handleUpdateStatus(item.id, 'Completed')}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
              <Text style={styles.btnCompleteText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Home Visit Appointments</Text>
          <Text style={styles.headerSub}>Manage & route pet home visits</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowBookModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        {['All', 'Pending', 'Completed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabChip, activeTab === tab && styles.tabChipActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredVisits}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderVisitCard}
          contentContainerStyle={styles.listBody}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="home-city-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No Home Visits Scheduled</Text>
            </View>
          }
        />
      )}

      {/* BOOK VISIT MODAL */}
      <Modal visible={showBookModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book Pet Home Visit</Text>

            <TextInput
              style={styles.input}
              placeholder="Visit Address (e.g. 12 Park Ave, Indore)"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
            />

            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              placeholderTextColor={colors.textMuted}
              value={visitDate}
              onChangeText={setVisitDate}
            />

            <TextInput
              style={styles.input}
              placeholder="Time (e.g. 11:30 AM)"
              placeholderTextColor={colors.textMuted}
              value={visitTime}
              onChangeText={setVisitTime}
            />

            <TextInput
              style={styles.input}
              placeholder="Travel & Consultation Fee (₹)"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={travelFee}
              onChangeText={setTravelFee}
            />

            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Notes / Instructions"
              placeholderTextColor={colors.textMuted}
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowBookModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleBookVisit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Book Visit</Text>}
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
  tabContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  tabChipActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#ffffff', fontWeight: 'bold' },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listBody: { padding: 16, gap: 14 },
  visitCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badgeHome: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeHomeText: { fontSize: 12, fontWeight: 'bold', color: colors.secondary },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusSuccess: { backgroundColor: colors.successLight },
  statusWarning: { backgroundColor: colors.warningLight },
  statusInfo: { backgroundColor: colors.infoLight },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  petName: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  ownerText: { fontSize: 13, color: colors.textSecondary, marginTop: 2, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoText: { fontSize: 13, color: colors.textSecondary },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.divider },
  feeLabel: { fontSize: 12, color: colors.textMuted },
  feeValue: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnMapNav: {
    flex: 1,
    backgroundColor: colors.primary,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  btnMapNavText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  btnComplete: {
    flex: 1,
    backgroundColor: colors.success,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  btnCompleteText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
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
