import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useState } from 'react';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { ROLE_DASHBOARDS } from '../../utils/constants';
import { hasErrors, validateAuthForm } from '../../utils/validators';
import { useAuth } from './AuthContext';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'farmer',
};

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, register } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  if (currentUser) return <Navigate to={ROLE_DASHBOARDS[currentUser.role]} replace />;

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined, form: undefined }));
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAuthForm(form, mode);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    try {
      const user = isRegister ? register(form) : login(form.email, form.password);
      const fallback = ROLE_DASHBOARDS[user.role];
      navigate(location.state?.from || fallback, { replace: true });
    } catch (error) {
      setErrors({ form: error.message });
      setMessage('');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <Link to="/" className="brand auth-brand">
          <span className="brand-mark">
            <Sprout size={22} />
          </span>
          <span>
            <strong>HarvestLink</strong>
            <small>Cebu farm-to-market</small>
          </span>
        </Link>
        <div>
          <p className="eyebrow">Prototype access</p>
          <h1>{isRegister ? 'Create your trading account.' : 'Welcome back to HarvestLink.'}</h1>
          <p>
            Farmers can manage produce and requests. Buyers can browse harvests, request products,
            and track confirmation status.
          </p>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card-header">
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
          <p>{isRegister ? 'Choose your role and start trading locally.' : 'Use your account or the admin shortcut.'}</p>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          {errors.form ? <div className="form-alert error">{errors.form}</div> : null}
          {message ? <div className="form-alert success">{message}</div> : null}

          {isRegister ? (
            <>
              <FormField label="Account type" name="role" error={errors.role}>
                <select id="role" value={form.role} onChange={(event) => updateField('role', event.target.value)}>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                </select>
              </FormField>
              <FormField label="Full name" name="name" error={errors.name}>
                <input
                  id="name"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Juan Dela Cruz"
                />
              </FormField>
            </>
          ) : null}

          <FormField label="Email address" name="email" error={errors.email} helper={!isRegister ? 'Admin: admin@harvestlink.com / admin' : ''}>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="name@example.com"
            />
          </FormField>
          <FormField label="Password" name="password" error={errors.password}>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Enter password"
            />
          </FormField>

          <Button type="submit" className="full-width">
            {isRegister ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to HarvestLink?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
        </p>
      </section>
    </main>
  );
}
