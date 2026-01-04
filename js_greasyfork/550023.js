// ==UserScript==
// @name         Webtoon Subscriptions Exporter
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Export Webtoons subscriptions list to CSV format
// @author       GooglyBlox
// @match        https://www.webtoons.com/*/favorite
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550023/Webtoon%20Subscriptions%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/550023/Webtoon%20Subscriptions%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCsv(webtoons) {
        const headers = ['Title', 'Author', 'Last Updated', 'URL', 'Title Number'];
        let csv = headers.join(',') + '\n';

        webtoons.forEach(webtoon => {
            const row = [
                `"${webtoon.title.replace(/"/g, '""')}"`,
                `"${webtoon.author.replace(/"/g, '""')}"`,
                `"${webtoon.lastUpdated.replace(/"/g, '""')}"`,
                `"${webtoon.url}"`,
                `"${webtoon.titleNo || ''}"`
            ];
            csv += row.join(',') + '\n';
        });

        return csv;
    }

    function scrapeWebtoons() {
        const webtoons = [];
        const items = document.querySelectorAll('.my_list .item');

        items.forEach(item => {
            const link = item.querySelector('.link');
            const titleElement = item.querySelector('.subj');
            const authorElement = item.querySelector('.author');
            const updateElement = item.querySelector('.update');
            const checkbox = item.querySelector('._inputCheck');

            if (titleElement && authorElement && link) {
                const webtoon = {
                    title: titleElement.textContent.trim(),
                    author: authorElement.textContent.trim(),
                    lastUpdated: updateElement ? updateElement.textContent.trim() : '',
                    url: link.href,
                    titleNo: checkbox ? checkbox.getAttribute('data-title-no') : ''
                };
                webtoons.push(webtoon);
            }
        });

        return webtoons;
    }

    function downloadCsv(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function addExportButton() {
        const controlsContainer = document.querySelector('.right._controllers');
        const editButton = document.querySelector('.edit._editBtn');

        if (!controlsContainer || !editButton) {
            return;
        }

        const exportButton = document.createElement('button');
        exportButton.type = 'button';
        exportButton.className = 'edit';
        exportButton.textContent = 'Export';

        exportButton.addEventListener('click', function() {
            const webtoons = scrapeWebtoons();

            if (webtoons.length === 0) {
                alert('No webtoons found to export.');
                return;
            }

            const csvContent = createCsv(webtoons);
            const filename = `webtoons_export_${new Date().toISOString().split('T')[0]}.csv`;
            downloadCsv(csvContent, filename);
        });

        controlsContainer.insertBefore(exportButton, editButton.nextSibling);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addExportButton);
        } else {
            addExportButton();
        }
    }

    init();
})();