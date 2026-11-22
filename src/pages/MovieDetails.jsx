import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Clock, Plus, Star, User } from 'lucide-react';
import Spinner from '../components/Spinner';
import StateMessage from '../components/StateMessage';
import TrailerButton from '../components/TrailerButton';
import { useWatchlist } from '../context/WatchlistContext';
import { backdropUrl, getMovieDetails, posterUrl, profileUrl } from '../lib/tmdb';
import { formatDate, formatRating, formatRuntime, getYear } from '../lib/format';

export default function MovieDetails() {
  const { id } = useParams();
  const { isSaved, toggle } = useWatchlist();
  const [state, setState] = useState({ status: 'loading', movie: null, error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', movie: null, error: '' });

    if (!/^\d+$/.test(id)) {
      setState({ status: 'error', movie: null, error: 'That movie link is not valid.' });
      return undefined;
    }

    getMovieDetails(id)
      .then((movie) => {
        if (!active) return;
        document.title = `${movie.title} - CineFlix`;
        setState({ status: 'ready', movie, error: '' });
      })
      .catch((error) => {
        if (active) setState({ status: 'error', movie: null, error: error.message });
      });

    return () => {
      active = false;
    };
  }, [id, attempt]);

  if (state.status === 'loading') {
    return (
      <div className="page page--center">
        <Spinner block label="Loading movie details" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="page">
        <StateMessage
          variant="error"
          title="We could not load this movie"
          message={state.error}
          onRetry={() => setAttempt((n) => n + 1)}
        >
          <Link to="/" className="btn btn--primary">
            Back to home
          </Link>
        </StateMessage>
      </div>
    );
  }

  const { movie } = state;
  const saved = isSaved(movie.id);
  const poster = posterUrl(movie.poster_path, 'w500');
  const backdrop = backdropUrl(movie.backdrop_path, 'w1280');
  const runtime = formatRuntime(movie.runtime);
  const cast = (movie.credits?.cast || []).slice(0, 12);
  const director = (movie.credits?.crew || []).find((person) => person.job === 'Director');

  return (
    <article className="details">
      <div className="details__backdrop">
        {backdrop ? <img src={backdrop} alt="" /> : null}
        <div className="details__shade" />
      </div>

      <div className="details__inner">
        <div className="details__poster">
          {poster ? <img src={poster} alt={`${movie.title} poster`} /> : <div className="details__no-poster">No poster</div>}
        </div>

        <div className="details__main">
          <h1 className="details__title">{movie.title}</h1>
          {movie.tagline ? <p className="details__tagline">{movie.tagline}</p> : null}

          <div className="details__facts">
            <span className="pill">
              <Star size={14} fill="currentColor" aria-hidden="true" />
              {formatRating(movie.vote_average)}
            </span>
            {movie.vote_count ? <span>{movie.vote_count.toLocaleString()} votes</span> : null}
            <span>{getYear(movie.release_date)}</span>
            {runtime ? (
              <span className="details__runtime">
                <Clock size={15} aria-hidden="true" />
                {runtime}
              </span>
            ) : null}
          </div>

          {movie.genres?.length ? (
            <ul className="chips" aria-label="Genres">
              {movie.genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          ) : null}

          <h2 className="details__heading">Overview</h2>
          <p className="details__overview">{movie.overview || 'No overview is available for this movie yet.'}</p>

          <dl className="details__list">
            <div>
              <dt>Release date</dt>
              <dd>{formatDate(movie.release_date)}</dd>
            </div>
            {director ? (
              <div>
                <dt>Director</dt>
                <dd>{director.name}</dd>
              </div>
            ) : null}
          </dl>

          <div className="details__actions">
            <TrailerButton movieId={movie.id} className="btn btn--primary" />
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => toggle(movie)}
              aria-pressed={saved}
            >
              {saved ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
              {saved ? 'Remove from My List' : 'Add to My List'}
            </button>
          </div>
        </div>
      </div>

      <section className="details__cast" aria-labelledby="cast-heading">
        <h2 id="cast-heading" className="details__heading">
          Cast
        </h2>

        {cast.length ? (
          <ul className="cast">
            {cast.map((person) => {
              const photo = profileUrl(person.profile_path);
              return (
                <li key={person.credit_id || person.id} className="cast__member">
                  <div className="cast__photo">
                    {photo ? (
                      <img src={photo} alt="" loading="lazy" />
                    ) : (
                      <span className="cast__empty">
                        <User size={28} aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <p className="cast__name">{person.name}</p>
                  {person.character ? <p className="cast__role">{person.character}</p> : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted">Cast information is not available for this movie.</p>
        )}
      </section>
    </article>
  );
}
