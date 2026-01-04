// ==UserScript==
// @name         Accessibility Blue Sky
// @namespace    http://tampermonkey.net/
// @version      2025-10-26.12
// @description  Makes Blue Sky's view significantly larger for ease of use, as well as larger icons while in threaded view.
// @license      MIT
// @author       You
// @match        https://bsky.app/*
// @include		 http://bsky.app/*
// @include      https://bsky.app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553520/Accessibility%20Blue%20Sky.user.js
// @updateURL https://update.greasyfork.org/scripts/553520/Accessibility%20Blue%20Sky.meta.js
// ==/UserScript==

(function() {
    'use strict';

const ICON_SIZE = 42; // In pixels
const THREAD_SCALE = 1.5; // Percentage of the thread size
var BASE_WIDTH;
var actualScale;
var totalWidth;
var targetSize;
var url;

function ready() {
    actualScale = THREAD_SCALE;
    // Window's width
    totalWidth = document.body.offsetWidth;

    // Home View
    handleHomeView();
    // Post View
    handlePostView();
    // Profile View
    handleProfileView();
}

function handleProfileView() {
    var profileView = document.querySelectorAll('[data-testid="profileView"]')
    if (!profileView.length) {
        return;
    }

    const feedElem = document.querySelectorAll('[data-testid="profileScreen"]');
    var frame = feedElem[feedElem.length - 1].previousElementSibling;

    setBaseWidthOnce(frame.offsetWidth);

    // Sidebars
    var [nav, searchElem] = findNavAndSearch();

    var shouldContinue = adjustSize(nav, searchElem);

    if (!shouldContinue) {
        return;
    }

    enlargeProfileView(targetSize, frame);

    positionNavAndSearch(frame, nav, searchElem);

}

function enlargeProfileView(size, frame) {
    frame.style.width = (size + 2) + "px"; // Add a small offset to look nice

    var profileView = document.querySelectorAll('[data-testid="profileView"]');
    var header = profileView[profileView.length - 1].querySelector('[style]');
    header.style.maxWidth = size + "px";

    var tablist = document.querySelectorAll('[role="tablist"');
    tablist = tablist[tablist.length - 1];
    tablist.parentElement.style.maxWidth = size + "px";
    tablist.style.width = size + "px";

    var threads = document.querySelectorAll('[data-testid="postsFeed-flatlist"]');

    for (var i = 0; i < threads.length; i++) {
        var thread = threads[i].querySelector('[style]');
        thread.style.maxWidth = size + "px";
    }
}

function handleHomeView() {
    const feedElem = document.querySelectorAll('[data-testid="followingFeedPage-feed-flatlist"], [data-testid="customFeedPage-feed-flatlist"]');
    if (!feedElem.length) {
        return;
    }

    var mainElem;

    // There's two feeds, Discovery and Following. We apply the same to each.
    for (var i = 0; i < feedElem.length; i++) {
        mainElem = feedElem[i].querySelector('[style]');

        setBaseWidthOnce(mainElem.offsetWidth);

        // Sidebars
        var [nav, searchElem] = findNavAndSearch();

        var shouldContinue = adjustSize(nav, searchElem);

        if (!shouldContinue) {
            return;
        }

        enlargeHomeView(targetSize, mainElem);

        positionNavAndSearch(mainElem, nav, searchElem);

    }

}

function enlargeHomeView(size, mainElem) {
    mainElem.style.maxWidth = size + "px";

    var frame = document.querySelectorAll('[class="css-g5y9jx r-1xcajam"]');
    frame = frame[frame.length - 1];
    frame.style.width = (size + 2) + "px"; // Add a small offset to look nice

    var tabs = document.querySelectorAll('[data-testid="homeScreenFeedTabs"]');
    tabs = tabs[tabs.length - 1];
    tabs.style.width = size + "px";
}

function handlePostView() {
    // Thread exists
    const feedElem = document.querySelectorAll('[data-testid="postThreadScreen"]');
    if (!feedElem.length) {
        return;
    }
    var mainElem = feedElem[0].children[1].querySelector('[style]');
    if (!mainElem) {
        return;
    }

    setBaseWidthOnce(mainElem.offsetWidth);

    // Sidebars
    var [nav, searchElem] = findNavAndSearch();

    var shouldContinue = adjustSize(nav, searchElem);
    if (!shouldContinue) {
        return;
    }

    enlargeIcons();
    enlargeThread(targetSize);

    positionNavAndSearch(mainElem, nav, searchElem);
}

function positionNavAndSearch(mainElem, nav, searchElem) {
    // Get position of main thread element. It's not always centered.
    var rect = mainElem.getBoundingClientRect();
    // If the main element isn't visible, don't do anything.
    if (!rect.left) {
        return;
    }

    if (nav && nav.style) {
        nav.style.transform = "";
        nav.style.left = (100 * (rect.left - nav.offsetWidth) / totalWidth) + "%";
    }

    if (searchElem && searchElem.style) {
        searchElem.style.transform = "";
        searchElem.style.left = (100 * (rect.right / totalWidth)) + "%";
    }
}

function adjustSize(nav, searchElem) {
    var navWidth = nav.offsetWidth;
    var searchWidth = searchElem.offsetWidth;

    var baseTotalWidth = BASE_WIDTH + navWidth + searchWidth;
    var requiredTotalWidth = targetSize + navWidth + searchWidth;

    if (totalWidth >= requiredTotalWidth) {
        // There's plenty of space, no need to adjust anything
    } else if (totalWidth > baseTotalWidth) {
        // There's more width than the default view, but not enough for the full scale. Partial scale it is.
        targetSize = totalWidth - (navWidth + searchWidth);
        actualScale = targetSize/BASE_WIDTH;
    } else {
        // Too small to adjust. Return.
        return false;
    }
    return true;
}

function findNavAndSearch() {
    // This class indicates a collapsed nav. If the class exists, it means the window is too small to be expanded. Reset the size to base.
    var nav = document.getElementsByClassName("r-1e50gmw");
    if (nav.length) {
        actualScale = 1;
        targetSize = BASE_WIDTH * actualScale;
    }
    // Otherwise, it means the nav is expanded, and we have more work to do.
    nav = document.querySelectorAll("nav")[0];

    // Search bar
    var searchElem = nav.nextElementSibling;
    return [nav, searchElem];
}

function setBaseWidthOnce(width) {
    if (!BASE_WIDTH) {
        BASE_WIDTH = width;
    }
    targetSize = BASE_WIDTH * actualScale;
}

function enlargeThread(size) {
    const mainElem = document.querySelectorAll('[data-testid="postThreadScreen"]');
    const threadScreen = mainElem[mainElem.length - 1];

    const frame = threadScreen.previousElementSibling;
    frame.style.width = (size + 2) + "px"; // Add a small offset to look nice

    const header = threadScreen.children[0];
    header.style.maxWidth = size + "px";

    const thread = threadScreen.children[1].querySelector('[style]');
    thread.style.maxWidth = size + "px";

}

/**
 * Resizes the users' profile icons, and all nearby elements that need it.
 */
function enlargeIcons() {
    var pfps = getIconsOtherThanNav()

    // Resize
    for (var i = 0; i < pfps.length; i++) {
        var iconDiv = pfps[i]

        resizeElem(iconDiv, ICON_SIZE);
        resizeElem(iconDiv.parentElement, ICON_SIZE);
        resizeElem(iconDiv.nextElementSibling, ICON_SIZE);

    }

    setTimeout(function() {
        if (!validate()) {
            enlargeIcons();
        }
    }, 600);
}

function getIconsOtherThanNav() {
    const rawPfps = document.querySelectorAll('[data-testid="userAvatarImage"]');
    var pfps = Array.from(rawPfps);

    // Filter out the nav icon
    for (var i = 0; i < pfps.length; i++) {
        var nav = pfps[i].closest("nav");
        if (nav) {
            pfps.splice(i, 1);
            break;
        }
    }
    return pfps;
}

/**
 * Changes the size of round elements such as profile pictures
 * @param Node elem
 * @param int size The pixel value to set the width/height
 */
function resizeElem(elem, size) {
    if (!elem) { return; }

    elem.style.width = size + "px";
    elem.style.height = size + "px";
    elem.style.borderRadius = size/2 + "px";
}

/**
 * Confirms the changes were applied, and if not, retries.
 * @returns True if the changes are ready.
 */
function validate() {
    var pfps = getIconsOtherThanNav();

    for (var i = 0; i < pfps.length; i++) {
        if (parseInt(pfps[i].style.width) != ICON_SIZE) {
            console.log("Failed to apply changes")
            console.log(pfps[i]);
            console.log(parseInt(pfps[i].style.width) + ":" + ICON_SIZE);
            return false;
        }
    }
    return true;
}

/**
 * Waits for the page to be ready to interact with
 * @param int timeout The amount of time to wait
 */
function initiate(timeout) {
    // Test
    var elem = getIconsOtherThanNav();
    if (elem.length > 0) {
        ready();
        return;
    }

    setTimeout(function() {
        initiate(2*timeout);
    }, timeout);
}

/**
 * Maintains new DOM elements in line with the changes.
 */
function driftCheck() {
    url = window.location.href;

    window.addEventListener('urlchange', () => {
        ready();
    });

    window.addEventListener('resize', function() {
        ready();
    });

    setInterval(function() {
        if(url != window.location.href) {
            url != window.location.href;
            ready();
        }
    }, 400);
}

initiate(20);
driftCheck();


})();