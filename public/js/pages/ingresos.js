import API from '/js/api.js';

export default async function(view){
  view.innerHTML = `
  <div class="card p-3">
    <h4>Ingreso a inventario</h4>
    <div class="row g-3">
      <div class="col-md-3"><label class="form-label">Proveedor</label><input id="supp" class="form-control" value="1"></div>
      <div class="col-md-3"><label class="form-label">Tienda</label><input id="store" class="form-control" value="1"></div>
      <div class="col-md-6"><label class="form-label">Notas</label><input id="notes" class="form-control" value="Reposición fin de mes"></div>
    </div>
    <hr>
    <table class="table table-sm" id="tb"><thead><tr><th>Prod</th><th>Cant</th><th>Costo</th><th></th></tr></thead><tbody></tbody></table>
    <button class="btn btn-outline-secondary btn-sm" id="add">Agregar ítem</button>
    <hr>
    <button class="btn btn-primary" id="ok">Registrar ingreso</button>
    <div id="msg" class="mt-2 text-muted small"></div>
  </div>`;

  const tb = document.querySelector('#tb tbody');
  const addRow = (pid=5,qty=10,c=120)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input class="form-control form-control-sm" value="${pid}"></td>
      <td><input class="form-control form-control-sm" value="${qty}"></td>
      <td><input class="form-control form-control-sm" value="${c}"></td>
      <td><button class="btn btn-sm btn-light">X</button></td>`;
    tr.querySelector('button').onclick = ()=> tr.remove();
    tb.appendChild(tr);
  };
  addRow(); addRow(1,25,20);
  document.getElementById('add').onclick = ()=> addRow();

  document.getElementById('ok').onclick = async ()=>{
    const items = [...tb.querySelectorAll('tr')].map(tr=>{
      const [p,q,c] = [...tr.querySelectorAll('input')].map(x=>Number(x.value));
      return { productId:p, quantity:q, unit_cost:c };
    });
    const body = { supplierId:Number(document.getElementById('supp').value), storeId:Number(document.getElementById('store').value), items, notes:document.getElementById('notes').value };
    const msg = document.getElementById('msg');
    try { const r = await API.crearIngreso(body); msg.textContent = 'OK: ' + JSON.stringify(r); }
    catch(e){ msg.textContent = e.message; }
  };
}
