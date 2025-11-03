import { createPDF } from '../src/utils/pdf.js';
import { createXLS } from '../src/utils/xls.js';
(async ()=>{
  const pdf = createPDF(`demo-${Date.now()}.pdf`,'Demo Reporte',['Línea 1','Línea 2','Línea 3']);
  console.log('PDF:', pdf);
  const xls = await createXLS(`demo-${Date.now()}.xlsx`,'Demo',[['Col1','Col2'],['A',1],['B',2]]);
  console.log('XLS:', xls);
  process.exit(0);
})();
