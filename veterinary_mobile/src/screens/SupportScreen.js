import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import api from '../config/api';

export default function SupportScreen({ navigation }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitTicket = async () => {
    if (!subject || !description) {
      Alert.alert('Required Fields', 'Please enter ticket subject and description.');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/v1/support-tickets', {
        subject,
        description,
        priority: 'Medium',
        category: 'Technical'
      });
      Alert.alert('Ticket Submitted', 'Our technical support team will contact you within 2 hours.');
      setSubject('');
      setDescription('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to submit ticket. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+919752100980').catch(() => Alert.alert('Support', '+91 97521 00980'));
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:info@kiaantechnology.com').catch(() => Alert.alert('Support', 'info@kiaantechnology.com'));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Support & Help Desk</Text>
          <Text style={styles.headerSub}>Technical support powered by Kiaan Tech</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* DIRECT CONTACT CARDS */}
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard} onPress={handleCallSupport}>
            <Ionicons name="call" size={24} color={colors.primary} />
            <Text style={styles.contactTitle}>Call Support</Text>
            <Text style={styles.contactSub}>+91 97521 00980</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleEmailSupport}>
            <Ionicons name="mail" size={24} color={colors.secondary} />
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSub}>info@kiaantech...</Text>
          </TouchableOpacity>
        </View>

        {/* TICKET FORM */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submit a Support Ticket</Text>
          <Text style={styles.cardSub}>Facing any software issue or billing question? Describe it below.</Text>

          <TextInput
            style={styles.input}
            placeholder="Issue Subject (e.g. Printer / POS Billing Issue)"
            placeholderTextColor={colors.textMuted}
            value={subject}
            onChangeText={setSubject}
          />

          <TextInput
            style={[styles.input, { height: 90 }]}
            placeholder="Detailed description of the problem..."
            placeholderTextColor={colors.textMuted}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmitTicket} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Submit Ticket</Text>}
          </TouchableOpacity>
        </View>
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
  contactRow: { flexDirection: 'row', gap: 12 },
  contactCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, marginTop: 8 },
  contactSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  cardSub: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: colors.textPrimary,
  },
  btnSubmit: {
    backgroundColor: colors.primary,
    height: 46,
    borderRadius: 12,
    justify: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  btnSubmitText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
