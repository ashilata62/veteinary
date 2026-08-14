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
  Image,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function BillingScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form options data
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);

  // Form State
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');
  const [amount, setAmount] = useState('');
  const [services, setServices] = useState('Consultation & Medication');
  const [status, setStatus] = useState('Paid');
  const [receiptScan, setReceiptScan] = useState(null);

  // Search selectors modals state
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorType, setSelectorType] = useState(''); // 'owner', 'pet'
  const [selectorQuery, setSelectorQuery] = useState('');

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
  ]);

  const loadScreenData = async () => {
    try {
      setLoading(true);
      const [invRes, ownersRes, petsRes] = await Promise.all([
        api.get('/invoices').catch(() => ({ data: [] })),
        api.get('/owners').catch(() => ({ data: [] })),
        api.get('/pets').catch(() => ({ data: [] })),
      ]);

      const invList = invRes.data?.data || invRes.data || [];
      if (Array.isArray(invList) && invList.length > 0) {
        setInvoices(invList);
      }

      setOwners(ownersRes.data?.data || ownersRes.data || []);
      setPets(petsRes.data?.data || petsRes.data || []);
    } catch (e) {
      console.log('Using local fallback invoice directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreenData();
  }, []);

  const handleOpenSelector = (type) => {
    setSelectorType(type);
    setSelectorQuery('');
    setSelectorVisible(true);
  };

  const handleSelectOption = (item) => {
    if (selectorType === 'owner') {
      setSelectedOwnerId(item.id);
      const ownerPets = pets.filter(p => String(p.owner_id) === String(item.id));
      if (ownerPets.length > 0) {
        setSelectedPetId(ownerPets[0].id);
      } else {
        setSelectedPetId('');
      }
    } else if (selectorType === 'pet') {
      setSelectedPetId(item.id);
    }
    setSelectorVisible(false);
  };

  const getOwnerLabel = () => {
    const o = owners.find(owner => owner.id === selectedOwnerId);
    return o ? o.name : 'Select Owner...';
  };

  const getPetLabel = () => {
    const p = pets.find(pet => pet.id === selectedPetId);
    return p ? `${p.name} (${p.breed || 'Dog'})` : 'Select Pet...';
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
    return [];
  };

  const handlePickReceipt = async (useCamera = false) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', `Permission to access the ${useCamera ? 'camera' : 'gallery'} is required!`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.7,
          });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setReceiptScan(result.assets[0].uri);
      }
    } catch (error) {
      console.warn('Receipt picker error:', error);
    }
  };

  const handleAddInvoice = async () => {
    if (!selectedOwnerId || !selectedPetId || !amount) {
      Alert.alert('Required Fields', 'Please select Pet Owner, Patient Pet, and enter Amount.');
      return;
    }

    if (isNaN(Number(amount))) {
      Alert.alert('Validation Error', 'Amount must be a valid plain number.');
      return;
    }

    const price = Number(amount);
    const lineItems = [{
      quantity: 1,
      unit_price: price,
      total: price
    }];

    const payload = {
      owner_id: selectedOwnerId,
      pet_id: selectedPetId,
      subtotal: price,
      grand_total: price,
      tax_amount: 0.00,
      discount_amount: 0.00,
      status: status,
      lineItems: lineItems,
    };

    setSubmitting(true);
    try {
      await api.post('/invoices', payload);

      Alert.alert('Success', 'Invoice generated successfully!');
      setShowAddModal(false);
      
      // Clear forms
      setSelectedOwnerId('');
      setSelectedPetId('');
      setAmount('');
      setServices('Consultation & Medication');
      setStatus('Paid');
      setReceiptScan(null);

      loadScreenData();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to save invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderInvoiceCard = ({ item }) => {
    const isPaid = item.status === 'Paid';
    const amountVal = item.grand_total || item.amount || '0';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.invoiceId}>{item.id}</Text>
            <Text style={styles.dateText}>{item.invoice_date || item.date || 'Today'}</Text>
          </View>
          <View style={[styles.statusBadge, isPaid ? styles.paidBadge : styles.pendingBadge]}>
            <Text style={[styles.statusText, isPaid ? styles.paidText : styles.pendingText]}>
              {item.status || 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.bodyText}>Patient: <Text style={styles.boldText}>{item.petName || 'Unknown Pet'}</Text></Text>
          <Text style={styles.bodyText}>Owner: {item.ownerName || 'Client'}</Text>
          <Text style={styles.bodyText}>Services: {item.services || 'Consultation fee & procedures'}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>₹ {amountVal}</Text>
        </View>

        {item.receipt_url && (
          <TouchableOpacity
            style={styles.receiptBadge}
            onPress={() => Alert.alert('Invoice Receipt', `Opening scanned receipt: ${item.receipt_url}`)}
          >
            <Ionicons name="receipt-outline" size={14} color={colors.primary} />
            <Text style={styles.receiptText}>View Scanned Receipt / POS Slip</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.headerTitle}>Billing & Invoices</Text>
          <Text style={styles.headerSubtitle}>Manage client payments & receipts</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderInvoiceCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No invoices found in database.</Text>
          }
        />
      )}

      {/* GENERATE NEW INVOICE MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Generate POS Invoice</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Owner Picker */}
              <Text style={styles.label}>Select Client / Pet Owner *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('owner')}>
                <Text style={styles.selectorBtnText}>{getOwnerLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Pet Picker */}
              <Text style={styles.label}>Select Patient Pet *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('pet')}>
                <Text style={styles.selectorBtnText}>{getPetLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Amount */}
              <Text style={styles.label}>Invoice Amount (INR) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 1500"
                placeholderTextColor={colors.textMuted}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              {/* Services details */}
              <Text style={styles.label}>Billed Services / Description</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Vaccination & Deworming fee"
                placeholderTextColor={colors.textMuted}
                value={services}
                onChangeText={setServices}
              />

              {/* Status */}
              <Text style={styles.label}>Payment Status *</Text>
              <View style={styles.tabContainer}>
                {['Paid', 'Pending'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.tabChip, status === s && styles.tabChipActive]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[styles.tabChipText, status === s && styles.tabChipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Scan Receipt */}
              <Text style={styles.label}>Scan / Upload POS Bill Receipt</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <TouchableOpacity style={styles.photoBtn} onPress={() => handlePickReceipt(true)}>
                  <Ionicons name="camera" size={20} color={colors.primary} />
                  <Text style={styles.photoBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={() => handlePickReceipt(false)}>
                  <Ionicons name="image" size={20} color={colors.primary} />
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>

              {receiptScan && (
                <Image source={{ uri: receiptScan }} style={{ width: 80, height: 80, borderRadius: 10, alignSelf: 'center', marginBottom: 12 }} />
              )}

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddInvoice} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Generate Invoice</Text>}
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
  container: { flex: 1, backgroundColor: colors.background },
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  headerSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  listContainer: { paddingHorizontal: 16, paddingBottom: 24, gap: 12, paddingTop: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoiceId: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  dateText: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  paidBadge: { backgroundColor: colors.successLight },
  pendingBadge: { backgroundColor: colors.warningLight },
  statusText: { fontSize: 11, fontWeight: '700' },
  paidText: { color: colors.success },
  pendingText: { color: colors.warning },
  cardBody: { gap: 4 },
  bodyText: { fontSize: 13, color: colors.textSecondary },
  boldText: { fontWeight: '700', color: colors.textPrimary },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 10,
    marginTop: 2,
  },
  amountLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  amountValue: { fontSize: 16, fontWeight: '800', color: colors.primary },
  receiptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 6,
  },
  receiptText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 14, marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeaderRow: { flexDirection: 'row', justify: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: 10 },
  input: {
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
  selectorBtnText: { fontSize: 14, color: colors.textPrimary },
  dropdownRow: { flexDirection: 'row', gap: 12 },
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
  tabChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tabChipTextActive: { color: colors.primary },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  photoBtnText: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
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
