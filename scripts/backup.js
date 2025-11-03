import { backupSQLite } from '../src/controllers/backup.controller.js';
const req = {}; const res = { json: (o)=> { console.log(o); process.exit(0); }, status:(c)=>({json:o=>{console.log(c,o); process.exit(1);}})};
backupSQLite(req,res);
