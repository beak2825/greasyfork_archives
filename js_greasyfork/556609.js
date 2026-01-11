// ==UserScript==
// @name         MyAnimeList.net GIF inserter
// @namespace    http://tampermonkey.net/
// @version      2026-01-11.1
// @description  Come to Anime moments club 🎊 https://myanimelist.net/clubs.php?cid=93838 🎉! Add convenient Tenor.com gif image inserter into MyAnimeList.net comment editor.
// @author       AlexDEV.pro
// @match        *://myanimelist.net/*
// @icon         data:image/jpeg;base64,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
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/556609/MyAnimeListnet%20GIF%20inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/556609/MyAnimeListnet%20GIF%20inserter.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const apiKey = 'AIzaSyDwtuo8eUG5sg6KPbBW_1-gizZBjAiRIqE';
    const clientKey = 'MALGI';

    const lastUsedImagesStorageKey = 'malgiLastUsedImages';
    const insertOptionSizePxStorageKey = 'malgiInsertOptionSizePx';
    const insertSizeModeIsHeightStorageKey = 'malgiInsertSizeModeIsHeight';
    const displayOptionSquareViewStorageKey = 'malgiDisplayOptionSquareView';

    const i18n = {
        en: {
            insertSizeLabelPart1Text: 'Insert⠀',
            insertSizeModeWidthButtonText: 'width',
            insertSizeModeHeightButtonText: 'height',
            insertSizeLabelPart2Text: '⠀(px):',
            isCoverObjectFitCheckboxLabelText: 'Display square',
            loadMoreButtonText: 'More',
            searchQueryPrefixOptionAllText: 'All',
            searchQueryPrefixOptionAnimeText: 'Anime',
            searchFilterOptionGifsText: 'GIFs',
            searchFilterOptionAnimatedStickersText: 'Animated stickers',
            searchFilterOptionStaticStickersText: 'Static stickers',
            searchFilterOptionAllStickersText: 'All stickers'
        },
        ru: {
            insertSizeLabelPart1Text: '',
            insertSizeModeWidthButtonText: 'Ширина',
            insertSizeModeHeightButtonText: 'Высота',
            insertSizeLabelPart2Text: '⠀вставки (пиксели):',
            isCoverObjectFitCheckboxLabelText: 'Квадратное отображение',
            loadMoreButtonText: 'Ещё',
            searchQueryPrefixOptionAllText: 'Всё',
            searchQueryPrefixOptionAnimeText: 'Аниме',
            searchFilterOptionGifsText: 'Гифки',
            searchFilterOptionAnimatedStickersText: 'Анимированные стикеры',
            searchFilterOptionStaticStickersText: 'Статические стикеры',
            searchFilterOptionAllStickersText: 'Все стикеры'
        }
    };

    const currentUserLocale = navigator.language.split('-')[0] || 'en';
    const t = i18n[currentUserLocale] || i18n.en;

    const popupSpacingModes = {
        'default': undefined,
        'sceditor': 'sc',
        'table': 't'
    };
    const popupSpacingPx = 41;
    const popupSpacingInScEditorPx = 30;
    const popupSpacingInTablePx = 19;

    const searchQueryPrefixOptions = [
        { value: '', text: t.searchQueryPrefixOptionAllText },
        { value: 'anime ', text: t.searchQueryPrefixOptionAnimeText }
    ];
    const searchQueryPrefixDefaultOption = searchQueryPrefixOptions[1];

    const searchFilterOptions = [
        { value: '', text: t.searchFilterOptionGifsText },
        { value: 'sticker,-static', text: t.searchFilterOptionAnimatedStickersText },
        { value: 'sticker,static', text: t.searchFilterOptionStaticStickersText },
        { value: 'sticker', text: t.searchFilterOptionAllStickersText }
    ];
    const searchFilterDefaultOption = searchFilterOptions[0];

    const searchQueryRowsCount = 2;

    // How close to the bottom before triggering load more function.
    const loadMoreTriggerDistancePx = 5;

    const insertSizeMinPx = 40;
    const insertSizeMaxPx = 660;
    const insertSizeStepPx = 5;
    const insertSizePresetsPx = [40, 50, 60, 80, 90, 100, 110, 120, 150, 180, 200, 235];
    let insertSizePxDefault = insertSizePresetsPx[3];
    let insertSizeModeIsHeightDefault = false;

    let displayOptionSquareDefault = true;

    const imageGridMinWidthPx = 100;
    const imageGridGapPx = 5;

    const maxLastUsedImagesCount = 500;

    let searchRequestAbortController;
    let popupContainerEl, insertSizeInputEl, searchQueryPrefixSelectEl, searchFilterSelectEl, searchInputEl, searchButtonEl, insertSizeModeButtonEl, imagesContainerEl, resultsContainerEl, loadMoreButtonEl, lastUsedImagesContainerEl;
    let currentAnchorEl;

    const lastUsedImageClickInterval = 500;

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --malgi-text-color: #5E5E5E;
            --malgi-popup-height: 300px;
            --malgi-popup-spacing: 0px;
            --malgi-popup-extra-height: 0;
        }

        .malgi-popup-anchor { position: relative; }
        .malgi-dialog-open-button { display: flex; width: 1.8em; height: 1.8em; margin: -3px 3px 0 3px; padding: 0; font-size: 1.1em; align-items: center; justify-content: center; position: absolute; top: 0; right: 0; }
        .malgi-dialog-open-button.sceditor-button { position: unset; margin-bottom: 2px; margin-left: 8px; border-width: 1px; }
        #malgi-popup-container { display: none; z-index: 99; position: absolute; top: calc(-1 * var(--malgi-popup-height) - var(--malgi-popup-spacing)); transition: top 0.3s ease; height: var(--malgi-popup-height); padding: 0 5px 5px 5px; overflow-y: scroll; color: var(--malgi-text-color); margin-left: 1px; margin-right: 1px; background: white; box-shadow: 0 0 0.2em #BABABA; }
        #malgi-popup-container img { cursor: pointer; width: ${imageGridMinWidthPx}px; height: 100px; object-fit: cover; margin: auto; background-color: #EEE; background-image: linear-gradient(90deg, #EEE 25%, #F5F5F5 50%, #EEE 75%); background-size: 200% 100%; animation: loading-shimmer 1.5s infinite; }
        #malgi-popup-container img.loaded { background: none; }
        #malgi-popup-container img:hover { opacity: 0.5; }
        #malgi-popup-container button:active { box-shadow: inset 0 0 4px lightgray; }

        #malgi-last-used-img-container, #malgi-results-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(${imageGridMinWidthPx}px, 1fr)); justify-content: center; gap: ${imageGridGapPx}px; }

        #malgi-images-container.malgi-object-fit-contain img { object-fit: contain; }
        #malgi-images-container { padding: 5px; }

        #malgi-toolbar-container { position: sticky; top: 0; z-index: 1000; background: white; padding: 5px; margin: -5px; display: flex; align-items: center; column-gap: 1em; row-gap: 0.5em; flex-wrap: wrap; }
        #malgi-toolbar-container div { display: flex; align-items: center; }
        #malgi-toolbar-container div:first-child { flex: 1 }
        #malgi-toolbar-container input, #malgi-toolbar-container select { align-self: stretch; padding: 0.5em; border: 1px solid lightgray; font-size: 1em; color: var(--malgi-text-color); }
        #malgi-toolbar-container input { box-sizing: border-box; height: auto; line-height: normal; }
        #malgi-toolbar-container select { padding-top: 0.34em; }
        #malgi-toolbar-container button { border: 1px solid lightgray; color: var(--malgi-text-color); font-size: 13px; height: 30px; padding: 0 5px; align-items: center; display: flex; }

        #malgi-search-input { flex: 1; }
        #malgi-search-button { width: 30px; justify-content: center; }

        #malgi-load-more-button-container { display: flex; justify-content: center; padding: 1em; }
        #malgi-load-more-button { border: 1px solid lightgray; padding: 5px; text-align: center; display: none; }
        #malgi-load-more-button.is-loading { background-size: contain; background-repeat: no-repeat; background-position: center; border-color: transparent; color: transparent; background-image: url("data:image/gif;base64,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");  }

        .malgi-popup-extra-height { margin-top: calc(var(--malgi-popup-extra-height) + var(--malgi-popup-spacing)) !important; }
        .malgi-left-border-stack > *:not(:first-child) { border-left: 0; }
        .malgi-flex-wrap { display: flex; flex-wrap: wrap; row-gap: 0.25em; }
        .malgi-label { margin-rigth: 0.5em; }
        .malgi-checkbox-label { display: flex; align-items: center; gap: 0.5em; }
        .malgi-no-selection {
            user-select: none; /* Prevents text selection */
            -webkit-user-select: none; /* Safari/Chrome */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE/Edge */
        }

        @keyframes loading-shimmer {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }

        @media(max-width: 375px) {
            #malgi-toolbar-container #malgi-search-input { width: 1em }
        }
        @media(max-width: 450px) {
            #malgi-toolbar-container #malgi-search-filter-select { width: 5em }
        }
    `;
    document.head.appendChild(style);

    // Tampermonkey/Userscripts storage access.
    const Storage = {
        async get(key, defaultValue) {
            // Userscripts async GM.
            if (typeof GM !== 'undefined' && GM.getValue) {
                return await GM.getValue(key, defaultValue);
            }

            // Tampermonkey sync GM.
            if (typeof GM_getValue === 'function') {
                return GM_getValue(key, defaultValue);
            }

            // localStorage fallback.
            try {
                const raw = localStorage.getItem(key);
                return raw === null ? defaultValue : JSON.parse(raw);
            } catch {
                return defaultValue;
            }
        },

        async set(key, value) {
            // Userscripts async GM.
            if (typeof GM !== 'undefined' && GM.setValue) {
                return await GM.setValue(key, value);
            }

            // Tampermonkey sync GM.
            if (typeof GM_setValue === 'function') {
                return GM_setValue(key, value);
            }

            // localStorage fallback.
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch {
                console.warn(`Unable to write to local storage. Key: ${key}, value: ${value}.`);
            }
        }
    };

    // Initializes the popup. There must be only one popup but it can used in multiple editors, one at a time.
    const initPopupElements = () => {
        popupContainerEl = document.createElement('div');
        popupContainerEl.id = 'malgi-popup-container';

        const toolbarContainerEl = document.createElement('div');
        toolbarContainerEl.id = 'malgi-toolbar-container';

        const searchGroupEl = document.createElement('div');
        searchGroupEl.className = 'malgi-left-border-stack';

        searchQueryPrefixSelectEl = document.createElement('select');
        searchQueryPrefixSelectEl.id = 'malgi-search-query-prefix-select';
        searchQueryPrefixOptions.forEach(option => {
            const optionEl = document.createElement('option');

            optionEl.value = option.value;
            optionEl.textContent = option.text;

            if (option === searchQueryPrefixDefaultOption) optionEl.selected = true;

            searchQueryPrefixSelectEl.appendChild(optionEl);
        });
        searchQueryPrefixSelectEl.addEventListener('change', onSearchParamsChange);

        searchFilterSelectEl = document.createElement('select');
        searchFilterSelectEl.id = 'malgi-search-filter-select';
        searchFilterOptions.forEach(option => {
            const optionEl = document.createElement('option');

            optionEl.value = option.value;
            optionEl.textContent = option.text;

            if (option === searchFilterDefaultOption) optionEl.selected = true;

            searchFilterSelectEl.appendChild(optionEl);
        });
        searchFilterSelectEl.addEventListener('change', onSearchParamsChange);

        searchInputEl = document.createElement('input');
        searchInputEl.id = 'malgi-search-input';
        searchInputEl.type = 'text';
        searchInputEl.addEventListener('keypress', (event) => { if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); handleSearch(); } });
        searchInputEl.addEventListener('focus', () => searchInputEl.select());

        const searchClearButtonEl = document.createElement('button');
        searchClearButtonEl.id = 'malgi-search-clear-button';
        searchClearButtonEl.type = 'button';
        searchClearButtonEl.textContent = '❌';
        searchClearButtonEl.addEventListener('click', goToLastUsedImagesScreen);

        searchButtonEl = document.createElement('button');
        searchButtonEl.id = 'malgi-search-button';
        searchButtonEl.type = 'button';
        searchButtonEl.textContent = '🔎';
        searchButtonEl.addEventListener('click', handleSearch);

        searchGroupEl.appendChild(searchQueryPrefixSelectEl);
        searchGroupEl.appendChild(searchFilterSelectEl);
        searchGroupEl.appendChild(searchInputEl);
        searchGroupEl.appendChild(searchClearButtonEl);
        searchGroupEl.appendChild(searchButtonEl);

        const insertSizeGroupEl = document.createElement('div');
        insertSizeGroupEl.className = 'sgi-flex-wrap';

        const insertSizeLabelGroupEl = document.createElement('div');
        const insertSizeLabelPart1El = document.createElement('span');
        insertSizeLabelPart1El.className = 'sgi-label sgi-no-selection';
        insertSizeLabelPart1El.textContent = t.insertSizeLabelPart1Text;
        insertSizeModeButtonEl = document.createElement('button');
        insertSizeModeButtonEl.id = 'sgi-insert-size-mode-button';
        insertSizeModeButtonEl.type = 'button';
        if (insertSizeModeIsHeightDefault) {
            insertSizeModeButtonEl.textContent = t.insertSizeModeHeightButtonText;
        } else {
            insertSizeModeButtonEl.textContent = t.insertSizeModeWidthButtonText;
        }
        insertSizeModeButtonEl.addEventListener('click', handleInsertSizeToggle);
        const insertSizeLabelPart2El = document.createElement('span');
        insertSizeLabelPart2El.className = 'sgi-label sgi-no-selection';
        insertSizeLabelPart2El.textContent = t.insertSizeLabelPart2Text;
        insertSizeLabelGroupEl.appendChild(insertSizeLabelPart1El);
        insertSizeLabelGroupEl.appendChild(insertSizeModeButtonEl);
        insertSizeLabelGroupEl.appendChild(insertSizeLabelPart2El);

        insertSizeInputEl = document.createElement('input');
        insertSizeInputEl.id = 'sgi-insert-width-input';
        insertSizeInputEl.type = 'number';
        insertSizeInputEl.min = insertSizeMinPx;
        insertSizeInputEl.max = insertSizeMaxPx;
        insertSizeInputEl.step = insertSizeStepPx;
        insertSizeInputEl.value = insertSizePxDefault;
        insertSizeInputEl.addEventListener('change', (event) => Storage.set(insertOptionSizePxStorageKey, event.target.value));

        insertSizeGroupEl.appendChild(insertSizeLabelGroupEl);
        insertSizeGroupEl.appendChild(insertSizeInputEl);
        for(const presetValue of insertSizePresetsPx) {
            const insertWidthPresetButton = document.createElement('button');

            insertWidthPresetButton.type = 'button';
            insertWidthPresetButton.textContent = presetValue;
            insertWidthPresetButton.addEventListener('click', () => handlePresetClick(presetValue));

            insertSizeGroupEl.appendChild(insertWidthPresetButton);
        }

        const displayOptionsGroupEl = document.createElement('div');
        displayOptionsGroupEl.id = 'malgi-display-options-container';
        displayOptionsGroupEl.className = 'malgi-flex-wrap';

        const isCoverObjectFitCheckboxEl = document.createElement('input');
        isCoverObjectFitCheckboxEl.type = 'checkbox';
        isCoverObjectFitCheckboxEl.checked = displayOptionSquareDefault;
        isCoverObjectFitCheckboxEl.addEventListener('change', (event) => setObjectFitCover(event.target.checked));

        const isCoverObjectFitCheckboxLabelEl = document.createElement('label');
        isCoverObjectFitCheckboxLabelEl.className = 'malgi-checkbox-label';
        isCoverObjectFitCheckboxLabelEl.appendChild(isCoverObjectFitCheckboxEl);
        isCoverObjectFitCheckboxLabelEl.append(t.isCoverObjectFitCheckboxLabelText);

        displayOptionsGroupEl.appendChild(isCoverObjectFitCheckboxLabelEl);

        toolbarContainerEl.appendChild(searchGroupEl);
        toolbarContainerEl.appendChild(insertSizeGroupEl);
        toolbarContainerEl.appendChild(displayOptionsGroupEl);

        imagesContainerEl = document.createElement('div');
        imagesContainerEl.id = 'malgi-images-container';
        imagesContainerEl.className = 'malgi-no-selection';
        if (!displayOptionSquareDefault) {
            imagesContainerEl.classList.add('malgi-object-fit-contain');
        }

        resultsContainerEl = document.createElement('div');
        resultsContainerEl.id = 'malgi-results-container';

        lastUsedImagesContainerEl = document.createElement('div');
        lastUsedImagesContainerEl.id = 'malgi-last-used-img-container';

        const loadMoreButtonContainerEl = document.createElement('div');
        loadMoreButtonContainerEl.id = 'malgi-load-more-button-container';

        loadMoreButtonEl = document.createElement('button');
        loadMoreButtonEl.id = 'malgi-load-more-button';
        loadMoreButtonEl.type = 'button';
        loadMoreButtonEl.textContent = t.loadMoreButtonText;
        loadMoreButtonEl.addEventListener('click', () => {
            searchTenor(searchInputEl.value, true);
        });

        loadMoreButtonContainerEl.appendChild(loadMoreButtonEl);

        imagesContainerEl.appendChild(resultsContainerEl);
        imagesContainerEl.appendChild(lastUsedImagesContainerEl);
        imagesContainerEl.appendChild(loadMoreButtonContainerEl);

        popupContainerEl.appendChild(toolbarContainerEl);
        popupContainerEl.appendChild(imagesContainerEl);
    }

    // Initializes the popup open button and popup anchor for every comment editor on the page. Each button click appends the single popup to its corresponding popup anchor.
    const initButtonAndAnchorForEveryEditor = (injectionTargets) => {
        if (!injectionTargets.length) return; // No editor toolbars found on the current page, nothing to do here.

        // Ensure the targets are fully loaded.
        setTimeout(() => {
            for(const target of injectionTargets) {
                // Skip the target if it was processed before.
                //if (target.dataset.malgiProcessed) continue;
                if (target.parentElement.querySelector('.malgi-popup-anchor')) continue;

                const popupAnchorEl = document.createElement('div');
                popupAnchorEl.className = 'malgi-popup-anchor';

                let buttonTargetEl = target.parentElement.querySelector('div.sceditor-toolbar');
                const isScEditor = !!buttonTargetEl;
                if (!buttonTargetEl) {
                    buttonTargetEl = target.parentElement.parentElement;
                }
                if (buttonTargetEl.classList.contains('reply-container')) {
                    continue; // Skip reply container as this one catches as an intermediate state of dynamically loaded editor.
                } else if (buttonTargetEl.tagName === 'FORM') {
                    continue; // Skip form as this one also catches as an intermediate state of dynamically loaded editor.
                }
                if (buttonTargetEl) {
                    // Set button target element position to relative for absolute button positioning.
                    buttonTargetEl.style.position = 'relative';

                    // Insert anchor element only if button target element is also found.
                    target.parentElement.insertBefore(popupAnchorEl, target.parentElement.firstChild);

                    // Mark the table mode on the popup anchor element if it is a table mode for further spacing adjuctments.
                    if (buttonTargetEl.tagName === 'TR') {
                        popupAnchorEl.dataset.spacingMode = popupSpacingModes.table;
                    }

                    const dialogOpenButtonEl = document.createElement('button');
                    dialogOpenButtonEl.className = 'malgi-dialog-open-button';
                    dialogOpenButtonEl.type = 'button';
                    dialogOpenButtonEl.textContent = '🌊';
                    dialogOpenButtonEl.addEventListener('click', () => onDialogOpenButtonClick(popupAnchorEl));

                    if (isScEditor) {
                        popupAnchorEl.dataset.spacingMode = popupSpacingModes.sceditor;

                        dialogOpenButtonEl.classList.add('sceditor-button');

                        const scEditorGroupEl = document.createElement('div');
                        scEditorGroupEl.className = 'sceditor-group';
                        scEditorGroupEl.appendChild(dialogOpenButtonEl);

                        buttonTargetEl.appendChild(scEditorGroupEl);
                    } else {
                        buttonTargetEl.appendChild(dialogOpenButtonEl);
                    }
                }

                //target.dataset.malgiProcessed = true;
            }
        }, 0);
    }

    const getEditorEl = () => {
        return currentAnchorEl.parentElement.querySelector('textarea:not(.g-recaptcha-response)');
    }

    const handleSearch = () => {
        if (!searchButtonEl) throw new Error('Search button is not found.');
        if (!searchInputEl) throw new Error('Search button is not found.');

        if (searchInputEl.value) {
            if (searchButtonEl.disabled) return; // Prevent requests while search button is disabled.

            searchTenor(searchInputEl.value)
        } else {
            // If no search query provided then display last used images.
            goToLastUsedImagesScreen();
        }
    }

    const handleInsertSizeToggle = () => {
        insertSizeModeIsHeightDefault = !insertSizeModeIsHeightDefault;

        Storage.set(insertSizeModeIsHeightStorageKey, insertSizeModeIsHeightDefault);

        if (insertSizeModeIsHeightDefault) {
            insertSizeModeButtonEl.textContent = t.insertSizeModeHeightButtonText;
        } else {
            insertSizeModeButtonEl.textContent = t.insertSizeModeWidthButtonText;
        }
    }

    const handlePresetClick = (presetValue) => {
        if (!insertSizeInputEl) throw new Error('No insert size element found.');

        insertSizeInputEl.value = presetValue;
        Storage.set(insertOptionSizePxStorageKey, presetValue)
    }

    const handleImageSelection = (editorEl, imgSrc, tenorPageUrl) => {
        if (!editorEl) return; // If the user is in preview mode, the editor element doesn't exist and there is nothing to do.

        // In case editor isn't focused.
        editorEl.focus();

        // Ensure focus has been set.
        setTimeout(() => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const anchorNode = selection.anchorNode;
                if (isSelectionInsideContentEditable(selection)) {
                    // Get current content editable element selection.
                    const range = selection.getRangeAt(0);

                    //// Remove current selection.
                    //range.deleteContents();

                    // Prepare insertion HTML. The line breaks are odd but they prevent unnecessary spaces while keeping it convenient to edit.
                    const htmlSnippet =
                          `<span data-vue-node-view-wrapper="" contenteditable="false" draggable="true" style="white-space: normal;"><span
    class="b-image check-width" data-attrs="{&quot;id&quot;:null,&quot;src&quot;:&quot;${imgSrc}&quot;,&quot;isPoster&quot;:false,&quot;width&quot;:${insertSizeModeIsHeightDefault ? 'null' : insertSizeInputEl.value},&quot;height&quot;:${insertSizeModeIsHeightDefault ? insertSizeInputEl.value : 'null'},&quot;isNoZoom&quot;:true,&quot;class&quot;:null}" data-image="[img]">
        <div class="controls">
            <a class="prosemirror-open" href="${imgSrc}" target="_blank"></a><!----><div class="delete"></div>
        </div>
        <img src="${imgSrc}"
    ></span
