import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TripOverviewMap from './TripOverviewMap';
import TripSummary from './TripSummary';
import ItineraryNav from './ItineraryNav';
import DayCard from './DayCard';
import PoiModal from '../map/PoiModal';
import { resolveStopCoords } from './stopCoords';
import type { IPlannerStop, IVacation } from '../../domain/entities/Vacation';
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

interface OpenStopContext {
  stop: IPlannerStop;
  dayId: string;
}

export default function VacationView({
  vacation,
  cordoba,
  sharedRoute,
  owner,
  diaries = [],
}: VacationViewProps) {
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [openContext, setOpenContext] = useState<OpenStopContext | null>(null);
  const itineraryRef = useRef<HTMLDivElement | null>(null);
  const suppressObserverUntilRef = useRef<number>(0);

  const allStops = vacation.days.flatMap((day) => day.stops ?? []);
  const stopsTotal = allStops.length;
  const stopsDone = allStops.filter((stop) => stop.status === 'done').length;

  const guideIdFor = useCallback(
    (stop: IPlannerStop) =>
      stop.poiId ? cordoba.points.find((p) => p.id === stop.poiId)?.guideId : stop.guideId,
    [cordoba.points],
  );

  const resolveGuide = useCallback(
    (stop: IPlannerStop) => cordoba.getGuideForPoint({ guideId: guideIdFor(stop) }),
    [cordoba, guideIdFor],
  );

  const hasGuide = useCallback(
    (stop: IPlannerStop) => Boolean(guideIdFor(stop)),
    [guideIdFor],
  );

  const canLocate = useCallback(
    (stop: IPlannerStop) => resolveStopCoords(stop, cordoba) !== null,
    [cordoba],
  );

  const scrollItineraryTo = useCallback((dayId: string) => {
    const el = document.getElementById(dayId);
    if (!el || !itineraryRef.current) return;
    const panelTop = itineraryRef.current.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const nav = itineraryRef.current.querySelector('.trip-itinerary-nav');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    itineraryRef.current.scrollBy({
      top: elTop - panelTop - navHeight - 12,
      behavior: 'smooth',
    });
  }, []);

  const selectDay = useCallback(
    (dayId: string) => {
      setActiveDayId(dayId);
      setSelectedStopId(null);
      scrollItineraryTo(dayId);
    },
    [scrollItineraryTo],
  );

  const selectDayOrTop = useCallback(
    (dayId: string | null) => {
      if (dayId === null) {
        suppressObserverUntilRef.current = Date.now() + 1000;
        setActiveDayId(null);
        setSelectedStopId(null);
        itineraryRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      selectDay(dayId);
    },
    [selectDay],
  );

  const selectStop = useCallback((stop: IPlannerStop, dayId: string) => {
    setSelectedStopId((prev) => (prev === stop.id ? null : stop.id));
    setActiveDayId(dayId);
  }, []);

  const openStop = useCallback((stop: IPlannerStop, dayId: string) => {
    setActiveDayId(dayId);
    setSelectedStopId(stop.id);
    setOpenContext({ stop, dayId });
  }, []);

  const closeStop = useCallback(() => setOpenContext(null), []);

  const locateOpenStopOnMap = useCallback(() => {
    if (!openContext) return;
    const { stop, dayId } = openContext;
    setOpenContext(null);
    setActiveDayId(dayId);
    setSelectedStopId(stop.id);
  }, [openContext]);

  const openGuide = useMemo(
    () => (openContext ? resolveGuide(openContext.stop) : null),
    [openContext, resolveGuide],
  );

  useEffect(() => {
    const root = itineraryRef.current;
    if (!root) return;
    const cards = vacation.days
      .map((day) => document.getElementById(day.id))
      .filter((el): el is HTMLElement => el !== null);
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressObserverUntilRef.current) return;
        if (root.scrollTop < 80) {
          setActiveDayId(null);
          return;
        }
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];
        setActiveDayId(topMost.target.id);
      },
      { root, rootMargin: '-30% 0px -55% 0px' },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [vacation.days]);

  return (
    <div className="trip-view">
      <TripOverviewMap
        days={vacation.days}
        cordoba={cordoba}
        activeDayId={activeDayId}
        selectedStopId={selectedStopId}
        onSelectDay={selectDay}
        onSelectStop={selectStop}
        onOpenStop={openStop}
        hasGuide={hasGuide}
      />

      <aside className="trip-itinerary" ref={itineraryRef}>
        <div className="trip-itinerary-inner">
          <TripSummary
            vacation={vacation}
            sharedRoute={sharedRoute}
            owner={owner}
            diaries={diaries}
            stopsTotal={stopsTotal}
            stopsDone={stopsDone}
          />
          <ItineraryNav
            days={vacation.days}
            activeDayId={activeDayId}
            onSelect={selectDayOrTop}
          />
          {vacation.days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              resolveGuide={resolveGuide}
              onOpenStop={(stop) => openStop(stop, day.id)}
              onSelectStop={(stop) => selectStop(stop, day.id)}
              selectedStopId={selectedStopId}
              canLocate={canLocate}
            />
          ))}
        </div>
      </aside>

      {openContext ? (
        <PoiModal
          point={{ name: openContext.stop.name }}
          guide={openGuide}
          initialSectionId={openContext.stop.sectionId ?? null}
          onClose={closeStop}
          onLocateOnMap={locateOpenStopOnMap}
        />
      ) : null}
    </div>
  );
}
