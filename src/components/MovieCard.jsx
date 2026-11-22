import { Link } from 'react-router-dom';
import { Check, Film, Plus, Star, X } from 'lucide-react';
import { posterUrl } from '../lib/tmdb';
import { formatRating, getYear } from '../lib/format';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ movie, rank, removable = false }) {
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(movie.id);
  const poster = posterUrl(movie.poster_path);
  const year = getYear(movie.release_date);
  const target = `/movie/${movie.id}`;

  let saveLabel = saved ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`;
  let SaveIcon = saved ? Check : Plus;
  if (removable) {
    saveLabel = `Remove ${movie.title} from My List`;
    SaveIcon = X;
  }

  return (
    <article className={`card${rank ? ' card--ranked' : ''}`}>
      {rank ? (
        <span className="card__rank" aria-hidden="true">
          {rank}
        </span>
      ) : null}

      <div className="card__body">
        <div className="card__media">
          <Link to={target} className="card__poster" tabIndex={-1} aria-hidden="true">
            {poster ? (
              <img src={poster} alt="" loading="lazy" width="342" height="513" />
            ) : (
              <span className="card__fallback">
                <Film size={32} />
              </span>
            )}
          </Link>
          <button
            type="button"
            className={`card__save${saved && !removable ? ' is-saved' : ''}`}
            onClick={() => toggle(movie)}
            aria-label={saveLabel}
            aria-pressed={removable ? undefined : saved}
            title={saveLabel}
          >
            <SaveIcon size={18} aria-hidden="true" />
          </button>
        </div>

        <Link to={target} className="card__info">
          <h3 className="card__title">{movie.title}</h3>
          <p className="card__meta">
            <span className="card__rating">
              <Star size={13} fill="currentColor" aria-hidden="true" />
              {formatRating(movie.vote_average)}
            </span>
            <span>{year}</span>
          </p>
        </Link>
      </div>
    </article>
  );
}
