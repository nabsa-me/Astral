export default function GuideTOC({ sections, onNavigate, open, onToggle }) {
  return (
    <nav
      className={`guide-toc ${open ? 'guide-toc-open' : 'guide-toc-collapsed'}`}
      aria-label="Índice de la guía"
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
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(section.id);
                }}
              >
                {section.title}
              </a>
              {section.subsections?.length > 0 && (
                <ol className="guide-toc-sublist">
                  {section.subsections.map((sub) => (
                    <li key={sub.id}>
                      <a
                        href={`#${sub.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(sub.id);
                        }}
                      >
                        {sub.title}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
