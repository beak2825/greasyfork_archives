// ==UserScript==
// @name         Ambassist - quick target chainsaver
// @version      1
// @namespace    http://tampermonkey.net/
// @description  Adds a dynamic icon to find random targets. Hold the icon to move it, click to find a target.
// @author       AMBiSCA [2662550]
// @match        https://www.torn.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549761/Ambassist%20-%20quick%20target%20chainsaver.user.js
// @updateURL https://update.greasyfork.org/scripts/549761/Ambassist%20-%20quick%20target%20chainsaver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        rangeStart: 3000000,
        rangeEnd: 3400000,
        holdDuration: 750
    };

    function generateRandomId(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const injectStyles = () => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            #target-acquisition-btn {
                position: fixed !important;
                bottom: 74px !important;
                right: 5px !important;
                z-index: 99999 !important;
                cursor: pointer;
                width: 38px;
                min-width: 38px;
                height: 38px;
                border: none;
                padding: 0;
                background: linear-gradient(180deg, #00698c, #003040);
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 0 0 4px hsla(0,0%,100%,.251), inset 0 -2px 4px 0 rgba(0,0,0,.502);
                transition: transform 0.4s ease-in-out;
            }
            #target-acquisition-btn:hover {
                background: linear-gradient(180deg, #008fbf, #004c66);
            }
            #target-acquisition-btn.moved-up {
                transform: translateY(-35vh);
            }
        `;
        document.head.appendChild(styleSheet);
    };

    const createButton = () => {
        const targetButton = document.createElement('button');
        targetButton.id = 'target-acquisition-btn';
        targetButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 12H18" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 12H2" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 6V2" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 22V18" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;

        let pressTimer = null;
        let isHeld = false;
        let isButtonUp = false;

        targetButton.addEventListener('pointerdown', () => {
            isHeld = false;
            pressTimer = setTimeout(() => {
                isHeld = true;
                isButtonUp = !isButtonUp;
                targetButton.classList.toggle('moved-up', isButtonUp);
            }, config.holdDuration);
        });

        targetButton.addEventListener('pointerup', () => {
            clearTimeout(pressTimer);
        });

        targetButton.addEventListener('click', () => {
            if (isHeld) {
                return;
            }
            const targetIdentifier = generateRandomId(config.rangeStart, config.rangeEnd);
            const destinationUrl = `https://www.torn.com/loader.php?sid=attack&user2ID=${targetIdentifier}`;
            window.location.href = destinationUrl;
        });

        document.body.appendChild(targetButton);
    };

    injectStyles();
    createButton();
})();