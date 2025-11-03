import { Router } from 'express';
import authRoutes from './auth.routes.js';
import catalogRoutes from './catalog.routes.js';
import invoiceRoutes from './invoice.routes.js';
import reportRoutes from './reports.routes.js';
import backupRoutes from './backup.routes.js';
import quoteRoutes from './quotes.routes.js';
import purchaseRoutes from './purchases.routes.js';
import reportStoreRoutes from './reports.store.routes.js';

const router = Router();

router.get('/health', (req,res)=> res.json({ ok:true, ts: Date.now() }));

router.use('/auth', authRoutes);
router.use('/catalogo', catalogRoutes);
router.use('/facturas', invoiceRoutes);
router.use('/reportes', reportRoutes);
router.use('/reportes/tiendas', reportStoreRoutes);
router.use('/backup', backupRoutes);
router.use('/cotizaciones', quoteRoutes);
router.use('/ingresos', purchaseRoutes);

export default router;
