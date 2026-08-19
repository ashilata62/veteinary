import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

// Auth Screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BrochureScreen from '../screens/BrochureScreen';

// Core Screens
import DashboardScreen from '../screens/DashboardScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import PetsScreen from '../screens/PetsScreen';
import BillingScreen from '../screens/BillingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoleMenuScreen from '../screens/RoleMenuScreen';

// Module Screens
import HomeVisitsScreen from '../screens/HomeVisitsScreen';
import HospitalizationScreen from '../screens/HospitalizationScreen';
import PetOwnersScreen from '../screens/PetOwnersScreen';
import MedicalRecordsScreen from '../screens/MedicalRecordsScreen';
import TreatmentNotesScreen from '../screens/TreatmentNotesScreen';
import PrescriptionsScreen from '../screens/PrescriptionsScreen';
import AssistanceTasksScreen from '../screens/AssistanceTasksScreen';
import DoctorRevenueScreen from '../screens/DoctorRevenueScreen';
import InventoryScreen from '../screens/InventoryScreen';
import RemindersScreen from '../screens/RemindersScreen';
import StaffManagementScreen from '../screens/StaffManagementScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ReportsScreen from '../screens/ReportsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SupportScreen from '../screens/SupportScreen';
import SettingsScreen from '../screens/SettingsScreen';

import SuperAdminNavigator from './SuperAdminNavigator';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Brochure" component={BrochureScreen} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 64 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          elevation: 10,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          tabBarLabel: 'Visits',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pets"
        component={PetsScreen}
        options={{
          tabBarLabel: 'Patients',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="dog" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Billing"
        component={BillingScreen}
        options={{
          tabBarLabel: 'Billing',
          tabBarIcon: ({ color }) => (
            <Ionicons name="card" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={RoleMenuScreen}
        options={{
          tabBarLabel: 'Modules',
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={MainTabNavigator} />
      <MainStack.Screen name="HomeVisits" component={HomeVisitsScreen} />
      <MainStack.Screen name="Hospitalization" component={HospitalizationScreen} />
      <MainStack.Screen name="PetOwners" component={PetOwnersScreen} />
      <MainStack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
      <MainStack.Screen name="TreatmentNotes" component={TreatmentNotesScreen} />
      <MainStack.Screen name="Prescriptions" component={PrescriptionsScreen} />
      <MainStack.Screen name="AssistanceTasks" component={AssistanceTasksScreen} />
      <MainStack.Screen name="DoctorRevenue" component={DoctorRevenueScreen} />
      <MainStack.Screen name="Inventory" component={InventoryScreen} />
      <MainStack.Screen name="Reminders" component={RemindersScreen} />
      <MainStack.Screen name="StaffManagement" component={StaffManagementScreen} />
      <MainStack.Screen name="Attendance" component={AttendanceScreen} />
      <MainStack.Screen name="Reports" component={ReportsScreen} />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="Support" component={SupportScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
    </MainStack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isSuperAdmin =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'SuperAdmin' ||
    (user?.email && user.email.toLowerCase().includes('superadmin'));

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : isSuperAdmin ? (
        <Stack.Screen name="SuperAdminMain" component={SuperAdminNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainStackNavigator} />
      )}
    </Stack.Navigator>
  );
}
