import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

export const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { tableName: 'roles' });

export const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'users' });

export const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'stores' });

export const Product = sequelize.define('Product', {
  sku: { type: DataTypes.STRING, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('accesorio','solvente','pintura','barniz'), allowNull: false },
  brand: { type: DataTypes.STRING },
  color: { type: DataTypes.STRING },
  unit: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  discount_pct: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  duration_years: { type: DataTypes.FLOAT },
  coverage_m2: { type: DataTypes.FLOAT }
}, { tableName: 'products' });

export const Inventory = sequelize.define('Inventory', {
  stock: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  min_stock: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
}, { tableName: 'inventories' });

export const Customer = sequelize.define('Customer', {
  email: { type: DataTypes.STRING, unique: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING }
}, { tableName: 'customers' });

export const Supplier = sequelize.define('Supplier', {
  name: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING }
}, { tableName: 'suppliers' });

export const Invoice = sequelize.define('Invoice', {
  series: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false, unique: true },
  total: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.ENUM('ACTIVA','ANULADA'), allowNull: false, defaultValue: 'ACTIVA' }
}, { tableName: 'invoices' });

export const InvoiceDetail = sequelize.define('InvoiceDetail', {
  quantity: { type: DataTypes.FLOAT, allowNull: false },
  unit_price: { type: DataTypes.FLOAT, allowNull: false },
  discount_pct: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  subtotal: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'invoice_details' });

export const Payment = sequelize.define('Payment', {
  method: { type: DataTypes.ENUM('efectivo','cheque','tarjeta'), allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'payments' });

export const Purchase = sequelize.define('Purchase', {
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  notes: { type: DataTypes.STRING }
}, { tableName: 'purchases' });

export const PurchaseDetail = sequelize.define('PurchaseDetail', {
  quantity: { type: DataTypes.FLOAT, allowNull: false },
  unit_cost: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'purchase_details' });

export const Quote = sequelize.define('Quote', {
  number: { type: DataTypes.STRING, allowNull: false, unique: true },
  valid_until: { type: DataTypes.DATE, allowNull: true },
  total: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
}, { tableName: 'quotes' });

export const QuoteDetail = sequelize.define('QuoteDetail', {
  quantity: { type: DataTypes.FLOAT, allowNull: false },
  unit_price: { type: DataTypes.FLOAT, allowNull: false },
  discount_pct: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  subtotal: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'quote_details' });

// RELACIONES
Role.hasMany(User); User.belongsTo(Role);

Store.hasMany(Inventory); Inventory.belongsTo(Store);
Product.hasMany(Inventory); Inventory.belongsTo(Product);

Store.hasMany(Invoice); Invoice.belongsTo(Store);
Customer.hasMany(Invoice); Invoice.belongsTo(Customer);
User.hasMany(Invoice); Invoice.belongsTo(User, { as: 'cashier' });

Invoice.hasMany(InvoiceDetail); InvoiceDetail.belongsTo(Invoice);
Product.hasMany(InvoiceDetail); InvoiceDetail.belongsTo(Product);

Invoice.hasMany(Payment); Payment.belongsTo(Invoice);

Supplier.hasMany(Purchase); Purchase.belongsTo(Supplier);
Store.hasMany(Purchase); Purchase.belongsTo(Store);
Purchase.hasMany(PurchaseDetail); PurchaseDetail.belongsTo(Purchase);
Product.hasMany(PurchaseDetail); PurchaseDetail.belongsTo(Product);

Quote.belongsTo(Customer); Customer.hasMany(Quote);
Quote.belongsTo(Store); Store.hasMany(Quote);
Quote.hasMany(QuoteDetail); QuoteDetail.belongsTo(Quote);
QuoteDetail.belongsTo(Product); Product.hasMany(QuoteDetail);

export default {
  sequelize,
  Role, User, Store, Product, Inventory,
  Customer, Supplier,
  Invoice, InvoiceDetail, Payment,
  Purchase, PurchaseDetail,
  Quote, QuoteDetail
};
