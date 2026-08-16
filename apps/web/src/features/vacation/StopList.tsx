import { Icon } from '../../shared/components/icons/icons';
import { CATEGORY_ICON, CATEGORY_LABEL } from './stopCategory';
import type { IPlannerStop } from '../../domain/entities/Vacation';
import type { IGuide } from '../../domain/entities/Guide';

interface StopListProps {
  stops: IPlannerStop[];
  /** Resolves the guide that a stop opens (POI-linked or direct guideId). */
  resolveGuide: (stop: IPlannerStop) => IGuide | null;
  onOpenStop: (stop: IPlannerStop) => void;
  /** Currently selected stop (shared with the map for cross-highlight). */
  selectedStopId: string | null;
  onSelectStop: (id: string) => void;
}

const findSectionTitle = (guide: IGuide | null, sectionId?: string) => {
  if (!guide || !sectionId) return null;
  for (const section of guide.sections) {
    if (section.id === sectionId) return section.title;
    const sub = section.subsections?.find((s) => s.id === sectionId);
    if (sub) return sub.title;
  }
  return null;
};

/** The planner/itinerary layer: an ordered checklist of stops for a day. */
export default function StopList({
  stops,
  resolveGuide,
  onOpenStop,
  selectedStopId,
  onSelectStop,
}: StopListProps) {
  return (
    <ol className="stop-list">
      {stops.map((stop) => {
        const done = stop.status === 'done';
        const guide = resolveGuide(stop);
        const chipLabel = findSectionTitle(guide, stop.sectionId) ?? guide?.title ?? null;
        const isSelected = selectedStopId === stop.id;
        const canLocate = Boolean(stop.coords);
        return (
          <li
            key={stop.id}
            className={`stop${done ? ' is-done' : ' is-planned'}${isSelected ? ' is-selected' : ''}`}
          >
            <button
              type="button"
              className="stop-badge"
              disabled={!canLocate}
              aria-pressed={isSelected}
              aria-label={canLocate ? `Localizar ${stop.name} en el mapa` : stop.name}
              onClick={() => onSelectStop(stop.id)}
            >
              {stop.category ? <Icon icon={CATEGORY_ICON[stop.category]} /> : null}
            </button>
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
              {chipLabel ? (
                <button
                  type="button"
                  className="stop-guide-chip"
                  onClick={() => onOpenStop(stop)}
                >
                  <Icon icon="menu_book" />
                  <span className="stop-guide-chip-label">Guía · {chipLabel}</span>
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
