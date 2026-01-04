// ==UserScript==
// @name         Reddit - Block RedGifs (Avoid Firewall Flags on Work)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Bloqueia posts do RedGifs no Reddit Novo e Antigo para evitar alertas de Firewall.
// @author       0x001
// @match        https://*.reddit.com/*
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557537/Reddit%20-%20Block%20RedGifs%20%28Avoid%20Firewall%20Flags%20on%20Work%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557537/Reddit%20-%20Block%20RedGifs%20%28Avoid%20Firewall%20Flags%20on%20Work%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const overlayStyle = `
        position: absolute !important;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #1a1a1b;
        color: #ff0000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 80px;
        font-weight: bold;
        z-index: 99999;
        cursor: not-allowed;
    `;

    function addOverlay(element) {
        if (element.getAttribute('data-redgifs-blocked')) return;

        element.setAttribute('data-redgifs-blocked', 'true');
        element.style.position = 'relative'; // Garante que o overlay cubra este elemento
        element.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.style.cssText = overlayStyle;
        overlay.innerHTML = '<span>X</span><span style="font-size: 16px; color: #fff; margin-top: 10px;">Conteúdo Bloqueado (RedGifs)</span>';

        // Tenta inserir o overlay.
        // No Reddit novo, as vezes precisamos inserir no shadowRoot se disponivel, ou direto no elemento
        if (element.shadowRoot) {
            // Se for um web component aberto, tenta bloquear lá dentro também (opcional, mas o append direto costuma funcionar)
            element.appendChild(overlay);
        } else {
            element.appendChild(overlay);
        }

        console.log("🚫 Post RedGifs Bloqueado!");
    }

    function checkAndBlock() {
        // --- MÉTODO 1: Reddit "Novo" (Shreddit - 2024/2025) ---
        // O Reddit agora usa a tag <shreddit-post> que tem um atributo 'domain' ou 'content-href'
        const shredditPosts = document.querySelectorAll('shreddit-post:not([data-redgifs-blocked])');
        shredditPosts.forEach(post => {
            const domain = post.getAttribute('domain') || '';
            const contentHref = post.getAttribute('content-href') || '';

            if (domain.includes('redgifs') || contentHref.includes('redgifs')) {
                addOverlay(post);
            }
        });

        // --- MÉTODO 2: Reddit Antigo (Old Reddit) e Layouts de transição ---
        // Procura links especificamente
        const links = document.querySelectorAll('a[href*="redgifs.com"]');
        links.forEach(link => {
            // Sobe até achar o container do post
            const container = link.closest('.thing') || // Old Reddit
                              link.closest('.Post') ||  // Reddit React
                              link.closest('article');  // Genérico

            if (container && !container.getAttribute('data-redgifs-blocked')) {
                addOverlay(container);
            }
        });
    }

    // Executa imediatamente
    checkAndBlock();

    // Loop de segurança (intervalo) para garantir que pegue mesmo se o MutationObserver falhar
    // O Reddit as vezes carrega coisas de forma "lazy" que escapam de observers simples
    setInterval(checkAndBlock, 1000);

    // Observer para rolagem de página (Scroll Infinito)
    const observer = new MutationObserver((mutations) => {
        checkAndBlock();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();