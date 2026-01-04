// ==UserScript==
// @name Google Search Enhancer
// @namespace https://codymkw.nekoweb.org/
// @version 4.4
// @description Adds a collapsible Google Enhancer panel with optional AI result filter, new tab option, and saved links with better star placement and popup UI.
// @author Cody
// @match https://www.google.com/search*
// @match https://www.google.*.*/search*
// @grant GM_getValue
// @grant GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555864/Google%20Search%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/555864/Google%20Search%20Enhancer.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const STORAGE_KEY = 'googleEnhancerSettings';
    const LINKS_KEY = 'googleSavedLinks';
    const DEFAULT_SETTINGS = {
        hideAI: true,
        newTab: false
    };
    const loadSettings = () => JSON.parse(GM_getValue(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS)));
    const saveSettings = (settings) => GM_setValue(STORAGE_KEY, JSON.stringify(settings));
    const settings = loadSettings();
    const loadLinks = () => JSON.parse(GM_getValue(LINKS_KEY, '[]'));
    const saveLinks = (links) => GM_setValue(LINKS_KEY, JSON.stringify(links));
    // === HANDLE FILTER ===
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    // If hideAI enabled, ensure "-ai" is added
    if (settings.hideAI && q && !q.toLowerCase().includes('-ai')) {
        params.set('q', `${q} -ai`);
        window.location.replace(`${window.location.pathname}?${params.toString()}`);
        return;
    }
    // If hideAI disabled but "-ai" is in query, remove it
    if (!settings.hideAI && q && q.toLowerCase().includes('-ai')) {
        const cleaned = q.replace(/\s*-ai\s*/gi, ' ').trim();
        params.set('q', cleaned);
        window.location.replace(`${window.location.pathname}?${params.toString()}`);
        return;
    }
    // === NEW TAB OPTION ===
    if (settings.newTab) {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('a').forEach(a => {
                if (a.href && !a.target) a.target = '_blank';
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // === ADD SAVE ICONS TO RESULTS ===
    const addSaveIcons = () => {
        document.querySelectorAll('a h3').forEach(h3 => {
            const link = h3.closest('a');
            if (!link || h3.dataset.hasSaveIcon) return;
            h3.dataset.hasSaveIcon = true;
            const wrapper = document.createElement('span');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            h3.parentNode.insertBefore(wrapper, h3);
            wrapper.appendChild(h3);
            const star = document.createElement('span');
            star.textContent = '⭐';
            star.style.cursor = 'pointer';
            star.style.position = 'absolute';
            star.style.right = '-24px';
            star.style.top = '2px';
            star.style.opacity = '0.6';
            star.style.fontSize = '16px';
            star.title = 'Save for later';
            star.style.transition = 'opacity 0.2s, transform 0.2s';
            const savedLinks = loadLinks();
            if (savedLinks.find(l => l.url === link.href)) {
                star.style.opacity = '1';
                star.style.filter = 'drop-shadow(0 0 2px gold)';
            }
            star.addEventListener('mouseenter', () => {
                star.style.transform = 'scale(1.2)';
            });
            star.addEventListener('mouseleave', () => {
                star.style.transform = 'scale(1)';
            });
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const links = loadLinks();
                const existing = links.find(l => l.url === link.href);
                if (existing) {
                    saveLinks(links.filter(l => l.url !== link.href));
                    star.style.opacity = '0.6';
                    star.style.filter = 'none';
                } else {
                    links.push({ title: h3.innerText, url: link.href });
                    saveLinks(links);
                    star.style.opacity = '1';
                    star.style.filter = 'drop-shadow(0 0 2px gold)';
                }
            });
            wrapper.appendChild(star);
        });
    };
    const resultObserver = new MutationObserver(addSaveIcons);
    resultObserver.observe(document.body, { childList: true, subtree: true });
    addSaveIcons();
    // === CONTROL PANEL ===
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div id="ge-toggle" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg);
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            text-align: center;
            line-height: 38px;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            z-index: 99999;
        ">⚙️</div>
        <div id="ge-panel" style="
            position: fixed;
            bottom: 70px;
            right: 20px;
            z-index: 9999;
            background: var(--bg);
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 10px 12px;
            font-family: sans-serif;
            font-size: 13px;
            min-width: 190px;
            display: none;
        ">
            <strong>⚙️ Google Enhancer</strong>
            <div style="margin-top: 8px;">
                <label><input type="checkbox" id="hideAI" ${settings.hideAI ? 'checked' : ''}> Hide AI Results</label><br>
                <label><input type="checkbox" id="newTab" ${settings.newTab ? 'checked' : ''}> Open results in new tab</label>
            </div>
            <button id="showSavedLinks" style="
                margin-top: 10px;
                width: 100%;
                border: none;
                border-radius: 6px;
                padding: 6px;
                background: var(--button-bg);
                color: var(--button-text);
                cursor: pointer;
            ">📁 Saved Links</button>
        </div>
    `;
    document.body.appendChild(panel);
    // === DARK/LIGHT THEME ===
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const vars = dark
        ? { bg: '#222', text: '#eee', border: '#555', buttonBg: '#333', buttonText: '#fff' }
        : { bg: '#fff', text: '#222', border: '#ccc', buttonBg: '#f5f5f5', buttonText: '#000' };
    for (const [k, v] of Object.entries(vars)) {
        panel.querySelector('#ge-panel').style.setProperty(`--${k}`, v);
        panel.querySelector('#ge-toggle').style.setProperty(`--${k}`, v);
    }
    // === TOGGLE PANEL ===
    const toggleBtn = document.getElementById('ge-toggle');
    const mainPanel = document.getElementById('ge-panel');
    toggleBtn.addEventListener('click', () => {
        mainPanel.style.display = mainPanel.style.display === 'none' ? 'block' : 'none';
    });
    // === SETTINGS ===
    ['hideAI', 'newTab'].forEach(key => {
        document.getElementById(key).addEventListener('change', e => {
            settings[key] = e.target.checked;
            saveSettings(settings);
            location.reload();
        });
    });
    // === SAVED LINKS POPUP ===
    const makeSavedPopup = () => {
        const popup = document.createElement('div');
        popup.innerHTML = `
            <div id="savedLinksPopup" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${vars.bg};
                color: ${vars.text};
                border: 1px solid ${vars.border};
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                padding: 15px;
                z-index: 100000;
                width: 320px;
                max-height: 400px;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>📁 Saved Links</strong>
                    <button id="closePopup" style="
                        background: transparent;
                        color: ${vars.text};
                        border: none;
                        font-size: 16px;
                        cursor: pointer;
                    ">❎</button>
                </div>
                <div id="linksContainer" style="margin-top: 10px;"></div>
                <button id="clearAllLinks" style="
                    margin-top: 10px;
                    width: 100%;
                    border: none;
                    border-radius: 6px;
                    padding: 6px;
                    background: ${vars.buttonBg};
                    color: ${vars.buttonText};
                    cursor: pointer;
                ">🗑️ Clear All</button>
            </div>
        `;
        document.body.appendChild(popup);
        const container = popup.querySelector('#linksContainer');
        const links = loadLinks();
        if (links.length === 0) {
            container.innerHTML = `<p style="opacity: 0.7;">No saved links yet.</p>`;
        } else {
            links.forEach((l, i) => {
                const div = document.createElement('div');
                div.style.marginBottom = '6px';
                div.innerHTML = `
                    <a href="${l.url}" target="_blank" style="color: ${vars.text}; text-decoration: none;">${l.title}</a>
                    <button data-index="${i}" style="margin-left: 8px; font-size: 12px;">❌</button>
                `;
                container.appendChild(div);
            });
            container.querySelectorAll('button[data-index]').forEach(btn => {
                btn.addEventListener('click', e => {
                    const idx = +e.target.dataset.index;
                    const links = loadLinks();
                    links.splice(idx, 1);
                    saveLinks(links);
                    popup.remove();
                    makeSavedPopup();
                });
            });
        }
        popup.querySelector('#clearAllLinks').addEventListener('click', () => {
            if (confirm('Clear all saved links?')) {
                saveLinks([]);
                popup.remove();
            }
        });
        popup.querySelector('#closePopup').addEventListener('click', () => {
            popup.remove();
        });
    };
    document.getElementById('showSavedLinks').addEventListener('click', makeSavedPopup);
})();