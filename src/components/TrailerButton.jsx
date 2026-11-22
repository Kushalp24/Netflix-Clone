import { useState } from 'react';
import { Play } from 'lucide-react';
import { getTrailerKey, youtubeWatchUrl } from '../lib/tmdb';

const NOTES = {
  missing: 'No trailer is available for this movie.',
  error: 'The trailer could not be loaded. Try again.',
};

export default function TrailerButton({ movieId, className = 'btn btn--ghost', label = 'Watch trailer' }) {
  const [status, setStatus] = useState('idle');

  async function openTrailer() {
    setStatus('loading');

    // Open the tab straight away so the browser treats it as a direct click.
    const tab = window.open('about:blank', '_blank');
    if (tab) tab.opener = null;

    try {
      const key = await getTrailerKey(movieId);
      if (!key) {
        if (tab) tab.close();
        setStatus('missing');
        return;
      }

      const url = youtubeWatchUrl(key);
      if (tab) {
        tab.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      setStatus('idle');
    } catch {
      if (tab) tab.close();
      setStatus('error');
    }
  }

  return (
    <span className="trailer">
      <button type="button" className={className} onClick={openTrailer} disabled={status === 'loading'}>
        <Play size={18} aria-hidden="true" />
        {status === 'loading' ? 'Finding trailer' : label}
      </button>
      <span className="trailer__note" role="status">
        {NOTES[status] || ''}
      </span>
    </span>
  );
}
