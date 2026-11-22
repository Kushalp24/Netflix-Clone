import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <p className="footer__name">CineFlix</p>
          <p className="footer__text">
            Discover what to watch next, check the trailer and keep a list of movies you want to see.
          </p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/watchlist">My List</Link>
          <Link to="/search">Search</Link>
        </nav>
      </div>

      <p className="footer__legal">
        Movie data and images are provided by TMDB. This product uses the TMDB API but is not endorsed or
        certified by TMDB.
      </p>
    </footer>
  );
}
