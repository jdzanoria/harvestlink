import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Users,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Mic,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Leaf,
  ShieldCheck,
  Clock3,
  Package2,
  Star,
} from 'lucide-react';
import '../App.css';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [aiPriceLoading, setAiPriceLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [products, setProducts] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Vegetables',
    grade: 'Grade A',
    quantity: '0',
    unit: 'Kilograms (kg)',
    price: '55.00',
    image: '',
    imageUrl: '',
  });

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('harvestlinkProducts');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Failed to load saved products', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('harvestlinkProducts', JSON.stringify(products));
    } catch (error) {
      console.error('Failed to persist products', error);
    }
  }, [products]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'ai-insights', label: 'AI Price Suggestion', icon: TrendingUp },
    { id: 'buyers', label: 'Buyer Recommendations', icon: Users },
    { id: 'history', label: 'Sales History', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleGetAiPrice = (e) => {
    e.preventDefault();
    setAiPriceLoading(true);
    setTimeout(() => {
      setAiSuggestion({
        recommended: 55.0,
        ceiling: 60.0,
        status: 'within',
        message: 'High demand in Cebu City. Current market average is ₱52.00.',
      });
      setAiPriceLoading(false);
    }, 1200);
  };

  const handleProductChange = (field, value) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (productForm.imageUrl) {
      URL.revokeObjectURL(productForm.imageUrl);
    }

    const imageUrl = URL.createObjectURL(file);
    setProductForm((prev) => ({
      ...prev,
      image: file.name,
      imageUrl,
    }));
  };

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

  const handleListProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name: productForm.name || 'Untitled produce',
      category: productForm.category,
      grade: productForm.grade,
      quantity: productForm.quantity,
      unit: productForm.unit,
      price: productForm.price,
      image: productForm.image,
      imageUrl: productForm.imageUrl,
      ownerEmail: currentUser?.email || null,
      ownerName: currentUser?.fullName || currentUser?.email || 'Farmer',
      createdAt: new Date().toISOString(),
    };

    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    try {
      localStorage.setItem('harvestlinkProducts', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Failed to persist products immediately', error);
    }

    setProductForm({
      name: '',
      category: 'Vegetables',
      grade: 'Grade A',
      quantity: '0',
      unit: 'Kilograms (kg)',
      price: '55.00',
      image: '',
      imageUrl: '',
    });
    setSuccessAlert(true);
    setAiSuggestion(null);
    setMobileMenuOpen(false);
    setActiveTab('products');
    setTimeout(() => setSuccessAlert(false), 2800);
  };

  const renderDashboardHome = () => (
    <div className="content-stack">
      <section className="hero-card">
      </section>

      <div className="stats-grid">
        {[
          { label: 'Total products', value: products.length || 0, icon: <Package2 size={18} /> },
          { label: 'Active listings', value: products.length || 0, icon: <Sparkles size={18} /> },
          { label: 'Orders today', value: 0, icon: <ShoppingCart size={18} /> },
          { label: 'Revenue', value: '₱0', icon: <TrendingUp size={18} /> },
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div>
              <p className="section-eyebrow">{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <section className="section-card">
          <div className="section-head">
            <div>
              <p className="section-eyebrow">Products</p>
              <h3>Recent activity</h3>
            </div>
            <a href="#" className="link-pill">
              View all
            </a>
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const myProducts = products.filter((p) => p.ownerEmail && currentUser && p.ownerEmail === currentUser.email);
                  if (!myProducts || myProducts.length === 0) {
                    return (
                      <tr>
                        <td colSpan={5} className="muted">
                          No recent activity — add products to see them here.
                        </td>
                      </tr>
                    );
                  }

                  return myProducts.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{p.quantity} {p.unit.replace(/ *\(.*\)/, '')}</td>
                      <td>₱{p.price}</td>
                      <td>
                        <span className="status-pill active">Active</span>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="side-panel">
          <div className="info-card">
            <div className="section-head compact">
              <div>
                <p className="section-eyebrow">Insights</p>
                <h3>AI market pulse</h3>
              </div>
            </div>
            <p className="muted">Tomatoes are trending up 15% this week in Cebu City.</p>
            <p className="muted">Harvest eggplants by Friday for peak weekend rates.</p>
          </div>

          <div className="info-card">
            <div className="section-head compact">
              <div>
                <p className="section-eyebrow">Match</p>
                <h3>Top buyer fit</h3>
              </div>
            </div>
            <div className="buyer-fit">
              <div className="avatar">F</div>
              <div>
                <strong>FreshMart Cebu</strong>
                <p className="muted">Looking for 100kg cabbage</p>
              </div>
            </div>
            <button className="primary-btn full-width" onClick={() => setActiveTab('messages')}>
              Contact buyer
            </button>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div className="section-card form-card">
      <div className="section-head">
        <div>
          <p className="section-eyebrow">Listing</p>
          <h3>Add new product</h3>
        </div>
      </div>

      <form className="form-stack">
        <div className="field-grid">
          <label className="form-field">
            <span>Product name</span>
            <input
              type="text"
              placeholder="e.g. Organic cabbage"
              value={productForm.name}
              onChange={(e) => handleProductChange('name', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span>Category</span>
            <select
              value={productForm.category}
              onChange={(e) => handleProductChange('category', e.target.value)}
            >
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
            </select>
          </label>
        </div>

        <div className="field-grid">
          <label className="form-field">
            <span>Grade</span>
            <select
              value={productForm.grade}
              onChange={(e) => handleProductChange('grade', e.target.value)}
            >
              <option>Grade A</option>
              <option>Grade B</option>
            </select>
          </label>
          <label className="form-field">
            <span>Quantity(Stock)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder="0.0"
              value={productForm.quantity}
              onChange={(e) => handleProductChange('quantity', e.target.value)}
            />
          </label>
        </div>

        <div className="field-grid">
          <label className="form-field">
            <span>Unit</span>
            <select
              value={productForm.unit}
              onChange={(e) => handleProductChange('unit', e.target.value)}
            >
              <option>Kilograms (kg)</option>
              <option>Tons (t)</option>
              <option>Pieces</option>
            </select>
          </label>
          <label className="form-field">
            <span>Your selling price (₱)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="55.00"
              value={productForm.price}
              onChange={(e) => handleProductChange('price', e.target.value)}
            />
          </label>
        </div>

        <label className="form-field file-field">
          <span>Picture of the product</span>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {productForm.image && <span className="file-name">{productForm.image}</span>}
        </label>

        {successAlert && (
          <div className="success-alert">
            <CheckCircle2 size={16} /> Product added to My Products. You can add another one.
          </div>
        )}

        <div className="ai-card">
          <div className="ai-card-top">
            <div>
              <h4>
                <Sparkles size={16} /> AI price suggestion
              </h4>
              <p>Get a competitive price based on current market demand.</p>
            </div>
            <button type="button" onClick={handleGetAiPrice} className="primary-btn">
              {aiPriceLoading ? 'Analyzing...' : 'Generate'}
            </button>
          </div>

          {aiSuggestion && (
            <div className="ai-result">
              <div>
                <p className="section-eyebrow">Recommended</p>
                <strong>₱{aiSuggestion.recommended}</strong>
              </div>
              <div>
                <p className="section-eyebrow">DTI ceiling</p>
                <strong className="danger-text">₱{aiSuggestion.ceiling}</strong>
              </div>
              <p>{aiSuggestion.message}</p>
            </div>
          )}
        </div>

        <button className="primary-btn full-width" type="submit" onClick={handleListProduct}>
          ADD PRODUCTS
        </button> 
      </form>
    </div>
  );

  const renderProducts = () => (
    <>
      {currentUser && (
        <div className="section-card welcome-card">
          <div className="section-head compact">
            <div>
              <p className="section-eyebrow">Welcome back</p>
              <h3>{currentUser.fullName || currentUser.email}</h3>
            </div>
          </div>
          <p className="muted">Manage your harvest listings and track your products from here.</p>
        </div>
      )}
      <div className="section-card">
        <div className="section-head">
          <div>
            <p className="section-eyebrow">Products</p>
            <h3>My Products</h3>
          </div>
        </div>

      {products.length === 0 ? (
        <p className="muted">No products yet. Add one to see it here.</p>
      ) : (
        <div className="produce-grid">
          {products.map((product) => (
            <div key={product.id} className="produce-card product-list-card">
              <div className="produce-top">
                <span className="product-badge">{product.category}</span>
                <div className="rating-pill">{product.grade}</div>
              </div>
              <div className="produce-visual">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="produce-visual-placeholder">
                  No image
                </div>
              )}
              <div className="produce-visual-inner">
                <div className="produce-visual-labels">
                  <span className="produce-visual-label">{product.category}</span>
                  <span className="produce-visual-label">{product.grade}</span>
                </div>
              </div>
            </div>
            <h4>{product.name}</h4>
              <p className="produce-meta">
                {product.quantity} {product.unit} • ₱{product.price}
              </p>
              <div className="produce-footer">
                <strong>{product.imageUrl ? product.image : 'No image'}</strong>
                <button className="ghost-btn" type="button">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
  );

  const renderMessages = () => (
    <div className="message-shell">
      <div className="message-list">
        <div className="section-head compact">
          <div>
            <p className="section-eyebrow">Messages</p>
            <h3>Buyers</h3>
          </div>
        </div>

        {['FreshMart Cebu', 'SM Supermarket', 'Local Coop Trader'].map((name, index) => (
          <div key={index} className="message-thread">
            <div className="avatar small">{name[0]}</div>
            <div>
              <strong>{name}</strong>
              <p className="muted">Is the price negotiable?</p>
            </div>
          </div>
        ))}
      </div>

      <div className="message-panel">
        <div className="message-panel-header">
          <div>
            <h3>FreshMart Cebu</h3>
            <p className="muted">AI translation active</p>
          </div>
          <MoreVertical size={18} />
        </div>

        <div className="message-bubbles">
          <div className="bubble incoming">Hi! Are the cabbages available for pickup tomorrow?</div>
          <div className="bubble outgoing">Yes sir, ready to harvest tomorrow morning.</div>
        </div>

        <div className="message-input-row">
          <ImageIcon size={18} />
          <Mic size={18} />
          <input placeholder="Type a message..." />
          <button>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="notification-stack">
      <h2>Notifications</h2>
      {[
        { title: 'New order received', desc: 'FreshMart Cebu placed an order for 50kg cabbage.', icon: <ShoppingCart size={18} />, tone: 'info' },
        { title: 'Price warning', desc: 'Your onion listing is above the DTI ceiling.', icon: <AlertTriangle size={18} />, tone: 'danger' },
        { title: 'Harvest reminder', desc: 'Tomatoes in Lot B are scheduled for tomorrow.', icon: <CheckCircle2 size={18} />, tone: 'success' },
      ].map((item, index) => (
        <div key={index} className="notification-card">
          <div className={`notif-icon ${item.tone}`}>{item.icon}</div>
          <div>
            <h4>{item.title}</h4>
            <p className="muted">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={darkMode ? 'farmer-dashboard dark-mode' : 'farmer-dashboard'}>
      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}

      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand-block">
          <div>
            <h1>HarvestLink</h1>
            <p>Farmer Operations</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {activeTab === item.id && <ChevronRight size={16} />}
              </button>
            );
          })}
        </nav>
        <button type="button" className="logout-card" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <div className="desktop-sidebar-spacer" />

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={18} />
            </button>
            <div>
              <h2>{activeTab.replace('-', ' ')}</h2>
              {currentUser && (
                <p className="muted" style={{ margin: 0 }}>
                  Welcome, {currentUser.fullName || currentUser.email}
                </p>
              )}
            </div>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" onClick={() => setActiveTab('notifications')}>
              <Bell size={18} />
            </button>
            <button className="icon-button" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="page-content">
          {activeTab === 'dashboard' && renderDashboardHome()}
          {activeTab === 'add-product' && renderAddProduct()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'notifications' && renderNotifications()}

          {['orders', 'ai-insights', 'buyers', 'history', 'profile'].includes(activeTab) && (
            <div className="section-card empty-state">
              <h3>{navItems.find((item) => item.id === activeTab)?.label}</h3>
              <p>This module is currently under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}