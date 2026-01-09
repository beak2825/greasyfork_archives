// ==UserScript==
// @name         WTFight_Assists
// @namespace    http://tampermonkey.net/
// @version      2025-02-18
// @description  Sends assist requests to WTFight for faction action.
// @author       LordTaz
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon        https://www.google.com/s2/favicons?sz=32&domain=duckopedia.net
// @grant       GM.xmlHttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_info
// @connect duckopedia.net
// @connect www.duckopedia.net
// @downloadURL https://update.greasyfork.org/scripts/561929/WTFight_Assists.user.js
// @updateURL https://update.greasyfork.org/scripts/561929/WTFight_Assists.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const publicKey = 'WITHIN HERE'; // #### UPDATE YOUR API KEY HERE ####

    const actions = [
                {
                    id: 'smokeFlash',
                    text: 'Smoke',
                    imgSrc: '/images/items/226/large.png',
                    bgColor: document.body.classList.contains('dark-mode')
                    ? '#333 linear-gradient(180deg, #fff0, #ffffff1a)'
                    : '#f2f2f2 linear-gradient(180deg, #f2f2f200, #ddd)',
                    hoverColor: document.body.classList.contains('dark-mode')
                    ? '#3b3b3b linear-gradient(180deg, #fff0, #ffffff1a)'
                    : '#fff linear-gradient(180deg, #f2f2f200, #ddd)',
                },
                {
                    id: 'tearPepper',
                    text: 'Tear',
                    imgSrc: '/images/items/256/large.png',
                    bgColor: document.body.classList.contains('dark-mode')
                    ? '#333 linear-gradient(180deg, #fff0, #ffffff1a)'
                    : '#f2f2f2 linear-gradient(180deg, #f2f2f200, #ddd)',
                    hoverColor: document.body.classList.contains('dark-mode')
                    ? '#3b3b3b linear-gradient(180deg, #fff0, #ffffff1a)'
                    : '#fff linear-gradient(180deg, #f2f2f200, #ddd)',
                },
                {
                    id: 'smokeTear',
                    text: 'Both',
                    imgSrc: '/images/items/1335/large.png',
                    bgColor: document.body.classList.contains('dark-mode')
                    ? '#333 linear-gradient(180deg, #fff0, #ffffff1a)'
                    : '#f2f2f2 linear-gradient(180deg, #f2f2f200, #ddd)',
                    hoverColor: document.body.classList.contains('dark-mode')
                    ? '#3b3b3b linear-gradient(180deg, #fff0, #ffffff1a)'
                    : '#fff linear-gradient(180deg, #f2f2f200, #ddd)',
                },
                {
                    id: 'helpKill',
                    text: 'Kill',
                    imgSrc: '/images/items/6/large.png',
                    bgColor: document.body.classList.contains('dark-mode')
                    ? '#333 linear-gradient(180deg, #fff0, #ffffff1a)'
                    : '#f2f2f2 linear-gradient(180deg, #f2f2f200, #ddd)',
                    hoverColor: document.body.classList.contains('dark-mode')
                    ? '#3b3b3b linear-gradient(180deg, #fff0, #ffffff1a)'
                    : '#fff linear-gradient(180deg, #f2f2f200, #ddd)',
                },
            ];

    window.addEventListener('load', function() {
        const appHeaderWrapper = document.querySelector('div[class^="appHeaderWrapper"][class*="___"]');
        const coreWrapper = document.querySelector('div[class^="coreWrap"][class*="___"]');
        if (coreWrapper && appHeaderWrapper && coreWrapper.contains(appHeaderWrapper)) {
        /*}
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {//FOR TESTING*/
            const urlParams = new URLSearchParams(window.location.search);
            const user2ID = urlParams.get('user2ID');
        checkTarget(user2ID, publicKey, function(isSuccess) {
          if (isSuccess) {
            const mainContainer = document.createElement('div');
            mainContainer.style.cssText = 'width: 100%; box-sizing: border-box; margin-bottom: 2px;';

            const header = document.createElement('div');
            header.textContent = 'WTFight Assist Menu';
            header.style.cssText = `
                text-align: center;
                font-size: 12px;
                padding-left: 4px 10px 4px 10px;
                max-width: 420px;
                margin: 0 auto;
                background: linear-gradient(180deg, #FF9900, #FF9900),
                    linear-gradient(to bottom, hsla(0, 0%, 100%, 0) 11.3%, hsla(0, 0%, 0%, 0.302) 100%);
                    background-blend-mode: overlay;
                color: black;
                font-weight: bold;
            `;

            const container = document.createElement('div');
            container.style.cssText = 'display: flex; justify-content: center; width: 100%; padding: 2px; box-sizing: border-box;';

            actions.forEach(action => {
                const column = document.createElement('div');
                column.id = action.id;
                column.setAttribute('data-original-id', action.id);
                column.style.cssText = `
                    flex: 1;
                    cursor: pointer;
                    text-align: center;
                    padding: 0px;
                    margin: 0 2px;
                    background: ${action.bgColor};
                    transition: background 0.3s ease;
                    max-width: 120px;
                    border: ${document.body.classList.contains('dark-mode') ? '2px solid #555' : '2px solid #ddd'};
                    position: relative;
                    display: flex;
                    flex-direction: column-reverse;
                    justify-content: center;
                    align-items: center;
                `;

                const img = document.createElement('img');
                img.src = action.imgSrc;
                img.style.cssText = 'width: 100%; height: auto;';
                column.appendChild(img);

                const textDiv = document.createElement('div');
                textDiv.textContent = action.text;
                textDiv.style.cssText = `
                    font-size: 11px;
                    background: ${document.body.classList.contains('dark-mode')
                    ? 'linear-gradient(180deg, #555, #555), linear-gradient(to bottom, hsla(0, 0%, 100%, 0) 11.3%, hsla(0, 0%, 100%, 0.102) 100%)'
                    : '#fff linear-gradient(to bottom, hsla(0, 0%, 100%, 0) 11.3%, hsla(0, 0%, 100%, .102) 100%)'};
                    background-blend-mode: overlay;
                    color: ${document.body.classList.contains('dark-mode') ? 'white' : '#333'};
                    font-weight: bold;
                    text-align: center;
                    line-height: 14px;
                    padding-top: 1px 0 2px 0;
                    justify: space-between;
                    width: 61px;
                    border-radius: 0 0 5px 5px;
                    box-shadow: inset 0 -1px hsla(0, 0%, 100%, .1), 0 0 2px rgba(0, 0, 0, .251);
                `;
                column.appendChild(textDiv);

                column.addEventListener('mouseenter', function() {
                    if (textDiv.textContent !== 'Cancel') {
                        column.style.background = action.hoverColor;
                        column.style.border = document.body.classList.contains('dark-mode')
                        ? '2px solid #555' : '2px solid #ddd';
                    } else {
                        column.style.background = document.body.classList.contains('dark-mode')
                        ? '#3b3b3b linear-gradient(180deg, #FFFF0000 0%, #FFFF0033 100%)'
                        : '#fff linear-gradient(180deg, #FFFF0000 0%, #FFFF0033 100%)';
                        column.style.border = '2px solid #FFFF0080';
                    }
                });

                column.addEventListener('mouseleave', function() {
                    if (textDiv.textContent !== 'Cancel') {
                        column.style.background = action.bgColor;
                        column.style.border = document.body.classList.contains('dark-mode')
                        ? '2px solid #555' : '2px solid #ddd';
                    } else {
                        column.style.background = document.body.classList.contains('dark-mode')
                        ? '#333 linear-gradient(180deg, #FFFF0000 0%, #FFFF0033 100%)'
                        : '#f2f2f2 linear-gradient(180deg, #FFFF0000 0%, #FFFF0033 100%)';
                        column.style.border = document.body.classList.contains('dark-mode')
                        ? '2px solid #555' : '2px solid #ddd';
                    }
                });

                column.addEventListener('click', function() {
                    sendAction(user2ID, publicKey, column.id);
                    console.log('User2ID:', user2ID, 'API Key:', publicKey, 'Button ID:', column.id);
                    if (textDiv.textContent === 'Cancel') {
                        textDiv.textContent = action.text;
                        img.src = action.imgSrc;
                        column.id = action.id;
                        column.style.background = action.bgColor;
                        column.style.border = document.body.classList.contains('dark-mode')
                        ? '2px solid #555' : '2px solid #ddd';
                    } else {
                        document.querySelectorAll('[id="cancelRequest"]').forEach(otherBtn => {
                            if (otherBtn !== column) {
                                let originalAction = actions.find(a => a.id === otherBtn.getAttribute('data-original-id'));
                                if (originalAction) {
                                    otherBtn.querySelector('img').src = originalAction.imgSrc;
                                    otherBtn.querySelector('div').textContent = originalAction.text;
                                    otherBtn.style.background = originalAction.bgColor;
                                    otherBtn.id = originalAction.id;
                                }
                            }
                        });
                        textDiv.textContent = 'Cancel';
                        img.src = '/images/items/1206/large.png';
                        column.style.background = document.body.classList.contains('dark-mode')
                        ? '#3b3b3b linear-gradient(180deg, #FFFF0000 0%, #FFFF0033 100%)'
                        : '#fff linear-gradient(180deg, #FFFF0000 0%, #FFFF0033 100%)';
                        column.style.border = '2px solid #FFFF0080';
                        column.id = 'cancelRequest';
                    }
                });

                container.appendChild(column);
            });
            mainContainer.appendChild(header);
            mainContainer.appendChild(container);
            appHeaderWrapper.parentNode.insertBefore(mainContainer, appHeaderWrapper.nextSibling);
            //contentWrapper.insertBefore(mainContainer, contentWrapper.firstChild);// FOR TESTING
          } else {
           console.log("Target check failed, skipping WTFight menu.");
           }
        });
        } else {
            console.error('content-wrapper not found');
        }
    });
    function sendAction(user2ID, apiKey, actionID) {
        if (!user2ID || !apiKey || !actionID) {
            console.error("Missing required parameters. Ensure all values are provided.");
            alert("Error: Missing required data. Please check your inputs.");
            return;
        }
        GM.xmlHttpRequest({
            method: "POST",
            url: "https://duckopedia.net/assistrequest.php",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                user2ID: user2ID,
                apiKey: apiKey,
                actionID: actionID
            }),
            onload: function(response) {
                if (response.responseText.trim() === "success") {
                    console.log("Action successfully sent to Duckpedia.");
                } else {
                    console.log("Error from Duckpedia:", response.responseText);
                    resetAllActions();
                }
            },
            onerror: function(error) {
                console.error("Error making request to Duckpedia:", error.status, error.statusText);
                resetAllActions();
            }
        });
    }
    function resetAllActions() {
        document.querySelectorAll('[id="cancelRequest"]').forEach(errorBtn => {
            let originalAction = actions.find(a => a.id === errorBtn.getAttribute('data-original-id'));
            if (originalAction) {
                errorBtn.querySelector('img').src = originalAction.imgSrc;
                errorBtn.querySelector('div').textContent = originalAction.text;
                errorBtn.style.background = originalAction.bgColor;
                errorBtn.style.border = document.body.classList.contains('dark-mode')
                        ? '2px solid #555' : '2px solid #ddd';
                errorBtn.id = originalAction.id;
             }
       });
    }
    function checkTarget(user2ID, apiKey, callback) {
        if (!user2ID || !apiKey) {
            console.error("Missing required parameters. Ensure all values are provided.");
            callback(false);
            return;
        }
        GM.xmlHttpRequest({
            method: "POST",
            url: "https://duckopedia.net/assistcheck.php",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                user2ID: user2ID,
                apiKey: apiKey,
            }),
            onload: function(response) {
                if (response.responseText.trim() === "success") {
                    callback(true);
                } else {
                //    callback(true);// FOR TESTING
                    callback(false);
                }
            },
            onerror: function(error) {
               callback(false);
               // callback(true);// FOR TESTING
            }
        });
    }
})();