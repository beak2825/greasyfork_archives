// ==UserScript==
// @name         Custom Skins Pokelegenda
// @namespace    http://tampermonkey.net/
// @version      2025-09-09 v5
// @description  Подмена аватаров для выбранных игроков на pokelegenda.ru
// @author       You
// @match        https://pokelegenda.ru/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokelegenda.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548946/Custom%20Skins%20Pokelegenda.user.js
// @updateURL https://update.greasyfork.org/scripts/548946/Custom%20Skins%20Pokelegenda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CUSTOM_SKINS = {
        "KimiK": "https://i.ibb.co/nq1zpnNB/777.png",
        "Elisstype": "https://i.ibb.co/Csbfgtjp/Full-Body-Anime-PNG-Pshotossss.png"
    };

    function replaceAvatars() {
        document.querySelectorAll("#__map_window_profile").forEach(profile => {
            const nickEl = profile.querySelector(".user");
            const avatar = profile.querySelector(".uAvatar");
            if (!nickEl || !avatar) return;

            const nick = nickEl.textContent.trim();

            // если оригинал ещё не сохранён — сохраним
            if (!avatar.dataset.originalBg) {
                avatar.dataset.originalBg = avatar.style.backgroundImage;
            }

            if (CUSTOM_SKINS[nick]) {
                avatar.style.backgroundImage = `url("${CUSTOM_SKINS[nick]}")`;
            } else {
                // вернуть оригинальный фон
                avatar.style.backgroundImage = avatar.dataset.originalBg;
            }
        });
    }

    replaceAvatars();

    const observer = new MutationObserver(() => replaceAvatars());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // подстраховка, если сайт меняет DOM хитро
    setInterval(replaceAvatars, 1000);
})();
