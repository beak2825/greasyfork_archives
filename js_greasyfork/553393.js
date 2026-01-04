// ==UserScript==
// @name         Netflix Modal Remover (auto-delete on appear)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes Your device isn’t part of the Netflix Household message
// @match        https://www.netflix.com/*
// @match        https://*.netflix.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553393/Netflix%20Modal%20Remover%20%28auto-delete%20on%20appear%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553393/Netflix%20Modal%20Remover%20%28auto-delete%20on%20appear%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== Config =====
  const ENABLED = true; // puedes apagarlo con Alt+Shift+M en tiempo real
  const REMOVE_CONTAINER_IF_HOLDS_MODAL = true; // ⚠️ Riesgoso: podría romper la UI
  const CONTAINER_SELECTOR = 'body > div:nth-child(1)'; // Contenedor candidato a borrar si contiene el modal
  // ===================

  let enabled = ENABLED;
  let obs;

 // document.querySelector("body > div:nth-child(1)").remove();*

  const MODAL_SELECTORS = [
    '.nf-modal',
    '.nf-modal-overlay',
    '.nf-modal-container'
  ].join(', ');

  const removedSet = new WeakSet(); // evitar borrados repetidos del mismo nodo

  function removeNodeOnce(node, label = 'elemento') {
    if (!node || removedSet.has(node)) return false;
    try {
      node.remove();
      removedSet.add(node);
      console.log('[TM] Removido:', label);
      return true;
    } catch (e) {
      console.warn('[TM] No se pudo remover', label, e);
      return false;
    }
  }

  function tryRemoveModalAndContainer() {
    const modal = document.querySelector(MODAL_SELECTORS);
    if (!modal) return false;

    // 1) Eliminar modal/overlay apenas aparezca
    const removedModal = removeNodeOnce(modal, '.nf-modal / overlay');

    // 2) (Opcional) Si el contenedor candidato EXISTE y CONTIENE el modal (o lo contenía),
    // eliminar también ese contenedor. Esto es riesgoso.
    if (REMOVE_CONTAINER_IF_HOLDS_MODAL) {
      const container = document.querySelector(CONTAINER_SELECTOR);
      if (container && (container.contains(modal) || wasInside(container, modal))) {
        removeNodeOnce(container, `Contenedor (${CONTAINER_SELECTOR})`);
      }
    }

    return removedModal;
  }

  // Heurística mínima por si el modal ya fue eliminado pero estuvo dentro del contenedor
  function wasInside(container, node) {
    if (!container || !node) return false;
    // Si el modal ya no está, intentamos encontrar rastros por clase en descendientes,
    // aunque suele bastar con contains(modal) cuando aparece.
    return !!container.querySelector(MODAL_SELECTORS);
  }

  function startObserver() {
    stopObserver();
    obs = new MutationObserver((mutations) => {
      if (!enabled) return;
      // Escaneamos aparición de nodos que coincidan con el modal
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue; // ELEMENT_NODE
          if (n.matches && n.matches(MODAL_SELECTORS)) {
            tryRemoveModalAndContainer();
            return;
          }
          if (n.querySelector && n.querySelector(MODAL_SELECTORS)) {
            tryRemoveModalAndContainer();
            return;
          }
        }
      }
      // fallback: prueba rápida en cada tick de cambio
      tryRemoveModalAndContainer();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  function stopObserver() {
    if (obs) {
      obs.disconnect();
      obs = null;
    }
  }

  // Revisión inmediata por si ya está montado
  tryRemoveModalAndContainer();
  // Y seguir escuchando por si aparece después
  startObserver();

  // Toggle rápido: Alt + Shift + M
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyM') {
      enabled = !enabled;
      console.log('[TM] Netflix Modal Remover:', enabled ? 'ON' : 'OFF');
      if (enabled) startObserver();
      else stopObserver();
    }
  });

})();
