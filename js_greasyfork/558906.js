// ==UserScript==
// @name         YouTube Abonnieren ohne Glockenzwang
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Abo-Button Ersatz: Stumm-Abo ohne aktivierte Benachrichtigungsglocke
// @author       MD9825
// @license      MIT 
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558906/YouTube%20Abonnieren%20ohne%20Glockenzwang.user.js
// @updateURL https://update.greasyfork.org/scripts/558906/YouTube%20Abonnieren%20ohne%20Glockenzwang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BTN_ID = 'silent-sub-btn-final';
    const CSS = `
        #${BTN_ID} {
            background: #272727; color: #eee; border: 1px solid #444;
            border-radius: 18px; padding: 0 16px; margin-right: 0px;
            height: 36px; font-size: 14px; font-weight: 500; cursor: pointer;
            display: inline-flex; align-items: center; z-index: 2002;
            font-family: "Roboto","Arial",sans-serif;
        }
        #${BTN_ID}:hover { background: #3d3d3d; }
        .hide-original-sub ytd-subscribe-button-renderer { display: none !important; }
    `;

    if (!document.getElementById('silent-sub-style')) {
        const s = document.createElement('style');
        s.textContent = CSS;
        s.id = 'silent-sub-style';
        document.head.appendChild(s);
    }

    // --- Hilfsfunktionen (Sleep, WaitFor, GetDropdown) ---
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const waitFor = async (fn, timeout=4000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            if (fn()) return true;
            await sleep(50);
        }
        return false;
    };

    const getActiveDropdownItems = () => {
        const visible = Array.from(document.querySelectorAll('tp-yt-iron-dropdown'))
                             .filter(d => d.style.display !== 'none' && !d.hasAttribute('aria-hidden'));
        return visible.length ? Array.from(visible[visible.length - 1].querySelectorAll('ytd-menu-service-item-renderer')) : [];
    };

    // --- Hauptlogik ---
    async function performSilentSubscribe(myBtn) {
        const container = document.querySelector('#subscribe-button');
        const renderer = container ? container.querySelector('ytd-subscribe-button-renderer') : null;
        if (!renderer) { myBtn.innerText = "Err:NoRed"; return; }

        const subBtn = renderer.querySelector('button');
        if (!subBtn) { myBtn.innerText = "Err:NoBtn"; return; }
        
        myBtn.innerText = "⏳...";
        subBtn.click(); 

        const bellReady = await waitFor(() => {
            const toggleBtn = container.querySelector('ytd-subscription-notification-toggle-button-renderer-next');
            if (toggleBtn) return true;
            const currentBtn = container.querySelector('button'); 
            return (currentBtn && !currentBtn.innerText.includes('Abonnieren') && renderer.hasAttribute('subscribed'));
        });

        if (!bellReady) { myBtn.innerText = "Err:NoBell"; return; }
        await sleep(500); 

        let bellBtn = container.querySelector('ytd-subscription-notification-toggle-button-renderer-next button') || 
                      container.querySelector('ytd-subscribe-button-renderer button');
        
        if (bellBtn) bellBtn.click();

        let foundItems = [];
        if (await waitFor(() => { foundItems = getActiveDropdownItems(); return foundItems.length >= 3; })) {
            const targetItem = foundItems[2];
            targetItem.click();
            myBtn.innerText = "✅ Done";
            myBtn.style.borderColor = "#4caf50";

            // Aufräumen
            setTimeout(() => {
                myBtn.remove();
                if (container) container.classList.remove('hide-original-sub');
            }, 1000);
        } else {
            myBtn.innerText = "Err:Menu";
        }
    }

    // --- Injection Check ---
    function tryInject() {
        // Nur auf Watch-Pages, Seiten mit Videos
        if (location.pathname !== '/watch') return;

        const container = document.querySelector('#subscribe-button');
        if (!container) return; // Noch nicht geladen

        // Wenn Button schon da -> Abbruch
        if (document.getElementById(BTN_ID)) return;

        const renderer = container.querySelector('ytd-subscribe-button-renderer');
        
        // WICHTIG: Wenn schon abonniert -> Aufräumen und Abbruch
        if (renderer && renderer.hasAttribute('subscribed')) {
            container.classList.remove('hide-original-sub');
            // Falls Button fälschlicherweise noch da ist (z.B. durch Back-Button Navigation)
            const oldBtn = document.getElementById(BTN_ID);
            if (oldBtn) oldBtn.remove();
            return; 
        }

        // Wenn Renderer da aber NICHT abonniert -> Injekten
        if (renderer && !renderer.hasAttribute('subscribed')) {
            const btn = document.createElement('button');
            btn.id = BTN_ID;
            btn.innerText = "🔕 Stumm-Abo";
            btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); performSilentSubscribe(btn); };
            btn.onmousedown = (e) => e.stopPropagation();

            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.insertBefore(btn, renderer);
            container.classList.add('hide-original-sub');
        }
    }

    // --- Optimierter Observer ---
    let timeout;
    const observer = new MutationObserver((mutations) => {
        if (timeout) return;
        timeout = setTimeout(() => {
            tryInject();
            timeout = null;
        }, 500);
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

})();
