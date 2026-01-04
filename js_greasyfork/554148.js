// ==UserScript==
// @name         GreasyFork Scroll to Bottom Button
// @namespace    https://emree.scroll.button
// @version      1.0
// @description  Adds a modern dark button to scroll to bottom of the page on GreasyFork
// @author       Emree.el on ig
// @match        https://greasyfork.org/*
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/554148/GreasyFork%20Scroll%20to%20Bottom%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/554148/GreasyFork%20Scroll%20to%20Bottom%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // create button
    const btn = document.createElement('div');
    btn.innerHTML = '↓';
    btn.id = 'scrollToBottomBtn';
    document.body.appendChild(btn);

    // style button
    const style = document.createElement('style');
    style.textContent = `
        #scrollToBottomBtn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 45px;
            height: 45px;
            background: #111;
            color: #fff;
            font-size: 22px;
            font-weight: bold;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 0 12px rgba(0,0,0,0.4);
            transition: all 0.2s ease;
            z-index: 9999;
            user-select: none;
        }

        #scrollToBottomBtn:hover {
            background: #222;
            transform: scale(1.08);
        }
    `;
    document.head.appendChild(style);

    // click event
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
})();
