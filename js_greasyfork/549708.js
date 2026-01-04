// ==UserScript==
// @name         employee addiction
// @namespace    downright.sillyy
// @version      1.0
// @description  see whos craving extra xanax at a glance
// @match        https://www.torn.com/companies.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549708/employee%20addiction.user.js
// @updateURL https://update.greasyfork.org/scripts/549708/employee%20addiction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastAddictionsJSON = "";
    let addictionThreshold = -1;

    function getAddictions() {
        return [...document.querySelectorAll(".effectiveness")]
            .flatMap(el => {
                let text = el.getAttribute("aria-label") || el.innerText || "";
                let addictionMatch = text.match(/Addiction:\s*([+-]?\d+)/i);
                let addiction = addictionMatch ? parseInt(addictionMatch[1]) : 0;
                if (addiction <= addictionThreshold){
                    let name = text.split(":")[0].trim();
                    return [{ name, addiction }];
                }
                return [];
            });
    }

    function showAddictions() {
        let title = document.querySelector(".title.p10");
        if (!title) return;

        title.querySelectorAll(".addiction-note, .addiction-threshold, .addiction-spacer").forEach(el => el.remove());

        let spacer = document.createElement("div");
        spacer.className = "addiction-spacer";
        spacer.style.height = "6px";
        title.appendChild(spacer);

        let thresholdWrapper = document.createElement("div");
        thresholdWrapper.className = "addiction-threshold";
        thresholdWrapper.style.color = "#44f";
        thresholdWrapper.style.fontWeight = "bold";
        thresholdWrapper.style.marginBottom = "4px";

        let label = document.createElement("span");
        label.textContent = "Addiction threshold: ";

        let input = document.createElement("input");
        input.type = "number";
        input.value = addictionThreshold;
        input.style.width = "50px";
        input.style.marginLeft = "4px";
        input.style.appearance = "textfield";
        input.style.MozAppearance = "textfield";
        input.style.WebkitAppearance = "none";

        input.addEventListener("change", () => {
            addictionThreshold = parseInt(input.value);
            updateIfChanged();
        });

        thresholdWrapper.appendChild(label);
        thresholdWrapper.appendChild(input);
        title.appendChild(thresholdWrapper);

        let results = getAddictions();
        results.forEach(({ name, addiction }) => {
            let note = document.createElement("div");
            note.className = "addiction-note";
            note.style.color = "#f44";
            note.style.fontWeight = "bold";
            note.style.marginTop = "2px";
            note.textContent = `⚠ ${name} is addicted (${addiction})`;
            title.appendChild(note);
        });
    }

    function updateIfChanged() {
        const currentAddictions = JSON.stringify(getAddictions());
        if (currentAddictions !== lastAddictionsJSON) {
            showAddictions();
            lastAddictionsJSON = currentAddictions;
        }
    }

    const observer = new MutationObserver(() => {
        const el = document.querySelector(".employees");
        if (el && window.getComputedStyle(el).display !== "none") {
            updateIfChanged();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
