// ==UserScript==
// @name         UBNT Floating Login Button (Ultimate Fix)
// @namespace    Add Loggin Button
// @version      1.0
// @description  Tombol login floating untuk UBNT AirOS (pasti muncul)
// @match        *://192.168.1.20/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560290/UBNT%20Floating%20Login%20Button%20%28Ultimate%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560290/UBNT%20Floating%20Login%20Button%20%28Ultimate%20Fix%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createFloatingLogin() {
        if (document.getElementById('ubntFloatingLogin')) return;

        const form = document.getElementById('loginform');
        if (!form) return;

        const btn = document.createElement('button');
        btn.id = 'ubntFloatingLogin';
        btn.innerText = 'LOGIN';
        btn.type = 'button';

        // ===== STYLE FLOATING =====
        btn.style.position = 'fixed';
        btn.style.bottom = '30px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.style.zIndex = '99999';
        btn.style.width = '280px';
        btn.style.padding = '20px';
        btn.style.fontSize = '22px';
        btn.style.fontWeight = 'bold';
        btn.style.background = '#0d6efd';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 5px 15px rgba(0,0,0,.4)';

        btn.onmouseenter = () => btn.style.background = '#084298';
        btn.onmouseleave = () => btn.style.background = '#0d6efd';

        btn.onclick = () => {
            console.log('[UBNT] Floating login clicked');
            form.submit();
        };

        document.body.appendChild(btn);
        console.log('[UBNT] Floating login button created');
    }

    // paksa jalan terus sampai muncul
    const timer = setInterval(() => {
        if (document.getElementById('loginform')) {
            createFloatingLogin();
            clearInterval(timer);
        }
    }, 500);
})();
