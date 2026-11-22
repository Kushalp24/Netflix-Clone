import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, ChevronDown, LogOut, Search, X } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { getInitial } from '../lib/format';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep the search box in step with the address bar.
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    if (location.pathname === '/search') {
      setTerm(q);
      setSearchOpen(true);
    } else {
      setTerm('');
      setSearchOpen(false);
    }
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointer = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen && inputRef.current && location.pathname !== '/search') inputRef.current.focus();
  }, [searchOpen, location.pathname]);

  function submitSearch(event) {
    event.preventDefault();
    const value = term.trim();
    if (value) navigate(`/search?q=${encodeURIComponent(value)}`);
  }

  function closeSearch() {
    setTerm('');
    setSearchOpen(false);
    if (location.pathname === '/search') navigate('/search');
  }

  async function handleLogout() {
    setMenuOpen(false);
    try {
      await logout();
      navigate('/');
    } catch {
      // The session stays active if sign-out fails; the menu closes and the user can try again.
    }
  }

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="header__inner">
        <Logo />

        <nav className="header__nav" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/watchlist">My List</NavLink>
        </nav>

        <div className="header__spacer" />

        <form className={`search${searchOpen ? ' is-open' : ''}`} onSubmit={submitSearch} role="search">
          {searchOpen ? (
            <>
              <Search size={18} aria-hidden="true" className="search__icon" />
              <input
                ref={inputRef}
                type="search"
                className="search__input"
                placeholder="Search movies"
                aria-label="Search movies"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                onKeyDown={(event) => event.key === 'Escape' && closeSearch()}
              />
              <button type="button" className="icon-btn" onClick={closeSearch} aria-label="Close search">
                <X size={18} aria-hidden="true" />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={20} aria-hidden="true" />
            </button>
          )}
        </form>

        {user ? (
          <div className="account" ref={menuRef}>
            <button
              type="button"
              className="account__trigger"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <span className="avatar" aria-hidden="true">
                {getInitial(user.displayName)}
              </span>
              <span className="account__name">{user.displayName}</span>
              <ChevronDown size={16} aria-hidden="true" />
            </button>

            {menuOpen ? (
              <div className="account__menu" role="menu">
                <p className="account__signed">
                  Signed in as
                  <strong>{user.email}</strong>
                </p>
                <NavLink to="/watchlist" role="menuitem" className="account__item">
                  <Bookmark size={16} aria-hidden="true" />
                  My List
                </NavLink>
                <button type="button" role="menuitem" className="account__item" onClick={handleLogout}>
                  <LogOut size={16} aria-hidden="true" />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="header__auth">
            <NavLink to="/login" className="btn btn--small btn--ghost">
              Sign in
            </NavLink>
            <NavLink to="/signup" className="btn btn--small btn--primary">
              Sign up
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
