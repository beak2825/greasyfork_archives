// ==UserScript==
// @name         Kinopoisk Free Mirror: Customizable v5.1
// @namespace    kp-free-mirror-direct
// @version      5.1.0
// @description  Зеркала, настройка кнопок, отсутствие мерцания и лагов.
// @author       Evreu1pro
// @match        https://www.kinopoisk.ru/film/*
// @match        https://www.kinopoisk.ru/series/*
// @match        *://tapeop.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinopoisk.ru
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/549824/Kinopoisk%20Free%20Mirror%3A%20Customizable%20v51.user.js
// @updateURL https://update.greasyfork.org/scripts/549824/Kinopoisk%20Free%20Mirror%3A%20Customizable%20v51.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- КОНФИГУРАЦИЯ ---
    const CONFIG = {
        telegramUrl: 'https://t.me/gostibissi',
        tapeOpUrl: 'https://tapeop.dev/',
        storageKey: 'kp_mirror_v5_data_local'
    };

    const DEFAULT_SOURCES = [
        { id: 'kp_film', name: 'Kinopoisk.Film', color: '#00b3ff', template: 'https://www.kinopoisk.film/{type}/{id}/', enabled: true },
        { id: 'reyohoho', name: 'ReYoHoHo', color: '#4CAF50', template: 'https://reyohoho.github.io/reyohoho/#/movie/{id}', enabled: true },
        { id: 'kp_gg', name: 'GG', color: '#9C27B0', template: 'https://www.kinopoisk.gg/{type}/{id}-{translit}', enabled: true },
        { id: 'freefk', name: 'FreeFKSee', color: '#FF9800', template: 'https://alpha.freefksee.ru/watch/id_{id}', enabled: true },
        { id: 'kp_one', name: 'Kinopoisk.One', color: '#FF5722', template: 'https://www.kinopoisk.one/{type}/{id}/', enabled: true },
        { id: 'rutube', name: 'Rutube', color: '#DE002B', template: 'https://rutube.ru/search/?query={title}', enabled: true },
        { id: 'vk', name: 'VK Video', color: '#0077FF', template: 'https://vkvideo.ru/?q={title}', enabled: true },
        { id: 'tapeop', name: 'Tape Operator', color: '#6C5CE7', template: 'special:tapeop', enabled: true }
    ];

    // --- CSS СТИЛИ ---
    const STYLES_CSS = `
        /* Основной контейнер - на всю ширину */
        .kp-mirror-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
            margin-bottom: 15px;
            align-items: center;
            font-family: 'Graphik Kinopoisk LC', sans-serif;
            justify-content: center;
            width: 100%;
            clear: both;
            padding: 0 16px; /* Отступы как у основного контента */
            box-sizing: border-box;
        }

        @media (max-width: 768px) {
            .kp-mirror-wrapper {
                gap: 6px;
            }
            .kp-mirror-btn {
                flex-grow: 1;
                min-width: 90px;
                padding: 12px 4px !important;
                font-size: 13px !important;
            }
        }

        .kp-mirror-btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px 14px; border: none; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; transition: transform 0.2s ease, filter 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.2); opacity: 0.95; position: relative; user-select: none; -webkit-tap-highlight-color: transparent; }
        .kp-mirror-btn:hover { opacity: 1; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.3); filter: brightness(1.1); }

        .kp-telegram-btn { background: #24A1DE; padding: 8px 14px; gap: 6px; }
        .kp-telegram-icon { width: 16px; height: 16px; fill: white; }

        .kp-settings-btn { background: #333; width: 36px; height: 36px; padding: 0; border-radius: 50%; flex-grow: 0 !important; min-width: 36px !important; }
        .kp-settings-icon { width: 20px; height: 20px; fill: #ccc; transition: transform 0.5s ease; }
        .kp-settings-btn:hover .kp-settings-icon { fill: #fff; transform: rotate(90deg); }

        .kp-hotkey-hint { font-size: 9px; position: absolute; top: -4px; right: -4px; background: #333; color: #fff; padding: 1px 4px; border-radius: 4px; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
        .kp-mirror-wrapper:hover .kp-hotkey-hint { opacity: 1; }

        /* Модальное окно */
        .kp-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: opacity 0.3s; backdrop-filter: blur(3px); }
        .kp-modal-overlay.active { opacity: 1; pointer-events: auto; }
        .kp-modal { background: #1f1f1f; color: #fff; padding: 20px; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); z-index: 10000; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
        .kp-modal h3 { margin: 0; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .kp-source-list { display: flex; flex-direction: column; gap: 5px; max-height: 300px; overflow-y: auto; padding-right: 5px; }
        .kp-source-item { display: flex; align-items: center; justify-content: space-between; background: #2a2a2a; padding: 8px 12px; border-radius: 6px; user-select: none; }
        .kp-source-item.disabled { opacity: 0.6; }
        .kp-source-left { display: flex; align-items: center; gap: 10px; flex-grow: 1; }
        .kp-checkbox { accent-color: #f60; cursor: pointer; width: 16px; height: 16px; }
        .kp-source-name { font-weight: 600; }
        .kp-source-actions { display: flex; gap: 5px; }
        .kp-action-btn { background: #444; border: none; color: #fff; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: background 0.2s; }
        .kp-action-btn:hover { background: #666; }
        .kp-action-btn.delete { background: #8B0000; }
        .kp-add-form { background: #252525; padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 8px; border: 1px solid #333; }
        .kp-form-row { display: flex; gap: 8px; }
        .kp-input { background: #111; border: 1px solid #444; color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 13px; flex-grow: 1; }
        .kp-input-color { width: 50px; padding: 0; border: none; height: 30px; cursor: pointer; }
        .kp-modal-footer { border-top: 1px solid #333; padding-top: 15px; display: flex; justify-content: space-between; align-items: center; }
        .kp-btn-primary { background: #f60; color: #fff; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .kp-btn-close { background: transparent; color: #aaa; border: none; cursor: pointer; text-decoration: underline; }
        .kp-hint { font-size: 11px; color: #888; margin-top: 4px; }
    `;

    function injectStyles(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }
    injectStyles(STYLES_CSS);

    // --- SAFE API ---
    const SafeAPI = {
        save: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); } },
        load: (key) => { try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : null; } catch (e) { return null; } },
        openTab: (url) => {
            if (typeof GM_openInTab === 'function') GM_openInTab(url, { active: true });
            else if (typeof GM !== 'undefined' && GM.openInTab) GM.openInTab(url, { active: true });
            else window.open(url, '_blank');
        }
    };

    const Utils = {
        transliterate: (text) => {
            if (!text) return '';
            const rus = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
            const eng = "abvgdeezzijklmnoprstufhzcss_y_euaABVGDEEZZIJKLMNOPRSTUFHZCSS_Y_EUA";
            let res = '';
            for (let i = 0; i < text.length; i++) { const idx = rus.indexOf(text[i]); res += idx !== -1 ? eng[idx] : text[i]; }
            return res.replace(/\s+/g, '-').toLowerCase();
        },
        getPageType: () => window.location.href.includes('/series/') ? 'series' : 'film',
        getId: () => {
            const parts = window.location.pathname.split('/');
            const idx = parts.findIndex(p => p === 'film' || p === 'series');
            return (idx !== -1 && parts[idx + 1]) ? parts[idx + 1] : null;
        },
        getTitle: () => {
            let t = document.querySelector('meta[property="og:title"]')?.content;
            if (t) return t.replace(/^Кинопоиск\.\s*/i, '').replace(/\s*\(\d{4}\)/, '').trim();
            t = document.querySelector('h1')?.textContent;
            return t ? t.replace(/\s*\(\d{4}\)/, '').trim() : null;
        }
    };

    class KinopoiskEnhancer {
        constructor() {
            this.data = { forceNewTab: true, sources: [...DEFAULT_SOURCES] };
            this.renderTimeout = null;
            this.init();
        }

        init() {
            this.loadData();
            this.setupHotkeys();
            this.debouncedRender();
            this.startObserver();
        }

        loadData() {
            const stored = SafeAPI.load(CONFIG.storageKey);
            if (stored) {
                this.data.forceNewTab = stored.forceNewTab ?? true;
                if (stored.sources && Array.isArray(stored.sources)) this.data.sources = stored.sources;
            }
        }

        saveData() { SafeAPI.save(CONFIG.storageKey, this.data); }

        buildUrl(template, kpId, title) {
            if (template === 'special:tapeop') return 'special:tapeop';
            let url = template;
            const type = Utils.getPageType();
            const translit = Utils.transliterate(title);
            url = url.replace(/{id}/g, kpId || '').replace(/{type}/g, type).replace(/{title}/g, encodeURIComponent(title || '')).replace(/{translit}/g, translit);
            return url;
        }

        setupHotkeys() {
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key >= '1' && e.key <= '9') {
                    const index = parseInt(e.key) - 1;
                    const activeSources = this.data.sources.filter(s => s.enabled);
                    if (activeSources[index]) {
                        const kpId = Utils.getId();
                        const title = Utils.getTitle();
                        this.openSource(activeSources[index], kpId, title);
                    }
                }
            });
        }

        static initTapeOpReceiver() {
            const data = SafeAPI.load('movie-data');
            if (data) {
                localStorage.removeItem('movie-data');
                const script = document.createElement('script');
                script.innerHTML = `globalThis.init(JSON.parse('${JSON.stringify(data)}'), '5.1');`;
                document.body.appendChild(script);
            }
        }

        openSource(source, kpId, title) {
            if (source.template === 'special:tapeop') {
                SafeAPI.save('movie-data', { kinopoisk: kpId, title });
                SafeAPI.openTab(CONFIG.tapeOpUrl);
                return;
            }
            const url = this.buildUrl(source.template, kpId, title);
            if (this.data.forceNewTab) SafeAPI.openTab(url);
            else window.location.href = url;
        }

        createSettingsModal() {
            if (document.getElementById('kp-settings-modal')) return;
            const overlay = document.createElement('div');
            overlay.id = 'kp-settings-modal';
            overlay.className = 'kp-modal-overlay';
            const renderSourcesList = () => {
                const container = overlay.querySelector('.kp-source-list');
                if (!container) return;
                container.innerHTML = '';
                this.data.sources.forEach((src, index) => {
                    const item = document.createElement('div');
                    item.className = `kp-source-item ${src.enabled ? '' : 'disabled'}`;
                    item.innerHTML = `
                        <div class="kp-source-left">
                            <input type="checkbox" class="kp-checkbox" ${src.enabled ? 'checked' : ''}>
                            <span class="kp-source-name" style="color: ${src.color}">${src.name}</span>
                        </div>
                        <div class="kp-source-actions">
                            <button class="kp-action-btn move-up" title="Вверх">⬆️</button>
                            <button class="kp-action-btn move-down" title="Вниз">⬇️</button>
                            ${!DEFAULT_SOURCES.find(d => d.id === src.id) ? '<button class="kp-action-btn delete" title="Удалить">✖</button>' : ''}
                        </div>
                    `;
                    item.querySelector('.kp-checkbox').onchange = (e) => { src.enabled = e.target.checked; item.className = `kp-source-item ${src.enabled ? '' : 'disabled'}`; };
                    item.querySelector('.move-up').onclick = () => { if (index > 0) { [this.data.sources[index], this.data.sources[index - 1]] = [this.data.sources[index - 1], this.data.sources[index]]; renderSourcesList(); } };
                    item.querySelector('.move-down').onclick = () => { if (index < this.data.sources.length - 1) { [this.data.sources[index], this.data.sources[index + 1]] = [this.data.sources[index + 1], this.data.sources[index]]; renderSourcesList(); } };
                    const delBtn = item.querySelector('.delete');
                    if (delBtn) delBtn.onclick = () => { if (confirm(`Удалить кнопку "${src.name}"?`)) { this.data.sources.splice(index, 1); renderSourcesList(); } };
                    container.appendChild(item);
                });
            };
            overlay.innerHTML = `
                <div class="kp-modal">
                    <h3>Настройка кнопок <button class="kp-btn-close">Закрыть</button></h3>
                    <div style="display:flex; align-items:center; gap:10px; padding-bottom:10px;">
                        <input type="checkbox" id="st-newtab" class="kp-checkbox" ${this.data.forceNewTab ? 'checked' : ''}>
                        <label for="st-newtab" style="cursor:pointer">Всегда открывать в новой вкладке</label>
                    </div>
                    <div class="kp-source-list"></div>
                    <div class="kp-add-form">
                        <span style="font-weight:bold; font-size:13px;">Добавить свою кнопку:</span>
                        <div class="kp-form-row">
                            <input type="text" id="new-name" class="kp-input" placeholder="Название">
                            <input type="color" id="new-color" class="kp-input-color" value="#ffffff">
                        </div>
                        <input type="text" id="new-url" class="kp-input" placeholder="Ссылка: https://site.com/watch/{id}">
                        <button class="kp-btn-primary" id="btn-add-source" style="margin-top:5px; font-size:12px; padding:5px;">Добавить</button>
                    </div>
                    <div class="kp-modal-footer"><button class="kp-btn-primary kp-save-btn" style="width:100%">Сохранить настройки</button></div>
                </div>
            `;
            setTimeout(renderSourcesList, 0);
            overlay.onclick = (e) => { if(e.target === overlay) overlay.classList.remove('active'); };
            overlay.querySelector('.kp-btn-close').onclick = () => overlay.classList.remove('active');
            overlay.querySelector('.kp-save-btn').onclick = () => {
                this.data.forceNewTab = overlay.querySelector('#st-newtab').checked;
                this.saveData();
                this.render(true);
                overlay.classList.remove('active');
            };
            overlay.querySelector('#btn-add-source').onclick = () => {
                const name = overlay.querySelector('#new-name').value.trim();
                const url = overlay.querySelector('#new-url').value.trim();
                const color = overlay.querySelector('#new-color').value;
                if (!name || !url) return alert('Заполните поля!');
                this.data.sources.push({ id: 'custom_' + Date.now(), name: name, color: color, template: url, enabled: true });
                overlay.querySelector('#new-name').value = ''; overlay.querySelector('#new-url').value = '';
                renderSourcesList();
            };
            document.body.appendChild(overlay);
        }

        // --- ПОИСК ОРИЕНТИРА НА ОСНОВЕ HTML ПОЛЬЗОВАТЕЛЯ ---
        findAnchor() {
            // 1. Самый точный поиск по классу из HTML пользователя
            const buttonBar = document.querySelector('.style_buttonBar__Su2eL') ||
                              document.querySelector('.styles_root__giEsN'); // Внутренний контейнер

            if (buttonBar) return buttonBar;

            // 2. Поиск кнопки "Еще" (она уникальна для этого меню)
            const moreButton = document.querySelector('button.styles_more__URDt5');
            if (moreButton) {
                // Поднимаемся до общего контейнера
                const parentRow = moreButton.closest('.styles_root__giEsN') ||
                                  moreButton.closest('.style_buttonBar__Su2eL');
                if (parentRow) return parentRow;
            }

            // 3. Фоллбэк на десктопные контейнеры
            const desktopContainer = document.querySelector('[class*="styles_buttonsContainer__"]');
            if (desktopContainer) return desktopContainer;

            return null;
        }

        render(force = false) {
            const kpId = Utils.getId();
            const title = Utils.getTitle();
            if (!kpId) return;

            const globalExisting = document.querySelector('.kp-mirror-wrapper');
            if (globalExisting && !force) return;
            if (globalExisting && force) globalExisting.remove();

            const anchor = this.findAnchor();
            if (!anchor) return; // Если не нашли, куда вставлять, не рисуем

            const wrapper = document.createElement('div');
            wrapper.className = 'kp-mirror-wrapper';

            let hotkeyCounter = 1;
            this.data.sources.forEach(src => {
                if (!src.enabled) return;
                const btn = document.createElement('button');
                btn.className = 'kp-mirror-btn';
                btn.textContent = src.name;
                btn.style.background = src.color;
                if (window.innerWidth > 1024 && hotkeyCounter <= 9) {
                    const hint = document.createElement('span');
                    hint.className = 'kp-hotkey-hint';
                    hint.textContent = `Alt+${hotkeyCounter}`;
                    btn.appendChild(hint);
                    hotkeyCounter++;
                }
                btn.onclick = (e) => { e.preventDefault(); this.openSource(src, kpId, title); };
                wrapper.appendChild(btn);
            });

            const tgBtn = document.createElement('a');
            tgBtn.className = 'kp-mirror-btn kp-telegram-btn';
            tgBtn.href = CONFIG.telegramUrl;
            tgBtn.target = '_blank';
            tgBtn.innerHTML = `<svg class="kp-telegram-icon" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.361 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.098.152.228.166.33.016.113.02.325.016.365z"/></svg>Скрипты`;
            wrapper.appendChild(tgBtn);

            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'kp-mirror-btn kp-settings-btn';
            settingsBtn.innerHTML = `<svg class="kp-settings-icon" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;
            settingsBtn.onclick = (e) => {
                e.preventDefault();
                this.createSettingsModal();
                setTimeout(() => document.getElementById('kp-settings-modal').classList.add('active'), 10);
            };
            wrapper.appendChild(settingsBtn);

            // ВСТАВКА: Если у нас ButtonBar, вставляем ПОСЛЕ него
            anchor.after(wrapper);
        }

        debouncedRender() {
            if (this.renderTimeout) clearTimeout(this.renderTimeout);
            this.renderTimeout = setTimeout(() => {
                this.cleanGarbage();
                this.render();
            }, 300);
        }

        cleanGarbage() {
            const selectors = ['.kinopoisk-watch-online-button', 'a[href*="/plus/"]', '.styles_subscriptionOffer__eau7V'];
            selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => { el.style.display = 'none'; }));
            document.querySelectorAll('button').forEach(btn => {
                if (btn.textContent && (btn.textContent.includes('Попробовать Плюс') || btn.textContent.includes('Билеты'))) btn.style.display = 'none';
            });
        }

        startObserver() {
            const observer = new MutationObserver((mutations) => {
                const isOwnMutation = Array.from(mutations).every(m => m.target.closest && m.target.closest('.kp-mirror-wrapper'));
                if (isOwnMutation) return;
                let shouldRender = false;
                for (let m of mutations) if (m.addedNodes.length) shouldRender = true;
                if (shouldRender) this.debouncedRender();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (window.location.hostname.includes('tapeop.dev')) {
        window.addEventListener('load', () => setTimeout(KinopoiskEnhancer.initTapeOpReceiver, 500));
    } else {
        const app = new KinopoiskEnhancer();
        const start = () => { app.debouncedRender(); app.startObserver(); };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
        else start();
    }

})();