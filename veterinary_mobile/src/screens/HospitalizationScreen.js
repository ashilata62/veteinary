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
  Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';

const CAGE_TEMPLATES = [
  { id: 'ICU-01', name: 'ICU Unit 1', type: 'ICU' },
  { id: 'ICU-02', name: 'ICU Unit 2', type: 'ICU' },
  { id: 'CAGE-A1', name: 'Cage A-1 (Large)', type: 'Standard Large' },
  { id: 'CAGE-B2', name: 'Cage B-2 (Medium)', type: 'Standard Medium' },
  { id: 'CAGE-C3', name: 'Cage C-3 (Small)', type: 'Standard Small' },
  { id: 'CAGE-D4', name: 'Cage D-4 (Small)', type: 'Standard Small' }
];

export default function HospitalizationScreen({ navigation }) {
  const [cages, setCages] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admit Modal State
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [targetCage, setTargetCage] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [admissionReason, setAdmissionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Add Cage Template modal
  const [showAddCageModal, setShowAddCageModal] = useState(false);

  // Pet Selector Modal State
  const [petSelectorVisible, setPetSelectorVisible] = useState(false);
  const [petQuery, setPetQuery] = useState('');

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      const [cagesRes, petsRes] = await Promise.all([
        api.get('/hospitalization/cages').catch(() => ({ data: [] })),
        api.get('/pets').catch(() => ({ data: [] })),
      ]);

      const cagesList = cagesRes.data?.data || cagesRes.data || [];
      setCages(cagesList.length > 0 ? cagesList : [
        { id: 'ICU-01', name: 'ICU Unit 1', type: 'ICU', status: 'Vacant' },
        { id: 'CAGE-A1', name: 'Cage A-1 (Large)', type: 'Standard Large', status: 'Vacant' },
      ]);
      setPets(petsRes.data?.data || petsRes.data || []);
    } catch (err) {
      console.log('Failed to fetch inpatient board, using mock board fallback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  const handleOpenPetSelector = () => {
    setPetQuery('');
    setPetSelectorVisible(true);
  };

  const handleSelectPet = (pet) => {
    setSelectedPetId(pet.id);
    setPetSelectorVisible(false);
  };

  const handleAdmitClick = (cage) => {
    setTargetCage(cage);
    setSelectedPetId('');
    setAdmissionReason('');
    setShowAdmitModal(true);
  };

  const handleAdmitSubmit = async () => {
    if (!selectedPetId || !admissionReason.trim()) {
      Alert.alert('Required Fields', 'Please select a pet and specify admission reason.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/hospitalization/cages/${targetCage.id}/admit`, {
        petId: selectedPetId,
        reason: admissionReason
      });
      Alert.alert('Success', 'Patient admitted to cage successfully.');
      setShowAdmitModal(false);
      fetchBoardData();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to admit patient.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDischarge = async (cage) => {
    Alert.alert(
      'Discharge Inpatient',
      `Are you sure you want to discharge the patient in ${cage.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discharge',
          onPress: async () => {
            try {
              setLoading(true);
              await api.post(`/hospitalization/cages/${cage.id}/discharge`);
              Alert.alert('Discharged', 'Inpatient discharged. Cage requires sanitization.');
              fetchBoardData();
            } catch (err) {
              Alert.alert('Error', 'Failed to discharge patient.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSanitizeCage = async (cageId) => {
    try {
      setLoading(true);
      await api.post(`/hospitalization/cages/${cageId}/clean`);
      Alert.alert('Sanitized', 'Cage is now sanitized and marked Vacant.');
      fetchBoardData();
    } catch (err) {
      Alert.alert('Error', 'Failed to clean cage.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCage = async (template) => {
    const exists = cages.some(c => c.id === template.id);
    if (exists) {
      Alert.alert('Already Added', `${template.name} is already on the board.`);
      return;
    }
    try {
      setLoading(true);
      await api.post('/hospitalization/cages', {
        id: template.id,
        name: template.name,
        type: template.type,
        status: 'Vacant'
      });
      Alert.alert('Cage Added', `${template.name} added to inpatient board.`);
      setShowAddCageModal(false);
      fetchBoardData();
    } catch (err) {
      Alert.alert('Error', 'Failed to add cage.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCage = async (cageId) => {
    Alert.alert(
      'Remove Cage',
      'Remove this cage from the ward board?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete(`/hospitalization/cages/${cageId}`);
              Alert.alert('Removed', 'Cage removed from board.');
              fetchBoardData();
            } catch (err) {
              Alert.alert('Error', 'Failed to remove cage.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const toggleFlowsheetItem = async (cage, task) => {
    const currentFlowsheet = cage.flowsheet || { medsMorning: false, medsEvening: false, feed: false, clean: false };
    const updatedFlowsheet = {
      ...currentFlowsheet,
      [task]: !currentFlowsheet[task]
    };
    try {
      await api.put(`/hospitalization/cages/${cage.id}/flowsheet`, {
        flowsheet: updatedFlowsheet
      });
      // update state locally for smooth checkbox feedback
      setCages(prev => prev.map(c => c.id === cage.id ? { ...c, flowsheet: updatedFlowsheet } : c));
    } catch (err) {
      console.log('Failed to update flowsheet task checklist.');
    }
  };

  const getPetLabel = () => {
    const p = pets.find(pet => pet.id === selectedPetId);
    return p ? `${p.name} (${p.breed || 'Dog'})` : 'Select Pet...';
  };

  const getFilteredPets = () => {
    return pets.filter(p => p.name.toLowerCase().includes(petQuery.toLowerCase()));
  };

  const renderCageCard = ({ item }) => {
    const isOccupied = item.status === 'Occupied' || item.status === 'Occupied ICU';
    const isCleaning = item.status === 'Cleaning Needed' || item.status === 'Maintenance';
    const flowsheet = item.flowsheet || { medsMorning: false, medsEvening: false, feed: false, clean: false };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.wardPill}>
            <MaterialCommunityIcons name="hospital-building" size={16} color={colors.primary} />
            <Text style={styles.wardText}>{item.name} • {item.type}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            isOccupied ? styles.badgeDanger : isCleaning ? styles.badgeWarning : styles.badgeSuccess
          ]}>
            <Text style={[
              styles.statusBadgeText,
              isOccupied ? { color: colors.danger } : isCleaning ? { color: colors.warning } : { color: colors.success }
            ]}>
              {item.status || 'Vacant'}
            </Text>
          </View>
        </View>

        {isOccupied ? (
          <View style={styles.occupiedContent}>
            <Text style={styles.petTitle}>{item.petName || 'Inpatient'}</Text>
            {item.breed ? <Text style={styles.breedText}>Breed: {item.breed}</Text> : null}
            <Text style={styles.reasonText}>Reason: {item.reason || 'Observation'}</Text>
            
            {/* Flowsheet checklist */}
            <Text style={styles.flowsheetTitle}>Flowsheet Checklist</Text>
            <View style={styles.flowsheetGrid}>
              <TouchableOpacity style={styles.checkItem} onPress={() => toggleFlowsheetItem(item, 'medsMorning')}>
                <Ionicons name={flowsheet.medsMorning ? 'checkbox' : 'square-outline'} size={18} color={colors.primary} />
                <Text style={styles.checkText}>Meds AM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkItem} onPress={() => toggleFlowsheetItem(item, 'medsEvening')}>
                <Ionicons name={flowsheet.medsEvening ? 'checkbox' : 'square-outline'} size={18} color={colors.primary} />
                <Text style={styles.checkText}>Meds PM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkItem} onPress={() => toggleFlowsheetItem(item, 'feed')}>
                <Ionicons name={flowsheet.feed ? 'checkbox' : 'square-outline'} size={18} color={colors.primary} />
                <Text style={styles.checkText}>Feed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkItem} onPress={() => toggleFlowsheetItem(item, 'clean')}>
                <Ionicons name={flowsheet.clean ? 'checkbox' : 'square-outline'} size={18} color={colors.primary} />
                <Text style={styles.checkText}>Clean</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnDischarge} onPress={() => handleDischarge(item)}>
              <Ionicons name="log-out-outline" size={16} color="#fff" />
              <Text style={styles.btnDischargeText}>Discharge Patient</Text>
            </TouchableOpacity>
          </View>
        ) : isCleaning ? (
          <View style={styles.cleaningContent}>
            <Text style={styles.cleanLabel}>Requires Sanitization & Disinfection</Text>
            <TouchableOpacity style={styles.btnSanitize} onPress={() => handleSanitizeCage(item.id)}>
              <Ionicons name="sparkles" size={16} color="#fff" />
              <Text style={styles.btnSanitizeText}>Sanitize & Open Cage</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.vacantContent}>
            <Text style={styles.vacantLabel}>This unit is clean and available.</Text>
            <View style={styles.vacantActions}>
              <TouchableOpacity style={styles.btnAdmit} onPress={() => handleAdmitClick(item)}>
                <Ionicons name="add-circle-outline" size={16} color="#fff" />
                <Text style={styles.btnAdmitText}>Admit Inpatient</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDeleteCage} onPress={() => handleRemoveCage(item.id)}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBg} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Ward Hospitalization</Text>
          <Text style={styles.headerSub}>Real-time cage flowsheet & inpatient tracking</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddCageModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={cages}
          keyExtractor={(item) => item.id}
          renderItem={renderCageCard}
          contentContainerStyle={styles.listBody}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No cages registered on ward board.</Text>
          }
        />
      )}

      {/* ADMISSION FORM MODAL */}
      <Modal visible={showAdmitModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Admit Patient ({targetCage?.name})</Text>
              <TouchableOpacity onPress={() => setShowAdmitModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Pet Selector */}
              <Text style={styles.label}>Select Patient Pet *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={handleOpenPetSelector}>
                <Text style={styles.selectorBtnText}>{getPetLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Admission Reason */}
              <Text style={styles.label}>Admission Reason / Diagnosis *</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Specify reason or post-op instructions..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={admissionReason}
                onChangeText={setAdmissionReason}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleAdmitSubmit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Admit Patient</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ADD CAGE MODAL */}
      <Modal visible={showAddCageModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Add Ward Cage Unit</Text>
              <TouchableOpacity onPress={() => setShowAddCageModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <Text style={styles.label}>Select Cage Template to Add</Text>
              {CAGE_TEMPLATES.map((tmpl) => (
                <TouchableOpacity key={tmpl.id} style={styles.templateItem} onPress={() => handleAddCage(tmpl)}>
                  <MaterialCommunityIcons name="cube-outline" size={20} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.templateName}>{tmpl.name}</Text>
                    <Text style={styles.templateType}>{tmpl.type}</Text>
                  </View>
                  <Ionicons name="add-circle" size={20} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Pet Selector Search Modal */}
      <Modal visible={petSelectorVisible} transparent animationType="fade">
        <View style={styles.selectorOverlay}>
          <View style={styles.selectorContent}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>Select Patient Pet</Text>
              <TouchableOpacity onPress={() => setPetSelectorVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.selectorSearch}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.selectorSearchInput}
                placeholder="Search pet..."
                placeholderTextColor={colors.textMuted}
                value={petQuery}
                onChangeText={setPetQuery}
              />
            </View>

            <FlatList
              data={getFilteredPets()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectorItem}
                  onPress={() => handleSelectPet(item)}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wardText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeDanger: { backgroundColor: colors.dangerLight },
  badgeWarning: { backgroundColor: colors.warningLight },
  badgeSuccess: { backgroundColor: colors.successLight },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  occupiedContent: { gap: 6, marginTop: 4 },
  petTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  breedText: { fontSize: 12, color: colors.textSecondary },
  reasonText: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', marginBottom: 6 },
  flowsheetTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 4 },
  flowsheetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: '45%',
  },
  checkText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  btnDischarge: {
    backgroundColor: colors.danger,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  btnDischargeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  cleaningContent: { gap: 10, marginTop: 8, alignItems: 'center' },
  cleanLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  btnSanitize: {
    backgroundColor: colors.primary,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
  },
  btnSanitizeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  vacantContent: { gap: 8, marginTop: 4 },
  vacantLabel: { fontSize: 13, color: colors.textMuted },
  vacantActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  btnAdmit: {
    backgroundColor: colors.success,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    flex: 1,
  },
  btnAdmitText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  btnDeleteCage: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 14, marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalHeaderTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
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
    marginBottom: 4,
  },
  selectorBtnText: { fontSize: 14, color: colors.textPrimary },
  dropdownRow: { flexDirection: 'row', gap: 12 },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  templateName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  templateType: { fontSize: 12, color: colors.textSecondary },
  selectorOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  selectorContent: { backgroundColor: colors.surface, borderRadius: 16, width: '85%', maxHeight: '70%', padding: 16 },
  selectorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  selectorTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
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
  selectorSearchInput: { flex: 1, fontSize: 13, color: colors.textPrimary },
  selectorItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.divider },
  selectorItemText: { fontSize: 14, color: colors.textPrimary },
  emptySelector: { textAlign: 'center', color: colors.textMuted, fontSize: 13, marginVertical: 20 },
});
