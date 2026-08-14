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
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import api from '../config/api';

const PRIORITIES = ['Low', 'Medium', 'High'];
const CATEGORIES = ['Technical', 'Billing', 'General'];

export default function SupportScreen({ navigation }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Technical');
  const [submitting, setSubmitting] = useState(false);

  // Selector states
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorType, setSelectorType] = useState(''); // 'priority', 'category'

  const handleSubmitTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Required Fields', 'Please enter ticket subject and description.');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/support-tickets', {
        subject,
        description,
        priority,
        category,
      });
      Alert.alert('Ticket Submitted', 'Our technical support team will contact you within 2 hours.');
      setSubject('');
      setDescription('');
      setPriority('Medium');
      setCategory('Technical');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err?.response?.data?.message || 'Failed to submit ticket. Please check connection.');
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

  const handleOpenSelector = (type) => {
    setSelectorType(type);
    setSelectorVisible(true);
  };

  const handleSelectOption = (item) => {
    if (selectorType === 'priority') {
      setPriority(item);
    } else if (selectorType === 'category') {
      setCategory(item);
    }
    setSelectorVisible(false);
  };

  const getSelectorOptions = () => {
    return selectorType === 'priority' ? PRIORITIES : CATEGORIES;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
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
            <Ionicons name="mail" size={24} color={colors.primary} />
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactSub}>info@kiaantech...</Text>
          </TouchableOpacity>
        </View>

        {/* TICKET FORM */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submit a Support Ticket</Text>
          <Text style={styles.cardSub}>Facing any software issue or billing question? Describe it below.</Text>

          {/* Subject */}
          <Text style={styles.label}>Issue Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Printer / POS Billing Issue"
            placeholderTextColor={colors.textMuted}
            value={subject}
            onChangeText={setSubject}
          />

          <View style={styles.dropdownRow}>
            {/* Priority Picker */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Priority</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('priority')}>
                <Text style={styles.selectorBtnText}>{priority}</Text>
                <Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Category Picker */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => handleOpenSelector('category')}>
                <Text style={styles.selectorBtnText}>{category}</Text>
                <Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
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

      {/* Selector Modal */}
      <Modal visible={selectorVisible} transparent animationType="fade">
        <View style={styles.selectorOverlay}>
          <View style={styles.selectorContent}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>Select {selectorType.toUpperCase()}</Text>
              <TouchableOpacity onPress={() => setSelectorVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={getSelectorOptions()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectorItem}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={styles.selectorItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryDark,
  },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  headerSub: { fontSize: 12, color: '#ccfbf1' },
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
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: colors.textPrimary,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectorBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  selectorBtnText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  btnSubmit: {
    backgroundColor: colors.primary,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnSubmitText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  selectorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '75%',
    maxHeight: '50%',
    padding: 16,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectorItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectorItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
