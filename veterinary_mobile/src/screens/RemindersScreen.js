import React, { useState, useEffect } from 'react';
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
import { colors } from '../theme/colors';

export default function RemindersScreen({ navigation }) {
  const [reminders, setReminders] = useState([
    { id: '1', pet: 'Max (Golden Retriever)', owner: 'Rahul Sharma', phone: '+91 98765 11111', type: 'Annual Rabies Booster Due', date: '15 Aug 2026', status: 'Pending' },
    { id: '2', pet: 'Bella (Persian Cat)', owner: 'Neha Gupta', phone: '+91 98765 22222', type: 'Post-Surgery Follow Up Visit', date: '18 Aug 2026', status: 'Pending' },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchRemindersQueue = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments/upcoming-reminders');
      const list = res.data?.data || [];
      if (Array.isArray(list)) {
        const mapped = list.map(item => ({
          id: String(item.id),
          pet: `${item.petName} (${item.petBreed || 'Patient'})`,
          owner: item.ownerName,
          phone: item.ownerMobile || 'No phone',
          email: item.ownerEmail || '',
          type: item.notes || 'General Consultation Reminder',
          date: item.appointment_date ? item.appointment_date.split('T')[0] : '',
          time: item.appointment_time,
          status: item.reminder_sent ? 'Sent' : 'Pending',
          doctorName: item.doctorName || 'Pet Doctor',
        }));
        setReminders(mapped);
      }
    } catch (e) {
      console.log('Error loading reminders queue:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemindersQueue();
  }, []);

  const handleSendReminder = (item) => {
    let timeStr = item.time || '';
    if (timeStr && timeStr.includes(':')) {
        const [hour, minute] = timeStr.split(':');
        const hr = parseInt(hour, 10);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const hr12 = hr % 12 || 12;
        timeStr = `${hr12.toString().padStart(2, '0')}:${minute} ${ampm}`;
    }

    const defaultMessage = `Dear ${item.owner},

This is a reminder that your pet ${item.pet} has an appointment for "${item.type}" with ${item.doctorName} at PetCare Pro.

Scheduled Time: ${timeStr} on ${item.date}

Please bring your pet on a leash or in a suitable carrier. If you need to reschedule or cancel, please contact us.

Best regards,
PetCare Pro Animal Hospital`;

    Alert.alert(
      'Send Automated Reminder',
      `Trigger WhatsApp & Email reminder to ${item.owner} for ${item.pet}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Now',
          onPress: async () => {
            try {
              setLoading(true);
              await api.post(`/appointments/${item.id}/send-reminder`, {
                messageBody: defaultMessage,
                customRecipientEmail: item.email,
              });
              Alert.alert('Sent!', `Reminder notification dispatched successfully.`);
              fetchRemindersQueue();
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to dispatch reminder email.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderCard = ({ item }) => {
    const isSent = item.status === 'Sent';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.typeBadge}>
            <Ionicons name="notifications-outline" size={14} color={colors.primary} />
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
          <Text style={[styles.statusText, isSent ? { color: colors.success } : { color: colors.warning }]}>
            {item.status}
          </Text>
        </View>

        <Text style={styles.petText}>{item.pet}</Text>
        <Text style={styles.ownerText}>Client: {item.owner} ({item.phone})</Text>
        <Text style={styles.dateText}>Due Date: {item.date}</Text>

        {!isSent ? (
          <TouchableOpacity style={styles.btnSend} onPress={() => handleSendReminder(item)}>
            <Ionicons name="paper-plane-outline" size={16} color="#fff" />
            <Text style={styles.btnSendText}>Send Email & WhatsApp Alert</Text>
          </TouchableOpacity>
        ) : null}
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
          <Text style={styles.headerTitle}>Automated Client Reminders</Text>
          <Text style={styles.headerSub}>Vaccination & appointment queues</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={item => item.id}
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
  listBody: { padding: 16, gap: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  typeBadgeText: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  petText: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  ownerText: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  dateText: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  btnSend: {
    backgroundColor: colors.primary,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    justify: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  btnSendText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
