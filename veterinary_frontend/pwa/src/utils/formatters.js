// Centralized currency and formatting utilities for PetCare Pro
import { CURRENCIES } from '../context/CurrencyContext';

/**
 * Returns the currently active currency configuration
 */
export const getActiveCurrency = () => {
  try {
    const code = (typeof window !== 'undefined' && localStorage.getItem('petcare_currency')) || 'INR';
    return CURRENCIES[code] || CURRENCIES.INR;
  } catch (e) {
    return CURRENCIES.INR;
  }
};

/**
 * Returns the current currency symbol (e.g. ₹, $, €, £)
 */
export const getCurrencySymbol = () => {
  return getActiveCurrency().symbol;
};

/**
 * Formats a numeric value into currency string using the global currency setting.
 * Supports automatic exchange rate conversion from base (INR) to selected currency.
 * 
 * Example: 1750 (INR) -> '₹1,750' or in USD -> '$21.00'
 * @param {number|string} amount 
 * @param {object} [options] { convert: boolean, raw: boolean, forceSymbol: string }
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, options = {}) => {
  const cur = getActiveCurrency();
  if (amount === undefined || amount === null || amount === '') return `${options.forceSymbol || cur.symbol}0`;
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return `${options.forceSymbol || cur.symbol}0`;
  
  const shouldConvert = options.convert !== false && !options.raw;
  const finalVal = shouldConvert ? num * cur.rateFromINR : num;
  const hasDecimals = cur.decimals > 0 || (finalVal % 1 !== 0);

  const formattedNum = finalVal.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? (cur.decimals || 2) : 0,
    maximumFractionDigits: 2
  });

  const sym = options.forceSymbol || cur.symbol;
  return `${sym}${formattedNum}`;
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
