// ==UserScript==
// @name         Crunchyroll – Hide Dubbed Episodes + Clickable Counter
// @namespace    https://greasyfork.org/users/Ed_waard/
// @version      2.5.1
// @description  Hides all dubbed episodes on Crunchyroll's simulcast calendar and lets you toggle them with a clickable counter
// @author       Ed_waard
// @license      MIT
// @match        https://www.crunchyroll.com/simulcastcalendar*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561282/Crunchyroll%20%E2%80%93%20Hide%20Dubbed%20Episodes%20%2B%20Clickable%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/561282/Crunchyroll%20%E2%80%93%20Hide%20Dubbed%20Episodes%20%2B%20Clickable%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // false = dubbed episodes hidden (default)
    // true  = dubbed episodes shown
    let showDubbed = false;

    const dubPatterns = [
        "(english)", "(english dub)",
        "(french)", "(french dub)",
        "(german)", "(german dub)",
        "(italian)", "(italian dub)",
        "(portuguese)", "(portuguese dub)", "(português)", "(português (brasil))",
        "(spanish)", "(spanish dub)", "(español)", "(español (américa latina))", "(español (españa))",
        "(hindi)", "(hindi dub)",
        "(tamil)", "(tamil dub)",
        "(telugu)", "(telugu dub)",
        "(русский)",
        "(普通话)",
        "(vf)",
        "(dub)",
        "(deutsch)",
        "(français)",
        "(italiano)"
    ];

    function isDubTitle(text) {
        if (!text) return false;
        const lower = text.toLowerCase();
        return dubPatterns.some(function(pattern) {
            return lower.includes(pattern);
        });
    }

    function createCounter() {
        if (document.getElementById("dub-counter")) return;

        const counter = document.createElement("div");
        counter.id = "dub-counter";
        counter.style.position = "fixed";
        counter.style.bottom = "20px";
        counter.style.right = "20px";
        counter.style.background = "#ff6600";
        counter.style.color = "#fff";
        counter.style.padding = "10px 15px";
        counter.style.borderRadius = "8px";
        counter.style.fontSize = "14px";
        counter.style.fontWeight = "bold";
        counter.style.zIndex = "9999";
        counter.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
        counter.style.cursor = "pointer";
        counter.textContent = "Dubbed Hidden: 0";

        counter.addEventListener("click", function() {
            showDubbed = !showDubbed; // toggle state
            filterDubEpisodes();      // re-appliquer l'état
        });

        document.body.appendChild(counter);
    }

    function updateCounter(count) {
        const counter = document.getElementById("dub-counter");
        if (!counter) return;

        if (showDubbed) {
            counter.textContent = "Dubbed Shown: " + count;
            counter.style.background = "#777777"; // gris quand les dubs sont visibles
        } else {
            counter.textContent = "Dubbed Hidden: " + count;
            counter.style.background = "#ff6600"; // orange quand les dubs sont masqués
        }
    }

    function filterDubEpisodes() {
        const articles = document.querySelectorAll("article.release");
        let dubCount = 0;

        articles.forEach(function(article) {
            const titleEl = article.querySelector("h1, cite, a");
            const titleText = titleEl ? titleEl.textContent : "";
            const isDub = isDubTitle(titleText);

            if (isDub) {
                dubCount++;
                article.style.display = showDubbed ? "" : "none";
            }
        });

        updateCounter(dubCount);
    }

    let debounceTimer = null;
    function debouncedFilter() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterDubEpisodes, 200);
    }

    window.addEventListener("load", function() {
        createCounter();
        filterDubEpisodes();
    });

    const observer = new MutationObserver(function() {
        debouncedFilter();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
