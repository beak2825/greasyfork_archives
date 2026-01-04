// ==UserScript==
// @name         WME Redirect to Beta Links
// @namespace    https://github.com/kid4rm90s/WME-Redirect-to-Beta-Links
// @version      2025-12-24.01
// @description  Open all WME links in Beta WME
// @author       kid4rm90s
// @match        https://docs.google.com/spreadsheets/*
// @match        https://mail.google.com/*
// @match        https://*/*
// @exclude      https://www.waze.com/discuss/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559241/WME%20Redirect%20to%20Beta%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/559241/WME%20Redirect%20to%20Beta%20Links.meta.js
// ==/UserScript==

// Modified from WME Beta UR Links-2025-01-21.user.js by FXZFun
 
(function() {
    'use strict';
 
    // Don't run on WME pages themselves to avoid redirect loops
    if (/\.waze\.com\/.*editor/i.test(location.href)) {
        return;
    }
 
    // Convert WME link to beta version
    function convertToBetaLink(href) {
        if (!href || !/.*\.waze\.com\/.*editor.*/i.test(href)) {
            return null;
        }
        
        try {
            let url = new URL(href);
            let params = new URLSearchParams(url.search);
 
            // Adjust zoom value
            params.delete('zoom');
            params.delete('zoomLevel');
            params.append('zoomLevel', 20);
 
            // Change to beta WME
            url.hostname = url.hostname.replace('www.', 'beta.');
            return url.origin + url.pathname + '?' + params.toString();
        } catch (e) {
            return null;
        }
    }
 
    // Replace link hrefs in the DOM
    function replaceLinks() {
        let wmeLinks = [...document.querySelectorAll('a')].filter(link => link.href && /.*\.waze\.com\/.*editor.*/i.test(link.href));
 
        wmeLinks.forEach(linkEl => {
            // Skip if already processed and marked
            if (linkEl.getAttribute('data-beta-processed') === 'true') {
                return;
            }
            
            let newLink = convertToBetaLink(linkEl.href);
            if (newLink) {
                linkEl.href = newLink;
                linkEl.setAttribute('data-saferedirecturl', newLink);
                linkEl.setAttribute('data-beta-processed', 'true');
            }
        });
    }
 
    // Click event interceptor for more reliable redirects
    document.addEventListener('click', function(e) {
        let target = e.target;
        
        // Find the closest anchor element
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (target && target.tagName === 'A' && target.href) {
            let betaLink = convertToBetaLink(target.href);
            
            if (betaLink) {
                // Prevent default action and manually redirect
                e.preventDefault();
                e.stopPropagation();
                
                // Update the href just in case
                target.href = betaLink;
                
                // Open in the same way the original link would have opened
                if (target.target === '_blank' || e.ctrlKey || e.metaKey || e.button === 1) {
                    window.open(betaLink, '_blank');
                } else {
                    window.location.href = betaLink;
                }
            }
        }
    }, true); // Use capture phase to intercept before Google's handlers
 
    // Initial replacement
    replaceLinks();
 
    // Continue checking for new links on Google sites
    if (location.href.includes('mail.google.com') || location.href.includes('docs.google.com/spreadsheets')) {
        setInterval(replaceLinks, 1000);
        
        // Also use MutationObserver for better performance
        const observer = new MutationObserver(function(mutations) {
            replaceLinks();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
 
})();