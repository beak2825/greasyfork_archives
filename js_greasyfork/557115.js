// ==UserScript==
// @name         Local Time + Stacking Time for War
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show local war time and stacking time next to the war timer
// @author       Ado [3824868]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557115/Local%20Time%20%2B%20Stacking%20Time%20for%20War.user.js
// @updateURL https://update.greasyfork.org/scripts/557115/Local%20Time%20%2B%20Stacking%20Time%20for%20War.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Start stacking this many hours before the event
    const stackTiming = 32; //32 hours? 36 hours? 24 hours? change here

    const observer = new MutationObserver(() => {
        const li = document.querySelector("li.bottomBox___ui4Jg:not([data-local-time-added])");
        if (!li) return;

        const isWaiting = li.closest("ul.statsBox___zH9Ai")?.classList.contains("waiting___CKbCz");
        if (!isWaiting) {
            li.dataset.localTimeAdded = "true";
            return;
        }

        const timer = li.querySelector(".timer___fSGg8");
        if (!timer) return;

        const spans = timer.querySelectorAll("span");
        if (spans.length < 8) return;

        const days    = parseInt(spans[0].textContent + spans[1].textContent);
        const hours   = parseInt(spans[3].textContent + spans[4].textContent);
        const minutes = parseInt(spans[6].textContent + spans[7].textContent);
        const seconds = parseInt(spans[9]?.textContent + spans[10]?.textContent || "00");

        const now = new Date();
        const eventTime = new Date(now.getTime() + (
            ((days * 24 + hours) * 60 + minutes) * 60 + seconds
        ) * 1000);

        const stackTime = new Date(eventTime.getTime() - stackTiming * 60 * 60 * 1000);

        function fmt(d) {
            return d.toLocaleString("en-US", {
                weekday: "short",
                hour: "numeric",
                minute: "2-digit",
                hour12: false // true = 12h format with AM/PM, false = 24h format
            });
        }

        const sep = document.createElement("span");
        sep.style.margin = "0 6px";
        sep.style.color = "#888";
        sep.textContent = "|";

        const localSpan = document.createElement("span");
        localSpan.style.color = "#77ccff";
        localSpan.style.marginLeft = "8px";
        localSpan.textContent = fmt(eventTime);

        const stackSpan = document.createElement("span");
        stackSpan.style.color = "#ffb366";
        stackSpan.style.marginLeft = "8px";
        stackSpan.textContent = "Stack " + fmt(stackTime);

        timer.insertAdjacentElement("afterend", sep);
        sep.insertAdjacentElement("afterend", localSpan);
        localSpan.insertAdjacentElement("afterend", stackSpan);

        li.dataset.localTimeAdded = "true";
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
