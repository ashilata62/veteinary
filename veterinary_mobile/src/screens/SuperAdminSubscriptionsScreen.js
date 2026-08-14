import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const darkTheme = {
  bg: '#f1f5f9', card: '#ffffff', border: '#e2e8f0',
  primary: '#0f766e', primaryLight: '#ccfbf1',
  text: '#0f172a', textSub: '#475569', textMuted: '#94a3b8',
  gold: '#d97706', danger: '#dc2626', success: '#16a34a',
};

const DUMMY_SUBSCRIPTIONS = [
  { id: 1, clinicName: 'City Vet Clinic', email: 'contact@cityvet.com', plan: 'Enterprise', status: 'Active', billingCycle: 'Annual', nextBilling: '2027-01-15', amount: '₹18,999' },
  { id: 2, clinicName: 'Paws & Claws Care', email: 'admin@pawsclaws.com', plan: 'Pro', status: 'Active', billingCycle: 'Monthly', nextBilling: '2026-09-01', amount: '₹1,999' },
  { id: 3, clinicName: 'Happy Pets Hospital', email: 'hello@happypets.net', plan: 'Basic', status: 'Past Due', billingCycle: 'Monthly', nextBilling: '2026-08-01', amount: '₹999' },
  { id: 4, clinicName: 'Downtown Animal ER', email: 'er@downtownvet.org', plan: 'Enterprise', status: 'Active', billingCycle: 'Annual', nextBilling: '2027-03-10', amount: '₹18,999' },
  { id: 5, clinicName: 'Green Valley Vet', email: 'support@greenvalley.com', plan: 'Starter', status: 'Cancelled', billingCycle: 'Monthly', nextBilling: '-', amount: '₹0' },
  { id: 6, clinicName: 'PetCare Plus', email: 'info@petcareplus.in', plan: 'Pro', status: 'Active', billingCycle: 'Monthly', nextBilling: '2026-09-10', amount: '₹1,999' },
];

const getStatusColor = (status) => {
  if (status === 'Active') return { bg: 'rgba(16,185,129,0.15)', text: darkTheme.success };
  if (status === 'Past Due') return { bg: 'rgba(245,158,11,0.15)', text: darkTheme.gold };
  if (status === 'Cancelled') return { bg: 'rgba(239,68,68,0.15)', text: darkTheme.danger };
  return { bg: darkTheme.card, text: darkTheme.textMuted };
};

export default function SuperAdminSubscriptionsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const FILTER_OPTIONS = ['All', 'Active', 'Past Due', 'Cancelled'];

  const filtered = DUMMY_SUBSCRIPTIONS.filter(s => {
    const matchSearch = s.clinicName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.plan.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === 'All' || s.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const stats = {
    mrr: '₹42,500',
    active: DUMMY_SUBSCRIPTIONS.filter(s => s.status === 'Active').length,
    churn: '1.2%',
  };

  const handleUpdatePlan = (sub) => {
    Alert.alert('Update Plan', `Change plan for ${sub.clinicName}?\n\nCurrent: ${sub.plan}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Upgrade to Pro', onPress: () => Alert.alert('Success', 'Plan upgraded!') },
      { text: 'Suspend', style: 'destructive', onPress: () => Alert.alert('Suspended', `${sub.clinicName} subscription suspended.`) },
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
          <Text style={styles.headerTitle}>Subscriptions</Text>
          <Text style={styles.headerSub}>Manage SaaS billing & active subscriptions</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: darkTheme.success }]}>{stats.mrr}</Text>
          <Text style={styles.statLabel}>Total MRR</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: darkTheme.danger }]}>{stats.churn}</Text>
          <Text style={styles.statLabel}>Churn Rate</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={darkTheme.textMuted} />
          <TextInput
            style={styles.searchInput} value={search} onChangeText={setSearch}
            placeholder="Search subscriptions..." placeholderTextColor={darkTheme.textMuted}
          />
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {FILTER_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.filterPill, filterStatus === opt && styles.filterPillActive]}
            onPress={() => setFilterStatus(opt)}
          >
            <Text style={[styles.filterPillText, filterStatus === opt && styles.filterPillTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="reader-outline" size={48} color={darkTheme.border} />
            <Text style={styles.emptyText}>No subscriptions found</Text>
          </View>
        )}
        {filtered.map((sub) => {
          const sc = getStatusColor(sub.status);
          return (
            <View key={sub.id} style={styles.subCard}>
              <View style={styles.subTop}>
                <View style={styles.subAvatar}>
                  <Text style={styles.subAvatarText}>{sub.clinicName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subName}>{sub.clinicName}</Text>
                  <Text style={styles.subEmail}>{sub.email}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusText, { color: sc.text }]}>{sub.status}</Text>
                </View>
              </View>
              <View style={styles.subDetails}>
                <View style={styles.detailChip}>
                  <Text style={styles.detailLabel}>Plan</Text>
                  <Text style={styles.detailValue}>{sub.plan}</Text>
                </View>
                <View style={styles.detailChip}>
                  <Text style={styles.detailLabel}>Cycle</Text>
                  <Text style={styles.detailValue}>{sub.billingCycle}</Text>
                </View>
                <View style={styles.detailChip}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={[styles.detailValue, { color: darkTheme.primary }]}>{sub.amount}</Text>
                </View>
              </View>
              {sub.nextBilling !== '-' && (
                <Text style={styles.nextBilling}>Next billing: {sub.nextBilling}</Text>
              )}
              <TouchableOpacity style={styles.updateBtn} onPress={() => handleUpdatePlan(sub)}>
                <Ionicons name="refresh-outline" size={14} color={darkTheme.primary} />
                <Text style={styles.updateBtnText}>Manage Subscription</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
  headerSub: { fontSize: 11, color: darkTheme.textMuted, marginTop: 2 },
  statsRow: {
    flexDirection: 'row', backgroundColor: darkTheme.card,
    borderBottomWidth: 1, borderBottomColor: darkTheme.border,
    paddingVertical: 14, paddingHorizontal: 8,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: darkTheme.text },
  statLabel: { fontSize: 11, color: darkTheme.textMuted, marginTop: 2 },
  searchRow: { padding: 12, backgroundColor: darkTheme.card, borderBottomWidth: 1, borderBottomColor: darkTheme.border },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: darkTheme.bg, borderWidth: 1, borderColor: darkTheme.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: darkTheme.text },
  filterScroll: { borderBottomWidth: 1, borderBottomColor: darkTheme.border, paddingVertical: 10, backgroundColor: darkTheme.card },
  filterPill: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20,
    backgroundColor: darkTheme.bg, borderWidth: 1, borderColor: darkTheme.border,
  },
  filterPillActive: { backgroundColor: darkTheme.primaryLight, borderColor: darkTheme.primary },
  filterPillText: { fontSize: 13, color: darkTheme.textMuted, fontWeight: '600' },
  filterPillTextActive: { color: darkTheme.primary },
  body: { padding: 16, gap: 12, paddingBottom: 40 },
  subCard: {
    backgroundColor: darkTheme.card, borderRadius: 14,
    borderWidth: 1, borderColor: darkTheme.border, padding: 14, gap: 10,
  },
  subTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: darkTheme.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  subAvatarText: { fontSize: 18, fontWeight: '700', color: darkTheme.primary },
  subName: { fontSize: 15, fontWeight: '700', color: darkTheme.text },
  subEmail: { fontSize: 12, color: darkTheme.textMuted },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '700' },
  subDetails: { flexDirection: 'row', gap: 8 },
  detailChip: {
    flex: 1, backgroundColor: darkTheme.bg, borderRadius: 10,
    padding: 8, alignItems: 'center', borderWidth: 1, borderColor: darkTheme.border,
  },
  detailLabel: { fontSize: 10, color: darkTheme.textMuted, marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '700', color: darkTheme.text },
  nextBilling: { fontSize: 12, color: darkTheme.textMuted },
  updateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: darkTheme.border, paddingTop: 10,
  },
  updateBtnText: { color: darkTheme.primary, fontWeight: '600', fontSize: 13 },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { color: darkTheme.textMuted, fontSize: 16 },
});
