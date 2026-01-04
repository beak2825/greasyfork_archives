// ==UserScript==
// @name         Stats23andMe
// @namespace    23andme-stats
// @version      1.1
// @description  Displays num_gp and num_relatives for each region button on 23andMe ancestry pages
// @match        https://you.23andme.com/reports/ancestry_composition_hd/*
// @match        https://you.23andme.com/p/*/reports/ancestry_composition_hd/*
// @license      CC BY-NC 4.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554138/Stats23andMe.user.js
// @updateURL https://update.greasyfork.org/scripts/554138/Stats23andMe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAllAggregationsFromPage() {
        // Find all script tags
        const scripts = Array.from(document.querySelectorAll('script'));
        // Regex to find all aggregation arrays with subregion_id
        const aggRegex = /"aggregations"\s*:\s*(\[.*?\])/gs;
        const results = [];
        for (const script of scripts) {
            let match;
            while ((match = aggRegex.exec(script.textContent)) !== null) {
                try {
                    const aggArrJson = match[1].replace(/'/g, '"');
                    const aggregations = JSON.parse(aggArrJson);
                    if (aggregations && aggregations.length > 0) {
                        aggregations.forEach(obj => {
                            results.push(obj);
                            // Debug: log each found aggregation object and its subregion_id
                            console.log('Found aggregation:', obj);
                        });
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }
        }
        // Debug: log all found subregion_ids
        console.log('All found subregion_ids:', results.map(r => r.subregion_id));
        return results;
    }

    function insertAfterRegionButtons() {
        const aggs = getAllAggregationsFromPage();
        aggs.forEach(agg => {
            // Try to find button by subregion_id or state name
            let regionBtn = document.querySelector(`button.sd-unbutton[data-subregion-id="${agg.subregion_id}"]`);
            if (!regionBtn && agg.state) {
                // Fallback: try to find by aria-label containing state name
                regionBtn = Array.from(document.querySelectorAll('button.sd-unbutton')).find(btn => btn.getAttribute('aria-label') && btn.getAttribute('aria-label').includes(agg.state));
            }
            if (regionBtn && !regionBtn.dataset.copilotInserted) {
                regionBtn.dataset.copilotInserted = 'true';
                const newDiv = document.createElement('div');
                newDiv.style.background = 'linear-gradient(90deg, #eafaf1 0%, #fff5f5 100%)';
                newDiv.style.border = '1px solid #b2dfdb';
                newDiv.style.borderRadius = '8px';
                newDiv.style.padding = '8px 14px';
                newDiv.style.margin = '8px 0';
                newDiv.style.fontSize = '1.05em';
                newDiv.style.display = 'flex';
                newDiv.style.gap = '18px';
                newDiv.innerHTML = `
                    <span style="color:#d32f2f;font-weight:600;">num_gp: <span style='background:#ffcdd2;color:#b71c1c;padding:2px 8px;border-radius:4px;'>${agg.num_gp}</span></span>
                    <span style="color:#388e3c;font-weight:600;">num_relatives: <span style='background:#c8e6c9;color:#1b5e20;padding:2px 8px;border-radius:4px;'>${agg.num_relatives}</span></span>
                `;
                regionBtn.parentNode.insertBefore(newDiv, regionBtn.nextSibling);
            }
        });
    }

    // Observe DOM changes to catch dynamically loaded buttons
    const observer = new MutationObserver(() => {
        insertAfterRegionButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also try on DOMContentLoaded
    window.addEventListener('DOMContentLoaded', insertAfterRegionButtons);
})();
