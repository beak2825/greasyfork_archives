// ==UserScript==
// @name         Kaiten Poker Planning: Blind Mode
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Скрывает админские поля и чужие оценки в диалоге оценки Kaiten для честного голосования.
// @author       You
// @match        https://*.kaiten.ru/*
// @match        https://*.kaiten.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kaiten.ru
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556877/Kaiten%20Poker%20Planning%3A%20Blind%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/556877/Kaiten%20Poker%20Planning%3A%20Blind%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const processDialog = () => {
        // Ищем диалоговое окно (MuiDialog)
        const dialog = document.querySelector('div[role="dialog"]');
        if (!dialog) return;

        // --- 1. Логика переключателя "Скрыть оценки (poker planning)" ---
        const labels = Array.from(dialog.querySelectorAll('label'));
        const pokerLabel = labels.find(l => l.textContent && l.textContent.includes('Скрыть оценки (poker planning)'));

        if (pokerLabel) {
            // Находим чекбокс внутри
            const checkbox = pokerLabel.querySelector('input[type="checkbox"]');

            // Если галочка не стоит - ставим её
            if (checkbox && !checkbox.checked) {
                checkbox.click();
            }

            // Скрываем сам переключатель
            const container = pokerLabel.closest('div');

            if (container && container.style.display !== 'none') {
                if (!container.classList.contains('MuiDialogContent-root')) {
                    container.style.display = 'none';
                    container.classList.add('tm-hidden-poker-element');
                }
            }
        }

        // --- 2. Скрытие разделителей (HR) ---
        const dividers = dialog.querySelectorAll('hr');
        dividers.forEach(hr => {
             if (hr.style.display !== 'none') {
                hr.style.display = 'none';
                hr.classList.add('tm-hidden-poker-element');
            }
        });

        // --- 3. Скрытие статистики (Мин/Макс/Среднее) ---
        const headers = Array.from(dialog.querySelectorAll('h6'));
        const statHeader = headers.find(h => h.textContent.includes('Минимум') || h.textContent.includes('Медиана'));

        if (statHeader) {
            const statBlock = statHeader.closest('div')?.parentElement;
            if (statBlock && statBlock.style.display !== 'none' && !statBlock.classList.contains('MuiDialogContent-root')) {
                statBlock.style.display = 'none';
                statBlock.classList.add('tm-hidden-poker-element');
            }
        }

        // --- 4. Скрытие поля "Коллективная оценка" и кнопки "Установить" ---
        // Сначала пробуем скрыть весь блок целиком
        const inputLabels = Array.from(dialog.querySelectorAll('label'));
        const finalEstLabel = inputLabels.find(l => l.textContent.includes('Коллективная оценка'));

        if (finalEstLabel) {
            const formControl = finalEstLabel.closest('.MuiFormControl-root');
            if (formControl) {
                const mainContainer = formControl.closest('div')?.parentElement;
                if (mainContainer && mainContainer.style.display !== 'none' && !mainContainer.classList.contains('MuiDialogContent-root')) {
                    mainContainer.style.display = 'none';
                    mainContainer.classList.add('tm-hidden-poker-element');
                }
            }
        }

        // Дополнительная зачистка кнопки "Установить", если она осталась висеть
        const allButtons = Array.from(dialog.querySelectorAll('button'));
        const setBtn = allButtons.find(b => b.textContent.trim() === 'Установить');

        if (setBtn && setBtn.style.display !== 'none') {
             // Проверяем, не скрыли ли мы её родителя уже (чтобы не дублировать)
             if (setBtn.offsetParent !== null) { // offsetParent null если элемент скрыт
                 setBtn.style.display = 'none';
                 setBtn.classList.add('tm-hidden-poker-element');
             }
        }

        // --- 5. Скрытие верхнего блока "Пригласить коллег" ---
        const inviteBtn = allButtons.find(b => b.textContent.includes('Пригласить коллег'));
        if (inviteBtn) {
            const inviteRow = inviteBtn.closest('div')?.parentElement;
            if (inviteRow && inviteRow.style.display !== 'none') {
                if (!inviteRow.classList.contains('MuiDialogContent-root')) {
                     inviteRow.style.display = 'none';
                     inviteRow.classList.add('tm-hidden-poker-element');
                }
            }
        }

        // --- 6. Скрытие чужих строк (Оставляем только "Моя оценка") ---
        const avatars = dialog.querySelectorAll('.MuiAvatar-root');

        avatars.forEach(avatar => {
            let currentRow = avatar.parentElement;
            let userRow = null;

            for (let i = 0; i < 4; i++) {
                if (!currentRow) break;

                const hasInput = currentRow.querySelector('input');
                if (currentRow.classList.contains('MuiDialogContent-root')) break;

                if (hasInput) {
                    userRow = currentRow;
                    const inputsInParent = currentRow.parentElement?.querySelectorAll('input').length || 0;
                    const inputsInCurrent = currentRow.querySelectorAll('input').length;

                    if (inputsInParent > inputsInCurrent) {
                        break;
                    }
                }
                currentRow = currentRow.parentElement;
            }

            if (userRow) {
                const text = userRow.textContent || "";

                if (text.includes('Моя оценка')) {
                    if (userRow.classList.contains('tm-hidden-poker-element')) {
                        userRow.style.display = '';
                        userRow.classList.remove('tm-hidden-poker-element');
                    }
                } else {
                    if (userRow.style.display !== 'none') {
                        userRow.style.display = 'none';
                        userRow.classList.add('tm-hidden-poker-element');
                    }
                }
            }
        });
    };

    const observer = new MutationObserver((mutations) => {
        processDialog();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();