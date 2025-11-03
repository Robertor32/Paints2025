import sequelize from '../config/db.js';
import { Invoice, InvoiceDetail, Payment, Product, Inventory, Store, Customer, User } from '../models/index.js';

export async function createInvoice(req,res){
  const { series, number, storeId, customerId, items, payments, cashierId } = req.body;
  if(!series || !number || !storeId || !items?.length || !payments?.length){
    return res.status(400).json({error:'Datos incompletos'});
  }
  const t = await sequelize.transaction();
  try{
    const inv = await Invoice.create({ series, number, StoreId: storeId, CustomerId: customerId||null, cashierId: cashierId||null, total:0 }, { transaction: t });
    let total = 0;
    for(const it of items){
      const prod = await Product.findByPk(it.productId, { transaction: t });
      if(!prod) throw new Error('Producto no existe');
      const unit_price = it.unit_price ?? prod.price;
      const discount_pct = it.discount_pct ?? prod.discount_pct ?? 0;
      const subtotal = it.quantity * unit_price * (1 - discount_pct/100);
      total += subtotal;
      await InvoiceDetail.create({ InvoiceId: inv.id, ProductId: prod.id, quantity: it.quantity, unit_price, discount_pct, subtotal }, { transaction: t });
      const invRow = await Inventory.findOne({ where: { StoreId: storeId, ProductId: prod.id }, transaction: t });
      if(!invRow || invRow.stock < it.quantity) throw new Error('Stock insuficiente');
      invRow.stock -= it.quantity;
      await invRow.save({ transaction: t });
    }
    let sumPay = 0;
    for(const p of payments){
      sumPay += p.amount;
      await Payment.create({ InvoiceId: inv.id, method: p.method, amount: p.amount }, { transaction: t });
    }
    if (Math.abs(sumPay - total) > 0.01) throw new Error('Pagos no cuadran con total');

    inv.total = total;
    await inv.save({ transaction: t });
    await t.commit();
    res.json({ ok:true, invoice: inv.id, total });
  }catch(e){
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
}

export async function cancelInvoice(req,res){
  const { number } = req.params;
  const t = await sequelize.transaction();
  try{
    const inv = await Invoice.findOne({ where:{ number }, transaction: t });
    if(!inv) throw new Error('Factura no existe');
    if(inv.status === 'ANULADA') throw new Error('Ya estaba anulada');
    const details = await InvoiceDetail.findAll({ where:{ InvoiceId: inv.id }, transaction: t });
    for(const d of details){
      const invRow = await Inventory.findOne({ where:{ StoreId: inv.StoreId, ProductId: d.ProductId }, transaction: t });
      if(invRow){ invRow.stock += d.quantity; await invRow.save({ transaction: t }); }
    }
    inv.status = 'ANULADA'; inv.total = 0;
    await inv.save({ transaction: t });
    await t.commit();
    res.json({ ok:true });
  }catch(e){
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
}

export async function getInvoice(req,res){
  const { number } = req.params;
  const inv = await Invoice.findOne({ where:{ number }, include:[InvoiceDetail, Payment, Store, Customer, { model: User, as:'cashier' }] });
  if(!inv) return res.status(404).json({error:'No encontrada'});
  res.json(inv);
}
