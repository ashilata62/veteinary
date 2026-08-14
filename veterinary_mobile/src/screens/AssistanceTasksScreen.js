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

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const TASK_TYPES = ['Surgery Prep', 'Lab Test', 'Treatment', 'Emergency'];

export default function AssistanceTasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Task Modal Form States
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedPetName, setSelectedPetName] = useState('');
  const [taskType, setTaskType] = useState('Treatment');
  const [priority, setPriority] = useState('Medium');
  const [scheduledTime, setScheduledTime] = useState('ASAP');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Selector drop-down states
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorType, setSelectorType] = useState(''); // 'pet', 'priority', 'taskType'
  const [petQuery, setPetQuery] = useState('');

  const fetchScreenResources = async () => {
    try {
      setLoading(true);
      const [tasksRes, petsRes] = await Promise.all([
        api.get('/assistance-tasks').catch(() => ({ data: [] })),
        api.get('/pets').catch(() => ({ data: [] })),
      ]);

      const tasksList = tasksRes.data?.data || tasksRes.data || [];
      setTasks(Array.isArray(tasksList) && tasksList.length > 0 ? tasksList : [
        { id: 1, title: 'Prepare Surgery Room 2 & Autoclave Instruments', doctor_name: 'Dr. Sarah Connor', patient_name: 'Max (Dog)', task_type: 'Surgery Prep', priority: 'High', scheduled_time: '09:30 AM', status: 'Pending', notes: 'Urgent' },
        { id: 2, title: 'Administer Evening IV Antibiotics for Max in Ward A', doctor_name: 'Dr. Sarah Connor', patient_name: 'Max (Dog)', task_type: 'Treatment', priority: 'High', scheduled_time: '05:00 PM', status: 'Pending', notes: '' },
      ]);

      setPets(petsRes.data?.data || petsRes.data || []);
    } catch (err) {
      console.error('Error loading task board assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenResources();
  }, []);

  const handleOpenSelector = (type) => {
    setSelectorType(type);
    setPetQuery('');
    setSelectorVisible(true);
  };

  const handleSelectOption = (item) => {
    if (selectorType === 'pet') {
      setSelectedPetName(item.name);
    } else if (selectorType === 'priority') {
      setPriority(item);
    } else if (selectorType === 'taskType') {
      setTaskType(item);
    }
    setSelectorVisible(false);
  };

  const getSelectorOptions = () => {
    if (selectorType === 'pet') {
      return pets.filter(p => p.name.toLowerCase().includes(petQuery.toLowerCase()));
    }
    if (selectorType === 'priority') return PRIORITIES;
    if (selectorType === 'taskType') return TASK_TYPES;
    return [];
  };

  const handleAddTask = async () => {
    if (!title.trim() || !selectedPetName) {
      Alert.alert('Required Fields', 'Please enter Task Title and select Patient Pet.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/assistance-tasks', {
        title: title.trim(),
        patient_name: selectedPetName,
        task_type: taskType,
        priority,
        scheduled_time: scheduledTime,
        notes: notes.trim(),
      });

      Alert.alert('Success', 'Assistance task created successfully!');
      setShowModal(false);
      
      // Clear forms
      setTitle('');
      setSelectedPetName('');
      setTaskType('Treatment');
      setPriority('Medium');
      setScheduledTime('ASAP');
      setNotes('');

      fetchScreenResources();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to assign assistance task.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      // Opt-in PATCH status update on backend
      await api.patch(`/assistance-tasks/${id}/status`, { status: nextStatus });
      // Update state locally for instant visual feedback
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    } catch (err) {
      console.log('Failed to update task status on server.');
    }
  };

  const getPetLabel = () => {
    return selectedPetName ? selectedPetName : 'Select Patient Pet...';
  };

  const renderTaskCard = ({ item }) => {
    const isCompleted = item.status === 'Completed';
    const isCritical = item.priority === 'Critical' || item.priority === 'High';

    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleTaskStatus(item.id, item.status)}>
          <Ionicons
            name={isCompleted ? 'checkbox' : 'square-outline'}
            size={22}
            color={isCompleted ? colors.success : colors.primary}
          />
          <Text style={[styles.taskTitle, isCompleted && styles.taskCompleted]}>
            {item.title}
          </Text>
        </TouchableOpacity>

        <View style={styles.taskDetails}>
          <Text style={styles.detailText}>Patient: <Text style={styles.boldText}>{item.patient_name || 'Clinic Patient'}</Text></Text>
          <Text style={styles.detailText}>Assigned By: {item.doctor_name || 'Dr. On Duty'}</Text>
          {item.notes ? <Text style={styles.notesText}>Notes: {item.notes}</Text> : null}
        </View>

        <View style={styles.taskFooter}>
          <View style={[styles.priorityPill, isCritical ? styles.badgeHigh : styles.badgeNormal]}>
            <Text style={[styles.priorityText, isCritical ? { color: colors.danger } : { color: colors.info }]}>
              {item.priority || 'Medium'} Priority
            </Text>
          </View>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.footerTimeText}>{item.scheduled_time || 'ASAP'}</Text>
          </View>
        </View>
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
          <Text style={styles.headerTitle}>Assistance Board</Text>
          <Text style={styles.headerSub}>Ward tasks assigned to veterinary assistants</Text>
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
          data={tasks}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderTaskCard}
          contentContainerStyle={styles.listBody}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No assistant tasks registered.</Text>
          }
        />
      )}

      {/* ASSIGN NEW TASK MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Assign Assistance Task</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Task Title */}
              <Text style={styles.label}>Task Description / Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Check ICU Unit 1 Vitals every 30 mins"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />

              {/* Patient Selector */}
              <Text style={styles.label}>Patient Pet *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('pet')}>
                <Text style={styles.selectorBtnText}>{getPetLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.dropdownRow}>
                {/* Task Type selector */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Task Type</Text>
                  <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('taskType')}>
                    <Text style={styles.selectorBtnText}>{taskType}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Priority selector */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Priority Level</Text>
                  <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('priority')}>
                    <Text style={styles.selectorBtnText}>{priority}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Scheduled Time */}
              <Text style={styles.label}>Scheduled Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. ASAP / 08:00 PM"
                placeholderTextColor={colors.textMuted}
                value={scheduledTime}
                onChangeText={setScheduledTime}
              />

              {/* Notes */}
              <Text style={styles.label}>Instructions Notes</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Specific instructions details..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={notes}
                onChangeText={setNotes}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddTask} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Assign Task</Text>}
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

            {selectorType === 'pet' && (
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
            )}

            <FlatList
              data={getSelectorOptions()}
              keyExtractor={(item) => (selectorType === 'pet' ? item.id.toString() : item)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectorItem}
                  onPress={() => handleSelectOption(selectorType === 'pet' ? item : item)}
                >
                  <Text style={styles.selectorItemText}>{selectorType === 'pet' ? item.name : item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptySelector}>No options available.</Text>
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
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  taskTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  taskCompleted: { textDecorationLine: 'line-through', color: colors.textMuted },
  taskDetails: { paddingLeft: 32, gap: 2 },
  detailText: { fontSize: 13, color: colors.textSecondary },
  boldText: { fontWeight: '700', color: colors.textPrimary },
  notesText: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
    marginLeft: 32,
  },
  priorityPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeHigh: { backgroundColor: colors.dangerLight },
  badgeNormal: { backgroundColor: colors.infoLight },
  priorityText: { fontSize: 11, fontWeight: '700' },
  timeInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerTimeText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
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
