import type { IVacationDay } from '../../domain/entities/Vacation';

interface DayNavProps {
  days: IVacationDay[];
  activeDayId: string | null;
  onSelect: (dayId: string) => void;
}

export default function DayNav({ days, activeDayId, onSelect }: DayNavProps) {
  return (
    <nav className="trip-daynav" aria-label="Días del viaje">
      {days.map((day) => (
        <button
          key={day.id}
          type="button"
          className={`trip-daynav-chip${activeDayId === day.id ? ' is-active' : ''}`}
          aria-current={activeDayId === day.id || undefined}
          onClick={() => onSelect(day.id)}
        >
          Día {day.number}
        </button>
      ))}
    </nav>
  );
}
