import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Custom select — dropdown menu stays within parent width (fixes mobile overflow).
 */
export default function FormSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className = '',
  name,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  const selectedOption = options.find((o) => String(o.value) === String(value));
  const displayLabel = selectedOption?.label ?? placeholder;
  const hasValue = value !== '' && value !== undefined && value !== null && selectedOption;

  const handleSelect = (optValue) => {
    onChange(optValue);
    setOpen(false);
  };

  return (
    <div
      className={`form-select-custom ${open ? 'form-select-custom--open' : ''} ${className}`}
      ref={wrapRef}
    >
      <button
        type="button"
        className={`form-select-custom__trigger ${!hasValue ? 'form-select-custom__trigger--placeholder' : ''}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
      >
        <span className="form-select-custom__label">{displayLabel}</span>
        <ChevronDown size={18} className="form-select-custom__chevron" aria-hidden />
      </button>

      {open && (
        <ul className="form-select-custom__menu" id={listId} role="listbox">
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <li key={opt.value === '' ? '__empty' : opt.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`form-select-custom__option ${isSelected ? 'form-select-custom__option--active' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className="form-select-custom__option-text">{opt.label}</span>
                  {isSelected && <Check size={16} className="form-select-custom__check" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {name && <input type="hidden" name={name} value={value ?? ''} />}
      {required && (
        <input
          tabIndex={-1}
          className="form-select-custom__validator"
          value={hasValue ? value : ''}
          required
          onChange={() => {}}
          aria-hidden
        />
      )}
    </div>
  );
}
