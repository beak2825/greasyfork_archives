/* jshint esversion: 11 */
/* global GM_xmlhttpRequest, GM, window, document, console, navigator, Blob, URL, setTimeout, clearTimeout, DOMParser, location */

// ==UserScript==
// @name         UFC Fight Card Scraper
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      7.19
// @description  Merged stats from ufcstats.com and tapology.com
// @match        http://ufcstats.com/event-details/*
// @match        https://ufcstats.com/event-details/*
// @match        http://www.ufcstats.com/event-details/*
// @match        https://www.ufcstats.com/event-details/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      ufcstats.com
// @connect      tapology.com
// @connect      www.tapology.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558015/UFC%20Fight%20Card%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/558015/UFC%20Fight%20Card%20Scraper.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // ======================================================================
    // CONFIG
    // ======================================================================
    let FORCE_UPCOMING = false;
    const MAX_CONCURRENT = 2;
    const TAPOLOGY_SEARCH = "https://www.tapology.com/search?term=";
    const TAPOLOGY_BASE = "https://www.tapology.com";
    const CONFIG = {
        expandDelay: 150,
        fighterDelay: 300
    };

    // ======================================================================
    // UTILITY FUNCTIONS
    // ======================================================================
    const clean = s => (s == null ? "" : String(s)).replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
    const toDoc = html => new DOMParser().parseFromString(html, "text/html");
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const httpCache = new Map();

    // ----------------------------------------------------------------------
    // gmFetchText
    // ----------------------------------------------------------------------
    function gmFetchText(url) {
        if (httpCache.has(url)) {
            return Promise.resolve(httpCache.get(url));
        }

        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("GM timeout")), 20000);
            const done = txt => {
                clearTimeout(timer);
                httpCache.set(url, txt);
                resolve(txt);
            };
            const fail = e => {
                clearTimeout(timer);
                reject(e);
            };

            const headers = {
                "User-Agent": navigator.userAgent
            };

            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    timeout: 20000,
                    headers,
                    onload: r => done(r.responseText),
                    onerror: fail,
                    ontimeout: fail
                });
            } else if (typeof GM !== "undefined" && typeof GM.xmlHttpRequest === "function") {
                GM.xmlHttpRequest({
                    method: "GET",
                    url,
                    timeout: 20000,
                    headers,
                    onload: r => done(r.responseText),
                    onerror: fail,
                    ontimeout: fail
                });
            } else {
                fetch(url)
                    .then(r => r.text())
                    .then(done)
                    .catch(fail);
            }
        });
    }

    // ----------------------------------------------------------------------
    // gmFetchTextWithRetry
    // ----------------------------------------------------------------------
    async function gmFetchTextWithRetry(url, maxRetries = 2) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    const delay = 1000 * Math.pow(2, attempt);
                    console.log("Retry", attempt, "/", maxRetries, "for", url);
                    await sleep(delay);
                }
                return await gmFetchText(url);
            } catch (err) {
                if (attempt === maxRetries) throw err;
                console.warn("Attempt", attempt + 1, "failed for", url, err.message);
            }
        }
    }

    // ======================================================================
    // CLOUDLARE BLOCK DETECTOR
    // ======================================================================
    function isBlocked(htmlOrDoc) {
        let text = "";
        if (typeof htmlOrDoc === "string") {
            text = htmlOrDoc;
        } else if (htmlOrDoc && htmlOrDoc.body) {
            text = htmlOrDoc.body.innerText || "";
        }
        const t = text.toLowerCase();
        return (
            (t.includes("cloudflare") && (t.includes("attention") || t.includes("required") || t.includes("moment"))) ||
            t.includes("enable cookies") ||
            t.includes("turn javascript")
        );
    }

    // ======================================================================
    // IMPROVED NAME MATCHING
    // ======================================================================
    function stripNickname(text) {
        return text.replace(/["']([^"']+)["']\s*/g, "").trim();
    }

    function normalizeName(name) {
        let n = clean(name);
        n = stripNickname(n);
        n = n.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "");
        return n.trim();
    }

    function namesMatch(a, b) {
        const A = stripNickname(a);
        const B = stripNickname(b);
        if (clean(A).toLowerCase() === clean(B).toLowerCase()) return true;
        if (normalizeName(A) === normalizeName(B)) return true;

        const aw = clean(A).toLowerCase().split(/\s+/);
        const bw = clean(B).toLowerCase().split(/\s+/);

        if (aw.length >= 2 && bw.length >= 2) {
            const f1 = aw[0],
                l1 = aw[aw.length - 1];
            const f2 = bw[0],
                l2 = bw[bw.length - 1];
            if (f1 === f2 && l1 === l2) return true;
            if (f1.replace(/\s+/g, "") === f2.replace(/\s+/g, "") &&
                l1.replace(/\s+/g, "") === l2.replace(/\s+/g, "")) {
                return true;
            }
        }
        return false;
    }

    // ======================================================================
    // OPTION C: BUILD TAPOLOGY SEARCH TERMS
    // ======================================================================
    function buildTapologySearchTerms(fighterName) {
        const base = clean(fighterName);
        const parts = base.split(/\s+/);
        const out = new Set();

        // Original
        out.add(base);
        // De-camel-case
        if (parts[0] && parts[0].match(/[a-z][A-Z]/)) {
            const dc = parts[0].replace(/([a-z])([A-Z])/g, "$1 $2");
            out.add([dc, ...parts.slice(1)].join(" "));
        }

        // Recombine if >= 3 parts
        if (parts.length >= 3) {
            const [p1, p2, p3] = parts;
            out.add(`${p1} ${p2} ${p3}`);
            out.add(`${p1} ${p3}`);
            out.add(`${p2} ${p3}`);
            out.add(`${p1} ${p2}`);
        }

        // Last name fallback
        if (parts.length >= 2) {
            out.add(parts[parts.length - 1]);
        }

        // First name fallback
        out.add(parts[0]);

        // No-space version
        out.add(base.replace(/\s+/g, ""));

        return Array.from(out);
    }

    // ======================================================================
    // TAPOLOGY RANKING CACHE
    // ======================================================================
    const tapologyRankingCache = new Map();
    // ======================================================================
    // fetchOpponentRanking
    // ======================================================================
    async function fetchOpponentRanking(fighterName) {
        const key = fighterName.toLowerCase().trim();
        if (tapologyRankingCache.has(key)) return tapologyRankingCache.get(key);
        try {
            let searchDoc = null;
            const terms = buildTapologySearchTerms(fighterName);
            console.log("Ranking search terms:", terms);
            for (const term of terms) {
                const url = TAPOLOGY_SEARCH + encodeURIComponent(term);
                const html = await gmFetchTextWithRetry(url);
                if (isBlocked(html)) continue;
                const doc = toDoc(html);
                const links = doc.querySelectorAll('a[href*="/fightcenter/fighters/"]');
                if (links.length > 0) {
                    searchDoc = doc;
                    console.log("Matched", fighterName, "via term:", term);
                    break;
                }
            }

            if (!searchDoc) {
                tapologyRankingCache.set(key, "Unranked");
                return "Unranked";
            }

            let top = searchDoc.querySelector('ul.searchResult li.link a[href*="/fightcenter/fighters/"]');
            const all = searchDoc.querySelectorAll('a[href*="/fightcenter/fighters/"]');
            if (!top && all.length) {
                for (const link of all) {
                    if (namesMatch(fighterName, clean(link.innerText))) {
                        top = link;
                        break;
                    }
                }
                if (!top) top = all[0];
            }

            const profileUrl = TAPOLOGY_BASE + top.getAttribute("href").split("?")[0];
            const html2 = await gmFetchTextWithRetry(profileUrl);
            if (isBlocked(html2)) {
                tapologyRankingCache.set(key, "Blocked");
                return "Blocked";
            }

            const doc2 = toDoc(html2);
            // Ranking extraction
            let result = "Unranked";
            const rankingSection = Array.from(doc2.querySelectorAll("div")).find(d =>
                d.innerText.includes("UFC Ranking") && d.className && d.className.includes("flex")
            );
            if (rankingSection) {
                const hashDiv = Array.from(rankingSection.querySelectorAll("div")).find(d => d.innerText.trim() === "#");
                if (hashDiv && hashDiv.nextElementSibling) {
                    const rank = hashDiv.nextElementSibling.innerText.trim();
                    const ofSpan = rankingSection.querySelector("span");
                    result = ofSpan ?
                        `#${rank} ${clean(ofSpan.innerText).replace(/\.$/, "")}` :
                        `#${rank}`;
                }
            }

            if (result === "Unranked") {
                const pageText = doc2.body.innerText;
                const m = pageText.match(
                    /#?\s*(\d+)\s+of\s+(\d+)\s+at\s+(Flyweight|Bantamweight|Featherweight|Lightweight|Welterweight|Middleweight|Light Heavyweight|Heavyweight)/i
                );
                if (m) {
                    result = `#${m[1]} of ${m[2]} at ${m[3]}`;
                }
            }

            tapologyRankingCache.set(key, result);
            return result;
        } catch (err) {
            console.error("Rank fetch fail for", fighterName, err);
            tapologyRankingCache.set(key, "Unranked");
            return "Unranked";
        }
    }

    // ======================================================================
    // fetchTapologyData (FULL VERSION)
    // ======================================================================
    async function fetchTapologyData(fighterName) {
        try {
            let searchDoc = null;
            let profileUrl = null;
            const terms = buildTapologySearchTerms(fighterName);
            console.log("Tapology search terms:", terms);
            for (const term of terms) {
                const url = TAPOLOGY_SEARCH + encodeURIComponent(term);
                const html = await gmFetchTextWithRetry(url);
                if (isBlocked(html)) continue;

                const doc = toDoc(html);
                const links = doc.querySelectorAll('a[href*="/fightcenter/fighters/"]');
                if (links.length > 0) {
                    let top = doc.querySelector('ul.searchResult li.link a[href*="/fightcenter/fighters/"]');
                    if (!top) {
                        for (const link of links) {
                            if (namesMatch(fighterName, clean(link.innerText))) {
                                top = link;
                                break;
                            }
                        }
                        if (!top) top = links[0];
                    }
                    profileUrl = TAPOLOGY_BASE + top.getAttribute("href").split("?")[0];
                    searchDoc = doc;
                    console.log("Tapology matched", fighterName, "via term:", term);
                    break;
                }
            }

            if (!searchDoc) return null;
            const html2 = await gmFetchTextWithRetry(profileUrl);
            if (isBlocked(html2)) return null;

            return await parseTapologyFighterPage(toDoc(html2), profileUrl);
        } catch (err) {
            console.error("Tapology fetch failed", fighterName, err);
            return null;
        }
    }

    // ======================================================================
    // parseTapologyFighterPage (FULL VERSION, NO TRUNCATION)
    // ======================================================================
    async function parseTapologyFighterPage(doc, url) {
        const data = {
            url,
            name: "Unknown",
            nickname: null,
            tapology_ranking: "Unranked",
            career_stats: {
                wins: {
                    total: 0,
                    ko: 0,
                    sub: 0,
                    dec: 0
                },
                losses: {
                    total: 0,
                    ko: 0,
                    sub: 0,
                    dec: 0
                }
            },
            stats: {
                height: "?",
                weight: "?",
                reach: "?",
                age: "?"
            },
            history: []
        };

        // NAME
        const h1 = doc.querySelector("div.fighterPageHeader h1") || doc.querySelector("h1");
        if (h1) data.name = clean(h1.innerText);

        // NICKNAME
        const nickMatch = doc.querySelector(".nickname");
        if (nickMatch) {
            data.nickname = clean(nickMatch.innerText.replace(/["']/g, ""));
        } else {
            const detailsBox = doc.querySelector('[class*="fighterDetails"]') || doc.body;
            const nickSpan = Array.from(detailsBox.querySelectorAll("span")).find(s => {
                const prev = s.previousElementSibling;
                return prev && prev.innerText.match(/Nickname:/i);
            });
            if (nickSpan) data.nickname = clean(nickSpan.innerText);
        }

        // CAREER STATS
        const recordStats = doc.getElementById("fighterRecordStats") || doc.querySelector(".mt-5.leading-none");
        if (recordStats) {
            const blocks = recordStats.querySelectorAll("li");
            blocks.forEach(block => {
                const primary = block.querySelector(".primary");
                if (!primary) return;
                const method = clean(primary.innerText).toUpperCase();

                const secondary = block.querySelector(".secondary");
                if (!secondary) return;
                const st = secondary.innerText;

                const winsMatch = st.match(/(\d+)\s*Win/i);
                const lossMatch = st.match(/(\d+)\s*Loss/i);
                const wins = winsMatch ? parseInt(winsMatch[1]) : 0;
                const losses = lossMatch ? parseInt(lossMatch[1]) : 0;
                if (method.includes("KO") || method.includes("TKO")) {
                    data.career_stats.wins.ko += wins;
                    data.career_stats.losses.ko += losses;
                } else if (method.includes("SUB")) {
                    data.career_stats.wins.sub += wins;
                    data.career_stats.losses.sub += losses;
                } else if (method.includes("DEC")) {
                    data.career_stats.wins.dec += wins;
                    data.career_stats.losses.dec += losses;
                }
            });

            data.career_stats.wins.total =
                data.career_stats.wins.ko + data.career_stats.wins.sub + data.career_stats.wins.dec;
            data.career_stats.losses.total =
                data.career_stats.losses.ko + data.career_stats.losses.sub + data.career_stats.losses.dec;
        }

        // MOBILE STATS BOX
        const mobileStats = doc.getElementById("mobileHighlights");
        if (mobileStats) {
            const txt = mobileStats.textContent;
            const get = re => (txt.match(re) || [])[1] || "?";
            data.stats.age = get(/Age\s*(\d+)/);
            data.stats.height = get(/Height\s*([^\s]+)/).replace(/"/g, "");
            data.stats.weight = get(/Weight\s*([\d\.]+)/);
            data.stats.reach = get(/Reach\s*([\d\.]+)/);
        }

        // RANKING
        const rankingSection = Array.from(doc.querySelectorAll("div")).find(d =>
            d.innerText.includes("UFC Ranking") && d.className && d.className.includes("flex")
        );
        if (rankingSection) {
            const hashDiv = Array.from(rankingSection.querySelectorAll("div")).find(d => d.innerText.trim() === "#");
            if (hashDiv && hashDiv.nextElementSibling) {
                const num = hashDiv.nextElementSibling.innerText.trim();
                const span = rankingSection.querySelector("span");
                data.tapology_ranking = span ?
                    `#${num} ${clean(span.innerText).replace(/\.$/, "")}` :
                    `#${num}`;
            }
        }

        if (data.tapology_ranking === "Unranked") {
            const txt = doc.body.innerText;
            const m = txt.match(
                /#?\s*(\d+)\s+of\s+(\d+)\s+at\s+(Flyweight|Bantamweight|Featherweight|Lightweight|Welterweight|Middleweight|Light Heavyweight|Heavyweight)/i
            );
            if (m) data.tapology_ranking = `#${m[1]} of ${m[2]} at ${m[3]}`;
        }

        // HISTORY
        const rows = Array.from(doc.querySelectorAll('div[id^="b"]'));
        for (const row of rows) {
            if (data.history.length >= 6) break;

            const txt = row.innerText;
            if (txt.match(/Cancelled|Scrapped|Bout Moved/i)) continue;

            const toggle = row.querySelector('[data-action*="toggleDetail"]') ||
                row.querySelector("button") ||
                row.querySelector('[class*="mobileMore"]');
            if (toggle && !toggle.classList.contains("expanded")) {
                toggle.click();
                await sleep(CONFIG.expandDelay);
            }

            // result
            let result = "N/A";
            if (row.querySelector(".win")) result = "Win";
            else if (row.querySelector(".loss")) result = "Loss";
            else if (row.querySelector(".draw")) result = "Draw";
            else {
                const m1 = txt.match(/\b(Win|Loss|Draw|NC)\b/i);
                const m2 = txt.match(/\b(W|L|D)\b/);
                if (m1) result = m1[0];
                else if (m2) {
                    result = {
                        W: "Win",
                        L: "Loss",
                        D: "Draw"
                    } [m2[0]];
                }
            }

            // opponent
            const oppLink = row.querySelector('a[href^="/fightcenter/fighters/"]');
            if (!oppLink) continue;
            const opponent = clean(oppLink.innerText);

            // event
            const evLink = row.querySelector('a[href^="/fightcenter/events/"]');
            const event = evLink ? clean(evLink.innerText) : "Unknown Event";

            // date
            let date = "N/A";
            let m;
            if ((m = txt.match(/(\d{4})\.(\d{2})\.(\d{2})/))) {
                date = `${m[1]}-${m[2]}-${m[3]}`;
            } else if ((m = txt.match(/\b(19|20)\d{2}\b/))) {
                date = m[0];
            }

            // method
            let method = "N/A";
            if ((m = txt.match(/(Submission|Decision|KO\/TKO|Draw|No Contest)\s*(\([^\)]+\))?/i))) {
                method = m[0].trim();
            } else if ((m = txt.match(/\b(KO|TKO|Sub|Dec)\b/i))) {
                method = m[0];
            }

            // round / time logic fix
            let round = "-";
            let time = "-";
            const r = txt.match(/R(\d+)/);
            const t = txt.match(/(\d:\d{2})/);

            if (r) round = r[1];
            if (t) time = t[1];

            if (/Decision/i.test(method)) {
                // 1. explicit extraction
                const totalMatch = txt.match(/(\d+)\s*R(?:nd|ound)/i);
                if (totalMatch) {
                    const tr = parseInt(totalMatch[1], 10);
                    if (tr === 3) {
                        round = "3";
                        time = "15:00";
                    }
                    if (tr === 5) {
                        round = "5";
                        time = "25:00";
                    }
                }
                // 2. inference if still missing
                if (round === "-" || round === "0") {
                    const isFiveRounder = /Title Fight|Main Event|Championship/i.test(txt);
                    if (isFiveRounder) {
                        round = "5";
                        time = "25:00";
                    } else {
                        round = "3";
                        time = "15:00";
                    }
                }
                // 3. fill missing time
                if (time === "-" || time === "0:00") {
                    if (round === "5") time = "25:00";
                    if (round === "3") time = "15:00";
                }
            }

            // odds
            let odds = "N/A";
            if ((m = txt.match(/Odds:\s*([+-]?\d{2,})/i))) odds = m[1];

            // NEW: fetch Tapology ranking for the opponent
            const opponent_tapology_ranking = await fetchOpponentRanking(opponent);
            data.history.push({
                opponent,
                opponent_tapology_ranking,
                event,
                result,
                method,
                date,
                round,
                time,
                odds
            });
        }

        return data;
    }

    // ======================================================================
    // UFC PORTION (FULL, NO TRUNCATION)
    // ======================================================================

    // DATE NORMALIZER
    const _mon = {
        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        aug: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dec: "12"
    };

    function normalizeDateToISO(input) {
        const s = clean(input);
        if (!s) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

        let m;
        if ((m = s.match(/^(\d{4}-\d{2}-\d{2})T/))) return m[1];

        if ((m = s.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})\b/i))) {
            const mon = _mon[m[1].toLowerCase()];
            const day = ("0" + m[2]).slice(-2);
            return `${m[3]}-${mon}-${day}`;
        }

        if ((m = s.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+(\d{1,2}),\s*(\d{4})\b/i))) {
            const mon = _mon[m[1].toLowerCase()];
            const day = ("0" + m[2]).slice(-2);
            return `${m[3]}-${mon}-${day}`;
        }

        return s;
    }

    function parseNumberLoose(s) {
        if (s == null) return null;
        const m = String(s).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
        return m ? Number(m[0]) : null;
    }

    function inchesFromHeightString(s) {
        if (!s) return null;
        let m;
        if ((m = s.match(/(\d+)\s*['ft]\s*(\d+)?/i))) {
            const ft = parseInt(m[1]);
            const inch = parseInt(m[2] || "0");
            return ft * 12 + inch;
        }
        if ((m = s.match(/(\d+(?:\.\d+)?)\s*in\b/i))) {
            return parseFloat(m[1]);
        }
        return parseNumberLoose(s);
    }

    // UFC EVENT META
    function ufc_getEventMeta() {
        const titleEl = document.querySelector("h2.b-content__title");
        const meta = {
            title: clean(titleEl ? titleEl.innerText : "") || "UFC Event",
            date: null,
            location: null
        };
        document.querySelectorAll(".b-list__box-list > li").forEach(li => {
            const lab = clean(li.querySelector("i")?.innerText || "").toLowerCase();
            const txt = clean(li.innerText || "");
            if (lab.startsWith("date")) meta.date = txt.replace(/^date:\s*/i, "");
            if (lab.startsWith("location")) meta.location = txt.replace(/^location:\s*/i, "");
        });
        return meta;
    }

    // UFC SCAN FIGHTS
    function ufc_scanFights() {
        const rows = document.querySelectorAll('tr[onclick*="fight-details"], tr[data-link*="fight-details"]');
        const fights = [];
        rows.forEach(row => {
            let url = "";
            const oc = row.getAttribute("onclick");
            const dl = row.getAttribute("data-link");

            if (oc) url = oc.match(/https?:\/\/ufcstats\.com\/fight-details\/[a-f0-9]+/i)?.[0] || "";
            if (!url && dl) {
                url = dl.startsWith("http") ? dl : "https://ufcstats.com" + dl;
                url = url.split("?")[0];
            }

            const links = Array.from(row.querySelectorAll("a[href*='fighter-details']"));
            if (links.length >= 2 && url) {
                fights.push({
                    url,
                    fighters: `${clean(links[0].innerText)} vs ${clean(links[1].innerText)}`,
                    weightClass: clean(row.querySelector("td:nth-child(7)")?.innerText || ""),
                    fighter1: {
                        name: clean(links[0].innerText),
                        url: links[0].href.split("?")[0]
                    },
                    fighter2: {
                        name: clean(links[1].innerText),
                        url: links[1].href.split("?")[0]
                    }
                });
            }
        });
        // De-duplicate
        return fights.filter((f, i, arr) => arr.findIndex(x => x.url === f.url) === i);
    }

    // SCRAPE FIGHTER PROFILE
    async function ufc_scrapeFighterProfile(ufcUrl, fallbackName) {
        const html = await gmFetchTextWithRetry(ufcUrl);
        const doc = toDoc(html);
        const name = clean(doc.querySelector(".b-content__title-highlight")?.innerText) || clean(fallbackName);

        const tale = {};
        doc.querySelectorAll(".b-list__info-box.b-list__info-box_style_small-width .b-list__box-list li")
            .forEach(li => {
                const lab = clean(li.querySelector("i")?.innerText || "").toLowerCase();
                const txt = clean(li.innerText || "");
                if (lab.includes("height")) tale.height = txt.replace(/^height:\s*/i, "");
                if (lab.includes("weight")) tale.weight = txt.replace(/^weight:\s*/i, "");
                if (lab.includes("reach")) tale.reach = txt.replace(/^reach:\s*/i, "");
                if (lab.includes("stance")) tale.stance = txt.replace(/^stance:\s*/i, "");
                if (lab.includes("dob")) tale.dob = txt.replace(/^dob:\s*/i, "");
            });

        // STATS EXTRACTION (CLEANED)
        const career = {};
        doc.querySelectorAll(".b-list__info-box_style_middle-width .b-list__box-list li")
            .forEach(li => {
                const t = clean(li.innerText || "");
                if (/^SLpM\s*:/i.test(t)) career.SLpM = t.replace(/^SLpM\s*:\s*/i, "");
                if (/^Str\.\s*Acc\.\s*:/i.test(t)) career.StrAcc = t.replace(/^Str\.\s*Acc\.\s*:\s*/i, "");
                if (/^SApM\s*:/i.test(t)) career.SApM = t.replace(/^SApM\s*:\s*/i, "");
                if (/^Str\.\s*Def\s*:/i.test(t)) career.StrDef = t.replace(/^Str\.\s*Def\s*:\s*/i, "");
                if (/^TD\s+Avg\.\s*:/i.test(t)) career.TDAvg = t.replace(/^TD\s+Avg\.\s*:\s*/i, "");
                if (/^TD\s+Acc\.\s*:/i.test(t)) career.TDAcc = t.replace(/^TD\s+Acc\.\s*:\s*/i, "");
                if (/^TD\s+Def\.\s*:/i.test(t)) career.TDDef = t.replace(/^TD\s+Def\.\s*:\s*/i, "");
            });

        const past = [];
        const tbl = Array.from(doc.querySelectorAll("table.b-fight-details__table"))
            .find(t => /W\/L/i.test(t.innerText));
        if (tbl) {
            Array.from(tbl.querySelectorAll("tbody tr")).forEach(tr => {
                const resNode = tr.querySelector("td:nth-child(1)");
                const rtext = clean(resNode?.innerText || "");
                const resultChar = rtext.charAt(0).toUpperCase();
                if (!resultChar) return;

                const oppLink = Array.from(tr.querySelectorAll("a[href*='fighter-details']"))
                    .find(a => clean(a.innerText) !== name);
                const opp = clean(oppLink?.innerText || "");
                const eventLink = tr.querySelector("a[href*='event-details']");
                const event = clean(eventLink?.innerText || "");

                const tds = Array.from(tr.querySelectorAll("td"));
                const method = clean(tds[7]?.innerText || "");
                const round = clean(tds[8]?.innerText || "");
                const time = clean(tds[9]?.innerText || "");

                const dateRaw = clean(eventLink?.closest("td")?.querySelector("p:nth-of-type(2)")?.innerText || "");
                const date = normalizeDateToISO(dateRaw);

                past.push({
                    result: resultChar,
                    opponent: opp,
                    event,
                    method,
                    round,
                    time,
                    date
                });
            });
        }

        return {
            name,
            url: ufcUrl,
            taleOfTape: tale,
            careerRaw: career,
            pastFights: past
        };
    }

    // MERGE UFC + TAPOLOGY
    async function buildMergedFighter(ufcData, tapologyData, currentEventTitle) {
        const t = tapologyData || {
            stats: {
                height: "?",
                weight: "?",
                reach: "?",
                age: "?"
            },
            history: [],
            career_stats: {
                wins: {},
                losses: {}
            },
            nickname: null,
            tapology_ranking: "Unranked"
        };
        const u = ufcData || {};

        const cleanHistory = (hist = []) => {
            if (FORCE_UPCOMING && currentEventTitle) {
                hist = hist.filter(f => !f.event?.includes(currentEventTitle));
            }
            return hist.slice(0, 5);
        };

        const history = cleanHistory(t.history);
        const inchHeight = u.taleOfTape?.height ?
            inchesFromHeightString(clean(u.taleOfTape.height)) :
            null;
        const inchReach = u.taleOfTape?.reach ?
            parseNumberLoose(clean(u.taleOfTape.reach)) :
            null;
        const lbs = u.taleOfTape?.weight ?
            parseNumberLoose(clean(u.taleOfTape.weight)) :
            null;

        const dob = u.taleOfTape?.dob;
        let age = null;
        if (dob) {
            const d = new Date(dob);
            if (!isNaN(d.getTime())) {
                const today = new Date();
                age = today.getFullYear() - d.getFullYear();
                if (today.getMonth() < d.getMonth() ||
                    (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())) {
                    age--;
                }
                if (age < 0 || age > 100) age = null;
            }
        }

        // --- STATS MERGING ---
        const careerStats = t.career_stats || {
            wins: {
                total: 0,
                ko: 0,
                sub: 0,
                dec: 0
            },
            losses: {
                total: 0,
                ko: 0,
                sub: 0,
                dec: 0
            }
        };

        if (u.careerRaw) {
            const c = u.careerRaw;
            careerStats.SLpM = c.SLpM || "?";
            careerStats.SApM = c.SApM || "?";
            careerStats.StrAcc = c.StrAcc || "?";
            careerStats.StrDef = c.StrDef || "?";
            careerStats.TDAvg = c.TDAvg || "?";
            careerStats.TDAcc = c.TDAcc || "?";
            careerStats.TDDef = c.TDDef || "?";
        }
        // ---------------------

        return {
            name: u.name || t.name || "Unknown",
            nickname: t.nickname || null,
            ufcfightstats_url: u.url || null,
            tapology_url: t.url || null,
            tapology_ranking: t.tapology_ranking || "Unranked",
            taleOfTape: {
                height: inchHeight ? `${Math.floor(inchHeight / 12)}'${inchHeight % 12}"` : (t.stats?.height || "?"),
                weight: lbs ? `${lbs} lbs` : `${t.stats?.weight || "?"} lbs`,
                reach: inchReach ? `${inchReach} in` : `${t.stats?.reach || "?"} in`,
                age,
                stance: u.taleOfTape?.stance || null,
                dob
            },
            careerStats: careerStats,
            fightHistory: history
        };
    }

    // CONCURRENCY CLEANED
    function runWithConcurrency(items, iterator, max = 3) {
        return new Promise(resolve => {
            const results = new Array(items.length);
            let idx = 0;
            let active = 0;

            const runItem = async (i, item) => {
                try {
                    results[i] = await iterator(item, i);
                } catch {
                    results[i] = null;
                }
                active--;
                next();
            };

            const next = () => {
                if (idx >= items.length && active === 0) {
                    resolve(results);
                    return;
                }
                while (active < max && idx < items.length) {
                    const i = idx++;
                    const item = items[i];
                    active++;
                    runItem(i, item);
                }
            };

            next();
        });
    }

    // RUN UFC EVENT SCRAPER
    async function ufc_scrapeEventToPayload() {
        const meta = ufc_getEventMeta();
        const fights = ufc_scanFights();

        const isoDate = normalizeDateToISO(meta.date || "");
        const locParts = (meta.location || "").split(",").map(clean).filter(Boolean);
        const [city, region, country] =
        locParts.length >= 3 ? [locParts[0], locParts[1], locParts[2]] :
            locParts.length === 2 ? [locParts[0], "", locParts[1]] : [locParts[0] || "", "", ""];

        const payload = {
            eventInfo: {
                title: meta.title,
                url: location.href,
                scrapedAt: FORCE_UPCOMING ? null : new Date().toISOString(),
                eventDate: FORCE_UPCOMING ? null : isoDate || null,
                eventLocation: meta.location || null,
                promotion: "Ultimate Fighting Championship (UFC)",
                city,
                region,
                country,
                totalFights: fights.length,
                analysisMode: FORCE_UPCOMING ? "upcoming" : "standard"
            },
            fightSummary: fights.map(f => ({
                fighters: f.fighters,
                weightClass: f.weightClass
            })),
            fullData: []
        };
        window.__CURRENT_EVENT_TITLE__ = payload.eventInfo.title || "";

        let completed = 0;
        setProgress(0, fights.length);
        const results = await runWithConcurrency(
            fights,
            async (f, idx) => {
                    try {
                        if (idx > 0) await sleep(CONFIG.fighterDelay);

                        const [u1, u2] = await Promise.all([
                            ufc_scrapeFighterProfile(f.fighter1.url, f.fighter1.name),
                            ufc_scrapeFighterProfile(f.fighter2.url, f.fighter2.name)
                        ]);

                        const [t1, t2] = await Promise.all([
                            fetchTapologyData(u1?.name || f.fighter1.name),
                            fetchTapologyData(u2?.name || f.fighter2.name)
                        ]);

                        const merged1 = await buildMergedFighter(u1, t1, payload.eventInfo.title);
                        const merged2 = await buildMergedFighter(u2, t2, payload.eventInfo.title);

                        return {
                            fighters: f.fighters,
                            fightUrl: f.url,
                            weightClass: f.weightClass,
                            status: FORCE_UPCOMING ? "scheduled" : "completed",
                            fighter1: merged1,
                            fighter2: merged2
                        };
                    } catch (e) {
                        console.error("Fight", idx, "error:", e);
                        return null;
                    } finally {
                        completed += 1;
                        setProgress(completed, fights.length);
                    }
                },
                MAX_CONCURRENT
        );

        payload.fullData = results;
        return payload;
    }

    // ======================================================================
    // UI
    // ======================================================================
    let ui = {
        root: null,
        msg: null,
        pbar: null
    };

    function setMsg(t) {
        if (ui.msg) ui.msg.textContent = t;
    }

    function setProgress(cur, tot) {
        const pct = tot > 0 ? Math.round((cur / tot) * 100) : 0;
        if (ui.pbar) ui.pbar.style.width = pct + "%";
        setMsg(tot ? `Progress ${cur}/${tot}` : "Idle");
    }

    function createBottomUI() {
        if (document.getElementById("unified-fight-scraper")) return;

        const bar = document.createElement("div");
        bar.id = "unified-fight-scraper";
        bar.style.cssText = `
    position:fixed;
    z-index:999999;
    bottom:20px;
    right:20px;
    width:560px;
    max-width:95vw;
    font:13px/1.4 system-ui,Segoe UI,Roboto,Arial;
    color:#fff;
    background:rgba(0,0,0,0.9);
    border-radius:10px;
    box-shadow:0 10px 30px rgba(0,0,0,0.35);
    padding:12px;
  `;

        bar.innerHTML = `
    <div style="font-weight:600;margin-bottom:6px;">UFC Fight Card Scraper – v7.19 Clean</div>
    <div id="ufc-msg">Ready.</div>

    <div style="margin-top:8px;background:#222;border-radius:6px;height:8px;overflow:hidden;">
      <div id="ufc-pbar" style="width:0%;height:100%;background:#4caf50;transition:width .25s;"></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">
      <button id="u-start" style="padding:6px 10px;border:0;background:#1976d2;color:#fff;border-radius:6px;cursor:pointer;">Start</button>
      <button id="u-copy" style="padding:6px 10px;border:0;background:#2e7d32;color:#fff;border-radius:6px;cursor:pointer;" disabled>Copy JSON</button>
      <button id="u-dl" style="padding:6px 10px;border:0;background:#00a37a;color:#fff;border-radius:6px;cursor:pointer;" disabled>Download JSON</button>
      <button id="u-close" style="padding:6px 10px;border:0;background:#9e9e9e;color:#fff;border-radius:6px;cursor:pointer;">Close</button>
    </div>

    <label style="display:block;margin-top:8px;">
      <input type="checkbox" id="u-upcoming"> Treat as upcoming
    </label>
  `;
        document.body.appendChild(bar);

        ui.root = bar;
        ui.msg = bar.querySelector("#ufc-msg");
        ui.pbar = bar.querySelector("#ufc-pbar");

        bar.querySelector("#u-start").onclick = startScrape;
        bar.querySelector("#u-copy").onclick = () => {
            if (!window.__SCRAPE_PAYLOAD_JSON__) return;
            copyTextToClipboard(window.__SCRAPE_PAYLOAD_JSON__);
        };
        bar.querySelector("#u-dl").onclick = () => {
            if (!window.__SCRAPE_PAYLOAD_JSON__) return;
            downloadText(
                window.__SCRAPE_PAYLOAD_JSON__,
                inferFilename(window.__SCRAPE_PAYLOAD__ || {}, FORCE_UPCOMING)
            );
        };
        bar.querySelector("#u-close").onclick = () => bar.remove();

        const cb = bar.querySelector("#u-upcoming");
        cb.checked = FORCE_UPCOMING;
        cb.onchange = () => {
            FORCE_UPCOMING = cb.checked;
        };
    }

    function downloadText(text, filename) {
        const blob = new Blob([text], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            a.remove();
        }, 200);
    }

    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => setMsg("JSON copied (navigator)"));
        } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
            setMsg("JSON copied (execCommand)");
        }
    }

    function inferFilename(p, isUpcomingFlag) {
        const title =
            (p.eventInfo?.title || document.title || "event")
            .replace(/[^A-Za-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
            .slice(0, 120) ||
            "event";

        return `${title}_${isUpcomingFlag ? "Upcoming" : "Completed"}.json`;
    }

    // MAIN SCRAPER START
    async function startScrape() {
        setMsg("Scanning...");
        try {
            const payload = await ufc_scrapeEventToPayload();
            const json = JSON.stringify(payload, null, 2);
            window.__SCRAPE_PAYLOAD__ = payload;
            window.__SCRAPE_PAYLOAD_JSON__ = json;

            const bar = document.getElementById("unified-fight-scraper");
            if (bar) {
                const copyBtn = bar.querySelector("#u-copy");
                const dlBtn = bar.querySelector("#u-dl");
                if (copyBtn) copyBtn.disabled = false;
                if (dlBtn) dlBtn.disabled = false;
            }

            setMsg("Ready to copy/download");
        } catch (e) {
            setMsg("Error: " + e.message);
            console.error(e);
        }
    }

    // INITIALIZE
    if (!document.getElementById("unified-fight-scraper")) {
        createBottomUI();
        setMsg("Ready.");
    }

})();