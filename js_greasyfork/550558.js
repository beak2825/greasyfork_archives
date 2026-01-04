// ==UserScript==
// @name         Edmentum Skip Through Tutorials
// @version      1.0.1
// @description  Automatically progresses through Edmentum tutorials, waiting for each section to finish loading
// @author       j01t3d
// @match        https://*.edmentum.com/courseware-delivery/*
// @namespace    https://github.com/j01t3d/edmentum-tutorial
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550558/Edmentum%20Skip%20Through%20Tutorials.user.js
// @updateURL https://update.greasyfork.org/scripts/550558/Edmentum%20Skip%20Through%20Tutorials.meta.js
// ==/UserScript==

const MAX_ATTEMPTS = 10;
const RETRY_DELAY = 500;
const CLICK_DELAY = 500;
const POLL_INTERVAL = 300;

function enableButtons(sections) {
    for (let child of sections.children) {
        let button = child.querySelector("button");
        if (!button || button.className.includes("toc-current")) continue;
        button.className = "toc-section toc-visited";
        button.removeAttribute("disabled");
        console.log("[Edmentum Skip Through Tutorials]: Unlocked sect.", button.textContent.trim());
    }
}

function waitForSectionComplete(button, callback) {
    const checkCompletion = setInterval(() => {
        if (button.className.includes("toc-visited")) {
            clearInterval(checkCompletion);
            console.log("[Edmentum Skip Through Tutorials]: Section completed", button.textContent.trim());
            callback();
        }
    }, POLL_INTERVAL);
}

function clickSectionsSequentially(sections) {
    let i = 0;
    function clickNext() {
        if (i >= sections.children.length) return;
        let button = sections.children[i].querySelector("button");
        i++;
        if (button && !button.className.includes("toc-current")) {
            button.click();
            console.log("[Edmentum Skip Through Tutorials]: Clicked sect.", button.textContent.trim());
            waitForSectionComplete(button, () => {
                setTimeout(clickNext, CLICK_DELAY);
            });
        } else {
            setTimeout(clickNext, CLICK_DELAY);
        }
    }
    clickNext();
}

function findSections(attempt = 1) {
    const sections = document.querySelector(".tutorial-toc-sections");
    if (!sections) {
        if (attempt >= MAX_ATTEMPTS) {
            console.log("[Edmentum Skip Through Tutorials]: Failed to locate sect. after " + attempt + " attempts.");
            return;
        }
        setTimeout(() => findSections(attempt + 1), RETRY_DELAY);
    } else {
        enableButtons(sections);
        clickSectionsSequentially(sections);
    }
}

findSections();
