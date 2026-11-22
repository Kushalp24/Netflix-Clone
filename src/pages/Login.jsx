import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../lib/authErrors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Enter your password.';
  return errors;
}

export default function Login() {
  const { user, loading, login } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/';

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Sign in - CineFlix';
  }, []);

  if (!loading && user) return <Navigate to={redirectTo} replace />;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    setFormError('');
    try {
      await login(values.email.trim(), values.password);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Pick up where you left off and open your list."
      footer={
        <p>
          New to CineFlix? <Link to="/signup" state={location.state}>Create an account</Link>
        </p>
      }
    >
      {location.state?.message ? <p className="notice">{location.state.message}</p> : null}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email ? (
            <p className="field__error" id="email-error">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password ? (
            <p className="field__error" id="password-error">
              {errors.password}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p className="form__error" role="alert">
            {formError}
          </p>
        ) : null}

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting || loading}>
          {submitting ? <Spinner label="Signing in" /> : null}
          {submitting ? 'Signing in' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
