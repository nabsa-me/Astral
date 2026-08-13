import { useCallback, useState } from 'react';
import DaySection from './DaySection.jsx';
import VacationTOC from './VacationTOC.jsx';

export default function VacationView({ vacation, cordoba }) {
  const [tocOpen, setTocOpen] = useState(true);

  const navigateTo = useCallback((dayId) => {
    const el = document.getElementById(dayId);
    if (!el) return;
    if (el.tagName.toLowerCase() === 'details' && !el.open) {
      el.open = true;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="vacation-view">
      <header className="vacation-header">
        <h1 className="vacation-title">{vacation.title}</h1>
        {vacation.subtitle && <p className="vacation-subtitle">{vacation.subtitle}</p>}
      </header>
      <div className="vacation-body">
        <VacationTOC
          days={vacation.days}
          onNavigate={navigateTo}
          open={tocOpen}
          onToggle={() => setTocOpen((v) => !v)}
        />
        <main className="vacation-content">
          {vacation.days.map((day) => (
            <DaySection
              key={day.id}
              day={day}
              cordoba={cordoba}
              defaultOpen={day.id === 'dia-3'}
            />
          ))}
        </main>
      </div>
    </div>
  );
}
