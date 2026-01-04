// ==UserScript==
// @name         WaniKani Heatmap Recolor
// @namespace    heatmaprecolor
// @version      1.06
// @description  Dynamically recolors WaniKani dashboard heatmaps based on your personal study range, excluding the current day from the calculation.
// @author       Ayla Gwizdak (edited by user request)
// @license      GPL-3.0-or-later
// @match        https://wanikani.com/*
// @match        https://www.wanikani.com/*
// @homepageURL  https://community.wanikani.com/t/dashboard-heatmap-dynamic-coloring-scipt/71972
// @supportURL   https://community.wanikani.com/t/dashboard-heatmap-dynamic-coloring-scipt/71972
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552005/WaniKani%20Heatmap%20Recolor.user.js
// @updateURL https://update.greasyfork.org/scripts/552005/WaniKani%20Heatmap%20Recolor.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    /* global wkof */

    // A cache to store the calculated min/max ranges for each month of the yearly heatmaps.
    const yearlyRangesCache = {};

    if (!window.wkof) {
        let response = confirm('The "Heatmap Recolor" script requires Wanikani Open Framework.\nYou will now be forwarded to the installation instructions.');
        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    wkof.include('Menu,Settings');
    wkof.ready('Menu,Settings').then(start_script);

    function start_script() {
        const dashboardInterval = setInterval(() => {
            const dashboard = document.querySelector('.dashboard');
            if (dashboard) {
                clearInterval(dashboardInterval);
                install_dashboard_observer(dashboard);
            }
        }, 250);
    }

    function install_dashboard_observer(dashboardNode) {
        let debounceTimer;
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => find_and_recolor_heatmaps(dashboardNode), 250);
        });
        observer.observe(dashboardNode, { childList: true, subtree: true });
        find_and_recolor_heatmaps(dashboardNode);
    }

    function find_and_recolor_heatmaps(node) {
        const heatmaps = node.querySelectorAll('.heat-map-widget');
        heatmaps.forEach(heatmap => {
            const hasData = heatmap.querySelector('.heat-map-widget__cell[data-heat-map-target="cell"][data-date]');
            if (hasData) {
                recolorHeatmap(heatmap);
            }
        });
    }

    function recolorHeatmap(heatmapElement) {
        const isYearly = heatmapElement.querySelector('.heat-map-widget__heat-map--yearly');
        const allCells = heatmapElement.querySelectorAll('.heat-map-widget__cell[data-heat-map-target="cell"]');
        if (allCells.length === 0) return;

        if (isYearly) {
            // For yearly maps, we only color them once and then cache the ranges.
            if (heatmapElement.hasAttribute('data-recolored')) return;

            const cellsByMonth = new Map();
            allCells.forEach(cell => {
                const month = cell.dataset.month;
                if (!month) return;
                if (!cellsByMonth.has(month)) cellsByMonth.set(month, []);
                cellsByMonth.get(month).push(cell);
            });
            cellsByMonth.forEach((cells, month) => {
                // Use the month as a key for the cache.
                processCellGroup(cells, month);
            });
            heatmapElement.setAttribute('data-recolored', 'true');
        } else {
            // For monthly maps, we always recalculate.
            processCellGroup(Array.from(allCells));
        }
    }

    /**
     * Helper function to get the current date as a 'YYYY-MM-DD' string.
     */
    function getTodayString() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    function processCellGroup(cells, cacheKey = null) {
        if (cells.length === 0) return;

        const dailyTotals = cells.map(cell => {
            const reviewCount = parseInt(cell.dataset.reviewCount, 10) || 0;
            const lessonCount = parseInt(cell.dataset.lessonCount, 10) || 0;
            return { cell, total: reviewCount + lessonCount };
        });

        // Get today's date to exclude it from calculations.
        const todayString = getTodayString();

        // Create a list of totals for the min/max calculation, excluding today's cell and any cells with zero totals.
        const totalsForCalculation = dailyTotals
            .filter(item => item.cell.dataset.date !== todayString && item.total > 0)
            .map(item => item.total);

        // If there are no other days with data to base the range on, exit.
        if (totalsForCalculation.length === 0) return;

        let minTotal, maxTotal;

        // If we have a cache key (i.e., it's a month from a yearly map) and it's in the cache, use it.
        if (cacheKey && yearlyRangesCache[cacheKey]) {
            ({ minTotal, maxTotal } = yearlyRangesCache[cacheKey]);
        } else {
            // Calculate min and max from the filtered list (which excludes the current day).
            minTotal = Math.min(...totalsForCalculation);
            maxTotal = Math.max(...totalsForCalculation);
            // If it's a yearly map month, save the newly calculated range to the cache.
            if (cacheKey) {
                yearlyRangesCache[cacheKey] = { minTotal, maxTotal };
            }
        }

        if (minTotal === maxTotal) {
            dailyTotals.forEach(({ cell, total }) => {
                if (total > 0) {
                    removeLevelClasses(cell);
                    cell.classList.add('heat-map-widget__cell--level-1');
                }
            });
            return;
        }

        const range = maxTotal - minTotal;
        const step = range / 4;
        const level1_max = minTotal + step;
        const level2_max = minTotal + step * 2;
        const level3_max = minTotal + step * 3;

        // Note: We iterate over the original `dailyTotals` to color ALL cells, including today.
        // The exclusion was only for the *calculation* of the color scale.
        dailyTotals.forEach(({ cell, total }) => {
            let newLevel = 0;
            if (total > 0) {
                if (total <= level1_max) newLevel = 1;
                else if (total <= level2_max) newLevel = 2;
                else if (total <= level3_max) newLevel = 3;
                else newLevel = 4;
            }
            removeLevelClasses(cell);
            cell.classList.add(`heat-map-widget__cell--level-${newLevel}`);
        });
    }

    function removeLevelClasses(element) {
        element.classList.remove(
            'heat-map-widget__cell--level-0',
            'heat-map-widget__cell--level-1',
            'heat-map-widget__cell--level-2',
            'heat-map-widget__cell--level-3',
            'heat-map-widget__cell--level-4'
        );
    }
})();