import { Router } from 'express';
import { createQuote, getQuote, listQuotes, exportQuotePdf } from '../controllers/quote.controller.js';
const r = Router();
r.post('/', createQuote);
r.get('/', listQuotes);
r.get('/:number', getQuote);
r.get('/:number/pdf', exportQuotePdf);
export default r;
