// ==UserScript==
// @name         Saved search terms dropdown on submeta.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display previous searches on submeta.io in a dropdown with keyboard navigation and delete buttons
// @match        https://submeta.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=submeta.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551005/Saved%20search%20terms%20dropdown%20on%20submetaio.user.js
// @updateURL https://update.greasyfork.org/scripts/551005/Saved%20search%20terms%20dropdown%20on%20submetaio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function log(obj){
        return
        console.log(obj);
    }

    function isSearchField(input) {
        return (
            input.type === 'search' ||
            (input.name && input.name.toLowerCase().includes('search')) ||
            (input.id && input.id.toLowerCase().includes('search')) ||
            (input.placeholder && input.placeholder.toLowerCase().includes('search')) ||
            (input.getAttribute('role') && input.getAttribute('role').toLowerCase() === 'searchbox')
        );
    }

    function getKey() {
        return `savedSearchTerms_${location.hostname}`;
    }

    function getTerms() {
        return JSON.parse(localStorage.getItem(getKey()) || '[]');
    }

    function saveTerm(term) {
        let terms = getTerms();
        term = term.trim();
        if (term && !terms.includes(term)) {
            terms.unshift(term); // most recent first
            localStorage.setItem(getKey(), JSON.stringify(terms));
            log(`[${location.hostname}] saved:`, term);
        }
    }

    function hideList(list)
    {
        log('hiding list')
        list.style.display = 'none';
    }

    const list = document.createElement('div');

    let selectedIndex = -1;

    function showList(input, filtered) {
        log('showing list with ' + filtered.length);
        list.innerHTML = '';
        selectedIndex = -1;
        if (filtered.length === 0) {
            hideList(list)
            return;
        }
        filtered.forEach((t, i) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '4px 6px';
            item.style.cursor = 'pointer';
            item.dataset.index = i;

            const textSpan = document.createElement('span');
            textSpan.textContent = t;

            const cross = document.createElement('span');
            cross.textContent = '×';
            cross.style.marginLeft = '8px';
            cross.style.cursor = 'pointer';
            cross.style.color = '#f88';
            cross.style.fontSize = '22px'; // make it bigger
            cross.style.fontWeight = 'bold'; // optional, bolder
            cross.style.userSelect = 'none'; // prevent text selection on click


            // Delete on cross click
            cross.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent selecting the item
                let terms = getTerms();
                terms = terms.filter(term => term !== t);
                localStorage.setItem(getKey(), JSON.stringify(terms));
                showList(input, getTerms().filter(term => term.toLowerCase().includes(input.value.toLowerCase())));
                input.focus();
            });

            item.appendChild(textSpan);
            item.appendChild(cross);

            // existing mouse events for selecting/highlighting
            item.addEventListener('click', () => {
                input.value = t;
                hideList(list)
                triggerInputEvent(input);
            });
            item.addEventListener('mouseover', () => {
                selectedIndex = i;
                updateHighlight();
            });
            item.addEventListener('mouseout', () => {
                selectedIndex = -1;
                updateHighlight();
            });

            list.appendChild(item);
        });

        list.style.left = input.offsetLeft + 'px';
        list.style.top = (input.offsetTop + input.offsetHeight) + 'px';
        list.style.width = input.offsetWidth + 'px';
        list.style.display = 'block';
    }

    function triggerInputEvent(el) {
        const event = new Event('input', { bubbles: true, cancelable: true });
        el.dispatchEvent(event);
    }

    function updateHighlight() {
        Array.from(list.children).forEach((child, i) => {
            child.style.background = i === selectedIndex ? '#444' : '#222';
        });
    }

    function createAutocomplete(input) {
        log('creating autocomplete')
        list.style.position = 'absolute';
        list.style.border = '1px solid #444';
        list.style.background = '#222';
        list.style.color = '#eee';
        list.style.zIndex = 9999;
        list.style.display = 'none';
        list.style.maxHeight = '200px';
        list.style.overflowY = 'auto';
        list.style.fontSize = '14px';
        list.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';
        list.style.borderRadius = '4px';

        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(list);

        input.addEventListener('input', () => {
            const val = input.value.toLowerCase();
            const terms = getTerms();
            const filtered = terms.filter(t => t.toLowerCase().includes(val));
            showList(input, filtered);
        });

        input.addEventListener('focus', () => {
            log('focus gained');
            const val = input.value.toLowerCase();
            const terms = getTerms();
            const filtered = terms.filter(t => t.toLowerCase().includes(val));
            showList(input, filtered);
        });

        input.addEventListener('keydown', (e) => {
            const items = list.children;
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateHighlight();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateHighlight();
            } else if (e.key === 'Enter') {
                if (selectedIndex >= 0 && selectedIndex < items.length) {
                    input.value = items[selectedIndex].textContent;
                    hideList(list)
                    selectedIndex = -1;
                }
            } else if (e.key === 'Escape') {
                hideList(list)
                selectedIndex = -1;
            }

            if (e.key != 'Escape' && list.style.display === 'none') {
                const val = input.value.toLowerCase();
                const terms = getTerms();
                const filtered = terms.filter(t => t.toLowerCase().includes(val));
                showList(input, filtered);
            }
        });

        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (document.activeElement != input) {
                    hideList(list)
                }
            }, 200);
            saveTerm(input.value);
        });
    }

    function isVisible(el) {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            el.offsetWidth > 0 &&
            el.offsetHeight > 0;
    }

    function isVisibleRecursively(el) {
        if (!el) return false; // reached root without finding a visible ancestor
        if (!isVisible(el)) return false; // current element is hidden
        if (!el.parentElement) return true; // reached document root
        return isVisibleRecursively(el.parentElement); // check parent
    }

    let initialised = false;

    function initInputs() {
        const inputs = document.querySelectorAll('input:not([type=checkbox])');
        log('found ' + inputs.length + ' input elements')
        for (var input of inputs) {
            if (isSearchField(input) && !input.dataset.autocompleteAttached) {
                createAutocomplete(input);
                input.dataset.autocompleteAttached = 'true';

                if (isVisibleRecursively(input))
                {
                    log('creating autocomplete list')
                }
                else {
                    log('creating autocomplete and displaying search field')
                    const p = Array.from(document.querySelectorAll('p'))
                    .find(el => el.textContent === 'Search');
                    if (p) {
                        p.click()
                        initialised = true;
                        //observer.disconnect();
                    }
                }
                if (isSearchField(input)) {
                    if (document.activeElement === input) {
                        showList(input, getTerms());
                    }
                }
            }
        }

    }

    // Initial run
    initInputs();

    // Observe dynamically added inputs
    const observer = new MutationObserver(() => initInputs());
    observer.observe(document.body, { childList: true, subtree: true });
})();
