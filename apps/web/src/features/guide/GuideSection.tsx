import GuideFigure from './GuideFigure';
import type { IGuideSection } from '../../domain/entities/Guide';

interface GuideSectionProps {
  section: IGuideSection;
  index?: number;
}

// Titles carry their own numbering ("3. Foo", "4.1. Bar"); strip it for a clean heading.
const stripLeadNumber = (title: string) => title.replace(/^\d+(?:\.\d+)*\.?\s+/, '').trim() || title;

const leadNumber = (title: string, fallback: number) => {
  const match = title.match(/^(\d+)/);
  return match ? match[1] : String(fallback);
};

export default function GuideSection({ section, index = 1 }: GuideSectionProps) {
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
        <h3 className="guide-subsection-title">{stripLeadNumber(section.title)}</h3>
        {body}
      </section>
    );
  }

  return (
    <section className="guide-section guide-section-level-2" id={section.id}>
      <header className="guide-section-head">
        <span className="guide-section-num">{leadNumber(section.title, index)}</span>
        <h2 className="guide-section-title">{stripLeadNumber(section.title)}</h2>
      </header>
      {body}
    </section>
  );
}
