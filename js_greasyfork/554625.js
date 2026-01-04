// ==UserScript==
// @name         spurdo
// @namespace    http://tampermonkey.net/
// @description  spurdo helper
// @author       You
// @match        https://spurdoverse.app/*
// @match        https://*.spurdoverse.app/*
// @grant        none
// @version 0.0.1.20251103101550
// @downloadURL https://update.greasyfork.org/scripts/554625/spurdo.user.js
// @updateURL https://update.greasyfork.org/scripts/554625/spurdo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isUIVisible = false;
    let container = null;

    function createSideUI() {
        if (container) {
            return;
        }

        container = document.createElement('div');
        container.id = 'side-tempermonkey';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: #2d3748;
            border: 1px solid #4a5568;
            border-left: none;
            border-radius: 0 0 0 8px;
            padding: 12px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            width: 200px;
            color: white;
            box-shadow: -2px 0 8px rgba(0,0,0,0.2);
        `;

        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 12px;">
                <div style="font-size: 14px; font-weight: bold;">Настройки</div>
            </div>

            <div style="margin-bottom: 10px;">
                <div style="font-size: 12px; margin-bottom: 4px; color: #cbd5e0;">PATTERN</div>
                <input type="text" id="side-pattern" placeholder="0-1000"
                       style="width: 100%; padding: 6px; border: 1px solid #4a5568; border-radius: 4px; background: #4a5568; color: white; font-size: 12px;">
            </div>

            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; margin-bottom: 4px; color: #cbd5e0;">WEAR</div>
                <input type="text" id="side-wear" placeholder="0.000-1.000"
                       style="width: 100%; padding: 6px; border: 1px solid #4a5568; border-radius: 4px; background: #4a5568; color: white; font-size: 12px;">
            </div>

            <button id="side-apply"
                    style="width: 100%; background: #4299e1; color: white; border: none; padding: 8px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer; margin-bottom: 8px;">
                Применить
            </button>

            <button id="side-close"
                    style="width: 100%; background: #718096; color: white; border: none; padding: 6px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                Закрыть
            </button>

            <div id="side-status" style="margin-top: 8px; font-size: 11px; text-align: center; height: 14px; color: #48bb78;"></div>
        `;

        document.body.appendChild(container);

        document.getElementById('side-apply').addEventListener('click', applyAllValues);
        document.getElementById('side-close').addEventListener('click', closeUI);

        document.getElementById('side-pattern').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') applyAllValues();
        });
        document.getElementById('side-wear').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') applyAllValues();
        });

        document.getElementById('side-pattern').focus();
        isUIVisible = true;
    }

    function closeUI() {
        if (container) {
            container.remove();
            container = null;
        }
        isUIVisible = false;
    }

    function applyAllValues() {
        const patternApplied = applyPattern();
        const wearApplied = applyWear();
        updateStatus(patternApplied, wearApplied);
    }

    function applyPattern() {
        const patternValue = document.getElementById('side-pattern').value.trim();
        if (patternValue !== '') {
            const patternNum = parseFloat(patternValue.replace(',', '.'));
            if (!isNaN(patternNum) && patternNum >= 0 && patternNum <= 1000) {
                const patternInputs = document.querySelectorAll('input[type="range"][min="0"][max="1000"][step="1"]');
                patternInputs.forEach(input => {
                    input.value = patternNum;
                    input.setAttribute('value', patternNum.toString());
                    triggerAllEvents(input);
                    updateProgressBar(input, patternNum / 1000);
                });
                updatePatternText(patternNum);
                return true;
            }
        }
        return false;
    }

    function applyWear() {
        const wearValue = document.getElementById('side-wear').value.trim();
        if (wearValue !== '') {
            const wearNum = parseFloat(wearValue.replace(',', '.'));
            if (!isNaN(wearNum) && wearNum >= 0 && wearNum <= 1) {
                const wearInputs = document.querySelectorAll('input[type="range"][min="0"][max="1"][step="0.001"]');
                wearInputs.forEach(input => {
                    input.step = 'any';
                    input.value = wearNum;
                    input.setAttribute('value', wearNum.toString());
                    triggerAllEvents(input);
                    updateProgressBar(input, wearNum);
                });
                updateWearTextExact(wearNum);
                return true;
            }
        }
        return false;
    }

    function updateStatus(patternApplied, wearApplied) {
        const status = document.getElementById('side-status');
        let message = '';

        const applied = [];
        if (patternApplied) applied.push('Pattern');
        if (wearApplied) applied.push('Wear');

        if (applied.length > 0) {
            message = '✓ ' + applied.join(', ');
            status.style.color = '#48bb78';
        } else {
            message = '✗ Ошибка ввода';
            status.style.color = '#f56565';
        }

        status.textContent = message;
        setTimeout(() => { status.textContent = ''; }, 3000);
    }

    function triggerAllEvents(element) {
        ['input', 'change', 'blur'].forEach(eventType => {
            element.dispatchEvent(new Event(eventType, {
                bubbles: true,
                cancelable: true
            }));
        });
    }

    function updateProgressBar(input, percentage) {
        const progressBar = input.parentElement?.querySelector('span[style*="width"]');
        if (progressBar) {
            progressBar.style.width = (percentage * 100) + '%';
        }
    }

    function updatePatternText(value) {
        document.querySelectorAll('.option-input-value').forEach(el => {
            const parent = el.closest('.option-input-label-with-value');
            if (parent) {
                const label = parent.querySelector('.option-input-label');
                if (label && (label.textContent.includes('Pattern') || label.textContent.includes('Паттерн'))) {
                    el.textContent = Math.round(value);
                }
            }
        });
    }

    function updateWearTextExact(value) {
        document.querySelectorAll('.option-input-value').forEach(el => {
            const parent = el.closest('.option-input-label-with-value');
            if (parent) {
                const label = parent.querySelector('.option-input-label');
                if (label && (label.textContent.includes('Wear') || label.textContent.includes('Износ'))) {
                    el.textContent = value.toFixed(3);
                }
            }
        });
    }

    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'side-toggle-btn';
        toggleBtn.innerHTML = '⚡';
        toggleBtn.title = 'Открыть настройки Pattern и Wear';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: #4299e1;
            color: white;
            border: none;
            width: 30px;
            height: 40px;
            border-radius: 6px 0 0 6px;
            font-weight: bold;
            cursor: pointer;
            z-index: 9998;
            box-shadow: -2px 0 6px rgba(0,0,0,0.2);
            font-size: 14px;
            transition: all 0.2s;
        `;

        toggleBtn.addEventListener('mouseenter', function() {
            this.style.background = '#3182ce';
        });

        toggleBtn.addEventListener('mouseleave', function() {
            this.style.background = '#4299e1';
        });

        toggleBtn.addEventListener('click', function() {
            if (isUIVisible) {
                closeUI();
            } else {
                createSideUI();
            }
        });

        document.body.appendChild(toggleBtn);
    }

    function setupGlobalHotkeys() {
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'O') {
                e.preventDefault();
                if (isUIVisible) {
                    closeUI();
                } else {
                    createSideUI();
                }
            }
        });
    }

    function init() {
        if (!window.location.hostname.includes('spurdoverse.app')) {
            return;
        }

        createToggleButton();
        setupGlobalHotkeys();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();