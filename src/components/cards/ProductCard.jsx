import { Link } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

export default function ProductCard({ product, actions, showStatus = false }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-link">
        <div className="product-image">
          {product.image ? <img src={product.image} alt={product.name} /> : <Package size={42} />}
        </div>
      </Link>
      <div className="product-card-body">
        <div className="product-card-top">
          <span className="category-pill">{product.category}</span>
          {showStatus ? <StatusBadge value={product.status} /> : null}
        </div>
        <h3>{product.name}</h3>
        <p className="muted">{product.description}</p>
        <div className="product-meta">
          <span>
            <MapPin size={15} /> {product.location}
          </span>
          <span>{product.quantity} {product.unit} available</span>
        </div>
      </div>
      <div className="product-card-footer">
        <strong>{formatCurrency(product.price)} / {product.unit}</strong>
        {actions || (
          <Link className="btn btn-secondary btn-md" to={`/products/${product.id}`}>
            View
          </Link>
        )}
      </div>
    </article>
  );
}
