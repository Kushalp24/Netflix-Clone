import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import Toast from '../components/Toast';

const WatchlistContext = createContext(null);

// Only the fields needed to draw a movie card are stored.
function toRecord(movie) {
  return {
    id: movie.id,
    title: movie.title || 'Untitled',
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    release_date: movie.release_date || '',
    vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
    addedAt: Date.now(),
  };
}

export function WatchlistProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const uid = user?.uid;

  useEffect(() => {
    if (!uid || !db) {
      setItems([]);
      setLoading(false);
      setError('');
      return undefined;
    }

    setLoading(true);
    const listQuery = query(collection(db, 'users', uid, 'watchlist'), orderBy('addedAt', 'desc'));

    return onSnapshot(
      listQuery,
      (snapshot) => {
        setItems(snapshot.docs.map((entry) => entry.data()));
        setError('');
        setLoading(false);
      },
      () => {
        setError('We could not load your list. Check your connection and Firestore rules, then refresh.');
        setLoading(false);
      }
    );
  }, [uid]);

  const savedIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);
  const isSaved = useCallback((id) => savedIds.has(Number(id)), [savedIds]);

  const toggle = useCallback(
    async (movie) => {
      if (!uid || !db) {
        navigate('/login', {
          state: { from: location, message: 'Sign in to save movies to My List.' },
        });
        return;
      }

      const ref = doc(db, 'users', uid, 'watchlist', String(movie.id));
      const title = movie.title || 'Movie';

      try {
        if (savedIds.has(Number(movie.id))) {
          await deleteDoc(ref);
          notify(`${title} was removed from My List.`);
        } else {
          await setDoc(ref, toRecord(movie));
          notify(`${title} was added to My List.`);
        }
      } catch {
        notify('We could not update My List. Please try again.');
      }
    },
    [uid, savedIds, navigate, location, notify]
  );

  const value = useMemo(
    () => ({ items, loading, error, isSaved, toggle }),
    [items, loading, error, isSaved, toggle]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
      <Toast message={toast} />
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used inside a WatchlistProvider.');
  return context;
}
