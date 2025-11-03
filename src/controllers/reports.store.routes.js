import { Router } from 'express';
import { ventasPorTienda, inventarioPorTienda } from '../controllers/reports.store.controller.js';

const r = Router();

r.get('/ventas', ventasPorTienda);
r.get('/inventario', inventarioPorTienda);

export default r;
