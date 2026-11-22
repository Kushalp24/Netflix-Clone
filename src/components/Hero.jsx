import { Link } from 'react-router-dom';
import { Info, Star } from 'lucide-react';
import { backdropUrl } from '../lib/tmdb';
import { formatRating, getYear } from '../lib/format';
import TrailerButton from './TrailerButton';

export default function Hero({ movie }) {
  return (
    <header className="hero">
      <img
        className="hero__image"
        src={backdropUrl(movie.backdrop_path, 'w1280')}
        srcSet={`${backdropUrl(movie.backdrop_path, 'w780')} 780w, ${backdropUrl(
          movie.backdrop_path,
          'w1280'
        )} 1280w`}
        sizes="100vw"
        alt=""
      />
      <div className="hero__shade" />

      <div className="hero__content">
        <h1 className="hero__title">{movie.title}</h1>

        <div className="hero__meta">
          <span className="pill">
            <Star size={14} fill="currentColor" aria-hidden="true" />
            {formatRating(movie.vote_average)}
          </span>
          <span className="hero__year">{getYear(movie.release_date)}</span>
        </div>

        <p className="hero__overview">{movie.overview}</p>

        <div className="hero__actions">
          <Link to={`/movie/${movie.id}`} className="btn btn--primary">
            <Info size={18} aria-hidden="true" />
            Explore movie
          </Link>
          <TrailerButton movieId={movie.id} />
        </div>
      </div>
    </header>
  );
}
