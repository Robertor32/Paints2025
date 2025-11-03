import { Router } from 'express';
import { createInvoice, cancelInvoice, getInvoice } from '../controllers/invoice.controller.js';
const r = Router();
r.post('/', createInvoice);
r.post('/anular/:number', cancelInvoice);
r.get('/:number', getInvoice);
export default r;
