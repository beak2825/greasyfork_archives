// ==UserScript==
// @name         OptiTranslate
// @namespace    com.vonkleist.optitranslate
// @version      1488
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

    const TARGET_LANG = navigator.language.split('-')[0] || 'en';

    // Safety: Don't run on translation sites or system pages
    if (window.location.hostname.match(/(translate|googleusercontent|yandex|bing|microsoft|apple|icloud)/)) return;
    
    // Improved Language Detection
    function isPageInTargetLang() {
        const docLang = document.documentElement.lang.toLowerCase();
        const metaLang = document.querySelector('meta[http-equiv="content-language"]')?.content?.toLowerCase();
        const detected = docLang || metaLang || '';
        return detected.startsWith(TARGET_LANG);
    }

    if (isPageInTargetLang()) return;
    if (document.body.innerText.length < 100) return; // Ignore very small pages

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
            bottom: calc(20px + env(safe-area-inset-bottom));
            left: 50%;
            transform: translateX(-50%);
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif;
            pointer-events: none;
            width: 100%;
            display: flex;
            justify-content: center;
        }
        
        .opti-panel {
            background: rgba(28, 28, 30, 0.85);
            backdrop-filter: blur(25px) saturate(200%);
            -webkit-backdrop-filter: blur(25px) saturate(200%);
            border: 0.5px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            border-radius: 24px;
            padding: 8px;
            display: flex;
            gap: 8px;
            transform: translateY(150%);
            opacity: 0;
            transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s;
            pointer-events: auto;
            max-width: 90vw;
        }

        .opti-panel.visible {
            transform: translateY(0);
            opacity: 1;
        }

        .opti-btn {
            border: none;
            padding: 0 16px;
            height: 44px;
            border-radius: 18px;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
            -webkit-tap-highlight-color: transparent;
        }
        
        .opti-btn:active {
            transform: scale(0.92);
            filter: brightness(1.2);
        }

        /* Google: Vibrant Blue */
        #btn-google {
            background: linear-gradient(135deg, #007AFF, #0056B3);
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
        }

        /* Microsoft: Deep Teal */
        #btn-bing {
            background: linear-gradient(135deg, #32D74B, #248A3D);
            box-shadow: 0 4px 12px rgba(50, 215, 75, 0.3);
        }

        /* Yandex: Sunset Orange */
        #btn-yandex {
            background: linear-gradient(135deg, #FF9F0A, #FF3B30);
            box-shadow: 0 4px 12px rgba(255, 159, 10, 0.3);
        }

        .opti-close {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #fff;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .opti-close:active {
            background: rgba(255, 255, 255, 0.2);
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

    // --- NAVIGATION ---
    function navigate(url) {
        // iOS Safari behaves better with simple window.location for same-tab
        // or a real anchor click for new tab. 
        // We'll use window.location.href to translate the current page.
        window.location.href = url;
        closePanel();
    }

    // --- TRIGGERS ---
    shadow.getElementById('btn-google').onclick = (e) => {
        const url = encodeURIComponent(window.location.href);
        navigate(`https://translate.google.com/translate?sl=auto&tl=${TARGET_LANG}&u=${url}`);
    };

    shadow.getElementById('btn-bing').onclick = (e) => {
        const url = encodeURIComponent(window.location.href);
        // Updated Bing/Microsoft translator URL
        navigate(`https://www.bing.com/translator?to=${TARGET_LANG}&url=${url}`);
    };

    shadow.getElementById('btn-yandex').onclick = (e) => {
        const url = encodeURIComponent(window.location.href);
        navigate(`https://translate.yandex.com/translate?url=${url}&lang=auto-${TARGET_LANG}`);
    };

    shadow.getElementById('do-close').onclick = () => closePanel();

    function closePanel() {
        panel.classList.remove('visible');
        setTimeout(() => host.remove(), 600);
    }

    // --- ENTRANCE ---
    setTimeout(() => panel.classList.add('visible'), 800);

})();