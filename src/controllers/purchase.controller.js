import sequelize from '../config/db.js';
import { Purchase, PurchaseDetail, Supplier, Store, Product, Inventory } from '../models/index.js';

export async function createPurchase(req,res){
  const { supplierId, storeId, items, date, notes } = req.body;
  if(!supplierId || !storeId || !items?.length){
    return res.status(400).json({error:'Datos incompletos'});
  }
  const t = await sequelize.transaction();
  try{
    const p = await Purchase.create({ SupplierId: supplierId, StoreId: storeId, date: date||new Date(), notes: notes||null }, { transaction: t });
    for(const it of items){
      const prod = await Product.findByPk(it.productId, { transaction: t });
      if(!prod) throw new Error('Producto no existe');
      await PurchaseDetail.create({ PurchaseId: p.id, ProductId: prod.id, quantity: it.quantity, unit_cost: it.unit_cost ?? 0 }, { transaction: t });
      const invRow = await Inventory.findOne({ where:{ StoreId: storeId, ProductId: prod.id }, transaction: t });
      if(invRow){ invRow.stock += it.quantity; await invRow.save({ transaction: t }); }
      else { await Inventory.create({ StoreId: storeId, ProductId: prod.id, stock: it.quantity, min_stock: 0 }, { transaction: t }); }
    }
    await t.commit();
    res.json({ ok:true, purchaseId: p.id });
  }catch(e){
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
}
