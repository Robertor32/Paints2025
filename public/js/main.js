/*
 * Entry point and simple SPA router for Paints2025.
 *
 * This script loads the appropriate page module based on the current
 * hash in the URL.  It also implements a very basic login flow.
 */

import API from './api.js';
import Dashboard from './pages/dashboard.js';
import Ventas from './pages/ventas.js';
import Cotizaciones from './pages/cotizaciones.js';
import Ingresos from './pages/ingresos.js';
import Inventario from './pages/inventario.js';
import Catalogo from './pages/catalogo.js';
import Reportes from './pages/reportes.js';
import Backup from './pages/backup.js';

// Main view container where pages will render themselves
const view = document.getElementById('appView');

/**
 * Inline login form for when the user is not authenticated.
 * Renders a simple form into the main view and attempts to log in
 * via the API when submitted.
 */
async function renderLogin() {
  view.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="card p-4 mt-4">
          <h4>Iniciar sesión</h4>
          <div class="mb-2">
            <label class="form-label">Correo</label>
            <input id="email" class="form-control" value="caja@paint.com">
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input id="pass" type="password" class="form-control" value="123456">
          </div>
          <button id="btnLogin" class="btn btn-primary">Entrar</button>
          <div id="msg" class="mt-2 text-muted small"></div>
        </div>
      </div>
    </div>`;
  document.getElementById('btnLogin').onclick = async () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('pass').value.trim();
    const msg = document.getElementById('msg');
    msg.textContent = 'Autenticando…';
    try {
      const r = await API.login(email, pass);
      msg.textContent = 'Sesión iniciada';
      // After login go to dashboard
      location.hash = '#dashboard';
    } catch (err) {
      msg.textContent = err.message;
    }
  };
}

/**
 * Ensures the user is logged in.  If not, renders the login page and
 * returns false.  Once authenticated returns true.
 */
async function requireLogin() {
  if (!API.token) {
    await renderLogin();
    return false;
  }
  return true;
}

/**
 * Main router.  Determines which module to load based on the hash.
 */
async function render() {
  const route = (location.hash || '#dashboard').toLowerCase();
  // Highlight active sidebar link
  document.querySelectorAll('.sidebar .nav-link').forEach(a => {
    const target = a.getAttribute('href') || '';
    a.classList.toggle('active', target.toLowerCase() === route);
  });

  // Logout route clears token and returns to login
  if (route === '#logout') {
    API.setToken(null);
    location.hash = '#login';
    await render();
    return;
  }

  // Ensure login for all pages except login itself
  if (route !== '#login' && !(await requireLogin())) {
    return;
  }

  switch (route) {
    case '#dashboard':
      await Dashboard(view);
      break;
    case '#ventas':
      await Ventas(view);
      break;
    case '#cotizaciones':
      await Cotizaciones(view);
      break;
    case '#ingresos':
      await Ingresos(view);
      break;
    case '#inventario':
      await Inventario(view);
      break;
    case '#catalogo':
      await Catalogo(view);
      break;
    case '#reportes':
      await Reportes(view);
      break;
    case '#backup':
      await Backup(view);
      break;
    case '#login':
      await renderLogin();
      break;
    default:
      view.innerHTML = '<div class="alert alert-warning">Sección no encontrada</div>';
  }
}

// Re-render when the hash changes
window.addEventListener('hashchange', render);

// Initial render
render();
