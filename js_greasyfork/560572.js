// ==UserScript==
// @name         Universal Safe Search Enforcer
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Force safe search on multiple search engines globally
// @author       HangTuahMalayWarriorSaiyaPeople
// @license MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560565/Universal%20Safe%20Search%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/560565/Universal%20Safe%20Search%20Enforcer.meta.js
// ==/UserScript==
// https://github.com/hangtuahmalaywarrior

(function() {
    'use strict';

    // Function to add safe search parameters to URLs
    function enforceSafeSearch(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            const params = urlObj.searchParams;
            let modified = false;

            // Yandex and all subdomains
            if (/yandex\.(com|ru|ua|by|kz|az|ee|lt|lv|md|tj|tm|uz|fr|de|it|tr|co\.\w+)/i.test(hostname)) {
                if (urlObj.pathname.includes('/search')) {
                    params.set('family', 'yes'); // Yandex safe search
                    modified = true;
                }
            }
            // Bing
            else if (/bing\.com$/i.test(hostname)) {
                params.set('adlt', 'strict');
                modified = true;
            }
            // DuckDuckGo
            else if (/duckduckgo\.com$/i.test(hostname) || /ddg\.gg$/i.test(hostname)) {
                params.set('kp', '1'); // kp=1 is strict safe search
                modified = true;
            }
            // Yahoo
            else if (/search\.yahoo\.com$/i.test(hostname)) {
                params.set('vm', 'p'); // p = strict safe search
                modified = true;
            }
          else if (/ya\.ru$/i.test(hostname)) {
                params.set('family', 'yes');
                modified = true;
            }
            /// Additional search engines can be added here

  const currentUrl = window.location.href;
    
    // Check if URL contains "qwant" and has a search query (?q=)
    if ((currentUrl.includes('qwant.com') && currentUrl.includes('?q=') || (currentUrl.includes('www.qwant.com')) )&& !currentUrl.includes('qwantjunior')) {
        // Replace qwant.com with qwantjunior.com
        const newUrl = currentUrl.replace(/qwant\.com/g, 'qwantjunior.com');
        
        // Redirect to Brave safe
        window.location.replace(newUrl);
    } else if((currentUrl.includes('search.brave.com'))&& !currentUrl.includes('safe.search.brave.com')) {
        // Replace 
        const newUrl = currentUrl.replace(/search.brave.com/g, 'safe.search.brave.com');
        
        // Redirect
        window.location.replace(newUrl);
    } 
else if((currentUrl.includes('www.startpage.com')) && !currentUrl.includes('safe.startpage.com')) {
        // Replace 
        const newUrl = currentUrl.replace(/www.startpage.com/g, 'safe.startpage.com');
        
        // Redirect
        window.location.replace(newUrl);
    } 
/// End additional search engines


            if (modified) {
                urlObj.search = params.toString();
                return urlObj.toString();
            }
        } catch (e) {
            console.error('Safe Search Enforcer error:', e);
        }
        return url;
    }

    // Intercept navigation
    (function(history) {
        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function(state, title, url) {
            if (url) {
                url = enforceSafeSearch(url.toString());
            }
            return pushState.apply(history, [state, title, url]);
        };

        history.replaceState = function(state, title, url) {
            if (url) {
                url = enforceSafeSearch(url.toString());
            }
            return replaceState.apply(history, [state, title, url]);
        };
    })(window.history);

    // Handle link clicks
    document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (target && target.href) {
            const originalHref = target.href;
            const newHref = enforceSafeSearch(originalHref);
            
            if (newHref !== originalHref) {
                e.preventDefault();
                window.location.href = newHref;
            }
        }
    }, true);

    // Handle form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.tagName === 'FORM' && e.target.method.toLowerCase() === 'get') {
            const form = e.target;
            const action = form.getAttribute('action');
            
            if (action) {
                const newAction = enforceSafeSearch(action);
                if (newAction !== action) {
                    form.setAttribute('action', newAction);
                }
            }
        }
    }, true);

    // Check current URL and redirect if needed
    function checkCurrentUrl() {
        const currentUrl = window.location.href;
        const newUrl = enforceSafeSearch(currentUrl);
        
        if (newUrl !== currentUrl && !window.location.href.includes('safe=already')) {
            window.location.replace(newUrl);
        }
    }

    // Run on page load
    window.addEventListener('load', checkCurrentUrl);
    window.addEventListener('popstate', checkCurrentUrl);

    // Also run immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkCurrentUrl);
    } else {
        checkCurrentUrl();
    }

    // Set safe search cookies for supported sites
    function setCookies() {
        const hostname = window.location.hostname;
        
        // Yandex cookies
        if (/yandex\./i.test(hostname)) {
            document.cookie = 'yandex_login=; path=/; max-age=31536000';
            document.cookie = 'yandexuid=; path=/; max-age=31536000';
            // Yandex safe search preference
            document.cookie = 'yandex_search_safe=1; path=/; max-age=31536000';
        }
        
        // Bing cookies
        if (/bing\.com$/i.test(hostname)) {
            document.cookie = 'SRCHHPGUSR=ADLT=STRICT; path=/; max-age=31536000';
        }
    }

    // Run cookie setting
    setCookies();
        
    
    
    
})();