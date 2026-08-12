import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

import SuperAdminDashboardScreen from '../screens/SuperAdminDashboardScreen';
import SuperAdminClinicsScreen from '../screens/SuperAdminClinicsScreen';
import SuperAdminPaymentsScreen from '../screens/SuperAdminPaymentsScreen';
import SuperAdminSettingsScreen from '../screens/SuperAdminSettingsScreen';
import SuperAdminTicketsScreen from '../screens/SuperAdminTicketsScreen';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function SuperAdminNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary, // Teal #0f766e matching Admin theme
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 64 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
          backgroundColor: '#ffffff', // Clean white background matching Admin tab bar
          borderTopColor: colors.border,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="SuperDashboard"
        component={SuperAdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SuperClinics"
        component={SuperAdminClinicsScreen}
        options={{
          tabBarLabel: 'Admins',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SuperPayments"
        component={SuperAdminPaymentsScreen}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color }) => (
            <Ionicons name="card" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SuperSettings"
        component={SuperAdminSettingsScreen}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SuperTickets"
        component={SuperAdminTicketsScreen}
        options={{
          tabBarLabel: 'Support Tickets',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ticket" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
