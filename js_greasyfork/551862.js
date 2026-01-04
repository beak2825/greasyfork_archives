// ==UserScript==
// @license MIT
// @name         Blackboard Chrome Spoof (UPC)
// @namespace    https://upc.blackboard.com
// @version      1.3
// @description  Forzar Brave a parecer Chrome en Blackboard UPC (UA + CH actualizados)
// @match        *://*.upc.blackboard.com/*    
// @match        *://*.upc.class.com/*    
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551862/Blackboard%20Chrome%20Spoof%20%28UPC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551862/Blackboard%20Chrome%20Spoof%20%28UPC%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Chrome estable (Windows) a 2025-09-30
  const CHROME_MAJOR = "141";
  const CHROME_FULL = "141.0.7390.55";

  const fakeUA = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_FULL} Safari/537.36`;

  const brands = [
    { brand: 'Not.A/Brand', version: '99' },
    { brand: 'Google Chrome', version: CHROME_MAJOR },
    { brand: 'Chromium', version: CHROME_MAJOR }
  ];

  const fullVersionList = [
    { brand: 'Not.A/Brand', version: '99.0.0.0' },
    { brand: 'Google Chrome', version: CHROME_FULL },
    { brand: 'Chromium', version: CHROME_FULL }
  ];

  const uaDataBase = {
    brands,
    fullVersionList,
    mobile: false,
    platform: 'Windows',
    toJSON() { return { brands, mobile: false, platform: 'Windows' }; },
    getHighEntropyValues: async (hints = []) => {
      const base = {
        architecture: 'x86',
        bitness: '64',
        fullVersionList,
        model: '',
        platform: 'Windows',
        platformVersion: '10.0.0',
        uaFullVersion: CHROME_FULL,
        wow64: false
      };
      // Devuelve solo lo solicitado (pero acepta cualquiera)
      const out = {};
      for (const k of hints) out[k] = base[k];
      // Asegura claves comunes aunque no se pidan
      return Object.assign({ platform: 'Windows', platformVersion: '10.0.0' }, out);
    }
  };

  const define = (obj, prop, getFn) => {
    try {
      Object.defineProperty(obj, prop, { get: getFn, configurable: true });
    } catch (_) {}
  };

  // Sobrescribe en el prototipo para afectar a todos los accessos
  const navProto = Object.getPrototypeOf(navigator);

  define(navProto, 'userAgent', () => fakeUA);
  define(navProto, 'vendor', () => 'Google Inc.');
  define(navProto, 'platform', () => 'Win32'); // típico en Chrome en Windows
  define(navProto, 'userAgentData', () => uaDataBase);

  // Ocultar rastro de Brave
  define(navProto, 'brave', () => undefined);

  // Opcional: algunas detecciones esperan window.chrome presente
  if (!('chrome' in window)) {
    try {
      Object.defineProperty(window, 'chrome', {
        get: () => ({ runtime: {}, app: {}, webstore: {} }),
        configurable: true
      });
    } catch (_) {}
  }

  // Congela objetos para dar apariencia más realista
  try { Object.freeze(navigator.userAgentData); } catch (_) {}
})();
