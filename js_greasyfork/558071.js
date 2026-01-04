// ==UserScript==
// @name         Solotodo Limpiar Referidos Plox
// @namespace    limpiotodo
// @version      0.2
// @description  Limpia enlaces redirigidos y elimina parámetros de seguimiento en solotodo.cl
// @author       Alplox
// @match        https://*.solotodo.cl/*
// @match        https://solotodo.cl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558071/Solotodo%20Limpiar%20Referidos%20Plox.user.js
// @updateURL https://update.greasyfork.org/scripts/558071/Solotodo%20Limpiar%20Referidos%20Plox.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function safeDecode(s) {
    if (!s) return s;
    try { return decodeURIComponent(s); } catch (e) { return s; }
  }

  // Extrae URL destino caso: ad.soicos
  function extractFromAdSoicos(href) {
    if (!href) return null;
    try {
      const url = new URL(href);
      if (!/(^|\.)ad\.soicos\.com$/.test(url.hostname)) return null;
      const dl = url.searchParams.get('dl');
      if (dl) return safeDecode(dl);
      // patrón fallback: buscar primera apariencia de https%3A...
      const m = href.match(/https?:%2F%2F[^"&]+/i);
      if (m) return safeDecode(m[0]);
    } catch (e) { return null; }
    return null;
  }

  // Extrae URL destino caso: publicapi.solotodo.com/entities/meli_redirect/
  function extractFromMeliRedirect(href) {
    if (!href) return null;
    try {
      const url = new URL(href, location.href);
      if (!url.hostname.includes('publicapi.solotodo.com')) return null;
      if (!url.pathname.includes('meli_redirect')) return null;
      const target = url.searchParams.get('url');
      if (target) return safeDecode(target);
      // patrón fallback: buscar primera apariencia de https%3A...
      const m = href.match(/https?:%2F%2F[^"&]+/i);
      if (m) return safeDecode(m[0]);
    } catch (e) { return null; }
    return null;
  }

  // Extrae la URL destino de redirecciones conocidas
  function extractTarget(href) {
    if (!href) return null;
    const tryMeli = extractFromMeliRedirect(href);
    if (tryMeli) return tryMeli;
    const tryAd = extractFromAdSoicos(href);
    if (tryAd) return tryAd;
    return null;
  }

  function cleanUrl(u) {
    if (!u) return u;
    // Quitar comillas si existen
    u = u.trim().replace(/^["']|["']$/g, '');

    // Crear objeto URL para manipulación
    try {
      const url = new URL(u, location.href);

      // Eliminar parámetros de seguimiento comunes
      const trackingParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'gclid', 'fbclid', 'ref', 'referrer', 'kid', 'aff', 'affiliate',
        'tracking', 'click_id', 'source', 'cid', 'sid', 'utm_id'
      ];

      trackingParams.forEach(param => {
        url.searchParams.delete(param);
      });

      // Asegurar uso de HTTPS si no se especifica protocolo
      if (!url.protocol) url.protocol = 'https:';

      return url.toString();
    } catch (e) {
      // Si URL no es válida, retornar como está pero forzar HTTPS
      return u.startsWith('http') ? u : 'https://' + u;
    }
  }

  function processLink(a) {
    if (!(a instanceof HTMLAnchorElement)) return;
    const original = a.getAttribute('href');
    if (!original) return;

    // Intentar extraer URL destino si es redirección conocida
    const target = extractTarget(original);
    const finalUrl = target ? cleanUrl(target) : cleanUrl(original);

    // Actualizar href si ha cambiado
    if (finalUrl !== original) {
      a.setAttribute('href', finalUrl);
    }

    // Eliminar atributos de seguimiento comunes
    ['data-tracking', 'data-ref', 'data-referrer', 'onclick', 'onmousedown', 'data-cid'].forEach(attr => {
      try { a.removeAttribute(attr); } catch (e) {}
    });

    // Asegurar seguridad con rel="noopener"
    a.setAttribute('rel', 'noopener');
  }

  function processAll(root = document) {
    const selector = [
      'a[href*="ad.soicos"]',
      'a[href*="publicapi.solotodo.com"][href*="meli_redirect"]',
      'a[href*="meli_redirect"]',
      'a[href*="utm_"]',
      'a[href*="kid="]',
      'a[href*="affiliate"]'
    ].join(',');
    const links = root.querySelectorAll(selector);
    links.forEach(processLink);
  }

  // Configurar MutationObserver para detectar cambios dinámicos
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches('a')) processLink(node);
          if (node.querySelectorAll) processAll(node);
        });
      }
      if (m.type === 'attributes' && m.target && m.target.matches && m.target.matches('a')) {
        processLink(m.target);
      }
    }
  });

  // Procesar todos los enlaces inicialmente
  processAll();

  // Iniciar observador
  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });

  // Reintentos periódicos para asegurar limpieza en contenido dinámico (o por si acaso sitio carga lento)
  let tries = 0;
  const retry = setInterval(() => {
    processAll();
    if (++tries > 8) clearInterval(retry);
  }, 800);
})();
