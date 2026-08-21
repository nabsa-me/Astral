import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TripOverviewMap from './TripOverviewMap';
import TripSummary from './TripSummary';
import ItineraryNav from './ItineraryNav';
import DayCard from './DayCard';
import PoiModal from '../map/PoiModal';
import { resolveStopCoords } from './stopCoords';
import type { IMapPoi, IPlannerStop, IVacation } from '../../domain/entities/Vacation';
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

interface OpenPoiContext {
  poi: IMapPoi;
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
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const [openContext, setOpenContext] = useState<OpenStopContext | null>(null);
  const [openPoiContext, setOpenPoiContext] = useState<OpenPoiContext | null>(null);
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
    (stop: IPlannerStop) =>
      stop.category !== 'food' && resolveStopCoords(stop, cordoba) !== null,
    [cordoba],
  );

  const scrollItineraryTo = useCallback((dayId: string) => {
    const el = document.getElementById(dayId);
    const panel = itineraryRef.current;
    if (!el || !panel) return;
    const panelTop = panel.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const nav = panel.querySelector('.trip-itinerary-nav');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    panel.scrollBy({
      top: elTop - panelTop - navHeight - 12,
      behavior: 'smooth',
    });
  }, []);

  const scrollStopIntoView = useCallback((stopId: string) => {
    const el = document.getElementById(`stop-${stopId}`);
    const panel = itineraryRef.current;
    if (!el || !panel) return;
    const panelRect = panel.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const nav = panel.querySelector('.trip-itinerary-nav');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    const visibleHeight = panelRect.height - navHeight;
    const centerOffset = navHeight + (visibleHeight - elRect.height) / 2;
    panel.scrollBy({
      top: elRect.top - panelRect.top - centerOffset,
      behavior: 'smooth',
    });
  }, []);

  const selectDay = useCallback(
    (dayId: string) => {
      setActiveDayId(dayId);
      setSelectedStopId(null);
      setSelectedPoiId(null);
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
        setSelectedPoiId(null);
        itineraryRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      selectDay(dayId);
    },
    [selectDay],
  );

  const selectStop = useCallback(
    (stop: IPlannerStop, dayId: string) => {
      setSelectedStopId(stop.id);
      setSelectedPoiId(null);
      setActiveDayId(dayId);
      requestAnimationFrame(() => scrollStopIntoView(stop.id));
    },
    [scrollStopIntoView],
  );

  const openStop = useCallback((stop: IPlannerStop, dayId: string) => {
    setActiveDayId(dayId);
    setOpenContext({ stop, dayId });
  }, []);

  const closeStop = useCallback(() => setOpenContext(null), []);

  const openPoi = useCallback((poi: IMapPoi, dayId: string) => {
    setActiveDayId(dayId);
    setOpenPoiContext({ poi, dayId });
  }, []);

  const closePoi = useCallback(() => setOpenPoiContext(null), []);

  const openPoiGuide = useMemo(
    () =>
      openPoiContext?.poi.guideId
        ? cordoba.getGuideForPoint({ guideId: openPoiContext.poi.guideId })
        : null,
    [cordoba, openPoiContext],
  );

  const openGuide = useMemo(
    () => (openContext ? resolveGuide(openContext.stop) : null),
    [openContext, resolveGuide],
  );

  const currentGuideId = openContext
    ? guideIdFor(openContext.stop) ?? null
    : openPoiContext?.poi.guideId ?? null;

  const locatableSectionIds = useMemo(() => {
    const set = new Set<string>();
    if (!currentGuideId) return set;
    vacation.days.forEach((day) => {
      (day.stops ?? []).forEach((stop) => {
        if (stop.category === 'food') return;
        if (!canLocate(stop)) return;
        if (stop.sectionId && guideIdFor(stop) === currentGuideId) {
          set.add(stop.sectionId);
        }
      });
      (day.mapPois ?? []).forEach((poi) => {
        if (poi.category === 'food') return;
        if (poi.sectionId && poi.guideId === currentGuideId) {
          set.add(poi.sectionId);
        }
      });
    });
    return set;
  }, [currentGuideId, vacation.days, guideIdFor, canLocate]);

  const locateSectionOnMap = useCallback(
    (sectionId: string) => {
      if (!currentGuideId) return;
      for (const day of vacation.days) {
        for (const stop of day.stops ?? []) {
          if (stop.category === 'food') continue;
          if (!canLocate(stop)) continue;
          if (stop.sectionId === sectionId && guideIdFor(stop) === currentGuideId) {
            setOpenContext(null);
            setOpenPoiContext(null);
            setActiveDayId(day.id);
            setSelectedStopId(stop.id);
            setSelectedPoiId(null);
            return;
          }
        }
        for (const poi of day.mapPois ?? []) {
          if (poi.category === 'food') continue;
          if (poi.sectionId === sectionId && poi.guideId === currentGuideId) {
            setOpenContext(null);
            setOpenPoiContext(null);
            setActiveDayId(day.id);
            setSelectedStopId(null);
            setSelectedPoiId(poi.id);
            return;
          }
        }
      }
    },
    [currentGuideId, vacation.days, guideIdFor, canLocate],
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
        selectedPoiId={selectedPoiId}
        onSelectDay={selectDayOrTop}
        onSelectStop={selectStop}
        onOpenStop={openStop}
        onOpenPoi={openPoi}
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
          locatableSectionIds={locatableSectionIds}
          onLocateSection={locateSectionOnMap}
        />
      ) : null}

      {openPoiContext ? (
        <PoiModal
          point={{ name: openPoiContext.poi.name }}
          guide={openPoiGuide}
          initialSectionId={openPoiContext.poi.sectionId ?? null}
          onClose={closePoi}
          locatableSectionIds={locatableSectionIds}
          onLocateSection={locateSectionOnMap}
        />
      ) : null}
    </div>
  );
}
