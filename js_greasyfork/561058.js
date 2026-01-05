// ==UserScript==
// @name         Upcoming UFC Fight Stats Scraper (with Fighter IDs + Fuzzy Odds)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Scrapes UFC Stats event pages, calculates days since last fight, merges with live odds using fuzzy name matching, and includes Fighter IDs.
// @author       Merged by Gemini + patched
// @match        http://www.ufcstats.com/event-details/*
// @match        https://www.ufcstats.com/event-details/*
// @connect      bestfightodds.com
// @connect      www.bestfightodds.com
// @connect      ufcstats.com
// @connect      www.ufcstats.com
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561058/Upcoming%20UFC%20Fight%20Stats%20Scraper%20%28with%20Fighter%20IDs%20%2B%20Fuzzy%20Odds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561058/Upcoming%20UFC%20Fight%20Stats%20Scraper%20%28with%20Fighter%20IDs%20%2B%20Fuzzy%20Odds%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    // 1. CONFIG & STATE
    // ========================================================================
    const Config = {
        AUTO_START: false,
        DELAY_BETWEEN_FIGHTS: 1500, // ms
        BFO_URL: "https://www.bestfightodds.com/"
    };

    const State = {
        isRunning: false,
        currentIndex: 0,
        totalFights: 0,
        scrapedData: [],
        oddsData: new Map(), // Stores normalized fighter name -> American Odd
        eventName: '',
        eventDate: '',
        errors: []
    };

    // ========================================================================
    // 2. TEXT UTILITIES (Hybrid: Forensic Matching + Existing Parsers)
    // ========================================================================
    const TextUtils = (() => {
        const clean = (s) => (s ? String(s).replace(/\s+/g, ' ').trim() : '');

        const norm = (s) =>
            clean(String(s || ''))
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z\s]/g, '');

        const key = (s) =>
            norm(s)
                .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '')
                .replace(/\s/g, '');

        const levenshtein = (a, b) => {
            const m = [];
            for (let i = 0; i <= b.length; i++) m[i] = [i];
            for (let j = 0; j <= a.length; j++) m[0][j] = j;
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    m[i][j] =
                        b[i - 1] === a[j - 1]
                            ? m[i - 1][j - 1]
                            : Math.min(
                                  m[i - 1][j - 1] + 1,
                                  m[i][j - 1] + 1,
                                  m[i - 1][j] + 1
                              );
                }
            }
            return m[b.length][a.length];
        };

        const similarity = (a, b) => {
            const na = norm(a);
            const nb = norm(b);
            const L = na.length >= nb.length ? na : nb;
            const S = na.length >= nb.length ? nb : na;
            return L.length ? (L.length - levenshtein(L, S)) / L.length : 1;
        };

        const namesMatch = (a, b) => {
            const na = norm(a);
            const nb = norm(b);

            if (na === nb || key(a) === key(b)) return true;
            if (similarity(a, b) >= 0.80) return true;

            const aParts = na.split(' ');
            const bParts = nb.split(' ');
            if (aParts.length >= 2 && bParts.length >= 2) {
                const aLast = aParts.slice(1).join(' ');
                const bLast = bParts.slice(1).join(' ');
                if (aLast === bLast) {
                    if (aParts[0] === bParts[0]) return true;
                    if (similarity(aParts[0], bParts[0]) >= 0.60) return true;
                }
            }
            return false;
        };

        const extractIdFromUrl = (url) => {
            if (!url) return null;
            const parts = url.split('/');
            return parts[parts.length - 1];
        };

        const parseRecord = (recordStr) => {
            if (!recordStr) return { wins: null, losses: null, draws: null };
            const cleanStr = String(recordStr).replace('Record:', '').trim();
            const parts = cleanStr.split('-');
            if (parts.length < 2) return { wins: null, losses: null, draws: null };
            const p = (v) => {
                const n = parseInt(v, 10);
                return isNaN(n) ? null : n;
            };
            return { wins: p(parts[0]), losses: p(parts[1]), draws: p(parts[2]) };
        };

        const parseHeight = (h) => {
            if (!h) return null;
            const m = h.match(/(\d+)'?\s*(\d+)?/);
            return m ? parseInt(m[1], 10) * 12 + (m[2] ? parseInt(m[2], 10) : 0) : null;
        };

        const parseReach = (r) => {
            if (!r) return null;
            const m = r.match(/(\d+\.?\d*)/);
            return m ? parseFloat(m[1]) : null;
        };

        const parseAge = (dobStr, eventDate) => {
            if (!dobStr || !eventDate) return null;
            const dob = new Date(dobStr);
            const ref = new Date(eventDate);
            if (isNaN(dob) || isNaN(ref)) return null;
            let age = ref.getFullYear() - dob.getFullYear();
            const md = ref.getMonth() - dob.getMonth();
            if (md < 0 || (md === 0 && ref.getDate() < dob.getDate())) age--;
            return age;
        };

        const formatDateISO = (d) => {
            const x = new Date(d);
            return isNaN(x) ? new Date().toISOString().slice(0, 10) : x.toISOString().slice(0, 10);
        };

        return {
            clean,
            normalize: norm,
            namesMatch,
            extractIdFromUrl,
            parseRecord,
            parseHeight,
            parseReach,
            parseAge,
            formatDateISO
        };
    })();

    // ========================================================================
    // 3. BEST FIGHT ODDS LOGIC (Restored & Robust)
    // ========================================================================
    const OddsUtils = {
        getImpliedProb: function(odd) {
            if (!odd || odd === 0) return 0;
            return odd > 0 ? 100 / (odd + 100) : (-odd) / (-odd + 100);
        },

        getAmericanOdd: function(prob) {
            if (prob <= 0 || prob >= 1) return 0;
            let odd = prob > 0.5 ? -100 * (prob / (1 - prob)) : 100 * ((1 - prob) / prob);
            return Math.round(odd);
        },

        parseOdd: function(text) {
            if (!text) return null;
            let t = text.trim().toLowerCase();
            if (t === 'ev' || t === 'pk' || t === 'even') return 100;
            if (!/[0-9]/.test(t)) return null;
            let cleanText = t.replace(/[^\d+-]/g, '');
            if (!cleanText || cleanText === '+' || cleanText === '-') return null;
            return parseInt(cleanText, 10);
        },

        getOddsFromRow: function(row) {
            if (!row) return [];
            const validValues = [];
            Array.from(row.children).forEach(cell => {
                const spans = cell.querySelectorAll('span');
                let foundVal = null;
                for (let span of spans) {
                    const val = OddsUtils.parseOdd(span.textContent);
                    if (val !== null) {
                        foundVal = val;
                        break;
                    }
                }
                if (foundVal !== null) validValues.push(foundVal);
            });
            return validValues;
        },

        findParallelRow: function(primaryRow) {
            const container = primaryRow.closest('.table-div');
            if (!container) return null;
            const tbodies = container.querySelectorAll('tbody');
            if (tbodies.length < 2) return null;
            const myTbody = primaryRow.closest('tbody');
            const myIndex = Array.from(myTbody.children).indexOf(primaryRow);
            for (let tbody of tbodies) {
                if (tbody !== myTbody) {
                    const candidateRow = tbody.children[myIndex];
                    if (candidateRow) return candidateRow;
                }
            }
            return null;
        }
    };

    async function fetchAndParseOdds() {
        console.log("Fetching BestFightOdds data...");
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: Config.BFO_URL,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const oddsMap = extractOddsFromDoc(doc);
                        console.log(`[BFO] Parsed odds for ${oddsMap.size} fighters.`);
                        resolve(oddsMap);
                    } else {
                        console.error("[BFO] Failed to fetch. Status:", response.status);
                        resolve(new Map()); // Fail gracefully
                    }
                },
                onerror: function(err) {
                    console.error("[BFO] Network Error:", err);
                    resolve(new Map());
                }
            });
        });
    }

    function extractOddsFromDoc(doc) {
        const rows = doc.querySelectorAll('tr[id^="mu-"]');
        const oddsMap = new Map();

        rows.forEach(rowA => {
            const nameElA = rowA.querySelector('.t-b-fcc');
            if (!nameElA) return;
            const nameA = nameElA.textContent.trim();

            let rowB = rowA.nextElementSibling;
            while(rowB && (!rowB.classList || rowB.classList.contains('item-mobile-only'))) {
                rowB = rowB.nextElementSibling;
            }
            if (!rowB) return;

            const nameElB = rowB.querySelector('.t-b-fcc');
            if (!nameElB) return;
            const nameB = nameElB.textContent.trim();

            let oddsA = OddsUtils.getOddsFromRow(rowA);
            let oddsB = OddsUtils.getOddsFromRow(rowB);

            if (oddsA.length === 0) {
                const parallelA = OddsUtils.findParallelRow(rowA);
                if (parallelA) oddsA = OddsUtils.getOddsFromRow(parallelA);
            }
            if (oddsB.length === 0) {
                const parallelB = OddsUtils.findParallelRow(rowB);
                if (parallelB) oddsB = OddsUtils.getOddsFromRow(parallelB);
            }

            if (oddsA.length > 0 && oddsB.length > 0) {
                const count = Math.min(oddsA.length, oddsB.length);
                const finalOddsA = oddsA.slice(0, count);
                const finalOddsB = oddsB.slice(0, count);

                const avgA = OddsUtils.getAmericanOdd(finalOddsA.map(OddsUtils.getImpliedProb).reduce((a, b) => a + b, 0) / count);
                const avgB = OddsUtils.getAmericanOdd(finalOddsB.map(OddsUtils.getImpliedProb).reduce((a, b) => a + b, 0) / count);

                // Store using the NEW robust normalizer
                oddsMap.set(TextUtils.normalize(nameA), avgA);
                oddsMap.set(TextUtils.normalize(nameB), avgB);
            }
        });
        return oddsMap;
    }

    // ========================================================================
    // 4. UFC STATS SCRAPER LOGIC
    // ========================================================================
    function scrapeEventPage() {
        console.log('--- Scraping Event Page ---');
        const titleEl = document.querySelector('.b-content__title-highlight');
        State.eventName = titleEl ? TextUtils.clean(titleEl.textContent) : 'Unknown Event';

        const dateSpan = document.querySelector('.b-list__box-list-item');
        if (dateSpan) {
            const dateText = TextUtils.clean(dateSpan.textContent).replace('Date:', '').trim();
            State.eventDate = TextUtils.formatDateISO(dateText);
        } else {
            State.eventDate = new Date().toISOString().slice(0, 10);
        }

        const fightLinks = [];
        const rows = document.querySelectorAll('tbody.b-fight-details__table-body tr.b-fight-details__table-row');
        rows.forEach(function(row, index) {
            const url = row.getAttribute('data-link');
            const fighterLinks = row.querySelectorAll('td:nth-of-type(2) a.b-link');
            const weightClassCell = row.querySelector('td:nth-of-type(7) p');

            if (url && fighterLinks.length >= 2) {
                fightLinks.push({
                    url: url,
                    fighter1: TextUtils.clean(fighterLinks[0].textContent),
                    f1Url: fighterLinks[0].href,
                    f1Id: TextUtils.extractIdFromUrl(fighterLinks[0].href),
                    fighter2: TextUtils.clean(fighterLinks[1].textContent),
                    f2Url: fighterLinks[1].href,
                    f2Id: TextUtils.extractIdFromUrl(fighterLinks[1].href),
                    weightClass: weightClassCell ? TextUtils.clean(weightClassCell.textContent).split('\n')[0].trim() : 'Unknown',
                    index: index + 1
                });
            }
        });
        State.totalFights = fightLinks.length;
        console.log(`Found ${State.totalFights} fights in ${State.eventName}`);
        return fightLinks;
    }

    // NEW HELPER: Get Days Since Last Fight
    async function getDaysSinceLastFight(fighterUrl, currentEventDate) {
        if (!fighterUrl) return null;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: fighterUrl,
                onload: function(response) {
                    if (response.status !== 200) { resolve(null); return; }
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const rows = doc.querySelectorAll('tr.b-fight-details__table-row');
                        const currentEvtDateObj = new Date(currentEventDate);

                        for (let row of rows) {
                            const tds = row.querySelectorAll('td');
                            if (tds.length < 7) continue;

                            const pTags = tds[6].querySelectorAll('p');
                            let dateText = pTags.length > 1 ? pTags[1].textContent.trim() : tds[6].textContent.trim();

                            const fightDate = new Date(dateText);
                            if (isNaN(fightDate)) continue;
                            if (fightDate < currentEvtDateObj) {
                                const diffTime = Math.abs(currentEvtDateObj - fightDate);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                resolve(diffDays);
                                return;
                            }
                        }
                        resolve(null);
                    } catch (e) {
                        console.error("Error parsing dates for " + fighterUrl, e);
                        resolve(null);
                    }
                },
                onerror: function() { resolve(null); }
            });
        });
    }

    async function scrapeMatchupPage(url) {
        return new Promise(function(resolve, reject) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;

            const timeout = setTimeout(function() {
                document.body.removeChild(iframe);
                reject(new Error('Timeout loading matchup page'));
            }, 15000);

            iframe.onload = function() {
                clearTimeout(timeout);
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const data = extractMatchupData(doc);
                    document.body.removeChild(iframe);
                    resolve(data);
                } catch (e) {
                    document.body.removeChild(iframe);
                    reject(e);
                }
            };
            iframe.onerror = function() {
                clearTimeout(timeout);
                document.body.removeChild(iframe);
                reject(new Error('Failed to load matchup page'));
            };
            document.body.appendChild(iframe);
        });
    }

    function extractMatchupData(doc) {
        const data = {
            fighter1: { name: null },
            fighter2: { name: null },
            stats: {}
        };
        const personEls = doc.querySelectorAll('.b-fight-details__person-name a');
        if (personEls.length >= 2) {
            data.fighter1.name = TextUtils.clean(personEls[0].textContent);
            data.fighter2.name = TextUtils.clean(personEls[1].textContent);
        }

        const rows = doc.querySelectorAll('tr.b-fight-details__table-row-preview');
        rows.forEach(function(row) {
            const cols = row.querySelectorAll('.b-fight-details__table-col');
            if (cols.length >= 3) {
                const labelEl = cols[0].querySelector('p.b-fight-details__table-text');
                const val1El = cols[1].querySelector('p.b-fight-details__table-text');
                const val2El = cols[2].querySelector('p.b-fight-details__table-text');

                if (!labelEl) return;
                const label = TextUtils.clean(labelEl.textContent);
                const val1 = val1El ? TextUtils.clean(val1El.textContent) : '';
                const val2 = val2El ? TextUtils.clean(val2El.textContent) : '';

                if (label) {
                    data.stats[label] = { fighter1: val1, fighter2: val2 };
                }
            }
        });
        return data;
    }

    // NEW: Fuzzy odds lookup helper
    function findOdds(fighterName) {
        const norm = TextUtils.normalize(fighterName);
        if (State.oddsData.has(norm)) return State.oddsData.get(norm);
        for (const [bfoName, odd] of State.oddsData.entries()) {
            if (TextUtils.namesMatch(fighterName, bfoName)) {
                console.log(`[Odds] Fuzzy match: '${fighterName}' ~= '${bfoName}'`);
                return odd;
            }
        }
        return null;
    }

    function transformForPrediction(fightData, fightId, eventDate, f0_days, f1_days) {
        const stats = fightData.stats || {};
        const recordStats = stats['Record'] || stats['Wins/Losses/Draws'] || {};

        const record1 = TextUtils.parseRecord(recordStats.fighter1);
        const record2 = TextUtils.parseRecord(recordStats.fighter2);
        const height1 = TextUtils.parseHeight(stats['Height']?.fighter1);
        const height2 = TextUtils.parseHeight(stats['Height']?.fighter2);
        const reach1 = TextUtils.parseReach(stats['Reach']?.fighter1);
        const reach2 = TextUtils.parseReach(stats['Reach']?.fighter2);

        const dob1 = stats['DOB']?.fighter1;
        const dob2 = stats['DOB']?.fighter2;
        const age1 = TextUtils.parseAge(dob1, eventDate);
        const age2 = TextUtils.parseAge(dob2, eventDate);

        const total1 = (record1.wins !== null) ? (record1.wins + (record1.losses||0) + (record1.draws || 0)) : null;
        const total2 = (record2.wins !== null) ? (record2.wins + (record2.losses||0) + (record2.draws || 0)) : null;
        const name1 = fightData.fighter1?.name || fightData.fighter1;
        const name2 = fightData.fighter2?.name || fightData.fighter2;

        // --- FUZZY ODDS LOOKUP ---
        const odds1 = findOdds(name1);
        const odds2 = findOdds(name2);

        return {
            fight_id: fightId,
            event_date: eventDate,
            weight_class: fightData.weightClass || 'Unknown',

            f0_name: name1,
            f0_fighter_id: fightData.f1Id,
            f0_age: age1,
            f0_height: height1,
            f0_reach: reach1,
            f0_wins: record1.wins,
            f0_losses: record1.losses,
            f0_draws: record1.draws,
            f0_total_fights: total1,
            f0_days_since_last_fight: f0_days,
            f0_odds: odds1,

            f1_name: name2,
            f1_fighter_id: fightData.f2Id,
            f1_age: age2,
            f1_height: height2,
            f1_reach: reach2,
            f1_wins: record2.wins,
            f1_losses: record2.losses,
            f1_draws: record2.draws,
            f1_total_fights: total2,
            f1_days_since_last_fight: f1_days,
            f1_odds: odds2,

            data_source: 'ufcstats_bfo_merged',
            scrape_timestamp: new Date().toISOString()
        };
    }

    // ========================================================================
    // 5. EXPORT & MAIN CONTROL
    // ========================================================================
    function exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            console.error('No data to export');
            return;
        }
        const columns = [
            'fight_id', 'event_date', 'weight_class',
            'f0_name', 'f0_fighter_id', 'f0_odds', 'f0_days_since_last_fight', 'f0_age', 'f0_height', 'f0_reach', 'f0_wins', 'f0_losses', 'f0_draws', 'f0_total_fights',
            'f1_name', 'f1_fighter_id', 'f1_odds', 'f1_days_since_last_fight', 'f1_age', 'f1_height', 'f1_reach', 'f1_wins', 'f1_losses', 'f1_draws', 'f1_total_fights',
            'data_source', 'scrape_timestamp'
        ];
        let csv = columns.join(',') + '\n';

        data.forEach(function(row) {
            const values = columns.map(function(col) {
                let val = row[col];
                if (val === null || val === undefined) return '';
                val = String(val);
                if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                    val = '"' + val.replace(/"/g, '""') + '"';
                }
                return val;
            });
            csv += values.join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    function exportToJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    async function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function runScraper() {
        if (State.isRunning) return;
        State.isRunning = true;
        State.currentIndex = 0;
        State.scrapedData = [];
        State.errors = [];
        State.oddsData = new Map();

        updateUI();
        try {
            // STEP 1: FETCH ODDS
            document.getElementById('scraper-status').textContent = 'Fetching Odds from BestFightOdds...';
            State.oddsData = await fetchAndParseOdds();
            console.log('Odds Data Ready:', State.oddsData);

            // STEP 2: SCRAPE FIGHTS
            const fights = scrapeEventPage();
            if (fights.length === 0) {
                alert('No fights found on this page');
                State.isRunning = false;
                updateUI();
                return;
            }

            for (let i = 0; i < fights.length; i++) {
                State.currentIndex = i + 1;
                updateUI();

                const fight = fights[i];
                console.log(`Processing fight ${i + 1}/${fights.length}: ${fight.fighter1} vs ${fight.fighter2}`);
                try {
                    const matchupPromise = scrapeMatchupPage(fight.url);
                    const f1DaysPromise = getDaysSinceLastFight(fight.f1Url, State.eventDate);
                    const f2DaysPromise = getDaysSinceLastFight(fight.f2Url, State.eventDate);

                    const [matchupData, f0_days, f1_days] = await Promise.all([matchupPromise, f1DaysPromise, f2DaysPromise]);

                    matchupData.weightClass = fight.weightClass;
                    matchupData.fighter1 = matchupData.fighter1?.name || fight.fighter1;
                    matchupData.fighter2 = matchupData.fighter2?.name || fight.fighter2;

                    matchupData.f1Id = fight.f1Id;
                    matchupData.f2Id = fight.f2Id;

                    const fightId = `${State.eventName.replace(/\s+/g, '_')}_${String(i + 1).padStart(2, '0')}`;
                    const predData = transformForPrediction(matchupData, fightId, State.eventDate, f0_days, f1_days);
                    State.scrapedData.push(predData);
                } catch (e) {
                    console.error(`Error scraping fight ${i + 1}:`, e);
                    State.errors.push({ fight: `${fight.fighter1} vs ${fight.fighter2}`, error: e.message });
                }

                if (i < fights.length - 1) await delay(Config.DELAY_BETWEEN_FIGHTS);
            }

            alert(`Scraping complete!\n\nMatched Odds for fighters found in BFO database.\nErrors: ${State.errors.length}`);
        } catch (e) {
            console.error('Fatal error:', e);
            alert('Fatal Error: ' + e.message);
        } finally {
            State.isRunning = false;
            updateUI();
        }
    }

    // ========================================================================
    // 6. UI
    // ========================================================================
    function createUI() {
        const container = document.createElement('div');
        container.id = 'ufc-scraper-ui';
        container.style.cssText = `
            position: fixed;
            top: 10px; right: 10px; z-index: 10000;
            background: #1a1a1a; border: 2px solid #d20a0a; border-radius: 8px;
            padding: 15px; min-width: 300px;
            font-family: Arial, sans-serif;
            color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        container.innerHTML = `
            <div style="margin-bottom: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #d20a0a; font-size: 16px;">UFC + Odds Scraper</h3>
                <div style="font-size: 11px; color: #888; margin-bottom: 10px;">Fetches BestFightOdds automatically</div>
                <div id="scraper-status" style="font-size: 13px; color: #ccc; margin-bottom: 10px;">Ready</div>
                <div id="scraper-progress" style="margin-bottom: 10px; display: none;">
                    <div style="background: #333; height: 20px; border-radius: 4px; overflow: hidden;">
                        <div id="progress-bar" style="background: #d20a0a; height: 100%; width: 0%; transition: width 0.3s;"></div>
                    </div>
                    <div id="progress-text" style="font-size: 12px; margin-top: 5px; text-align: center;"></div>
                </div>
            </div>
            <button id="start-scraper" style="width: 100%; padding: 10px;
            background: #d20a0a; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;
            margin-bottom: 8px;">Start Scraping</button>
            <button id="export-csv" style="width: 100%; padding: 8px;
            background: #0a7ad2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; margin-bottom: 5px;
            display: none;">Export Prediction CSV</button>
            <button id="export-json" style="width: 100%;
            padding: 8px; background: #0ad268; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;
            display: none;">Export Full JSON</button>
        `;
        document.body.appendChild(container);

        document.getElementById('start-scraper').addEventListener('click', runScraper);
        document.getElementById('export-csv').addEventListener('click', function() {
            const filename = `${State.eventName.replace(/\s+/g, '_')}_with_odds.csv`;
            exportToCSV(State.scrapedData, filename);
        });
        document.getElementById('export-json').addEventListener('click', function() {
            const filename = `${State.eventName.replace(/\s+/g, '_')}_Upcoming.json`;
            exportToJSON(State.scrapedData, filename);
        });
    }

    function updateUI() {
        const statusEl = document.getElementById('scraper-status');
        const progressEl = document.getElementById('scraper-progress');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const startBtn = document.getElementById('start-scraper');
        const csvBtn = document.getElementById('export-csv');
        const jsonBtn = document.getElementById('export-json');

        if (State.isRunning) {
            statusEl.textContent = `Scraping: ${State.currentIndex}/${State.totalFights} fights`;
            progressEl.style.display = 'block';
            const pct = State.totalFights > 0 ? (State.currentIndex / State.totalFights * 100) : 0;
            progressBar.style.width = pct + '%';
            progressText.textContent = `${State.currentIndex}/${State.totalFights} complete`;
            startBtn.disabled = true;
            startBtn.style.opacity = '0.5';
            startBtn.style.cursor = 'not-allowed';
        } else {
            if (State.scrapedData.length > 0) {
                statusEl.textContent = `Complete: ${State.scrapedData.length} fights scraped`;
                progressEl.style.display = 'block';
                progressBar.style.width = '100%';
                progressText.textContent = `${State.scrapedData.length} fights ready`;
                csvBtn.style.display = 'block';
                jsonBtn.style.display = 'block';
            } else {
                statusEl.textContent = 'Ready';
                progressEl.style.display = 'none';
            }
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            startBtn.style.cursor = 'pointer';
        }
    }

    window.addEventListener('load', function() {
        console.log('UFC Stats + Odds Scraper loaded.');
        createUI();
        if (Config.AUTO_START) setTimeout(runScraper, 2000);
    });
})();