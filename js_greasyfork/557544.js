// ==UserScript==
// @name         GitHub - Pull Request - Compare Upstream Before Merging
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  This adds a Compare button next to the merge button which opens a new tab to compare upstream.
// @author       barry.bankhead@hear.com
// @match        https://github.com/Audibene-GMBH/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557544/GitHub%20-%20Pull%20Request%20-%20Compare%20Upstream%20Before%20Merging.user.js
// @updateURL https://update.greasyfork.org/scripts/557544/GitHub%20-%20Pull%20Request%20-%20Compare%20Upstream%20Before%20Merging.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PR_URL_REGEX = /https:\/\/github\.com\/(?<organizationId>[^/]+)\/(?<repo>[^/]+)\/pull\/(?<run>[^/]+)/;
    const COMPARE_WINDOW_NAME = '_compare';

    let compareUrl = null;
    let observer = null;

    function updateCompareUrlFromLocation() {
        const href = window.location.href;
        const match = href.match(PR_URL_REGEX);

        if (!match || !match.groups) {
            console.info(`CB4M: Not a supported PR URL, url=${href}`);
            compareUrl = null;
            return;
        }

        const { organizationId, repo } = match.groups;
        compareUrl = `https://github.com/${organizationId}/${repo}/compare/master...develop`;
        console.info(`CB4M: Compare URL hydrated: ${compareUrl}`);
    }

    function patchHistoryForLocationChange() {
        if (window.__cb4mHistoryPatched) return;
        window.__cb4mHistoryPatched = true;

        const { history } = window;
        if (!history || !history.pushState || !history.replaceState) return;

        const originalPushState = history.pushState.bind(history);
        const originalReplaceState = history.replaceState.bind(history);

        history.pushState = function pushStatePatched(...args) {
            const result = originalPushState(...args);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        history.replaceState = function replaceStatePatched(...args) {
            const result = originalReplaceState(...args);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    }

    function openCompareAndEnableMerge() {
        if (!compareUrl) {
            console.warn('CB4M: compareUrl is not set; aborting openCompareAndEnableMerge.');
            return;
        }

        window.open(compareUrl, COMPARE_WINDOW_NAME);

        const mergeButton = document.getElementById('merge_button');
        if (!mergeButton) {
            console.warn('CB4M: merge_button not found when trying to restore disabled state.');
            return;
        }

        const original = mergeButton.dataset.cb4mOriginalDisabled === '1';
        mergeButton.disabled = original;
        console.info(`CB4M: Merge button restored to original disabled=${original}`);
    }

    function isMergeButton(button) {
        if (!button) return false;
        if (typeof button.className !== 'string') return false;

        // Keep your original class check
        const hasExpectedClass = button.className.includes('prc-Button-ButtonBase');
        if (!hasExpectedClass) return false;

        const text = (button.textContent || '').toLowerCase().trim();

        // Handle "Rebase and merge", "Squash and merge", "Merge pull request", etc.
        if (!text.includes('merge')) return false;

        return true;
    }

    function findMergeButton() {
        // Narrow to button elements that look like the merge button
        const candidates = document.querySelectorAll('button.prc-Button-ButtonBase-c50BI, button.prc-Button-ButtonBase');

        for (const button of candidates) {
            if (isMergeButton(button)) {
                return button;
            }
        }

        return null;
    }

    function installCompareButton(mergeButton) {
        if (!mergeButton) {
            console.warn('CB4M: installCompareButton called without mergeButton.');
            return;
        }

        if (document.getElementById('compare_button')) {
            // Already installed
            return;
        }

        const container = mergeButton.parentElement;
        if (!container) {
            console.warn('CB4M: mergeButton has no parentElement.');
            return;
        }

        // Save original disabled state so we do not override real GitHub protections
        mergeButton.dataset.cb4mOriginalDisabled = mergeButton.disabled ? '1' : '0';

        // Create compare button as a fresh button element
        const compareButton = mergeButton.cloneNode();
        compareButton.id = 'compare_button';
        compareButton.type = 'button';
        compareButton.textContent = 'Compare';

        compareButton.disabled = false;
        compareButton.style.display = 'inline-block';
        compareButton.style.borderRadius = '.375rem';
        compareButton.style.marginRight = '8px';
        compareButton.style.backgroundColor = '#09910b';
        compareButton.style.color = '#fff';
        compareButton.style.verticalAlign = 'top';
        compareButton.style.cursor = 'pointer';

        compareButton.addEventListener('click', openCompareAndEnableMerge);

        // Now "lock" the merge button until compare is clicked
        mergeButton.disabled = true;
        mergeButton.id = 'merge_button';
        mergeButton.style.display = 'inline-block';
        mergeButton.style.verticalAlign = 'top';

        container.insertBefore(compareButton, mergeButton);

        console.info('CB4M: Compare button installed and merge button disabled.');
    }

    function handleDomChange() {
        if (!compareUrl) {
            // Not on a valid PR compare context
            return;
        }

        const mergeButton = findMergeButton();
        if (!mergeButton) return;

        installCompareButton(mergeButton);
    }

    function ensureObserver() {
        if (observer) return;

        observer = new MutationObserver(() => {
            try {
                handleDomChange();
            } catch (err) {
                console.error('CB4M: Error in MutationObserver callback', err);
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });

        console.info('CB4M: MutationObserver attached.');
    }

    function initCompareBeforeMerge(caller) {
        console.info(`CB4M: Init from ${caller}`);

        window.c4bp = {
            ...(window.c4bp || {}),
            [caller]: true,
        };

        updateCompareUrlFromLocation();

        if (!compareUrl) {
            return;
        }

        ensureObserver();
        // Run once for already-rendered DOM
        handleDomChange();
    }

    patchHistoryForLocationChange();

    // Initial page load
    initCompareBeforeMerge('main');

    // Handle SPA-style navigation within GitHub
    window.addEventListener('locationchange', () => {
        initCompareBeforeMerge('locationchange');
    });
})();
