// ==UserScript==
// @name         MTS-Link автоматическая отметка присутствия (все поддомены)
// @match        https://*.mts-link.ru/*
// @grant        none
// @license GNU GPLv3
// @description Этот скрипт позволяет присутствовать на собраниях в МТС линк без необходимости постоянно контролировать появление "проверки присутствия". Скрипт автоматически обнаруживает такое окно и сам нажимает на кнопку. Работает на всех доменах " *.mts-link.ru/* ". Скрипт является модификацией скрипта "MTS-Link Auto Confirm & Close (Контроль присутствия для mts-link.ru)" от Илья Горбунов (ilia.dront)
// @version 1.0
// @namespace https://greasyfork.org/users/1547294
// @downloadURL https://update.greasyfork.org/scripts/558842/MTS-Link%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D1%82%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B8%D1%81%D1%83%D1%82%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%28%D0%B2%D1%81%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%BE%D0%BC%D0%B5%D0%BD%D1%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558842/MTS-Link%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D1%82%D0%BC%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B8%D1%81%D1%83%D1%82%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%28%D0%B2%D1%81%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%BE%D0%BC%D0%B5%D0%BD%D1%8B%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const checkAndHandle = () => {
        // Приоритет 1: Закрыть окно успеха
        const successCloseButton = document.querySelector(
            '[data-testid="AttentionControlSuccessModal.action.cancel"]'
        );
        if (successCloseButton) {
            successCloseButton.click();
            console.log('Окно успеха закрыто');
            return;
        }

        // Приоритет 2: Подтвердить присутствие
        const confirmButton = document.querySelector(
            '[data-testid="AttentionControlModal.action.submit.Button"]'
        );
        if (confirmButton) {
            confirmButton.click();
            console.log('Присутствие подтверждено');
        }
    };

    // MutationObserver для мгновенной реакции на изменения
    const observer = new MutationObserver(checkAndHandle);
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false
    });

    // Резервный интервал на 30 секунд
    setInterval(checkAndHandle, 30000); // 30 000 мс = 30 сек
})();