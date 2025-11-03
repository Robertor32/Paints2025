import { Router } from 'express';
import { listProducts, nearestStore } from '../controllers/catalog.controller.js';
const r = Router();
r.get('/productos', listProducts);
r.get('/tienda-cercana', nearestStore);
export default r;
