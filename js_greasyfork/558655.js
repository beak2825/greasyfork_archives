// ==UserScript==
// @name         Scrape VitalSource
// @namespace    http://tampermonkey.net/
// @version      2024-02-16
// @description  try to take over te world!
// @author       You
// @match        https://bookshelf.vitalsource.com/reader/books/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vitalsource.com
// @grant        window.onurlchange
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558655/Scrape%20VitalSource.user.js
// @updateURL https://update.greasyfork.org/scripts/558655/Scrape%20VitalSource.meta.js
// ==/UserScript==

function findElementByLabelText(labelText) {
    // Find all label elements in the document
    const labels = document.querySelectorAll('label');

    // Iterate through the found labels to find the one with the matching text
    for (let label of labels) {
        if (label.textContent.trim() === labelText) {
            // Read the "for" attribute of the label
            const forAttribute = label.getAttribute('for');
            if (forAttribute) {
                // Use the "for" attribute to fetch the referenced element
                return document.getElementById(forAttribute); // Return the found element
            }
            break; // Stop the search once the first matching label is found
        }
    }

    return null; // Return null if no matching label or referenced element is found
}


(function () {
    let lastUrl = null;
    let lastUrlChangedCallback = null;
    let currentPage = -1;
    let running = false;

    function stop() {
        running = false;
        lastUrlChangedCallback = null;
        currentPage = -1;

        const button = document.querySelector("#scrapeButton");
        button.innerHTML = "Scrape this motherfucker";
    }

    window.addEventListener("message", e => {
        // Check if e.data contains .type, and .type===pageImage
        if (e.data.type !== "pageImage") return;
        console.log("Page image event:", e);
        unsafeWindow.msg = e;

        lastUrl = e.data;
        if (lastUrlChangedCallback) {
            lastUrlChangedCallback();
        }
    });

    const worker = function () {
        const goToPageInput = findElementByLabelText('Go to Page');
        if (goToPageInput == null) {
            console.log("Go to page input not found!");
            return;
        }
        const pageNum = parseInt(goToPageInput.value);

        if (pageNum === currentPage) {
            console.log("Skipping duplicate event");
            return;
        }

        if (currentPage === -1) {
            currentPage = pageNum;
            if (currentPage !== 1) {
                // Ask permission to start from a page other than the first
                if (!confirm("Do you want to start from page " + currentPage + "?")) {
                    console.log("User cancelled");
                    stop();
                    return;
                }
            }
        }

        if (lastUrl == null) {
            console.log("No URL found");
            stop();
            return;
        }

        console.log("SCRAPER:", lastUrl.url);

        setTimeout(() => {
            const nextButton = document.querySelector('[aria-label="Next"]');
            if (nextButton == null) {
                console.log("Next button not found!");
                stop();
                return;
            }

            // check if disabled via the "disabled" attribute
            if (nextButton.hasAttribute("disabled")) {
                console.log("Next button is disabled");
                stop();
                return;
            }

            nextButton.click();
        }, 10);
    }

    const doStuff = function () {
        if (running) {
            console.log("Stopping scraper");
            stop();
            return;
        }

        console.log("Starting scraper, lastUrl:", lastUrl);
        const button = document.querySelector("#scrapeButton");
        running = true;
        lastUrlChangedCallback = worker;
        button.innerHTML = "Stop scraping";

        worker();
    };

    const inject = function () {
        const b = document.querySelector('[aria-label="Search across book"]');
        if (b == null) {
            console.log("Button not found, retrying in 1s");
            setTimeout(inject, 1000);
            return;
        }

        const a = document.createElement("a");
        a.id = "scrapeButton";
        a.href = "#";
        a.innerHTML = "Scrape this motherfucker";
        a.addEventListener("click", _ => doStuff());
        b.after(a);

        console.log("Injected!");
    };

    inject();
})();