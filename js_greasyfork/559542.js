// ==UserScript==
// @name         Maxion.gg - Thailand Custom Menu + Remove Other Regions
// @namespace    https://maxion.gg/
// @version      1.7.0
// @description  Remove Global/Genesis/America and add custom menu items to Thailand only
// @match        https://*.maxion.gg/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559542/Maxiongg%20-%20Thailand%20Custom%20Menu%20%2B%20Remove%20Other%20Regions.user.js
// @updateURL https://update.greasyfork.org/scripts/559542/Maxiongg%20-%20Thailand%20Custom%20Menu%20%2B%20Remove%20Other%20Regions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       CONFIG
    ========================== */

    // Regions to REMOVE (exact hostname)
    const REMOVE_DOMAINS = [
        'landverse.maxion.gg', // Global
        'rolg.maxion.gg',      // Genesis
        'rola.maxion.gg'       // America
    ];

    // Thailand region hostname (CHANGE if needed)
    const THAILAND_DOMAIN = 'rolth.maxion.gg';

    /* =========================
       HELPERS
    ========================== */

    function createMenuItem({ href, icon, title, desc }) {
        const a = document.createElement('a');
        a.href = href;

        a.innerHTML = `
<div class="main-item flex items-center">
  <span style="box-sizing:border-box;display:inline-block;overflow:hidden;position:relative;max-width:100%;">
    <span style="box-sizing:border-box;display:block;">
      <img alt="" aria-hidden="true"
           src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'/%3e">
    </span>
    <img alt="icon"
         src="${icon}"
         decoding="async"
         style="position:absolute;inset:0;min-width:100%;min-height:100%;">
  </span>

  <div class="detail">
    <div class="title flex items-center font-karla">${title}</div>
    <div class="desc">${desc}</div>
  </div>
</div>
        `.trim();

        return a;
    }

    /* =========================
       MAIN LOGIC
    ========================== */

    function processApps() {
        document.querySelectorAll('.app-container').forEach(container => {
            const headerLink = container.querySelector('.app-header a[href]');
            if (!headerLink) return;

            let hostname;
            try {
                hostname = new URL(headerLink.href).hostname;
            } catch {
                return;
            }

            /* ---------- REMOVE UNWANTED REGIONS ---------- */
            if (REMOVE_DOMAINS.includes(hostname)) {
                container.remove();
                return;
            }

            /* ---------- ADD ITEMS TO THAILAND ONLY ---------- */
            if (hostname === THAILAND_DOMAIN) {
                if (container.dataset.customAdded === '1') return;

                const items = container.querySelector('.app-items');
                if (!items) return;

                                // News
                items.appendChild(createMenuItem({
                    href: 'https://news.rolth.maxion.gg/',
                    icon: 'https://apps.maxion.gg/images/icons/mainmenu-icon.svg',
                    title: 'News',
                    desc: 'Latest announcements'
                }));


                // Event
                items.appendChild(createMenuItem({
                    href: 'https://rolth.maxion.gg/events',
                    icon: 'https://apps.maxion.gg/images/icons/maxion-account-icon.svg',
                    title: 'Event',
                    desc: 'Events | Ragnarok Landverse'
                }));

                container.dataset.customAdded = '1';
            }
        });
    }

    /* =========================
       INIT + SPA SUPPORT
    ========================== */

    processApps();

    new MutationObserver(processApps).observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
