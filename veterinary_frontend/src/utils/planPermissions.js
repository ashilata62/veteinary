/**
 * Plan Permissions Utility
 * Defines feature and tab access per SaaS subscription plan.
 */

export const PLAN_IDS = {
  FREE_TRIAL: 'plan-free-trial',
  STARTER: 'plan-starter',
  STANDARD: 'plan-standard',
  PRO: 'plan-pro',
};

// Core tabs accessible to all plans (subject to role permissions)
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
  'reports',
  'settings',
  'audit-logs',
  'support',
];

// Tabs configuration per plan
export const PLAN_ALLOWED_TABS = {
  // 7-Day Free Trial gets full access to test all modules
  'plan-free-trial': [
    ...CORE_TABS,
    'billing',
    'inventory',
    'home-visits',
    'hospitalization',
  ],
  'free-trial': [
    ...CORE_TABS,
    'billing',
    'inventory',
    'home-visits',
    'hospitalization',
  ],

  // Starter Plan (₹999/mo): Core clinic features
  // Locked: billing, inventory, home-visits, hospitalization
  'plan-starter': [
    ...CORE_TABS,
  ],
  'starter': [
    ...CORE_TABS,
  ],

  // Standard Plan (₹1,299/mo): Starter + Billing + Inventory + Home Visits
  // Locked: hospitalization
  'plan-standard': [
    ...CORE_TABS,
    'billing',
    'inventory',
    'home-visits',
  ],
  'standard': [
    ...CORE_TABS,
    'billing',
    'inventory',
    'home-visits',
  ],

  // Pro Plan (₹1,499/mo): Everything unlocked including Hospitalization
  'plan-pro': [
    ...CORE_TABS,
    'billing',
    'inventory',
    'home-visits',
    'hospitalization',
  ],
  'pro': [
    ...CORE_TABS,
    'billing',
    'inventory',
    'home-visits',
    'hospitalization',
  ],
};

/**
 * Check if a tab is allowed under the clinic's plan.
 * @param {string} tabId 
 * @param {string} planId 
 * @returns {boolean}
 */
export function isTabAllowedForPlan(tabId, planId) {
  if (!tabId) return true;
  // If planId is missing or undefined, default to free-trial or pro
  const normalizedPlan = (planId || 'plan-free-trial').toLowerCase();
  const allowed = PLAN_ALLOWED_TABS[normalizedPlan] || PLAN_ALLOWED_TABS['plan-free-trial'];
  return allowed.includes(tabId);
}

/**
 * Get required minimum plan name for a locked tab
 * @param {string} tabId 
 * @returns {string}
 */
export function getRequiredPlanForTab(tabId) {
  if (tabId === 'hospitalization') return 'Pro';
  if (['billing', 'inventory', 'home-visits'].includes(tabId)) return 'Standard';
  return 'Starter';
}
