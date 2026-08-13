import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../shared/components/icons/icons';
import type { IGuideSection } from '../../domain/entities/Guide';

interface GuideIndexProps {
  sections: IGuideSection[];
  activeSectionId: string | null;
  onSelect: (id: string) => void;
}

const stripLeadNumber = (title: string) => title.replace(/^\d+(?:\.\d+)*\.?\s+/, '').trim() || title;

const leadNumber = (title: string, fallback: number) => {
  const match = title.match(/^(\d+)/);
  return match ? match[1] : String(fallback);
};

export default function GuideIndex({ sections, activeSectionId, onSelect }: GuideIndexProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const activeIndex = sections.findIndex(
    (section) =>
      section.id === activeSectionId ||
      section.subsections?.some((sub) => sub.id === activeSectionId),
  );
  const activeSection = activeIndex >= 0 ? sections[activeIndex] : null;
  const currentNum = activeSection ? leadNumber(activeSection.title, activeIndex + 1) : '';
  const currentLabel = activeSection ? stripLeadNumber(activeSection.title) : 'Índice de la guía';

  const pick = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div className="guide-index" ref={containerRef}>
      <button
        type="button"
        className="guide-index-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon icon="menu" type="thin" />
        <span className="guide-index-current">
          {currentNum ? <span className="guide-index-current-num">{currentNum}</span> : null}
          <span className="guide-index-current-label">{currentLabel}</span>
        </span>
        <Icon
          icon="chevron_right"
          type="bold"
          className={`guide-index-caret${open ? ' is-open' : ''}`}
        />
      </button>

      {open ? (
        <div className="guide-index-panel" role="menu">
          <p className="guide-index-panel-title">Índice</p>
          <ol className="guide-index-list">
            {sections.map((section, i) => (
              <li key={section.id}>
                <button
                  type="button"
                  role="menuitem"
                  className={`guide-index-item${activeSectionId === section.id ? ' is-active' : ''}`}
                  onClick={() => pick(section.id)}
                >
                  <span className="guide-index-item-num">{leadNumber(section.title, i + 1)}</span>
                  <span className="guide-index-item-label">{stripLeadNumber(section.title)}</span>
                </button>
                {section.subsections && section.subsections.length > 0 ? (
                  <ul className="guide-index-sublist">
                    {section.subsections.map((sub) => (
                      <li key={sub.id}>
                        <button
                          type="button"
                          role="menuitem"
                          className={`guide-index-subitem${activeSectionId === sub.id ? ' is-active' : ''}`}
                          onClick={() => pick(sub.id)}
                        >
                          {stripLeadNumber(sub.title)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
