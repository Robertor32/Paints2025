import app from './app.js';
import models from './models/index.js';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.APP_PORT || 4000;

(async () => {
  await models.sequelize.authenticate();
  console.log('DB OK');
  app.listen(port, ()=> console.log('API en http://localhost:'+port));
})().catch(err=>{
  console.error('Error al iniciar:', err);
  process.exit(1);
});
