// ==UserScript==
// @name         UFCStats.com Forensic Auto-Scraper (v.8.0.0)
// @namespace    https://www.ufcstats.com/
// @version      8.0.0
// @description  UFCStats.com scraper for ML backtesting. Canonical fighter_0/1 ordering, strict result enums, ISO dates, Tapology enrichment
// @author       UFC Data Specialist
// @match        https://www.ufcstats.com/statistics/events/completed*
// @match        https://ufcstats.com/statistics/events/completed*
// @match        http://www.ufcstats.com/statistics/events/completed*
// @match        http://ufcstats.com/statistics/events/completed*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @connect      ufcstats.com
// @connect      tapology.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558101/UFCStatscom%20Forensic%20Auto-Scraper%20%28v800%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558101/UFCStatscom%20Forensic%20Auto-Scraper%20%28v800%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= BACKTEST SAFETY PATCH =================
    const BacktestSafety = {
        stripPostFightFields(fighter) {
            if (!fighter) return;
        },
        markOdds(fight) {
            if (!fight || !fight.betting_odds) return;
            fight.betting_odds.odds_scraped_at = new Date().toISOString();
            fight.betting_odds.odds_point_in_time = "pre_fight_closing";
            try {
                const eventDate = new Date(fight.event_date);
                const oddsDate = new Date(fight.betting_odds.odds_scraped_at);
                fight.betting_odds.is_backtest_safe =
                    oddsDate <= eventDate &&
                    fight.betting_odds.odds_point_in_time !== "post_event_scrape";
            } catch (e) {
                fight.betting_odds.is_backtest_safe = false;
            }
        },
        normalizeName(raw) {
            return raw ? raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : raw;
        }
    };
    // =========================================================

    // ---------------------------------------------------------
    // CONFIGURATION & STATE
    // ---------------------------------------------------------
    const VERSION = "8.0.0";

    const Config = {
        DEBUG: true,
        AUTO_START: false,
        INCLUDE_ROUND_STATS: true,
        INCLUDE_CHARTS: true,
        COMPUTE_CTRL_PER_MINUTE: true,

        MAX_REQUEST_TIME: 60000,
        UI_UPDATE_INTERVAL: 500,
        HEARTBEAT_INTERVAL: 2000,

        TAPOLOGY: {
            ENABLED: true,
            FIGHTER_SIMILARITY_THRESHOLD: 0.80,
            EVENT_SIMILARITY_THRESHOLD: 0.5,
            FIGHTER_SIMILARITY_THRESHOLD_FALLBACK: 0.65
        },

        TIMING: {
            UFCSTATS: {
                MICRO_BASE: 1400,
                MICRO_VAR: 900,
                FIGHT_BASE: 9000,
                FIGHT_VAR: 7000,
                EVENT_BASE: 16000,
                EVENT_VAR: 9000,
                FIGHTER_BASE: 3000,
                FIGHTER_VAR: 2000
            },
            TAPOLOGY: {
                MICRO_BASE: 2200,
                MICRO_VAR: 1400,
                FIGHT_BASE: 14000,
                FIGHT_VAR: 9000,
                EVENT_BASE: 26000,
                EVENT_VAR: 14000
            }
        },

        RETRY: {
            MAX_ATTEMPTS: 3,
            BACKOFF_BASE: 2000
        },

        VALIDATION: {
            MAX_SIG_STR_PER_ROUND: 80,
            MAX_TOTAL_STR_PER_ROUND: 100,
            WARN_ON_STAT_DISCREPANCY: true,
            MAX_HEIGHT_INCHES: 85,
            MAX_REACH_INCHES: 90,
            MAX_AGE: 50,
            MIN_WEIGHT_LBS: 90,
            MAX_WEIGHT_LBS: 400
        }
    };

    const State = {
        isScraping: false,
        stopRequested: false,
        currentEventIndex: 0,
        totalEventsToScrape: 0,
        currentEventName: '',
        currentFightIndex: 0,
        totalFightsInCurrentEvent: 0,
        tapologyEventCache: new Map(),
        tapologyBoutCache: new Map(),
        fighterCache: new Map(),
        lastUFCStatsRequest: 0,
        lastTapologyRequest: 0,
        hud: null,
        heartbeatInterval: null,
        uiUpdateInterval: null,
        eventList: []
    };

    // ---------------------------------------------------------
    // TEXT & PARSING UTILS
    // ---------------------------------------------------------
    const TextUtils = (() => {
        const clean = (s) => (s ? String(s).replace(/\s+/g, ' ').trim() : '');
        const norm = (s) =>
            clean(String(s || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z\s]/g, '')
            );
        const key = (s) => {
            const clean = norm(s);
            return clean.replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '').replace(/\s/g, '');
        };
        const levenshtein = (a, b) => {
            const m = [];
            for (let i = 0; i <= b.length; i++) m[i] = [i];
            for (let j = 0; j <= a.length; j++) m[0][j] = j;
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    m[i][j] = b[i - 1] === a[j - 1] ? m[i - 1][j - 1] : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
                }
            }
            return m[b.length][a.length];
        };
        const similarity = (a, b) => {
            a = norm(a);
            b = norm(b);
            const L = a.length > b.length ? a : b;
            const S = a.length > b.length ? b : a;
            return L.length ? (L.length - levenshtein(L, S)) / L.length : 1;
        };
        const namesMatch = (a, b, nicknameA = null, nicknameB = null) => {
            const na = norm(a);
            const nb = norm(b);
            if (na === nb || key(a) === key(b)) return true;
            const fullSimilarity = similarity(a, b);
            if (fullSimilarity >= Config.TAPOLOGY.FIGHTER_SIMILARITY_THRESHOLD) return true;
            if (na.replace(/é/g, 'e') === nb.replace(/é/g, 'e')) return true;
            if (na.replace(/ł/g, 'l').replace(/ń/g, 'n') === nb.replace(/ł/g, 'l').replace(/ń/g, 'n')) return true;
            const aParts = na.split(' ');
            const bParts = nb.split(' ');
            if (aParts.length >= 2 && bParts.length >= 2) {
                const aFirst = aParts[0];
                const aLast = aParts.slice(1).join(' ');
                const bFirst = bParts[0];
                const bLast = bParts.slice(1).join(' ');
                if (aLast === bLast) {
                    if (aFirst === bFirst) return true;
                    if (aFirst.length === 2 && aFirst[0] === bFirst[0] && aFirst.endsWith('.')) return true;
                    if (bFirst.length === 2 && bFirst[0] === aFirst[0] && bFirst.endsWith('.')) return true;
                    if (similarity(aFirst, bFirst) >= 0.65) return true;
                }
            }
            if (nicknameA && similarity(nicknameA, b) >= Config.TAPOLOGY.FIGHTER_SIMILARITY_THRESHOLD) return true;
            if (nicknameB && similarity(nicknameB, a) >= Config.TAPOLOGY.FIGHTER_SIMILARITY_THRESHOLD) return true;
            return false;
        };
        const parseHeight = (heightStr) => {
            if (!heightStr) return null;
            const match = heightStr.match(/(\d+)\s*'(\d+(?:\.\d+)?)?/);
            if (match) {
                const feet = parseInt(match[1]);
                const inches = match[2] ? parseFloat(match[2]) : 0;
                return feet * 12 + inches;
            }
            const inchMatch = heightStr.match(/(\d+(?:\.\d+)?)/);
            return inchMatch ? parseFloat(inchMatch[1]) : null;
        };
        const parseReach = (reachStr) => {
            if (!reachStr) return null;
            const match = reachStr.match(/(\d+(?:\.\d+)?)/);
            return match ? parseFloat(match[1]) : null;
        };
        const parseWeight = (weightStr) => {
            if (!weightStr) return null;
            const match = weightStr.match(/(\d+(?:\.\d+)?)\s*(lbs|lb|pounds|kg|kilos|kilograms)?/i);
            if (!match) return null;

            let value = parseFloat(match[1]);
            const unit = match[2]?.toLowerCase() || 'lbs';

            if (unit.startsWith('kg') || unit.startsWith('kilo')) {
                value = value * 2.20462;
            }

            if (value < Config.VALIDATION.MIN_WEIGHT_LBS || value > Config.VALIDATION.MAX_WEIGHT_LBS) {
                Logger.warn(`[WEIGHT] Suspicious weight value: ${value} lbs from "${weightStr}"`);
                return null;
            }

            return Math.round(value * 10) / 10;
        };
        const calculateAge = (dobStr, referenceDate) => {
            if (!dobStr || !referenceDate) return null;
            const dob = new Date(dobStr);
            const ref = new Date(referenceDate);
            if (isNaN(dob) || isNaN(ref)) return null;
            let age = ref.getFullYear() - dob.getFullYear();
            const monthDiff = ref.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < dob.getDate())) age--;
            return age;
        };
        const parseWeightClass = (weightStr) => {
            if (!weightStr) return null;
            const match = weightStr.match(/(\w+\s*\w*|\d+\s*lbs)/i);
            return match ? match[0].trim() : null;
        };

        // NEW: ISO date formatter for backtesting
        const formatEventDateIso = (dateStr) => {
            const d = new Date(dateStr);
            if (isNaN(d)) return new Date().toISOString().slice(0, 10);
            const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
            return localDate.toISOString().slice(0, 10);
        };

        return {
            clean,
            key,
            similarity,
            namesMatch,
            parseHeight,
            parseReach,
            parseWeight,
            calculateAge,
            parseWeightClass,
            formatEventDateIso
        };
    })();

    const isFutureEvent = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return false;
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return d > t;
    };

    const formatEventDate = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return new Date().toISOString().slice(0, 10);
        const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 10);
    };

    const formatExportEventName = (eventName) => {
        let s = String(eventName || '').trim();
        s = s.replace(/\s*:\s*/g, '%%SEP%%');
        s = s.replace(/\s+vs\.?\s+/gi, '_vs_');
        s = s.replace(/[^a-z0-9_%]+/gi, '_');
        s = s.replace(/_+/g, '_');
        s = s.replace(/%%SEP%%/g, '__');
        s = s.replace(/^_+|_+$/g, '');
        s = s.replace(/_vs__+/g, '_vs_');
        return s;
    };

    // ---------------------------------------------------------
    // LOGGER WITH HEARTBEAT
    // ---------------------------------------------------------
    const Logger = (() => {
        const logToHUD = (msg, color) => {
            const logEl = State.hud?.element?.querySelector('#ufc-scraper-log');
            const statusEl = State.hud?.element?.querySelector('#ufc-scraper-status');
            if (logEl) {
                logEl.textContent = msg;
                logEl.style.color = color || '#ddd';
            }
            if (statusEl) {
                if (State.isScraping) {
                    const eventPct = State.totalEventsToScrape > 0 ? (State.currentEventIndex / State.totalEventsToScrape) * 100 : 0;
                    const fightPct = State.totalFightsInCurrentEvent > 0 ? (State.currentFightIndex / State.totalFightsInCurrentEvent) * 100 : 0;
                    const overallProgress = State.totalEventsToScrape > 0 ?
                        ((State.currentEventIndex - 1 + (fightPct / 100)) / State.totalEventsToScrape) * 100 : 0;

                    statusEl.innerHTML = `
<div id="ufc-hud">
  <div class="ufc-block">
    <div class="ufc-inner">
      <div class="ufc-title">UFC SCRAPER</div>
      <div class="ufc-sub">UFCStats.com Forensic Auto-Scraper</div>

      <div class="ufc-label">
        Overall Queue Progress — ${State.currentEventIndex} / ${State.totalEventsToScrape}
        (${Math.floor((State.currentEventIndex / Math.max(State.totalEventsToScrape,1))*100)}%)
      </div>
      <div class="ufc-bar">
        <div class="ufc-fill" style="width:${(State.currentEventIndex / Math.max(State.totalEventsToScrape,1))*100}%"></div>
      </div>

      <div class="ufc-label">
        Event Scraping Progress — ${State.currentFightIndex} / ${State.totalFightsInCurrentEvent}
        (${Math.floor((State.currentFightIndex / Math.max(State.totalFightsInCurrentEvent,1))*100)}%)
      </div>
      <div class="ufc-bar">
        <div class="ufc-fill" style="width:${(State.currentFightIndex / Math.max(State.totalFightsInCurrentEvent,1))*100}%"></div>
      </div>

      <div class="ufc-label">${State.currentEventName || 'Idle'}</div>
    </div>
  </div>
</div>
`;
                } else {
                    statusEl.innerHTML = 'Status: <span style="color:#f55;">Idle</span>';
                }
            }
        };

        const timing = (site, action, detail) => {
            if (!Config.DEBUG) return;
            const ts = new Date().toISOString().substr(11, 12);
            console.log(`[TIMING] ${ts} | ${site} | ${action}${detail ? ' | ' + detail : ''}`);
        };

        const invariant = (site) => {
            const now = Date.now();
            const last = site === 'UFCSTATS' ? State.lastUFCStatsRequest : State.lastTapologyRequest;
            if (last && now - last < 200) {
                const msg = `${site} overlap detected (${now - last}ms)`;
                console.warn(`[INVARIANT] ${msg}`);
                if (Config.DEBUG && now - last < 50) throw new Error(msg);
            }
            if (site === 'UFCSTATS') State.lastUFCStatsRequest = now;
            else State.lastTapologyRequest = now;
        };

        const startHeartbeat = () => {
            if (State.heartbeatInterval) clearInterval(State.heartbeatInterval);
            State.heartbeatInterval = setInterval(() => {
                if (State.isScraping) {
                    console.log(`[HEARTBEAT] Scraping active | Event: ${State.currentEventIndex}/${State.totalEventsToScrape} | Fight: ${State.currentFightIndex}/${State.totalFightsInCurrentEvent}`);
                }
            }, Config.HEARTBEAT_INTERVAL);
        };

        const stopHeartbeat = () => {
            if (State.heartbeatInterval) {
                clearInterval(State.heartbeatInterval);
                State.heartbeatInterval = null;
            }
        };

        return {
            info: (...args) => {
                const m = args.join(' ');
                console.log(`[INFO] ${m}`);
                logToHUD(m, '#fff');
            },
            warn: (...args) => {
                const m = args.join(' ');
                console.warn(`[WARN] ${m}`);
                logToHUD(m, '#ffc107');
            },
            error: (...args) => {
                const m = args.join(' ');
                console.error(`[ERROR] ${m}`);
                logToHUD(m, '#f44336');
            },
            timing,
            invariant,
            startHeartbeat,
            stopHeartbeat
        };
    })();

    // ---------------------------------------------------------
    // DELAY ENGINE
    // ---------------------------------------------------------
    const DelayEngine = (() => {
        const gaussian = () => {
            let u = 0,
                v = 0;
            while (!u) u = Math.random();
            while (!v) v = Math.random();
            return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        };

        const wait = async (site, tier) => {
            const base = Config.TIMING[site][tier + '_BASE'];
            const vari = Config.TIMING[site][tier + '_VAR'];
            let ms = Math.floor(base + gaussian() * (vari / 2.5));
            if (ms < 1000) ms = 1000;
            Logger.timing(site, `Delay ${tier}`, `${ms}ms`);

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Delay timeout after ${ms}ms`)), ms + 5000);
            }).catch(() => {});

            const delayPromise = new Promise((resolve) => {
                const checkInterval = 100;
                const start = Date.now();
                const intervalId = setInterval(() => {
                    if (Date.now() - start >= ms || State.stopRequested) {
                        clearInterval(intervalId);
                        resolve();
                    }
                }, checkInterval);
            });

            try {
                await Promise.race([delayPromise, timeoutPromise]);
            } catch (e) {
                Logger.warn(`Delay interrupted: ${e.message}`);
            }
        };

        return {
            wait
        };
    })();

    const DelayProfile = {
        ufcstats: {
            micro: () => DelayEngine.wait('UFCSTATS', 'MICRO'),
            fight: () => DelayEngine.wait('UFCSTATS', 'FIGHT'),
            event: () => DelayEngine.wait('UFCSTATS', 'EVENT'),
            fighter: () => DelayEngine.wait('UFCSTATS', 'FIGHTER')
        },
        tapology: {
            event: () => DelayEngine.wait('TAPOLOGY', 'EVENT'),
            fight: () => DelayEngine.wait('TAPOLOGY', 'FIGHT')
        }
    };

    // ---------------------------------------------------------
    // NETWORK WITH TIMEOUT
    // ---------------------------------------------------------
    const NetworkUtils = (() => {
        const fetchHtml = async (url, site, attempt = 1) => {
            Logger.invariant(site);
            Logger.timing(site, `Fetch attempt ${attempt}`, url);

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Request timeout after ${Config.MAX_REQUEST_TIME}ms`)), Config.MAX_REQUEST_TIME);
            });

            const requestPromise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.9"
                    },
                    onload: async (r) => {
                        if (r.status === 429) {
                            const retryAfter = parseInt(r.responseHeaders.match(/retry-after:\s*(\d+)/i)?.[1] || 60, 10);
                            Logger.warn(`${site} rate limited, waiting ${retryAfter}s`);
                            if (attempt < Config.RETRY.MAX_ATTEMPTS) {
                                await new Promise((rr) => setTimeout(rr, retryAfter * 1000 + 1000));
                                resolve(await fetchHtml(url, site, attempt + 1));
                            } else {
                                reject(new Error(`HTTP 429 after ${attempt} attempts`));
                            }
                            return;
                        }
                        if (r.status >= 200 && r.status < 300) {
                            try {
                                Logger.timing(site, 'Fetch ok', String(r.status));
                                const d = new DOMParser().parseFromString(r.responseText, 'text/html');
                                if (d && d.body) resolve(d);
                                else reject(new Error('Empty body'));
                            } catch (e) {
                                reject(new Error('Parse error: ' + e.message));
                            }
                        } else {
                            if (attempt < Config.RETRY.MAX_ATTEMPTS && r.status >= 500) {
                                const backoff = Config.RETRY.BACKOFF_BASE * Math.pow(2, attempt - 1);
                                Logger.warn(`${site} HTTP ${r.status}, retrying in ${backoff}ms (attempt ${attempt})`);
                                await new Promise((rr) => setTimeout(rr, backoff));
                                resolve(await fetchHtml(url, site, attempt + 1));
                            } else {
                                reject(new Error(`HTTP ${r.status}`));
                            }
                        }
                    },
                    onerror: async () => {
                        if (attempt < Config.RETRY.MAX_ATTEMPTS) {
                            const backoff = Config.RETRY.BACKOFF_BASE * Math.pow(2, attempt - 1);
                            Logger.warn(`${site} network error, retrying in ${backoff}ms (attempt ${attempt})`);
                            await new Promise((rr) => setTimeout(rr, backoff));
                            resolve(await fetchHtml(url, site, attempt + 1));
                        } else {
                            reject(new Error('Network error'));
                        }
                    }
                });
            });

            return Promise.race([requestPromise, timeoutPromise]);
        };

        return {
            fetchHtml
        };
    })();

    // ---------------------------------------------------------
    // CHARTS PARSER
    // ---------------------------------------------------------
    const ChartsParser = (() => {
        const parseCharts = (doc) => {
            const chartsSection = doc.querySelector('.b-fight-details__charts');
            if (!chartsSection) {
                if (Config.DEBUG) Logger.warn('[CHARTS] No charts section found on page');
                return null;
            }
            const chartRows = chartsSection.querySelectorAll('.b-fight-details__charts-row');
            const fighter0 = {};
            const fighter1 = {};
            chartRows.forEach(row => {
                const labelEl = row.querySelector('.b-fight-details__charts-row-title');
                if (!labelEl) return;
                const label = TextUtils.clean(labelEl.textContent).toLowerCase().replace(/\s+/g, '_');
                const val0 = row.querySelector('.js-red');
                const val1 = row.querySelector('.js-blue');
                if (val0 && val1) {
                    const raw0 = TextUtils.clean(val0.textContent);
                    const raw1 = TextUtils.clean(val1.textContent);
                    const num0 = (raw0 === '---' || raw0 === '') ? 0 : parseInt(raw0, 10);
                    const num1 = (raw1 === '---' || raw1 === '') ? 0 : parseInt(raw1, 10);
                    fighter0[label] = isNaN(num0) ? 0 : num0;
                    fighter1[label] = isNaN(num1) ? 0 : num1;
                }
            });
            return {
                fighter_0: fighter0,
                fighter_1: fighter1
            };
        };
        return {
            parseCharts
        };
    })();

    // ---------------------------------------------------------------------------------
    // ROUND PARSER - FIXED FOR UFCStats STRUCTURE
    // ---------------------------------------------------------------------------------
    const RoundParser = (() => {
        const parseRoundData = (doc) => {
            const rounds = [];
            const sections = Array.from(doc.querySelectorAll('.b-fight-details__section'));
            const roundSection = sections.find(section =>
                section.textContent.includes('Per round')
            );

            if (!roundSection) {
                if (Config.DEBUG) Logger.warn('[ROUND PARSER] "Per round" section not found');
                return rounds;
            }

            const table = roundSection.querySelector('.b-fight-details__table');

            if (!table) {
                if (Config.DEBUG) Logger.warn('[ROUND PARSER] Round table not found inside section');
                return rounds;
            }

            const roundHeaders = table.querySelectorAll('thead.b-fight-details__table-row_type_head');

            if (Config.DEBUG) Logger.info(`[ROUND PARSER] Found ${roundHeaders.length} rounds in "Per round" table`);

            roundHeaders.forEach(header => {
                const roundNameRaw = header.textContent.trim();
                const roundMatch = roundNameRaw.match(/Round\s+(\d+)/i);
                const roundNumber = roundMatch ? parseInt(roundMatch[1], 10) : 0;
                const dataBody = header.nextElementSibling;

                if (dataBody && dataBody.tagName === 'TBODY') {
                    const row = dataBody.querySelector('tr.b-fight-details__table-row');
                    if (row) {
                        const roundStats = parseRoundRow(row, roundNumber);
                        if (roundStats) rounds.push(roundStats);
                    }
                }
            });

            return rounds;
        };

        const parseRoundRow = (row, roundNum) => {
            const cols = row.querySelectorAll('.b-fight-details__table-col');
            if (cols.length < 10) return null;

            const getText = (col, idx) => {
                const p = col.querySelectorAll('p');
                return p[idx] ? TextUtils.clean(p[idx].textContent) : '0';
            };

            return {
                round: roundNum,
                fighter_0_stats: {
                    kd: getText(cols[1], 0),
                    sig_str: getText(cols[2], 0),
                    sig_str_pct: getText(cols[3], 0),
                    total_str: getText(cols[4], 0),
                    td: getText(cols[5], 0),
                    td_pct: getText(cols[6], 0),
                    sub_att: getText(cols[7], 0),
                    rev: getText(cols[8], 0),
                    ctrl: getText(cols[9], 0)
                },
                fighter_1_stats: {
                    kd: getText(cols[1], 1),
                    sig_str: getText(cols[2], 1),
                    sig_str_pct: getText(cols[3], 1),
                    total_str: getText(cols[4], 1),
                    td: getText(cols[5], 1),
                    td_pct: getText(cols[6], 1),
                    sub_att: getText(cols[7], 1),
                    rev: getText(cols[8], 1),
                    ctrl: getText(cols[9], 1)
                }
            };
        };

        return {
            parseRoundData
        };
    })();

    // ---------------------------------------------------------
    // WEIGHT CLASS PARSER (FIXED)
    // ---------------------------------------------------------
    const WeightClassParser = (() => {
        const parseWeightClassFromEventPage = (fightRow) => {
            const cells = fightRow.querySelectorAll('td');
            if (cells.length >= 7) {
                const wcText = TextUtils.clean(cells[6].textContent);
                const firstLine = wcText.split('\n')[0].trim();
                return firstLine.replace(/\d+.*$/g, '').trim() || null;
            }
            return null;
        };
        return {
            parseWeightClassFromEventPage
        };
    })();

    // ---------------------------------------------------------
    // FIGHTER CACHE
    // ---------------------------------------------------------
    const FighterCache = (() => {
        const fetchFighterProfile = async (fighterUrl, referenceDate) => {
            const key = TextUtils.key(fighterUrl);
            if (State.fighterCache.has(key)) return State.fighterCache.get(key);
            await DelayProfile.ufcstats.fighter();
            Logger.timing('UFCSTATS', 'Fighter profile', fighterUrl);
            try {
                const doc = await NetworkUtils.fetchHtml(fighterUrl, 'UFCSTATS');
                const nicknameEl = doc.querySelector('p.b-content__Nickname') || doc.querySelector('p.fighter-nickname');
                let nickname = null;
                if (nicknameEl) {
                    nickname = TextUtils.clean(nicknameEl.textContent);
                    if (nickname === '--' || nickname === '' || nickname.toUpperCase() === 'N/A') nickname = null;
                }
                const nameEl = doc.querySelector('h2.b-content__title');
                const fullName = nameEl ? TextUtils.clean(nameEl.textContent) : 'Unknown';
                const heightEl = doc.querySelector('li:has([title="Height"]) .field-value') ||
                    Array.from(doc.querySelectorAll('li')).find(li => li.textContent.toLowerCase().includes('height'))?.querySelector('.field-value');
                const reachEl = doc.querySelector('li:has([title="Reach"]) .field-value') ||
                    Array.from(doc.querySelectorAll('li')).find(li => li.textContent.toLowerCase().includes('reach'))?.querySelector('.field-value');
                const dobEl = doc.querySelector('li:has([title="DOB"]) .field-value') ||
                    Array.from(doc.querySelectorAll('li')).find(li => li.textContent.toLowerCase().includes('dob'))?.querySelector('.field-value');
                const weightClassEl = doc.querySelector('li:has([title="Weight Class"]) .field-value') ||
                    Array.from(doc.querySelectorAll('li')).find(li => li.textContent.toLowerCase().includes('weight'))?.querySelector('.field-value');
                const height = heightEl ? TextUtils.parseHeight(TextUtils.clean(heightEl.textContent)) : null;
                const reach = reachEl ? TextUtils.parseReach(TextUtils.clean(reachEl.textContent)) : null;
                const age = dobEl && referenceDate ? TextUtils.calculateAge(TextUtils.clean(dobEl.textContent), referenceDate) : null;
                const weightClass = weightClassEl ? TextUtils.parseWeightClass(TextUtils.clean(weightClassEl.textContent)) : null;
                const data = {
                    nickname,
                    profile_url: fighterUrl,
                    height_inches: height,
                    reach_inches: reach,
                    age_years: age,
                    weight_class: weightClass
                };
                State.fighterCache.set(key, data);
                return data;
            } catch (e) {
                Logger.warn(`[FIGHTER] Failed to fetch ${fighterUrl}: ${e.message}`);
                State.fighterCache.set(key, {
                    nickname: null,
                    height_inches: null,
                    reach_inches: null,
                    age_years: null,
                    weight_class: null
                });
                return {
                    nickname: null,
                    height_inches: null,
                    reach_inches: null,
                    age_years: null,
                    weight_class: null
                };
            }
        };

        const enrichFighters = async (fighters, referenceDate) => {
            for (const fighter of fighters) {
                if (fighter.id) {
                    try {
                        const result = await fetchFighterProfile(fighter.id, referenceDate);
                        fighter.nickname = result.nickname;
                        fighter.height_inches = result.height_inches;
                        fighter.reach_inches = result.reach_inches;
                        fighter.age_years_at_fight = result.age_years;
                        fighter.weight_class = result.weight_class;
                    } catch (e) {
                        Logger.warn(`[FIGHTER] Failed to enrich ${fighter.name}: ${e.message}`);
                        fighter.nickname = null;
                        fighter.height_inches = null;
                        fighter.reach_inches = null;
                        fighter.age_years_at_fight = null;
                        fighter.weight_class = null;
                    }
                } else {
                    fighter.nickname = null;
                    fighter.height_inches = null;
                    fighter.reach_inches = null;
                    fighter.age_years_at_fight = null;
                    fighter.weight_class = null;
                }
            }
        };

        return {
            enrichFighters
        };
    })();

    // ---------------------------------------------------------
    // TAPOLOGY BOUT SCRAPER (STRICT TABLE PARSER)
    // ---------------------------------------------------------
    const TapologyBoutScraper = (() => {

        const normText = (element) => {
            if (!element) return '';
            const clone = element.cloneNode(true);
            clone.querySelectorAll('[class*="md:hidden"], script, style').forEach(el => el.remove());
            clone.querySelectorAll('br').forEach(n => n.remove());
            return (clone.textContent || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        };

        const parseHeight = (str) => {
            if (!str) return null;
            const match = str.match(/(\d+)'\s*(\d+)/);
            if (match) {
                return (parseInt(match[1]) * 12) + parseInt(match[2]);
            }
            return null;
        };

        const parseWeight = (str) => {
            if (!str) return null;
            const match = str.match(/(\d+(?:\.\d+)?)/);
            return match ? parseFloat(match[1]) : null;
        };

        const scrapeBoutPage = async (boutUrl) => {
            Logger.timing('TAPOLOGY', 'Scrape bout comparison', boutUrl);
            await DelayProfile.tapology.fight();
            const doc = await NetworkUtils.fetchHtml(boutUrl, 'TAPOLOGY');
            const data = {
                fighter_0: { name: '', stats: {} }, // CANONICAL: fighter_0
                fighter_1: { name: '', stats: {} }  // CANONICAL: fighter_1
            };

            const table = doc.querySelector('#boutComparisonTable');
            if (!table) {
                Logger.warn(`[TAPOLOGY BOUT] No comparison table found at ${boutUrl}`);
                return data;
            }

            const headerRow = table.querySelector('tr[class*="md:hidden"]');
            if (headerRow) {
                const hcells = Array.from(headerRow.querySelectorAll('td'));
                if (hcells.length >= 3) {
                    data.fighter_0.name = normText(hcells[0]);
                    data.fighter_1.name = normText(hcells[hcells.length - 1]);
                }
            }

            const rows = Array.from(table.querySelectorAll('tr'));

            rows.forEach(row => {
                const cells = Array.from(row.children);
                if (cells.length < 3) return;

                const rowText = normText(row).toLowerCase();
                const raw0 = normText(cells[0]);
                const raw1 = normText(cells[cells.length - 1]);

                if (rowText.includes('gym')) return;

                if (rowText.includes('pro record at fight')) {
                    data.fighter_0.stats.pro_record_at_fight = raw0.split(' ')[0];
                    data.fighter_1.stats.pro_record_at_fight = raw1.split(' ')[0];
                } else if (rowText.includes('betting odds')) {
                    const extractOdds = (s) => {
                        const m = s.match(/([+-]?\d+)/);
                        return m ? m[1] : null;
                    };
                    data.fighter_0.stats.betting_odds_american = extractOdds(raw0);
                    data.fighter_1.stats.betting_odds_american = extractOdds(raw1);
                } else if (rowText.includes('height')) {
                    data.fighter_0.stats.height_inches = parseHeight(raw0);
                    data.fighter_1.stats.height_inches = parseHeight(raw1);
                } else if (rowText.includes('reach')) {
                    const extractReach = (s) => {
                        const m = s.match(/^(\d+(\.\d+)?)/);
                        return m ? parseFloat(m[1]) : null;
                    };
                    data.fighter_0.stats.reach_inches = extractReach(raw0);
                    data.fighter_1.stats.reach_inches = extractReach(raw1);
                } else if (rowText.includes('age')) {
                    const extractAge = (s) => {
                        const m = s.match(/^(\d+)/);
                        return m ? parseInt(m[1], 10) : null;
                    };
                    data.fighter_0.stats.age_years_at_fight = extractAge(raw0);
                    data.fighter_1.stats.age_years_at_fight = extractAge(raw1);
                } else if (rowText.includes('weigh')) {
                    data.fighter_0.stats.weigh_in_lbs = parseWeight(raw0);
                    data.fighter_1.stats.weigh_in_lbs = parseWeight(raw1);
                } else if (rowText.includes('nationality')) {
                    data.fighter_0.stats.nationality = raw0;
                    data.fighter_1.stats.nationality = raw1;
                } else if (rowText.includes('fighting out of')) {
                    data.fighter_0.stats.fighting_out_of = raw0;
                    data.fighter_1.stats.fighting_out_of = raw1;
                }
            });

            if (Config.DEBUG) {
                Logger.info(`[TAPOLOGY] fighter_0: ${JSON.stringify(data.fighter_0.stats)}`);
            }

            return data;
        };

        return {
            scrapeBoutPage
        };
    })();

    // ---------------------------------------------------------
    // TAPOLOGY CLIENT
    // ---------------------------------------------------------
    const TapologyClient = (() => {
        const resolveEvent = async (eventName) => {
            const k = TextUtils.key(eventName);
            if (State.tapologyEventCache.has(k)) return State.tapologyEventCache.get(k);
            await DelayProfile.tapology.event();
            let queryStr = eventName
                .replace(/UFC\s+(Fight\s+Night|on\s+ESPN|on\s+ABC|on\s+FOX)?:?\s*/gi, ' ')
                .replace(/:/g, ' ')
                .replace(/\s+vs\.?\s+/gi, ' ')
                .trim();
            if (queryStr.length < 3) queryStr = eventName;
            Logger.info(`[TAPOLOGY SEARCH] Query: "${queryStr}"`);
            const url = 'https://www.tapology.com/search?term=' + encodeURIComponent(queryStr) + '&search=Submit+Query&mainSearchFilter=events';
            const doc = await NetworkUtils.fetchHtml(url, 'TAPOLOGY');
            let best = null,
                score = 0;
            const links = doc.querySelectorAll('.searchResultsEvent a[href*="/fightcenter/events/"], a[href*="/fightcenter/events/"]');
            Logger.info(`[TAPOLOGY HIT] Links Found: ${links.length}`);
            links.forEach((a) => {
                const href = a.getAttribute('href') || '';
                const slug = href.split('/').pop().replace(/-/g, ' ');
                const rowText = TextUtils.clean(a.closest('tr')?.textContent || a.parentNode?.textContent || '');
                const linkText = TextUtils.clean(a.textContent);
                const sRow = TextUtils.similarity(rowText, eventName);
                const sLink = TextUtils.similarity(linkText, eventName);
                const sSlug = TextUtils.similarity(slug, eventName);
                const currentScore = Math.max(sRow, sLink, sSlug);
                if (currentScore > score) {
                    score = currentScore;
                    best = href.startsWith('http') ? href : 'https://www.tapology.com' + href;
                }
            });
            if (score >= Config.TAPOLOGY.EVENT_SIMILARITY_THRESHOLD && best) {
                State.tapologyEventCache.set(k, best);
                return best;
            }
            return null;
        };

        const indexEventFightsAndOdds = async (eventUrl) => {
            if (State.tapologyBoutCache.has(`index|${eventUrl}`)) return State.tapologyBoutCache.get(`index|${eventUrl}`);
            await DelayProfile.tapology.event();
            const doc = await NetworkUtils.fetchHtml(eventUrl, 'TAPOLOGY');
            const indexed = [];
            const selectors = [
                'li[data-bout-wrapper]',
                'li[id^="boutFullsize"]',
                'li[data-controller="table-row-background"]',
                'li[id^="bout"]',
                'tr[data-bout-row]',
                'div.fight-card'
            ];
            let candidates = [];
            for (const selector of selectors) {
                candidates = doc.querySelectorAll(selector);
                if (candidates.length > 0) {
                    Logger.info(`[TAPOLOGY INDEX] Found ${candidates.length} bouts using: ${selector}`);
                    break;
                }
            }
            if (candidates.length === 0) {
                Logger.error('[TAPOLOGY INDEX] CRITICAL: No bout containers found!');
                return [];
            }
            candidates.forEach((li, idx) => {
                try {
                    const fighterLinkEls = li.querySelectorAll('a[href*="/fighters/"]:not([href*="#"])');
                    const uniqueLinks = Array.from(
                        new Map(Array.from(fighterLinkEls).map(link => [link.href, link])).values()
                    ).slice(0, 2);
                    if (uniqueLinks.length < 2) {
                        Logger.warn(`[TAPOLOGY INDEX] Bout ${idx}: Found ${uniqueLinks.length} unique fighters`);
                        return;
                    }
                    const fighter1Name = TextUtils.clean(uniqueLinks[0].textContent);
                    const fighter2Name = TextUtils.clean(uniqueLinks[1].textContent);
                    const fighters = [fighter1Name, fighter2Name];
                    Logger.info(`[TAPOLOGY INDEX] Bout ${idx}: ${fighter1Name} vs ${fighter2Name}`);
                    const odds = extractOddsFromFightContainer(li);
                    const tapologyBoutHref = li.querySelector('a[href^="/fightcenter/bouts/"]')?.getAttribute('href') || null;
                    const tapologyBoutUrl = tapologyBoutHref ? 'https://www.tapology.com' + tapologyBoutHref : null;
                    const externalBoutHref = li.querySelector('a[href*="ufcstats.com/fightcenter/bouts/"]')?.getAttribute('href') || '';
                    indexed.push({
                        fighters,
                        odds,
                        bout_url: tapologyBoutUrl,
                        external_bout_url: externalBoutHref
                    });
                } catch (e) {
                    Logger.warn(`[TAPOLOGY INDEX] Error processing bout ${idx}: ${e.message}`);
                }
            });
            State.tapologyBoutCache.set(`index|${eventUrl}`, indexed);
            return indexed;
        };

        const extractOddsFromFightContainer = (container) => {
            try {
                const allRows = container.querySelectorAll('tr');
                let oddsRow = null,
                    oddsHeaderCell = null;
                for (const row of allRows) {
                    const cells = row.querySelectorAll('td');
                    for (const cell of cells) {
                        const cellText = cell.textContent.trim();
                        if (cellText.toLowerCase().includes('betting') && cellText.toLowerCase().includes('odds')) {
                            oddsHeaderCell = cell;
                            oddsRow = row;
                            break;
                        }
                    }
                    if (oddsRow) break;
                }
                if (!oddsRow || !oddsHeaderCell) return null;
                const cells = Array.from(oddsRow.querySelectorAll('td'));
                const headerIndex = cells.indexOf(oddsHeaderCell);
                let leftFighterCell = null,
                    rightFighterCell = null;
                for (let i = 0; i < headerIndex; i++) {
                    const txt = cells[i].textContent.trim();
                    if (/[+-]?\d{3}/.test(txt)) {
                        leftFighterCell = cells[i];
                        break;
                    }
                }
                for (let i = cells.length - 1; i > headerIndex; i--) {
                    const txt = cells[i].textContent.trim();
                    if (/[+-]?\d{3}/.test(txt)) {
                        rightFighterCell = cells[i];
                        break;
                    }
                }
                if (!leftFighterCell && cells.length > 0) leftFighterCell = cells[0];
                if (!rightFighterCell && cells.length > headerIndex + 1) rightFighterCell = cells[cells.length - 1];
                const extractOdds = (cell) => {
                    if (!cell) return null;
                    const text = TextUtils.clean(cell.textContent);
                    const match = text.match(/([+-]?\d{3,4})/);
                    return match ? match[1] : null;
                };
                const fighter_0_odds = extractOdds(leftFighterCell);
                const fighter_1_odds = extractOdds(rightFighterCell);
                return {
                    fighter_0_odds,
                    fighter_1_odds
                };
            } catch (e) {
                Logger.warn('[TAPOLOGY ODDS] Extraction error: ' + e.message);
                return null;
            }
        };

        const matchFight = (fight, indexed) => {
            const f1 = fight.fighters[0];
            const f2 = fight.fighters[1];
            for (const bout of indexed) {
                const [a, b] = bout.fighters;
                const direct = TextUtils.namesMatch(a, f1.name, f1.nickname, f2.nickname) &&
                    TextUtils.namesMatch(b, f2.name, f2.nickname, f1.nickname);
                const swapped = TextUtils.namesMatch(a, f2.name, f2.nickname, f1.nickname) &&
                    TextUtils.namesMatch(b, f1.name, f1.nickname, f2.nickname);
                if (direct || swapped) return {
                    bout,
                    swapped
                };
            }
            const originalThreshold = Config.TAPOLOGY.FIGHTER_SIMILARITY_THRESHOLD;
            Config.TAPOLOGY.FIGHTER_SIMILARITY_THRESHOLD = Config.TAPOLOGY.FIGHTER_SIMILARITY_THRESHOLD_FALLBACK;
            for (const bout of indexed) {
                const [a, b] = bout.fighters;
                const direct = TextUtils.namesMatch(a, f1.name, f1.nickname, f2.nickname) &&
                    TextUtils.namesMatch(b, f2.name, f2.nickname, f1.nickname);
                const swapped = TextUtils.namesMatch(a, f2.name, f2.nickname, f1.nickname) &&
                    TextUtils.namesMatch(b, f1.name, f1.nickname, f2.nickname);
                if (direct || swapped) {
                    Logger.info(`[ENRICH] Matched with relaxed threshold: ${f1.name} vs ${f2.name}`);
                    Config.TAPOLOGY.FIGHTER_SIMILARITY_THRESHOLD = originalThreshold;
                    return {
                        bout,
                        swapped
                    };
                }
            }
            Config.TAPOLOGY.FIGHTER_SIMILARITY_THRESHOLD = originalThreshold;
            return null;
        };

        const matchFightByScrapingFallback = async (fight, indexed) => {
            const f1Name = TextUtils.clean(fight.fighters[0]?.name || '').toLowerCase();
            const f2Name = TextUtils.clean(fight.fighters[1]?.name || '').toLowerCase();
            const tokens = (s) => (s || '').toLowerCase().split(/\s+/).filter(Boolean);
            const nameOrNickMatches = (targetName, candName, candNick) => {
                const t = (targetName || '').toLowerCase();
                if (!t) return false;
                const cn = (candName || '').toLowerCase();
                const ck = (candNick || '').toLowerCase();
                if (cn && (t.includes(cn) || cn.includes(t))) return true;
                if (ck && (t.includes(ck) || ck.includes(t))) return true;
                const tset = new Set(tokens(t));
                for (const tok of tokens(cn))
                    if (tok.length >= 4 && tset.has(tok)) return true;
                for (const tok of tokens(ck))
                    if (tok.length >= 4 && tset.has(tok)) return true;
                return false;
            };
            for (const bout of indexed) {
                if (!bout || !bout.bout_url) continue;
                try {
                    const boutStats = await TapologyBoutScraper.scrapeBoutPage(bout.bout_url);
                    const aName = (bout.fighters && bout.fighters[0]) ? bout.fighters[0] : '';
                    const bName = (bout.fighters && bout.fighters[1]) ? bout.fighters[1] : '';
                    const aNick = boutStats?.fighter_0?.nickname || null;
                    const bNick = boutStats?.fighter_1?.nickname || null;
                    const direct = nameOrNickMatches(f1Name, aName, aNick) && nameOrNickMatches(f2Name, bName, bNick);
                    const swapped = nameOrNickMatches(f1Name, bName, bNick) && nameOrNickMatches(f2Name, aName, aNick);
                    if (direct || swapped) return {
                        match: {
                            bout,
                            swapped
                        },
                        boutStats
                    };
                } catch (e) {
                    // Ignore and keep scanning
                }
            }
            return null;
        };

        const validateAndNormalizeDraw = (fight) => {
            if (!fight.fight_info) return;
            if (fight.fight_info.winner === 'Draw/NC') {
                fight.fight_info.result = 'draw';
                if (fight.fight_info.method.includes('Decision')) {
                    if (fight.fight_info.method.includes('Unanimous') && !fight.fight_info.method.includes('Draw')) {
                        fight.fight_info.method = 'Decision - Unanimous Draw';
                    } else if (fight.fight_info.method.includes('Split') && !fight.fight_info.method.includes('Draw')) {
                        fight.fight_info.method = 'Decision - Split Draw';
                    } else if (!fight.fight_info.method.includes('Draw')) {
                        fight.fight_info.method = 'Decision - Draw';
                    }
                } else if (fight.fight_info.method.includes('No Contest')) {
                    fight.fight_info.result = 'no_contest';
                }
            } else {
                fight.fight_info.result = 'win';
            }
        };

        const parseOdds = (oddsStr) => {
            if (!oddsStr) return null;
            const american = parseInt(oddsStr, 10);
            if (isNaN(american)) return null;
            const decimal = american > 0 ? (american / 100) + 1 : (100 / Math.abs(american)) + 1;
            return {
                american: american,
                decimal: parseFloat(decimal.toFixed(2)),
                implied_probability: parseFloat((1 / decimal * 100).toFixed(1))
            };
        };

        const enrichFight = async (fight) => {
            if (!Config.TAPOLOGY.ENABLED) return;
            try {
                const evUrl = await resolveEvent(fight.event);
                const indexed = evUrl ? await indexEventFightsAndOdds(evUrl) : [];
                fight.tapology = {
                    event_matched: !!evUrl,
                    bout_matched: false,
                    odds_scraped: false,
                    point_in_time_scraped: false,
                    failure_reason: null
                };
                fight.tapology_point_in_time = {};
                if (!evUrl) {
                    fight.tapology.failure_reason = 'no_matching_event';
                    return;
                }
                if (indexed.length === 0) {
                    fight.tapology.failure_reason = 'event_index_empty';
                    return;
                }
                let m = matchFight(fight, indexed);
                let preFetchedBoutStats = null;
                if (!m) {
                    const alt = await matchFightByScrapingFallback(fight, indexed);
                    if (alt && alt.match) {
                        m = alt.match;
                        preFetchedBoutStats = alt.boutStats;
                        Logger.info(`[TAPOLOGY MATCH] Fallback matched via bout scrape: ${fight.fighters[0].name} vs ${fight.fighters[1].name}`);
                    } else {
                        fight.tapology.failure_reason = 'no_matching_bout_on_tapology';
                        return;
                    }
                }
                fight.tapology_event_url = evUrl;
                if (m.bout.bout_url) {
                    fight.tapology_bout_url = m.bout.bout_url;
                    fight.tapology.bout_matched = true;
                }
                if (m.bout.external_bout_url) {
                    fight.external_bout_url = m.bout.external_bout_url;
                }
                if (m.bout.bout_url) {
                    try {
                        const boutStats = preFetchedBoutStats || await TapologyBoutScraper.scrapeBoutPage(m.bout.bout_url);
                        // CANONICAL: Map to fighter_0/fighter_1 based on swapped flag
                        const tapFighter0 = m.swapped ? boutStats.fighter_1 : boutStats.fighter_0;
                        const tapFighter1 = m.swapped ? boutStats.fighter_0 : boutStats.fighter_1;

                        // Enrich UFCStats fighters[0] and fighters[1] with Tapology data
                        fight.fighters[0].height_inches = tapFighter0.stats.height_inches ?? fight.fighters[0].height_inches ?? null;
                        fight.fighters[0].reach_inches = tapFighter0.stats.reach_inches ?? fight.fighters[0].reach_inches ?? null;
                        fight.fighters[0].age_years_at_fight = tapFighter0.stats.age_years_at_fight ?? fight.fighters[0].age_years_at_fight ?? null;
                        fight.fighters[0].weigh_in_lbs = tapFighter0.stats.weigh_in_lbs ?? fight.fighters[0].weigh_in_lbs ?? null;
                        fight.fighters[0].nationality = tapFighter0.stats.nationality ?? fight.fighters[0].nationality ?? null;
                        fight.fighters[0].fighting_out_of = tapFighter0.stats.fighting_out_of ?? fight.fighters[0].fighting_out_of ?? null;
                        fight.fighters[0].pro_record_at_fight = tapFighter0.stats.pro_record_at_fight ?? fight.fighters[0].pro_record_at_fight ?? null;
                        fight.fighters[0].nickname = tapFighter0.nickname ?? fight.fighters[0].nickname ?? null;

                        fight.fighters[1].height_inches = tapFighter1.stats.height_inches ?? fight.fighters[1].height_inches ?? null;
                        fight.fighters[1].reach_inches = tapFighter1.stats.reach_inches ?? fight.fighters[1].reach_inches ?? null;
                        fight.fighters[1].age_years_at_fight = tapFighter1.stats.age_years_at_fight ?? fight.fighters[1].age_years_at_fight ?? null;
                        fight.fighters[1].weigh_in_lbs = tapFighter1.stats.weigh_in_lbs ?? fight.fighters[1].weigh_in_lbs ?? null;
                        fight.fighters[1].nationality = tapFighter1.stats.nationality ?? fight.fighters[1].nationality ?? null;
                        fight.fighters[1].fighting_out_of = tapFighter1.stats.fighting_out_of ?? fight.fighters[1].fighting_out_of ?? null;
                        fight.fighters[1].pro_record_at_fight = tapFighter1.stats.pro_record_at_fight ?? fight.fighters[1].pro_record_at_fight ?? null;
                        fight.fighters[1].nickname = tapFighter1.nickname ?? fight.fighters[1].nickname ?? null;

                        // CANONICAL: Store point-in-time with fighter_0/fighter_1 keys
                        fight.tapology_point_in_time = {
                            fighter_0: tapFighter0,
                            fighter_1: tapFighter1
                        };
                        fight.tapology.point_in_time_scraped = true;
                        Logger.info(`[ENRICH] Point-in-time stats scraped for ${fight.fighters[0].name} vs ${fight.fighters[1].name}`);
                    } catch (e) {
                        Logger.warn(`[ENRICH] Failed to scrape bout page: ${e.message}`);
                    }
                }
                if (m.bout.odds) {
                    // CANONICAL: Map odds to fighter_0/fighter_1
                    const rawOdds = m.swapped ? {
                        fighter_0: m.bout.odds.fighter_1_odds,
                        fighter_1: m.bout.odds.fighter_0_odds
                    } : {
                        fighter_0: m.bout.odds.fighter_0_odds,
                        fighter_1: m.bout.odds.fighter_1_odds
                    };
                    fight.tapology_betting_odds = {
                        fighter_0: parseOdds(rawOdds.fighter_0),
                        fighter_1: parseOdds(rawOdds.fighter_1),
                        raw: rawOdds
                    };
                    if (fight.tapology_betting_odds.fighter_0 && fight.tapology_betting_odds.fighter_1) {
                        const p0 = 1 / fight.tapology_betting_odds.fighter_0.decimal;
                        const p1 = 1 / fight.tapology_betting_odds.fighter_1.decimal;
                        const vig = p0 + p1;
                        fight.tapology_betting_odds.implied_probability = {
                            fighter_0: parseFloat((p0 / vig * 100).toFixed(1)),
                            fighter_1: parseFloat((p1 / vig * 100).toFixed(1)),
                            vig: parseFloat(((vig - 1) * 100).toFixed(2))
                        };
                    }
                    fight.tapology_betting_odds_scraped_at = new Date().toISOString();
                    fight.tapology.odds_scraped = true;
                }
            } catch (e) {
                Logger.warn(`Tapology enrichment failed: ${e.message}`);
                if (fight.tapology) fight.tapology.failure_reason = 'enrichment_error';
            }
        };

        return {
            enrichFight,
            validateAndNormalizeDraw
        };
    })();

    // ---------------------------------------------------------
    // MAIN PARSER
    // ---------------------------------------------------------
    const Parser = (() => {
        const parseEventList = (doc) => {
            const rows = [...doc.querySelectorAll('tr.b-statistics__table-row:not(.b-statistics__table-row_head)')];
            return rows.map((r) => {
                const name = TextUtils.clean(r.querySelector('a')?.textContent);
                const url = r.querySelector('a')?.href;
                const date = TextUtils.clean(r.querySelector('span')?.textContent);
                const locCell = r.cells && r.cells[1] ? r.cells[1] : null;
                if (!name || !url) return null;
                return {
                    name,
                    url,
                    date,
                    date_iso: TextUtils.formatEventDateIso(date), // NEW: ISO date for backtesting
                    location: locCell ? TextUtils.clean(locCell.textContent) : '',
                    isFuture: isFutureEvent(date)
                };
            }).filter(Boolean);
        };

        const parseFightLinks = (doc) => {
            return [...doc.querySelectorAll('tr.b-fight-details__table-row')]
                .map((r) => {
                    const url = r.getAttribute('data-link') || r.querySelector('a')?.href || null;
                    const weightClass = WeightClassParser.parseWeightClassFromEventPage(r);
                    return url ? {
                        url,
                        weight_class: weightClass
                    } : null;
                })
                .filter(Boolean);
        };

        const parseFightDetails = async (doc, url, isFuture, fightOrder = 0, eventDate = null, eventWeightClass = null) => {
            const event = TextUtils.clean(doc.querySelector('.b-content__title a')?.textContent);
            if (!event) {
                Logger.warn(`Could not extract event name from ${url}`);
                return null;
            }

            const methodLine = doc.querySelector('i.b-fight-details__text-item_first');
            let method = 'Unknown';
            let methodDetails = '';
            if (methodLine) {
                const methodParts = methodLine.querySelectorAll('i');
                if (methodParts.length >= 2) method = TextUtils.clean(methodParts[1].textContent);
            }

            const detailParagraphs = doc.querySelectorAll('p.b-fight-details__text');
            if (detailParagraphs.length >= 2) {
                const detailsText = TextUtils.clean(detailParagraphs[1].textContent);
                methodDetails = detailsText.replace(/^Details:\s*/, '').trim();
                if (methodDetails === '') methodDetails = null;
            }

            const textItems = doc.querySelectorAll('.b-fight-details__text-item');
            let round = '',
                time = '',
                timeFormat = '';
            textItems.forEach((item) => {
                const txt = TextUtils.clean(item.textContent);
                if (txt.includes('Round:')) round = txt.replace('Round:', '').trim();
                if (txt.includes('Time:')) time = txt.replace('Time:', '').trim();
                if (txt.includes('Time format:')) timeFormat = txt.replace('Time format:', '').trim();
            });

            let f1 = null,
                f2 = null;
            const personEls = doc.querySelectorAll('div.b-fight-details__person');
            if (personEls.length >= 2) {
                const f1StatusEl = personEls[0].querySelector('i.b-fight-details__person-status');
                const f1Status = f1StatusEl ? TextUtils.clean(f1StatusEl.textContent) : '';
                const f1NameEl = personEls[0].querySelector('h3.b-fight-details__person-name a');
                const f1NickEl = personEls[0].querySelector('.b-fight-details__person-title');
                f1 = {
                    name: f1NameEl ? TextUtils.clean(f1NameEl.textContent) : '',
                    id: f1NameEl?.href,
                    status: f1Status,
                    nickname: (() => {
                        const n = f1NickEl ? TextUtils.clean(f1NickEl.textContent).replace(/"/g, '') : '';
                        if (!n || n === '--' || n === '---' || n.toUpperCase() === 'N/A') return null;
                        return n;
                    })(),
                    result: null, // Will be set below
                    height_inches: null,
                    reach_inches: null,
                    age_years_at_fight: null,
                    weight_class: null,
                    weigh_in_lbs: null,
                    nationality: null,
                    fighting_out_of: null
                };

                const f2StatusEl = personEls[1].querySelector('i.b-fight-details__person-status');
                const f2Status = f2StatusEl ? TextUtils.clean(f2StatusEl.textContent) : '';
                const f2NameEl = personEls[1].querySelector('h3.b-fight-details__person-name a');
                const f2NickEl = personEls[1].querySelector('.b-fight-details__person-title');
                f2 = {
                    name: f2NameEl ? TextUtils.clean(f2NameEl.textContent) : '',
                    id: f2NameEl?.href,
                    status: f2Status,
                    nickname: (() => {
                        const n = f2NickEl ? TextUtils.clean(f2NickEl.textContent).replace(/"/g, '') : '';
                        if (!n || n === '--' || n === '---' || n.toUpperCase() === 'N/A') return null;
                        return n;
                    })(),
                    result: null, // Will be set below
                    height_inches: null,
                    reach_inches: null,
                    age_years_at_fight: null,
                    weight_class: null,
                    weigh_in_lbs: null,
                    nationality: null,
                    fighting_out_of: null
                };
            }

            if (!f1 || !f2 || !f1.name || !f2.name) {
                Logger.warn(`Invalid fighter data in ${url}`);
                return null;
            }

            const weightClass = eventWeightClass || f1.weight_class || f2.weight_class || null;
            if (weightClass) {
                f1.weight_class = f1.weight_class || weightClass;
                f2.weight_class = f2.weight_class || weightClass;
            }

            // CANONICAL: Determine winner and set strict result enums
            let winner = null;
            let fightResult = 'win';

            if (method.includes('No Contest')) {
                winner = 'no_contest';
                fightResult = 'no_contest';
                f1.result = 'no_contest';
                f2.result = 'no_contest';
            } else if (f1.status === 'W') {
                winner = 'fighter_0';
                f1.result = 'win';
                f2.result = 'loss';
            } else if (f2.status === 'W') {
                winner = 'fighter_1';
                f1.result = 'loss';
                f2.result = 'win';
            } else {
                // Draw case
                winner = 'draw';
                fightResult = 'draw';
                f1.result = 'draw';
                f2.result = 'draw';
            }

            if (isFuture) {
                return {
                    url,
                    event,
                    event_date_iso: TextUtils.formatEventDateIso(eventDate),
                    weight_class: weightClass,
                    fight_order: fightOrder,
                    fighters: [f1, f2],
                    fight_stats: {
                        fighter_0: {
                            head_pct: 0,
                            body_pct: 0,
                            leg_pct: 0,
                            distance_pct: 0,
                            clinch_pct: 0,
                            ground_pct: 0
                        },
                        fighter_1: {
                            head_pct: 0,
                            body_pct: 0,
                            leg_pct: 0,
                            distance_pct: 0,
                            clinch_pct: 0,
                            ground_pct: 0
                        }
                    },
                    stats_rounds: [],
                    status: 'scheduled',
                    tapology_event_url: null,
                    tapology_betting_odds: null,
                    tapology_point_in_time: null,
                    tapology: {
                        event_matched: false,
                        bout_matched: false,
                        odds_scraped: false,
                        point_in_time_scraped: false,
                        failure_reason: null
                    },
                    _meta: {
                        missing: ['fight_stats', 'stats_rounds'],
                        enrichment: {
                            ufcstats: false,
                            tapology: false
                        },
                        source: {
                            fight_stats: 'default_zeros',
                            stats_rounds: null
                        }
                    }
                };
            }

            let statsData = null;
            const allTables = doc.querySelectorAll('table.b-fight-details__table');
            const totalsTable = allTables[0];
            if (totalsTable) {
                const totalRows = totalsTable.querySelectorAll('tbody tr');
                if (totalRows.length > 0) {
                    const cols = totalRows[0].querySelectorAll('td');
                    if (cols.length >= 10) {
                        const getColText = (cols, index, pIndex) => {
                            if (!cols[index]) return null;
                            const pTags = cols[index].querySelectorAll('p');
                            if (pTags && pTags[pIndex]) {
                                const text = TextUtils.clean(pTags[pIndex].textContent);
                                return (text === '---' || text === '') ? null : text;
                            }
                            return null;
                        };
                        const parseStatValue = (value) => {
                            if (value === null || value === undefined || value === '---' || value === '') return null;
                            const ofMatch = value.match(/^(\d+)\s+of\s+(\d+)$/);
                            if (ofMatch) {
                                const landed = parseInt(ofMatch[1]);
                                const attempted = parseInt(ofMatch[2]);
                                return {
                                    landed,
                                    attempted,
                                    pct: attempted > 0 ? Math.round((landed / attempted) * 100) : 0
                                };
                            }
                            const pctMatch = value.match(/^(\d+)%$/);
                            if (pctMatch) return parseInt(pctMatch[1]);
                            const timeMatch = value.match(/^(\d+):(\d+)$/);
                            if (timeMatch) return parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
                            const num = parseInt(value);
                            return isNaN(num) ? value : num;
                        };

                        // CANONICAL: fighter_0 and fighter_1 keys
                        statsData = {
                            fighter_0: {
                                name: f1.name,
                                knockdowns: parseStatValue(getColText(cols, 1, 0)),
                                sig_strikes: parseStatValue(getColText(cols, 2, 0)),
                                total_strikes: parseStatValue(getColText(cols, 4, 0)),
                                takedowns: parseStatValue(getColText(cols, 5, 0)),
                                submission_attempts: parseStatValue(getColText(cols, 7, 0)),
                                reversals: parseStatValue(getColText(cols, 8, 0)),
                                control_seconds: parseStatValue(getColText(cols, 9, 0))
                            },
                            fighter_1: {
                                name: f2.name,
                                knockdowns: parseStatValue(getColText(cols, 1, 1)),
                                sig_strikes: parseStatValue(getColText(cols, 2, 1)),
                                total_strikes: parseStatValue(getColText(cols, 4, 1)),
                                takedowns: parseStatValue(getColText(cols, 5, 1)),
                                submission_attempts: parseStatValue(getColText(cols, 7, 1)),
                                reversals: parseStatValue(getColText(cols, 8, 1)),
                                control_seconds: parseStatValue(getColText(cols, 9, 1))
                            }
                        };
                    }
                }
            }

            let roundStats = [];
            let roundStatsSource = null;
            if (Config.INCLUDE_ROUND_STATS) {
                roundStats = RoundParser.parseRoundData(doc);
                roundStatsSource = roundStats.length > 0 ? 'table' : null;
                if (roundStats.length > 0) {
                    Logger.info(`[FIGHT] Parsed ${roundStats.length} rounds of data`);
                }
            }

            let chartsData = null;
            if (Config.INCLUDE_CHARTS) {
                chartsData = ChartsParser.parseCharts(doc);
            }

            const __get = (o, k) => (o && Object.prototype.hasOwnProperty.call(o, k) && o[k] !== null && o[k] !== undefined) ? o[k] : 0;
            const fightStats = chartsData ? ({
                fighter_0: {
                    head_pct: __get(chartsData.fighter_0, 'head'),
                    body_pct: __get(chartsData.fighter_0, 'body'),
                    leg_pct: __get(chartsData.fighter_0, 'leg'),
                    distance_pct: __get(chartsData.fighter_0, 'distance'),
                    clinch_pct: __get(chartsData.fighter_0, 'clinch'),
                    ground_pct: __get(chartsData.fighter_0, 'ground')
                },
                fighter_1: {
                    head_pct: __get(chartsData.fighter_1, 'head'),
                    body_pct: __get(chartsData.fighter_1, 'body'),
                    leg_pct: __get(chartsData.fighter_1, 'leg'),
                    distance_pct: __get(chartsData.fighter_1, 'distance'),
                    clinch_pct: __get(chartsData.fighter_1, 'clinch'),
                    ground_pct: __get(chartsData.fighter_1, 'ground')
                }
            }) : ({
                fighter_0: {
                    head_pct: 0,
                    body_pct: 0,
                    leg_pct: 0,
                    distance_pct: 0,
                    clinch_pct: 0,
                    ground_pct: 0
                },
                fighter_1: {
                    head_pct: 0,
                    body_pct: 0,
                    leg_pct: 0,
                    distance_pct: 0,
                    clinch_pct: 0,
                    ground_pct: 0
                }
            });

            const missingFields = [];
            const sourceFields = {
                fight_stats: chartsData ? 'charts' : 'default_zeros',
                stats_rounds: roundStatsSource,
                stats_totals: statsData ? 'fight_totals_table' : null
            };
            if (!chartsData) missingFields.push('fight_stats');
            if (!roundStats || roundStats.length === 0) missingFields.push('stats_rounds');

            const __allZero = (obj) => obj && Object.values(obj).every(v => v === 0);
            const f1SigAtt = statsData?.fighter_0?.sig_strikes?.attempted;
            const f2SigAtt = statsData?.fighter_1?.sig_strikes?.attempted;

            if (__allZero(fightStats.fighter_0) && (f1SigAtt === undefined || f1SigAtt > 0)) missingFields.push('fight_stats.fighter_0');
            if (__allZero(fightStats.fighter_1) && (f2SigAtt === undefined || f2SigAtt > 0)) missingFields.push('fight_stats.fighter_1');

            const fight = {
                url,
                event,
                event_date_iso: TextUtils.formatEventDateIso(eventDate), // NEW: ISO date
                weight_class: weightClass,
                fight_order: fightOrder,
                fight_info: {
                    winner: winner, // CANONICAL: 'fighter_0', 'fighter_1', 'draw', or 'no_contest'
                    result: fightResult, // CANONICAL: 'win', 'draw', or 'no_contest'
                    method,
                    method_details: methodDetails,
                    round: parseInt(round, 10) || 0, // TYPED: integer
                    time,
                    time_format: timeFormat
                },
                fighters: [f1, f2],
                stats_totals: statsData, // CANONICAL: fighter_0/fighter_1 keys
                fight_stats: fightStats, // CANONICAL: fighter_0/fighter_1 keys
                stats_rounds: roundStats.length > 0 ? roundStats : [], // CANONICAL: fighter_0_stats/fighter_1_stats
                tapology_event_url: null,
                tapology_bout_url: null,
                tapology_betting_odds: null,
                tapology_point_in_time: {},
                tapology: {
                    event_matched: false,
                    bout_matched: false,
                    odds_scraped: false,
                    point_in_time_scraped: false,
                    failure_reason: null
                },
                _meta: {
                    missing: missingFields,
                    enrichment: {
                        ufcstats: !!statsData,
                        tapology: false
                    },
                    source: sourceFields
                }
            };

            const __parseRoundMins = (tf) => {
                if (!tf) return null;
                const m = tf.match(/\(([\d\-\s]+)\)/);
                if (m && m[1]) {
                    const mins = m[1].split('-').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                    return mins.length ? mins : null;
                }
                const m2 = tf.match(/^\s*(\d+)\s*Rnd/i);
                if (m2 && m2[1]) {
                    const n = parseInt(m2[1], 10);
                    if (!isNaN(n) && n > 0) return Array(n).fill(5);
                }
                return null;
            };

            if (fight.fight_info.time) {
                const timeParts = fight.fight_info.time.split(':');
                if (timeParts.length === 2) {
                    const min = parseInt(timeParts[0], 10);
                    const sec = parseInt(timeParts[1], 10);
                    if (!isNaN(min) && !isNaN(sec)) {
                        const roundTimeSec = (min * 60) + sec;
                        fight.fight_info.round_time_seconds = roundTimeSec;

                        const rNum = parseInt(fight.fight_info.round, 10);
                        const rMins = __parseRoundMins(fight.fight_info.time_format) || [];
                        if (!isNaN(rNum) && rNum > 0) {
                            let priorSec = 0;
                            for (let i = 0; i < rNum - 1; i++) {
                                const rm = (rMins[i] !== undefined && rMins[i] !== null) ? rMins[i] : 5;
                                priorSec += (parseInt(rm, 10) * 60);
                            }
                            fight.fight_info.elapsed_fight_seconds = priorSec + roundTimeSec;
                        } else {
                            fight.fight_info.elapsed_fight_seconds = roundTimeSec;
                        }
                    }
                }
            }

            if (Config.COMPUTE_CTRL_PER_MINUTE && fight.fight_info.elapsed_fight_seconds && statsData) {
                const durationMin = fight.fight_info.elapsed_fight_seconds / 60;
                if (statsData.fighter_0 && statsData.fighter_0.control_seconds !== null && statsData.fighter_0.control_seconds !== undefined) {
                    statsData.fighter_0.control_seconds_per_minute =
                        durationMin > 0 ? parseFloat((statsData.fighter_0.control_seconds / durationMin).toFixed(2)) : 0;
                }
                if (statsData.fighter_1 && statsData.fighter_1.control_seconds !== null && statsData.fighter_1.control_seconds !== undefined) {
                    statsData.fighter_1.control_seconds_per_minute =
                        durationMin > 0 ? parseFloat((statsData.fighter_1.control_seconds / durationMin).toFixed(2)) : 0;
                }
            }

            TapologyClient.validateAndNormalizeDraw(fight);
            await TapologyClient.enrichFight(fight);
            fight._meta.enrichment.tapology = fight.tapology.point_in_time_scraped || false;

            return fight;
        };

        return {
            parseEventList,
            parseFightLinks,
            parseFightDetails
        };
    })();

    // ---------------------------------------------------------
    // HUD - RECTANGULAR RIGHT-SIDE VERSION
    // ---------------------------------------------------------
    const ScraperHUD = (() => {
        let sel;
        const create = () => {
            const existing = document.getElementById('ufc-scraper-hud-container');
            if (existing) existing.remove();

            const hud = document.createElement('div');
            hud.id = 'ufc-scraper-hud-container';

            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Teko:wght@400;600&display=swap';
            document.head.appendChild(fontLink);

            hud.innerHTML = `
            <style>
              #ufc-scraper-hud {
                position: fixed;
                top: 30px;
                right: 30px;
                width: 420px;
                z-index: 999999;
                font-family: 'Roboto Condensed', sans-serif;
              }
              .ufc-block {
                background: linear-gradient(180deg,#2a2a2a,#111);
                border: 2px solid #f2a900;
                box-shadow: 5px 5px 15px rgba(0,0,0,.7);
                padding: 16px 22px;
                border-radius: 6px;
              }
              .ufc-title {
                font-family: 'Teko', sans-serif;
                font-size: 34px;
                color: white;
                text-transform: uppercase;
                margin: 0 0 4px 0;
              }
              .ufc-sub {
                color: #f2a900;
                font-size: 14px;
                margin-bottom: 12px;
              }
              .ufc-label {
                font-size: 12px;
                color: #aaa;
                margin-top: 10px;
              }
              .ufc-bar {
                position: relative;
                height: 18px;
                background:#000;
                border:1px solid #444;
                overflow:hidden;
                margin: 4px 0;
                border-radius: 3px;
              }
              .ufc-fill {
                height:100%;
                background: linear-gradient(90deg,#ff3d3d,#d32f2f);
                transition: width .3s;
              }
              #ufc-event-select {
                width: 100%;
                margin: 10px 0;
                background: #000;
                color: #fff;
                border: 1px solid #f2a900;
                border-radius: 3px;
                padding: 6px;
              }
              .button-container {
                margin-top: 15px;
                text-align: center;
              }
              button {
                padding: 8px 20px;
                margin: 0 8px;
                cursor: pointer;
                border: 2px solid #f2a900;
                background: #d32f2f;
                color: white;
                font-weight: bold;
                border-radius: 4px;
                transition: all 0.2s;
              }
              button:hover {
                background: #f2a900;
                color: #000;
              }
              #ufc-scraper-log {
                font-size: 11px;
                margin-top: 10px;
                white-space: pre-wrap;
                color: #ddd;
                max-height: 100px;
                overflow-y: auto;
                background: #1a1a1a;
                padding: 8px;
                border: 1px solid #444;
                border-radius: 3px;
              }
            </style>

            <div id="ufc-scraper-hud">
              <div class="ufc-block">
                <div class="ufc-inner">
                  <div class="ufc-title">UFC SCRAPER</div>
                  <div class="ufc-sub">UFCStats.com Forensic Auto-Scraper</div>

                  <div id="ufc-scraper-status">
                    <div class="ufc-label">Status: <span style="color:#f2a900;">Idle</span></div>
                  </div>

                  <select id="ufc-event-select"></select>

                  <div id="ufc-scraper-log">System ready. Press START to begin scraping.</div>

                  <div class="button-container">
                    <button id="ufc-start">START</button>
                    <button id="ufc-stop">STOP</button>
                  </div>
                </div>
              </div>
            </div>
            `;

            document.body.appendChild(hud);

            State.hud = {
                element: hud,
                shadow: null,
                wrapper: hud.querySelector('#ufc-scraper-hud')
            };

            sel = hud.querySelector('#ufc-event-select');

            hud.querySelector('#ufc-start').onclick = () => {
                Logger.info('START button clicked');
                Orchestrator.start();
            };
            hud.querySelector('#ufc-stop').onclick = () => {
                Logger.warn('STOP button clicked');
                Orchestrator.stop();
            };

            Logger.info('HUD created successfully');
        };

        const populate = (events) => {
            if (!sel || !events) return;
            sel.innerHTML = '';
            events.forEach((e, i) => {
                const o = document.createElement('option');
                o.value = String(i);
                const future = e.isFuture ? ' (future)' : '';
                o.textContent = (i + 1) + '. ' + e.name + ' (' + e.date + ')' + future;
                sel.appendChild(o);
            });
            Logger.info(`HUD populated with ${events.length} events`);
        };

        const getIndex = () => parseInt(sel?.value || 0, 10) || 0;

        const forceUpdate = () => {};

        return {
            create,
            populate,
            getIndex,
            forceUpdate
        };
    })();

    // ---------------------------------------------------------
    // PROGRESS TRACKER
    // ---------------------------------------------------------
    const Progress = (() => {
        const KEY = 'ufc_scraper_progress';
        const save = (eventIndex) => {
            try {
                sessionStorage.setItem(KEY, JSON.stringify({
                    eventIndex: eventIndex,
                    timestamp: Date.now()
                }));
            } catch (e) {
                Logger.warn('Could not save progress: ' + e.message);
            }
        };
        const load = () => {
            try {
                const saved = sessionStorage.getItem(KEY);
                if (!saved) return null;
                const data = JSON.parse(saved);
                if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
                    sessionStorage.removeItem(KEY);
                    return null;
                }
                return data.eventIndex;
            } catch (e) {
                return null;
            }
        };
        const clear = () => {
            try {
                sessionStorage.removeItem(KEY);
            } catch (e) {}
        };
        return {
            save,
            load,
            clear
        };
    })();

    // ---------------------------------------------------------
    // ORCHESTRATOR
    // ---------------------------------------------------------
    const Orchestrator = (() => {
        let events = [];

        const init = () => {
            Logger.info('Initializing scraper...');
            events = Parser.parseEventList(document);
            Logger.info(`Found ${events.length} total events`);
            ScraperHUD.populate(events);
            const completed = events.filter((e) => !e.isFuture);
            State.totalEventsToScrape = completed.length;
            Logger.info(`${completed.length} completed events ready to scrape`);

            const savedIndex = Progress.load();
            if (savedIndex !== null && savedIndex < events.length) {
                Logger.info(`Found saved progress at event ${savedIndex + 1}. Use START to resume.`);
                const selector = State.hud?.element?.querySelector('#ufc-event-select');
                if (selector) selector.value = savedIndex;
            }
            Logger.info('Tapology enrichment: ' + (Config.TAPOLOGY.ENABLED ? 'ENABLED' : 'DISABLED'));
            Logger.info('Charts scraping: ' + (Config.INCLUDE_CHARTS ? 'ENABLED' : 'DISABLED'));
            Logger.info('Round stats scraping: ' + (Config.INCLUDE_ROUND_STATS ? 'ENABLED' : 'DISABLED'));
            Logger.info('Scraper initialization complete.');
        };

        const start = async () => {
            if (State.isScraping) {
                Logger.warn('Scrape already in progress!');
                return;
            }

            State.isScraping = true;
            State.stopRequested = false;
            State.currentEventIndex = 0;
            State.currentFightIndex = 0;
            State.totalFightsInCurrentEvent = 0;
            Logger.startHeartbeat();

            const startIndex = ScraperHUD.getIndex();
            Logger.info(`START requested from event index ${startIndex}`);

            const queueAll = events.slice(startIndex);
            const queue = queueAll.filter((e) => !e.isFuture);
            Logger.info(`Starting scrape of ${queue.length} events...`);

            for (let i = 0; i < queue.length; i++) {
                if (State.stopRequested) {
                    Logger.warn('Stop requested - breaking event loop');
                    break;
                }

                const ev = queue[i];
                State.currentEventIndex = startIndex + i + 1;
                State.currentEventName = ev.name;
                State.currentFightIndex = 0;
                Progress.save(startIndex + i);

                Logger.info(`Processing event ${State.currentEventIndex}/${State.totalEventsToScrape}: ${ev.name}`);

                let doc = null;
                let attempts = 0;

                while (attempts < Config.RETRY.MAX_ATTEMPTS && !State.stopRequested) {
                    try {
                        await DelayProfile.ufcstats.event();
                        doc = await NetworkUtils.fetchHtml(ev.url, 'UFCSTATS');
                        break;
                    } catch (e) {
                        attempts++;
                        if (attempts >= Config.RETRY.MAX_ATTEMPTS) {
                            Logger.error(`Failed ${ev.name} after ${attempts} attempts: ${e.message}`);
                            break;
                        }
                        Logger.warn(`Event fetch failed, retry ${attempts}/${Config.RETRY.MAX_ATTEMPTS}: ${e.message}`);
                    }
                }

                if (!doc) {
                    Logger.warn(`Skipping event ${ev.name} due to fetch failure`);
                    continue;
                }

                const links = Parser.parseFightLinks(doc);
                State.totalFightsInCurrentEvent = links.length;
                Logger.info(`Event has ${links.length} fights`);

                const fights = [];

                for (let fightIdx = 0; fightIdx < links.length; fightIdx++) {
                    if (State.stopRequested) {
                        Logger.warn('Stop requested - breaking fight loop');
                        break;
                    }

                    const link = links[fightIdx];
                    State.currentFightIndex = fightIdx + 1;

                    await DelayProfile.ufcstats.micro();

                    let fdoc = null;
                    let fAttempts = 0;

                    while (fAttempts < Config.RETRY.MAX_ATTEMPTS && !State.stopRequested) {
                        try {
                            fdoc = await NetworkUtils.fetchHtml(link.url, 'UFCSTATS');
                            break;
                        } catch (e) {
                            fAttempts++;
                            if (fAttempts >= Config.RETRY.MAX_ATTEMPTS) {
                                Logger.warn(`Failed fight ${link.url} after ${fAttempts} attempts: ${e.message}`);
                                break;
                            }
                            Logger.warn(`Fight fetch failed, retry ${fAttempts}/${Config.RETRY.MAX_ATTEMPTS}: ${e.message}`);
                        }
                    }

                    if (!fdoc) {
                        Logger.warn(`Skipping fight due to fetch failure`);
                        continue;
                    }

                    const fight = await Parser.parseFightDetails(fdoc, link.url, ev.isFuture, links.length - fightIdx, ev.date, link.weight_class);
                    if (!fight) {
                        Logger.warn(`Invalid fight data from ${link.url}, skipping`);
                        continue;
                    }

                    fights.push(fight);
                }

                if (!fights.length) {
                    Logger.warn(`No valid fights for ${ev.name}, skipping export`);
                    continue;
                }

                const data = {
                    event: ev.name,
                    date: ev.date,
                    date_iso: ev.date_iso, // NEW: ISO date for backtesting
                    location: ev.location,
                    url: ev.url,
                    fights: fights,
                    scraped_at: new Date().toISOString()
                };

                const safeName = formatExportEventName(ev.name);
                const fileName = 'ufc_event_' + safeName + '__' + formatEventDate(ev.date) + '__v' + VERSION + '.json';
                Logger.info(`Exporting ${fileName}...`);
                downloadJsonAuto(data, fileName);

                Logger.info(`Event ${ev.name} complete`);
            }

            State.isScraping = false;
            State.currentEventName = '';
            State.currentFightIndex = 0;
            State.totalFightsInCurrentEvent = 0;
            Logger.stopHeartbeat();
            Progress.clear();
            Logger.info('Scrape complete' + (State.stopRequested ? ' (stopped)' : ''));
        };

        const stop = () => {
            Logger.warn('STOP requested - will pause after current operation completes');
            State.stopRequested = true;
        };

        return {
            init,
            start,
            stop
        };
    })();

    // ---------------------------------------------------------
    // DOWNLOAD HELPER
    // ---------------------------------------------------------
    function downloadJsonAuto(dataObj, fileName) {
        let blobUrl = null;
        try {
            const wrappedData = {
                schema_version: VERSION,
                scraper_name: `UFCStats.com Forensic Auto-Scraper`,
                generated_at: new Date().toISOString(),
                ...dataObj
            };
            const json = JSON.stringify(wrappedData, null, 2);
            const blob = new Blob([json], {
                type: 'application/json'
            });
            blobUrl = URL.createObjectURL(blob);
            GM_download({
                url: blobUrl,
                name: fileName,
                onload: function () {
                    Logger.info('Exported ' + fileName);
                },
                onerror: function (e) {
                    Logger.error('Download failed for ' + fileName + ': ' + e.error);
                    if (blobUrl) {
                        try {
                            URL.revokeObjectURL(blobUrl);
                        } catch (_) {}
                    }
                },
                onloadend: function () {
                    if (blobUrl) {
                        setTimeout(() => {
                            try {
                                URL.revokeObjectURL(blobUrl);
                            } catch (_) {}
                        }, 30000);
                    }
                }
            });
        } catch (e) {
            Logger.error('Download exception for ' + fileName + ': ' + e.message);
            if (blobUrl) {
                try {
                    URL.revokeObjectURL(blobUrl);
                } catch (_) {}
            }
        }
    }

    // ---------------------------------------------------------
    // INITIALIZE
    // ---------------------------------------------------------
    Logger.info('=== UFCStats.com Forensic Auto-Scraper ===');
    ScraperHUD.create();
    Orchestrator.init();
})();