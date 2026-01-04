// ==UserScript==
// @name         Prolific Sidebar Toggle
// @version      1.1
// @description  Toggle the sidebar visibility
// @author       Lintilla
// @match        https://app.prolific.com/studies
// @grant        none
// @run-at       document-idle
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/558368/Prolific%20Sidebar%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/558368/Prolific%20Sidebar%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'sidebar-hidden';

    function setSidebarState(hidden) {
        const sidebar = document.querySelector('.projects-sidebar');
        if (!sidebar) return;
        sidebar.style.display = hidden ? 'none' : 'block';
        localStorage.setItem(STORAGE_KEY, hidden ? '1' : '0');
    }

    function getSidebarState() {
        return localStorage.getItem(STORAGE_KEY) === '1';
    }

    function applySidebarState() {
        const sidebar = document.querySelector('.projects-sidebar');
        if (!sidebar) return;
        sidebar.style.display = getSidebarState() ? 'none' : 'block';
    }

    function addSidebarToggle() {
        const messagesLink = document.querySelector('a[data-testid="messages-link"]');
        if (!messagesLink) return;
        if (document.getElementById('sidebar-toggle-link')) return;

        const toggleLink = document.createElement('a');
        toggleLink.href = "#";
        toggleLink.id = "sidebar-toggle-link";
        toggleLink.className = "nav-link";

        function updateToggleText() {
            toggleLink.textContent = getSidebarState() ? "Show Sidebar" : "Hide Sidebar";
        }

        toggleLink.addEventListener('click', function(e) {
            e.preventDefault();
            const hidden = !getSidebarState();
            setSidebarState(hidden);
            updateToggleText();
            applySidebarState();
        });

        applySidebarState();
        updateToggleText();

        messagesLink.parentNode.insertBefore(toggleLink, messagesLink.nextSibling);
    }

    addSidebarToggle();
    const observer = new MutationObserver(() => {
        addSidebarToggle();
        applySidebarState();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();