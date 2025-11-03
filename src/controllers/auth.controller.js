import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';
import dotenv from 'dotenv';
dotenv.config();
const { JWT_SECRET='secret' } = process.env;

export async function login(req,res){
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email }, include: Role });
  if(!user) return res.status(401).json({error:'Credenciales inválidas'});
  const ok = await bcrypt.compare(password, user.password_hash);
  if(!ok) return res.status(401).json({error:'Credenciales inválidas'});
  const token = jwt.sign({ id:user.id, role:user.Role.name, name:user.full_name }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, role: user.Role.name, name: user.full_name });
}
