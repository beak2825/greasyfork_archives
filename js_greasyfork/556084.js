// ==UserScript==
// @name         Amazon Product Copier
// @description  Copies Amazon product information to the clipboard with the press of a button.
// @author       Tim Macy
// @license      AGPL-3.0-or-later
// @version      1.2
// @namespace    TimMacy.AmazonProductCopier
// @include      /^https:\/\/www\.amazon\..+?\/.*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @run-at       document-end
// @noframes
// @homepageURL  https://github.com/TimMacy/AmazonProductCopier
// @supportURL   https://github.com/TimMacy/AmazonProductCopier/issues
// @downloadURL https://update.greasyfork.org/scripts/556084/Amazon%20Product%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/556084/Amazon%20Product%20Copier.meta.js
// ==/UserScript==

/************************************************************************
*                                                                       *
*                    Copyright © 2025 Tim Macy                          *
*                    GNU Affero General Public License v3.0             *
*                    Version: 1.2 - Amazon Product Copier               *
*                                                                       *
*             Visit: https://github.com/TimMacy                         *
*                                                                       *
************************************************************************/

(async function () {
    'use strict';
    // CSS
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        #amazonCopierBtn {
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 9999;
            padding: 4px 8px;
            margin-left: 8px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            border-radius: 2px;
            border: 1px solid #a88734;
            background: var(--__dChw-LmGoMXsPxT,#ffd814);
            color: var(--__dChw-LmGoMXsw4B,#0f1111);
        }

        #amazonCopierBtn:hover {
            background: var(--__dChw-LmGofIsPxT,#ffce12);
        }

        .CentAnni-force-visibility #productDetails_feature_div div.a-expander-content,
        .CentAnni-force-visibility #cr-product-insights-cards div[id^="aspect-bottom-sheet-"],
        .CentAnni-force-visibility #productDetailsWithModules_feature_div div.a-expander-content,
        .CentAnni-force-visibility #centerCol #nutritionalInfoAndIngredients_feature_div div.a-expander-content.a-expander-section-content,
        .CentAnni-force-visibility div#productDescription_feature_div div[data-a-expander-name="toggle_description"] div.a-expander-content.a-expander-extend-content {
            display: block !important;
        }

        .CentAnni-force-visibility div#productOverview_feature_div span.a-expander-prompt,
        .CentAnni-force-visibility div#productDescription_feature_div span.a-expander-prompt {
            display: none;
        }

        .CentAnni-overlay {
            position: fixed;
            display: flex;
            z-index: 2053;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, .5);
            backdrop-filter: blur(5px);
        }

        .CentAnni-notification {
            background: hsl(0, 0%, 7%);
            padding: 20px 30px;
            border-radius: 8px;
            border: 1px solid hsl(0, 0%, 18.82%);
            max-width: 80%;
            text-align: center;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: 16px;
            color: white;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
    `;

    // append css
    (document.head
        ? Promise.resolve(document.head)
        : new Promise(resolve => {
            document.readyState === 'loading'
                ? document.addEventListener('DOMContentLoaded', () => resolve(document.head), { once: true })
                : resolve(document.head);
        })
    ).then(head => {
        if (head)
            head.appendChild(styleSheet);
        else {
            document.documentElement.appendChild(styleSheet);
            console.error("AmazonProductCopier: Failed to find head element. Using backup to append stylesheet.");
        }
    });

    // elements to copy
    const productTitleSelector = "#productTitle";
    const infoSelectors = [
        '#social-proofing-faceout-title-tk_bought',
        'div[id^="corePriceDisplay_"] > div.aok-relative > span:first-child',
        'div[id^="corePriceDisplay_"] > div.a-spacing-small span.aok-offscreen',
        'div#productOverview_feature_div',
        'div#featurebullets_feature_div',
        'div.a-expander-collapsed-height.a-row.a-expander-container.a-spacing-medium.a-expander-partial-collapse-container',
        '#centerCol #nutritionalInfoAndIngredients_feature_div',
        '.a-cardui.brand-snapshot-card-container',
        'div#productDetails_feature_div',
        'div#productDetailsWithModules_feature_div',
        'div#importantInformation_feature_div',
        'div#productDescription_feature_div:first-child',
        'div#detailBulletsWithExceptions_feature_div',
        'div#detailBulletsReverseInterleaveContainer_feature_v2',
        '#detailBullets2_feature_div',
        '#reviewsMedley #averageCustomerReviewsAnchor',
        'span[data-hook="rating-out-of-text"]',
        'span[data-hook="total-review-count"]',
        '#histogramTable',
        '#reviewsMedley .cm_cr_grid_center_right div[data-csa-c-item-id="cr-product-insights-cards"] h3',
        '#reviewsMedley .cm_cr_grid_center_right #cr-product-insights-cards h3',
        '#reviewsMedley .cm_cr_grid_center_right div[data-csa-c-item-id="cr-product-insights-cards"] div[data-testid="overall-summary"]',
        '#reviewsMedley .cm_cr_grid_center_right #cr-product-insights-cards #product-summary p.a-spacing-small > span',
        '#reviewsMedley .cm_cr_grid_center_right div[data-csa-c-item-id="cr-product-insights-cards"] div[data-testid="ai-disclaimer"] > span:first-child',
        '#reviewsMedley .cm_cr_grid_center_right #cr-product-insights-cards #product-summary #summary-disclaimer-title',
        '#reviewsMedley .cm_cr_grid_center_right div[data-csa-c-item-id="cr-product-insights-cards"] div[data-csa-c-item-id="cr-product-insights-cards-popover"] div[id^="rh_controls_aspect_"]',
        '#reviewsMedley .cm_cr_grid_center_right #cr-product-insights-cards div[data-csa-c-slot-id="cr-product-insights-cards-popover"]'
    ];

    // build content
    const buildContent = () => {
        const titleNode = document.querySelector(productTitleSelector);
        const rawTitle = titleNode?.textContent?.trim();
        const title = rawTitle ? rawTitle.replace(/\s+/g, " ") : "";
        if (!title) return "";

        const rawBlocks = infoSelectors.flatMap(selector => Array.from(document.querySelectorAll(selector))).map(node => node?.innerText?.trim()).filter(text => text && text.length > 0);
        const fixedBlocks = rawBlocks.map(block => {
            if (!block.includes('5 star') || !block.includes('3 star')) return block;

            const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (lines.length % 2 !== 0) return block;

            const merged = [];
            for (let i = 0; i < lines.length; i += 2) merged.push(lines[i] + ' ' + lines[i + 1]);
            return merged.join('\n');
        });

        const infoText = fixedBlocks.join('\n\n');
        if (!infoText) return "";

        const header = `<product: ${title}>\n`;
        const footer = `\n</product: ${title}>`;
        return header + infoText + footer;
    };

    // copy to clipboard
    const copyToClipboard = async () => {
        document.body.classList.add("CentAnni-force-visibility");
        const payload = buildContent();
        if (payload) {
            await navigator.clipboard.writeText(payload);
            showNotification('Content Copied to Clipboard.');
        }
        document.body.classList.remove("CentAnni-force-visibility");
    };

    // function to display the notification
    function showNotification(message) {
        const overlay = document.createElement('div');
        overlay.classList.add('CentAnni-overlay');

        const modal = document.createElement('div');
        modal.classList.add('CentAnni-notification');
        modal.textContent = message;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        setTimeout(() => { overlay.remove(); }, 600);
    }

    // add the button
    const addButton = () => {
        const titleSection = document.querySelector("#titleSection") || document.querySelector("#buybox");
        if (!titleSection || document.querySelector("#amazonCopierBtn")) return;

        const btn = document.createElement("button");
        btn.id = "amazonCopierBtn";
        btn.type = "button";
        btn.textContent = "Copy Content";
        btn.addEventListener("click", () => { copyToClipboard(); });

        document.body.appendChild(btn);
    };

    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", addButton, { once: true }) : addButton();
})();
