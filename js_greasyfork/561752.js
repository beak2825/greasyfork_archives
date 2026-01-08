// ==UserScript==
// @name         MAL Friends Entries Inline
// @namespace    https://greasyfork.org/users/bruuhim
// @version      1.0.0
// @author       bruuhim
// @description  Show the "My Friends" entries block from the stats page directly above the Reviews section on anime/manga pages.
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @exclude      https://myanimelist.net/anime/*/stats*
// @exclude      https://myanimelist.net/manga/*/stats*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561752/MAL%20Friends%20Entries%20Inline.user.js
// @updateURL https://update.greasyfork.org/scripts/561752/MAL%20Friends%20Entries%20Inline.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findReviewsHeader() {
        var headers = document.querySelectorAll('h2');
        for (var i = 0; i < headers.length; i++) {
            var text = headers[i].textContent.trim().toLowerCase();
            if (text.indexOf('reviews') !== -1) return headers[i];
        }
        return null;
    }

    var reviewsHeader = findReviewsHeader();
    if (!reviewsHeader) return;

    var baseUrl = window.location.href.split('?')[0];
    var statsUrl = baseUrl.replace(/\/?$/, '/stats');

    fetch(statsUrl, { credentials: 'include' })
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
        })
        .then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');

            var membersAnchor = doc.querySelector('a[name="members"]');
            if (!membersAnchor) return;

            var outer = document.createElement('div');
            outer.id = 'mal-friends-entries-wrapper';

            var inner = document.createElement('div');
            inner.className = 'mal-friends-entries-inner';

            // "Recently Updated By" anchor
            inner.appendChild(document.importNode(membersAnchor, true));

            var sibling = membersAnchor.nextElementSibling;
            var hasTable = false;

            while (sibling) {
                // Stop before unrelated sections
                if (sibling.tagName === 'H2') break;
                if (
                    sibling.tagName === 'BR' &&
                    sibling.nextElementSibling &&
                    sibling.nextElementSibling.tagName === 'H2'
                ) break;

                var clone = document.importNode(sibling, true);

                if (clone.tagName === 'TABLE') {
                    hasTable = true;
                    clone.classList.add('mal-friends-table');
                }

                inner.appendChild(clone);
                sibling = sibling.nextElementSibling;
            }

            outer.appendChild(inner);
            addStyles();

            if (!hasTable) {
                var msg = document.createElement('div');
                msg.className = 'mal-friends-noentries';
                msg.textContent = 'No users found with this Anime/Manga in their list.';
                reviewsHeader.parentNode.insertBefore(msg, reviewsHeader);
                return;
            }

            reviewsHeader.parentNode.insertBefore(outer, reviewsHeader);
        })
        .catch(function (err) {
            console.error('[MAL Friends Entries Inline]', err);
        });

    function addStyles() {
        if (document.getElementById('mal-friends-entries-style')) return;

        var style = document.createElement('style');
        style.id = 'mal-friends-entries-style';
        style.textContent = [
            '#mal-friends-entries-wrapper {',
            '  margin: 18px 0 26px 0;',
            '}',
            '',
            '#mal-friends-entries-wrapper .mal-friends-entries-inner {',
            '  border-radius: 12px;',
            '  padding: 10px 12px 6px 12px;',
            '  background-color: inherit;',
            '  border: 1px solid rgba(0, 0, 0, 0.08);',
            '}',
            '',
            '#mal-friends-entries-wrapper table.mal-friends-table {',
            '  width: 100%;',
            '  margin: 6px 0 2px 0;',
            '  border-collapse: collapse;',
            '}',
            '',
            '#mal-friends-entries-wrapper table.mal-friends-table th,',
            '#mal-friends-entries-wrapper table.mal-friends-table td {',
            '  padding: 8px 10px;',
            '}',
            '',
            '#mal-friends-entries-wrapper table.mal-friends-table tr:first-child th:first-child {',
            '  border-top-left-radius: 10px;',
            '}',
            '#mal-friends-entries-wrapper table.mal-friends-table tr:first-child th:last-child {',
            '  border-top-right-radius: 10px;',
            '}',
            '#mal-friends-entries-wrapper table.mal-friends-table tr:last-child td:first-child {',
            '  border-bottom-left-radius: 10px;',
            '}',
            '#mal-friends-entries-wrapper table.mal-friends-table tr:last-child td:last-child {',
            '  border-bottom-right-radius: 10px;',
            '}',
            '',
            '#mal-friends-entries-wrapper .picSurround img {',
            '  width: 40px;',
            '  height: 40px;',
            '  object-fit: cover;',
            '  border-radius: 4px;',
            '}',
            '',
            '.mal-friends-noentries {',
            '  margin: 12px 0 18px 0;',
            '  padding: 9px 11px;',
            '  font-size: 13px;',
            '  border-radius: 8px;',
            '  background-color: rgba(0, 0, 0, 0.03);',
            '}',
            '',
            '@media (prefers-color-scheme: dark) {',
            '  #mal-friends-entries-wrapper .mal-friends-entries-inner {',
            '    border-color: rgba(255, 255, 255, 0.16);',
            '  }',
            '  .mal-friends-noentries {',
            '    background-color: rgba(255, 255, 255, 0.04);',
            '  }',
            '}'
        ].join('\n');

        document.head.appendChild(style);
    }
})();
