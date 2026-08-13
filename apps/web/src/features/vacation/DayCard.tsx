import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MapView from '../map/MapView';
import { pinIcon } from '../map/pinIcon';
import { MARKER_DEFAULT_COLOR } from '../../styles/themeColors';
import type { IVacationDay } from '../../domain/entities/Vacation';
import type { CityBundle } from '../../app/services';

interface DayCardProps {
  day: IVacationDay;
  cordoba: CityBundle;
}

// The badge already shows the day number, so drop a leading "Día N ·" from the title.
const stripDayPrefix = (title: string) =>
  title.replace(/^d[ií]a\s*\d+\s*[·\-–—]\s*/i, '').trim() || title;

export default function DayCard({ day, cordoba }: DayCardProps) {
  const map = day.map;
  const cityMap = map && 'cityId' in map ? map : null;
  const coordsMap = map && 'center' in map ? map : null;
  const showCityMap = cityMap?.cityId === 'cordoba' && Boolean(cordoba.city);

  return (
    <article className="day-card" id={day.id}>
      <div className="day-card-head">
        <span className="day-card-badge">{day.number}</span>
        <div className="day-card-heading">
          <h2 className="day-card-title">{stripDayPrefix(day.title)}</h2>
          {day.summary ? <p className="day-card-summary">{day.summary}</p> : null}
        </div>
      </div>

      {day.paragraphs && day.paragraphs.length > 0 ? (
        <div className="day-card-body">
          {day.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {showCityMap && cordoba.city ? (
        <div className="day-card-map">
          <MapView
            city={cordoba.city}
            points={cordoba.points}
            routes={cordoba.routes}
            getGuideForPoint={cordoba.getGuideForPoint}
          />
        </div>
      ) : coordsMap ? (
        <div className="day-card-map">
          <MapContainer
            center={coordsMap.center}
            zoom={coordsMap.zoom || 13}
            className="map-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coordsMap.center} icon={pinIcon(MARKER_DEFAULT_COLOR)} />
          </MapContainer>
        </div>
      ) : null}
    </article>
  );
}
