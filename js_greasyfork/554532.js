// ==UserScript==
// @name         gym easy train
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  raw
// @author       aquagloop
// @match        *://*.torn.com/gym.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554532/gym%20easy%20train.user.js
// @updateURL https://update.greasyfork.org/scripts/554532/gym%20easy%20train.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .content-title.m-bottom10 {
            position: relative;
        }

        #easy-train-btn {
            position: absolute;
            top: -8px;
            left: 60px;
            background: linear-gradient(to bottom, #555 0%, #333 100%);
            border: 1px solid #222;
            border-radius: 5px;
            padding: 5px 10px;
            color: white;
            font-weight: bold;
            text-shadow: 0 1px 1px #000;
            cursor: pointer;
        }

        #easy-train-btn:hover {
            background: linear-gradient(to bottom, #666 0%, #444 100%);
        }

        #easy-train-btn:active {
            transform: scale(0.98);
        }
    `);

    const easyTrainButton = document.createElement('button');
    easyTrainButton.id = 'easy-train-btn';
    easyTrainButton.classList.add('torn-btn');
    easyTrainButton.type = 'button';
    const originalButtonText = 'Easy Train';
    easyTrainButton.textContent = originalButtonText;

    function onEasyTrainClick() {
        let lowestStat = {
            name: '',
            value: Infinity,
            button: null
        };

        const statsToTrain = ['strength', 'defense', 'speed', 'dexterity'];

        const gymWrapper = document.querySelector('div[class*="gymContentWrapper"]');
        if (!gymWrapper) {
            return;
        }

        const statItems = gymWrapper.querySelectorAll('li[class]');

        statItems.forEach(item => {
            try {
                const titleElement = item.querySelector('h3[class*="title"]');
                const valueElement = item.querySelector('span[class*="propertyValue"]');
                const buttonElement = item.querySelector('button.torn-btn'); 

                if (!titleElement || !valueElement || !buttonElement) {
                    return;
                }

                const statName = titleElement.textContent.trim().toLowerCase();

                if (statsToTrain.includes(statName)) {
                    const statValue = parseInt(valueElement.textContent.replace(/,/g, ''), 10);

                    if (!isNaN(statValue) && statValue < lowestStat.value) {
                        lowestStat = {
                            name: statName,
                            value: statValue,
                            button: buttonElement
                        };
                    }
                }
            } catch (e) {
                //
            }
        });

        if (lowestStat.button) {
            lowestStat.button.click();
        }
    }

    easyTrainButton.addEventListener('click', onEasyTrainClick);

    function checkGymContent() {
        const titleDiv = document.querySelector('.content-title.m-bottom10');
        const gymContent = document.querySelector('div[class*="gymContentWrapper"]');
        const buttonExists = document.getElementById(easyTrainButton.id);

        if (gymContent && titleDiv && !buttonExists) {
            titleDiv.appendChild(easyTrainButton);
        } else if ((!gymContent || !titleDiv) && buttonExists) {
            buttonExists.remove();
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        checkGymContent();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    checkGymContent();

})();

