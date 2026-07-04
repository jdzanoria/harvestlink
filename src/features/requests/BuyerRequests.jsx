import { useLocation } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import DataTable from '../../components/dashboard/DataTable';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../auth/AuthContext';
import { getProductById } from '../../services/productService';
import { getRequestsByBuyer } from '../../services/requestService';
import { formatDate } from '../../utils/formatters';
import { buyerNavItems } from '../buyer/buyerNav';

export default function BuyerRequests() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const requests = getRequestsByBuyer(currentUser.id);

  return (
    <AppShell
      user={currentUser}
      navItems={buyerNavItems}
      title="My purchase requests"
      subtitle="Track whether farmers have confirmed or rejected your requests."
    >
      {location.state?.notice ? <div className="form-alert success">{location.state.notice}</div> : null}

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">History</p>
            <h2>Request history</h2>
          </div>
        </div>

        {requests.length ? (
          <DataTable
            columns={[
              { key: 'productId', label: 'Product', render: (row) => getProductById(row.productId)?.name || 'Deleted product' },
              { key: 'quantity', label: 'Quantity', render: (row) => `${row.quantity} ${getProductById(row.productId)?.unit || ''}` },
              { key: 'farmerId', label: 'Farmer', render: (row) => getProductById(row.productId)?.farmerName || 'Farmer' },
              { key: 'paymentMethod', label: 'Payment', render: (row) => <StatusBadge value={row.paymentMethod} type="payment" /> },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'updatedAt', label: 'Updated', render: (row) => formatDate(row.updatedAt) },
            ]}
            rows={requests}
            emptyMessage="No requests yet."
          />
        ) : (
          <EmptyState title="No requests yet" message="Open a product in the marketplace and send your first purchase request." />
        )}
      </section>
    </AppShell>
  );
}
