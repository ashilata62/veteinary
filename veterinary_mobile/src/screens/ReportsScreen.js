import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { colors } from '../theme/colors';

export default function ReportsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [reportsData, setReportsData] = useState({
    monthlyTotal: '₹3,45,000',
    consultationsCount: 142,
    homeVisitsCount: 38,
    medicinesSoldTotal: '₹84,500',
    topPaymentMode: 'UPI (68%)',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Clinic Reports & Analytics</Text>
          <Text style={styles.headerSub}>Revenue, visits & inventory performance</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* REVENUE OVERVIEW CARD */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Monthly Total Revenue</Text>
          <Text style={styles.summaryAmount}>{reportsData.monthlyTotal}</Text>
          <Text style={styles.summarySub}>+14% growth compared to last month</Text>
        </View>

        {/* METRICS ROW */}
        <View style={styles.gridRow}>
          <View style={styles.cardBox}>
            <MaterialCommunityIcons name="stethoscope" size={24} color={colors.primary} />
            <Text style={styles.boxVal}>{reportsData.consultationsCount}</Text>
            <Text style={styles.boxLbl}>OPD Consults</Text>
          </View>
          <View style={styles.cardBox}>
            <Ionicons name="home-outline" size={24} color={colors.secondary} />
            <Text style={styles.boxVal}>{reportsData.homeVisitsCount}</Text>
            <Text style={styles.boxLbl}>Home Visits</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.cardBox}>
            <MaterialCommunityIcons name="pill" size={24} color={colors.warning} />
            <Text style={styles.boxVal}>{reportsData.medicinesSoldTotal}</Text>
            <Text style={styles.boxLbl}>Pharmacy Sales</Text>
          </View>
          <View style={styles.cardBox}>
            <Ionicons name="card-outline" size={24} color={colors.success} />
            <Text style={styles.boxVal}>{reportsData.topPaymentMode}</Text>
            <Text style={styles.boxLbl}>Top Payment</Text>
          </View>
        </View>

        {/* BREAKDOWN SECTIONS */}
        <View style={styles.sectionBox}>
          <Text style={styles.secTitle}>Revenue Breakdown</Text>

          <View style={styles.breakRow}>
            <Text style={styles.breakKey}>Consultation Fees</Text>
            <Text style={styles.breakVal}>₹1,85,000</Text>
          </View>
          <View style={styles.breakRow}>
            <Text style={styles.breakKey}>Pharmacy & Vaccines</Text>
            <Text style={styles.breakVal}>₹84,500</Text>
          </View>
          <View style={styles.breakRow}>
            <Text style={styles.breakKey}>Home Visit Charges</Text>
            <Text style={styles.breakVal}>₹45,500</Text>
          </View>
          <View style={styles.breakRow}>
            <Text style={styles.breakKey}>Surgeries & Procedures</Text>
            <Text style={styles.breakVal}>₹30,000</Text>
          </View>
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
  summaryCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  summaryTitle: { fontSize: 12, color: colors.primaryLight, fontWeight: 'bold', textTransform: 'uppercase' },
  summaryAmount: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginVertical: 6 },
  summarySub: { fontSize: 12, color: '#e0f2fe' },
  gridRow: { flexDirection: 'row', gap: 12 },
  cardBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  boxVal: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginTop: 6 },
  boxLbl: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  sectionBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  secTitle: { fontSize: 15, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  breakKey: { fontSize: 13, color: colors.textSecondary },
  breakVal: { fontSize: 13, fontWeight: 'bold', color: colors.textPrimary },
});
