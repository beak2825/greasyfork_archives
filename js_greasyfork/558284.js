// ==UserScript==
// @name         YouTube 數字0鍵 長按兩倍速
// @namespace    Tampermonkey Scripts
// @match        *://www.youtube.com/*
// @grant        none
// @version      2.2
// @author       haolundai
// @description  長按小鍵盤數字0鍵開啟兩倍速，放開恢復，以獲得像app版本的體驗。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558284/YouTube%20%E6%95%B8%E5%AD%970%E9%8D%B5%20%E9%95%B7%E6%8C%89%E5%85%A9%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/558284/YouTube%20%E6%95%B8%E5%AD%970%E9%8D%B5%20%E9%95%B7%E6%8C%89%E5%85%A9%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isPressing = false;
    let originalSpeed = 1.0;
    let overlayDiv = null;
    let currentVideo = null; 

    function getOverlay() {
        if (overlayDiv) return overlayDiv;

        overlayDiv = document.createElement('div');
        overlayDiv.innerText = '2x ▶▶';
        overlayDiv.style.cssText = `
            position: absolute;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: bold;
            z-index: 9999;
            pointer-events: none;
            display: none;
            backdrop-filter: blur(2px); 
        `;
        const container = document.querySelector('#movie_player') || document.body;
        container.appendChild(overlayDiv);
        return overlayDiv;
    }

    function handleKeyDown(event) {

        if (event.code !== 'Digit0' && event.code !== 'Numpad0') return;

        const target = event.target;
        if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        event.preventDefault();
        event.stopImmediatePropagation();

        if (isPressing) return;

        currentVideo = document.querySelector('video');

        if (currentVideo) {
            isPressing = true;
            originalSpeed = currentVideo.playbackRate;
            currentVideo.playbackRate = 2.0;

            const overlay = getOverlay();
            if (overlay) overlay.style.display = 'block';
        }
    }

    function handleKeyUp(event) {
        if (event.code !== 'Digit0' && event.code !== 'Numpad0') return;

        const target = event.target;
        if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        event.preventDefault();
        event.stopImmediatePropagation();

        if (isPressing) {
            if (currentVideo) {
                currentVideo.playbackRate = originalSpeed; 
            }
            isPressing = false;
            currentVideo = null; 

            if (overlayDiv) overlayDiv.style.display = 'none';
        }
    }

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

})();