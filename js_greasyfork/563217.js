// ==UserScript==
// @name         Nekto.me Auto Find After Call
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  После завершения звонка автоматически нажимает "Начать поиск собеседника", так же на клавишу f8 добавляется скип собеседника.
// @match        https://nekto.me/*
// @license    kamaz_mmm
// @downloadURL https://update.greasyfork.org/scripts/563217/Nektome%20Auto%20Find%20After%20Call.user.js
// @updateURL https://update.greasyfork.org/scripts/563217/Nektome%20Auto%20Find%20After%20Call.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let autoStart = true;
    let clicked = false;

    function findButton() {
        return document.querySelector(
            'button.callScreen__findBtn.btn.green.filled'
        );
    }

    function tryClick() {
        if (!autoStart || clicked) return;

        const btn = findButton();
        if (btn && !btn.disabled && btn.offsetParent !== null) {
            clicked = true;

            // 🔹 задержка 0.5 секунды между звонками
            setTimeout(() => {
                btn.click();
            }, 500);

            // защита от повторов
            setTimeout(() => {
                clicked = false;
            }, 5000);
        }
    }

    // Проверяем кнопку раз в 800мс
    setInterval(tryClick, 800);

    // UI
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 3px;
        right: 10px;
        z-index: 9999;
        background: #57637d;
        padding: 6px;
        border-radius: 6px;
        font-family: monospace;
    `;

    const toggle = document.createElement('button');
    toggle.textContent = 'Авто-поиск: ВКЛ';
    toggle.style.cssText = `
        background: #57637d;
        color: #000;
        border: none;
        padding: 5px 10px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 4px;
    `;

    toggle.onclick = () => {
        autoStart = !autoStart;
        toggle.textContent = `Авто-поиск: ${autoStart ? 'ВКЛ' : 'ВЫКЛ'}`;
        toggle.style.background = autoStart ? '#57637d' : '#';
    };

    panel.appendChild(toggle);
    document.body.appendChild(panel);

})();

(function () {
    'use strict';

    const HOTKEY = 'F8';
    const CONFIRM_DELAY = 200; // задержка перед подтверждением

    function clickEndCall() {
        const endBtn = document.querySelector(
            'button.callScreen__cancelCallBtn.cancelCallBtnNoMess'
        );

        if (!endBtn) {
            console.log('[Nekto] Кнопка завершения не найдена');
            return;
        }

        endBtn.click();
        console.log('[Nekto] Нажата кнопка завершения');

        setTimeout(clickConfirm, CONFIRM_DELAY);
    }

    function clickConfirm() {
        const confirmBtn = document.querySelector(
            'button.swal2-confirm.swal2-styled'
        );

        if (!confirmBtn) {
            console.log('[Nekto] Кнопка подтверждения не найдена');
            return;
        }

        confirmBtn.click();
        console.log('[Nekto] Подтверждение нажато');
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === HOTKEY) {
            e.preventDefault();
            clickEndCall();
        }
    });

})();

