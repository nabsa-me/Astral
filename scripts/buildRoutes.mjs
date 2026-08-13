#!/usr/bin/env node
// Toma cordoba.json, resuelve la geometría real (peatonal) de cada ruta llamando a OSRM
// y guarda el resultado en el campo `coords` de cada ruta.
// Uso: node scripts/buildRoutes.mjs apps/web/src/infrastructure/data/cordoba.json

import fs from 'node:fs/promises';

const [, , cityPath] = process.argv;
if (!cityPath) {
  console.error('Uso: node buildRoutes.mjs <path/city.json>');
  process.exit(1);
}

const OSRM = 'https://routing.openstreetmap.de/routed-foot/route/v1/foot';

async function resolveRoute(waypoints) {
  const coords = waypoints
    .map((wp) => {
      const [lat, lng] = Array.isArray(wp) ? wp : wp.coords;
      return `${lng},${lat}`;
    })
    .join(';');
  const url = `${OSRM}/${coords}?geometries=geojson&overview=full`;
  const res = await fetch(url, { headers: { 'User-Agent': 'astral-guide/0.1 (build script)' } });
  if (!res.ok) throw new Error(`OSRM ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error(`OSRM code=${data.code} message=${data.message ?? ''}`);
  }
  const geom = data.routes[0].geometry.coordinates;
  return geom.map(([lng, lat]) => [lat, lng]);
}

const raw = await fs.readFile(cityPath, 'utf8');
const city = JSON.parse(raw);

for (const route of city.routes || []) {
  if (!route.waypoints || route.waypoints.length < 2) {
    console.log(`SKIP ${route.id}: sin waypoints`);
    continue;
  }
  process.stdout.write(`${route.id}: `);
  const coords = await resolveRoute(route.waypoints);
  route.coords = coords;
  console.log(`OK (${coords.length} puntos)`);
}

await fs.writeFile(cityPath, JSON.stringify(city, null, 2) + '\n');
console.log(`Escrito ${cityPath}`);
