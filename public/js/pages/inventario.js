import API from '/js/api.js';

export default async function(view){
  // Helper for scoping queries within this view
  const $ = (q) => view.querySelector(q);
  view.innerHTML = `
  <div class="card p-3">
    <h4>Inventario por tienda</h4>
    <input id="filtro" class="form-control mb-2" placeholder="Filtrar por nombre de producto...">
    <div class="table-responsive">
      <table class="table table-sm">
        <thead><tr><th>Tienda</th><th>Producto</th><th>Unidad</th><th>Stock</th><th>Min</th></tr></thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
  </div>`;

  const data = await API.inventarioPorTienda();
  const tbody = $('#tbody');

  function render(q=''){
    const rows = [];
    Object.keys(data).forEach(t=>{
      data[t].forEach(p=>{
        if(q && !p.producto.toLowerCase().includes(q.toLowerCase())) return;
        rows.push(`<tr><td>${t}</td><td>${p.producto}</td><td>${p.unidad}</td><td>${p.stock}</td><td>${p.min_stock}</td></tr>`);
      });
    });
    tbody.innerHTML = rows.join('');
  }

  render();
  $('#filtro').oninput = (e) => render(e.target.value);
}
