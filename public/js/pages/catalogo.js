import API from '/js/api.js';

export default async function(view){
  view.innerHTML = `
  <div class="card p-3">
    <h4>Catálogo</h4>
    <div class="input-group mb-2">
      <input id="q" class="form-control" placeholder="Buscar producto...">
      <button class="btn btn-outline-secondary" id="go">Buscar</button>
    </div>
    <div class="table-responsive">
      <table class="table table-sm">
        <thead><tr><th>ID</th><th>Nombre</th><th>Unidad</th><th>Precio</th></tr></thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
  </div>`;

  async function buscar(txt){
    try{
      const r = await API.catalogo(txt || '');
      const list = (r.items || r);
      const tb = document.getElementById('tbody');
      tb.innerHTML = list.map(p=>`<tr><td>${p.id}</td><td>${p.name}</td><td>${p.unit}</td><td>${p.price || '-'}</td></tr>`).join('');
    }catch(e){
      document.getElementById('tbody').innerHTML = `<tr><td colspan="4" class="text-danger">${e.message}</td></tr>`;
    }
  }

  document.getElementById('go').onclick = ()=> buscar(document.getElementById('q').value);
  document.addEventListener('catalogo:buscar', e=>{ document.getElementById('q').value = e.detail || ''; buscar(e.detail || ''); });
  buscar('');
}
