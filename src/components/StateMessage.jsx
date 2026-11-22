import { AlertTriangle, Film } from 'lucide-react';

// Shared empty and error states. Pass `onRetry` to show a retry button.
export default function StateMessage({ variant = 'empty', title, message, onRetry, children }) {
  const Icon = variant === 'error' ? AlertTriangle : Film;

  return (
    <div className={`state state--${variant}`} role={variant === 'error' ? 'alert' : undefined}>
      <Icon size={30} aria-hidden="true" />
      <h2 className="state__title">{title}</h2>
      {message ? <p className="state__text">{message}</p> : null}
      {onRetry ? (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          Try again
        </button>
      ) : null}
      {children}
    </div>
  );
}
