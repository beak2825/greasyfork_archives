// ==UserScript==
// @name              Battlefield 4 Battlelog Battle Pack Auto Open Claim
// @name:zh-CN        战地4 Battlelog 战斗包自动领取
// @namespace         http://tampermonkey.net/
// @version           1.0
// @description       Get All of Battlefield 4 Battle Pack on Battlelog
// @description:zh-CN 在 Battlelog 上自动打开所有未开启的战地4战斗包
// @author            EvolvedGhost
// @match             https://battlelog.battlefield.com/bf4/*
// @icon              https://battlelog.battlefield.com/favicon.ico
// @grant             none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/551034/Battlefield%204%20Battlelog%20Battle%20Pack%20Auto%20Open%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/551034/Battlefield%204%20Battlelog%20Battle%20Pack%20Auto%20Open%20Claim.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isAutoOpening = false;
    let closeInterval = null;

    const claimFunc = () => {
        const battlePak = document.getElementsByClassName("battlepack-item");
        if (battlePak.length > 0) {
            const openButton = battlePak[0].childNodes[5];
            if (openButton && typeof openButton.click === 'function') {
                openButton.click();
                return true;
            }
        } else {
            alert("BATTLE PACK OPEN FINISH");
            isAutoOpening = false;
            if (closeInterval) {
                clearInterval(closeInterval);
                closeInterval = null;
            }
            return false;
        }
        return false;
    };

    const startCloseLoop = () => {
        if (closeInterval) return;
        closeInterval = setInterval(() => {
            if (!isAutoOpening) {
                clearInterval(closeInterval);
                closeInterval = null;
                return;
            }
            const closeButtons = document.querySelectorAll('.icon-dialog-close');
            closeButtons.forEach(btn => {
                if (btn && typeof btn.click === 'function') {
                    try {
                        btn.click();
                    } catch (e) {
                        console.warn('Failed to click close button:', e);
                    }
                }
            });
        }, 500);
    };

    const addBtn = () => {
        const header = document.getElementById("unopened-battlepacks");
        if (!header || header.querySelector('.btn-auto-open')) {
            return false;
        }

        const origin = header.childNodes[1].innerHTML;
        header.childNodes[1].innerHTML =
            "<button class='btn btn-primary btn-small btn-auto-open' style='float: right; height: 23px; line-height:23px; margin-left: 8px;'>Open All</button>" +
            origin;

        const openAllBtn = header.querySelector('.btn-auto-open');
        if (openAllBtn) {
            openAllBtn.addEventListener('click', () => {
                isAutoOpening = true;
                startCloseLoop();

                const openInterval = setInterval(() => {
                    const hasClaimed = claimFunc();
                    if (!hasClaimed) {
                        clearInterval(openInterval);
                        isAutoOpening = false;
                    }
                }, 1000);
            });
        }
        return true;
    };

    let attempts = 0;
    const maxAttempts = 30;
    const tryAddBtn = () => {
        attempts++;
        if (addBtn() === true) {
            return;
        }
        if (attempts < maxAttempts) {
            setTimeout(tryAddBtn, 1000);
        }
    };

    tryAddBtn();
})();