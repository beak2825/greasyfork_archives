// ==UserScript==
// @name         Mistral Followup Class Remover
// @description  Removes the class from followup-blocks after each Mistral response
// @match        *://*.mistral.ai/*
// @version 0.0.1.20250928143152
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/550968/Mistral%20Followup%20Class%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/550968/Mistral%20Followup%20Class%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove class from followup-blocks
    function removeFollowupBlockClass() {
        document.querySelectorAll(".followup-block").forEach(function(originalElement) {
            var clonedElement = originalElement.cloneNode(true);
            clonedElement.removeAttribute("class");
            originalElement.replaceWith(clonedElement);
        });
    }

    // Observe the main container for new response nodes
    const mainContainer = document.body; // You can narrow this to a specific container if known
    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                removeFollowupBlockClass();
            }
        }
    });

    observer.observe(mainContainer, { childList: true, subtree: true });

})();