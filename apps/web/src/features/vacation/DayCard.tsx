import { useState } from 'react';
import PlannerDayMap from './PlannerDayMap';
import StopList from './StopList';
import PoiModal from '../map/PoiModal';
import type { IPlannerStop, IVacationDay } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';

interface DayCardProps {
  day: IVacationDay;
  cordoba: CityBundle;
}

// The badge already shows the day number, so drop a leading "Día N ·" from the title.
const stripDayPrefix = (title: string) =>
  title.replace(/^d[ií]a\s*\d+\s*[·\-–—]\s*/i, '').trim() || title;

export default function DayCard({ day, cordoba }: DayCardProps) {
  const [openStop, setOpenStop] = useState<IPlannerStop | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const toggleSelectedStop = (id: string) =>
    setSelectedStopId((prev) => (prev === id ? null : id));

  const hasLocatedStops = (day.stops ?? []).some((stop) => stop.coords);
  const showMap = Boolean(day.map) || hasLocatedStops;

  const guideIdFor = (stop: IPlannerStop) =>
    stop.poiId ? cordoba.points.find((p) => p.id === stop.poiId)?.guideId : stop.guideId;

  const resolveGuide = (stop: IPlannerStop) =>
    cordoba.getGuideForPoint({ guideId: guideIdFor(stop) });

  const hasGuide = (stop: IPlannerStop) => Boolean(guideIdFor(stop));

  const openGuide = openStop ? resolveGuide(openStop) : null;

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
          onOpenStop={setOpenStop}
          selectedStopId={selectedStopId}
          onSelectStop={toggleSelectedStop}
        />
      ) : null}

      {showMap ? (
        <div className="day-card-map">
          <PlannerDayMap
            day={day}
            cordoba={cordoba}
            hasGuide={hasGuide}
            onOpenStop={setOpenStop}
            selectedStopId={selectedStopId}
          />
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

      {openStop ? (
        <PoiModal
          point={{ name: openStop.name }}
          guide={openGuide}
          initialSectionId={openStop.sectionId ?? null}
          onClose={() => setOpenStop(null)}
        />
      ) : null}
    </article>
  );
}
