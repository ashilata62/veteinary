import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import api from '../config/api';

const darkTheme = {
  bg: '#f1f5f9', card: '#ffffff', border: '#e2e8f0',
  primary: '#0f766e', primaryLight: '#ccfbf1',
  text: '#0f172a', textSub: '#475569', textMuted: '#94a3b8',
  gold: '#d97706', danger: '#dc2626', success: '#16a34a',
  purple: '#7c3aed',
};

const DEFAULT_PLANS = [
  {
    id: '1', name: '7-Day Free Trial', price: '₹0', interval: '7 days trial',
    features: ['Up to 1 Doctor', 'Basic Medical Records', 'Standard Appointments', 'Self-service Helpdesk'],
    color: darkTheme.gold, badge: 'Trial Plan', isPopular: false,
  },
  {
    id: '2', name: 'Monthly Pro', price: '₹1,999', interval: 'per month',
    features: ['Up to 5 Doctors', 'Full Medical Records', 'Razorpay Payment Integration', 'Billing & POS Invoicing', 'WhatsApp & Email Reminders', 'Priority Email Support'],
    color: darkTheme.primary, badge: 'Most Popular', isPopular: true,
  },
  {
    id: '3', name: 'Yearly Enterprise', price: '₹18,999', interval: 'per year (save 20%)',
    features: ['Unlimited Doctors', 'Custom Workflows', 'Multi-Clinic Franchises', 'Dedicated DB & Backup', '24/7 VIP Phone Support', 'Dedicated Account Manager'],
    color: darkTheme.purple, badge: 'Enterprise', isPopular: false,
  },
];

export default function SuperAdminPlansScreen({ navigation }) {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formInterval, setFormInterval] = useState('per month');
  const [formFeatures, setFormFeatures] = useState('');
  const [formIsPopular, setFormIsPopular] = useState(false);

  const openCreate = () => {
    setEditingPlan(null);
    setFormName(''); setFormPrice(''); setFormInterval('per month');
    setFormFeatures(''); setFormIsPopular(false);
    setModalVisible(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setFormName(plan.name); setFormPrice(plan.price); setFormInterval(plan.interval);
    setFormFeatures(plan.features.join('\n')); setFormIsPopular(plan.isPopular);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPrice.trim()) {
      Alert.alert('Validation', 'Plan name and price are required.');
      return;
    }
    const featuresArr = formFeatures.split('\n').map(f => f.trim()).filter(Boolean);
    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id
        ? { ...p, name: formName, price: formPrice, interval: formInterval, features: featuresArr, isPopular: formIsPopular }
        : p));
    } else {
      const newPlan = {
        id: Date.now().toString(), name: formName, price: formPrice,
        interval: formInterval, features: featuresArr.length > 0 ? featuresArr : ['Standard Access'],
        color: darkTheme.primary, badge: 'Custom Plan', isPopular: formIsPopular,
      };
      setPlans(prev => [...prev, newPlan]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Plan', 'Are you sure you want to delete this plan?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setPlans(prev => prev.filter(p => p.id !== id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={22} color={darkTheme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Subscription Plans</Text>
          <Text style={styles.headerSub}>Manage SaaS pricing tiers</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>New Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {plans.map((plan) => (
          <View key={plan.id} style={[styles.planCard, plan.isPopular && { borderColor: plan.color }]}>
            {plan.isPopular && (
              <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                <Ionicons name="star" size={11} color="#fff" />
                <Text style={styles.popularBadgeText}>{plan.badge}</Text>
              </View>
            )}
            <View style={styles.planTop}>
              <View style={[styles.planColorDot, { backgroundColor: plan.color }]} />
              <Text style={styles.planName}>{plan.name}</Text>
            </View>
            <View style={styles.planPriceRow}>
              <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
              <Text style={styles.planInterval}> / {plan.interval}</Text>
            </View>
            <View style={styles.featuresList}>
              {plan.features.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={14} color={plan.color} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={styles.planActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(plan)}>
                <Ionicons name="pencil-outline" size={16} color={darkTheme.primary} />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(plan.id)}>
                <Ionicons name="trash-outline" size={16} color={darkTheme.danger} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={darkTheme.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Plan Name *</Text>
              <TextInput style={styles.input} value={formName} onChangeText={setFormName} placeholder="e.g. Starter Plan" placeholderTextColor={darkTheme.textMuted} />
              <Text style={styles.inputLabel}>Price *</Text>
              <TextInput style={styles.input} value={formPrice} onChangeText={setFormPrice} placeholder="e.g. ₹999" placeholderTextColor={darkTheme.textMuted} />
              <Text style={styles.inputLabel}>Billing Interval</Text>
              <TextInput style={styles.input} value={formInterval} onChangeText={setFormInterval} placeholder="e.g. per month" placeholderTextColor={darkTheme.textMuted} />
              <Text style={styles.inputLabel}>Features (one per line)</Text>
              <TextInput
                style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                value={formFeatures} onChangeText={setFormFeatures}
                placeholder={'Up to 5 Doctors\nBilling & POS\nEmail Support'}
                placeholderTextColor={darkTheme.textMuted} multiline
              />
              <TouchableOpacity style={styles.popularToggle} onPress={() => setFormIsPopular(!formIsPopular)}>
                <Ionicons name={formIsPopular ? 'checkbox' : 'square-outline'} size={22} color={darkTheme.primary} />
                <Text style={styles.popularToggleText}>Mark as Most Popular</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSave}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.saveModalBtnText}>{editingPlan ? 'Save Changes' : 'Create Plan'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: darkTheme.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16,
    backgroundColor: darkTheme.card, borderBottomWidth: 1, borderBottomColor: darkTheme.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: darkTheme.text },
  headerSub: { fontSize: 12, color: darkTheme.textMuted, marginTop: 2 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: darkTheme.primary, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  body: { padding: 16, paddingBottom: 40, gap: 16 },
  planCard: {
    backgroundColor: darkTheme.card, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: darkTheme.border,
  },
  popularBadge: {
    position: 'absolute', top: -10, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20,
  },
  popularBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  planColorDot: { width: 12, height: 12, borderRadius: 6 },
  planName: { fontSize: 17, fontWeight: '700', color: darkTheme.text },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 14 },
  planPrice: { fontSize: 26, fontWeight: '800' },
  planInterval: { fontSize: 14, color: darkTheme.textSub },
  featuresList: { gap: 8, marginBottom: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: darkTheme.textSub, flex: 1 },
  planActions: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: darkTheme.border, paddingTop: 14 },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: darkTheme.primaryLight, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: darkTheme.primary + '60',
  },
  editBtnText: { color: darkTheme.primary, fontWeight: '600', fontSize: 13 },
  deleteBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(239,68,68,0.1)', paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: darkTheme.danger + '40',
  },
  deleteBtnText: { color: darkTheme.danger, fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: darkTheme.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '90%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: darkTheme.text },
  inputLabel: { fontSize: 13, fontWeight: '600', color: darkTheme.textSub, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: darkTheme.bg, borderWidth: 1, borderColor: darkTheme.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: darkTheme.text, marginBottom: 4,
  },
  popularToggle: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 12 },
  popularToggleText: { fontSize: 14, color: darkTheme.textSub },
  saveModalBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: darkTheme.primary, paddingVertical: 14, borderRadius: 14, marginTop: 8,
  },
  saveModalBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
