import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export async function createXLS(filename, sheetName, rows){
  const outDir = process.env.EXPORT_DIR || './exports';
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
  const filePath = path.join(outDir, filename);
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);
  rows.forEach(row => ws.addRow(row));
  await wb.xlsx.writeFile(filePath);
  return filePath;
}
