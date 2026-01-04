// ==UserScript==
// @name         Patreon Redirector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to redirect from a Patreon creator page to the Kemono page
// @author       YoureIronic
// @icon         https://www.google.com/s2/favicons?sz=128&domain=kemono.cr
// @match        https://www.patreon.com/*
// @match        https://kemono.cr/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560071/Patreon%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/560071/Patreon%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        AUTO_REDIRECT: false, // Set this to true to redirect automatically without clicking the button
    };
    // ---------------------

    let lastUrl = location.href;

    function findCreatorId() {
        if (!location.hostname.includes('patreon.com')) return null;

        const scripts = document.getElementsByTagName('script');
        const regex = /"creator":\s*\{\s*"data":\s*\{\s*"id":\s*"(\d+)"/;

        for (let script of scripts) {
            if (script.textContent) {
                const match = script.textContent.match(regex);
                if (match) return match[1];
            }
        }

        if (window.patreon && window.patreon.bootstrap && window.patreon.bootstrap.creator) {
            return window.patreon.bootstrap.creator.data.id;
        }

        return null;
    }

    function createButton(id) {
        const existingBtn = document.getElementById('kemono-redirect-btn');
        if (existingBtn) existingBtn.remove();

        const btn = document.createElement('a');
        btn.id = 'kemono-redirect-btn';
        btn.href = `https://kemono.cr/patreon/user/${id}`;
        btn.innerText = 'Open in Kemono';
        btn.target = '_blank';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '10px 20px',
            backgroundColor: '#FF424D',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
            cursor: 'pointer'
        });

        document.body.appendChild(btn);
    }

    function init() {
        const id = findCreatorId();
        if (id) {
            console.log('Patreon Creator ID found:', id);

            if (CONFIG.AUTO_REDIRECT) {
                 window.location.replace(`https://kemono.cr/patreon/user/${id}`);
            } else {
                 createButton(id);
            }
        }
    }

    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 1000);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(init, 1500);
})();