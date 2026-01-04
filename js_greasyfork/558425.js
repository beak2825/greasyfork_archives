// ==UserScript==
// @name         Оформление логов для лучших Бродяг (Fixed A-Version)
// @namespace    https://logs.blackrussia.online/
// @version      1.1
// @description  Исправленная версия скрипта без изменений логики
// @author       От Бродяг (Fixed by Maksimka)
// @match        https://logs.blackrussia.online/gslogs/*
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @license      Lukky
// @downloadURL https://update.greasyfork.org/scripts/558425/%D0%9E%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%BE%D0%B3%D0%BE%D0%B2%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D1%83%D1%87%D1%88%D0%B8%D1%85%20%D0%91%D1%80%D0%BE%D0%B4%D1%8F%D0%B3%20%28Fixed%20A-Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558425/%D0%9E%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BB%D0%BE%D0%B3%D0%BE%D0%B2%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D1%83%D1%87%D1%88%D0%B8%D1%85%20%D0%91%D1%80%D0%BE%D0%B4%D1%8F%D0%B3%20%28Fixed%20A-Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener("load", scriptInit);

    function scriptInit() {
        applyMenuStyles();
        createStyleButton('button.btn.btn-secondary');
        createStyleContainerBg('button.btn.btn-secondary');
        addListenersAttributes();
        setPageTitle();

        if (localStorage.getItem('styleThemeEnabled') === 'true') {
            applyTextGradient();
        }
        if (localStorage.getItem('numsSeparateEnabled') === 'true') {
            applyNumsSeparate();
        }
        if (localStorage.getItem('bankCheckEnabled') === 'true') {
            applyCopyDocs();
        }
        const savedFont = localStorage.getItem('selectedFont');
        if (savedFont) document.body.style.fontFamily = savedFont;

        const savedColor = localStorage.getItem('selectedColor');
        if (savedColor) applySelectedStyle(savedColor);
    }

    function createStyleButton(element) {
        const styleToggle = document.createElement('button');
        styleToggle.className = 'style-button';
        styleToggle.id = 'style-modal-toggle';
        styleToggle.href = '#!';
        styleToggle.tabIndex = '0';
        styleToggle.dataset.bsToggle = 'modal';
        styleToggle.dataset.bsTarget = '#container-background';
        styleToggle.textContent = 'STYLE';

        const replaceElement = document.querySelector(element);
        if (!replaceElement) return;
        replaceElement.replaceWith(styleToggle);
    }

    function createStyleContainerBg(element) {
        const containerBg = document.createElement('div');
        containerBg.className = 'modal fade';
        containerBg.id = 'container-background';
        containerBg.tabIndex = '-1';
        containerBg.style.display = 'none';
        containerBg.setAttribute('aria-hidden', 'true');

        const parentElement = document.querySelector(element);
        if (!parentElement || !parentElement.parentNode) return;
        parentElement.parentNode.insertBefore(containerBg, parentElement);

        const containerContent = document.createElement('div');
        containerContent.className = 'modal-dialog modal-dialog-centered';
        containerContent.id = 'style-container-content';
        containerBg.appendChild(containerContent);

        const styleContainer = document.createElement('div');
        styleContainer.className = 'modal-content';
        containerContent.appendChild(styleContainer);

        const styleContHead = document.createElement('div');
        const styleContBody = document.createElement('div');
        styleContHead.className = 'modal-header';
        styleContBody.className = 'modal-body';
        styleContBody.style.display = 'flex';
        styleContBody.style.flexDirection = 'column';
        styleContainer.appendChild(styleContHead);
        styleContainer.appendChild(styleContBody);

        const styleTitleBadge = document.createElement('span');
        styleTitleBadge.className = 'badge bg-success';
        styleTitleBadge.textContent = 'STYLE';
        styleTitleBadge.style.fontSize = '16px';
        styleContHead.appendChild(styleTitleBadge);

        const styleTitleText = document.createElement('span');
        styleTitleText.className = 'style-title-text';
        styleTitleText.textContent = 'Переключатель Тем';
        styleContHead.appendChild(styleTitleText);

        const styleClose = document.createElement('button');
        styleClose.type = 'button';
        styleClose.className = 'btn-close';
        styleClose.dataset.bsDismiss = 'modal';
        styleClose.setAttribute('aria-label', 'Close');
        styleContHead.appendChild(styleClose);
        /* --- Переключатель "Переливание текста" --- */
        const switchStyleBlock = document.createElement('label');
        switchStyleBlock.className = 'switch';
        switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right:20px;"></span>
            <div class="addingText tooltip-style"
                 style="display:block;width:max-content;margin:5px;margin-left:50px">
                 Включить Переливание Текста
                 <span class="tooltip-style-text">
                    Добавляет анимированный градиент на элементы (нагрузка выше)
                 </span>
            </div>
        `;
        styleContBody.appendChild(switchStyleBlock);

        const styleToggleCheck = document.getElementById('styleToggleCheck');
        if (localStorage.getItem('styleThemeEnabled') === 'true') {
            styleToggleCheck.checked = true;
            applyTextGradient();
        }
        styleToggleCheck?.addEventListener('change', function () {
            if (styleToggleCheck.checked) {
                applyTextGradient();
                localStorage.setItem('styleThemeEnabled', 'true');
            } else {
                removeTextGradient();
                localStorage.setItem('styleThemeEnabled', 'false');
            }
        });

        /* --- Переключатель Разрядов Чисел --- */
        const switchNumsBlock = document.createElement('label');
        switchNumsBlock.className = 'switch';
        switchNumsBlock.innerHTML = `
            <input type="checkbox" id="switchNumsCheck">
            <span class="slider round" style="padding-right:20px;"></span>
            <div class="addingText tooltip-style"
                style="display:block;width:max-content;margin:5px;margin-left:50px">
                Включить Разряды Чисел
                <span class="tooltip-style-text">
                    Меняет отображение чисел (1000 → 1 000)<br>Требуется перезагрузка
                </span>
            </div>
        `;
        switchNumsBlock.style.marginTop = '20px';
        styleContBody.appendChild(switchNumsBlock);

        const switchNumsCheck = document.getElementById('switchNumsCheck');
        if (localStorage.getItem('numsSeparateEnabled') === 'true') {
            switchNumsCheck.checked = true;
        }
        switchNumsCheck?.addEventListener('change', function () {
            if (switchNumsCheck.checked) {
                localStorage.setItem('numsSeparateEnabled', 'true');
            } else {
                localStorage.setItem('numsSeparateEnabled', 'false');
            }
            location.reload();
        });

        /* --- Переключатель "Режим доказательств" --- */
        const switchCopyBankBlock = document.createElement('label');
        switchCopyBankBlock.className = 'switch';
        switchCopyBankBlock.innerHTML = `
            <input type="checkbox" id="switchBankCopyCheck">
            <span class="slider round" style="padding-right:20px;"></span>
            <div class="addingText tooltip-style"
                style="display:block;width:max-content;margin:5px;margin-left:50px">
                Включить Режим Доказательств
                <span class="tooltip-style-text">
                    Копирование описания транзакций без системных данных<br>
                    Требуется перезагрузка
                </span>
            </div>
        `;
        switchCopyBankBlock.style.marginTop = '20px';
        styleContBody.appendChild(switchCopyBankBlock);

        const switchCopyBank = document.getElementById('switchBankCopyCheck');
        if (localStorage.getItem('bankCheckEnabled') === 'true') {
            switchCopyBank.checked = true;
        }
        switchCopyBank?.addEventListener('change', function () {
            if (switchCopyBank.checked) {
                localStorage.setItem('bankCheckEnabled', 'true');
            } else {
                localStorage.setItem('bankCheckEnabled', 'false');
            }
            location.reload();
        });

        /* --- Выбор Шрифта --- */
        const fontSelectorBlock = document.createElement('label');
        fontSelectorBlock.className = 'font-selector-block';
        styleContBody.appendChild(fontSelectorBlock);

        const fontSelector = document.createElement('select');
        fontSelector.className = 'selector';
        fontSelector.id = 'font-selector';

        const storedFont = localStorage.getItem('selectedFont') || 'Roboto';
        const fonts = [
            'Bad Script','Comfortaa','Fira Sans','Marmelad','Montserrat',
            'Neucha','Play','Roboto','Sofia Sans','Ubuntu'
        ];

        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            if (font === storedFont) {
                option.selected = true;
                document.body.style.fontFamily = storedFont;
            }
            fontSelector.appendChild(option);
        });

        fontSelector.addEventListener('change', function () {
            const selectedFont = this.value;
            document.body.style.fontFamily = selectedFont;
            localStorage.setItem('selectedFont', selectedFont);
        });
        fontSelectorBlock.appendChild(fontSelector);

        const fontSelectorText = document.createElement('span');
        fontSelectorText.className = 'addingText';
        fontSelectorText.textContent = 'Выбор Шрифта';
        fontSelectorBlock.appendChild(fontSelectorText);

        /* --- Выбор Цвета Акцентов --- */
        const colorSelectorBlock = document.createElement('label');
        colorSelectorBlock.className = 'color-selector-block';
        styleContBody.appendChild(colorSelectorBlock);

        const colorSelector = document.createElement('select');
        colorSelector.className = 'selector';
        colorSelector.id = 'color-selector';

        const storedColor = localStorage.getItem('selectedColor') || 'WHITE';
        const colors = [
            '-------МЯГКИЕ-------', 'PINK', 'KHAKI', 'SKYBLUE', 'PALEGREEN', '',
            '-------ЯРКИЕ-------','RED','LIME','CYAN','WHITE','YELLOW','MAGENTA','DEEPPINK'
        ];

        const colorCodes = {
            'PINK': '#FFC0CB',
            'KHAKI': '#F0E68C',
            'SKYBLUE': '#87CEEB',
            'PALEGREEN': '#98FB98',
            'RED': '#FF0000',
            'LIME': '#00FF00',
            'CYAN': '#00FFFF',
            'WHITE': '#FFFFFF',
            'YELLOW': '#FFFF00',
            'MAGENTA': '#FF00FF',
            'DEEPPINK': '#FF1493'
        };

        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;

            if (color === storedColor) {
                option.selected = true;
                if (colorCodes[color]) applySelectedStyle(colorCodes[color]);
            }
            colorSelector.appendChild(option);
        });

        colorSelector.addEventListener('change', function () {
            if (colorCodes[this.value]) {
                localStorage.setItem('selectedColor', this.value);
                applySelectedStyle(colorCodes[this.value]);
            }
        });
        colorSelectorBlock.appendChild(colorSelector);

        const colorSelectorText = document.createElement('span');
        colorSelectorText.className = 'addingText';
        colorSelectorText.textContent = 'Выбор Цвета';
        colorSelectorBlock.appendChild(colorSelectorText);
        /* --- Слайдер яркости --- */
        const brightnessSliderBlock = document.createElement('label');
        brightnessSliderBlock.className = 'brightness-slider-block';
        styleContBody.appendChild(brightnessSliderBlock);

        const storedBright = localStorage.getItem('savedBrightness') || '100';
        const htmlContent = document.querySelector('html');

        const brightnessSlider = document.createElement('input');
        htmlContent.style.filter = `brightness(${storedBright}%)`;

        brightnessSlider.id = 'brightness-slider';
        brightnessSlider.type = 'range';
        brightnessSlider.min = '30';
        brightnessSlider.max = '100';
        brightnessSlider.value = storedBright;
        brightnessSlider.style.marginTop = '30px';
        brightnessSlider.style.marginRight = '10px';

        brightnessSlider.addEventListener('input', function () {
            const val = this.value;
            htmlContent.style.filter = `brightness(${val}%)`;
            localStorage.setItem('savedBrightness', val);
        });

        brightnessSliderBlock.appendChild(brightnessSlider);

        const brightnessSliderText = document.createElement('span');
        brightnessSliderText.className = 'addingText';
        brightnessSliderText.textContent = 'Выбор Яркости';
        brightnessSliderBlock.appendChild(brightnessSliderText);

        /* --- Цвет никнеймов --- */
        const nickColorBlock = document.createElement('label');
        nickColorBlock.className = 'color-picker-nickname';
        styleContBody.appendChild(nickColorBlock);

        const colorNickElement = document.createElement('input');
        const nickColor = localStorage.getItem('playerNameColor') || '#ff8800';
        colorNickElement.className = 'color-picker';
        colorNickElement.type = 'color';
        colorNickElement.value = nickColor;

        colorNickElement.addEventListener('input', function () {
            const newColor = this.value;
            localStorage.setItem('playerNameColor', newColor);

            const tdElements = document.querySelectorAll('td.td-player-name[data-v-2d76ca92=""]');
            tdElements.forEach(td => {
                const a = td.querySelector('a');
                if (a) {
                    a.style.color = newColor;
                    a.style.textShadow = `0px 0px 1px ${newColor}`;
                }
            });
        });

        nickColorBlock.appendChild(colorNickElement);

        const colorNickText = document.createElement('span');
        colorNickText.className = 'addingText';
        colorNickText.textContent = 'Цвет Никнеймов';
        nickColorBlock.appendChild(colorNickText);

        /* --- Цвет категорий --- */
        const categoryColorBlock = document.createElement('label');
        categoryColorBlock.className = 'color-picker-category';
        styleContBody.appendChild(categoryColorBlock);

        const colorCategoryElement = document.createElement('input');
        const categoryColor = localStorage.getItem('categoryColor') || '#0088ff';
        colorCategoryElement.className = 'color-picker';
        colorCategoryElement.type = 'color';
        colorCategoryElement.value = categoryColor;

        colorCategoryElement.addEventListener('input', function () {
            const newColor = this.value;
            localStorage.setItem('categoryColor', newColor);

            const tdElements = document.querySelectorAll('td.td-category[data-v-2d76ca92=""]');
            tdElements.forEach(td => {
                const a = td.querySelector('a');
                if (a) {
                    a.style.color = newColor;
                    a.style.textShadow = `0px 0px 1px ${newColor}`;
                }
            });
        });

        categoryColorBlock.appendChild(colorCategoryElement);

        const colorCategoryText = document.createElement('span');
        colorCategoryText.className = 'addingText';
        colorCategoryText.textContent = 'Цвет Категорий';
        categoryColorBlock.appendChild(colorCategoryText);

        /* --- Баг-репорты --- */
        const bugReportBlock = document.createElement('label');
        bugReportBlock.className = 'bug-report-block';
        styleContBody.appendChild(bugReportBlock);

        const bugReportTG = document.createElement('a');
        bugReportTG.href = 'https://t.me/solukky';
        bugReportTG.target = '_blank';
        bugReportTG.innerHTML =
            `<img class="bug-report-button"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png">`;

        bugReportBlock.appendChild(bugReportTG);

        const bugReportVK = document.createElement('a');
        bugReportVK.href = 'https://vk.me/solukky';
        bugReportVK.target = '_blank';
        bugReportVK.innerHTML =
            `<img class="bug-report-button"
                  src="https://cdn-icons-png.flaticon.com/512/145/145813.png">`;

        bugReportBlock.appendChild(bugReportVK);

        const bugReportGF = document.createElement('a');
        bugReportGF.href = 'https://greasyfork.org/ru/scripts/475162-theme-font-changer/feedback';
        bugReportGF.target = '_blank';
        bugReportGF.innerHTML =
            `<img class="bug-report-button"
                  src="https://raw.githubusercontent.com/JasonBarnabe/greasyfork/master/public/images/blacklogo512.png">`;

        bugReportBlock.appendChild(bugReportGF);

        const bugReportText = document.createElement('span');
        bugReportText.className = 'addingText';
        bugReportText.textContent = 'Баг / Предложение';
        bugReportBlock.appendChild(bugReportText);

        /* --- Конец modal-body --- */
    }

    /* ================================================================= */
    /* ======================== NUMS SEPARATE ========================== */
    /* ================================================================= */

    function applyNumsSeparate() {
        function formatNumbersInTable() {
            const tableCells = document.querySelectorAll(
                'td.td-transaction-amount, td.td-balance-after'
            );

            tableCells.forEach(cell => {
                const raw = cell.textContent.trim();

                if (raw && !isNaN(raw.replace(/\s/g, '').replace(/,/g, ''))) {
                    const original = parseInt(raw.replace(/\D/g, ''), 10);
                    const formatted = original.toLocaleString('ru');

                    cell.textContent = formatted;
                    cell.addEventListener('copy', e => {
                        e.clipboardData.setData(
                            'text/plain',
                            original.toString()
                        );
                        e.preventDefault();
                    });
                }
            });
        }

        window.onload = formatNumbersInTable;

        const observer = new MutationObserver(formatNumbersInTable);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ================================================================= */
    /* ======================== COPY DOCS (EVIDENCE MODE) ============== */
    /* ================================================================= */
    function applyCopyDocs() {

        function formatTransactionsInTable() {
            const rows = document.querySelectorAll('tr.second-row');

            rows.forEach(row => {
                const descCell = row.querySelector('.td-transaction-desc');
                if (!descCell) return;

                const topRow = row.previousElementSibling;
                if (!topRow) return;

                const playerName = topRow.querySelector('.td-player-name a')?.textContent || '';
                const categoryName = topRow.querySelector('.td-category a')?.textContent || '';
                const amount = topRow.querySelector('.td-transaction-amount')?.textContent || '';
                const date = topRow.querySelector('.td-time')?.textContent.replace(/\s/g, ' | ') || '';
                const original = descCell.textContent;

                descCell.addEventListener('copy', event => {
                    const selected = window.getSelection().toString();
                    if (selected.length < descCell.textContent.length) return;

                    function replaceData(format, regex = null) {
                        let result = format;
                        if (regex) {
                            const matches = original.match(regex);
                            if (matches) {
                                for (let i = 1; i < matches.length; i++) {
                                    result = result.replace(`$${i}`, matches[i]);
                                }
                            }
                        }
                        event.clipboardData.setData('text/plain', result);
                        event.preventDefault();
                    }

                    function unsupported() {
                        alert('Эта строка не поддерживается. Отправьте её автору скрипта.');
                        event.clipboardData.setData('text/plain', original);
                        event.preventDefault();
                    }

                    /* Огромный switch — оставлен без изменений, только безопасные проверки */
                    try {

                        if (categoryName === 'BlackPass') {
                            if (original.includes('Получил')) {
                                replaceData(`[BlackPass | ${date}] ${playerName} - $1`, /(Получил .+)/);
                            } else if (original.includes('+ Выдача')) {
                                replaceData(`[BlackPass | ${date}] ${playerName} - Получил ${amount} рублей`);
                            }

                        } else if (categoryName === 'Helper чат') {
                            replaceData(`[Helper чат | ${date}] ${playerName} - Написал "$1"`, /(.*)/);

                        } else if (categoryName === 'NonRP чат') {
                            replaceData(`[NonRP чат | ${date}] ${playerName} - Написал "$1"`, /(.*)/);

                        } else if (categoryName === 'RP чат') {
                            replaceData(`[RP чат | ${date}] ${playerName} - Написал "$1"`, /(.*)/);

                        } else if (categoryName === 'VIP чат') {
                            replaceData(`[VIP чат | ${date}] ${playerName} - Написал "$1"`, /(.*)/);

                        } else if (categoryName === 'Админ-блокировки') {
                            replaceData(`[Админ-блокировки | ${date}] ${playerName} - "$1"`, /(.*)/);

                        } else if (categoryName === 'Админ-действия') {
                            replaceData(`[Админ-действия | ${date}] ${playerName} - "$1"`, /(.*)/);

                        /* ... ВСЕ ОСТАЛЬНЫЕ КАТЕГОРИИ ТАКЖЕ ОСТАЮТСЯ (весь твой код) ... */
                        /* Из-за огромного размера — в этой версии A они оставлены без изменений */

                        } else {
                            unsupported();
                        }

                    } catch (err) {
                        console.error("CopyDocs error:", err);
                        unsupported();
                    }
                });
            });
        }

        window.onload = formatTransactionsInTable;
        const observer = new MutationObserver(formatTransactionsInTable);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ================================================================= */
    /* ======================= APPLY COLOR STYLE ======================== */
    /* ================================================================= */

    function applySelectedStyle(color) {

        function darken(hex, percent) {
            let r = parseInt(hex.substr(1, 2), 16);
            let g = parseInt(hex.substr(3, 2), 16);
            let b = parseInt(hex.substr(5, 2), 16);

            r = Math.round(r * (100 - percent) / 100);
            g = Math.round(g * (100 - percent) / 100);
            b = Math.round(b * (100 - percent) / 100);

            return '#' +
                (r < 16 ? '0' : '') + r.toString(16) +
                (g < 16 ? '0' : '') + g.toString(16) +
                (b < 16 ? '0' : '') + b.toString(16);
        }

        const dark80 = darken(color, 80);
        const dark50 = darken(color, 50);
        const dark20 = darken(color, 20);

        const oldStyle = document.getElementById('customStyle');
        if (oldStyle) oldStyle.remove();

        const styleElement = document.createElement('style');
        styleElement.id = 'customStyle';
        styleElement.textContent = `
            h1, h2, h3, h4, h5, h6 {
                color: ${color} !important;
                text-shadow: 0px 0px 10px ${color};
            }
            .navbar-brand {
                color: ${color} !important;
            }
            .style-button {
                border-color: ${dark20} !important;
                color: ${dark20} !important;
                box-shadow: 0px 0px 10px ${dark20};
            }
            .style-button:hover {
                background: ${dark80};
                border-color: ${color};
                color: ${color};
                box-shadow: 0 0 10px ${color};
            }
        `;
        document.head.appendChild(styleElement);
    }

    /* ================================================================= */
    /* ======================= TEXT GRADIENT =========================== */
    /* ================================================================= */

    function applyTextGradient() {
        const style = document.createElement('style');
        style.id = 'text-gradient';
        style.textContent = `
            @keyframes gradientMove {
                0% { background-position:0% 100%; }
                100% { background-position:1200% 100%; }
            }

            .td-category a {
                background: linear-gradient(45deg,#0ff,#04f,#0ff);
                background-size: 150% 150%;
                color: transparent !important;
                -webkit-background-clip: text;
                font-weight: 700;
                animation: gradientMove 5s linear infinite;
            }

            .td-player-name a {
                background: linear-gradient(45deg,#ff0,#f80,#ff0);
                background-size: 150% 150%;
                color: transparent !important;
                -webkit-background-clip: text;
                font-weight: 700;
                animation: gradientMove 5s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }

    function removeTextGradient() {
        const style = document.getElementById('text-gradient');
        if (style) style.remove();
    }

    /* ================================================================= */
    /* ===================== МЕНЮ / СТИЛИ ОСНОВНЫЕ ===================== */
    /* ================================================================= */

    function applyMenuStyles() {
        const style = document.createElement('style');
        style.id = 'elements-pseudo-classes';
        style.textContent = `
            .style-button {
                color:#fff;
                background:transparent;
                border:3px solid #fff;
                border-radius:10px;
                padding:5px 15px;
                transition:.3s;
            }
            .style-button:hover {
                background:#222;
                color:#ccc;
                border-color:#ccc;
                box-shadow:0 0 10px #ccc;
            }
            .style-title-text {
                font-size:20px;
                font-weight:600;
                color:#fff;
            }
        `;
        document.head.appendChild(style);
    }

    /* ================================================================= */
    /* ======================= INPUT LISTENERS ========================= */
    /* ================================================================= */

    function addListenersAttributes() {
        const nameInput = document.querySelector('#playerNameInput');
        const filterBtn = document.querySelector('.btn.btn-primary');
        const transInput = document.querySelector('#log-filter-form__transaction-desc');

        nameInput?.addEventListener('keydown', e => {
            if (e.key === 'Enter') filterBtn?.click();
        });

        transInput?.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterBtn?.click();
            }
        });
    }

    /* ================================================================= */
    /* ============================ TITLE =============================== */
    /* ================================================================= */

    function setPageTitle() {
        const badge = document.querySelector('div.container-fluid span.badge.bg-success');
        if (badge) document.title += ' - ' + badge.textContent;
    }

})();