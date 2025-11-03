import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(express.json({ limit: '2mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/exports', express.static(path.join(__dirname, '..', 'exports')));

app.use('/', routes);
export default app;
