import MovieCard from './MovieCard';

export default function MovieGrid({ movies, removable = false }) {
  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} removable={removable} />
      ))}
    </div>
  );
}
