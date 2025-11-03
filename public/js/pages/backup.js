import API from '/js/api.js';

export default async function(view){
  view.innerHTML = `
  <div class="card p-3">
    <h4>Respaldo</h4>
    <p>Genera una copia del archivo SQLite en la carpeta <code>/backups</code>.</p>
    <button class="btn btn-danger" id="go">Crear backup</button>
    <div id="msg" class="mt-2 small text-muted"></div>
  </div>`;

  document.getElementById('go').onclick = async ()=>{
    const msg = document.getElementById('msg');
    msg.textContent = 'Trabajando...';
    try { const r = await API.backup(); msg.textContent = 'OK: ' + JSON.stringify(r); }
    catch(e){ msg.textContent = e.message; }
  };
}
