import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../lib/authErrors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, password, confirm }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Enter your name (at least 2 characters).';
  if (!email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (password.length < 6) errors.password = 'Use at least 6 characters.';
  if (confirm !== password) errors.confirm = 'The passwords do not match.';
  return errors;
}

export default function Signup() {
  const { user, loading, signup } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/';

  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Create account - CineFlix';
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
      await signup(values.name.trim(), values.email.trim(), values.password);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
      setSubmitting(false);
    }
  }

  const fields = [
    { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
    { name: 'confirm', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
  ];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Save movies to your own list and keep it on every device."
      footer={
        <p>
          Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
        </p>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        {fields.map((field) => (
          <div className="field" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              onChange={handleChange}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
            {errors[field.name] ? (
              <p className="field__error" id={`${field.name}-error`}>
                {errors[field.name]}
              </p>
            ) : null}
          </div>
        ))}

        {formError ? (
          <p className="form__error" role="alert">
            {formError}
          </p>
        ) : null}

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting || loading}>
          {submitting ? <Spinner label="Creating account" /> : null}
          {submitting ? 'Creating account' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
