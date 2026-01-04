// ==UserScript==
// @name         Zalupa answers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  answers dla anketirovania
// @author       Baillora
// @match        https://mon-25-26-1.pallada.sibsau.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557215/Zalupa%20answers.user.js
// @updateURL https://update.greasyfork.org/scripts/557215/Zalupa%20answers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        const btn = document.createElement('button');
        btn.innerText = 'Заполнить';
        btn.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 99999;
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 20px;
            cursor: pointer;
            border-radius: 5px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        btn.onclick = fillSurvey;
        document.body.appendChild(btn);
    }

    function fillSurvey() {
        const context = document.querySelector('.modal-body') || document;
        let count = 0;

        const selects = context.querySelectorAll('select');
        selects.forEach(select => {
            const row = select.closest('tr');
            const questionText = row ? row.innerText.toLowerCase() : '';

            const isNegativeQuestion = questionText.includes('головокружения') ||
                                       questionText.includes('тошноты') ||
                                       questionText.includes('плохое самочувствие');

            const options = Array.from(select.options);
            let targetOption;

            if (isNegativeQuestion) {
                targetOption = options.find(opt =>
                    opt.innerText.toLowerCase().includes('нет') ||
                    opt.value === '"0"' ||
                    opt.value === '0'
                );
            } else {
                targetOption = options.find(opt => opt.innerText.includes('5 балл'));
                if (!targetOption) targetOption = options.find(opt => opt.innerText.toLowerCase().trim() === 'да');
                if (!targetOption) targetOption = options.find(opt => opt.value === '1' || opt.value === '"1"');
                if (!targetOption) targetOption = options.find(opt => opt.value === '5');
            }

            if (targetOption && select.value !== targetOption.value) {
                select.value = targetOption.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                count++;
            }
        });

        const radios = context.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            if (radio.value === '5' || radio.nextElementSibling?.innerText?.toLowerCase().includes('отлично')) {
                if (!radio.checked) {
                    radio.click();
                    count++;
                }
            }
        });

        console.log(`Заполнено полей: ${count}`);

        if (count > 0) {
            const footer = document.querySelector('.modal-footer');
            const saveBtn = footer?.querySelector('.o_formdialog_save, .btn-primary');
            if (saveBtn) {
                saveBtn.style.boxShadow = "0 0 20px #28a745";
                saveBtn.style.border = "3px solid #28a745";
            }
        }
    }

    window.addEventListener('load', createButton);
    if (document.readyState === 'complete') createButton();

})();