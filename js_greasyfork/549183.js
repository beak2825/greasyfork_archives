// ==UserScript==
// @name            Remove Suggested Posts on LinkedIn
// @description     Hides suggested posts on LinkedIn with scroll and debounce functionality
// @author          @Ltrademark
// @version         1.21
// @icon            https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @namespace       Violentmonkey Scripts
// @match           https://www.linkedin.com/feed/*
// @compatible      chrome Chrome + Tampermonkey or Violentmonkey
// @compatible      firefox Firefox Tampermonkey
// @compatible      opera Opera + Tampermonkey or Violentmonkey
// @compatible      edge Edge + Tampermonkey or Violentmonkey
// @compatible      safari Safari + Tampermonkey or Violentmonkey
// @grant           none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549183/Remove%20Suggested%20Posts%20on%20LinkedIn.user.js
// @updateURL https://update.greasyfork.org/scripts/549183/Remove%20Suggested%20Posts%20on%20LinkedIn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;

    function log(message) {
        if (DEBUG) {
            console.log(`[LinkedIn Suggested Remover] ${message}`);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function hideSuggestedPosts() {
        try {
            // log("Looking for suggested posts...");

            const targetPosts = Array.from(document.querySelectorAll('.update-components-header__text-view'))
                .filter(e => e.textContent.trim() === 'Suggested');

            // log(`Found ${targetPosts.length} suggested posts`);

            targetPosts.forEach(post => {
                let postContainer = post.closest('[data-urn]') ||
                                   post.closest('.scaffold-finite-scroll__content') ||
                                   post.closest('.feed-shared-update-v2') ||
                                   post.closest('.occludable-update');

                if (!postContainer) {
                    let element = post;
                    for (let i = 0; i < 12 && element; i++) {
                        element = element.parentElement;
                        if (element && element.getAttribute('data-urn')) {
                            postContainer = element;
                            break;
                        }
                    }
                }

                if (postContainer) {
                    postContainer.style.display = 'none';
                    postContainer.setAttribute('data-was-hidden', 'true');
                    // log("Hidden a suggested post");
                } else {
                    console.log("Could not find container for a suggested post");
                }
            });
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }

    const debouncedHideSuggestedPosts = debounce(hideSuggestedPosts, 500);

    function init() {
        console.log("Script initialized");

        setTimeout(hideSuggestedPosts, 2000);

        window.addEventListener('scroll', debouncedHideSuggestedPosts);

        const observer = new MutationObserver(debouncedHideSuggestedPosts);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.addEventListener('click', debouncedHideSuggestedPosts);

        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(hideSuggestedPosts, 1000);
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();