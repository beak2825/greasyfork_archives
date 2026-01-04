// ==UserScript==
// @name         eventsTracker
// @namespace    eventsTracker
// @version      4.8.5
// @description  Advanced Torn events countdown with multi-event display and alerts
// @author       stel [2672610]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557067/eventsTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/557067/eventsTracker.meta.js
// ==/UserScript==

/*
 * MIT License
 * 
 * Copyright (c) 2025 stel [2672610]
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
 * Inspired by "eventsTimer" by ljovcheg
 */

(function EventTimer() {
    'use strict';

    /* ==============================
       Configuration and Constants
       ============================== */

    const CONFIG = Object.freeze({
        RATE_LIMIT_MS: 650,
        CACHE_TTL: 1800 // seconds
    });

    const TIME = Object.freeze({
        SECOND: 1,
        MINUTE: 60,
        HOUR: 3600,
        DAY: 86400
    });

    const UI_TIMING = Object.freeze({
        API_TIMEOUT: 30000,
        REFRESH_GAP: 3000,
        LONG_PRESS_DURATION: 700,
        CLOCK_UPDATE_THROTTLE: 700
    });

    const STORAGE = Object.freeze({
        KEY: 'timer_api_key',
        EVENTS: 'events',
        UPDATED: 'updated',
        MODE: 'timer_mode',
        USER_START: 'userEventStartTime',
        SEEN_EVENTS: 'seen_events',
        LAST_CLEANUP: 'last_cleanup'
    });

    const EVENT_COLORS = Object.freeze({
        ACTIVE: '#ff5555',
        UPCOMING: '#ffdd44',
        FUTURE: '#ffffff'
    });

    const MESSAGES = Object.freeze({
        PROMPT_API_KEY: "Enter MINIMAL API key",
        CLICK_TO_INSERT_KEY: "Click → Enter MINIMAL API key",
        UPDATING: "Updating...",
        FORCE_REFRESH: "Force refresh...",
        API_ERROR: "API Error (key or network)",
        API_TIMEOUT: "Error: API timeout"
    });

    /* ==============================
       Styles
       ============================== */
    GM_addStyle(`
        #eventTimer {
            background:rgba(0,0,0,0.5);
            margin-top:6px;
            border-radius:5px;
            padding:6px;
            line-height:16px;
            font-size:11px;
            color:#fff;
            font-family:system-ui;
            -webkit-touch-callout:none;
            user-select:none;
        }
        /* Active event is recognizable only by red icon, no border */
        #eventTimer .currentEvent { }
        #eventTimerList { display:flex; flex-direction:column; gap:6px; }
        .eventT {
            display:flex;
            align-items:center;
            gap:4px;
            cursor:pointer;
            min-height:20px;
        }
        .hidden { display:none !important; }
        .eventT .icon {
            width:32px;
            height:15px;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-shrink:0;
        }
        .eventT .icon img,
        .eventT .icon .placeholder {
            width:32px;
            height:15px;
            display:block;
            object-fit:contain;
            pointer-events:none;
            text-align:center;
            font-size:10px;
            line-height:15px;
        }
        .eventT .name {
            display:none;
            font-weight:600;
            text-align:center;
            flex:1;
        }
        .eventT .time {
            flex:1;
            font-weight:bold;
            user-select:none;
            white-space:nowrap;
            /* Flex layout for icon mode (simpler) */
            display:flex;
            align-items:center;
            justify-content:center;
            gap:8px;
        }
        .eventT .time .label {
            font-weight:normal;
            opacity:0.8;
            font-size:11px;
            /* No fixed width - let it be natural to avoid overflow */
        }
        .eventT .time .timer {
            display:inline-block;
            width:11ch;
            text-align:left;
            /* No special styling in icon mode */
        }
        /* Grid layout ONLY for name mode (more space available) */
        .eventT.show-name .time {
            display:grid;
            grid-template-columns: 1fr auto auto 1fr;
            gap:4px;
            align-items:center;
        }
        .eventT.show-name .time .label {
            grid-column:2;
            text-align:right;
            width:60px;  /* Fixed width to prevent shifting when timer changes */
        }
        .eventT.show-name .time .timer {
            grid-column:3;
            text-align:left;
            min-width:80px;  /* Ensure consistent spacing */
        }
        .eventT.show-name { flex-direction:column; gap:4px; }
        .eventT.show-name .icon { display:none; }
        .eventT.show-name .name { display:block; }
        /* Animations */
        @keyframes flashRed { 0%,100%{fill:#888;} 50%{fill:#ff5555;} }
        @keyframes flashYellow { 0%,100%{fill:#888;} 50%{fill:#ffdd44;} }
        @keyframes pulseIcon { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .tc-clock.flash-red svg path { animation: flashRed 0.8s ease-out 5; }
        .tc-clock.flash-yellow svg path { animation: flashYellow 0.8s ease-out 5; }
        /* Icon pulse when event ending soon (<1 hour) */
        .eventT.ending-soon .icon img {
            animation: pulseIcon 1.5s ease-in-out infinite;
        }
        /* Name pulse in name mode when event ending soon */
        .eventT.show-name.ending-soon .name {
            animation: pulseIcon 1.5s ease-in-out infinite;
        }
    `);

    /* ==============================
       Utility functions
       ============================== */

    function getFirstWeekdayOfMonth(year, month, weekday) {
        const first = new Date(Date.UTC(year, month, 1));
        const firstDay = first.getUTCDay();
        return 1 + ((weekday - firstDay + 7) % 7);
    }

    function getNthWeekdayOfMonth(year, month, weekday, n) {
        const first = getFirstWeekdayOfMonth(year, month, weekday);
        return first + (n - 1) * 7;
    }

    function getEasterSunday(year) {
        // Meeus/Jones/Butcher
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return Date.UTC(year, month - 1, day);
    }

    function getTornServerTime() {
        // Reads ".server-date-time" → "HH:MM:SS - DD/MM/YY"
        const el = DOMCache.get('serverTime', '.server-date-time');
        if (!el) return null;
        const text = el.textContent.trim();
        const match = text.match(/(\d{2}):(\d{2}):(\d{2})\s*-\s*(\d{2})\/(\d{2})\/(\d{2})/);
        if (!match) return null;
        const [, h, m, s, d, mo, y] = match;
        const year = 2000 + parseInt(y, 10);
        const month = parseInt(mo, 10) - 1;
        const day = parseInt(d, 10);
        const hour = parseInt(h, 10);
        const minute = parseInt(m, 10);
        const second = parseInt(s, 10);
        return Math.floor(Date.UTC(year, month, day, hour, minute, second) / 1000);
    }

    const Util = {
        nowSec: () => {
            const st = getTornServerTime();
            return st !== null ? st : Math.floor(Date.now() / 1000);
        },
        wait: (ms) => new Promise(r => setTimeout(r, ms)),
        safeParseJSON: (text) => {
            try { return JSON.parse(text); } catch { return null; }
        },
        formatTime: (s) => {
            if (!Number.isFinite(s) || s <= 0) return "0 sec";
            let rem = Math.floor(s);
            const d = Math.floor(rem / TIME.DAY); rem %= TIME.DAY;
            const h = Math.floor(rem / TIME.HOUR); rem %= TIME.HOUR;
            const m = Math.floor(rem / TIME.MINUTE); rem %= TIME.MINUTE;
            // If day count has two digits (≥10), hide seconds to prevent UI overflow
            return d > 9
                ? `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`
                : (
                    d
                         ? `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${rem.toString().padStart(2,'0')}`
                        : `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${rem.toString().padStart(2,'0')}`
      );

        },
        normalize: (str) => {
            // Normalize event names for robust fuzzy matching
            // Handles: punctuation, years, duplicate words (typos)
            // Examples:
            //   "CaffeineCon 2025" → "caffeinecon"
            //   "St. Patrick's Day" → "stpatricksday"
            //   "Awareness Awareness Week" → "awarenessweek"
            return str.toLowerCase()
                      .replace(/\s+20\d{2}$/i, '')           // Remove trailing year (2024, 2025, etc.)
                      .replace(/\b(\w+)\s+\1\b/gi, '$1')     // Remove duplicate consecutive words
                      .replace(/[^a-z0-9]/g, '');            // Remove all non-alphanumeric
        }
    };

    /* ==============================
       Storage wrapper
       ============================== */

    const Store = {
        get: (k, def = null) => GM_getValue(k, def),
        set: (k, v) => GM_setValue(k, v)
    };

    /* ==============================
       DOM Cache
       ============================== */

    const DOMCache = (() => {
        const cache = {};
        
        return {
            get: (key, selector) => {
                if (!cache[key]) {
                    cache[key] = document.querySelector(selector);
                }
                return cache[key];
            },
            clear: (key) => {
                if (key) {
                    delete cache[key];
                } else {
                    Object.keys(cache).forEach(k => delete cache[k]);
                }
            }
        };
    })();

    /* ==============================
       Icons and helpers
       ============================== */

    const iconColor = '#fff';
    const w = 1.2;

    const EventIcons = {
        "awareness week": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${iconColor}' stroke-width='${w}'><path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0'/><path d='M21 12c-2.4 4-5.4 6-9 6c-3.6 0-6.6-2-9 6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6'/></svg>`,
        "weekend road trip": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="${iconColor}" stroke-width="${w}" d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4"/></svg>`,
        "valentine's day": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke='${iconColor}' stroke-width='${w}' d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/></svg>`,
        "black friday": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><g stroke="${iconColor}" stroke-width="${w}"><path d="M17.5 5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/><path d="M2.774 11.144c-1.003 1.12-1.024 2.81-.104 4a34 34 0 0 0 6.186 6.186c1.19.92 2.88.899 4-.104a92 92 0 0 0 8.516-8.698a1.95 1.95 0 0 0 .47-1.094c.164-1.796.503-6.97-.902-8.374s-6.578-1.066-8.374-.901a1.95 1.95 0 0 0-1.094.47a92 92 0 0 0-8.698 8.515"/><path d="M13.788 12.367c.022-.402.134-1.135-.476-1.693m0 0a2.3 2.3 0 0 0-.797-.451c-1.257-.443-2.8 1.039-1.708 2.396c.587.73 1.04.954.996 1.782c-.03.582-.602 1.191-1.356 1.423c-.655.202-1.378-.065-1.835-.576c-.559-.624-.502-1.212-.507-1.468m5.208-3.106L14 9.986m-5.34 5.34l-.653.653"/></g></svg>`,
        "torn anniversary": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><g fill="none" stroke="${iconColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${w}"><path d="M3 20h18v-8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8z"/><path d="M3 14.803A2.4 2.4 0 0 0 4 15a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35.007.692-.062 1-.197M12 4l1.465 1.638a2 2 0 1 1-3.015.099L12 4z"/></g></svg>`,
        "christmas town": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><g stroke="${iconColor}" stroke-width="${w}"><path d="m10 4l2 1l2-1"/><path d="M12 2v6.5l3 1.72m2.928-3.952l.134 2.232l1.866 1.232"/><path d="m20.66 7l-5.629 3.25l.01 3.458m4.887.56L18.062 15.5l-.134 2.232"/><path d="m20.66 17l-5.629-3.25l-2.99 1.738M14 20l-2-1l-2 1"/><path d="M12 22v-6.5l-3-1.72m-2.928 3.952L5.938 15.5l-1.866-1.232"/><path d="m3.34 17l5.629-3.25l-.01-3.458m-4.887-.56L5.938 8.5l.134-2.232"/><path d="m3.34 7l5.629 3.25l2.99-1.738"/></g></svg>`,
        "elimination": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="${w}"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/><path d="M8 12l2 2 4-4"/></svg>`,
        "other": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="${w}"><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1"/></svg>`
    };

    const IconKeys = Object.keys(EventIcons);
    const ColoredSvgCache = new Map();

    function getSvgForKey(key) {
        const match = IconKeys.find(k => key.includes(k));
        return EventIcons[match] || EventIcons.other;
    }

    function toDataUriBase64(svg) {
        try {
            const b64 = typeof btoa === 'function'
                ? btoa(unescape(encodeURIComponent(svg)))
                : window.btoa(unescape(encodeURIComponent(svg)));
            return `data:image/svg+xml;base64,${b64}`;
        } catch (e) {
            return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        }
    }

    function colorizeSvg(svg, color) {
        if (!color) return svg;
        return svg.replace(/#fff/gi, color);
    }

    function getColoredSvg(key, color) {
        // Cache key combines event key + color
        const cacheKey = `${key}_${color}`;
        
        // Return cached data URI if exists
        if (ColoredSvgCache.has(cacheKey)) {
            return ColoredSvgCache.get(cacheKey);
        }
        
        // Generate: base SVG → colorize → convert to data URI → cache
        const baseSvg = getSvgForKey(key);
        const coloredSvg = colorizeSvg(baseSvg, color);
        const dataUri = toDataUriBase64(coloredSvg);
        
        ColoredSvgCache.set(cacheKey, dataUri);
        return dataUri;
    }

    /* ==============================
       API helper (rate-limited queue)
       ============================== */

    const Api = (() => {
        let queue = [];
        let processing = false;
        let lastRequest = 0;
        let apiKey = Store.get(STORAGE.KEY, '');

        const setKey = (k) => {
            apiKey = (k || '').trim();
            Store.set(STORAGE.KEY, apiKey);
        };

        const call = (page) => {
            if (!apiKey) return Promise.reject(new Error('No API key'));
            const url = `https://api.torn.com/v2/${page === 'torn' ? 'torn' : 'user'}/calendar?key=${apiKey}`;
            return new Promise((resolve, reject) => {
                queue.push({ url, resolve, reject });
                if (!processing) processQueue();
            });
        };

        async function processQueue() {
            processing = true;
            while (queue.length) {
                const job = queue.shift();
                const delay = CONFIG.RATE_LIMIT_MS - (Date.now() - lastRequest);
                if (delay > 0) await Util.wait(delay);

                try {
                    const resp = await new Promise((res, rej) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: job.url,
                            onload: (r) => res(r),
                            onerror: (err) => rej(err),
                            ontimeout: (err) => rej(err)
                        });
                    });

                    const parsed = Util.safeParseJSON(resp.responseText);
                    if (!parsed) { job.reject(new Error("Invalid API response")); continue; }
                    if (parsed.error) { job.reject(new Error(`API Error: ${parsed.error.error}`)); continue; }

                    lastRequest = Date.now();
                    job.resolve(parsed);
                } catch (e) {
                    job.reject(e);
                }
            }
            processing = false;
        }

        return { call, setKey };
    })();

    /* ==============================
       Event rules and resolver
       ============================== */

    const EVENT_RULES = {
        "awareness week": {
            name: "Awareness Awareness Week",
            estimate: (year) => ({ start: Date.UTC(year, 0, 15) / 1000, end: Date.UTC(year, 0, 21, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 0
        },
        "weekend road trip": {
            name: "Weekend Road Trip",
            estimate: (year) => ({ start: Date.UTC(year, 1, 2) / 1000, end: Date.UTC(year, 1, 4, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 1
        },
        "valentine's day": {
            name: "Valentine's Day",
            estimate: (year) => ({ start: Date.UTC(year, 1, 13) / 1000, end: Date.UTC(year, 1, 15, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 1
        },
        "employee appreciation day": {
            name: "Employee Appreciation Day",
            estimate: (year) => {
                const day = getFirstWeekdayOfMonth(year, 2, 5);
                const start = Date.UTC(year, 2, day);
                return { start: start / 1000, end: (start + TIME.DAY * 1000) / 1000 };
            },
            plausible: (ev) => {
                const d = new Date(ev.start * 1000);
                return d.getUTCMonth() === 2 && d.getUTCDay() === 5;
            }
        },
        "st. patrick's day": {
            name: "St Patrick's Day",
            estimate: (year) => ({ start: Date.UTC(year, 2, 16) / 1000, end: Date.UTC(year, 2, 18, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 2
        },
        "easter egg hunt": {
            name: "Easter Egg Hunt",
            estimate: (year) => {
                const easter = getEasterSunday(year);
                const start = easter - 3 * TIME.DAY * 1000;
                const end = easter + 3 * TIME.DAY * 1000 + 86399 * 1000;
                return { start: Math.floor(start / 1000), end: Math.floor(end / 1000) };
            },
            plausible: (ev) => {
                const start = new Date(ev.start * 1000);
                const month = start.getUTCMonth();
                const durationDays = Math.round((ev.end - ev.start) / TIME.DAY);
                return (month === 2 || month === 3) && durationDays >= 6 && durationDays <= 8;
            }
        },
        "420 day": {
            name: "420 Day",
            estimate: (year) => ({ start: Date.UTC(year, 3, 19) / 1000, end: Date.UTC(year, 3, 21, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 3
        },
        "museum day": {
            name: "Museum Day",
            estimate: (year) => ({ start: Date.UTC(year, 4, 17) / 1000, end: Date.UTC(year, 4, 19, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 4
        },
        "world blood donor day": {
            name: "World Blood Donor Day",
            estimate: (year) => ({ start: Date.UTC(year, 5, 13) / 1000, end: Date.UTC(year, 5, 15, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 5
        },
        "world population day": {
            name: "World Population Day",
            estimate: (year) => ({ start: Date.UTC(year, 6, 10) / 1000, end: Date.UTC(year, 6, 12, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 6
        },
        "world tiger day": {
            name: "World Tiger Day",
            estimate: (year) => ({ start: Date.UTC(year, 6, 28) / 1000, end: Date.UTC(year, 6, 30, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 6
        },
        "international beer day": {
            name: "International Beer Day",
            estimate: (year) => {
                const day = getFirstWeekdayOfMonth(year, 7, 5);
                const start = Date.UTC(year, 7, day);
                return { start: start / 1000, end: (start + TIME.DAY * 1000) / 1000 };
            },
            plausible: (ev) => {
                const d = new Date(ev.start * 1000);
                return d.getUTCMonth() === 7 && d.getUTCDay() === 5;
            }
        },
        "tourism day": {
            name: "Tourism Day",
            estimate: (year) => ({ start: Date.UTC(year, 8, 26) / 1000, end: Date.UTC(year, 8, 28, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 8
        },
        "caffeinecon": {
            name: "CaffeineCon",
            estimate: (year) => ({ start: Date.UTC(year, 9, 14) / 1000, end: Date.UTC(year, 9, 16, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 9
        },
        "trick or treat": {
            name: "Trick or Treat",
            estimate: (year) => ({ start: Date.UTC(year, 9, 25) / 1000, end: Date.UTC(year, 10, 1, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 9
        },
        "world diabetes day": {
            name: "World Diabetes Day",
            estimate: (year) => ({ start: Date.UTC(year, 10, 13) / 1000, end: Date.UTC(year, 10, 15, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 10
        },
        "black friday": {
            name: "Black Friday",
            estimate: (year) => {
                const thanksgivingDay = getNthWeekdayOfMonth(year, 10, 4, 4);
                const thanksgiving = Date.UTC(year, 10, thanksgivingDay);
                const blackFriday = thanksgiving + TIME.DAY * 1000;
                return { start: Math.floor(blackFriday / 1000), end: Math.floor((blackFriday + TIME.DAY * 1000) / 1000) };
            },
            plausible: (ev) => {
                const d = new Date(ev.start * 1000);
                return d.getUTCMonth() === 10 && d.getUTCDay() === 5 && d.getUTCDate() >= 20;
            }
        },
        "torn anniversary": {
            name: "Torn Anniversary",
            estimate: (year) => ({ start: Date.UTC(year, 10, 15) / 1000, end: Date.UTC(year, 10, 16, 23, 59, 59) / 1000 }),
            plausible: (ev) => {
                const d = new Date(ev.start * 1000);
                return d.getUTCMonth() === 10 && d.getUTCDate() === 15;
            }
        },
        "slash wednesday": {
            name: "Slash Wednesday",
            estimate: (year) => ({ start: Date.UTC(year, 11, 10) / 1000, end: Date.UTC(year, 11, 12, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 11
        },
        "christmas town": {
            name: "Christmas Town",
            estimate: (year) => ({ start: Date.UTC(year, 11, 19) / 1000, end: Date.UTC(year, 11, 31, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 11
        },
        "elimination": {
            name: "Elimination",
            estimate: (year) => ({ start: Date.UTC(year, 11, 5) / 1000, end: Date.UTC(year, 11, 18, 23, 59, 59) / 1000 }),
            plausible: (ev) => new Date(ev.start * 1000).getUTCMonth() === 11
        }
    };

    const TRACKED_EVENTS = Object.keys(EVENT_RULES);

    // Events that use user-specific start time (from API user/calendar)
    const EVENTS_WITH_USER_TIME = [
        "weekend road trip",
        "valentine's day",
        "st. patrick's day",
        "easter egg hunt",
        "420 day",
        "museum day",
        "world blood donor day",
        "world population day",
        "world tiger day",
        "international beer day",
        "tourism day",
        "caffeinecon",
        "trick or treat",
        "world diabetes day",
        "slash wednesday",
        "christmas town"
    ];

    function resolveEventDate(eventKey, apiEvents, currentTimestamp, userStartTime) {
        const rule = EVENT_RULES[eventKey];
        const currentYear = new Date(currentTimestamp * 1000).getUTCFullYear();
        let resolved = { title: rule.name, ...rule.estimate(currentYear), source: 'ESTIMATED' };

        // Fuzzy match API event using normalized names (handles punctuation variations)
        const ruleNormalized = Util.normalize(rule.name);
        const apiMatch = apiEvents.find(e => 
            Util.normalize(e.title || e.name || '') === ruleNormalized
        );
        
        if (apiMatch && apiMatch.start > 0) {
            const eventFromApi = { start: apiMatch.start, end: apiMatch.end };
            if (rule.plausible(eventFromApi)) {
                resolved = { title: apiMatch.title || apiMatch.name, start: apiMatch.start, end: apiMatch.end, source: 'API' };
            }
        }

        // Apply user start time ONLY to specific events
        if (userStartTime && EVENTS_WITH_USER_TIME.includes(eventKey)) {
            const [h, m] = userStartTime.split(':').map(Number);
            const fix = (ts) => {
                const d = new Date(ts * 1000);
                d.setUTCHours(h, m, 0, 0);
                return Math.floor(d.getTime() / 1000);
            };
            resolved.start = fix(resolved.start);
            resolved.end = fix(resolved.end);
        }

        return resolved;
    }

    /* ==============================
       Selection and cache
       ============================== */

    let events = [];
    let primary = null;
    let secondary = null;
    let userStart = Store.get(STORAGE.USER_START, null);
    let loading = false;

    function computeDiffs(ev, now = null) {
        const n = (now === null) ? Util.nowSec() : now;
        return { startDiff: ev.start - n, endDiff: ev.end - n };
    }

    function findNearest() {
        const now = Util.nowSec();
        const enriched = events.map(e => ({ ...e, ...computeDiffs(e, now) }));
        const future = enriched.filter(e => e.endDiff >= 0);

        if (future.length === 0) {
            primary = null;
            secondary = null;
            return;
        }

        const active = future.filter(e => e.startDiff <= 0 && e.endDiff >= 0);
        const upcoming = future.filter(e => e.startDiff > 0);

        // Two or more events active simultaneously
        if (active.length >= 2) {
            const result = selectFromMultipleActive(active);
            primary = result.primary;
            secondary = result.secondary;
        } 
        // Only one active event
        else if (active.length === 1) {
            const result = selectActiveWithUpcoming(active[0], upcoming);
            primary = result.primary;
            secondary = result.secondary;
        } 
        // No active events, only future ones
        else {
            const result = selectFromUpcoming(upcoming);
            primary = result.primary;
            secondary = result.secondary;
        }
    }

    function selectFromMultipleActive(activeEvents) {
        // Sort by closest end time
        const sorted = activeEvents.slice().sort((a, b) => a.endDiff - b.endDiff);
        return { primary: sorted[0], secondary: sorted[1] };
    }

    function selectActiveWithUpcoming(activeEvent, upcomingEvents) {
        // One active event + one upcoming within 7 days
        const soon = upcomingEvents
            .slice()
            .sort((a, b) => a.startDiff - b.startDiff)
            .find(e => e.startDiff < 7 * TIME.DAY);
        
        return { primary: activeEvent, secondary: soon || null };
    }

    function selectFromUpcoming(upcomingEvents) {
        // Sort by start time
        const sorted = upcomingEvents.slice().sort((a, b) => a.startDiff - b.startDiff);
        
        // Always show the nearest upcoming event as primary
        const nearestEvent = sorted[0] || null;
        
        // Show second upcoming event if it starts within 7 days of the first
        let secondEvent = null;
        if (sorted.length >= 2) {
            const timeDiffBetweenEvents = sorted[1].start - sorted[0].start;
            if (timeDiffBetweenEvents < 7 * TIME.DAY) {
                secondEvent = sorted[1];
            }
        }
        
        return { primary: nearestEvent, secondary: secondEvent };
    }

    function loadCache() {
        const cachedEvents = Store.get(STORAGE.EVENTS, null);
        const updatedTs = Store.get(STORAGE.UPDATED, 0);
        if (!Array.isArray(cachedEvents) || !cachedEvents.length) return false;
        if (Util.nowSec() - updatedTs > CONFIG.CACHE_TTL) return false;

        events = cachedEvents.slice();
        findNearest();
        return true;
    }

    /* ==============================
       Flash management (clock blinking)
       ============================== */

    const Flash = (() => {
        const SEEN_CLEANUP_DAYS = 30;

        function getSeenEvents() {
            return Store.get(STORAGE.SEEN_EVENTS, {});
        }

        function setSeenEvents(seen) {
            Store.set(STORAGE.SEEN_EVENTS, seen);
        }

        function cleanupOldSeen() {
            const seen = getSeenEvents();
            const now = Util.nowSec();
            const cutoff = now - (SEEN_CLEANUP_DAYS * TIME.DAY);
            
            const cleaned = {};
            for (const [key, timestamp] of Object.entries(seen)) {
                if (timestamp > cutoff) {
                    cleaned[key] = timestamp;
                }
            }
            
            if (Object.keys(cleaned).length !== Object.keys(seen).length) {
                setSeenEvents(cleaned);
            }
        }

        function getEventKey(event) {
            if (!event) return null;
            // Use title + start timestamp to uniquely identify
            return `${event.title || event.name}_${event.start}`;
        }

        function isEventSeen(event) {
            if (!event) return true;
            const seen = getSeenEvents();
            const key = getEventKey(event);
            return key in seen;
        }

        function markEventAsSeen(event) {
            if (!event) return;
            const seen = getSeenEvents();
            const key = getEventKey(event);
            seen[key] = Util.nowSec();
            setSeenEvents(seen);
        }

        function getEventColor(event) {
            if (!event) return null;
            const now = Util.nowSec();
            const diffs = computeDiffs(event, now);
            const active = diffs.startDiff <= 0 && diffs.endDiff >= 0;
            
            if (active) return 'red';
            if (diffs.startDiff > 0 && diffs.startDiff < 7 * TIME.DAY) return 'yellow';
            return null;
        }

        function determineFlashColor() {
            // Priority: RED (active event) > YELLOW (upcoming event)
            const primaryColor = getEventColor(primary);
            const secondaryColor = getEventColor(secondary);

            // If primary is red (active) and not seen → flash red
            if (primaryColor === 'red' && !isEventSeen(primary)) {
                return 'red';
            }

            // If secondary is yellow (upcoming <7d) and not seen → flash yellow
            if (secondaryColor === 'yellow' && !isEventSeen(secondary)) {
                return 'yellow';
            }

            // If primary is yellow and not seen → flash yellow
            if (primaryColor === 'yellow' && !isEventSeen(primary)) {
                return 'yellow';
            }

            return null;
        }

        function applyFlash() {
            const clockEl = DOMCache.get('clock', '.tc-clock');
            if (!clockEl) return;

            const flashColor = determineFlashColor();
            
            // Remove all existing flash classes
            clockEl.classList.remove('flash-red', 'flash-yellow');

            // Apply new flash if needed
            if (flashColor === 'red') {
                clockEl.classList.add('flash-red');
            } else if (flashColor === 'yellow') {
                clockEl.classList.add('flash-yellow');
            }
        }

        function stopFlash() {
            const clockEl = DOMCache.get('clock', '.tc-clock');
            if (!clockEl) return;
            
            clockEl.classList.remove('flash-red', 'flash-yellow');
        }

        function markVisibleEventsAsSeen() {
            // Mark visible events with color as seen
            if (primary && getEventColor(primary)) {
                markEventAsSeen(primary);
            }
            if (secondary && getEventColor(secondary)) {
                markEventAsSeen(secondary);
            }
            
            stopFlash();
            cleanupOldSeen();
        }

        return {
            applyFlash,
            stopFlash,
            markVisibleEventsAsSeen,
            cleanupOldSeen
        };
    })();

    /* ==============================
       UI module (DOM-driven, idempotent)
       ============================== */

    const UI = (() => {
        let root = null;
        let msg = null;
        let list = null;
        let lastServerText = '';
        let lastClockUpdate = 0;

        function getEventsToShow() {
            return [primary, secondary].filter(Boolean).slice(0, 2);
        }

        function setEventIcon(iconWrap, dataUri) {
            let iconImg = iconWrap.querySelector('img');
            try {
                if (!iconImg) {
                    iconWrap.querySelectorAll('.placeholder').forEach(n => n.remove());
                    iconImg = document.createElement('img');
                    iconImg.alt = 'icon';
                    iconWrap.appendChild(iconImg);
                }
                iconImg.src = dataUri;
            } catch (e) {
                if (iconImg) iconImg.remove();
                if (!iconWrap.querySelector('.placeholder')) {
                    const ph = document.createElement('div');
                    ph.className = 'placeholder';
                    ph.textContent = 'icon';
                    iconWrap.appendChild(ph);
                }
            }
        }

        function applyDisplayMode(row, mode) {
            if (mode === 'name') {
                row.classList.add('show-name');
            } else {
                row.classList.remove('show-name');
            }
        }

        function ensure() {
            if (root) return true;
            const tooltip = DOMCache.get('tooltip', '.tc-clock-tooltip');
            if (!tooltip) return false;

            root = document.createElement('div');
            root.id = 'eventTimer';

            msg = document.createElement('div');
            msg.id = 'eventTimerMsg';
            msg.classList.add('hidden');
            root.appendChild(msg);

            list = document.createElement('div');
            list.id = 'eventTimerList';
            root.appendChild(list);

            tooltip.appendChild(root);

            // Observe tooltip open/close to manage flash
            setupTooltipObserver(tooltip);

            // Click handler on message (for API key input)
            msg.addEventListener('click', () => {
                editKey();
            });

            // Click handler on list
            list.addEventListener('click', (e) => {
                const row = e.target.closest('.eventT');
                if (!row) return;
                if (e.target.closest('.time')) {
                    editKey();
                    return;
                }
                const mode = Store.get(STORAGE.MODE, 'icon');
                Store.set(STORAGE.MODE, mode === 'icon' ? 'name' : 'icon');
                update();
            });

            // Long press on time → forced refresh
            let lpTimer = null;
            let lastRefresh = 0;
            root.addEventListener('pointerdown', (e) => {
                const el = e.target.closest('.time');
                if (!el) return;
                lpTimer = setTimeout(() => {
                    const now = Date.now();
                    if (now - lastRefresh < UI_TIMING.REFRESH_GAP) return;
                    lastRefresh = now;
                    showMessage(MESSAGES.FORCE_REFRESH);
                    const t = setTimeout(() => showMessage(MESSAGES.API_TIMEOUT, true), UI_TIMING.API_TIMEOUT);
                    Load.loadData().finally(() => {
                        clearTimeout(t);
                        setTimeout(() => hideMessage(), 1600);
                    });
                }, UI_TIMING.LONG_PRESS_DURATION);
            });
            ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev =>
                root.addEventListener(ev, () => clearTimeout(lpTimer))
            );

            // If events were already calculated with clock closed, draw immediately
            if (primary || secondary) {
                update();
            }

            return true;
        }

        function setupTooltipObserver(tooltip) {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isHidden = tooltip.classList.contains('hide___sxEtd');
                        
                        if (!isHidden) {
                            // Tooltip opened → mark events as seen and stop flash
                            Flash.markVisibleEventsAsSeen();
                        } else {
                            // Tooltip closed → check if flash is needed
                            Flash.applyFlash();
                        }
                    }
                }
            });

            observer.observe(tooltip, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        function createRowElement() {
            const row = document.createElement('div');
            row.className = 'eventT';
            const iconWrap = document.createElement('div');
            iconWrap.className = 'icon';
            const img = document.createElement('img');
            img.alt = 'icon';
            iconWrap.appendChild(img);
            row.appendChild(iconWrap);
            const name = document.createElement('div');
            name.className = 'name';
            row.appendChild(name);
            const time = document.createElement('div');
            time.className = 'time';
            // Add label and timer spans
            const label = document.createElement('span');
            label.className = 'label';
            const timer = document.createElement('span');
            timer.className = 'timer';
            time.appendChild(label);
            time.appendChild(timer);
            row.appendChild(time);
            return row;
        }

        function editKey() {
            const k = prompt(MESSAGES.PROMPT_API_KEY, Store.get(STORAGE.KEY, ''));
            if (k !== null) {
                Api.setKey(k);
                Store.set(STORAGE.UPDATED, 0);
                showMessage(MESSAGES.UPDATING);
                Load.loadData().finally(() => {
                    setTimeout(() => hideMessage(), 1200);
                });
            }
        }

        function showMessage(text, error = false) {
            if (!ensure()) return;
            msg.textContent = text;
            msg.style.color = error ? 'red' : '';
            msg.classList.remove('hidden');
        }

        function hideMessage() {
            if (msg) msg.classList.add('hidden');
        }

        function clearList() {
            if (!list) return;
            while (list.firstChild) list.removeChild(list.firstChild);
        }

        function renderEvents(primaryEvent, secondaryEvent) {
            if (!ensure()) return;
            const eventsToShow = getEventsToShow();
            clearList();
            if (eventsToShow.length === 0) return;

            // Create ALL necessary rows BEFORE updating them
            eventsToShow.forEach((ev, i) => {
                const row = createRowElement();
                row.classList.add(i === 0 ? 'primary' : 'secondary');
                list.appendChild(row);
            });

            // NOW update the content without recreating
            updateRenderedEvents(eventsToShow);
        }

        function updateRenderedEvents(eventsToShow = null) {
            if (!ensure()) return;
            const now = Util.nowSec();
            const toShow = eventsToShow || getEventsToShow();
            const rows = Array.from(list.querySelectorAll('.eventT'));
            
            // Read display mode once (used for both labels and applyDisplayMode)
            const mode = Store.get(STORAGE.MODE, 'icon');

            rows.forEach((row, i) => {
                const ev = toShow[i];
                if (!ev) {
                    row.classList.add('hidden');
                    return;
                }
                row.classList.remove('hidden');

                const iconWrap = row.querySelector('.icon');
                const nameEl = row.querySelector('.name');
                const timeEl = row.querySelector('.time');

                const diffs = computeDiffs(ev, now);
                const remaining = diffs.startDiff > 0 ? diffs.startDiff : diffs.endDiff;
                const active = diffs.startDiff <= 0 && diffs.endDiff >= 0;

                // Determine icon color based on state
                let iconColorForEvent = EVENT_COLORS.FUTURE;
                if (active) {
                    iconColorForEvent = EVENT_COLORS.ACTIVE;
                } else if (diffs.startDiff > 0 && diffs.startDiff < 7 * TIME.DAY) {
                    iconColorForEvent = EVENT_COLORS.UPCOMING;
                }

                // Update text content and colors
                nameEl.textContent = ev.title || ev.name;
                nameEl.style.color = iconColorForEvent;  // Same color as icon
                
                // Update time with label (starts in / ends in)
                // Use short labels in icon mode, full labels in name mode
                const labelEl = timeEl.querySelector('.label');
                const timerEl = timeEl.querySelector('.timer');
                if (labelEl && timerEl) {
                    if (mode === 'name') {
                        // Full labels for name mode
                        labelEl.textContent = active ? 'ends in' : 'starts in';
                    } else {
                        // Short labels for icon mode (more compact)
                        labelEl.textContent = active ? 'ends' : 'in';
                    }
                    timerEl.textContent = Util.formatTime(remaining);
                } else {
                    // Fallback if structure not found
                    timeEl.textContent = Util.formatTime(remaining);
                }

                // Update icon using cache
                const key = (ev.title || ev.name || '').toLowerCase();
                const coloredSvgUri = getColoredSvg(key, iconColorForEvent);
                setEventIcon(iconWrap, coloredSvgUri);

                // Mark primary event if active
                if (i === 0) {
                    row.classList.toggle('currentEvent', active);
                } else {
                    row.classList.remove('currentEvent');
                }

                // Add pulsing animation if ending soon (<1 hour)
                const isEndingSoon = active && diffs.endDiff > 0 && diffs.endDiff < TIME.HOUR;
                row.classList.toggle('ending-soon', isEndingSoon);

                // Apply display mode (icon/name)
                applyDisplayMode(row, mode);
            });
        }

        function update() {
            if (!ensure()) return;
            if (!primary && !secondary) {
                clearList();
                Flash.stopFlash();
                return;
            }
            renderEvents(primary, secondary);
            
            // Apply flash if needed (only if tooltip is closed)
            const tooltip = DOMCache.get('tooltip', '.tc-clock-tooltip');
            if (tooltip && tooltip.classList.contains('hide___sxEtd')) {
                Flash.applyFlash();
            }
        }

        function hookClockObserver() {
            const el = DOMCache.get('serverTime', '.server-date-time');
            if (!el) return;
            lastServerText = el.textContent || '';

            const observer = new MutationObserver(() => {
                const txt = el.textContent || '';
                if (txt === lastServerText) return;
                const nowMs = Date.now();
                if (nowMs - lastClockUpdate < UI_TIMING.CLOCK_UPDATE_THROTTLE) return;
                lastClockUpdate = nowMs;
                lastServerText = txt;
                updateRenderedEvents();
            });

            observer.observe(el, { childList: true, subtree: true, characterData: true });
        }

        return { ensure, update, showMessage, hideMessage, hookClockObserver };
    })();

    /* ==============================
       Loader (API interactions)
       ============================== */

    const Load = (() => {
        async function loadData() {
            if (loading) return;
            loading = true;
            UI.showMessage(MESSAGES.UPDATING);

            try {
                const [tornData, userData] = await Promise.all([
                    Api.call("torn", "calendar"),
                    Api.call("user", "calendar").catch(() => ({ events: [] }))
                ]);

                // Extract user start time from API
                if (userData.calendar?.start_time) {
                    userStart = userData.calendar.start_time.toLowerCase().split(" tct")[0];
                    Store.set(STORAGE.USER_START, userStart);
                } else {
                    userStart = Store.get(STORAGE.USER_START, null);
                }

                const apiEventsList = [
                    ...(tornData.events || []),
                    ...(tornData.competitions || []),
                    ...(userData.events || [])
                ];

                const currentTimestamp = Util.nowSec();
                events = TRACKED_EVENTS.map(key =>
                    resolveEventDate(key, apiEventsList, currentTimestamp, userStart)
                );

                Store.set(STORAGE.EVENTS, events);
                Store.set(STORAGE.UPDATED, currentTimestamp);

                findNearest();
                UI.update();
                UI.hideMessage();
            } catch (e) {
                UI.showMessage(MESSAGES.API_ERROR, true);
                console.error("Torn Timer Error:", e);
                setTimeout(() => UI.hideMessage(), 3000);
            } finally {
                loading = false;
            }
        }

        return { loadData };
    })();

    /* ==============================
       Test API (console)
       ============================== */

    (function attachTestApi() {
        function makeEvent(id, title, startSec, endSec, source = 'TEST') {
            return { id, title, name: title, start: startSec || 0, end: endSec || 0, source };
        }

        function applyEvents(evList, persist = true) {
            events = evList.slice();
            
            // Save to storage for persistence between reloads
            if (persist) {
                Store.set(STORAGE.EVENTS, events);
                Store.set(STORAGE.UPDATED, Util.nowSec());
            }
            
            findNearest();
            if (typeof UI !== 'undefined' && UI.update) UI.update();
            
            console.log('✅ Events applied:', {
                total: events.length,
                primary: primary ? primary.title : 'none',
                secondary: secondary ? secondary.title : 'none'
            });
            
            return { primary, secondary, events };
        }

        function applyScenario(name, persist = true) {
            const now = Util.nowSec();
            let evs = [];

            if (name === 'twoSimultaneous') {
                evs = [
                    makeEvent('A', 'Event A', now - 3600, now + 1800),
                    makeEvent('B', 'Event B', now - 600, now + 7200)
                ];
            } else if (name === 'ongoing_plus_soon') {
                evs = [
                    makeEvent('ongoing', 'Ongoing Event', now - 1200, now + 3600),
                    makeEvent('soon', 'Soon Event', now + (3 * TIME.DAY), now + (3 * TIME.DAY) + 3600)
                ];
            } else if (name === 'ongoing_plus_late') {
                evs = [
                    makeEvent('ongoing', 'Ongoing Event', now - 1200, now + 3600),
                    makeEvent('later', 'Later Event', now + (12 * TIME.DAY), now + (12 * TIME.DAY) + 7200)
                ];
            } else if (name === 'ongoing_long') {
                evs = [
                    makeEvent('ongoing', 'Ongoing Event', now - 7200, now + (12 * TIME.DAY), now + (12 * TIME.DAY) + 7200)
                ];
            } else if (name === 'very_late') {
                evs = [
                    makeEvent('late', 'Far Event', now + (12 * TIME.DAY), now + (12 * TIME.DAY) + 7200)
                ];
            } else if (name === 'just_started') {
                evs = [
                    makeEvent('just', 'Just Started', now - 10, now + 50)
                ];
            } else {
                throw new Error('Unknown scenario: ' + name);
            }

            console.log(`🎬 Applying scenario: ${name} (${evs.length} events)`);
            return applyEvents(evs, persist);
        }

        function clearTestEvents(persist = true) {
            events = [];
            primary = null;
            secondary = null;
            
            if (persist) {
                Store.set(STORAGE.EVENTS, []);
                Store.set(STORAGE.UPDATED, 0);
            }
            
            if (typeof UI !== 'undefined' && UI.update) UI.update();
            
            console.log('🧹 Test events cleared');
            return { primary, secondary, events };
        }
        
        function debugState() {
            console.log('📊 Current state:', {
                events: events.map(e => ({
                    title: e.title,
                    start: new Date(e.start * 1000).toLocaleString(),
                    end: new Date(e.end * 1000).toLocaleString(),
                    source: e.source
                })),
                primary: primary ? {
                    title: primary.title,
                    startDiff: computeDiffs(primary).startDiff,
                    endDiff: computeDiffs(primary).endDiff
                } : null,
                secondary: secondary ? {
                    title: secondary.title,
                    startDiff: computeDiffs(secondary).startDiff,
                    endDiff: computeDiffs(secondary).endDiff
                } : null,
                cached: {
                    events: Store.get(STORAGE.EVENTS, []).length,
                    updated: new Date(Store.get(STORAGE.UPDATED, 0) * 1000).toLocaleString()
                }
            });
        }

        Object.defineProperty(window, 'eventsTimerTest', {
            configurable: true,
            enumerable: false,
            value: {
                makeEvent,
                applyEvents,
                applyScenario,
                clearTestEvents,
                debugState,
                // Expose Flash for debugging
                flash: {
                    apply: () => Flash.applyFlash(),
                    stop: () => Flash.stopFlash(),
                    markSeen: () => Flash.markVisibleEventsAsSeen(),
                    cleanup: () => Flash.cleanupOldSeen()
                }
            }
        });
    })();

    /* ==============================
       Initialization
       ============================== */

    function init() {
        // Cleanup seen events that are too old (only once every 7 days)
        const lastCleanup = Store.get(STORAGE.LAST_CLEANUP, 0);
        const now = Util.nowSec();
        if (now - lastCleanup > 7 * TIME.DAY) {
            Flash.cleanupOldSeen();
            Store.set(STORAGE.LAST_CLEANUP, now);
        }

        if (!UI.ensure()) {
            const obs = new MutationObserver(() => {
                if (UI.ensure()) {
                    obs.disconnect();
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }

        const waitForClock = () => {
            const el = DOMCache.get('serverTime', '.server-date-time');
            if (!el) {
                setTimeout(waitForClock, 500);
                return;
            }
            UI.hookClockObserver();
        };
        waitForClock();

        if (loadCache()) {
            UI.update();
            const age = Util.nowSec() - Store.get(STORAGE.UPDATED, 0);
            if (age >= CONFIG.CACHE_TTL && Store.get(STORAGE.KEY)) {
                Load.loadData();
            }
            return;
        }

        const key = Store.get(STORAGE.KEY, '');
        const age = Util.nowSec() - Store.get(STORAGE.UPDATED, 0);

        if (key && age < CONFIG.CACHE_TTL) {
            events = Store.get(STORAGE.EVENTS, []) || [];
            findNearest();
            UI.update();
        } else if (key) {
            Load.loadData();
        } else {
            UI.showMessage(MESSAGES.CLICK_TO_INSERT_KEY);
        }
    }

    init();
})();
