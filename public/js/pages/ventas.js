import API from '/js/api.js';

export default async function(view){
  // Helper function to scope DOM queries within the current view
  const $ = (q) => view.querySelector(q);
  view.innerHTML = `
  <div class="card p-3">
    <h4>Venta rápida</h4>
    <div class="row g-3">
      <div class="col-md-2"><label class="form-label">Serie</label><input id="serie" class="form-control" value="A"></div>
      <div class="col-md-3"><label class="form-label">Número</label><input id="numero" class="form-control" value="F-0002"></div>
      <div class="col-md-2"><label class="form-label">Tienda</label><input id="store" type="number" class="form-control" value="1"></div>
      <div class="col-md-2"><label class="form-label">Cliente</label><input id="cust" type="number" class="form-control" value="1"></div>
      <div class="col-md-3"><label class="form-label">Cajero</label><input id="cashier" type="number" class="form-control" value="1"></div>
    </div>
    <hr>
    <table class="table table-sm" id="tb">
      <thead><tr><th>Prod</th><th>Cant</th><th>Precio</th><th></th></tr></thead>
      <tbody></tbody>
    </table>
    <button class="btn btn-outline-secondary btn-sm" id="add">Agregar ítem</button>
    <hr>
    <div class="row g-2">
      <div class="col-md-3"><label class="form-label">Pago Efectivo</label><input id="pagoEf" class="form-control" value="200"></div>
      <div class="col-md-3"><label class="form-label">Pago Tarjeta</label><input id="pagoTj" class="form-control" value="175"></div>
      <div class="col-md-6 d-flex align-items-end justify-content-end"><button class="btn btn-primary" id="ok">Crear factura</button></div>
    </div>
    <div id="msg" class="mt-2 text-muted small"></div>
  </div>`;

  const tb = $('#tb tbody');
  const addRow = (pid=5,qty=2,price=150)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input class="form-control form-control-sm" value="${pid}"></td>
      <td><input class="form-control form-control-sm" value="${qty}"></td>
      <td><input class="form-control form-control-sm" value="${price}"></td>
      <td><button class="btn btn-sm btn-light">X</button></td>`;
    tr.querySelector('button').onclick = ()=> tr.remove();
    tb.appendChild(tr);
  };
  addRow(); addRow(1,3,25);
  $('#add').onclick = () => addRow();

  $('#ok').onclick = async () => {
    const msg = $('#msg');
    const items = [...tb.querySelectorAll('tr')].map(tr => {
      const [pid, qty, price] = [...tr.querySelectorAll('input')].map(x => Number(x.value));
      return { productId: pid, quantity: qty, unit_price: price };
    });
    const total = items.reduce((a, i) => a + i.quantity * i.unit_price, 0);
    const ef = Number($('#pagoEf').value || 0);
    const tj = Number($('#pagoTj').value || 0);
    // Use a tolerance when comparing sums to account for floating point errors
    if (Math.abs((ef + tj) - total) > 0.005) { msg.textContent = 'Los pagos deben sumar Q ' + total; return; }

    try{
      const body = {
        series: $('#serie').value,
        number: $('#numero').value,
        storeId: Number($('#store').value),
        customerId: Number($('#cust').value),
        cashierId: Number($('#cashier').value),
        items,
        payments: [ { method: 'efectivo', amount: ef }, { method: 'tarjeta', amount: tj } ],
      };
      const r = await API.crearFactura(body);
      msg.textContent = 'OK. Total Q ' + r.total + ' | invoice ' + r.invoice;
    }catch(e){ msg.textContent = e.message; }
  };
}
