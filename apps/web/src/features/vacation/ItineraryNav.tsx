import { useEffect, useRef } from 'react';
import type { IVacationDay } from '../../domain/entities/Vacation';

interface ItineraryNavProps {
  days: IVacationDay[];
  /** null when the itinerary is scrolled to the summary (top). */
  activeDayId: string | null;
  /** Called with a day id, or null when "Inicio" is picked. */
  onSelect: (dayId: string | null) => void;
}

export default function ItineraryNav({ days, activeDayId, onSelect }: ItineraryNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const key = activeDayId ?? '__inicio__';
    const chip = chipRefs.current.get(key);
    const nav = navRef.current;
    if (!chip || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    if (chipRect.left < navRect.left || chipRect.right > navRect.right) {
      const offset =
        chip.offsetLeft - nav.clientWidth / 2 + chip.clientWidth / 2;
      nav.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [activeDayId]);

  const registerChip = (key: string) => (el: HTMLButtonElement | null) => {
    if (el) chipRefs.current.set(key, el);
    else chipRefs.current.delete(key);
  };

  return (
    <nav className="trip-itinerary-nav" aria-label="Índice de días" ref={navRef}>
      <button
        type="button"
        ref={registerChip('__inicio__')}
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
          ref={registerChip(day.id)}
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
