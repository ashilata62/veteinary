import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import api from '../config/api';

const darkTheme = {
  bg: '#f1f5f9', card: '#ffffff', border: '#e2e8f0',
  primary: '#0f766e', primaryLight: '#ccfbf1',
  text: '#0f172a', textSub: '#475569', textMuted: '#94a3b8',
  gold: '#d97706', danger: '#dc2626', success: '#16a34a', blue: '#2563eb',
};

const PLATFORM_STATS = [
  { label: 'MRR Growth', value: '+14.5%', color: darkTheme.blue, icon: 'trending-up-outline' },
  { label: 'Avg Revenue / User', value: '₹1,240', color: darkTheme.success, icon: 'cash-outline' },
  { label: 'Failed Transactions', value: '2.1%', color: darkTheme.gold, icon: 'alert-circle-outline' },
  { label: 'Daily Active Users', value: '4,210', color: darkTheme.primary, icon: 'people-outline' },
  { label: 'API Requests/Day', value: '1.2M', color: darkTheme.blue, icon: 'pulse-outline' },
  { label: 'Total Data Stored', value: '142 TB', color: darkTheme.gold, icon: 'server-outline' },
];

const PLAN_BREAKDOWN = [
  { plan: '7-Day Free Trial', clinics: 82, revenue: '₹0', color: darkTheme.gold },
  { plan: 'Starter (₹599/mo)', clinics: 124, revenue: '₹74,276', color: darkTheme.primary },
  { plan: 'Standard (₹799/mo)', clinics: 97, revenue: '₹77,503', color: darkTheme.success },
  { plan: 'Pro (₹1,299/mo)', clinics: 58, revenue: '₹75,342', color: darkTheme.blue },
  { plan: 'Enterprise (Custom)', clinics: 21, revenue: '₹1,89,000', color: '#8b5cf6' },
];

export default function SuperAdminReportsScreen({ navigation }) {
  const totalRevenue = '₹4,16,121';

  const handleExport = () => {
    Alert.alert('Export Report', 'Report export initiated. Download will be sent to your email.');
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
          <Text style={styles.headerTitle}>Platform Reports</Text>
          <Text style={styles.headerSub}>Revenue analytics & usage statistics</Text>
        </View>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
          <Ionicons name="download-outline" size={16} color={darkTheme.primary} />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* Total Revenue Banner */}
        <View style={styles.revenueBanner}>
          <View>
            <Text style={styles.revenueBannerLabel}>Monthly Recurring Revenue</Text>
            <Text style={styles.revenueBannerValue}>{totalRevenue}</Text>
          </View>
          <View style={styles.revenueTrend}>
            <Ionicons name="trending-up" size={22} color={darkTheme.success} />
            <Text style={{ color: darkTheme.success, fontWeight: '700', fontSize: 15 }}>+14.5%</Text>
          </View>
        </View>

        {/* Platform KPI Stats */}
        <Text style={styles.sectionTitle}>Platform KPIs</Text>
        <View style={styles.statsGrid}>
          {PLATFORM_STATS.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue by Plan Breakdown */}
        <Text style={styles.sectionTitle}>Revenue by Plan</Text>
        <View style={styles.planTable}>
          <View style={styles.planTableHeader}>
            <Text style={[styles.planTableHead, { flex: 2 }]}>Plan</Text>
            <Text style={styles.planTableHead}>Clinics</Text>
            <Text style={styles.planTableHead}>Revenue</Text>
          </View>
          {PLAN_BREAKDOWN.map((row, i) => (
            <View key={i} style={[styles.planTableRow, i % 2 === 1 && styles.planTableRowAlt]}>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: row.color }} />
                <Text style={styles.planTableCell}>{row.plan}</Text>
              </View>
              <Text style={[styles.planTableCell, { fontWeight: '700' }]}>{row.clinics}</Text>
              <Text style={[styles.planTableCell, { color: darkTheme.success, fontWeight: '700' }]}>{row.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Chart Placeholder */}
        <Text style={styles.sectionTitle}>User Growth Over Time</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart-outline" size={52} color={darkTheme.border} />
          <Text style={styles.chartPlaceholderTitle}>Monthly Active Clinics</Text>
          <Text style={styles.chartPlaceholderSub}>Chart will render with real backend data connection.</Text>
        </View>

        <Text style={styles.sectionTitle}>Storage Distribution</Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="pie-chart-outline" size={52} color={darkTheme.border} />
          <Text style={styles.chartPlaceholderTitle}>Storage by Tenant</Text>
          <Text style={styles.chartPlaceholderSub}>Connect backend analytics endpoint to render this chart.</Text>
        </View>

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
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10,
    borderWidth: 1, borderColor: darkTheme.primary + '60',
  },
  exportBtnText: { color: darkTheme.primary, fontSize: 12, fontWeight: '600' },
  body: { padding: 16, paddingBottom: 40, gap: 16 },
  revenueBanner: {
    backgroundColor: darkTheme.primaryLight, borderRadius: 16, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: darkTheme.primary + '40',
  },
  revenueBannerLabel: { fontSize: 13, color: darkTheme.textSub, marginBottom: 4 },
  revenueBannerValue: { fontSize: 28, fontWeight: '800', color: darkTheme.primary },
  revenueTrend: { alignItems: 'center', gap: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: darkTheme.text, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: '47%', backgroundColor: darkTheme.card, borderRadius: 14,
    borderWidth: 1, borderColor: darkTheme.border, padding: 14, alignItems: 'flex-start', gap: 8,
  },
  statIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 12, color: darkTheme.textMuted },
  planTable: {
    backgroundColor: darkTheme.card, borderRadius: 14,
    borderWidth: 1, borderColor: darkTheme.border, overflow: 'hidden',
  },
  planTableHeader: {
    flexDirection: 'row', backgroundColor: '#0f172a',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  planTableHead: { flex: 1, fontSize: 12, fontWeight: '700', color: darkTheme.textMuted },
  planTableRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12 },
  planTableRowAlt: { backgroundColor: '#0f172a' },
  planTableCell: { flex: 1, fontSize: 13, color: darkTheme.textSub },
  chartPlaceholder: {
    backgroundColor: darkTheme.card, borderRadius: 14,
    borderWidth: 1, borderColor: darkTheme.border,
    padding: 32, alignItems: 'center', gap: 10,
  },
  chartPlaceholderTitle: { fontSize: 15, fontWeight: '600', color: darkTheme.textSub },
  chartPlaceholderSub: { fontSize: 12, color: darkTheme.textMuted, textAlign: 'center' },
});
