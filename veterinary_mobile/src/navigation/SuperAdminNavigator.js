import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

import SuperAdminDashboardScreen from '../screens/SuperAdminDashboardScreen';
import SuperAdminClinicsScreen from '../screens/SuperAdminClinicsScreen';
import SuperAdminPaymentsScreen from '../screens/SuperAdminPaymentsScreen';
import SuperAdminSettingsScreen from '../screens/SuperAdminSettingsScreen';
import SuperAdminTicketsScreen from '../screens/SuperAdminTicketsScreen';
import SuperAdminPlansScreen from '../screens/SuperAdminPlansScreen';
import SuperAdminReportsScreen from '../screens/SuperAdminReportsScreen';
import SuperAdminSubscriptionsScreen from '../screens/SuperAdminSubscriptionsScreen';
import SuperAdminNotificationsScreen from '../screens/SuperAdminNotificationsScreen';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SuperAdminTabs() {
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
          tabBarIcon: ({ color }) => <Ionicons name="grid" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="SuperClinics"
        component={SuperAdminClinicsScreen}
        options={{
          tabBarLabel: 'Admins',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="SuperPayments"
        component={SuperAdminPaymentsScreen}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color }) => <Ionicons name="card" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="SuperTickets"
        component={SuperAdminTicketsScreen}
        options={{
          tabBarLabel: 'Tickets',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="SuperSettings"
        component={SuperAdminSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function SuperAdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SuperAdminTabs" component={SuperAdminTabs} />
      {/* Extra screens accessible from Super Admin */}
      <Stack.Screen name="SuperPlans" component={SuperAdminPlansScreen} />
      <Stack.Screen name="SuperReports" component={SuperAdminReportsScreen} />
      <Stack.Screen name="SuperSubscriptions" component={SuperAdminSubscriptionsScreen} />
      <Stack.Screen name="SuperNotifications" component={SuperAdminNotificationsScreen} />
    </Stack.Navigator>
  );
}
