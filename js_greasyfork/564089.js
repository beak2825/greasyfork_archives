// ==UserScript==
// @name         Huuto.net Movies - Search Buttons & Redirects
// @name:en      Huuto.net Movies - Search Buttons & Redirects
// @namespace    https://greasyfork.org/en/users/1552401-chipfin
// @version      1.4.7
// @description  Lisää hakunapit Huuto.nettiin ja hoitaa uudelleenohjaukset (myös FIx-galleria -Proxy -toiminnot). Korjattu Videospace-ohjaus.
// @description:en  Adds search buttons to Huuto.net and handles redirects (including FIx-galleria -Proxy functions). Fixed Videospace redirect.
// @icon         https://www.huuto.net/favicon.ico
// @author       Gemini 3 Pro, Claude 4.5 Sonnet, ChatGPT-5.2
// @match        https://www.huuto.net/kohteet/*/*
// @match        https://videospace.fi/releases?se=*
// @match        https://www.fixgalleria.net/haku?*
// @match        https://www.fixgalleria.net/julkaisu/*
// @match        https://www.finna.fi/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564089/Huutonet%20Movies%20-%20Search%20Buttons%20%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/564089/Huutonet%20Movies%20-%20Search%20Buttons%20%20Redirects.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // =========================================================================
    // APUFUNKTIOT
    // =========================================================================

    // Tehokas elementtien odotus MutationObserverilla
    function waitForElement(selector, callback, timeout = 5000) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                clearTimeout(timer);
                callback(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        const timer = setTimeout(() => {
            observer.disconnect();
        }, timeout);
    }

    function showRedirectOverlay(site) {
        const d = document.createElement('div');
        d.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;background:#333;color:#fff;padding:10px 16px;border-radius:6px;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,0.3);';
        d.textContent = `Single result. Redirecting to ${site} item...`;
        document.body.appendChild(d);
    }

    // =========================================================================
    // ASETUKSET JA TYYLIT
    // =========================================================================

    const STOPWORDS_KEY = 'huuto_custom_stopwords';
    const POPUP_ENABLED_KEY = 'huuto_popup_enabled';
    const BUTTON_ORDER_KEY = 'huuto_button_order';
    const DISABLED_BUTTONS_KEY = 'huuto_disabled_buttons';
    
    const DEFAULT_CUSTOM_STOPWORDS = ['isokoppa vhs', 'isokoppa', 'vhs'];
    // PÄIVITETTY NIMET (via FIx-galleria)
    const DEFAULT_BUTTON_ORDER = 'Videospace, Finna, IMDb, FIx-galleria, IMDb (via FIx-galleria), OS (via FIx-galleria), SB (via FIx-galleria)';
    const DEFAULT_DISABLED_BUTTONS = ['SB (via FIx-galleria)']; // Superbits oletuksena piilotettu

    GM_addStyle(`
        #hn-settings-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 100000; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif; }
        #hn-settings-modal { background: #fff; padding: 25px; border-radius: 8px; width: 450px; max-width: 90%; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        #hn-settings-modal h3 { margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 15px; color: #333; }
        #hn-settings-list { list-style: none; padding: 0; margin: 20px 0; border: 1px solid #eee; border-radius: 4px; overflow-y: auto; max-height: 60vh; }
        
        .hn-sortable-item { padding: 10px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; cursor: grab; display: flex; align-items: center; transition: background 0.2s; user-select: none; }
        .hn-sortable-item:last-child { border-bottom: none; }
        .hn-sortable-item:hover { background: #f0f0f0; }
        .hn-sortable-item.dragging { opacity: 0.5; background: #e0e0e0; }
        
        .hn-drag-handle { margin-right: 15px; color: #999; font-size: 20px; line-height: 1; cursor: grab; display: flex; align-items: center; }
        
        .hn-visible-cb { 
            appearance: auto !important; 
            -webkit-appearance: checkbox !important;
            display: block !important;
            width: 16px !important; 
            height: 16px !important; 
            margin: 0 12px 0 0 !important;
            opacity: 1 !important;
            transform: scale(1.2); 
            cursor: pointer; 
            position: static !important;
            visibility: visible !important;
            align-self: center !important;
        }

        .hn-item-text { font-weight: 600; flex-grow: 1; color: #333; transition: color 0.2s; }
        .hn-sortable-item.disabled .hn-item-text { color: #aaa; font-weight: 500; }
        .hn-sortable-item.disabled .hn-preview-badge { opacity: 0.4; filter: grayscale(100%); }

        .hn-preview-badge { display: inline-flex; align-items: center; padding: 0 8px; height: 28px; border-radius: 4px; color: #fff; font-size: 13px; font-weight: bold; margin-left: auto; pointer-events: none; transition: opacity 0.2s, filter 0.2s; }
        
        #hn-settings-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; }
        .hn-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 14px; }
        .hn-btn-primary { background: #0066cc; color: white; }
        .hn-btn-primary:hover { background: #0055aa; }
        .hn-btn-secondary { background: #e0e0e0; color: #333; }
        .hn-btn-secondary:hover { background: #d0d0d0; }
        .hn-stopword-popup { position: absolute; background: #f5c518; color: #000; padding: 6px 12px; border-radius: 4px; z-index: 10000; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-size: 13px; font-weight: 600; }
    `);

    const ICONS = {
        'IMDb': `<img src="https://web.archive.org/web/20100218184601im_/http://i.imdb.com/favicon.ico" style="width:16px;height:16px;">`,
        'FIx-galleria': `<img src="https://www.fixgalleria.net/assets/img/favicon.ico" style="width:16px;height:16px;">`,
        'Videospace': `<img src="https://videospace.fi/favicon.ico" style="width:16px;height:16px;">`,
        'Finna': `<svg height="16" viewBox="0 0 4.736 10.688" xmlns="http://www.w3.org/2000/svg"><g stroke-linecap="round" fill-rule="nonzero" font-size="9pt" stroke="currentColor" stroke-width="0" fill="currentColor" style="stroke:currentColor;stroke-width:0;fill:currentColor"><path d="M 1.536 9.92 C 1.536 10.352 1.2 10.688 0.768 10.688 C 0.352 10.688 0 10.352 0 9.92 L 0 0.768 C 0 0.352 0.352 0 0.768 0 L 3.968 0 C 4.4 0 4.736 0.352 4.736 0.768 C 4.736 1.2 4.4 1.536 3.968 1.536 L 1.536 1.536 L 1.536 4.416 L 3.648 4.416 C 4.08 4.416 4.416 4.768 4.416 5.184 C 4.416 5.616 4.08 5.952 3.648 5.952 L 1.536 5.952 L 1.536 9.92 Z"/></g></svg>`,
        'IMDb (via FIx-galleria)': `<img src="https://web.archive.org/web/20100218184601im_/http://i.imdb.com/favicon.ico" style="width:16px;height:16px;filter:grayscale(100%);">`,
        'OS (via FIx-galleria)': `<img src="https://static.opensubtitles.org/favicon.ico" style="width:16px;height:16px;">`,
        'SB (via FIx-galleria)': `<img src="https://superbits.org/favicon.ico" style="width:16px;height:16px;">`
    };

    const COLORS = {
        'IMDb': { bg: '#f5c518', text: '#000' },
        'FIx-galleria': { bg: '#0066cc', text: '#fff' },
        'Videospace': { bg: '#333', text: '#fff' },
        'Finna': { bg: '#723981', text: '#fff' },
        'IMDb (via FIx-galleria)': { bg: '#e0e0e0', text: '#000' },
        'OS (via FIx-galleria)': { bg: '#eff9df', text: '#000' },
        'SB (via FIx-galleria)': { bg: '#457cce', text: '#fff' }
    };

    // =========================================================================
    // VALIKKOMENUT
    // =========================================================================

    async function openSortableSettings() {
        if (document.getElementById('hn-settings-overlay')) return;

        const currentOrderStr = await GM_getValue(BUTTON_ORDER_KEY, DEFAULT_BUTTON_ORDER);
        let items = currentOrderStr.split(',').map(s => s.trim());
        const allKeys = Object.keys(ICONS);
        items = [...new Set([...items, ...allKeys])].filter(k => allKeys.includes(k));
        
        const disabledKeys = await GM_getValue(DISABLED_BUTTONS_KEY, DEFAULT_DISABLED_BUTTONS);

        const overlay = document.createElement('div');
        overlay.id = 'hn-settings-overlay';
        
        const modal = document.createElement('div');
        modal.id = 'hn-settings-modal';
        
        modal.innerHTML = `
            <h3>Muokkaa painikkeita</h3>
            <p style="margin-bottom:10px;color:#666;font-size:14px;">Raahaa järjestystä. Poista ruksi piilottaaksesi napin.</p>
            <ul id="hn-settings-list"></ul>
            <div id="hn-settings-actions">
                <button class="hn-btn hn-btn-secondary" id="hn-cancel-btn">Peruuta</button>
                <button class="hn-btn hn-btn-primary" id="hn-save-btn">Tallenna</button>
            </div>
        `;

        const list = modal.querySelector('#hn-settings-list');

        items.forEach(key => {
            const li = document.createElement('li');
            li.className = 'hn-sortable-item';
            li.setAttribute('draggable', 'true');
            li.dataset.key = key;
            
            const conf = COLORS[key];
            const icon = ICONS[key];
            const isChecked = !disabledKeys.includes(key);
            
            if (!isChecked) li.classList.add('disabled');
            
            li.innerHTML = `
                <span class="hn-drag-handle">☰</span>
                <input type="checkbox" class="hn-visible-cb" ${isChecked ? 'checked' : ''} title="Näytä/Piilota">
                <span class="hn-item-text">${key}</span>
                <span class="hn-preview-badge" style="background:${conf.bg};color:${conf.text};">${icon}</span>
            `;
            
            const checkbox = li.querySelector('.hn-visible-cb');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    li.classList.remove('disabled');
                } else {
                    li.classList.add('disabled');
                }
            });

            list.appendChild(li);
        });

        let draggedItem = null;
        list.addEventListener('dragstart', (e) => { draggedItem = e.target; e.target.classList.add('dragging'); });
        list.addEventListener('dragend', (e) => { e.target.classList.remove('dragging'); draggedItem = null; });
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(list, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) list.appendChild(draggable);
            else list.insertBefore(draggable, afterElement);
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.hn-sortable-item:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
                else return closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('hn-cancel-btn').onclick = () => document.body.removeChild(overlay);
        document.getElementById('hn-save-btn').onclick = async () => {
            const listItems = [...list.querySelectorAll('.hn-sortable-item')];
            const newOrder = listItems.map(li => li.dataset.key);
            const newDisabled = listItems.filter(li => !li.querySelector('.hn-visible-cb').checked).map(li => li.dataset.key);
            
            await GM_setValue(BUTTON_ORDER_KEY, newOrder.join(', '));
            await GM_setValue(DISABLED_BUTTONS_KEY, newDisabled);
            
            document.body.removeChild(overlay);
            location.reload();
        };
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) document.body.removeChild(overlay);
        });
    }
    GM_registerMenuCommand('Muokkaa painikkeiden järjestystä', openSortableSettings, 'o');

    function showStopwordsDialog() {
        if (document.getElementById('stopwords-dialog-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'stopwords-dialog-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:9998;';
        const dialog = document.createElement('div');
        dialog.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border-radius:8px;z-index:9999;width:400px;';
        dialog.innerHTML = '<h3>Edit Stop Words</h3><textarea style="width:100%;height:150px;" id="hn-sw-text"></textarea><br><br><button class="hn-btn hn-btn-primary" id="hn-sw-save">Save</button> <button class="hn-btn hn-btn-secondary" id="hn-sw-close">Cancel</button>';
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        const ta = document.getElementById('hn-sw-text');
        GM_getValue(STOPWORDS_KEY, DEFAULT_CUSTOM_STOPWORDS).then(words => ta.value = words.join('\n'));
        
        document.getElementById('hn-sw-save').onclick = () => {
            GM_setValue(STOPWORDS_KEY, ta.value.split('\n').map(s=>s.trim()).filter(Boolean));
            document.body.removeChild(overlay); document.body.removeChild(dialog);
        };
        document.getElementById('hn-sw-close').onclick = () => { document.body.removeChild(overlay); document.body.removeChild(dialog); };
    }
    GM_registerMenuCommand('Edit Huuto.net Stop Words', showStopwordsDialog, 'h');

    async function togglePopup() {
        const current = await GM_getValue(POPUP_ENABLED_KEY, false);
        const next = !current;
        await GM_setValue(POPUP_ENABLED_KEY, next);
        alert(`Stopword Popup is now ${next ? 'ENABLED' : 'DISABLED'}.`);
    }
    GM_registerMenuCommand('Toggle Stopword Popup (ON/OFF)', togglePopup, 't');


    // =========================================================================
    // HUUTO.NET LOGIC
    // =========================================================================

    if (window.location.href.includes('huuto.net/kohteet/')) {
        (async () => {
            const h1 = document.querySelector("h1.item-title");
            if (!h1) return;

            let isMovieCategory = false;
            let isVHS = false;
            const breadcrumbs = document.querySelectorAll('.breadcrumb--item a');
            breadcrumbs.forEach(link => {
                const href = link.getAttribute('href') || '';
                const text = link.textContent.toLowerCase();
                if (href.includes('/elokuvat/') || text.includes('elokuvat') || href.includes('dvd') || text.includes('video')) isMovieCategory = true;
                if (href.includes('vhs') || text.includes('vhs')) { isVHS = true; isMovieCategory = true; }
            });

            if (!isMovieCategory) return;

            // Stopword popup
            h1.addEventListener('mouseup', async (e) => {
                const isPopupEnabled = await GM_getValue(POPUP_ENABLED_KEY, false);
                if (!isPopupEnabled) return;
                
                if (e.target.closest('a.custom-search-btn')) return;
                const sel = window.getSelection().toString().trim();
                if (sel) {
                    const d = document.createElement('div');
                    d.className = 'hn-stopword-popup';
                    d.style.left = e.pageX + 'px'; d.style.top = (e.pageY+10) + 'px';
                    d.innerText = `Exclude "${sel}"?`;
                    d.onclick = async () => {
                        const w = await GM_getValue(STOPWORDS_KEY, DEFAULT_CUSTOM_STOPWORDS);
                        if (!w.includes(sel)) { w.push(sel); await GM_setValue(STOPWORDS_KEY, w); }
                        d.remove();
                    };
                    document.body.appendChild(d);
                    setTimeout(()=>d.remove(), 3000);
                }
            });

            function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

            const fullText = h1.innerText.trim();
            const customStopwords = await GM_getValue(STOPWORDS_KEY, DEFAULT_CUSTOM_STOPWORDS);
            let customRegex = null;
            if (customStopwords && customStopwords.length > 0) {
                const pattern = '\\b(' + customStopwords.map(escapeRegExp).join('|') + ')\\b';
                customRegex = new RegExp(pattern, 'ig');
            }
            let shortText = fullText;
            if (customRegex) shortText = shortText.replace(customRegex, '');
            
            // 1.4.4 FIX: Lisää välilyönti jos otsikko on muodossa "Sana -Sana" -> "Sana - Sana"
            shortText = shortText.replace(/(\s-)(\S)/g, '$1 $2');

            shortText = shortText.replace(/\b\d+\s*DVD\b/ig, '').replace(/\bDVD\b/ig, '').replace(/\bBlu[- ]?ray\b/ig, '').replace(/\b4K\s*(?:UHD|Ultra\s*HD)\b/ig, '').replace(/\s+/g, ' ').trim();
            const match = shortText.match(/^(.*?\(\s*\d{4})/);
            if (match && match[1]) shortText = match[1].trim();
            const encodedQuery = encodeURIComponent(shortText);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display:inline-flex;align-items:center;gap:8px;margin-left:12px;vertical-align:middle;';

            function createBtn(url, title, bg, text, iconHtml) {
                const btn = document.createElement('a');
                btn.href = url;
                btn.title = title;
                btn.className = 'custom-search-btn';
                // Pakotettu neliö
                btn.style.cssText = `display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;background-color:${bg};border-radius:4px;text-decoration:none;transition:background-color 0.2s ease;color:${text};`;
                
                btn.onmouseenter = () => btn.style.opacity = '0.9';
                btn.onmouseleave = () => btn.style.opacity = '1';

                btn.addEventListener('click', (e) => {
                    if (e.button === 0 && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                        e.preventDefault();
                        GM_openInTab(url, { active: false });
                    }
                });

                const iconContainer = document.createElement('span');
                iconContainer.style.display = 'flex';
                iconContainer.style.alignItems = 'center';
                iconContainer.innerHTML = iconHtml;
                btn.appendChild(iconContainer);
                return btn;
            }

            const buttons = {
                'IMDb': () => createBtn("https://www.imdb.com/find/?s=all&q=" + encodedQuery, 'IMDb', COLORS.IMDb.bg, COLORS.IMDb.text, ICONS.IMDb),
                'FIx-galleria': () => isVHS ? createBtn('https://www.fixgalleria.net/haku?tyyppi=julkaisu&q=' + encodedQuery, 'FIx-galleria', COLORS['FIx-galleria'].bg, COLORS['FIx-galleria'].text, ICONS['FIx-galleria']) : null,
                'Videospace': () => createBtn('https://videospace.fi/releases?se=' + encodedQuery, 'Videospace', COLORS.Videospace.bg, COLORS.Videospace.text, ICONS.Videospace),
                'Finna': () => createBtn('https://www.finna.fi/Search/Results?limit=20&lookfor=' + encodedQuery + '&type=Title&filter%5B%5D=%7Eformat_ext_str_mv%3A%220%2FVideo%2F%22', 'Finna', COLORS.Finna.bg, COLORS.Finna.text, ICONS.Finna),
                
                // FIX-PROXY
                'IMDb (via FIx-galleria)': () => createBtn(
                    'https://www.fixgalleria.net/haku?tyyppi=julkaisu&q=' + encodedQuery + '&autoredirect=imdb',
                    'Etsi FIx-galleriasta ja avaa IMDb',
                    COLORS['IMDb (via FIx-galleria)'].bg, COLORS['IMDb (via FIx-galleria)'].text, ICONS['IMDb (via FIx-galleria)']
                ),
                'OS (via FIx-galleria)': () => createBtn(
                    'https://www.fixgalleria.net/haku?tyyppi=julkaisu&q=' + encodedQuery + '&autoredirect=os',
                    'Etsi FIx-galleriasta ja avaa OpenSubtitles',
                    COLORS['OS (via FIx-galleria)'].bg, COLORS['OS (via FIx-galleria)'].text, ICONS['OS (via FIx-galleria)']
                ),
                'SB (via FIx-galleria)': () => createBtn(
                    'https://www.fixgalleria.net/haku?tyyppi=julkaisu&q=' + encodedQuery + '&autoredirect=sb',
                    'Etsi FIx-galleriasta ja avaa Superbits',
                    COLORS['SB (via FIx-galleria)'].bg, COLORS['SB (via FIx-galleria)'].text, ICONS['SB (via FIx-galleria)']
                )
            };

            const userOrderStr = await GM_getValue(BUTTON_ORDER_KEY, DEFAULT_BUTTON_ORDER);
            let order = userOrderStr.split(',').map(s => s.trim());
            const allKeys = Object.keys(buttons);
            order = [...new Set([...order, ...allKeys])].filter(k => allKeys.includes(k));
            
            const disabledKeys = await GM_getValue(DISABLED_BUTTONS_KEY, DEFAULT_DISABLED_BUTTONS);

            order.forEach(key => {
                if (disabledKeys.includes(key)) return;
                const btnFunc = buttons[key];
                if (btnFunc) {
                    const btn = btnFunc();
                    if (btn) buttonContainer.appendChild(btn);
                }
            });

            h1.style.display = 'inline-flex';
            h1.style.alignItems = 'center';
            h1.style.flexWrap = 'wrap';
            h1.appendChild(buttonContainer);
        })();
    }

    // =========================================================================
    // VIDEOSPACE REDIRECT (Updated 1.4.3: Wait for both count and link)
    // =========================================================================
    if (window.location.href.includes('videospace.fi/releases?se=')) {
        // Luodaan oma tarkkailija, joka varmistaa sekä tulosmäärän että linkin olemassaolon
        const observer = new MutationObserver(() => {
            const countEl = document.querySelector('.row.mt-0.mb-1 .smaller-txt b');
            const link = document.querySelector('.row.mt-0.align-center .pa-1.relative a[href^="/release/"]');
            
            // Odotetaan, että molemmat ovat olemassa ja count on "1"
            if (countEl && countEl.textContent.trim() === '1' && link) {
                observer.disconnect();
                showRedirectOverlay('Videospace');
                setTimeout(() => window.location.href = 'https://videospace.fi' + link.getAttribute('href'), 11);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Varmuuden vuoksi lopetetaan tarkkailu 5 sekunnin kuluttua
        setTimeout(() => observer.disconnect(), 5000);
    }

    // =========================================================================
    // FIXGALLERIA SEARCH REDIRECT (Optimized + Smart Search)
    // =========================================================================
    if (window.location.href.includes('fixgalleria.net/haku')) {
        let attempted = false;
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        const autoRedirectMode = urlParams.get('autoredirect');

        waitForElement('.g-items-container', () => {
            if (attempted) return;
            const items = document.querySelectorAll('.g-items-container a.g-list-item-link');
            let targetItem = null;

            if (items.length === 1) {
                targetItem = items[0];
            } else if (items.length > 1 && searchQuery) {
                const cleanQuery = searchQuery.trim().toLowerCase();
                const itemsArray = Array.from(items);
                targetItem = itemsArray.find(item => {
                    const titleContainer = item.querySelector('.g-list-item-title-container');
                    if (!titleContainer) return false;
                    const cleanTitle = titleContainer.textContent.trim().replace(/\s*\(\d{4}(?:–\d{4})?\)$/, '').trim().toLowerCase();
                    return cleanTitle === cleanQuery;
                });
            }

            if (targetItem) { 
                attempted = true; 
                let targetUrl = targetItem.href;
                if (autoRedirectMode) {
                    targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'autoredirect=' + autoRedirectMode;
                }
                showRedirectOverlay(autoRedirectMode ? 'FIx-galleria (Proxy)' : 'FIx-galleria'); 
                setTimeout(() => window.location.href = targetUrl, 11); 
            }
        });
    }

    // =========================================================================
    // FIXGALLERIA ITEM PROXY REDIRECT (Optimized)
    // =========================================================================
    if (window.location.href.includes('fixgalleria.net/julkaisu')) {
        const urlParams = new URLSearchParams(window.location.search);
        const autoRedirectMode = urlParams.get('autoredirect');

        if (autoRedirectMode) {
            waitForElement('a.g-imdb-link', (imdbLink) => {
                const match = imdbLink.href.match(/tt\d+/);
                if (match) {
                    const imdbId = match[0];
                    const imdbNum = imdbId.replace('tt', '');
                    
                    const d = document.createElement('div');
                    d.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;background:#0066cc;color:#fff;padding:10px 16px;border-radius:6px;font-weight:600;box-shadow:0 2px 10px rgba(0,0,0,0.3);';
                    
                    let targetUrl;
                    if (autoRedirectMode === 'imdb') {
                        d.textContent = 'Redirecting to IMDb...';
                        targetUrl = imdbLink.href;
                    } else if (autoRedirectMode === 'os') {
                        d.textContent = 'Redirecting to OpenSubtitles...';
                        targetUrl = 'https://www.opensubtitles.org/fi/search/sublanguageid-fin/imdbid-' + imdbNum;
                    } else if (autoRedirectMode === 'sb') {
                        d.textContent = 'Redirecting to Superbits...';
                        targetUrl = 'https://login.superbits.org/requests/add?imdb=' + imdbId;
                    }
                    
                    document.body.appendChild(d);
                    setTimeout(() => window.location.href = targetUrl, 11);
                }
            });
        }
    }

    // =========================================================================
    // FINNA REDIRECT (Optimized)
    // =========================================================================
    if (window.location.href.includes('finna.fi/Search/Results')) {
        let attempted = false;
        waitForElement('.search-stats .total', (countEl) => {
            if (attempted || countEl.textContent.trim() !== '1') return;
            const link = document.querySelector('.record-list .result .title-container .search-title a.title');
            if (link) {
                attempted = true;
                showRedirectOverlay('Finna');
                setTimeout(() => window.location.href = link.href, 11);
            }
        });
    }

    // =========================================================================
    // FINNA AUTO-EXPAND (Robust interval fix)
    // =========================================================================
    if (window.location.hostname.includes('finna.fi')) {
        const clicker = setInterval(() => {
            const btn = document.querySelector('button.show-details-button');
            if (btn && btn.offsetParent !== null && !btn.dataset.clicked) {
                btn.click();
                btn.dataset.clicked = 'true';
                clearInterval(clicker);
            }
        }, 200);
        setTimeout(() => clearInterval(clicker), 5000); // Stop trying after 5s
    }

})();