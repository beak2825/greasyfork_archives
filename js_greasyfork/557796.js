// ==UserScript==
// @name         Copilot Studio Layout Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make Test your agent canvas take 80% width and hide Create button
// @author       You
// @match        https://copilotstudio.microsoft.com/environments/*/create/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557796/Copilot%20Studio%20Layout%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/557796/Copilot%20Studio%20Layout%20Enhancer.meta.js
// ==/UserScript==


(function() {
    'use strict';


    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        /* Make the Test your agent canvas take up 80% of the window */
        div.___95z3l10.f22iagw.ff23yd3.f6dzj5z.fi4v0vl.fly5x3f.f61z0x5.fprs0cq {
            width: 80% !important;
            max-width: 80% !important;
            flex: 0 0 80% !important;
        }


        /* Hide the Create button */
        button[data-telemetry-id="GPTCreationPage-ActionMenu-Create"] {
            display: none !important;
        }


        /* Adjust the left panel to take remaining space */
        div.___95z3l10.f22iagw.ff23yd3.f6dzj5z.fi4v0vl.fly5x3f.f61z0x5.fprs0cq ~ * {
            flex: 1 !important;
        }
    `;
    document.head.appendChild(style);


    // Function to hide Create button (in case it loads after initial page load)
    function hideCreateButton() {
        const createButton = document.querySelector('button[data-telemetry-id="GPTCreationPage-ActionMenu-Create"]');
        if (createButton) {
            createButton.style.display = 'none';
        }
    }


    // Function to resize the Test your agent panel
    function resizeTestPanel() {
        const testPanel = document.querySelector('div.___95z3l10.f22iagw.ff23yd3.f6dzj5z.fi4v0vl.fly5x3f.f61z0x5.fprs0cq');
        if (testPanel) {
            testPanel.style.width = '80%';
            testPanel.style.maxWidth = '80%';
            testPanel.style.flex = '0 0 80%';
        }
    }


    // Run immediately
    hideCreateButton();
    resizeTestPanel();


    // Watch for DOM changes in case elements load dynamically
    const observer = new MutationObserver(function(mutations) {
        hideCreateButton();
        resizeTestPanel();
    });


    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    // Also run after a short delay to catch any delayed loads
    setTimeout(() => {
        hideCreateButton();
        resizeTestPanel();
    }, 1000);


    setTimeout(() => {
        hideCreateButton();
        resizeTestPanel();
    }, 2000);
})();