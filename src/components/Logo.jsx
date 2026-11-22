import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="CineFlix home">
      <svg className="logo__mark" viewBox="0 0 64 64" width="30" height="30" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="currentColor" />
        <circle cx="32" cy="32" r="17" fill="none" stroke="#fff" strokeWidth="5" />
        <path d="M28 24.5v15l12-7.5z" fill="#fff" />
      </svg>
      <span className="logo__word">CineFlix</span>
    </Link>
  );
}
