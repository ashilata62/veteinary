import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const role = user?.role || 'Doctor';
  const roleLower = role.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    todayAppointments: 8,
    activePatients: 42,
    pendingInvoices: 3,
    homeVisits: 2,
    careTasks: 5,
    dailyRevenue: '₹45,000',
  });

  const [recentAppointments, setRecentAppointments] = useState([
    { id: '1', petName: 'Max', species: 'Dog (Golden)', ownerName: 'Rahul Sharma', time: '10:30 AM', type: 'General Checkup', status: 'Confirmed' },
    { id: '2', petName: 'Luna', species: 'Cat (Persian)', ownerName: 'Priya Singh', time: '11:45 AM', type: 'Vaccination', status: 'In Progress' },
    { id: '3', petName: 'Rocky', species: 'Dog (Beagle)', ownerName: 'Amit Patel', time: '02:15 PM', type: 'Dental Cleaning', status: 'Pending' },
  ]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments').catch(() => ({ data: [] }));
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      if (list.length > 0) {
        setRecentAppointments(list.slice(0, 5));
        setStats((prev) => ({ ...prev, todayAppointments: list.length }));
      }
    } catch (err) {
      console.log('Using default dashboard dataset:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getPortalTitle = () => {
    if (roleLower.includes('admin')) return 'Admin Control Center';
    if (roleLower.includes('reception')) return 'Receptionist Portal';
    if (roleLower.includes('assistant')) return 'Vet Assistant Workspace';
    if (roleLower.includes('manager')) return 'Manager Dashboard';
    return 'Doctor Workspace';
  };

  const getPortalHeaderBg = () => {
    if (roleLower.includes('admin')) return '#0f766e';
    if (roleLower.includes('reception')) return '#0d9488';
    if (roleLower.includes('assistant')) return '#052e16';
    if (roleLower.includes('manager')) return '#0e7490';
    return '#065f46';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={getPortalHeaderBg()} />

      {/* Top Banner Header */}
      <View style={[styles.header, { backgroundColor: getPortalHeaderBg() }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Welcome Back,</Text>
            <Text style={styles.userName}>{user?.name || 'Staff Member'}</Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: '#ffffff' }]}>
            <MaterialCommunityIcons name="stethoscope" size={14} color={getPortalHeaderBg()} />
            <Text style={[styles.roleBadgeText, { color: getPortalHeaderBg() }]}>{role.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.clinicCard}>
          <Text style={styles.portalTitle}>{getPortalTitle()}</Text>
          <Text style={styles.clinicSub}>VetCare Pro Clinic Center • Online</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Quick Overview Grid */}
        <Text style={styles.sectionHeader}>Today's Overview ({role})</Text>

        <View style={styles.statsGrid}>
          {/* Tile 1 */}
          <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.primary }]}>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{stats.todayAppointments}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>

          {/* Tile 2 */}
          <View style={[styles.statCard, { backgroundColor: colors.secondaryLight }]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.secondary }]}>
              <MaterialCommunityIcons name="dog" size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{stats.activePatients}</Text>
            <Text style={styles.statLabel}>{roleLower.includes('doc') ? 'My Patients' : 'Active Pets'}</Text>
          </View>

          {/* Tile 3 */}
          {roleLower.includes('assistant') ? (
            <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
              <View style={[styles.statIconBox, { backgroundColor: '#f59e0b' }]}>
                <Ionicons name="checkbox-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.statNumber}>{stats.careTasks}</Text>
              <Text style={styles.statLabel}>Assistance Tasks</Text>
            </View>
          ) : (
            <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
              <View style={[styles.statIconBox, { backgroundColor: '#f59e0b' }]}>
                <Ionicons name="cash-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.statNumber}>{stats.pendingInvoices}</Text>
              <Text style={styles.statLabel}>Pending Bills</Text>
            </View>
          )}

          {/* Tile 4 */}
          <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#3b82f6' }]}>
              <Ionicons name="navigate-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{stats.homeVisits}</Text>
            <Text style={styles.statLabel}>Home Visits</Text>
          </View>
        </View>

        {/* Quick Action Shortcuts */}
        <Text style={styles.sectionHeader}>Quick Actions for {role}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 10 }}>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Appointments')}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Visits</Text>
          </TouchableOpacity>

          {(roleLower.includes('reception') || roleLower.includes('admin')) && (
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PetOwners')}>
              <Ionicons name="people-outline" size={20} color={colors.secondary} />
              <Text style={styles.actionText}>Pet Owners</Text>
            </TouchableOpacity>
          )}

          {roleLower.includes('doc') && (
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('MedicalRecords')}>
              <Ionicons name="fitness-outline" size={20} color={colors.danger} />
              <Text style={styles.actionText}>EMR Log</Text>
            </TouchableOpacity>
          )}

          {roleLower.includes('doc') && (
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Prescriptions')}>
              <MaterialCommunityIcons name="pill" size={20} color={colors.primary} />
              <Text style={styles.actionText}>Create Rx</Text>
            </TouchableOpacity>
          )}

          {roleLower.includes('assistant') && (
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AssistanceTasks')}>
              <Ionicons name="checkbox-outline" size={20} color={colors.success} />
              <Text style={styles.actionText}>Care Tasks</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('HomeVisits')}>
            <Ionicons name="navigate-outline" size={20} color={colors.warning} />
            <Text style={styles.actionText}>Home Visit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Hospitalization')}>
            <Ionicons name="bed-outline" size={20} color={colors.info} />
            <Text style={styles.actionText}>Wards</Text>
          </TouchableOpacity>

          {(roleLower.includes('reception') || roleLower.includes('admin') || roleLower.includes('doc')) && (
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Billing')}>
              <Ionicons name="card-outline" size={20} color={colors.success} />
              <Text style={styles.actionText}>POS Bill</Text>
            </TouchableOpacity>
          )}

          {roleLower.includes('admin') && (
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('StaffManagement')}>
              <Ionicons name="person-add-outline" size={20} color={colors.primary} />
              <Text style={styles.actionText}>Staff</Text>
            </TouchableOpacity>
          )}

          {roleLower.includes('admin') && (
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Reports')}>
              <Ionicons name="stats-chart-outline" size={20} color={colors.secondary} />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Attendance')}>
            <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Attendance</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Upcoming Appointments Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Today's Schedule</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          recentAppointments.map((item) => (
            <View key={item.id} style={styles.appointmentCard}>
              <View style={styles.appCardLeft}>
                <View style={styles.petIconCircle}>
                  <MaterialCommunityIcons name="dog" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.petNameText}>{item.petName || item.pet_name}</Text>
                  <Text style={styles.ownerText}>Owner: {item.ownerName || item.owner_name}</Text>
                  <Text style={styles.serviceText}>{item.type || 'OPD Visit'}</Text>
                </View>
              </View>

              <View style={styles.appCardRight}>
                <View style={styles.timeBox}>
                  <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                  <Text style={styles.timeText}>{item.time || '10:00 AM'}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    item.status === 'Confirmed'
                      ? { backgroundColor: colors.successLight }
                      : item.status === 'In Progress'
                      ? { backgroundColor: colors.infoLight }
                      : { backgroundColor: colors.warningLight },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      item.status === 'Confirmed'
                        ? { color: colors.success }
                        : item.status === 'In Progress'
                        ? { color: colors.info }
                        : { color: colors.warning },
                    ]}
                  >
                    {item.status || 'Pending'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primaryDark,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingText: { color: colors.primaryLight, fontSize: 13 },
  userName: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleBadgeText: { color: colors.primaryDark, fontSize: 11, fontWeight: 'bold' },
  clinicCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
  },
  portalTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  clinicSub: { color: colors.primaryLight, fontSize: 12, marginTop: 2 },
  scrollBody: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 6 },
  seeAllText: { color: colors.primary, fontWeight: 'bold', fontSize: 13 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: { width: '48%', borderRadius: 16, padding: 14, elevation: 1 },
  statIconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  actionButton: {
    width: 96,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  actionText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, marginTop: 6 },
  appointmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  appCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  petIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petNameText: { fontSize: 15, fontWeight: 'bold', color: colors.textPrimary },
  ownerText: { fontSize: 12, color: colors.textSecondary },
  serviceText: { fontSize: 12, color: colors.primary, fontWeight: '500', marginTop: 2 },
  appCardRight: { alignItems: 'flex-end', gap: 6 },
  timeBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
});
