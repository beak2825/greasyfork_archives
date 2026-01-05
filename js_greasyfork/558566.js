// ==UserScript==
// @name         Entertrained Space Double-Press Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevent second consecutive space on Entertrained
// @match        *://entertrained.app/*
// @match        *://*.entertrained.app/*
// @run-at       document-start
// @grant        none
// @license      CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/558566/Entertrained%20Space%20Double-Press%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558566/Entertrained%20Space%20Double-Press%20Filter.meta.js
// ==/UserScript==

(function() {
    let spaceChain = 0;
    let lastWasSpace = false;

    function isEditable(el) {
        return (
            el.isContentEditable ||
            el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.closest("[contenteditable='true']")
        );
    }

    function handleSpaceBlocking(e) {
        const el = e.target;

        if (!isEditable(el)) {
            lastWasSpace = false;
            spaceChain = 0;
            return;
        }

        // KEYDOWN
        if (e.type === "keydown" && e.code === "Space") {
            if (lastWasSpace) {
                spaceChain++;
            } else {
                spaceChain = 1;
            }

            lastWasSpace = true;

            if (spaceChain === 2) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return;
            }
        }

        // BEFOREINPUT (for React/custom editors)
        if (e.type === "beforeinput" && e.data === " ") {
            if (lastWasSpace) {
                spaceChain++;
            } else {
                spaceChain = 1;
            }

            if (spaceChain === 2) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return;
            }

            lastWasSpace = true;
        }

        // Any non-space resets
        if (
            (e.type === "keydown" && e.code !== "Space") ||
            (e.type === "beforeinput" && e.data !== " ")
        ) {
            lastWasSpace = false;
            spaceChain = 0;
        }
    }

    // Main event listeners
    window.addEventListener("keydown", handleSpaceBlocking, true);
    window.addEventListener("beforeinput", handleSpaceBlocking, true);

    // Shadow DOM support
    const observer = new MutationObserver(() => {
        document.querySelectorAll("*").forEach(el => {
            if (el.shadowRoot) {
                el.shadowRoot.addEventListener("keydown", handleSpaceBlocking, true);
                el.shadowRoot.addEventListener("beforeinput", handleSpaceBlocking, true);
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
