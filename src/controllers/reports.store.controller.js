import { Invoice, Inventory, Store, Product } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import dayjs from 'dayjs';

function rangeFilter(desde,hasta){
  const f = {};
  if (desde || hasta){
    f.createdAt = {};
    if (desde) f.createdAt[Op.gte] = dayjs(desde).toDate();
    if (hasta) f.createdAt[Op.lte] = dayjs(hasta).endOf('day').toDate();
  }
  return f;
}

export async function ventasPorTienda(req,res){
  const { desde, hasta } = req.query;
  const where = { status:'ACTIVA', ...rangeFilter(desde,hasta) };
  const rows = await Invoice.findAll({
    attributes: ['StoreId', [fn('sum', col('total')), 'monto']],
    include: [{ model: Store, attributes:['name']}],
    where,
    group: ['StoreId','Store.id'],
    order: [[literal('monto'), 'DESC']]
  });
  res.json(rows.map(r=>({ tienda: r.Store.name, monto: Number(r.get('monto')) })));
}

export async function inventarioPorTienda(req,res){
  const list = await Inventory.findAll({ include:[Product, Store] });
  const out = {};
  list.forEach(x=>{
    const key = x.Store.name;
    if(!out[key]) out[key] = [];
    out[key].push({ producto: x.Product.name, unidad: x.Product.unit, stock: x.stock, min_stock: x.min_stock });
  });
  res.json(out);
}
