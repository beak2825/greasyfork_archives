// ==UserScript==
// @name         R34 batch favoriter
// @namespace    http://tampermonkey.net/
// @version      2025-11-28
// @description  Mass favorites another user's favorites. Depends on this script: https://github.com/GoAwayNow/Rule34XXX-Enhanced-Favorites
// @author       jasper27
// @match        https://rule34.xxx/index.php?page=favorites&s=view&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557263/R34%20batch%20favoriter.user.js
// @updateURL https://update.greasyfork.org/scripts/557263/R34%20batch%20favoriter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -- page helpers -- //

    function getPid() {
        const url = new URL(window.location.href);
        const val = url.searchParams.get('pid');
        return val !== null ? Number(val) : null;
    }

    function setPid(pid) {
        const url = new URL(window.location.href);
        url.searchParams.set('pid', pid);
        window.location.href = url.toString();
    }

    function getPage() {
        const pid = getPid();
        if (pid === null) {
            return 0;
        } else {
            return Math.floor(pid / 50);
        }
    }

    function setPage(page) {
        setPid(page * 50);
    }

    // -- storage helpers -- //

    const KEY_PREFIX = "R34_BATCH_FAVORITER_";

    function sessionSet(key, value) {
        sessionStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    }

    function sessionGet(key, fallback = null) {
        const value = sessionStorage.getItem(KEY_PREFIX + key);
        if (value !== null) return JSON.parse(value);

        if (fallback !== null) sessionSet(key, fallback);
        return fallback;
    }

    function sessionRemove(key) {
        sessionStorage.removeItem(KEY_PREFIX + key);
    }

    function localSet(key, value) {
        localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    }

    function localGet(key, fallback = null) {
        const value = localStorage.getItem(KEY_PREFIX + key);
        if (value !== null) return JSON.parse(value);

        if (fallback !== null) localSet(key, fallback);
        return fallback;
    }

    function localRemove(key) {
        localStorage.removeItem(KEY_PREFIX + key);
    }

    // -- core logic -- //

    const TAB_ID = sessionGet('tabID', crypto.randomUUID());
    const FAVORITE_INTERVAL = 1000; // ms

    const currentPage = getPage();
    const toggleButton = createToggleButton();
    let favoriteLoopTimeout = null;

    function isTabActive() {
        return localGet('activeTabID') === TAB_ID;
    }

    function setTabActive() {
        localSet('activeTabID', TAB_ID);
    }

    function getFavoriteButtons() {
        return Array.from(document.querySelectorAll(".galFavBtn"))
            .filter(btn => getComputedStyle(btn).display !== "none") // filter out hidden buttons
            .filter(btn => btn.textContent.trim().toLowerCase().startsWith('add')) // filter out remove buttons
            .reverse(); // buttons should be pressed last to first to preserve order
    }

    function getNextFavoriteButton() {
        return getFavoriteButtons()[0];
    }

    function createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.textContent = "Loading..";
        toggleButton.style.background = "grey";
        toggleButton.style.color = "white";
        toggleButton.style.border = "none";
        toggleButton.style.padding = "10px 16px";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.borderRadius = "8px";

        toggleButton.style.position = "fixed";
        toggleButton.style.top = "12px";
        toggleButton.style.right = "12px";
        toggleButton.style.zIndex = "9999";

        toggleButton.addEventListener('click', onToggleButtonClicked);
        document.body.appendChild(toggleButton);

        return toggleButton;
    }

    function updateToggleButton() {
        if (isTabActive()) {
            toggleButton.style.background = "#d16319";
            toggleButton.textContent = "Stop favoriting";
        } else {
            toggleButton.style.background = "#2ab8db";
            toggleButton.textContent = "Start favoriting";
        }
    };

    function onToggleButtonClicked() {
        if (isTabActive()) {
            stopFavoriteLoop();
        } else {
            resumeFavoriteLoop();
        }
        updateToggleButton();
    }

    function gotoPrevPage() {
        if (currentPage === 0) {
            console.log("Finished first page, stopping");
            stopFavoriteLoop();
        } else {
            console.log("Finished page, going to previous page");
            sessionSet('switchingPages', true);
            setPage(currentPage - 1);
        }
    }

    function stopFavoriteLoop() {
        clearTimeout(favoriteLoopTimeout);
        if (isTabActive()) {
            localRemove('activeTabID');
        }
        favoriteLoopTimeout = null;
        updateToggleButton();
    }

    function resumeFavoriteLoop() {
        clearTimeout(favoriteLoopTimeout);
        setTabActive();
        favoriteLoopTimeout = setTimeout(stepFavoriteLoop, FAVORITE_INTERVAL);
    }

    function stepFavoriteLoop() {
        if (!isTabActive()) {
            stopFavoriteLoop();
            return;
        };

        updateToggleButton();
        const favButton = getNextFavoriteButton();
        if (favButton) {
            favButton.click();
            resumeFavoriteLoop();
        } else {
            gotoPrevPage();
        }
    }

    function onPageOpened() {
        updateToggleButton();
        if (isTabActive() && sessionGet('switchingPages') === true) {
            console.log('Resuming favorite loop');
            sessionRemove('switchingPages');
            resumeFavoriteLoop();
        } else {
            stopFavoriteLoop();
        }
    }

    onPageOpened();
})();