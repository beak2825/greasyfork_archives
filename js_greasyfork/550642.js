// ==UserScript==
// @name         Go away telegram-freeloader!
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Удаляет ссылки на телегу, вк, макс, алиэкспрес и яндекс маркет
// @author       notimer
// @match        https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tlgrm.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550642/Go%20away%20telegram-freeloader%21.user.js
// @updateURL https://update.greasyfork.org/scripts/550642/Go%20away%20telegram-freeloader%21.meta.js
// ==/UserScript==
//
// Функция удаления из нод ссылок
function removeTelega(textNodes) {
    for (let blockNode of textNodes) {
        if (blockNode.hasChildNodes()) {
            let container = blockNode.childNodes[1];
            if (typeof container !== 'undefined') {
                container.querySelectorAll(
                    '[href^="https://t.me"],[href^="https://vk.com"],[href*="t.me"],[href*="vk.com"],' +
                    '[href^="https://ali.click"],[href*="ali.click"],[href^="https://shp.pub"],[href*="shp.pub"],' +
                    '[href^="https://alii.pub"],[href*="alii.pub"]'
                ).forEach(function(elem) {
                    let p = elem.closest('p');
                    if (p) p.remove();
                });
            }
        }
    }
}

// Коллбэк при срабатывании мутации
const observerCallback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type !== 'childList')	continue;
        for (let node of mutation.addedNodes) {
            if (node.nodeName === "#text" || node.nodeName === "#comment") continue;
            let storyTelega = node.getElementsByClassName('story-block story-block_type_text');
            removeTelega(storyTelega);
        }
    }
};

let storyTelega = document.getElementsByClassName('story-block story-block_type_text');
removeTelega(storyTelega);

// Обсервер для тех, у кого бесконечная лента
const config = {childList: true, subtree: true};
const observer = new MutationObserver(observerCallback);
observer.observe(document.body, config);