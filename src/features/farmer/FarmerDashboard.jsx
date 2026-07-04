import { CheckCircle2, Clock3, Package, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import StatCard from '../../components/cards/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../auth/AuthContext';
import { getProductsByFarmer } from '../../services/productService';
import { getRequestsByFarmer } from '../../services/requestService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { farmerNavItems } from './farmerNav';

export default function FarmerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const products = getProductsByFarmer(currentUser.id);
  const requests = getRequestsByFarmer(currentUser.id);
  const pendingRequests = requests.filter((request) => request.status === 'pending');
  const confirmedRequests = requests.filter((request) => request.status === 'confirmed');

  const productById = Object.fromEntries(products.map((product) => [product.id, product]));

  return (
    <AppShell
      user={currentUser}
      navItems={farmerNavItems}
      title="Farmer dashboard"
      subtitle="Manage your harvest listings and buyer requests from one workspace."
    >
      <section className="stats-grid">
        <StatCard label="Total products" value={products.length} icon={<Store size={20} />} />
        <StatCard label="Active listings" value={products.filter((product) => product.status === 'active').length} icon={<Package size={20} />} />
        <StatCard label="Pending requests" value={pendingRequests.length} icon={<Clock3 size={20} />} />
        <StatCard label="Confirmed requests" value={confirmedRequests.length} icon={<CheckCircle2 size={20} />} />
      </section>

      <section className="content-grid two">
        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Products</p>
              <h2>Recent listings</h2>
            </div>
            <Link className="btn btn-secondary btn-md" to="/farmer-products">Manage products</Link>
          </div>
          {products.length ? (
            <DataTable
              columns={[
                { key: 'name', label: 'Product' },
                { key: 'quantity', label: 'Available', render: (row) => `${row.quantity} ${row.unit}` },
                { key: 'price', label: 'Price', render: (row) => `${formatCurrency(row.price)} / ${row.unit}` },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              ]}
              rows={products.slice(0, 5)}
              emptyMessage="No products yet."
            />
          ) : (
            <EmptyState title="No products yet" message="Add your first harvest listing so buyers can discover it." actionLabel="Add product" onAction={() => navigate('/farmer-products')} />
          )}
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Requests</p>
              <h2>Latest buyer activity</h2>
            </div>
            <Link className="btn btn-secondary btn-md" to="/farmer-requests">Review all</Link>
          </div>
          <DataTable
            columns={[
              { key: 'buyerName', label: 'Buyer' },
              { key: 'productId', label: 'Product', render: (row) => productById[row.productId]?.name || 'Deleted product' },
              { key: 'paymentMethod', label: 'Payment', render: (row) => <StatusBadge value={row.paymentMethod} type="payment" /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
            ]}
            rows={requests.slice(0, 5)}
            emptyMessage="No buyer requests yet."
          />
        </div>
      </section>

      <div className="quick-actions">
        <Button onClick={() => navigate('/farmer-products')}>Add a product</Button>
        <Link className="btn btn-secondary btn-md" to="/marketplace">View marketplace</Link>
      </div>
    </AppShell>
  );
}
