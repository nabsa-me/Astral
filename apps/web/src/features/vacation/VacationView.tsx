import { useCallback, useEffect, useState } from 'react';
import TripHero from './TripHero';
import DayNav from './DayNav';
import DayCard from './DayCard';
import type { IVacation } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';
import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { IUser } from '../../domain/entities/social/User';
import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';

interface VacationViewProps {
  vacation: IVacation;
  cordoba: CityBundle;
  sharedRoute?: ISharedRoute | null;
  owner?: IUser | null;
  diaries?: ITravelDiary[];
}

export default function VacationView({
  vacation,
  cordoba,
  sharedRoute,
  owner,
  diaries = [],
}: VacationViewProps) {
  const [activeDayId, setActiveDayId] = useState<string | null>(vacation.days[0]?.id ?? null);

  const allStops = vacation.days.flatMap((day) => day.stops ?? []);
  const stopsTotal = allStops.length;
  const stopsDone = allStops.filter((stop) => stop.status === 'done').length;

  const selectDay = useCallback((dayId: string) => {
    setActiveDayId(dayId);
    document.getElementById(dayId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Scroll-spy: highlight the day currently near the top of the feed.
  useEffect(() => {
    const cards = vacation.days
      .map((day) => document.getElementById(day.id))
      .filter((el): el is HTMLElement => el !== null);
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];
        setActiveDayId(topMost.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [vacation.days]);

  return (
    <div className="trip-view">
      <TripHero
        vacation={vacation}
        sharedRoute={sharedRoute}
        owner={owner}
        stopsTotal={stopsTotal}
        stopsDone={stopsDone}
        diaries={diaries}
      />
      <DayNav days={vacation.days} activeDayId={activeDayId} onSelect={selectDay} />
      <div className="trip-feed">
        {vacation.days.map((day) => (
          <DayCard key={day.id} day={day} cordoba={cordoba} />
        ))}
      </div>
    </div>
  );
}
