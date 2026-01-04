// ==UserScript==
// @name         enhanced variantdb
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.2.4
// @description  Intelligente Filterfunktion mit UND/ODER-Logik, dynamische ID-Ausgabe, Sortierung und Buttons für mass-image, Artikel-Ersetzer und Vergleiche
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/variantdb*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/551220/enhanced%20variantdb.user.js
// @updateURL https://update.greasyfork.org/scripts/551220/enhanced%20variantdb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sortStates = new Map();

    function extractArticleId(linkHref) {
        const match = linkHref.match(/id=(\d+)/);
        return match ? match[1] : null;
    }

    function normalizeId(id) {
        return parseInt(id, 10).toString();
    }

    function getArticleData(table) {
        const rows = table.querySelectorAll('tbody > tr');
        const articles = [];

        rows.forEach((row) => {
            const tds = row.querySelectorAll('td');
            if (tds.length < 3) return;

            const checkbox = tds[1].querySelector('input[type="checkbox"]');
            const link = tds[2]?.querySelector('a[href*="kalif/artikel?id="]');
            const descriptionLink = tds[3]?.querySelector('a');

            if (link && checkbox && descriptionLink) {
                const id = extractArticleId(link.href);
                if (id) {
                    const description = descriptionLink.textContent || '';
                    if (!descriptionLink.hasAttribute('data-original-text')) {
                        descriptionLink.setAttribute('data-original-text', description);
                    }
                    articles.push({ id, checkbox, description, row, descriptionLink });
                }
            }
        });

        return articles;
    }

    function getVisibleArticleIds(articles) {
        const visibleArticles = articles.filter(article => article.row.style.display !== 'none');
        const checkedArticles = visibleArticles.filter(article => article.checkbox.checked);

        if (checkedArticles.length > 0) {
            return checkedArticles.map(a => normalizeId(a.id));
        }

        return visibleArticles.map(a => normalizeId(a.id));
    }

    function extractVariantId(table) {
        const variantBlock = table.closest('div.variantBlock');
        if (!variantBlock) return null;
        return variantBlock.getAttribute('data-variantid');
    }

    function parseSearchTerms(searchInput) {
        const terms = searchInput.trim().split(/\s+/);
        return terms.map(term => term.split('|').filter(t => t.length > 0));
    }

    function matchesSearch(text, searchTermGroups) {
        if (searchTermGroups.length === 0) return true;
        return searchTermGroups.every(group => {
            return group.some(term => text.includes(term));
        });
    }

    function highlightAllTerms(originalText, searchTermGroups) {
        if (searchTermGroups.length === 0) return originalText;
        const allTerms = searchTermGroups.flat();
        const sortedTerms = allTerms.sort((a, b) => b.length - a.length);
        const escapedTerms = sortedTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
        const highlightedHTML = originalText.replace(regex, '<mark style="background-color: #EF0FFF;">$1</mark>');
        return highlightedHTML;
    }

    function updateButtonCounts(copyButton, table) {
        const articles = getArticleData(table);
        const visibleIds = getVisibleArticleIds(articles);
        const count = visibleIds.length;

        const wrapper = copyButton.parentNode;
        const buttons = wrapper.querySelectorAll('button');
        buttons.forEach(btn => {
            const baseText = btn.getAttribute('data-button-text');
            if (baseText) {
                const allArticles = articles.length;
                if (count < allArticles && count > 0) {
                    btn.textContent = `${baseText} (${count})`;
                } else {
                    btn.textContent = baseText;
                }
            }
        });
    }

    function getSortState(table) {
        if (!sortStates.has(table)) {
            sortStates.set(table, { column: null, ascending: true });
        }
        return sortStates.get(table);
    }

    function sortTableByIds(table, ascending = true) {
        const articles = getArticleData(table);
        const visibleArticles = articles.filter(article => article.row.style.display !== 'none');

        visibleArticles.sort((a, b) => {
            const idA = parseInt(a.id, 10);
            const idB = parseInt(b.id, 10);
            return ascending ? idA - idB : idB - idA;
        });

        visibleArticles.forEach(article => {
            table.querySelector('tbody').appendChild(article.row);
        });
    }

    function sortTableByDescription(table, ascending = true) {
        const articles = getArticleData(table);
        const visibleArticles = articles.filter(article => article.row.style.display !== 'none');

        visibleArticles.sort((a, b) => {
            const descA = a.description.toLowerCase();
            const descB = b.description.toLowerCase();
            return ascending ? descA.localeCompare(descB) : descB.localeCompare(descA);
        });

        visibleArticles.forEach(article => {
            table.querySelector('tbody').appendChild(article.row);
        });
    }

    function updateSortButtons(table, masterCheckboxContainer) {
        const state = getSortState(table);
        const idButton = masterCheckboxContainer.querySelector('[data-sort-ids]');
        const descButton = masterCheckboxContainer.querySelector('[data-sort-desc]');

        if (idButton) {
            const arrow = (state.column === 'id' && !state.ascending) ? '↓' : '↑';
            idButton.textContent = `IDs ${arrow}`;
        }

        if (descButton) {
            const arrow = (state.column === 'desc' && !state.ascending) ? '↓' : '↑';
            descButton.textContent = `Bezeichnung ${arrow}`;
        }
    }

    function setupMasterCheckbox(table) {
        const rows = table.querySelectorAll('tbody > tr');
        if (rows.length === 0) return;

        const firstRow = rows[0];
        const firstCell = firstRow.querySelector('td:first-child');
        if (firstCell) {
            firstCell.textContent = '';
        }

        let masterCheckboxContainer = table.previousElementSibling;
        if (!masterCheckboxContainer || !masterCheckboxContainer.hasAttribute('data-master-checkbox-container')) {
            masterCheckboxContainer = document.createElement('div');
            masterCheckboxContainer.setAttribute('data-master-checkbox-container', 'true');
            masterCheckboxContainer.style.marginBottom = '5px';
            masterCheckboxContainer.style.display = 'flex';
            masterCheckboxContainer.style.gap = '10px';
            masterCheckboxContainer.style.alignItems = 'center';
            masterCheckboxContainer.style.justifyContent = 'flex-start';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.setAttribute('data-master-checkbox', 'true');
            checkbox.style.marginLeft = '22px';
            checkbox.style.width = '16px';
            checkbox.style.height = '16px';
            checkbox.style.cursor = 'pointer';
            checkbox.style.accentColor = '#0d6efd';

            // Sort Buttons
            const idSortButton = document.createElement('button');
            idSortButton.setAttribute('data-sort-ids', 'true');
            idSortButton.textContent = 'IDs ↑';
            idSortButton.style.padding = '4px 8px';
            idSortButton.style.fontSize = '12px';
            idSortButton.style.cursor = 'pointer';
            idSortButton.style.border = '1px solid #ccc';
            idSortButton.style.borderRadius = '3px';
            idSortButton.style.backgroundColor = '#f5f5f5';
            idSortButton.style.marginTop = '4px';

            const descSortButton = document.createElement('button');
            descSortButton.setAttribute('data-sort-desc', 'true');
            descSortButton.textContent = 'Bezeichnung ↑';
            descSortButton.style.padding = '4px 8px';
            descSortButton.style.fontSize = '12px';
            descSortButton.style.cursor = 'pointer';
            descSortButton.style.border = '1px solid #ccc';
            descSortButton.style.borderRadius = '3px';
            descSortButton.style.backgroundColor = '#f5f5f5';
            descSortButton.style.marginLeft = '45px';
            descSortButton.style.marginTop = '4px';

            // ID Sort Button Click Handler
            idSortButton.addEventListener('click', function(e) {
                e.preventDefault();
                const state = getSortState(table);

                if (state.column === 'id') {
                    state.ascending = !state.ascending;
                } else {
                    state.column = 'id';
                    state.ascending = true;
                }

                sortTableByIds(table, state.ascending);
                updateSortButtons(table, masterCheckboxContainer);
            });

            // Description Sort Button Click Handler
            descSortButton.addEventListener('click', function(e) {
                e.preventDefault();
                const state = getSortState(table);

                if (state.column === 'desc') {
                    state.ascending = !state.ascending;
                } else {
                    state.column = 'desc';
                    state.ascending = true;
                }

                sortTableByDescription(table, state.ascending);
                updateSortButtons(table, masterCheckboxContainer);
            });

            masterCheckboxContainer.appendChild(checkbox);
            masterCheckboxContainer.appendChild(idSortButton);
            masterCheckboxContainer.appendChild(descSortButton);

            table.parentNode.insertBefore(masterCheckboxContainer, table);

            // Master-Checkbox Event-Listener
            checkbox.addEventListener('change', function() {
                const shouldCheck = this.checked;

                rows.forEach((row) => {
                    const rowCheckbox = row.querySelector('td:nth-child(2) input[type="checkbox"]');
                    if (rowCheckbox) {
                        if (row.style.display !== 'none') {
                            rowCheckbox.checked = shouldCheck;
                        } else {
                            rowCheckbox.checked = false;
                        }
                    }
                });

                setTimeout(() => {
                    rows.forEach((row) => {
                        const rowCheckbox = row.querySelector('td:nth-child(2) input[type="checkbox"]');
                        if (rowCheckbox && row.style.display === 'none' && rowCheckbox.checked) {
                            rowCheckbox.checked = false;
                        }
                    });
                }, 0);

                const copyButton = table.closest('td').querySelector('button.ms-2');
                if (copyButton) {
                    updateButtonCounts(copyButton, table);
                }
            }, true);
        }
    }

    function addFilterField(table) {
        const variantBodyTable = table.closest('table.variantBodyTable');
        if (!variantBodyTable) return;

        const successTd = variantBodyTable.querySelector('td.bg-success-subtle');
        if (!successTd) return;

        let filterContainer = successTd.querySelector('[data-article-filter-container]');

        if (!filterContainer) {
            filterContainer = document.createElement('div');
            filterContainer.setAttribute('data-article-filter-container', 'true');
            filterContainer.style.padding = '10px';

            const label = document.createElement('label');
            label.textContent = 'Filter Artikelbezeichnung: ';
            label.style.marginRight = '5px';
            label.style.fontWeight = 'bold';

            const input = document.createElement('input');
            input.type = 'text';
            input.setAttribute('data-article-filter-input', 'true');
            input.placeholder = 'z.B.: 64gb grau oder grau|schwarz 512gb';
            input.style.width = '300px';
            input.style.padding = '5px';

            filterContainer.appendChild(label);
            filterContainer.appendChild(input);
            successTd.appendChild(filterContainer);

            input.addEventListener('input', function() {
                const filterValue = this.value.toLowerCase();
                const articles = getArticleData(table);
                const searchTermGroups = parseSearchTerms(filterValue);

                articles.forEach(article => {
                    const description = article.description.toLowerCase();

                    if (filterValue === '' || matchesSearch(description, searchTermGroups)) {
                        article.row.style.display = '';

                        if (filterValue !== '') {
                            const originalText = article.descriptionLink.getAttribute('data-original-text');
                            const highlightedHTML = highlightAllTerms(originalText, searchTermGroups);
                            article.descriptionLink.innerHTML = highlightedHTML;
                        } else {
                            const originalText = article.descriptionLink.getAttribute('data-original-text');
                            article.descriptionLink.textContent = originalText;
                        }
                    } else {
                        article.row.style.display = 'none';
                    }
                });

                const productTableParentTd = table.closest('td.productTableParent');
                if (productTableParentTd) {
                    const copyButton = productTableParentTd.querySelector('button.ms-2');
                    if (copyButton) {
                        updateButtonCounts(copyButton, table);
                    }
                }
            });
        }

        setupMasterCheckbox(table);
    }

    function createButtons(copyButton, table) {
        const articles = getArticleData(table);

        // Copy IDs Handler
        copyButton.addEventListener('click', function(e) {
            e.preventDefault();
            const idsToCopy = getVisibleArticleIds(articles);
            if (idsToCopy.length === 0) {
                alert('Es muss mindestens ein Artikel ausgewählt sein.');
                return;
            }
            const idsText = idsToCopy.join(',');
            navigator.clipboard.writeText(idsText).then(() => {
                alert(`${idsToCopy.length} IDs kopiert`);
            }).catch(err => {
                console.error('Copy failed:', err);
            });
        });

        // mass-image Button
        const massImageButton = document.createElement('button');
        massImageButton.textContent = 'mass-image';
        massImageButton.className = 'ms-2';
        massImageButton.setAttribute('data-button-text', 'mass-image');
        massImageButton.style.width = '160px';
        massImageButton.style.whiteSpace = 'nowrap';
        massImageButton.addEventListener('click', function(e) {
            e.preventDefault();
            const ids = getVisibleArticleIds(articles);
            if (ids.length === 0) {
                alert('Es muss mindestens ein Artikel ausgewählt sein.');
                return;
            }
            const url = 'https://opus.geizhals.at/kalif/artikel/mass-image#' + ids.map(id => `id=${id}`).join('&');
            window.open(url, '_blank');
        });
        copyButton.parentNode.insertBefore(massImageButton, copyButton.nextSibling);

        // Artikel-Ersetzer Button
        const replacerButton = document.createElement('button');
        replacerButton.textContent = 'Artikel-Ersetzer';
        replacerButton.className = 'ms-2';
        replacerButton.setAttribute('data-button-text', 'Artikel-Ersetzer');
        replacerButton.style.width = '160px';
        replacerButton.style.whiteSpace = 'nowrap';
        replacerButton.addEventListener('click', function(e) {
            e.preventDefault();
            const ids = getVisibleArticleIds(articles);
            if (ids.length === 0) {
                alert('Es muss mindestens ein Artikel ausgewählt sein.');
                return;
            }
            const url = 'https://opus.geizhals.at/kalif/artikel/ersetzer#' + ids.join(',');
            window.open(url, '_blank');
        });
        copyButton.parentNode.insertBefore(replacerButton, massImageButton.nextSibling);

        // Vergleichen PV Button
        const pvButton = document.createElement('button');
        pvButton.textContent = 'Vergleichen PV';
        pvButton.className = 'ms-2';
        pvButton.setAttribute('data-button-text', 'Vergleichen PV');
        pvButton.style.width = '160px';
        pvButton.style.whiteSpace = 'nowrap';
        pvButton.addEventListener('click', function(e) {
            e.preventDefault();
            const ids = getVisibleArticleIds(articles);
            if (ids.length === 1) {
                alert('Nur ein Artikel ausgewählt');
                return;
            }
            if (ids.length === 0) {
                alert('Es muss mindestens ein Artikel ausgewählt sein.');
                return;
            }
            if (ids.length > 12) {
                alert('Es können maximal 12 Artikel verglichen werden.');
                return;
            }
            const url = 'https://geizhals.eu/?' + ids.map(id => `cmp=${id}`).join('&') + '&active=1';
            window.open(url, '_blank');
        });
        copyButton.parentNode.insertBefore(pvButton, replacerButton.nextSibling);

        // Vergleichen Kalif Button
        const kalifButton = document.createElement('button');
        kalifButton.textContent = 'Vergleichen Kalif';
        kalifButton.className = 'ms-2';
        kalifButton.setAttribute('data-button-text', 'Vergleichen Kalif');
        kalifButton.style.width = '160px';
        kalifButton.style.whiteSpace = 'nowrap';
        kalifButton.addEventListener('click', function(e) {
            e.preventDefault();
            const ids = getVisibleArticleIds(articles);
            if (ids.length === 1) {
                alert('Nur ein Artikel ausgewählt');
                return;
            }
            if (ids.length === 0) {
                alert('Es muss mindestens ein Artikel ausgewählt sein.');
                return;
            }
            if (ids.length > 12) {
                alert('Es können maximal 12 Artikel verglichen werden.');
                return;
            }
            const primaryId = ids[0];
            const url = 'https://opus.geizhals.at/kalif/artikel/diff#' + ids.map(id => `id=${id}`).join('&') + `&primary=${primaryId}`;
            window.open(url, '_blank');
        });
        copyButton.parentNode.insertBefore(kalifButton, pvButton.nextSibling);

        // such.pl Button
        const suchButton = document.createElement('button');
        suchButton.textContent = 'such.pl';
        suchButton.className = 'ms-2';
        suchButton.setAttribute('data-button-text', 'such.pl');
        suchButton.style.width = '160px';
        suchButton.style.whiteSpace = 'nowrap';
        suchButton.addEventListener('click', function(e) {
            e.preventDefault();
            const ids = getVisibleArticleIds(articles);
            if (ids.length === 0) {
                alert('Es muss mindestens ein Artikel ausgewählt sein.');
                return;
            }
            const variantId = extractVariantId(table);
            if (!variantId) {
                alert('Varianten-ID konnte nicht ermittelt werden.');
                return;
            }
            const url = 'https://opus.geizhals.at/pv-edit/such.pl?syntax=varianten_id%3D' + variantId + '&ids=' + ids.join(',');
            window.open(url, '_blank');
        });
        copyButton.parentNode.insertBefore(suchButton, kalifButton.nextSibling);

        // Update button counts
        updateButtonCounts(copyButton, table);

        // Add change listener to article checkboxes
        articles.forEach(article => {
            article.checkbox.addEventListener('change', function() {
                updateButtonCounts(copyButton, table);
            });
        });
    }

    function initButtons() {
        const allMs2Buttons = document.querySelectorAll('button.ms-2');
        const copyButtons = Array.from(allMs2Buttons).filter(btn =>
            btn.textContent.includes('alle Artikel IDs kopieren')
        );

        copyButtons.forEach((copyButton) => {
            if (copyButton.hasAttribute('data-variant-enhanced')) {
                return;
            }

            const artikelListWrapper = copyButton.closest('.artikelListRemoveWrapper');
            if (!artikelListWrapper) return;

            const parentTd = artikelListWrapper.closest('td');
            if (!parentTd) return;

            const table = parentTd.querySelector('table.variantProductTable');
            if (!table) return;

            copyButton.setAttribute('data-variant-enhanced', 'true');
            copyButton.setAttribute('data-button-text', copyButton.textContent);
            copyButton.style.width = '220px';
            copyButton.style.whiteSpace = 'nowrap';

            addFilterField(table);
            createButtons(copyButton, table);
        });
    }

    // Starte initButtons beim Laden
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initButtons);
    } else {
        setTimeout(initButtons, 1000);
    }

    // MutationObserver für dynamisch hinzugefügte Tabellen
    const observer = new MutationObserver((mutations) => {
        let hasNewTables = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const newTables = mutation.addedNodes;
                newTables.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('variantProductTable')) {
                            hasNewTables = true;
                        }
                        if (node.querySelector && node.querySelector('table.variantProductTable')) {
                            hasNewTables = true;
                        }
                    }
                });
            }
        });

        if (hasNewTables) {
            setTimeout(initButtons, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();