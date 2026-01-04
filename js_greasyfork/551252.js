// ==UserScript==
// @name     YT觀看次數上移
// @namespace https://greasyfork.org/zh-TW/users/4839-leadra
// @description YT觀看次數+上傳時間互換到頻道名後
// @version   1.0
// @author    SH3LL
// @license   MIT
// @match     *://*.youtube.com/watch*
// @grant     none
// @run-at    document-end
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/551252/YT%E8%A7%80%E7%9C%8B%E6%AC%A1%E6%95%B8%E4%B8%8A%E7%A7%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/551252/YT%E8%A7%80%E7%9C%8B%E6%AC%A1%E6%95%B8%E4%B8%8A%E7%A7%BB.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const moveAndStyleElements = () => {
        //document.querySelector('#related')?.prepend(document.getElementById('bottom-row'));
        //document.querySelector('#related')?.prepend(document.getElementById('owner'));
        document.getElementById('actions')?.prepend(document.getElementById('info-container'));
        document.getElementById('info-container')?.setAttribute("style", "color:white; font-size: 16px;background-color: rgba(255, 255, 255, 0.1);");
        //document.getElementById('owner')?.setAttribute("style", "margin:0");

    };

    // OBSERVER FOR ELEMENTS TO MOVE
    const moveObserver = new MutationObserver(mutations => {
        if (document.getElementById('owner')) {
            moveObserver.disconnect();
            moveAndStyleElements();
        }
    });
    moveObserver.observe(document.body, { childList: true, subtree: true });

    // OBSERVER FOR ELEMENTS TO REMOVE
    const ui = new MutationObserver(mutations => {
        const elementsToRemoveIds = ['ytd-watch-info-text', 'expand', 'collapse', 'snippet'];
        elementsToRemoveIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });

        let my_height = document.querySelector('.video-stream.html5-main-video');
        document.getElementById('description-inline-expander').style.maxHeight = (parseInt(my_height.style.height) - 70) + "px";
    });
    ui.observe(document.body, { childList: true, subtree: true });

})();