// ==UserScript==
// @name                          Bring Back YouTube Fullscreen Scroll [Working]
// @name:fr                       Restaurer le défilement en plein écran YouTube [Fonctionnel]
// @name:es                       Restaurar el desplazamiento en pantalla completa de YouTube [Funcionando]
// @name:de                       YouTube-Vollbild-Scrollen wiederherstellen [Funktioniert]
// @name:it                       Ripristina lo scorrimento a schermo intero di YouTube [Funzionante]
// @name:zh-CN                    恢复 YouTube 全屏滚动【可用】
// @namespace                     https://gist.github.com/4lrick/1060be71b57d6b6923c461223d077b13
// @version                       1.1
// @description                   Restore scroll in YouTube fullscreen mode.
// @description:fr                Restaurer le défilement en plein écran YouTube.
// @description:es                Restaurar el desplazamiento en pantalla completa de YouTube.
// @description:de                YouTube-Vollbild-Scrollen wiederherstellen.
// @description:it                Ripristina lo scorrimento a schermo intero di YouTube.
// @description:zh-CN             恢复 YouTube 全屏滚动。
// @author                        4lrick
// @match                         https://www.youtube.com/*
// @icon                          https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant                         none
// @license                       MIT
// @downloadURL https://update.greasyfork.org/scripts/547818/Bring%20Back%20YouTube%20Fullscreen%20Scroll%20%5BWorking%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/547818/Bring%20Back%20YouTube%20Fullscreen%20Scroll%20%5BWorking%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `
        ytd-app[fullscreen] {
            overflow: auto !important;
        }

        ytd-app[scrolling] {
            bottom: 0 !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
        }

        ytd-app[fullscreen]::-webkit-scrollbar,
        ytd-app[scrolling]::-webkit-scrollbar {
            display: none !important;
        }

        ytd-watch-flexy[fullscreen] #columns {
            display: flex !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);
})();