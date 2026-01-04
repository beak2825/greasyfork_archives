// ==UserScript==
// @name         Upcoming UFC Fight Stats Scraper (For use with the prediction python script)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Scrapes UFC Stats event pages, calculates days since last fight, and merges with live odds.
// @author       Merged by Gemini
// @match        http://www.ufcstats.com/event-details/*
// @match        https://www.ufcstats.com/event-details/*
// @connect      bestfightodds.com
// @connect      www.bestfightodds.com
// @connect      ufcstats.com
// @connect      www.ufcstats.com
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561058/Upcoming%20UFC%20Fight%20Stats%20Scraper%20%28For%20use%20with%20the%20prediction%20python%20script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561058/Upcoming%20UFC%20Fight%20Stats%20Scraper%20%28For%20use%20with%20the%20prediction%20python%20script%29.meta.js
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
    // 2. TEXT UTILITIES
    // ========================================================================
    const TextUtils = {
        clean: function(text) {
            return text ? String(text).replace(/\s+/g, ' ').trim() : '';
        },

        normalize: function(name) {
            if (!name) return '';
            return name.toLowerCase().trim()
                .replace(/-/g, ' ') // FIX: Replace hyphens with spaces first (e.g. Cortes-Acosta -> Cortes Acosta)
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '') // Remove suffixes
                .replace(/[^a-z0-9\s]/g, '') // Remove remaining special chars
                .replace(/\s+/g, ' ').trim();
        },

        parseRecord: function(recordStr) {
            if (!recordStr) return { wins: null, losses: null, draws: null };
            const cleanStr = String(recordStr).replace('Record:', '').trim();
            const parts = cleanStr.split('-');
            if (parts.length < 2) return { wins: null, losses: null, draws: null };

            // Helper to ensure 0 is returned as 0, not null
            const parseVal = (val) => {
                const num = parseInt(val, 10);
                return isNaN(num) ? null : num;
            };

            return {
                wins: parseVal(parts[0]),
                losses: parseVal(parts[1]),
                draws: parseVal(parts[2])
            };
        },

        parseHeight: function(heightStr) {
            if (!heightStr) return null;
            const match = heightStr.match(/(\d+)'?\s*(\d+)?/);
            if (match) {
                const feet = parseInt(match[1], 10);
                const inches = match[2] ? parseFloat(match[2]) : 0;
                return feet * 12 + inches;
            }
            return null;
        },

        parseReach: function(reachStr) {
            if (!reachStr) return null;
            const match = reachStr.match(/(\d+\.?\d*)/);
            return match ? parseFloat(match[1]) : null;
        },

        parseAge: function(dobStr, eventDate) {
            if (!dobStr || !eventDate) return null;
            try {
                const dob = new Date(dobStr);
                const ref = new Date(eventDate);
                if (isNaN(dob) || isNaN(ref)) return null;

                let age = ref.getFullYear() - dob.getFullYear();
                const monthDiff = ref.getMonth() - dob.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < dob.getDate())) {
                    age--;
                }
                return age;
            } catch (e) {
                return null;
            }
        },

        formatDateISO: function(dateStr) {
            try {
                const d = new Date(dateStr);
                if (isNaN(d)) return new Date().toISOString().slice(0, 10);
                return d.toISOString().slice(0, 10);
            } catch (e) {
                return new Date().toISOString().slice(0, 10);
            }
        }
    };

    // ========================================================================
    // 3. BEST FIGHT ODDS LOGIC
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

                // Store using the robust normalization
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
                    f1Url: fighterLinks[0].href, // Captured for history scraping
                    fighter2: TextUtils.clean(fighterLinks[1].textContent),
                    f2Url: fighterLinks[1].href, // Captured for history scraping
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

                        // Loop through history to find the first completed fight before this event
                        for (let row of rows) {
                            const tds = row.querySelectorAll('td');
                            if (tds.length < 7) continue;

                            // Date is typically in the 7th column (index 6), often in the 2nd <p> tag
                            const pTags = tds[6].querySelectorAll('p');
                            let dateText = pTags.length > 1 ? pTags[1].textContent.trim() : tds[6].textContent.trim();

                            const fightDate = new Date(dateText);
                            if (isNaN(fightDate)) continue;

                            // If this fight date is strictly before our current event date, it's the "last fight"
                            if (fightDate < currentEvtDateObj) {
                                const diffTime = Math.abs(currentEvtDateObj - fightDate);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                resolve(diffDays);
                                return;
                            }
                        }
                        resolve(null); // No previous fights found
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
        // Note: total1 might still be null if parseRecord returned nulls.
        // If 0 wins, 0 losses, 0 draws -> total is 0.
        const total1 = (record1.wins !== null) ? (record1.wins + (record1.losses||0) + (record1.draws || 0)) : null;
        const total2 = (record2.wins !== null) ? (record2.wins + (record2.losses||0) + (record2.draws || 0)) : null;
        const name1 = fightData.fighter1?.name || fightData.fighter1;
        const name2 = fightData.fighter2?.name || fightData.fighter2;

        // --- LOOKUP ODDS ---
        const odds1 = State.oddsData.get(TextUtils.normalize(name1)) || null;
        const odds2 = State.oddsData.get(TextUtils.normalize(name2)) || null;

        return {
            fight_id: fightId,
            event_date: eventDate,
            weight_class: fightData.weightClass || 'Unknown',

            f0_name: name1,
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
            'f0_name', 'f0_odds', 'f0_days_since_last_fight', 'f0_age', 'f0_height', 'f0_reach', 'f0_wins', 'f0_losses', 'f0_draws', 'f0_total_fights',
            'f1_name', 'f1_odds', 'f1_days_since_last_fight', 'f1_age', 'f1_height', 'f1_reach', 'f1_wins', 'f1_losses', 'f1_draws', 'f1_total_fights',
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
                    // Fetch Matchup Stats (Original Iframe Method)
                    const matchupPromise = scrapeMatchupPage(fight.url);
                    // Fetch Days Since Last Fight (New Background Request)
                    const f1DaysPromise = getDaysSinceLastFight(fight.f1Url, State.eventDate);
                    const f2DaysPromise = getDaysSinceLastFight(fight.f2Url, State.eventDate);

                    const [matchupData, f0_days, f1_days] = await Promise.all([matchupPromise, f1DaysPromise, f2DaysPromise]);

                    matchupData.weightClass = fight.weightClass;
                    matchupData.fighter1 = matchupData.fighter1?.name || fight.fighter1;
                    matchupData.fighter2 = matchupData.fighter2?.name || fight.fighter2;

                    const fightId = `${State.eventName.replace(/\s+/g, '_')}_${String(i + 1).padStart(2, '0')}`;

                    // Pass the new days data into the transform function
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