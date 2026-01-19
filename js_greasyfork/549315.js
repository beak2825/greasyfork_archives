// ==UserScript==
// @name         Pull request comment context
// @namespace    http://stderr.nl
// @version      2026-01-19
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
const URL_MATCH = /https:\/\/github.com\/[^\/]*\/[^\/]*\/pull\/[^\/]*\/changes\/.*/;

(function() {
    'use strict';

    const PREFIX = "Comment about "

    function process(textarea) {
        // Add a delay, since there seems to be some startup code that runs
        // *after* the textarea was created that clears the textarea (possibly
        // loads a previous value?).
        // 500ms was not enough, 1000ms sometimes, 2000ms seems to always work
        // (and if you already start typing something, the extra content is
        // neatly prepended).
        setTimeout(function() {
            if (textarea.textContent.startsWith(PREFIX)) {
                console.log("Not modifiying textarea, already has prefix", textarea);
            } else {
                //textarea.focus();
                console.log("Adding URL to textarea", textarea);
                // Normally, you would modify the contents, not the value of a
                // textarea, but this stopped working when the GH markdown
                // editor was further javascriptified somewhere end 2025. Now
                // it works to set the value (which is displayed immediately)
                // and then call change to update the JS internal value
                // somewhere (so the value is not erased again once you start
                // typing).
                // This approach was copied from the use-synthentic-change.ts
                // used by the Github React app.
                textarea.value = PREFIX + window.location + "\n\n" + textarea.value;
                textarea.dispatchEvent(new Event('change', { bubbles: false}));
            }
        }, 2000);
    }

    new MutationObserver(function(mutationsList, observer) {
        if (!document.location.toString().match(URL_MATCH)) {
            return;
        }

        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for(const node of mutation.addedNodes) {
                    if ('querySelector' in node) {
                        const textarea = node.querySelector('div[class*="ConversationCommentBox"] textarea');
                        if (textarea) {
                            process(textarea);
                        }
                    }
                }
            }
        }
    }).observe(document.body, {childList: true, subtree: true});
})();

// vim: set sw=4 sts=4 et:
