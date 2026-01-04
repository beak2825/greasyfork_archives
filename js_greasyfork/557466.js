// ==UserScript==
// @name         Amazon Force Currency Selector (Interactive)
// @namespace    https://amazon.com/
// @version      1.1
// @license      MIT
// @description  Forces the currency on Amazon and asks which currency to display, works on all Amazon domains
// @match        https://*.amazon.*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557466/Amazon%20Force%20Currency%20Selector%20%28Interactive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557466/Amazon%20Force%20Currency%20Selector%20%28Interactive%29.meta.js
// ==/UserScript==

(function() {
    // --- 1. Ask user for desired currency at page load ---
    let FORCED_CURRENCY = localStorage.getItem("amazonForcedCurrency");
    if (!FORCED_CURRENCY) {
        FORCED_CURRENCY = prompt("Enter your desired Amazon currency code (e.g., USD, COP, BRL, EUR):", "COP");
        if (FORCED_CURRENCY) {
            FORCED_CURRENCY = FORCED_CURRENCY.toUpperCase();
            localStorage.setItem("amazonForcedCurrency", FORCED_CURRENCY);
        } else {
            // Default to COP if user cancels
            FORCED_CURRENCY = "COP";
        }
    }

    const paramName = "currency";

    // List of main Amazon domains
    const AMAZON_DOMAINS = [
        ".amazon.com",
        ".amazon.com.br",
        ".amazon.com.mx",
        ".amazon.ca",
        ".amazon.co.uk",
        ".amazon.de",
        ".amazon.fr",
        ".amazon.it",
        ".amazon.es",
        ".amazon.in",
        ".amazon.co.jp",
        ".amazon.com.au"
    ];

    // --- 2. Force currency cookies every 500ms ---
    function forceCookies() {
        AMAZON_DOMAINS.forEach(domain => {
            document.cookie = `currencyPreference=${FORCED_CURRENCY}; path=/; domain=${domain}`;
            document.cookie = `i18n-prefs=${FORCED_CURRENCY}; path=/; domain=${domain}`;
        });
    }
    setInterval(forceCookies, 500);

    // --- 3. Rewrite any URL to include ?currency=YOUR_CURRENCY ---
    function ensureURLHasCurrency(url) {
        try {
            let u = new URL(url, location.href);
            if (u.searchParams.get(paramName) !== FORCED_CURRENCY) {
                u.searchParams.set(paramName, FORCED_CURRENCY);
            }
            return u.toString();
        } catch (e) {
            return url;
        }
    }

    // Modify all links on the page
    function fixLinks() {
        document.querySelectorAll("a[href]").forEach(a => {
            if (!a.__fixedCurrency) {
                a.href = ensureURLHasCurrency(a.href);
                a.__fixedCurrency = true;
            }
        });
    }
    document.addEventListener("DOMContentLoaded", fixLinks);
    document.addEventListener("mouseover", fixLinks);
    document.addEventListener("click", fixLinks);

    // --- 4. Intercept SPA URL changes ---
    const pushState = history.pushState;
    history.pushState = function() {
        arguments[2] = ensureURLHasCurrency(arguments[2]);
        return pushState.apply(this, arguments);
    };
    window.addEventListener("popstate", () => {
        if (!location.search.includes(`${paramName}=${FORCED_CURRENCY}`)) {
            location.replace(ensureURLHasCurrency(location.href));
        }
    });

    // --- 5. Intercept fetch/XHR to block Amazon attempts to change currency ---
    function interceptURL(original) {
        return function(url, ...rest) {
            return original.call(this, ensureURLHasCurrency(url), ...rest);
        };
    }
    window.fetch = interceptURL(window.fetch);

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        return open.call(this, method, ensureURLHasCurrency(url), ...rest);
    };

})();
