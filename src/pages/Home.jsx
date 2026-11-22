import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import Spinner from '../components/Spinner';
import StateMessage from '../components/StateMessage';
import { getPopular, getTopRated, getTrending, getUpcoming } from '../lib/tmdb';

export default function Home() {
  const [hero, setHero] = useState({ status: 'loading', movie: null, error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setHero({ status: 'loading', movie: null, error: '' });

    getTrending()
      .then((list) => {
        if (!active) return;
        const candidates = list.filter((movie) => movie.backdrop_path && movie.overview).slice(0, 6);
        if (!candidates.length) {
          setHero({ status: 'error', movie: null, error: 'No featured movies are available right now.' });
          return;
        }
        const movie = candidates[Math.floor(Math.random() * candidates.length)];
        setHero({ status: 'ready', movie, error: '' });
      })
      .catch((error) => {
        if (active) setHero({ status: 'error', movie: null, error: error.message });
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  useEffect(() => {
    document.title = 'CineFlix';
  }, []);

  return (
    <div className="home">
      {hero.status === 'ready' ? <Hero movie={hero.movie} /> : null}

      {hero.status === 'loading' ? (
        <div className="hero hero--loading">
          <Spinner block label="Loading featured movie" />
        </div>
      ) : null}

      {hero.status === 'error' ? (
        <div className="page">
          <StateMessage
            variant="error"
            title="We could not load the featured movie"
            message={hero.error}
            onRetry={() => setAttempt((n) => n + 1)}
          />
        </div>
      ) : null}

      <div className={`rows${hero.status === 'ready' ? ' rows--overlap' : ''}`}>
        <MovieRow title="Trending this week" fetcher={getTrending} ranked />
        <MovieRow title="Popular movies" fetcher={getPopular} />
        <MovieRow title="Top rated movies" fetcher={getTopRated} />
        <MovieRow title="Upcoming movies" fetcher={getUpcoming} />
      </div>
    </div>
  );
}
