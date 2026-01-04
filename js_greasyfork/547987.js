// ==UserScript==
// @name         VK No Login Popup + Scroll Fix
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Убирает окно авторизации, нижний баннер и возвращает скролл во ВКонтакте
// @author       2D & ChatGPT
// @license      MIT
// @match        https://vk.com/*
// @match        https://m.vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547987/VK%20No%20Login%20Popup%20%2B%20Scroll%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/547987/VK%20No%20Login%20Popup%20%2B%20Scroll%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixVK() {
        // Убираем верхнее окно авторизации
        document.querySelectorAll(
            '.vkc__AuthRoot__authLayer, #box_layer_bg, #box_layer_wrap, .box_layer, .popup_box_container'
        ).forEach(el => el.remove());

        // Убираем нижний баннер "Войти/Зарегистрироваться"
        document.querySelectorAll(
            '#PageBottomBanner, .PageBottomBanner, #page_bottom_banner, .page_bottom_banner, .UnauthActionBlock, .TopUnauthPanel, .vkc__AuthFooter, .vkc__BottomAuthPanel'
        ).forEach(el => el.remove());

        // Возвращаем скролл
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
        document.body.classList.remove("noscroll", "scroll_fix");
        document.documentElement.classList.remove("noscroll", "scroll_fix");
    }

    // Запускаем сразу и проверяем каждые 0.5 сек
    fixVK();
    setInterval(fixVK, 500);
})();
