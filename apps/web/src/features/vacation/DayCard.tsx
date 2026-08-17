import StopList from './StopList';
import type { IPlannerStop, IVacationDay } from '../../domain/entities/Vacation';
import type { IGuide } from '../../domain/entities/Guide';

interface DayCardProps {
  day: IVacationDay;
  resolveGuide: (stop: IPlannerStop) => IGuide | null;
  onOpenStop: (stop: IPlannerStop) => void;
  onSelectStop: (stop: IPlannerStop) => void;
  selectedStopId: string | null;
  canLocate: (stop: IPlannerStop) => boolean;
}

// The badge already shows the day number, so drop a leading "Día N ·" from the title.
const stripDayPrefix = (title: string) =>
  title.replace(/^d[ií]a\s*\d+\s*[·\-–—]\s*/i, '').trim() || title;

export default function DayCard({
  day,
  resolveGuide,
  onOpenStop,
  onSelectStop,
  selectedStopId,
  canLocate,
}: DayCardProps) {
  return (
    <article className="day-card" id={day.id}>
      <div className="day-card-head">
        <span className="day-card-badge">{day.number}</span>
        <div className="day-card-heading">
          <h2 className="day-card-title">{stripDayPrefix(day.title)}</h2>
          {day.summary ? <p className="day-card-summary">{day.summary}</p> : null}
        </div>
      </div>

      {day.stops && day.stops.length > 0 ? (
        <StopList
          stops={day.stops}
          resolveGuide={resolveGuide}
          onOpenStop={onOpenStop}
          selectedStopId={selectedStopId}
          onSelectStop={onSelectStop}
          canLocate={canLocate}
        />
      ) : null}

      {day.paragraphs && day.paragraphs.length > 0 ? (
        <div className="day-card-notes">
          <span className="day-card-notes-label">Notas</span>
          {day.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
