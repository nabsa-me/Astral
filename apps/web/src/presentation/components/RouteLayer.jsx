import { Polyline, Tooltip } from 'react-leaflet';
import StopMarker from './StopMarker.jsx';

const POI_MATCH_METERS = 30;

function distanceMeters([lat1, lng1], [lat2, lng2]) {
  const dLat = (lat1 - lat2) * 111000;
  const dLng = (lng1 - lng2) * 111000 * Math.cos((lat1 * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

function isNearPoi(waypoint, poiPoints) {
  return poiPoints.some((p) => distanceMeters(waypoint.coords, p.coords) < POI_MATCH_METERS);
}

function isStop(wp) {
  return wp.stop !== false;
}

export default function RouteLayer({ routes, poiPoints = [], onSelectRoute }) {
  return (
    <>
      {routes.map((route) => {
        const interactive = Boolean(route.guideId && onSelectRoute);
        const stops = (route.waypoints || []).filter(isStop);
        return (
          <Polyline
            key={`line-${route.id}`}
            positions={route.coords}
            pathOptions={{
              color: route.color,
              weight: 5,
              opacity: 0.8,
              dashArray: '2 8',
              lineCap: 'round',
            }}
            eventHandlers={interactive ? { click: () => onSelectRoute(route) } : undefined}
          >
            <Tooltip sticky direction="top" opacity={0.95}>
              <div className="route-tooltip">
                <strong>{route.name}</strong>
                <p>{route.description}</p>
                {stops.length > 0 && (
                  <ul>
                    {stops.map((wp, i) => (
                      <li key={`${route.id}-wp-${i}`}>{wp.name}</li>
                    ))}
                  </ul>
                )}
                {interactive && <p className="route-tooltip-cta">Clic para abrir la guía</p>}
              </div>
            </Tooltip>
          </Polyline>
        );
      })}
      {routes.flatMap((route) =>
        (route.waypoints || [])
          .filter((wp) => isStop(wp) && !isNearPoi(wp, poiPoints))
          .map((wp, i) => (
            <StopMarker
              key={`stop-${route.id}-${i}`}
              stop={wp}
              color={route.color}
              onClick={
                route.guideId && onSelectRoute
                  ? (clickedStop) => onSelectRoute(route, clickedStop.sectionId)
                  : undefined
              }
            />
          )),
      )}
    </>
  );
}
