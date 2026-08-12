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

export default function AssistanceTasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Task Modal
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('High');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/assistance-tasks').catch(() => ({ data: [] }));
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setTasks(data.length > 0 ? data : [
        { id: '1', title: 'Prepare Surgery Room 2 & Autoclave Instruments', assigned_to: 'Kara Danvers (Assistant)', priority: 'High', status: 'Pending', time: '09:30 AM' },
        { id: '2', title: 'Administer Evening IV Antibiotics for Max in Ward A', assigned_to: 'Kara Danvers (Assistant)', priority: 'High', status: 'Pending', time: '05:00 PM' },
        { id: '3', title: 'Disinfect Inpatient Cages & Restock Gauze Pads', assigned_to: 'Barry Allen (Reception/Assistant)', priority: 'Normal', status: 'Completed', time: '11:00 AM' },
      ]);
    } catch (err) {
      console.error('Error fetching assistance tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!taskTitle) {
      Alert.alert('Required', 'Please enter task description.');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      assigned_to: assignedTo || 'Vet Assistant Staff',
      priority,
      status: 'Pending',
      time: 'Today',
    };
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setTaskTitle('');
    setAssignedTo('');
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const renderTaskCard = ({ item }) => {
    const isCompleted = item.status === 'Completed';
    const isHigh = item.priority === 'High';

    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => toggleTaskStatus(item.id)}>
          <Ionicons
            name={isCompleted ? 'checkbox' : 'square-outline'}
            size={22}
            color={isCompleted ? colors.success : colors.primary}
          />
          <Text style={[styles.taskTitle, isCompleted && styles.taskCompleted]}>
            {item.title}
          </Text>
        </TouchableOpacity>

        <View style={styles.taskFooter}>
          <View style={[styles.priorityPill, isHigh ? styles.badgeHigh : styles.badgeNormal]}>
            <Text style={[styles.priorityText, isHigh ? { color: colors.danger } : { color: colors.info }]}>
              {item.priority || 'Normal'} Priority
            </Text>
          </View>

          <Text style={styles.assignedText}>Assigned: {item.assigned_to}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Clinic Assistance Tasks</Text>
          <Text style={styles.headerSub}>Care, medication & nursing tasks</Text>
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
          keyExtractor={item => item.id}
          renderItem={renderTaskCard}
          contentContainerStyle={styles.listBody}
        />
      )}

      {/* ADD TASK MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Assistance Task</Text>

            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Task Description (e.g. Clean Cage 102) *"
              placeholderTextColor={colors.textMuted}
              multiline
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            <TextInput
              style={styles.input}
              placeholder="Assign To Staff Member (e.g. Kara Danvers)"
              placeholderTextColor={colors.textMuted}
              value={assignedTo}
              onChangeText={setAssignedTo}
            />

            <View style={styles.priorityRow}>
              {['High', 'Normal', 'Low'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityChip, priority === p && styles.priorityChipActive]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.priorityChipText, priority === p && { color: '#fff' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddTask}>
                <Text style={styles.btnSubmitText}>Save Task</Text>
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
    justifyContent: 'center',
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
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  taskTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  taskCompleted: { textDecorationLine: 'line-through', color: colors.textMuted },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.divider },
  priorityPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeHigh: { backgroundColor: colors.dangerLight },
  badgeNormal: { backgroundColor: colors.infoLight },
  priorityText: { fontSize: 10, fontWeight: 'bold' },
  assignedText: { fontSize: 11, color: colors.textMuted },
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
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityChip: { flex: 1, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  priorityChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  priorityChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  btnCancelText: { color: colors.textSecondary, fontWeight: '600' },
  btnSubmit: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  btnSubmitText: { color: '#fff', fontWeight: 'bold' },
});
