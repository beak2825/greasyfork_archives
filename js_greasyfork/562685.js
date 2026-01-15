// ==UserScript==
// @name        Torn Compose Prefill from URL
// @version     1.4
// @description Auto-fills subject & body in Torn message compose from URL params
// @author      dingus
// @match       https://www.torn.com/messages.php*
// @grant       none
// @namespace https://greasyfork.org/users/1338514
// @downloadURL https://update.greasyfork.org/scripts/562685/Torn%20Compose%20Prefill%20from%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/562685/Torn%20Compose%20Prefill%20from%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[TornPrefill v1.4] Script loaded');
    console.log('[TornPrefill] Full URL:', window.location.href);
    console.log('[TornPrefill] Hash:', window.location.hash || '(none)');
    console.log('[TornPrefill] Search params:', window.location.search || '(none)');

    const hashLower = (window.location.hash || '').toLowerCase();
    const isComposePage =
        hashLower.includes('p=compose') ||
        hashLower.includes('/compose') ||
        hashLower.includes('#compose');

    if (!isComposePage) {
        console.log('[TornPrefill] Compose mode NOT detected in hash → exiting early');
        return;
    }

    console.log('[TornPrefill] ✓ Compose page detected');

    let searchStr = window.location.search;

    if (!searchStr && window.location.hash) {
        let routeAndParams = window.location.hash.substring(1);
        let queryStart = routeAndParams.indexOf('&');

        if (queryStart !== -1) {
            searchStr = '?' + routeAndParams.substring(queryStart + 1);
            console.log('[TornPrefill] Params extracted from hash (after &):', searchStr);
        } else {
            let slashOrEqIndex = Math.max(
                routeAndParams.lastIndexOf('/'),
                routeAndParams.lastIndexOf('=')
            );
            if (slashOrEqIndex !== -1 && slashOrEqIndex < routeAndParams.length - 1) {
                searchStr = '?' + routeAndParams.substring(slashOrEqIndex + 1);
                console.log('[TornPrefill] Fallback param extraction from hash:', searchStr);
            }
        }
    }

    const params = new URLSearchParams(searchStr || '');
    const subjectParam = params.get('subject');
    const bodyParam    = params.get('body');

    console.log('[TornPrefill] Parsed parameters:', {
        subject: subjectParam ? decodeURIComponent(subjectParam) : null,
        body:    bodyParam    ? decodeURIComponent(bodyParam).substring(0, 120) + (bodyParam.length > 120 ? '...' : '') : null,
        hasSubject: !!subjectParam,
        hasBody:    !!bodyParam,
        usedSearchStr: searchStr || '(none)'
    });

    if (!subjectParam && !bodyParam) {
        console.log('[TornPrefill] No usable subject or body parameters found → nothing to fill');
        return;
    }

    function fillFields() {
        console.log('[TornPrefill] Trying to fill fields (attempt)');

        let filledSomething = false;

        const subjectInput = document.evaluate(
            '//input[contains(@class, "message-title") or @name="subject" or contains(@placeholder, "Subject") or contains(@placeholder, "Title")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (subjectParam && subjectInput) {
            const decoded = decodeURIComponent(subjectParam);
            subjectInput.value = decoded;
            subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
            subjectInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('[TornPrefill] ✓ Subject filled:', decoded);
            filledSomething = true;
        } else if (subjectParam) {
            console.log('[TornPrefill] Subject input not found yet');
        }

        const editorBody = document.querySelector(
            'div.editor-content.mce-content-body[contenteditable="true"], ' +
            'div.mce-edit-area div[contenteditable="true"], ' +
            'iframe.mce-content-body ~ div[contenteditable="true"]'
        );

        if (bodyParam && editorBody) {
            const decoded = decodeURIComponent(bodyParam);
            if (editorBody.innerHTML.trim()) {
                editorBody.innerHTML = '';
                console.log('[TornPrefill] Cleared default editor content');
            }
            editorBody.innerHTML = decoded;
            editorBody.dispatchEvent(new Event('input', { bubbles: true }));
            editorBody.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('[TornPrefill] ✓ Body filled (length:', decoded.length, 'chars)');
            filledSomething = true;
        } else if (bodyParam) {
            console.log('[TornPrefill] Editor not found yet');
        }

        const success = (!subjectParam || subjectInput) && (!bodyParam || editorBody);
        console.log('[TornPrefill] Fill status:', success ? 'COMPLETE' : 'still waiting');

        return success;
    }

    if (fillFields()) {
        console.log('[TornPrefill] Fields filled on first try — done!');
        return;
    }

    console.log('[TornPrefill] Starting polling (max ~20s)');

    let attempts = 0;
    const maxAttempts = 50;
    const interval = setInterval(() => {
        attempts++;
        console.log(`[TornPrefill] Poll #${attempts}/${maxAttempts}`);

        if (fillFields() || attempts >= maxAttempts) {
            clearInterval(interval);
            if (attempts >= maxAttempts) {
                console.warn('[TornPrefill] Polling timeout — elements missing? Check selectors.');
            } else {
                console.log('[TornPrefill] Filled during polling — success!');
            }
        }
    }, 400);

    setTimeout(() => {
        if (interval) clearInterval(interval);
        console.warn('[TornPrefill] Force-stop polling after 25s');
    }, 25000);

})();