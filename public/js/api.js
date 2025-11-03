/*
 * API helper for Paints2025.
 *
 * Provides a thin wrapper around the browser's fetch API to call the
 * backend endpoints.  It automatically sends the JSON body and parses
 * JSON responses.  When logged in it will also include the JWT token in
 * the Authorization header.  You can extend this helper with
 * additional methods as you add new endpoints.
 */

const API = {
  /**
   * Base URL for all requests.  Uses the current origin so the app
   * works regardless of whether it's running locally or deployed.
   */
  base: location.origin,

  /**
   * JSON Web Token for authenticated requests.  Persisted in
   * localStorage so the session survives page reloads.
   */
  token: localStorage.getItem('paints_token') || null,

  /**
   * Set the JWT token in memory and localStorage.
   * @param {string|null} t new token, or null to clear
   */
  setToken(t) {
    this.token = t;
    if (t) {
      localStorage.setItem('paints_token', t);
    } else {
      localStorage.removeItem('paints_token');
    }
  },

  /**
   * Generic request helper.  Sends a request to the given path and
   * returns the parsed JSON response (or raw text if not JSON).
   *
   * @param {string} path path relative to the API root (e.g. '/auth/login')
   * @param {RequestInit} opts fetch options (method, body, headers, etc.)
   */
  async request(path, opts = {}) {
    const headers = opts.headers || {};
    // Set JSON header unless uploading form data
    if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    // Include token if present
    if (this.token) {
      headers['Authorization'] = 'Bearer ' + this.token;
    }
    const res = await fetch(this.base + path, { ...opts, headers });
    if (!res.ok) {
      let msg = 'HTTP ' + res.status;
      // Try to parse JSON error message
      try {
        const err = await res.json();
        msg = err.error || JSON.stringify(err);
      } catch {
        // ignore if not JSON
      }
      throw new Error(msg);
    }
    // Determine if response is JSON
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      return await res.json();
    }
    // Default to text
    return await res.text();
  },

  /**
   * Log in with email and password.  Saves the returned token for
   * subsequent requests.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  },

  /**
   * Fetch sales aggregated by store.
   */
  ventasPorTienda() {
    return this.request('/reportes/tiendas/ventas');
  },

  /**
   * Fetch inventory grouped by store.
   */
  inventarioPorTienda() {
    return this.request('/reportes/tiendas/inventario');
  },

  /**
   * Fetch summary of payments by method (optionally with a query string).
   * @param {string} qs Query string starting with '?' (optional)
   */
  mediosPago(qs = '') {
    return this.request('/reportes/medios-pago' + qs);
  },

  /**
   * Fetch catalog items (optionally filter by query string).
   * @param {string} q search term
   */
  catalogo(q = '') {
    const s = q ? ('?q=' + encodeURIComponent(q)) : '';
    return this.request('/catalogo/productos' + s);
  },

  /**
   * Create a new invoice (factura).
   * @param {Object} body invoice payload
   */
  crearFactura(body) {
    return this.request('/facturas', { method: 'POST', body: JSON.stringify(body) });
  },

  /**
   * Create a new quotation (cotización).
   * @param {Object} body quotation payload
   */
  crearCotizacion(body) {
    return this.request('/cotizaciones', { method: 'POST', body: JSON.stringify(body) });
  },

  /**
   * Generate a PDF for a quotation.  The server will create the file
   * if it doesn't already exist.  Returns a JSON with file name or
   * other info.
   * @param {string} number quotation identifier
   */
  cotizacionPDF(number) {
    return this.request('/cotizaciones/' + encodeURIComponent(number) + '/pdf');
  },

  /**
   * Create a new inventory entry (ingreso).
   * @param {Object} body ingress payload
   */
  crearIngreso(body) {
    return this.request('/ingresos', { method: 'POST', body: JSON.stringify(body) });
  },

  /**
   * Trigger a backup of the database.  The server will write the
   * SQLite file into the backups folder and return a status object.
   */
  backup() {
    return this.request('/backup', { method: 'POST' });
  },
};

export default API;