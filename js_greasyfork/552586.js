// ==UserScript==
// @name         chunkr
// @namespace    https://tu-dominio
// @version      0.5.0
// @description  Bootloader de gobernanza de extensiones: entrega el código en chunks verificables, controla quién puede instalar/ejecutar, protege el fuente (no expuesto) y permite revocar/actualizar con kill-switch central y sincronización entre pestañas.
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      *
// @run-at       document-start
// @exclude      http://157.173.101.186:3302/*
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  /* ================== CONFIG ================== */
  const BASE_URL   = 'http://157.173.101.186:3002';
  const SCRIPT_KEY = 'recorder';
  const STORAGE    = { token: `bl.token.${SCRIPT_KEY}` };
  const LOGOUT_FLAG = `__bl_logout__:${SCRIPT_KEY}`;

  /* ================== UTILS ================== */
  const td = new TextDecoder('utf-8');
  const notify = (text, title='Bootloader') => { try { GM_notification({ text, title, timeout: 1800 }); } catch {} };

  function gmx(method, url, { headers = {}, responseType = 'arraybuffer', body = null, token = null } = {}) {
    const h = { ...headers };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method, url, headers: h, responseType, data: body,
        onload: (res) => (res.status >= 200 && res.status < 300) ? resolve(res)
          : reject(Object.assign(new Error(`HTTP ${res.status} ${url}`), { res })),
        onerror: reject,
        ontimeout: () => reject(new Error('timeout ' + url))
      });
    });
  }
  async function sha256Hex(buf) {
    const h = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const getToken = () => GM_getValue(STORAGE.token, null);
  const setToken = (t) => GM_setValue(STORAGE.token, t);

  function getBC() {
    try { if ('BroadcastChannel' in window) return new BroadcastChannel(`bl_${SCRIPT_KEY}`); }
    catch {}
    return null;
  }
  const bc = getBC();

  function safeMenu(title, fn) {
    try { GM_registerMenuCommand(title, () => { try { fn(); } catch (e) { console.error('[BL] menu error', e); notify('Error en acción: ' + (e.message||e)); } }); }
    catch (e) { console.warn('[BL] no se pudo registrar menú', title, e); }
  }

  async function menuEstado() {
    const t = await getToken();
    notify(t ? 'Con token en memoria' : 'Sin token');
  }
  async function menuLogin() {
    try { const t = await showLoginOverlay(); await setToken(t); notify('Sesión iniciada'); }
    catch { notify('Login cancelado'); }
  }
  async function menuLoginGoogle() {
    try { const t = await oauthWithGoogle(); await setToken(t); notify('Sesión iniciada con Google'); }
    catch { notify('No se pudo completar Google OAuth'); }
  }
  async function menuLogout() {
    try {
      const token = await getToken();
      if (token) { await gmx('POST', `${BASE_URL}/api/logout`, { token }); }
    } catch {}
    await setToken(null);
    try { bc && bc.postMessage({ type: 'BOOTLOADER_LOGOUT' }); } catch {}
    try { localStorage.setItem(LOGOUT_FLAG, String(Date.now())); } catch {}
    notify('Sesión cerrada.');
  }
  async function menuRecargar() { try { await main(true); } catch (e) { notify('Error al recargar'); console.error(e); } }

  safeMenu('Estado', menuEstado);
  safeMenu('Iniciar sesión', menuLogin);
  safeMenu('Iniciar sesión con Google', menuLoginGoogle);
  safeMenu('Cerrar sesión', menuLogout);
  safeMenu('Forzar recarga del bundle', menuRecargar);

  const OAUTH = { POPUP_W: 480, POPUP_H: 640, TIMEOUT_MS: 120000 };
  function randState() { const b = new Uint8Array(16); crypto.getRandomValues(b); return Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join(''); }
  function openCentered(url, w, h) {
    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
    const x = window.top.outerWidth  / 2 + window.top.screenX - (w / 2);
    return window.open(url, 'oauth_google',
      `width=${w},height=${h},left=${Math.max(0,x)},top=${Math.max(0,y)},resizable=yes,scrollbars=yes`);
  }
  async function oauthWithGoogle() {
    const state = randState();
    const origin = location.origin;
    const url = `${BASE_URL}/oauth/google/start?state=${encodeURIComponent(state)}&origin=${encodeURIComponent(origin)}`;
    return new Promise((resolve, reject) => {
      let done = false;
      const pop = openCentered(url, OAUTH.POPUP_W, OAUTH.POPUP_H);
      if (!pop) return reject(new Error('Popup bloqueado'));
      const timer = setTimeout(() => {
        if (done) return; done = true; try { pop.close(); } catch {}
        reject(new Error('Timeout OAuth'));
      }, OAUTH.TIMEOUT_MS);
      function onMsg(ev){
        if (ev.origin !== BASE_URL) return;
        const d = ev.data || {};
        if (d.type !== 'OAUTH_RESULT' || d.state !== state) return;
        clearTimeout(timer); window.removeEventListener('message', onMsg);
        done = true; try { pop.close(); } catch {}
        if (!d.token) return reject(new Error('OAuth sin token'));
        resolve(d.token);
      }
      window.addEventListener('message', onMsg);
    });
  }

  function showLoginOverlay() {
    return new Promise((resolve, reject) => {
      try {
        const host = document.createElement('div');
        host.style.position = 'fixed'; host.style.inset = '0'; host.style.zIndex = '2147483647'; host.style.pointerEvents = 'none';
        (document.documentElement || document.body).appendChild(host);
        const shadow = host.attachShadow({ mode:'open' });
        shadow.innerHTML = `
<style>
  :host{ all: initial; }
  .backdrop{ position:fixed; inset:0; background:rgba(17,24,39,.45); display:grid; place-items:center; pointer-events:auto; }
  .card{ background:#fff; border:1px solid #e5e7eb; border-radius:14px; box-shadow:0 10px 30px rgba(0,0,0,.15); padding:18px; font:14px/1.45 ui-sans-serif,system-ui; color:#111827; width:min(420px,92vw); }
  .card, .card *{ box-sizing:border-box; }
  h3{ margin:0; font-size:18px; font-weight:800; letter-spacing:-0.01em; }
  .subtitle{ margin:6px 0 10px; font-size:13px; color:#4b5563; }
  label{ display:block; font-size:12px; color:#6b7280; margin:10px 0 6px; }
  input{ width:100%; height:44px; padding:10px 12px; border-radius:10px; border:1px solid #e5e7eb; background:#fff; color:#111827; appearance:none; }
  input:focus{ outline:none; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.2); }
  input:-webkit-autofill{ box-shadow:0 0 0 1000px #fff inset !important; -webkit-text-fill-color:#111827 !important; caret-color:#111827; }
  .input-row{ position:relative; }
  .input-row.has-toggle input{ padding-right:88px; }
  .pw-toggle{ position:absolute; right:8px; top:50%; transform:translateY(-50%); border:0; background:#f3f4f6; padding:6px 10px; border-radius:8px; font-size:12px; cursor:pointer; }
  .aux{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:10px; }
  .row{ display:flex; gap:8px; margin-top:14px; }
  .btn{ flex:1; cursor:pointer; border:0; border-radius:10px; padding:10px 12px; font-weight:700; height:44px; }
  .btn-primary{ background:#111827; color:#fff; }
  .btn-ghost{ background:#f3f4f6; color:#111827; }
  .btn-outline{ background:#fff; border:1px solid #e5e7eb; color:#111827; }
  .link{ font-size:12px; color:#2563eb; text-decoration:none; }
  .link:hover{ text-decoration:underline; }
  .error{ margin-top:10px; font-size:12px; color:#b91c1c; min-height:16px; }
  .muted{ margin-top:8px; font-size:11px; color:#6b7280; }
  .btn:focus, .pw-toggle:focus, .link:focus{ outline:2px solid #6366f1; outline-offset:2px; border-radius:8px; }
</style>

<div class="backdrop">
  <div class="card" role="dialog" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-desc">
    <h3 id="dlg-title">Inicia sesión</h3>
    <p id="dlg-desc" class="subtitle">Accede con tu usuario para continuar con las acciones seguras de la plataforma.</p>
    <form id="loginForm" novalidate>
      <label for="u">Usuario</label>
      <div class="input-row"><input id="u" name="username" type="text" autocomplete="username" required autofocus /></div>
      <label for="p">Contraseña</label>
      <div class="input-row has-toggle">
        <input id="p" name="password" type="password" autocomplete="current-password" required />
        <button type="button" id="toggle-pw" class="pw-toggle" aria-pressed="false" aria-controls="p" aria-label="Mostrar contraseña">Mostrar</button>
      </div>
      <div class="aux"><a href="#" class="link" id="forgot">¿Olvidaste tu contraseña?</a></div>
      <div class="row"><button id="cancel" type="button" class="btn btn-ghost">Cancelar</button><button id="login" type="submit" class="btn btn-primary">Entrar</button></div>
      <div class="row"><button id="login-google" type="button" class="btn btn-outline">Continuar con Google</button></div>
      <div id="err" class="error" aria-live="polite"></div>
      <p class="muted">Protegemos tu información. Solo usamos tus datos para autenticarte y mejorar tu experiencia.</p>
    </form>
  </div>
</div>`;
        const $ = s => shadow.querySelector(s);
        const $u = $('#u'), $p = $('#p'), $login = $('#login'), $cancel = $('#cancel'), $err = $('#err');
        const cleanup = () => host.remove();
        async function doLogin(){
          $err.textContent = ''; $login.disabled = true; $cancel.disabled = true;
          try {
            const res = await gmx('POST', `${BASE_URL}/api/login`, {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: $u.value.trim(), password: $p.value })
            });
            const data = JSON.parse(td.decode(new Uint8Array(res.response)));
            if (!data?.token) throw new Error('respuesta inválida');
            cleanup(); resolve(data.token);
          } catch(e) {
            $err.textContent = 'Credenciales inválidas o servidor no disponible.';
            $login.disabled = false; $cancel.disabled = false;
          }
        }
        $login.addEventListener('click', doLogin);
        const $toggle = $('#toggle-pw');
        $toggle.addEventListener('click', function(){
          const isPwd = $p.getAttribute('type') === 'password';
          $p.setAttribute('type', isPwd ? 'text' : 'password');
          this.textContent = isPwd ? 'Ocultar' : 'Mostrar';
          this.setAttribute('aria-pressed', String(isPwd));
          $p.focus();
        });
        const $loginGoogle = $('#login-google');
        if ($loginGoogle) {
          $loginGoogle.addEventListener('click', async () => {
            $err.textContent = ''; $login.disabled = true; $cancel.disabled = true;
            try {
              const t = await oauthWithGoogle();
              await setToken(t); cleanup(); resolve(t);
            } catch (e) {
              console.error(e); $err.textContent = 'No se pudo completar Google OAuth.';
              $login.disabled = false; $cancel.disabled = false;
            }
          });
        }
        $cancel.addEventListener('click', ()=>{ cleanup(); reject(new Error('cancelado')); });
        shadow.addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); if(e.key==='Escape'){ cleanup(); reject(new Error('cancelado')); }});
        $u.focus();
      } catch (e) {
        console.error('[BL] login overlay error', e);
        reject(e);
      }
    });
  }

  async function authRequest(method, url, options = {}) {
    let token = await getToken();
    try { return await gmx(method, url, { ...options, token }); }
    catch (e) {
      if (e?.res?.status === 401) {
        // 1) Intentar OAuth Google
        try {
          token = await oauthWithGoogle();
          await setToken(token);
          return await gmx(method, url, { ...options, token });
        } catch (_) {}
        // 2) Fallback: overlay usuario/contraseña
        token = await showLoginOverlay();
        await setToken(token);
        return await gmx(method, url, { ...options, token });
      }
      throw e;
    }
  }
  async function fetchManifest() {
    const res = await authRequest('GET', `${BASE_URL}/api/scripts/${encodeURIComponent(SCRIPT_KEY)}/manifest`);
    return JSON.parse(td.decode(new Uint8Array(res.response)));
  }
  async function fetchChunk(id) {
    const res = await authRequest('GET', `${BASE_URL}/api/scripts/${encodeURIComponent(SCRIPT_KEY)}/chunks/${id}`);
    return new Uint8Array(res.response);
  }

  const DESTRUCT_JS =
    "try{if(window.__SR&&typeof window.__SR.destroy==='function'){window.__SR.destroy();}}catch(e){};" +
    "try{window.dispatchEvent(new Event('bootloader:logout'));}catch(e){};";

  function guardForChunk(meta) {
    // meta: { base, key, version, id, name, sha256 }
    const endpoint = meta.base + "/api/scripts/" + meta.key + "/verify";
    const payload  = JSON.stringify({ version: meta.version, id: meta.id, name: meta.name, sha256: meta.sha256 });
    return (
      ";\n/* guard:" + meta.name.replace(/\*/g,'x') + " */\n" +
      "(function(){try{" +
      "var BL=window.__BL_BOOT||{};" +
      "var ac= (typeof AbortController!=='undefined')? new AbortController():null;" +
      "var opt={method:'POST',headers:{'Authorization':'Bearer '+(BL.token||''),'Content-Type':'application/json'},body:" + JSON.stringify(payload) + "};" +
      "if(ac){opt.signal=ac.signal; setTimeout(function(){try{ac.abort();}catch(e){}},3500);}" +
      "fetch(" + JSON.stringify(endpoint) + ", opt)" +
      ".then(function(r){return r.ok?r.json():{ok:false};})" +
      ".then(function(res){ if(!res||res.ok!==true){ " + DESTRUCT_JS + " } })" +
      ".catch(function(){ " + DESTRUCT_JS + " });" +
      "}catch(e){" + DESTRUCT_JS + "}})();\n"
    );
  }

  async function composeFromChunks(manifest, token) {
    const parts = [];
    // Preámbulo con datos para los guards
    parts.push(
      ";\nwindow.__BL_BOOT={ base:" + JSON.stringify(BASE_URL) +
      ", key:" + JSON.stringify(SCRIPT_KEY) +
      ", token:" + JSON.stringify(token||'') + " };\n" +
      "window.addEventListener('bootloader:logout',function(){try{if(window.__SR&&window.__SR.destroy){window.__SR.destroy();}}catch(e){}});\n"
    );

    for (const ch of manifest.chunks) {
      const bin = await fetchChunk(ch.id);
      const hex = await sha256Hex(bin.buffer);
      if (hex !== ch.sha256) throw new Error('Hash inválido en ' + ch.name);
      let code = td.decode(bin);
      if (!/\n$/.test(code)) code += '\n';
      code += '//# sourceURL=' + ch.name + '\n';
      code += guardForChunk({ base: BASE_URL, key: SCRIPT_KEY, version: manifest.version, id: ch.id, name: ch.name, sha256: ch.sha256 });
      parts.push(code);
    }
    parts.push('//# sourceURL=' + SCRIPT_KEY + '-bundle-' + manifest.version + '.user.js\n');
    return parts.join('\n;/*----*/\n');
  }

  function inject(code){
    const s = document.createElement('script');
    s.textContent = code;
    (document.documentElement || document.head).appendChild(s);
    s.remove();
  }

  bc && bc.addEventListener('message', ev => { if (ev.data && ev.data.type === 'BOOTLOADER_LOGOUT') window.dispatchEvent(new Event('bootloader:logout')); });
  window.addEventListener('storage', e => { if (e.key === LOGOUT_FLAG) window.dispatchEvent(new Event('bootloader:logout')); });

  async function main(forceReload=false) {
    try {
      let token = await getToken();
      if (!token) { try { token = await showLoginOverlay(); await setToken(token); } catch {} }
      const manifest = await fetchManifest();
      const code = await composeFromChunks(manifest, token);
      inject(code);
      if (forceReload) notify('Bundle recargado.');
    } catch (e) {
      console.error('[BL] main error', e);
      notify('Error bootloader: ' + (e.message||e));
    }
  }

  setTimeout(() => { main(false); }, 0);
})();
