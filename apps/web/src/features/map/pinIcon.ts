import L from 'leaflet';

const cache = new Map<string, L.DivIcon>();

/** Solid fill or a linear gradient (135deg, from → to) — matches the brand
 *  gradient CSS var when both hexes are passed. */
export type PinFill = string | { from: string; to: string };

/**
 * Teardrop map pin. Pass `glyph` (24x24 SVG path `d`) to render an icon inside
 * the head so a pin can carry its stop's category. Without a glyph, a plain
 * white dot is drawn. `fill` can be a solid hex or a { from, to } gradient.
 */
export function pinIcon(fill: PinFill, glyph?: string): L.DivIcon {
  const isGradient = typeof fill !== 'string';
  const key = isGradient ? `grad:${fill.from}>${fill.to}|${glyph ?? ''}` : `${fill}|${glyph ?? ''}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const gradId = isGradient
    ? `pin-grad-${fill.from.replace('#', '')}-${fill.to.replace('#', '')}`
    : null;

  const defs =
    isGradient && gradId
      ? `<defs>
           <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
             <stop offset="0%" stop-color="${fill.from}"/>
             <stop offset="100%" stop-color="${fill.to}"/>
           </linearGradient>
         </defs>`
      : '';
  const bodyFill = isGradient && gradId ? `url(#${gradId})` : (fill as string);

  const inner = glyph
    ? `<g transform="translate(6 6) scale(0.5)" fill="#ffffff">
         <path d="${glyph}"/>
       </g>`
    : `<circle cx="12" cy="12" r="4.5" fill="#ffffff"/>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 34" width="24" height="34">
      ${defs}
      <path d="M12 0C5.4 0 0 5.4 0 12c0 8.8 12 22 12 22s12-13.2 12-22C24 5.4 18.6 0 12 0z"
            fill="${bodyFill}" stroke="#ffffff" stroke-width="2"/>
      ${inner}
    </svg>
  `;
  const icon = L.divIcon({
    html: svg,
    className: 'stop-marker-icon',
    iconSize: [24, 34],
    iconAnchor: [12, 34],
    popupAnchor: [0, -30],
  });
  cache.set(key, icon);
  return icon;
}
