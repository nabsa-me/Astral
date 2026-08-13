export default function VacationTOC({ days, onNavigate, open, onToggle }) {
  return (
    <nav
      className={`vacation-toc ${open ? 'vacation-toc-open' : 'vacation-toc-collapsed'}`}
      aria-label="Índice de la guía de vacaciones"
    >
      <button
        type="button"
        className="guide-toc-toggle"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? 'Ocultar índice' : 'Mostrar índice'}
        title={open ? 'Ocultar índice' : 'Mostrar índice'}
      >
        <span className="guide-toc-toggle-icon" aria-hidden="true">
          {open ? '«' : '»'}
        </span>
        {open && <span className="guide-toc-toggle-label">Índice</span>}
      </button>
      {open && (
        <ol className="guide-toc-list">
          {days.map((day) => (
            <li key={day.id}>
              <a
                href={`#${day.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(day.id);
                }}
              >
                {day.title}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
