import { Product, Store } from '../models/index.js';
import { Op } from 'sequelize';

export async function listProducts(req,res){
  const { q, type } = req.query;
  const where = {};
  if (q) where.name = { [Op.like]: `%${q}%` };
  if (type) where.type = type;
  const products = await Product.findAll({ where, limit: 200, order:[['name','ASC']] });
  res.json(products);
}

export async function nearestStore(req,res){
  const { lat, lon } = req.query;
  if(!lat || !lon) return res.status(400).json({error:'lat y lon requeridos'});
  const stores = await Store.findAll();
  function toRad(d){return d*Math.PI/180}
  const R=6371;
  function hav(lat1,lon1,lat2,lon2){
    const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
    const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return 2*R*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  }
  let best=null;
  stores.forEach(s=>{
    const d = hav(+lat,+lon,s.latitude,s.longitude);
    if(!best || d<best.d) best={store:s,d};
  });
  res.json({ nearest: best?.store, distance_km: best?.d });
}
