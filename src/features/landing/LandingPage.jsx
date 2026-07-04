import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Leaf, ShieldCheck, Store } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link className="brand" to="/">
          <span className="brand-mark"><Leaf size={22} /></span>
          <span>
            <strong>HarvestLink</strong>
            <small>Cebu farm-to-market</small>
          </span>
        </Link>
        <div className="landing-actions">
          <Link className="btn btn-secondary btn-md" to="/login">Login</Link>
          <Link className="btn btn-primary btn-md" to="/register">Register</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy-block">
          <p className="eyebrow">Farm-to-market prototype</p>
          <h1>Connect Cebu farmers and buyers with clearer produce requests.</h1>
          <p>
            Farmers can list fresh harvests, buyers can request available produce, and request
            statuses stay visible from pending through confirmation or rejection.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/register">
              Start trading <ArrowRight size={18} />
            </Link>
            <Link className="btn btn-secondary btn-lg" to="/login">Sign in</Link>
          </div>
        </div>

        <div className="market-preview" aria-label="HarvestLink marketplace preview">
          <div className="preview-photo">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80"
              alt="Green farm rows under morning light"
            />
          </div>
          <div className="preview-card">
            <span className="category-pill">Vegetables</span>
            <h2>Fresh cabbage</h2>
            <p>Carcar City, Cebu • 120 kg available</p>
            <strong>PHP 55.00 / kg</strong>
          </div>
        </div>
      </section>

      <section className="landing-feature-grid">
        {[
          { icon: Store, title: 'Farmer listings', text: 'Add, edit, hide, and delete products with persistent localStorage data.' },
          { icon: CheckCircle2, title: 'Request review', text: 'Farmers confirm or reject buyer requests after checking quantity and payment method.' },
          { icon: ShieldCheck, title: 'Admin visibility', text: 'Admins can inspect users, products, purchase requests, and future report sections.' },
        ].map((item) => (
          <article key={item.title} className="feature-tile">
            <item.icon size={22} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
