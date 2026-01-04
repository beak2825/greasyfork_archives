// ==UserScript==
// @name         Yahoo Safe Search Enforcer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force safe search on Yahoo search globally
// @author       You
// @license MIT
// @match        https://*.search.yahoo.com/*
// @match        https://search.yahoo.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560608/Yahoo%20Safe%20Search%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/560608/Yahoo%20Safe%20Search%20Enforcer.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    // Function to enforce Yahoo safe search
    function enforceYahooSafeSearch(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            const params = urlObj.searchParams;
            
            // Check if it's Yahoo search
            if (hostname.includes('search.yahoo.com')) {
                // Set safe search parameter for Yahoo
                // Yahoo uses "vm" parameter: r=restricted (safe), p=off
                params.set('vm', 'r');
                return urlObj.toString();
            }
            
            return url;
        } catch (e) {
            console.error('Error processing URL:', e);
            return url;
        }
    }

    // Function to set Yahoo safe search cookie
    function setYahooCookie() {
        try {
            // Yahoo cookie settings
            const cookieName = 'sB';
            const cookieDomain = 'search.' + window.location.hostname.split('.').slice(-2).join('.');
            
            // Current cookies
            let cookies = document.cookie;
            
            // Check if safe search cookie is already set
            if (cookies.includes(cookieName)) {
                // Update existing cookie with safe search setting
                const safeValue = 'r'; // r = restricted (safe)
                const cookieRegex = new RegExp(`(^|;\\s*)${cookieName}=([^;]+)`);
                const match = cookies.match(cookieRegex);
                
                if (match) {
                    let cookieValue = match[2];
                    // Check if vm parameter is already set to r
                    if (!cookieValue.includes('vm=r')) {
                        // Update or add vm=r parameter
                        if (cookieValue.includes('vm=')) {
                            cookieValue = cookieValue.replace(/vm=[^&]*/, 'vm=' + safeValue);
                        } else {
                            cookieValue += '&vm=' + safeValue;
                        }
                        
                        // Set the cookie
                        const expires = new Date();
                        expires.setFullYear(expires.getFullYear() + 10); // 10 years from now
                        
                        document.cookie = `${cookieName}=${cookieValue}; ` +
                                         `expires=${expires.toUTCString()}; ` +
                                         `domain=${cookieDomain}; ` +
                                         `path=/; ` +
                                         `sameSite=None; Secure`;
                        
                        console.log('Yahoo safe search cookie updated');
                        return true;
                    }
                }
            } else {
                // Set new cookie with safe search enabled
                const cookieValue = 'vm=r'; // Enable safe search
                const expires = new Date();
                expires.setFullYear(expires.getFullYear() + 10);
                
                document.cookie = `${cookieName}=${cookieValue}; ` +
                                 `expires=${expires.toUTCString()}; ` +
                                 `domain=${cookieDomain}; ` +
                                 `path=/; ` +
                                 `sameSite=None; Secure`;
                
                console.log('Yahoo safe search cookie set');
                return true;
            }
            
            return false;
        } catch (e) {
            console.error('Error setting Yahoo cookie:', e);
            return false;
        }
    }

    // Main interception logic
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    // Override history methods to intercept URL changes
    history.pushState = function(state, title, url) {
        if (url) {
            const modifiedUrl = enforceYahooSafeSearch(url.toString());
            return originalPushState.call(this, state, title, modifiedUrl);
        }
        return originalPushState.call(this, state, title, url);
    };
    
    history.replaceState = function(state, title, url) {
        if (url) {
            const modifiedUrl = enforceYahooSafeSearch(url.toString());
            return originalReplaceState.call(this, state, title, modifiedUrl);
        }
        return originalReplaceState.call(this, state, title, url);
    };
    
    // Monitor for link clicks and form submissions
    document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (target && target.href) {
            const modifiedUrl = enforceYahooSafeSearch(target.href);
            if (modifiedUrl !== target.href) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = modifiedUrl;
                return false;
            }
        }
    }, true);
    
    // Check and modify current URL on page load
    const currentUrl = window.location.href;
    const modifiedUrl = enforceYahooSafeSearch(currentUrl);
    
    if (modifiedUrl !== currentUrl) {
        window.history.replaceState({}, '', modifiedUrl);
    }
    
    // Set cookie for Yahoo safe search
    if (window.location.hostname.includes('search.yahoo.com')) {
        // Run cookie setting after a short delay to ensure page is loading
        setTimeout(() => {
            const changed = setYahooCookie();
            if (changed) {
                console.log('Yahoo safe search enforced via cookie');
            }
        }, 100);
    }
    
    console.log('Yahoo Safe Search Enforcer active');
})();