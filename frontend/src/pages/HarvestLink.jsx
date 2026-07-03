import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cabbageImg from '../assets/images/cabbage.jpg';
import { LoginButton } from '../components/LoginButton';
import RegisterButton from '../components/RegisterButton';
import FarmerDashboard from './FarmerDashboard';
import { findUser, saveUser, userExists } from '../utils/auth';

import {
  ShieldCheck,
  CircleDollarSign,
  Handshake,
  MessageSquare,
  Languages,
  Search,
  Lock,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const featureItems = [
  { icon: <CircleDollarSign size={18} />, title: 'Crop Price Optimizer', desc: 'Adapt farm prices to local demand and seasonality while keeping every offer fair.' },
  { icon: <Handshake size={18} />, title: 'Grower-Buyer Matchmaking', desc: 'Connect harvest suppliers with nearby buyers looking for fresh produce.' },
  { icon: <MessageSquare size={18} />, title: 'Harvest Chat', desc: 'Negotiate orders instantly with secure in-app communication for every deal.' },
  { icon: <Languages size={18} />, title: 'Local Language Support', desc: 'Translate Cebuano, Tagalog, and English so every farmer and buyer can trade easily.' },
  { icon: <Search size={18} />, title: 'Produce Marketplace Search', desc: 'Find the right crops with filters for variety, grade, volume, and delivery area.' },
  { icon: <Lock size={18} />, title: 'Verified Farm Network', desc: 'Trade with confidence through a verified community of growers and buyers.' }
];

const processSteps = [
  { step: 1, title: 'List Harvest', desc: 'Farmer uploads crop details, quantity, and delivery preferences.' },
  { step: 2, title: 'Find Local Produce', desc: 'Buyer searches fresh harvest options by crop, region, and quality.' },
  { step: 3, title: 'Match with Buyers', desc: 'The platform suggests the best buyer connections for every listing.' },
  { step: 4, title: 'Agree Terms', desc: 'Negotiate price, pickup, and delivery with secure messaging.' },
  { step: 5, title: 'Finalize Delivery', desc: 'Confirm the order and prepare produce for pickup or shipment.' }
];

const styles = {
  page: { fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' },
  nav: { position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px', zIndex: 60, gap: '20px' },
  navBrand: { fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.04em' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap', fontWeight: 600, fontSize: '0.95rem' },
  navActionGroup: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  hero: { minHeight: '92vh', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 60px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '32px', alignItems: 'center', position: 'relative' },
  heroBackground: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(132, 204, 22, 0.16), transparent 24%), radial-gradient(circle at 80% 18%, rgba(245, 158, 11, 0.16), transparent 20%), radial-gradient(circle at 22% 58%, rgba(34, 197, 94, 0.14), transparent 28%)', opacity: 0.95, filter: 'blur(34px)', pointerEvents: 'none', zIndex: -2 },
  heroPanel: { display: 'grid', gap: '24px', zIndex: 1 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.02em' },
  heroTitle: { margin: '0', fontSize: '3.2rem', lineHeight: 1.03, letterSpacing: '-0.04em', maxWidth: '680px' },
  heroCopy: { margin: 0, fontSize: '1.05rem', lineHeight: 1.85, maxWidth: '680px', fontWeight: 500 },
  heroCtas: { display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' },
  heroImageWrap: { borderRadius: '32px', overflow: 'hidden', position: 'relative', minHeight: '520px', boxShadow: '0 34px 80px rgba(15, 23, 42, 0.14)', border: '1px solid rgba(148, 163, 184, 0.18)' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  priceCard: { position: 'absolute', bottom: '24px', left: '24px', right: '24px', borderRadius: '24px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(16px)', boxShadow: '0 22px 60px rgba(15, 23, 42, 0.14)' },
  section: { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' },
  sectionHeader: { display: 'grid', gap: '18px', marginBottom: '36px' },
  sectionTitle: { margin: 0, fontSize: '2.1rem', lineHeight: 1.05, fontWeight: 800 },
  sectionText: { margin: 0, fontSize: '1rem', lineHeight: 1.75, fontWeight: 500, maxWidth: '720px' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
  featureCard: { borderRadius: '28px', padding: '28px', minHeight: '180px', display: 'grid', gap: '16px', transition: 'transform 220ms ease, box-shadow 220ms ease', border: '1px solid rgba(148, 163, 184, 0.18)' },
  featureIcon: { width: '46px', height: '46px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' },
  stepCircle: { width: '42px', height: '42px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '1rem' },
  stepTitle: { margin: 0, fontSize: '1rem', fontWeight: 700 },
  stepDesc: { margin: 0, lineHeight: 1.75, fontSize: '0.95rem' },
  contactGrid: { display: 'grid', gridTemplateColumns: '1.15fr 0.9fr', gap: '28px' },
  contactCard: { display: 'flex', gap: '16px', padding: '20px', borderRadius: '22px', border: '1px solid rgba(148, 163, 184, 0.18)', minHeight: '110px' },
  contactInfoTitle: { margin: 0, fontSize: '0.82rem', fontWeight: 700 },
  contactInfoText: { margin: '8px 0 0', fontSize: '0.92rem', lineHeight: 1.75 },
  contactForm: { borderRadius: '28px', padding: '28px', border: '1px solid rgba(148, 163, 184, 0.18)', display: 'grid', gap: '18px' },
  inputLabel: { display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 700 },
  inputField: { width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.24)', fontSize: '0.95rem', outline: 'none' },
  submitButton: { width: '100%', padding: '14px 16px', borderRadius: '14px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'transform 180ms ease' },
  footer: { padding: '28px 24px', marginTop: '14px' },
  footerInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '18px' }
};

export default function HarvestLinkLanding() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    role: 'farmer', 
    municipality: '', 
    contactNumber: '', 
    document: null 
  });

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const themeValues = {
    pageBg: theme === 'dark' ? '#071212' : '#f2f8ef',
    pageColor: theme === 'dark' ? '#e8f6e5' : '#1f3d18',
    navBg: theme === 'dark' ? 'rgba(13, 34, 18, 0.92)' : 'rgba(255, 255, 255, 0.94)',
    navBorder: theme === 'dark' ? 'rgba(58, 83, 47, 0.16)' : 'rgba(214, 237, 214, 0.75)',
    badgeBg: theme === 'dark' ? 'rgba(28, 55, 28, 0.88)' : '#ecfdf5',
    badgeColor: theme === 'dark' ? '#86efac' : '#166534',
    sectionBg: theme === 'dark' ? '#081711' : '#ffffff',
    sectionText: theme === 'dark' ? '#c8e7d0' : '#4f6b4b',
    cardBg: theme === 'dark' ? 'rgba(18, 36, 23, 0.96)' : '#ffffff',
    cardBorder: theme === 'dark' ? 'rgba(74, 110, 67, 0.14)' : 'rgba(212, 244, 211, 0.9)',
    heroCopy: theme === 'dark' ? '#c8e7d0' : '#5e6f56',
    priceBg: theme === 'dark' ? 'rgba(22, 43, 23, 0.9)' : 'rgba(255,255,255,0.92)',
    priceText: theme === 'dark' ? '#f8fafc' : '#165d28',
    cardShadow: theme === 'dark' ? 'rgba(6, 31, 13, 0.28)' : 'rgba(15, 23, 42, 0.08)',
    modalTitle: theme === 'dark' ? '#f8fafc' : '#1f3d18',
    modalSubtitle: theme === 'dark' ? '#b8d5b3' : '#5e6f56',
    footerBg: theme === 'dark' ? '#081a12' : '#f5fbf2',
    footerText: theme === 'dark' ? '#d2e7cf' : '#4f6b4b'
  };

  const bubbleStyles = [
    { backgroundColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.28)' : 'rgba(74, 222, 128, 0.18)', mixBlendMode: theme === 'dark' ? 'screen' : 'normal' },
    { backgroundColor: theme === 'dark' ? 'rgba(234, 179, 8, 0.24)' : 'rgba(250, 204, 21, 0.16)', mixBlendMode: theme === 'dark' ? 'screen' : 'normal' },
    { backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(34, 197, 94, 0.14)', mixBlendMode: theme === 'dark' ? 'screen' : 'normal' },
    { backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.24)' : 'rgba(132, 204, 22, 0.12)', mixBlendMode: theme === 'dark' ? 'screen' : 'normal' },
    { backgroundColor: theme === 'dark' ? 'rgba(244, 114, 182, 0.16)' : 'rgba(249, 168, 37, 0.12)', mixBlendMode: theme === 'dark' ? 'screen' : 'normal' }
  ];

  const openModal = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthSuccess('');
    setAuthForm({
      fullName: '',
      email: '',
      password: '',
      role: 'farmer',
      municipality: '',
      contactNumber: '',
      document: null
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setAuthError('');
    setAuthSuccess('');
    setAuthForm({
      fullName: '',
      email: '',
      password: '',
      role: 'farmer',
      municipality: '',
      contactNumber: '',
      document: null
    });
  };

  const handleAuthChange = (field, value) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
    setAuthError('');
    setAuthSuccess('');
  };

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    // Basic required fields
    if (authMode === 'login') {
      if (!authForm.email || !authForm.password) {
        setAuthError('please fill up');
        setAuthSuccess('');
        return;
      }
    } else {
      // Register: require name, email, password and contact number
      if (!authForm.fullName || !authForm.email || !authForm.password || !authForm.contactNumber) {
        setAuthError('please fill up');
        setAuthSuccess('');
        return;
      }
      // Validate phone number (PH format: 09XXXXXXXXX )
      const phonePattern = /^(?:\+63|0)9\d{9}$/;
      if (!phonePattern.test(authForm.contactNumber.replace(/\s+/g, ''))) {
        setAuthError('Please enter a valid phone number.');
        setAuthSuccess('');
        return;
      }
    }

    if (!isEmailValid(authForm.email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (authMode === 'login') {
      const normalizedEmail = authForm.email.toLowerCase();

      // Admin shortcut
      if (normalizedEmail === 'admin@harvestlink.com' && authForm.password === 'admin') {
        closeModal();
        navigate('/admin-dashboard');
        return;
      }

      const matched = findUser(normalizedEmail, authForm.password);
      if (matched) {
        // persist current session user for dashboards to read
        try {
          const userToStore = { ...matched };
          localStorage.setItem('harvestlink_current_user', JSON.stringify(userToStore));
        } catch (err) {
          console.error('Failed to store current user', err);
        }
        closeModal();
        if (matched.role === 'buyer') navigate('/buyer-dashboard');
        else navigate('/farmer-dashboard');
        return;
      }

      setAuthError('Login failed. Check your email and password.');
      setAuthSuccess('');
      return;
    }

    // Register: persist new account to localStorage and prompt to sign in.
    const normalizedEmail = authForm.email.toLowerCase();
    if (userExists(normalizedEmail)) {
      setAuthError('An account with this email already exists. Please sign in.');
      setAuthSuccess('');
      setAuthMode('login');
      setAuthForm((prev) => ({ ...prev, password: '' }));
      return;
    }

    saveUser({
      email: normalizedEmail,
      password: authForm.password,
      role: authForm.role || 'farmer',
      fullName: authForm.fullName || '',
      municipality: authForm.municipality || '',
      contactNumber: authForm.contactNumber || '',
      documentName: authForm.document ? authForm.document.name : ''
    });
    setAuthMode('login');
    setAuthForm((prev) => ({ ...prev, password: '' }));
    setAuthError('');
    setAuthSuccess('Account created — please sign in.');
    return;
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div style={{ ...styles.page, backgroundColor: themeValues.pageBg, color: themeValues.pageColor }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body { min-height: 100vh; }
        button, input, textarea, select { font: inherit; }
        
        /* Input Focus Styles */
        input:focus, textarea:focus, select:focus { border-color: #22c55e !important; box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); }

        .bubble { position: absolute; border-radius: 50%; opacity: 0.26; filter: blur(0.4px); animation: bubbleDrift 16s ease-in-out infinite; }
        .bubble-1 { width: 110px; height: 110px; top: 14%; left: 12%; animation-duration: 15s; }
        .bubble-2 { width: 72px; height: 72px; top: 27%; left: 74%; animation-duration: 18s; animation-delay: 1.2s; }
        .bubble-3 { width: 92px; height: 92px; top: 52%; left: 18%; animation-duration: 19s; animation-delay: 0.8s; }
        .bubble-4 { width: 128px; height: 128px; top: 8%; left: 70%; animation-duration: 22s; animation-delay: 2.3s; }
        .bubble-5 { width: 52px; height: 52px; top: 66%; left: 40%; animation-duration: 17s; animation-delay: 3s; }
        
        @keyframes bubbleDrift { 
          0% { transform: translateY(0) scale(0.96); }
          25% { transform: translateY(-16px) scale(1.02); }
          50% { transform: translateY(-32px) scale(1.08); }
          75% { transform: translateY(-16px) scale(1.03); }
          100% { transform: translateY(0) scale(0.96); }
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(77, 124, 15, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(77, 124, 15, 0); }
          100% { box-shadow: 0 0 0 0 rgba(77, 124, 15, 0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes shimmerBorder {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animated-footer-border { height: 2px; width: 100%; background: linear-gradient(90deg, transparent, #22c55e, #eab308, #22c55e, transparent); background-size: 200% auto; animation: shimmerBorder 5s linear infinite; opacity: 0.7; }
        .footer-link { position: relative; color: inherit; text-decoration: none; transition: color 0.3s ease; font-weight: 500; }
        .footer-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -4px; left: 0; background-color: #22c55e; transition: width 0.3s ease; }
        .footer-link:hover { color: #22c55e !important; }
        .footer-link:hover::after { width: 100%; }

        .btn-pulse { animation: pulseGlow 2s infinite; transition: transform 0.2s ease, background-color 0.2s ease; }
        .btn-pulse:hover { transform: scale(1.03); background-color: #3f6212 !important; }
        .floating-card { animation: float 4s ease-in-out infinite; }
        .slide-in-card { opacity: 0; animation: slideInRight 0.8s ease-out forwards; }
        .slide-in-card.delay-1 { animation-delay: 0.2s; }
        .slide-in-card.delay-2 { animation-delay: 0.4s; }
        .slide-in-card.delay-3 { animation-delay: 0.6s; }
        .fade-up { opacity: 0; transform: translateY(24px); animation: fadeUp 0.95s ease-out forwards; }
        .fade-up.delay-1 { animation-delay: 0.12s; }
        .fade-up.delay-2 { animation-delay: 0.18s; }
        .fade-scale { opacity: 0; transform: scale(0.94); animation: fadeScale 0.95s ease-out forwards; }
        .fade-scale.delay-1 { animation-delay: 0.16s; }
        .feature-card { opacity: 0; transform: translateY(18px); animation: fadeUp 0.95s ease-out forwards; }
        .feature-card.delay-1 { animation-delay: 0.16s; }
        .feature-card.delay-2 { animation-delay: 0.24s; }
        .feature-card.delay-3 { animation-delay: 0.32s; }
        .feature-card.delay-4 { animation-delay: 0.40s; }
        .feature-card.delay-5 { animation-delay: 0.48s; }
        .feature-card.delay-6 { animation-delay: 0.56s; }
        .hero-image-glow { box-shadow: 0 40px 120px rgba(34, 197, 94, 0.18); transition: transform 0.3s ease; }
        .hero-image-glow:hover { transform: translateY(-5px); }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 22px 60px rgba(15, 23, 42, 0.16); }
        .submit-button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(22, 101, 52, 0.2); }
        .nav-link { position: relative; transition: color 0.2s; }
        .nav-link:hover { color: #22c55e !important; }
        .mobile-menu-button { display: none; border: none; background: transparent; color: inherit; cursor: pointer; font-size: 1.2rem; padding: 10px; border-radius: 999px; }
        .harvestlink-nav-links.open { display: flex; }
        .harvestlink-nav-links { transition: max-height 220ms ease, opacity 220ms ease; }
        .harvestlink-nav-links a { min-width: 0; text-decoration: none; }
        .modal-tab { border: 1px solid ${themeValues.cardBorder}; background: transparent; color: ${themeValues.pageColor}; padding: 10px 16px; border-radius: 999px; cursor: pointer; font-weight: 700; margin-left: 10px; transition: all 0.2s; }
        .modal-tab.active { background: ${theme === 'dark' ? '#0f172a' : '#eef2ff'}; border-color: ${theme === 'dark' ? '#334155' : '#c7d2fe'}; }
        @keyframes fadeUp { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeScale { 0% { opacity: 0; transform: scale(0.94); } 100% { opacity: 1; transform: scale(1); } }
        
        @media (max-width: 960px) {
          .harvestlink-hero { grid-template-columns: 1fr; padding-top: 100px; }
          .harvestlink-hero-image-wrap { min-height: 420px; }
          .harvestlink-nav { flex-wrap: wrap; gap: 14px; }
          .harvestlink-nav-actions { width: 100%; justify-content: flex-end; }
        }
        @media (max-width: 820px) {
          .harvestlink-hero { grid-template-columns: 1fr; padding-top: 96px; }
          .harvestlink-hero-title { font-size: 2.65rem; }
        }
        @media (max-width: 720px) {
          .harvestlink-nav { flex-direction: column; align-items: stretch; padding: 14px 18px; gap: 12px; z-index: 80; }
          .harvestlink-nav-links { width: 100%; display: none !important; flex-direction: column; align-items: stretch; gap: 10px; margin-top: 8px; max-height: 0; opacity: 0; overflow: hidden; background: ${themeValues.navBg}; border-radius: 18px; padding: 0 8px; border: 1px solid ${themeValues.navBorder}; }
          .harvestlink-nav-links.open { display: flex !important; max-height: 800px; opacity: 1; padding: 12px 8px; }
          .harvestlink-nav-links .nav-link { width: 100%; text-align: center; padding: 12px 0; border-radius: 14px; }
          .harvestlink-nav-actions { width: 100%; display: none !important; flex-direction: column; gap: 10px; margin-top: 8px; background: ${themeValues.navBg}; border-radius: 18px; padding: 0 8px; border: 1px solid ${themeValues.navBorder}; max-height: 0; opacity: 0; overflow: hidden; transition: max-height 220ms ease, opacity 220ms ease; }
          .harvestlink-nav-actions.open { display: flex !important; max-height: 400px; opacity: 1; padding: 12px 8px; }
          .mobile-menu-button { display: inline-flex; align-items: center; justify-content: center; border: 1px solid rgba(148, 163, 184, 0.3); width: 44px; height: 44px; }
          .harvestlink-hero { padding: 90px 16px 36px; }
          .harvestlink-hero-title { font-size: 2.15rem; line-height: 1.1; }
          .harvestlink-hero-copy { font-size: 0.98rem; }
          .harvestlink-section { padding: 40px 16px; }
          .harvestlink-contact-grid { grid-template-columns: 1fr; }
          .featureGrid { grid-template-columns: 1fr; }
          .harvestlink-nav-actions button, .harvestlink-nav-actions a { flex: 1 1 100%; }
          section { scroll-margin-top: 92px; }
        }
        @media (max-width: 520px) {
          .harvestlink-nav { padding: 12px 14px; }
          .harvestlink-nav-actions { justify-content: stretch; }
          .harvestlink-nav-actions button { width: 100%; }
          .harvestlink-hero { padding: 84px 14px 32px; }
          .harvestlink-hero-title { font-size: 2rem; }
          .harvestlink-hero-copy { font-size: 0.94rem; }
          .harvestlink-section { padding: 34px 14px; }
        }
        @media (max-width: 430px) {
          .harvestlink-nav { padding: 10px 12px; gap: 10px; }
          .harvestlink-nav-links { padding: 10px 6px; }
          .harvestlink-nav-actions { width: 100%; justify-content: stretch; gap: 8px; }
          .harvestlink-nav-actions button, .harvestlink-nav-actions a { width: 100%; }
          .harvestlink-hero { padding: 72px 12px 28px; }
          .harvestlink-hero-title { font-size: 1.85rem; }
          .harvestlink-hero-copy { font-size: 0.9rem; line-height: 1.7; }
          .harvestlink-hero-image-wrap { min-height: 300px; }
          .hero-image-glow { box-shadow: 0 30px 90px rgba(15, 23, 42, 0.16); }
          .bubble { display: none; }
          .priceCard { position: static; margin-top: 18px; left: auto; right: auto; bottom: auto; }
          .harvestlink-section { padding: 30px 12px; }
        }
      ` }} />

      <nav className="harvestlink-nav" style={{ ...styles.nav, backgroundColor: themeValues.navBg, borderBottom: `1px solid ${themeValues.navBorder}`, color: themeValues.pageColor }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ ...styles.navBrand, color: themeValues.pageColor }}>HarvestLink</div>
          <button className="mobile-menu-button" type="button" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        <div className={`harvestlink-nav-links${mobileMenuOpen ? ' open' : ''}`} style={{ ...styles.navLinks, color: themeValues.pageColor }}>
          <a className="nav-link" href="#home" onClick={(event) => { event.preventDefault(); handleScrollTo('home'); }} style={{ color: themeValues.pageColor }}>Home</a>
          <a className="nav-link" href="#about" onClick={(event) => { event.preventDefault(); handleScrollTo('about'); }} style={{ color: themeValues.pageColor }}>About</a>
          <a className="nav-link" href="#features" onClick={(event) => { event.preventDefault(); handleScrollTo('features'); }} style={{ color: themeValues.pageColor }}>Features</a>
          <a className="nav-link" href="#how-it-works" onClick={(event) => { event.preventDefault(); handleScrollTo('how-it-works'); }} style={{ color: themeValues.pageColor }}>How It Works</a>
          <a className="nav-link" href="#contact" onClick={(event) => { event.preventDefault(); handleScrollTo('contact'); }} style={{ color: themeValues.pageColor }}>Contact</a>
        </div>
        <div className={`harvestlink-nav-actions ${mobileMenuOpen ? 'open' : ''}`} style={styles.navActionGroup}>
          <button type="button" onClick={toggleTheme} style={{ borderRadius: '999px', border: '1px solid rgba(148,163,184,0.24)', background: theme === 'dark' ? '#0f172a' : '#ffffff', color: theme === 'dark' ? '#e2e8f0' : '#0f172a', padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <LoginButton onClick={() => openModal('login')} />
          <RegisterButton onClick={() => openModal('register')} />
        </div>
      </nav>

      <section id="home" className="harvestlink-hero" style={styles.hero}>
        <div style={styles.heroBackground} />
        <div className="bubble bubble-1" style={bubbleStyles[0]} />
        <div className="bubble bubble-2" style={bubbleStyles[1]} />
        <div className="bubble bubble-3" style={bubbleStyles[2]} />
        <div className="bubble bubble-4" style={bubbleStyles[3]} />
        <div className="bubble bubble-5" style={bubbleStyles[4]} />
        <div style={styles.heroPanel} className="fade-up delay-1">
          <div style={{ ...styles.badge, backgroundColor: themeValues.badgeBg, color: themeValues.badgeColor }}>
            <ShieldCheck size={14} /> Field-to-market trusted by growers across Cebu
          </div>
          <h1 className="harvestlink-hero-title" style={{ ...styles.heroTitle, color: themeValues.pageColor }}>Grow a stronger agricultural market for Cebu’s farms and buyers.</h1>
          <p className="harvestlink-hero-copy" style={{ ...styles.heroCopy, color: themeValues.heroCopy }}>
            HarvestLink helps farmers, traders, and cooperatives list harvests, negotiate prices, and move fresh produce faster from field to market.
          </p>
          <div style={styles.heroCtas}>
            <button className="btn-pulse" style={{ borderRadius: '999px', padding: '14px 24px', border: 'none', backgroundColor: '#4d7c0f', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>List Your Harvest</button>
            <button style={{ borderRadius: '999px', padding: '14px 24px', border: `1px solid ${theme === 'dark' ? '#4d7c0f' : '#a3e635'}`, background: 'transparent', color: themeValues.pageColor, fontWeight: 700, cursor: 'pointer' }}>Browse Crops</button>
          </div>
        </div>
        <div className="fade-scale delay-2 hero-image-glow" style={{ ...styles.heroImageWrap, boxShadow: `0 40px 110px ${themeValues.cardShadow}` }}>
          <img src={cabbageImg} alt="Fresh cabbage heads in a field" style={styles.heroImage} />
          <div className="floating-card" style={{ ...styles.priceCard, backgroundColor: themeValues.priceBg, borderColor: themeValues.cardBorder, color: themeValues.priceText }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.76rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: theme === 'dark' ? '#94a3b8' : '#475569' }}>Farm fresh</p>
              <p style={{ margin: '8px 0 0', fontSize: '1.05rem', fontWeight: 700, color: themeValues.priceText }}>Cabbage Harvest</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: theme === 'dark' ? '#facc15' : '#15803d' }}>
                ₱55.00 <span style={{ fontSize: '0.85rem', color: theme === 'dark' ? '#94a3b8' : '#475569', fontWeight: 500 }}>/kg</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" style={{ ...styles.section, backgroundColor: themeValues.sectionBg }}>
        <div className="fade-up delay-1" style={{ ...styles.sectionHeader, textAlign: 'center', justifyItems: 'center' }}>
          <p className="fade-up delay-2" style={{ margin: '0 auto', color: theme === 'dark' ? '#34d399' : '#0f766e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.82rem' }}>About HarvestLink</p>
          <h2 className="fade-up delay-3" style={{ ...styles.sectionTitle, color: themeValues.pageColor }}>Designed to strengthen the local agricultural economy</h2>
          <p className="fade-up delay-4" style={{ ...styles.sectionText, color: themeValues.sectionText, margin: '0 auto' }}>
            HarvestLink brings field-grown produce to local buyers with transparent listings, fair pricing, and verified farm partners across Cebu.
          </p>
        </div>
      </section>

      <section id="features" style={{ ...styles.section, backgroundColor: theme === 'dark' ? '#041122' : '#f8fbff', borderTop: `1px solid ${theme === 'dark' ? '#10203b' : '#e2e8f0'}` }}>
        <div className="fade-up delay-1" style={{ ...styles.sectionHeader, textAlign: 'center', justifyItems: 'center' }}>
          <h2 className="fade-up delay-2" style={{ ...styles.sectionTitle, color: themeValues.pageColor }}>Marketplace features built for farms</h2>
          <p className="fade-up delay-3" style={{ ...styles.sectionText, color: themeValues.sectionText, margin: '0 auto' }}>
            Everything a farmer or buyer needs for fast, transparent, and trusted trade across Cebu.
          </p>
        </div>
        <div style={styles.featureGrid}>
          {featureItems.map((feature, idx) => (
            <div key={idx} className={`feature-card delay-${idx + 1}`} style={{ ...styles.featureCard, backgroundColor: themeValues.cardBg, borderColor: themeValues.cardBorder, textAlign: 'center', justifyItems: 'center' }}>
              <div style={{ ...styles.featureIcon, backgroundColor: theme === 'dark' ? '#122a10' : '#dcfce7', color: theme === 'dark' ? '#a3e635' : '#166534', borderColor: theme === 'dark' ? '#193014' : '#bbf7d0' }}>
                {feature.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: themeValues.pageColor }}>{feature.title}</h3>
              <p style={{ margin: 0, color: themeValues.sectionText, lineHeight: 1.8 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" style={{ ...styles.section, backgroundColor: themeValues.sectionBg }}>
        <div className="fade-up delay-1" style={{ ...styles.sectionHeader, textAlign: 'center', justifyItems: 'center' }}>
          <h2 className="fade-up delay-2" style={{ ...styles.sectionTitle, color: themeValues.pageColor }}>How it works</h2>
          <p className="fade-up delay-3" style={{ ...styles.sectionText, color: themeValues.sectionText, margin: '0 auto' }}>
            A simple five-step flow that helps farmers list harvests, buyers discover fresh crops, and deals move from field to market.
          </p>
        </div>
        <div style={{ display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {processSteps.map((step, idx) => (
            <div key={step.step} className={`fade-up delay-${idx + 1}`} style={{ padding: '22px', borderRadius: '24px', backgroundColor: theme === 'dark' ? '#081728' : '#ffffff', border: `1px solid ${theme === 'dark' ? '#10203b' : '#e5e7eb'}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ ...styles.stepCircle, backgroundColor: theme === 'dark' ? '#0f172a' : '#d1fae5', color: theme === 'dark' ? '#34d399' : '#166534' }}>{step.step}</div>
              <h3 style={{ ...styles.stepTitle, color: themeValues.pageColor, marginTop: '12px' }}>{step.title}</h3>
              <p style={{ ...styles.stepDesc, color: themeValues.sectionText, marginTop: '10px' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={{ ...styles.section, backgroundColor: theme === 'dark' ? '#06130d' : '#ecfdf4' }}>
        <div className="fade-up delay-1" style={{ ...styles.sectionHeader, marginBottom: '40px', textAlign: 'center', justifyItems: 'center' }}>
          <h2 className="fade-up delay-2" style={{ ...styles.sectionTitle, color: themeValues.pageColor }}>Ready to grow together?</h2>
          <p className="fade-up delay-3" style={{ ...styles.sectionText, color: themeValues.sectionText, margin: '0 auto' }}>
            Reach out and we’ll help you start trading smarter today.
          </p>
        </div>
        <div className="harvestlink-contact-grid" style={styles.contactGrid}>
          <div className="fade-up delay-4">
            <div className="fade-up delay-5" style={{ ...styles.contactCard, backgroundColor: theme === 'dark' ? '#07111f' : '#ffffff', marginBottom: '16px' }}>
              <MapPin style={{ color: '#38bdf8' }} size={18} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                <p style={{ ...styles.contactInfoTitle, color: themeValues.pageColor, margin: 0 }}>Office Location</p>
                <p style={{ ...styles.contactInfoText, color: themeValues.sectionText, margin: '8px 0 0' }}>123 Agriculture Way, IT Park, Cebu City</p>
              </div>
            </div>
            <div className="fade-up delay-6" style={{ ...styles.contactCard, backgroundColor: theme === 'dark' ? '#07111f' : '#ffffff', marginBottom: '16px' }}>
              <Mail style={{ color: '#34d399' }} size={18} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                <p style={{ ...styles.contactInfoTitle, color: themeValues.pageColor, margin: 0 }}>Email Us</p>
                <p style={{ ...styles.contactInfoText, color: themeValues.sectionText, margin: '8px 0 0' }}>support@harvestlink.ph</p>
              </div>
            </div>
            <div className="fade-up delay-7" style={{ ...styles.contactCard, backgroundColor: theme === 'dark' ? '#07111f' : '#ffffff' }}>
              <Phone style={{ color: '#f97316' }} size={18} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                <p style={{ ...styles.contactInfoTitle, color: themeValues.pageColor, margin: 0 }}>Call Us</p>
                <p style={{ ...styles.contactInfoText, color: themeValues.sectionText, margin: '8px 0 0' }}>+63 32 123 4567</p>
              </div>
            </div>
          </div>
          <div className="fade-up delay-5" style={{ ...styles.contactForm, backgroundColor: theme === 'dark' ? '#07111f' : '#ffffff' }}>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: '18px' }}>
              <div>
                <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Full Name</label>
                <input type="text" style={{ ...styles.inputField, backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }} />
              </div>
              <div>
                <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Email Address</label>
                <input type="email" style={{ ...styles.inputField, backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }} />
              </div>
              <div>
                <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Message</label>
                <textarea rows="4" style={{ ...styles.inputField, minHeight: '110px', backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }} />
              </div>
              <button type="submit" className="submit-button" style={{ ...styles.submitButton, background: '#166534', color: '#ffffff' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <div className="animated-footer-border" />
      <footer style={{ ...styles.footer, backgroundColor: themeValues.footerBg, color: themeValues.footerText }}>
        <div className="fade-up delay-2" style={styles.footerInner}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, color: theme === 'dark' ? '#ffffff' : '#0f172a' }}>HarvestLink</p>
            <p style={{ margin: '8px 0 0', color: themeValues.footerText, fontSize: '0.92rem' }}>© 2026 HarvestLink Cebu. Connecting farms, buyers, and harvest markets.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <a href="#" className="footer-link" style={{ color: themeValues.footerText }}>Privacy Policy</a>
            <a href="#" className="footer-link" style={{ color: themeValues.footerText }}>Terms of Service</a>
            <a href="#" className="footer-link" style={{ color: themeValues.footerText }}>DTI Regulations</a>
            <a href="#" className="footer-link" style={{ color: themeValues.footerText }}>Contact Support</a>
          </div>
        </div>
      </footer>

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal} style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.64)', padding: '20px', zIndex: 120, backdropFilter: 'blur(4px)' }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '28px', padding: '28px', backgroundColor: themeValues.cardBg, border: `1px solid ${themeValues.cardBorder}`, boxShadow: '0 40px 120px rgba(15, 23, 42, 0.17)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: themeValues.modalSubtitle, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>← Back</button>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: themeValues.pageColor, cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.7rem', fontWeight: 800, color: themeValues.modalTitle }}>{authMode === 'login' ? 'Welcome back' : 'Create account'}</p>
              <p style={{ margin: '10px 0 0', color: themeValues.modalSubtitle }}>{authMode === 'login' ? 'Sign in to your HarvestLink account.' : 'Join HarvestLink and start trading.'}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
              <button className={`modal-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => setAuthMode('login')}>Login</button>
              <button className={`modal-tab ${authMode === 'register' ? 'active' : ''}`} onClick={() => setAuthMode('register')}>Register</button>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: '16px' }}>
              {authMode === 'register' && (
                <>
                  <div>
                    <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Role</label>
                    <select value={authForm.role} onChange={(e) => handleAuthChange('role', e.target.value)} style={{ ...styles.inputField, backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }}>
                      <option value="farmer">I am a Farmer</option>
                      <option value="buyer">I am a Buyer</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Full Name</label>
                    <input type="text" value={authForm.fullName} onChange={(e) => handleAuthChange('fullName', e.target.value)} style={{ ...styles.inputField, backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }} />
                  </div>
                  <div>
                    <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Municipality (Cebu)</label>
                    <select value={authForm.municipality} onChange={(e) => handleAuthChange('municipality', e.target.value)} style={{ ...styles.inputField, backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }}>
                      <option value="">Select Municipality</option>
                      <option value="Cebu City">Cebu City</option>
                      <option value="Mandaue">Mandaue</option>
                      <option value="Lapu-Lapu">Lapu-Lapu</option>
                      <option value="Danao">Danao</option>
                      <option value="Toledo">Toledo</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Contact Number</label>
                    <input
                      type="tel"
                      placeholder="09XXXXXXXXX"
                      pattern="(\+63|0)9[0-9]{9}"
                      value={authForm.contactNumber}
                      onChange={(e) => handleAuthChange('contactNumber', e.target.value)}
                      style={{ ...styles.inputField, backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }}
                    />
                  </div>
                  <div>
                    <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Upload ID/Cert</label>
                    <input type="file" onChange={(e) => handleAuthChange('document', e.target.files[0])} style={{ ...styles.inputField, padding: '10px' }} />
                  </div>
                </>
              )}
              
              <div>
                <label style={{ ...styles.inputLabel, color: themeValues.pageColor }}>Email</label>
                <input type="email" value={authForm.email} onChange={(e) => handleAuthChange('email', e.target.value)} style={{ ...styles.inputField, backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }} />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ ...styles.inputLabel, color: themeValues.pageColor, marginBottom: 0 }}>Password</label>
                  {authMode === 'login' && (
                    <button type="button" onClick={() => window.alert('Redirecting to reset password...')} style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <input type="password" value={authForm.password} onChange={(e) => handleAuthChange('password', e.target.value)} style={{ ...styles.inputField, marginTop: '8px', backgroundColor: theme === 'dark' ? '#041026' : '#f8fafc', color: themeValues.pageColor }} />
              </div>

              {authSuccess && (
                <p style={{ color: '#22c55e', margin: 0, fontSize: '0.95rem' }}>{authSuccess}</p>
              )}
              {authError && (
                <p style={{ color: '#f87171', margin: 0, fontSize: '0.95rem' }}>{authError}</p>
              )}
              
              <button type="submit" style={{ ...styles.submitButton, backgroundColor: '#16a34a', color: '#ffffff' }}>
                {authMode === 'login' ? 'Sign In' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}