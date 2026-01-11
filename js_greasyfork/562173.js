// ==UserScript==
// @name         CDS ERA5 Variable Selector
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Automatically selects specific variables on the CDS ERA5 Single Levels download page with a sleek GUI.
// @author       You
// @match        https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=download
// @match        https://cds.climate.copernicus.eu/datasets/reanalysis-era5-pressure-levels?tab=download
// @icon         https://www.google.com/s2/favicons?sz=64&domain=copernicus.eu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562173/CDS%20ERA5%20Variable%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/562173/CDS%20ERA5%20Variable%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isPressureLevels = location.href.includes('reanalysis-era5-pressure-levels');

    const PRESSURE_LEVELS_BELOW_10 = [
        "10 hPa", "20 hPa", "30 hPa", "50 hPa", "70 hPa", "100 hPa", "125 hPa", "150 hPa",
        "175 hPa", "200 hPa", "225 hPa", "250 hPa", "300 hPa", "350 hPa", "400 hPa",
        "450 hPa", "500 hPa", "550 hPa", "600 hPa", "650 hPa", "700 hPa", "750 hPa",
        "775 hPa", "800 hPa", "825 hPa", "850 hPa", "875 hPa", "900 hPa", "925 hPa",
        "950 hPa", "975 hPa", "1000 hPa"
    ];

    const TARGET_VARIABLES = [
        "10m u-component of wind",
        "10m v-component of wind",
        "2m dewpoint temperature",
        "2m temperature",
        "Land-sea mask",
        "Mean sea level pressure",
        "Sea-ice cover",
        "Sea surface temperature",
        "Skin temperature",
        "Snow density",
        "Snow depth",
        "Soil temperature level 1",
        "Soil temperature level 2",
        "Soil temperature level 3",
        "Soil temperature level 4",
        "Surface pressure",
        "Volumetric soil water layer 1",
        "Volumetric soil water layer 2",
        "Volumetric soil water layer 3",
        "Volumetric soil water layer 4"
    ];

    function initGUI() {
        // Inject Google Font
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@400;500;600;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        const div = document.createElement('div');
        div.id = 'cds-selector-gui';
        div.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 300px;
            background: #1a1a1a;
            color: #ffffff;
            padding: 0;
            border-radius: 14px;
            z-index: 9999;
            font-family: 'Saira Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            box-shadow: 0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0;
            transform: translateY(-20px);
        `;

        div.innerHTML = `
            <div style="
                background: rgba(255,255,255,0.05);
                padding: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.08);
                cursor: move;
                user-select: none;
            " id="drag-handle">
                <h3 style="
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    letter-spacing: -0.5px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    ERA5 Selector
                </h3>
            </div>
            <div style="padding: 20px;">
                <div style="
                    background: rgba(255,255,255,0.06);
                    border-radius: 10px;
                    padding: 16px;
                    margin-bottom: 16px;
                    border: 1px solid rgba(255,255,255,0.08);
                ">
                    <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Target Variables</div>
                    <div style="font-size: 28px; font-weight: 700; letter-spacing: -1px;">${TARGET_VARIABLES.length}</div>
                </div>
                
                <button id="btn-select-vars" style="
                    width: 100%;
                    padding: 14px;
                    background: #ffffff;
                    color: #1a1a1a;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Select Variables
                </button>
                
                <div id="scan-status" style="
                    margin-top: 16px;
                    font-size: 13px;
                    text-align: center;
                    padding: 10px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 8px;
                    font-weight: 500;
                    min-height: 20px;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255,255,255,0.08);
                ">Ready</div>
            </div>
        `;

        document.body.appendChild(div);

        // Animate in
        setTimeout(() => {
            div.style.opacity = '1';
            div.style.transform = 'translateY(0)';
        }, 100);

        // Hover effects
        const btn = document.getElementById('btn-select-vars');
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px) scale(1.02)';
            btn.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
            btn.style.background = '#f0f0f0';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
            btn.style.background = '#ffffff';
        });
        btn.addEventListener('click', runSelector);

        // Make draggable
        makeDraggable(div, document.getElementById('drag-handle'));
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            element.style.transition = 'none';
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            element.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        }
    }

    function runSelector() {
        const statusEl = document.getElementById('scan-status');
        const btn = document.getElementById('btn-select-vars');

        statusEl.textContent = "Expanding categories...";
        statusEl.style.background = "rgba(255,255,255,0.1)";
        statusEl.style.borderColor = "rgba(255,255,255,0.12)";
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";

        // First, expand all collapsed categories/accordions
        setTimeout(() => {
            expandAllCategories();

            statusEl.textContent = isPressureLevels ? "Scanning pressure levels..." : "Scanning variables...";

            setTimeout(() => {
                let foundCount = 0;
                let clickedCount = 0;

                // Select appropriate target list based on page
                const targetList = isPressureLevels ? PRESSURE_LEVELS_BELOW_10 : TARGET_VARIABLES;

                targetList.forEach(targetName => {
                    const xpath = `//*[text()='${targetName}']`;
                    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                    if (result.snapshotLength > 0) {
                        for (let i = 0; i < result.snapshotLength; i++) {
                            const el = result.snapshotItem(i);
                            let clickTarget = findClickableTarget(el);

                            if (clickTarget) {
                                foundCount++;
                                if (!isChecked(clickTarget)) {
                                    clickTarget.click();
                                    clickedCount++;
                                }
                            }
                        }
                    } else {
                        console.warn(`CDS Selector: Could not find element for "${targetName}"`);
                    }
                });

                statusEl.innerHTML = `
                    <div style="display: flex; justify-content: space-around; font-size: 14px; letter-spacing: 0.3px;">
                        <div><strong style="font-size: 16px;">${foundCount}</strong> <span style="opacity: 0.7;">found</span></div>
                        <div style="opacity: 0.3;">•</div>
                        <div><strong style="font-size: 16px;">${clickedCount}</strong> <span style="opacity: 0.7;">selected</span></div>
                    </div>
                `;
                statusEl.style.background = "rgba(255,255,255,0.1)";
                statusEl.style.borderColor = "rgba(255,255,255,0.15)";
                statusEl.style.transform = "scale(1.02)";
                setTimeout(() => {
                    statusEl.style.transform = "scale(1)";
                }, 200);
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
            }, 500); // Wait for categories to expand
        }, 100);
    }

    function expandAllCategories() {
        // 1. Look for collapsed accordions (aria-expanded="false")
        const collapsedPanels = document.querySelectorAll('[aria-expanded="false"]');
        collapsedPanels.forEach(panel => {
            const text = panel.textContent.toLowerCase();
            if (text.includes('jupyter') || text.includes('notebook') || text.includes('toolbox')) {
                return;
            }
            panel.click();
        });

        // 2. Look for elements with role="button" that might be category headers
        const buttons = document.querySelectorAll('button[aria-expanded="false"]');
        buttons.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            if (text.includes('jupyter') || text.includes('notebook') || text.includes('toolbox')) {
                return;
            }
            btn.click();
        });

        // 3. Look for common accordion/expansion indicators
        const expandableHeaders = document.querySelectorAll('.MuiAccordionSummary-root, .accordion-header, [class*="expansion"]');
        expandableHeaders.forEach(header => {
            const text = header.textContent.toLowerCase();
            if (text.includes('jupyter') || text.includes('notebook') || text.includes('toolbox')) {
                return;
            }
            const isExpanded = header.getAttribute('aria-expanded');
            if (isExpanded === 'false') {
                header.click();
            }
        });

        // 4. Look for specific variable category divs only
        const variableCategories = [
            'Temperature and pressure', 'Wind', 'Snow', 'Soil', 'Ocean waves',
            'Precipitation and rain', 'Radiation and heat', 'Clouds', 'Lakes',
            'Evaporation and runoff', 'Vegetation', 'Vertical integrals', 'Other',
            'Mean rates'
        ];

        const categoryHeaders = Array.from(document.querySelectorAll('div, summary')).filter(el => {
            const text = el.textContent.trim();
            const lowText = text.toLowerCase();
            if (lowText.includes('jupyter') || lowText.includes('notebook') || lowText.includes('toolbox')) {
                return false;
            }
            return variableCategories.some(cat => text.includes(cat));
        });

        categoryHeaders.forEach(header => {
            const expandAttr = header.getAttribute('aria-expanded');
            if (expandAttr === 'false' || !expandAttr) {
                if (header.tagName === 'SUMMARY') {
                    header.click();
                } else {
                    const clickable = header.closest('[role="button"]') || header.querySelector('[role="button"]');
                    if (clickable) clickable.click();
                }
            }
        });

        console.log('CDS Selector: Expanded variable categories (excluded JupyterHub)');
    }

    function findClickableTarget(textElement) {
        let parent = textElement.closest('label');
        if (parent) {
            const input = parent.querySelector('input[type="checkbox"]');
            if (input) return input;
        }

        parent = textElement.parentElement;
        if (parent) {
            const siblingInput = parent.querySelector('input[type="checkbox"]');
            if (siblingInput) return siblingInput;
        }

        return textElement.closest('div[role="button"]') || textElement.closest('label');
    }

    function isChecked(element) {
        if (element.tagName === 'INPUT') {
            return element.checked;
        }
        const input = element.querySelector('input[type="checkbox"]');
        if (input) return input.checked;
        return false;
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('main') || document.body) {
            if (!document.getElementById('cds-selector-gui')) {
                initGUI();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();