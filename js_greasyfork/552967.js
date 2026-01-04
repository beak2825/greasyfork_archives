// ==UserScript==
// @name         Auto Google URL Scraper (by Saydi)
// @namespace    https://greasyfork.org/en/scripts/552967-auto-google-url-scraper-made-by-saydi
// @version      8.2
// @description  Automatically scrape Google search result URLs only | Auto-next pages | Per-page CSV export with correct headers | Works in background
// @author       Saimul Haque Saydi
// @match        *://www.google.com/search*
// @match        *://www.google.*.*/search*
// @icon         https://www.google.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552967/Auto%20Google%20URL%20Scraper%20%28by%20Saydi%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552967/Auto%20Google%20URL%20Scraper%20%28by%20Saydi%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'auto_scrape_google_page';
    let isRunning = false;

    function logDebug(...args) {
        console.log("[AutoScraper v8.2]", ...args);
    }

    function scrapeURLs() {
        const urls = [];
        document.querySelectorAll("a h3").forEach(h3 => {
            const link = h3.closest("a")?.href || "";
            if (link) urls.push(link);
        });
        logDebug(`Scraped ${urls.length} URLs this page`);
        return urls;
    }

    function isCaptcha() {
        const t = document.title.toLowerCase();
        const body = document.body.innerText.toLowerCase();
        const hasForm = !!document.querySelector("form[action*='validate']");
        const hasRecap = !!document.querySelector("iframe[src*='recaptcha']");
        logDebug("Checking CAPTCHA", { title: t, bodySnippet: body.slice(0,100), hasForm, hasRecap });
        return t.includes("unusual traffic") || body.includes("unusual traffic") || hasForm || hasRecap;
    }

    function goToNextPage() {
        let nextBtn = document.querySelector("#pnnext") ||
                      [...document.querySelectorAll("a")].find(a => a.innerText.toLowerCase().includes("next"));
        logDebug("Next button:", nextBtn);
        if (nextBtn) {
            nextBtn.click();
            return true;
        }
        return false;
    }

    function downloadCSV(urls, pageNum) {
        if (!urls.length) {
            console.warn("[AutoScraper] No URLs to download on page", pageNum);
            return;
        }

        // CSV with header in the first row
        const csvRows = [
            ["Url"],             // header
            ...urls.map(u => [u]) // each URL in its own row
        ];

        const csvContent = "data:text/csv;charset=utf-8," +
            csvRows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `google_urls_page${pageNum}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        logDebug(`[AutoScraper v8.2] Downloaded CSV for page ${pageNum} with ${urls.length} URLs`);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function processPage() {
        if (isRunning) return;
        isRunning = true;

        if (isCaptcha()) {
            console.warn("[AutoScraper] CAPTCHA detected — pausing.");
            isRunning = false;
            return;
        }

        let pageNum = parseInt(localStorage.getItem(STORAGE_KEY) || "1", 10);
        const urls = scrapeURLs();
        if (urls.length > 0) downloadCSV(urls, pageNum);

        localStorage.setItem(STORAGE_KEY, String(pageNum + 1));

        const hasNext = goToNextPage();
        if (!hasNext) {
            logDebug("Finished scraping — no next page");
            localStorage.removeItem(STORAGE_KEY);
            isRunning = false;
            return;
        }

        logDebug("Navigated to next page — waiting 7s (BG-friendly)");
        await wait(7000); // background-friendly delay
        isRunning = false;
        processPage();
    }

    window.addEventListener("load", () => {
        logDebug("Window load event, starting scraping in 2s");
        setTimeout(() => processPage(), 2000);
    });

    // Keyboard shortcut: Alt+S to start manually
    window.addEventListener("keydown", e => {
        if (e.altKey && e.key.toLowerCase() === "s") {
            logDebug("Manual start triggered (Alt+S)");
            processPage();
        }
    });

})();
