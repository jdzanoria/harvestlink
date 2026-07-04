import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import ProductCard from '../../components/cards/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../auth/AuthContext';
import { getActiveProducts } from '../../services/productService';
import { buyerNavItems } from '../buyer/buyerNav';
import { farmerNavItems } from '../farmer/farmerNav';

export default function Marketplace() {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const products = getActiveProducts();
  const navItems = currentUser.role === 'farmer' ? farmerNavItems : buyerNavItems;

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      [product.name, product.category, product.location, product.farmerName]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [products, query]);

  return (
    <AppShell
      user={currentUser}
      navItems={navItems}
      title="Marketplace"
      subtitle="Find active produce listings from Cebu farmers."
    >
      <section className="panel marketplace-toolbar">
        <label className="search-field" htmlFor="marketplace-search">
          <Search size={18} />
          <input
            id="marketplace-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by product, category, farmer, or location"
          />
        </label>
      </section>

      {filteredProducts.length ? (
        <section className="product-grid">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </section>
      ) : (
        <EmptyState title="No matching products" message="Try another search or check back when farmers add new harvests." />
      )}
    </AppShell>
  );
}
