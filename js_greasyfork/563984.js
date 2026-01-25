// ==UserScript==
// @name         GeoGuessr Scroll Mais Rápido
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Aumenta a velocidade do scroll no GeoGuessr
// @author       You
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563984/GeoGuessr%20Scroll%20Mais%20R%C3%A1pido.user.js
// @updateURL https://update.greasyfork.org/scripts/563984/GeoGuessr%20Scroll%20Mais%20R%C3%A1pido.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MULTIPLIER = 1.8; // ajuste a velocidade aqui

  window.addEventListener(
    "wheel",
    function (e) {
      // evita comportamento padrão
      e.preventDefault();

      // faz o scroll com multiplicador
      window.scrollBy({
        top: e.deltaY * MULTIPLIER,
        behavior: "auto"
      });
    },
    { passive: false }
  );
})();
