/**
 * Plan Permissions Utility
 * Defines feature and tab access per SaaS subscription plan.
 */

export const PLAN_IDS = {
  FREE_TRIAL: 'plan-free-trial',
  STARTER: 'plan-starter',
  STANDARD: 'plan-standard',
  PRO: 'plan-pro',
  CUSTOM: 'plan-custom',
};

// Core tabs accessible to all plans (subject to role permissions)
// Starter Plan includes these essential clinic management features
const CORE_TABS = [
  'dashboard',
  'appointments',
  'owners',
  'pets',
  'medical',
  'treatment',
  'assistance-tasks',
  'prescriptions',
  'my-revenue',
  'reminders',
  'staff',
  'attendance',
  'settings',
  'support',
];

// Standard Plan features: Starter + Billing & POS, Inventory, Home Visits, Reports & Analytics
const STANDARD_ADDITIONS = [
  'billing',
  'inventory',
  'home-visits',
  'reports',
];

// Pro Plan features: Standard + Hospitalization, Audit Logs
const PRO_ADDITIONS = [
  'hospitalization',
  'audit-logs',
];

// Tabs configuration per plan
export const PLAN_ALLOWED_TABS = {
  // 7-Day Free Trial gets full access to test all modules
  'plan-free-trial': [
    ...CORE_TABS,
    ...STANDARD_ADDITIONS,
    ...PRO_ADDITIONS,
  ],
  'free-trial': [
    ...CORE_TABS,
    ...STANDARD_ADDITIONS,
    ...PRO_ADDITIONS,
  ],

  // Starter Plan (₹999/mo): Essential clinic management features
  // Locked: billing, inventory, home-visits, reports, hospitalization, audit-logs
  'plan-starter': [
    ...CORE_TABS,
  ],
  'starter': [
    ...CORE_TABS,
  ],

  // Standard Plan (₹1,299/mo): Complete features for growing clinics
  // Includes: billing, inventory, home-visits, reports
  // Locked: hospitalization, audit-logs
  'plan-standard': [
    ...CORE_TABS,
    ...STANDARD_ADDITIONS,
  ],
  'standard': [
    ...CORE_TABS,
    ...STANDARD_ADDITIONS,
  ],

  // Pro Plan (₹1,499/mo): Everything unlocked including Hospitalization & Audit Logs
  'plan-pro': [
    ...CORE_TABS,
    ...STANDARD_ADDITIONS,
    ...PRO_ADDITIONS,
  ],
  'pro': [
    ...CORE_TABS,
    ...STANDARD_ADDITIONS,
    ...PRO_ADDITIONS,
  ],

  // Custom Plan: Everything unlocked
  'plan-custom': [
    ...CORE_TABS,
    ...STANDARD_ADDITIONS,
    ...PRO_ADDITIONS,
  ],
  'custom': [
    ...CORE_TABS,
    ...STANDARD_ADDITIONS,
    ...PRO_ADDITIONS,
  ],
};

/**
 * Normalize plan ID string to standard keys
 * @param {string} planId 
 * @returns {string}
 */
export function normalizePlanId(planId) {
  if (!planId) return 'plan-free-trial';
  const clean = planId.toLowerCase().trim();
  if (clean.includes('pro')) return 'plan-pro';
  if (clean.includes('standard')) return 'plan-standard';
  if (clean.includes('starter')) return 'plan-starter';
  if (clean.includes('custom')) return 'plan-custom';
  if (clean.includes('trial') || clean === 'free') return 'plan-free-trial';
  return clean;
}

/**
 * Check if a tab is allowed under the clinic's plan.
 * @param {string} tabId 
 * @param {string} planId 
 * @returns {boolean}
 */
export function isTabAllowedForPlan(tabId, planId) {
  if (!tabId) return true;
  // Always allow core dashboard and support
  if (tabId === 'dashboard' || tabId === 'support' || tabId === 'settings') return true;

  const key = normalizePlanId(planId);
  const allowed = PLAN_ALLOWED_TABS[key] || PLAN_ALLOWED_TABS['plan-starter'];
  return allowed.includes(tabId);
}

/**
 * Get required minimum plan name for a locked tab
 * @param {string} tabId 
 * @returns {string}
 */
export function getRequiredPlanForTab(tabId) {
  if (tabId === 'hospitalization' || tabId === 'audit-logs') return 'Pro';
  if (['billing', 'inventory', 'home-visits', 'reports'].includes(tabId)) return 'Standard';
  return 'Starter';
}
