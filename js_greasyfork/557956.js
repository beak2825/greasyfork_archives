// ==UserScript==
// @author.      Boni
// @name         AO3 Relationship Highlighter
// @namespace    https://example.com/userscripts/ao3-relationship-highlighter
// @version      1.0.1
// @description  Highlights the ships you’re looking for if they appear in the first two relationship tags.
// @match        https://archiveofourown.org/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557956/AO3%20Relationship%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/557956/AO3%20Relationship%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COLOR1 = "#E69F00"; // Orange (CVD safe)
    const COLOR2 = "#56B4E9"; // Sky blue (CVD safe)

    /** Remove (xxx) and trim */
    function cleanCharName(str) {
        return str.replace(/\(.*?\)/g, '').trim();
    }

    /** Convert text like Megatron/Optimus Prime/(Transformers) → ["Megatron", "Optimus Prime"] */
    function extractCharacters(text) {
        return text
            .split('/')
            .map(t => cleanCharName(t))
            .filter(t => t.length > 0);
    }

    /** Check whether relationshipTagChars contains all headingChars (order not required) */
    function isRelationshipMatch(headingChars, tagChars) {
        if (headingChars.length < 2) return false; // must be a slash pair
        // heading char exists if any tagChar contains it
        return headingChars.every(h =>
                                  tagChars.some(tc => tc.toLowerCase().includes(h.toLowerCase()))
                                 );
    }

    /** Apply highlight */
    function applyHighlight(anchor, color) {
        if (!anchor) return;
        anchor.style.backgroundColor = color;
        anchor.style.color = "black";
        anchor.style.padding = "2px 4px";
        anchor.style.borderRadius = "4px";
        anchor.style.fontWeight = "bold";
    }

    window.addEventListener('load', () => {
        try {
            // ---- 1. GET HEADING TAG ----
            const headingA = document.querySelector('h2.heading a.tag');
            if (!headingA) return;

            const headingText = headingA.innerText.trim();
            const headingChars = extractCharacters(headingText);

            console.info("[AO3-hl] Heading characters:", headingChars);

            // ---- 2. PROCESS EACH ul.tags.commas ----
            const lists = document.querySelectorAll("ul.tags.commas");
            lists.forEach((ul, idx) => {

                const liNodes = Array.from(ul.querySelectorAll("li"));

                // ---- 2a. Skip all warnings ----
                const relTags = liNodes.filter(li => !li.classList.contains("warnings") && li.classList.contains("relationships"));
                if (relTags.length === 0) return;

                // ---- 2b. Grab first two relationship tags after warnings ----
                const firstTwo = relTags.slice(0, 2);

                const checkTag = (li) => {
                    if (!li) return null;
                    const a = li.querySelector("a.tag");
                    if (!a) return null;
                    const txt = a.innerText.trim();
                    if (!txt.includes("/")) return null; // skip non-relationship tags
                    return {
                        anchor: a,
                        chars: extractCharacters(txt),
                        txt
                    };
                };

                const c1 = checkTag(firstTwo[0]);
                const c2 = checkTag(firstTwo[1]);

                console.debug(`[AO3-hl][${idx}] candidate1:`, c1?.chars, "candidate2:", c2?.chars);

                // ---- 3. CHARACTER MATCHING ----
                if (c1 && isRelationshipMatch(headingChars, c1.chars)) {
                    console.info(`[AO3-hl] Match 1:`, c1.txt);
                    applyHighlight(c1.anchor, COLOR1);
                }

                if (c2 && isRelationshipMatch(headingChars, c2.chars)) {
                    console.info(`[AO3-hl] Match 2:`, c2.txt);
                    applyHighlight(c2.anchor, COLOR2);
                }
            });

        } catch (e) {
            console.error("[AO3-hl] Error:", e);
        }
    });
})();
