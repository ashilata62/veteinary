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
import ResetPassword from './components/ResetPassword';
import SetPassword from './components/SetPassword';
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
import TrialBanner from './components/TrialBanner';
import { isTabAllowedForPlan, getRequiredPlanForTab, getTabDisplayName } from './utils/planPermissions';
import AuditLogs from './components/AuditLogs/AuditLogs';
import SessionTerminatedModal from './components/SessionTerminatedModal';
import { tabFromPath, pathForTab, isLegacyPath } from './utils/routes';
import { Toaster } from 'react-hot-toast';
import { Lock } from 'lucide-react';

import api from './utils/api';

const checkTrialExpired = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.isPaidPlan || user.subscription_status === 'active' || user.plan === 'paid') return false;
    if (user.subscription_status === 'expired') return true;
    const trialEnd = user.trial_end_date || user.trialEndDate || user.trial_expires_at;
    if (!trialEnd) return false;
    const end = new Date(trialEnd);
    end.setHours(23, 59, 59, 999);
    return end < new Date();
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

  useEffect(() => {
    const handleTrialExpired = () => setIsTrialExpired(true);
    window.addEventListener('trial_expired', handleTrialExpired);
    return () => window.removeEventListener('trial_expired', handleTrialExpired);
  }, []);

  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [accountSuspended, setAccountSuspended] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({ clinicName: '', plan: '', expiryDate: '' });
  // Sidebar: open by default on desktop only (> 1024px)
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 1024 : true);
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

  useEffect(() => {
    const handleSubStatus = (e) => {
      const { code, data } = e.detail || {};
      if (code === 'TRIAL_EXPIRED') {
        setIsTrialExpired(true);
      } else if (code === 'SUBSCRIPTION_EXPIRED' || code === 'SUBSCRIPTION_REQUIRED') {
        setSubscriptionExpired(true);
        if (data) {
          setSubscriptionData({
            clinicName: data.clinicName || 'Your Clinic',
            plan: data.plan || 'Free Trial',
            expiryDate: data.subscriptionEndDate || data.trialEndDate || ''
          });
        }
      } else if (code === 'ACCOUNT_SUSPENDED') {
        setAccountSuspended(true);
        if (data) {
          setSubscriptionData({
            clinicName: data.clinicName || 'Your Clinic',
            plan: '',
            expiryDate: ''
          });
        }
      }
    };
    window.addEventListener('auth:subscription_status', handleSubStatus);
    return () => window.removeEventListener('auth:subscription_status', handleSubStatus);
  }, []);

  // Auto close sidebar when resizing to tablet/mobile (<= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setSidebarOpen(false);
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
    if (location.pathname === '/plans' || location.pathname.endsWith('/plans') || location.pathname.startsWith('/checkout/')) return;
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

  if (location.pathname === '/plans' || location.pathname.endsWith('/plans') || currentTab === 'plans') {
    return <PlansPage />;
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

  if (location.pathname === '/reset-password') {
    return <ResetPassword />;
  }

  if (location.pathname === '/set-password') {
    return <SetPassword />;
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
      <SessionTerminatedModal />
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
          <TrialBanner />

          {(() => {
            const userObj = (() => {
              try { return JSON.parse(localStorage.getItem('user') || '{}'); }
              catch (e) { return {}; }
            })();
            const userPlanId = userObj.plan_id || userObj.plan || (userObj.subscription_status === 'trial' ? 'plan-free-trial' : 'plan-starter');

            if (!isTabAllowedForPlan(currentTab, userPlanId)) {
              const reqPlan = getRequiredPlanForTab(currentTab);
              const moduleName = getTabDisplayName(currentTab);
              return (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60vh',
                  textAlign: 'center',
                  padding: '3rem 2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
                  margin: '1rem 0'
                }}>
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: '#d97706',
                    boxShadow: '0 8px 16px -4px rgba(245, 158, 11, 0.2)'
                  }}>
                    <Lock size={36} />
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '0.85rem'
                  }}>
                    Feature Locked in Current Plan
                  </div>

                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                    {moduleName}
                  </h2>
                  <p style={{ color: '#64748b', maxWidth: 520, marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    This module is exclusive to the <strong>{reqPlan} Plan</strong>. Upgrade your subscription to gain immediate access to this feature and supercharge your clinic workflow.
                  </p>

                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      onClick={() => navigate('/plans')}
                      style={{
                        backgroundColor: '#0f766e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 28px',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(15, 118, 110, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#0d9488';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#0f766e';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Upgrade to {reqPlan} Plan
                    </button>
                    <button
                      onClick={() => setCurrentTab('dashboard')}
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer'
                      }}
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <>
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
                {currentTab === 'audit-logs' && <AuditLogs />}
                {currentTab === 'support' && <Support />}
              </>
            );
          })()}
        </main>
      </div>
    </div>
  );
}
