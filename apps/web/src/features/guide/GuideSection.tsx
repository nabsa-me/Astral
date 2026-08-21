import type { ReactNode } from 'react';
import GuideFigure from './GuideFigure';
import { Icon } from '../../shared/components/icons/icons';
import type { IGuideSection } from '../../domain/entities/Guide';

interface GuideSectionProps {
  section: IGuideSection;
  /** Section ids that have a corresponding pin on the trip map. */
  locatableSectionIds?: Set<string>;
  /** Invoked when the user asks to jump to this section's pin. */
  onLocateSection?: (sectionId: string) => void;
}

/** Render inline Markdown emphasis (**bold**, *italic*) inside paragraph text. */
function renderInline(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  const nodes: ReactNode[] = [];
  let lastIdx = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) nodes.push(text.slice(lastIdx, match.index));
    if (match[1]) nodes.push(<strong key={key++}>{match[1].slice(2, -2)}</strong>);
    else if (match[2]) nodes.push(<em key={key++}>{match[2].slice(1, -1)}</em>);
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) nodes.push(text.slice(lastIdx));
  return nodes;
}

export default function GuideSection({
  section,
  locatableSectionIds,
  onLocateSection,
}: GuideSectionProps) {
  const isLocatable = Boolean(
    locatableSectionIds?.has(section.id) && onLocateSection,
  );

  const locateButton = isLocatable ? (
    <button
      type="button"
      className="guide-section-locate"
      onClick={() => onLocateSection?.(section.id)}
    >
      <Icon icon="map" />
      Ver en mapa
    </button>
  ) : null;

  const body = (
    <div className="guide-section-body">
      {section.paragraphs?.map((paragraph, i) => (
        <p key={i}>{renderInline(paragraph)}</p>
      ))}
      {section.figures?.map((figure, i) => (
        <GuideFigure key={i} figure={figure} />
      ))}
      {section.subsections?.map((sub) => (
        <GuideSection
          key={sub.id}
          section={sub}
          locatableSectionIds={locatableSectionIds}
          onLocateSection={onLocateSection}
        />
      ))}
    </div>
  );

  if (section.level === 3) {
    return (
      <section className="guide-section guide-section-level-3" id={section.id}>
        <div className="guide-section-heading">
          <h3 className="guide-subsection-title">{section.title}</h3>
          {locateButton}
        </div>
        {body}
      </section>
    );
  }

  return (
    <section className="guide-section guide-section-level-2" id={section.id}>
      <div className="guide-section-heading">
        <h2 className="guide-section-title">{section.title}</h2>
        {locateButton}
      </div>
      {body}
    </section>
  );
}
