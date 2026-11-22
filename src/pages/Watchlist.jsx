import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import Spinner from '../components/Spinner';
import StateMessage from '../components/StateMessage';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';

export default function Watchlist() {
  const { user } = useAuth();
  const { items, loading, error } = useWatchlist();

  useEffect(() => {
    document.title = 'My List - CineFlix';
  }, []);

  return (
    <div className="page">
      <h1 className="page__title">My List</h1>
      <p className="page__count">
        {user ? `Saved by ${user.displayName}` : ''}
        {!loading && !error && items.length ? ` - ${items.length} ${items.length === 1 ? 'movie' : 'movies'}` : ''}
      </p>

      {loading ? <Spinner block label="Loading your list" /> : null}

      {!loading && error ? <StateMessage variant="error" title="Your list did not load" message={error} /> : null}

      {!loading && !error && items.length === 0 ? (
        <StateMessage
          title="Your list is empty"
          message="Use the plus button on any movie to save it here."
        >
          <Link to="/" className="btn btn--primary">
            Browse movies
          </Link>
        </StateMessage>
      ) : null}

      {!loading && !error && items.length > 0 ? <MovieGrid movies={items} removable /> : null}
    </div>
  );
}
