import API from '/js/api.js';

export default async function(view){
  view.innerHTML = `
  <div class="row">
    <div class="col-lg-4">
      <div class="card p-3">
        <h5>Ventas por tienda</h5>
        <canvas id="chartVentas" height="200"></canvas>
      </div>
    </div>
    <div class="col-lg-8">
      <div class="card p-3">
        <h5>Inventario (top 10 por tienda)</h5>
        <div class="table-responsive">
          <table class="table table-sm" id="tbInv">
            <thead><tr><th>Tienda</th><th>Producto</th><th>Stock</th><th>Mín</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;

  const ventas = await API.ventasPorTienda(); // [{tienda,monto}]
  const ctx = document.getElementById('chartVentas');
  new Chart(ctx, {
    type: 'bar',
    data: { labels: ventas.map(x=>x.tienda), datasets: [{ label: 'Q', data: ventas.map(x=>x.monto) }] },
    options: { plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }
  });

  const inv = await API.inventarioPorTienda();
  const rows = [];
  Object.keys(inv).forEach(tienda=>{
    inv[tienda].slice(0,10).forEach(p=>{
      rows.push(`<tr><td>${tienda}</td><td>${p.producto}</td><td>${p.stock}</td><td>${p.min_stock}</td></tr>`);
    });
  });
  document.querySelector('#tbInv tbody').innerHTML = rows.join('');
}
