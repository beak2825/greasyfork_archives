// ==UserScript==
// @name         Twitch Theater Sidebar Reveal
// @name:ja      Twitch シアターモード サイドバー表示
// @namespace    https://greasyfork.org/users/1564283
// @version      1.3.0
// @description  Show sidebar by hovering the left edge in theater mode.
// @description:ja  シアターモード時、マウスを左端に移動するとサイドバーを表示します。
// @author       homma
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563993/Twitch%20Theater%20Sidebar%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/563993/Twitch%20Theater%20Sidebar%20Reveal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG path definition (constant as it may change with Twitch updates)
    const ENTER_THEATER_PATH = 'M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Zm14 0h4v14h-4V5Zm-2 0H4v14h10V5Z';
    const EDGE_THRESHOLD = 50;

    let cachedSidebar = null;

    function isTheaterMode() {
        return !document.querySelector(`path[d="${ENTER_THEATER_PATH}"]`);
    }

    function getSidebar() {
        if (!cachedSidebar || !document.body.contains(cachedSidebar)) {
            cachedSidebar = document.querySelector('[data-test-selector="side-nav"]');
        }
        return cachedSidebar;
    }

    // Handle sidebar visibility styles
    function setSidebarVisibility(show) {
        const sidebar = getSidebar();
        if (!sidebar) return;

        if (show) {
            // Do nothing if already applied (minimize DOM manipulation)
            if (sidebar.style.position !== 'relative') {
                sidebar.style.position = 'relative';
                sidebar.style.zIndex = '10000';
            }
        } else {
            if (sidebar.style.position === 'relative') {
                sidebar.style.position = '';
                sidebar.style.zIndex = '';
            }
        }
    }

    function onMouseMove(e) {
        // Reset and exit if not in theater mode
        if (!isTheaterMode()) {
            setSidebarVisibility(false);
            return;
        }

        const sidebar = getSidebar();

        // 1. Check if mouse is near the left edge
        const inLeftEdge = e.clientX < EDGE_THRESHOLD;

        // 2. Check if mouse is hovering over the sidebar (to keep it open)
        const isHoveringSidebar = sidebar && sidebar.contains(e.target);

        const onPlayerControls = e.target.closest('[data-a-target="player-controls"]');

        // Show if (at left edge OR hovering sidebar) AND not interacting with player controls
        const shouldShow = (inLeftEdge || isHoveringSidebar) && !onPlayerControls;

        setSidebarVisibility(shouldShow);
    }

    function onMouseLeave() {
        setSidebarVisibility(false);
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
})();
