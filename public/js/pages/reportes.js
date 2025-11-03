import API from '/js/api.js';

export default async function(view){
  view.innerHTML = `
  <div class="card p-3">
    <h4>Reportes</h4>
    <div class="d-flex gap-2 mb-2">
      <button class="btn btn-outline-primary" id="ventas">Ventas por tienda</button>
      <button class="btn btn-outline-primary" id="inventario">Inventario por tienda</button>
      <button class="btn btn-outline-success" id="mpago">Medios de pago (JSON)</button>
      <a class="btn btn-primary" href="/reportes/medios-pago?exportar=pdf" target="_blank">Medios de pago PDF</a>
      <a class="btn btn-primary" href="/reportes/medios-pago?exportar=xls" target="_blank">Medios de pago XLS</a>
    </div>
    <pre id="out" class="small text-muted" style="white-space:pre-wrap"></pre>
  </div>`;

  const out = document.getElementById('out');
  document.getElementById('ventas').onclick = async ()=> out.textContent = JSON.stringify(await API.ventasPorTienda(), null, 2);
  document.getElementById('inventario').onclick = async ()=> out.textContent = JSON.stringify(await API.inventarioPorTienda(), null, 2);
  document.getElementById('mpago').onclick = async ()=> out.textContent = JSON.stringify(await API.mediosPago(), null, 2);
}
