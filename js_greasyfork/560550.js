// ==UserScript==
// @name         OptiTranslate
// @namespace    com.vonkleist.optitranslate
// @version      4.0
// @description  Three engines: Google, Bing, Yandex. Total coverage.
// @author       VonKleistL
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560550/OptiTranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/560550/OptiTranslate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_LANG = 'en'; 

    // Safety: Don't run on translation sites
    if (window.location.hostname.match(/(translate|googleusercontent|yandex|bing|microsoft)/)) return;
    
    const pageLang = document.documentElement.lang || navigator.language;
    if (pageLang && pageLang.toLowerCase().startsWith(TARGET_LANG)) return;
    if (document.body.innerText.length < 50) return;

    // --- HOST ---
    const host = document.createElement('div');
    host.id = 'opti-translate-host';
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({mode: 'open'});

    // --- STYLES ---
    const style = document.createElement('style');
    style.textContent = `
        :host {
            all: initial; 
            z-index: 2147483647;
            position: fixed;
            bottom: 30px;
            right: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
            pointer-events: none;
        }
        
        .opti-panel {
            background: rgba(18, 18, 20, 0.96);
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
            border-radius: 26px;
            padding: 6px;
            display: flex;
            gap: 6px;
            transform: translateY(120%);
            opacity: 0;
            transition: transform 0.45s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.35s;
            pointer-events: auto;
        }

        .opti-panel.visible {
            transform: translateY(0);
            opacity: 1;
        }

        .opti-btn {
            border: none;
            padding: 0 14px;
            height: 42px;
            border-radius: 20px;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.1s;
        }
        
        .opti-btn:active {
            transform: scale(0.95);
        }

        /* Google: Blue */
        #btn-google {
            background: linear-gradient(135deg, #4285F4, #357AE8);
            box-shadow: 0 3px 12px rgba(66, 133, 244, 0.35);
        }

        /* Bing: Teal/Green */
        #btn-bing {
            background: linear-gradient(135deg, #008272, #00695C);
            box-shadow: 0 3px 12px rgba(0, 130, 114, 0.35);
        }

        /* Yandex: Red */
        #btn-yandex {
            background: linear-gradient(135deg, #FC3F1D, #D81E05);
            box-shadow: 0 3px 12px rgba(252, 63, 29, 0.35);
        }

        .opti-close {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .opti-close:active {
            background: rgba(255, 255, 255, 0.15);
        }
    `;
    shadow.appendChild(style);

    // --- BODY ---
    const panel = document.createElement('div');
    panel.className = 'opti-panel';
    panel.innerHTML = `
        <button class="opti-btn" id="btn-google">Google</button>
        <button class="opti-btn" id="btn-bing">Bing</button>
        <button class="opti-btn" id="btn-yandex">Yandex</button>
        <button class="opti-close" id="do-close">×</button>
    `;
    shadow.appendChild(panel);

    // --- THE GHOST ANCHOR METHOD ---
    function forceOpen(url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 100);
        closePanel();
    }

    // --- TRIGGERS ---
    
    // 1. Google Translate
    shadow.getElementById('btn-google').onclick = (e) => {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        forceOpen(`https://translate.google.com/translate?sl=auto&tl=${TARGET_LANG}&u=${url}`);
    };

    // 2. Microsoft Bing Translator
    shadow.getElementById('btn-bing').onclick = (e) => {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        forceOpen(`https://www.translatetheweb.com/?from=&to=${TARGET_LANG}&dl=${TARGET_LANG}&a=${url}`);
    };

    // 3. Yandex Translate
    shadow.getElementById('btn-yandex').onclick = (e) => {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        forceOpen(`https://translate.yandex.com/translate?url=${url}&lang=auto-en`);
    };

    // 4. Close
    shadow.getElementById('do-close').onclick = () => closePanel();

    function closePanel() {
        panel.classList.remove('visible');
        setTimeout(() => host.remove(), 500);
    }

    // --- ENTRANCE ---
    setTimeout(() => panel.classList.add('visible'), 600);

})();