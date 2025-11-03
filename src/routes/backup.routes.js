import { Router } from 'express';
import { backupSQLite } from '../controllers/backup.controller.js';
const r = Router();
r.post('/', backupSQLite);
export default r;
