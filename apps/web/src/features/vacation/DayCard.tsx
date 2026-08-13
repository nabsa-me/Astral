import PlannerDayMap from './PlannerDayMap';
import StopList from './StopList';
import type { IVacationDay } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';

interface DayCardProps {
  day: IVacationDay;
  cordoba: CityBundle;
}

// The badge already shows the day number, so drop a leading "Día N ·" from the title.
const stripDayPrefix = (title: string) =>
  title.replace(/^d[ií]a\s*\d+\s*[·\-–—]\s*/i, '').trim() || title;

export default function DayCard({ day, cordoba }: DayCardProps) {
  const hasLocatedStops = (day.stops ?? []).some((stop) => stop.coords);
  const showMap = Boolean(day.map) || hasLocatedStops;

  return (
    <article className="day-card" id={day.id}>
      <div className="day-card-head">
        <span className="day-card-badge">{day.number}</span>
        <div className="day-card-heading">
          <h2 className="day-card-title">{stripDayPrefix(day.title)}</h2>
          {day.summary ? <p className="day-card-summary">{day.summary}</p> : null}
        </div>
      </div>

      {day.stops && day.stops.length > 0 ? <StopList stops={day.stops} /> : null}

      {showMap ? (
        <div className="day-card-map">
          <PlannerDayMap day={day} cordoba={cordoba} />
        </div>
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
