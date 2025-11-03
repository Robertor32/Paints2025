import models, { Role, User, Store, Product, Inventory, Customer, Supplier } from '../src/models/index.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

if(!fs.existsSync('./data')) fs.mkdirSync('./data', {recursive:true});
if(!fs.existsSync(process.env.EXPORT_DIR || './exports')) fs.mkdirSync(process.env.EXPORT_DIR || './exports', {recursive:true});
if(!fs.existsSync(process.env.BACKUP_DIR || './backups')) fs.mkdirSync(process.env.BACKUP_DIR || './backups', {recursive:true});

async function main(){
  await models.sequelize.sync({ force: true });
  const [rDigit, rCaj, rGer] = await Promise.all([
    Role.create({ name:'digitador' }),
    Role.create({ name:'cajero' }),
    Role.create({ name:'gerente' }),
  ]);
  const pass = await bcrypt.hash('123456', 10);
  await User.create({ email:'digit@paint.com', password_hash: pass, full_name:'Digitador Demo', RoleId: rDigit.id });
  await User.create({ email:'caja@paint.com',  password_hash: pass, full_name:'Cajero Demo',   RoleId: rCaj.id });
  await User.create({ email:'boss@paint.com',  password_hash: pass, full_name:'Gerente Demo',  RoleId: rGer.id });

  const stores = await Store.bulkCreate([
    { name:'Pradera Chimaltenango', city:'Chimaltenango', latitude:14.657, longitude:-90.820 },
    { name:'Pradera Escuintla', city:'Escuintla', latitude:14.306, longitude:-90.786 },
    { name:'Las Américas Mazatenango', city:'Mazatenango', latitude:14.532, longitude:-91.506 },
    { name:'La Trinidad Coatepeque', city:'Coatepeque', latitude:14.704, longitude:-91.866 },
    { name:'Pradera Xela', city:'Quetzaltenango', latitude:14.845, longitude:-91.518 },
    { name:'Miraflores Guatemala', city:'Ciudad de Guatemala', latitude:14.613, longitude:-90.553 }
  ]);

  const prods = await Product.bulkCreate([
    { sku:'ACC-001', name:'Brocha 1”', type:'accesorio', brand:'Genérica', unit:'unidad', price:25, discount_pct:0 },
    { sku:'ACC-002', name:'Rodillo mediano', type:'accesorio', brand:'Genérica', unit:'unidad', price:45, discount_pct:0 },
    { sku:'SOL-001', name:'Aguarrás 1/4', type:'solvente', brand:'SolvX', unit:'1/4', price:35, discount_pct:0 },
    { sku:'BAR-001', name:'Barniz acrílico 1/2', type:'barniz', brand:'Barnex', unit:'1/2', price:80, discount_pct:5, duration_years:4, coverage_m2:20 },
    { sku:'PIN-001', name:'Pintura agua blanca 1 galón', type:'pintura', brand:'Colora', color:'blanco', unit:'1gal', price:150, discount_pct:0, duration_years:5, coverage_m2:40 },
    { sku:'PIN-002', name:'Pintura aceite roja 1/2', type:'pintura', brand:'Colora', color:'rojo', unit:'1/2', price:95, discount_pct:0, duration_years:6, coverage_m2:25 }
  ]);

  for(const s of stores){
    for(const p of prods){
      await Inventory.create({ StoreId: s.id, ProductId: p.id, stock: 50, min_stock: 5 });
    }
  }

  await Customer.create({ email:'cliente@demo.com', full_name:'Cliente Demo', phone:'555-0000' });
  await Supplier.create({ name:'Proveedor Global', contact:'Sr. Prove', phone:'555-1111' });
  console.log('Seed completado.');
  process.exit(0);
}

main().catch(e=>{ console.error(e); process.exit(1); });
