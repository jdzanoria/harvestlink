import React from 'react';

export default function RegisterButton({ onClick, theme }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: '#166534',
        border: 'none',
        color: '#ffffff',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.95rem',
        padding: '10px 18px',
        borderRadius: '999px',
        transition: 'background 180ms ease-in-out, box-shadow 180ms ease-in-out',
        // Ensures the button remains clickable even if layered
        pointerEvents: 'auto',
        outline: 'none'
      }}
      // Mouse Events
      onMouseOver={(e) => e.currentTarget.style.background = '#14532d'}
      onMouseOut={(e) => e.currentTarget.style.background = '#166534'}
      
      // Accessibility: Visual feedback for keyboard users
      onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.4)'}
      onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      Register
    </button>
  );
}