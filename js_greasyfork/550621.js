// ==UserScript==
// @name         工作量表单智能填充助手
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  给系统添加一键填报和填报查看功能
// @author       damu
// @match        http://biaoju.labelvibe.com:8088/index*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550621/%E5%B7%A5%E4%BD%9C%E9%87%8F%E8%A1%A8%E5%8D%95%E6%99%BA%E8%83%BD%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550621/%E5%B7%A5%E4%BD%9C%E9%87%8F%E8%A1%A8%E5%8D%95%E6%99%BA%E8%83%BD%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isNeedSubmit = false;
    const DATE_KEY_LASTFILL = 'date-kay-lastfill';
    const CONFIG = {
        BUTTON_TEXT: '录入工作量',
        FILL_BUTTON_TEXT: '一键填入',
        DEFAULTS: {
            account: 'dtzhangqingjie',
            workHours: '8',
            markData: '1',
            qualityData: '0'
        }
    };

    async function init() {
        console.log("工作量表单智能填充助手init");
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button.el-button');
            if (button && button.querySelector('span')?.textContent.includes(CONFIG.BUTTON_TEXT)) {
                setTimeout(addFillButton, 50);
            }
        });
        const observer_1 = new MutationObserver(debounce(() => {
            getElementWithRetry('.el-menu', document, 50).then(elements => {
                if (elements.length > 0) {
                    //observer_1.disconnect();
                    addFillMenuItem();
                }
            });
        }, 600));
        observer_1.observe(document.body, { childList: true, subtree: true });
        const observer_2 = new MutationObserver(debounce(() => {
            if(window.location.href !== 'http://biaoju.labelvibe.com:8088/index#/projectTracking/produce') return;
            if(localStorage.getItem(DATE_KEY_LASTFILL) === new Date().toISOString().slice(0, 10)) {
                observer_2.disconnect();
                alert('今天可能已经填过系统了哦，请检查！');
                window.location.href = "http://biaoju.labelvibe.com:8088/index#/projectTracking/produceUserDetail?taskId=EC3286EFA4DDAB468DA8E84196DE36C5&userId=36DDDF6F11D637EBD41F79060075A7A3";
                return;
            };
            getElementWithRetry('button.el-button').then(buttons => {
                const targetButton = buttons.find(btn => btn.querySelector('span')?.textContent.trim() === CONFIG.BUTTON_TEXT);
                if (targetButton) {
                    observer_2.disconnect();
                    targetButton.click();
                }
            });
        }, 600));
        observer_2.observe(document.body, { childList: true, subtree: true });
        const observer_3 = new MutationObserver(debounce(() => {
            if(!isNeedSubmit || window.location.href !== 'http://biaoju.labelvibe.com:8088/index#/projectTracking/produce') return;
            isNeedSubmit = false;
            const isButtonInteractive = (button) => {
                if (!button) return false;
                const style = getComputedStyle(button);
                return (button.offsetParent !== null && // 可见
                        !button.disabled && // 未禁用
                        style.visibility !== 'hidden' && // 未隐藏
                        style.display !== 'none' // 未隐藏
                       );
            };
            const waitUntilInteractive = (button, maxAttempts = 10, interval = 500) => {
                return new Promise((resolve, reject) => {
                    let attempts = 0;
                    const check = () => {
                        if (isButtonInteractive(button)) {
                            resolve();
                        } else if (attempts < maxAttempts) {
                            attempts++;
                            setTimeout(check, interval);
                        } else {
                            reject(new Error('按钮未变为可交互状态'));
                        }
                    };
                    check();
                });
            };
            // 等待按钮加载并可交互
            const waitForInteractiveButton = async () => {
                const formActions = await getElementWithRetry('.dialog-footer', document, 30);
                let button = null;
                formActions.forEach(formAction => {
                    const submitSpan = formAction?.querySelector('button.el-button--primary span');
                    console.log('按钮名称：' ,submitSpan.textContent.trim());
                    if (submitSpan && submitSpan.textContent.trim() === '提 交'){
                        button = submitSpan.closest('button');
                    }
                });
                await sleep(20);
                if (!button) throw new Error('未找到按钮元素');
                // 等待按钮可交互
                await waitUntilInteractive(button, 5, 300);
                return button;
            };
            waitForInteractiveButton().then((button) => {
                const today = new Date().toISOString().slice(0, 10);
                if(localStorage.getItem(DATE_KEY_LASTFILL)===today) return;
                observer_3.disconnect();
                console.log("《点击提交按钮》");
                console.log(button);
                triggerEvent(button, 'focus');
                triggerEvent(button, 'click');
                localStorage.setItem(DATE_KEY_LASTFILL, today);
                setTimeout(() => {
                    window.location.href = "http://biaoju.labelvibe.com:8088/index#/projectTracking/produceUserDetail?taskId=EC3286EFA4DDAB468DA8E84196DE36C5&userId=36DDDF6F11D637EBD41F79060075A7A3";
                }, 100);
            });
        }, 600));
        observer_3.observe(document.body, { childList: true, subtree: true });
    }

    async function addFillButton() {
        const [formActions] = await getElementWithRetry('.dialog-footer');
        if (!formActions) return;
        const [existing] = await getElementWithRetry('#smart-fill-btn');
        if (existing) { existing.click(); return; }

        const fillButton = document.createElement('button');
        fillButton.id = 'smart-fill-btn';
        fillButton.className = 'el-button el-button--primary el-button--mini';
        fillButton.innerHTML = `<i class="el-icon-magic-stick"></i><span>${CONFIG.FILL_BUTTON_TEXT}</span>`;
        Object.assign(fillButton.style, {
            marginRight: '10px',
            marginTop: '10px'
        });

        fillButton.addEventListener('click', fillForm);
        formActions.parentNode.insertBefore(fillButton, formActions);
        fillButton.click();
    }

    async function fillForm() {
        const [accountInput] = await getElementWithRetry('[placeholder="请输入平台账号"]');
        if (accountInput) {
            accountInput.value = CONFIG.DEFAULTS.account;
            triggerEvent(accountInput, 'input');
        }

        const [dateInput] = await getElementWithRetry('[placeholder="选择时间"]');
        if (dateInput) {
            triggerEvent(dateInput, 'focus');
            await sleep(30);
            triggerEvent(dateInput, 'blur');
            const pickerPanel = document.querySelector('.el-picker-panel.el-date-picker.el-popper');
            if (pickerPanel) {
                pickerPanel.style.display = 'none'; // 隐藏日期选择器
            }
            const today = new Date();
            dateInput.value = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
            triggerEvent(dateInput, 'input');
            triggerEvent(dateInput, 'change');
        }

        const [hoursInput] = await getElementWithRetry('[placeholder="请输入工作时长"]');
        if (hoursInput) {
            hoursInput.value = CONFIG.DEFAULTS.workHours;
            triggerEvent(hoursInput, 'input');
        }

        const inputs = await getElementWithRetry('[placeholder="请输入数据量"]');
        if (inputs.length > 0) {
            if (inputs[0]) {
                inputs[0].value = CONFIG.DEFAULTS.markData;
                triggerEvent(inputs[0], 'input');
            }
            if (inputs[1]) {
                inputs[1].value = CONFIG.DEFAULTS.qualityData;
                triggerEvent(inputs[1], 'input');
            }
        }

        showFeedback('数据已填充完成！');
    }

    function showFeedback(message) {
        getElementWithRetry('#fill-feedback').then(([old]) => old && old.remove());

        const feedback = document.createElement('div');
        feedback.id = 'fill-feedback';
        feedback.textContent = message;
        feedback.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:10px 15px;background:#67C23A;color:white;border-radius:4px;box-shadow:0 2px 12px 0 rgba(0,0,0,0.1);z-index:9999;font-size:14px;transition:opacity 0.3s;';
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    async function addFillMenuItem() {
        const [oldContainer] = await getElementWithRetry('#MymenuItems', document, 2);
        if (oldContainer) return;

        const [menuContainer] = await getElementWithRetry('.el-menu');
        if (!menuContainer) {
            return;
        }
        const menuItemsContainer = document.createElement('div');
        menuItemsContainer.id = "MymenuItems";
        const createMenuItem = (text, onClick) => {
            const li = Object.assign(document.createElement('li'), { className: 'el-menu-item', style: 'padding-left:20px;color:#bfcbd9;background-color:#304156;cursor:pointer;'});
            li.innerHTML = `<i class="el-icon-edit" style="margin-right:5px;"></i><span>${text}</span>`;
            li.addEventListener('click', onClick);
            return li;
        };
        const oneClickItem = createMenuItem("一键填报", () => {
            getElementWithRetry('tr.el-table__row').then(rows => {
                const today = new Date().toISOString().slice(0, 10);
                if(localStorage.getItem(DATE_KEY_LASTFILL) !== today){
                    console.log("一键填报-1");
                    isNeedSubmit = true;
                }else if (rows.length > 0 && window.location.href === "http://biaoju.labelvibe.com:8088/index#/projectTracking/produceUserDetail?taskId=EC3286EFA4DDAB468DA8E84196DE36C5&userId=36DDDF6F11D637EBD41F79060075A7A3") {
                    let fillTime = rows[0].querySelectorAll('td.is-center.el-table__cell');
                    if (fillTime.length > 4 && (fillTime[4].querySelector('span')?.textContent.trim() !== today)) {
                        console.log("+一键填报-2");
                        isNeedSubmit = true;
                    }
                }
                window.location.href = "http://biaoju.labelvibe.com:8088/index#/projectTracking/produce";
            });
        });
        const viewItem = createMenuItem("填报查看", () => {
            window.location.href = "http://biaoju.labelvibe.com:8088/index#/projectTracking/produceUserDetail?taskId=EC3286EFA4DDAB468DA8E84196DE36C5&userId=36DDDF6F11D637EBD41F79060075A7A3";
        });
        menuItemsContainer.appendChild(oneClickItem);
        menuItemsContainer.appendChild(viewItem);
        menuContainer.appendChild(menuItemsContainer);
    }

    function triggerEvent(element, eventName) {
        const event = new Event(eventName, { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function debounce(func, delay) {
        let timeoutId;
        return function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

    function getElementWithRetry(selectors, root = document, retries = 5) {
        return new Promise(resolve => {
            let attempts = 0;
            const selectorList = Array.isArray(selectors) ? selectors : [selectors];
            const rootElement = root || document;

            (function tryGetElement() {
                for (const selector of selectorList) {
                    const elements = Array.from(rootElement.querySelectorAll(selector));
                    if (elements.length) {
                        return resolve(elements);
                    }
                }
                if (++attempts < retries) {
                    setTimeout(tryGetElement, Math.floor(Math.random() * 71) + 30);
                } else {
                    resolve([]);
                }
            })();
        });
    }

    window.onload = function () {
        document.body.style.zoom = 1;
        init();
    }
})();