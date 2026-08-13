import L from 'leaflet';

const cache = new Map();

export function pinIcon(color) {
  if (cache.has(color)) return cache.get(color);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 34" width="24" height="34">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 8.8 12 22 12 22s12-13.2 12-22C24 5.4 18.6 0 12 0z"
            fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4.5" fill="#ffffff"/>
    </svg>
  `;
  const icon = L.divIcon({
    html: svg,
    className: 'stop-marker-icon',
    iconSize: [24, 34],
    iconAnchor: [12, 34],
    popupAnchor: [0, -30],
  });
  cache.set(color, icon);
  return icon;
}
