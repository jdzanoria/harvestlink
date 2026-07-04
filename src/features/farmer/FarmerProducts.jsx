import { useState } from 'react';
import { Edit3, PackagePlus, Trash2 } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import ProductCard from '../../components/cards/ProductCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ProductForm from '../../components/forms/ProductForm';
import { useAuth } from '../auth/AuthContext';
import { createProduct, deleteProduct, getProductsByFarmer, setProductStatus, updateProduct } from '../../services/productService';
import { farmerNavItems } from './farmerNav';

export default function FarmerProducts() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState(() => getProductsByFarmer(currentUser.id));
  const [editingProduct, setEditingProduct] = useState(null);
  const [notice, setNotice] = useState('');

  const reload = () => setProducts(getProductsByFarmer(currentUser.id));

  const handleSubmit = (values) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values);
      setEditingProduct(null);
      setNotice('Product updated.');
    } else {
      createProduct(values, currentUser);
      setNotice('Product added to the marketplace.');
    }
    reload();
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setNotice('Product deleted.');
    reload();
  };

  const handleStatus = (product) => {
    setProductStatus(product.id, product.status === 'active' ? 'inactive' : 'active');
    setNotice(`Product marked ${product.status === 'active' ? 'inactive' : 'active'}.`);
    reload();
  };

  return (
    <AppShell
      user={currentUser}
      navItems={farmerNavItems}
      title="My products"
      subtitle="Add, edit, delete, and control visibility for your produce listings."
    >
      {notice ? <div className="form-alert success">{notice}</div> : null}
      <section className="content-grid two uneven">
        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Listing form</p>
              <h2>{editingProduct ? 'Edit product' : 'Add produce'}</h2>
            </div>
            <PackagePlus size={24} />
          </div>
          <ProductForm
            key={editingProduct?.id || 'new-product'}
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
          />
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Inventory</p>
              <h2>Your listings</h2>
            </div>
          </div>

          {products.length ? (
            <div className="product-grid compact">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showStatus
                  actions={(
                    <div className="card-actions">
                      <Button size="sm" variant="secondary" onClick={() => setEditingProduct(product)}>
                        <Edit3 size={15} /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleStatus(product)}>
                        {product.status === 'active' ? 'Hide' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  )}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No listings yet" message="Use the form to add the first product buyers will see." />
          )}
        </div>
      </section>
    </AppShell>
  );
}
