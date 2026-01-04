// ==UserScript==
// @name         Youtube Autocomplete commands
// @namespace    http://tampermonkey.net/
// @version      1.96
// @description  Robust autocomplete in YouTube live chat with mode change handling, keyboard navigation, caching, no logs. Fixed Enter autocomplete.
// @author       ChatGPT (fixed)
// @match        https://www.youtube.com/live_chat*
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      docs.google.com
// @connect      docs.googleusercontent.com
// @connect      *.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551304/Youtube%20Autocomplete%20commands.user.js
// @updateURL https://update.greasyfork.org/scripts/551304/Youtube%20Autocomplete%20commands.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sheetCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTh9fO4OUKoAsL4eJmCI5peyrgD8I6VlJbNPwV7yxyN_N6UhMfMFnPtdd4CR1zvmkStxpaW6Roa6wPn/pub?output=csv";
    let commands = [];
    let selectedIndex = -1;
    let dropdown = null;
    let input = null;

    async function loadCachedCommands() {
        const cached = await GM_getValue('commands', []);
        if (Array.isArray(cached) && cached.length > 0) {
            commands = cached;
        }
    }

    function fetchCommands() {
        GM_xmlhttpRequest({
            method: "GET",
            url: sheetCsvUrl,
            onload: response => {
                if (response.status === 200) {
                    const lines = response.responseText.split('\n');
                    const newCmds = lines.slice(1)
                        .map(line => line.split(',')[0].trim())
                        .filter(c => c && c.startsWith('!'));
                    if (JSON.stringify(newCmds) !== JSON.stringify(commands)) {
                        commands = newCmds;
                        GM_setValue('commands', commands);
                    }
                }
            }
        });
    }

    function findChatInput() {
        let el = document.querySelector('yt-live-chat-text-input-field-renderer > div#input[contenteditable]');
        if (el) return el;
        el = document.querySelector('div#input[contenteditable][aria-label="Type a message"]');
        if (el) return el;
        return document.querySelector('div#input[contenteditable]');
    }

    function createDropdown() {
        if (dropdown) return dropdown;
        dropdown = document.createElement('div');
        dropdown.style.position = 'fixed';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '2px solid #0078d7';
        dropdown.style.borderRadius = '6px';
        dropdown.style.zIndex = '2147483647';
        dropdown.style.maxHeight = '220px';
        dropdown.style.overflowY = 'auto';
        dropdown.style.width = '230px';
        dropdown.style.fontSize = '15px';
        dropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        dropdown.style.cursor = 'pointer';
        dropdown.style.display = 'none';
        dropdown.setAttribute('id', 'yt-autocomplete-dropdown');
        document.body.appendChild(dropdown);
        return dropdown;
    }

    function positionDropdown() {
        if (!input || !dropdown) return;
        const rect = input.getBoundingClientRect();
        dropdown.style.left = `${rect.left + window.scrollX}px`;
        dropdown.style.top = 'auto';
        dropdown.style.bottom = `${window.innerHeight - rect.top + 3}px`;
    }

    function clearSelection() {
        if (!dropdown) return;
        Array.from(dropdown.children).forEach(child => {
            child.style.backgroundColor = '';
        });
    }

    function highlightOption(index) {
        if (!dropdown) return;
        clearSelection();
        if (index >= 0 && index < dropdown.children.length) {
            dropdown.children[index].style.backgroundColor = '#bde4ff';
            dropdown.children[index].scrollIntoView({block: 'nearest'});
        }
    }

    function showDropdown(filtered) {
        if (!dropdown || !input) return;
        while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
        selectedIndex = -1;

        filtered.forEach(cmd => {
            const option = document.createElement('div');
            option.textContent = cmd;
            option.style.padding = '8px 14px';
            option.style.borderBottom = '1px solid #eee';
            option.style.userSelect = 'none';

            option.addEventListener('mouseenter', () => {
                clearSelection();
                option.style.backgroundColor = '#e4f0fc';
                selectedIndex = Array.from(dropdown.children).indexOf(option);
            });
            option.addEventListener('mouseleave', () => {
                option.style.backgroundColor = '';
                selectedIndex = -1;
            });
            option.addEventListener('mousedown', e => {
                e.preventDefault();
                selectOption(option.textContent);
            });

            dropdown.appendChild(option);
        });

        if (filtered.length > 0) {
            dropdown.style.display = 'block';
            positionDropdown();
        } else {
            dropdown.style.display = 'none';
        }
    }

    // The key fix: after setting content, fire 'input' event properly for contenteditable div
    function selectOption(text) {
        if (!input || !dropdown) return;
        input.textContent = text + '\u00A0';

        // Move the cursor to the end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(input);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        input.focus();

        // Dispatch an input event to notify YouTube
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        input.dispatchEvent(inputEvent);

        dropdown.style.display = 'none';
    }

    function autocompleteTopOption() {
        if (!dropdown || dropdown.children.length === 0) return;
        selectedIndex = 0;
        highlightOption(selectedIndex);
        selectOption(dropdown.children[0].textContent);
    }

    function onArrowKey(key) {
        if (!dropdown || dropdown.style.display !== 'block' || dropdown.children.length === 0) return;

        if (key === 'ArrowDown') {
            selectedIndex++;
            if (selectedIndex >= dropdown.children.length) selectedIndex = 0;
            highlightOption(selectedIndex);
        } else if (key === 'ArrowUp') {
            selectedIndex--;
            if (selectedIndex < 0) selectedIndex = dropdown.children.length - 1;
            highlightOption(selectedIndex);
        }
    }

    function observeForChatInput(callback) {
        input = findChatInput();
        if (input) {
            callback(input);
            return;
        }

        const observer = new MutationObserver(() => {
            const possibleInput = findChatInput();
            if (possibleInput && possibleInput !== input) {
                input = possibleInput;
                observer.disconnect();
                callback(input);
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});
    }

    function observeChatModeChanges() {
        const targetNode = document.querySelector('yt-sort-filter-sub-menu-renderer');
        if (!targetNode) {
            return;
        }
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    if (dropdown) dropdown.style.display = 'none';
                    input = null;
                    dropdown = null;
                    observeForChatInput(newInput => {
                        dropdown = createDropdown();
                        input = newInput;
                        attachInputEvents(input);
                        positionDropdown();
                    });
                    break;
                }
            }
        });
        observer.observe(targetNode, { childList: true, subtree: true, attributes: true });
    }

    function attachInputEvents(inputEl) {
        inputEl.addEventListener('input', onInputEvent);
        inputEl.addEventListener('keydown', onKeyDownEvent);
    }

    function removeInputEvents(inputEl) {
        inputEl.removeEventListener('input', onInputEvent);
        inputEl.removeEventListener('keydown', onKeyDownEvent);
    }

    function onInputEvent(e) {
        const text = e.target.textContent.trim();
        if (text.startsWith('!')) {
            const query = text.slice(1).toLowerCase();
            const filtered = commands.filter(c =>
                c.toLowerCase().startsWith('!' + query) || c.toLowerCase().startsWith(query));
            showDropdown(filtered);
        } else {
            dropdown.style.display = 'none';
            selectedIndex = -1;
        }
    }

    function onKeyDownEvent(e) {
        if ((e.key === 'Tab' || e.key === 'Enter') && dropdown.style.display === 'block') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < dropdown.children.length) {
                selectOption(dropdown.children[selectedIndex].textContent);
            } else if(e.key === 'Tab') {
                autocompleteTopOption();
            }
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            onArrowKey(e.key);
        }
    }

    (async function main() {
        await loadCachedCommands();
        fetchCommands();

        observeForChatInput(inputEl => {
            dropdown = createDropdown();
            input = inputEl;
            attachInputEvents(input);
        });

        observeChatModeChanges();
    })();

})();
