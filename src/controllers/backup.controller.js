import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export async function backupSQLite(req,res){
  const dbPath = process.env.DB_STORAGE || './data/paints.sqlite';
  const outDir = process.env.BACKUP_DIR || './backups';
  if(!fs.existsSync(dbPath)) return res.status(400).json({error:'BD no existe aún'});
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
  const name = `backup-${Date.now()}.sqlite`;
  const dest = path.join(outDir, name);
  fs.copyFileSync(dbPath, dest);
  res.json({ ok:true, file: dest });
}
