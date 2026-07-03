import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  ShoppingBag,
  Truck,
  MessageSquare,
  Bell,
  Search,
  MapPin,
  Zap,
  LogOut,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Leaf,
  Clock3,
  Star,
  Package2,
} from 'lucide-react';
import '../App.css';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const [marketplaceCards, setMarketplaceCards] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('harvestlinkProducts');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const marketplaceProducts = parsed.map((product) => ({
            id: product.id,
            name: product.name,
            farmer: 'Local farmer',
            location: 'Cebu Region',
            price: `₱${product.price}/${product.unit.replace(/ *\(.*\)/, '')}`,
            note: product.category,
            imageUrl: product.imageUrl,
          }));
          setMarketplaceCards(marketplaceProducts);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load seller products for marketplace', error);
    }
    setMarketplaceCards([]);
  }, []);

  const handleLogout = () => {
    try { localStorage.removeItem('harvestlink_current_user'); } catch (e) {}
    navigate('/');
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('harvestlink_current_user');
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (err) {
      console.error('Failed to read current user', err);
    }
  }, []);

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setPurchaseMessage('');
    setDetailModalOpen(true);
  };

  const closeProductDetails = () => {
    setDetailModalOpen(false);
    setSelectedProduct(null);
    setPurchaseMessage('');
  };

  const handleBuyNow = (product) => {
    setPurchaseMessage(`Purchase request created for ${product.name}.`);
  };

  const navItems = [
    { icon: LayoutGrid, label: 'Overview' },
    { icon: ShoppingBag, label: 'Marketplace', active: true },
    { icon: Truck, label: 'Orders' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Zap, label: 'Insights' },
  ];

  return (
    <div className="buyer-dashboard">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">H</div>
          <div>
            <h1>HarvestLink</h1>
            <p>Cebu Regional Hub</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.active && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>

        

        <button type="button" className="logout-card" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <label className="searchbar">
            <Search size={18} />
            <input placeholder="Search fresh produce..." />
          </label>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
            </button>
        
          </div>
        </header>

        <section className="content-grid">
          <div className="content-main">
            {currentUser && (
              <section className="section-card welcome-card">
                <div className="section-head compact">
                  <div>
                    <p className="section-eyebrow">Welcome back</p>
                    <h3>{currentUser.fullName || currentUser.email}</h3>
                  </div>
                </div>
                <p className="muted">Browse the freshest farm produce available from local sellers.</p>
              </section>
            )}
            <section className="hero-card">
              <div className="hero-copy">
                <p className="hero-kicker">
                  <Sparkles size={16} /> Fresh harvest, faster delivery
                </p>
                <h2>Shop premium produce from Cebu farmers in minutes.</h2>
                <p>
                  Discover seasonal vegetables, tropical fruits, and farm-direct deals tailored to your business.
                </p>
                <div className="hero-actions">
                  <button className="primary-btn">Explore marketplace</button>
                  <button className="ghost-btn">View my orders</button>
                </div>
              </div>

              <div className="hero-panel">
                <div className="hero-badge">
                  <Leaf size={16} /> {currentUser ? (currentUser.rating || '0.0') : '0.0'} farmer rating
                </div>
                <div className="mini-stat">
                  <Package2 size={18} /> {marketplaceCards.length || 0} fresh listings
                </div>
                <div className="mini-stat">
                  <Clock3 size={18} /> Same-day dispatch
                </div>
              </div>
            </section>

            <section className="section-card">
              <div className="section-head">
                <div>
                  <p className="section-eyebrow">Marketplace</p>
                  <h3>Available produce</h3>
                </div>
                <a href="#" className="link-pill">
                  See all
                </a>
              </div>

              {marketplaceCards.length === 0 ? (
                <p className="muted">No products available. Farmers haven't listed anything yet.</p>
              ) : (
                <div className="produce-grid">
                  {marketplaceCards.map((item) => (
                    <article key={item.id ?? item.name} className={`produce-card ${item.highlight ? 'featured' : ''}`}>
                      <div className="produce-top">
                        <span className="product-badge">{item.note}</span>
                        <div className="rating-pill">
                          <Star size={14} /> 4.8
                        </div>
                      </div>
                      <div className="produce-visual">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} />
                        ) : null}
                      </div>
                      <h4>{item.name}</h4>
                      <p className="produce-meta">
                        {item.farmer} • {item.location}
                      </p>
                      <div className="produce-footer">
                        <strong>{item.price}</strong>
                        <div className="product-actions">
                          <button type="button" className="ghost-btn" onClick={() => openProductDetails(item)}>
                            View details
                          </button>
                          <button type="button" className="primary-btn" onClick={() => handleBuyNow(item)}>
                            Buy now
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="side-panel">
            <div className="info-card">
              <div className="section-head compact">
                <div>
                  <p className="section-eyebrow">Delivery</p>
                  <h3>Today’s route</h3>
                </div>
              </div>
              <div className="delivery-pill">
                <MapPin size={16} /> Delivery to Mandaue • 2 hrs
              </div>
              <div className="delivery-progress">
                <div className="progress-bar" />
              </div>
              <p className="muted">Fast pickup windows are still available for this afternoon.</p>
            </div>

            <div className="info-card">
              <div className="section-head compact">
                <div>
                  <p className="section-eyebrow">Highlights</p>
                  <h3>Top picks</h3>
                </div>
              </div>
              <ul className="list-stack">
                <li>
                  <span>Premium eggplants</span>
                  <strong>₱38/kg</strong>
                </li>
                <li>
                  <span>Fresh calamansi</span>
                  <strong>₱22/kg</strong>
                </li>
                <li>
                  <span>Organic bananas</span>
                  <strong>₱30/kg</strong>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
      {detailModalOpen && selectedProduct && (
        <div className="product-modal-backdrop" onClick={closeProductDetails}>
          <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeProductDetails}>
              ×
            </button>
            <div className="modal-header">
              <p className="section-eyebrow">Product details</p>
              <h2>{selectedProduct.name}</h2>
            </div>
            {selectedProduct.imageUrl ? (
              <div className="product-modal-image">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
              </div>
            ) : null}
            <p className="muted">{selectedProduct.note}</p>
            <div className="product-detail-row">
              <span>Seller</span>
              <strong>{selectedProduct.farmer}</strong>
            </div>
            <div className="product-detail-row">
              <span>Location</span>
              <strong>{selectedProduct.location}</strong>
            </div>
            <div className="product-detail-row">
              <span>Price</span>
              <strong>{selectedProduct.price}</strong>
            </div>
            <div className="modal-footer">
              <button type="button" className="ghost-btn" onClick={closeProductDetails}>
                Close
              </button>
              <button type="button" className="primary-btn" onClick={() => handleBuyNow(selectedProduct)}>
                Buy now
              </button>
            </div>
            {purchaseMessage && <p className="purchase-message">{purchaseMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}