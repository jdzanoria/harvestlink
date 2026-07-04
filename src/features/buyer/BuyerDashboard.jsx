import { Clock3, PackageCheck, ShoppingBag, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import StatCard from '../../components/cards/StatCard';
import ProductCard from '../../components/cards/ProductCard';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/dashboard/DataTable';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../auth/AuthContext';
import { getActiveProducts, getProductById } from '../../services/productService';
import { getRequestsByBuyer } from '../../services/requestService';
import { formatDate } from '../../utils/formatters';
import { buyerNavItems } from './buyerNav';

export default function BuyerDashboard() {
  const { currentUser } = useAuth();
  const products = getActiveProducts();
  const requests = getRequestsByBuyer(currentUser.id);

  return (
    <AppShell
      user={currentUser}
      navItems={buyerNavItems}
      title="Buyer dashboard"
      subtitle="Browse Cebu harvests and track product requests from local farmers."
    >
      <section className="stats-grid">
        <StatCard label="Active listings" value={products.length} icon={<Store size={20} />} />
        <StatCard label="My requests" value={requests.length} icon={<ShoppingBag size={20} />} />
        <StatCard label="Pending" value={requests.filter((request) => request.status === 'pending').length} icon={<Clock3 size={20} />} />
        <StatCard label="Confirmed" value={requests.filter((request) => request.status === 'confirmed').length} icon={<PackageCheck size={20} />} />
      </section>

      <section className="content-grid two">
        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Marketplace</p>
              <h2>Fresh listings</h2>
            </div>
            <Link className="btn btn-secondary btn-md" to="/marketplace">Browse all</Link>
          </div>
          {products.length ? (
            <div className="product-grid preview">
              {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <EmptyState title="No products yet" message="Farmer listings will appear here once products are added." />
          )}
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">History</p>
              <h2>Recent requests</h2>
            </div>
            <Link className="btn btn-secondary btn-md" to="/buyer-requests">View history</Link>
          </div>
          <DataTable
            columns={[
              { key: 'productId', label: 'Product', render: (row) => getProductById(row.productId)?.name || 'Deleted product' },
              { key: 'quantity', label: 'Qty' },
              { key: 'paymentMethod', label: 'Payment', render: (row) => <StatusBadge value={row.paymentMethod} type="payment" /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
            ]}
            rows={requests.slice(0, 5)}
            emptyMessage="No purchase requests yet."
          />
        </div>
      </section>
    </AppShell>
  );
}
