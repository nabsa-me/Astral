import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import PoiMarker from './PoiMarker.jsx';
import PoiModal from './PoiModal.jsx';
import RouteLayer from './RouteLayer.jsx';

export default function MapView({ city, points, routes = [], getGuideForPoint }) {
  const [selected, setSelected] = useState(null);
  const [initialSectionId, setInitialSectionId] = useState(null);
  const guide = selected ? getGuideForPoint(selected) : null;

  const openPoint = (point) => {
    setSelected(point);
    setInitialSectionId(null);
  };
  const openRoute = (route, sectionId) => {
    setSelected(route);
    setInitialSectionId(sectionId || null);
  };
  const close = () => {
    setSelected(null);
    setInitialSectionId(null);
  };

  return (
    <div className="map-view">
      <MapContainer center={city.center} zoom={city.zoom} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RouteLayer routes={routes} poiPoints={points} onSelectRoute={openRoute} />
        {points.map((point) => (
          <PoiMarker key={point.id} point={point} onSelect={openPoint} />
        ))}
      </MapContainer>
      {selected && (
        <PoiModal
          point={selected}
          guide={guide}
          initialSectionId={initialSectionId}
          onClose={close}
        />
      )}
    </div>
  );
}
