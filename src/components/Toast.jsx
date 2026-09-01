export default function Toast({ message, isVisible }) {
  return (
    <aside
      className={`toast-box ${isVisible ? 'show' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span>{message}</span>
    </aside>
  );
}
