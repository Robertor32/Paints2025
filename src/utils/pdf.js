import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export function createPDF(filename, title, lines = []){
  const outDir = process.env.EXPORT_DIR || './exports';
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
  const filePath = path.join(outDir, filename);
  const doc = new PDFDocument({ margin: 30 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const logo = process.env.LOGO_PATH || null;
  if (logo && fs.existsSync(logo)) {
    try { doc.image(logo, { fit: [60,60], align: 'left' }); } catch {}
  }

  doc.fontSize(14).text(title, { align: 'right' });
  doc.moveDown(0.5);
  doc.fontSize(10);
  lines.forEach(l => doc.text(l));
  doc.end();
  return filePath;
}
