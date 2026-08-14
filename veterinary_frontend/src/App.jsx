import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardHome from './components/DashboardHome';
import PetOwnerManagement from './components/PetOwnerManagement';
import PetManagement from './components/PetManagement';
import PatientRecords from './components/PatientRecords';
import DoctorDashboard from './components/DoctorDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import AssistantDashboard from './components/AssistantDashboard';
import Appointments from './components/Appointments';
import HomeVisits from './components/HomeVisits';
import AssistanceTasks from './components/AssistanceTasks';
import Billing from './components/Billing';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Hospitalization from './components/Hospitalization';
import SettingsPage from './components/Settings';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import BrochurePage from './components/BrochurePage';
import StaffManagement from './components/StaffManagement';
import Attendance from './components/Attendance';
import Notifications from './components/Notifications';
import TreatmentNotes from './components/TreatmentNotes';
import DoctorRevenue from './components/DoctorRevenue';
import ReminderQueue from './components/ReminderQueue';
import SuperAdminLogin from './components/SuperAdmin/SuperAdminLogin';
import SuperAdminLayout from './components/SuperAdmin/SuperAdminLayout';
import PaymentPage from './components/Checkout/PaymentPage';
import TrialExpired from './components/TrialExpired';
import SubscriptionExpired from './components/SubscriptionExpired';
import AccountSuspended from './components/AccountSuspended';
import Support from './components/Support';
import PlansPage from './components/PlansPage';
import { tabFromPath, pathForTab, isLegacyPath } from './utils/routes';
import { Toaster } from 'react-hot-toast';

import api from './utils/api';

