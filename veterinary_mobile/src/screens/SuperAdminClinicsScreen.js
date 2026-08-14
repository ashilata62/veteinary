import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';

const darkTheme = {
  bg: '#f8fafc',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  primary: '#0f766e',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  success: '#22c55e',
  successBg: '#dcfce7',
  warning: '#f59e0b',
  warningBg: '#fef3c7',
  danger: '#ef4444',
  dangerBg: '#fee2e2',
};

export default function SuperAdminClinicsScreen() {
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [clinics, setClinics] = useState([
    { id: '1', name: 'Downtown Vet Clinic', adminName: 'Dr. John Doe', email: 'john@downtown.com', phone: '+91 98765 43210', currentPlan: 'Monthly Pro', subStatus: 'Active', expiryDate: '10 Sep 2026' },
    { id: '2', name: 'Pet Care Central', adminName: 'Dr. Jane Smith', email: 'jane@petcare.com', phone: '+91 98123 45678', currentPlan: '7-Day Trial', subStatus: 'Trial', expiryDate: '15 Aug 2026' },
    { id: '3', name: 'Paws & Claws Care', adminName: 'Dr. Vikram Singh', email: 'vikram@pawsclaws.in', phone: '+91 99887 76655', currentPlan: 'Yearly Enterprise', subStatus: 'Active', expiryDate: '20 May 2027' },
    { id: '4', name: 'City Animal Hospital', adminName: 'Dr. Anjali Sharma', email: 'anjali@cityvet.com', phone: '+91 97654 32109', currentPlan: 'Monthly Pro', subStatus: 'Suspended', expiryDate: '15 Jul 2026' },
    { id: '5', name: 'Happy Tails Pet Clinic', adminName: 'Rajesh Kumar', email: 'rajesh@happytails.com', phone: '+91 96543 21098', currentPlan: '7-Day Trial', subStatus: 'Trial', expiryDate: '12 Aug 2026' },
  ]);

  const fetchClinics = async () => {
    try {
      const res = await api.get('/super-admin/clinics');
      const list = res.data?.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        setClinics(list);
      }
    } catch (e) {
      console.log('Using default clinics dataset');
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleToggleStatus = (id) => {
    setClinics((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.subStatus === 'Active' ? 'Suspended' : 'Active';
          return { ...c, subStatus: newStatus };
        }
        return c;
      })
    );
  };

  const filteredClinics = clinics.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && c.subStatus.toLowerCase() === statusFilter.toLowerCase();
  });

  const renderClinicCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.clinicIconBox}>
          <MaterialCommunityIcons name="office-building" size={22} color={darkTheme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.clinicName}>{item.name}</Text>
          <Text style={styles.adminName}>Admin: {item.adminName}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            item.subStatus === 'Active'
              ? { backgroundColor: darkTheme.successBg }
              : item.subStatus === 'Trial'
              ? { backgroundColor: darkTheme.warningBg }
              : { backgroundColor: darkTheme.dangerBg },
          ]}
        >
          <Text
            style={[
              styles.statusPillText,
              item.subStatus === 'Active'
                ? { color: darkTheme.success }
                : item.subStatus === 'Trial'
                ? { color: darkTheme.warning }
                : { color: darkTheme.danger },
            ]}
          >
            {item.subStatus}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.infoText}>Email: {item.email}</Text>
        <Text style={styles.infoText}>Phone: {item.phone}</Text>
        <Text style={styles.planText}>Plan: {item.currentPlan} (Expires: {item.expiryDate})</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            item.subStatus === 'Active' ? styles.btnSuspend : styles.btnActivate,
          ]}
          onPress={() => handleToggleStatus(item.id)}
        >
          <Ionicons
            name={item.subStatus === 'Active' ? 'pause' : 'play'}
            size={14}
            color="#fff"
          />
          <Text style={styles.actionBtnText}>
            {item.subStatus === 'Active' ? 'Suspend' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnEdit}
          onPress={() => {
            setSelectedClinic(item);
            setModalVisible(true);
          }}
        >
          <Ionicons name="create-outline" size={14} color={darkTheme.primary} />
          <Text style={styles.btnEditText}>Edit Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.headerTitle}>Admins & Clinic Management</Text>
            <Text style={styles.headerSubtitle}>View, suspend or upgrade platform clinic administrators</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color="#ffffff" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={darkTheme.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clinic or admin..."
          placeholderTextColor={darkTheme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {['All', 'Active', 'Trial', 'Suspended'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterChip, statusFilter === tab && styles.filterChipActive]}
            onPress={() => setStatusFilter(tab)}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === tab && styles.filterChipTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredClinics}
        keyExtractor={(item, index) => (item.id ? `${item.id}-${index}` : index.toString())}
        renderItem={renderClinicCard}
        contentContainerStyle={styles.listContainer}
      />

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Clinic Admin</Text>
            {selectedClinic && (
              <>
                <Text style={styles.modalSub}>{selectedClinic.name}</Text>
                <Text style={styles.label}>Admin Name: {selectedClinic.adminName}</Text>
                <Text style={styles.label}>Email: {selectedClinic.email}</Text>
                <Text style={styles.label}>Current Plan: {selectedClinic.currentPlan}</Text>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  topHeader: {
    backgroundColor: '#0f766e',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 18,
    marginBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#ccfbf1',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 6,
  },
  logoutBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.cardBg,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: darkTheme.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: darkTheme.cardBg,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  filterChipActive: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.textSecondary,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clinicIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  adminName: {
    fontSize: 12,
    color: darkTheme.textSecondary,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    marginVertical: 10,
    gap: 2,
  },
  infoText: {
    fontSize: 12,
    color: darkTheme.textSecondary,
  },
  planText: {
    fontSize: 13,
    fontWeight: '600',
    color: darkTheme.primary,
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: darkTheme.cardBorder,
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  btnSuspend: {
    backgroundColor: darkTheme.danger,
  },
  btnActivate: {
    backgroundColor: darkTheme.success,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  btnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  btnEditText: {
    color: darkTheme.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalSub: {
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.primary,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    marginVertical: 4,
  },
  modalCloseBtn: {
    backgroundColor: darkTheme.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
