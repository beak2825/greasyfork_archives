// ==UserScript==
// @name         Disable Input Scroll on Coursesite Grade Page
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prevents mouse wheel scrolling from changing grade input values on Coursesite
// @author       You
// @match        https://coursesite.lehigh.edu/grade*
// @match        https://coursesite.lehigh.edu/*/grade*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552593/Disable%20Input%20Scroll%20on%20Coursesite%20Grade%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/552593/Disable%20Input%20Scroll%20on%20Coursesite%20Grade%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Coursesite: Input scroll prevention loaded');

    // Prevent wheel events on all input/select elements
    function preventInputScroll(e) {
        const target = e.target;
        const tagName = target.tagName;
        
        // Check if it's an input, textarea, or select element
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
            // Prevent the default scroll behavior
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('Blocked scroll on:', tagName, target.type || '');
            return false;
        }
    }

    // Add the event listener with capture phase to catch it early
    document.addEventListener('wheel', preventInputScroll, { 
        passive: false, 
        capture: true 
    });

    // Also add mousewheel listener for older browsers/compatibility
    document.addEventListener('mousewheel', preventInputScroll, { 
        passive: false, 
        capture: true 
    });

    // For dynamically loaded content, use MutationObserver to catch new inputs
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Check if the node itself is an input
                    if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') {
                        attachDirectListener(node);
                    }
                    // Check for inputs within the added node
                    const inputs = node.querySelectorAll('input, textarea, select');
                    inputs.forEach(attachDirectListener);
                }
            });
        });
    });

    // Attach listeners directly to elements as backup
    function attachDirectListener(element) {
        element.addEventListener('wheel', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }, { passive: false, capture: true });
    }

    // Start observing when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Also attach to existing inputs
            document.querySelectorAll('input, textarea, select').forEach(attachDirectListener);
            console.log('Coursesite: Observers and direct listeners attached');
        });
    } else {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        document.querySelectorAll('input, textarea, select').forEach(attachDirectListener);
        console.log('Coursesite: Observers and direct listeners attached');
    }

})();