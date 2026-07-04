import { BarChart3, FileText, ShoppingBag, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import StatCard from '../../components/cards/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../auth/AuthContext';
import { getUsers } from '../../services/authService';
import { getProducts } from '../../services/productService';
import { getRequests } from '../../services/requestService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { adminNavItems } from './adminNav';

function sectionFromPath(pathname) {
  if (pathname.includes('admin-users')) return 'users';
  if (pathname.includes('admin-products')) return 'products';
  if (pathname.includes('admin-requests')) return 'requests';
  if (pathname.includes('admin-reports')) return 'reports';
  return 'dashboard';
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  const section = sectionFromPath(pathname);
  const users = getUsers();
  const products = getProducts();
  const requests = getRequests();

  return (
    <AppShell
      user={currentUser}
      navItems={adminNavItems}
      title="Admin dashboard"
      subtitle="Monitor HarvestLink prototype activity across users, products, and purchase requests."
    >
      {section === 'dashboard' ? (
        <>
          <section className="stats-grid">
            <StatCard label="Users" value={users.length} icon={<Users size={20} />} />
            <StatCard label="Products" value={products.length} icon={<ShoppingBag size={20} />} />
            <StatCard label="Requests" value={requests.length} icon={<BarChart3 size={20} />} />
            <StatCard label="Reports" value="Placeholder" icon={<FileText size={20} />} />
          </section>
          <section className="content-grid two">
            <AdminUsers users={users.slice(0, 5)} />
            <AdminRequests requests={requests.slice(0, 5)} products={products} />
          </section>
        </>
      ) : null}
      {section === 'users' ? <AdminUsers users={users} /> : null}
      {section === 'products' ? <AdminProducts products={products} /> : null}
      {section === 'requests' ? <AdminRequests requests={requests} products={products} /> : null}
      {section === 'reports' ? <ReportsPlaceholder /> : null}
    </AppShell>
  );
}

function AdminUsers({ users }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Users</p>
          <h2>Registered accounts</h2>
        </div>
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} /> },
          { key: 'createdAt', label: 'Created', render: (row) => formatDate(row.createdAt) },
        ]}
        rows={users}
        emptyMessage="No registered users yet."
      />
    </section>
  );
}

function AdminProducts({ products }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Products</p>
          <h2>Marketplace listings</h2>
        </div>
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Product' },
          { key: 'farmerName', label: 'Farmer' },
          { key: 'price', label: 'Price', render: (row) => `${formatCurrency(row.price)} / ${row.unit}` },
          { key: 'quantity', label: 'Available', render: (row) => `${row.quantity} ${row.unit}` },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
        rows={products}
        emptyMessage="No products yet."
      />
    </section>
  );
}

function AdminRequests({ requests, products }) {
  const productById = Object.fromEntries(products.map((product) => [product.id, product]));

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Requests</p>
          <h2>Purchase requests</h2>
        </div>
      </div>
      <DataTable
        columns={[
          { key: 'buyerName', label: 'Buyer' },
          { key: 'productId', label: 'Product', render: (row) => productById[row.productId]?.name || 'Deleted product' },
          { key: 'quantity', label: 'Qty' },
          { key: 'paymentMethod', label: 'Payment', render: (row) => <StatusBadge value={row.paymentMethod} type="payment" /> },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', label: 'Created', render: (row) => formatDate(row.createdAt) },
        ]}
        rows={requests}
        emptyMessage="No purchase requests yet."
      />
    </section>
  );
}

function ReportsPlaceholder() {
  return (
    <section className="panel">
      <EmptyState
        title="Reports placeholder"
        message="This section is reserved for future market, sales, product, and issue reports once a backend exists."
      />
    </section>
  );
}
