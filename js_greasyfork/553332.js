// ==UserScript==
// @namespace   mercado-libre-plox
// @name        Mercado Libre Plox
// @name:en     Mercado Libre Plox
// @description Oculta o marca productos Internacionales en Mercado Libre (Chile).
// @description:en Hide or mark international products in Mercado Libre (Chile).
// @version     0.0.1
// @author      Alplox
// @match       *://*.mercadolibre.cl/*
// @grant       none
// @icon        https://www.mercadolibre.cl/favicon.ico
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/553332/Mercado%20Libre%20Plox.user.js
// @updateURL https://update.greasyfork.org/scripts/553332/Mercado%20Libre%20Plox.meta.js
// ==/UserScript==

(function (d) {
  'use strict';
  // === Íconos SVG ===
  const iconOcultos = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="none" viewBox="0 0 24 24"><path fill="#0F1729" fill-rule="evenodd" d="M3.61 4.21A1 1 0 0 0 2.4 5.8l2.27 1.77c-.88.99-1.63 2.12-2.24 3.34l-.02.04c-.1.18-.21.41-.27.7-.04.23-.04.5 0 .72.06.29.18.52.27.7l.02.04C4.36 16.96 7.72 20 12 20c2.23 0 4.21-.83 5.87-2.16l2.52 1.95a1 1 0 1 0 1.22-1.58l-18-14Zm12.63 12.36-1.8-1.4a4 4 0 0 1-6.12-4.76L6.25 8.8A13.29 13.29 0 0 0 4.1 12l.04.07.06.13C5.96 15.7 8.77 18 12 18a7.2 7.2 0 0 0 4.24-1.43Zm-6.22-4.84L10 12a2 2 0 0 0 2.75 1.85l-2.73-2.12Z" clip-rule="evenodd"/><path fill="#0F1729" d="M10.95 8.14 16 12.07V12a4 4 0 0 0-5.05-3.86Z"/><path fill="#0F1729" d="M19.8 12.2a14.2 14.2 0 0 1-1.16 1.92l1.58 1.23c.5-.7.96-1.46 1.36-2.25l.02-.04c.1-.18.21-.41.27-.7a2.1 2.1 0 0 0-.27-1.42l-.02-.04C19.64 7.04 16.28 4 12 4c-1.72 0-3.28.49-4.67 1.32l1.73 1.35A6.89 6.89 0 0 1 12 6c3.23 0 6.04 2.31 7.8 5.8l.06.13.04.07-.04.07-.06.13Z"/></svg>`;
  const iconGrisear = `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill="none" viewBox="0 0 24 24"><path fill="#0F1729" d="M8 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM10.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7.5 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>  <path fill="#0F1729" fill-rule="evenodd" d="M1 12A11 11 0 0 1 12 1c5.97 0 11 4.35 11 10v.01c0 .53 0 1.44-.32 2.49-.83 2.76-3.86 3.5-6.19 2.9-.48-.12-.97-.25-1.43-.39-.8-.23-1.54.48-1.4 1.22l.32 1.59.12.69c.3 1.78-1.1 3.6-3.08 3.34-3.37-.43-5.9-1.75-7.58-3.72A10.77 10.77 0 0 1 1 12Zm11-9a9 9 0 0 0-9 9c0 2.29.65 4.3 1.96 5.83 1.3 1.53 3.34 2.66 6.3 3.04.47.05.97-.38.87-1.03l-.11-.66-.32-1.56c-.45-2.29 1.74-4.15 3.9-3.53.46.13.93.26 1.39.37 1.79.46 3.38-.24 3.78-1.54A6.3 6.3 0 0 0 21 11c0-4.35-3.93-8-9-8Z" clip-rule="evenodd"/></svg>`;

  // === Funciones de utilidad ===
  function whenReady(selector, cb, timeout = 10000) {
    const el = d.querySelector(selector);
    if (el) return cb(el);
    const obs = new MutationObserver((_, o) => {
      const found = d.querySelector(selector);
      if (found) {
        o.disconnect();
        cb(found);
      }
    });
    obs.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), timeout);
  }

  whenReady('section.ui-search-results', init);

  // === Función principal ===
  function init() {
    let modoMarcado = localStorage.getItem('ml_modo_marcado') === 'true';

    // === CSS ===
    const style = d.createElement('style');
    style.textContent = `
      .plox-item-oculto { display:none !important; }

      #btnConfigPlox {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        padding: 10px 14px;
        background: #ffdb4d;
        border: 1px solid #aaa;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 3px 8px rgba(0,0,0,0.2);
        gap: 10px;
        display: flex;
        align-items: center;
      }
      #btnConfigPlox span {
        background:#000;
        color:#fff;
        padding:3px;
        border-radius:8px;
        font-size:12px;
      }

      .modo-actual-plox svg,
      .plox-btn svg,
      #btnConfigPlox svg {
        margin: -5px auto;
      }

      #btnConfigPlox svg path {
        fill:#fff;
      }

      #ploxConfigModal {
        position: fixed;
        top: 25%;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        padding: 16px;
        border: 1px solid #bbb;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        z-index: 100000;
        width: 320px;
        font-family: Arial, sans-serif;
      }
      #ploxConfigModal h3 { margin: 0 0 8px 0; text-align: center; font-size: 16px; }
        .modo-actual-plox { 
        margin: 12px 0; 
        font-size: 14px; 
        text-align: center; 
        display:flex; 
        justify-content:center; 
        align-items:center; 
        gap:6px;  
        background: #96d5ffff; 
        padding: 6px; 
        border-radius: 6px; }

      .plox-btn { display:block; width:100%; padding:8px; margin-top:8px; background:#ffdb4d; border:1px solid #888; border-radius:6px; cursor:pointer; text-align:center; }
      .plox-btn:hover { background:#ffe87d; }

      #modalOcultos {
        position: fixed;
        top: 8%;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-height: 80%;
        overflow-y: auto;
        background: #fff;
        border: 1px solid #888;
        padding: 18px;
        z-index: 100000;
        box-shadow: 0 6px 30px rgba(0,0,0,0.3);
        border-radius: 10px;
      }

      .descripcion-plox { font-size: 13px; text-align: center; margin-bottom: 8px; background: #f0f0f0; padding: 6px; border-radius: 6px; }

      .ocultos-cerrar { float:right; cursor:pointer; font-size:16px; border:none; background:transparent; }
      .ocultos-lista { list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:14px; }
      .ocultos-item {
        width: 200px;
        border:1px solid #ddd;
        border-radius:6px;
        padding:10px;
        box-sizing:border-box;
        display:flex; flex-direction:column; align-items:center; text-align:center;
        background:#fafafa;
      }
      .ocultos-item img { width:100%; height:120px; object-fit:contain; margin-bottom:8px; }
      .ocultos-item a { font-weight:600; color:#0066c0; text-decoration:none; margin-bottom:6px; }
      .ocultos-motivo { font-size:12px; color:#444; margin-bottom:6px; }
      .ocultos-boton { padding:6px 8px; margin-top:6px; width:100%; cursor:pointer; border-radius:6px; border:1px solid #999; background:#fff; }

      /* --- Marcar visualmente --- */
      .plox-item-marcado {
        background-color:#e0e0e0 !important;
        opacity:0.5 !important;
        transition: all 0.3s ease;
        position:relative;
      }
      .plox-item-etiqueta {
        position:absolute;
        top:4px;
        right:4px;
        background:#000;
        color:#fff;
        font-size:10px;
        padding:2px 5px;
        border-radius:4px;
        opacity:0.8;
        z-index:2;
      }
      .plox-item-restaurado {
        background:#ffeb3b !important;
        border:none !important;
      }
    `;
    d.head.appendChild(style);

    // === Helpers ===
    function obtenerItem(el) {
      if (!el || !el.closest) return null;

      // 1. Caso típico: ítems normales de resultados
      let li = el.closest('li.ui-search-layout__item');
      if (li) return li;

      // 2. Caso: filtro "Envío desde otro país"
      li = el.closest('li.ui-search-filter-highlighted-SHIPPING_ORIGIN_HIGHLIGHTED');
      if (li) return li;

      // 3. Caso: anuncio inferior al final del listado
      let div = el.closest('#ui-search-bottom-ads__wrapper');
      if (div) return div;

      return null;
    }

    function actualizarContador() {
      const btn = d.querySelector('#conteo-ocultados');
      if (!btn) return;

      const conteo = d.querySelectorAll('[data-plox-marcado]').length;
      btn.textContent = conteo;
    }

    function aplicarEtiqueta(li) {
      if (!li.querySelector('.plox-item-etiqueta')) {
        const tag = d.createElement('div');
        tag.className = 'plox-item-etiqueta';
        tag.textContent = 'Marcado por Mercado Libre Plox';
        li.appendChild(tag);
      }
    }

    function estaVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }

    function limpiarEtiqueta(li) {
      li.querySelector('.plox-item-etiqueta')?.remove();
    }

    function aplicarModoAElemento(li) {
      if (!li) return;

      if (modoMarcado) {
        li.setAttribute('data-plox-marcado', 'true');
        li.classList.add('plox-item-marcado');
        li.classList.remove('plox-item-oculto');
        aplicarEtiqueta(li);
      } else {
        li.setAttribute('data-plox-marcado', 'false');
        limpiarEtiqueta(li);
        li.classList.remove('plox-item-marcado');
        li.classList.add('plox-item-oculto');
      }

      actualizarContador();
    }

    function escanear() {
      const selectores = [
        'span.poly-component__cbt',                                 // Internacional
        'a.poly-component__ads-promotions',                         // Promocionado
        'span.poly-component__manufacturing-time',                  // Llega después
        'a.poly-component__purchase-options',                       // Opciones de compra
        '.ui-search-bottom-ads__wrapper',                           // Anuncio inferior (Si tienes adblock, no lo verás. Pero está ahí)
        'li.ui-search-filter-highlighted-SHIPPING_ORIGIN_HIGHLIGHTED' // Boton Filtro Envío desde otro país
      ];

      selectores.forEach(selector => {
        d.querySelectorAll(selector).forEach(node => {
          const item = obtenerItem(node);
          /* console.log('ML Plox - Encontrado:', selector, item); */
          if (!item) return;

          if (modoMarcado) {
            aplicarModoAElemento(item);
          } else {
            if (estaVisible(item)) {
              aplicarModoAElemento(item);
            }
          }
        });
      });
    }

    function actualizarTextoBoton() {
      const btn = d.querySelector('#btnConfigPlox');
      if (!btn) return;
      const label = modoMarcado ? `Marcados ${iconGrisear}` : `Ocultos ${iconOcultos}`;
      btn.querySelector('span span:last-child').innerHTML = label;
    }

    function crearBotonConfig() {
      if (d.querySelector('#btnConfigPlox')) return;
      const btn = d.createElement('button');
      btn.id = 'btnConfigPlox';
      btn.innerHTML = `⚙️ Mercado Libre Plox <span><span id="conteo-ocultados">0</span><span>Marcados</span></span>`;
      btn.addEventListener('click', abrirConfig);
      d.body.appendChild(btn);
      actualizarTextoBoton();
    }

    function abrirConfig() {
      if (d.querySelector('#ploxConfigModal')) return;

      const modal = d.createElement('div');
      modal.id = 'ploxConfigModal';

      const titulo = d.createElement('h3');
      titulo.textContent = '⚙️ Configuración Mercado Libre Plox';

      const descripcion = d.createElement('div');
      descripcion.className = 'descripcion-plox';
      descripcion.textContent = 'Oculta: Compras Internacionales, Promocionados, Etiquetados como "Llega después" u "Opciones de compra".';

      const modoActual = d.createElement('div');
      modoActual.className = 'modo-actual-plox';
      modoActual.id = 'active-mode';

      const modoTexto = d.createElement('strong');
      modoTexto.innerHTML = modoMarcado
        ? `Marcar (grisear) ${iconGrisear}`
        : `Ocultar ${iconOcultos}`;

      modoActual.innerHTML = 'Modo actual: ';
      modoActual.appendChild(modoTexto);

      const botonToggle = d.createElement('button');
      botonToggle.id = 'ploxToggle';
      botonToggle.className = 'plox-btn';
      botonToggle.innerHTML = `Cambiar a: ${modoMarcado ? `Ocultar ${iconOcultos}` : `Marcar (grisear) ${iconGrisear}`}`;
      botonToggle.addEventListener('click', () => {
        modoMarcado = !modoMarcado;
        localStorage.setItem('ml_modo_marcado', modoMarcado);
        actualizarTextoBoton();

        modal.querySelector('#active-mode').innerHTML = `Modo actual: <strong>${modoMarcado ? `Marcar (grisear) ${iconGrisear}` : `Ocultar ${iconOcultos}`}</strong>`;
        botonToggle.innerHTML = `Cambiar a: ${modoMarcado ? `Ocultar ${iconOcultos}` : `Marcar (grisear) ${iconGrisear}`}`;
        escanear();
      });

      // Botón de cerrar
      const botonCerrar = d.createElement('button');
      botonCerrar.id = 'ploxCerrar';
      botonCerrar.className = 'plox-btn';
      botonCerrar.textContent = 'Cerrar';
      botonCerrar.addEventListener('click', () => modal.remove());

      // Añadir todo al modal
      modal.appendChild(titulo);
      modal.appendChild(descripcion);
      modal.appendChild(modoActual);
      modal.appendChild(botonToggle);
      modal.appendChild(botonCerrar);
      d.body.appendChild(modal);
    }

    // === Activación inicial ===
    const observer = new MutationObserver(escanear);
    const containerPrincipal = d.querySelector('section.ui-search-results');
    const containerExtra1 = d.querySelector('.ui-search-bottom-ads__wrapper')?.parentNode;
    const containerExtra2 = d.querySelector('li.ui-search-filter-highlighted-SHIPPING_ORIGIN_HIGHLIGHTED')?.parentNode;

    if (containerPrincipal) {
      observer.observe(containerPrincipal, { childList: true, subtree: true });
    }
    if (containerExtra1) {
      observer.observe(containerExtra1, { childList: true, subtree: true });
    }
    if (containerExtra2) {
      observer.observe(containerExtra2, { childList: true, subtree: true });
    }

    escanear();
    actualizarContador()
    crearBotonConfig();
  }

})(document);
