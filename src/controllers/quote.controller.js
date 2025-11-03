import { Quote, QuoteDetail, Product, Customer, Store } from '../models/index.js';
import { createPDF } from '../utils/pdf.js';

export async function createQuote(req,res){
  const { number, storeId, customerId, items, valid_until } = req.body;
  if(!number || !storeId || !items?.length){
    return res.status(400).json({error:'Datos incompletos'});
  }
  const q = await Quote.create({ number, StoreId: storeId, CustomerId: customerId||null, valid_until, total:0 });
  let total = 0;
  for(const it of items){
    const prod = await Product.findByPk(it.productId);
    if(!prod) return res.status(400).json({error:'Producto no existe: '+it.productId});
    const unit_price = it.unit_price ?? prod.price;
    const discount_pct = it.discount_pct ?? prod.discount_pct ?? 0;
    const subtotal = it.quantity * unit_price * (1 - discount_pct/100);
    total += subtotal;
    await QuoteDetail.create({ QuoteId: q.id, ProductId: prod.id, quantity: it.quantity, unit_price, discount_pct, subtotal });
  }
  q.total = total; await q.save();
  res.json({ ok:true, quoteId: q.id, total });
}

export async function getQuote(req,res){
  const { number } = req.params;
  const q = await Quote.findOne({ where:{ number }, include:[ QuoteDetail, Customer, Store ] });
  if(!q) return res.status(404).json({error:'No encontrada'});
  res.json(q);
}

export async function listQuotes(req,res){
  const list = await Quote.findAll({ limit: 100, order:[['createdAt','DESC']] });
  res.json(list);
}

export async function exportQuotePdf(req,res){
  const { number } = req.params;
  const q = await Quote.findOne({ where:{ number }, include:[ {model: QuoteDetail, include:[Product]}, Customer, Store ] });
  if(!q) return res.status(404).json({error:'No encontrada'});

  const lines = [];
  lines.push(`PAINTS - COTIZACIÓN (POS)`);
  lines.push(`No.: ${q.number}`);
  lines.push(`Tienda: ${q.Store?.name ?? '-'}`);
  lines.push(`Cliente: ${q.Customer?.full_name ?? '-'}  ${q.Customer?.email ?? ''}`);
  if(q.valid_until) lines.push(`Vigencia: ${new Date(q.valid_until).toLocaleDateString()}`);
  lines.push('----------------------------------------');
  for(const d of q.QuoteDetails){
    const name = d.Product?.name ?? 'Producto';
    lines.push(`${name}`);
    lines.push(`  ${d.quantity} x Q${d.unit_price.toFixed(2)} (-${d.discount_pct}%) = Q${d.subtotal.toFixed(2)}`);
  }
  lines.push('----------------------------------------');
  lines.push(`TOTAL: Q ${q.total.toFixed(2)}`);
  const file = createPDF(`cotizacion-${q.number}.pdf`, 'Cotización', lines);
  res.json({ ok:true, file });
}
