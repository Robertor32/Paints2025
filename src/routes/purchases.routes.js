import { Router } from 'express';
import { createPurchase } from '../controllers/purchase.controller.js';
const r = Router();
r.post('/', createPurchase);
export default r;
