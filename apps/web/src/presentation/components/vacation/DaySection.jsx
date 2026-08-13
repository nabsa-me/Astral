import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MapView from '../MapView.jsx';
import { pinIcon } from '../pinIcon.js';

export default function DaySection({ day, cordoba, defaultOpen = false }) {
  return (
    <details className="day-section" id={day.id} open={defaultOpen}>
      <summary className="day-section-summary">
        <h2 className="day-section-title">{day.title}</h2>
        <span className="day-section-summary-info">{day.summary}</span>
        <span className="day-section-chevron" aria-hidden="true">▸</span>
      </summary>
      <div className="day-section-body">
        {day.paragraphs?.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {day.map?.cityId === 'cordoba' && cordoba && (
          <div className="day-map">
            <MapView
              city={cordoba.city}
              points={cordoba.points}
              routes={cordoba.routes}
              getGuideForPoint={cordoba.getGuideForPoint}
            />
          </div>
        )}
        {day.map?.center && !day.map?.cityId && (
          <div className="day-map">
            <MapContainer
              center={day.map.center}
              zoom={day.map.zoom || 13}
              className="map-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={day.map.center} icon={pinIcon('#8c2f23')} />
            </MapContainer>
          </div>
        )}
      </div>
    </details>
  );
}
