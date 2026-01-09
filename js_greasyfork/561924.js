// ==UserScript==
// @name         Torn Themes by srsbsns
// @namespace    srs.bsns
// @version      2.1
// @description  Applies theme background and transparency to some layers
// @author       srsbsns
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561924/Torn%20Themes%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/561924/Torn%20Themes%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = {
        opacity: localStorage.getItem('bgOpacity') || "0.2",
        image: localStorage.getItem('backgroundImage') || "https://images.hdqwalls.com/wallpapers/cool-pattern-texture-4k-fl.jpg"
    };

    function applyStyles() {
    let css = `
        body {
            background: url(${settings.image}) no-repeat center center fixed !important;
            background-size: cover !important;
        }

        /* HEADER & NAV */
        .header-wrapper-top, .header-wrapper-bottom, .header-navigation,
        #header-root, #top-page-links-list, #sidebarroot {
            background: rgba(0, 0, 0, ${settings.opacity}) !important;
        }

        /* MAIN CONTENT */
        #mainContainer, .content-wrapper {
            background: rgba(0, 0, 0, ${settings.opacity}) !important;
        }

        /* DARK MODE */
        .d body, .d .content-wrapper, .d #mainContainer {
            background-color: transparent !important;
        }

        /* CHAT BOXES - More specific, less broad */
        .chat-box-container, .chat-box-body, .message-container {
            background: rgba(0, 0, 0, 0.85) !important;
        }

        /* Config UI styles remain the same... */
/* NATIVE-STYLE CONFIG UI */
        #theme-manager {
            background-color: #333333 !important;
            background-image: linear-gradient(180deg, #444 0%, #333 100%) !important;
            border: 1px solid #000;
            border-radius: 5px;
            margin: 20px 0;
            padding: 12px;
            color: #ccc;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
            clear: both;
        }
        #theme-manager h3 {
            color: #fff;
            font-size: 14px;
            margin: 0 0 12px 0;
            border-bottom: 1px solid #555;
            padding-bottom: 5px;
        }
        .theme-row { display: flex; align-items: center; margin-bottom: 10px; }
        .theme-row label { width: 110px; font-weight: bold; color: #ddd; }
        .theme-input {
            background: #111; border: 1px solid #555; color: #fff;
            padding: 5px; flex-grow: 1; border-radius: 3px; font-size: 12px;
        }
        .btn-wrap { margin-top: 12px; border-top: 1px solid #555; padding-top: 10px; }
        .torn-btn-custom {
            background: linear-gradient(180deg, #666 0%, #444 100%);
            border: 1px solid #222;
            color: #fff;
            padding: 5px 15px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            margin-right: 8px;
        }
        .torn-btn-custom:hover { background: #555; }
        .torn-btn-save { background: linear-gradient(180deg, #578d2b 0%, #3d631e 100%); border-color: #2d4116; }
        .torn-btn-save:hover { background: #578d2b; }
    `;
    GM_addStyle(css);
}

    function saveAndReload(newSettings) {
        if (newSettings.image) localStorage.setItem('backgroundImage', newSettings.image);
        if (newSettings.opacity) localStorage.setItem('bgOpacity', newSettings.opacity);
        location.reload();
    }

    if (window.location.href.includes("preferences.php")) {
        const initConfig = () => {
            const target = document.querySelector(".content-wrapper");
            if (!target || document.getElementById('theme-manager')) return;

            const uiHtml = `
                <div id="theme-manager">
                    <h3>Theme Settings</h3>
                    <div class="theme-row">
                        <label>Image URL</label>
                        <input type="text" id="url-input" class="theme-input" placeholder="Paste link here...">
                    </div>
                    <div class="theme-row">
                        <label>File Upload</label>
                        <input type="file" id="file-input" style="color:#ccc;">
                    </div>
                    <div class="theme-row">
                        <label>Opacity</label>
                        <input type="range" id="opacity-slider" min="0" max="0.8" step="0.05" value="${settings.opacity}" style="flex-grow:1; cursor:pointer;">
                    </div>
                    <div class="btn-wrap">
                        <button id="save-all-btn" class="torn-btn-custom torn-btn-save">Apply Changes</button>
                        <button id="reset-btn" class="torn-btn-custom">Reset Defaults</button>
                    </div>
                </div>
            `;

            target.appendChild(Object.assign(document.createElement('div'), {innerHTML: uiHtml}));

            document.getElementById("save-all-btn").addEventListener('click', () => {
                const urlVal = document.getElementById("url-input").value;
                const opacityVal = document.getElementById("opacity-slider").value;
                const fileInput = document.getElementById("file-input");

                if (fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = () => saveAndReload({ image: reader.result, opacity: opacityVal });
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    saveAndReload({ image: urlVal || null, opacity: opacityVal });
                }
            });

            document.getElementById("reset-btn").addEventListener('click', () => {
                localStorage.removeItem('backgroundImage');
                localStorage.removeItem('bgOpacity');
                location.reload();
            });
        };
        setTimeout(initConfig, 800);
    }

    applyStyles();
})();