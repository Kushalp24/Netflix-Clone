export default function Toast({ message }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {message ? <p className="toast">{message}</p> : null}
    </div>
  );
}
