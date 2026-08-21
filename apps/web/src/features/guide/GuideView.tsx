import { useCallback, useEffect, useRef, useState } from 'react';
import GuideSection from './GuideSection';
import GuideIndex from './GuideIndex';
import type { IGuide } from '../../domain/entities/Guide';

interface GuideViewProps {
  guide: IGuide;
  initialSectionId?: string | null;
  /** Section ids that have a corresponding pin on the trip map. */
  locatableSectionIds?: Set<string>;
  /** Invoked when the user asks to jump from a section to its pin. */
  onLocateSection?: (sectionId: string) => void;
}

export default function GuideView({
  guide,
  initialSectionId,
  locatableSectionIds,
  onLocateSection,
}: GuideViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    initialSectionId ?? guide.sections[0]?.id ?? null,
  );

  const navigateTo = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Deep-link: when opened from a route stop that references a section, jump to it
  // and keep it pinned while lazy images above expand the layout — otherwise the
  // target gets pushed down and we land on an earlier section. Release on user scroll.
  useEffect(() => {
    if (!initialSectionId) return;
    setActiveSectionId(initialSectionId);
    const root = scrollRef.current;
    let released = false;
    const align = () => {
      if (released) return;
      document
        .getElementById(initialSectionId)
        ?.scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    const raf = requestAnimationFrame(() => requestAnimationFrame(align));
    const timers = [80, 200, 400, 800, 1300].map((ms) => window.setTimeout(align, ms));
    const imgs = root ? Array.from(root.querySelectorAll('img')) : [];
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', align);
    });
    const release = () => {
      released = true;
    };
    root?.addEventListener('wheel', release, { passive: true });
    root?.addEventListener('touchmove', release, { passive: true });
    window.addEventListener('keydown', release);
    return () => {
      released = true;
      cancelAnimationFrame(raf);
      timers.forEach((t) => clearTimeout(t));
      imgs.forEach((img) => img.removeEventListener('load', align));
      root?.removeEventListener('wheel', release);
      root?.removeEventListener('touchmove', release);
      window.removeEventListener('keydown', release);
    };
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
          {guide.sections.map((section) => (
            <GuideSection
              key={section.id}
              section={section}
              locatableSectionIds={locatableSectionIds}
              onLocateSection={onLocateSection}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
