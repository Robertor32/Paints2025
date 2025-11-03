import API from '/js/api.js';

export default async function(view){
  // Helper to scope queries within this view
  const $ = (q) => view.querySelector(q);
  view.innerHTML = `
  <div class="card p-3">
    <h4>Respaldo</h4>
    <p>Genera una copia del archivo SQLite en la carpeta <code>/backups</code>.</p>
    <button class="btn btn-danger" id="go">Crear backup</button>
    <div id="msg" class="mt-2 small text-muted"></div>
  </div>`;

  // Bind click event using scoped selectors
  $('#go').onclick = async () => {
    const msg = $('#msg');
    msg.textContent = 'Trabajando...';
    try {
      const r = await API.backup();
      msg.textContent = 'OK: ' + JSON.stringify(r);
    } catch (e) {
      msg.textContent = e.message;
    }
  };
}
