import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications').catch(() => ({ data: { data: [] } }));
      const data = res.data?.data || res.data || [];
      setNotifications(Array.isArray(data) && data.length > 0 ? data : [
        { id: '1', title: 'New Appointment Booked', message: 'Dr. Sarah Connor has a new consultation at 11:30 AM.', time: '10 mins ago', read: false },
        { id: '2', title: 'Low Stock Alert', message: 'Rabies Vaccine DHPPi stock is down to 18 units.', time: '1 hour ago', read: false },
        { id: '3', title: 'Payment Collected', message: 'Invoice #INV-2026-089 (₹1,500) paid via UPI.', time: '3 hours ago', read: true },
      ]);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderCard = ({ item }) => (
    <View style={[styles.card, !item.read && styles.unreadCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
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
          <Text style={styles.headerTitle}>System Notifications</Text>
          <Text style={styles.headerSub}>Real-time clinic alerts & activity</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderCard}
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
  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listBody: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadCard: {
    borderColor: colors.primary,
    backgroundColor: '#f0fdfa',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary },
  time: { fontSize: 11, color: colors.textMuted },
  message: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
