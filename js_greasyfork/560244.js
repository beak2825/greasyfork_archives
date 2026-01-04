// ==UserScript==
// @name         AO3 archive of our own Sort Fandoms by Size
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Sorts fandoms by number of works (largest first) on AO3 archive of our own fandom index pages
// @match        https://archiveofourown.org/media/*/fandoms
// @match        https://archiveofourown.org/media
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560244/AO3%20archive%20of%20our%20own%20Sort%20Fandoms%20by%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/560244/AO3%20archive%20of%20our%20own%20Sort%20Fandoms%20by%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Vind alle fandom lijsten op de pagina
    const fandomLists = document.querySelectorAll('ul.tags.index.group');

    if (fandomLists.length === 0) {
        console.log('AO3 Sorter: No fandom lists found');
        return;
    }

    // Verzamel alle fandoms uit alle lijsten
    let allFandoms = [];

    fandomLists.forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach(li => {
            // Extract het getal tussen haakjes, bv "(1234)"
            const text = li.textContent;
            const match = text.match(/\((\d[\d,]*)\)\s*$/);

            if (match) {
                // Verwijder komma's uit getallen zoals "1,234"
                const count = parseInt(match[1].replace(/,/g, ''), 10);
                allFandoms.push({
                    element: li,
                    count: count
                });
            }
        });
    });

    if (allFandoms.length === 0) {
        console.log('AO3 Sorter: No fandoms with counts found');
        return;
    }

    // Sorteer op aantal (hoogste eerst)
    allFandoms.sort((a, b) => b.count - a.count);

    // Maak een nieuwe container voor gesorteerde resultaten
    const container = document.createElement('div');
    container.id = 'sorted-fandoms';

    // Header toevoegen
    const header = document.createElement('h3');
    header.className = 'heading';
    header.textContent = 'All Fandoms (sorted by size: ' + allFandoms.length + ' total)';
    container.appendChild(header);

    // Nieuwe gesorteerde lijst
    const sortedList = document.createElement('ul');
    sortedList.className = 'tags index group';

    allFandoms.forEach(fandom => {
        // Clone het element zodat we het origineel intact laten
        const clone = fandom.element.cloneNode(true);
        sortedList.appendChild(clone);
    });

    container.appendChild(sortedList);

    // Vind de main content area en voeg gesorteerde lijst toe bovenaan
    const mainContent = document.querySelector('ol.alphabet.fandom.index.group');
    if (mainContent) {
        // Toggle knoppen toevoegen
        const toggleDiv = document.createElement('div');
        toggleDiv.style.cssText = 'margin: 1em 0; padding: 0.5em; background: #eee; border-radius: 5px;';

        const showSortedBtn = document.createElement('button');
        showSortedBtn.textContent = 'Show Sorted by Size';
        showSortedBtn.style.cssText = 'margin-right: 1em; padding: 0.5em 1em; cursor: pointer;';

        const showOriginalBtn = document.createElement('button');
        showOriginalBtn.textContent = 'Show Original (Alphabetical)';
        showOriginalBtn.style.cssText = 'margin-right: 1em; padding: 0.5em 1em; cursor: pointer;';

        const listViewBtn = document.createElement('button');
        listViewBtn.textContent = 'List View';
        listViewBtn.style.cssText = 'padding: 0.5em 1em; cursor: pointer;';

        let listViewEnabled = false;

        // Style voor list view
        const listViewStyle = document.createElement('style');
        listViewStyle.id = 'ao3-list-view-style';
        listViewStyle.textContent = `
            .ao3-list-view li {
                display: block !important;
                width: 100% !important;
                padding: 0.3em 0 !important;
                border-bottom: 1px solid #ddd;
            }
        `;

        showSortedBtn.addEventListener('click', () => {
            mainContent.style.display = 'none';
            container.style.display = 'block';
            showSortedBtn.disabled = true;
            showOriginalBtn.disabled = false;
        });

        showOriginalBtn.addEventListener('click', () => {
            mainContent.style.display = 'block';
            container.style.display = 'none';
            showSortedBtn.disabled = false;
            showOriginalBtn.disabled = true;
        });

        listViewBtn.addEventListener('click', () => {
            listViewEnabled = !listViewEnabled;
            if (listViewEnabled) {
                document.head.appendChild(listViewStyle);
                sortedList.classList.add('ao3-list-view');
                mainContent.querySelectorAll('ul.tags.index.group').forEach(ul => {
                    ul.classList.add('ao3-list-view');
                });
                listViewBtn.textContent = 'Grid View';
            } else {
                listViewStyle.remove();
                sortedList.classList.remove('ao3-list-view');
                mainContent.querySelectorAll('ul.tags.index.group').forEach(ul => {
                    ul.classList.remove('ao3-list-view');
                });
                listViewBtn.textContent = 'List View';
            }
        });

        toggleDiv.appendChild(showSortedBtn);
        toggleDiv.appendChild(showOriginalBtn);
        toggleDiv.appendChild(listViewBtn);

        // Voeg alles toe voor de originele lijst
        mainContent.parentNode.insertBefore(toggleDiv, mainContent);
        mainContent.parentNode.insertBefore(container, mainContent);

        // Start met gesorteerde weergave
        mainContent.style.display = 'none';
        showSortedBtn.disabled = true;
    }

    console.log('AO3 Sorter: Sorted ' + allFandoms.length + ' fandoms');
})();