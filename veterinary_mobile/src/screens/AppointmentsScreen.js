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
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form selections & options
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Form Fields
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [isHomeVisit, setIsHomeVisit] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [timeHour, setTimeHour] = useState('10');
  const [timeMinute, setTimeMinute] = useState('00');
  const [timeAmPm, setTimeAmPm] = useState('AM');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState('');

  // Selector modallings
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorType, setSelectorType] = useState(''); // 'owner', 'pet', 'doctor'
  const [selectorQuery, setSelectorQuery] = useState('');

  const [appointments, setAppointments] = useState([
    {
      id: '101',
      petName: 'Buddy',
      ownerName: 'Rahul Sharma',
      appointment_date: '2026-08-13',
      appointment_time: '10:30:00',
      appointment_type: 'Clinic Visit',
      doctorName: 'Dr. Sarah Jenkins',
      status: 'Confirmed',
    },
    {
      id: '102',
      petName: 'Luna',
      ownerName: 'Priya Singh',
      appointment_date: '2026-08-13',
      appointment_time: '11:45:00',
      appointment_type: 'Home Visit',
      doctorName: 'Dr. Sarah Jenkins',
      status: 'In Progress',
    },
  ]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [aptsRes, ownersRes, petsRes, usersRes] = await Promise.all([
        api.get('/appointments').catch(() => ({ data: [] })),
        api.get('/owners').catch(() => ({ data: [] })),
        api.get('/pets').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] })),
      ]);

      const aptsList = aptsRes.data?.data || aptsRes.data || [];
      if (Array.isArray(aptsList) && aptsList.length > 0) {
        setAppointments(aptsList);
      }

      setOwners(ownersRes.data?.data || ownersRes.data || []);
      setPets(petsRes.data?.data || petsRes.data || []);
      
      const usersList = usersRes.data?.data || usersRes.data || [];
      setDoctors(usersList.filter(u => String(u.role).toLowerCase().includes('doctor') || String(u.role).toLowerCase().includes('admin')));
    } catch (err) {
      console.log('Failed to fetch screen resources, fallback to local presets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleOpenSelector = (type) => {
    setSelectorType(type);
    setSelectorQuery('');
    setSelectorVisible(true);
  };

  const handleSelectOption = (item) => {
    if (selectorType === 'owner') {
      setSelectedOwnerId(item.id);
      // Auto-select first pet of this owner
      const ownerPets = pets.filter(p => String(p.owner_id) === String(item.id));
      if (ownerPets.length > 0) {
        setSelectedPetId(ownerPets[0].id);
      } else {
        setSelectedPetId('');
      }
    } else if (selectorType === 'pet') {
      setSelectedPetId(item.id);
    } else if (selectorType === 'doctor') {
      setSelectedDoctorId(item.id);
    }
    setSelectorVisible(false);
  };

  const handleBookAppointment = async () => {
    if (!selectedPetId || !selectedDoctorId || !appointmentDate) {
      Alert.alert('Required Fields', 'Please select Pet Owner, Patient Pet, Consulting Doctor and Date.');
      return;
    }

    if (isHomeVisit && !address.trim()) {
      Alert.alert('Required Field', 'Please provide an address for the home visit.');
      return;
    }

    // Convert time to HH:MM:SS format
    let h = parseInt(timeHour, 10);
    if (timeAmPm === 'PM' && h < 12) h += 12;
    if (timeAmPm === 'AM' && h === 12) h = 0;
    const dbTime = `${h.toString().padStart(2, '0')}:${timeMinute}:00`;

    let endpoint = '/appointments';
    let payload = {
      petId: selectedPetId,
      doctorId: selectedDoctorId,
      appointmentDate,
      appointmentTime: dbTime,
      appointmentType: isHomeVisit ? 'Home Visit' : 'Clinic Visit',
      notes,
    };

    if (isHomeVisit) {
      endpoint = '/home-visits';
      payload = {
        ownerId: selectedOwnerId,
        petId: selectedPetId,
        doctorId: selectedDoctorId,
        appointmentDate,
        appointmentTime: dbTime,
        address: address || 'Address on file',
        travelFee: 0,
        notes,
      };
    }

    try {
      setLoading(true);
      const res = await api.post(endpoint, payload);
      Alert.alert('Success', isHomeVisit ? 'Home visit booked successfully!' : 'Appointment booked successfully!');
      
      setModalVisible(false);
      
      // Clear forms
      setSelectedOwnerId('');
      setSelectedPetId('');
      setSelectedDoctorId('');
      setNotes('');
      setAddress('');
      setIsHomeVisit(false);

      // Refresh list
      loadInitialData();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      if (newStatus === 'Cancelled') {
        await api.delete(`/appointments/${id}`);
        Alert.alert('Cancelled', 'Appointment has been cancelled successfully.');
      } else {
        await api.put(`/appointments/${id}`, { status: newStatus });
        Alert.alert('Updated', `Consultation marked as ${newStatus.toLowerCase()}.`);
      }
      loadInitialData();
    } catch (err) {
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  const triggerStatusMenu = (item) => {
    if (item.status === 'Completed' || item.status === 'Cancelled') return;
    Alert.alert('Update Status', 'Mark this consultation status:', [
      { text: 'Cancel Appointment', style: 'destructive', onPress: () => handleUpdateStatus(item.id, 'Cancelled') },
      { text: 'Mark as In Progress', onPress: () => handleUpdateStatus(item.id, 'In Progress') },
      { text: 'Mark as Completed', onPress: () => handleUpdateStatus(item.id, 'Completed') },
      { text: 'Dismiss', style: 'cancel' },
    ]);
  };

  const getOwnerLabel = () => {
    const o = owners.find(owner => owner.id === selectedOwnerId);
    return o ? o.name : 'Select Owner...';
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
    if (selectorType === 'owner') {
      return owners.filter(o => o.name.toLowerCase().includes(selectorQuery.toLowerCase()));
    }
    if (selectorType === 'pet') {
      return pets
        .filter(p => selectedOwnerId ? String(p.owner_id) === String(selectedOwnerId) : true)
        .filter(p => p.name.toLowerCase().includes(selectorQuery.toLowerCase()));
    }
    if (selectorType === 'doctor') {
      return doctors.filter(d => d.name.toLowerCase().includes(selectorQuery.toLowerCase()));
    }
    return [];
  };

  const filteredAppointments = appointments.filter((app) => {
    const pet = app.petName || '';
    const owner = app.ownerName || '';
    const matchesSearch =
      pet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && String(app.status).toLowerCase() === activeTab.toLowerCase();
  });

  const renderItem = ({ item }) => {
    const type = item.appointment_type || item.type || 'Clinic Visit';
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => triggerStatusMenu(item)}>
        <View style={styles.cardHeader}>
          <View style={styles.petBadge}>
            <MaterialCommunityIcons name="dog" size={20} color={colors.primary} />
            <Text style={styles.petName}>{item.petName || 'Unknown Pet'}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.status === 'Completed'
                ? { backgroundColor: colors.successLight }
                : item.status === 'In Progress'
                ? { backgroundColor: colors.infoLight }
                : item.status === 'Cancelled'
                ? { backgroundColor: colors.dangerLight }
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
                  : item.status === 'Cancelled'
                  ? { color: colors.danger }
                  : { color: colors.warning },
              ]}
            >
              {item.status || 'Scheduled'}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.ownerText}>Pet Owner: {item.ownerName || 'Unknown'}</Text>
          <View style={styles.typeRow}>
            <Ionicons name={type === 'Home Visit' ? 'home-outline' : 'business-outline'} size={14} color={colors.textSecondary} />
            <Text style={styles.typeText}>{type}</Text>
          </View>
          <Text style={styles.doctorText}>Assigned Doctor: {item.doctorName || item.doctor || 'Dr. Sarah Jenkins'}</Text>
          {item.notes ? <Text style={styles.notesText}>Notes: {item.notes}</Text> : null}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.timeInfo}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.footerText}>{item.appointment_date || 'Today'}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.footerText}>{item.appointment_time || '10:30 AM'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          placeholderTextColor={colors.textMuted}
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

      {/* Schedule Modal (Form) */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Book Consultation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Owner Selection Selector */}
              <Text style={styles.label}>Client / Pet Owner *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('owner')}>
                <Text style={styles.selectorBtnText}>{getOwnerLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Patient Pet Selector */}
              <Text style={styles.label}>Patient Pet *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('pet')}>
                <Text style={styles.selectorBtnText}>{getPetLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Doctor Selector */}
              <Text style={styles.label}>Consulting Doctor *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('doctor')}>
                <Text style={styles.selectorBtnText}>{getDoctorLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Date Input */}
              <Text style={styles.label}>Consultation Date *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                value={appointmentDate}
                onChangeText={setAppointmentDate}
              />

              {/* Time Selector */}
              <Text style={styles.label}>Time Slot (HH:MM AM/PM) *</Text>
              <View style={styles.timeSelectRow}>
                <TextInput
                  style={[styles.modalInput, { flex: 1, marginBottom: 0 }]}
                  placeholder="Hour"
                  value={timeHour}
                  onChangeText={setTimeHour}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TextInput
                  style={[styles.modalInput, { flex: 1, marginBottom: 0 }]}
                  placeholder="Min"
                  value={timeMinute}
                  onChangeText={setTimeMinute}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TouchableOpacity
                  style={styles.ampmBtn}
                  onPress={() => setTimeAmPm(timeAmPm === 'AM' ? 'PM' : 'AM')}
                >
                  <Text style={styles.ampmBtnText}>{timeAmPm}</Text>
                </TouchableOpacity>
              </View>

              {/* Home Visit toggle */}
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Schedule as Home Visit</Text>
                <Switch
                  value={isHomeVisit}
                  onValueChange={setIsHomeVisit}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              {/* Home Visit Address */}
              {isHomeVisit && (
                <>
                  <Text style={styles.label}>Home Visit Address *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Full street address..."
                    placeholderTextColor={colors.textMuted}
                    value={address}
                    onChangeText={setAddress}
                  />
                </>
              )}

              {/* Notes */}
              <Text style={styles.label}>Consultation Reason / Notes</Text>
              <TextInput
                style={[styles.modalInput, { height: 60, textAlignVertical: 'top' }]}
                placeholder="Describe symptoms or reason..."
                placeholderTextColor={colors.textMuted}
                multiline
                value={notes}
                onChangeText={setNotes}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleBookAppointment} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Book & Send Reminders</Text>}
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
                  <Ionicons name="person-outline" size={16} color={colors.primary} />
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabChipTextActive: {
    color: colors.primary,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  petName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    gap: 4,
  },
  ownerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  doctorText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  notesText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
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
    paddingVertical: 60,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
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
  modalTitle: {
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
  modalInput: {
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
  timeSelectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  ampmBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '50',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ampmBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
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
