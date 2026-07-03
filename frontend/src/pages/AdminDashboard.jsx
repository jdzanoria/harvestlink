import React, { useState } from 'react';
import { LayoutDashboard, Users, ShoppingBag, BarChart3, ShieldAlert, FileText } from 'lucide-react';

// Modern Color Palette
const COLORS = {
  primary: '#064e3b',
  active: '#059669',
  bg: '#f8fafc',
  card: '#ffffff',
  textMain: '#1e293b',
  textSub: '#64748b',
  border: '#e2e8f0'
};

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', icon: <Users size={20} /> },
    { name: 'Products', icon: <ShoppingBag size={20} /> },
    { name: 'AI Monitoring', icon: <ShieldAlert size={20} /> },
    { name: 'Reports', icon: <FileText size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <nav style={{ width: '280px', backgroundColor: COLORS.primary, color: 'white', padding: '30px 20px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '50px', letterSpacing: '-0.5px', fontWeight: 700 }}>HarvestLink</h2>
        {menuItems.map(item => (
          <div key={item.name} 
               onClick={() => setActiveView(item.name)}
               style={{ 
                 padding: '14px 20px', cursor: 'pointer', display: 'flex', gap: '12px', borderRadius: '12px',
                 marginBottom: '8px', transition: 'all 0.2s ease',
                 backgroundColor: activeView === item.name ? COLORS.active : 'transparent' 
               }}>
            {item.icon} {item.name}
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ color: COLORS.textMain, fontSize: '2rem', margin: 0 }}>{activeView}</h1>
          <p style={{ color: COLORS.textSub }}>Welcome back, Admin.</p>
        </header>

        {activeView === 'Dashboard' && <DashboardStats />}
        {activeView === 'Users' && <UserManagement />}
      </main>
    </div>
  );
}

function DashboardStats() {
  const stats = [
    { label: 'Total Farmers', value: '120' },
    { label: 'Total Buyers', value: '85' },
    { label: 'Pending Reports', value: '5' },
    { label: 'Revenue', value: '₱12,000' }
  ];
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
      {stats.map(s => (
        <div key={s.label} style={{ 
          padding: '24px', background: COLORS.card, borderRadius: '16px', 
          border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
        }}>
          <p style={{ color: COLORS.textSub, fontSize: '0.875rem', marginBottom: '8px' }}>{s.label}</p>
          <h3 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>{s.value}</h3>
        </div>
      ))}
    </div>
  );
}

function UserManagement() {
  return (
    <div style={{ background: COLORS.card, borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left', borderBottom: `1px solid ${COLORS.border}` }}>
            {['Name', 'Role', 'Status', 'Action'].map(h => <th key={h} style={{ padding: '16px 24px', color: COLORS.textSub, fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <td style={{ padding: '20px 24px', fontWeight: 600 }}>Juan Dela Cruz</td>
            <td style={{ padding: '20px 24px' }}>Farmer</td>
            <td style={{ padding: '20px 24px' }}>
              <span style={{ padding: '6px 12px', borderRadius: '20px', background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 600 }}>VERIFIED</span>
            </td>
            <td style={{ padding: '20px 24px' }}>
              <button style={{ background: 'transparent', border: `1px solid ${COLORS.border}`, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}