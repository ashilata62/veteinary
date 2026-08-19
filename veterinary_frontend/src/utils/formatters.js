// Centralized currency and formatting utilities for PetCare Pro

/**
 * Formats a numeric value into currency string with 'Rs' prefix.
 * Example: 1750 -> 'Rs 1,750', 250.5 -> 'Rs 250.50'
 * @param {number|string} amount 
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === '') return 'Rs 0';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return 'Rs 0';
  
  const hasDecimals = num % 1 !== 0;
  return `Rs ${num.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Formats a date string or Date object to standard YYYY-MM-DD
 * @param {string|Date} dateVal 
 * @returns {string}
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toISOString().split('T')[0];
};
