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
    { id: '3', pet: 'Rocky (Beagle)', owner: 'Karan Verma', phone: '+91 98765 33333', type: 'Deworming Second Dose', date: '20 Aug 2026', status: 'Sent' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendReminder = (id, pet, owner) => {
    Alert.alert(
      'Send Automated Reminder',
      `Trigger WhatsApp & Email reminder to ${owner} for ${pet}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Now',
          onPress: () => {
            setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'Sent' } : r));
            Alert.alert('Sent!', `Reminder notification dispatched successfully.`);
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
          <TouchableOpacity style={styles.btnSend} onPress={() => handleSendReminder(item.id, item.pet, item.owner)}>
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

      <FlatList
        data={reminders}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listBody}
      />
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
