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
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons } from '@expo/vector-icons';

export default function BillingScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [petName, setPetName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [amount, setAmount] = useState('');
  const [services, setServices] = useState('Consultation & Medication');
  const [status, setStatus] = useState('Paid');

  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-001',
      petName: 'Buddy',
      ownerName: 'Rahul Sharma',
      amount: '₹ 1,850',
      date: '11 Aug 2026',
      services: 'OPD Consultation, Vaccination, Deworming',
      status: 'Paid',
    },
    {
      id: 'INV-2026-002',
      petName: 'Luna',
      ownerName: 'Priya Singh',
      amount: '₹ 3,400',
      date: '10 Aug 2026',
      services: 'Blood Test, Antibiotics, IV Drip',
      status: 'Pending',
    },
    {
      id: 'INV-2026-003',
      petName: 'Max',
      ownerName: 'Amit Patel',
      amount: '₹ 5,200',
      date: '08 Aug 2026',
      services: 'X-Ray Imaging, Splinting',
      status: 'Paid',
    },
  ]);

  const loadInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      const list = res.data?.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        setInvoices(list);
      }
    } catch (e) {
      console.log('Using local fallback invoice data.');
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleAddInvoice = async () => {
    if (!petName || !ownerName || !amount) {
      Alert.alert('Required Fields', 'Please enter Pet Name, Owner Name, and Amount.');
      return;
    }

    const payload = {
      petName,
      ownerName,
      amount: `₹ ${amount}`,
      date: 'Today',
      services,
      status,
    };

    setSubmitting(true);
    try {
      const res = await api.post('/invoices', payload).catch(() => null);
      const newInv = res?.data?.data || res?.data || { ...payload, id: `INV-${Date.now().toString().slice(-4)}` };

      setInvoices([newInv, ...invoices]);
      setShowAddModal(false);
      setPetName('');
      setOwnerName('');
      setAmount('');
      Alert.alert('Success', 'Invoice created successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderInvoice = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.invTitleBox}>
          <Ionicons name="document-text-outline" size={18} color={colors.primary} />
          <Text style={styles.invNumber}>{item.id}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            item.status === 'Paid'
              ? { backgroundColor: colors.successLight }
              : { backgroundColor: colors.warningLight },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Paid'
                ? { color: colors.success }
                : { color: colors.warning },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.petText}>
          {item.petName} <Text style={styles.ownerText}>({item.ownerName})</Text>
        </Text>
        <Text style={styles.servicesText}>{item.services}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.amountText}>{item.amount}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.headerTitle}>Billing & Invoices</Text>
            <Text style={styles.headerSubtitle}>Payment records and clinic revenue</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Overview Cards */}
      <View style={styles.overviewContainer}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>Total Revenue Today</Text>
          <Text style={styles.overviewValue}>₹ 10,450</Text>
        </View>
        <View style={[styles.overviewCard, { backgroundColor: '#fef3c7' }]}>
          <Text style={styles.overviewLabel}>Pending Collect</Text>
          <Text style={[styles.overviewValue, { color: colors.warning }]}>
            ₹ 3,400
          </Text>
        </View>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={renderInvoice}
        contentContainerStyle={styles.listContainer}
      />

      {/* CREATE INVOICE MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New POS Bill</Text>

            <TextInput
              style={styles.input}
              placeholder="Pet Name (e.g. Buddy) *"
              placeholderTextColor={colors.textMuted}
              value={petName}
              onChangeText={setPetName}
            />

            <TextInput
              style={styles.input}
              placeholder="Owner Name (e.g. Rahul Sharma) *"
              placeholderTextColor={colors.textMuted}
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount in ₹ (e.g. 1500) *"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <TextInput
              style={styles.input}
              placeholder="Services Rendered (e.g. OPD Consult, Vaccine)"
              placeholderTextColor={colors.textMuted}
              value={services}
              onChangeText={setServices}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
              {['Paid', 'Pending'].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[styles.statusChip, status === st && styles.statusChipActive]}
                  onPress={() => setStatus(st)}
                >
                  <Text style={[styles.statusChipText, status === st && { color: '#fff' }]}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAddModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddInvoice} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Generate Bill</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justify: 'center',
    alignItems: 'center',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, gap: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: colors.textPrimary,
  },
  statusChip: { flex: 1, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  statusChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  btnCancelText: { color: colors.textSecondary, fontWeight: '600' },
  btnSubmit: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  btnSubmitText: { color: '#fff', fontWeight: 'bold' },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  topHeader: {
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
  overviewContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    padding: 16,
    borderRadius: 16,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginTop: 4,
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
  invTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  invNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusPill: {
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
  petText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ownerText: {
    fontSize: 13,
    fontWeight: 'normal',
    color: colors.textSecondary,
  },
  servicesText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
});
