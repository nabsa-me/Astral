import type { IVacationDay } from '../../domain/entities/Vacation';

interface ItineraryNavProps {
  days: IVacationDay[];
  /** null when the itinerary is scrolled to the summary (top). */
  activeDayId: string | null;
  /** Called with a day id, or null when "Inicio" is picked. */
  onSelect: (dayId: string | null) => void;
}

export default function ItineraryNav({ days, activeDayId, onSelect }: ItineraryNavProps) {
  return (
    <nav className="trip-itinerary-nav" aria-label="Índice de días">
      <button
        type="button"
        className={`trip-itinerary-nav-chip${activeDayId === null ? ' is-active' : ''}`}
        aria-current={activeDayId === null || undefined}
        onClick={() => onSelect(null)}
      >
        Inicio
      </button>
      {days.map((day) => (
        <button
          key={day.id}
          type="button"
          className={`trip-itinerary-nav-chip${activeDayId === day.id ? ' is-active' : ''}`}
          aria-current={activeDayId === day.id || undefined}
          onClick={() => onSelect(day.id)}
        >
          Día {day.number}
        </button>
      ))}
    </nav>
  );
}
