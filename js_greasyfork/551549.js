// ==UserScript==
// @name         PixelBattles Background Changer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  background changer
// @author       .hilkach.
// @match        https://pixelbattles.ru/*
// @match        https://api.pixelbattles.ru/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551549/PixelBattles%20Background%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/551549/PixelBattles%20Background%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const target = document.querySelector("#root > div > div.bZsByG_root > div.bZsByG_workbench");
    if (!target) {
        console.warn("фон не найден или уже изменён lol");
        return;
    }

    const imageUrl = 'вставь сюда ссылку на картинку'; // картинка для фона
    const squareSize = 64; // размер клетки для шахматки

    const bg = document.createElement('div');
    bg.style.position = 'absolute';
    bg.style.top = 0;
    bg.style.left = 0;
    bg.style.right = 0;
    bg.style.bottom = 0;
    bg.style.zIndex = 0;
    bg.style.pointerEvents = 'none';

    const mode = 'full'; // 'chess' = шахматка, 'full' = растянуть на весь фон

    if (mode === 'chess') {
        bg.style.backgroundImage = `url(${imageUrl})`;
        bg.style.backgroundSize = `${squareSize}px ${squareSize}px`;
        bg.style.backgroundRepeat = 'repeat';
    } else if (mode === 'full') {
        bg.style.backgroundImage = `url(${imageUrl})`;
        bg.style.backgroundSize = 'cover';
        bg.style.backgroundRepeat = 'no-repeat';
        bg.style.backgroundPosition = 'center';
    }

    target.style.position = 'relative';
    target.prepend(bg);

    console.log(`фон успешно изменён в режиме: ${mode} <3`);
})();
