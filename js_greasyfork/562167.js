// ==UserScript==
// @name         Prolific Enhancer
// @namespace    Violentmonkey Scripts
// @version      1.3
// @description  A lightweight userscript that makes finding worthwhile Prolific studies faster and less annoying.
// @author       Chantu
// @license      MIT
// @match        *://app.prolific.com/*
// @grant        GM.notification
// @grant        GM.getValue
// @grant        GM.setValue
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

    /** @param {Function} fn @param {number} [delay=300] */
    function debounce(fn, delay = 300) {
        let timeoutId;
        let runId = 0;

        return (...args) => {
            runId++;
            const currentRun = runId;

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (currentRun !== runId) return;
                Promise.resolve(fn(...args)).catch(console.error);
            }, delay);
        };
    }

    // Run on extension setup
    if (!(await store.get("initialized", false))) {
        await store.set("surveys", {});
        await store.set("gbpToUsd", {});
        // Extension setup
        await store.set("initialized", true);
    }

    const NOTIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
    const GBP_TO_USD_FETCH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

    async function fetchGbpRate() {
        const response = await fetch("https://open.er-api.com/v6/latest/GBP");
        const data = await response.json();
        return data.rates.USD;
    }

    async function checkGbpRate() {
        const lastGbpToUsd = await store.get("gbpToUsd", {});
        const now = Date.now();
        if (
            lastGbpToUsd &&
            now - lastGbpToUsd.timestamp < GBP_TO_USD_FETCH_INTERVAL_MS
        )
            return;

        const rate = (await fetchGbpRate().catch(console.error)) || 1.35; // fallback rate
        await store.set("gbpToUsd", { rate, timestamp: now });
    }

    /** @param {HTMLElement} surveyElement */
    function getSurveyFingerprint(surveyElement) {
        return surveyElement.dataset.testid;
    }

    async function saveSurveyFingerprint(surveyElement) {
        const fingerprint = getSurveyFingerprint(surveyElement);
        const now = Date.now();

        const entries = await store.get("surveys", {});

        for (const [key, timestamp] of Object.entries(entries)) {
            if (now - timestamp >= NOTIFY_TTL_MS) {
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
            const isNewFingerprint = await saveSurveyFingerprint(survey);
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
    /** @param {string} text  */
    function extractHourlyRate(text) {
        const m = text.match(/[\d.]+/);
        return m ? parseFloat(m[0]) : NaN;
    }

    // Function to map hourly rate to a color from red to green
    /** @param {number} rate @param {number} [min=7] @param {number} [max=15]  */
    function rateToColor(rate, min = 7, max = 15) {
        const clamped = Math.min(Math.max(rate, min), max);

        const logMin = Math.log(min);
        const logMax = Math.log(max);
        const logRate = Math.log(clamped);

        const ratio = (logRate - logMin) / (logMax - logMin);
        const bias = Math.pow(ratio, 0.6); // Adjust bias for better color distribution

        const r = Math.round(255 * (1 - bias));
        const g = Math.round(255 * bias);

        return `rgba(${r}, ${g}, 0, 0.63)`;
    }

    // Function to highlight an element based on its hourly rate
    /** @param {HTMLElement} element  */
    function highlightElement(element) {
        const rate = extractHourlyRate(element.textContent);
        if (isNaN(rate)) return;

        element.style.backgroundColor = rateToColor(rate);
        // Set default styles
        element.style.padding = "3px 4px";
        element.style.borderRadius = "4px";
        element.style.color = "black";
    }

    // Function to highlight all hourly rate elements on the page
    function highlightHourlyRates() {
        const elements = document.querySelectorAll(
            "[data-testid='study-tag-reward-per-hour']",
        );
        for (const element of elements) {
            // Check if the element should be ignored
            if (element.getAttribute("data-testid") === "study-tag-reward") {
                continue;
            }
            highlightElement(element);
        }
    }

    // Function to add direct survey links
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

    // Function to extract currency symbol
    /** @param {string} text  */
    function extractSymbol(text) {
        const m = text.match(/[£$€]/);
        return m ? m[0] : null;
    }

    // Function to convert all elements containing GBP to USD
    async function convertToUsd() {
        const elements = document.querySelectorAll("span.reward span");
        const { rate } = await store.get("gbpToUsd", {});
        for (const element of elements) {
            const symbol = extractSymbol(element.textContent);
            if (symbol !== "£") continue;

            const elementRate = extractHourlyRate(element.textContent);
            let modified = `$${(elementRate * rate).toFixed(2)}`;
            if (element.textContent.includes("/hr")) modified += "/hr";
            element.textContent = modified;
        }
    }

    async function applyEnhancements() {
        // Fetch the GBP to USD rate once a week
        await checkGbpRate();
        // Conversion to USD must be done first
        await convertToUsd();
        highlightHourlyRates();
        addDirectSurveyLinks();
        await extractSurveys();
    }

    // Apply the enhancements initially
    await applyEnhancements();
    const debounced = debounce(async () => {
        await applyEnhancements();
    }, 300);

    // Observe the DOM for changes and re-run the enhancements if necessary
    const observer = new MutationObserver(async (mutations) => {
        const hasChanges = mutations.some(
            (m) => m.addedNodes.length > 0 || m.removedNodes.length > 0,
        );
        if (!hasChanges) return;

        debounced();
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
