// ==UserScript==
// @name         Microsoft Teams Auto Hangup Timer
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0
// @description  Adds a small floating countdown timer in Microsoft Teams that automatically clicks the hang-up button when the time runs out.
// @author       artur0527rg
// @match        https://teams.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554461/Microsoft%20Teams%20Auto%20Hangup%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/554461/Microsoft%20Teams%20Auto%20Hangup%20Timer.meta.js
// ==/UserScript==

/*
    🧑 Author: artur0527rg
    🌐 GitHub: https://github.com/artur0527rg
*/

(function() {
    'use strict';

    function createOverlay(onFinishCallback) {
        const container = document.createElement('div');
        container.timerInterval = null;

        Object.assign(container.style, {
            position: 'fixed',
            display: 'flex',
            bottom: '10px',
            right: '10px',
            backgroundColor: '#4f52b2',
            borderRadius: '4px',
            padding: '10px',
            gap: '5px',
            alignItems: 'center',
            zIndex: 99999
        });

        const hours = document.createElement('input');
        Object.assign(hours, {
            type: 'text',
            inputMode: 'numeric',
            value: '01',
        });
        Object.assign(hours.style, {
            all: 'unset',
            borderBottom: '1px solid white',
            color: 'white',
            width: '30px',
            fontSize: '18px',
            textAlign: 'center'
        });

        hours.addEventListener('change', (e) => {
            let raw = (e.target.value || '').replace(/\D/g, '');
            let h = parseInt(raw, 10);
            if (isNaN(h)) h = 0;
            if (h > 23) h = 23;
            e.target.value = h.toString().padStart(2, '0');
        });

        const divider1 = document.createElement('span');
        divider1.textContent = ':';
        divider1.style.color = 'white';
        divider1.style.fontSize = '18px';

        const minutes = document.createElement('input');
        Object.assign(minutes, {
            type: 'text',
            inputMode: 'numeric',
            value: '30',
        });
        Object.assign(minutes.style, {
            all: 'unset',
            borderBottom: '1px solid white',
            color: 'white',
            width: '35px',
            fontSize: '18px',
            textAlign: 'center'
        });

        minutes.addEventListener('change', (e) => {
            let raw = (e.target.value || '').replace(/\D/g, '');
            let m = parseInt(raw, 10);
            if (isNaN(m)) m = 0;
            if (m > 59) m = 59;
            e.target.value = m.toString().padStart(2, '0');
        });

        const divider2 = document.createElement('span');
        divider2.textContent = ':';
        divider2.style.color = 'white';
        divider2.style.fontSize = '18px';

        const seconds = document.createElement('input');
        Object.assign(seconds, {
            type: 'text',
            inputMode: 'numeric',
            value: '00',
        });
        Object.assign(seconds.style, {
            all: 'unset',
            borderBottom: '1px solid white',
            color: 'white',
            width: '35px',
            fontSize: '18px',
            textAlign: 'center'
        });

        seconds.addEventListener('change', (e) => {
            let raw = (e.target.value || '').replace(/\D/g, '');
            let s = parseInt(raw, 10);
            if (isNaN(s)) s = 0;
            if (s > 59) s = 59;
            e.target.value = s.toString().padStart(2, '0');
        });

        const button = document.createElement('button');
        button.textContent = 'Start';
        Object.assign(button.style, {
            all: 'unset',
            border: '1px solid white',
            borderRadius: '4px',
            color: 'white',
            fontSize: '16px',
            padding: '5px 10px',
            cursor: 'pointer'
        });

        let isRunning = false;

        button.addEventListener('click', () => {
            if (!isRunning) {
                // Prevent double click
                if (container.timerInterval) {
                    clearInterval(container.timerInterval);
                    container.timerInterval = null;
                }

                let h = parseInt(hours.value) || 0;
                let m = parseInt(minutes.value) || 0;
                let s = parseInt(seconds.value) || 0;
                let totalSeconds = h * 3600 + m * 60 + s ;

                if (totalSeconds <= 0) return alert('Введите корректное время!');

                isRunning = true;
                button.textContent = 'Stop';
                hours.disabled = true;
                minutes.disabled = true;
                seconds.disabled = true;

                container.timerInterval = setInterval(() => {
                    totalSeconds--;
                    if (totalSeconds < 0) totalSeconds = 0;

                    const newHours = Math.floor(totalSeconds / 3600);
                    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
                    const newSeconds = totalSeconds % 60;

                    hours.value = newHours.toString().padStart(2, '0');
                    minutes.value = newMinutes.toString().padStart(2, '0');
                    seconds.value = newSeconds.toString().padStart(2, '0');

                    if (totalSeconds < 10) {
                        container.style.backgroundColor = totalSeconds % 2 === 0 ? '#b24f4f' : '#4f52b2';
                    }

                    if (totalSeconds <= 0) {
                        clearInterval(container.timerInterval);
                        isRunning = false;
                        button.textContent = 'Start';
                        hours.disabled = false;
                        minutes.disabled = false;
                        seconds.disabled = false;
                        container.style.backgroundColor = '#4f52b2';

                        if (typeof onFinishCallback === 'function') {
                            onFinishCallback();
                        }
                    }
                }, 1000);
            } else {
                clearInterval(container.timerInterval);
                container.timerInterval = null;
                isRunning = false;
                button.textContent = 'Start';
                hours.disabled = false;
                minutes.disabled = false;
                seconds.disabled = false;
                container.style.backgroundColor = '#4f52b2';
            }
        });

        container.append(hours, divider1, minutes, divider2, seconds, button);
        document.body.appendChild(container);
        return container;
    }


    // Main function to run the script logic
    function main() {
        let overlay = null;

        function checkButton() {
            const btn = document.querySelector('#hangup-button');
            console.log(btn);
            if (btn) {
                if (!overlay) {
                    overlay = createOverlay(() => {
                        if (document.body.contains(btn)) btn.click();
                    });
                }
            } else {
                if (overlay) {
                    if (overlay.timerInterval) clearInterval(overlay.timerInterval);
                    overlay.remove();
                    overlay = null;
                }
            }
        }

        // Проверяем сразу на случай, если кнопка уже есть
        checkButton();

        // Далее проверяем каждые 5 секунд
        setInterval(checkButton, 5000);
    }

    main();
})();
