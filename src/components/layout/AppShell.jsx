import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Sprout } from 'lucide-react';
import Button from '../common/Button';
import { ROLE_DASHBOARDS } from '../../utils/constants';
import { useAuth } from '../../features/auth/AuthContext';

export default function AppShell({ user, navItems, title, subtitle, children }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to={ROLE_DASHBOARDS[user.role]}>
          <span className="brand-mark">
            <Sprout size={22} />
          </span>
          <span>
            <strong>HarvestLink</strong>
            <small>{user.role} workspace</small>
          </span>
        </Link>

        <nav className="side-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="logout-link" type="button" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="eyebrow">Cebu farm-to-market</p>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <div className="user-chip">
            <span>{user.name?.slice(0, 1) || 'H'}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
        </header>
        {children}
      </main>

      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 4).map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut size={16} />
        </Button>
      </nav>
    </div>
  );
}
