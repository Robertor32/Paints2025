import { Invoice, Payment, InvoiceDetail, Product, Inventory, Store } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import dayjs from 'dayjs';
import { createPDF } from '../utils/pdf.js';
import { createXLS } from '../utils/xls.js';

function rangeFilter(desde,hasta){
  const f = {};
  if (desde || hasta){
    f.createdAt = {};
    if (desde) f.createdAt[Op.gte] = dayjs(desde).toDate();
    if (hasta) f.createdAt[Op.lte] = dayjs(hasta).endOf('day').toDate();
  }
  return f;
}

export async function resumenMediosPago(req,res){
  const { desde, hasta, exportar } = req.query;
  const whereInv = { status: 'ACTIVA', ...rangeFilter(desde, hasta) };
  const invs = await Invoice.findAll({ where: whereInv });
  const ids = invs.map(i=>i.id);
  const pays = await Payment.findAll({ where: { InvoiceId: { [Op.in]: ids } } });
  const totales = { efectivo:0, cheque:0, tarjeta:0 };
  pays.forEach(p=> totales[p.method]+=p.amount );
  const total = totales.efectivo + totales.cheque + totales.tarjeta;

  if (exportar === 'pdf'){
    const lines = [
      `Total: Q ${total.toFixed(2)}`,
      `Efectivo: Q ${totales.efectivo.toFixed(2)}`,
      `Cheque: Q ${totales.cheque.toFixed(2)}`,
      `Tarjeta: Q ${totales.tarjeta.toFixed(2)}`,
      `Rango: ${desde||'-'} a ${hasta||'-'}`
    ];
    const file = createPDF(`resumen-medios-${Date.now()}.pdf`, 'Resumen por medios de pago', lines);
    return res.json({ ok:true, file });
  }
  if (exportar === 'xls'){
    const rows = [
      ['Concepto','Monto'],
      ['Total', total],
      ['Efectivo', totales.efectivo],
      ['Cheque', totales.cheque],
      ['Tarjeta', totales.tarjeta],
    ];
    const file = await createXLS(`resumen-medios-${Date.now()}.xlsx`, 'Resumen', rows);
    return res.json({ ok:true, file });
  }
  res.json({ total, ...totales });
}

export async function topProductosPorDinero(req,res){
  const { desde, hasta } = req.query;
  const where = rangeFilter(desde,hasta);
  const rows = await InvoiceDetail.findAll({
    attributes: ['ProductId', [fn('sum', col('subtotal')), 'monto']],
    include: [{ model: Product, attributes:['name']}],
    where,
    group: ['ProductId','Product.id'],
    order: [[literal('monto'), 'DESC']],
    limit: 20
  });
  res.json(rows.map(r=>({ producto: r.Product.name, monto: Number(r.get('monto')) })));
}

export async function topProductosPorCantidad(req,res){
  const { desde, hasta } = req.query;
  const where = rangeFilter(desde,hasta);
  const rows = await InvoiceDetail.findAll({
    attributes: ['ProductId', [fn('sum', col('quantity')), 'cant']],
    include: [{ model: Product, attributes:['name','unit']}],
    where,
    group: ['ProductId','Product.id'],
    order: [[literal('cant'), 'DESC']],
    limit: 20
  });
  res.json(rows.map(r=>({ producto: r.Product.name, unidad: r.Product.unit, cantidad: Number(r.get('cant')) })));
}

export async function inventarioActual(req,res){
  const list = await Inventory.findAll({ include:[Product, Store] });
  res.json(list.map(x=>({ tienda: x.Store.name, producto: x.Product.name, unidad:x.Product.unit, stock: x.stock, min_stock: x.min_stock })));
}

export async function bajoStock(req,res){
  const list = await Inventory.findAll({ include:[Product, Store] });
  res.json(list.filter(x=> x.stock < x.min_stock).map(x=>({ tienda: x.Store.name, producto: x.Product.name, stock: x.stock, minimo: x.min_stock })));
}
