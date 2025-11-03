import API from '/js/api.js';

export default async function(view){
  // Helper function to scope DOM queries within this view
  const $ = (q) => view.querySelector(q);
  view.innerHTML = `
  <div class="card p-3">
    <h4>Cotización POS</h4>
    <div class="row g-3">
      <div class="col-md-3"><label class="form-label">Número</label><input id="number" class="form-control" value="COT-0001"></div>
      <div class="col-md-3"><label class="form-label">Tienda</label><input id="store" type="number" class="form-control" value="1"></div>
      <div class="col-md-3"><label class="form-label">Cliente</label><input id="cust" type="number" class="form-control" value="1"></div>
      <div class="col-md-3"><label class="form-label">Vigencia</label><input id="valid" type="date" class="form-control" value="2025-12-30"></div>
    </div>
    <hr>
    <table class="table table-sm" id="tb"><thead><tr><th>Prod</th><th>Cant</th><th>Precio</th><th></th></tr></thead><tbody></tbody></table>
    <button class="btn btn-outline-secondary btn-sm" id="add">Agregar ítem</button>
    <hr>
    <div class="d-flex gap-2">
      <button class="btn btn-primary" id="crear">Crear</button>
      <button class="btn btn-outline-primary" id="pdf">PDF</button>
      <a id="pdfHint" class="badge badge-soft" target="_blank" style="display:none"></a>
    </div>
    <div id="msg" class="mt-2 text-muted small"></div>
  </div>`;

  const tb = $('#tb tbody');
  const addRow = (pid = 5, qty = 2, price = 150) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input class="form-control form-control-sm" value="${pid}"></td>
      <td><input class="form-control form-control-sm" value="${qty}"></td>
      <td><input class="form-control form-control-sm" value="${price}"></td>
      <td><button class="btn btn-sm btn-light">X</button></td>`;
    tr.querySelector('button').onclick = ()=> tr.remove();
    tb.appendChild(tr);
  };
  addRow(); addRow(1, 3, 25);
  $('#add').onclick = () => addRow();

  $('#crear').onclick = async () => {
    const msg = $('#msg');
    const number = $('#number').value.trim();
    const storeId = Number($('#store').value);
    const customerId = Number($('#cust').value);
    const valid_until = $('#valid').value;
    const items = [...tb.querySelectorAll('tr')].map(tr => {
      const [pid, qty, price] = [...tr.querySelectorAll('input')].map(x => Number(x.value));
      return { productId: pid, quantity: qty, unit_price: price };
    });
    try {
      const r = await API.crearCotizacion({ number, storeId, customerId, valid_until, items });
      msg.textContent = 'OK. Total Q ' + r.total;
    } catch (e) {
      msg.textContent = e.message;
    }
  };

  $('#pdf').onclick = async () => {
    const number = $('#number').value.trim();
    await API.cotizacionPDF(number);
    const safe = number.replaceAll('/', '-');
    const a = $('#pdfHint');
    a.href = `/exports/cotizacion-${safe}.pdf`;
    a.style.display = 'inline-block';
    a.textContent = `Abrir PDF (cotizacion-${safe}.pdf)`;
  };
}
