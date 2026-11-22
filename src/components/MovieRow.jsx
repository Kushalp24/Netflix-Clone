import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const PLACEHOLDERS = Array.from({ length: 8 });

// `fetcher` must be a stable function (for example one exported from lib/tmdb.js).
export default function MovieRow({ title, fetcher, ranked = false }) {
  const [state, setState] = useState({ status: 'loading', movies: [], error: '' });
  const [attempt, setAttempt] = useState(0);
  const track = useRef(null);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', movies: [], error: '' });

    fetcher()
      .then((list) => {
        if (!active) return;
        const movies = list.filter((movie) => movie.poster_path).slice(0, ranked ? 10 : 20);
        setState({ status: 'ready', movies, error: '' });
      })
      .catch((error) => {
        if (active) setState({ status: 'error', movies: [], error: error.message });
      });

    return () => {
      active = false;
    };
  }, [fetcher, ranked, attempt]);

  function scroll(direction) {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  }

  const headingId = `row-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <section className={`row${ranked ? ' row--ranked' : ''}`} aria-labelledby={headingId}>
      <h2 className="row__title" id={headingId}>
        {title}
      </h2>

      {state.status === 'error' ? (
        <div className="row__error" role="alert">
          <p>{state.error}</p>
          <button type="button" className="btn btn--ghost" onClick={() => setAttempt((n) => n + 1)}>
            Try again
          </button>
        </div>
      ) : (
        <div className="row__frame">
          <button
            type="button"
            className="row__arrow row__arrow--prev"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </button>

          <div className="row__track" ref={track}>
            {state.status === 'loading'
              ? PLACEHOLDERS.map((_, index) => <div className="card card--skeleton" key={index} aria-hidden="true" />)
              : state.movies.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} rank={ranked ? index + 1 : undefined} />
                ))}
          </div>

          <button
            type="button"
            className="row__arrow row__arrow--next"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight size={24} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
