import React, { createContext, useContext, useState, useEffect } from 'react';

export const CURRENCIES = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    rateFromINR: 1,
    decimals: 0
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rateFromINR: 0.012,
    decimals: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rateFromINR: 0.011,
    decimals: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    rateFromINR: 0.0095,
    decimals: 2
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    rateFromINR: 0.044,
    decimals: 2
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    rateFromINR: 0.018,
    decimals: 2
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    rateFromINR: 0.016,
    decimals: 2
  }
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('petcare_currency') || 'INR';
  });

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.INR;

  const setCurrency = (code) => {
    if (!CURRENCIES[code]) return;
    setCurrencyState(code);
    localStorage.setItem('petcare_currency', code);
    window.dispatchEvent(new CustomEvent('petcare_currency_changed', { detail: code }));
  };

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'petcare_currency' && e.newValue && CURRENCIES[e.newValue]) {
        setCurrencyState(e.newValue);
      }
    };
    const handleCustom = (e) => {
      if (e.detail && CURRENCIES[e.detail] && e.detail !== currency) {
        setCurrencyState(e.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('petcare_currency_changed', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('petcare_currency_changed', handleCustom);
    };
  }, [currency]);

  /**
   * Format any numeric amount to the active global currency
   * @param {number|string} amount
   * @param {object} options { convert: boolean, raw: boolean }
   */
  const formatCurrency = (amount, options = {}) => {
    if (amount === undefined || amount === null || amount === '') return `${activeCurrency.symbol}0`;
    const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
    if (isNaN(num)) return `${activeCurrency.symbol}0`;

    const shouldConvert = options.convert !== false && !options.raw;
    const finalAmount = shouldConvert ? num * activeCurrency.rateFromINR : num;

    const decimals = activeCurrency.decimals > 0 || (finalAmount % 1 !== 0) ? 2 : 0;

    return `${activeCurrency.symbol}${finalAmount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: 2
    })}`;
  };

  const convertAmount = (amount) => {
    if (amount === undefined || amount === null || amount === '') return 0;
    const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
    if (isNaN(num)) return 0;
    return num * activeCurrency.rateFromINR;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        activeCurrency,
        setCurrency,
        formatCurrency,
        convertAmount,
        currencies: CURRENCIES,
        currencyList: CURRENCY_LIST
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback when used outside provider
    const storedCode = (typeof window !== 'undefined' && localStorage.getItem('petcare_currency')) || 'INR';
    const fallbackCur = CURRENCIES[storedCode] || CURRENCIES.INR;
    return {
      currency: storedCode,
      activeCurrency: fallbackCur,
      setCurrency: (code) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('petcare_currency', code);
          window.dispatchEvent(new CustomEvent('petcare_currency_changed', { detail: code }));
        }
      },
      formatCurrency: (amount) => {
        if (amount === undefined || amount === null || amount === '') return `${fallbackCur.symbol}0`;
        const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
        if (isNaN(num)) return `${fallbackCur.symbol}0`;
        const converted = num * fallbackCur.rateFromINR;
        const decimals = fallbackCur.decimals > 0 || (converted % 1 !== 0) ? 2 : 0;
        return `${fallbackCur.symbol}${converted.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: 2
        })}`;
      },
      convertAmount: (amount) => {
        const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
        return isNaN(num) ? 0 : num * fallbackCur.rateFromINR;
      },
      currencies: CURRENCIES,
      currencyList: CURRENCY_LIST
    };
  }
  return context;
};

export default CurrencyContext;
