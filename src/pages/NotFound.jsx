import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import StateMessage from '../components/StateMessage';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found - CineFlix';
  }, []);

  return (
    <div className="page">
      <StateMessage
        title="This page does not exist"
        message="The link may be broken or the page may have moved."
      >
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </StateMessage>
    </div>
  );
}
