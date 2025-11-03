# Paints 2025 (Node + Express + Sequelize)

Sistema transaccional para cadena de pinturas "Paints" (BD II + Programación Web).

## Arranque
1. Copia `.env.example` a `.env` (puerto 4000).
2. `npm install`
3. `npm run seed`
4. `npm run dev`
5. Probar: `http://localhost:4000/health`

## Endpoints clave
- Auth: `POST /auth/login`
- Catálogo: `GET /catalogo/productos`
- Tienda cercana: `GET /catalogo/tienda-cercana?lat=..&lon=..`
- Factura: `POST /facturas/` | `POST /facturas/anular/:number` | `GET /facturas/:number`
- Reportes: `/reportes/*` y `/reportes/tiendas/*`
- Cotizaciones (POS): `POST /cotizaciones` | `GET /cotizaciones/:number/pdf`
- Ingresos: `POST /ingresos`

## Scripts
- `npm run seed` — crea tablas y datos de ejemplo
- `npm run backup` — copia del archivo SQLite a `/backups`
- `npm run report:demo` — archivos demo en `/exports`
