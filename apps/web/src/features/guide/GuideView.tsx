import { useCallback, useEffect, useRef, useState } from 'react';
import GuideSection from './GuideSection';
import GuideIndex from './GuideIndex';
import type { IGuide } from '../../domain/entities/Guide';

interface GuideViewProps {
  guide: IGuide;
  initialSectionId?: string | null;
}

export default function GuideView({ guide, initialSectionId }: GuideViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    initialSectionId ?? guide.sections[0]?.id ?? null,
  );

  const navigateTo = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Deep-link: when opened from a route stop that references a section, jump to it.
  useEffect(() => {
    if (!initialSectionId) return;
    setActiveSectionId(initialSectionId);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(initialSectionId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [initialSectionId]);

  // Scroll-spy: keep the index's "current section" label in sync while reading.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const ids: string[] = [];
    guide.sections.forEach((section) => {
      ids.push(section.id);
      section.subsections?.forEach((sub) => ids.push(sub.id));
    });
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];
        setActiveSectionId(topMost.target.id);
      },
      { root, rootMargin: '-8% 0px -82% 0px' },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [guide.sections]);

  return (
    <div className="guide-view">
      <div className="guide-scroll" ref={scrollRef}>
        <header className="guide-hero">
          <span className="guide-eyebrow">Guía</span>
          <h1 className="guide-title">{guide.title}</h1>
          {guide.subtitle && <p className="guide-subtitle">{guide.subtitle}</p>}
        </header>

        {guide.sections.length > 1 ? (
          <div className="guide-secnav">
            <GuideIndex
              sections={guide.sections}
              activeSectionId={activeSectionId}
              onSelect={navigateTo}
            />
          </div>
        ) : null}

        <div className="guide-reader">
          {guide.sections.map((section, i) => (
            <GuideSection key={section.id} section={section} index={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
