// ==UserScript==
// @name         Replace FFz Color Picker
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  replace FFz Color Picker
// @author       t7k7t,gu,ug
// @match        https://www.twitch.tv/*
// @icon         https://png.pngtree.com/png-vector/20220703/ourmid/pngtree-send-dark-mode-glyph-icon-png-image_5561369.png
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555305/Replace%20FFz%20Color%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/555305/Replace%20FFz%20Color%20Picker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция debounce (ИЗМЕНЕНО: вынесена outside, как во втором скрипте)
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Ваша функция replacePicker (без изменений, кроме debounce-адаптации)
    function replacePicker(mutation) {
        // ИЗМЕНЕНО: используем debounce-функцию
        const debouncedReplace = debounce(() => {
            const newPickers = Array.from(mutation.addedNodes).filter(node =>
                node.nodeType === 1 && node.classList && node.classList.contains('vc-sketch')
            ).concat(
                Array.from(mutation.target.querySelectorAll('.vc-sketch')).filter(picker =>
                    !picker.dataset.replaced
                )
            );
            newPickers.forEach(existingPicker => {
                if (existingPicker.dataset.replaced) return;
                const widget = existingPicker.closest('.ffz--color-widget');
                if (!widget) return;
                const colorInput = widget.querySelector('input[type="text"]');
                const previewFigure = widget.querySelector('figure');
                if (!colorInput || !previewFigure) return;
                let currentColor = previewFigure.style.backgroundColor ||
                                  existingPicker.querySelector('.vc-sketch-active-color')?.style.backgroundColor || ' #000000';
                currentColor = rgbToHex(currentColor); // Функция определена ниже
                const presets = [
                    '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
                    '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
                    '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'
                ];
                const presetsHtml = presets.map(color =>
                    `<button type="button" class="preset-btn" data-color="${color}"
                              style="width: 20px; height: 20px; border: 1px solid #ccc; border-radius: 3px; margin: 2px; cursor: pointer; background-color: ${color};"></button>`
                ).join('');
                const timestamp = Date.now();  // ИЗМЕНЕНО: вынесено для ясности
                const newHtml = `
                    <div role="application" aria-label="Цветовой пикер" id="my-coolest-ffz-custom-color-palette-picker-x678n8mn8mn" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <label for="simple-color-${timestamp}" style="font-size: 12px; color: #73c5b0;">My ffz custom color palette :</label>
                            <input type="color" id="simple-color-${timestamp}" value="${currentColor}" style="width: 40px; height: 28px; border: none; cursor: pointer; border-radius: 3px;">
                            <input type="text" id="hex-field-${timestamp}" value="${currentColor}" placeholder="#HEX" style="width: 70px; padding: 4px; border: 1px solid #ccc; border-radius: 3px; font-size: 12px;" maxlength="7">
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; max-width: 160px; justify-content: center;">
                            ${presetsHtml}
                        </div>
                        <div id="preview-block-${timestamp}" style="width: 40px; height: 28px; border: 1px solid #ccc; border-radius: 3px; margin-top: 8px; background-color: ${currentColor};"></div>
                    </div>
                `;
                existingPicker.innerHTML = newHtml;
                existingPicker.dataset.replaced = 'true';
                const simpleColorInput = existingPicker.querySelector('input[type="color"]');
                const hexField = existingPicker.querySelector('input[type="text"]');
                const previewBlock = existingPicker.querySelector(`#preview-block-${timestamp}`);
                function rgbToHex(rgb) {
                    if (rgb.startsWith('#')) return rgb.toUpperCase();
                    const match = rgb.match(/\d+/g);
                    if (match && match.length >= 3) {
                        return `#${match.slice(0,3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
                    }
                    return '#000000';
                }
                function updateColor(newColor) {
                    const hex = rgbToHex(newColor).toUpperCase();
                    colorInput.value = hex;
                    previewFigure.style.backgroundColor = hex;
                    simpleColorInput.value = hex;
                    hexField.value = hex;
                    previewBlock.style.backgroundColor = hex;
                    colorInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                    colorInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
                    colorInput.dispatchEvent(new CustomEvent('color-change', { detail: { color: hex }, bubbles: true, composed: true }));
                    console.log('Цвет обновлен для', colorInput.id, ':', hex);
                }
                simpleColorInput.addEventListener('input', (e) => updateColor(e.target.value));
                simpleColorInput.addEventListener('change', (e) => updateColor(e.target.value));
                let debounceTimer;
                hexField.addEventListener('input', (e) => {
                    clearTimeout(debounceTimer);
                    const value = e.target.value.trim().toUpperCase();
                    debounceTimer = setTimeout(() => {
                        if (value.startsWith('#') && /^#[0-9A-F]{3,6}$/i.test(value)) {
                            updateColor(value);
                        }
                    }, 200);
                });
                existingPicker.querySelectorAll('.preset-btn').forEach(btn => {
                    btn.addEventListener('click', () => updateColor(btn.dataset.color));
                });
                updateColor(currentColor);
                console.log('Палитра заменена для пикера'); // ИЗМЕНЕНО: добавлен лог для диагностики
            });
        }, 100);
        debouncedReplace();
    }

    // ИЗМЕНЕНО: добавлена функция для периодической проверки (как во втором скрипте)
    function checkAndReplacePickers() {
        document.querySelectorAll('.vc-sketch:not([data-replaced])').forEach(picker => {
            const mockMutation = { addedNodes: [picker], target: picker.parentNode };
            replacePicker(mockMutation);
        });
    }

    // ИЗМЕНЕНО: click listener с debounce (адаптирован)
    let clickDebounceTimer;
    document.addEventListener('click', (e) => {
        if (e.target.closest('.ffz-color-preview')) {
            clearTimeout(clickDebounceTimer);
            clickDebounceTimer = setTimeout(() => {
                setTimeout(() => {
                    const picker = document.querySelector('.vc-sketch:not([data-replaced])');
                    if (picker) {
                        const mockMutation = { addedNodes: [picker], target: picker.parentNode };
                        replacePicker(mockMutation);
                    }
                }, 50);
            }, 100);
        }
    }, true);

    // ИЗМЕНЕНО: cleanup (как во втором)
    function cleanup() {
        if (window.myFFZObserver) {
            window.myFFZObserver.disconnect();
            window.myFFZObserver = null;
        }
        if (window.myUrlObserver) {
            window.myUrlObserver.disconnect();
            window.myUrlObserver = null;
        }
        if (window.myInterval) {
            clearInterval(window.myInterval);
            window.myInterval = null;
        }
        if (window.originalPushState) {
            history.pushState = window.originalPushState;
            window.originalPushState = null;
        }
        if (window.originalReplaceState) {
            history.replaceState = window.originalReplaceState;
            window.originalReplaceState = null;
        }
    }

    // ИЗМЕНЕНО: initScript (observer + interval + history override)
    function initScript() {
        if (window.myFFZObserver || window.myInterval) {
            return;
        }
        // MutationObserver для .vc-sketch
        window.myFFZObserver = new MutationObserver((mutations) => {
            mutations.forEach(replacePicker);
        });
        window.myFFZObserver.observe(document.body, { childList: true, subtree: true });
        // Периодическая проверка (ИЗМЕНЕНО: добавлено)
        window.myInterval = setInterval(checkAndReplacePickers, 1000);
        // History override (ИЗМЕНЕНО: добавлено, как во втором)
        if (!window.originalPushState) {
            window.originalPushState = history.pushState;
            history.pushState = function() {
                window.originalPushState.apply(this, arguments);
                checkAndReplacePickers();
            };
        }
        if (!window.originalReplaceState) {
            window.originalReplaceState = history.replaceState;
            history.replaceState = function() {
                window.originalReplaceState.apply(this, arguments);
                checkAndReplacePickers();
            };
        }
        // Проверка existing при init
        checkAndReplacePickers();
        console.log('Инициализация палитры: observers и interval активны'); // ИЗМЕНЕНО: лог
    }

    // ИЗМЕНЕНО: monitorUrlChanges (как во втором, но на document)
    function monitorUrlChanges() {
        let lastUrl = location.href;
        window.myUrlObserver = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                cleanup();
                initScript();
                console.log('Перезапуск палитры для URL:', currentUrl); // ИЗМЕНЕНО: лог
            }
        });
        window.myUrlObserver.observe(document, { subtree: true, childList: true });
    }

    // ИЗМЕНЕНО: init (как во втором)
    function init() {
        cleanup();
        initScript();
        monitorUrlChanges();
    }

    // Запуск (ИЗМЕНЕНО: как во втором)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
        window.addEventListener('load', init);
    }
    init();

    // ИЗМЕНЕНО: visibilitychange (как во втором)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkAndReplacePickers();
        }
    });

    // CSS (без изменений)
    const css = `
        #my-coolest-ffz-custom-color-palette-picker-x678n8mn8mn {
            width: 325px;
            background: #182928 !important;
            border-radius: 5px !important;
            border: 2px solid #009688 !important;
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
    console.log('CSS для палитры добавлен');
})();




// css ffz ffz-custom-color-palette-picker //