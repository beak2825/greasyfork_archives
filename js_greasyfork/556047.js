// ==UserScript==
// @name         ChatGPT – Remove Nag Banners
// @description  Removes the no-auth rate limit modal and all login/signup nag banners on ChatGPT when not signed in.
// @namespace    https://greasyfork.org/users/kosherkale
// @author       kosherkale
// @version      1.1
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556047/ChatGPT%20%E2%80%93%20Remove%20Nag%20Banners.user.js
// @updateURL https://update.greasyfork.org/scripts/556047/ChatGPT%20%E2%80%93%20Remove%20Nag%20Banners.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanUI() {
        const modal = document.querySelector('div[data-testid="modal-no-auth-rate-limit"]');
        if (modal) modal.remove();

        document.querySelectorAll('aside').forEach(aside => {
            const txt = aside.textContent || '';
            if (
                txt.includes('Get smarter responses') ||
                txt.includes("You're now using our basic model") ||
                (txt.includes('create an account') && txt.includes('Log in'))
            ) {
                aside.remove();
            }
        });

        document.querySelectorAll('.fixed.inset-0, [data-overlay="true"]').forEach(el => {
            const style = getComputedStyle(el);
            if (style.position === 'fixed' && style.inset === '0px') {
                el.remove();
            }
        });

        ['no-scroll', 'overflow-hidden'].forEach(cls => {
            document.documentElement.classList.remove(cls);
            document.body.classList.remove(cls);
        });
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.documentElement.style.pointerEvents = 'auto';
        document.body.style.pointerEvents = 'auto';
    }

    cleanUI();

    const observer = new MutationObserver(cleanUI);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('wheel', e => {
        const chatContainer = document.querySelector('main div[class*="overflow-y-auto"]');
        if (!chatContainer) return;

        chatContainer.scrollTop += e.deltaY;

        e.preventDefault();
    }, { passive: false });

})();
