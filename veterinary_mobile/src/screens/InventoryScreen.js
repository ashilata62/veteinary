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

const CATEGORY_OPTIONS = ['Medicine', 'Equipment', 'Consumables', 'Vitamins', 'Vaccines'];
const UNIT_OPTIONS = ['Bottles', 'Pieces', 'Syringes', 'Vials', 'Packs', 'Tubes'];

export default function InventoryScreen({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Item Modal Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState(''); // Batch / SKU
  const [category, setCategory] = useState('Medicine');
  const [quantity, setQuantity] = useState('50');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [unit, setUnit] = useState('Pieces');
  const [sellingPrice, setSellingPrice] = useState('150');
  const [supplier, setSupplier] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // YYYY-MM-DD
  const [submitting, setSubmitting] = useState(false);

  // Dropdown selector state
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorType, setSelectorType] = useState(''); // 'category', 'unit'

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inventory').catch(() => ({ data: [] }));
      const data = res.data?.data || res.data || [];
      setInventory(Array.isArray(data) && data.length > 0 ? data : [
        { id: '1', name: 'Rabies Vaccine (DHPPi)', category: 'Vaccines', quantity: 18, low_stock_threshold: 20, selling_price: 450, expiry_date: '2026-12-31', sku: 'RB-9920-K', unit: 'Vials' },
        { id: '2', name: 'Cefalexin 500mg Tablets', category: 'Medicine', quantity: 120, low_stock_threshold: 30, selling_price: 12, expiry_date: '2027-10-31', sku: 'CFX-500', unit: 'Pieces' },
      ]);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(i => {
    const term = search.toLowerCase();
    return (
      (i.name || '').toLowerCase().includes(term) ||
      (i.category || '').toLowerCase().includes(term) ||
      (i.sku || '').toLowerCase().includes(term)
    );
  });

  const handleAddItem = async () => {
    if (!name.trim() || !sku.trim()) {
      Alert.alert('Required Fields', 'Please enter Item Name and Batch / SKU code.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        sku: sku.trim(),
        name: name.trim(),
        category,
        supplier: supplier.trim() || 'Generic Supplier',
        quantity: parseInt(quantity, 10) || 0,
        low_stock_threshold: parseInt(lowStockThreshold, 10) || 10,
        cost_price: 0,
        selling_price: parseFloat(sellingPrice) || 0,
        is_taxable: false,
        expiry_date: expiryDate || null,
        unit,
      };

      await api.post('/inventory', payload);

      Alert.alert('Success', 'Inventory stock item registered successfully!');
      setShowAddModal(false);
      
      // Clear forms
      setName('');
      setSku('');
      setCategory('Medicine');
      setQuantity('50');
      setLowStockThreshold('10');
      setUnit('Pieces');
      setSellingPrice('150');
      setSupplier('');
      setExpiryDate('');

      fetchInventory();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to save inventory item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenSelector = (type) => {
    setSelectorType(type);
    setSelectorVisible(true);
  };

  const handleSelectOption = (item) => {
    if (selectorType === 'category') {
      setCategory(item);
    } else if (selectorType === 'unit') {
      setUnit(item);
    }
    setSelectorVisible(false);
  };

  const getSelectorOptions = () => {
    return selectorType === 'category' ? CATEGORY_OPTIONS : UNIT_OPTIONS;
  };

  const renderItemCard = ({ item }) => {
    const isLowStock = (item.quantity || 0) <= (item.low_stock_threshold || 10);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.catBadge}>
            <MaterialCommunityIcons name="pill" size={14} color={colors.primary} />
            <Text style={styles.catText}>{item.category || 'Medicine'}</Text>
          </View>
          {isLowStock ? (
            <View style={styles.lowBadge}>
              <Ionicons name="alert-circle" size={12} color={colors.danger} />
              <Text style={styles.lowText}>Low Stock Warning</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.skuText}>Batch SKU: {item.sku || 'N/A'} • Unit: {item.unit || 'Pieces'}</Text>
        
        {item.expiry_date ? (
          <Text style={styles.expiryText}>Expiry Date: {item.expiry_date.split('T')[0]}</Text>
        ) : null}

        <View style={styles.stockRow}>
          <Text style={styles.stockText}>
            Available Stock: <Text style={{ fontWeight: 'bold', color: isLowStock ? colors.danger : colors.success }}>{item.quantity || 0} units</Text>
          </Text>
          <Text style={styles.priceText}>₹{item.selling_price || item.price || 0} / unit</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.headerBg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Pharmacy & Inventory</Text>
          <Text style={styles.headerSub}>Stock control & low stock thresholds</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines, vaccines, batch SKU..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredInventory}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderItemCard}
          contentContainerStyle={styles.listBody}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No items found in stock directory.</Text>
          }
        />
      )}

      {/* ADD ITEM MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Add Stock Item</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Item Name */}
              <Text style={styles.label}>Item Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Cefalexin 500mg"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />

              {/* SKU / Batch Code */}
              <Text style={styles.label}>Batch SKU Code *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. CFX-500-A"
                placeholderTextColor={colors.textMuted}
                value={sku}
                onChangeText={setSku}
              />

              <View style={styles.dropdownRow}>
                {/* Category Selector */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Category</Text>
                  <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('category')}>
                    <Text style={styles.selectorBtnText}>{category}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Unit Selector */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Storage Unit</Text>
                  <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('unit')}>
                    <Text style={styles.selectorBtnText}>{unit}</Text>
                    <Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dropdownRow}>
                {/* Quantity */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Available Quantity</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 50"
                    placeholderTextColor={colors.textMuted}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />
                </View>

                {/* Low Stock Limit */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Low Stock Warning Limit</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 10"
                    placeholderTextColor={colors.textMuted}
                    value={lowStockThreshold}
                    onChangeText={setLowStockThreshold}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Unit Price */}
              <Text style={styles.label}>Unit Selling Price (INR) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 150"
                placeholderTextColor={colors.textMuted}
                value={sellingPrice}
                onChangeText={setSellingPrice}
                keyboardType="numeric"
              />

              {/* Expiry Date */}
              <Text style={styles.label}>Expiry Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2027-12-31"
                placeholderTextColor={colors.textMuted}
                value={expiryDate}
                onChangeText={setExpiryDate}
              />

              {/* Supplier */}
              <Text style={styles.label}>Supplier / Distributor Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Alpha Vet Pharma"
                placeholderTextColor={colors.textMuted}
                value={supplier}
                onChangeText={setSupplier}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddItem} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Add Stock Item</Text>}
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

            <FlatList
              data={getSelectorOptions()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectorItem}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={styles.selectorItemText}>{item}</Text>
                </TouchableOpacity>
              )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  listBody: { padding: 16, gap: 12, paddingBottom: 30 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  catText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  lowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.dangerLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  lowText: { fontSize: 10, fontWeight: '700', color: colors.danger },
  itemName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  skuText: { fontSize: 12, color: colors.textSecondary },
  expiryText: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic' },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
    marginTop: 4,
  },
  stockText: { fontSize: 13, color: colors.textSecondary },
  priceText: { fontSize: 14, fontWeight: '700', color: colors.primary },
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
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
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
  dropdownRow: { flexDirection: 'row', gap: 12 },
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
  selectorContent: { backgroundColor: colors.surface, borderRadius: 16, width: '75%', maxHeight: '50%', padding: 16 },
  selectorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  selectorTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  selectorItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  selectorItemText: { fontSize: 14, color: colors.textPrimary, textAlign: 'center' },
});
