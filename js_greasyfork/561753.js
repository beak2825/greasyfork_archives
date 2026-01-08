// ==UserScript==
// @name         Tooltip on Allowed Gear Types
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Franciscos1905
// @description  Adds a tooltip on hover to the allowed gear types. Needs this to work: https://userstyles.world/style/25919/mid-2016-game-page-roblox
// @match        https://www.roblox.com/games/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561753/Tooltip%20on%20Allowed%20Gear%20Types.user.js
// @updateURL https://update.greasyfork.org/scripts/561753/Tooltip%20on%20Allowed%20Gear%20Types.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOOLTIP_TEXT = 'No Gear Allowed';

    function applyTooltip() {
        const target = document.querySelector(
            'li.game-stat:nth-of-type(1) .font-caption-body.text-lead'
        );

        if (!target) return;
        if (target.dataset.tooltipApplied) return;

        target.setAttribute('data-toggle', 'tooltip');
        target.setAttribute('title', TOOLTIP_TEXT);
        target.dataset.tooltipApplied = 'true';

        if (typeof $ === 'function' && typeof $.fn.tooltip === 'function') {
            $(target).tooltip({
                container: 'body',
                placement: 'bottom'
            });
        }
    }

    const observer = new MutationObserver(applyTooltip);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    applyTooltip();
})();
