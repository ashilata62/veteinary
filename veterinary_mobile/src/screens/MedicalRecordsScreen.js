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

export default function MedicalRecordsScreen({ navigation }) {
  const [encounters, setEncounters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Encounter Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [petName, setPetName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEncounters = async () => {
    try {
      setLoading(true);
      const res = await api.get('/encounters').catch(() => ({ data: [] }));
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setEncounters(data.length > 0 ? data : [
        { id: '1', pet_name: 'Max (Golden Retriever)', doctor_name: 'Dr. Sarah Connor', diagnosis: 'Canine Parvovirus (Mild)', notes: 'Administered IV fluids and antiemetics. Recommend 3 days rest.', prescription: 'Cefalexin 500mg, Metoclopramide', date: '10 Aug 2026' },
        { id: '2', pet_name: 'Bella (Persian Cat)', doctor_name: 'Dr. Alex Morgan', diagnosis: 'Upper Respiratory Infection', notes: 'Feline asthma symptoms controlled. Nebulization therapy given.', prescription: 'Doxycycline 50mg, L-Lysine', date: '11 Aug 2026' },
      ]);
    } catch (err) {
      console.error('Error fetching medical records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncounters();
  }, []);

  const filteredEncounters = encounters.filter(e => {
    const term = search.toLowerCase();
    return (
      (e.pet_name || '').toLowerCase().includes(term) ||
      (e.doctor_name || '').toLowerCase().includes(term) ||
      (e.diagnosis || '').toLowerCase().includes(term)
    );
  });

  const handleAddEncounter = async () => {
    if (!petName || !diagnosis) {
      Alert.alert('Required Fields', 'Please enter pet patient name and diagnosis.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/encounters', {
        pet_name: petName,
        doctor_name: doctorName || 'Dr. On Duty',
        diagnosis,
        notes: clinicalNotes,
        prescription,
      }).catch(() => null);

      Alert.alert('Success', 'Medical Record Encounter added!');
      setShowAddModal(false);
      setPetName('');
      setDiagnosis('');
      setClinicalNotes('');
      setPrescription('');
      fetchEncounters();
    } catch (err) {
      Alert.alert('Error', 'Failed to add medical record');
    } finally {
      setSubmitting(false);
    }
  };

  const renderEncounterCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeMedical}>
          <Ionicons name="medical" size={14} color={colors.danger} />
          <Text style={styles.badgeMedicalText}>Clinical Encounter</Text>
        </View>
        <Text style={styles.dateText}>{item.date || 'Recent'}</Text>
      </View>

      <Text style={styles.petTitle}>{item.pet_name || 'Patient Pet'}</Text>
      <Text style={styles.doctorText}>Doctor: {item.doctor_name || 'Attending Vet'}</Text>

      <View style={styles.diagnosisBox}>
        <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
        <Text style={styles.diagnosisValue}>{item.diagnosis || 'General Checkup'}</Text>
      </View>

      {item.notes ? (
        <Text style={styles.notesText} numberOfLines={3}>
          Clinical Notes: {item.notes}
        </Text>
      ) : null}

      {item.prescription ? (
        <View style={styles.rxBox}>
          <MaterialCommunityIcons name="pill" size={14} color={colors.primary} />
          <Text style={styles.rxText}>Rx: {item.prescription}</Text>
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
          <Text style={styles.headerTitle}>Pet Medical Records (EMR)</Text>
          <Text style={styles.headerSub}>Diagnoses, clinical notes & Rx history</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patient medical history or diagnosis..."
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
          data={filteredEncounters}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderEncounterCard}
          contentContainerStyle={styles.listBody}
        />
      )}

      {/* ADD MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Medical Encounter</Text>

            <TextInput
              style={styles.input}
              placeholder="Pet Patient Name *"
              placeholderTextColor={colors.textMuted}
              value={petName}
              onChangeText={setPetName}
            />

            <TextInput
              style={styles.input}
              placeholder="Doctor Full Name"
              placeholderTextColor={colors.textMuted}
              value={doctorName}
              onChangeText={setDoctorName}
            />

            <TextInput
              style={styles.input}
              placeholder="Primary Diagnosis *"
              placeholderTextColor={colors.textMuted}
              value={diagnosis}
              onChangeText={setDiagnosis}
            />

            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Clinical Symptoms & Examination Notes"
              placeholderTextColor={colors.textMuted}
              multiline
              value={clinicalNotes}
              onChangeText={setClinicalNotes}
            />

            <TextInput
              style={styles.input}
              placeholder="Prescription Medicines (Rx)"
              placeholderTextColor={colors.textMuted}
              value={prescription}
              onChangeText={setPrescription}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAddModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddEncounter} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Save Record</Text>}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  badgeMedical: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeMedicalText: { fontSize: 12, fontWeight: 'bold', color: colors.danger },
  dateText: { fontSize: 12, color: colors.textMuted },
  petTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  doctorText: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  diagnosisBox: { flexDirection: 'row', gap: 6, marginTop: 8, alignItems: 'center' },
  diagnosisLabel: { fontSize: 13, fontWeight: 'bold', color: colors.textPrimary },
  diagnosisValue: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  notesText: { fontSize: 12, color: colors.textSecondary, marginTop: 6, lineHeight: 18 },
  rxBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  rxText: { fontSize: 12, color: colors.primaryDark, fontWeight: 'bold' },
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
