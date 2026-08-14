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
import * as DocumentPicker from 'expo-document-picker';

export default function MedicalRecordsScreen({ navigation }) {
  const [encounters, setEncounters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Selector resources
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Add Encounter Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescription, setPrescription] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Search selector modal
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorType, setSelectorType] = useState(''); // 'pet', 'doctor'
  const [selectorQuery, setSelectorQuery] = useState('');

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [encsRes, petsRes, usersRes] = await Promise.all([
        api.get('/encounters').catch(() => ({ data: [] })),
        api.get('/pets').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] })),
      ]);

      const encsList = Array.isArray(encsRes.data) ? encsRes.data : (encsRes.data?.data || []);
      setEncounters(encsList.length > 0 ? encsList : [
        { id: '1', pet_name: 'Max (Golden Retriever)', doctor_name: 'Dr. Sarah Connor', diagnosis: 'Canine Parvovirus (Mild)', notes: 'Administered IV fluids and antiemetics. Recommend 3 days rest.', prescription: 'Cefalexin 500mg, Metoclopramide', date: '10 Aug 2026' },
        { id: '2', pet_name: 'Bella (Persian Cat)', doctor_name: 'Dr. Alex Morgan', diagnosis: 'Upper Respiratory Infection', notes: 'Feline asthma symptoms controlled. Nebulization therapy given.', prescription: 'Doxycycline 50mg, L-Lysine', date: '11 Aug 2026' },
      ]);

      setPets(petsRes.data?.data || petsRes.data || []);
      const usersList = usersRes.data?.data || usersRes.data || [];
      setDoctors(usersList.filter(u => String(u.role).toLowerCase().includes('doctor') || String(u.role).toLowerCase().includes('admin')));
    } catch (err) {
      console.error('Error fetching medical records data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenSelector = (type) => {
    setSelectorType(type);
    setSelectorQuery('');
    setSelectorVisible(true);
  };

  const handleSelectOption = (item) => {
    if (selectorType === 'pet') {
      setSelectedPetId(item.id);
    } else if (selectorType === 'doctor') {
      setSelectedDoctorId(item.id);
    }
    setSelectorVisible(false);
  };

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setDocumentFile(res.assets[0]);
      }
    } catch (err) {
      console.warn('Document picking error:', err);
    }
  };

  const handleAddEncounter = async () => {
    if (!selectedPetId || !diagnosis.trim()) {
      Alert.alert('Required Fields', 'Please select Patient Pet and enter Diagnosis.');
      return;
    }
    setSubmitting(true);
    try {
      const prescriptionsArray = prescription.trim() ? [{
        medicine_name: prescription,
        dosage: 'As directed',
        frequency: 'As directed',
        duration: 'As directed',
        instructions: 'As directed'
      }] : [];

      const payload = {
        pet_id: selectedPetId,
        doctor_id: selectedDoctorId || null,
        complaint: complaint || 'Clinical Consultation',
        symptoms: symptoms || null,
        diagnosis,
        treatment: treatment || null,
        prescriptions: prescriptionsArray,
      };

      const res = await api.post('/encounters', payload);
      const encounterId = res.data?.id;

      if (documentFile && encounterId) {
        try {
          await api.post('/encounters/reports', {
            pet_id: selectedPetId,
            encounter_id: encounterId,
            report_type: 'Lab Report',
            file_name: documentFile.name || 'Diagnostic_Report.pdf',
            file_url: 'http://localhost:5000/uploads/placeholder.pdf'
          });
        } catch (repErr) {
          console.log('Failed to attach document report record, ignoring.');
        }
      }

      Alert.alert('Success', 'Medical encounter record created successfully!');
      setShowAddModal(false);
      
      // Clear forms
      setSelectedPetId('');
      setSelectedDoctorId('');
      setComplaint('');
      setSymptoms('');
      setDiagnosis('');
      setTreatment('');
      setPrescription('');
      setDocumentFile(null);

      fetchInitialData();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create medical record.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPetLabel = () => {
    const p = pets.find(pet => pet.id === selectedPetId);
    return p ? `${p.name} (${p.breed || 'Dog'})` : 'Select Pet...';
  };

  const getDoctorLabel = () => {
    const d = doctors.find(doc => doc.id === selectedDoctorId);
    return d ? d.name : 'Select Doctor...';
  };

  const getSelectorOptions = () => {
    if (selectorType === 'pet') {
      return pets.filter(p => p.name.toLowerCase().includes(selectorQuery.toLowerCase()));
    }
    if (selectorType === 'doctor') {
      return doctors.filter(d => d.name.toLowerCase().includes(selectorQuery.toLowerCase()));
    }
    return [];
  };

  const filteredEncounters = encounters.filter(e => {
    const term = search.toLowerCase();
    return (
      (e.pet_name || '').toLowerCase().includes(term) ||
      (e.doctor_name || '').toLowerCase().includes(term) ||
      (e.diagnosis || '').toLowerCase().includes(term)
    );
  });

  const renderEncounterCard = ({ item }) => (
    <View style={styles.recordCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.petNameText}>{item.pet_name || 'Pet Record'}</Text>
        <Text style={styles.dateText}>{item.date || 'Today'}</Text>
      </View>

      <Text style={styles.doctorText}>Consultant: {item.doctor_name || 'Dr. On Duty'}</Text>

      <View style={styles.diagnosisBox}>
        <Text style={styles.diagnosisLabel}>Diagnosis:</Text>
        <Text style={styles.diagnosisValue}>{item.diagnosis}</Text>
      </View>

      {item.notes ? (
        <Text style={styles.notesText}>
          Clinical Notes: {item.notes}
        </Text>
      ) : null}

      {item.prescription ? (
        <View style={styles.rxBox}>
          <MaterialCommunityIcons name="pill" size={14} color={colors.primary} />
          <Text style={styles.rxText}>Rx: {item.prescription}</Text>
        </View>
      ) : null}

      {(item.document_url || item.document) ? (
        <TouchableOpacity
          style={styles.attachmentBadge}
          onPress={() => Alert.alert('Attachment', `Opening file: ${item.document_url || item.document}`)}
        >
          <Ionicons name="document-text-outline" size={14} color={colors.primary} />
          <Text style={styles.attachmentText}>View Diagnostic Scan Report</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Medical Records (EMR)</Text>
          <Text style={styles.headerSub}>Diagnoses, clinical notes & prescription logs</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by pet or diagnosis..."
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
          ListEmptyComponent={
            <Text style={styles.emptyText}>No clinical records found.</Text>
          }
        />
      )}

      {/* ADD VISIT RECORD MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Add Visit Record</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Pet Picker */}
              <Text style={styles.label}>Select Patient Pet *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('pet')}>
                <Text style={styles.selectorBtnText}>{getPetLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Doctor Picker */}
              <Text style={styles.label}>Consulting Doctor *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('doctor')}>
                <Text style={styles.selectorBtnText}>{getDoctorLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Chief Complaint */}
              <Text style={styles.label}>Chief Complaint / Purpose of Visit</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Vomiting and fever..."
                placeholderTextColor={colors.textMuted}
                value={complaint}
                onChangeText={setComplaint}
              />

              {/* Symptoms */}
              <Text style={styles.label}>Symptoms & Observations</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Describe observations..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={symptoms}
                onChangeText={setSymptoms}
              />

              {/* Diagnosis */}
              <Text style={styles.label}>Primary Diagnosis *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Feline Gastrointestinal Infection"
                placeholderTextColor={colors.textMuted}
                value={diagnosis}
                onChangeText={setDiagnosis}
              />

              {/* Treatment */}
              <Text style={styles.label}>Treatment Plan / Actions Taken</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="e.g. IV Fluids and antibiotics given..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={treatment}
                onChangeText={setTreatment}
              />

              {/* Prescription */}
              <Text style={styles.label}>Prescribed Medications (Rx)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Doxycycline 100mg (1 daily for 5 days)"
                placeholderTextColor={colors.textMuted}
                value={prescription}
                onChangeText={setPrescription}
              />

              {/* File Attachment */}
              <Text style={styles.label}>Attach Lab Scan Report (PDF/Image)</Text>
              <TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocument}>
                <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
                <Text style={styles.uploadBtnText}>
                  {documentFile ? documentFile.name : 'Choose File / Scan Report'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddEncounter} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Add Clinical Record</Text>}
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

            <View style={styles.selectorSearch}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.selectorSearchInput}
                placeholder={`Search ${selectorType}...`}
                placeholderTextColor={colors.textMuted}
                value={selectorQuery}
                onChangeText={setSelectorQuery}
              />
            </View>

            <FlatList
              data={getSelectorOptions()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectorItem}
                  onPress={() => handleSelectOption(item)}
                >
                  <Ionicons name="paw-outline" size={16} color={colors.primary} />
                  <Text style={styles.selectorItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptySelector}>No results match your search.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: colors.headerBg,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 11,
    color: '#ccfbf1',
    marginTop: 2,
  },
  addBtn: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  listBody: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 12,
  },
  recordCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  doctorText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  diagnosisBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  diagnosisLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  diagnosisValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  notesText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  rxBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  rxText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 6,
  },
  attachmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 40,
  },
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  selectorBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 4,
  },
  selectorBtnText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: 12,
    height: 46,
    backgroundColor: colors.primaryLight,
    marginBottom: 4,
  },
  uploadBtnText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  selectorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    padding: 16,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectorSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    gap: 6,
    marginBottom: 12,
  },
  selectorSearchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  selectorItemText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  emptySelector: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13,
    marginVertical: 20,
  },
});
