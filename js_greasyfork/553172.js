// ==UserScript==
// @name         ChoiceQR Terminal - Auto Mute + Remove Notification Overlays
// @namespace    https://choiceqr.com/
// @version      2.0
// @description  Автовідключення сповіщень (натискає дзвоник) + видаляє модульне вікно(довіл на сповіщення) choiceqr.com/app/terminal
// @author       Dolonin
// @match        *://*/app/terminal*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553172/ChoiceQR%20Terminal%20-%20Auto%20Mute%20%2B%20Remove%20Notification%20Overlays.user.js
// @updateURL https://update.greasyfork.org/scripts/553172/ChoiceQR%20Terminal%20-%20Auto%20Mute%20%2B%20Remove%20Notification%20Overlays.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stopTimeout;
    let observer;

    /* -----------------------------------------------------------
       1. АВТОНАТИСКАННЯ ДЗВОНИКА (ВИМКНЕННЯ СПОВІЩЕНЬ / ЗВУКУ)
       ----------------------------------------------------------- */
    function clickBellButton() {
        // Шукаємо іконку червоного дзвоника
        const redIcon = document.querySelector('path[fill="#EB7353"]');

        if (redIcon) {
            const btn = redIcon.closest('div[tabindex]');
            if (btn) {
                btn.click();
                console.log('[ChoiceQR Mute] Дзвоник натиснуто — сповіщення вимкнено');
                return true;
            }
        }
        return false;
    }

    function autoClickBell() {
        // Поки сайт не підвантажив інтерфейс — чекаємо
        if (!clickBellButton()) {
            setTimeout(autoClickBell, 400);
        }
    }

    // Запускаємо автонатискання дзвоника
    autoClickBell();


    /* -----------------------------------------------------------
       2. ОСНОВНЕ ОЧИЩЕННЯ ВІКНА ДОЗВОЛУ СПОВІЩЕНЬ
       ----------------------------------------------------------- */
    function cleanOverlays() {
        let removedSomething = false;

        // Видаляємо модальне вікно з aria-modal
        const modals = document.querySelectorAll('div[aria-modal="true"]');
        modals.forEach(modal => {
            console.log('[ChoiceQR Cleaner] Видалено модальне вікно сповіщення');
            modal.remove();
            removedSomething = true;
        });

        // Видаляємо фонові div-и, які блокують клік
        const blockers = document.querySelectorAll('.r-1ny4l3l');
        blockers.forEach(el => {
            console.log('[ChoiceQR Cleaner] Видалено фоновий блок');
            el.remove();
            removedSomething = true;
        });

        // Видаляємо порожні контейнери
        document.querySelectorAll('.r-1p0dtai.r-1d2f490.r-1xcajam.r-zchlnj.r-ipm5af.r-sfbmgh').forEach(el => {
            const parent = el.closest('div');
            if (parent) {
                console.log('[ChoiceQR Cleaner] Видалено порожній контейнер');
                parent.remove();
            } else {
                el.remove();
            }
            removedSomething = true;
        });

        // Якщо щось видалили — перезапускаємо таймер завершення
        if (removedSomething) {
            if (stopTimeout) clearTimeout(stopTimeout);
            stopTimeout = setTimeout(stopScript, 500);
        }
    }

    /* -----------------------------------------------------------
       3. ЗАВЕРШЕННЯ РОБОТИ
       ----------------------------------------------------------- */
    function stopScript() {
        if (observer) observer.disconnect();
        console.log('[ChoiceQR Cleaner] Спостереження завершено. Скрипт зупинено.');
    }

    // Запуск очищення та спостереження
    cleanOverlays();
    observer = new MutationObserver(() => cleanOverlays());
    observer.observe(document.body, { childList: true, subtree: true });
})();
