import { Router } from 'express';
import { resumenMediosPago, topProductosPorDinero, topProductosPorCantidad, inventarioActual, bajoStock } from '../controllers/reports.controller.js';
const r = Router();
r.get('/medios-pago', resumenMediosPago);
r.get('/top-dinero', topProductosPorDinero);
r.get('/top-cantidad', topProductosPorCantidad);
r.get('/inventario', inventarioActual);
r.get('/bajo-stock', bajoStock);
export default r;
