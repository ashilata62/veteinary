import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export const EDITIONS = [
  { code: 'usa', label: 'USA ($)', short: 'USA', flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { code: 'uk', label: 'UK (£)', short: 'UK', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { code: 'uae', label: 'UAE (AED)', short: 'UAE', flag: '🇦🇪', currency: 'AED', symbol: 'AED' },
  { code: 'au', label: 'Australia (A$)', short: 'AUS', flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
  { code: 'en', label: 'India / Global (₹)', short: 'GLB', flag: '🌐', currency: 'INR', symbol: '₹' },
];

export default function LanguageSwitcher({ selectedRegion, onRegionChange, inDrawer = false }) {
  const [currentRegion, setCurrentRegion] = useState(() => {
    if (selectedRegion) return selectedRegion;
    const stored = localStorage.getItem('petcare_region');
    return stored && EDITIONS.some(e => e.code === stored) ? stored : 'usa';
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync with prop if provided
  useEffect(() => {
    if (selectedRegion && selectedRegion !== currentRegion) {
      setCurrentRegion(selectedRegion);
    }
  }, [selectedRegion]);

  // Listen to global region change events
  useEffect(() => {
    const handleGlobalChange = (e) => {
      if (e.detail && e.detail !== currentRegion) {
        setCurrentRegion(e.detail);
      }
    };
    window.addEventListener('petcare_region_changed', handleGlobalChange);
    return () => window.removeEventListener('petcare_region_changed', handleGlobalChange);
  }, [currentRegion]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (regionCode) => {
    setCurrentRegion(regionCode);
    localStorage.setItem('petcare_region', regionCode);
    setIsOpen(false);
    if (onRegionChange) {
      onRegionChange(regionCode);
    }
    window.dispatchEvent(new CustomEvent('petcare_region_changed', { detail: regionCode }));
  };

  const activeObj = EDITIONS.find(e => e.code === currentRegion) || EDITIONS[0];

  // 1. In-Drawer Layout (Sleek Dark Full-Width Expandable Accordion)
  if (inDrawer) {
    return (
      <div className="notranslate" ref={dropdownRef} style={{ width: '100%', boxSizing: 'border-box' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '10px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            color: '#f8fafc',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
          title="Select Country & Currency Edition"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={18} style={{ color: '#14b8a6', flexShrink: 0 }} />
            <span>{activeObj.flag} {activeObj.label}</span>
          </span>
          <ChevronDown
            size={16}
            style={{
              color: '#94a3b8',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              flexShrink: 0
            }}
          />
        </button>

        {isOpen && (
          <div style={{
            position: 'static',
            width: '100%',
            marginTop: '8px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '6px 8px', letterSpacing: '0.06em' }}>
              5 Regional Editions
            </div>

            {EDITIONS.map((reg) => {
              const isSelected = reg.code === currentRegion;
              return (
                <button
                  key={reg.code}
                  type="button"
                  onClick={() => handleSelect(reg.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isSelected ? 'rgba(20, 184, 166, 0.18)' : 'transparent',
                    color: isSelected ? '#2dd4bf' : '#cbd5e1',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.15rem' }}>{reg.flag}</span>
                    <span>{reg.label}</span>
                  </span>
                  {isSelected && <Check size={16} style={{ color: '#2dd4bf' }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 2. Standard Header Layout (Top Navbar)
  return (
    <div className="notranslate" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Toggle Button */}
      <button
        type="button"
        className="vet-lang-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#1e293b',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.backgroundColor = '#f0fdfa'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
        title="Select Country & Currency Edition"
      >
        <Globe size={15} style={{ color: '#14b8a6', flexShrink: 0 }} />
        <span className="lang-text-full">{activeObj.flag} {activeObj.short} ({activeObj.symbol})</span>
        <span className="lang-text-mobile">{activeObj.flag} {activeObj.short}</span>
        <ChevronDown size={14} style={{ color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>

      {/* Region & Currency Selection Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '6px',
          width: '190px',
          maxWidth: 'calc(100vw - 24px)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '6px 8px', letterSpacing: '0.06em' }}>
            5 Regional Editions
          </div>

          {EDITIONS.map((reg) => {
            const isSelected = reg.code === currentRegion;
            return (
              <button
                key={reg.code}
                type="button"
                onClick={() => handleSelect(reg.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isSelected ? '#f0fdfa' : 'transparent',
                  color: isSelected ? '#0f766e' : '#334155',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.05rem' }}>{reg.flag}</span>
                  <span>{reg.label}</span>
                </span>
                {isSelected && <Check size={14} style={{ color: '#14b8a6' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
