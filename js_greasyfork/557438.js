// ==UserScript==
// @name         💘 Kobe Sutra Position Checker
// @namespace    Popmundo.KobeTracker.Dynamic
// @version      2.0
// @description  Alerts if today's Kobe Sutra position is new or already known, using Character Trivia.
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557438/%F0%9F%92%98%20Kobe%20Sutra%20Position%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/557438/%F0%9F%92%98%20Kobe%20Sutra%20Position%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DIARY_PATTERNS = [
    // English variants
    /The Kobe Sutra recommend that I enjoy the (.+?) today\. Awesome!/i,
    /Interesting\.\.\. according to the Kobe Sutra I might find pleasure in the (.+?) today\./i,
    /Some of the positions in the Kobe Sutra are really demanding! I'm not sure I can do the (.+?) today\.\.\./i,

    // Turkish variants
    /Kobe Sutra bugün (.+?) ile zevkin doruklarına çıkmamı tavsiye ediyor\. Sanırım heyecandan kalbim yerinden çıkacak!/i,
    /Çok ilginç\.\.\. Kobe Sutra'ya göre bugün (.+?) ile zevkin doruklarına çıkabilirmişim\. Şimdiden elim ayağım titredi şerefsizim!/i,
    /Kobe Sutra'daki bazı pozisyonlar gerçekten çok zor\. Bugün (.+?) pozisyonuna hiç katlanamayacağım\. Belim çıktı ayol!/i
    ];

    // Personal Background page for this character
    const TRIVIA_URL = location.origin + "/World/Popmundo.aspx/Character/PersonalBackground/3617774";

    function normalize(str) {
        return str
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function extractKobePosition() {
        const diaryEntries = document.querySelectorAll("ul.diaryExtraspace li li");
        for (const entry of diaryEntries) {
            for (const pattern of DIARY_PATTERNS) {
                const match = entry.textContent.match(pattern);
                if (match) {
                    console.log("[KobeTracker] Diary match:", match[1], "→ Normalized:", normalize(match[1]));
                    return match[1].trim();
                }
            }
        }
        console.warn("[KobeTracker] No Kobe Sutra diary entry found today.");
        return null;
    }

    function fetchKnownPositions(callback) {
        fetch(TRIVIA_URL)
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const triviaBox = doc.querySelector("#ctl00_cphLeftColumn_ctl00_pnlTrivia div");
                if (!triviaBox) {
                    console.warn("[KobeTracker] No Trivia box found in Personal Background page");
                    return callback([]);
                }

                console.log("[KobeTracker] Raw trivia HTML:", triviaBox.innerHTML);

                const rawHTML = triviaBox.innerHTML;
                const rawLines = rawHTML.split(/<br\s*\/?>/i);
                console.log("[KobeTracker] Raw lines:", rawLines);

                const positions = rawLines
                    .map(line => {
                        const temp = document.createElement("div");
                        temp.innerHTML = line;
                        const text = temp.textContent;
                        const norm = normalize(text);
                        console.log("[KobeTracker] Line text:", JSON.stringify(text), "→ Normalized:", norm);
                        return norm;
                    })
                    .filter(p => p.length > 0);

                console.log("[KobeTracker] Final known positions:", positions);
                callback(positions);
            })
            .catch(err => {
                console.error("[KobeTracker] Error fetching Trivia:", err);
                callback([]);
            });
    }

    function showAlert(positionName, isNew) {
        let box = document.getElementById('kobe-tracker-box');
        if (box) box.remove();

        box = document.createElement("div");
        Object.assign(box.style, {
            position: "fixed",
            bottom: "70px",
            right: "20px",
            padding: "12px 14px",
            borderRadius: "16px",
            fontFamily: "'Segoe UI', 'Quicksand', sans-serif",
            fontSize: "12.5px",
            zIndex: 10000,
            boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
            maxWidth: "240px",
            textAlign: "center",
            background: "#fff7f0",
            border: "1px solid #f2c9b1",
            color: "#5c3a2f",
            lineHeight: "1.5"
        });

        const statusHTML = isNew
            ? `<div style="margin-top:8px; font-weight:600; padding:6px 10px; border-radius:12px; background:#ffe3d6; color:#5c3a2f; border:1px solid #f2c9b1;" title="This position isn't in your trivia list. Time to try it!">
                   Oooh! <strong>${positionName}</strong>
               </div>`
            : `<div style="margin-top:8px; font-weight:600; padding:6px 10px; border-radius:12px; background:#fdf0f0; color:#a05c5c; border:1px solid #e0b4b4;" title="Already known. Try again tomorrow!">
                   <strong><em>Better luck next time!</em></strong>
               </div>`;

        box.innerHTML = `
            <div style="font-size: 25px; margin-bottom: 6px;">💘</div>
            <h3 style="margin:0 0 8px 0; font-size:14px; font-weight:600; color:#d1785c;">Kobe Tracker</h3>
            <div style="font-size:12px;">Latest Position:</div>
            ${statusHTML}
        `;
        document.body.appendChild(box);
    }

    const position = extractKobePosition();
    if (position) {
        fetchKnownPositions(list => {
            const normalizedPos = normalize(position);
            const isKnown = list.some(item => item === normalizedPos);
            console.log("[KobeTracker] Current normalized:", normalizedPos);
            console.log("[KobeTracker] Known list (normalized):", list);
            console.log("[KobeTracker] Match found?", isKnown);
            showAlert(position, !isKnown);
        });
    }

})();
