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

export default function HospitalizationScreen({ navigation }) {
  const [inpatients, setInpatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admit Modal
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [petName, setPetName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [wardNo, setWardNo] = useState('Ward A');
  const [cageNo, setCageNo] = useState('Cage 102');
  const [reason, setReason] = useState('');
  const [vitals, setVitals] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInpatients = async () => {
    try {
      setLoading(true);
      // Attempt backend call or default mock inpatients
      const res = await api.get('/hospitalization').catch(() => ({ data: null }));
      if (res.data && Array.isArray(res.data.data)) {
        setInpatients(res.data.data);
      } else {
        setInpatients([
          { id: '1', pet_name: 'Max (Golden Retriever)', owner_name: 'Rahul Sharma', ward: 'Ward A', cage: 'Cage 101', status: 'Admitted', reason: 'Post Surgery Care', admitted_at: '10 Aug 2026', vitals: 'Temp: 101.5F, HR: 88 bpm' },
          { id: '2', pet_name: 'Bella (Persian Cat)', owner_name: 'Neha Gupta', ward: 'ICU Ward', cage: 'Cage ICU-2', status: 'ICU', reason: 'Severe Dehydration', admitted_at: '11 Aug 2026', vitals: 'Temp: 99.8F, Oxygen: 95%' },
          { id: '3', pet_name: 'Rocky (Beagle)', owner_name: 'Karan Verma', ward: 'Ward B', cage: 'Cage 204', status: 'Discharged', reason: 'Observation', admitted_at: '08 Aug 2026', vitals: 'Normal' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching inpatients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInpatients();
  }, []);

  const handleAdmitPet = () => {
    if (!petName || !ownerName) {
      Alert.alert('Required Fields', 'Please enter pet name and owner name.');
      return;
    }
    const newInpatient = {
      id: Date.now().toString(),
      pet_name: petName,
      owner_name: ownerName,
      ward: wardNo,
      cage: cageNo,
      status: 'Admitted',
      reason: reason || 'Inpatient Observation',
      admitted_at: 'Today',
      vitals: vitals || 'Temp: Normal',
    };
    setInpatients([newInpatient, ...inpatients]);
    setShowAdmitModal(false);
    Alert.alert('Admitted', `${petName} has been admitted to ${wardNo} (${cageNo}).`);
    setPetName('');
    setOwnerName('');
    setReason('');
  };

  const handleDischarge = (id, name) => {
    Alert.alert(
      'Discharge Inpatient',
      `Are you sure you want to discharge ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discharge',
          onPress: () => {
            setInpatients(prev => prev.map(p => p.id === id ? { ...p, status: 'Discharged' } : p));
          },
        },
      ]
    );
  };

  const renderInpatientCard = ({ item }) => {
    const isICU = item.status === 'ICU';
    const isDischarged = item.status === 'Discharged';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.wardPill}>
            <MaterialCommunityIcons name="hospital-building" size={14} color={colors.primary} />
            <Text style={styles.wardText}>{item.ward} ({item.cage})</Text>
          </View>

          <View style={[styles.statusBadge, isICU ? styles.badgeDanger : isDischarged ? styles.badgeSuccess : styles.badgeWarning]}>
            <Text style={[styles.statusBadgeText, isICU ? { color: colors.danger } : isDischarged ? { color: colors.success } : { color: colors.warning }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.petTitle}>{item.pet_name}</Text>
        <Text style={styles.ownerText}>Owner: {item.owner_name}</Text>
        <Text style={styles.reasonText}>Reason: {item.reason}</Text>
        
        <View style={styles.vitalsBox}>
          <Ionicons name="pulse-outline" size={14} color={colors.danger} />
          <Text style={styles.vitalsText}>Vitals: {item.vitals}</Text>
        </View>

        {!isDischarged && (
          <TouchableOpacity style={styles.btnDischarge} onPress={() => handleDischarge(item.id, item.pet_name)}>
            <Ionicons name="log-out-outline" size={16} color="#fff" />
            <Text style={styles.btnDischargeText}>Discharge Patient</Text>
          </TouchableOpacity>
        )}
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
          <Text style={styles.headerTitle}>Inpatient Hospitalization</Text>
          <Text style={styles.headerSub}>Ward & Cage care management</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdmitModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={inpatients}
          keyExtractor={item => item.id}
          renderItem={renderInpatientCard}
          contentContainerStyle={styles.listBody}
        />
      )}

      {/* ADMIT MODAL */}
      <Modal visible={showAdmitModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Admit Inpatient Pet</Text>

            <TextInput
              style={styles.input}
              placeholder="Pet Name & Breed (e.g. Max Golden)"
              placeholderTextColor={colors.textMuted}
              value={petName}
              onChangeText={setPetName}
            />

            <TextInput
              style={styles.input}
              placeholder="Owner Name"
              placeholderTextColor={colors.textMuted}
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <TextInput
              style={styles.input}
              placeholder="Ward Name (e.g. ICU / Ward A)"
              placeholderTextColor={colors.textMuted}
              value={wardNo}
              onChangeText={setWardNo}
            />

            <TextInput
              style={styles.input}
              placeholder="Cage No (e.g. Cage 105)"
              placeholderTextColor={colors.textMuted}
              value={cageNo}
              onChangeText={setCageNo}
            />

            <TextInput
              style={styles.input}
              placeholder="Reason for Admission"
              placeholderTextColor={colors.textMuted}
              value={reason}
              onChangeText={setReason}
            />

            <TextInput
              style={styles.input}
              placeholder="Vitals (Temp, Pulse, Heart Rate)"
              placeholderTextColor={colors.textMuted}
              value={vitals}
              onChangeText={setVitals}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAdmitModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAdmitPet}>
                <Text style={styles.btnSubmitText}>Admit Patient</Text>
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
  listBody: { padding: 16, gap: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  wardPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  wardText: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeDanger: { backgroundColor: colors.dangerLight },
  badgeSuccess: { backgroundColor: colors.successLight },
  badgeWarning: { backgroundColor: colors.warningLight },
  statusBadgeText: { fontSize: 11, fontWeight: 'bold' },
  petTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  ownerText: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  reasonText: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  vitalsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff5f5',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  vitalsText: { fontSize: 12, color: colors.danger, fontWeight: '600' },
  btnDischarge: {
    backgroundColor: colors.danger,
    height: 36,
    borderRadius: 10,
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  btnDischargeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
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
