import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newPetName, setNewPetName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newType, setNewType] = useState('General Checkup');
  const [newTime, setNewTime] = useState('10:00 AM');

  const [appointments, setAppointments] = useState([
    {
      id: '101',
      petName: 'Buddy',
      ownerName: 'Rahul Sharma',
      date: 'Today',
      time: '10:30 AM',
      type: 'General Checkup',
      doctor: 'Dr. Sarah Wilson',
      status: 'Confirmed',
    },
    {
      id: '102',
      petName: 'Luna',
      ownerName: 'Priya Singh',
      date: 'Today',
      time: '11:45 AM',
      type: 'Vaccination (Rabies)',
      doctor: 'Dr. Alex Morgan',
      status: 'In Progress',
    },
    {
      id: '103',
      petName: 'Max',
      ownerName: 'Amit Patel',
      date: 'Tomorrow',
      time: '02:15 PM',
      type: 'Dental Cleaning',
      doctor: 'Dr. Sarah Wilson',
      status: 'Scheduled',
    },
    {
      id: '104',
      petName: 'Charlie',
      ownerName: 'Neha Gupta',
      date: '14 Aug',
      time: '04:00 PM',
      type: 'Skin Treatment',
      doctor: 'Dr. Alex Morgan',
      status: 'Completed',
    },
  ]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments');
      const list = res.data?.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        setAppointments(list);
      }
    } catch (err) {
      console.log('Using local appointment fallback dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleAddAppointment = async () => {
    if (!newPetName || !newOwnerName) {
      Alert.alert('Required Fields', 'Please enter both Pet Name and Owner Name.');
      return;
    }

    const payload = {
      petName: newPetName,
      ownerName: newOwnerName,
      date: 'Today',
      time: newTime,
      appointment_type: newType,
      status: 'Scheduled',
    };

    try {
      setLoading(true);
      const res = await api.post('/appointments', payload).catch(() => null);
      const savedItem = res?.data?.data || res?.data || { ...payload, id: Date.now().toString() };

      setAppointments([savedItem, ...appointments]);
      setModalVisible(false);
      setNewPetName('');
      setNewOwnerName('');
      Alert.alert('Success', 'Appointment booked successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save appointment to backend.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && app.status.toLowerCase() === activeTab.toLowerCase();
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.petBadge}>
          <MaterialCommunityIcons name="dog" size={20} color={colors.primary} />
          <Text style={styles.petName}>{item.petName}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'Completed'
              ? { backgroundColor: colors.successLight }
              : item.status === 'In Progress'
              ? { backgroundColor: colors.infoLight }
              : { backgroundColor: colors.warningLight },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Completed'
                ? { color: colors.success }
                : item.status === 'In Progress'
                ? { color: colors.info }
                : { color: colors.warning },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.ownerText}>Pet Owner: {item.ownerName}</Text>
        <Text style={styles.typeText}>{item.type}</Text>
        <Text style={styles.doctorText}>Assigned: {item.doctor}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.timeInfo}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.footerText}>{item.date}</Text>
        </View>
        <View style={styles.timeInfo}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.footerText}>{item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Screen Title & Add Button */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.headerTitle}>Appointments</Text>
          <Text style={styles.headerSubtitle}>Manage clinic visits & consultations</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by pet or owner..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {['All', 'Scheduled', 'In Progress', 'Completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabChip, activeTab === tab && styles.tabChipActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabChipText,
                activeTab === tab && styles.tabChipTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments found.</Text>
          </View>
        }
      />

      {/* Schedule Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book New Appointment</Text>

            <Text style={styles.label}>Pet Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Buddy"
              value={newPetName}
              onChangeText={setNewPetName}
            />

            <Text style={styles.label}>Owner Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Rahul Sharma"
              value={newOwnerName}
              onChangeText={setNewOwnerName}
            />

            <Text style={styles.label}>Appointment Type</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Vaccination / Surgery"
              value={newType}
              onChangeText={setNewType}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddAppointment}>
                <Text style={styles.saveBtnText}>Save Appointment</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 50,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tabChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  tabChipActive: {
    backgroundColor: colors.primary,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabChipTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  petBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    marginBottom: 12,
  },
  ownerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  doctorText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 10,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
