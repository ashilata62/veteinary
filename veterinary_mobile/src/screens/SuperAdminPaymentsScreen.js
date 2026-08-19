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
import { Ionicons } from '@expo/vector-icons';
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

export default function SuperAdminPaymentsScreen() {
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);

  const [payments, setPayments] = useState([
    { id: 'PAY-982341', orderId: 'order_M1k298x', clinic: 'Downtown Pet Clinic', date: '07 Aug 2026 10:14 AM', amount: '₹1,999.00', method: 'Razorpay UPI (gpay@upi)', status: 'Successful', invoice: 'INV-2026-0801' },
    { id: 'PAY-982340', orderId: 'order_K88129y', clinic: 'Paws & Claws Care', date: '06 Aug 2026 04:30 PM', amount: '₹18,999.00', method: 'Razorpay NetBanking (HDFC)', status: 'Successful', invoice: 'INV-2026-0802' },
    { id: 'PAY-982339', orderId: 'order_L99210z', clinic: 'Happy Pets Hospital', date: '05 Aug 2026 09:22 AM', amount: '₹1,999.00', method: 'Razorpay Card (**** 4242)', status: 'Failed', invoice: '-' },
    { id: 'PAY-982338', orderId: 'order_P77123a', clinic: 'PetCare Central', date: '05 Aug 2026 02:15 PM', amount: '₹1,999.00', method: 'Razorpay UPI (paytm@upi)', status: 'Pending', invoice: '-' },
    { id: 'PAY-982337', orderId: 'order_Q66542b', clinic: 'City Animal Hospital', date: '04 Aug 2026 11:45 AM', amount: '₹1,999.00', method: 'Razorpay Card (**** 8888)', status: 'Successful', invoice: 'INV-2026-0803' },
  ]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/super-admin/payments').catch(() => ({ data: [] }));
        const list = res.data?.data || res.data;
        if (Array.isArray(list) && list.length > 0) {
          setPayments(list);
        }
      } catch (err) {
        console.log('Using default payments');
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && p.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const renderTx = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.txIdBox}>
          <Ionicons name="card" size={18} color={darkTheme.primary} />
          <Text style={styles.txId}>{item.id}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            item.status === 'Successful'
              ? { backgroundColor: darkTheme.successBg }
              : item.status === 'Pending'
              ? { backgroundColor: darkTheme.warningBg }
              : { backgroundColor: darkTheme.dangerBg },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Successful'
                ? { color: darkTheme.success }
                : item.status === 'Pending'
                ? { color: darkTheme.warning }
                : { color: darkTheme.danger },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.clinicName}>{item.clinic}</Text>
        <Text style={styles.methodText}>{item.method}</Text>
        <Text style={styles.dateText}>Order: {item.orderId} • {item.date}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.amountText}>{item.amount}</Text>
        <TouchableOpacity
          style={styles.btnDetail}
          onPress={() => setSelectedTx(item)}
        >
          <Text style={styles.btnDetailText}>Details</Text>
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
            <Text style={styles.headerTitle}>Payments & Ledger</Text>
            <Text style={styles.headerSubtitle}>Track SaaS transaction history, Razorpay orders and invoices</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color="#ffffff" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={darkTheme.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search TX ID or clinic..."
          placeholderTextColor={darkTheme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['All', 'Successful', 'Pending', 'Failed'].map((tab) => (
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
        data={filteredPayments}
        keyExtractor={(item, index) => (item.id ? `${item.id}-${index}` : index.toString())}
        renderItem={renderTx}
        contentContainerStyle={styles.listContainer}
      />

      {/* Detail Modal */}
      <Modal visible={!!selectedTx} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTx && (
              <>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Transaction ID:</Text>
                  <Text style={styles.modalValue}>{selectedTx.id}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Order ID:</Text>
                  <Text style={styles.modalValue}>{selectedTx.orderId}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Clinic Name:</Text>
                  <Text style={styles.modalValue}>{selectedTx.clinic}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Payment Method:</Text>
                  <Text style={styles.modalValue}>{selectedTx.method}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Amount Paid:</Text>
                  <Text style={[styles.modalValue, { color: darkTheme.primary, fontWeight: 'bold' }]}>
                    {selectedTx.amount}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.btnClose}
                  onPress={() => setSelectedTx(null)}
                >
                  <Text style={styles.btnCloseText}>Close</Text>
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
  headerSubtitle: {
    fontSize: 13,
    color: '#ccfbf1',
    marginTop: 2,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  txIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  txId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 10,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  methodText: {
    fontSize: 12,
    color: darkTheme.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: darkTheme.textMuted,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: darkTheme.cardBorder,
    paddingTop: 10,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  btnDetail: {
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnDetailText: {
    color: darkTheme.primary,
    fontWeight: 'bold',
    fontSize: 12,
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
    marginBottom: 16,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.cardBorder,
  },
  modalLabel: {
    color: darkTheme.textSecondary,
    fontSize: 13,
  },
  modalValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  btnClose: {
    backgroundColor: darkTheme.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  btnCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
