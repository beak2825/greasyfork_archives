// ==UserScript==
// @name         Torn - FastRevive
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  Confirm Faster on hospital page
// @author       Upsilon [3212478]
// @match        https://www.torn.com/hospitalview.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at  document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554097/Torn%20-%20FastRevive.user.js
// @updateURL https://update.greasyfork.org/scripts/554097/Torn%20-%20FastRevive.meta.js
// ==/UserScript==
 
(function () {
    function updateLocalStorage(upsScripts) {
        if (typeof upsScripts["fastRevive"] !== "object") {
            let treshold = upsScripts["fastRevive"];
            upsScripts["fastRevive"] = {};
            upsScripts["fastRevive"]["threshold"] = treshold;
            upsScripts["fastRevive"]["earlyDischarge"] = true;
            localStorage.setItem("upscript", JSON.stringify(upsScripts));
            return true;
        }
        return false;
    }
 
    function getLocalStorage() {
        let upsScripts = localStorage.getItem("upscript");
        if (localStorage.getItem("upscript") === null) {
            localStorage.setItem("upscript", JSON.stringify({}));
            return getLocalStorage();
        }
        upsScripts = JSON.parse(upsScripts);
        if (upsScripts["fastRevive"] == null) {
            upsScripts["fastRevive"] = {};
            upsScripts["fastRevive"]["threshold"] = 0;
            upsScripts["fastRevive"]["earlyDischarge"] = true;
            localStorage.setItem("upscript", JSON.stringify(upsScripts));
            return getLocalStorage();
        }
        if (updateLocalStorage(upsScripts)) {
            return getLocalStorage();
        }
        return upsScripts;
    }
 
    function setHospitalThreshold(threshold) {
        let upsScripts = getLocalStorage();
        upsScripts["fastRevive"]["threshold"] = threshold;
        localStorage.setItem("upscript", JSON.stringify(upsScripts));
    }
 
    function setHospitalEarlyDischarge(earlyDischarge) {
        let upsScripts = getLocalStorage();
        upsScripts["fastRevive"]["earlyDischarge"] = earlyDischarge;
        localStorage.setItem("upscript", JSON.stringify(upsScripts));
    }
 
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));
 
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
 
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
 
    function extractReviveParameters(confirmWrapper) {
        let result = {};
        const confirmReviveElement = confirmWrapper.querySelector('.confirm-revive');
        const textContent = confirmReviveElement.textContent;
        const match = textContent.match(/(\d+(\.\d+)?)% chance of success/);
        if (!match)
            return 1000;
        result.reviveChance = parseFloat(match[1]);
        result.earlyDischarge = !!textContent.includes("Early Discharge");
        return result;
    }
 
    if (window.location.href.includes("hospitalview")) {
        function addGlobalStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
            .ups-fast-revive {
                position: absolute;
                right: 45px;
                top: 16px;
                cursor: pointer;
                transform: translateY(-50%);
                height: 35px;
                color: var(--default-color);
                border-left: 2px solid var(--default-panel-divider-outer-side-color);
                background: none;
                font-size: 12px;
                font-weight: bold;
                padding: 0 10px;
                transition: color 0.3s ease;
                z-index: 10;
            }
            .ups-fast-revive:hover {
                background: linear-gradient(to bottom, #4facfe, #00f2fe);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                color: transparent;
            }
            .fast-revives-threshold {
                cursor: pointer;
            }
            
            .fast-revives-threshold:hover {
                font-weight: bold;
            }
 
            @media screen and (max-width: 800px) {
                 .reason {
                    width: 200px !important;
                    padding: 260px 6px !important;
                 }
                 .level {
                    width: 50px !important;
                 }
                 .info-wrap {
                    width: auto !important;
                    border-right: 1px solid var(--default-panel-divider-outer-side-color);
                 }
                 .ups-fast-revive {
                    height: initial;
                    padding: initial;
                    width: 42px;
                    top: 60px;
                    right: 0;
                    height: 48px;
                    border-left: 1px solid var(--default-panel-divider-inner-side-color);
                    border-top: 1px solid var(--default-panel-divider-outer-side-color);
                 }
            }
        `;
            document.head.appendChild(style);
        }
 
        function addButtonsToList() {
            const userInfoList = document.querySelector('.user-info-list-wrap');
            if (!userInfoList) return;
 
            const listItems = userInfoList.querySelectorAll('li');
            listItems.forEach(li => {
                if (li.querySelector('.ups-fast-revive')) return;
 
                const button = document.createElement('button');
                button.innerHTML = 'Fast';
                button.classList.add("ups-fast-revive");
 
                button.addEventListener('click', () => {
                    const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];
                    let confirmRevive = li.querySelector('div.confirm-revive');
                    if (getStyle(confirmRevive, 'display') === 'none') {
                        const reviveButton = li.querySelector('a.revive');
                        if (reviveButton) {
                            reviveButton.click();
                        }
                    } else {
                        const fastRevive = getLocalStorage()["fastRevive"];
                        const reviveParameters = extractReviveParameters(li);
                        const reviveButton = li.querySelector('.action-yes');
                        if (reviveButton && fastRevive["threshold"] < reviveParameters.reviveChance) {
                            if (fastRevive["earlyDischarge"] === true || reviveParameters.earlyDischarge === false) {
                                return reviveButton.click();
                            }
                        }
                    }
                });
 
                li.style.position = 'relative';
                li.appendChild(button);
            });
        }
 
        function userThresholdInput() {
            waitForElm('.msg-info-wrap').then((msgItemWrap) => {
                if (msgItemWrap.querySelector('.fast-revives-container')) return;
                let isEnabled = getLocalStorage()["fastRevive"]["earlyDischarge"];
                const container = document.createElement('div');
                const p = document.createElement('p');
                const toggleText = document.createElement('p');
 
 
                container.classList.add('fast-revives-container');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.gap = '10px';
                p.textContent = 'Set FastRevive Threshold';
                p.classList.add('fast-revives-threshold');
                toggleText.textContent = `Early discharge: ${isEnabled}`;
                toggleText.classList.add('fast-revives-threshold');
 
                p.addEventListener('click', () => {
                    let result;
                    let errorMessage = '';
 
                    do {
                        const message = errorMessage + '\nWhat is the lowest revive chances FastRevive should accept? (0-100)';
                        result = window.prompt(message, '0');
                        if (result === null) return;
                        result = parseInt(result, 10);
 
                        if (isNaN(result)) {
                            errorMessage = 'Error: Please enter a valid number.';
                        } else if (result < 0 || result > 100) {
                            errorMessage = 'Error: The value must be between 0 and 100.';
                        } else {
                            errorMessage = '';
                        }
                    } while (errorMessage);
 
                    setHospitalThreshold(result);
                });
 
                toggleText.addEventListener('click', () => {
                    isEnabled = !isEnabled;
                    toggleText.textContent = `Early discharge: ${isEnabled}`;
 
                    setHospitalEarlyDischarge(isEnabled);
                });
 
                container.appendChild(p);
                container.appendChild(toggleText);
                msgItemWrap.appendChild(container);
                observeToAddThresholdButton(msgItemWrap);
            });
        }
 
        function observeToAddThresholdButton(msgItemWrap) {
            const observer = new MutationObserver(() => {
                if (!msgItemWrap.querySelector('.fast-revives-threshold')) {
                    userThresholdInput();
                }
            });
 
            observer.observe(msgItemWrap, {childList: true, subtree: true});
        }
 
        function observeListChanges() {
            const userInfoList = document.querySelector('.user-info-list-wrap');
            if (!userInfoList) return;
 
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    addButtonsToList();
                });
            });
 
            observer.observe(userInfoList, {childList: true, subtree: true});
        }
 
        addGlobalStyles();
        userThresholdInput();
        addButtonsToList();
        observeListChanges();
    }
})();