// ==UserScript==
// @name         ERC Data Management tickets Warning Banner
// @author       ambkavya
// @namespace    https://t.corp.amazon.com/
// @version      0.9
// @description  Show warning banner for ERC Data Management tickets
// @match        https://t.corp.amazon.com/*
// @match        https://t-integ.corp.amazon.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556414/ERC%20Data%20Management%20tickets%20Warning%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/556414/ERC%20Data%20Management%20tickets%20Warning%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of allowed submitters (banner won't show for these)
    const ALLOWED_SUBMITTERS = [
        'fluxo:flx-jarvis-smart',
        'arn:aws:sts::497802784642:assumed-role/CleStack-Prod-LambdaRole/CoralLambda-Prod',
        'arn:aws:sts::891377278984:assumed-role/StepUp-JobDataPersist-pro-StepUpDmTicketingLambdaRo-V1Pb8SXwoliu/StepUp-DmTicketingLambda-prod-pdx',
        'aws:sts::442458218920:assumed-role/SMFJDProcessor-Infra-prod-JdAggregatorLambdaServic-1I3WBUU5SGGYF/JdAggregatorLambda',
        'fluxo:flx-term',
        'jobcodechangeworkflow',
        'fluxo:flx-river',
        'arn:aws:sts::203724744875:assumed-role/CleStack-Prod-LambdaRole/CoralLambda-Prod',
        'arn:aws:sts::882224133502:assumed-role/CleStack-Prod-LambdaRole/CoralLambda-Prod',
        'arn:aws:sts::621709161046:assumed-role/CleStack-Prod-LambdaRole/CoralLambda-Prod',
        'jobs_domain_operations',
        'arn:aws:sts::883535878157:assumed-role/TicketyWorkerStack-prod-TicketCreationLambdaprod'


    ];

    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            setTimeout(fn, 1000);
        } else {
            document.addEventListener('DOMContentLoaded', () => setTimeout(fn, 1000));
        }
    }

    // Check if we should show the banner
    function shouldShowBanner() {
        try {
            const pageText = document.body.textContent || '';
            // Return true if none of the allowed submitters are found
            return !ALLOWED_SUBMITTERS.some(submitter => pageText.includes(submitter));
        } catch (e) {
            return false;
        }
    }

    // Create and insert banner
    function insertBanner() {
        // Check if banner already exists
        if (document.getElementById('submitter-warning')) {
            return;
        }

        // Create banner element
        const banner = document.createElement('div');
        banner.id = 'submitter-warning';
        banner.innerHTML = `
            <div style="
                background-color: #cc0000;
                color: #ffffff;
                padding: 10px;
                margin: 60px auto;
                border: 1px solid #990000;
                border-radius: 4px;
                font-family: 'Amazon Ember', Arial, sans-serif;
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                max-width: 800px;
                z-index: 9999;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">
                <p style="margin: 0; font-weight: bold; font-size: 16px;">
                    Note:This is a manually created SIM. Update root cause as JD/PID Manual ticket - Pushback/Exception.
                </p>
            </div>
        `;

        // Insert banner at top of body
        document.body.insertBefore(banner, document.body.firstChild);
    }

    // Remove existing banner
    function removeBanner() {
        const existingBanner = document.getElementById('submitter-warning');
        if (existingBanner) {
            existingBanner.remove();
        }
    }

    // Main function to check and manage banner
    function checkAndManageBanner() {
        if (shouldShowBanner()) {
            insertBanner();
        } else {
            removeBanner();
        }
    }

    // Initialize
    ready(() => {
        // Initial check
        checkAndManageBanner();

        // Set up periodic checks
        let checkCount = 0;
        const maxChecks = 5;
        const checkInterval = setInterval(() => {
            checkCount++;
            if (checkCount >= maxChecks) {
                clearInterval(checkInterval);
                return;
            }
            checkAndManageBanner();
        }, 2000);

        // Watch for URL changes and content updates
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
            }
            checkAndManageBanner();
        }).observe(document, {subtree: true, childList: true});
    });
})();
