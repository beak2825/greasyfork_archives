// ==UserScript==
// @name         Flight Rising - Custom Color Dropdowns + Predict Morphology
// @description  Replaces color dropdowns with searchable custom ones that show full color backgrounds. Adds next/prev buttons, auto-predict, and image code copy.
// @namespace    Original by https://greasyfork.org/en/users/547396
// @match        *://*.flightrising.com/scrying/predict*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @version      1.5
// @downloadURL https://update.greasyfork.org/scripts/555946/Flight%20Rising%20-%20Custom%20Color%20Dropdowns%20%2B%20Predict%20Morphology.user.js
// @updateURL https://update.greasyfork.org/scripts/555946/Flight%20Rising%20-%20Custom%20Color%20Dropdowns%20%2B%20Predict%20Morphology.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = document.getElementById('predict-morphology'),
          optionsBlock = container.getElementsByClassName('scry-options')[0],
          commonRows = optionsBlock.getElementsByClassName('common-row'),
          predictBtn = document.getElementById('scry-button'),
          loadBtn = document.getElementById('load-morphology'),
          scryLoad = document.getElementsByClassName('scry-load')[0],
          copyBtn = document.createElement('button'),
          copyPasta = document.createElement('input');

    const style = document.createElement('style');
    style.textContent = `
        #predict-morphology .scry-preview {
            width: 330px;
        }

        #predict-morphology .scry-options .common-column:first-child {
            font-weight: bold;
            color: white;
            text-shadow: -2px -2px 0px rgb(115 29 8 / 41%), -2px -1px 0px rgb(115 29 8 / 90%), -2px 0px 0px rgb(115 29 8 / 99%), -2px 1px 0px rgb(115 29 8 / 89%), -2px 2px 0px rgb(115 29 8 / 42%), -1px -2px 0px rgb(115 29 8 / 89%), -1px -1px 0px rgb(115 29 8), -1px 0px 0px rgb(115 29 8), -1px 1px 0px rgb(115 29 8), -1px 2px 0px rgb(115 29 8 / 91%), 0px -2px 0px rgb(115 29 8), 0px -1px 0px rgb(115 29 8), 0px 0px 0px rgb(115 29 8), 0px 1px 0px rgb(115 29 8), 0px 2px 0px rgb(115 29 8 / 99%), 1px -2px 0px rgb(115 29 8 / 87%), 1px -1px 0px rgb(115 29 8), 1px 0px 0px rgb(115 29 8), 1px 1px 0px rgb(115 29 8), 1px 2px 0px rgb(115 29 8 / 83%), 2px -2px 0px rgb(115 29 8 / 35%), 2px -1px 0px rgb(115 29 8 / 87%), 2px 0px 0px rgb(115 29 8 / 98%), 2px 1px 0px rgb(115 29 8 / 89%), 2px 2px 0px rgb(115 29 8 / 41%);
        }

        #predict-morphology .scry-options {
            padding: 45px 0 0 25px
        }

        .custom-dropdown {
            position: relative;
            display: inline-block;
            width: 90%;
            font-family: inherit;
        }

        .custom-dropdown-selected {
            display: flex;
            align-items: center;
            padding: 2px 4px;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
        }

        .custom-dropdown-selected:hover {
            border-color: #888;
        }

        .custom-dropdown.open .custom-dropdown-selected {
            border-color: #4a90e2;
        }

        .color-swatch {
            display: none;
        }

        .custom-dropdown-arrow {
            margin-left: auto;
            font-size: 10px;
        }

        .custom-dropdown-panel {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 4px;
            background: white;
            border: 1px solid #4a90e2;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: none;
            max-height: 300px;
            overflow: hidden;
            flex-direction: column;
        }

        .custom-dropdown.open .custom-dropdown-panel {
            display: flex;
        }

        .custom-dropdown-search {
            padding: 8px;
            border-bottom: 1px solid #eee;
        }

        .custom-dropdown-search input {
            width: 100%;
            padding: 2px 4px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .custom-dropdown-search input:focus {
            outline: none;
            border-color: #4a90e2;
        }

        .custom-dropdown-options {
            overflow-y: auto;
            max-height: 250px;
        }

        .custom-dropdown-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 8px;
            cursor: pointer;
            user-select: none;
            border: 1px solid transparent;
        }

        .custom-dropdown-option:hover {
            border-color: #333;
        }

        .custom-dropdown-option.selected {
            border-color: #4a90e2;
            box-shadow: inset 0 0 0 1px #4a90e2;
        }

        .custom-dropdown-option.hidden {
            display: none;
        }

        .custom-dropdown-option.filtered-out {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    function getColorFromElement(element) {
        const computed = window.getComputedStyle(element);
        return computed.backgroundColor || computed.color || '#cccccc';
    }

    // determine if color is light or dark for easier to read text
    function isLightColor(color) {
        const temp = document.createElement('div');
        temp.style.color = color;
        document.body.appendChild(temp);
        const rgb = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);

        const match = rgb.match(/\d+/g);
        if (!match) return true;

        const [r, g, b] = match.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5;
    }

    // get text color based on background
    function getTextColor(backgroundColor) {
        return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
    }

    const ancientBreeds = ['Gaoler', 'Banescale', 'Veilspun', 'Undertide', 'Aberration', 'Sandsurge', 'Auraboa', 'Thorntail'];

    // Check if selected breed is Ancient
    function isAncientBreed() {
        const breedSelect = document.querySelector('select[name="breed"]');
        if (!breedSelect) return false;

        const selectedOption = breedSelect.options[breedSelect.selectedIndex];
        const breedText = selectedOption.textContent.trim();

        return ancientBreeds.some(ancient => breedText.includes(ancient));
    }

    function filterGeneOptions() {
        const breedSelect = document.querySelector('select[name="breed"]');
        if (!breedSelect) return;

        const selectedOption = breedSelect.options[breedSelect.selectedIndex];
        const breedText = selectedOption.textContent.trim();

        const isAncient = ancientBreeds.some(ancient => breedText.includes(ancient));
        const currentBreed = ancientBreeds.find(ancient => breedText.includes(ancient));

        const geneSelects = ['bodygene', 'winggene', 'tertgene'];

        geneSelects.forEach(geneName => {
            const geneSelect = document.querySelector(`select[name="${geneName}"]`);
            if (!geneSelect) return;

            const row = geneSelect.closest('.common-row');
            const customDropdown = row.querySelector('.custom-dropdown');
            if (!customDropdown) return;

            const optionsContainer = customDropdown.querySelector('.custom-dropdown-options');
            if (!optionsContainer) return;

            // filter options in custom dropdown
            optionsContainer.querySelectorAll('.custom-dropdown-option').forEach(optionEl => {
                const text = optionEl.querySelector('.color-name').textContent;
                const hasParentheses = text.includes('(') && text.includes(')');

                if (isAncient && currentBreed) {
                    const hasBreedName = text.includes(`(${currentBreed})`);
                    if (!hasBreedName) {
                        optionEl.classList.add('filtered-out');
                    } else {
                        optionEl.classList.remove('filtered-out');
                    }
                } else {
                    if (hasParentheses) {
                        optionEl.classList.add('filtered-out');
                    } else {
                        optionEl.classList.remove('filtered-out');
                    }
                }
            });

            // disable/enable options in the original select element
            Array.from(geneSelect.options).forEach(option => {
                const text = option.textContent.trim();
                const hasParentheses = text.includes('(') && text.includes(')');

                if (isAncient && currentBreed) {
                    const hasBreedName = text.includes(`(${currentBreed})`);
                    option.disabled = !hasBreedName;
                } else {
                    option.disabled = hasParentheses;
                }
            });
        });
    }

    // create the custom dropdown
    function createCustomDropdown(originalSelect) {
        const container = document.createElement('div');
        container.className = 'custom-dropdown';

        const isColorSelector = originalSelect.name === 'body' ||
                               originalSelect.name === 'wings' ||
                               originalSelect.name === 'tert';

        const options = Array.from(originalSelect.options).map(opt => ({
            value: opt.value,
            text: opt.textContent.trim(),
            className: opt.className,
            element: opt,
            disabled: opt.disabled
        }));

        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        document.body.appendChild(tempContainer);

        options.forEach(opt => {
            const tempEl = document.createElement('span');
            tempEl.className = opt.className;
            tempContainer.appendChild(tempEl);

            if (isColorSelector) {
                opt.color = getColorFromElement(tempEl);
                opt.textColor = getTextColor(opt.color);
            } else {
                opt.color = 'rgb(239, 239, 239)';
                opt.textColor = '#000000';
            }
        });

        document.body.removeChild(tempContainer);

        const selectedIndex = originalSelect.selectedIndex >= 0 ? originalSelect.selectedIndex : 0;
        const selectedOption = options[selectedIndex];

        const selected = document.createElement('div');
        selected.className = 'custom-dropdown-selected';
        selected.style.backgroundColor = selectedOption.color;
        selected.style.color = selectedOption.textColor;
        selected.innerHTML = `
            <span class="color-name">${selectedOption.text}</span>
            <span class="custom-dropdown-arrow">▼</span>
        `;

        const panel = document.createElement('div');
        panel.className = 'custom-dropdown-panel';

        const searchContainer = document.createElement('div');
        searchContainer.className = 'custom-dropdown-search';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search';
        searchContainer.appendChild(searchInput);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-dropdown-options';

        options.forEach((opt, index) => {
            if (opt.disabled) return;

            const optionEl = document.createElement('div');
            optionEl.className = 'custom-dropdown-option';
            if (index === selectedIndex) {
                optionEl.classList.add('selected');
            }
            optionEl.style.backgroundColor = opt.color;
            optionEl.style.color = opt.textColor;
            optionEl.dataset.value = opt.value;
            optionEl.dataset.index = index;
            optionEl.innerHTML = `
                <span class="color-name">${opt.text}</span>
            `;

            optionEl.addEventListener('click', (e) => {
                e.stopPropagation();
                selectOption(index);
            });

            optionsContainer.appendChild(optionEl);
        });

        panel.appendChild(searchContainer);
        panel.appendChild(optionsContainer);
        container.appendChild(selected);
        container.appendChild(panel);

        function selectOption(index) {
            const opt = options[index];

            selected.style.backgroundColor = opt.color;
            selected.style.color = opt.textColor;
            selected.querySelector('.color-name').textContent = opt.text;

            originalSelect.selectedIndex = index;
            originalSelect.dispatchEvent(new Event('change', { bubbles: true }));

            optionsContainer.querySelectorAll('.custom-dropdown-option').forEach((el, i) => {
                el.classList.toggle('selected', i === index);
            });

            if (originalSelect.name === 'breed') {
                setTimeout(() => {
                    filterGeneOptions();
                }, 50);
            }

            predict();

            container.classList.remove('open');
            searchInput.value = '';
            filterOptions('');
        }

        function filterOptions(searchTerm) {
            const term = searchTerm.toLowerCase();
            optionsContainer.querySelectorAll('.custom-dropdown-option').forEach(optionEl => {
                if (optionEl.classList.contains('filtered-out')) {
                    return;
                }

                const text = optionEl.querySelector('.color-name').textContent.toLowerCase();
                if (text.includes(term)) {
                    optionEl.classList.remove('hidden');
                } else {
                    optionEl.classList.add('hidden');
                }
            });
        }

        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasOpen = container.classList.contains('open');

            document.querySelectorAll('.custom-dropdown.open').forEach(dd => {
                dd.classList.remove('open');
            });

            if (!wasOpen) {
                container.classList.add('open');
                searchInput.focus();
                searchInput.value = '';
                filterOptions('');
            }
        });

        searchInput.addEventListener('input', (e) => {
            filterOptions(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            const visibleOptions = Array.from(optionsContainer.querySelectorAll('.custom-dropdown-option:not(.hidden):not(.filtered-out)'));

            if (e.key === 'Enter' && visibleOptions.length > 0) {
                e.preventDefault();
                const firstVisible = visibleOptions[0];
                selectOption(parseInt(firstVisible.dataset.index));
            } else if (e.key === 'Escape') {
                container.classList.remove('open');
                searchInput.value = '';
                filterOptions('');
            }
        });

        return container;
    }

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown.open').forEach(dd => {
            dd.classList.remove('open');
            const searchInput = dd.querySelector('.custom-dropdown-search input');
            if (searchInput) {
                searchInput.value = '';
                dd.querySelectorAll('.custom-dropdown-option').forEach(opt => {
                    opt.classList.remove('hidden');
                });
            }
        });
    });

    init();

    function init() {
        const sexLabels = document.querySelectorAll('.common-column span[aria-hidden="true"]');
        sexLabels.forEach(label => {
            if (label.textContent.includes('♀') || label.textContent.includes('♂')) {
                label.textContent = 'Sex:';
                label.removeAttribute('aria-hidden');
                const screenReaderSpan = label.parentElement.querySelector('.common-screen-reader');
                if (screenReaderSpan) {
                    screenReaderSpan.style.display = 'none';
                }
            }
        });

        buildCopy();
        loadScryUrl();
        loadSettings();

        for (let row of commonRows) {
            let selector = row.getElementsByTagName('select')[0],
                shuffle = row.getElementsByClassName('scry-shuffle')[0],
                selectName = selector.name,
                col = selector.parentNode;

            selector.style.display = 'none';
            shuffle.style.right = '-28px';
            col.style.display = 'flex';
            col.style.alignItems = 'center';
            col.style.columnGap = '.2rem';

            const customDropdown = createCustomDropdown(selector);
            customDropdown.style.order = 2;
            col.insertBefore(customDropdown, selector);

            appendDownSelect(col, selector, selectName, true);
            appendDownSelect(col, selector, selectName, false);
        }
        predictBtn.addEventListener('click', loadScryUrl);

        filterGeneOptions();
    }

    function appendDownSelect(col, selector, name, down) {
        const downAction = document.createElement('button');
        downAction.innerHTML = down ? '▼' : '▲';
        downAction.name = name;
        downAction.style.order = down ? 3 : 1;
        downAction.style.fontSize = '9pt'

        downAction.addEventListener('click', e => {
            changeSelect(selector, down, e);
        });

        col.appendChild(downAction);
    }

    function changeSelect(selector, dir, e) {
        const select = selector;
        const direction = dir ? 1 : -1;

        const collectionArr = Array
            .from(select.options)
            .reduce((arr, opt, idx) => {
                if (!opt.disabled) arr.push(idx);
                return arr;
            }, []);

        const pos = collectionArr.indexOf(select.selectedIndex);
        const length = collectionArr.length;
        const nextPos = (pos + direction + length) % length;

        select.selectedIndex = collectionArr[nextPos];

        const row = select.closest('.common-row');
        const customDropdown = row.querySelector('.custom-dropdown');
        if (customDropdown) {
            const selectedOption = select.options[select.selectedIndex];

            const isColorSelector = select.name === 'body' ||
                                   select.name === 'wings' ||
                                   select.name === 'tert';

            let color, textColor;

            if (isColorSelector) {
                const tempEl = document.createElement('span');
                tempEl.className = selectedOption.className;
                document.body.appendChild(tempEl);
                color = getColorFromElement(tempEl);
                textColor = getTextColor(color);
                document.body.removeChild(tempEl);
            } else {
                color = '#efefef';
                textColor = '#000000';
            }

            const selectedDiv = customDropdown.querySelector('.custom-dropdown-selected');
            selectedDiv.style.backgroundColor = color;
            selectedDiv.style.color = textColor;
            selectedDiv.querySelector('.color-name').textContent = selectedOption.textContent.trim();
        }

        if (select.name === 'breed') {
            setTimeout(() => {
                filterGeneOptions();
            }, 50);
        }

        predict();
    }

    function buildCopy() {
        scryLoad.style.height = '145px';
        copyBtn.classList.add('beigebutton');
        copyBtn.classList.add('thingbutton');
        copyBtn.style.width = '100%';
        copyBtn.innerText = 'Copy Image BBC Code';
        scryLoad.appendChild(copyPasta);
        scryLoad.appendChild(copyBtn);
        copyBtn.addEventListener('click', copyToClipboard);
    }

    function loadScryUrl() {
        copyPasta.value = 'loading...';

        setTimeout(function(){
            copyPasta.value = '[img]' + getDragonImage() + '[/img]';
        }, 500);
    }

    function getDragonImage() {
        const dImg = document.getElementById('dragon-image'),
              dImgSrc = dImg.getElementsByTagName('img')[0].src;

        return dImgSrc;
    }

    function loadSettings() {
        const settingsContainer = document.createElement('div');

        let autoCopy = createCheck('autoCopy', 'Automatically Copy');
        let growUp = createCheck('growUp', 'Adult On Load');

        container.appendChild(settingsContainer);
        settingsContainer.style.position = 'absolute';
        settingsContainer.style.top = '0';
        settingsContainer.appendChild(autoCopy);
        settingsContainer.appendChild(growUp);
    }

    function copyToClipboard() {
        copyPasta.select();
        copyPasta.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(copyPasta.value);
        document.execCommand('copy');

        appendMessage();
    }

    function appendMessage() {
        const message = document.createElement('div');

        message.innerHTML = 'copied to clipboard';
        scryLoad.appendChild(message);

        message.style.font = 'italic normal 9px Times, serif';
        message.style.margin = '3px 0';

        setTimeout(function() {
            scryLoad.removeChild(message);
        }, 1000);
    }

    function createCheck(name, label) {
        let itemContainer = document.createElement('div'),
            checkboxInput = document.createElement('input'),
            checkboxLabel = document.createElement('label'),
            getSavedVal = localStorage.getItem(name);

        checkboxInput.type = 'checkbox';
        checkboxInput.id = name;
        checkboxInput.name = name;

        checkboxLabel.innerText = label;
        checkboxLabel.setAttribute('for', name);

        itemContainer.appendChild(checkboxInput);
        itemContainer.appendChild(checkboxLabel);

        itemContainer.style.display = 'flex';
        itemContainer.style.alignItems = 'center';
        itemContainer.style.font = 'normal 10px/15px arial, sans-serif';
        checkboxLabel.style.paddingLeft = '.5rem';

        checkboxInput.checked = (getSavedVal == 'true') ? true : false;
        checkboxInput.addEventListener('click', updateSetting);

        applySetting(name, getSavedVal);

        return itemContainer;
    }

    function applySetting(name, returnVal) {
        if (name == 'growUp' && returnVal == 'true') {
            let ageVal = document.getElementsByName('age')[0];

            if (ageVal.value == 0) {
                changeSelect(ageVal);
            }
        }

        if (name == 'autoCopy' && returnVal == 'true') {
            setTimeout(function(){
                copyToClipboard();
            }, 1000);
        }
    }

    function updateSetting(e) {
        localStorage.setItem(e.target.name, e.target.checked);
    }

    function predict() {
        predictBtn.click();
    }

})();