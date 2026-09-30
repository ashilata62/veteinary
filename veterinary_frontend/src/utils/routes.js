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
  'brochure',
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
  'permissions',
  'attendance',
  'reports',
  'notifications',
  'reminders',
  'support',
  'hospitalization',
  'plans',
  'settings',
  'audit-logs',
  'privacy-policy',
  'terms',
  'contact',
  'features',
  'benefits',
  'testimonials',
  'pricing',
  'smart-appointments',
  'electronic-medical-records',
  'pharmacy-pos-billing',
  'automated-whatsapp-alerts',
  'hospitalization-ipd',
  'multi-branch-reports',
]);

const PREFIXES = new Set(Object.values(ROLE_PREFIX));

export function getRolePrefix(role) {
  return ROLE_PREFIX[role] || 'admin';
}

/** Build path for a tab, e.g. /admin/appointments */
export function pathForTab(tab, role) {
  if (tab === 'landing' || tab === 'home') return '/';
  if (tab === 'register') return '/register';
  if (tab === 'brochure') return '/brochure';
  if (tab === 'privacy-policy') return '/privacy-policy';
  if (tab === 'terms') return '/terms';
  if (tab === 'contact') return '/contact';
  if (tab === 'features') return '/features';
  if (tab === 'benefits') return '/benefits';
  if (tab === 'testimonials') return '/testimonials';
  if (tab === 'pricing') return '/pricing';
  if (tab === 'smart-appointments') return '/smart-appointments';
  if (tab === 'electronic-medical-records') return '/electronic-medical-records';
  if (tab === 'pharmacy-pos-billing') return '/pharmacy-pos-billing';
  if (tab === 'automated-whatsapp-alerts') return '/automated-whatsapp-alerts';
  if (tab === 'hospitalization-ipd') return '/hospitalization-ipd';
  if (tab === 'multi-branch-reports') return '/multi-branch-reports';
  return `/${getRolePrefix(role)}/${tab}`;
}

/** Parse active tab from URL (supports /admin/appointments and legacy /appointments) */
export function tabFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return 'landing';
  if (parts.length === 1) {
    if (parts[0] === 'login') return 'login';
    if (parts[0] === 'register') return 'register';
    if (parts[0] === 'brochure') return 'brochure';
    if (parts[0] === 'landing') return 'landing';
    if (parts[0] === 'privacy-policy') return 'privacy-policy';
    if (parts[0] === 'terms') return 'terms';
    if (parts[0] === 'contact') return 'contact';
    if (parts[0] === 'features') return 'features';
    if (parts[0] === 'benefits') return 'benefits';
    if (parts[0] === 'testimonials') return 'testimonials';
    if (parts[0] === 'pricing') return 'pricing';
    if (parts[0] === 'smart-appointments') return 'smart-appointments';
    if (parts[0] === 'electronic-medical-records') return 'electronic-medical-records';
    if (parts[0] === 'pharmacy-pos-billing') return 'pharmacy-pos-billing';
    if (parts[0] === 'automated-whatsapp-alerts') return 'automated-whatsapp-alerts';
    if (parts[0] === 'hospitalization-ipd') return 'hospitalization-ipd';
    if (parts[0] === 'multi-branch-reports') return 'multi-branch-reports';
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
