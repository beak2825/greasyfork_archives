// ==UserScript==
// @name         Neopets: Battledome Item Logger
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.2
// @description  Logs what prizes you have received at the Battledome, not including neopoints, and exports it with the formatting of your choice
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/dome/arena.phtml*
// @match        *://*.neopets.com/dome/record.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/554269/Neopets%3A%20Battledome%20Item%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/554269/Neopets%3A%20Battledome%20Item%20Logger.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Remembers every item you have received as a prize for battledome fights
    - Adds a button to the Records page https://www.neopets.com/dome/record.phtml so you can see them
    - Allows you to filter by start and end time and date
    - Allows you to copy all results by clicking the monotype text
    - Configurable result formatting (edit resultFormat)
    - Configurable time formatting (edit timeFormat)
    
    Both results and filters are in NST. The start filter is inclusive, the end filter is not (filtering from X to Y
    includes X but not Y).

    This was originally made for the guild Keepers of Neopia's November 2025 Keeper Kombat challenge, but maybe others
    will find it useful.

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

const resultFormat = {
    // Anything that should come before your repetitions. You may leave this blank as "", but don't delete it.
    prefix: "",
    // What your repetitions should look like, replacing {{time}} with the formatted time and {{item}} with the item's name.
    repeat: "          - '{{time}} - {{item}}'\n",
    // Anything that should come before your repetitions. You may leave this blank as "", but don't delete it.
    suffix: ""
}

const timeFormat = {
    // possible values: "numeric" (3), "2-digit" (03), "long" (March), "short" (Mar), "narrow" (M), "none" ()
    month: "short",
    // possible values: "numeric" (3), "2-digit" (03), "none" ()
    day: "numeric",
    // possible values: "numeric" (3), "2-digit" (03), "none" ()
    hour: "2-digit",
    // possible values: "numeric" (3), "2-digit" (03), "none" ()
    minute: "numeric",
    // possible values: "numeric" (3), "2-digit" (03), "none" ()
    second: "none",
    // possible values: true (8PM), false (20)
    hour12: false
}

const getFormat = () => {
    const format = timeFormat;
    Object.entries(format).forEach(([key, value]) => {
        if(value === "none") delete format[key];
    })
    format.timeZone = "-07:00";
    format.dayPeriod = "narrow";
    return format;
}

const getFilteredPrizes = async (filterLower, filterHigher) => {
    const allPrizes = await GM.getValue("prizes", []);
    const start = filterLower ? (new Date(`${filterLower}-0700`)).getTime() : null;
    const end = filterHigher ? (new Date(`${filterHigher}-0700`)).getTime() : null;
    return allPrizes.filter(([time, prize]) => (!start || time >= start) && (!end || time < end) && (!prize.match(/\d+ Plot Points/)));
}

const formatValues = (allPrizes) => {
    const repeats = allPrizes.map(([time, item]) => {
        const formattedTime = (new Date(time)).toLocaleString([], getFormat());
        return resultFormat.repeat.replaceAll("{{time}}", formattedTime).replaceAll("{{item}}", item);
    });
    return `${resultFormat.prefix}${repeats.join("")}${resultFormat.suffix}`;
}

const exportResult = async (output, filterLower, filterHigher) => {
    const allPrizes = await getFilteredPrizes(filterLower, filterHigher);
    const formatted = formatValues(allPrizes)
    output.textContent = formatted;
    output.addEventListener("click", () => {
        GM.setClipboard(formatted);
        output.classList.add("copied");
        setTimeout(() => output.classList.remove("copied"), 500);
    });
}

const grabItems = async () => {
    const prizes = document.querySelectorAll(".prizname");
    if(prizes.length === 0) return;
    const allPrizes = await GM.getValue("prizes", []);
    const now = (new Date()).getTime();
    prizes.forEach(prize => {
        if(prize.textContent.match(/\d+ Neopoints/) || prize.textContent.match(/\d+ Plot Points/) || prize.textContent === "inventory") return;
        allPrizes.push([now, prize.textContent]);
    });
    GM.setValue("prizes", allPrizes);
}

