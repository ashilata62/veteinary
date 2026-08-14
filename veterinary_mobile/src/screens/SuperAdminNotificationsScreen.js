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

const NOTIFICATIONS = [
  {
    id: 1, type: 'alert', title: 'High CPU Usage',
    desc: 'Database server CPU exceeded 90% threshold for 5 minutes.',
    time: '10 mins ago', icon: 'warning-outline', color: darkTheme.danger, bg: 'rgba(239,68,68,0.12)',
  },
  {
    id: 2, type: 'billing', title: 'Payment Failed',
    desc: 'Enterprise subscription renewal failed for City Vet Clinic.',
    time: '1 hour ago', icon: 'card-outline', color: darkTheme.gold, bg: 'rgba(245,158,11,0.12)',
  },
  {
    id: 3, type: 'user', title: 'New Clinic Registered',
    desc: 'Paws & Claws Care started a 7-day free trial.',
    time: '3 hours ago', icon: 'person-add-outline', color: darkTheme.success, bg: 'rgba(16,185,129,0.12)',
  },
  {
    id: 4, type: 'system', title: 'Backup Completed',
    desc: 'Daily automated database backup completed successfully.',
    time: '12 hours ago', icon: 'checkmark-circle-outline', color: darkTheme.blue, bg: 'rgba(59,130,246,0.12)',
  },
  {
    id: 5, type: 'user', title: 'New Support Ticket',
    desc: 'Downtown Animal ER submitted a high priority support ticket.',
    time: '1 day ago', icon: 'chatbubble-outline', color: darkTheme.primary, bg: 'rgba(20,184,166,0.12)',
  },
];

export default function SuperAdminNotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    Alert.alert('Marked as read', 'All notifications have been marked as read.');
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSub}>System alerts, billing updates & platform events</Text>
        </View>
        <TouchableOpacity style={styles.markBtn} onPress={markAllRead}>
          <Ionicons name="checkmark-done-outline" size={16} color={darkTheme.primary} />
          <Text style={styles.markBtnText}>Mark all</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Badges */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBadge}>
          <Text style={[styles.summaryNum, { color: darkTheme.danger }]}>
            {notifications.filter(n => n.type === 'alert').length}
          </Text>
          <Text style={styles.summaryLabel}>Alerts</Text>
        </View>
        <View style={styles.summaryBadge}>
          <Text style={[styles.summaryNum, { color: darkTheme.gold }]}>
            {notifications.filter(n => n.type === 'billing').length}
          </Text>
          <Text style={styles.summaryLabel}>Billing</Text>
        </View>
        <View style={styles.summaryBadge}>
          <Text style={[styles.summaryNum, { color: darkTheme.success }]}>
            {notifications.filter(n => n.type === 'user').length}
          </Text>
          <Text style={styles.summaryLabel}>Users</Text>
        </View>
        <View style={styles.summaryBadge}>
          <Text style={[styles.summaryNum, { color: darkTheme.blue }]}>
            {notifications.filter(n => n.type === 'system').length}
          </Text>
          <Text style={styles.summaryLabel}>System</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={52} color={darkTheme.border} />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        )}
        {notifications.map((notif) => (
          <View key={notif.id} style={styles.notifCard}>
            <View style={[styles.notifIcon, { backgroundColor: notif.bg }]}>
              <Ionicons name={notif.icon} size={22} color={notif.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.notifTopRow}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              <Text style={styles.notifDesc}>{notif.desc}</Text>
            </View>
            <TouchableOpacity onPress={() => dismissNotification(notif.id)} style={styles.dismissBtn}>
              <Ionicons name="close-outline" size={18} color={darkTheme.textMuted} />
            </TouchableOpacity>
          </View>
        ))}
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
  markBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 10, borderWidth: 1, borderColor: darkTheme.primary + '60',
  },
  markBtnText: { color: darkTheme.primary, fontSize: 12, fontWeight: '600' },
  summaryRow: {
    flexDirection: 'row', backgroundColor: darkTheme.card,
    borderBottomWidth: 1, borderBottomColor: darkTheme.border,
    paddingVertical: 12, paddingHorizontal: 8,
  },
  summaryBadge: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 11, color: darkTheme.textMuted, marginTop: 2 },
  body: { padding: 16, gap: 12, paddingBottom: 40 },
  notifCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: darkTheme.card, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: darkTheme.border,
  },
  notifIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  notifTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: darkTheme.text, flex: 1 },
  notifTime: { fontSize: 11, color: darkTheme.textMuted },
  notifDesc: { fontSize: 13, color: darkTheme.textSub, lineHeight: 18 },
  dismissBtn: { padding: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: darkTheme.textMuted },
});
