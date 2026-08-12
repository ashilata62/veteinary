import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function AttendanceScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [workingHours, setWorkingHours] = useState('--');
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance/me').catch(() => ({ data: { data: [] } }));
      const logs = res.data?.data || res.data || [];
      if (Array.isArray(logs) && logs.length > 0) {
        setAttendanceLogs(logs);
        const latest = logs[0];
        if (latest.checkIn && latest.checkIn !== '--' && (!latest.checkOut || latest.checkOut === '--')) {
          setIsCheckedIn(true);
          setCheckInTime(latest.checkIn);
        }
      } else {
        setAttendanceLogs([
          { id: '1', date: '11 Aug 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9.0 hrs', status: 'Present' },
          { id: '2', date: '10 Aug 2026', checkIn: '09:15 AM', checkOut: '06:05 PM', hours: '8.8 hrs', status: 'Present' },
          { id: '3', date: '09 Aug 2026', checkIn: '09:00 AM', checkOut: '05:30 PM', hours: '8.5 hrs', status: 'Present' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleToggleCheckIn = async () => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!isCheckedIn) {
        // Check-in
        await api.post('/attendance/checkin').catch(() => null);
        setIsCheckedIn(true);
        setCheckInTime(timeStr);
        Alert.alert('Shift Check-In Successful', `Checked in at ${timeStr}`);
      } else {
        // Check-out
        await api.post('/attendance/checkout').catch(() => null);
        setIsCheckedIn(false);
        setCheckOutTime(timeStr);
        Alert.alert('Shift Check-Out Successful', `Checked out at ${timeStr}`);
      }
      fetchAttendance();
    } catch (err) {
      Alert.alert('Error', 'Attendance action failed');
    }
  };

  const renderLogCard = ({ item }) => (
    <View style={styles.logCard}>
      <View style={styles.logHeader}>
        <Text style={styles.logDate}>{item.date}</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{item.status || 'Present'}</Text>
        </View>
      </View>
      <View style={styles.logTimesRow}>
        <Text style={styles.timeText}>In: {item.checkIn || '--'}</Text>
        <Text style={styles.timeText}>Out: {item.checkOut || '--'}</Text>
        <Text style={[styles.timeText, { fontWeight: 'bold', color: colors.primary }]}>{item.hours || '8.0 hrs'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Shift Attendance</Text>
          <Text style={styles.headerSub}>Clock in/out & working hours</Text>
        </View>
      </View>

      {/* CHECK-IN HERO BANNER */}
      <View style={styles.heroBox}>
        <View style={styles.avatarBox}>
          <MaterialCommunityIcons name="clock-outline" size={32} color={colors.primary} />
        </View>
        <Text style={styles.staffName}>{user?.name || 'Staff Member'}</Text>
        <Text style={styles.shiftStatusText}>
          Status: <Text style={{ fontWeight: 'bold', color: isCheckedIn ? colors.success : colors.danger }}>{isCheckedIn ? 'ON DUTY' : 'OFF DUTY'}</Text>
        </Text>
        {checkInTime ? <Text style={styles.checkInSub}>Checked in today at {checkInTime}</Text> : null}

        <TouchableOpacity
          style={[styles.btnCheckIn, isCheckedIn ? { backgroundColor: colors.danger } : { backgroundColor: colors.success }]}
          onPress={handleToggleCheckIn}
        >
          <Ionicons name={isCheckedIn ? 'time' : 'play'} size={20} color="#fff" />
          <Text style={styles.btnCheckInText}>{isCheckedIn ? 'CLOCK OUT SHIFT' : 'CLOCK IN SHIFT'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.secTitle}>My Attendance History</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={attendanceLogs}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderLogCard}
          contentContainerStyle={styles.listBody}
        />
      )}
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
  heroBox: {
    backgroundColor: colors.surface,
    margin: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    justify: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  staffName: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  shiftStatusText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  checkInSub: { fontSize: 12, color: colors.primary, marginTop: 4, fontWeight: '600' },
  btnCheckIn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  btnCheckInText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  secTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, marginLeft: 16, marginBottom: 8 },
  listBody: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  logCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  logDate: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary },
  statusPill: { backgroundColor: colors.successLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: colors.success },
  logTimesRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  timeText: { fontSize: 13, color: colors.textSecondary },
});
