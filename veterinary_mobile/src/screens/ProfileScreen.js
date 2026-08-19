import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings').catch(() => ({ data: {} }));
        setSettings(res.data?.data || res.data || null);
      } catch (err) {
        console.log('Using default profile settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={styles.userName}>{user?.name || 'Dr. Doctor'}</Text>
        <Text style={styles.userRole}>
          {(user?.role || 'Petcare Specialist').toUpperCase()}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Info</Text>

          <View style={styles.row}>
            <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.rowText}>{user?.email || 'doctor@vetcare.com'}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.rowText}>PetCare Main Clinic, Suite 402</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.rowText}>+91 98765 00000</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Practice Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="stethoscope" size={18} color={colors.primary} />
              <Text style={styles.settingText}>Clinic Working Hours</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.row}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.secondary} />
              <Text style={styles.settingText}>Security & Credentials</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sign Out of Mobile App</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>PetCare Mobile App • Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primaryDark,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userRole: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryLight,
    marginTop: 4,
  },
  scrollBody: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 6,
  },
  rowText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.dangerLight,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 15,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 24,
  },
});
