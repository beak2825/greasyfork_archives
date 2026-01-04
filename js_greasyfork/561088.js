// ==UserScript==
// @name         [TMS] Three Peaks Trading - Universal Lesson Scraper
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  ⛏️ Universal scraper with ✂️ copy buttons (filename-safe titles) for all lesson layouts
// @author       Grok
// @match        https://www.threepeakstrading.com/courses*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561088/%5BTMS%5D%20Three%20Peaks%20Trading%20-%20Universal%20Lesson%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/561088/%5BTMS%5D%20Three%20Peaks%20Trading%20-%20Universal%20Lesson%20Scraper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== Quiet Toast ====================
    const toast = (message, type = 'info', duration = 3000) => {
        const el = document.createElement('div');
        el.textContent = message;
        el.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 999999;
            padding: 12px 24px; border-radius: 8px; color: white; font-family: system-ui;
            background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#ef4444' : '#1e293b'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transform: translateX(400px); opacity: 0; transition: all 0.4s ease;
        `;
        document.body.appendChild(el);
        setTimeout(() => { el.style.transform = 'translateX(0)'; el.style.opacity = '1'; }, 50);
        setTimeout(() => {
            el.style.transform = 'translateX(400px)'; el.style.opacity = '0';
            setTimeout(() => el.remove(), 500);
        }, duration);
    };

    // ==================== Filename-Safe Converter ====================
    const toSafeFilename = (text) => {
        return text
            .replace(/[<>:"/\\|?*]/g, '-')  // Added # to the invalid list
            .replace(/-+/g, '-')
            .trim()
            .replace(/^-|-$/g, '');
    };

    // ==================== Copy Function ====================
    const copyToClipboard = async (text, isTitle = false) => {
        const cleanText = isTitle ? toSafeFilename(text) : text.trim();
        try {
            await navigator.clipboard.writeText(cleanText);
            toast('Copied! ✂️', 'success', 2000);
        } catch (err) {
            toast('Copy failed', 'error');
            console.error(err);
        }
    };

    // ==================== Settings (Auto-run) ====================
    const AUTO_RUN_KEY = 'tpt_auto_scrape';
    let autoRun = GM_getValue(AUTO_RUN_KEY, false);

    const createSettingsButton = () => {
        if (document.getElementById('tpt-settings-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'tpt-settings-btn';
        btn.innerHTML = autoRun ? '⚙️ Auto ON' : '⚙️ Auto OFF';
        btn.style.cssText = `
            position: fixed; top: 112px; right: 12px; z-index: 99999;
            background: ${autoRun ? '#16a34a' : '#1e40af'}; color: white;
            border: none; border-radius: 8px; padding: 10px 14px;
            font-size: 14px; cursor: pointer; font-family: system-ui;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        `;
        btn.onclick = () => {
            autoRun = !autoRun;
            GM_setValue(AUTO_RUN_KEY, autoRun);
            btn.innerHTML = autoRun ? '⚙️ Auto ON' : '⚙️ Auto OFF';
            btn.style.background = autoRun ? '#16a34a' : '#1e40af';
            toast(autoRun ? 'Auto-scrape ON' : 'Auto-scrape OFF', autoRun ? 'success' : 'info');
        };
        document.body.appendChild(btn);
    };

    // ==================== Universal Copy Buttons ====================
    const addCopyButtons = () => {
        // Title: matches both text-2xl and text-3xl versions
        const title = document.querySelector('h1.text-white.font-bold');
        if (title && !title.dataset.copyBtn) {
            const rawTitle = title.childNodes[0]?.textContent || title.textContent || '';

            const btn = document.createElement('span');
            btn.innerHTML = ' ✂️';
            btn.style.cursor = 'pointer';
            btn.title = 'Copy title (safe for filenames)';
            btn.onclick = (e) => {
                e.stopPropagation();
                copyToClipboard(rawTitle.trim(), true);
            };
            title.appendChild(btn);
            title.dataset.copyBtn = 'true';
        }

        // Subtitle/description: matches both text-sm and mb-6 versions
        const desc = document.querySelector('main p.text-gray-400');
        if (desc && !desc.dataset.copyBtn) {
            const btn = document.createElement('span');
            btn.innerHTML = ' ✂️';
            btn.style.cursor = 'pointer';
            btn.title = 'Copy description';
            btn.onclick = (e) => {
                e.stopPropagation();
                copyToClipboard(desc.textContent, false);
            };
            desc.appendChild(btn);
            desc.dataset.copyBtn = 'true';
        }
    };

    // ==================== Main Enhance ====================
    const enhancePage = () => {
        addCopyButtons();
    };

    // ==================== Miner Button ⛏️ ====================
    const injectMinerButton = () => {
        const logoLink = document.querySelector('nav a.text-xl.font-bold');
        if (logoLink && !document.getElementById('tpt-miner-btn')) {
            const miner = document.createElement('span');
            miner.id = 'tpt-miner-btn';
            miner.innerHTML = ' ⛏️';
            miner.style.cursor = 'pointer';
            miner.title = 'Enhance page (add copy buttons)';
            miner.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                enhancePage();
            };
            logoLink.appendChild(miner);
        }
    };

    // ==================== Init ====================
    const init = () => {
        injectMinerButton();
        createSettingsButton();
        if (autoRun) {
            setTimeout(enhancePage, 800);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // SPA / dynamic content support
    new MutationObserver(() => {
        if (document.querySelector('nav a.text-xl.font-bold') && !document.getElementById('tpt-miner-btn')) {
            injectMinerButton();
        }
        // Re-add copy buttons if main content changes (new lesson loaded)
        if (document.querySelector('main') && !document.querySelector('[data-copy-btn]')) {
            setTimeout(addCopyButtons, 500);
        }
    }).observe(document.body, { childList: true, subtree: true });

})();// ==UserScript==
// @name         [TMS] Three Peaks Trading - Universal Lesson Scraper
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  ⛏️ Universal scraper with ✂️ copy buttons (filename-safe titles) for all lesson layouts
// @author       Grok
// @match        https://www.threepeakstrading.com/courses*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // ==================== Quiet Toast ====================
    const toast = (message, type = 'info', duration = 3000) => {
        const el = document.createElement('div');
        el.textContent = message;
        el.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 999999;
            padding: 12px 24px; border-radius: 8px; color: white; font-family: system-ui;
            background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#ef4444' : '#1e293b'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transform: translateX(400px); opacity: 0; transition: all 0.4s ease;
        `;
        document.body.appendChild(el);
        setTimeout(() => { el.style.transform = 'translateX(0)'; el.style.opacity = '1'; }, 50);
        setTimeout(() => {
            el.style.transform = 'translateX(400px)'; el.style.opacity = '0';
            setTimeout(() => el.remove(), 500);
        }, duration);
    };

    // ==================== Filename-Safe Converter ====================
    const toSafeFilename = (text) => {
        return text
            .replace(/[<>:"/\\|?*#]/g, '-')  // Added # to the invalid list
            .replace(/-+/g, '-')
            .trim()
            .replace(/^-|-$/g, '');
    };

    // ==================== Copy Function ====================
    const copyToClipboard = async (text, isTitle = false) => {
        const cleanText = isTitle ? toSafeFilename(text) : text.trim();
        try {
            await navigator.clipboard.writeText(cleanText);
            toast('Copied! ✂️', 'success', 2000);
        } catch (err) {
            toast('Copy failed', 'error');
            console.error(err);
        }
    };

    // ==================== Settings (Auto-run) ====================
    const AUTO_RUN_KEY = 'tpt_auto_scrape';
    let autoRun = GM_getValue(AUTO_RUN_KEY, false);

    const createSettingsButton = () => {
        if (document.getElementById('tpt-settings-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'tpt-settings-btn';
        btn.innerHTML = autoRun ? '⚙️ Auto ON' : '⚙️ Auto OFF';
        btn.style.cssText = `
            position: fixed; top: 112px; right: 12px; z-index: 99999;
            background: ${autoRun ? '#16a34a' : '#1e40af'}; color: white;
            border: none; border-radius: 8px; padding: 10px 14px;
            font-size: 14px; cursor: pointer; font-family: system-ui;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        `;
        btn.onclick = () => {
            autoRun = !autoRun;
            GM_setValue(AUTO_RUN_KEY, autoRun);
            btn.innerHTML = autoRun ? '⚙️ Auto ON' : '⚙️ Auto OFF';
            btn.style.background = autoRun ? '#16a34a' : '#1e40af';
            toast(autoRun ? 'Auto-scrape ON' : 'Auto-scrape OFF', autoRun ? 'success' : 'info');
        };
        document.body.appendChild(btn);
    };

    // ==================== Universal Copy Buttons ====================
    const addCopyButtons = () => {
        // Title: matches both text-2xl and text-3xl versions
        const title = document.querySelector('h1.text-white.font-bold');
        if (title && !title.dataset.copyBtn) {
            const rawTitle = title.childNodes[0]?.textContent || title.textContent || '';

            const btn = document.createElement('span');
            btn.innerHTML = ' ✂️';
            btn.style.cursor = 'pointer';
            btn.title = 'Copy title (safe for filenames)';
            btn.onclick = (e) => {
                e.stopPropagation();
                copyToClipboard(rawTitle.trim(), true);
            };
            title.appendChild(btn);
            title.dataset.copyBtn = 'true';
        }

        // Subtitle/description: matches both text-sm and mb-6 versions
        const desc = document.querySelector('main p.text-gray-400');
        if (desc && !desc.dataset.copyBtn) {
            const btn = document.createElement('span');
            btn.innerHTML = ' ✂️';
            btn.style.cursor = 'pointer';
            btn.title = 'Copy description';
            btn.onclick = (e) => {
                e.stopPropagation();
                copyToClipboard(desc.textContent, false);
            };
            desc.appendChild(btn);
            desc.dataset.copyBtn = 'true';
        }
    };

    // ==================== Main Enhance ====================
    const enhancePage = () => {
        addCopyButtons();
    };

    // ==================== Miner Button ⛏️ ====================
    const injectMinerButton = () => {
        const logoLink = document.querySelector('nav a.text-xl.font-bold');
        if (logoLink && !document.getElementById('tpt-miner-btn')) {
            const miner = document.createElement('span');
            miner.id = 'tpt-miner-btn';
            miner.innerHTML = ' ⛏️';
            miner.style.cursor = 'pointer';
            miner.title = 'Enhance page (add copy buttons)';
            miner.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                enhancePage();
            };
            logoLink.appendChild(miner);
        }
    };

    // ==================== Init ====================
    const init = () => {
        injectMinerButton();
        createSettingsButton();
        if (autoRun) {
            setTimeout(enhancePage, 800);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // SPA / dynamic content support
    new MutationObserver(() => {
        if (document.querySelector('nav a.text-xl.font-bold') && !document.getElementById('tpt-miner-btn')) {
            injectMinerButton();
        }
        // Re-add copy buttons if main content changes (new lesson loaded)
        if (document.querySelector('main') && !document.querySelector('[data-copy-btn]')) {
            setTimeout(addCopyButtons, 500);
        }
    }).observe(document.body, { childList: true, subtree: true });

})();