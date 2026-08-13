/**
 * Brand hex values mirrored from palette.module.css.
 * Leaflet renders markers/polylines from raw SVG/hex strings that can't read
 * CSS custom properties, so those contexts import concrete values from here.
 * Keep in sync with styles/themes/palette.module.css.
 */
export const BRAND_GREEN_400 = '#37ed8f';
export const BRAND_GREEN_500 = '#00e676';
export const BRAND_GREEN_600 = '#00b85e';
export const BRAND_GREEN_700 = '#00753b';

export const BRAND_PURPLE_400 = '#9e57ff';
export const BRAND_PURPLE_500 = '#8b2fff';
export const BRAND_PURPLE_600 = '#6f1fd6';
export const BRAND_PURPLE_700 = '#5a18ae';

/** Default map pin colour (vivid purple reads well over map tiles). */
export const MARKER_DEFAULT_COLOR = BRAND_PURPLE_600;
