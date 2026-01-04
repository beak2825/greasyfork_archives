// ==UserScript==
// @name         mapgenie.io - offline mode
// @namespace    https://gitlab.com/srsbiz/userscripts
// @version      1.0.1
// @description  Store progress in localStorage
// @author       srsbiz
// @grant        none
// @match        https://mapgenie.io/*
// @icon         https://cdn.mapgenie.io/favicons/mapgenie/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553093/mapgenieio%20-%20offline%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/553093/mapgenieio%20-%20offline%20mode.meta.js
// ==/UserScript==

(function() {
    function offlineMode() {
        const urlPath = (new URL(window.location.href.toString())).pathname.substring(1);
        const table = document.querySelector('table.items-table');

        if (urlPath.lastIndexOf('/') == -1 || !table) {
            return;
        }

        // Use game name as mapId, so progress will be shared across all categories
        let mapId = urlPath.substring(0, urlPath.indexOf('/'));
        let mapProgress = JSON.parse(window.localStorage.getItem(mapId) || '{}');

        table.querySelectorAll('input.check').forEach(function(e) {
            // Clone node to remove existing event listeners
            let e1 = e.cloneNode(true),
                tr = e.parentNode.parentNode,
                id = (new URL(tr.querySelector('.location-link').href.toString())).searchParams.get('locationIds')
            ;
            e1.disabled = false;
            e1.removeAttribute('aria-label');
            e1.removeAttribute('data-balloon-pos');
            e1.checked = mapProgress[id] || false;
            if (e1.checked) {
                tr.classList.add('bg-secondary');
            }

            e.parentNode.replaceChild(e1, e);
            e1.addEventListener('change', function(evt) {
                let checked = evt.currentTarget.checked;
                evt.stopPropagation();
                mapProgress[id] = checked;
                window.localStorage.setItem(mapId, JSON.stringify(mapProgress));

                if (checked) {
                    tr.classList.add('bg-secondary');
                } else {
                    tr.classList.remove('bg-secondary');
                }
            });
        });
    }
    offlineMode();
})();
