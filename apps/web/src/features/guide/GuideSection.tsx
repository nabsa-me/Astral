import GuideFigure from './GuideFigure';
import type { IGuideSection } from '../../domain/entities/Guide';

interface GuideSectionProps {
  section: IGuideSection;
}

export default function GuideSection({ section }: GuideSectionProps) {
  const body = (
    <div className="guide-section-body">
      {section.paragraphs?.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      {section.figures?.map((figure, i) => (
        <GuideFigure key={i} figure={figure} />
      ))}
      {section.subsections?.map((sub) => (
        <GuideSection key={sub.id} section={sub} />
      ))}
    </div>
  );

  if (section.level === 3) {
    return (
      <section className="guide-section guide-section-level-3" id={section.id}>
        <h3 className="guide-subsection-title">{section.title}</h3>
        {body}
      </section>
    );
  }

  return (
    <section className="guide-section guide-section-level-2" id={section.id}>
      <h2 className="guide-section-title">{section.title}</h2>
      {body}
    </section>
  );
}