const checkTrialExpired = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role || user.isPaidPlan || user.subscription_status === 'active' || user.plan === 'paid') return false;
    const trialEnd = user.trial_end_date || user.trialEndDate || user.trial_expires_at;
    if (!trialEnd) return false;
    return new Date(trialEnd) < new Date();
  } catch (e) {
    return false;
  }
};
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = tabFromPath(location.pathname);

  const setCurrentTab = (tab) => {
    navigate(pathForTab(tab, currentRole));
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      // Decode JWT payload to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());
  const [currentRole, setCurrentRole] = useState(() => localStorage.getItem('role') || '');
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => !!localStorage.getItem('sa_token'));
  const [isTrialExpired, setIsTrialExpired] = useState(() => checkTrialExpired());
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [accountSuspended, setAccountSuspended] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({ clinicName: '', plan: '', expiryDate: '' });
  // Sidebar: open by default on desktop only
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);

  const [attendanceStatus, setAttendanceStatus] = useState({
    isCheckedIn: false,
    checkInTime: null,
    checkOutTime: null,
    workingHoursToday: '--',
    statusToday: 'Absent'
  });

  const fetchAttendanceStatus = async () => {
    try {
      if (!isAuthenticated) return;
      const res = await api.get('/api/v1/attendance/me');
      const json = res.data;
      if (json.status === 'success' && json.data.length > 0) {
        const latest = json.data[0];
        const d = new Date();
        const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (latest.date === today) {
          const checkedIn = latest.checkIn !== '--' && latest.checkOut === '--';
          setAttendanceStatus({
            isCheckedIn: checkedIn,
            checkInTime: latest.checkIn !== '--' ? latest.checkIn : null,
            checkOutTime: latest.checkOut !== '--' ? latest.checkOut : null,
            workingHoursToday: latest.hours || '0.0',
            statusToday: latest.status || 'Present'
          });
          return;
        }
      }
      setAttendanceStatus({
        isCheckedIn: false,
        checkInTime: null,
        checkOutTime: null,
        workingHoursToday: '--',
        statusToday: 'Absent'
      });
    } catch (err) {
      console.error('Error fetching checkin status', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAttendanceStatus();
      
      // Fetch notifications
      api.get('/api/v1/notifications')
        .then(res => {
          if (res.data.status === 'success') {
            setNotifications(res.data.data || []);
          }
        })
        .catch(err => console.error('Error fetching notifications:', err));
    }
  }, [isAuthenticated]);

  // Auto close sidebar when resizing below 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const LOGIN_PATH = '/login';
  const LANDING_PATH = '/landing';

  // Authenticated: redirect login, landing, root, and legacy flat URLs → /{role}/{tab}
  useEffect(() => {
    if (!isAuthenticated) return;
    const home = pathForTab('dashboard', currentRole);
    if (location.pathname === LOGIN_PATH || location.pathname === '/' || location.pathname === LANDING_PATH) {
      navigate(home, { replace: true });
      return;
    }
    if (isLegacyPath(location.pathname)) {
      navigate(pathForTab(tabFromPath(location.pathname), currentRole), { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate, currentRole]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    sessionStorage.removeItem('trialPopupShown');
    setAttendanceStatus({
      isCheckedIn: false,
      checkInTime: null,
      checkOutTime: null,
      workingHoursToday: '--',
      statusToday: 'Absent'
    });
    setIsAuthenticated(false);
    setCurrentRole('');
    setIsTrialExpired(false);
    setSubscriptionExpired(false);
    setAccountSuspended(false);
    setSubscriptionData({ clinicName: '', plan: '', expiryDate: '' });
    navigate(LOGIN_PATH, { replace: true });
  };

  const handleViewPet = (petId) => {
    setSelectedPetId(petId);
    setCurrentTab('medical');
  };

  if (location.pathname.startsWith('/checkout/')) {
    return <PaymentPage />;
  }

  if (location.pathname.startsWith('/super-admin')) {
    if (!isSuperAdmin) {
      return <Navigate to="/login" replace />;
    }
    if (location.pathname === '/super-admin/login') {
      return <Navigate to="/super-admin/dashboard" replace />;
    }
    return <SuperAdminLayout setIsSuperAdmin={setIsSuperAdmin} />;
  }

  if (location.pathname === '/brochure') {
    return <BrochurePage />;
  }

  if (!isAuthenticated) {
    if (location.pathname === LOGIN_PATH) {
      return (
        <Login
          setIsAuthenticated={setIsAuthenticated}
          setCurrentRole={setCurrentRole}
          setIsSuperAdmin={setIsSuperAdmin}
          onLoginSuccess={() => setIsTrialExpired(checkTrialExpired())}
        />
      );
    }
    if (location.pathname === '/register') {
      return <Register />;
    }
    return <LandingPage />;
  }

  // Show trial expired page if trial period is over
  if (isTrialExpired) {
    return <TrialExpired onLogout={handleLogout} />;
  }

  if (accountSuspended) {
    return <AccountSuspended onLogout={handleLogout} clinicName={subscriptionData.clinicName} />;
  }

  if (subscriptionExpired) {
    return <SubscriptionExpired 
      onLogout={handleLogout} 
      clinicName={subscriptionData.clinicName}
      plan={subscriptionData.plan}
      expiryDate={subscriptionData.expiryDate}
    />;
  }

  if (currentTab === 'plans' || location.pathname.endsWith('/plans')) {
    return <PlansPage />;
  }

  return (
    <div className="app-container">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#fff',
          color: '#334155',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '8px',
          fontWeight: 500
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onLogout={handleLogout}
        notifications={notifications}
      />

      <div
        className={`main-wrapper ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
        style={{
          backgroundColor: 'var(--background)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentRole={currentRole}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          setNotifications={setNotifications}
          setCurrentTab={setCurrentTab}
          handleLogout={handleLogout}
          attendanceStatus={attendanceStatus}
          fetchAttendanceStatus={fetchAttendanceStatus}
        />

        <main className="content-container">
          {currentTab === 'dashboard' && currentRole === 'Doctor' ? (
            <DoctorDashboard setCurrentTab={setCurrentTab} setSelectedPetId={setSelectedPetId} handleViewPet={handleViewPet} attendanceStatus={attendanceStatus} />
          ) : currentTab === 'dashboard' && currentRole === 'Receptionist' ? (
            <ReceptionistDashboard setCurrentTab={setCurrentTab} attendanceStatus={attendanceStatus} />
          ) : currentTab === 'dashboard' && currentRole === 'Vet Assistant' ? (
            <AssistantDashboard setCurrentTab={setCurrentTab} handleViewPet={handleViewPet} attendanceStatus={attendanceStatus} />
          ) : currentTab === 'dashboard' ? (
            <DashboardHome setCurrentTab={setCurrentTab} setSelectedPetId={setSelectedPetId} handleViewPet={handleViewPet} currentRole={currentRole} attendanceStatus={attendanceStatus} />
          ) : null}

          {currentTab === 'appointments' && <Appointments currentRole={currentRole} />}
          {currentTab === 'home-visits' && <HomeVisits currentRole={currentRole} />}
          {currentTab === 'owners' && <PetOwnerManagement searchQuery={searchQuery} />}
          {currentTab === 'pets' && <PetManagement searchQuery={searchQuery} handleViewPet={handleViewPet} />}
          {currentTab === 'treatment' && <TreatmentNotes />}


          {/* Reuse PatientRecords for medical, prescriptions, and reports-uploads tabs */}
          {['medical', 'prescriptions', 'reports-uploads'].includes(currentTab) && (
            <PatientRecords
              currentRole={currentRole}
              selectedPetId={selectedPetId}
              setSelectedPetId={setSelectedPetId}
              externalTab={currentTab === 'prescriptions' ? 'Prescriptions' : currentTab === 'reports-uploads' ? 'Reports' : 'Overview'}
            />
          )}

          {currentTab === 'my-revenue' && <DoctorRevenue />}
          {currentTab === 'assistance-tasks' && <AssistanceTasks />}
          {currentTab === 'billing' && <Billing currentRole={currentRole} />}
          {currentTab === 'inventory' && <Inventory />}
          {currentTab === 'hospitalization' && <Hospitalization />}
          {currentTab === 'staff' && <StaffManagement />}
          {currentTab === 'attendance' && <Attendance currentRole={currentRole} />}
          {currentTab === 'reports' && <Reports />}
          {currentTab === 'settings' && <SettingsPage currentRole={currentRole} />}
          {currentTab === 'notifications' && <Notifications notifications={notifications} setNotifications={setNotifications} />}
          {currentTab === 'reminders' && <ReminderQueue />}
          {currentTab === 'support' && <Support />}
        </main>
      </div>
    </div>
  );
}
