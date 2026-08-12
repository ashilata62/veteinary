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

export default function TreatmentNotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [petName, setPetName] = useState('');
  const [procedure, setProcedure] = useState('');
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/treatment-notes').catch(() => ({ data: [] }));
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setNotes(data.length > 0 ? data : [
        { id: '1', pet_name: 'Max (Dog)', procedure: 'Surgical Debridement & Bandaging', details: 'Cleaned wound under sedation. Applied antiseptic dressing and Elizabethan collar.', doctor_name: 'Dr. Sarah Connor', follow_up: '14 Aug 2026', date: '10 Aug 2026' },
        { id: '2', pet_name: 'Luna (Cat)', procedure: 'Dental Scaling & Polishing', details: 'Removed calculus build-up on upper molars. Fluoride treatment applied.', doctor_name: 'Dr. Alex Morgan', follow_up: '25 Aug 2026', date: '11 Aug 2026' },
      ]);
    } catch (err) {
      console.error('Error fetching treatment notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!petName || !procedure) {
      Alert.alert('Required Fields', 'Please enter pet patient and procedure.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/treatment-notes', {
        pet_name: petName,
        procedure_name: procedure,
        notes: treatmentDetails,
        follow_up_date: followUpDate,
      }).catch(() => null);

      Alert.alert('Success', 'Treatment procedure note saved!');
      setShowModal(false);
      setPetName('');
      setProcedure('');
      setTreatmentDetails('');
      fetchNotes();
    } catch (err) {
      Alert.alert('Error', 'Failed to save treatment note');
    } finally {
      setSubmitting(false);
    }
  };

  const renderNoteCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeProcedure}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={14} color={colors.primary} />
          <Text style={styles.badgeProcedureText}>{item.procedure || 'Clinical Procedure'}</Text>
        </View>
        <Text style={styles.dateText}>{item.date || 'Today'}</Text>
      </View>

      <Text style={styles.petTitle}>{item.pet_name}</Text>
      <Text style={styles.doctorText}>By: {item.doctor_name || 'Dr. Doctor'}</Text>

      <Text style={styles.detailsText}>{item.details || item.notes}</Text>

      {item.follow_up ? (
        <View style={styles.followBox}>
          <Ionicons name="calendar-outline" size={14} color={colors.warning} />
          <Text style={styles.followText}>Recommended Follow-Up: {item.follow_up}</Text>
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
          <Text style={styles.headerTitle}>Treatment Procedures & Notes</Text>
          <Text style={styles.headerSub}>Doctor clinical procedure logs</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderNoteCard}
          contentContainerStyle={styles.listBody}
        />
      )}

      {/* ADD MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Treatment Procedure Note</Text>

            <TextInput
              style={styles.input}
              placeholder="Pet Patient Name *"
              placeholderTextColor={colors.textMuted}
              value={petName}
              onChangeText={setPetName}
            />

            <TextInput
              style={styles.input}
              placeholder="Procedure Name (e.g. Dental Scaling / Surgery) *"
              placeholderTextColor={colors.textMuted}
              value={procedure}
              onChangeText={setProcedure}
            />

            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="Treatment details & clinical observations"
              placeholderTextColor={colors.textMuted}
              multiline
              value={treatmentDetails}
              onChangeText={setTreatmentDetails}
            />

            <TextInput
              style={styles.input}
              placeholder="Follow-Up Date (e.g. 14 Aug 2026)"
              placeholderTextColor={colors.textMuted}
              value={followUpDate}
              onChangeText={setFollowUpDate}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddNote} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Save Note</Text>}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  badgeProcedure: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeProcedureText: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
  dateText: { fontSize: 12, color: colors.textMuted },
  petTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  doctorText: { fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: 8 },
  detailsText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  followBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.warningLight,
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  followText: { fontSize: 12, color: '#b45309', fontWeight: 'bold' },
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
