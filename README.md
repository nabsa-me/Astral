# Astral

Guia de viajes interactiva. Mapa + puntos de interes con contenido narrativo por capas.

## Piloto

Cordoba. Punto inicial: Mezquita.

## Arquitectura

Monorepo con npm workspaces.

- `apps/web`: frontend React + Vite + Leaflet.
- `apps/api`: backend Node (pendiente).
- `packages/shared`: modelos compartidos (pendiente).

`apps/web` sigue arquitectura por capas: `domain`, `application`, `infrastructure`, `presentation`.

## Comandos

```
npm install
npm run dev
```
