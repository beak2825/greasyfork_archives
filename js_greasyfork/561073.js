// ==UserScript==
// @name         VK Search Sorter v7.5 (Search Only)
// @namespace    http://tampermonkey.net/
// @version      7.5
// @description  Поиск с сортировкой по лайкам/репостам/галочке
// @author       You
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561073/VK%20Search%20Sorter%20v75%20%28Search%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561073/VK%20Search%20Sorter%20v75%20%28Search%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === КОНСТАНТЫ ===
    const PANEL_ID = 'vk-sorter-v7-panel';
    const HIDE_STYLE_ID = 'vk-sorter-style';
    const SORT_CLASS = 'vk-flex-container';
    const HIDDEN_CLASS = 'vk-hidden-post';

    // Проверка: находимся ли мы в поиске
    const isSearchPage = () => window.location.href.includes('/search');

    // Селекторы постов
    const POST_SELECTORS = [
        '[data-testid="post"]',
        '.post',
        '.feed_row',
        '._post',
        '[data-task-click="wall_post_click"]'
    ];

    let state = {
        enabled: true,
        autoSort: false,
        metric: 'likes',
        min: 0,
        max: Infinity,
        verifiedOnly: false
    };

    let mainObserver = null;
    let isProcessing = false;

    // === 1. CSS СТИЛИ ===
    function injectStyles() {
        if (!document.getElementById(HIDE_STYLE_ID)) {
            const style = document.createElement('style');
            style.id = HIDE_STYLE_ID;
            style.innerHTML = `
                .${HIDDEN_CLASS} { display: none !important; }
                .${SORT_CLASS} { display: flex !important; flex-direction: column !important; }
                #${PANEL_ID} button:hover { opacity: 0.8; }
                #${PANEL_ID} * { box-sizing: border-box; font-family: -apple-system, sans-serif; }
            `;
            document.head.appendChild(style);
        }
    }

    // === 2. ПАРСЕР ЧИСЕЛ ===
    function parseMetric(text) {
        if (!text || typeof text !== 'string') return 0;
        let clean = text.replace(/\s/g, '').replace(/\n/g, '').trim().replace(',', '.');
        if (!clean) return 0;

        let mult = 1;
        if (clean.toUpperCase().includes('K') || clean.toUpperCase().includes('К')) {
            mult = 1000;
            clean = clean.replace(/[KКkк]/g, '');
        } else if (clean.toUpperCase().includes('M') || clean.toUpperCase().includes('М')) {
            mult = 1000000;
            clean = clean.replace(/[MМmм]/g, '');
        }
        const match = clean.match(/[\d.]+/);
        return match ? parseFloat(match[0]) * mult : 0;
    }

    // === 3. ПОЛУЧЕНИЕ ДАННЫХ ===
    function getPostData(node) {
        const getText = (selector) => {
            const el = node.querySelector(selector);
            return el ? (el.innerText || el.getAttribute('aria-label') || "") : "";
        };

        let likes = parseMetric(getText('[data-testid="post_footer_action_like"]'));
        if (likes === 0) likes = parseMetric(getText('.like_button_count'));
        if (likes === 0) likes = parseMetric(getText('.vkitPostFooterAction__label--_X78e'));

        let shares = parseMetric(getText('[data-testid="post_footer_action_share"]'));
        if (shares === 0) shares = parseMetric(getText('.share_count'));

        let views = 0;
        let viewEl = node.querySelector('[title*="росмотр"]') || node.querySelector('.view_count') || node.querySelector('._views');
        if (!viewEl) {
             const footer = node.querySelector('.vkitPostFooterRow__root--Rbxg8') || node.querySelector('.post_full_like_wrap');
             if (footer) {
                 const spans = footer.querySelectorAll('span');
                 for (let span of spans) {
                     const txt = span.innerText;
                     if (txt && /^\d+(\.\d+)?[KКMМ]?$/.test(txt.trim())) {
                         if (!span.closest('[role="button"]') && !span.closest('.like_wrap')) {
                             views = parseMetric(txt);
                             break;
                         }
                     }
                 }
             }
        } else {
            views = parseMetric(viewEl.innerText);
        }

        const isVerified = !!node.querySelector('[data-testid="richavatar-outline-accent"], .vkuiIcon--verified, .verified');
        return { likes, shares, views, isVerified };
    }

    // === 4. ОБРАБОТКА ПОСТА ===
    function processPost(postNode) {
        // Если мы не на странице поиска - очищаем стили и выходим
        if (!isSearchPage()) {
            postNode.classList.remove(HIDDEN_CLASS);
            postNode.style.order = '';
            return;
        }

        if (state.enabled && state.autoSort) {
            if (postNode.parentElement && !postNode.parentElement.classList.contains(SORT_CLASS)) {
                postNode.parentElement.classList.add(SORT_CLASS);
            }
        }

        if (!state.enabled) {
            postNode.classList.remove(HIDDEN_CLASS);
            postNode.style.order = '';
            return;
        }

        const data = getPostData(postNode);
        const val = data[state.metric];
        const passMin = val >= state.min;
        const passMax = val <= state.max;
        const passVer = !state.verifiedOnly || data.isVerified;

        if (passMin && passMax && passVer) {
            postNode.classList.remove(HIDDEN_CLASS);
            if (state.autoSort) {
                postNode.style.order = -val;
            } else {
                postNode.style.order = '';
            }
        } else {
            postNode.classList.add(HIDDEN_CLASS);
            postNode.style.order = '';
        }
    }

    // === 5. ПАЙПЛАЙН ===
    function runPipeline() {
        if (isProcessing) return;
        
        // Главная проверка URL
        updatePanelVisibility();
        if (!isSearchPage()) return;

        isProcessing = true;
        const allPosts = document.querySelectorAll(POST_SELECTORS.join(','));

        if (allPosts.length === 0) {
            updateStatus('Нет постов');
            isProcessing = false;
            return;
        }

        allPosts.forEach(processPost);

        let visibleCount = 0;
        allPosts.forEach(p => {
            if (!p.classList.contains(HIDDEN_CLASS)) visibleCount++;
        });

        updateStatus(`Всего: ${allPosts.length} | Видно: ${visibleCount}`);
        isProcessing = false;
    }

    // === 6. УПРАВЛЕНИЕ ВИДИМОСТЬЮ ПАНЕЛИ ===
    function updatePanelVisibility() {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;
        
        if (isSearchPage()) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    }

    // === 7. НАБЛЮДЕНИЕ ===
    function startObservers() {
        if (mainObserver) mainObserver.disconnect();

        mainObserver = new MutationObserver((mutations) => {
            // Если URL изменился или добавились ноды
            let shouldRun = false;
            if (isSearchPage()) {
                for (let mut of mutations) {
                    if (mut.addedNodes.length > 0) {
                        shouldRun = true;
                        break;
                    }
                    if (mut.type === 'attributes' && state.enabled) {
                       shouldRun = true;
                       break;
                    }
                }
            } else {
                // Если мы ушли со страницы поиска - скрыть панель
                updatePanelVisibility();
            }

            if (shouldRun) {
                setTimeout(runPipeline, 50);
            }
        });

        mainObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        runPipeline();

        // Watchdog + проверка смены URL
        setInterval(() => {
            updatePanelVisibility();
            if (state.enabled && isSearchPage()) runPipeline();
        }, 1500);
    }

    // === 8. UI ===
    function updateStatus(text) {
        const el = document.getElementById('vk-v7-status');
        if (el) el.innerText = text;
    }

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        // По умолчанию скрываем, пока не проверим URL
        panel.style.cssText = `
            position: fixed; top: 70px; right: 20px; width: 220px;
            background: var(--vkui--color_background_content, #fff);
            color: var(--vkui--color_text_primary, #000);
            border: 1px solid var(--vkui--color_separator_primary, #ccc);
            border-radius: 12px; padding: 15px; z-index: 99999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15); font-size: 13px;
            display: none; 
        `;

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:center;">
                <b style="font-size:14px;">VK Search Sort</b>
                <label style="cursor:pointer;"><input type="checkbox" id="vk-v7-enable" checked> Вкл</label>
            </div>
            <div id="vk-v7-status" style="color:#888; margin-bottom:10px; font-size:11px;">Сканирование...</div>

            <div style="display:flex; gap:5px; margin-bottom:10px;">
                <input type="number" id="vk-v7-min" placeholder="Min" style="width:50%; padding:5px; border:1px solid #ccc; border-radius:6px;">
                <input type="number" id="vk-v7-max" placeholder="Max" style="width:50%; padding:5px; border:1px solid #ccc; border-radius:6px;">
            </div>

            <div id="vk-v7-metrics" style="display:flex; flex-direction:column; gap:5px; margin-bottom:10px;"></div>

            <label style="display:block; margin-bottom:5px; cursor:pointer;">
                <input type="checkbox" id="vk-v7-ver"> Только с галочкой ☑
            </label>
            <label style="display:block; cursor:pointer; color:#d00; font-weight:500;">
                <input type="checkbox" id="vk-v7-sort"> Сортировать ленту
            </label>

            <button id="vk-v7-check" style="width:100%; margin-top:10px; padding:8px; background:var(--vkui--color_background_accent_themed, #4b7da3); color:#fff; border:none; border-radius:6px; cursor:pointer;">Пересчитать</button>
        `;

        document.body.appendChild(panel);

        const metricsContainer = document.getElementById('vk-v7-metrics');
        const addBtn = (txt, key) => {
            const b = document.createElement('button');
            b.innerText = txt;
            b.style.cssText = `padding:6px; border:1px solid #eee; background:#f7f7f7; border-radius:6px; cursor:pointer; text-align:left; width:100%; color:#000;`;
            const updateState = () => {
                b.style.background = (state.metric === key) ? '#dbeeff' : '#f7f7f7';
                b.style.borderColor = (state.metric === key) ? '#8fbce6' : '#eee';
            };
            b.onclick = () => {
                state.metric = key;
                Array.from(metricsContainer.children).forEach(btn => {
                    btn.style.background = '#f7f7f7';
                    btn.style.borderColor = '#eee';
                });
                updateState();
                runPipeline();
            };
            metricsContainer.appendChild(b);
            updateState();
        };

        addBtn('❤️ Лайки', 'likes');
        addBtn('📢 Репосты', 'shares');
        addBtn('👁 Просмотры', 'views');

        document.getElementById('vk-v7-enable').onchange = (e) => { state.enabled = e.target.checked; runPipeline(); };
        document.getElementById('vk-v7-ver').onchange = (e) => { state.verifiedOnly = e.target.checked; runPipeline(); };
        document.getElementById('vk-v7-sort').onchange = (e) => { state.autoSort = e.target.checked; runPipeline(); };
        document.getElementById('vk-v7-min').oninput = (e) => { state.min = Number(e.target.value) || 0; runPipeline(); };
        document.getElementById('vk-v7-max').oninput = (e) => { state.max = Number(e.target.value) || Infinity; runPipeline(); };
        document.getElementById('vk-v7-check').onclick = runPipeline;
        
        // Сразу проверяем видимость при создании
        updatePanelVisibility();
    }

    // === START ===
    injectStyles();
    setTimeout(() => {
        createPanel();
        startObservers();
    }, 1500);

})();