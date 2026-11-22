export default function Spinner({ label = 'Loading', block = false }) {
  const Tag = block ? 'div' : 'span';
  return (
    <Tag className={block ? 'spinner-block' : 'spinner-inline'} role="status">
      <span className="spinner" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </Tag>
  );
}
