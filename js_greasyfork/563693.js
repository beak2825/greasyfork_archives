// ==UserScript==
// @name         Superior Chart Module for Finviz
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Full Settings + Lagless Physics Hover + Bouncy Markers + Dynamic Black Box Tooltips + Waterfall News Fix.
// @author       Game Abuse Studios
// @license      MIT
// @match        https://finviz.com/screener.ashx*
// @match        https://elite.finviz.com/screener.ashx*
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @resource     fontAwesomeCSS https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/563693/Superior%20Chart%20Module%20for%20Finviz.user.js
// @updateURL https://update.greasyfork.org/scripts/563693/Superior%20Chart%20Module%20for%20Finviz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //==================================================================
    // 1. SCRIPT CONFIGURATION & STATE
    //==================================================================
    let stockDataHistory = {};
    let newsCache = {};
    let settings = {};
    const SETTINGS_KEY = 'chartModuleSettings_v17_0';
    const CUSTOM_COLORS_KEY = 'chartModuleCustomColors_v1';
    const HALT_HISTORY_KEY = 'chartModuleHaltHistory_v1';
    const HALT_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

    const defaultSettings = {
        chart: {
            style: 'line-area',
            timeframe: '1d',
            // Line Colors
            color: '#26ff5e',
            colorDown: '#ff2e2e',
            // Candle Colors
            colorCandleUp: '#26ff5e',
            colorCandleDown: '#ff2e2e',
            colorWick: '#8b949e',
            // Logic
            dynamicColor: true,
            useExtendedColors: true,
            colorPreMarket: '#ffa500',
            colorPostMarket: '#4ea8de',
            showVolume: true,
            showVWAP: true,
            colorVWAP: '#ffd700',
            fixedYAxisRange: 2.5,
            updateIntervalSeconds: 2,
            // --- UPDATED DEFAULTS ---
            smoothingIterations: 10,
            smoothingFactor: 1.0,
            interpolationPasses: 4,
            amplitudeFactor: 0,
            // ------------------------
            forceSquareGrid: true
        }
    };

    let isFetching = false;
    let currentTicker = null;
    let chartWidget = null;
    let refreshInterval = null;
    let newsObserver = null;

    // Constants for Markers
    const COLOR_HALT_STROKE = '#e74c3c';
    const COLOR_HALT_FILL = '#c0392b';
    const COLOR_NEWS_STROKE = '#f1c40f';
    const COLOR_NEWS_FILL = '#d4ac0d';

    //==================================================================
    // 2. SETTINGS & HALT MEMORY FUNCTIONS
    //==================================================================
    function loadSettings() {
        const saved = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
        let loaded = {};
        try { loaded = JSON.parse(saved); } catch(e) { loaded = defaultSettings; }

        const merge = (def, ld) => {
            let out = { ...def };
            for (let key in def) {
                if (key in ld) {
                    if (typeof def[key] === 'object' && def[key] !== null && !Array.isArray(def[key])) {
                        out[key] = merge(def[key], ld[key]);
                    } else {
                        out[key] = ld[key];
                    }
                }
            }
            return out;
        };
        settings = merge(defaultSettings, loaded);
    }

    function saveSettings() {
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
    }

    function updateSettingState(key, value) {
        const keys = key.split('.');
        let temp = settings;
        for (let i = 0; i < keys.length - 1; i++) { temp = temp[keys[i]]; }
        temp[keys[keys.length - 1]] = value;
    }

    // --- HALT HISTORY MANAGER ---
    function recordHaltIfActive(ticker) {
        const activeCard = document.querySelector(`.fv-ticker-card[data-ticker="${ticker}"]`);
        if (activeCard && activeCard.classList.contains('is-halted')) {
            const now = Date.now();
            let history = JSON.parse(GM_getValue(HALT_HISTORY_KEY, '{}'));
            if (!history[ticker]) history[ticker] = [];
            const lastRecord = history[ticker][history[ticker].length - 1];
            if (!lastRecord || (now - lastRecord > 60000)) {
                history[ticker].push(now);
                history = pruneHaltHistory(history);
                GM_setValue(HALT_HISTORY_KEY, JSON.stringify(history));
            }
            return true;
        }
        return false;
    }

    function getHaltEvents(ticker) {
        const history = JSON.parse(GM_getValue(HALT_HISTORY_KEY, '{}'));
        const timestamps = history[ticker] || [];
        if (timestamps.length === 0) return [];

        const events = [];
        let currentStart = timestamps[0];
        let currentEnd = timestamps[0];

        for (let i = 1; i < timestamps.length; i++) {
            if (timestamps[i] - currentEnd > 5 * 60 * 1000) {
                events.push({ start: currentStart, end: currentEnd });
                currentStart = timestamps[i];
            }
            currentEnd = timestamps[i];
        }
        events.push({ start: currentStart, end: currentEnd });
        return events;
    }

    function pruneHaltHistory(history) {
        const now = Date.now();
        const cutoff = now - HALT_RETENTION_MS;
        const cleanHistory = {};
        for (const t in history) {
            const validPoints = history[t].filter(ts => ts > cutoff);
            if (validPoints.length > 0) {
                cleanHistory[t] = validPoints;
            }
        }
        return cleanHistory;
    }

    //==================================================================
    // 2.5 COLOR UTILS & PRO PICKER
    //==================================================================
    const ColorUtils = {
        hexToRgb: (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r:0, g:0, b:0 };
        },
        rgbToHex: (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1),
        rgbToHsv: (r, g, b) => {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, v = max;
            const d = max - min;
            s = max === 0 ? 0 : d / max;
            if (max === min) h = 0;
            else {
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
        },
        hsvToRgb: (h, s, v) => {
            let r, g, b;
            const i = Math.floor(h * 6);
            const f = h * 6 - i;
            const p = v * (1 - s);
            const q = v * (1 - f * s);
            const t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
            return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
        }
    };

    class ProColorPicker {
        constructor() {
            this.modal = null;
            this.activeSettingKey = null;
            this.onUpdate = null;
            this.hsv = { h: 0, s: 0, v: 100 };
            this.tempColor = "#ffffff";
            this.customColors = JSON.parse(GM_getValue(CUSTOM_COLORS_KEY, '[]'));
            if(this.customColors.length < 16) {
                const emptySlots = 16 - this.customColors.length;
                for(let i=0; i<emptySlots; i++) this.customColors.push(null);
            }
        }

        open(currentHex, settingKey, callback) {
            this.activeSettingKey = settingKey;
            this.onUpdate = callback;
            const rgb = ColorUtils.hexToRgb(currentHex);
            this.hsv = ColorUtils.rgbToHsv(rgb.r, rgb.g, rgb.b);
            this.tempColor = currentHex;
            this.render();
            this.updateUIFromModel();
            document.body.appendChild(this.modal);
            requestAnimationFrame(() => this.modal.classList.add('visible'));
        }

        close() {
            if(this.modal) {
                this.modal.classList.remove('visible');
                setTimeout(() => {
                    if(this.modal && this.modal.parentElement) this.modal.remove();
                    this.modal = null;
                }, 200);
            }
        }

        confirm() {
            if(this.activeSettingKey && this.onUpdate) {
                updateSettingState(this.activeSettingKey, this.tempColor);
                this.onUpdate();
            }
            this.close();
        }

        render() {
            this.modal = document.createElement('div');
            this.modal.className = 'cp-modal-backdrop';

            const basicColors = [
                '#FF8080','#FFFF80','#80FF80','#00FF80','#80FFFF','#0080FF','#FF80C0','#FF80FF',
                '#FF0000','#FFFF00','#80FF00','#00FF40','#00FFFF','#0080C0','#8080C0','#FF00FF',
                '#804040','#FF8040','#00FF00','#008080','#004080','#8080FF','#800040','#FF0080',
                '#800000','#FF8000','#008000','#008040','#0000FF','#0000A0','#800080','#8000FF',
                '#400000','#804000','#004000','#004040','#000080','#000040','#400040','#400080',
                '#000000','#808000','#808040','#808080','#400000','#C0C0C0','#404040','#FFFFFF',
            ];
            const gridBasic = basicColors.map(c => `<div class="cp-swatch basic" style="background:${c}" data-col="${c}"></div>`).join('');
            const gridCustom = this.customColors.map((c, i) =>
                `<div class="cp-swatch custom" data-idx="${i}" style="background:${c || '#ffffff'}; opacity:${c ? 1 : 0.1}"></div>`
            ).join('');
            this.modal.innerHTML = `
                <div class="cp-window">
                    <div class="cp-titlebar">
                        <div class="cp-title"><i class="fa-solid fa-palette"></i> Select Color</div>
                        <div class="cp-close">&times;</div>
                    </div>
                    <div class="cp-body">
                        <div class="cp-col-left">
                            <div class="cp-section-label">Basic colors</div>
                            <div class="cp-grid-basic">${gridBasic}</div>
                            <button class="cp-btn-screen"><i class="fa-solid fa-eye-dropper"></i> Pick Screen Color</button>
                            <div class="cp-section-label" style="margin-top:10px;">Custom colors</div>
                            <div class="cp-grid-custom">${gridCustom}</div>
                            <button class="cp-btn-add">Add to Custom Colors</button>
                        </div>
                        <div class="cp-col-right">
                            <div class="cp-spectrum-area">
                                <div class="cp-sat-val-box">
                                    <div class="cp-sat-grad"></div>
                                    <div class="cp-val-grad"></div>
                                    <div class="cp-cursor"></div>
                                </div>
                                <div class="cp-hue-slider">
                                    <div class="cp-hue-track"></div>
                                    <div class="cp-hue-cursor"></div>
                                </div>
                            </div>
                            <div class="cp-controls-row">
                                <div class="cp-preview-box"></div>
                                <div class="cp-inputs">
                                    <div class="cp-input-group">
                                        <label>Hue:</label> <input type="number" class="cp-in-h" min="0" max="360">
                                        <label>Red:</label> <input type="number" class="cp-in-r" min="0" max="255">
                                    </div>
                                    <div class="cp-input-group">
                                       <label>Sat:</label> <input type="number" class="cp-in-s" min="0" max="100">
                                        <label>Green:</label> <input type="number" class="cp-in-g" min="0" max="255">
                                    </div>
                                    <div class="cp-input-group">
                                        <label>Val:</label> <input type="number" class="cp-in-v" min="0" max="100">
                                        <label>Blue:</label> <input type="number" class="cp-in-b" min="0" max="255">
                                    </div>
                                </div>
                            </div>
                            <div class="cp-hex-row">
                                <label>HTML:</label> <input type="text" class="cp-in-hex">
                            </div>
                            <div class="cp-actions">
                                <button class="cp-btn-ok">OK</button>
                                <button class="cp-btn-cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            this.bindEvents();
        }

        bindEvents() {
            const win = this.modal.querySelector('.cp-window');
            const svBox = win.querySelector('.cp-sat-val-box');
            const hueBox = win.querySelector('.cp-hue-slider');

            const handleSV = (e) => {
                const rect = svBox.getBoundingClientRect();
                let x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                let y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                this.hsv.h = Math.round(x * 360);
                this.hsv.s = Math.round((1 - y) * 100);
                this.updateUIFromModel();
            };
            const handleVal = (e) => {
                const rect = hueBox.getBoundingClientRect();
                let y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                this.hsv.v = Math.round((1 - y) * 100);
                this.updateUIFromModel();
            };
            let isDraggingSV = false;
            let isDraggingVal = false;

            svBox.addEventListener('mousedown', (e) => { isDraggingSV = true; handleSV(e); });
            hueBox.addEventListener('mousedown', (e) => { isDraggingVal = true; handleVal(e); });
            window.addEventListener('mousemove', (e) => {
                if(isDraggingSV) handleSV(e);
                if(isDraggingVal) handleVal(e);
            });
            window.addEventListener('mouseup', () => { isDraggingSV = false; isDraggingVal = false; });
            const inputs = {
                h: win.querySelector('.cp-in-h'), s: win.querySelector('.cp-in-s'), v: win.querySelector('.cp-in-v'),
                r: win.querySelector('.cp-in-r'), g: win.querySelector('.cp-in-g'), b: win.querySelector('.cp-in-b'),
                hex: win.querySelector('.cp-in-hex')
            };
            [inputs.h, inputs.s, inputs.v].forEach(el => el.addEventListener('input', () => {
                this.hsv = { h: parseInt(inputs.h.value)||0, s: parseInt(inputs.s.value)||0, v: parseInt(inputs.v.value)||0 };
                this.updateUIFromModel();
            }));
            [inputs.r, inputs.g, inputs.b].forEach(el => el.addEventListener('input', () => {
                this.hsv = ColorUtils.rgbToHsv(parseInt(inputs.r.value)||0, parseInt(inputs.g.value)||0, parseInt(inputs.b.value)||0);
                this.updateUIFromModel();
            }));
            inputs.hex.addEventListener('input', () => {
                if(/^#[0-9A-F]{6}$/i.test(inputs.hex.value)) {
                    const rgb = ColorUtils.hexToRgb(inputs.hex.value);
                    this.hsv = ColorUtils.rgbToHsv(rgb.r, rgb.g, rgb.b);
                    this.updateUIFromModel();
                }
            });
            win.querySelectorAll('.cp-swatch.basic').forEach(s => s.addEventListener('click', () => {
                const rgb = ColorUtils.hexToRgb(s.dataset.col);
                this.hsv = ColorUtils.rgbToHsv(rgb.r, rgb.g, rgb.b);
                this.updateUIFromModel();
            }));
            win.querySelectorAll('.cp-swatch.custom').forEach(s => s.addEventListener('click', () => {
                if(s.style.opacity == 1) {
                    const bg = s.style.backgroundColor;
                    const parts = bg.match(/\d+/g);
                    if(parts && parts.length===3) {
                        this.hsv = ColorUtils.rgbToHsv(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
                        this.updateUIFromModel();
                    }
                }
            }));
            win.querySelector('.cp-close').onclick = () => this.close();
            win.querySelector('.cp-btn-cancel').onclick = () => this.close();
            win.querySelector('.cp-btn-ok').onclick = () => this.confirm();
            win.querySelector('.cp-btn-add').onclick = () => {
                this.customColors.unshift(this.tempColor);
                this.customColors = this.customColors.slice(0, 16);
                GM_setValue(CUSTOM_COLORS_KEY, JSON.stringify(this.customColors));
                const gridHtml = this.customColors.map((c, i) =>
                    `<div class="cp-swatch custom" data-idx="${i}" style="background:${c || '#ffffff'}; opacity:${c ? 1 : 0.1}"></div>`
                ).join('');
                win.querySelector('.cp-grid-custom').innerHTML = gridHtml;
                win.querySelectorAll('.cp-swatch.custom').forEach(s => s.addEventListener('click', () => {
                     const bg = s.style.backgroundColor;
                     const parts = bg.match(/\d+/g);
                     if(parts && parts.length===3) {
                         this.hsv = ColorUtils.rgbToHsv(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
                        this.updateUIFromModel();
                     }
                }));
            };

            const btnScreen = win.querySelector('.cp-btn-screen');
            if (!window.EyeDropper) {
                btnScreen.style.opacity = 0.5;
                btnScreen.style.cursor = 'not-allowed';
                btnScreen.title = "Browser does not support EyeDropper API";
            } else {
                btnScreen.onclick = async () => {
                    this.modal.style.display = 'none';
                    try {
                        const ed = new EyeDropper();
                        const result = await ed.open();
                        const rgb = ColorUtils.hexToRgb(result.sRGBHex);
                        this.hsv = ColorUtils.rgbToHsv(rgb.r, rgb.g, rgb.b);
                        this.modal.style.display = 'flex';
                        this.updateUIFromModel();
                    } catch (e) {
                        this.modal.style.display = 'flex';
                    }
                };
            }
        }

        updateUIFromModel() {
            const rgb = ColorUtils.hsvToRgb(this.hsv.h / 360, this.hsv.s / 100, this.hsv.v / 100);
            this.tempColor = ColorUtils.rgbToHex(rgb.r, rgb.g, rgb.b);
            const win = this.modal.querySelector('.cp-window');

            win.querySelector('.cp-preview-box').style.backgroundColor = this.tempColor;

            const active = document.activeElement;
            const setVal = (sel, val) => {
                const el = win.querySelector(sel);
                if(el !== active) el.value = val;
            };
            setVal('.cp-in-h', this.hsv.h); setVal('.cp-in-s', this.hsv.s); setVal('.cp-in-v', this.hsv.v);
            setVal('.cp-in-r', rgb.r); setVal('.cp-in-g', rgb.g); setVal('.cp-in-b', rgb.b);
            setVal('.cp-in-hex', this.tempColor);

            const cx = (this.hsv.h / 360) * 100;
            const cy = (1 - (this.hsv.s / 100)) * 100;
            const cursor = win.querySelector('.cp-cursor');
            cursor.style.left = `${cx}%`;
            cursor.style.top = `${cy}%`;
            cursor.style.borderColor = this.hsv.v < 50 ? 'white' : 'black';
            const maxV_rgb = ColorUtils.hsvToRgb(this.hsv.h/360, this.hsv.s/100, 1);
            const maxV_hex = ColorUtils.rgbToHex(maxV_rgb.r, maxV_rgb.g, maxV_rgb.b);

            const hueTrack = win.querySelector('.cp-hue-track');
            hueTrack.style.background = `linear-gradient(to bottom, ${maxV_hex}, #000)`;

            const hueCursor = win.querySelector('.cp-hue-cursor');
            hueCursor.style.top = `${(1 - (this.hsv.v/100)) * 100}%`;
        }
    }

    const proColorPicker = new ProColorPicker();
    //==================================================================
    // 3. HELPERS
    //==================================================================
    function isTradingActive() {
        const now = new Date();
        const nowInET = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const day = nowInET.getDay();
        const hour = nowInET.getHours();
        if (day === 0 || day === 6) return false;
        return hour >= 4 && hour < 20;
    }

    function getMidnightET(ts) {
        const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric', month: 'numeric', day: 'numeric'
        });
        const parts = fmt.formatToParts(new Date(ts));
        const y = parts.find(p => p.type === 'year').value;
        const m = parts.find(p => p.type === 'month').value;
        const d = parts.find(p => p.type === 'day').value;
        const dateString = `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}T00:00:00`;
        const localDate = new Date(dateString);
        const etString = new Date(localDate).toLocaleString('en-US', {timeZone: 'America/New_York'});
        const etDate = new Date(etString);
        const diff = localDate.getTime() - etDate.getTime();
        return localDate.getTime() + diff;
    }

    function formatTimeET(ts, options = {}) {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            ...options
        }).format(new Date(ts));
    }

    function applySubdivisionSmoothing(points, iterations, factor) {
        if (points.length < 3 || iterations === 0 || factor === 0) return points;
        let smoothedPoints = points.map(p => ({ ...p }));
        for (let i = 0; i < iterations; i++) {
            let passResult = [...smoothedPoints];
            for (let j = 1; j < smoothedPoints.length - 1; j++) {
                const prev = smoothedPoints[j - 1];
                const curr = smoothedPoints[j];
                const next = smoothedPoints[j + 1];
                const targetX = (prev.x + next.x) / 2;
                const targetY = (prev.y + next.y) / 2;
                passResult[j].x = curr.x + (targetX - curr.x) * factor;
                passResult[j].y = curr.y + (targetY - curr.y) * factor;
            }
            smoothedPoints = passResult;
        }
        return smoothedPoints;
    }

    function interpolatePoints(points, passes) {
        if (passes < 1 || points.length < 2) return points;
        let currentPoints = [...points];
        for (let p = 0; p < passes; p++) {
            const newPoints = [];
            for (let i = 0; i < currentPoints.length - 1; i++) {
                const p1 = currentPoints[i];
                const p2 = currentPoints[i + 1];
                newPoints.push(p1);
                newPoints.push({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });
            }
            newPoints.push(currentPoints[currentPoints.length - 1]);
            currentPoints = newPoints;
        }
        return currentPoints;
    }

    const MONTH_MAP = { 'Jan':0, 'Feb':1, 'Mar':2, 'Apr':3, 'May':4, 'Jun':5, 'Jul':6, 'Aug':7, 'Sep':8, 'Oct':9, 'Nov':10, 'Dec':11 };
    // --- REPLACED NEWS PARSER FUNCTION WITH CONTEXT AWARENESS ---
    function getNewsEvents(ticker, midnightET, rangeStart, rangeEnd) {
        const container = document.getElementById('fv-details-news');
        const currentNews = [];

        if (container) {
            const items = container.querySelectorAll('.fv-news-item');
            let contextDate = null; // Stores the last seen Date object

            items.forEach(item => {
                const timeEl = item.querySelector('.fv-news-time');
                const headEl = item.querySelector('.fv-news-headline');

                if(timeEl && headEl) {
                    const rawStr = timeEl.innerText.trim();
                    let ts = 0;
                    let h = 0, m = 0, ampm = '';

                    // Regex Patterns
                    // 1. Full Date: "Nov-25-25 05:25PM"
                    const fullDateMatch = rawStr.match(/([a-zA-Z]{3})-(\d{1,2})-(\d{2})\s+(\d{1,2}):(\d{2})(AM|PM)/);
                    // 2. Today: "Today 04:20PM"
                    const todayMatch = rawStr.match(/Today\s+(\d{1,2}):(\d{2})(AM|PM)/);
                    // 3. Time Only: "02:19PM"
                    const timeOnlyMatch = rawStr.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);

                    if (fullDateMatch) {
                        const monthStr = fullDateMatch[1];
                        const day = parseInt(fullDateMatch[2], 10);
                        let year = parseInt(fullDateMatch[3], 10) + 2000;
                        const mo = MONTH_MAP[monthStr];
                        contextDate = new Date(year, mo, day);
                        h = parseInt(fullDateMatch[4], 10);
                        m = parseInt(fullDateMatch[5], 10);
                        ampm = fullDateMatch[6];
                    }
                    else if (todayMatch) {
                        contextDate = new Date(midnightET);
                        h = parseInt(todayMatch[1], 10);
                        m = parseInt(todayMatch[2], 10);
                        ampm = todayMatch[3];
                    }
                    else if (timeOnlyMatch && contextDate) {
                        h = parseInt(timeOnlyMatch[1], 10);
                        m = parseInt(timeOnlyMatch[2], 10);
                        ampm = timeOnlyMatch[3];
                    } else {
                        // Skip if we can't determine the date context
                        return;
                    }

                    if (ampm === 'PM' && h !== 12) h += 12;
                    if (ampm === 'AM' && h === 12) h = 0;
                    if (contextDate) {
                        ts = contextDate.getTime() + (h * 3600000) + (m * 60000);
                    }

                    // Strict Range Check: This will filter out old news correctly now
                    if(ts >= rangeStart && ts <= rangeEnd) {
                        currentNews.push({
                            timestamp: ts,
                            timeStr: rawStr,
                            headline: headEl.innerText.trim(),
                            url: item.href
                        });
                    }
                }
            });
        }

        if (currentNews.length > 0) {
            newsCache[ticker] = currentNews;
            return currentNews;
        } else if (newsCache[ticker] && newsCache[ticker].length > 0) {
            return newsCache[ticker];
        }
        return [];
    }

    //==================================================================
    // 4. DATA FETCHING
    //==================================================================
    function fetchDataFromFinviz(ticker) {
        const upperTicker = ticker.toUpperCase();
        return new Promise((resolve, reject) => {
            const hostname = "elite.finviz.com";
            const quotePageUrl = `https://${hostname}/quote.ashx?t=${upperTicker}&p=i5`;

            GM_xmlhttpRequest({
                method: "GET",
                url: quotePageUrl,
                onload: function(response) {
                    try {
                        const match = response.responseText.match(/var\s+data\s*=\s*(\{.*?\});/s);
                        if (!match || !match[1]) return reject(`Chart data not found for ${upperTicker}`);

                        const rawData = JSON.parse(match[1]);
                        if (!rawData.date || rawData.date.length === 0) return reject(`No date array found for ${upperTicker}`);

                        const timeframe = settings.chart.timeframe || '1d';
                        const lastTimestamp = rawData.date[rawData.date.length - 1] * 1000;
                        const lastDate = new Date(lastTimestamp);
                        const filteredIndexes = [];
                        if (timeframe === '7d') {
                            const sevenDaysAgo = lastTimestamp - (7 * 24 * 60 * 60 * 1000);
                            for (let i = 0; i < rawData.date.length; i++) {
                                if ((rawData.date[i] * 1000) > sevenDaysAgo) {
                                    filteredIndexes.push(i);
                                }
                            }
                        } else {
                            for (let i = 0; i < rawData.date.length; i++) {
                                const currentDate = new Date(rawData.date[i] * 1000);
                                if (currentDate.getDate() === lastDate.getDate() &&
                                    currentDate.getMonth() === lastDate.getMonth() &&
                                    currentDate.getFullYear() === lastDate.getFullYear()) {
                                    filteredIndexes.push(i);
                                }
                            }
                        }

                        if (filteredIndexes.length === 0) return reject('No data for the selected timeframe.');
                        const firstIndex = filteredIndexes[0];
                        const marketClosePrice = rawData.prevClose || rawData.previousClose || (rawData.meta ? rawData.meta.prevClose : 0);
                        const baselinePrice = (timeframe === '1d' && marketClosePrice > 0) ? marketClosePrice : rawData.open[firstIndex];

                        let cumulativePV = 0;
                        let cumulativeVolume = 0;

                        const processedData = filteredIndexes.map(i => {
                            const p = rawData.close[i];
                            const o = rawData.open ? rawData.open[i] : p;
                            const h = rawData.high ? rawData.high[i] : Math.max(o, p); // Ensure high exists
                            const l = rawData.low ? rawData.low[i] : Math.min(o, p);    // Ensure low exists
                            const v = rawData.volume ? rawData.volume[i] : 0;
                            const t = rawData.date[i] * 1000;

                            cumulativePV += (p * v);
                            cumulativeVolume += v;
                            const vwap = cumulativeVolume === 0 ? p : cumulativePV / cumulativeVolume;
                            const changePct = baselinePrice === 0 ? 0 : ((p - baselinePrice) / baselinePrice) * 100;

                            return {
                                timestamp: t,
                                price: p,
                                open: o,
                                high: h,
                                low: l,
                                volume: v,
                                vwap: vwap,
                                priceChange: changePct,
                                ahChange: marketClosePrice === 0 ? 0 : ((p - marketClosePrice) / marketClosePrice) * 100
                            };
                        });

                        let dayHighPoint = { price: -Infinity };
                        let dayLowPoint = { price: Infinity };
                        let maxVolume = 0;
                        processedData.forEach(p => {
                            if (p.price > dayHighPoint.price) dayHighPoint = p; // Note: for lines, this tracks close. For candles, we might want daily high/low
                            if (p.high > dayHighPoint.price) dayHighPoint = { ...p, price: p.high }; // Update to true high
                            if (p.price < dayLowPoint.price) dayLowPoint = p;
                            if (p.low < dayLowPoint.price) dayLowPoint = { ...p, price: p.low }; // Update to true low

                            if (p.volume > maxVolume) maxVolume = p.volume;
                        });
                        stockDataHistory[`${upperTicker}_i5`] = {
                            points: processedData,
                            dayHighPoint,
                            dayLowPoint,
                            maxVolume,
                            marketClosePrice: baselinePrice,
                            baselinePrice: baselinePrice
                        };
                        resolve();
                    } catch (e) {
                        console.error("Chart data parsing error:", e);
                        reject('Failed to parse Finviz data.');
                    }
                },
                onerror: function(error) {
                    console.error("Chart data fetch error:", error);
                    reject('Failed to fetch chart page.');
                }
            });
        });
    }

    //==================================================================
    // 5. CUSTOM CHART WIDGET
    //==================================================================
    class CustomChartWidget {
        constructor(container) {
            this.container = container;
            this.container.innerHTML = '';
            this.ticker = null;
            this.finalRenderPoints = [];
            this.isCurrentlyHalted = false;
            this.specialMarkers = [];
            // Store overlay coordinates
            this.cursorCache = { x: 0, y: 0, active: false };
            // FIX: CURSOR STATE MEMORY

            // GLOBAL TOOLTIP FIX: Create a body-level tooltip
            if(!document.getElementById('fv-pro-global-tooltip')) {
                const tt = document.createElement('div');
                tt.id = 'fv-pro-global-tooltip';
                tt.className = 'tooltip hidden';
                tt.innerHTML = '<div class="tooltip-content"></div>';
                document.body.appendChild(tt);
            }
        }

        create(ticker) {
            this.ticker = ticker.toUpperCase();
            if (!this.container) return;

            const cacheKey = `${this.ticker}_i5`;

            if (!stockDataHistory[cacheKey] || !stockDataHistory[cacheKey].points || stockDataHistory[cacheKey].points.length < 2) {
                this.setMessage(`Not enough data for ${this.ticker}.`);
                return;
            }

            // TOOLTIP REMOVED FROM CONTAINER TO FIX CLIPPING
            this.container.innerHTML = `
                <div id="pro-chart-wrapper">
                    <button id="pro-chart-settings-btn" title="Chart Settings"><i class="fa-solid fa-gear"></i></button>
                    <div id="chart-icons-layer"></div>
                    <svg width="100%" height="100%" class="custom-price-chart"></svg>
                    <div id="live-dot-overlay" class="live-dot hidden"></div>
                    <div id="hover-dot-overlay" class="hover-dot hidden"></div>
                </div>
            `;
            this.ensureGlobalSettingsModal();
            this.addSettingsListeners();
            this.update();
        }

        ensureGlobalSettingsModal() {
            if (document.getElementById('pro-chart-settings-panel')) return;
            const backdrop = document.createElement('div');
            backdrop.id = 'pro-chart-settings-backdrop';
            document.body.appendChild(backdrop);

            const panel = document.createElement('div');
            panel.id = 'pro-chart-settings-panel';
            panel.innerHTML = `
                <div class="panel-header">
                    <span>Terminal Settings</span>
                    <button id="pro-chart-close-btn">&times;</button>
                </div>
                <div class="panel-body">
                    <div class="panel-sidebar"></div>
                    <div class="panel-content"></div>
                </div>
            `;
            document.body.appendChild(panel);
            this.populateSettings(panel);
        }

        populateSettings(panel) {
            const sidebar = panel.querySelector('.panel-sidebar');
            const content = panel.querySelector('.panel-content');
            if (!sidebar || !content) return;

            // --- MENU STRUCTURE ---
            const structure = [
                {
                    id: 'visuals', icon: 'fa-solid fa-palette', title: 'Design',
                    render: () => `
                        <div class="setting-card">
                            <div class="setting-card-title">Layout & Grid</div>
                            <div class="setting-grid-layout">
                                <div class="setting-item">
                                    <label>Display Mode</label>
                                    <select data-setting="chart.style" class="styled-select">
                                        <option value="line-area">Line + Gradient Area</option>
                                        <option value="line">Line Only</option>
                                        <option value="area">Area Only</option>
                                        <option value="candle">Candlestick</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>Grid Alignment</label>
                                    <div class="toggle-row">
                                        <span>Square Aspect</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" data-setting="chart.forceSquareGrid">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-card">
                            <div class="setting-card-title">Color Palette</div>

                            <div class="color-section-header">Candles</div>
                            <div class="setting-color-grid">
                                ${this.generateColorControl('Up Candle', 'chart.colorCandleUp')}
                                ${this.generateColorControl('Down Candle', 'chart.colorCandleDown')}
                                ${this.generateColorControl('Wick Color', 'chart.colorWick')}
                            </div>

                            <div class="color-section-header">Price Action (Line Mode)</div>
                            <div class="setting-color-grid">
                                ${this.generateColorControl('Up Trend', 'chart.color')}
                                ${this.generateColorControl('Down Trend', 'chart.colorDown')}
                            </div>
                            <div class="toggle-row bordered-bottom" style="margin-bottom: 15px; padding-bottom: 15px; margin-top: 10px;">
                                <span>Dynamic Coloring (Open vs Close)</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="chart.dynamicColor">
                                    <span class="slider round"></span>
                                </label>
                            </div>

                            <div class="color-section-header">Market Sessions</div>
                            <div class="setting-color-grid">
                                ${this.generateColorControl('Pre-Market', 'chart.colorPreMarket')}
                                ${this.generateColorControl('Post-Market', 'chart.colorPostMarket')}
                            </div>
                            <div class="toggle-row bordered-bottom" style="margin-bottom: 15px; padding-bottom: 15px; margin-top: 10px;">
                                <span>Show Extended Hours Colors</span>
                                <label class="toggle-switch">
                                    <input type="checkbox" data-setting="chart.useExtendedColors">
                                    <span class="slider round"></span>
                                </label>
                            </div>

                            <div class="color-section-header">Indicators</div>
                            <div class="setting-color-grid">
                                ${this.generateColorControl('VWAP Line', 'chart.colorVWAP')}
                            </div>
                        </div>
                    `
                },
                {
                    id: 'technicals', icon: 'fa-solid fa-layer-group', title: 'Technicals',
                    render: () => `
                        <div class="setting-card">
                            <div class="setting-card-title">Active Components</div>
                            <div class="setting-grid-layout">
                                <div class="setting-item">
                                    <div class="toggle-row">
                                        <span>Volume Bars</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" data-setting="chart.showVolume">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <div class="toggle-row">
                                        <span>VWAP Line</span>
                                        <label class="toggle-switch">
                                            <input type="checkbox" data-setting="chart.showVWAP">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-card">
                            <div class="setting-card-title">Data Feed Configuration</div>
                            <div class="setting-grid-layout">
                                <div class="setting-item">
                                    <label>Timeframe</label>
                                    <select data-setting="chart.timeframe" class="styled-select">
                                        <option value="1d">1 Day (Intraday)</option>
                                        <option value="7d">7 Day (Swing)</option>
                                    </select>
                                </div>
                                <div class="setting-item">
                                    <label>Refresh Interval</label>
                                    <select data-setting="chart.updateIntervalSeconds" class="styled-select">
                                        <option value="1">1s (Realtime)</option>
                                        <option value="2">2s (Fast)</option>
                                        <option value="5">5s (Normal)</option>
                                        <option value="10">10s (Slow)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    `
                },
                {
                    id: 'engine', icon: 'fa-solid fa-microchip', title: 'Engine',
                    render: () => `
                        <div class="setting-card">
                            <div class="setting-card-title">Rendering Physics</div>
                            <div class="slider-group">
                                <label>Line Smoothing <span class="val-display"></span></label>
                                <input type="range" min="0" max="30" step="1" data-setting="chart.smoothingIterations">
                            </div>
                            <div class="slider-group">
                                <label>Tension Factor <span class="val-display"></span></label>
                                <input type="range" min="0" max="1" step="0.05" data-setting="chart.smoothingFactor">
                            </div>
                            <div class="slider-group">
                                <label>Detail Pass (Resolution) <span class="val-display"></span></label>
                                <input type="range" min="0" max="8" step="1" data-setting="chart.interpolationPasses">
                            </div>
                            <div class="slider-group">
                                <label>Amplitude Factor <span class="val-display"></span></label>
                                <input type="range" min="0" max="1" step="0.05" data-setting="chart.amplitudeFactor">
                            </div>
                        </div>
                    `
                }
            ];
            // Render Tabs and Pages
            sidebar.innerHTML = structure.map((s, i) =>
                `<div class="settings-tab ${i===0?'active':''}" data-tab="${s.id}">
                    <i class="${s.icon}"></i> <span>${s.title}</span>
                 </div>`
            ).join('');
            content.innerHTML = structure.map((s, i) =>
                `<div class="settings-page ${i===0?'active':''}" id="page-${s.id}">
                    ${s.render()}
                 </div>`
            ).join('');
            // Tab Switch Logic
            const tabs = sidebar.querySelectorAll('.settings-tab');
            const pages = content.querySelectorAll('.settings-page');

            tabs.forEach(tab => {
                tab.onclick = () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    pages.forEach(p => p.classList.remove('active'));
                    tab.classList.add('active');
                    content.querySelector(`#page-${tab.dataset.tab}`).classList.add('active');
                };
            });
        }

        generateColorControl(label, settingKey) {
            return `
                <div class="color-grid-item">
                    <div class="color-label">${label}</div>
                    <div class="color-control-wrapper">
                        <div class="color-preview-circle trigger-pro-picker" data-target="${settingKey}"></div>
                         <input type="text" class="color-hex-display" data-setting-text="${settingKey}" readonly>
                    </div>
                </div>
            `;
        }

        addSettingsListeners() {
            const settingsBtn = this.container.querySelector('#pro-chart-settings-btn');
            const panel = document.getElementById('pro-chart-settings-panel');
            const backdrop = document.getElementById('pro-chart-settings-backdrop');
            const closeBtn = document.getElementById('pro-chart-close-btn');

            if (!settingsBtn || !panel || !backdrop) return;
            const togglePanel = () => {
                const isActive = panel.classList.contains('active');
                if (isActive) {
                    panel.classList.remove('active');
                    backdrop.classList.remove('active');
                    saveSettings();
                } else {
                    this.syncSettingsUI(panel);
                    panel.classList.add('active');
                    backdrop.classList.add('active');
                }
            };

            settingsBtn.onclick = togglePanel;
            if(closeBtn) closeBtn.onclick = togglePanel;
            backdrop.onclick = togglePanel;

            this.attachLiveListeners(panel);
        }

        syncSettingsUI(panel) {
            const getVal = (path) => path.split('.').reduce((o, k) => (o || {})[k], settings);
            // Inputs
            panel.querySelectorAll('input[data-setting], select[data-setting]').forEach(el => {
                const key = el.dataset.setting;
                const val = getVal(key);
                if (el.type === 'checkbox') el.checked = val;
                else el.value = val;

                // Sync Range display + Background Gradient for "blue line" fill
                if(el.type === 'range') {
                    const label = el.previousElementSibling;
                    if(label && label.querySelector('.val-display')) {
                        label.querySelector('.val-display').textContent = val;
                    }
                    this.updateSliderFill(el);
                }
            });
            panel.querySelectorAll('.trigger-pro-picker').forEach(el => {
                const key = el.dataset.target;
                const val = getVal(key);
                el.style.backgroundColor = val;
                el.style.boxShadow = `0 0 15px ${val}40`; // Soft glow
            });
            panel.querySelectorAll('input[data-setting-text]').forEach(el => {
                el.value = getVal(el.dataset.settingText);
            });
        }

        updateSliderFill(el) {
            const min = parseFloat(el.min) || 0;
            const max = parseFloat(el.max) || 100;
            const val = parseFloat(el.value) || 0;
            const percentage = ((val - min) / (max - min)) * 100;
            el.style.background = `linear-gradient(to right, var(--accent-color) ${percentage}%, #333 ${percentage}%)`;
        }

        attachLiveListeners(panel) {
            const triggerUpdate = () => requestAnimationFrame(() => this.update());
            // 1. Generic Inputs
            panel.querySelectorAll('select[data-setting], input[type="range"], input[type="checkbox"]').forEach(el => {
                el.addEventListener('input', () => {
                    const key = el.dataset.setting;
                    let val = el.type === 'checkbox' ? el.checked : el.value;
                    if (el.type === 'range') {
                        val = parseFloat(val);
                        const label = el.previousElementSibling;
                        if(label && label.querySelector('.val-display')) label.querySelector('.val-display').textContent = val;
                        this.updateSliderFill(el);
                    }
                    updateSettingState(key, val);
                    triggerUpdate();
                });
            });
            // 2. PRO PICKER BINDING
            panel.querySelectorAll('.trigger-pro-picker').forEach(el => {
                el.addEventListener('click', () => {
                    const key = el.dataset.target;
                    const getVal = (path) => path.split('.').reduce((o, k) => (o || {})[k], settings);
                    const currentHex = getVal(key);
                    proColorPicker.open(currentHex, key, () => {
                        this.syncSettingsUI(panel);
                        triggerUpdate();
                    });
                });
            });
        }

        update() {
            if (!this.container || !this.ticker) return;
            const svg = this.container.querySelector('.custom-price-chart');
            const iconsLayer = this.container.querySelector('#chart-icons-layer');
            if (!svg || !iconsLayer) return;

            iconsLayer.innerHTML = '';
            this.specialMarkers = [];
            // RESET MARKER DATA

            const dataBundle = stockDataHistory[`${this.ticker}_i5`];
            if (!dataBundle || !dataBundle.points || dataBundle.points.length < 2) return;

            const { points: data, dayHighPoint, dayLowPoint, maxVolume, marketClosePrice, baselinePrice } = dataBundle;
            const lastPoint = data[data.length - 1];

            const {
                style, fixedYAxisRange, timeframe,
                color, colorDown, dynamicColor,
                useExtendedColors, colorPreMarket, colorPostMarket, colorVWAP,
                colorCandleUp, colorCandleDown, colorWick,
                showVolume, showVWAP,
                smoothingIterations, smoothingFactor, interpolationPasses, amplitudeFactor, forceSquareGrid
            } = { ...defaultSettings.chart, ...settings.chart };
            const isCandle = style === 'candle';

            let primaryColor = color;
            if (dynamicColor) {
                const dayOpen = data[0].open;
                if (lastPoint.price < dayOpen) {
                    primaryColor = colorDown;
                }
            }
            if (this.isCurrentlyHalted) {
                primaryColor = COLOR_HALT_STROKE;
            }

            const valueKey = 'priceChange';
            const padding = { top: 40, right: 65, bottom: 25, left: 15 };
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            if (width === 0 || height === 0) return;
            const chartWidth = width - padding.left - padding.right;
            const availableWidth = chartWidth - 20;
            const chartHeight = height - padding.top - padding.bottom;

            let startTime = data[0].timestamp;
            let endTime = data[data.length - 1].timestamp;
            let midnightET = 0;

            if (timeframe === '1d') {
                const refTime = data[data.length - 1].timestamp;
                midnightET = getMidnightET(refTime);
                startTime = midnightET + (4 * 3600000);
                // +4h
                endTime = midnightET + (20 * 3600000);
                // +20h
            } else {
                 endTime = data[data.length - 1].timestamp;
                 startTime = data[0].timestamp;
            }

            const timeRange = endTime - startTime;
            if (timeRange <= 0) return;

            // --- IMPROVED AUTO-SCALING LOGIC ---
            // 1. Get visible data points
            const visibleData = data.filter(d => d.timestamp >= startTime && d.timestamp <= endTime);
            // 2. Helper to get Percentage Change
            const getPct = (p) => baselinePrice === 0 ? 0 : ((p - baselinePrice) / baselinePrice) * 100;

            // 3. Calculate Min/Max based on High/Low (not just Close) to prevent wick clipping
            let currentMinPct = Infinity;
            let currentMaxPct = -Infinity;

            if (visibleData.length > 0) {
                visibleData.forEach(d => {
                    const highP = getPct(d.high);
                    const lowP = getPct(d.low);
                    if (highP > currentMaxPct) currentMaxPct = highP;
                    if (lowP < currentMinPct) currentMinPct = lowP;
                });
            } else {
                currentMinPct = 0;
                currentMaxPct = 0;
            }

            const dataMidpoint = (currentMinPct + currentMaxPct) / 2;
            const dataRange = Math.max(0.01, currentMaxPct - currentMinPct);

            // 4. Add 10% total padding (5% top, 5% bottom) so candles don't touch edges
            const paddingBuffer = dataRange * 0.10;
            const paddedRange = dataRange + paddingBuffer;

            // 5. Apply fixed range floor if needed
            const finalHalfRange = Math.max(fixedYAxisRange / 2, paddedRange / 2);
            const minVal = dataMidpoint - finalHalfRange;
            const maxVal = dataMidpoint + finalHalfRange;
            const mapX = (ts) => {
                if (ts < startTime) return padding.left;
                if (ts > endTime) return width - padding.right;
                return padding.left + ((ts - startTime) / timeRange) * availableWidth;
            };
            const mapY = (val) => padding.top + chartHeight - (((val - minVal) / (maxVal - minVal)) * chartHeight);
            const invMapY = (yPx) => {
                const relativeY = padding.top + chartHeight - yPx;
                const ratio = relativeY / chartHeight;
                return minVal + ratio * (maxVal - minVal);
            };

            let defsHtml = '';
            let areaMaskAttr = '';
            const gX1 = padding.left;
            const gX2 = width - padding.right;
            defsHtml += `<clipPath id="chart-clip"><rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${chartHeight}" /></clipPath>`;

            let t930 = startTime;
            let t1600 = endTime + 1000;
            if (timeframe === '1d' && useExtendedColors) {
                t930 = midnightET + (9.5 * 3600000);
                t1600 = midnightET + (16 * 3600000);

                const x930 = mapX(t930);
                const x1600 = mapX(t1600);
                const pct930 = Math.max(0, Math.min(1, (x930 - gX1) / (gX2 - gX1)));
                const pct1600 = Math.max(0, Math.min(1, (x1600 - gX1) / (gX2 - gX1)));
                // GRADIENT FOR AREA FILL ONLY
                const gradId = 'extended-hours-grad';
                defsHtml += `
                    <linearGradient id="${gradId}" gradientUnits="userSpaceOnUse" x1="${gX1}" y1="0" x2="${gX2}" y2="0">
                        <stop offset="0%" stop-color="${colorPreMarket}" />
                        <stop offset="${pct930}" stop-color="${colorPreMarket}" />
                        <stop offset="${pct930}" stop-color="${primaryColor}" />
                        <stop offset="${pct1600}" stop-color="${primaryColor}" />
                        <stop offset="${pct1600}" stop-color="${colorPostMarket}" />
                        <stop offset="100%" stop-color="${colorPostMarket}" />
                    </linearGradient>
                `;
                // Mask for AREA fill (straight cuts)
                if (!isCandle) {
                    let areaMaskContent = `
                          <linearGradient id="fade-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stop-color="white" stop-opacity="0.5"/>
                              <stop offset="100%" stop-color="white" stop-opacity="0"/>
                          </linearGradient>
                          <rect x="0" y="0" width="100%" height="100%" fill="url(#fade-grad)"/>
                    `;
                    if(x930 > padding.left) areaMaskContent += `<line x1="${x930}" y1="0" x2="${x930}" y2="100%" stroke="black" stroke-width="2" shape-rendering="crispEdges"/>`;
                    if(x1600 < width - padding.right) areaMaskContent += `<line x1="${x1600}" y1="0" x2="${x1600}" y2="100%" stroke="black" stroke-width="2" shape-rendering="crispEdges"/>`;

                    defsHtml += `<mask id="area-cut-mask">${areaMaskContent}</mask>`;
                    areaMaskAttr = `mask="url(#area-cut-mask)"`;
                }

                const iSun = document.createElement('i');
                iSun.className = 'fa-solid fa-sun chart-icon-marker';
                iSun.style.color = colorPreMarket;
                iSun.style.left = `${padding.left + 10}px`;
                iSun.style.bottom = '40px';
                iconsLayer.appendChild(iSun);
                const iMoon = document.createElement('i');
                iMoon.className = 'fa-solid fa-moon chart-icon-marker';
                iMoon.style.color = colorPostMarket;
                iMoon.style.left = `${x1600 + 10}px`;
                iMoon.style.bottom = '40px';
                iconsLayer.appendChild(iMoon);
            } else {
                 defsHtml += `
                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.4"/>
                        <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0"/>
                    </linearGradient>
                `;
            }

            let volumeHtml = '';
            // Calculate bar width for volume (and candles)
            let minTimeDelta = Infinity;
            if (data.length > 1) {
                for (let i = 1; i < data.length; i++) {
                    const diff = data[i].timestamp - data[i - 1].timestamp;
                    if (diff < minTimeDelta && diff > 0) minTimeDelta = diff;
                }
            } else { minTimeDelta = timeRange;
            }
            const pixelsPerStep = (availableWidth / timeRange) * minTimeDelta;
            const gapSize = 1;
            const barWidth = Math.max(0.5, pixelsPerStep - gapSize);
            if (showVolume && maxVolume > 0) {
                const volHeightMax = chartHeight * 0.20;
                volumeHtml = '<g class="chart-volume" opacity="0.4">';
                data.forEach((d) => {
                    if (d.timestamp < startTime || d.timestamp > endTime) return;
                    const h = (d.volume / maxVolume) * volHeightMax;
                    const x = mapX(d.timestamp) - (barWidth / 2);
                    const y = height - padding.bottom - h;
                    let barColor = d.price >= d.open ? color : colorDown;
                    volumeHtml += `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${barColor}" shape-rendering="crispEdges" />`;
                });
                volumeHtml += '</g>';
            }

            const originalPoints = visibleData.map(point => ({ x: mapX(point.timestamp), y: mapY(point[valueKey]) }));
            // Logic Split: Candles vs Lines
            let mainChartHtml = '';
            if (isCandle) {
                // CANDLESTICK LOGIC
                let candleHtml = '';
                visibleData.forEach(d => {
                    const xCenter = mapX(d.timestamp);
                    const yOpen = mapY(getPct(d.open));
                    const yClose = mapY(getPct(d.price));
                    const yHigh = mapY(getPct(d.high));
                    const yLow = mapY(getPct(d.low));

                    const isUp = d.price >= d.open;
                    const cColor = isUp ? colorCandleUp : colorCandleDown;

                    // Wick
                    candleHtml += `<line x1="${xCenter}" y1="${yHigh}" x2="${xCenter}" y2="${yLow}" stroke="${colorWick}" stroke-width="1" shape-rendering="crispEdges" />`;

                    // Body
                    const bodyTop = Math.min(yOpen, yClose);
                    const bodyHeight = Math.max(1, Math.abs(yClose - yOpen));
                    const bodyX = xCenter - (barWidth / 2);
                    candleHtml += `<rect x="${bodyX}" y="${bodyTop}" width="${barWidth}" height="${bodyHeight}" fill="${cColor}" shape-rendering="crispEdges" />`;
                });
                mainChartHtml = candleHtml;
                this.finalRenderPoints = originalPoints; // For tooltips
            } else {
                // LINE / AREA LOGIC (Original)
                const interpolatedPoints = interpolatePoints(originalPoints, interpolationPasses);
                let finalPoints = applySubdivisionSmoothing(interpolatedPoints, smoothingIterations, smoothingFactor);

                if (amplitudeFactor > 0 && finalPoints.length > 1) {
                    const smoothedYs = finalPoints.map(p => p.y);
                    const smoothedMinY = Math.min(...smoothedYs);
                    const smoothedRange = Math.max(...smoothedYs) - smoothedMinY;
                    const originalYs = originalPoints.map(p => p.y);
                    const originalRange = Math.max(...originalYs) - Math.min(...originalYs);

                    if (smoothedRange > 0) {
                        finalPoints = finalPoints.map(point => {
                            const normalizedPos = (point.y - smoothedMinY) / smoothedRange;
                            const targetY = Math.min(...originalYs) + normalizedPos * originalRange;
                            return { x: point.x, y: point.y + (targetY - point.y) * amplitudeFactor };
                        });
                    }
                }
                this.finalRenderPoints = finalPoints;
                // --- BUILD LINE PATHS (SPLIT SEGMENTS FOR ROUNDED CAPS) ---
                const buildPath = (pts) => {
                    if (pts.length === 0) return '';
                    let d = `M ${pts[0].x},${pts[0].y}`;
                    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x},${pts[i].y}`;
                    return d;
                };

                let pathDataWhole = buildPath(finalPoints); // For area fill
                let lineHtml = '';
                if (style.includes('line')) {
                    if (timeframe === '1d' && useExtendedColors) {
                        const xPreEnd = mapX(t930);
                        const xPostStart = mapX(t1600);

                        const ptsPre = [];
                        const ptsMkt = [];
                        const ptsPost = [];
                        finalPoints.forEach(p => {
                            // Strict separation to allow "rounded caps" to show at the gaps
                            if (p.x <= xPreEnd) ptsPre.push(p);
                            else if (p.x >= xPostStart) ptsPost.push(p);
                            else ptsMkt.push(p);
                        });
                        const dPre = buildPath(ptsPre);
                        const dMkt = buildPath(ptsMkt);
                        const dPost = buildPath(ptsPost);
                        if (dPre) lineHtml += `<path d="${dPre}" stroke="${colorPreMarket}" class="chart-line" stroke-linecap="round" />`;
                        if (dMkt) lineHtml += `<path d="${dMkt}" stroke="${primaryColor}" class="chart-line" stroke-linecap="round" />`;
                        if (dPost) lineHtml += `<path d="${dPost}" stroke="${colorPostMarket}" class="chart-line" stroke-linecap="round" />`;
                    } else {
                        // Standard continuous line
                        if (pathDataWhole) lineHtml += `<path d="${pathDataWhole}" stroke="${primaryColor}" class="chart-line" stroke-linecap="round" />`;
                    }
                }

                const areaPathData = pathDataWhole + ` L ${finalPoints.length > 0 ?
                finalPoints[finalPoints.length - 1].x : 0},${height - padding.bottom} L ${finalPoints.length > 0 ? finalPoints[0].x : 0},${height - padding.bottom} Z`;
                const fillUrl = (timeframe === '1d' && useExtendedColors) ? `url(#extended-hours-grad)` : `url(#chart-gradient)`;
                mainChartHtml = `
                    ${style.includes('area') ?
                    `<path d="${areaPathData}" fill="${fillUrl}" ${areaMaskAttr} />` : ''}
                    ${lineHtml}
                `;
            }

            let vwapHtml = '';
            if (showVWAP) {
                 const vwapRawPoints = visibleData.map(d => {
                        const base = timeframe === '7d' ? data[0].price : marketClosePrice;
                        const chg = base === 0 ? 0 : ((d.vwap - base) / base) * 100;
                        return { x: mapX(d.timestamp), y: mapY(chg) };
                 });
                 if (vwapRawPoints.length > 0) {
                      let vPath = `M ${vwapRawPoints[0].x},${vwapRawPoints[0].y}`;
                      for(let i=1; i<vwapRawPoints.length; i++) vPath += ` L ${vwapRawPoints[i].x},${vwapRawPoints[i].y}`;

                      vwapHtml = `<path d="${vPath}" fill="none" stroke="${colorVWAP}" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.8" clip-path="url(#chart-clip)" />`;
                 }
            }

            let gridHtml = '';
            const thirtyMinMs = 30 * 60 * 1000;
            const fiveMinMs = 5 * 60 * 1000;
            const pxPerMs = availableWidth / timeRange;
            const pxStepMajor = pxPerMs * thirtyMinMs;
            // Vertical Grid
            let lastLabelX = -Infinity;
            let tLoop = Math.ceil(startTime / fiveMinMs) * fiveMinMs;

            for (; tLoop < endTime; tLoop += fiveMinMs) {
                const xPos = mapX(tLoop);
                if (xPos > padding.left && xPos < width - padding.right) {
                      const timeDiff = tLoop - midnightET;
                      const minsFromMidnight = Math.round(timeDiff / 60000);
                      const isHour = (minsFromMidnight % 60 === 0);
                      const isHalfHour = (minsFromMidnight % 30 === 0);

                      if (isHalfHour) {
                          gridHtml += `<line class="grid-line major" x1="${xPos}" y1="${padding.top}" x2="${xPos}" y2="${height - padding.bottom}" />`;
                          if (isHour) {
                              if (xPos - lastLabelX > 50 && xPos < width - padding.right - 20) {
                                  const label = formatTimeET(tLoop, {hour:'numeric', minute:'2-digit'});
                                  gridHtml += `<text class="axis-label x-axis" x="${xPos}" y="${height - 8}" text-anchor="middle">${label}</text>`;
                                  lastLabelX = xPos;
                              }
                          }
                      } else {
                          gridHtml += `<line class="grid-line minor" x1="${xPos}" y1="${padding.top}" x2="${xPos}" y2="${height - padding.bottom}" />`;
                      }
                }
            }

            // Horizontal Grid (Only Major)
            const startYPx = mapY(0);
            // Down
            for(let y = startYPx; y < height - padding.bottom; y += pxStepMajor) {
                if(y > padding.top) {
                    const pctVal = invMapY(y);
                    const isZero = Math.abs(y - startYPx) < 1;
                    const cssClass = isZero ? "grid-line major zero-line" : "grid-line major";
                    gridHtml += `<line class="${cssClass}" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" />`;
                    gridHtml += `<text class="axis-label y-axis" x="${width - padding.right + 5}" y="${y + 4}">${pctVal.toFixed(2)}%</text>`;
                }
            }
            // Up
            for(let y = startYPx - pxStepMajor; y > padding.top; y -= pxStepMajor) {
                if(y < height - padding.bottom) {
                    const pctVal = invMapY(y);
                    gridHtml += `<line class="grid-line major" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" />`;
                    gridHtml += `<text class="axis-label y-axis" x="${width - padding.right + 5}" y="${y + 4}">${pctVal.toFixed(2)}%</text>`;
                }
            }

            const priceColorClass = lastPoint[valueKey] >= 0 ? 'positive' : 'negative';
            const priceStr = `$${lastPoint.price.toFixed(2)}`;
            const changeStr = `(${lastPoint[valueKey]>0?'+':''}${lastPoint[valueKey].toFixed(2)}%)`;

            const highVal = dayHighPoint.price;
            const highPct = getPct(highVal);
            const lowVal = dayLowPoint.price;
            const lowPct = getPct(lowVal);

            const highColorClass = highPct >= 0 ? 'positive' : 'negative';
            const lowColorClass = lowPct >= 0 ? 'positive' : 'negative';
            const headerHtml = `
                <g class="chart-header">
                    <text class="header-ticker" x="${padding.left + 5}" y="28">${this.ticker}</text>
                    <text class="header-price-group" x="${padding.left + 120}" y="28">
                        <tspan class="stat-label">Price:</tspan>
                        <tspan class="header-price ${priceColorClass}" dx="5">${priceStr}</tspan>
                        <tspan class="stat-label" dx="15">Change:</tspan>
                        <tspan class="header-change ${priceColorClass}" dx="5">${changeStr}</tspan>
                    </text>
                    <text class="header-stats" x="${width - padding.right - 5}" y="28" text-anchor="end">
                        <tspan class="stat-label">H:</tspan>
                        <tspan class="val ${highColorClass}">$${highVal.toFixed(2)} (${highPct > 0 ? '+' : ''}${highPct.toFixed(2)}%)</tspan>
                        <tspan class="stat-label" dx="10">L:</tspan>
                        <tspan class="val ${lowColorClass}">$${lowVal.toFixed(2)} (${lowPct > 0 ? '+' : ''}${lowPct.toFixed(2)}%)</tspan>
                        <tspan class="stat-label" dx="10">Vol:</tspan><tspan class="val">${(maxVolume/1000).toFixed(1)}k+</tspan>
                    </text>
                </g>
            `;
            // === CALCULATE CURSOR RELATIVE POSITION ONCE ===
            let relCursorX = -1000, relCursorY = -1000;
            if (this.cursorCache.active) {
                 const rect = this.container.getBoundingClientRect();
                 relCursorX = this.cursorCache.x - rect.left;
                 relCursorY = this.cursorCache.y - rect.top;
            }

            const createMarker = (mx, my, colorStroke, colorFill, label, groupClass, dataAttrs) => {
                const markerCy = my - 30;
                const circleRadius = 9; // INCREASED FROM 7
                const hitRadius = 30;
                // HUGE HIT AREA

                // PRE-CALCULATE HOVER STATE TO STOP BOUNCING
                let targetR = circleRadius;
                if (this.cursorCache.active) {
                    const dx = mx - relCursorX;
                    const dy = markerCy - relCursorY;
                    if (dx*dx + dy*dy < 900) { targetR = 12;
                    } // INCREASED FROM 9
                }

                return `
                    <line x1="${mx}" y1="${markerCy + targetR}" x2="${mx}" y2="${my}" stroke="${colorStroke}" stroke-width="1" stroke-dasharray="2,2" opacity="0.8"/>
                    <g class="${groupClass}" ${dataAttrs} data-base-r="${circleRadius}">
                        <circle cx="${mx}" cy="${markerCy}" r="${hitRadius}" fill="transparent" />
                        <circle class="visual-circle" cx="${mx}" cy="${markerCy}" r="${targetR}" fill="${colorFill}" stroke="#fff" stroke-width="1.5" />
                        <text x="${mx}" y="${markerCy}" dominant-baseline="central" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="7.5px" font-weight="700" style="pointer-events:none;">${label}</text>
                    </g>
                `;
            };

            let haltHtml = '';
            getHaltEvents(this.ticker).forEach(e => {
                if(e.end >= startTime) {
                    let closestIdx = 0;
                    let minDiff = Infinity;
                    visibleData.forEach((d, i) => {
                        const diff = Math.abs(d.timestamp - e.start);
                        if (diff < minDiff) { minDiff = diff; closestIdx = i; }
                    });

                    const mx = mapX(visibleData[closestIdx].timestamp);
                    let my = mapY(visibleData[closestIdx][valueKey]);

                    if (!isCandle) {
                          const fineIdx = closestIdx * (2**interpolationPasses);
                          if (this.finalRenderPoints && this.finalRenderPoints[fineIdx]) {
                               my = this.finalRenderPoints[fineIdx].y;
                          }
                    }

                    // PUSH TO SPECIAL MARKERS
                    this.specialMarkers.push({
                          x: mx, y: my-30, type: 'halt', start: e.start, end: e.end, id: `halt-${e.start}`
                    });
                    haltHtml += createMarker(mx, my, COLOR_HALT_STROKE, COLOR_HALT_FILL, "H", "halt-marker-group", `data-id="halt-${e.start}" data-start="${e.start}" data-end="${e.end}"`);
                }
            });

            let newsHtml = '';
            const newsEvents = getNewsEvents(this.ticker, midnightET, startTime, endTime);
            newsEvents.forEach(n => {
                if(n.timestamp >= startTime && n.timestamp <= endTime) {
                    let closestIdx = 0;
                    let minDiff = Infinity;
                    visibleData.forEach((d, i) => {
                        const diff = Math.abs(d.timestamp - n.timestamp);
                        if (diff < minDiff) { minDiff = diff; closestIdx = i; }
                    });

                    const mx = mapX(n.timestamp);
                    let my = mapY(visibleData[closestIdx][valueKey]);

                    if (!isCandle) {
                          const fineIdx = closestIdx * (2**interpolationPasses);
                          if (this.finalRenderPoints && this.finalRenderPoints[fineIdx]) {
                               my = this.finalRenderPoints[fineIdx].y;
                          }
                    }

                    // PUSH TO SPECIAL MARKERS
                    this.specialMarkers.push({
                          x: mx, y: my-30, type: 'news', time: n.timestamp, headline: n.headline, id: `news-${n.timestamp}`
                    });
                    const safeHeadline = n.headline.replace(/"/g, '&quot;');
                    newsHtml += createMarker(mx, my, COLOR_NEWS_STROKE, COLOR_NEWS_FILL, "N", "news-marker-group", `data-id="news-${n.timestamp}" data-time="${n.timestamp}" data-headline="${safeHeadline}"`);
                }
            });

            const lastY = mapY(lastPoint[valueKey]);
            const tagText = lastPoint.price.toFixed(2);
            const tagW = tagText.length * 7 + 10;
            const arrowPath = `M ${width-padding.right},${lastY-10} L ${width-padding.right+tagW},${lastY-10} L ${width-padding.right+tagW+8},${lastY} L ${width-padding.right+tagW},${lastY+10} L ${width-padding.right},${lastY+10} Z`;

            const tagHtml = isTradingActive() ? `
                <g class="live-price-indicator">
                    <line x1="${padding.left}" y1="${lastY}" x2="${mapX(lastPoint.timestamp)}" y2="${lastY}" stroke="#666" stroke-dasharray="2,3" />
                    <path d="${arrowPath}" fill="${primaryColor}" />
                    <text x="${width-padding.right+tagW/2}" y="${lastY+4}" fill="#000" font-weight="bold" font-size="11px" text-anchor="middle">${tagText}</text>
                </g>
            ` : '';
            const crosshairHtml = `<line class="crosshair-guide hidden" x1="0" y1="${padding.top}" x2="0" y2="${height - padding.bottom}" />`;
            // REORDERED FOR CLICK-THROUGH FIX: Markers are drawn first, but they have pointer-events: none.
            // chart-event-rect is drawn LAST so it sits on TOP of everything in the z-order.
            svg.innerHTML = `
                <defs>
                    ${defsHtml}
                </defs>
                ${headerHtml}
                ${gridHtml}
                ${volumeHtml}
                <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${chartHeight}" class="chart-border" />
                ${mainChartHtml}
                ${vwapHtml}
                ${tagHtml}
                ${crosshairHtml}
                ${haltHtml}
                ${newsHtml}
                <rect class="chart-event-rect" x="0" y="0" width="${width}" height="${height}" fill="transparent" />
            `;
            const liveDot = this.container.querySelector('#live-dot-overlay');
            if(liveDot) {
                if(!this.isCurrentlyHalted && !isCandle) {
                    liveDot.classList.remove('hidden');
                    liveDot.style.left = `${mapX(lastPoint.timestamp)}px`;
                    liveDot.style.top = `${lastY}px`;
                    let liveDotColor = primaryColor;
                    if (timeframe === '1d' && useExtendedColors) {
                          if (lastPoint.timestamp < t930) liveDotColor = colorPreMarket;
                          else if (lastPoint.timestamp >= t1600) liveDotColor = colorPostMarket;
                    }
                    liveDot.style.backgroundColor = liveDotColor;
                    liveDot.style.boxShadow = `0 0 10px ${liveDotColor}`;
                } else liveDot.classList.add('hidden');
            }

            const wrapper = this.container.querySelector('#pro-chart-wrapper');
            let haltOverlay = this.container.querySelector('.fv-halt-overlay');
            if (this.isCurrentlyHalted) {
                if (!haltOverlay) {
                    haltOverlay = document.createElement('div');
                    haltOverlay.className = 'fv-halt-overlay';
                    haltOverlay.innerHTML = `
                        <div class="fv-halt-card">
                            <div class="halt-icon"><i class="fa-solid fa-ban"></i></div>
                            <div class="halt-text">TRADING HALTED</div>
                            <div class="halt-sub">Market Data Paused</div>
                        </div>
                    `;
                    wrapper.insertBefore(haltOverlay, null);
                }
            } else {
                if (haltOverlay) haltOverlay.remove();
            }

            // CRITICAL FIX: UNIFIED HOVER HANDLER
            this.addUnifiedHoverHandler(visibleData, valueKey, mapX, mapY, padding, width, height, startTime, timeRange, availableWidth, primaryColor, t930, t1600);
        }

        addUnifiedHoverHandler(data, valueKey, mapX, mapY, padding, width, height, startTime, timeRange, availableWidth, primaryColor, t930, t1600) {
            // FIX: SELECT SPECIFIC RECT INSIDE SVG TO AVOID GHOST ELEMENTS
            const eventRect = this.container.querySelector('.custom-price-chart .chart-event-rect');
            // USE GLOBAL TOOLTIP
            const tooltip = document.getElementById('fv-pro-global-tooltip');
            const tooltipContent = tooltip.querySelector('.tooltip-content');

            const crosshair = this.container.querySelector('.crosshair-guide');
            const hoverDot = this.container.querySelector('#hover-dot-overlay');
            const svg = this.container.querySelector('.custom-price-chart');

            if (!eventRect) return;
            // Safety check

            // === REFACTORED: Create the Draw Logic Function ===
            const drawOverlay = (clientX, clientY) => {
                tooltip.classList.remove('hidden');
                tooltip.style.opacity = '1';
                tooltip.style.display = 'block'; // Force block display

                // 1. Calculate Coordinates
                const rect = eventRect.getBoundingClientRect();
                const mouseX = clientX - rect.left;
                const mouseY = clientY - rect.top;
                // 2. CHECK MARKER PROXIMITY FIRST (Priority)
                // Hitbox radius squared = 30*30 = 900
                const hoveredMarker = this.specialMarkers.find(m => {
                    const dx = m.x - mouseX;
                    const dy = m.y - mouseY;
                    return (dx*dx + dy*dy) < 900; // Generous hit area
                });
                // Clear previous marker highlights
                svg.querySelectorAll('.visual-circle').forEach(c => c.setAttribute('r', '9'));
                // RESET TO NEW BASE SIZE

                if (hoveredMarker) {
                    // SHOW MARKER TOOLTIP
                    if(crosshair) crosshair.classList.add('hidden');
                    if(hoverDot) hoverDot.classList.add('hidden');

                    // Highlight marker
                    const activeGroup = svg.querySelector(`g[data-id="${hoveredMarker.id}"]`);
                    if(activeGroup) {
                        const circle = activeGroup.querySelector('.visual-circle');
                        if(circle) circle.setAttribute('r', '12'); // NEW BOUNCY SIZE
                    }

                    if (hoveredMarker.type === 'halt') {
                        const start = formatTimeET(parseInt(hoveredMarker.start), {hour:'2-digit',minute:'2-digit'});
                        const end = formatTimeET(parseInt(hoveredMarker.end), {hour:'2-digit',minute:'2-digit'});
                        tooltipContent.innerHTML = `
                            <div class="tt-title halt" style="color: #e74c3c; font-weight:900; border-bottom:1px solid #333; margin-bottom:4px; text-align:center;">TRADING HALTED</div>
                            <div class="tt-row" style="display:flex; justify-content:space-between; color:#aaa;">Start: <span class="tt-val" style="color:#fff; font-weight:bold;">${start}</span></div>
                            <div class="tt-row" style="display:flex; justify-content:space-between; color:#aaa;">End: <span class="tt-val" style="color:#fff; font-weight:bold;">${end}</span></div>
                        `;
                    } else if (hoveredMarker.type === 'news') {
                        const timeStr = formatTimeET(parseInt(hoveredMarker.time), {hour:'2-digit',minute:'2-digit'});
                        tooltipContent.innerHTML = `
                            <div class="tt-title news" style="color: #f1c40f; font-weight:900; border-bottom:1px solid #333; margin-bottom:4px; text-align:center;">NEWS ALERT</div>
                            <div class="tt-row" style="display:flex; justify-content:center; color:#aaa; margin-bottom:4px;"><span class="tt-val" style="color:#fff; font-weight:bold;">${timeStr}</span></div>
                            <div class="tt-desc" style="font-size:10px; color:#fff; line-height:1.3;">${hoveredMarker.headline}</div>
                        `;
                    }

                    // FIXED POSITIONING ON BODY
                    const box = tooltip.getBoundingClientRect();
                    const tipW = box.width || 140;
                    const tipH = box.height || 80;

                    let tx = clientX + 15;
                    let ty = clientY - tipH - 10;

                    if(tx + tipW > window.innerWidth) tx = clientX - tipW - 15;
                    if(ty < 0) ty = clientY + 20;

                    tooltip.style.left = tx + 'px';
                    tooltip.style.top = ty + 'px';
                    return;
                }

                // 3. IF NO MARKER, SHOW CHART DATA (Fallback)
                if(crosshair) crosshair.classList.remove('hidden');
                if(hoverDot && settings.chart.style !== 'candle') hoverDot.classList.remove('hidden');

                // Standard Chart Logic
                const chartMouseX = mouseX - padding.left;
                let ratio = chartMouseX / availableWidth;
                if(ratio < 0) ratio = 0; if(ratio > 1) ratio = 1;
                const mouseTime = startTime + ratio * timeRange;

                if(!data || data.length === 0) return;
                const pt = data.reduce((prev, curr) => Math.abs(curr.timestamp - mouseTime) < Math.abs(prev.timestamp - mouseTime) ? curr : prev);
                const px = mapX(pt.timestamp);
                let py = mapY(pt[valueKey]);
                const isCandle = settings.chart.style === 'candle';
                if (!isCandle) {
                    const idx = data.findIndex(d => d.timestamp === pt.timestamp);
                    const fineIdx = idx * (2**settings.chart.interpolationPasses);
                    if (this.finalRenderPoints && this.finalRenderPoints[fineIdx]) py = this.finalRenderPoints[fineIdx].y;
                }

                crosshair.setAttribute('x1', px); crosshair.setAttribute('x2', px);
                if (hoverDot && !isCandle) {
                    hoverDot.style.left = `${px}px`;
                    hoverDot.style.top = `${py}px`;
                    let dotColor = primaryColor;
                    if (settings.chart.timeframe === '1d' && settings.chart.useExtendedColors) {
                          if (pt.timestamp < t930) dotColor = settings.chart.colorPreMarket;
                          else if (pt.timestamp >= t1600) dotColor = settings.chart.colorPostMarket;
                    }
                    hoverDot.style.backgroundColor = dotColor;
                }

                // Generate Standard Stats HTML
                const chg = pt[valueKey];
                const chgColor = chg >= 0 ? settings.chart.color : settings.chart.colorDown;
                const timeStr = settings.chart.timeframe === '1d' ?
                formatTimeET(pt.timestamp) : formatTimeET(pt.timestamp, {month:'numeric', day:'numeric', hour:'numeric', minute:'numeric'});

                tooltipContent.innerHTML = `
                    <div class="tooltip-box">
                        <div class="tooltip-row" style="display:flex; justify-content:space-between; margin-bottom:2px;"><span class="label" style="color:#8b949e;">Price:</span> <span class="value" style="color:#fff; font-weight:bold;">${pt.price.toFixed(2)}</span></div>
                        <div class="tooltip-row" style="display:flex; justify-content:space-between; margin-bottom:2px;"><span class="label" style="color:#8b949e;">Change:</span> <span class="value" style="color:${chgColor}; font-weight:bold;">${chg>0?'+':''}${chg.toFixed(2)}%</span></div>
                        <div class="tooltip-row" style="display:flex; justify-content:space-between; margin-bottom:2px;"><span class="label" style="color:#8b949e;">Volume:</span> <span class="value" style="color:#fff; font-weight:bold;">${pt.volume.toLocaleString()}</span></div>
                        <div class="tooltip-row" style="display:flex; justify-content:space-between; margin-bottom:2px;"><span class="label" style="color:${settings.chart.colorVWAP};">VWAP:</span> <span class="value" style="color:#fff; font-weight:bold;">${pt.vwap.toFixed(2)}</span></div>
                        <div class="tooltip-time" style="font-size:10px; color:#444; text-align:center; border-top:1px solid #222; margin-top:4px; padding-top:2px;">${timeStr}</div>
                    </div>
                `;

                // Fixed Positioning on Body
                const box = tooltip.getBoundingClientRect();
                const tipW = box.width || 120;
                const tipH = box.height || 80;

                let tx = clientX + 15;
                let ty = clientY - tipH - 10;

                if (tx + tipW > window.innerWidth) tx = clientX - tipW - 15;
                if (ty < 0) ty = clientY + 20;

                tooltip.style.left = tx + 'px';
                tooltip.style.top = ty + 'px';
            };

            // Clean listeners
            eventRect.onmousemove = (e) => {
                this.cursorCache.x = e.clientX;
                this.cursorCache.y = e.clientY;
                this.cursorCache.active = true;
                drawOverlay(e.clientX, e.clientY);
            };

            eventRect.onmouseleave = () => {
                this.cursorCache.active = false;
                tooltip.classList.add('hidden');
                tooltip.style.opacity = '0';
                tooltip.style.display = 'none';
                if(crosshair) crosshair.classList.add('hidden');
                if(hoverDot) hoverDot.classList.add('hidden');
                svg.querySelectorAll('.visual-circle').forEach(c => c.setAttribute('r', '9'));
            };
            // === CRITICAL FIX: IMMEDIATE RE-RENDER ===
            // If the cursor was active before the update, re-draw the overlay NOW.
            // This prevents the visual gap (flicker) between the SVG wipe and the next mousemove event.
            if (this.cursorCache.active) {
                drawOverlay(this.cursorCache.x, this.cursorCache.y);
            }
        }

        setLoading() { if (this.container) this.container.innerHTML = `<div class="fv-message">Loading Market Data...</div>`;
        }
        setMessage(message) { if (this.container) this.container.innerHTML = `<div class="fv-message">${message}</div>`;
        }
    }

    //==================================================================
    // 6. MAIN LOGIC
    //==================================================================
    function refreshChartData() {
        if (!currentTicker || isFetching) { return;
        }
        const wasHalted = chartWidget ? chartWidget.isCurrentlyHalted : false;
        const isNowHalted = recordHaltIfActive(currentTicker);
        if (chartWidget) {
            chartWidget.isCurrentlyHalted = isNowHalted;
            if (wasHalted !== isNowHalted) { loadAndDrawChart(currentTicker, true); return; }
        }
        loadAndDrawChart(currentTicker, true);
    }

    function startAutoRefresh() {
        if (refreshInterval) clearInterval(refreshInterval);
        const interval = (settings.chart.updateIntervalSeconds || 1) * 1000;
        refreshInterval = setInterval(refreshChartData, interval);
    }

    async function loadAndDrawChart(ticker, isRefresh = false) {
        if (!ticker || (isFetching && !isRefresh)) return;
        isFetching = true;
        currentTicker = ticker.toUpperCase();
        const isHalted = recordHaltIfActive(currentTicker);

        if (chartWidget && !isRefresh) chartWidget.setLoading();
        try {
            await fetchDataFromFinviz(currentTicker);
            if (chartWidget) {
                chartWidget.isCurrentlyHalted = isHalted;
                if (!isRefresh) {
                    chartWidget.create(currentTicker);
                    startAutoRefresh();
                    setTimeout(() => { if(chartWidget) chartWidget.update(); }, 500);
                    setTimeout(() => { if(chartWidget) chartWidget.update(); }, 1500);
                    setTimeout(() => { if(chartWidget) chartWidget.update(); }, 3000);
                }
                else { chartWidget.update();
                }
            }
        } catch (error) {
            console.error(error);
            if (chartWidget) chartWidget.setMessage(`<div class="fv-message error">${error}</div>`);
        } finally {
            isFetching = false;
        }
    }

    // --- SETUP LISTENERS ---
    function setupNewsObserver() {
        const newsContainer = document.getElementById('fv-details-news');
        if (newsContainer) {
            newsContainer.addEventListener('click', (e) => {
                 if (e.target.closest('.fv-news-item')) {
                      if (chartWidget) chartWidget.update();
                 }
            });
            if (newsObserver) newsObserver.disconnect();
            newsObserver = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                mutations.forEach(m => { if (m.addedNodes.length > 0) shouldUpdate = true; });
                if (shouldUpdate && chartWidget) {
                    chartWidget.update();
                }
            });
            newsObserver.observe(newsContainer, { childList: true, subtree: true });
        }
    }

    function injectFontAwesome() { GM_addStyle(GM_getResourceText('fontAwesomeCSS'));
    }

    function injectStyles() {
        GM_addStyle(`
            :root {
                --font-primary: 'Inter', 'Roboto Mono', system-ui, sans-serif;
                --bg-panel: rgba(18, 20, 24, 0.98);
                --bg-card: rgba(255, 255, 255, 0.03);
                --bg-input: rgba(0, 0, 0, 0.3);
                --border-color: rgba(255, 255, 255, 0.1);
                --accent-color: #26ff5e;
                --text-muted: #8b949e;
                --text-bright: #f0f6fc;
                --radius-lg: 12px;
                --radius-sm: 6px;
                --transition-fast: 0.15s ease;
            }

            @keyframes slideIn { from { opacity: 0; transform: translate(-50%, -48%) scale(0.98); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }

            #pro-chart-wrapper { position: relative; width: 100%; height: 100%; font-family: var(--font-primary); background-color: #131722;
            overflow: hidden; border-radius: 6px; }
            .fv-message { display: flex;
            align-items: center; justify-content: center; height: 100%; color: var(--text-muted); font-size: 12px; letter-spacing: 1px;
            }

            #pro-chart-settings-btn { position: absolute; top: 10px; right: 10px;
            z-index: 50; color: var(--text-muted); background: rgba(0,0,0,0.3); border: 1px solid transparent; border-radius: 4px; cursor: pointer; width: 28px; height: 28px;
            transition: all 0.2s; }
            #pro-chart-settings-btn:hover { color: var(--text-bright);
            border-color: var(--border-color); background: var(--bg-input); }

            #pro-chart-settings-backdrop { position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 999998; opacity: 0; pointer-events: none;
            transition: opacity 0.2s; }
            #pro-chart-settings-backdrop.active { opacity: 1;
            pointer-events: auto; }

            #pro-chart-settings-panel {
                position: fixed;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 800px; height: 550px;
                background: var(--bg-panel);
                border: 1px solid var(--border-color);
            box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
                border-radius: var(--radius-lg);
                z-index: 999999;
                display: flex; flex-direction: column; overflow: hidden;
            opacity: 0; pointer-events: none;
                font-family: var(--font-primary); font-size: 13px; color: var(--text-bright);
            }
            #pro-chart-settings-panel.active { opacity: 1; pointer-events: auto;
            animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

            .panel-header {
                display: flex;
            justify-content: space-between; align-items: center;
                padding: 15px 24px; border-bottom: 1px solid var(--border-color);
                font-weight: 600; font-size: 14px; letter-spacing: 0.5px;
                background: rgba(255,255,255,0.01);
            }
            #pro-chart-close-btn { background: none; border: none; color: var(--text-muted);
            font-size: 20px; cursor: pointer; transition: color 0.2s; }
            #pro-chart-close-btn:hover { color: var(--text-bright);
            }

            .panel-body { display: flex; flex: 1; overflow: hidden;
            }

            /* SIDEBAR */
            .panel-sidebar {
                width: 200px;
            background: rgba(0,0,0,0.2);
                border-right: 1px solid var(--border-color);
                padding: 20px 0; display: flex; flex-direction: column; gap: 4px;
            }
            .settings-tab {
                padding: 12px 24px;
            cursor: pointer; color: var(--text-muted);
                transition: all 0.2s; display: flex; align-items: center; gap: 12px;
                font-weight: 500; border-left: 3px solid transparent;
            }
            .settings-tab:hover { color: var(--text-bright); background: rgba(255,255,255,0.03);
            }
            .settings-tab.active {
                color: var(--accent-color);
            background: rgba(38, 255, 94, 0.08);
                border-left-color: var(--accent-color);
            }
            .settings-tab i { width: 18px;
            text-align: center; font-size: 14px; }

            /* CONTENT AREA */
            .panel-content {
                flex: 1;
            padding: 30px; overflow-y: auto;
                scrollbar-width: thin; scrollbar-color: var(--border-color) transparent;
            }
            .settings-page { display: none;
            animation: fadeIn 0.3s ease; }
            .settings-page.active { display: block;
            }
            @keyframes fadeIn { from { opacity: 0;
            transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            /* CARDS */
            .setting-card {
                background: var(--bg-card);
            border: 1px solid var(--border-color);
                border-radius: var(--radius-sm); padding: 20px; margin-bottom: 20px;
            }
            .setting-card-title {
                font-size: 11px;
            text-transform: uppercase; color: var(--text-muted);
                letter-spacing: 1.2px; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;
            }
            .color-section-header {
                font-size: 11px;
            color: #fff; font-weight: 600;
                margin: 20px 0 10px 0; letter-spacing: 0.5px;
            }

            /* GRIDS & LAYOUTS */
            .setting-grid-layout { display: grid;
            grid-template-columns: 1fr 1fr; gap: 20px; }
            .setting-color-grid { display: grid;
            grid-template-columns: repeat(3, 1fr); gap: 15px; }

            .setting-item { display: flex;
            flex-direction: column; gap: 8px; }
            .setting-item label { font-size: 12px;
            color: var(--text-muted); }

            /* COLOR ITEM STYLING (NEW) */
            .color-grid-item {
                background: rgba(0,0,0,0.2);
            border: 1px solid var(--border-color);
                border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 8px;
            }
            .color-label { font-size: 11px; color: #ccc;
            }
            .color-control-wrapper { display: flex; align-items: center; justify-content: space-between;
            }
            .trigger-pro-picker {
                width: 32px;
            height: 32px; border-radius: 50%; cursor: pointer;
                border: 2px solid #fff;
            /* WHITE BORDER AS REQUESTED */
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
            transition: transform 0.2s;
            }
            .trigger-pro-picker:hover { transform: scale(1.1);
            }
            .color-hex-display {
                width: 65px;
            background: transparent; border: none;
                color: var(--text-bright); font-family: monospace; font-size: 12px; text-align: right;
            }

            /* INPUTS */
            .styled-select {
                appearance: none;
            background: var(--bg-input); border: 1px solid var(--border-color);
                color: var(--text-bright); padding: 8px 12px; border-radius: 4px;
                font-family: inherit; font-size: 13px; width: 100%;
            cursor: pointer;
                transition: border-color var(--transition-fast);
                background-image: url('data:image/svg+xml;utf8,<svg fill="%238b949e" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
            background-repeat: no-repeat; background-position: right 8px center;
            }
            .styled-select:focus { outline: none;
            border-color: var(--accent-color); }

            /* TOGGLE SWITCHES */
            .toggle-row {
                display: flex;
            justify-content: space-between; align-items: center;
                padding: 4px 0;
            }
            .toggle-row.bordered-bottom { border-bottom: 1px solid var(--border-color);
            }
            .toggle-switch { position: relative; display: inline-block; width: 36px;
            height: 20px; }
            .toggle-switch input { opacity: 0;
            width: 0; height: 0; }
            .slider {
                position: absolute;
            cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: #333; transition: .4s; border-radius: 20px;
            }
            .slider:before {
                position: absolute;
            content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
                background-color: white; transition: .4s; border-radius: 50%;
            }
            input:checked + .slider { background-color: var(--accent-color);
            }
            input:checked + .slider:before { transform: translateX(16px);
            }

            /* PRO COLOR PICKER MODAL CSS */
            .cp-modal-backdrop { position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000000; display: flex; align-items: center; justify-content: center; opacity: 0;
            transition: opacity 0.2s; }
            .cp-modal-backdrop.visible { opacity: 1;
            }
            .cp-window { width: 560px; background: #1f1f1f;
            border: 1px solid #444; box-shadow: 0 10px 30px rgba(0,0,0,0.8); border-radius: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #fff;
            overflow: hidden; display: flex; flex-direction: column; }
            .cp-titlebar { display: flex;
            justify-content: space-between; align-items: center; padding: 8px 12px; background: #2d2d2d; border-bottom: 1px solid #000;
            }
            .cp-title { font-size: 14px; display: flex; align-items: center;
            gap: 8px; }
            .cp-close { cursor: pointer; font-size: 18px;
            color: #aaa; } .cp-close:hover { color: #fff; }
            .cp-body { display: flex;
            padding: 12px; gap: 12px; }

            .cp-col-left { display: flex;
            flex-direction: column; gap: 8px; width: 230px; }
            .cp-section-label { font-size: 12px;
            margin-bottom: 4px; color: #ccc; }
            .cp-grid-basic, .cp-grid-custom { display: grid;
            grid-template-columns: repeat(8, 1fr); gap: 4px; }
            .cp-swatch { width: 20px;
            height: 20px; border: 1px solid #555; cursor: pointer; } .cp-swatch:hover { border-color: #fff; transform: scale(1.1); z-index: 2;
            }
            .cp-btn-screen, .cp-btn-add { background: #333;
            border: 1px solid #555; color: #ddd; padding: 6px; font-size: 12px; cursor: pointer; width: 100%; margin-top: 5px; border-radius: 4px;
            } .cp-btn-screen:hover, .cp-btn-add:hover { background: #444; border-color: #777; }

            .cp-col-right { flex: 1;
            display: flex; flex-direction: column; gap: 12px; }
            .cp-spectrum-area { display: flex;
            height: 200px; gap: 10px; }
            .cp-sat-val-box { flex: 1;
            position: relative; background: linear-gradient(to bottom, transparent, #808080), linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            overflow: hidden; cursor: crosshair; border: 1px solid #555; }
            .cp-sat-grad { display:none;
            }

            .cp-cursor { position: absolute; width: 10px; height: 10px;
            border: 2px solid white; border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; box-shadow: 0 0 2px black;
            }

            .cp-hue-slider { width: 30px; position: relative; cursor: ns-resize;
            border: 1px solid #555; background: #fff; }
            .cp-hue-track { width: 100%;
            height: 100%; pointer-events: none; }
            .cp-hue-cursor { position: absolute;
            left: 0; width: 100%; height: 4px; background: transparent; border: 1px solid white; box-shadow: 0 0 2px black; transform: translateY(-50%);
            pointer-events: none; }

            .cp-controls-row { display: flex; gap: 10px;
            height: 85px; }
            .cp-preview-box { width: 70px;
            border: 1px solid #555; }
            .cp-inputs { flex: 1;
            display: flex; flex-direction: column; justify-content: space-between; }
            .cp-input-group { display: flex;
            align-items: center; justify-content: space-between; gap: 5px; font-size: 12px; }
            .cp-input-group label { width: 40px;
            text-align: right; color: #ccc; }
            .cp-input-group input { width: 45px;
            background: #333; border: 1px solid #555; color: #fff; padding: 2px 4px; text-align: center;
            }

            .cp-hex-row { display: flex; align-items: center; gap: 8px;
            margin-top: -5px; }
            .cp-hex-row label { font-size: 12px;
            color: #ccc; width: 40px; text-align: right; }
            .cp-in-hex { flex: 1;
            background: #333; border: 1px solid #555; color: #fff; padding: 4px; font-family: monospace;
            }

            .cp-actions { display: flex; justify-content: flex-end; gap: 10px;
            margin-top: 10px; }
            .cp-btn-ok, .cp-btn-cancel { width: 70px;
            padding: 6px; background: #333; border: 1px solid #555; color: #fff; cursor: pointer; border-radius: 4px;
            }
            .cp-btn-ok:hover { background: #444; border-color: #888;
            }
            .cp-btn-cancel:hover { background: #444;
            }

            /* SLIDERS (FIXED) */
            .slider-group { margin-bottom: 15px;
            }
            .slider-group label { display: flex; justify-content: space-between;
            font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
            .val-display { font-family: monospace;
            color: var(--text-bright); }
            input[type=range] {
                -webkit-appearance: none;
            width: 100%; background: #333; height: 4px; border-radius: 2px;
            }
            input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
            height: 14px; width: 14px; border-radius: 50%;
                background: var(--text-bright); margin-top: -5px; cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.5); transition: background 0.2s;
            }
            input[type=range]:focus::-webkit-slider-thumb { background: var(--accent-color);
            }
            input[type=range]:focus { outline: none;
            }

            /* CHART CSS */
            .custom-price-chart { display: block;
            position: absolute; top: 0; left: 0; }
            .custom-price-chart .positive { fill: #26ff5e !important;
            }
            .custom-price-chart .negative { fill: #ff2e2e !important;
            }
            .axis-label { font-size: 10px; fill: #555; user-select: none;
            }
            .grid-line.major { stroke: #333; stroke-width: 1px; opacity: 1.0;
            }
            .grid-line.minor { stroke: #2a2e39; stroke-width: 1px;
            stroke-dasharray: 2 2; opacity: 0.5; }
            .grid-line.zero-line { stroke: #444;
            stroke-dasharray: 4 4; opacity: 0.5; }
            .chart-border { fill: none;
            stroke: var(--border-color); }
            .chart-line { fill: none; stroke-width: 2px;
            stroke-linecap: round; stroke-linejoin: round; }
            .chart-header text { fill: #fff;
            dominant-baseline: middle; }
            .chart-header .header-ticker { font-size: 18px;
            font-weight: 700; }
            .chart-header .stat-label { font-size: 10px;
            fill: #666; font-weight: 600; text-transform: uppercase; }
            .chart-header .val { font-size: 11px;
            fill: #999; font-family: monospace; }
            .chart-header .header-price { font-size: 14px;
            font-weight: 700; }
            .chart-header .header-change { font-size: 12px;
            font-weight: 500; }
            .crosshair-guide { stroke: #666; stroke-width: 1px;
            stroke-dasharray: 4 4; pointer-events: none; }
            .crosshair-guide.hidden { display: none;
            }

            /* ADDED: Explicit pointer events for hover layer */
            .chart-event-rect { fill: transparent;
            cursor: crosshair; pointer-events: all; }

            /* TOOLTIP FIXED TO BODY */
            #fv-pro-global-tooltip {
                background: rgba(10, 12, 16, 0.95);
            border: 1px solid var(--border-color);
                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                border-radius: 4px;
                padding: 10px;
                font-size: 11px;
                pointer-events: none;
                opacity: 0;
            transition: opacity 0.1s;
                position: fixed; /* FIXED TO SCREEN */
                z-index: 2147483647;
            /* MAX Z-INDEX */
                min-width:140px;
            font-family: sans-serif;
                color: #fff;
            }
            #fv-pro-global-tooltip.visible { opacity: 1;
            }
            .tooltip-box { min-width: 120px;
            }

            /* MARKER GROUP - POINTER EVENTS NONE TO LET PHYSCIS ENGINE WORK */
            .halt-marker-group, .news-marker-group { pointer-events: none;
            }

            /* BOUNCY CIRCLE TRANSITION */
            .visual-circle { transition: r 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            #chart-icons-layer { position: absolute; top:0; left:0; width:100%; height:100%;
            pointer-events:none; z-index: 10; }
            .chart-icon-marker { position: absolute;
            font-size: 16px; opacity: 0.6; text-shadow: 0 0 10px rgba(0,0,0,0.8); }

            .live-dot { position: absolute;
            width: 6px; height: 6px; border-radius: 50%; pointer-events: none; transform: translate(-50%, -50%); transition: left 0.1s linear, top 0.1s linear; z-index: 20;
            }
            .hover-dot { position: absolute; width: 6px; height: 6px;
            border-radius: 50%; pointer-events: none; transform: translate(-50%, -50%); z-index: 21; border: 1px solid #fff; box-shadow: 0 0 5px rgba(255,255,255,0.5);
            }
            .live-dot.hidden, .hover-dot.hidden { display: none;
            }

            .fv-halt-overlay { position: absolute; top: 0; left: 0;
            width: 100%; height: 100%; z-index: 50; pointer-events: none; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); background: rgba(0,0,0,0.2);
            }
            .fv-halt-card { background: rgba(20, 20, 25, 0.85);
            border: 1px solid #e74c3c; border-radius: 8px; padding: 15px 30px; text-align: center; box-shadow: 0 0 20px rgba(231, 76, 60, 0.3);
            animation: pulse-red 2s infinite; }
            @keyframes pulse-red { 0% { box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
            } 50% { box-shadow: 0 0 25px rgba(231, 76, 60, 0.6);
            } 100% { box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
            } }
            .halt-icon { font-size: 24px; color: #e74c3c;
            margin-bottom: 5px; }
            .halt-text { font-size: 16px; font-weight: 800;
            color: #fff; letter-spacing: 1px; }
            .halt-sub { font-size: 11px;
            color: #aaa; text-transform: uppercase; margin-top: 2px; }
        `);
    }

    function initChartScript(node) {
        node.dataset.chartInitialized = 'true';
        chartWidget = new CustomChartWidget(node);
        const t = document.body.dataset.fvCurrentTicker;
        if (t && t !== 'Select a Ticker') loadAndDrawChart(t);
        else chartWidget.setMessage('Terminal Ready. Select Ticker.');
        setupNewsObserver();
        document.body.addEventListener('FVDashboard_TickerChanged', (e) => {
            const nt = e.detail.ticker;
            if(nt && nt.toUpperCase() !== currentTicker) { if(refreshInterval) clearInterval(refreshInterval); loadAndDrawChart(nt); }
        });
        new ResizeObserver(() => { if(chartWidget && currentTicker) setTimeout(() => chartWidget.update(), 50); }).observe(node);
    }

    // Init
    loadSettings(); injectStyles(); injectFontAwesome();
    const obs = new MutationObserver(() => {
        const node = document.getElementById('fv-details-chart');
        if(node && !node.dataset.chartInitialized) { initChartScript(node); }
        setupNewsObserver();
    });
    obs.observe(document.body, { childList: true, subtree: true });

})();