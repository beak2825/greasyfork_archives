// ==UserScript==
// @name         [银河奶牛]组队9战
// @namespace    http://tampermonkey.net/
// @version      2025-12-29
// @license MIT
// @description  在已开始的组队战斗状态下，点击开始执行组队9战，然后开始检测当前战斗次数，超过9次，则取消战斗准备，然后重新进行战斗准备并开始战斗，可修改 toggleCombat方法的startCombatTimes(9);位置修改战斗次数
// @author       You
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560598/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E7%BB%84%E9%98%9F9%E6%88%98.user.js
// @updateURL https://update.greasyfork.org/scripts/560598/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E7%BB%84%E9%98%9F9%E6%88%98.meta.js
// ==/UserScript==

(function() {
    let num = 0;
let combatTimes = null;
let isRunning = false;
let teamButton = null;

function toggleCombat() {
    const button = document.getElementById('frequencyCombat');
    if (isRunning) {
        stopCombatTimes();
        button.textContent = '开始执行组队9战';
    } else {
        startCombatTimes(9);
        button.textContent = '停止执行组队9战';
    }

    isRunning = !isRunning; // 切换状态
}

function startCombatTimes(number) {
    console.log('开始执行组队9战')
    combatTimes = setInterval(() => {
        const buttons = document.querySelectorAll('.CombatPanel_tabsComponentContainer__GsQlg .MuiButtonBase-root');
        let targetText = null;
        buttons.forEach(button => {
            const text = button.textContent || button.innerText;
            // 使用战斗次数
            let matches = text.match(/\d+/g);
            if (matches && matches[0] > number) {
                targetText = text;
            }
            // 直接使用文字
            // if (text.includes('交战 #'+(number*1+1))) {
            // targetText = text;
            // }
        });

        if (targetText !== null) {
            teamButton.click();
            targetText = null;
            setTimeout(() => {

                const readyButton = document.querySelector('.CombatPanel_tabsComponentContainer__GsQlg .Party_buttonsContainer__34UMd .Button_button__1Fe9z');
                if (readyButton) {
                    readyButton.click(); // 取消战斗准备
                    setTimeout(() => {
                        const MuiDialogButton = document.querySelector('.MuiDialog-paper .Button_success__6d6kU');
                        MuiDialogButton.click(); // 询问框点击确定
                    }, 1500)

                    setTimeout(() => {
                        readyButton.click(); // 点击准备继续，继续战斗
                    }, 2000);
                    num++
                    console.log('已执行' + num + '次');
                } else {
                    console.log('未找到准备战斗元素');
                }

            }, 2000);
        }
    }, 5000)
}

function stopCombatTimes() {
    console.log('停止执行组队9战')
    clearInterval(combatTimes);
}

function observe() {
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                // @ts-ignore
                const classList = addedNode.classList;
                if (!classList) return;

                // 切换页面
                if (classList.contains('MainPanel_subPanelContainer__1i-H9')) {
                    // @ts-ignore
                    if (addedNode.querySelector(".CombatPanel_combatPanel__QylPo")) {
                        createButtonBeforeEdible()
                    }
                }
                if (classList.contains('GamePage_contentPanel__Zx4FH')) {
                    // @ts-ignore
                    if (addedNode.querySelector('div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div.CombatPanel_combatPanel__QylPo')) {
                        createButtonBeforeEdible()
                    }
                }

            });
        });
    });
    const rootNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(rootNode, config);
}

function createButtonBeforeEdible() {
    const navs = document.querySelectorAll('.CombatPanel_tabsComponentContainer__GsQlg .MuiButtonBase-root');
    const targetElement = document.querySelector('.CombatPanel_tabsComponentContainer__GsQlg .TabsComponent_tabsContainer__3BDUp');
    if (targetElement) {
        // 检查按钮是否已存在
        if (!document.getElementById('frequencyCombat')) {
            // 创建新按钮
            const newButton = document.createElement('button');
            newButton.id = 'frequencyCombat';
            newButton.textContent = '开始执行组队9战';
            newButton.style.width = '180px';
            newButton.addEventListener('click', toggleCombat);
            targetElement.appendChild(newButton);
        }
    }
    teamButton = Array.from(navs).find(button =>
        button.textContent.includes('我的队伍')
    );
}

observe()

})();