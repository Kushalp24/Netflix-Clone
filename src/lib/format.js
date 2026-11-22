export function getYear(dateString) {
  return dateString ? dateString.slice(0, 4) : 'TBA';
}

export function formatRating(value) {
  return typeof value === 'number' && value > 0 ? value.toFixed(1) : 'NR';
}

export function formatRuntime(minutes) {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}m`;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDate(dateString) {
  if (!dateString) return 'To be announced';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'To be announced';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getInitial(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}
