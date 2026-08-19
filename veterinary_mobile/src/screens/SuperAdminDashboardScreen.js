import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons } from '@expo/vector-icons';

const lightTheme = {
  bg: '#f8fafc',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  primary: '#0f766e',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export default function SuperAdminDashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: '₹5.2L',
    monthlyRevenue: '₹45K',
    totalClinics: 30,
    activePaidClinics: 24,
    freeTrialClinics: 9,
    expiredBlocked: 6,
    openTickets: 12,
  });

  const [renewals, setRenewals] = useState([
    { id: '1', clinic: 'Downtown Pet Care', owner: 'Dr. John Doe', expiry: '18 Aug 2026', plan: '7-Day Trial', status: 'Trial' },
    { id: '2', clinic: 'PetCare Central', owner: 'Dr. Jane Smith', expiry: '22 Aug 2026', plan: 'Monthly Pro', status: 'Pro' },
    { id: '3', clinic: 'Paws & Claws Clinic', owner: 'Dr. Vikram Singh', expiry: '28 Aug 2026', plan: 'Yearly Enterprise', status: 'Enterprise' },
    { id: '4', clinic: 'City Pet Hospital', owner: 'Rajesh Kumar', expiry: '30 Aug 2026', plan: '7-Day Trial', status: 'Trial' },
  ]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/stats');
      if (res.data && res.data.data) {
        const d = res.data.data;
        setStats({
          totalRevenue: `₹${(d.totalRevenue / 100000).toFixed(1)}L`,
          monthlyRevenue: `₹${(d.monthlyRevenue / 1000).toFixed(0)}K`,
          totalClinics: d.totalClinics || 30,
          activePaidClinics: d.paidClinics || 24,
          freeTrialClinics: d.trialClinics || 9,
          expiredBlocked: d.expiredTrials || 6,
          openTickets: d.openSupportTickets || 12,
        });
      }
    } catch (e) {
      console.log('Using default SuperAdmin stats dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f766e" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerSub}>Super Admin Control Panel</Text>
            <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color="#ffffff" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Financial Overview Cards */}
        <Text style={styles.sectionTitle}>Financial & Business Overview</Text>

        <View style={styles.metricsGrid}>
          {/* Total Revenue */}
          <View style={[styles.statCard, { borderLeftColor: lightTheme.primary }]}>
            <Text style={styles.statLabel}>TOTAL REVENUE</Text>
            <Text style={styles.statVal}>{stats.totalRevenue}</Text>
            <Text style={styles.statTrend}>↑ 12% overall</Text>
          </View>

          {/* Monthly Revenue */}
          <View style={[styles.statCard, { borderLeftColor: lightTheme.success }]}>
            <Text style={styles.statLabel}>MONTHLY REVENUE</Text>
            <Text style={styles.statVal}>{stats.monthlyRevenue}</Text>
            <Text style={styles.statTrend}>↑ 9% this month</Text>
          </View>

          {/* Total Clinics */}
          <View style={[styles.statCard, { borderLeftColor: '#8b5cf6' }]}>
            <Text style={styles.statLabel}>TOTAL CLINICS</Text>
            <Text style={styles.statVal}>{stats.totalClinics}</Text>
            <Text style={styles.statSub}>Registered practices</Text>
          </View>

          {/* Active Paid */}
          <View style={[styles.statCard, { borderLeftColor: '#06b6d4' }]}>
            <Text style={styles.statLabel}>ACTIVE PAID ADMINS</Text>
            <Text style={styles.statVal}>{stats.activePaidClinics}</Text>
            <Text style={styles.statSub}>Paid subscribers</Text>
          </View>

          {/* Free Trial */}
          <View style={[styles.statCard, { borderLeftColor: lightTheme.warning }]}>
            <Text style={styles.statLabel}>FREE TRIAL ADMINS</Text>
            <Text style={styles.statVal}>{stats.freeTrialClinics}</Text>
            <Text style={styles.statSub}>7-day trial active</Text>
          </View>

          {/* Expired / Blocked */}
          <View style={[styles.statCard, { borderLeftColor: lightTheme.danger }]}>
            <Text style={styles.statLabel}>EXPIRED / BLOCKED</Text>
            <Text style={styles.statVal}>{stats.expiredBlocked}</Text>
            <Text style={styles.statSub}>Action required</Text>
          </View>
        </View>

        {/* Upcoming Renewals */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Upcoming Renewals</Text>

        {renewals.map((item) => (
          <View key={item.id} style={styles.renewalCard}>
            <View style={styles.renLeft}>
              <Text style={styles.renClinic}>{item.clinic}</Text>
              <Text style={styles.renOwner}>Owner: {item.owner}</Text>
              <Text style={styles.renExpiry}>Expiry: {item.expiry}</Text>
            </View>

            <View
              style={[
                styles.planBadge,
                item.status === 'Pro'
                  ? { backgroundColor: '#ccfbf1' }
                  : item.status === 'Enterprise'
                  ? { backgroundColor: '#f3e8ff' }
                  : { backgroundColor: '#fef3c7' },
              ]}
            >
              <Text
                style={[
                  styles.planBadgeText,
                  item.status === 'Pro'
                    ? { color: lightTheme.primary }
                    : item.status === 'Enterprise'
                    ? { color: '#7e22ce' }
                    : { color: lightTheme.warning },
                ]}
              >
                {item.plan}
              </Text>
            </View>
          </View>
        ))}

        {/* Quick Access to New Screens */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Quick Access</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Plans', icon: 'pricetag-outline', screen: 'SuperPlans', color: '#14b8a6' },
            { label: 'Reports', icon: 'bar-chart-outline', screen: 'SuperReports', color: '#3b82f6' },
            { label: 'Subscriptions', icon: 'refresh-circle-outline', screen: 'SuperSubscriptions', color: '#8b5cf6' },
            { label: 'Notifications', icon: 'notifications-outline', screen: 'SuperNotifications', color: '#f59e0b' },
          ].map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={{
                width: '47%', backgroundColor: '#ffffff', borderRadius: 14,
                padding: 16, borderWidth: 1, borderColor: '#e2e8f0',
                flexDirection: 'row', alignItems: 'center', gap: 10,
                elevation: 2,
              }}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: item.color + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#0f172a', flex: 1 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.bg,
  },
  header: {
    backgroundColor: '#0f766e',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleBox: {
    flex: 1,
    marginRight: 12,
  },
  headerSub: {
    color: '#ccfbf1',
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
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
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: lightTheme.textPrimary,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: lightTheme.cardBg,
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: lightTheme.cardBorder,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: lightTheme.textMuted,
    letterSpacing: 0.5,
  },
  statVal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: lightTheme.textPrimary,
    marginTop: 4,
  },
  statTrend: {
    fontSize: 11,
    color: lightTheme.success,
    fontWeight: '600',
    marginTop: 4,
  },
  statSub: {
    fontSize: 11,
    color: lightTheme.textSecondary,
    marginTop: 4,
  },
  renewalCard: {
    backgroundColor: lightTheme.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightTheme.cardBorder,
    elevation: 1,
  },
  renLeft: {
    flex: 1,
  },
  renClinic: {
    fontSize: 15,
    fontWeight: 'bold',
    color: lightTheme.textPrimary,
  },
  renOwner: {
    fontSize: 12,
    color: lightTheme.textSecondary,
    marginTop: 2,
  },
  renExpiry: {
    fontSize: 12,
    color: lightTheme.textMuted,
    marginTop: 2,
  },
  planBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
