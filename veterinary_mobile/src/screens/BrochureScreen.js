import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const darkTheme = {
  bg: '#0b1329',
  cardBg: '#111c38',
  cardBorder: '#1e2d54',
  primary: '#14b8a6',
  primaryDark: '#0d9488',
  primaryLight: '#2dd4bf',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  badgeBg: '#1e293b',
  gold: '#f59e0b',
  danger: '#ef4444',
  success: '#10b981',
};

export default function BrochureScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.brandBox}>
          <Image source={require('../../assets/icon.png')} style={{ width: 28, height: 28, borderRadius: 6, marginRight: 8, resizeMode: 'contain' }} />
          <View>
            <Text style={styles.headerTitle}>
              PetCare <Text style={{ color: darkTheme.primary }}>Pro</Text>
            </Text>
            <Text style={styles.headerSub}>Petcare Management SaaS</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btnTrialHeader}
          onPress={() => navigation.navigate('Register', { plan: 'free-trial' })}
        >
          <Text style={styles.btnTrialText}>Try Free</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* ================= 1. HERO SECTION ================= */}
        <View style={styles.heroCard}>
          <View style={styles.badgeBox}>
            <Ionicons name="sparkles" size={14} color={darkTheme.primary} />
            <Text style={styles.badgeText}>ALL-IN-ONE PETCARE CLINIC MANAGEMENT</Text>
          </View>

          <Text style={styles.heroTitle}>One Platform to{'\n'}Run Your Entire Clinic</Text>
          <Text style={styles.heroSub}>
            Manage appointments, patients, billing, inventory and staff operations – all in one intelligent platform.
          </Text>

          {/* 8 Checkmarks Grid */}
          <View style={styles.checkGrid}>
            {[
              'Multi-Tenant SaaS Platform',
              'Real-time Analytics',
              'Role-Based Access Control',
              'Secure & Scalable',
              'Digital Prescriptions',
              'Automated Workflows',
              'Smart Reminders & Alerts',
              'Better Patient Care',
            ].map((item, idx) => (
              <View key={idx} style={styles.checkRow}>
                <Ionicons name="checkmark-circle" size={16} color={darkTheme.primary} />
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= 2. 8 CORE ICONS GRID (4x2) ================= */}
        <Text style={styles.secTitle}>CORE CLINIC MODULES</Text>
        <View style={styles.coreGrid}>
          {[
            { label: 'APPOINTMENTS', icon: 'calendar-outline' },
            { label: 'PATIENTS', icon: 'heart-outline' },
            { label: 'BILLING & POS', icon: 'card-outline' },
            { label: 'INVENTORY', icon: 'cube-outline' },
            { label: 'STAFF & HR', icon: 'people-outline' },
            { label: 'REPORTS', icon: 'bar-chart-outline' },
            { label: 'PHARMACY', icon: 'medkit-outline' },
            { label: 'MORE...', icon: 'grid-outline' },
          ].map((item, idx) => (
            <View key={idx} style={styles.coreIconCard}>
              <Ionicons name={item.icon} size={22} color={darkTheme.primary} />
              <Text style={styles.coreIconLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ================= 3. WHY CLINICS CHOOSE PETCARE PRO ================= */}
        <Text style={styles.secTitle}>WHY CLINICS CHOOSE PETCARE PRO</Text>
        <View style={styles.compareGrid}>
          {/* Without PetCare Pro */}
          <View style={[styles.compareBox, { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)' }]}>
            <View style={[styles.compareHeader, { backgroundColor: '#ef4444' }]}>
              <Ionicons name="close-circle" size={16} color="#ffffff" />
              <Text style={styles.compareHeaderText}>Without PetCare Pro</Text>
            </View>
            {[
              'Manual appointments & scheduling',
              'Missed follow-ups & reminders',
              'Paper prescriptions & records',
              'Inventory mismanagement',
              'Payment delays & tracking issues',
              'No real-time insights',
              'Scattered data & paperwork',
              'Difficult to scale your clinic',
            ].map((t, i) => (
              <View key={i} style={styles.compareRow}>
                <Ionicons name="close-circle" size={14} color="#ef4444" />
                <Text style={{ color: '#fca5a5', fontSize: 12, flex: 1 }}>{t}</Text>
              </View>
            ))}
          </View>

          {/* With PetCare Pro */}
          <View style={[styles.compareBox, { borderColor: darkTheme.primary, backgroundColor: 'rgba(20, 184, 166, 0.08)' }]}>
            <View style={[styles.compareHeader, { backgroundColor: darkTheme.primary }]}>
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
              <Text style={styles.compareHeaderText}>With PetCare Pro</Text>
            </View>
            {[
              'Centralized clinic management',
              'Smart appointments & reminders',
              'Digital prescriptions & records',
              'Real-time inventory tracking',
              'Fast billing & payment tracking',
              'Live dashboard & analytics',
              'Secure, scalable & cloud-based',
              'Focus more on pet care',
            ].map((t, i) => (
              <View key={i} style={styles.compareRow}>
                <Ionicons name="checkmark-circle" size={14} color={darkTheme.primary} />
                <Text style={{ color: '#99f6e4', fontSize: 12, flex: 1 }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= 4. KEY BUSINESS BENEFITS ================= */}
        <Text style={[styles.secTitle, { marginTop: 24 }]}>KEY BUSINESS BENEFITS</Text>
        <View style={{ gap: 10, marginBottom: 20 }}>
          {[
            { title: 'SAVE TIME', desc: 'Automate daily tasks and reduce manual work.', icon: 'time-outline', color: '#14b8a6' },
            { title: 'INCREASE REVENUE', desc: 'Better patient experience leads to higher revenue.', icon: 'trending-up-outline', color: '#10b981' },
            { title: 'IMPROVE EFFICIENCY', desc: 'Streamline workflows and manage resources better.', icon: 'settings-outline', color: '#3b82f6' },
            { title: 'DATA-DRIVEN DECISIONS', desc: 'Real-time insights to grow your practice.', icon: 'pie-chart-outline', color: '#f59e0b' },
          ].map((b, i) => (
            <View key={i} style={styles.benefitCard}>
              <View style={[styles.benefitIconBox, { backgroundColor: b.color + '20' }]}>
                <Ionicons name={b.icon} size={20} color={b.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>{b.title}</Text>
                <Text style={{ color: darkTheme.textSecondary, fontSize: 12, marginTop: 2 }}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ================= 5. COMPLETE CLINIC MANAGEMENT ================= */}
        <Text style={styles.secTitle}>COMPLETE CLINIC MANAGEMENT</Text>
        <View style={{ gap: 12, marginBottom: 24 }}>
          <View style={styles.mgmtCard}>
            <View style={styles.mgmtHeader}>
              <Ionicons name="heart-outline" size={20} color={darkTheme.primary} />
              <Text style={styles.mgmtTitle}>PATIENT CARE</Text>
            </View>
            <Text style={styles.mgmtBullet}>• Pet Profiles & Medical History</Text>
            <Text style={styles.mgmtBullet}>• Treatments, Vitals & Vaccinations</Text>
            <Text style={styles.mgmtBullet}>• Lab Results & Digital Prescriptions</Text>
          </View>

          <View style={styles.mgmtCard}>
            <View style={styles.mgmtHeader}>
              <Ionicons name="calendar-outline" size={20} color={darkTheme.primary} />
              <Text style={styles.mgmtTitle}>APPOINTMENTS</Text>
            </View>
            <Text style={styles.mgmtBullet}>• Smart Calendar & Doctor Availability</Text>
            <Text style={styles.mgmtBullet}>• Queue Management & Home Visits</Text>
            <Text style={styles.mgmtBullet}>• Vaccination Reminders & Alerts</Text>
          </View>

          <View style={styles.mgmtCard}>
            <View style={styles.mgmtHeader}>
              <Ionicons name="cube-outline" size={20} color={darkTheme.primary} />
              <Text style={styles.mgmtTitle}>PHARMACY & INVENTORY</Text>
            </View>
            <Text style={styles.mgmtBullet}>• Medicine & Stock Tracking</Text>
            <Text style={styles.mgmtBullet}>• Low-Stock Alerts & Supplier Management</Text>
            <Text style={styles.mgmtBullet}>• Purchase Orders & Expiry Tracking</Text>
          </View>

          <View style={styles.mgmtCard}>
            <View style={styles.mgmtHeader}>
              <Ionicons name="card-outline" size={20} color={darkTheme.primary} />
              <Text style={styles.mgmtTitle}>BILLING & FINANCE</Text>
            </View>
            <Text style={styles.mgmtBullet}>• Fast POS Invoicing & Multi-Payments</Text>
            <Text style={styles.mgmtBullet}>• Expense Management & Cash Summary</Text>
            <Text style={styles.mgmtBullet}>• Profit & Revenue Reports</Text>
          </View>
        </View>

        {/* ================= 6. BUILT FOR EVERY ROLE ================= */}
        <Text style={styles.secTitle}>BUILT FOR EVERY ROLE</Text>
        <View style={styles.rolesRow}>
          <View style={styles.roleCard}>
            <Text style={styles.roleEmoji}>👑</Text>
            <Text style={styles.roleTitle}>Clinic Admin</Text>
            <Text style={styles.roleDesc}>Full access to clinic & business management</Text>
          </View>
          <View style={styles.roleCard}>
            <Text style={styles.roleEmoji}>🩺</Text>
            <Text style={styles.roleTitle}>Pet Doctor</Text>
            <Text style={styles.roleDesc}>Patient history, prescriptions & schedules</Text>
          </View>
          <View style={styles.roleCard}>
            <Text style={styles.roleEmoji}>📋</Text>
            <Text style={styles.roleTitle}>Receptionist</Text>
            <Text style={styles.roleDesc}>Appointments, billing & queue management</Text>
          </View>
          <View style={styles.roleCard}>
            <Text style={styles.roleEmoji}>💊</Text>
            <Text style={styles.roleTitle}>Staff / Nurse</Text>
            <Text style={styles.roleDesc}>Inventory, tasks & patient vitals tracking</Text>
          </View>
        </View>

        {/* ================= 7. WHY PETCARE PRO? ================= */}
        <Text style={[styles.secTitle, { marginTop: 24 }]}>WHY PETCARE PRO?</Text>
        <View style={styles.whyGrid}>
          {[
            { title: 'Multi-Tenant SaaS', icon: 'cloud-outline' },
            { title: 'Secure & Reliable', icon: 'shield-checkmark-outline' },
            { title: 'Scalable & Flexible', icon: 'trending-up-outline' },
            { title: 'Automated Workflows', icon: 'cog-outline' },
            { title: 'Real-time Analytics', icon: 'pie-chart-outline' },
            { title: 'Cloud Based', icon: 'globe-outline' },
          ].map((w, idx) => (
            <View key={idx} style={styles.whyBoxCard}>
              <Ionicons name={w.icon} size={24} color={darkTheme.primary} />
              <Text style={styles.whyBoxTitle}>{w.title}</Text>
            </View>
          ))}
        </View>

        {/* ================= 8. HOW IT WORKS (5 STEPS) ================= */}
        <Text style={[styles.secTitle, { marginTop: 24 }]}>HOW IT WORKS (5 STEPS)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineScroll}>
          <View style={styles.stepBox}>
            <Text style={styles.stepBadge}>1</Text>
            <Text style={styles.stepTitle}>REGISTER</Text>
            <Text style={styles.stepDesc}>Create clinic account</Text>
          </View>
          <Text style={styles.stepArrow}>➔</Text>
          <View style={styles.stepBox}>
            <Text style={styles.stepBadge}>2</Text>
            <Text style={styles.stepTitle}>SETUP</Text>
            <Text style={styles.stepDesc}>Configure staff & settings</Text>
          </View>
          <Text style={styles.stepArrow}>➔</Text>
          <View style={styles.stepBox}>
            <Text style={styles.stepBadge}>3</Text>
            <Text style={styles.stepTitle}>MANAGE</Text>
            <Text style={styles.stepDesc}>Appointments & patients</Text>
          </View>
          <Text style={styles.stepArrow}>➔</Text>
          <View style={styles.stepBox}>
            <Text style={styles.stepBadge}>4</Text>
            <Text style={styles.stepTitle}>AUTOMATE</Text>
            <Text style={styles.stepDesc}>Workflows & reminders</Text>
          </View>
          <Text style={styles.stepArrow}>➔</Text>
          <View style={styles.stepBox}>
            <Text style={styles.stepBadge}>5</Text>
            <Text style={styles.stepTitle}>GROW</Text>
            <Text style={styles.stepDesc}>Analytics & expansion</Text>
          </View>
        </ScrollView>

        {/* ================= 9. REAL IMPACT. REAL RESULTS ================= */}
        <Text style={[styles.secTitle, { marginTop: 24 }]}>REAL IMPACT. REAL RESULTS.</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiVal}>70%</Text>
            <Text style={styles.kpiLbl}>Less Manual Work</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiVal}>50%</Text>
            <Text style={styles.kpiLbl}>Increase in Efficiency</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiVal}>60%</Text>
            <Text style={styles.kpiLbl}>Faster Invoicing</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiVal}>40%</Text>
            <Text style={styles.kpiLbl}>Higher Revenue</Text>
          </View>
          <View style={[styles.kpiBox, { backgroundColor: darkTheme.primary, width: '100%' }]}>
            <Text style={[styles.kpiVal, { color: '#ffffff' }]}>100%</Text>
            <Text style={[styles.kpiLbl, { color: '#ffffff' }]}>Data Security & Cloud Protection</Text>
          </View>
        </View>

        {/* ================= 10. CTA BANNER & FOOTER ================= */}
        <TouchableOpacity
          style={styles.ctaBtnLg}
          onPress={() => navigation.navigate('Register', { plan: 'free-trial' })}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnLgText}>Start 7-Day Free Trial</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.footerBox}>
          <Text style={styles.footerTagline}>PetCare Pro • Smart Clinic • Happy Pets</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:+919752100980')}>
            <Text style={styles.footerLink}>Call: +91 97521 00980</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:info@kiaantechnology.com')}>
            <Text style={styles.footerLink}>Email: info@kiaantechnology.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: darkTheme.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.cardBorder,
  },
  backBtn: {
    marginRight: 12,
  },
  brandBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 10,
    color: darkTheme.textSecondary,
  },
  btnTrialHeader: {
    backgroundColor: darkTheme.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  btnTrialText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    marginBottom: 20,
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: darkTheme.badgeBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: darkTheme.primary,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    marginBottom: 14,
  },
  checkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '48%',
  },
  checkText: {
    fontSize: 11,
    color: '#ffffff',
    flex: 1,
  },
  secTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: darkTheme.primary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  coreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  coreIconCard: {
    width: (width - 56) / 4,
    backgroundColor: darkTheme.cardBg,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  coreIconLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
    textAlign: 'center',
  },
  compareGrid: {
    gap: 12,
    marginBottom: 24,
  },
  compareBox: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  compareHeaderText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: darkTheme.cardBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  benefitIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justify: 'center',
    alignItems: 'center',
  },
  mgmtCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  mgmtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  mgmtTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  mgmtBullet: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginBottom: 4,
  },
  rolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  roleCard: {
    width: (width - 42) / 2,
    backgroundColor: darkTheme.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  roleEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  roleDesc: {
    fontSize: 11,
    color: darkTheme.textSecondary,
    marginTop: 2,
  },
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  whyBoxCard: {
    width: (width - 42) / 2,
    backgroundColor: darkTheme.cardBg,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  whyBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 6,
  },
  timelineScroll: {
    alignItems: 'center',
    gap: 8,
    paddingRight: 20,
    marginBottom: 24,
  },
  stepBox: {
    backgroundColor: darkTheme.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    alignItems: 'center',
    width: 120,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: darkTheme.primary,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    marginBottom: 6,
  },
  stepTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepDesc: {
    color: darkTheme.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  stepArrow: {
    color: darkTheme.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  kpiBox: {
    width: (width - 42) / 2,
    backgroundColor: darkTheme.cardBg,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  kpiLbl: {
    fontSize: 11,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  ctaBtnLg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: darkTheme.primary,
    height: 52,
    borderRadius: 14,
    marginBottom: 24,
  },
  ctaBtnLgText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerBox: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: darkTheme.cardBorder,
  },
  footerTagline: {
    fontSize: 12,
    color: darkTheme.textMuted,
    fontWeight: '600',
  },
  footerLink: {
    fontSize: 12,
    color: darkTheme.primary,
    fontWeight: 'bold',
  },
});
