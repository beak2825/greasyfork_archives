// ==UserScript==
// @name         LiveChart.me Minimum Rating Filter with Themed UI (Persistent)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @author       pedro-mass
// @copyright    2025, Pedro Mass (https://github.com/pedro-mass)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livechart.me
// @license      GNU GPLv3
// @description  Adds a minimum rating filter to anime list on LiveChart.me with styled UI and persistent value
// @match        https://www.livechart.me/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547862/LiveChartme%20Minimum%20Rating%20Filter%20with%20Themed%20UI%20%28Persistent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547862/LiveChartme%20Minimum%20Rating%20Filter%20with%20Themed%20UI%20%28Persistent%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'pm_min_rating';

    init();

    function init() {
        addFilterUI();
    }

    function addFilterUI() {
        const container = document.querySelector('.options-bar-v2');
        if (!container) return;

        const existingUI = document.querySelector('.pm-rating-filter');
        if (existingUI) existingUI.remove();

        const label = document.createElement("label");
        label.textContent = "Minimum Rating:";
        label.classList.add('pm-rating-filter', 'option-v2');
        Object.assign(label.style, {
            display: "flex",
            gap: "0.5em",
            alignItems: "center",
            fontFamily: "sans-serif",
            fontSize: "0.9em"
        });

        const input = Object.assign(document.createElement("input"), {
            type: "number",
            placeholder: "7.6",
            min: "0",
            max: "10",
            step: "0.1",
            id: "pm-rating-input",
            value: localStorage.getItem(STORAGE_KEY) || ""
        });
        Object.assign(input.style, {
            width: "4em",
            padding: "0.25em 0.35em",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "0.9em",
            transition: "border-color 0.2s",
            backgroundColor: "#fff"
        });
        label.htmlFor = input.id;
        label.appendChild(input);

        const filters = container.querySelectorAll('.option-v2.hide-for-small-only');
        const lastFilter = filters[filters.length - 1];
        if (!lastFilter) return console.error("Could NOT find the filters to add onto");
        lastFilter.after(label);

        // Input listener
        input.addEventListener("input", debounce((event) => {
            const value = toNumber(event.target.value, 0);
            filterAnimes(value);
            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, value);
        }, 300));

        // Apply filter on page load if a value is saved
        const savedValue = toNumber(localStorage.getItem(STORAGE_KEY), 0);
        if (savedValue > 0) {
            filterAnimes(savedValue);
        }
    }

    function filterAnimes(minRating = 0) {
        const animes = document.querySelectorAll('.anime');
        animes.forEach(anime => {
            const rating = parseFloat(anime.querySelector('.anime-avg-user-rating')?.innerText) || 0;
            if (rating < minRating) {
                hide(anime);
            } else {
                show(anime);
            }
        });
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function toNumber(input, defaultValue = 0) {
        const number = parseFloat(input);
        return Number.isNaN(number) ? defaultValue : number;
    }

    function hide(element) { element.style.display = "none"; }
    function show(element) { element.style.display = ""; }

})();