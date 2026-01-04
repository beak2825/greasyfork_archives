// ==UserScript==
// @name         The Tree House Events
// @namespace    https://greasyfork.org/
// @version      3.2
// @description  faction events with Torn-style tooltips
// @match        https://www.torn.com/calendar.php*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/557008/The%20Tree%20House%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/557008/The%20Tree%20House%20Events.meta.js
// ==/UserScript==

(function () {

    const factionEvents = [
        { date: "30-11-2025", title: "Chain Event", short: "C", description: "1000-hit chain day." },
        { date: "21-12-2025", title: "Chain Event", short: "C", description: "1000-hit chain day." },
        { date: "28-12-2025", title: "Chain Event", short: "C", description: "1000-hit chain day." },

        { date: "09-01-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "23-01-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "06-02-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "20-02-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "06-03-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "20-03-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "03-04-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "24-04-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "08-05-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "22-05-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "05-06-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "19-06-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "17-07-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "07-08-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "21-08-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "04-09-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "18-09-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "02-10-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },

        { date: "06-11-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
        { date: "20-11-2026", title: "Ranked War", short: "W", description: "Ranked war scheduled." },
    ];

    let tooltip;

    function waitForDays() {
        const days = document.querySelectorAll('div[id^="active-date"], div[id^="notActive-date"]');
        if (days.length === 0) return requestAnimationFrame(waitForDays);
        setupTooltip();
        injectEvents();
    }

    function setupTooltip() {
        tooltip = document.createElement("div");
        tooltip.style.cssText = `
            position: absolute;
            display: none;
            opacity: 0;
            transition: opacity 0.15s ease-in-out;
            z-index: 999999;
            background: #3a3a3a;
            padding: 12px;
            border-radius: 6px;
            width: 360px;
            color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
        `;

        tooltip.innerHTML = `
            <div id="factionTooltipTitle" style="font-weight:bold; font-size:14px; text-align:center; margin-bottom:10px;"></div>
            <div id="factionTooltipDesc" style="font-size:12px; text-align:center; opacity:0.85;"></div>
        `;

        document.body.appendChild(tooltip);
    }

    function injectEvents() {
        factionEvents.forEach(ev => {
            const id = convertDateToId(ev.date);
            const dayCell = document.getElementById(id);
            if (!dayCell) return;

            const numberElement = dayCell.querySelector('[class*="numberWrapper"]');
            if (!numberElement) return;

            const parent = numberElement.parentElement;
            parent.style.position = "relative";

            // Auto color selector (RED for war, BLUE for chain)
            const color =
                ev.short.toUpperCase() === "W" ? "#ff3b3b" :
                ev.short.toUpperCase() === "C" ? "#3b8bff" :
                "#ffa500";

            const badge = document.createElement("div");
            badge.innerText = ev.short.toUpperCase();
            badge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background: ${color};
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 11px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 0 4px rgba(0,0,0,0.5);
            `;

            badge.addEventListener("mouseenter", (e) => showTooltip(e, ev));
            badge.addEventListener("mouseleave", hideTooltip);

            parent.appendChild(badge);
        });
    }

    function showTooltip(e, ev) {
        document.getElementById("factionTooltipTitle").textContent = ev.title;
        document.getElementById("factionTooltipDesc").textContent = ev.description;

        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = (rect.left + rect.width / 2 - 180) + "px";
        tooltip.style.top = (rect.top - 110) + "px";

        tooltip.style.display = "block";
        requestAnimationFrame(() => tooltip.style.opacity = "1");
    }

    function hideTooltip() {
        tooltip.style.opacity = "0";
        setTimeout(() => (tooltip.style.display = "none"), 150);
    }

    function convertDateToId(dateStr) {
        const [DD, MM, YYYY] = dateStr.split("-");
        return `active-date-${DD}${MM}${YYYY}`;
    }

    waitForDays();

})();
