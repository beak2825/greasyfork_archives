// ==UserScript==
// @name         Recipe Reader
// @namespace    https://github.com/j01t3d/recipe-reader
// @version      1.0
// @description  redirects to print-friendly pages of recipe sites
// @author       j01t3d
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551866/Recipe%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/551866/Recipe%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isPrintPage() {
        return /(?:\/print\/|[?&]print=|recipe\/print|\/print$|print-view|printpage|\/wprm_print\/)/i.test(location.href);
    }

    function redirectToPrint(url) {
        sessionStorage.setItem('lastRecipeURL', location.href);
        sessionStorage.setItem('lastPrintURL', url);
        window.location.href = url;
    }

    function findAndRedirect() {
        if (isPrintPage()) return false;

        // stop redirect if coming back from a print page
        const lastPrintURL = sessionStorage.getItem('lastPrintURL');
        if (lastPrintURL && location.href === sessionStorage.getItem('lastRecipeURL')) {
            return false;
        }

        const selectors = [
            'a[href*="print"]',
            '[class*="print"]',
            '[id*="print"]'
        ];

        for (const selector of selectors) {
            const el = Array.from(document.querySelectorAll(selector)).find(e => {
                const txt = e.textContent.trim().toLowerCase();
                const hasPrintURL = e.href?.includes('print') || (e.closest('a[href*="print"]')?.href);
                const isPrintOnly = e.onclick?.toString().includes('window.print');

                return /print/.test(txt) && hasPrintURL && !isPrintOnly;
            });

            if (el) {
                const url = el.tagName === 'A' && el.href ? el.href : el.closest('a[href*="print"]')?.href;
                if (url) redirectToPrint(url);
                return true;
            }
        }

        return false;
    }

    function monitorGoBackButton() {
        const observer = new MutationObserver(() => {
            const goBack = Array.from(document.querySelectorAll('a, button')).find(el => {
                const txt = el.textContent.trim().toLowerCase();
                return /back|return|go back|close/i.test(txt);
            });

            if (goBack) {
                goBack.addEventListener('click', e => {
                    e.preventDefault(); // stop default navigation
                    const lastRecipe = sessionStorage.getItem('lastRecipeURL');
                    if (lastRecipe) {
                        sessionStorage.removeItem('lastPrintURL'); // clear print page to avoid redirect
                        window.location.href = lastRecipe;
                    }
                });
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
    }

    function onReady() {
        if (!isPrintPage()) {
            if (findAndRedirect()) return;

            const observer = new MutationObserver(() => {
                if (findAndRedirect()) observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => observer.disconnect(), 10000);

            // clear go back flag if this is a new recipe
            const last = sessionStorage.getItem('lastRecipeURL');
            if (!last || last !== location.href) {
                sessionStorage.removeItem('recipeReaderGoBack');
            }
        } else {
            monitorGoBackButton();
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        onReady();
    } else {
        window.addEventListener('DOMContentLoaded', onReady);
    }

})();