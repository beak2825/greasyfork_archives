// ==UserScript==
// @name         AutoFarm
// @version      0.0.2
// @description  Auto launch your farms
// @author       Hibou
// @match        https://*.ogame.gameforge.com/game/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setValues
// @namespace https://greasyfork.org/users/1501974
// @downloadURL https://update.greasyfork.org/scripts/554022/AutoFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/554022/AutoFarm.meta.js
// ==/UserScript==

console.log("AutoFarm script loaded");
const STORAGE_KEY = `autofarm_launched`;


async function waitForElement(selector) {
    return new Promise(resolve => {
        const isVisible = el => el && el.offsetParent !== null;

        const existing = document.querySelector(selector);
        if (isVisible(existing)) return resolve(existing);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (isVisible(el)) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function waitForAjaxLoadingToHide() {
    return new Promise(resolve => {
        const loading = document.querySelector('.ajax_loading');
        if (!loading || getComputedStyle(loading).display === 'none') {
            return resolve();
        }
        const observer = new MutationObserver(() => {
            if (getComputedStyle(loading).display === 'none') {
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(loading, { attributes: true, attributeFilter: ['style'] });
    });
}

async function sleep(start, end) {
    const sleepTime = Math.round(Math.random() * (end - start) + start);
    console.log(`Sleeping for ${sleepTime} ms`);
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}

function setLaunched(value) {
    GM_setValue(STORAGE_KEY, value);
}

function getLaunched() {
    return GM_getValue(STORAGE_KEY, false);
}

async function sendFleet() {
    const enterKey = await waitForElement('div[data-key="enter"]');
    if (enterKey) {
        await sleep(500, 1000);
        enterKey.click();
        console.log('Clicked enter key to launch farms');
        await waitForAjaxLoadingToHide();

        const sendFleetBtn = await waitForElement('#sendFleet');
        if (sendFleetBtn) {
            await sleep(500, 1000);
            sendFleetBtn.click();
            console.log('Clicked send fleet button');
        }
    }
}

async function goToFleetDispatch() {
    const enterKey = document.querySelector('div[data-key-id="attackNext"]');
    if (enterKey) {
        enterKey.click();
    } else {
        console.error('Could not find attackNext button.');
    }
}

(async function () {
    'use strict';

    if (getLaunched()) {
        console.log('AutoFarm is launched, proceeding to send fleet');
        const url = window.location.href;

        await sleep(500, 2000);

        if (url.includes('fleetdispatch')) {
            await sendFleet();
        } else if (url.includes('messages')) {
            console.log('On messages page, checking spy reports');
            await waitForElement('.ogl_spyLine');
            console.log('Spy reports loaded');
            const spyReports = document.querySelectorAll('a[data-tooltip-title="attack this position !"]');
            if (spyReports) {
                console.log(`Found ${spyReports.length} spy reports`);
                const allLaunched = Array.from(spyReports).every(report => report.children.length > 0);
                if (allLaunched) {
                    console.log('All farms have been launched.');
                    setLaunched(false);
                    return;
                } else {
                    await goToFleetDispatch();
                }
            }
        }
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'autofarm-panel';
        panel.className = 'ogl_ogameDiv';
        panel.style.padding = '10px';
        panel.style.marginTop = '10px';
        panel.style.zIndex = 1000;

        // Title
        const title = document.createElement('h3');
        title.textContent = 'AutoFarm';
        panel.appendChild(title);

        // Launch Button
        const launchButton = document.createElement('button');
        launchButton.textContent = 'Launch';
        launchButton.style.marginTop = '10px';
        launchButton.addEventListener('click', () => {
            setLaunched(true);
            console.log('AutoFarm launched');
            goToFleetDispatch();
        });
        panel.appendChild(launchButton);

        // Stop Button
        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.style.marginTop = '10px';
        stopButton.addEventListener('click', () => {
            setLaunched(false);
            console.log('AutoFarm stopped');
        });
        panel.appendChild(stopButton);

        // Attach panel to the page
        const linksDiv = document.querySelector('#links');
        if (linksDiv) {
            linksDiv.appendChild(panel);
        } else {
            console.error('Could not find #links to attach the panel.');
        }
        return panel;
    }

    createPanel();

})();