const addLog = () => {
    document.getElementById("BDFR").insertAdjacentHTML("beforeBegin", `
    <style>.saah-bd-item-logger {
        width: 75%;
        left: 50%;
        transform: translateX(-50%);
        position: relative;
    }
    .saah-bd-item-logger summary {
        border-image-slice: 40% 40% 40% 40% fill;
        border-image-width: 20px 20px 20px 20px;
        border-image-outset: 0px 0px 0px 0px;
        border-image-repeat: stretch stretch;
        border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6.063mm' height='6.063mm' version='1.1' viewBox='0 0 6.063 6.063' xml:space='preserve'%3E%3Cpath d='m0.13218 0.13218v5.3908h5.7986l5.168e-4 -5.3908z' fill='%23ffc600' stroke='%23000' stroke-linecap='round' stroke-width='.26436'/%3E%3Cpath d='m1.1108 0.65112 1.8385 0.0042m1.263e-4 0.0084 2.1822 0.0042v0.87685' fill='none' stroke='%23fff' stroke-width='.13122'/%3E%3Cpath d='m2.9491 5.523h2.4978v0.5412h-2.4978m0 0h-1.7872v-0.5412h1.7872' fill-opacity='.50196' stroke-linecap='round' stroke-width='.14778'/%3E%3C/svg%3E");
        border-style: solid;
        display: inline;
        font-family: Cafeteria, Arial Black, sans-serif;
        font-size: 1.25em;
        padding: 0.15em 0.5em 0.25em;
        color: white;
        text-shadow: -3px 3px black, 1px 1px black, -1px 1px black, 1px -1px black, -1px -1px black;
        cursor: pointer;
    }
    .saah-bd-item-logger summary:is(:active, :hover, :focus) {
        border-image-source: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6.063mm' height='6.063mm' version='1.1' viewBox='0 0 6.063 6.063' xml:space='preserve'%3E%3Cpath d='m0.13218 0.13218v5.3908h5.7986l5.168e-4 -5.3908z' fill='%23fff000' stroke='%23000' stroke-linecap='round' stroke-width='.26436'/%3E%3Cpath d='m1.1108 0.65112 1.8385 0.0042m1.263e-4 0.0084 2.1822 0.0042v0.87685' fill='none' stroke='%23fff' stroke-width='.13122'/%3E%3Cpath d='m2.9491 5.523h2.4978v0.5412h-2.4978m0 0h-1.7872v-0.5412h1.7872' fill-opacity='.50196' stroke-linecap='round' stroke-width='.14778'/%3E%3C/svg%3E");
    }

    .saah-bd-item-logger input {
        margin: 1em;
    }
    .saah-bd-item-log {
        position: relative;
        display: block;
    }
    .saah-bd-item-log.copied::after {
        content: "✔️ Copied";
        font-size: 3em;
        position: absolute;
        width: 100%;
        height: 100%;
        background: white;
        opacity: 0.75;
        inset-block-start: 0;
        inset-inline-start: 0;
    }</style>
    <details class="saah-bd-item-logger">
    <summary>Battledome Item Log</summary>
    <label>Start Time: <input type="datetime-local" id="bd-item-start"></label>
    <label>End Time: <input type="datetime-local" id="bd-item-end"></label>
    <p>Click your text to copy!</p>
    <pre><code class="saah-bd-item-log"></code></pre>
    </details>`);
    return document.getElementsByClassName("saah-bd-item-log")[0];
}

(function() {
    'use strict';
    if(window.location.href.match(/arena\.phtml/)) {
        const observer = new MutationObserver(grabItems);
        observer.observe(document.getElementById("bd_rewardsloot"), {childList: true, subtree: true});
    }
    else {
        const output = addLog();
        const start = document.getElementById("bd-item-start");
        const end = document.getElementById("bd-item-end");
        [start, end].forEach(time => time.addEventListener("change", () => exportResult(output, start.value, end.value)));
        exportResult(output, start.value, end.value);
    }
})();
