import { Icon } from '../../shared/components/icons/icons';
import { numberStops } from './stopNumbering';
import type { IPlannerStop, StopCategory } from '../../domain/entities/Vacation';

const CATEGORY_LABEL: Record<StopCategory, string> = {
  sight: 'Visita',
  food: 'Comida',
  transport: 'Transporte',
  stay: 'Alojamiento',
  nature: 'Naturaleza',
};

interface StopListProps {
  stops: IPlannerStop[];
}

/** The planner/itinerary layer: an ordered checklist of stops for a day. */
export default function StopList({ stops }: StopListProps) {
  const { numbered } = numberStops(stops);

  return (
    <ol className="stop-list">
      {numbered.map(({ stop, number }) => {
        const done = stop.status === 'done';
        const hasGuide = Boolean(stop.poiId || stop.guideId);
        return (
          <li key={stop.id} className={`stop${done ? ' is-done' : ' is-planned'}`}>
            {number !== null ? (
              <span className="stop-num" aria-hidden="true">
                {number}
              </span>
            ) : (
              <span className="stop-dot" aria-hidden="true" />
            )}
            <div className="stop-body">
              <div className="stop-line">
                {stop.time ? (
                  <span className="stop-time">
                    <Icon icon="schedule" />
                    {stop.time}
                  </span>
                ) : null}
                <span className="stop-name">{stop.name}</span>
                {stop.category ? (
                  <span className="stop-cat">{CATEGORY_LABEL[stop.category]}</span>
                ) : null}
              </div>
              {stop.note ? <p className="stop-note">{stop.note}</p> : null}
              {number !== null ? (
                <span className="stop-guide">
                  <Icon icon="pin" />
                  {hasGuide ? 'En el mapa y la guía' : 'En el mapa'}
                </span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
