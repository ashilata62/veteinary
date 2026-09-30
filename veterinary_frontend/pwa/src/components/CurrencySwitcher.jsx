import React from 'react';
import clsx from 'clsx';
import { useCurrency } from '../context/CurrencyContext';

export const CurrencySwitcher = ({ variant = 'buttons', className = '' }) => {
  const { currency, setCurrency, currencyList } = useCurrency();

  if (variant === 'select') {
    return (
      <div className={clsx("relative inline-block notranslate", className)}>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm"
        >
          {currencyList.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code} ({c.symbol.trim()})
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Quick buttons for common currencies
  const quickList = ['INR', 'USD', 'EUR', 'GBP', 'AED'];

  return (
    <div className={clsx("flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 h-10 notranslate", className)}>
      {quickList.map((code) => {
        const item = currencyList.find((c) => c.code === code);
        const isActive = currency === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            title={item ? `${item.name} (${item.symbol})` : code}
            className={clsx(
              "px-2.5 h-full text-[11px] font-black rounded-md transition-all uppercase tracking-wider",
              isActive
                ? "bg-white text-emerald-600 shadow-sm border border-slate-100"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {item ? item.symbol.trim() : code}
          </button>
        );
      })}
    </div>
  );
};

export default CurrencySwitcher;
