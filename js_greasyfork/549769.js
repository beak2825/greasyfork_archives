// ==UserScript==
// @name         Force Dark on whatsapp web
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Garante que todo elemento .color-refresh tenha também a classe .dark
// @author       Você
// @match        https://web.whatsapp.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549769/Force%20Dark%20on%20whatsapp%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/549769/Force%20Dark%20on%20whatsapp%20web.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function ensureDarkClass(element) {
    if (element.classList.contains("color-refresh") && !element.classList.contains("dark")) {
      element.classList.add("dark");
    }
  }

  // Força nos elementos existentes
  function applyToAll() {
    document.querySelectorAll(".color-refresh").forEach(ensureDarkClass);
  }

  // Executa assim que carregar
  applyToAll();

  // Observer global para monitorar mudanças na árvore
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Novos elementos inseridos
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.classList && node.classList.contains("color-refresh")) {
            ensureDarkClass(node);
          }
          // Caso o novo nó contenha outros dentro
          node.querySelectorAll?.(".color-refresh").forEach(ensureDarkClass);
        }
      });

      // Alterações de atributos (ex: classe removida)
      if (mutation.type === "attributes" && mutation.target.classList.contains("color-refresh")) {
        ensureDarkClass(mutation.target);
      }
    }
  });

  // Observa o documento inteiro
  observer.observe(document.documentElement, {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
  });
})();
