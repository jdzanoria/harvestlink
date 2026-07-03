import React from 'react';

export function LoginButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'transparent',
        border: '1px solid rgba(22, 101, 52, 0.16)',
        color: '#166534',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.95rem',
        padding: '10px 18px',
        borderRadius: '999px',
        transition: 'all 180ms ease-in-out'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(22, 101, 52, 0.08)'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
    >
      Login
    </button>
  );
}

export function RegisterButton({ onClick }) {
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
        transition: 'background 180ms ease-in-out'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#14532d'}
      onMouseOut={(e) => e.currentTarget.style.background = '#166534'}
    >
      Register
    </button>
  );
}