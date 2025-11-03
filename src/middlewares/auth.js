import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const { JWT_SECRET='secret' } = process.env;

export function requireAuth(req,res,next){
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if(!token) return res.status(401).json({error:'No token'});
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({error:'Token inválido'});
  }
}

export function requireRole(...roles){
  return (req,res,next)=>{
    if(!req.user || !roles.includes(req.user.role)) return res.status(403).json({error:'No autorizado'});
    next();
  };
}
