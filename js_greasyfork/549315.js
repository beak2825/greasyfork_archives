// ==UserScript==
// @name         Pull request comment context
// @namespace    http://stderr.nl
// @version      2025-09-12
// @description  When viewing a commit in a PR, automatically add the current URL to newly opened comments, to show the context in which the reviewer made the comment.
// @author       Matthijs Kooijman <matthijs@stdin.nl>
// @license      CC0-1.0-Universal, https://creativecommons.org/publicdomain/zero/1.0/
// @homepage     https://codeberg.org/matthijs/greasemonkey-pr-comment-context
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549315/Pull%20request%20comment%20context.user.js
// @updateURL https://update.greasyfork.org/scripts/549315/Pull%20request%20comment%20context.meta.js
// ==/UserScript==

// This script has no URL filter above, since github dynamically loads pages, so we also dynamically match the current URL
const URL_MATCH = /https:\/\/github.com\/[^\/]*\/[^\/]*\/pull\/[^\/]*\/commits\/.*/;

(function() {
    'use strict';

    const PREFIX = "Comment about "

    function process(textarea) {
        if (textarea.textContent.startsWith(PREFIX)) {
            console.log("Not modifiying textarea, already has prefix", textarea);
        } else {
            console.log("Adding URL to textarea", textarea);
            textarea.prepend(PREFIX + window.location + "\n\n");
        }
    }

    new MutationObserver(function(mutationsList, observer) {
        if (!document.location.toString().match(URL_MATCH)) {
            return;
        }

        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for(const node of mutation.addedNodes) {
                    if (node.classList && node.classList.contains('inline-comments')) {
                        const textarea = node.querySelector('textarea.js-comment-field');
                        process(textarea);
                    }
                }
            }
        }
    }).observe(document.body, {childList: true, subtree: true});
})();
