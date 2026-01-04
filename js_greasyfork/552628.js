// ==UserScript==
// @name         YouTube Subscription Manager (ES)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @namespace    http://tampermonkey.net/
// @version      2.2-es
// @description  Cancelar suscripciones individuales o en lote en /feed/channels. Muestra resumen y permite descargar un .md con tabla.
// @author       Baarometh
// @match        https://www.youtube.com/feed/channels
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/552628/YouTube%20Subscription%20Manager%20%28ES%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552628/YouTube%20Subscription%20Manager%20%28ES%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===== utilidades ===== */
  const esperar = (ms) => new Promise(r => setTimeout(r, ms));
  const normalizar = (s) => (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  const click = (el) => el && el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,buttons:1}));

  // limpia celdas para Markdown: sin saltos y con pipes escapados
  const limpiarCeldaMD = (s) => String(s ?? '')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();

  /* ===== vocabulario ===== */
  const txtDesuscribir = ['unsubscribe','anular','anular suscripcion','cancelar suscripcion','darse de baja','quitar suscripcion'].map(normalizar);
  const txtConfirmar   = ['unsubscribe','anular suscripcion','anular','confirmar','aceptar'].map(normalizar);

  /* ===== selectores ===== */
  const sel = {
    campana: '#notification-preference-button button, #notification-preference-button yt-icon-button button',
    suscrito: 'ytd-subscribe-button-renderer button, #subscribe-button button',
    confirmFijo: '#confirm-button button',
    menusAbiertos: 'tp-yt-iron-dropdown[opened], ytd-menu-popup-renderer[slot="dropdown-content"]',
    itemsMenu: 'tp-yt-paper-item, ytd-menu-service-item-renderer, tp-yt-paper-listbox tp-yt-paper-item',
    acciones: '#buttons',
    tarjeta: 'ytd-channel-renderer',
    raiz: 'ytd-page-manager'
  };

  /* ===== estado ===== */
  const eventos = [];  // {nombre, url, fechaIso, fechaLocal, estado}

  /* ===== helpers DOM ===== */
  const menuAbierto = () => {
    const m = Array.from(document.querySelectorAll(sel.menusAbiertos));
    return m.length ? m[m.length - 1] : document;
  };

  const buscarOpcionDesuscribir = (raiz) => {
    const items = Array.from(raiz.querySelectorAll(sel.itemsMenu));
    for (const it of items) {
      const lab = it.querySelector('yt-formatted-string, .label') || it;
      if (txtDesuscribir.includes(normalizar(lab.textContent))) return it;
    }
    return null;
  };

  const botonConfirmar = () => {
    const fijo = document.querySelector(sel.confirmFijo);
    if (fijo) return fijo;
    const cand = Array.from(document.querySelectorAll('tp-yt-paper-dialog button, ytd-popup-container tp-yt-paper-button, yt-button-renderer button'));
    return cand.find(b => txtConfirmar.some(w => normalizar(b.textContent).includes(w))) || null;
  };

  // nombre real del canal desde el título; evita arrastrar descripciones
  function obtenerNombreCanal(tarjeta) {
    const candidatos = [
      'ytd-channel-name #text',
      'ytd-channel-name yt-formatted-string#text',
      'yt-formatted-string.ytd-channel-name',
      'a#main-link > yt-formatted-string',
      '#channel-title'
    ];
    for (const s of candidatos) {
      const el = tarjeta.querySelector(s);
      if (el && el.innerText && el.innerText.trim()) {
        return el.innerText.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }
    const img = tarjeta.querySelector('img[alt]');
    if (img?.alt?.trim()) return img.alt.trim();
    const a = tarjeta.querySelector('a#main-link, a[href*="/@"]');
    const m = a?.href?.match(/\/@([^\/]+)/);
    if (m) return `@${decodeURIComponent(m[1])}`;
    return 'Canal';
  }

  function obtenerUrl(tarjeta) {
    const a = tarjeta.querySelector('a#main-link, a[href*="/@"], a[href^="/channel/"]');
    if (!a?.href) return '';
    try { return new URL(a.getAttribute('href'), location.origin).href; } catch { return a.href; }
  }

  /* ===== flujo por canal ===== */
  const abrirMenu = async (tarjeta) => {
    let b = tarjeta.querySelector(sel.campana) || tarjeta.querySelector(sel.suscrito);
    if (!b) return null;
    click(b);
    await esperar(250);
    return menuAbierto();
  };

  const desuscribirCanal = async (tarjeta) => {
    const nombre = obtenerNombreCanal(tarjeta);
    const url = obtenerUrl(tarjeta);

    tarjeta.scrollIntoView({behavior:'smooth', block:'center'});
    await esperar(150);

    const menu = await abrirMenu(tarjeta);
    if (!menu) return;

    let item = buscarOpcionDesuscribir(menu);
    if (!item) { await esperar(250); item = buscarOpcionDesuscribir(menuAbierto()); }
    if (!item) return;

    click(item);
    await esperar(300);

    let btn = botonConfirmar();
    if (!btn) { await esperar(300); btn = botonConfirmar(); }
    if (btn) {
      click(btn);
      eventos.push({
        nombre,
        url,
        fechaIso: new Date().toISOString(),
        fechaLocal: new Date().toLocaleString(),
        estado: 'Desuscrito'
      });
    }
  };

  /* ===== resumen + descarga Markdown ===== */
  function generarMarkdown() {
    const total = eventos.length;
    const fecha = new Date().toLocaleString();

    let md = `# Resumen de desuscripciones en YouTube\n\n`;
    md += `- Fecha de ejecucion: ${limpiarCeldaMD(fecha)}\n`;
    md += `- Total de canales: **${total}**\n\n`;
    md += `| # | Canal | URL | Fecha | Estado |\n`;
    md += `|---:|---|---|---|---|\n`;

    eventos.forEach((e, i) => {
      const nombre = limpiarCeldaMD(e.nombre);
      const url = limpiarCeldaMD(e.url);
      const fechaLocal = limpiarCeldaMD(e.fechaLocal);
      const estado = limpiarCeldaMD(e.estado);
      md += `| ${i + 1} | [${nombre}](${url || '#'}) | ${url} | ${fechaLocal} | ${estado} |\n`;
    });

    return md + '\n';
  }

  function descargarMarkdown() {
    const contenido = generarMarkdown();
    const blob = new Blob([contenido], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fecha = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
    a.href = url;
    a.download = `desuscripciones-${fecha}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function mostrarResumen() {
    const total = eventos.length;
    const vista = eventos.slice(0, 15);

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:center;justify-content:center;';

    const modal = document.createElement('div');
    modal.style.cssText = 'width:min(640px,90vw);max-height:80vh;background:#fff;color:#0f0f0f;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.35);display:flex;flex-direction:column;';

    const header = document.createElement('div');
    header.style.cssText = 'padding:16px 20px;border-bottom:1px solid #e5e5e5;font-weight:700;font-size:16px;';
    header.textContent = `Te has desuscrito de ${total} canal${total!==1?'es':''}`;

    const cuerpo = document.createElement('div');
    cuerpo.style.cssText = 'padding:12px 20px;overflow:auto;flex:1;';
    const ul = document.createElement('ul');
    ul.style.cssText = 'margin:8px 0;padding-left:18px;';
    vista.forEach(e => { const li = document.createElement('li'); li.textContent = e.nombre; ul.appendChild(li); });
    cuerpo.appendChild(ul);
    if (eventos.length > vista.length) {
      const extra = document.createElement('div');
      extra.style.cssText = 'color:#606060;font-size:12px;';
      extra.textContent = `…y ${eventos.length - vista.length} más.`;
      cuerpo.appendChild(extra);
    }

    const acciones = document.createElement('div');
    acciones.style.cssText = 'padding:12px 20px;border-top:1px solid #e5e5e5;display:flex;gap:12px;justify-content:flex-end;';

    const btnMd = document.createElement('button');
    btnMd.textContent = 'Descargar .md';
    btnMd.style.cssText = 'background:#e5e5e5;color:#0f0f0f;border:none;padding:10px 14px;border-radius:4px;font-weight:600;cursor:pointer;';
    btnMd.addEventListener('click', descargarMarkdown);

    const btnOk = document.createElement('button');
    btnOk.textContent = 'Aceptar';
    btnOk.style.cssText = 'background:#FF0000;color:#fff;border:none;padding:10px 16px;border-radius:4px;font-weight:700;cursor:pointer;';
    btnOk.addEventListener('click', () => overlay.remove());

    acciones.appendChild(btnMd);
    acciones.appendChild(btnOk);

    modal.appendChild(header);
    modal.appendChild(cuerpo);
    modal.appendChild(acciones);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  /* ===== lote ===== */
  async function desuscribirSeleccionados() {
    eventos.length = 0;
    const checks = document.querySelectorAll('.casilla-desuscribir:checked');
    for (const c of checks) {
      const tarjeta = c.closest(sel.tarjeta);
      if (tarjeta) {
        await desuscribirCanal(tarjeta);
        await esperar(600);
      }
    }
    mostrarResumen();
  }

  /* ===== UI ===== */
  function asegurarBotonFlotante() {
    if (document.querySelector('#boton-desuscribir-lote')) return;
    const b = document.createElement('button');
    b.id = 'boton-desuscribir-lote';
    b.textContent = 'Cancelar suscripciones seleccionadas';
    b.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:#FF0000;color:#fff;border:none;padding:12px 16px;font-size:14px;font-weight:600;border-radius:4px;cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.2);';
    b.addEventListener('click', desuscribirSeleccionados);
    document.body.appendChild(b);
  }

  function decorarTarjeta(t) {
    if (!t.querySelector('.boton-desuscribir')) {
      const b = document.createElement('button');
      b.className = 'boton-desuscribir';
      b.textContent = 'Cancelar suscripción';
      b.style.cssText = 'margin-left:12px;padding:8px 12px;background:#FF0000;color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;transition:filter .2s;';
      b.addEventListener('mouseover',()=>{b.style.filter='brightness(.9)';});
      b.addEventListener('mouseout',()=>{b.style.filter='';});
      b.addEventListener('click',()=>desuscribirCanal(t));
      (t.querySelector(sel.acciones) || t).appendChild(b);
    }
    if (!t.querySelector('.casilla-desuscribir')) {
      const c = document.createElement('input');
      c.type = 'checkbox';
      c.title = 'Seleccionar canal';
      c.className = 'casilla-desuscribir';
      c.style.cssText = 'margin-left:10px;transform:scale(1.4);cursor:pointer;';
      (t.querySelector(sel.acciones) || t).appendChild(c);
    }
  }

  function montarUI() {
    document.querySelectorAll(sel.tarjeta).forEach(decorarTarjeta);
    asegurarBotonFlotante();
  }

  async function autodesplazar() {
    const cont = document.querySelector('ytd-section-list-renderer, ytd-two-column-browse-results-renderer') || document.scrollingElement;
    if (!cont) return;
    cont.scrollTop = cont.scrollHeight;
    await esperar(250);
  }

  /* ===== arranque ===== */
  montarUI();
  new MutationObserver(montarUI).observe(document.querySelector(sel.raiz) || document.body, { childList:true, subtree:true });

  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'boton-desuscribir-lote') autodesplazar();
  });
})();
