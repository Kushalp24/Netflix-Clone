import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import Spinner from '../components/Spinner';
import StateMessage from '../components/StateMessage';
import { searchMovies } from '../lib/tmdb';

const INITIAL = { status: 'idle', results: [], page: 1, totalPages: 0, totalResults: 0, error: '' };

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') || '').trim();

  const [draft, setDraft] = useState(query);
  const [state, setState] = useState(INITIAL);
  const [loadingMore, setLoadingMore] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  useEffect(() => {
    document.title = query ? `${query} - Search - CineFlix` : 'Search - CineFlix';
  }, [query]);

  useEffect(() => {
    if (!query) {
      setState(INITIAL);
      return undefined;
    }

    let active = true;
    setState({ ...INITIAL, status: 'loading' });

    searchMovies(query, 1)
      .then((data) => {
        if (!active) return;
        setState({
          status: 'ready',
          results: data.results,
          page: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results,
          error: '',
        });
      })
      .catch((error) => {
        if (active) setState({ ...INITIAL, status: 'error', error: error.message });
      });

    return () => {
      active = false;
    };
  }, [query, attempt]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const data = await searchMovies(query, state.page + 1);
      setState((current) => ({
        ...current,
        results: [...current.results, ...data.results.filter((m) => !current.results.some((r) => r.id === m.id))],
        page: data.page,
        totalPages: data.total_pages,
      }));
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    } finally {
      setLoadingMore(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const value = draft.trim();
    if (value) setParams({ q: value });
  }

  return (
    <div className="page">
      <h1 className="page__title">Search</h1>

      <form className="searchbar" onSubmit={handleSubmit} role="search">
        <SearchIcon size={20} aria-hidden="true" />
        <input
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search by movie title"
          aria-label="Search by movie title"
        />
        <button type="submit" className="btn btn--primary btn--small">
          Search
        </button>
      </form>

      {state.status === 'idle' ? (
        <StateMessage
          title="Find a movie"
          message="Type a title above to see matching movies, ratings and release years."
        />
      ) : null}

      {state.status === 'loading' ? <Spinner block label="Searching" /> : null}

      {state.status === 'error' ? (
        <StateMessage
          variant="error"
          title="Search did not work"
          message={state.error}
          onRetry={() => setAttempt((n) => n + 1)}
        />
      ) : null}

      {state.status === 'ready' && state.results.length === 0 ? (
        <StateMessage
          title={`No results for "${query}"`}
          message="Check the spelling or try a different title."
        />
      ) : null}

      {state.status === 'ready' && state.results.length > 0 ? (
        <>
          <p className="page__count" aria-live="polite">
            {state.totalResults.toLocaleString()} {state.totalResults === 1 ? 'result' : 'results'} for "{query}"
          </p>
          <MovieGrid movies={state.results} />

          {state.error ? <p className="form__error">{state.error}</p> : null}

          {state.page < state.totalPages ? (
            <div className="page__more">
              <button type="button" className="btn btn--ghost" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading' : 'Show more results'}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
