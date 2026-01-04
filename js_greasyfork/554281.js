// ==UserScript==
// @name         AutoLineHeight
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  codesign显示文字行高比例
// @author       You
// @match        https://codesign.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554281/AutoLineHeight.user.js
// @updateURL https://update.greasyfork.org/scripts/554281/AutoLineHeight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(event) {
    console.log('检查')
    setTimeout(() => check(), 100);
}, true);

function check() {
    const contentBox = document.querySelectorAll('.node-box__content');
contentBox.forEach((item) => {
  if (item.firstChild?.dataset?.label?.length) {
      setLineHeight(item)
  }
});
function setLineHeight(item) {
    let fontSize = null;
    let lineHeight = 0;
    for(var i = 0; i < item.children.length; i++) {
        const child = item.children[i];
        if (child?.dataset?.label == '字号') {
            const valueNode = child.querySelector('.input-item__value');
            const value = Number(valueNode?.textContent?.replace(/[^\d\-\.]/g,''))
            if (!isNaN(value)) fontSize = value;
        } else if (child?.dataset?.label == '行高') {
            const valueNode = child.querySelector('.input-item__value');
            const value = Number(valueNode?.textContent?.replace(/[^\d\-\.]/g,''))
            if (fontSize == null) return;
            if (!isNaN(value)) {
                lineHeight = value;
                let node = valueNode?.parentNode?.querySelector('.line-height-a')
                if (!node) {
                   node = document.createElement('span');
                   node.className = 'line-height-a';
                   node.style.position = 'absolute';
                   node.style.right = '5px';
                   valueNode?.parentNode?.appendChild(node);
                }
                node.textContent = String(Number((lineHeight / fontSize).toFixed(3)))
                return;
            }
        }
    }
}
}
})();