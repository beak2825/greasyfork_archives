// ==UserScript==
// @name         Popmundo Itinerary Booker (Fixed Upcoming Shows Parsing)
// @namespace    http://tampermonkey.net/
// @version      10.1.1
// @description  Itinerary Booker with fixed upcoming shows parsing - handles various date/time formats correctly
// @author       Gemini & You
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/BookShow/*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/UpcomingPerformances/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548221/Popmundo%20Itinerary%20Booker%20%28Fixed%20Upcoming%20Shows%20Parsing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548221/Popmundo%20Itinerary%20Booker%20%28Fixed%20Upcoming%20Shows%20Parsing%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Guard: only run on intended routes ---
    const allowedPathRegex = /^\/World\/Popmundo\.aspx\/Artist\/(BookShow|UpcomingPerformances)(\/|$)/;
    if (!allowedPathRegex.test(window.location.pathname)) {
        return;
    }

    // ---------- Utilities ----------
    const log = (...args) => console.log('[Itinerary Booker]', ...args);
    const logError = (...args) => console.error('[Itinerary Booker]', ...args);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const POLL_INTERVAL = 250;
    const SAFETIMEOUT = 20000;

    function normalizeText(s) {
        try {
            return String(s || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
        } catch (e) {
            return String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim();
        }
    }

    // Fixed date parsing function - handles multiple date/time formats
    function parseUpcomingDateTime(dtStr) {
        if (!dtStr) return null;

        // Clean up the string first
        dtStr = dtStr.trim()

        // Try multiple date formats
        const formats = [
            // DD/MM/YYYY, HH:MM (most common)
            /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*,\s*(\d{1,2}):(\d{2})/,
            // DD/MM/YYYY, HH:MM (with possible seconds)
            /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*,\s*(\d{1,2}):(\d{2}):(\d{2})/,
            // DD/MM/YYYY, HH:MM (with AM/PM)
            /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*,\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i,
            // YYYY-MM-DD HH:MM:SS (alternative format)
            /(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2}):(\d{2})/,
            // Month DD, YYYY HH:MM (textual month)
            /([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s+(\d{1,2}):(\d{2})/i
        ];

        let match = null;
        for (const regex of formats) {
            match = dtStr.match(regex);
            if (match) break;
        }

        if (!match) return null;

        let day, month, year, hours, minutes, seconds = 0, ampm;

        // Determine which format matched and extract components
        if (match[0].includes('/')) {
            // DD/MM/YYYY format
            day = parseInt(match[1], 10);
            month = parseInt(match[2], 10) - 1; // Convert to 0-indexed month
            year = parseInt(match[3], 10);
            hours = parseInt(match[4], 10);
            minutes = parseInt(match[5], 10);

            if (match[6] && (match[6].toUpperCase() === 'AM' || match[6].toUpperCase() === 'PM')) {
                ampm = match[6].toUpperCase();
            } else if (match[6] && !isNaN(parseInt(match[6], 10))) {
                seconds = parseInt(match[6], 10);
            }
        } else if (match[0].includes('-')) {
            // YYYY-MM-DD format
            year = parseInt(match[1], 10);
            month = parseInt(match[2], 10) - 1;
            day = parseInt(match[3], 10);
            hours = parseInt(match[4], 10);
            minutes = parseInt(match[5], 10);
            seconds = parseInt(match[6], 10);
        } else {
            // Textual month format
            const monthNames = ["january", "february", "march", "april", "may", "june",
                               "july", "august", "september", "october", "november", "december"];
            month = monthNames.indexOf(match[1].toLowerCase());
            day = parseInt(match[2], 10);
            year = parseInt(match[3], 10);
            hours = parseInt(match[4], 10);
            minutes = parseInt(match[5], 10);
        }

        // Handle 12-hour format
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        const date = new Date(year, month, day, hours, minutes, seconds);
        if (isNaN(date.getTime())) return null;

        return {
            dateISO: date.toISOString().split('T')[0],
            time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        };
    }

    function makeShowKey(city, dateISO, timeHHMMSS) {
        return `${normalizeText(city)}|${dateISO}|${timeHHMMSS}`;
    }

    // ---------- Configuration & defaults ----------
    const SCRIPT_CONFIG = {
        storage: {
            status: 'pm_booker_status',
            settings: 'pm_booker_settings',
            tour: 'pm_booker_planned_tour',
            bookedClubs: 'pm_booker_booked_clubs',
            showIndex: 'pm_booker_show_index',
            restore: 'pm_booker_restore_selections'
        },
        selectors: {
            city: '#ctl00_cphLeftColumn_ctl01_ddlCities',
            day: '#ctl00_cphLeftColumn_ctl01_ddlDays',
            hour: '#ctl00_cphLeftColumn_ctl01_ddlHours',
            findClubsBtn: '#ctl00_cphLeftColumn_ctl01_btnFindClubs',
            clubsTable: '#tableclubs',
            upcomingTable: '#tableupcoming',
            bookShowBtn: '#ctl00_cphLeftColumn_ctl01_btnBookShow',
            dialogConfirm: 'body > div:nth-child(4) > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)'
        },
        STATE: { RUNNING: 'RUNNING', IDLE: 'IDLE' }
    };

    const getFormattedDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const DEFAULTS = {
        INITIAL_CITY: "são paulo",
        SHOW_TIMES: ["14:00:00", "22:00:00"],
        SHOWS_PER_CITY: 1,
        SHOWS_PER_DATE: 1,
        BLOCK_TWO_SHOWS_IN_CITY_AT_SAME_DATE: true,
        REQUIRE_5_STARS: true,
        TARGET_CLUB_RANGE: { min: 80, max: 1500 },
        INITIAL_DATE: getFormattedDate(today),
        FINAL_DATE: getFormattedDate(sevenDaysFromNow),
        ARTIST_ID: "2786249",
        SORT_MODE: 'price_desc'
    };

    const TOUR_ITINERARY = [
        { city: "rio de janeiro", travelHours: 3 }, { city: "são paulo", travelHours: 3 },
        { city: "buenos aires", travelHours: 6 },   { city: "são paulo", travelHours: 6 },
        { city: "mexico city", travelHours: 12 },  { city: "los angeles", travelHours: 6 },
        { city: "seattle", travelHours: 8 },       { city: "chicago", travelHours: 8 },
        { city: "nashville", travelHours: 2 },     { city: "chicago", travelHours: 2 },
        { city: "toronto", travelHours: 3 },       { city: "montreal", travelHours: 6 },
        { city: "new york", travelHours: 6 },      { city: "london", travelHours: 18 },
        { city: "brussels", travelHours: 2 },      { city: "paris", travelHours: 3 },
        { city: "barcelona", travelHours: 6 },     { city: "madrid", travelHours: 3 },
        { city: "porto", travelHours: 3 },         { city: "madrid", travelHours: 3 },
        { city: "milan", travelHours: 4 },         { city: "rome", travelHours: 2 },
        { city: "budapest", travelHours: 3 },      { city: "belgrade", travelHours: 2 },
        { city: "dubrovnik", travelHours: 2 },     { city: "sarajevo", travelHours: 2 },
        { city: "belgrade", travelHours: 2 },      { city: "bucharest", travelHours: 3 },
        { city: "sofia", travelHours: 2 },         { city: "istanbul", travelHours: 3 },
        { city: "izmir", travelHours: 2 },         { city: "antalya", travelHours: 2 },
        { city: "ankara", travelHours: 2 },        { city: "baku", travelHours: 2 },
        { city: "kyiv", travelHours: 5 },          { city: "moscow", travelHours: 2 },
        { city: "tallinn", travelHours: 4 },       { city: "stockholm", travelHours: 2 },
        { city: "vilnius", travelHours: 2 },       { city: "warsaw", travelHours: 2 },
        { city: "berlin", travelHours: 3 },        { city: "copenhagen", travelHours: 3 },
        { city: "tromsø", travelHours: 4 },        { city: "copenhagen", travelHours: 4 },
        { city: "tallinn", travelHours: 3 },       { city: "helsinki", travelHours: 2 },
        { city: "tallinn", travelHours: 2 },       { city: "tromsø", travelHours: 3 },
        { city: "berlin", travelHours: 5 },        { city: "glasgow", travelHours: 4 },
        { city: "london", travelHours: 4 },        { city: "amsterdam", travelHours: 5 },
        { city: "istanbul", travelHours: 8 },      { city: "ankara", travelHours: 3 },
        { city: "singapore", travelHours: 16 },    { city: "jakarta", travelHours: 3 },
        { city: "singapore", travelHours: 3 },     { city: "shanghai", travelHours: 6 },
        { city: "manila", travelHours: 4 },        { city: "singapore", travelHours: 7 },
        { city: "melbourne", travelHours: 9 },     { city: "johannesburg", travelHours: 34 },
    ];

    // ---------- Helpers ----------
    async function waitForInjectionPoint(timeoutMs = 15000) {
        const start = Date.now();
        const selectorsToTry = [
            '#ppm-content > div:nth-child(6)',
            '#ppm-content',
            '#content',
            '#centerColumn',
            'main',
            'body'
        ];
        while (Date.now() - start < timeoutMs) {
            for (const sel of selectorsToTry) {
                const el = document.querySelector(sel);
                if (el) return el;
            }
            await delay(POLL_INTERVAL);
        }
        return document.body;
    }

    function safeParseJSON(text) {
        try { return JSON.parse(text); } catch (e) { return null; }
    }

    // ---------- Candidate slot pool builder ----------
    function buildCandidateSlots(initialDateISO, finalDateISO, showTimes) {
        const slots = [];
        const start = new Date(initialDateISO + 'T00:00:00');
        const end = new Date(finalDateISO + 'T23:59:59');
        const timeParts = showTimes.map(t => t.split(':').map(x => parseInt(x, 10) || 0));

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateIso = d.toISOString().split('T')[0];
            for (const parts of timeParts) {
                const slot = new Date(d.getFullYear(), d.getMonth(), d.getDate(), parts[0], parts[1] || 0, parts[2] || 0);
                if (slot >= start && slot <= end) {
                    slots.push({
                        dateISO: dateIso,
                        time: `${String(parts[0]).padStart(2,'0')}:${String(parts[1]||0).padStart(2,'0')}:${String(parts[2]||0).padStart(2,'0')}`,
                        dateObj: new Date(slot)
                    });
                }
            }
        }
        slots.sort((a, b) => a.dateObj - b.dateObj);
        return slots;
    }

    // ---------- Improved Tour Builder ----------
    function buildTour(settings) {
        const tour = [];
        const showsPerDateCount = {};
        const cityDateCount = {};
        const showTimes = [...new Set(settings.SHOW_TIMES || DEFAULTS.SHOW_TIMES)].sort();
        const showsPerDateLimit = Number(settings.SHOWS_PER_DATE || DEFAULTS.SHOWS_PER_DATE);
        const showsPerCity = Number(settings.SHOWS_PER_CITY || DEFAULTS.SHOWS_PER_CITY);
        const blockTwo = !!(settings.BLOCK_TWO_SHOWS_IN_CITY_AT_SAME_DATE ?? DEFAULTS.BLOCK_TWO_SHOWS_IN_CITY_AT_SAME_DATE);

        const candidateSlots = buildCandidateSlots(settings.INITIAL_DATE || DEFAULTS.INITIAL_DATE, settings.FINAL_DATE || DEFAULTS.FINAL_DATE, showTimes);

        let startingIndex = TOUR_ITINERARY.findIndex(l => l.city.toLowerCase() === ((settings.INITIAL_CITY || DEFAULTS.INITIAL_CITY).toLowerCase()));
        if (startingIndex === -1) startingIndex = 0;
        const activeItinerary = TOUR_ITINERARY.slice(startingIndex);

        let lastAssignedDateObj = new Date((settings.INITIAL_DATE || DEFAULTS.INITIAL_DATE) + 'T00:00:00');

        for (let idx = 0; idx < activeItinerary.length; idx++) {
            const leg = activeItinerary[idx];
            if (lastAssignedDateObj > new Date((settings.FINAL_DATE || DEFAULTS.FINAL_DATE) + 'T23:59:59')) break;

            let cityEarliest = new Date(lastAssignedDateObj);
            let lastSlotForThisCity = null;
            for (let k = 0; k < showsPerCity; k++) {
                let chosenIndex = -1;
                for (let i = 0; i < candidateSlots.length; i++) {
                    const slot = candidateSlots[i];
                    if (slot.dateObj <= cityEarliest) continue;
                    if ((showsPerDateCount[slot.dateISO] || 0) >= showsPerDateLimit) continue;
                    if (blockTwo) {
                        const cKey = `${normalizeText(leg.city)}|${slot.dateISO}`;
                        if ((cityDateCount[cKey] || 0) >= 1) continue;
                    }
                    chosenIndex = i;
                    break;
                }

                if (chosenIndex === -1) break;

                const chosen = candidateSlots.splice(chosenIndex, 1)[0];
                const dateIso = chosen.dateISO;
                const timeStr = chosen.time;
                tour.push({ city: leg.city, date: dateIso, time: timeStr });

                showsPerDateCount[dateIso] = (showsPerDateCount[dateIso] || 0) + 1;
                const cityDateKey = `${normalizeText(leg.city)}|${dateIso}`;
                cityDateCount[cityDateKey] = (cityDateCount[cityDateKey] || 0) + 1;

                lastSlotForThisCity = chosen;
                cityEarliest = new Date(chosen.dateObj.getTime());
            }

            if (lastSlotForThisCity) {
                const travelMs = (Number(leg.travelHours || 0) || 0) * 3600 * 1000;
                lastAssignedDateObj = new Date(lastSlotForThisCity.dateObj.getTime() + travelMs);
            } else {
                const travelMs = (Number(leg.travelHours || 0) || 0) * 3600 * 1000;
                lastAssignedDateObj = new Date(lastAssignedDateObj.getTime() + travelMs);
            }

            if (lastAssignedDateObj > new Date((settings.FINAL_DATE || DEFAULTS.FINAL_DATE) + 'T23:59:59')) break;
        }

        const sorted = tour.map(t => {
            const [h, m, s] = (t.time || '00:00:00').split(':').map(x => parseInt(x, 10) || 0);
            const [yyyy, mm, dd] = (t.date || '').split('-').map(x => parseInt(x, 10));
            const dateObj = (yyyy && mm && dd) ? new Date(yyyy, mm - 1, dd, h, m, s) : new Date(`${t.date}T${t.time}`);
            return Object.assign({}, t, { dateObj });
        }).sort((a, b) => a.dateObj - b.dateObj).map(({dateObj, ...rest}) => rest);

        try { localStorage.setItem(SCRIPT_CONFIG.storage.tour, JSON.stringify(sorted)); } catch (e) { logError('Could not save tour:', e); }
        log('Built tour with', sorted.length, 'shows');
        return sorted;
    }

    // ---------- Upcoming shows scanner ----------
    async function getUpcomingShowsSet(artistId, timeoutMs = SAFETIMEOUT) {
        const parseTable = (doc) => {
            const tbl = doc.querySelector(SCRIPT_CONFIG.selectors.upcomingTable);
            if (!tbl) return null;
            try {
                const rows = Array.from(tbl.querySelectorAll('tbody tr'));
                console.log("rows", rows);
                if (rows.length === 0) return null;
                const set = new Set();
                for (const row of rows) {
                    const dateCell = row.cells[0];
                    const cityCell = row.cells[1];
                    if (!dateCell || !cityCell) continue;
                    let dateText = dateCell.innerText || dateCell.textContent || '';
                    const parsed = parseUpcomingDateTime(dateText);

                    if (!parsed) continue;

                    let cityName = '';
                    const anchors = cityCell.querySelectorAll('a');
                    if (anchors && anchors.length) {
                        cityName = anchors[anchors.length - 1].textContent.trim();
                    } else {
                        cityName = cityCell.textContent.replace(/\n/g,' ').trim();
                    }
                    const key = makeShowKey(cityName, parsed.dateISO, parsed.time);
                    set.add(key);
                }
                return set;
            } catch (e) {
                logError('Error parsing upcoming table:', e);
                return null;
            }
        };

        try {
            const fromDoc = parseTable(document);
            if (fromDoc) {
                log('Upcoming parsed from current document. Count:', fromDoc.size);
                return fromDoc;
            }
        } catch (e) {}

        const onUpcomingPage = window.location.pathname.includes('/Artist/UpcomingPerformances/');
        if (onUpcomingPage) {
            log('On UpcomingPerformances page but no table found — returning empty set');
            return new Set();
        }

        return await new Promise((resolve) => {
            let resolved = false;
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.sandbox = 'allow-same-origin allow-scripts';
            const upcomingPath = `/World/Popmundo.aspx/Artist/UpcomingPerformances/${encodeURIComponent(artistId)}`;
            iframe.src = `https://${window.location.hostname}${upcomingPath}`;
            document.body.appendChild(iframe);

            const cleanup = () => { try { iframe.remove(); } catch (e) {} };

            const timer = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    logError('Timeout while loading UpcomingPerformances iframe — returning empty upcoming set.');
                    resolve(new Set());
                }
            }, timeoutMs);

            iframe.addEventListener('load', async () => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const start = Date.now();
                    const poll = setInterval(() => {
                        if (resolved) { clearInterval(poll); return; }
                        try {
                            const parsed = parseTable(doc);
                            if (parsed) {
                                resolved = true;
                                clearInterval(poll);
                                clearTimeout(timer);
                                cleanup();
                                log('Upcoming parsed from iframe. Count:', parsed.size);
                                resolve(parsed);
                            } else {
                                if (Date.now() - start > timeoutMs) {
                                    resolved = true;
                                    clearInterval(poll);
                                    clearTimeout(timer);
                                    cleanup();
                                    logError('Could not find upcoming table inside iframe before timeout.');
                                    resolve(new Set());
                                }
                            }
                        } catch (err) {
                            resolved = true;
                            clearInterval(poll);
                            clearTimeout(timer);
                            cleanup();
                            logError('Error accessing iframe document (cross-origin?), returning empty upcoming set.', err);
                            resolve(new Set());
                        }
                    }, POLL_INTERVAL);
                } catch (err) {
                    resolved = true;
                    clearTimeout(timer);
                    cleanup();
                    logError('Error on iframe load handler - returning empty set', err);
                    resolve(new Set());
                }
            }, { once: true });
        });
    }

    // ---------- Booking logic ----------
    function elementTextContains(el, regex) {
        try {
            return !!(el && el.textContent && regex.test(el.textContent));
        } catch (e) {
            return false;
        }
    }

    function detectBookingError() {
        const errorSelectors = [
            '.ui-dialog-content',
            '.validation-summary-errors',
            '.message.error',
            '.error',
            '#ctl00_cphLeftColumn_ctl01_lblError',
            '#ctl00_cphLeftColumn_ctl01_lblMessage'
        ];
        const keywords = /(already|cannot|cannot book|booked in this week|another show|not available|no availability|you already|already booked|same week|one show.*week)/i;

        for (const sel of errorSelectors) {
            const nodes = document.querySelectorAll(sel);
            for (const n of nodes) {
                if (elementTextContains(n, keywords)) return n.textContent.trim();
            }
        }
        const recentText = document.body.textContent || '';
        const tail = recentText.slice(-4000);
        if (keywords.test(tail)) {
            const match = tail.match(keywords);
            return match ? match[0] : 'Booking error detected in body text';
        }
        return null;
    }

    async function attemptCandidateBooking(candidate, currentShow) {
        try {
            const radio = candidate.row.querySelector('input[type="radio"]');
            if (!radio) return { success: false, errorText: 'no-radio' };
            radio.click();
            await delay(300);

            const bookBtn = document.querySelector(SCRIPT_CONFIG.selectors.bookShowBtn);
            if (!bookBtn) return { success: false, errorText: 'no-book-btn' };
            bookBtn.click();
            await delay(700);

            const confirmBtn = Array.from(document.querySelectorAll(SCRIPT_CONFIG.selectors.dialogConfirm))
                .find(b => /yes|ok|confirm|book/i.test(b.textContent));
            if (confirmBtn) {
                confirmBtn.click();
                await delay(1000);
            } else {
                await delay(800);
            }

            const errorText = detectBookingError();
            if (errorText) {
                return { success: false, errorText };
            }

            await delay(300);
            return { success: true, errorText: null };
        } catch (err) {
            return { success: false, errorText: String(err) };
        }
    }

    function computeTargetMidpoint(settings) {
        const min = (settings.TARGET_CLUB_RANGE && Number(settings.TARGET_CLUB_RANGE.min)) || DEFAULTS.TARGET_CLUB_RANGE.min;
        const max = (settings.TARGET_CLUB_RANGE && Number(settings.TARGET_CLUB_RANGE.max)) || DEFAULTS.TARGET_CLUB_RANGE.max;
        return (min + max) / 2;
    }

    async function findAndBookBestClub(settings, currentShow) {
        const clubsTable = document.querySelector(SCRIPT_CONFIG.selectors.clubsTable);
        if (!clubsTable) { logError('Clubs table not found.'); return false; }

        const bookedClubs = JSON.parse(localStorage.getItem(SCRIPT_CONFIG.storage.bookedClubs) || '{}');

        const getWeekStartDate = (dateStr) => {
            const date = new Date(dateStr);
            const day = date.getUTCDay();
            const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
            return new Date(date.setUTCDate(diff)).toISOString().split('T')[0];
        };

        const rows = clubsTable.querySelectorAll('tbody tr');
        const candidates = [];

        for (const row of rows) {
            const clubName = (row.cells[0]?.textContent || '').trim();
            const availabilityCell = row.cells[1];
            let used = null, total = null, remaining = null;
            if (availabilityCell) {
                const txt = availabilityCell.textContent.trim();
                const m = txt.match(/(\d+)\s*\/\s*(\d+)/);
                if (m) {
                    used = parseInt(m[1], 10);
                    total = parseInt(m[2], 10);
                    remaining = total - used;
                } else {
                    remaining = Number.MAX_SAFE_INTEGER;
                }
            } else {
                remaining = Number.MAX_SAFE_INTEGER;
            }

            const starRatingKey = row.cells[2]?.querySelector('span.sortkey')?.textContent;
            const priceText = (row.cells[row.cells.length - 1]?.textContent || '').trim();
            const price = parseFloat(priceText.replace(/\s*M\$$/, '').replace(/\./g, '').replace(',', '.')) || 0;

            if ((settings.REQUIRE_5_STARS ?? DEFAULTS.REQUIRE_5_STARS) && starRatingKey !== '50') {
                continue;
            }

            if (price < (settings.TARGET_CLUB_RANGE?.min ?? DEFAULTS.TARGET_CLUB_RANGE.min) ||
                price > (settings.TARGET_CLUB_RANGE?.max ?? DEFAULTS.TARGET_CLUB_RANGE.max)) {
                continue;
            }

            if (typeof remaining === 'number' && remaining <= 0) continue;

            const bookedDate = bookedClubs[clubName];
            const currentShowWeekStart = getWeekStartDate(currentShow.date);
            if (bookedDate && getWeekStartDate(bookedDate) === currentShowWeekStart) continue;

            candidates.push({
                price,
                row,
                name: clubName,
                remaining: (remaining === Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : remaining,
                used,
                total
            });
        }

        if (candidates.length === 0) {
            log('No candidate clubs with availability found.');
            return false;
        }

        const sortMode = (settings.SORT_MODE || DEFAULTS.SORT_MODE);

        if (sortMode === 'price_desc') {
            candidates.sort((a, b) => {
                if (b.price !== a.price) return b.price - a.price;
                if (b.remaining !== a.remaining) return b.remaining - a.remaining;
                return a.name.localeCompare(b.name);
            });
        } else if (sortMode === 'price_asc') {
            candidates.sort((a, b) => {
                if (a.price !== b.price) return a.price - b.price;
                if (b.remaining !== a.remaining) return b.remaining - a.remaining;
                return a.name.localeCompare(b.name);
            });
        } else if (sortMode === 'closest_to_target_avg') {
            const midpoint = computeTargetMidpoint(settings);
            candidates.sort((a, b) => {
                const da = Math.abs((a.price || 0) - midpoint);
                const db = Math.abs((b.price || 0) - midpoint);
                if (da !== db) return da - db;
                if (b.price !== a.price) return b.price - a.price;
                return a.name.localeCompare(b.name);
            });
        } else {
            candidates.sort((a, b) => b.price - a.price);
        }

        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];

            try {
                const pre = JSON.parse(localStorage.getItem(SCRIPT_CONFIG.storage.bookedClubs) || '{}');
                pre[candidate.name] = currentShow.date;
                localStorage.setItem(SCRIPT_CONFIG.storage.bookedClubs, JSON.stringify(pre));
            } catch (e) { logError('Error pre-saving bookedClubs:', e); }

            const result = await attemptCandidateBooking(candidate, currentShow);

            if (result.success) {
                log(`Booked ${candidate.name} successfully.`);
                return true;
            } else {
                try {
                    const saved = JSON.parse(localStorage.getItem(SCRIPT_CONFIG.storage.bookedClubs) || '{}');
                    if (saved[candidate.name]) {
                        delete saved[candidate.name];
                        localStorage.setItem(SCRIPT_CONFIG.storage.bookedClubs, JSON.stringify(saved));
                    }
                } catch (e) { logError('Error removing failed bookedClubs entry:', e); }

                logError(`Candidate ${candidate.name} failed: ${result.errorText}. Trying next candidate.`);
                await delay(600);
                continue;
            }
        }
        logError('All candidate clubs attempted and booking failed for each.');
        return false;
    }

    // ---------- Processing loop ----------
    async function processNextShow(settings) {
        const statusEl = document.getElementById('pmBookerStatus');
        if (statusEl) statusEl.style.color = 'orange';

        let tour;
        try { tour = JSON.parse(localStorage.getItem(SCRIPT_CONFIG.storage.tour) || '[]'); } catch (e) { tour = []; }

        let currentIndex = parseInt(localStorage.getItem(SCRIPT_CONFIG.storage.showIndex) || '0', 10);
        if (currentIndex >= tour.length) {
            if (statusEl) { statusEl.textContent = 'Tour Finished! All shows booked.'; statusEl.style.color = 'green'; }
            alert('Tour finished!');
            stopProcess();
            return;
        }

        const currentShow = tour[currentIndex];
        if (statusEl) statusEl.textContent = `Processing ${currentIndex + 1}/${tour.length}: ${currentShow.city} ${currentShow.date} ${currentShow.time}`;
        log('Processing show', currentIndex + 1, currentShow);

        const cityDropdown = document.querySelector(SCRIPT_CONFIG.selectors.city);
        if (!cityDropdown) { logError('City dropdown not found on this page; cannot continue booking flow.'); return; }
        const selectedCityText = (cityDropdown.options[cityDropdown.selectedIndex]?.text || '').toLowerCase();

        if (selectedCityText.localeCompare(currentShow.city, undefined, { sensitivity: 'accent' }) !== 0) {
            const opt = [...cityDropdown.options].find(o => o.text.toLowerCase().localeCompare(currentShow.city, undefined, { sensitivity: 'accent' }) === 0);
            if (opt) {
                sessionStorage.setItem(SCRIPT_CONFIG.storage.restore, JSON.stringify(currentShow));
                cityDropdown.value = opt.value;
                cityDropdown.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                logError(`City ${currentShow.city} not found in dropdown, skipping.`);
                localStorage.setItem(SCRIPT_CONFIG.storage.showIndex, currentIndex + 1);
                await delay(400);
                processNextShow(settings);
            }
            return;
        }

        if (!document.querySelector(SCRIPT_CONFIG.selectors.clubsTable)) {
            const dayEl = document.querySelector(SCRIPT_CONFIG.selectors.day);
            const hourEl = document.querySelector(SCRIPT_CONFIG.selectors.hour);
            const findBtn = document.querySelector(SCRIPT_CONFIG.selectors.findClubsBtn);
            if (dayEl) dayEl.value = currentShow.date;
            if (hourEl) {
                const opts = Array.from(hourEl.options || []);
                const target = currentShow.time.slice(0,5);
                const foundOption = opts.find(o => o.value.includes(target) || o.text.includes(target));
                if (foundOption) hourEl.value = foundOption.value;
                else hourEl.value = currentShow.time;
            }
            await delay(250);
            if (findBtn) findBtn.click();
            return;
        }

        const booked = await findAndBookBestClub(settings, currentShow);
        localStorage.setItem(SCRIPT_CONFIG.storage.showIndex, currentIndex + 1);

        if (!booked) {
            log('No club booked for this show after all retries. Moving on and refreshing.');
            await delay(500);
            window.location.reload();
        }
    }

    // ---------- Start / Stop / UI helpers ----------
    function gatherSettingsFromUi() {
        const selectedShowTimes = Array.from(document.querySelectorAll('#pm_show_times option:checked')).map(el => el.value);
        const sortModeEl = document.getElementById('pm_sort_mode');
        const settings = {
            ARTIST_ID: (document.getElementById('pm_artist_id')?.value || DEFAULTS.ARTIST_ID).trim(),
            INITIAL_CITY: (document.getElementById('pm_initial_city')?.value) || DEFAULTS.INITIAL_CITY,
            INITIAL_DATE: (document.getElementById('pm_initial_date')?.value) || DEFAULTS.INITIAL_DATE,
            FINAL_DATE: (document.getElementById('pm_final_date')?.value) || DEFAULTS.FINAL_DATE,
            SHOW_TIMES: selectedShowTimes.length ? selectedShowTimes : DEFAULTS.SHOW_TIMES,
            SHOWS_PER_CITY: parseInt(document.getElementById('pm_shows_per_city')?.value || DEFAULTS.SHOWS_PER_CITY, 10),
            SHOWS_PER_DATE: parseInt(document.getElementById('pm_shows_per_date')?.value || DEFAULTS.SHOWS_PER_DATE, 10),
            BLOCK_TWO_SHOWS_IN_CITY_AT_SAME_DATE: !!document.getElementById('pm_block_same_day')?.checked,
            TARGET_CLUB_RANGE: {
                min: parseInt(document.getElementById('pm_club_min')?.value || DEFAULTS.TARGET_CLUB_RANGE.min, 10),
                max: parseInt(document.getElementById('pm_club_max')?.value || DEFAULTS.TARGET_CLUB_RANGE.max, 10)
            },
            REQUIRE_5_STARS: !!document.getElementById('pm_5star')?.checked,
            SORT_MODE: sortModeEl?.value || DEFAULTS.SORT_MODE
        };
        if (!settings.INITIAL_DATE || !settings.FINAL_DATE || !settings.SHOW_TIMES.length) return null;
        return settings;
    }

    function filterTourAgainstUpcoming(tour, upcomingSet) {
        if (!upcomingSet || upcomingSet.size === 0) return { filtered: tour.slice(), removedCount: 0 };
        const out = [];
        let removed = 0;
        const seen = new Set();
        for (const entry of tour) {
            const key = makeShowKey(entry.city, entry.date, entry.time);
            if (seen.has(key)) { removed++; continue; }
            seen.add(key);
            if (upcomingSet.has(key)) { removed++; continue; }
            out.push(entry);
        }
        return { filtered: out, removedCount: removed };
    }

    async function startProcess() {
        const settings = gatherSettingsFromUi();
        if (!settings) { alert('Please select a Start Date, Final Date, and at least one Show Time.'); return; }

        const generatedTour = buildTour(settings);
        log('Generated tour length:', generatedTour.length);

        let upcomingSet = new Set();
        try {
            upcomingSet = await getUpcomingShowsSet(settings.ARTIST_ID);
        } catch (e) {
            logError('Error getting upcoming shows:', e);
            upcomingSet = new Set();
        }

        const { filtered, removedCount } = filterTourAgainstUpcoming(generatedTour, upcomingSet);
        try {
            localStorage.setItem(SCRIPT_CONFIG.storage.tour, JSON.stringify(filtered));
        } catch (e) { logError('Could not save filtered tour:', e); }

        log(`Tour saved. Original ${generatedTour.length}, removed ${removedCount}, final ${filtered.length}.`);
        const statusEl = document.getElementById('pmBookerStatus');
        if (statusEl) {
            statusEl.textContent = `Tour prepared. ${filtered.length} slots saved (${removedCount} removed due to upcoming shows).`;
            statusEl.style.color = 'blue';
        }

        sessionStorage.setItem(SCRIPT_CONFIG.storage.status, SCRIPT_CONFIG.STATE.RUNNING);
        sessionStorage.setItem(SCRIPT_CONFIG.storage.settings, JSON.stringify(settings));
        document.getElementById('pmBookerForm')?.style.setProperty('display', 'none');
        document.getElementById('startBookerBtn') && (document.getElementById('startBookerBtn').disabled = true);

        processNextShow(settings);
    }

    function stopProcess() {
        sessionStorage.removeItem(SCRIPT_CONFIG.storage.status);
        sessionStorage.removeItem(SCRIPT_CONFIG.storage.settings);
        sessionStorage.removeItem(SCRIPT_CONFIG.storage.restore);
        localStorage.removeItem(SCRIPT_CONFIG.storage.showIndex);
        localStorage.removeItem(SCRIPT_CONFIG.storage.tour);
        localStorage.removeItem(SCRIPT_CONFIG.storage.bookedClubs);
        alert('Process stopped and all data cleared.');
        location.reload();
    }

    // ---------- UI injection ----------
    async function injectUi() {
        if (document.getElementById('pmBookerPanel')) return;
        const container = await waitForInjectionPoint();
        if (!container) return;

        const uniqueCities = [...new Set(TOUR_ITINERARY.map(l => l.city))].sort((a,b) => a.localeCompare(b));
        const cityOptionsHtml = uniqueCities.map(city => {
            const clean = city.toLowerCase();
            const selected = clean === DEFAULTS.INITIAL_CITY ? 'selected' : '';
            return `<option value="${clean}" ${selected}>${city.charAt(0).toUpperCase() + city.slice(1)}</option>`;
        }).join('');

        const availableShowTimes = ["14:00:00","16:00:00","18:00:00","20:00:00","22:00:00"];
        const timeOptionsHtml = availableShowTimes.map(t => {
            const selected = DEFAULTS.SHOW_TIMES.includes(t) ? 'selected' : '';
            return `<option value="${t}" ${selected}>${t}</option>`;
        }).join('');

        const panel = document.createElement('div');
        panel.id = 'pmBookerPanel';
        panel.style.padding = '12px';
        panel.style.marginBottom = '14px';
        panel.style.border = '2px solid #4CAF50';
        panel.style.backgroundColor = '#e8f5e9';
        panel.style.textAlign = 'center';
        panel.style.zIndex = '9999';

        panel.innerHTML = `
            <h3 style="margin:0 0 8px 0;">Itinerary Booker</h3>
            <div id="pmBookerForm" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:10px 16px; align-items:start;">
                <span><label>Artist ID:</label><br><input type="text" id="pm_artist_id" value="${DEFAULTS.ARTIST_ID}" style="padding:6px; width:100px;" /></span>
                <span><label>Start City:</label><br><select id="pm_initial_city" style="padding:6px; width:150px;">${cityOptionsHtml}</select></span>
                <span><label>Shows Per City:</label><br><input type="number" id="pm_shows_per_city" value="${DEFAULTS.SHOWS_PER_CITY}" min="1" style="padding:6px; width:80px;" /></span>
                <span><label>Shows Per Date:</label><br><input type="number" id="pm_shows_per_date" value="${DEFAULTS.SHOWS_PER_DATE}" min="1" style="padding:6px; width:80px;" /></span>
                <span><label>Start Date:</label><br><input type="date" id="pm_initial_date" value="${DEFAULTS.INITIAL_DATE}" style="padding:6px;" /></span>
                <span><label>Final Date:</label><br><input type="date" id="pm_final_date" value="${DEFAULTS.FINAL_DATE}" style="padding:6px;" /></span>
                <span style="grid-column:1 / -1;"><label>Club Price (Min/Max):</label><br><input type="number" id="pm_club_min" value="${DEFAULTS.TARGET_CLUB_RANGE.min}" min="0" style="width:60px; padding:6px;" /> <input type="number" id="pm_club_max" value="${DEFAULTS.TARGET_CLUB_RANGE.max}" min="0" style="width:60px; padding:6px;" /></span>
                <span style="grid-column:1 / -1; display:flex; justify-content:center; gap:18px;">
                    <span><label>Show Times (Ctrl+Click):</label><br><select id="pm_show_times" multiple style="padding:6px; height:100px; width:130px;">${timeOptionsHtml}</select></span>
                    <div style="text-align:left;">
                        <input type="checkbox" id="pm_5star" ${DEFAULTS.REQUIRE_5_STARS ? 'checked' : ''} /> <label for="pm_5star">Require 5 Stars</label><br/>
                        <input type="checkbox" id="pm_block_same_day" ${DEFAULTS.BLOCK_TWO_SHOWS_IN_CITY_AT_SAME_DATE ? 'checked' : ''} /> <label for="pm_block_same_day">Block Two Shows same City same Day</label>
                    </div>
                </span>
                <span style="grid-column:1 / -1; text-align:left;">
                    <label>Club Selection Priority:</label><br/>
                    <select id="pm_sort_mode" style="padding:6px; width:220px;">
                        <option value="price_desc" ${DEFAULTS.SORT_MODE === 'price_desc' ? 'selected' : ''}>Price: Largest → Smallest</option>
                        <option value="price_asc" ${DEFAULTS.SORT_MODE === 'price_asc' ? 'selected' : ''}>Price: Smallest → Largest</option>
                        <option value="closest_to_target_avg" ${DEFAULTS.SORT_MODE === 'closest_to_target_avg' ? 'selected' : ''}>Closest to Target Midpoint</option>
                    </select>
                </span>
            </div>

            <div style="margin-top:12px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                <button id="startBookerBtn" type="button" style="padding:8px 12px; background:#4CAF50; color:#fff; border:none; cursor:pointer;">Start Booker</button>
                <button id="stopBookerBtn" type="button" style="padding:8px 12px; background:#f44336; color:#fff; border:none; cursor:pointer;">Stop Booker</button>
                <button id="previewRouteBtn" type="button" style="padding:8px 12px; background:#2196F3; color:#fff; border:none; cursor:pointer;">Preview Route</button>
                <button id="previewFilteredRouteBtn" type="button" style="padding:8px 12px; background:#673AB7; color:#fff; border:none; cursor:pointer;">Preview Filtered Route</button>
                <button id="viewUpcomingBtn" type="button" style="padding:8px 12px; background:#FF9800; color:#fff; border:none; cursor:pointer;">View Upcoming JSON</button>

                <div style="display:inline-flex; gap:6px; align-items:center;">
                    <button id="copyConfigBtn" type="button" style="padding:6px 8px;">Copy Config</button>
                    <button id="downloadConfigBtn" type="button" style="padding:6px 8px;">Download Config</button>
                    <button id="loadConfigFileBtn" type="button" style="padding:6px 8px;">Load Config (File)</button>
                    <button id="pasteConfigBtn" type="button" style="padding:6px 8px;">Paste Config</button>
                </div>
            </div>

            <p id="pmBookerStatus" style="margin-top:10px; font-weight:bold; min-height:1.2em;">Status: Idle.</p>

            <div id="pmPreviewPopup" style="display:none; margin-top:10px; padding:10px; border:2px solid #2196F3; background:#e3f2fd; text-align:left; max-height:360px; overflow:auto;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                    <h4 id="pmPreviewTitle" style="margin:0;">Preview Route</h4>
                    <div style="margin-left:auto; display:flex; gap:8px;">
                        <button id="pmCopyPreviewBtn" type="button" style="padding:6px 8px;">Copy JSON</button>
                        <button id="pmDownloadPreviewBtn" type="button" style="padding:6px 8px;">Download JSON</button>
                        <button id="pmClosePreviewBtn" type="button" style="padding:6px 8px;">Close</button>
                    </div>
                </div>
                <pre id="pmPreviewContent" style="white-space:pre-wrap; word-break:break-word; margin:0; font-family:monospace; font-size:12px;"></pre>
            </div>

            <input id="pmConfigFileInput" type="file" accept="application/json" style="display:none;" />
            <div id="pmPasteModal" style="display:none; position:fixed; z-index:10000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.45);">
                <div style="background:#fff; width:90%; max-width:600px; margin:5% auto; padding:12px; border-radius:6px;">
                    <h4 style="margin-top:0;">Paste Configuration JSON</h4>
                    <textarea id="pmPasteTextarea" style="width:100%; height:200px; font-family:monospace; font-size:12px;"></textarea>
                    <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
                        <button id="pmApplyPasteBtn" type="button" style="padding:6px 10px;">Apply</button>
                        <button id="pmCancelPasteBtn" type="button" style="padding:6px 10px;">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        try {
            const reference = container.querySelector('div') || container.firstElementChild;
            if (reference) container.insertBefore(panel, reference);
            else container.prepend(panel);
        } catch (e) {
            document.body.prepend(panel);
        }

        // ---- events ----
        document.getElementById('startBookerBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); startProcess(); });
        document.getElementById('stopBookerBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (confirm('Stop booking and clear stored data?')) stopProcess(); });
        document.getElementById('previewRouteBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); handlePreviewClick(); });
        document.getElementById('previewFilteredRouteBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); handlePreviewFiltered(); });
        document.getElementById('viewUpcomingBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); handleViewUpcoming(); });

        // config copy/download/load/paste
        document.getElementById('copyConfigBtn')?.addEventListener('click', async (e) => {
            e.preventDefault(); e.stopPropagation();
            const cfg = gatherSettingsFromUi();
            if (!cfg) { alert('Please fill required fields first.'); return; }
            const json = JSON.stringify(cfg, null, 2);
            try { await navigator.clipboard.writeText(json); alert('Configuration copied to clipboard.'); } catch { prompt('Copy configuration JSON:', json); }
        });

        document.getElementById('downloadConfigBtn')?.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const cfg = gatherSettingsFromUi();
            if (!cfg) { alert('Please fill required fields first.'); return; }
            const json = JSON.stringify(cfg, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `pm_config_${Date.now()}.json`;
            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        });

        const fileInput = document.getElementById('pmConfigFileInput');
        document.getElementById('loadConfigFileBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fileInput.value = ''; fileInput.click(); });
        fileInput?.addEventListener('change', (evt) => {
            const f = evt.target.files?.[0]; if (!f) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const parsed = safeParseJSON(String(ev.target.result));
                    if (!parsed) throw new Error('Invalid JSON');
                    applyConfigToUi(parsed);
                    alert('Configuration loaded into UI. Click Start Booker to run.');
                } catch (err) { alert('Failed to load configuration file: ' + (err.message || err)); }
            };
            reader.readAsText(f);
        });

        document.getElementById('pasteConfigBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); document.getElementById('pmPasteTextarea').value = ''; document.getElementById('pmPasteModal').style.display = 'block'; });
        document.getElementById('pmCancelPasteBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); document.getElementById('pmPasteModal').style.display = 'none'; });
        document.getElementById('pmApplyPasteBtn')?.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const txt = document.getElementById('pmPasteTextarea').value;
            const parsed = safeParseJSON(txt);
            if (!parsed) { alert('Invalid JSON.'); return; }
            applyConfigToUi(parsed);
            document.getElementById('pmPasteModal').style.display = 'none';
            alert('Configuration applied to UI.');
        });

        // preview popup
        document.getElementById('pmClosePreviewBtn')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); document.getElementById('pmPreviewPopup').style.display = 'none'; });
        document.getElementById('pmCopyPreviewBtn')?.addEventListener('click', async (e) => {
            e.preventDefault(); e.stopPropagation();
            const text = document.getElementById('pmPreviewContent').textContent || '';
            try { await navigator.clipboard.writeText(text); alert('Preview JSON copied.'); } catch { prompt('Copy preview JSON:', text); }
        });
        document.getElementById('pmDownloadPreviewBtn')?.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const text = document.getElementById('pmPreviewContent').textContent || '';
            const blob = new Blob([text], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `pm_itinerary_${Date.now()}.json`;
            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        });

        // hide form if running
        if (sessionStorage.getItem(SCRIPT_CONFIG.storage.status) === SCRIPT_CONFIG.STATE.RUNNING) {
            document.getElementById('pmBookerForm')?.style.setProperty('display', 'none');
            const btn = document.getElementById('startBookerBtn'); if (btn) btn.disabled = true;
        }
    }

    // ---------- Preview handler ----------
    function handlePreviewClick() {
        const settings = gatherSettingsFromUi();
        if (!settings) { alert('Please select a Start Date, Final Date and at least one Show Time.'); return; }
        try {
            const tour = buildTour(settings);
            const pretty = JSON.stringify(tour, null, 2);
            const titleEl = document.getElementById('pmPreviewTitle');
            if (titleEl) titleEl.textContent = 'Preview Generated Route';
            document.getElementById('pmPreviewContent').textContent = pretty;
            document.getElementById('pmPreviewPopup').style.display = 'block';
        } catch (err) {
            logError('Error generating preview:', err);
            alert('Error generating preview. See console for details.');
        }
    }

    async function handlePreviewFiltered() {
        const settings = gatherSettingsFromUi();
        if (!settings) { alert('Please select a Start Date, Final Date and at least one Show Time.'); return; }
        try {
            const tour = buildTour(settings);
            let upcomingSet = new Set();
            try {
                upcomingSet = await getUpcomingShowsSet(settings.ARTIST_ID);
            } catch (e) {
                logError('Error getting upcoming shows for preview:', e);
                upcomingSet = new Set();
            }
            const { filtered, removedCount } = filterTourAgainstUpcoming(tour, upcomingSet);
            const pretty = JSON.stringify(filtered, null, 2);
            const titleEl = document.getElementById('pmPreviewTitle');
            if (titleEl) titleEl.textContent = `Preview Filtered Route (removed ${removedCount})`;
            document.getElementById('pmPreviewContent').textContent = pretty;
            document.getElementById('pmPreviewPopup').style.display = 'block';
        } catch (err) {
            logError('Error generating filtered preview:', err);
            alert('Error generating filtered preview. See console for details.');
        }
    }

    async function handleViewUpcoming() {
        const settings = gatherSettingsFromUi();
        if (!settings || !settings.ARTIST_ID) { alert('Please fill Artist ID.'); return; }
        let upcomingSet = new Set();
        try {
            upcomingSet = await getUpcomingShowsSet(settings.ARTIST_ID);
        } catch (e) {
            logError('Error getting upcoming shows:', e);
            upcomingSet = new Set();
        }
        const upcomingArray = Array.from(upcomingSet).map(key => {
            const [city, date, time] = key.split('|');
            return { city, date, time };
        }).sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
        const pretty = JSON.stringify(upcomingArray, null, 2);
        const titleEl = document.getElementById('pmPreviewTitle');
        if (titleEl) titleEl.textContent = 'Upcoming Shows JSON';
        document.getElementById('pmPreviewContent').textContent = pretty;
        document.getElementById('pmPreviewPopup').style.display = 'block';
    }

    function applyConfigToUi(cfg) {
        try {
            if (cfg.ARTIST_ID !== undefined) document.getElementById('pm_artist_id').value = String(cfg.ARTIST_ID);
            if (cfg.INITIAL_CITY !== undefined) {
                const sel = document.getElementById('pm_initial_city');
                const lower = String(cfg.INITIAL_CITY).toLowerCase();
                let found = [...sel.options].find(o => o.value.toLowerCase() === lower || o.text.toLowerCase() === lower);
                if (found) sel.value = found.value; else sel.value = cfg.INITIAL_CITY;
            }
            if (cfg.INITIAL_DATE !== undefined) document.getElementById('pm_initial_date').value = String(cfg.INITIAL_DATE);
            if (cfg.FINAL_DATE !== undefined) document.getElementById('pm_final_date').value = String(cfg.FINAL_DATE);
            if (Array.isArray(cfg.SHOW_TIMES)) {
                const sel = document.getElementById('pm_show_times');
                [...sel.options].forEach(o => o.selected = cfg.SHOW_TIMES.includes(o.value));
            }
            if (cfg.SHOWS_PER_CITY !== undefined) document.getElementById('pm_shows_per_city').value = Number(cfg.SHOWS_PER_CITY);
            if (cfg.SHOWS_PER_DATE !== undefined) document.getElementById('pm_shows_per_date').value = Number(cfg.SHOWS_PER_DATE);
            if (cfg.TARGET_CLUB_RANGE?.min !== undefined) document.getElementById('pm_club_min').value = Number(cfg.TARGET_CLUB_RANGE.min);
            if (cfg.TARGET_CLUB_RANGE?.max !== undefined) document.getElementById('pm_club_max').value = Number(cfg.TARGET_CLUB_RANGE.max);
            if (cfg.REQUIRE_5_STARS !== undefined) document.getElementById('pm_5star').checked = !!cfg.REQUIRE_5_STARS;
            if (cfg.BLOCK_TWO_SHOWS_IN_CITY_AT_SAME_DATE !== undefined) document.getElementById('pm_block_same_day').checked = !!cfg.BLOCK_TWO_SHOWS_IN_CITY_AT_SAME_DATE;
            if (cfg.SORT_MODE !== undefined && document.getElementById('pm_sort_mode')) {
                const sel = document.getElementById('pm_sort_mode');
                if ([...sel.options].some(o => o.value === cfg.SORT_MODE)) sel.value = cfg.SORT_MODE;
            }
        } catch (err) { logError('applyConfigToUi error:', err); }
    }

    // ---------- Router / Entrypoint ----------
    async function run() {
        await injectUi();

        const status = sessionStorage.getItem(SCRIPT_CONFIG.storage.status);
        let settings = null;
        try { settings = JSON.parse(sessionStorage.getItem(SCRIPT_CONFIG.storage.settings) || 'null'); } catch (e) { settings = null; }

        if (status === SCRIPT_CONFIG.STATE.RUNNING && settings) {
            log('Script RUNNING — ensuring BookShow page.');
            const expectedPath = `/World/Popmundo.aspx/Artist/BookShow/${settings.ARTIST_ID}`;
            if (window.location.pathname !== expectedPath) {
                window.location.href = `https://${window.location.hostname}${expectedPath}`;
                return;
            }

            document.getElementById('pmBookerForm')?.style.setProperty('display', 'none');
            const restoreRaw = sessionStorage.getItem(SCRIPT_CONFIG.storage.restore);
            if (restoreRaw) {
                try {
                    const restore = JSON.parse(restoreRaw);
                    sessionStorage.removeItem(SCRIPT_CONFIG.storage.restore);
                    const dayEl = document.querySelector(SCRIPT_CONFIG.selectors.day);
                    const hourEl = document.querySelector(SCRIPT_CONFIG.selectors.hour);
                    const findBtn = document.querySelector(SCRIPT_CONFIG.selectors.findClubsBtn);
                    if (dayEl) dayEl.value = restore.date;
                    if (hourEl) {
                        const opts = Array.from(hourEl.options || []);
                        const target = restore.time.slice(0,5);
                        const foundOption = opts.find(o => o.value.includes(target) || o.text.includes(target));
                        if (foundOption) hourEl.value = foundOption.value; else hourEl.value = restore.time;
                    }
                    await delay(300);
                    if (findBtn) findBtn.click();
                    return;
                } catch (e) { /* continue */ }
            }

            processNextShow(settings);
            return;
        }

        log('Script idle. UI ready.');
    }

    const injectorInterval = setInterval(() => { try { if (!document.getElementById('pmBookerPanel')) injectUi(); } catch (e) {} }, 3000);
    window.addEventListener('beforeunload', () => clearInterval(injectorInterval));

    run().catch(err => logError('Run error:', err));

})();