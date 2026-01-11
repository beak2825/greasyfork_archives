// ==UserScript==
// @name         Prolific Enhancer
// @namespace   Violentmonkey Scripts
// @version      1.1
// @description  Provides enhanced functionalities to Prolific.
// @author       Chantu
// @license      MIT
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
        return element.dataset.testid;
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
        const surveys = document.querySelectorAll('li[data-testid^="study-"]');
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

    function rateToColor(rate, min = 7, max = 15) {
        const clamped = Math.min(Math.max(rate, min), max);

        const logMin = Math.log(min);
        const logMax = Math.log(max);
        const logRate = Math.log(Math.max(clamped, min));

        const ratio = (logRate - logMin) / (logMax - logMin);
        const bias = Math.pow(ratio, 0.6); // Adjust bias for better color distribution

        const r = Math.round(255 * (1 - bias));
        const g = Math.round(255 * bias);

        return `rgba(${r}, ${g}, 0, 0.63)`;
    }

    // Function to apply the appropriate background color to the element
    function highlightElement(element) {
        const rate = extractHourlyRate(element.textContent);

        element.style.backgroundColor = rateToColor(rate);
        // Set default styles
        element.style.padding = "3px 4px";
        element.style.borderRadius = "4px";
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

    function addDirectSurveyLinks() {
        const surveys = document.querySelectorAll('li[data-testid^="study-"]');
        for (const survey of surveys) {
            const testid = survey.getAttribute("data-testid");
            const surveyId = testid.replace("study-", "");
            const studyContent = survey.querySelector("div.study-content");
            if (studyContent && !studyContent.querySelector(".prolific-link")) {
                const container = document.createElement("div");
                const link = document.createElement("a");
                container.appendChild(link);
                link.href = `https://app.prolific.com/studies/${surveyId}`;
                link.textContent = "Take part in this study";
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.className = "prolific-link";
                link.style.padding = "8px 24px";
                link.style.borderRadius = "4px";
                link.style.fontSize = "0.9em";
                link.style.backgroundColor = "#0a3c95";
                link.style.color = "white";
                link.style.cursor = "pointer";
                studyContent.appendChild(container);

                container.style.padding = "0 16px 8px 16px";
            }
        }
    }

    async function applyEnhancements() {
        addDirectSurveyLinks();
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