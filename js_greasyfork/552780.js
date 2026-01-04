// ==UserScript==
// @name         Firefox Force English bish
// @namespace    http://tampermonkey.net/
// @description  Auto-add English params and toggle Google Translate
// @match        *://*/*
// @run-at       document-end
// @version      10002
// @icon         https://icons8.com/icon/tM5WsaZgzeEC/jake
// @author       M3X1C0
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552780/Firefox%20Force%20English%20bish.user.js
// @updateURL https://update.greasyfork.org/scripts/552780/Firefox%20Force%20English%20bish.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Don't run in iframes
    if (window.self !== window.top) {
        return;
    }

    // Prevent duplicates
    if (document.getElementById('translateToggleBtn')) {
        return;
    }

    const url = new URL(window.location.href);
    const hostname = url.hostname;

    // Skip hosts to prevent redirect loops
    const skipHosts = ["translate.google.com", "translate.googleusercontent.com"];
    const isOnTranslateService = skipHosts.some(host => hostname.includes(host));
    const isOnTranslateGoog = hostname.endsWith(".translate.goog");
    const isTranslated = isOnTranslateService || isOnTranslateGoog;

    // ========== STORAGE HELPER FUNCTIONS ==========
    function savePosition(top, left) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('translateBtn-top', top.toString());
            GM_setValue('translateBtn-left', left.toString());
        }
        localStorage.setItem('translateBtn-top', top);
        localStorage.setItem('translateBtn-left', left);
    }

    function getPosition(key, defaultValue) {
        if (typeof GM_getValue !== 'undefined') {
            const value = GM_getValue(key);
            if (value !== undefined && value !== null) {
                return value;
            }
        }
        return localStorage.getItem(key) || defaultValue;
    }

    // ========== AUTO-REDIRECT LOGIC ==========
    if (!isTranslated) {
        let redirected = false;
        const pathname = url.pathname;

        // Check for path-based language codes like /th/, /ja/, /ko/, /zh/, etc.
        // Common non-English language codes (2 or 3 letters)
        const nonEnglishLangCodes = ['th', 'ja', 'ko', 'zh', 'zh-cn', 'zh-tw', 'vi', 'id', 'ms', 'tl', 'ar', 'he', 'ru', 'uk', 'pl', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sr', 'sl', 'el', 'tr', 'fa', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur', 'ne', 'si', 'km', 'lo', 'my', 'ka', 'hy', 'az', 'kk', 'uz', 'tk', 'mn', 'bo'];

        // Check if URL has a non-English language code in the path
        const pathLangMatch = pathname.match(/^\/([a-z]{2}(-[a-z]{2})?)\//i);
        if (pathLangMatch) {
            const langCode = pathLangMatch[1].toLowerCase();
            if (nonEnglishLangCodes.includes(langCode)) {
                // Replace non-English language code with 'en'
                const newPathname = pathname.replace(/^\/[a-z]{2}(-[a-z]{2})?\//i, '/en/');
                const newUrl = `${url.origin}${newPathname}${url.search}${url.hash}`;
                window.location.href = newUrl;
                return;
            }
        }

        // Fallback to query parameter approach
        switch (true) {
            case hostname.includes("google."):
                if (!url.searchParams.has("hl")) {
                    url.searchParams.set("hl", "en");
                    redirected = true;
                }
                break;
            default:
                if (!url.searchParams.has("lang") && !url.searchParams.has("hl")) {
                    url.searchParams.set("lang", "en");
                    redirected = true;
                }
                break;
        }

        if (redirected) {
            window.location.href = url.toString();
            return;
        }
    }

    // ========== BUTTON CREATION ==========
    const style = document.createElement('style');
    style.textContent = `
        #translateToggleBtn {
            position: fixed !important;
            z-index: 2147483647 !important;
            background-color: #1a73e8 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            font-size: 14px !important;
            cursor: move !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            user-select: none !important;
            min-width: 120px !important;
            width: 120px !important;
            height: 36px !important;
            text-align: center !important;
            white-space: nowrap !important;
        }
        #translateToggleBtn:hover {
            background-color: #1558b0 !important;
        }
        #translateToggleBtn.dragging {
            opacity: 0.7 !important;
            cursor: grabbing !important;
        }
    `;
    document.head.appendChild(style);

    // Create button
    const btn = document.createElement('button');
    btn.innerText = isTranslated ? "Exit Translate" : "Translate";
    btn.id = "translateToggleBtn";
    btn.type = "button";

    // Get position
    let savedTop = getPosition('translateBtn-top', '10');
    let savedLeft = getPosition('translateBtn-left', (window.innerWidth - 150).toString());

    btn.style.top = savedTop + 'px';
    btn.style.left = savedLeft + 'px';

    // Append to body
    document.body.appendChild(btn);

    // ========== DRAG FUNCTIONALITY ==========
    let isDragging = false;
    let startX, startY;
    let startLeft, startTop;

    btn.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;

        isDragging = true;
        btn.classList.add('dragging');

        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(btn.style.left) || 0;
        startTop = parseInt(btn.style.top) || 0;

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;

        const maxLeft = window.innerWidth - btn.offsetWidth;
        const maxTop = window.innerHeight - btn.offsetHeight;

        btn.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
        btn.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
    });

    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            btn.classList.remove('dragging');

            const top = parseInt(btn.style.top.replace('px', ''));
            const left = parseInt(btn.style.left.replace('px', ''));

            savePosition(top, left);
        }
    });

    // ========== BUTTON CLICK HANDLER ==========
    let clickStartX, clickStartY;

    btn.addEventListener('mousedown', (e) => {
        clickStartX = e.clientX;
        clickStartY = e.clientY;
    });

    btn.addEventListener('click', (e) => {
        const dragDistance = Math.sqrt(
            Math.pow(e.clientX - clickStartX, 2) +
            Math.pow(e.clientY - clickStartY, 2)
        );

        if (dragDistance > 5) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const currentUrl = new URL(window.location.href);

        if (isTranslated) {
            let originalUrl;

            if (isOnTranslateService) {
                const uParam = currentUrl.searchParams.get('u');
                if (uParam) {
                    originalUrl = decodeURIComponent(uParam);
                }
            } else if (isOnTranslateGoog) {
                const originalDomain = hostname.replace('.translate.goog', '').replace(/-/g, '.');
                const path = currentUrl.pathname;

                const searchParams = new URLSearchParams();
                currentUrl.searchParams.forEach((value, key) => {
                    if (!key.startsWith('_x_tr_')) {
                        searchParams.set(key, value);
                    }
                });

                const search = searchParams.toString();
                originalUrl = `https://${originalDomain}${path}${search ? '?' + search : ''}`;
            }

            if (originalUrl) {
                setTimeout(() => window.location.replace(originalUrl), 10);
                setTimeout(() => window.location.href = originalUrl, 100);
                setTimeout(() => window.top.location.href = originalUrl, 200);
            }
        } else {
            currentUrl.searchParams.delete('lang');
            currentUrl.searchParams.delete('hl');
            const cleanUrl = `${currentUrl.origin}${currentUrl.pathname}${currentUrl.search}`;
            const translateUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(cleanUrl)}`;

            window.location.href = translateUrl;
        }

        return false;
    });
})();