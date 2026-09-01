import React, { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      {label && <span className="custom-dropdown-label">{label}</span>}
      <button
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="dropdown-trigger-text">
          {selectedOption?.flag && <span className="dropdown-flag">{selectedOption.flag}</span>}
          <span>{selectedOption?.label || value}</span>
        </span>
        <svg
          className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-dropdown-menu" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                className={`custom-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={isSelected}
              >
                <div className="dropdown-item-content">
                  {opt.flag && <span className="dropdown-flag">{opt.flag}</span>}
                  <span className="dropdown-item-title">{opt.label}</span>
                </div>
                {isSelected && (
                  <svg
                    className="dropdown-check-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
