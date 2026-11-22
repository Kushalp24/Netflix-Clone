import { useEffect, useState } from 'react';
import { getTrending, posterUrl } from '../lib/tmdb';

// Shared frame for the sign in and sign up pages, with a wall of current posters behind the form.
export default function AuthLayout({ title, subtitle, children, footer }) {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    let active = true;
    getTrending()
      .then((list) => {
        if (active) setPosters(list.filter((movie) => movie.poster_path).slice(0, 18));
      })
      .catch(() => {
        // The poster wall is decorative, so a failed request is ignored.
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="auth">
      <div className="auth__wall" aria-hidden="true">
        {posters.map((movie) => (
          <img key={movie.id} src={posterUrl(movie.poster_path, 'w185')} alt="" loading="lazy" />
        ))}
      </div>

      <div className="auth__panel">
        <h1 className="auth__title">{title}</h1>
        <p className="auth__subtitle">{subtitle}</p>
        {children}
        <div className="auth__footer">{footer}</div>
      </div>
    </div>
  );
}
