// ==UserScript==
// @name         PlayStore Redirect Buttons
// @namespace    PlayStore Redirect Buttons
// @version      1.0
// @description  Adds multiple buttons to redirect from Google PlayStore to different websites.
// @author       Rishabh
// @match        https://play.google.com/store/apps/details?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=play.google.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556730/PlayStore%20Redirect%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/556730/PlayStore%20Redirect%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getPackageId() {
        const m = location.href.match(/[?&]id=([a-zA-Z0-9._-]+)/);
        return m ? m[1] : null;
    }

    function addCSS(shadowRoot) {
        const style = document.createElement("style");
        style.textContent = `
            .mr-buttons-container {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-top: 8px;
            }
            .mr-button {
                color: #fff;
                background: #555;
                font-family: Roboto, Arial, sans-serif;
                font-size: .9rem;
                font-weight: 500;
                height: 36px;
                padding: 0 12px;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                transition: transform 0.2s, filter 0.2s;
                text-decoration: none;
                cursor: pointer;
            }
            .mr-button:hover {
                filter: brightness(0.85);
                transform: translateY(-2px);
            }
        `;
        shadowRoot.appendChild(style);
    }

    function insertButtons(pkgId) {
        if (!pkgId) return;
        if (document.querySelector(".mr-buttons-host")) return;

        const installBtn = document.querySelector('button[aria-label^="Install"]');
        let parent = installBtn?.closest('div');
        if (!parent) {
            const title = document.querySelector("h1 span");
            parent = title?.parentElement;
        }
        if (!parent) return;

        // Host element for shadow DOM
        const host = document.createElement("div");
        host.className = "mr-buttons-host";
        parent.appendChild(host);

        const shadow = host.attachShadow({ mode: "open" });
        addCSS(shadow);

        const container = document.createElement("div");
        container.className = "mr-buttons-container";
        shadow.appendChild(container);

        const buttons = [
            { text: 'A2zapk History', url: `https://a2zapk.io/History/${pkgId}/`, color: '#00875f' },
            { text: 'A2zapk Download', url: `https://a2zapk.io/apk/${pkgId}.html`, color: '#00875f' },
            { text: 'APKMirror',      url: `https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=${pkgId}`, color: '#FF8B14' },
            { text: 'APKPure',        url: `https://apkpure.com/search?q=${pkgId}`, color: '#24cd77' },
            { text: 'APKCombo',       url: `https://apkcombo.com/search?q=${pkgId}`, color: '#286090' }
        ];

        for (const b of buttons) {
            const link = document.createElement("a");
            link.textContent = b.text;
            link.href = b.url; // clean direct URL
            link.className = "mr-button";
            link.style.backgroundColor = b.color;
            container.appendChild(link);
        }
    }

    function ensureButtons() {
        const pkg = getPackageId();
        insertButtons(pkg);
    }

    const observer = new MutationObserver(() => {
        ensureButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    ensureButtons();

    let lastPkg = getPackageId();
    setInterval(() => {
        const pkg = getPackageId();
        if (pkg && lastPkg && pkg !== lastPkg) {
            location.reload();
        }
        lastPkg = pkg || lastPkg;
    }, 1000);
})();