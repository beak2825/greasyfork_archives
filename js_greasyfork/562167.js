// ==UserScript==
// @name         Prolific Enhancer
// @namespace   Violentmonkey Scripts
// @version      1.0
// @description  Provides enhanced functionalities to Prolific.
// @author       Chantu
// @license MIT
// @match        *://app.prolific.com/*
// @grant        GM.notification
// @grant GM.getValue
// @grant GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/562167/Prolific%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/562167/Prolific%20Enhancer.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    console.log("Prolific Enhancer loaded.");

    const store = {
        set: async (k, v) => await GM.setValue(k, JSON.stringify(v)),
        get: async (k, def) =>
            JSON.parse(await GM.getValue(k, JSON.stringify(def))),
    };

    function debounce(fn, delay = 300) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    // Run on extension setup
    if (!(await store.get("initialized", false))) {
        await store.set("surveys", {});
        // Extension setup
        await store.set("initialized", true);
    }

    // 24 hours
    const NOTIFY_TTL_MS = 24 * 60 * 60 * 1000;

    function getElementFingerprint(element) {
        const text = element.textContent
            .trim()
            .replace(/\s+/g, "")
            .replace(/\d+/g, "");
        return `${text}`;
    }

    async function saveElementFingerprint(element) {
        const fingerprint = getElementFingerprint(element);
        const now = Date.now();

        const entries = await store.get("surveys", {});

        for (const [key, timestamp] of Object.entries(entries)) {
            if (now - timestamp > NOTIFY_TTL_MS) {
                delete entries[key];
            }
        }

        if (entries[fingerprint]) {
            return false;
        }

        entries[fingerprint] = now;
        await store.set("surveys", entries);

        return true;
    }

    async function extractSurveys() {
        const surveys = document.querySelectorAll(
            "section.available-studies-section li"
        );
        for (const survey of surveys) {
            const isNewFingerprint = await saveElementFingerprint(survey);
            if (isNewFingerprint && document.hidden) {
                GM.notification({
                    title: survey.querySelector("h2.title").textContent,
                    text: survey.querySelector("span.reward").textContent,
                    timeout: 5000,
                });
            }
        }
    }
    // Function to extract the numeric value from the string like "£8.16/hr"
    function extractHourlyRate(text) {
        const m = text.match(/[\d.]+/);
        return m ? parseFloat(m[0]) : NaN;
    }

    // Function to apply the appropriate background color to the element
    function highlightElement(element) {
        const rate = extractHourlyRate(element.textContent);

        // Set default styles
        element.style.borderRadius = "4px";

        if (rate <= 7.79) {
            element.style.backgroundColor = "#ff000075";
        } else if (rate >= 7.8 && rate <= 9.5) {
            element.style.backgroundColor = "#ffff0075";
        } else if (rate >= 9.51) {
            element.style.backgroundColor = "#00ff0075";
        }
        // Set the font color to black
        element.style.color = "black";
    }

    // Function to process all elements with class="amount"
    function highlightHourlyRates() {
        const elements = document.querySelectorAll(
            "[data-testid='study-tag-reward-per-hour']"
        );
        for (const element of elements) {
            // Check if the element should be ignored
            if (element.getAttribute("data-testid") === "study-tag-reward") {
                continue;
            }
            highlightElement(element);
        }
    }

    async function applyEnhancements() {
        highlightHourlyRates();
        await extractSurveys();
    }

    // Extract the surveys and run the highlighting on page load
    await applyEnhancements();
    const debounced = debounce(async () => {
        await applyEnhancements();
    }, 300);

    // Observe the DOM for changes and re-run the highlighting if necessary
    const observer = new MutationObserver(async (mutations) => {
        const hasChanges = mutations.some(
            (m) => m.addedNodes.length > 0 || m.removedNodes.length > 0
        );
        if (!hasChanges) return;

        debounced();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
