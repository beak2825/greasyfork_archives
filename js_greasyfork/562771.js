// ==UserScript==
// @name         Jaeger Trace Helper
// @namespace    https://greasyfork.org/users/
// @version      1.8
// @description  Helper script for Jaeger traces
// @author       -
// @include      /^https?:\/\/.*jaeger.*\/(trace|search).*$/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562771/Jaeger%20Trace%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562771/Jaeger%20Trace%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for jQuery to be available
    function waitForJQuery(callback) {
        const jq = window.jQuery || window.$;
        if (jq) {
            if (typeof $ === 'undefined') window.$ = jq;
            callback();
        } else {
            setTimeout(() => waitForJQuery(callback), 100);
        }
    }

    // Function to collapse AuthInfoQuery spans
    function collapseAuthInfoQueries() {
        const targets = [
            "QueryBus.queryDistributed(AuthInfoQuery)",
            "QueryBus.queryDistributed(CustomerAuthorizationAuthInfoQuery)"
        ];

        $(".endpoint-name")
            .filter(function() { return targets.includes($(this).text().trim()); })
            .each(function() {
                const wrapper = $(this).closest('.span-name-wrapper');
                // Only click if not already collapsed
                if (!wrapper.find('.span-svc-name').hasClass('is-children-collapsed')) {
                    wrapper.find('.SpanTreeOffset.is-parent').click();
                }
            });
    }

    // Function to add button to menu
    function addCollapseButton() {
        const menu = $('ul.ant-menu-horizontal.ant-menu-dark');
        const existingBtn = $('#collapse-authinfo-btn');

        if (menu.length === 0 || existingBtn.length > 0) {
            return existingBtn.length > 0;
        }

        $('<li>', {
            class: 'ant-menu-overflow-item ant-menu-item ant-menu-item-only-child',
            role: 'menuitem',
            tabindex: '-1',
            style: 'opacity: 1;',
            id: 'collapse-authinfo-btn',
            html: $('<span>', { class: 'ant-menu-title-content' })
                .append($('<a>', {
                    href: '#',
                    text: 'Collapse AuthInfo',
                    style: 'cursor: pointer;',
                    click: (e) => { e.preventDefault(); collapseAuthInfoQueries(); }
                }))
        }).appendTo(menu);

        return true;
    }

    // Initialize the script
    waitForJQuery(() => {
        // Try to add button immediately
        addCollapseButton();

        // Keep watching for DOM changes to re-add button if removed (SPA navigation)
        new MutationObserver(() => addCollapseButton())
            .observe(document.body, { childList: true, subtree: true });
    });
})();

