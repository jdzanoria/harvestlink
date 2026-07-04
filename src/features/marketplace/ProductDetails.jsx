import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import RequestForm from '../../components/forms/RequestForm';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { useAuth } from '../auth/AuthContext';
import { getProductById } from '../../services/productService';
import { createPurchaseRequest } from '../../services/requestService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { buyerNavItems } from '../buyer/buyerNav';
import { farmerNavItems } from '../farmer/farmerNav';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const product = getProductById(id);

  if (id === 'featured') return <Navigate to="/marketplace" replace />;
  if (!product) return <Navigate to="/marketplace" replace />;

  const navItems = currentUser.role === 'farmer' ? farmerNavItems : buyerNavItems;
  const canRequest = currentUser.role === 'buyer' && currentUser.id !== product.farmerId && product.status === 'active';

  const handleRequest = (values) => {
    createPurchaseRequest(values, product, currentUser);
    navigate('/buyer-requests', { state: { notice: 'Purchase request sent to the farmer.' } });
  };

  return (
    <AppShell
      user={currentUser}
      navItems={navItems}
      title={product.name}
      subtitle={`${product.farmerName} • ${product.location}`}
    >
      <section className="content-grid two uneven">
        <article className="panel product-detail">
          <div className="detail-image">
            {product.image ? <img src={product.image} alt={product.name} /> : <Package size={64} />}
          </div>
          <div className="detail-content">
            <div className="product-card-top">
              <span className="category-pill">{product.category}</span>
              <StatusBadge value={product.status} />
            </div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div className="detail-list">
              <div><span>Price</span><strong>{formatCurrency(product.price)} / {product.unit}</strong></div>
              <div><span>Available</span><strong>{product.quantity} {product.unit}</strong></div>
              <div><span>Location</span><strong><MapPin size={15} /> {product.location}</strong></div>
              <div><span>Farmer</span><strong>{product.farmerName}</strong></div>
              <div><span>Listed</span><strong>{formatDate(product.createdAt)}</strong></div>
            </div>
          </div>
        </article>

        <aside className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Purchase request</p>
              <h2>Request this product</h2>
            </div>
          </div>
          {canRequest ? (
            <RequestForm product={product} currentUser={currentUser} onSubmit={handleRequest} />
          ) : (
            <div className="empty-state compact">
              <h3>Request unavailable</h3>
              <p>
                {currentUser.role !== 'buyer'
                  ? 'Only buyer accounts can create purchase requests.'
                  : 'You cannot request your own product or an inactive listing.'}
              </p>
              <Link className="btn btn-secondary btn-md" to="/marketplace">Back to marketplace</Link>
            </div>
          )}
        </aside>
      </section>
      <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
    </AppShell>
  );
}
