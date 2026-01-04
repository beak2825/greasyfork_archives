// ==UserScript==
// @name         Bonk.io - Censurar Palavras
// @namespace    https://violentmonkey.github.io/
// @version      1.2
// @description  Censura palavras no bonk.io substituindo por #
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560348/Bonkio%20-%20Censurar%20Palavras.user.js
// @updateURL https://update.greasyfork.org/scripts/560348/Bonkio%20-%20Censurar%20Palavras.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🔴 Palavras a serem censuradas
    const palavras = ["puta", "puto", "fdp", "guloso", "safado", "molestado", "vsfd", "vadia", "viado", "viadagem", "foda-se", "fdp", "fds", "gozó", "bundao", "bumbum", "pau", "gozo", "gozar", "goze", "molestar", "moleste", "molesto", "fodo", "foda", "fuder", "fude", "fudendo", "fudeu", "fodi", "fode", "molestei", "cu", "cuzao","bosta", "bunda", "piroca", "transar", "lixo", "transo", "piroka", "gay", "sexo", "crlh", "carai", "caralho", "merda", "krl", "porra", "prr", "mama", "mamar", "crl", "krlh", "leitinho", "rebola", "mamo", "gyat", "mamei"]

    const regex = new RegExp(`\\b(${palavras.join("|")})\\b`, "gi");

    function censurarTexto(node) {
        if (
            node.nodeType === Node.TEXT_NODE &&
            node.parentNode &&
            !["SCRIPT", "STYLE", "INPUT", "TEXTAREA"].includes(node.parentNode.tagName)
        ) {
            node.textContent = node.textContent.replace(regex, match =>
                "#".repeat(match.length)
            );
        }
    }

    function processarElemento(element) {
        element.childNodes.forEach(node => {
            censurarTexto(node);
            processarElemento(node);
        });
    }

    // Processa o conteúdo inicial
    processarElemento(document.body);

    // Observa mudanças dinâmicas (chat, lobby, etc.)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    censurarTexto(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    processarElemento(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
