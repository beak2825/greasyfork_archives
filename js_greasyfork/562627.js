// ==UserScript==
// @name         Bitcointalk Quality Score 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shows Posts/Merits (120 days) and anti-exploit Quality Score on Bitcointalk profiles
// @author       Ace
// @match        https://bitcointalk.org/index.php?action=profile;u=*
// @grant        GM_xmlhttpRequest
// @connect      bitlist.co
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562627/Bitcointalk%20Quality%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/562627/Bitcointalk%20Quality%20Score.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // ================= DATE =================
    function getDate120DaysAgo() {
        const d = new Date();
        d.setDate(d.getDate() - 120);
        return d.toISOString().split('T')[0];
    }

    // ================= FETCH MERITS + POSTS 120 =================
    async function fetchMeritsAndPosts120(userUid) {
        const dateMin = getDate120DaysAgo();
        const dateMax = new Date().toISOString().split('T')[0];

        const url = `https://bitlist.co/trpc/merits.user_merits_per_day_histogram,posts.top_boards_by_post_count?batch=1&input=${encodeURIComponent(JSON.stringify({
            "0": { "json": { "date_min": dateMin, "date_max": dateMax, "user_uid": parseInt(userUid), "type": "received", "interval": "day" } },
            "1": { "json": { "date_min": dateMin, "date_max": dateMax, "author_uid": parseInt(userUid), "interval": "day" } }
        }))}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: function(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        const meritData = data[0]?.result?.data?.json?.histogram || [];
                        const posts120 = data[1]?.result?.data?.json?.total_posts_count || 0;
                        const merit120 = meritData.reduce((s, d) => (d?.merits_sum?.value ? s + d.merits_sum.value : s), 0);
                        resolve({ merit120, posts120 });
                    } catch (e) {
                        console.error("Parse error:", e, res.responseText);
                        reject(e);
                    }
                },
                onerror: function(err) {
                    console.error("Request error:", err);
                    reject(err);
                }
            });
        });
    }

    // ================= PARSE PROFILE =================
    function getProfileNumber(label) {
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const b = row.querySelector('td b');
            if (b && b.textContent.includes(label)) {
                const val = row.querySelectorAll('td')[1]?.textContent || '0';
                return parseInt(val.replace(/\D/g, ''), 10) || 0;
            }
        }
        return 0;
    }

    function getProfileRegistrationDate() {
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const b = row.querySelector('td b');
            if (b && b.textContent.includes('Date Registered')) {
                const txt = row.querySelectorAll('td')[1]?.textContent;
                if (txt) return new Date(txt);
            }
        }
        return new Date();
    }

    function getLastActiveDate() {
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const b = row.querySelector('td b');
            if (b && b.textContent.includes('Last Active')) {
                const txt = row.querySelectorAll('td')[1]?.textContent;
                if (txt && txt !== '(Recently)') return new Date(txt);
            }
        }
        return new Date();
    }

    // ================= SCORES =================
    function calculateScores(posts, meritTotal, posts120, merit120, registrationDate, lastActiveDate) {
        const ageDays = Math.max(Math.floor((Date.now() - registrationDate) / 86400000), 0);
        const inactiveDays = Math.max(Math.floor((Date.now() - lastActiveDate) / 86400000), 0);

        // Reputation Score (storico)
        const Q_hist = (meritTotal / Math.max(posts,1)) * Math.sqrt(posts);
        const Q_120  = (posts120 > 0) ? (merit120 / posts120) * Math.sqrt(posts120) : 0;
        const Reputation = 0.7 * Q_hist + 0.3 * Q_120;

        // Reliability
        const relPosts = Math.min(posts / 100, 1);
        const relAge   = Math.min(ageDays / 180, 1);
        const Reliability = relPosts * relAge;

        // Penalizzazione dormancy (graduale)
        const dormantFactor = inactiveDays > 120 ? Math.max(0.1, 1 - inactiveDays / 3650) : 1;

        // Final Score
        const FinalScore = Reputation * (0.4 + 0.6 * Reliability) * dormantFactor;

        // Promising newcomer badge
        const promising = ageDays < 60 && posts < 10 && meritTotal < 100;

        // Dormant badge
        const dormant = dormantFactor < 1;

        return { Reputation, Reliability, FinalScore, dormant, promising };
    }

    function rankLabel(finalScore, dormant, promising) {
        if (promising) return '🟢 Promising newcomer';
        if (dormant) {
            if (finalScore < 5) return '💤 Dormant — Not good';
            if (finalScore < 20) return '💤 Dormant — Low quality';
            if (finalScore < 95) return '💤 Dormant — High quality';
            return '💤 Dormant — Elite';
        }
        if (finalScore < 5) return '🔴 Not good';
        if (finalScore < 10) return '🟠 Low score';
        if (finalScore < 15) return '🟡 Normal score';
        if (finalScore < 60) return '🟢 Good score';
        if (finalScore < 95) return '🟣 High score';
        return '🔵 Elite';
    }

    // ================= DISPLAY =================
    function insertRowAfterMerit(label, value) {
        const meritLink = document.querySelector('a[href*="action=merit"]');
        if (!meritLink) return;
        const baseRow = meritLink.closest('tr');
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><b>${label}</b></td><td>${value}</td>`;
        baseRow.after(tr);
    }

    // ================= MAIN =================
    async function main() {
        const uidMatch = location.search.match(/u=(\d+)/);
        if (!uidMatch) return;
        const userUid = uidMatch[1];

        try {
            const { merit120, posts120 } = await fetchMeritsAndPosts120(userUid);

            const posts = getProfileNumber('Posts');
            const meritTotal = getProfileNumber('Merit');
            const regDate = getProfileRegistrationDate();
            const lastActiveDate = getLastActiveDate();

            const { Reputation, Reliability, FinalScore, dormant, promising } =
                calculateScores(posts, meritTotal, posts120, merit120, regDate, lastActiveDate);

            insertRowAfterMerit('Merits (120 days):', `<b>${merit120}</b>`);
            insertRowAfterMerit('Posts (120 days):', `<b>${posts120}</b>`);
            insertRowAfterMerit('Reputation Score:', `<b>${Reputation.toFixed(2)}</b>`);
            insertRowAfterMerit('Reliability:', `<b>${(Reliability*100).toFixed(0)}%</b>`);
            insertRowAfterMerit(
                'Quality Score:',
                `<b>${FinalScore.toFixed(2)}</b> — ${rankLabel(FinalScore, dormant, promising)}`
            );

        } catch (e) {
            console.error("Script error:", e);
        }
    }

    window.addEventListener('load', main);

})();