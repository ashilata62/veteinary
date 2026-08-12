import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';

export default function DoctorRevenueScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    todayRevenue: '₹8,500',
    weekRevenue: '₹42,200',
    monthRevenue: '₹1,65,000',
    totalConsults: 48,
    homeVisitsCount: 12,
    surgeriesCount: 5,
  });

  const recentTransactions = [
    { id: '1', pet: 'Max (Golden Retriever)', type: 'Surgery Consultation', amount: '₹3,500', date: 'Today, 11:30 AM', status: 'Settled' },
    { id: '2', pet: 'Luna (Persian Cat)', type: 'Home Visit Fee', amount: '₹1,200', date: 'Today, 02:15 PM', status: 'Settled' },
    { id: '3', pet: 'Rocky (Beagle)', type: 'General OPD Consult', amount: '₹800', date: 'Yesterday', status: 'Settled' },
    { id: '4', pet: 'Bruno (Labrador)', type: 'Vaccination & Checkup', amount: '₹1,500', date: '10 Aug 2026', status: 'Settled' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My Doctor Earnings</Text>
          <Text style={styles.headerSub}>Personal consultations & revenue</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* TOTAL REVENUE HERO CARD */}
        <View style={styles.heroCard}>
          <Text style={styles.heroSubLabel}>This Month's Earnings</Text>
          <Text style={styles.heroAmount}>{stats.monthRevenue}</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroItemText}>Today: {stats.todayRevenue}</Text>
            <Text style={styles.heroItemText}>This Week: {stats.weekRevenue}</Text>
          </View>
        </View>

        {/* METRICS GRID */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Ionicons name="calendar-outline" size={22} color={colors.primary} />
            <Text style={styles.metricNum}>{stats.totalConsults}</Text>
            <Text style={styles.metricLbl}>Consultations</Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="navigate-outline" size={22} color={colors.secondary} />
            <Text style={styles.metricNum}>{stats.homeVisitsCount}</Text>
            <Text style={styles.metricLbl}>Home Visits</Text>
          </View>

          <View style={styles.metricCard}>
            <MaterialCommunityIcons name="needle" size={22} color={colors.warning} />
            <Text style={styles.metricNum}>{stats.surgeriesCount}</Text>
            <Text style={styles.metricLbl}>Surgeries</Text>
          </View>
        </View>

        <Text style={styles.secTitle}>Recent Earnings Log</Text>

        {recentTransactions.map(t => (
          <View key={t.id} style={styles.txCard}>
            <View style={styles.txHeader}>
              <Text style={styles.txPet}>{t.pet}</Text>
              <Text style={styles.txAmount}>{t.amount}</Text>
            </View>
            <View style={styles.txFooter}>
              <Text style={styles.txType}>{t.type} • {t.date}</Text>
              <Text style={styles.txStatus}>{t.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  scrollBody: { padding: 16, gap: 16 },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  heroSubLabel: { fontSize: 12, color: colors.primaryLight, fontWeight: '600', textTransform: 'uppercase' },
  heroAmount: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginVertical: 6 },
  heroRow: { flexDirection: 'row', gap: 16, marginTop: 6 },
  heroItemText: { fontSize: 12, color: '#e0f2fe' },
  metricsGrid: { flexDirection: 'row', gap: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricNum: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginTop: 6 },
  metricLbl: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  secTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, marginTop: 4 },
  txCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txPet: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary },
  txAmount: { fontSize: 15, fontWeight: 'bold', color: colors.success },
  txFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  txType: { fontSize: 12, color: colors.textSecondary },
  txStatus: { fontSize: 11, color: colors.success, fontWeight: 'bold' },
});
