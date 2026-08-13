import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import PoiMarker from './PoiMarker';
import PoiModal from './PoiModal';
import RouteLayer from './RouteLayer';
import type { ICity } from '../../domain/entities/City';
import type { IPointOfInterest } from '../../domain/entities/PointOfInterest';
import type { IRoute } from '../../domain/entities/Route';
import type { IGuide } from '../../domain/entities/Guide';

interface MapViewProps {
  city: ICity;
  points: IPointOfInterest[];
  routes?: IRoute[];
  getGuideForPoint: (item: { guideId?: string } | null | undefined) => IGuide | null;
}

type SelectedItem = IPointOfInterest | IRoute;

export default function MapView({ city, points, routes = [], getGuideForPoint }: MapViewProps) {
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [initialSectionId, setInitialSectionId] = useState<string | null>(null);
  const guide = selected ? getGuideForPoint(selected) : null;

  const openPoint = (point: IPointOfInterest) => {
    setSelected(point);
    setInitialSectionId(null);
  };
  const openRoute = (route: IRoute, sectionId?: string) => {
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
