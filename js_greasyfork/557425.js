// ==UserScript==
// @name         Smart Contest Bolt (Lolz/Zelenka) v1.6
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Молния на розыгрышах. Проверяет галочку участия в HTML.
// @author       You
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557425/Smart%20Contest%20Bolt%20%28LolzZelenka%29%20v16.user.js
// @updateURL https://update.greasyfork.org/scripts/557425/Smart%20Contest%20Bolt%20%28LolzZelenka%29%20v16.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ICON_CLASS = 'fa-bolt';
    const BUTTON_ID_CLASS = 'smart-contest-btn';
    const STORAGE_KEY = 'lzt_participated_history_v3';

    // === Работа с историей (как резервный метод) ===
    function getHistory() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch (e) { return []; }
    }

    function saveToHistory(id) {
        const history = getHistory();
        const strId = String(id);
        if (!history.includes(strId)) {
            history.push(strId);
            if (history.length > 1000) history.shift();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        }
    }

    // === Основная функция ===
    function addButtons() {
        const threads = document.querySelectorAll('.discussionListItem');
        const history = getHistory();

        threads.forEach(thread => {
            // 1. Не дублируем кнопку
            if (thread.querySelector(`.${BUTTON_ID_CLASS}`)) return;

            // 2. Только розыгрыши (есть сумма)
            if (!thread.querySelector('.moneyContestWithValue')) return;

            // 3. Получаем ID темы
            const idMatch = thread.id.match(/thread-(\d+)/);
            if (!idMatch) return;
            const threadId = idMatch[1];

            const controls = thread.querySelector('.controls');
            if (!controls) return;

            // 4. ПРОВЕРКА СТАТУСА УЧАСТИЯ
            // А) Ищем галочку от форума "Вы уже участвуете"
            const hasCheckmark = thread.querySelector('.alreadyParticipate') !== null;
            // Б) Ищем в нашей локальной истории (на случай если только что нажали)
            const isInHistory = history.includes(threadId);

            const isParticipated = hasCheckmark || isInHistory;

            // 5. Создаем кнопку
            const btn = document.createElement('a');
            btn.className = `threadControl fa ${ICON_CLASS} ${BUTTON_ID_CLASS}`;

            // Стили
            Object.assign(btn.style, {
                cursor: 'pointer',
                marginRight: '8px',
                fontSize: '14px',
                textDecoration: 'none',
                // Если участвуем - зеленый, иначе серый
                color: isParticipated ? '#00ff00' : '#888',
                transition: 'color 0.3s'
            });

            btn.title = isParticipated ? "Вы участвуете (Скрыть)" : "Участвовать";

            // 6. Клик
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Если уже участвуем (зеленая) — просто скрываем
                if (isParticipated || btn.style.color === 'rgb(0, 255, 0)') {
                    hideThread(thread);
                    return;
                }

                // Иначе — участвуем
                const tokenInput = document.querySelector('input[name="_xfToken"]');
                const token = (window.XenForo && window.XenForo.csrfToken)
                              ? window.XenForo.csrfToken
                              : (tokenInput ? tokenInput.value : null);

                if (!token) return console.error('Token not found');

                btn.style.color = '#ffd700'; // Желтый (загрузка)

                fetch(`/threads/${threadId}/participate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Ajax-Referer': window.location.href
                    },
                    body: `_xfToken=${encodeURIComponent(token)}&_xfResponseType=json`
                })
                .then(response => response.json())
                .then(data => {
                    const markSuccess = () => {
                        btn.style.color = '#00ff00'; // Зеленый
                        saveToHistory(threadId); // Запоминаем

                        // Ждем 100мс чтобы показать успех, потом скрываем
                        setTimeout(() => {
                            hideThread(thread);
                        }, 100);
                    };

                    if (data.error) {
                        const errText = JSON.stringify(data.error).toLowerCase();
                        // Если ошибка "Уже участвуете" — это тоже успех
                        if (errText.includes('уже участв') || errText.includes('already particip')) {
                            markSuccess();
                        } else {
                            console.error(data.error);
                            btn.style.color = 'red';
                        }
                    } else {
                        markSuccess();
                    }
                })
                .catch(err => {
                    console.error(err);
                    btn.style.color = 'red';
                });
            });

            controls.insertBefore(btn, controls.firstChild);
        });
    }

    function hideThread(element) {
        element.style.height = element.offsetHeight + 'px';
        element.style.overflow = 'hidden';
        void element.offsetHeight;

        element.style.transition = 'all 0.5s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.height = '0px';
        element.style.margin = '0px';
        element.style.padding = '0px';

        setTimeout(() => {
            element.remove();
        }, 550);
    }

    addButtons();
    setInterval(addButtons, 1000);
})();
