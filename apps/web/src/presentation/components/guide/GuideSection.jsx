import GuideFigure from './GuideFigure.jsx';

export default function GuideSection({ section, defaultOpen = false }) {
  const HeadingTag = section.level === 3 ? 'h3' : 'h2';

  return (
    <details className={`guide-section guide-section-level-${section.level}`} id={section.id} open={defaultOpen}>
      <summary className="guide-section-summary">
        <HeadingTag className="guide-section-title">{section.title}</HeadingTag>
        <span className="guide-section-chevron" aria-hidden="true">▸</span>
      </summary>
      <div className="guide-section-body">
        {section.paragraphs?.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {section.figures?.map((fig, i) => (
          <GuideFigure key={i} figure={fig} />
        ))}
        {section.subsections?.map((sub) => (
          <GuideSection key={sub.id} section={sub} />
        ))}
      </div>
    </details>
  );
}
