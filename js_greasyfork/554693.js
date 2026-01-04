// ==UserScript==
// @name         OpenRice Advanced Filter
// @namespace    https://www.openrice.com/
// @version      1.0
// @description  希望幫到大家揾到一D，野食出品好過Marketing嘅餐廳。
// @match        https://www.openrice.com/*
// @grant        none
// @license      9code.ai
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554693/OpenRice%20Advanced%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/554693/OpenRice%20Advanced%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======== SETTINGS ========
    const DEFAULT_SMILE_COUNT = 200;
    const PRIMARY_COLOR = '#FFC107'; // Yellow theme
    const PANEL_MAX_WIDTH = '330px'; // Max width of the settings panel

    // Load saved settings from localStorage
    let enableSmileFiltering = localStorage.getItem('enableSmileFiltering') !== "false";
    let maxSmileCount = parseInt(localStorage.getItem('maxSmileCount')) || DEFAULT_SMILE_COUNT;
    let filterReviews = localStorage.getItem('filterReviews') === "true";
    let hideMobileSmile = localStorage.getItem('hideMobileSmile') === "true";
    let hideSponsoredRestaurants = localStorage.getItem('hideSponsoredRestaurants') !== "false"; // Default to ON

    // CSS Selectors
    const LMS_AD_CONTENT_SELECTOR = 'div.poi-list-lms-target-ad-swiper div.basic-slider.basic-slider'; // Safe selector (v2.0)
    const LMS_AD_WRAPPER_SELECTOR = 'section.poi-list-lms-target-ad-swiper-wrapper';
    const RESTAURANT_BLOCK_SELECTOR = '.poi-list-cell-desktop-container, section.poi-list-cell-wrapper';
    const REVIEW_BLOCK_SELECTOR = '.review-cell-mobile.poi-detail-review-cell-mobile, .review-post-desktop.poi-detail-review';

    // MODIFIED v5.5: Simplified selector to catch both mobile and desktop smiles
    const SMILE_ICON_SELECTOR = [
        'img.review-post-smile', // Catches both PC and Mobile review smiles
        '.icon.or-sprite.common_icon_smile', // Old generic selector
        '.icon.or-sprite-inline-block.common_smiley_smile_60x60_desktop' // Old generic selector 2
    ].join(', ');

    let hidingTimer = null;

    // ==========================
    // == REMOVAL/HIDING LOGIC ==
    // ==========================

    function removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.remove();
    }

    function removeMatchingElements(selector, action = el => el.remove()) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(action);
    }

    // --- Ad/Banner Removal Functions (Always On) ---
    function removeSmartBanner() { removeElement('.smart-banner.popup'); }
    function removePopupAds() { removeElement('.popup-ad-subview.with-mask'); }
    function removeGptAds() { removeMatchingElements('div[id*="div-gpt-ad-"]'); }
    function removeLmsAdContent() {
        removeMatchingElements(LMS_AD_CONTENT_SELECTOR);
    }

    // --- Content Hiding Functions ---
    // Using user's v5.3 logic
    function applyRestaurantHidingLogic(section) {
        if (section.matches && section.matches(LMS_AD_WRAPPER_SELECTOR)) return;

        let smileCountEl = section.querySelector('.poi-score-row .smile.icon-wrapper .text') || // PC
                           section.querySelector('.poi-score-row .smile-icon + span'); // Mobile

        let promotionBadge = section.querySelector('.poi-list-cell-sponsored-badge');

        let shouldHide = false;

        if (enableSmileFiltering && smileCountEl) {
            let smileCount = parseInt(smileCountEl.textContent.trim(), 10);
            if (!isNaN(smileCount) && smileCount > maxSmileCount) {
                shouldHide = true;
            }
        }

        if (!shouldHide && hideSponsoredRestaurants && promotionBadge) {
            shouldHide = true;
        }

        if (shouldHide) {
            section.style.display = 'none';
        } else {
             section.style.display = '';
             section.style.visibility = 'visible';
        }
    }

    function applyReviewHidingLogic(review) {
        if (!filterReviews) return false;
        const writerInfo = review.querySelector('.review-post-writer-info');
        if (writerInfo) {
            const infoDivs = Array.from(writerInfo.children).filter(el => el.tagName === 'DIV');
            for (const div of infoDivs) {
                const text = div.textContent.trim();
                if (text === '等級4' || text === 'Level4') {
                    review.style.display = 'none'; return true;
                }
            }
        }
        return false;
    }

    function applyMobileSmileReviewHidingLogic(review) {
        if (!hideMobileSmile) return false;
        const smileIcon = review.querySelector(SMILE_ICON_SELECTOR); // Now uses robust selector
        if (smileIcon) {
            review.style.display = 'none'; return true;
        }
        return false;
    }

    function applyAllReviewFilters(review) {
        review.style.visibility = 'visible';
        review.style.display = '';
        const hidByLv4 = applyReviewHidingLogic(review);
        const hidBySmile = !hidByLv4 ? applyMobileSmileReviewHidingLogic(review) : false;

        if(!hidByLv4 && !hidBySmile) {
             review.style.visibility = 'visible';
             review.style.display = '';
        }
    }

    function runAllRemovals() {
        removeSmartBanner();
        removePopupAds();
        removeGptAds();
        removeLmsAdContent(); // Using safe v2.0 logic
    }

    function runAllHiding() {
        document.querySelectorAll(RESTAURANT_BLOCK_SELECTOR).forEach(applyRestaurantHidingLogic);
        document.querySelectorAll(REVIEW_BLOCK_SELECTOR).forEach(applyAllReviewFilters);
    }


    // =============================
    // == MUTATION OBSERVER SETUP ==
    // =============================

    function processAddedNodeForAds(node) {
        if (node.matches && (
            node.matches('.smart-banner.popup') ||
            node.matches('.popup-ad-subview.with-mask')
        )) node.remove();
        if (node.id && node.id.includes("div-gpt-ad-")) node.remove();

        if (node.matches && node.matches('.basic-slider.basic-slider') && node.closest('.poi-list-lms-target-ad-swiper')) {
           node.remove();
        }
        if (node.matches && node.matches('.poi-list-lms-target-ad-swiper')) {
            node.querySelectorAll('.basic-slider.basic-slider').forEach(ad => ad.remove());
        }
        node.querySelectorAll && node.querySelectorAll('div[id*="div-gpt-ad-"]').forEach(ad => ad.remove());
        node.querySelectorAll && node.querySelectorAll(LMS_AD_CONTENT_SELECTOR).forEach(ad => ad.remove());
    }

    function preHideContent(node) {
        if (node.matches && (node.matches(RESTAURANT_BLOCK_SELECTOR) || node.matches(REVIEW_BLOCK_SELECTOR))) {
            node.style.visibility = 'hidden';
        }
        node.querySelectorAll && node.querySelectorAll(RESTAURANT_BLOCK_SELECTOR).forEach(el => el.style.visibility = 'hidden');
        node.querySelectorAll && node.querySelectorAll(REVIEW_BLOCK_SELECTOR).forEach(el => el.style.visibility = 'hidden');
    }

    const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Step 1: Instant processing
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Is element
                        processAddedNodeForAds(node);
                        preHideContent(node);
                    }
                });
            }
        }

        // Step 2: Debounce (delay) the *final* hiding/showing logic
        if (hidingTimer) clearTimeout(hidingTimer);
        hidingTimer = setTimeout(() => {
            runAllHiding(); // Run final filtering
            hidingTimer = null;
        }, 300); // 300ms delay
    };

    const observer = new MutationObserver(observerCallback);
    const observerConfig = { childList: true, subtree: true };

    // ============================
    // == PANEL UI & STYLES ========
    // ============================

    function createPanelStyles() {
        const styles = `
            #or-filter-panel-container {
                font-family: Roboto, "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
                position: fixed; top: 50%; right: calc(-1 * min(${PANEL_MAX_WIDTH}, 95vw));
                transform: translateY(-50%); display: flex; align-items: center; z-index: 9999;
                transition: right 0.35s ease-out;
            }
            #or-filter-panel-container.or-filter-open { right: 0; }
            #or-filter-trigger-tab {
                background-color: ${PRIMARY_COLOR}; color: white; padding: 16px 8px 16px 10px;
                border-radius: 256px 0 0 256px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                display: flex; align-items: center; justify-content: center;
                transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
            }
            #or-filter-trigger-tab:hover { box-shadow: 0 6px 12px rgba(0,0,0,0.2); }
            #or-filter-trigger-tab svg { transition: transform 0.3s ease-out; }
            #or-filter-panel-container.or-filter-open #or-filter-trigger-tab svg { transform: rotate(180deg); }
            #or-filter-modal {
                width: ${PANEL_MAX_WIDTH}; max-width: 95vw; background-color: #FFFFFF;
                padding: 24px; border-radius: 16px; position: relative;
                box-shadow: none; transition: box-shadow 0.3s ease-out;
            }
            #or-filter-panel-container.or-filter-open #or-filter-modal {
                box-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15);
            }
            .or-filter-modal-header h3 {
                margin: 0 0 24px 0;
                font-size: 20px;
                font-weight: 500;
                color: #1f1f1f;
                text-align: center;
            }
            .or-filter-subtitle {
                font-size: 16px;
                font-weight: 500;
                color: #444746; /* Google Material grey */
                text-align: left;
                margin-bottom: 16px;
                margin-top: 0; /* Handled by divider or header */
            }
            .or-filter-divider {
                border: none; height: 1px; background-color: #DADCE0;
                margin: 28px 0 24px 0;
            }
            .or-filter-setting-row {
                display: flex; align-items: center; justify-content: space-between;
                margin-bottom: 18px;
                min-height: 36px;
            }
            .or-filter-setting-row label {
                font-size: 15px;
                color: #3c4043;
                padding-right: 16px;
                flex: 1;
                font-weight: 400;
            }
            .or-filter-setting-row label.or-filter-switch { flex: 0 0 40px; width: 40px; padding-right: 0; }
            .or-filter-setting-row input[type="number"] {
                width: 64px;
                padding: 8px;
                text-align: right;
                font-size: 16px; /* Prevents iOS zoom */
                color: #202124;
                border: 1px solid #DADCE0;
                border-radius: 8px;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .or-filter-setting-row input[type="number"]:focus {
                border-color: ${PRIMARY_COLOR};
                box-shadow: 0 0 0 1px ${PRIMARY_COLOR};
                outline: none;
            }
            .or-filter-button-group { display: flex; justify-content: flex-end; margin-top: 24px; }
            .or-filter-button {
                padding: 10px 24px; border: none; border-radius: 24px; cursor: pointer;
                font-weight: 500; font-size: 14px; text-transform: none;
                transition: background-color 0.2s, box-shadow 0.2s;
            }
            .or-filter-button-primary {
                background-color: ${PRIMARY_COLOR}; color: #333;
            }
            .or-filter-button-primary:hover {
                background-color: #FFD54F;
            }
            .or-filter-switch {
                position: relative; display: inline-block;
                width: 40px; height: 24px;
            }
            .or-filter-switch input { opacity: 0; width: 0; height: 0; }
            .or-filter-slider {
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: #DADCE0; transition: .4s; border-radius: 24px;
            }
            .or-filter-slider:before {
                position: absolute; content: "";
                height: 18px; width: 18px; left: 3px; bottom: 3px;
                background-color: white; transition: .4s; border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            input:checked + .or-filter-slider { background-color: ${PRIMARY_COLOR}; }
            input:checked + .or-filter-slider:before { transform: translateX(16px); }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    function createFilterPanel() {
        let existingPanel = document.getElementById('or-filter-panel-container');
        if (existingPanel) existingPanel.remove();

        const container = document.createElement('div');
        container.id = 'or-filter-panel-container';

        // Using user's v5.3 HTML structure
        container.innerHTML = `
            <div id="or-filter-trigger-tab" title="Filter Settings">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
            </div>
            <div id="or-filter-modal">
                <div class="or-filter-modal-header"><h3>OpenRice Filter Settings</h3></div>

                <h5 class="or-filter-subtitle">RESTAURANT LIST FILTERS</h5>
                <div class="or-filter-setting-row">
                    <label for="or-filter-enableSmile">Enable Smile Filtering</label>
                    <label class="or-filter-switch"><input type="checkbox" id="or-filter-enableSmile" ${enableSmileFiltering ? 'checked' : ''}><span class="or-filter-slider"></span></label>
                </div>
                <div class="or-filter-setting-row">
                    <label for="or-filter-likesInput">Max Smiles to Show</label>
                    <input type="number" id="or-filter-likesInput" value="${maxSmileCount === Infinity ? DEFAULT_SMILE_COUNT : maxSmileCount}" pattern="[0-9]*" inputmode="numeric">
                </div>
                <div class="or-filter-setting-row">
                    <label for="or-filter-hideSponsors">Hide Sponsored Restaurants</label>
                    <label class="or-filter-switch"><input type="checkbox" id="or-filter-hideSponsors" ${hideSponsoredRestaurants ? 'checked' : ''}><span class="or-filter-slider"></span></label>
                </div>

                <hr class="or-filter-divider">

                <h5 class="or-filter-subtitle">REVIEW FILTERS</h5>
                <div class="or-filter-setting-row">
                    <label for="or-filter-filterReviews">Hide Level 4 Reviews</label>
                    <label class="or-filter-switch"><input type="checkbox" id="or-filter-filterReviews" ${filterReviews ? 'checked' : ''}><span class="or-filter-slider"></span></label>
                </div>
                <div class="or-filter-setting-row">
                    <label for="or-filter-hideMobileSmile">Hide Reviews Smile</label>
                    <label class="or-filter-switch"><input type="checkbox" id="or-filter-hideMobileSmile" ${hideMobileSmile ? 'checked' : ''}><span class="or-filter-slider"></span></label>
                </div>

                <div class="or-filter-button-group">
                    <button id="or-filter-apply" class="or-filter-button or-filter-button-primary">套用並刷新</button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // --- Event Listeners for Buttons ---
        const triggerTab = container.querySelector('#or-filter-trigger-tab');
        const applyButton = container.querySelector('#or-filter-apply');

        const toggleHandler = (e) => {
            e.preventDefault();
            container.classList.toggle('or-filter-open');
        };
        triggerTab.addEventListener('click', toggleHandler);
        triggerTab.addEventListener('touchend', toggleHandler); // Mobile fix

        const applyAndRefreshHandler = (e) => {
            e.preventDefault();
            enableSmileFiltering = document.getElementById('or-filter-enableSmile').checked;
            maxSmileCount = parseInt(document.getElementById('or-filter-likesInput').value) || DEFAULT_SMILE_COUNT;
            filterReviews = document.getElementById('or-filter-filterReviews').checked;
            hideMobileSmile = document.getElementById('or-filter-hideMobileSmile').checked;
            hideSponsoredRestaurants = document.getElementById('or-filter-hideSponsors').checked;

            localStorage.setItem('enableSmileFiltering', enableSmileFiltering);
            localStorage.setItem('maxSmileCount', maxSmileCount);
            localStorage.setItem('filterReviews', filterReviews);
            localStorage.setItem('hideMobileSmile', hideMobileSmile);
            localStorage.setItem('hideSponsoredRestaurants', hideSponsoredRestaurants);

            location.reload();
        };
        applyButton.addEventListener('click', applyAndRefreshHandler);
        applyButton.addEventListener('touchend', applyAndRefreshHandler); // Mobile fix
    }

    // ========================
    // == MAIN EXECUTION ======
    // ========================

    createPanelStyles(); // Inject styles

    // --- Initial Scan & Cleanup ---
    runAllRemovals(); // Run ad removals ONCE
    runAllHiding(); // Run content hiding ONCE

    createFilterPanel(); // Create the UI

    // --- Start Observing ---
    observer.observe(document.body, observerConfig);

})();