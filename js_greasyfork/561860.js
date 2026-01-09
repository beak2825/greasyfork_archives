// ==UserScript==
// @name         X/Twitter Advanced Search
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @author       @yinyu985
// @description  Adds an advanced search panel to X/Twitter with visual controls for complex queries
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561860/XTwitter%20Advanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/561860/XTwitter%20Advanced%20Search.meta.js
// ==/UserScript==
(function () {
    'use strict';
    GM_addStyle(`
    :root {
        --ash-bg: #000000;
        --ash-border: #333639;
        --ash-text: #e7e9ea;
        --ash-text-sec: #71767b;
        --ash-input-bg: #16181c;
        --ash-input-border: #333333;
        --ash-input-focus: #000000;
        --ash-hover: rgba(255,255,255,0.03);
        --ash-shadow: rgba(0, 0, 0, 0.6);
        --ash-accent: #1d9bf0;
        --ash-placeholder: #536471;
    }
    #ash-perfect-panel {
        display: none;
        position: fixed;
        background: var(--ash-bg);
        border: 1px solid var(--ash-border);
        border-radius: 12px;
        box-shadow: 0 20px 50px var(--ash-shadow);
        z-index: 2147483647;
        padding: 10px;
        max-width: 95vw;
        flex-direction: column;
        color: var(--ash-text);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-sizing: border-box;
        gap: 6px;
    }
    #ash-perfect-panel.show { display: flex; }
    .ash-row { display: flex; gap: 6px; align-items: center; width: 100%; }
    .ash-col { flex: 1; position: relative; min-width: 0; }
    .ash-ctrl {
        width: 100%;
        background: var(--ash-input-bg);
        border: 1px solid var(--ash-input-border);
        color: var(--ash-text);
        padding: 0 8px;
        border-radius: 4px; font-size: 13px; outline: none;
        transition: border-color 0.2s, background 0.2s;
        box-sizing: border-box;
        height: 32px;
        line-height: 32px;
        appearance: none;
        -moz-appearance: textfield;
    }
    .ash-ctrl:focus { border-color: var(--ash-accent); background: var(--ash-input-focus); box-shadow: 0 0 0 1px var(--ash-accent); }
    .ash-ctrl::placeholder { font-size: 12px !important; color: var(--ash-placeholder); }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .ash-select-container { position: relative; width: 100%; height: 32px; user-select: none; }
    .ash-select-trigger {
        width: 100%; height: 100%;
        background: var(--ash-input-bg);
        border: 1px solid var(--ash-input-border);
        border-radius: 4px;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 8px; cursor: pointer; font-size: 13px; color: var(--ash-text);
        box-sizing: border-box;
    }
    .ash-select-trigger:hover { border-color: var(--ash-placeholder); }
    .ash-select-trigger::after {
        content: ''; width: 0; height: 0;
        border-left: 4px solid transparent; border-right: 4px solid transparent;
        border-top: 5px solid var(--ash-text-sec); margin-left: 6px;
    }
    .ash-select-dropdown {
        position: absolute; top: 100%; left: 0; right: 0;
        background: var(--ash-bg);
        border: 1px solid var(--ash-border);
        border-radius: 4px;
        margin-top: 4px; max-height: 200px; overflow-y: auto;
        z-index: 9999; display: none;
        box-shadow: 0 10px 30px var(--ash-shadow);
    }
    .ash-select-dropdown.open { display: block; }
    .ash-select-option {
        padding: 6px 8px; font-size: 13px; color: var(--ash-text); cursor: pointer;
        border-bottom: 1px solid var(--ash-input-bg);
    }
    .ash-select-option:last-child { border-bottom: none; }
    .ash-select-option:hover { background: var(--ash-input-bg); color: var(--ash-accent); }
    .ash-select-option.selected { color: var(--ash-accent); font-weight: bold; background: rgba(29, 155, 240, 0.1); }
    .ash-select-dropdown::-webkit-scrollbar { width: 4px; }
    .ash-select-dropdown::-webkit-scrollbar-track { background: var(--ash-bg); }
    .ash-select-dropdown::-webkit-scrollbar-thumb { background: var(--ash-input-border); border-radius: 2px; }
    .ash-toggle-row { display: flex; justify-content: center; gap: 16px; margin: 2px 0; }
    .ash-toggle-btn {
        font-size: 12px; font-weight: 700; color: var(--ash-placeholder); cursor: pointer;
        padding-bottom: 2px; border-bottom: 2px solid transparent; transition: all 0.2s;
        text-transform: uppercase; letter-spacing: 0.5px;
    }
    .ash-toggle-btn.active { color: var(--ash-accent); border-bottom-color: var(--ash-accent); }
    .ash-tag-box { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; justify-content: space-between; }
    .ash-tag {
        background: var(--ash-input-bg);
        border: 1px solid var(--ash-input-border);
        color: var(--ash-text-sec);
        font-size: 11px; padding: 2px 0; border-radius: 4px; cursor: pointer;
        transition: all 0.2s; flex: 1; text-align: center;
    }
    .ash-tag:hover { border-color: var(--ash-placeholder); color: var(--ash-text); }
    .ash-tag.active { background: var(--ash-accent); border-color: var(--ash-accent); color: #fff; }
    .ash-footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; width: 100%; margin-top: 4px; }
    .ash-btn-reset {
        display: flex; align-items: center; justify-content: center;
        background: transparent; color: #f4212e; border: 1px solid var(--ash-input-border);
        font-size: 12px; font-weight: 700; cursor: pointer;
        border-radius: 4px; height: 32px; transition: all 0.2s;
    }
    .ash-btn-reset:hover { background: rgba(244, 33, 46, 0.1); border-color: #f4212e; }
    .ash-check-label {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        cursor: pointer; height: 32px; border-radius: 4px;
        transition: background 0.2s; user-select: none;
        border: 1px solid var(--ash-input-border);
    }
    .ash-check-label:hover { background: var(--ash-hover); border-color: var(--ash-placeholder); }
    .ash-check-box {
        width: 12px; height: 12px;
        border: 1px solid #444;
        border-radius: 3px;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
        background: var(--ash-bg);
    }
    .ash-check-label input:checked + .ash-check-box { background: var(--ash-accent); border-color: var(--ash-accent); }
    .ash-check-box::after {
        content: ''; width: 3px; height: 6px;
        border: solid white; border-width: 0 2px 2px 0;
        transform: rotate(45deg) scale(0); transition: transform 0.2s;
        margin-bottom: 2px;
    }
    .ash-check-label input:checked + .ash-check-box::after { transform: rotate(45deg) scale(1); }
    .ash-check-text { font-size: 12px; color: var(--ash-text-sec); font-weight: 600; }
    .ash-check-label input:checked ~ .ash-check-text { color: var(--ash-text); }
    .ash-check-label input { display: none; }
    .ash-search-btn-huge {
        width: 100%; background: var(--ash-accent); color: #fff;
        border: none; border-radius: 6px; padding: 8px 0;
        font-size: 15px; font-weight: 800; cursor: pointer;
        text-transform: uppercase; letter-spacing: 1px;
        transition: background 0.2s, transform 0.1s;
        margin-top: 4px; text-align: center;
    }
    .ash-search-btn-huge:hover { background: #1a8cd8; }
    .ash-search-btn-huge:active { transform: scale(0.98); }
    .ash-hide { display: none !important; }
    `);
    const LANGUAGES = [
        { v: '', t: 'All Languages' }, { v: 'en', t: 'English' }, { v: 'zh', t: 'Chinese' },
        { v: 'ja', t: 'Japanese' }, { v: 'ko', t: 'Korean' }, { v: 'es', t: 'Spanish' },
        { v: 'fr', t: 'French' }, { v: 'de', t: 'German' }, { v: 'ru', t: 'Russian' },
        { v: 'ar', t: 'Arabic' }, { v: 'pt', t: 'Portuguese' }, { v: 'id', t: 'Indonesian' },
        { v: 'hi', t: 'Hindi' }
    ];
    const QUICK_DATES = [
        { l: '1D', d: 1 }, { l: '3D', d: 3 }, { l: '7D', d: 7 },
        { l: '1M', d: 30 }, { l: '6M', d: 180 }, { l: '1Y', d: 365 }, { l: '3Y', d: 1095 }
    ];
    const TIME_UNITS = [
        { v: 'h', t: 'Hours' }, { v: 'd', t: 'Days' }, { v: 'm', t: 'Minutes' }
    ];
    const getMainInput = () => document.querySelector('input[data-testid="SearchBox_Search_Input"]');
    const id = (i) => document.getElementById(i);
    let currentMode = 'date';
    let trackedInput = null;
    let panel = null;
    let resizeObserver = null;
    let isUpdatingFromPanel = false;
    let animationFrameId = null;
    let themeObserver = null;
    const CustomSelects = {
        instances: {},
        create(containerId, options, initialVal, onChange) {
            const container = id(containerId);
            if (!container) return;
            let currentVal = initialVal;
            const currentLabel = options.find(o => o.v === initialVal)?.t || options[0].t;
            const html = `
                <div class="ash-select-trigger" data-val="${initialVal}">${currentLabel}</div>
                <div class="ash-select-dropdown">
                    ${options.map(o => `<div class="ash-select-option ${o.v === initialVal ? 'selected' : ''}" data-v="${o.v}">${o.t}</div>`).join('')}
                </div>
            `;
            container.innerHTML = html;
            const trigger = container.querySelector('.ash-select-trigger');
            const dropdown = container.querySelector('.ash-select-dropdown');
            const opts = container.querySelectorAll('.ash-select-option');
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.ash-select-dropdown').forEach(el => {
                    if (el !== dropdown) el.classList.remove('open');
                });
                dropdown.classList.toggle('open');
            });
            opts.forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = opt.dataset.v;
                    const text = opt.textContent;
                    trigger.textContent = text;
                    trigger.dataset.val = val;
                    dropdown.classList.remove('open');
                    opts.forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                    currentVal = val;
                    if (onChange) onChange(val);
                });
            });
            this.instances[containerId] = {
                set: (val) => {
                    const opt = Array.from(opts).find(o => o.dataset.v === val);
                    if (opt) {
                        const text = opt.textContent;
                        trigger.textContent = text;
                        trigger.dataset.val = val;
                        opts.forEach(o => o.classList.remove('selected'));
                        opt.classList.add('selected');
                    } else if (val === '') {
                        trigger.textContent = options[0].t;
                        trigger.dataset.val = '';
                        opts.forEach(o => o.classList.remove('selected'));
                    }
                },
                get: () => trigger.dataset.val
            };
        },
        getVal(containerId) {
            return this.instances[containerId] ? this.instances[containerId].get() : '';
        },
        setVal(containerId, val) {
            if (this.instances[containerId]) this.instances[containerId].set(val);
        }
    };
    function updateMainInputFromPanel() {
        const input = getMainInput();
        if (!input) return;
        isUpdatingFromPanel = true;
        const pData = {
            any: id('ash-any').value.trim(),
            none: id('ash-none').value.trim(),
            from: id('ash-from').value.trim(),
            lang: CustomSelects.getVal('ash-lang-box'),
            minLikes: id('ash-likes').value,
            minRetweets: id('ash-rt').value,
            minReplies: id('ash-reply').value,
            since: id('ash-since').value,
            until: id('ash-until').value,
            timeVal: id('ash-time-val').value.trim(),
            timeUnit: CustomSelects.getVal('ash-time-unit-box'),
            hasLinks: id('ash-link').checked,
            hasImages: id('ash-img').checked,
            hasVideos: id('ash-vid').checked,
        };
        let parts = [];
        if (pData.any) {
            const orParts = pData.any.split(/\s+/).filter(w => w.length > 0);
            if (orParts.length > 1) parts.push(`(${orParts.join(' OR ')})`);
            else if (orParts.length === 1) parts.push(orParts[0]);
        }
        if (pData.none) pData.none.split(/\s+/).forEach(w => { if(w) parts.push(`-${w}`); });
        if (pData.from) parts.push(`from:${pData.from.replace('@', '')}`);
        if (pData.lang) parts.push(`lang:${pData.lang}`);
        if (pData.minLikes) parts.push(`min_faves:${pData.minLikes}`);
        if (pData.minRetweets) parts.push(`min_retweets:${pData.minRetweets}`);
        if (pData.minReplies) parts.push(`min_replies:${pData.minReplies}`);
        if (currentMode === 'date') {
            if (pData.since) parts.push(`since:${pData.since}`);
            if (pData.until) parts.push(`until:${pData.until}`);
        } else {
            if (pData.timeVal) parts.push(`within_time:${pData.timeVal}${pData.timeUnit}`);
        }
        if (pData.hasLinks) parts.push('filter:links');
        if (pData.hasImages) parts.push('filter:images');
        if (pData.hasVideos) parts.push('filter:videos');
        const finalQuery = parts.join(' ').trim();
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, finalQuery);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => { isUpdatingFromPanel = false; }, 50);
    }
    function syncPanelFromInput() {
        if (isUpdatingFromPanel) return;
        const input = getMainInput();
        if (!input) return;
        let text = input.value || '';
        let tempText = text;
        const extract = (regex) => {
            const match = tempText.match(regex);
            if (match) {
                tempText = tempText.replace(match[0], ' ');
                return match[1];
            }
            return '';
        };
        const fromVal = extract(/from:([\w_]+)/i);
        const langVal = extract(/lang:(\w{2})/i);
        const likesVal = extract(/min_(?:faves|likes):(\d+)/i);
        const rtVal = extract(/min_retweets:(\d+)/i);
        const replyVal = extract(/min_replies:(\d+)/i);
        const sinceVal = extract(/since:([\d-]+)/i);
        const untilVal = extract(/until:([\d-]+)/i);
        const withinMatch = tempText.match(/within_time:(\d+)([hdms])/i);
        const hasLinks = tempText.includes('filter:links');
        if (hasLinks) tempText = tempText.replace('filter:links', ' ');
        const hasImages = tempText.includes('filter:images');
        if (hasImages) tempText = tempText.replace('filter:images', ' ');
        const hasVideos = tempText.includes('filter:videos');
        if (hasVideos) tempText = tempText.replace('filter:videos', ' ');
        const excludes = [];
        tempText = tempText.replace(/-([^\s]+)/g, (match, p1) => {
            excludes.push(p1);
            return ' ';
        });
        id('ash-from').value = fromVal || '';
        CustomSelects.setVal('ash-lang-box', langVal || '');
        id('ash-likes').value = likesVal || '';
        id('ash-rt').value = rtVal || '';
        id('ash-reply').value = replyVal || '';
        id('ash-link').checked = hasLinks;
        id('ash-img').checked = hasImages;
        id('ash-vid').checked = hasVideos;
        id('ash-none').value = excludes.join(' ');
        if (withinMatch) {
            switchMode('time');
            id('ash-time-val').value = withinMatch[1];
            CustomSelects.setVal('ash-time-unit-box', withinMatch[2].toLowerCase());
            tempText = tempText.replace(withinMatch[0], ' ');
        } else {
            if (sinceVal || untilVal) {
                switchMode('date');
                id('ash-since').value = sinceVal || '';
                id('ash-until').value = untilVal || '';
            } else if (!id('ash-since').value && !id('ash-until').value && currentMode === 'time') {
            } else {
                if (!sinceVal && !untilVal && currentMode === 'date') {
                    id('ash-since').value = '';
                    id('ash-until').value = '';
                }
            }
        }
        tempText = tempText.replace(/[()]/g, '').replace(/\sOR\s/g, ' ').replace(/\s+/g, ' ').trim();
        id('ash-any').value = tempText;
    }
    function switchMode(mode) {
        currentMode = mode;
        const dateRow = id('ash-date-row');
        const timeRow = id('ash-time-row');
        const tagBox = id('ash-tags-row');
        if (mode === 'date') {
            dateRow.classList.remove('ash-hide');
            tagBox.classList.remove('ash-hide');
            timeRow.classList.add('ash-hide');
            id('btn-mode-date').classList.add('active');
            id('btn-mode-time').classList.remove('active');
        } else {
            dateRow.classList.add('ash-hide');
            tagBox.classList.add('ash-hide');
            timeRow.classList.remove('ash-hide');
            id('btn-mode-date').classList.remove('active');
            id('btn-mode-time').classList.add('active');
        }
    }
    function doSearch() {
        updateMainInputFromPanel();
        const input = getMainInput();
        if (input && input.value) {
            window.location.href = `/search?q=${encodeURIComponent(input.value)}&src=typed_query&f=live`;
            id('ash-perfect-panel').classList.remove('show');
        }
    }
    function positionPanel() {
        if (!trackedInput || !panel) return;
        const form = trackedInput.closest('form') || trackedInput.parentElement;
        if (!form) return;
        const rect = form.getBoundingClientRect();
        const inputWidth = rect.width;
        panel.style.width = Math.max(inputWidth, 320) + 'px';
        let left = rect.left;
        if (inputWidth < 320) {
            left = rect.left + (inputWidth / 2) - 160;
        }
        if (left < 10) left = 10;
        panel.style.top = (rect.bottom + 6) + 'px';
        panel.style.left = left + 'px';
    }
    function updatePositionLoop() {
        if (panel && panel.classList.contains('show')) {
            positionPanel();
            animationFrameId = requestAnimationFrame(updatePositionLoop);
        }
    }
    function updateThemeColors() {
        if (!panel) return;
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        if (bodyBg === 'rgb(255, 255, 255)' || bodyBg === '#ffffff' || bodyBg === 'white') {
            panel.style.setProperty('--ash-bg', '#ffffff');
            panel.style.setProperty('--ash-border', 'rgb(207, 217, 222)');
            panel.style.setProperty('--ash-text', 'rgb(15, 20, 25)');
            panel.style.setProperty('--ash-text-sec', 'rgb(83, 100, 113)');
            panel.style.setProperty('--ash-input-bg', '#eff3f4');
            panel.style.setProperty('--ash-input-border', 'rgb(207, 217, 222)');
            panel.style.setProperty('--ash-input-focus', '#ffffff');
            panel.style.setProperty('--ash-hover', 'rgba(0,0,0,0.05)');
            panel.style.setProperty('--ash-shadow', 'rgba(101, 119, 134, 0.2)');
            panel.style.setProperty('--ash-placeholder', 'rgb(83, 100, 113)');
        }
        else if (bodyBg === 'rgb(21, 32, 43)') {
            panel.style.setProperty('--ash-bg', 'rgb(21, 32, 43)');
            panel.style.setProperty('--ash-border', '#38444d');
            panel.style.setProperty('--ash-text', '#f7f9f9');
            panel.style.setProperty('--ash-text-sec', '#8b98a5');
            panel.style.setProperty('--ash-input-bg', '#273340');
            panel.style.setProperty('--ash-input-border', '#38444d');
            panel.style.setProperty('--ash-input-focus', 'rgb(21, 32, 43)');
            panel.style.setProperty('--ash-hover', 'rgba(255,255,255,0.03)');
            panel.style.setProperty('--ash-shadow', 'rgba(255,255,255,0.1)');
            panel.style.setProperty('--ash-placeholder', '#8b98a5');
        }
        else {
            panel.style.setProperty('--ash-bg', '#000000');
            panel.style.setProperty('--ash-border', '#333639');
            panel.style.setProperty('--ash-text', '#e7e9ea');
            panel.style.setProperty('--ash-text-sec', '#71767b');
            panel.style.setProperty('--ash-input-bg', '#16181c');
            panel.style.setProperty('--ash-input-border', '#333333');
            panel.style.setProperty('--ash-input-focus', '#000000');
            panel.style.setProperty('--ash-hover', 'rgba(255,255,255,0.03)');
            panel.style.setProperty('--ash-shadow', 'rgba(0, 0, 0, 0.6)');
            panel.style.setProperty('--ash-placeholder', '#536471');
        }
    }
    function init() {
        const input = getMainInput();
        if (!input) return;
        if (input === trackedInput && document.body.contains(panel)) return;
        if (panel) panel.remove();
        if (resizeObserver) resizeObserver.disconnect();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (themeObserver) themeObserver.disconnect();
        trackedInput = input;
        panel = document.createElement('div');
        panel.id = 'ash-perfect-panel';
        const tags = QUICK_DATES.map(d => `<div class="ash-tag" data-d="${d.d}">${d.l}</div>`).join('');
        panel.innerHTML = `
            <div class="ash-row">
                <div class="ash-col"><input class="ash-ctrl" id="ash-any" placeholder="Include Keywords (space separated)" autocomplete="off"></div>
            </div>
            <div class="ash-row">
                <div class="ash-col"><input class="ash-ctrl" id="ash-none" placeholder="Exclude Keywords (space separated)" autocomplete="off"></div>
            </div>
            <div class="ash-toggle-row">
                <span id="btn-mode-date" class="ash-toggle-btn active">Dates</span>
                <span style="opacity:0.2">|</span>
                <span id="btn-mode-time" class="ash-toggle-btn">Recent</span>
            </div>
            <div class="ash-tag-box" id="ash-tags-row">${tags}</div>
            <div class="ash-row" id="ash-date-row">
                <div class="ash-col"><input type="date" class="ash-ctrl" id="ash-since"></div>
                <div class="ash-col"><input type="date" class="ash-ctrl" id="ash-until"></div>
            </div>
            <div class="ash-row ash-hide" id="ash-time-row">
                <div class="ash-col"><input type="number" class="ash-ctrl" id="ash-time-val" placeholder="(e.g. 12)" autocomplete="off"></div>
                <div class="ash-col">
                    <div id="ash-time-unit-box" class="ash-select-container"></div>
                </div>
            </div>
            <div class="ash-row">
                <div class="ash-col"><input type="number" class="ash-ctrl" id="ash-likes" placeholder="Likes" autocomplete="off"></div>
                <div class="ash-col"><input type="number" class="ash-ctrl" id="ash-reply" placeholder="Reply" autocomplete="off"></div>
                <div class="ash-col"><input type="number" class="ash-ctrl" id="ash-rt" placeholder="Retweets" autocomplete="off"></div>
            </div>
            <div class="ash-row">
                <div class="ash-col">
                    <div id="ash-lang-box" class="ash-select-container"></div>
                </div>
                <div class="ash-col"><input class="ash-ctrl" id="ash-from" placeholder="From @user" autocomplete="off"></div>
            </div>
            <div class="ash-footer-grid">
                <button class="ash-btn-reset" id="ash-reset">Reset All</button>
                <label class="ash-check-label">
                    <input type="checkbox" id="ash-link">
                    <div class="ash-check-box"></div>
                    <span class="ash-check-text">Link</span>
                </label>
                <label class="ash-check-label">
                    <input type="checkbox" id="ash-img">
                    <div class="ash-check-box"></div>
                    <span class="ash-check-text">Image</span>
                </label>
                <label class="ash-check-label">
                    <input type="checkbox" id="ash-vid">
                    <div class="ash-check-box"></div>
                    <span class="ash-check-text">Video</span>
                </label>
            </div>
            <button id="ash-search" class="ash-search-btn-huge">Search</button>
        `;
        document.body.appendChild(panel);
        updateThemeColors();
        themeObserver = new MutationObserver(() => {
            updateThemeColors();
        });
        themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        const update = () => { updateMainInputFromPanel(); };
        CustomSelects.create('ash-lang-box', LANGUAGES, '', update);
        CustomSelects.create('ash-time-unit-box', TIME_UNITS, 'h', update);
        panel.querySelectorAll('input').forEach(el => {
            if(el.type === 'checkbox' || el.type === 'date') el.addEventListener('change', update);
            else el.addEventListener('input', update);
        });
        id('ash-search').addEventListener('click', (e) => { e.stopPropagation(); doSearch(); });
        id('ash-reset').addEventListener('click', (e) => {
            e.stopPropagation();
            panel.querySelectorAll('input').forEach(i => {
                if (i.type === 'checkbox') i.checked = false;
                else i.value = '';
            });
            CustomSelects.setVal('ash-lang-box', '');
            CustomSelects.setVal('ash-time-unit-box', 'h');
            switchMode('date');
            panel.querySelectorAll('.ash-tag').forEach(t => t.classList.remove('active'));
            update();
            trackedInput.focus();
        });
        panel.querySelectorAll('.ash-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                switchMode('date');
                panel.querySelectorAll('.ash-tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                const days = parseInt(tag.dataset.d);
                const d = new Date();
                d.setDate(d.getDate() - days);
                id('ash-since').value = d.toISOString().split('T')[0];
                id('ash-until').value = '';
                update();
            });
        });
        id('btn-mode-date').addEventListener('click', () => { switchMode('date'); id('ash-time-val').value=''; update(); });
        id('btn-mode-time').addEventListener('click', () => { switchMode('time'); id('ash-since').value=''; id('ash-until').value=''; update(); });
        const showPanel = (e) => {
            if(e) e.stopPropagation();
            positionPanel();
            if(!trackedInput.matches(':focus')) trackedInput.focus();
            syncPanelFromInput();
            panel.classList.add('show');
            updatePositionLoop();
        };
        resizeObserver = new ResizeObserver(() => {
            if (panel.classList.contains('show')) positionPanel();
        });
        const formEl = trackedInput.closest('form') || trackedInput.parentElement;
        if (formEl) resizeObserver.observe(formEl);
        trackedInput.addEventListener('focus', showPanel);
        trackedInput.addEventListener('click', showPanel);
        trackedInput.addEventListener('input', () => {
            syncPanelFromInput();
            positionPanel();
        });
        trackedInput.addEventListener('keyup', () => {
            syncPanelFromInput();
        });
        trackedInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { doSearch(); panel.classList.remove('show'); }
        });
        document.addEventListener('click', (e) => {
            document.querySelectorAll('.ash-select-dropdown.open').forEach(el => el.classList.remove('open'));
            if (!panel.contains(e.target) && e.target !== trackedInput) {
                panel.classList.remove('show');
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            }
        });
        panel.addEventListener('click', e => e.stopPropagation());
        window.addEventListener('resize', () => { if (panel.classList.contains('show')) positionPanel(); });
    }
    setInterval(() => {
        const inp = getMainInput();
        if (inp && (!trackedInput || inp !== trackedInput || !document.body.contains(panel))) {
            init();
        }
    }, 500);
})();
