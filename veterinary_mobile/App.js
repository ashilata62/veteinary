import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/AppNavigator';

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'vetcarepro://'],
  config: {
    screens: {
      Auth: {
        path: 'auth',
        screens: {
          Login: 'login',
          Landing: 'landing',
          Register: 'register',
        },
      },
      Main: {
        path: 'app',
        screens: {
          MainTabs: {
            path: 'tabs',
            screens: {
              Dashboard: 'dashboard',
              Appointments: 'appointments',
              Pets: 'pets',
              Billing: 'billing',
              Menu: 'menu',
            },
          },
          HomeVisits: 'home-visits',
          Hospitalization: 'hospitalization',
          PetOwners: 'pet-owners',
          MedicalRecords: 'medical-records',
          TreatmentNotes: 'treatment-notes',
          Prescriptions: 'prescriptions',
          AssistanceTasks: 'assistance-tasks',
          DoctorRevenue: 'revenue',
          Inventory: 'inventory',
          Reminders: 'reminders',
          StaffManagement: 'staff',
          Attendance: 'attendance',
          Reports: 'reports',
          Notifications: 'notifications',
          Support: 'support',
          Profile: 'profile',
        },
      },
      SuperAdminMain: {
        path: 'sa',
        screens: {
          SuperAdminDashboard: 'dashboard',
          SuperAdminClinics: 'clinics',
          SuperAdminPayments: 'payments',
          SuperAdminTickets: 'tickets',
          SuperAdminSettings: 'settings',
        },
      },
    },
  },
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
