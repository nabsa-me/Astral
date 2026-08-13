import { useCallback, useEffect, useState } from 'react';
import GuideSection from './GuideSection.jsx';
import GuideTOC from './GuideTOC.jsx';

export default function GuideView({ guide, initialSectionId }) {
  const [tocOpen, setTocOpen] = useState(true);

  const navigateTo = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (el.tagName.toLowerCase() === 'details' && !el.open) {
      el.open = true;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    if (!initialSectionId) return;
    // Doble raf para asegurar layout listo antes del scroll
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => navigateTo(initialSectionId));
    });
    return () => cancelAnimationFrame(id);
  }, [initialSectionId, navigateTo]);

  return (
    <div className="guide-view">
      <header className="guide-header">
        <h1 className="guide-title">{guide.title}</h1>
        {guide.subtitle && <p className="guide-subtitle">{guide.subtitle}</p>}
      </header>
      <div className="guide-body">
        <GuideTOC
          sections={guide.sections}
          onNavigate={navigateTo}
          open={tocOpen}
          onToggle={() => setTocOpen((v) => !v)}
        />
        <main className="guide-content">
          {guide.sections.map((section, i) => (
            <GuideSection
              key={section.id}
              section={section}
              defaultOpen={initialSectionId ? section.id === initialSectionId : i === 0}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
