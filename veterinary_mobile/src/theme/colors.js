// ============================================================
// PetCare Pro — Color System
// Landing / Login / Register → Dark Theme (handled locally in each screen)
// Post-login app screens → Light/White theme (this file)
// ============================================================

export const colors = {
  // ── Brand Colors ──────────────────────────────────────────
  primary: '#0f766e',        // Deep Teal (matches web sidebar)
  primaryDark: '#0d6461',    // Darker Teal hover
  primaryLight: '#ccfbf1',   // Very light teal bg for chips/badges
  primaryBorder: '#99f6e4',  // Teal border
  secondary: '#14b8a6',      // Lighter Teal accent
  secondaryLight: '#e6fffa',

  // ── App Background (White/Light after login) ──────────────
  background: '#f1f5f9',     // Light gray-white page background
  surface: '#ffffff',        // Pure white cards & panels
  card: '#ffffff',           // Card backgrounds
  cardAlt: '#f8fafc',        // Slightly off-white alternate card

  // ── Text Colors ───────────────────────────────────────────
  textPrimary: '#0f172a',    // Very dark for headings
  textSecondary: '#475569',  // Slate gray for body text
  textMuted: '#94a3b8',      // Light muted for placeholders
  textInverse: '#ffffff',    // White text on dark/teal backgrounds

  // ── Borders & Dividers ────────────────────────────────────
  border: '#e2e8f0',         // Light gray border
  borderFocus: '#0f766e',    // Teal border on focus
  divider: '#f1f5f9',        // Very light divider

  // ── Status Colors ─────────────────────────────────────────
  success: '#16a34a',
  successLight: '#dcfce7',
  successBorder: '#bbf7d0',
  warning: '#d97706',
  warningLight: '#fef3c7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  info: '#2563eb',
  infoLight: '#dbeafe',

  // ── Header / Sidebar ──────────────────────────────────────
  headerBg: '#0f766e',       // Teal header background (matches web)
  headerText: '#ffffff',

  // ── Tab Bar ───────────────────────────────────────────────
  tabBarBg: '#ffffff',
  tabBarBorder: '#e2e8f0',
  tabActive: '#0f766e',
  tabInactive: '#94a3b8',

  // ── Shadows ───────────────────────────────────────────────
  shadow: '#00000015',
  shadowMedium: '#00000025',
};
