// ==UserScript==
// @name         YouTube Mobile Brute Force Content Hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Brute force hide lower content on mobile YouTube
// @author       You
// @match        https://m.youtube.com/watch*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550668/YouTube%20Mobile%20Brute%20Force%20Content%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/550668/YouTube%20Mobile%20Brute%20Force%20Content%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Inject CSS that tries to hide everything in the lower part of the page
    const bruteForceCSS = `
        /* Hide everything after a certain point on mobile */
        body > div > div > div:nth-child(n+4),
        main > div:nth-child(n+4),
        
        /* Try to target common YouTube mobile containers */
        .watch-below-the-player,
        .ytm-watch-below-the-player,
        
        /* Hide any div that comes after the video player area */
        [class*="player"] ~ div:nth-child(n+2),
        
        /* More aggressive - hide lower portions */
        body > * > * > *:nth-child(n+5) > *,
        
        /* Try targeting by common text content */
        div:contains("Comments"),
        div:contains("comment"),
        
        /* Hide anything with these common mobile YouTube classes */
        [class*="ytm-comment"],
        [class*="ytm-watch-below"],
        [class*="watch-below"],
        
        /* Hide divs that are positioned low on the page */
        div[style*="top: 50%"],
        div[style*="bottom:"],
        
        /* Nuclear option - hide everything below 60% of viewport */
        @media screen and (max-width: 768px) {
            body > div:nth-child(n+3),
            main > div:nth-child(n+3),
            [role="main"] > div:nth-child(n+3)
        }
        {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
        }
        
        /* Specifically target text that might be comments */
        *:contains("thought this was gonna be"),
        *:contains("simple essay video"),
        *:contains("award winning") {
            display: none !important;
            visibility: hidden !important;
        }
    `;
    
    function addCSS() {
        const style = document.createElement('style');
        style.textContent = bruteForceCSS;
        style.setAttribute('data-userscript', 'youtube-brute-force');
        (document.head || document.body || document.documentElement).appendChild(style);
        console.log('Brute force CSS injected');
    }
    
    function hideByHeight() {
        // Hide everything below a certain pixel height
        const allElements = document.querySelectorAll('div, section, article');
        
        allElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            
            // If element is in the lower 40% of the viewport, hide it
            if (rect.top > window.innerHeight * 0.6) {
                el.style.display = 'none !important';
                el.style.visibility = 'hidden !important';
                console.log('Hiding element by position:', el.textContent?.substring(0, 30));
            }
        });
    }
    
    function hideByTextLength() {
        // Hide any element with medium-length text that could be a comment
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
            if (el.textContent && el.children.length === 0) { // Only text nodes
                const text = el.textContent.trim();
                
                // If it's comment-like length and content
                if (text.length > 20 && text.length < 300 && 
                    text.includes(' ') && 
                    !text.includes('Subscribe') &&
                    !text.includes('views') &&
                    !text.includes('•') &&
                    text.split(' ').length > 4) {
                    
                    console.log('Hiding by text pattern:', text.substring(0, 40));
                    el.style.display = 'none !important';
                    
                    // Hide parent too
                    if (el.parentElement) {
                        el.parentElement.style.display = 'none !important';
                    }
                }
            }
        });
    }
    
    function massHide() {
        console.log('Running mass hide...');
        
        // Method 1: Hide by position
        hideByHeight();
        
        // Method 2: Hide by text patterns
        hideByTextLength();
        
        // Method 3: Hide everything after finding video title
        const titleElements = document.querySelectorAll('h1, [role="heading"]');
        if (titleElements.length > 0) {
            const videoTitle = Array.from(titleElements).find(el => 
                el.textContent && el.textContent.length > 10
            );
            
            if (videoTitle) {
                console.log('Found video title, hiding content below');
                let current = videoTitle.parentElement;
                let attempts = 0;
                
                while (current && attempts < 5) {
                    let sibling = current.nextElementSibling;
                    let siblingCount = 0;
                    
                    while (sibling && siblingCount < 10) {
                        if (siblingCount >= 2) { // Keep first 2 siblings, hide the rest
                            sibling.style.display = 'none !important';
                            console.log('Hiding sibling after title');
                        }
                        sibling = sibling.nextElementSibling;
                        siblingCount++;
                    }
                    
                    current = current.parentElement;
                    attempts++;
                }
            }
        }
    }
    
    // Inject CSS immediately
    addCSS();
    
    // Run mass hide function
    setTimeout(massHide, 500);
    setTimeout(massHide, 1500);
    setTimeout(massHide, 3000);
    
    // Set up observer
    const observer = new MutationObserver(() => {
        setTimeout(massHide, 200);
    });
    
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
            massHide();
        });
    }
    
})();