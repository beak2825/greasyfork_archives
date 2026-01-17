// ==UserScript==
// @name     YT通知移到訂閱
// @namespace https://greasyfork.org/zh-TW/users/4839-leadra
// @description YT通知小鈴鐺移到訂閱按鈕右側
// @version   1.0
// @author    SH3LL
// @license   MIT
// @match     https://www.youtube.com/watch*
// @grant     none
// @run-at    document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/562871/YT%E9%80%9A%E7%9F%A5%E7%A7%BB%E5%88%B0%E8%A8%82%E9%96%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/562871/YT%E9%80%9A%E7%9F%A5%E7%A7%BB%E5%88%B0%E8%A8%82%E9%96%B1.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const moveAndStyleElements = () => {
        //document.querySelector('#related')?.prepend(document.getElementById('bottom-row'));
        document.querySelector('#actions')?.prepend(document.querySelector('#buttons.ytd-masthead'));
        //document.getElementById('actions')?.prepend(document.getElementById('info-container'));
        //document.getElementById('info-container')?.setAttribute("style", "color:white; font-size: 16px;background-color: rgba(255, 255, 255, 0.1);");
        //document.querySelector('#owner')?.setAttribute("style", "display:none;");

    };

    // OBSERVER FOR ELEMENTS TO MOVE
    const moveObserver = new MutationObserver(mutations => {
        if (document.getElementById('owner')) {
            moveObserver.disconnect();
            moveAndStyleElements();
        }
    });
    moveObserver.observe(document.body, { childList: true, subtree: true });
/*
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
*/
})();