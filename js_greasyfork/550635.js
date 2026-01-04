// ==UserScript==
// @name         Кнопки для открытия заказов | БитриксА24 | Сайды
// @namespace    http://tampermonkey.net/
// @version      2
// @description  -
// @match        https://bx.cloudguru.us/crm/deal/details/*
// @match        https://bx.cloudguru.us/crm/kanban/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550635/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D1%8F%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%BE%D0%B2%20%7C%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81%D0%9024%20%7C%20%D0%A1%D0%B0%D0%B9%D0%B4%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550635/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D1%8F%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%BE%D0%B2%20%7C%20%D0%91%D0%B8%D1%82%D1%80%D0%B8%D0%BA%D1%81%D0%9024%20%7C%20%D0%A1%D0%B0%D0%B9%D0%B4%D1%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function createButton({ text, onClick, bgColor, borderColor }) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            flex: 1;
            width: calc(100% - 4px);
            margin: 10px 10px;
            padding: 8px;
            background: ${bgColor};
            border: 2px solid ${borderColor};
            color: #f0f0f0;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        `;
        button.addEventListener('click', onClick);
        return button;
    }
    function createButtons({ dataK, dataO }) {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 10px;
        `;
        buttonsContainer.classList.add("wsbutton");
        const normalBg = 'rgba(108, 79, 119, 0.8)';
        const normalBorder = 'rgba(77, 55, 85, 0.8)';
        if (dataK) {
            buttonsContainer.appendChild(
                createButton({
                    text: 'Открыть на Картошке',
                    bgColor: normalBg,
                    borderColor: normalBorder,
                    onClick: () => window.open(`https://www.avtor24.ru/order/${dataK}`, '_blank')
                })
            );
        }
        if (dataO && dataO.trim()) {
            buttonsContainer.appendChild(
                createButton({
                    text: 'Открыть на Олесе',
                    bgColor: 'rgba(30, 255, 30, 0.8)',
                    borderColor: 'rgba(0, 150, 0, 0.8)',
                    onClick: () => window.open(`https://www.a24.biz/order/${dataO}`, '_blank')
                })
            );
        }
        return buttonsContainer;
    }
    function extract8Digits(text) {
        if (!text) return null;
        const digits = text.replace(/\D/g, '');
        return digits.length === 8 ? digits : null;
    }
    let interval = setInterval(() => {
        const container = document.querySelector('.crm-entity-stream-container-list');
        if (!container) return;
        let buttonsDiv = container.querySelector('.custom-buttons-div');
        if (!buttonsDiv) {
            buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('custom-buttons-div');
            buttonsDiv.style.cssText = `
                --ui-font-family-helvetica: "Helvetica Neue",Helvetica,Arial,sans-serif;
                --ui-font-family-system-mono: ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace;
                --ui-font-family-system: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
                color: #333;
                font-size: 14px;
                -webkit-font-smoothing: antialiased;
                position: relative;
                z-index: 500;
                box-sizing: border-box;
                width: 100%;
                border-radius: var(--crm-entity-stream-section-border-radius,var(--ui-border-radius-md,2px));
                background-color: #fff;
                box-shadow: 0 1px 1px 0 rgba(0,0,0,.04);
                font-family: var(--ui-font-family-primary,var(--ui-font-family-helvetica));
                transition: all 300ms ease,1000ms background-color linear;
                overflow: hidden;
                margin-bottom: 5px;
                margin-top: 5px;
            `;
            container.insertBefore(buttonsDiv, container.firstElementChild);
        }
        if (document.querySelector('.wsbutton')) {
            clearInterval(interval);
            return;
        }
        const numberElement = document.querySelector('div[data-field-tag="UF_CRM_1694612268222"] + div + div');
        if (!numberElement) return;
        const numberElement2 = document.querySelector('div[data-field-tag="UF_CRM_1694612083961"] + div + div');
        if (!numberElement2) return;
        const dataO = extract8Digits(numberElement.textContent);
        const dataK = extract8Digits(numberElement2.textContent);
        if (dataO || dataK) {
            const buttonsContainer = createButtons({ dataK, dataO });
            buttonsDiv.appendChild(buttonsContainer);
            clearInterval(interval);
        }
    }, 200);
})();