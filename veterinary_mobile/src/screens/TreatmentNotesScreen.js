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

const NOTE_TYPES = ['observation', 'vitals', 'medication'];

export default function TreatmentNotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchingNotes, setFetchingNotes] = useState(false);

  // Add Log Modal Form State
  const [showModal, setShowModal] = useState(false);
  const [noteType, setNoteType] = useState('observation');
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pet Selector Modal State
  const [petSelectorVisible, setPetSelectorVisible] = useState(false);
  const [petQuery, setPetQuery] = useState('');

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/pets').catch(() => ({ data: [] }));
      const petsList = res.data?.data || res.data || [];
      setPets(petsList);
      if (petsList.length > 0) {
        setSelectedPetId(petsList[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setLoading(false);
    }
  };

  const fetchNotes = async (petId) => {
    if (!petId) return;
    try {
      setFetchingNotes(true);
      const res = await api.get(`/treatment-notes?petId=${petId}`).catch(() => ({ data: [] }));
      const list = res.data?.data || res.data || [];
      setNotes(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching treatment notes:', err);
    } finally {
      setFetchingNotes(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (selectedPetId) {
      fetchNotes(selectedPetId);
    }
  }, [selectedPetId]);

  const handleAddNote = async () => {
    if (!selectedPetId) {
      Alert.alert('Selection Required', 'Please select a pet patient.');
      return;
    }
    if (!noteText.trim()) {
      Alert.alert('Required Field', 'Please enter some clinical note observations.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/treatment-notes', {
        pet_id: selectedPetId,
        note_type: noteType,
        note_text: noteText.trim(),
      });

      Alert.alert('Success', 'Clinical log progress note saved!');
      setShowModal(false);
      setNoteText('');
      setNoteType('observation');
      fetchNotes(selectedPetId);
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to save treatment note. Please verify if the pet has a clinical encounter created first.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPetSelector = () => {
    setPetQuery('');
    setPetSelectorVisible(true);
  };

  const handleSelectPet = (pet) => {
    setSelectedPetId(pet.id);
    setPetSelectorVisible(false);
  };

  const getPetLabel = () => {
    const p = pets.find(pet => pet.id === selectedPetId);
    return p ? `${p.name} (${p.breed || p.species || ''})` : 'Choose Patient Pet...';
  };

  const getFilteredPets = () => {
    return pets.filter(p => p.name.toLowerCase().includes(petQuery.toLowerCase()));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vitals': return 'thermometer';
      case 'medication': return 'flask';
      default: return 'eye';
    }
  };

  const renderNoteCard = ({ item }) => {
    const icon = getTypeIcon(item.note_type);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.badgeType}>
            <MaterialCommunityIcons name={icon} size={14} color={colors.primary} />
            <Text style={styles.badgeTypeText}>{item.note_type?.toUpperCase() || 'OBSERVATION'}</Text>
          </View>
          <Text style={styles.dateText}>{item.created_at?.split('T')[0] || 'Today'}</Text>
        </View>

        <Text style={styles.detailsText}>{item.note_text}</Text>
        <Text style={styles.doctorText}>Logged by: {item.doctor_name || 'Dr. On Duty'}</Text>
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
          <Text style={styles.headerTitle}>Treatment Logs & Progress</Text>
          <Text style={styles.headerSub}>Observation charts, vitals & medication logs</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Active Pet Selector Bar */}
      <View style={styles.petSelectorBar}>
        <Text style={styles.selectorBarLabel}>Active Patient Record:</Text>
        <TouchableOpacity style={styles.selectorBarBtn} onPress={handleOpenPetSelector}>
          <Text style={styles.selectorBarBtnText}>{getPetLabel()}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading || fetchingNotes ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderNoteCard}
          contentContainerStyle={styles.listBody}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No clinical treatment notes logged for this pet.</Text>
          }
        />
      )}

      {/* ADD LOG ENTRY MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Add Clinical Log</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Pet selection confirmation */}
              <Text style={styles.label}>Patient Pet</Text>
              <View style={styles.readOnlyPet}>
                <Ionicons name="paw" size={16} color={colors.textSecondary} />
                <Text style={styles.readOnlyPetText}>{getPetLabel()}</Text>
              </View>

              {/* Note Type Tab Chips */}
              <Text style={styles.label}>Log Entry Type *</Text>
              <View style={styles.tabContainer}>
                {NOTE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.tabChip, noteType === type && styles.tabChipActive]}
                    onPress={() => setNoteType(type)}
                  >
                    <Text style={[styles.tabChipText, noteType === type && styles.tabChipTextActive]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Note Text */}
              <Text style={styles.label}>Observations & Notes *</Text>
              <TextInput
                style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                placeholder="Describe observations, vitals charts (temp/weight), or drugs administered..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={noteText}
                onChangeText={setNoteText}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddNote} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Add Log Entry</Text>}
              </TouchableOpacity>
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
  petSelectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectorBarLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  selectorBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectorBarBtnText: { fontSize: 13, fontWeight: '700', color: colors.primary },
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
  badgeType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeTypeText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  dateText: { fontSize: 12, color: colors.textMuted },
  detailsText: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  doctorText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  loaderCenter: { flex: 1, justify: 'center', justifyContent: 'center', alignItems: 'center' },
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
  readOnlyPet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 4,
  },
  readOnlyPetText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  tabContainer: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tabChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabChipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  tabChipText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  tabChipTextActive: { color: colors.primary },
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
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
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