></span>`;

                    // Create a temporary container to turn the HTML string into nodes.
                    const temp = document.createElement('div');
                    temp.innerHTML = htmlSnippet;
                    const fragment = document.createDocumentFragment();
                    let node;
                    while ((node = temp.firstChild)) fragment.appendChild(node); // Move node one by one from temp into fragment.

                    // If the selection is inside a text node, split it.
                    if (range.startContainer.nodeType === Node.TEXT_NODE) {
                        const textNode = range.endContainer;
                        const offset = range.endOffset;
                        const afterNode = textNode.splitText(offset);
                        range.setStartBefore(afterNode);
                        range.setEndBefore(afterNode);
                    }

                    const lastNode = fragment.lastChild;
                    range.insertNode(fragment); // Insert fragment.

                    // Move caret right after inserted node.
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    // Find textarea element.
                    const textAreaEl = Array.from(anchorNode.childNodes).find(node => node instanceof HTMLTextAreaElement);

                    // Insert text after caret/selection.
                    const selectionEndIndex = textAreaEl.selectionEnd;
                    const text = `[img no-zoom ${insertSizeModeIsHeightDefault ? 'height' : 'width'}=${insertSizeInputEl.value}]${imgSrc}[/img]`;
                    textAreaEl.value = textAreaEl.value.slice(0, selectionEndIndex) + text + textAreaEl.value.slice(selectionEndIndex);

                    // Move caret after inserted text.
                    textAreaEl.selectionStart = textAreaEl.selectionEnd = selectionEndIndex + text.length;

                    // Trigger input event.
                    textAreaEl.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }

            // Output image Tenor page URL into console in case you want to open it and add it to your library. TODO: Make "Add to library" button and use modifier key to add or to reveal the add button overlay?
            if (tenorPageUrl) {
                console.info(tenorPageUrl);
            }
        }, 0);
    }

    const isSelectionInsideContentEditable = (selection) => {
        if (!selection.rangeCount) return false;

        let node = selection.anchorNode;
        while (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.isContentEditable) {
                return true;
            }

            node = node.parentNode;
        }

        return false;
    }

    const goToLastUsedImagesScreen = () => {
        // Hide load more button and disable scroll/pull to load more function while last used images section is displaying.
        setPullToLoadMoreListenerState(false);

        // Cancel the search request if any.
        abortCurrentSearchRequest("Search query has been cancelled as it's no longer relevant.");

        // Clear search query input if not empty.
        if (searchInputEl.value) searchInputEl.value = '';

        // Reset the search query parameters memory because the new query after displaying last used images is allowed to be the same.
        prevQueryDynamicPart = prevQueryDynamicPartWithPos = null;

        // Clear search results.
        clearSearchResults();

        // Display last used images section.
        setLastUsedImagesDisplay(true);
    }

    const clearSearchResults = () => {
        for (const img of resultsContainerEl.querySelectorAll('img')) {
            img.removeEventListener('click', onSearchResultImageClick); // Just in case...
            img.removeEventListener('load', onImageLoad);
        }

        resultsContainerEl.innerHTML = '';
    }

    const onDialogOpenButtonClick = (popupAnchorEl) => {
        if (popupContainerEl.parentElement === popupAnchorEl) {
            // The popup element is already attached to the specified popup anchor element, just togghe the popup visibility then.
            popupContainerEl.style.display = getComputedStyle(popupContainerEl).display === 'none' ? 'block' : 'none';
        } else {
            // Append existing popup to the specified anchor element and show it.
            popupAnchorEl.appendChild(popupContainerEl);
            popupContainerEl.style.display = 'block';

            // Store the last anchor element where the popup was attached, so we can later find the corresponding editor element relative to it.
            currentAnchorEl = popupAnchorEl;
        }

        // If there are not enough space for the popup - make the temporary space.
        const elementToEnlarge = document.querySelector('#content') || document.body;
        if (popupContainerEl.style.display !== 'none') {
            const headerCalculatedHeightPx = document.querySelector('#menu')?.getBoundingClientRect().bottom || 0;
            const spaceAboveTheAnchorPx = popupAnchorEl.getBoundingClientRect().top + window.scrollY - headerCalculatedHeightPx;
            const popupTopOffsetPx = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--malgi-popup-height'));

            let actualPopupSpacingPx;
            switch (popupAnchorEl.dataset.spacingMode) {
                case popupSpacingModes.sceditor:
                    actualPopupSpacingPx = popupSpacingInScEditorPx;

                    break;

                case popupSpacingModes.table:
                    actualPopupSpacingPx = popupSpacingInTablePx;

                    break;

                case popupSpacingModes.default:
                    actualPopupSpacingPx = popupSpacingPx;

                    break;

                default:
                    console.warn(`Unprocessed popup spacing mode: ${popupAnchorEl.dataset.spacingMode}.`);

                    break;
            }
            document.documentElement.style.setProperty('--malgi-popup-spacing', `${actualPopupSpacingPx}px`); // Triggers the popup animation and moves it to the height corresponding to the editor type.

            const deltaPx = popupTopOffsetPx + actualPopupSpacingPx - spaceAboveTheAnchorPx; // How much space is lacking to display the whole popup.
            if (deltaPx > 0) {
                const enlargementBeautifyDeltaPx = 14; // Just looks better with some additional spacing.
                document.documentElement.style.setProperty('--malgi-popup-extra-height', `${Math.ceil(deltaPx + enlargementBeautifyDeltaPx)}px`);
                elementToEnlarge.classList.add('malgi-popup-extra-height');
            } else {
                elementToEnlarge.classList.remove('malgi-popup-extra-height');
            }

            // If the popup element is visible then focus the search input element.
            searchInputEl.focus();
        } else {
            document.documentElement.style.setProperty('--malgi-popup-spacing', '0px'); // Resets the popup position to prepare for its show animation.
            elementToEnlarge.classList.remove('malgi-popup-extra-height');
        }
    }

    const onSearchParamsChange = () => {
        if (searchInputEl.value) handleSearch();
        else searchInputEl.focus();
    }

    const onSearchResultImageClick = async (event) => {
        const imgEl = event.currentTarget;

        handleImageSelection(getEditorEl(), imgEl.src, imgEl.dataset.tenorPageUrl);

        await saveLastUsedImageAndSync(imgEl);
    }

    const onImageLoad = (event) => {
        event.currentTarget.classList.add('loaded');
    }

    const onLastUsedImageClick = async (event) => {
        const img = event.currentTarget;
        const now = Date.now();
        const lastClickTime = Number(img.dataset.lastClickTime) || 0;
        let count = Number(img.dataset.clickCount) || 0;

        if (now - lastClickTime < lastUsedImageClickInterval) {
            ++count;
        } else {
            count = 1;
        }

        img.dataset.clickCount = count;
        img.dataset.lastClickTime = now;

        if (count < 2) {
            // First click on image should be handled as image selection.
            handleImageSelection(getEditorEl(), img.src, img.dataset.tenorPageUrl);
        } else if (count >= 3) {
            // Triple click removes the image from last used images.
            img.removeEventListener('click', onLastUsedImageClick); // Just in case.
            img.removeEventListener('load', onImageLoad);
            img.remove();
            img.dataset.clickCount = 0;

            await removeLastUsedImageAndSync(img);
        }
    };

    let startY = null;
    // Desktop drag or touch.
    const onPointerDown = event => { startY = event.clientY; }
    const onPointerUp = event => {
        if (startY !== null && startY - event.clientY > loadMoreTriggerDistancePx) loadMoreButtonEl.click();
        startY = null;
    };
    // Mobile.
    const onTouchStart = event => { startY = event.touches[0].clientY; }
    const onTouchEnd = event => {
        if (startY !== null && startY - event.changedTouches[0].clientY > loadMoreTriggerDistancePx) loadMoreButtonEl.click();
        startY = null;
    };
    // Mouse scroll for desktop.
    const onScroll = event => {
        if (popupContainerEl.scrollTop + popupContainerEl.clientHeight >= popupContainerEl.scrollHeight - loadMoreTriggerDistancePx) {
            loadMoreButtonEl.click();
        }
    };
    // Mouse wheel (for case if there is nothing to scroll yet) for desktop.
    const onWheel = event => {
        if (popupContainerEl.scrollHeight <= popupContainerEl.clientHeight && event.deltaY > 0) loadMoreButtonEl.click();
    };
    const setPullToLoadMoreListenerState = (state) => {
        if (state) {
            loadMoreButtonEl.style.display = 'block';

            popupContainerEl.addEventListener('pointerdown', onPointerDown);
            popupContainerEl.addEventListener('pointerup', onPointerUp);
            popupContainerEl.addEventListener('touchstart', onTouchStart);
            popupContainerEl.addEventListener('touchend', onTouchEnd);
            popupContainerEl.addEventListener('scroll', onScroll);
            popupContainerEl.addEventListener('wheel', onWheel);
        } else {
            popupContainerEl.removeEventListener('pointerdown', onPointerDown);
            popupContainerEl.removeEventListener('pointerup', onPointerUp);
            popupContainerEl.removeEventListener('touchstart', onTouchStart);
            popupContainerEl.removeEventListener('touchend', onTouchEnd);
            popupContainerEl.removeEventListener('scroll', onScroll);
            popupContainerEl.removeEventListener('wheel', onWheel);

            loadMoreButtonEl.style.display = 'none';
        }
    }

    // window.addEventListener('storage', e => {
    //     if (e.key === lastUsedImagesStorageKey) {
    //         // TODO: Handle storage event? It can cause possible races if more than 3 tabs with last used images changes are opened.
    //         // const newImages = JSON.parse(e.newValue || '[]');
    //         // renderImages(newImages);
    //     }
    // });

    const getStoredLastUsedImages = async () => {
        return await Storage.get(lastUsedImagesStorageKey, []);
    }
    const restoreLastUsedImages = async () => {
        if (!lastUsedImagesContainerEl) throw new Error('Last used images container is not found.');

        const initialLastUsedImages = await getStoredLastUsedImages();
        for (let i = initialLastUsedImages.length - 1; i >= 0; --i) {
            const lastUsedImage = initialLastUsedImages[i];
            addLastUsedImageEl(lastUsedImage.url, lastUsedImage.tenorPageUrl);
        }

        // If current last used image count limit reached, remove excessive images from local storage and update the storage.
        if (initialLastUsedImages.length > maxLastUsedImagesCount) {
            await storeLastUsedImages(initialLastUsedImages);
        }
    }
    const storeLastUsedImages = async (lastUsedImages) => {
        // Remove excessive last used images that may have been added in another tab and synced.
        lastUsedImages.length = Math.min(lastUsedImages.length, maxLastUsedImagesCount);

        await Storage.set(lastUsedImagesStorageKey, lastUsedImages);
    }
    // TODO: Optimize last used images code. Iterate through Maps, update last used images container once by using Fragment.
    const saveLastUsedImageAndSync = async (imgEl) => {
        const initialLastUsedImageElsArray = getLastUsedImageEls();
        const storedLastUsedImages = await getStoredLastUsedImages();
        let isFoundInStored = false,
            isFoundInInitial = false;

        // For performance purposes.
        const initialLastUsedImageElsMap = Object.fromEntries(initialLastUsedImageElsArray.map(lastUsedImageEl => [lastUsedImageEl.src, lastUsedImageEl.dataset.tenorPageUrl]));
        const storedLastUsedImagesMap = Object.fromEntries(storedLastUsedImages.map(lastUsedImage => [lastUsedImage.url, lastUsedImage]));

        for(const lastUsedImage of storedLastUsedImages) {
            if (lastUsedImage.url == imgEl.src) {
                isFoundInStored = true;
            } else {
                // In case any new last used images were added in another tab, add them here too so the user doesn't have to reload the page to get them.
                if (!initialLastUsedImageElsMap[lastUsedImage.url]) {
                    addLastUsedImageEl(lastUsedImage.url, lastUsedImage.tenorPageUrl);
                }
            }
        }

        for (let i = initialLastUsedImageElsArray.length - 1; i >= 0; i--) {
            const lastUsedImageEl = initialLastUsedImageElsArray[i];

            if (lastUsedImageEl.src == imgEl.src) {
                isFoundInInitial = true;
            } else {
                // In case any new last used images were removed in another tab, remove them here too so the user doesn't have to reload the page to get rid of them.
                if (!storedLastUsedImagesMap[lastUsedImageEl.src]) {
                    removeLastUsedImageEl(lastUsedImageEl);
                }
            }
        }

        if (!isFoundInInitial || !isFoundInStored) {
            const newLastUsedImage = { url: imgEl.src, tenorPageUrl: imgEl.dataset.tenorPageUrl };

            if (!isFoundInInitial) {
                addLastUsedImageEl(newLastUsedImage.url, newLastUsedImage.tenorPageUrl);
            }
            if (!isFoundInStored) {
                storedLastUsedImages.unshift(newLastUsedImage);
                await storeLastUsedImages(storedLastUsedImages);
            }
        }
    }
    const removeLastUsedImageAndSync = async (imgEl) => {
        const initialLastUsedImageElsArray = getLastUsedImageEls();
        const storedLastUsedImages = await getStoredLastUsedImages();
        let isFoundInStored = false;

        // For performance purposes.
        const initialLastUsedImageElsMap = Object.fromEntries(initialLastUsedImageElsArray.map(lastUsedImageEl => [lastUsedImageEl.src, lastUsedImageEl.dataset.tenorPageUrl]));
        const storedLastUsedImagesMap = Object.fromEntries(storedLastUsedImages.map(lastUsedImage => [lastUsedImage.url, lastUsedImage]));

        const lastUsedImagesAddedInParallel = [];
        for (let i = storedLastUsedImages.length - 1; i >= 0; --i) {
            const lastUsedImage = storedLastUsedImages[i];

            // Remove specified image from stored last used images.
            if (lastUsedImage.url == imgEl.src) {
                storedLastUsedImages.splice(i, 1);
                await storeLastUsedImages(storedLastUsedImages);
            } else {
                // In case any new last used images were added in another tab, add them here too so the user doesn't have to reload the page to get them.
                if (!initialLastUsedImageElsMap[lastUsedImage.url]) {
                    lastUsedImagesAddedInParallel.unshift(lastUsedImage);
                }
            }
        }
        // Add last used images added in another tab.
        if (lastUsedImagesAddedInParallel.length) {
            for(const lastUsedImage of lastUsedImagesAddedInParallel) {
                addLastUsedImageEl(lastUsedImage.url, lastUsedImage.tenorPageUrl);
            }
        }

        for (let i = initialLastUsedImageElsArray.length - 1; i >= 0; --i) {
            const lastUsedImageEl = initialLastUsedImageElsArray[i];

            // Remove specified image from initial last used images.
            if (lastUsedImageEl.src == imgEl.src) {
                removeLastUsedImageEl(lastUsedImageEl);
            } else {
                // In case any new last used images were removed in another tab, remove them here too so the user doesn't have to reload the page to get rid of them.
                if (!storedLastUsedImagesMap[lastUsedImageEl.src]) {
                    removeLastUsedImageEl(lastUsedImageEl);
                }
            }
        }
    }
    const addLastUsedImageEl = (url, tenorPageUrl) => {
        const imgEl = document.createElement('img');
        imgEl.className = 'malgi-last-used-img';
        imgEl.src = url;
        imgEl.dataset.tenorPageUrl = tenorPageUrl;
        imgEl.dataset.loading = 'lazy';
        imgEl.addEventListener('click', onLastUsedImageClick);
        imgEl.addEventListener('load', onImageLoad);

        // Remove excessive last used image in case limit is reached.
        if (lastUsedImagesContainerEl.childElementCount >= maxLastUsedImagesCount) lastUsedImagesContainerEl.lastElementChild?.remove();

        lastUsedImagesContainerEl.insertBefore(imgEl, lastUsedImagesContainerEl.firstChild);
    }
    const removeLastUsedImageEl = (lastUsedImageEl) => {
        lastUsedImageEl.remove();
    }

    const restoreOptions = async () => {
        insertSizePxDefault = await Storage.get(insertOptionSizePxStorageKey, insertSizePxDefault);
        insertSizeModeIsHeightDefault = await Storage.get(insertSizeModeIsHeightStorageKey, insertSizeModeIsHeightDefault);
        displayOptionSquareDefault = await Storage.get(displayOptionSquareViewStorageKey, displayOptionSquareDefault);
    }

    const setLastUsedImagesDisplay = (display) => {
        lastUsedImagesContainerEl.style.display = display ? 'grid' : 'none';
    }

    const setObjectFitCover = (isCoverMode) => {
        if (isCoverMode) imagesContainerEl.classList.remove('malgi-object-fit-contain');
        else imagesContainerEl.classList.add('malgi-object-fit-contain');

        Storage.set(displayOptionSquareViewStorageKey, isCoverMode);
    }

    const getLastUsedImageEls = () => {
        return Array.from(lastUsedImagesContainerEl.querySelectorAll('img'));
    }

    const getResultLimit = () => {
        if (!resultsContainerEl) throw new Error('Results container element is not found.');

        return Math.floor((resultsContainerEl.clientWidth + imageGridGapPx) / (imageGridMinWidthPx + imageGridGapPx)) * searchQueryRowsCount;
    }

    const setLoadingState = (isLoading) => {
        if (isLoading) {
            searchButtonEl.disabled = true;
            searchButtonEl.textContent = '⏳';
            loadMoreButtonEl.classList.add('is-loading');

        } else {
            searchButtonEl.textContent = '🔎';
            loadMoreButtonEl.classList.remove('is-loading');
            searchButtonEl.disabled = false;
        }
    }

    let prevQueryDynamicPart, prevQueryDynamicPartWithPos;
    let nextPos = null;
    const searchTenor = (searchQuery, loadMore = false) => {
        const limit = getResultLimit();

        const queryDynamicPart = `&q=${searchQueryPrefixSelectEl.value}${searchQuery}&searchfilter=${searchFilterSelectEl.value}&limit=${limit}`;
        // Tenor API v2 is weird. If any dynamic query part is changed then it's a new query and pos parameter value must be nullified.
        if (queryDynamicPart != prevQueryDynamicPart) {
            nextPos = null;
        } else {
            // If the user presses the search button again then treat is as load more request.
            loadMore = true;
        }
        prevQueryDynamicPart = queryDynamicPart;

        const queryDynamicPartWithPos = `${queryDynamicPart}&pos=${nextPos}`;
        // Prevent same query spam.
        if (queryDynamicPartWithPos == prevQueryDynamicPartWithPos) {
            return;
        }
        prevQueryDynamicPartWithPos = queryDynamicPartWithPos;

        // If there is already a current request - cancel it.
        abortCurrentSearchRequest('Replacing with a new request');

        if (!loadMore) {
            clearSearchResults();
        }

        searchRequestAbortController = new AbortController();

        setLoadingState(true);

        fetch(`https://tenor.googleapis.com/v2/search?key=${apiKey}&client_key=${clientKey}&contentfilter=low${queryDynamicPartWithPos}`, { signal: searchRequestAbortController.signal })
            .then(r => r.json())
            .then(data => {
            data.results.forEach(responseObject => {
                const img = document.createElement('img');
                img.className = 'search-result-img';
                img.src = responseObject.media_formats?.gif_transparent?.url || responseObject.media_formats.gif.url; // If there is transparent version - use it.
                img.dataset.tenorPageUrl = responseObject.url;
                img.alt = responseObject.title || responseObject.content_description;
                img.addEventListener('click', onSearchResultImageClick);
                img.addEventListener('load', onImageLoad);
                resultsContainerEl.appendChild(img);
            });

            nextPos = data.next;

            const hasResult = data.results.length > 0;
            setPullToLoadMoreListenerState(hasResult);
            setLastUsedImagesDisplay(!hasResult);
        })
            .catch(e => console.error(e))
            .finally(() => setLoadingState(false));
    }

    const abortCurrentSearchRequest = (reason) => {
        searchRequestAbortController?.abort(reason);
    }

    // Hide the popup after the corresponding form submission.
    document.addEventListener('submit', e => {
        const editorEl = getEditorEl();
        if (editorEl) {
            const closestForm = editorEl.closest('form');
            if (closestForm && e.target === closestForm) {
                popupContainerEl.style.display = 'none';
            }
        }
    }, true);

    // Local storage -> TemperMonkey/Userscripts storage migration.
    const legacyLastUsedImagesLocalStorageKey = 'malgiPopularImages';
    const legacyInsertOptionWidthLocalStorageKey = 'malgiInsertOptionWidth';
    const legacyInsertOptionSizeLocalStorageKey = 'malgiInsertOptionWidthPx';
    const legacyDisplayOptionSquareLocalStorageKey = 'malgiDisplayOptionSquare';
    const renameLocalStorageKey = (oldKey, newKey) => {
        const value = localStorage.getItem(oldKey);
        if (value !== null) {
            localStorage.setItem(newKey, value);
            localStorage.removeItem(oldKey);
        }
    }
    const moveFromLocalStorageToGmStorage = async (key) => {
        let value = localStorage.getItem(key);
        if (value !== null) {
            try {
                value = JSON.parse(value);
            } catch {}

            await Storage.set(key, value);
            localStorage.removeItem(key);
        }
    }
    const legacyStorageMigration = async () => {
        // Old storage keys to new keys.
        renameLocalStorageKey(legacyLastUsedImagesLocalStorageKey, lastUsedImagesStorageKey);
        renameLocalStorageKey(legacyInsertOptionWidthLocalStorageKey, insertOptionSizePxStorageKey);
        renameLocalStorageKey(legacyInsertOptionSizeLocalStorageKey, insertOptionSizePxStorageKey);
        renameLocalStorageKey(legacyDisplayOptionSquareLocalStorageKey, displayOptionSquareViewStorageKey);

        // If GM API available, migrate from localStorage to GM storage (TemperMonkey/Userscripts own storage).
        if ((typeof GM !== 'undefined' && GM.setValue) || (typeof GM_setValue === 'function')) {
            await moveFromLocalStorageToGmStorage(lastUsedImagesStorageKey);
            await moveFromLocalStorageToGmStorage(insertOptionSizePxStorageKey);
            await moveFromLocalStorageToGmStorage(displayOptionSquareViewStorageKey);
        }
    }
    await legacyStorageMigration();

    // Restore options from local storage during the init phase, before any usage.
    await restoreOptions();

    const init = async (injectionTargets) => {
        initButtonAndAnchorForEveryEditor(injectionTargets);

        if (!window.malgiBaseInitializationComplete) {
            initPopupElements();
            await restoreLastUsedImages();
            window.malgiBaseInitializationComplete = true;
        }
    }

    const debounceAsync = (fn, wait) => {
        let t;

        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => {
                Promise.resolve(fn(...args)).catch(error => {
                    console.error('Debounced fn error!', error);
                });
            }, wait);
        };
    };
    const di = debounceAsync(init, 200);

    const isVisible = (el) => {
        const st = getComputedStyle(el);

        return (
            el.offsetParent !== null &&
            st.display !== 'none' &&
            st.visibility !== 'hidden' &&
            st.opacity !== '0'
        );
    }

    const getInjectionTargets = () => {
        return [...document.querySelectorAll('textarea:not(.g-recaptcha-response)')].filter(el => isVisible(el));
    }

    const checkTargets = () => {
        const targets = getInjectionTargets();
        if (targets.length) {
            di(targets);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkTargets, { once: true });
    } else {
        checkTargets();
    }

    // Look for every new toolbar/menubar target for script button injection.
    const mo = new MutationObserver(checkTargets);
    // Start observing the body in case new editor elements appear on the page.
    mo.observe(document.documentElement, { childList: true, subtree: true }); // Only observing document.documentElement allows tracking all editor appearances during SPA navigation.

    const fallbackTargetsCheckInterval = setInterval(checkTargets, 3000);
    window.addEventListener('beforeunload', () => clearInterval(fallbackTargetsCheckInterval));

    const _wrap = m => {
        const orig = history[m];
        return (...args) => {
            const ret = orig.apply(history, args);
            window.dispatchEvent(new Event('locationchange'));

            return ret;
        };
    };
    history.pushState = _wrap('pushState');
    history.replaceState = _wrap('replaceState');
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('locationchange', () => {
        if (popupContainerEl) popupContainerEl.style.display = 'none'; // Hide the popup on other page navigation.
        checkTargets();
    }, { passive: true });
    window.addEventListener('pageshow', checkTargets, { passive: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) checkTargets(); }, { passive: true });
})();