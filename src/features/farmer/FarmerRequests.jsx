import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import DataTable from '../../components/dashboard/DataTable';
import { useAuth } from '../auth/AuthContext';
import { getProductsByFarmer } from '../../services/productService';
import { getRequestsByFarmer, updateRequestStatus } from '../../services/requestService';
import { formatDate } from '../../utils/formatters';
import { farmerNavItems } from './farmerNav';

export default function FarmerRequests() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState(() => getRequestsByFarmer(currentUser.id));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const products = getProductsByFarmer(currentUser.id);
  const productById = useMemo(() => Object.fromEntries(products.map((product) => [product.id, product])), [products]);

  const reload = () => setRequests(getRequestsByFarmer(currentUser.id));

  const handleStatus = (id, status) => {
    try {
      updateRequestStatus(id, status);
      setError('');
      setNotice(`Request ${status}.`);
      reload();
    } catch (statusError) {
      setNotice('');
      setError(statusError.message);
    }
  };

  return (
    <AppShell
      user={currentUser}
      navItems={farmerNavItems}
      title="Buyer requests"
      subtitle="Review requested quantity, message, and payment method before confirming or rejecting."
    >
      {notice ? <div className="form-alert success">{notice}</div> : null}
      {error ? <div className="form-alert error">{error}</div> : null}

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Request queue</p>
            <h2>Purchase requests</h2>
          </div>
        </div>

        {requests.length ? (
          <DataTable
            columns={[
              { key: 'buyerName', label: 'Buyer' },
              { key: 'productId', label: 'Product', render: (row) => productById[row.productId]?.name || 'Deleted product' },
              { key: 'quantity', label: 'Quantity', render: (row) => `${row.quantity} ${productById[row.productId]?.unit || ''}` },
              { key: 'paymentMethod', label: 'Payment', render: (row) => <StatusBadge value={row.paymentMethod} type="payment" /> },
              { key: 'message', label: 'Message', render: (row) => row.message || 'No message' },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
              { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
              {
                key: 'actions',
                label: 'Action',
                render: (row) => row.status === 'pending' ? (
                  <div className="table-actions">
                    <Button size="sm" onClick={() => handleStatus(row.id, 'confirmed')}>
                      <Check size={15} /> Confirm
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleStatus(row.id, 'rejected')}>
                      <X size={15} /> Reject
                    </Button>
                  </div>
                ) : 'Reviewed',
              },
            ]}
            rows={requests}
            emptyMessage="No requests yet."
          />
        ) : (
          <EmptyState title="No requests yet" message="Buyer requests for your products will appear here." />
        )}
      </section>
    </AppShell>
  );
}
