// ==UserScript==
// @name         我欲修仙 - 修为修改器
// @namespace    https://www.xxx5217.com
// @version      1.0
// @description  修改我欲修仙游戏的修为值
// @author       OD
// @match        https://www.xxx5217.com/xiuxian.html
// @grant        none
// @license        none
// @downloadURL https://update.greasyfork.org/scripts/548323/%E6%88%91%E6%AC%B2%E4%BF%AE%E4%BB%99%20-%20%E4%BF%AE%E4%B8%BA%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548323/%E6%88%91%E6%AC%B2%E4%BF%AE%E4%BB%99%20-%20%E4%BF%AE%E4%B8%BA%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

// Wait until the Vue app is loaded
let checkVue = setInterval(() => {
    if (typeof app !== 'undefined' && app.point) {
        clearInterval(checkVue);
        initModPanel();
    }
}, 1000);

// Initialize the modification panel
function initModPanel() {
    let modPanel = document.createElement('div');
    modPanel.style.position = 'absolute';
    modPanel.style.top = '50px';
    modPanel.style.left = '50px';
    modPanel.style.padding = '20px';
    modPanel.style.backgroundColor = '#fff';
    modPanel.style.border = '1px solid #ccc';
    modPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    modPanel.style.zIndex = 9999;
    modPanel.innerHTML = `
        <h3>Modify Game Stats</h3>
        <label for="points-input">修为 (Cultivation): </label>
        <input type="number" id="points-input" value="${app.point}" />
        <button id="set-points">Set 修为</button><br />

        <label for="renown-input">名望 (Reputation): </label>
        <input type="number" id="renown-input" value="${app.renown}" />
        <button id="set-renown">Set 名望</button><br />

        <label for="money-input">财富 (Wealth): </label>
        <input type="number" id="money-input" value="${app.money}" />
        <button id="set-money">Set 财富</button><br />
    `;
    document.body.appendChild(modPanel);

    // Modify 修为 (Cultivation)
    document.getElementById('set-points').addEventListener('click', function() {
        const inputVal = document.getElementById('points-input').value;
        if (inputVal) {
            const newValue = new BigNumber(inputVal);
            app.point = newValue;
            updateDisplay();
        }
    });

    // Modify 名望 (Reputation)
    document.getElementById('set-renown').addEventListener('click', function() {
        const inputVal = document.getElementById('renown-input').value;
        if (inputVal) {
            const newValue = new BigNumber(inputVal);
            app.renown = newValue;
            updateDisplay();
        }
    });

    // Modify 财富 (Wealth)
    document.getElementById('set-money').addEventListener('click', function() {
        const inputVal = document.getElementById('money-input').value;
        if (inputVal) {
            const newValue = new BigNumber(inputVal);
            app.money = newValue;
            updateDisplay();
        }
    });
}

// Function to update the display after modification
function updateDisplay() {
    // Ensure the display reflects the updated values
    // For example, if the value is shown in specific elements:
    document.getElementById('now_num').innerText = `修为: ${app.point.toString()}`;
    document.getElementById('renown-display').innerText = `名望: ${app.renown.toString()}`;
    document.getElementById('money-display').innerText = `财富: ${app.money.toString()}`;
}

// 每隔一段时间更新当前修为显示
setInterval(updateDisplay, 1000);

