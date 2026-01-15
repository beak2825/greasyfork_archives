// ==UserScript==
// @name         Bitcointalk Quality Score 
// @namespace    http://tampermonkey.net/
// @version      0.1
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
        const date = new Date();
        date.setDate(date.getDate() - 120);
        return date.toISOString().split('T')[0];
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
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        const meritData = data[0]?.result?.data?.json?.histogram || [];
                        const posts120 = data[1]?.result?.data?.json?.total_posts_count || 0;

                        const merit120 = meritData.reduce((sum, day) => {
                            if (day?.merits_sum?.value) return sum + day.merits_sum.value;
                            return sum;
                        }, 0);

                        resolve({ merit120, posts120 });
                    } catch (e) {
                        console.error("Parse error:", e, response.responseText);
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
                const dateText = row.querySelectorAll('td')[1]?.textContent;
                if (dateText) return new Date(dateText);
            }
        }
        return new Date();
    }

    // ================= QUALITY SCORE =================
    function calculateQualityScore(posts, meritTotal, merit120, posts120, registrationDate) {

        const ageDays = Math.max(Math.floor((new Date() - registrationDate) / (1000*60*60*24)), 0);

        const Q_hist = (meritTotal / Math.max(posts,1)) * Math.sqrt(posts);
        const Q_120  = (posts120 > 0) ? (merit120 / posts120) : 0;

        const Age_factor = Math.min(Math.log(ageDays + 1) / Math.log(3650), 1);
        const Activity_factor = Math.min(posts120 / 50, 1);
        const Reliability = Math.min(posts / 500, 1);

        const Base =
              0.5 * Q_hist * Age_factor
            + 0.3 * Q_120  * Activity_factor
            + 0.2 * Q_hist;

        const Score = Base * Reliability;

        const dormant = posts120 === 0;

        return { Score, dormant };
    }

    function scoreLabel(score, dormant) {
        let rank;
        if (score < 1) rank = '🔴 Not good';
        else if (score < 5) rank = '🟠 Low quality';
        else if (score < 10) rank = '🟡 Normal';
        else if (score < 40) rank = '🟢 Good user';
        else if (score < 80) rank = '🔵 High quality';
        else rank = '🟣 Elite';

        if (dormant) rank += ' 💤Dormant';
        return rank;
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

        const uidMatch = window.location.search.match(/u=(\d+)/);
        if (!uidMatch) return;
        const userUid = uidMatch[1];

        try {
            const { merit120, posts120 } = await fetchMeritsAndPosts120(userUid);

            const posts = getProfileNumber('Posts');
            const meritTotal = getProfileNumber('Merit');
            const registrationDate = getProfileRegistrationDate();

            const { Score, dormant } =
                calculateQualityScore(posts, meritTotal, merit120, posts120, registrationDate);

            insertRowAfterMerit('Merits (120 days):', `<b>${merit120}</b>`);
            insertRowAfterMerit('Posts (120 days):', `<b>${posts120}</b>`);
            insertRowAfterMerit(
                'Quality Score:',
                `<b>${Score.toFixed(2)}</b> — ${scoreLabel(Score, dormant)}`
            );

        } catch (err) {
            console.error("Script error:", err);
        }
    }

    window.addEventListener('load', main);

})();