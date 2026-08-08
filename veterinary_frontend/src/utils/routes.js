/** Role-based URL prefixes for dashboard navigation */
export const ROLE_PREFIX = {
  Admin: 'admin',
  Manager: 'manager',
  Doctor: 'doctor',
  Receptionist: 'reception',
  'Vet Assistant': 'assistant',
};

export const TAB_IDS = new Set([
  'landing',
  'register',
  'dashboard',
  'appointments',
  'home-visits',
  'owners',
  'pets',
  'medical',
  'treatment',
  'prescriptions',
  'reports-uploads',
  'my-revenue',
  'lab-results',
  'assistance-tasks',
  'billing',
  'inventory',
  'staff',
  'attendance',
  'reports',
  'notifications',
  'reminders',
  'support',
]);

const PREFIXES = new Set(Object.values(ROLE_PREFIX));

export function getRolePrefix(role) {
  return ROLE_PREFIX[role] || 'admin';
}

/** Build path for a tab, e.g. /admin/appointments */
export function pathForTab(tab, role) {
  if (tab === 'landing') return '/landing';
  if (tab === 'register') return '/register';
  return `/${getRolePrefix(role)}/${tab}`;
}

/** Parse active tab from URL (supports /admin/appointments and legacy /appointments) */
export function tabFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return 'landing';
  if (parts.length === 1) {
    if (parts[0] === 'login') return 'login';
    if (parts[0] === 'register') return 'register';
    if (parts[0] === 'landing') return 'landing';
    if (TAB_IDS.has(parts[0])) return parts[0];
    return 'landing';
  }
  if (PREFIXES.has(parts[0]) && TAB_IDS.has(parts[1])) return parts[1];
  if (TAB_IDS.has(parts[parts.length - 1])) return parts[parts.length - 1];
  return 'dashboard';
}

/** True if path is legacy flat route without role prefix */
export function isLegacyPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.length === 1 && TAB_IDS.has(parts[0]);
}
