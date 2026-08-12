import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';

const darkTheme = {
  bg: '#f8fafc',
  cardBg: '#ffffff',
  cardBorder: '#e2e8f0',
  primary: '#0f766e',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  success: '#22c55e',
  successBg: '#dcfce7',
  warning: '#f59e0b',
  warningBg: '#fef3c7',
  danger: '#ef4444',
  dangerBg: '#fee2e2',
};

export default function SuperAdminTicketsScreen() {
  const { logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/super-admin/tickets');
      if (res.data && Array.isArray(res.data.data)) {
        setTickets(res.data.data);
      }
    } catch (e) {
      console.log('Failed to fetch support tickets via api');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && t.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const res = await api.post(`/super-admin/tickets/${selectedTicket.id}/reply`, {
        text: replyText.trim(),
      });
      if (res.data && res.data.status === 'success') {
        const updated = res.data.data;
        setTickets(prev => prev.map((t) => (t.id === selectedTicket.id ? updated : t)));
        setSelectedTicket(updated);
        setReplyText('');
      }
    } catch (err) {
      console.log('Failed to send ticket reply');
    }
  };

  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedTicket(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.tktSubject}>{item.subject}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'Open'
              ? { backgroundColor: darkTheme.dangerBg }
              : item.status === 'Replied'
              ? { backgroundColor: 'rgba(168, 85, 247, 0.15)' }
              : { backgroundColor: darkTheme.successBg },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Open'
                ? { color: darkTheme.danger }
                : item.status === 'Replied'
                ? { color: '#c084fc' }
                : { color: darkTheme.success },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.clinicText}>{item.clinic} • {item.adminName}</Text>
      <Text style={styles.updatedText}>Updated: {item.updated}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.headerTitle}>Support Tickets</Text>
            <Text style={styles.headerSubtitle}>Manage clinic admin support requests</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={16} color="#ffffff" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={darkTheme.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ticket, clinic..."
          placeholderTextColor={darkTheme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['All', 'Open', 'Replied', 'Closed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterChip, statusFilter === tab && styles.filterChipActive]}
            onPress={() => setStatusFilter(tab)}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === tab && styles.filterChipTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        contentContainerStyle={styles.listContainer}
      />

      {/* Ticket Details & Chat Modal */}
      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTicket && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalSubject}>{selectedTicket.subject}</Text>
                  <Text style={styles.modalSub}>{selectedTicket.clinic} ({selectedTicket.adminName})</Text>
                </View>

                <FlatList
                  data={selectedTicket.messages}
                  keyExtractor={(_, index) => index.toString()}
                  style={styles.chatList}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        styles.chatBubble,
                        item.isUser ? styles.chatBubbleUser : styles.chatBubbleSelf,
                      ]}
                    >
                      <Text style={styles.chatSender}>{item.sender} • {item.time}</Text>
                      <Text style={{ color: '#ffffff', fontSize: 13 }}>{item.text}</Text>
                    </View>
                  )}
                />

                <View style={styles.replyBox}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Type your reply..."
                    placeholderTextColor={darkTheme.textMuted}
                    value={replyText}
                    onChangeText={setReplyText}
                  />
                  <TouchableOpacity style={styles.btnSend} onPress={handleSendReply}>
                    <Ionicons name="send" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.btnCloseModal}
                  onPress={() => setSelectedTicket(null)}
                >
                  <Text style={styles.btnCloseModalText}>Close Ticket View</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  topHeader: {
    backgroundColor: '#0f766e',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 18,
    marginBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#ccfbf1',
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.cardBg,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: darkTheme.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: darkTheme.cardBg,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  filterChipActive: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.textSecondary,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tktSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  clinicText: {
    fontSize: 13,
    color: darkTheme.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  updatedText: {
    fontSize: 11,
    color: darkTheme.textMuted,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.cardBorder,
    paddingBottom: 10,
    marginBottom: 10,
  },
  modalSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalSub: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginTop: 2,
  },
  chatList: {
    maxHeight: 250,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: '85%',
  },
  chatBubbleUser: {
    backgroundColor: '#1e2d54',
    alignSelf: 'flex-start',
  },
  chatBubbleSelf: {
    backgroundColor: darkTheme.primary,
    alignSelf: 'flex-end',
  },
  chatSender: {
    fontSize: 10,
    color: darkTheme.textSecondary,
    marginBottom: 2,
  },
  replyBox: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: '#ffffff',
    backgroundColor: '#0b1329',
  },
  btnSend: {
    backgroundColor: darkTheme.primary,
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCloseModal: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  btnCloseModalText: {
    color: darkTheme.textSecondary,
    fontWeight: '600',
  },
});
