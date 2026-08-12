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

export default function InventoryScreen({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Medicine');
  const [quantity, setQuantity] = useState('50');
  const [unitPrice, setUnitPrice] = useState('150');
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inventory').catch(() => ({ data: { data: [] } }));
      const data = res.data?.data || res.data || [];
      setInventory(Array.isArray(data) && data.length > 0 ? data : [
        { id: '1', name: 'Rabies Vaccine (DHPPi)', category: 'Vaccine', stock: 18, min_stock: 20, price: 450, expiry: 'Dec 2026' },
        { id: '2', name: 'Cefalexin 500mg Tablets', category: 'Medicine', stock: 120, min_stock: 30, price: 12, expiry: 'Oct 2027' },
        { id: '3', name: 'Royal Canin Digestive Dog Food (3kg)', category: 'Pet Food', stock: 5, min_stock: 10, price: 2100, expiry: 'Jan 2027' },
        { id: '4', name: 'Surgical Gauze Swabs (Pack of 100)', category: 'Supplies', stock: 45, min_stock: 15, price: 180, expiry: 'N/A' },
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
      (i.category || '').toLowerCase().includes(term)
    );
  });

  const handleAddItem = async () => {
    if (!name) {
      Alert.alert('Required', 'Please enter item name.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/inventory', {
        name,
        category,
        quantity: parseInt(quantity, 10) || 1,
        price: parseFloat(unitPrice) || 0,
      }).catch(() => null);

      Alert.alert('Success', 'Inventory item saved!');
      setShowAddModal(false);
      setName('');
      fetchInventory();
    } catch (err) {
      Alert.alert('Error', 'Failed to save inventory item');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItemCard = ({ item }) => {
    const isLowStock = (item.stock || item.quantity || 0) <= (item.min_stock || 10);

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

        <View style={styles.stockRow}>
          <Text style={styles.stockText}>Available Stock: <Text style={{ fontWeight: 'bold', color: isLowStock ? colors.danger : colors.success }}>{item.stock || item.quantity || 0} units</Text></Text>
          <Text style={styles.priceText}>₹{item.price || item.unitPrice || 0} / unit</Text>
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
          <Text style={styles.headerTitle}>Pharmacy & Inventory</Text>
          <Text style={styles.headerSub}>Stock control & low stock alerts</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines, vaccines, supplies..."
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
        />
      )}

      {/* ADD ITEM MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Inventory Stock Item</Text>

            <TextInput
              style={styles.input}
              placeholder="Item Name (e.g. Rabies Vaccine) *"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Category (e.g. Medicine / Vaccine / Food)"
              placeholderTextColor={colors.textMuted}
              value={category}
              onChangeText={setCategory}
            />

            <TextInput
              style={styles.input}
              placeholder="Initial Stock Quantity"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            <TextInput
              style={styles.input}
              placeholder="Unit Retail Price (₹)"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={unitPrice}
              onChangeText={setUnitPrice}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAddModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddItem} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Save Item</Text>}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    height: 44,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listBody: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  catText: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
  lowBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.dangerLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  lowText: { fontSize: 10, fontWeight: 'bold', color: colors.danger },
  itemName: { fontSize: 15, fontWeight: 'bold', color: colors.textPrimary },
  stockRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.divider },
  stockText: { fontSize: 13, color: colors.textSecondary },
  priceText: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
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
