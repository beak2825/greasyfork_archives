// ==UserScript==
// @name        住院伴侣
// @namespace   Violentmonkey Scripts
// @match       http://10.176.0.84/*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @version     1.01
// @author      万水千山总能旗开得胜
// @description 2025/2/4 18:31:26
// @downloadURL https://update.greasyfork.org/scripts/561775/%E4%BD%8F%E9%99%A2%E4%BC%B4%E4%BE%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/561775/%E4%BD%8F%E9%99%A2%E4%BC%B4%E4%BE%A3.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`
        .new-class {
            color: red;
            font-size: 20px;
        }
    `);
})();
//设定共同操作保存操作binglishuxie
  function binglishuxie() {

    const TARGET_TEXT2 = '病历书写';
    let clicked2 = false;

    const clickSaveSpan2 = () => {
        if (clicked2) return;

        // 主文档检测
        const spans2 = [...document.querySelectorAll('span')];
        const saveSpan2 = spans2.find(span2 =>
            span2.textContent.trim() === TARGET_TEXT2 &&
            getComputedStyle(span2).display !== 'none' &&
            span2.offsetParent !== null
        );

        if (saveSpan2) {
            saveSpan2.click();
            console.log('病历书写按钮已点击（仅一次）');
            clicked2 = true;
        }
    };

    // 初始检测
    clickSaveSpan2();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer2 = new MutationObserver(clickSaveSpan2);
    observer2.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer2.disconnect(), 3000);
};
//设定共同操作保存操作xinjian
  function xinjian() {

       let hasClicked = false; // 标记是否已经执行过点击

function clickElements() {
    if (hasClicked) return; // 如果已经点击过，直接返回

    // 查找所有匹配的元素
    const elements = document.querySelectorAll('.node-icon.fa.fa-plus-circle');

    if (elements.length > 0) {
        // 遍历并点击每个元素
        elements.forEach(element => {
            try {
                element.click();
                console.log('已点击元素:', element);
            } catch (error) {
                console.warn('点击元素时出错:', error);
            }
        });

        hasClicked = true; // 标记为已点击
        console.log(`已点击 ${elements.length} 个元素，脚本将停止执行`);

        // 停止观察DOM变化
        if (observer) {
            observer.disconnect();
            console.log('已停止DOM观察');
        }
    }
}

// 初始点击
setTimeout(clickElements, 1000);

// 创建MutationObserver
const observer = new MutationObserver(function(mutations) {
    if (hasClicked) {
        observer.disconnect(); // 如果已经点击过，立即停止观察
        return;
    }

    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && !hasClicked) { // 元素节点且未点击过
                const newElements = node.querySelectorAll ?
                    node.querySelectorAll('.node-icon.fa.fa-plus-circle') : [];

                if (newElements.length > 0) {
                    clickElements(); // 执行点击并停止
                }

                // 检查节点本身是否匹配
                if (node.matches && node.matches('.node-icon.fa.fa-plus-circle') && !hasClicked) {
                    clickElements(); // 执行点击并停止
                }
            }
        });
    });
});

// 开始观察DOM变化
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// 添加手动触发函数
window.manualSingleClick = function() {
    if (!hasClicked) {
        clickElements();
    } else {
        console.log('脚本已经执行过点击操作');
    }
};

};



//设定共同操作保存操作chuangjian

function chuangjian() {

    const TARGET_TEXT = '创建';
    let clicked = false;

    const clickSaveSpan = () => {
        if (clicked) return;

        // 主文档检测
        const spans = [...document.querySelectorAll('span')];
        const saveSpan = spans.find(span =>
            span.textContent.trim() === TARGET_TEXT &&
            getComputedStyle(span).display !== 'none' &&
            span.offsetParent !== null
        );

        if (saveSpan) {
            saveSpan.click();
            console.log('模板引用按钮已点击（仅一次）');
            clicked = true;
        }
    };

    // 初始检测
    clickSaveSpan();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSaveSpan);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
}
//设定共同操作保存操作个人模板
  function menzhenbingli() {
 'use strict';

    // 配置参数
    const CONFIG = {
        targetText: '门（急）诊病历',
        maxWaitTime: 1000, // 最大等待时间10秒
        checkInterval: 100   // 检查间隔500毫秒
    };

    let inputFound = false;
    let startTime = Date.now();

    function findAndFillInput() {
        // 如果已找到或超时，停止查找
        if (inputFound || (Date.now() - startTime) > CONFIG.maxWaitTime) {
            return;
        }

        // 查找目标输入框
        const targetInputs = document.querySelectorAll('input.el-input__inner');

        for (let input of targetInputs) {
            if (input.getAttribute('placeholder') === '病历类型筛选' &&
                input.type === 'text' &&
                input.getAttribute('autocomplete') === 'off') {

                // 找到目标输入框
                fillInputField(input);
                inputFound = true;
                return;
            }
        }

        // 如果未找到，继续查找
        setTimeout(findAndFillInput, CONFIG.checkInterval);
    }

    function fillInputField(inputElement) {
        try {
            // 设置输入框的值
            inputElement.value = CONFIG.targetText;

            // 触发所有必要的事件以确保数据绑定
            triggerEvents(inputElement);

            // 添加视觉反馈
            addVisualFeedback(inputElement);

            // 记录成功日志
            console.log(`成功在输入框中输入: ${CONFIG.targetText}`);

            // 显示成功提示
            showNotification(`已自动填写: ${CONFIG.targetText}`, 'success');

        } catch (error) {
            console.error('填写输入框时出错:', error);
            showNotification('自动填写失败: ' + error.message, 'error');
        }
    }

    function triggerEvents(element) {
        // 触发输入事件
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(inputEvent);

        // 触发改变事件
        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(changeEvent);

        // 触发焦点事件
        const focusEvent = new Event('focus', {
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(focusEvent);

        // 触发失去焦点事件
        const blurEvent = new Event('blur', {
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(blurEvent);

        // 对于Vue.js等框架，可能需要触发特定的事件
        if (typeof Vue !== 'undefined') {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, 'value'
            ).set;
            nativeInputValueSetter.call(element, CONFIG.targetText);
        }
    }

    function addVisualFeedback(element) {
        // 保存原始样式
        const originalBorder = element.style.border;
        const originalBoxShadow = element.style.boxShadow;
        const originalBackground = element.style.backgroundColor;

        // 添加成功高亮样式
        element.style.border = '2px solid #48bb78';
        element.style.boxShadow = '0 0 10px rgba(72, 187, 120, 0.5)';
        element.style.backgroundColor = '#f0fff4';
        element.style.transition = 'all 0.5s ease';

        // 3秒后恢复原始样式
        setTimeout(() => {
            element.style.border = originalBorder;
            element.style.boxShadow = originalBoxShadow;
            element.style.backgroundColor = originalBackground;
        }, 3000);
    }

    function showNotification(message, type = 'success') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? '#f56565' : '#48bb78'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;

        // 添加动画样式
        if (!document.querySelector('#autofill-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'autofill-notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 页面加载完成后开始查找
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(findAndFillInput, 100);
        });
    } else {
        setTimeout(findAndFillInput, 100);
    }

    // 监听动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        if (!inputFound) {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    findAndFillInput();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 提供手动触发的方法
    window.manualTriggerAutofill = function() {
        inputFound = false;
        findAndFillInput();
    };

    console.log('病历类型自动输入脚本已加载');
};
//设定共同操作保存操作binglidianji1
  function binglidianji1() {
  'use strict';

    let clickCount = 0;
    const maxClicks = 2;
    let clickInterval;

    // 定义点击函数
    function clickTargetElement() {
        // 如果已经达到最大点击次数，直接返回
        if (clickCount >= maxClicks) {
            return false;
        }

        // 查找所有包含cell和el-tooltip类的div元素
        const targetElements = document.querySelectorAll('div.cell.el-tooltip');
        let clicked = false;

        targetElements.forEach(div => {
            // 检查元素文本内容是否包含"门（急）诊病历"
            if (div.textContent.trim() === '门（急）诊病历' && !div.getAttribute('data-double-clicked')) {
                console.log('找到目标元素，执行第' + (clickCount + 1) + '次点击操作');
                div.click();
                clicked = true;
                clickCount++;

                // 如果是最后一次点击，标记元素并停止观察器
                if (clickCount >= maxClicks) {
                    div.setAttribute('data-double-clicked', 'true');
                    observer.disconnect();
                    console.log('双击完成，观察器已停止');
                }
            }
        });

        return clicked;
    }

    // 执行双击操作
    function performDoubleClick() {
        // 清空之前的点击计数
        clickCount = 0;

        // 第一次点击
        const firstClick = clickTargetElement();
        if (firstClick) {
            console.log('成功执行第一次点击');

            // 延迟执行第二次点击
            clickInterval = setTimeout(() => {
                const secondClick = clickTargetElement();
                if (secondClick) {
                    console.log('成功执行第二次点击，双击操作完成');
                }
            }, 800);
        } else {
            console.log('未找到门（急）诊病历元素');
        }
    }

    // 初始尝试双击
    setTimeout(() => {
        performDoubleClick();
    }, 1000);

    // 使用MutationObserver监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0 && clickCount < maxClicks) {
                setTimeout(() => {
                    performDoubleClick();
                }, 300);
            }
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 添加手动触发快捷键（Ctrl+Shift+D）
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            clearTimeout(clickInterval);
            performDoubleClick();
        }
    });

    console.log('门（急）诊病历双击器已加载，等待目标元素出现...');
  };




//设定共同操作保存操作binglidianji
  function binglidianji() {
 'use strict';

    let hasClicked = false; // 全局标记，确保只点击一次

    // 定义点击函数
    function clickPersonalTemplate() {
        // 如果已经点击过，直接返回
        if (hasClicked) {
            return false;
        }

        // 查找所有包含node-title类的div元素
        const allTitles = document.querySelectorAll('div.node-title');
        let clicked = false;

        allTitles.forEach(div => {
            // 检查元素文本内容是否包含"个人模板"且未点击过
            if (div.textContent.trim() === '门（急）诊病历' && !div.getAttribute('data-auto-clicked')) {
                console.log('找到门（急）诊病历元素，执行单次点击操作');
                div.click();
                clicked = true;
                hasClicked = true; // 设置全局标记

                // 标记已点击，避免重复点击
                div.setAttribute('data-auto-clicked', 'true');

                // 点击成功后停止观察，释放资源
                observer.disconnect();
                console.log('单次点击完成，观察器已停止');
            }
        });

        return clicked;
    }

    // 初始尝试点击
    setTimeout(() => {
        if (clickPersonalTemplate()) {
            console.log('成功点击门（急）诊病历元素（单次）');
        } else {
            console.log('初始未找到门（急）诊病历元素，继续监听');
        }
    }, 1000);

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0 && !hasClicked) {
                setTimeout(() => {
                    const found = clickPersonalTemplate();
                    if (found) {
                        console.log('通过观察器找到并点击了门（急）诊病历（单次）');
                    }
                }, 300);
            }
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 添加手动触发快捷键（Ctrl+Shift+T）
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (clickPersonalTemplate()) {
                console.log('手动触发：成功点击门（急）诊病历（单次）');
            } else {
                console.log('手动触发：未找到门（急）诊病历元素或已点击过');
            }
        }
    });

    console.log('个人模板单次点击器已加载，等待目标元素出现...');
};








//设定共同操作保存操作mubanku
  function mubanku() {

    const TARGET_TEXT1 = "模板库";
    let clicked1 = false;

    const clickSavediv = () => {
        if (clicked1) return;

        // 主文档检测
        const divs = [...document.querySelectorAll('div')];
        const savediv = divs.find(div =>
            div.textContent.trim() === TARGET_TEXT1 &&
            getComputedStyle(div).display !== 'none' &&
            div.offsetParent !== null
        );

        if (savediv) {
            savediv.click();
            console.log('个人模板按钮已点击（仅一次）');
            clicked1 = true;
        }
    };

    // 初始检测
    clickSavediv();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSavediv);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};
//设定共同操作保存操作个人模板
  function gerenmuban() {
  'use strict';

    let hasClicked = false; // 全局标记，确保只点击一次

    // 定义点击函数
    function clickPersonalTemplate() {
        // 如果已经点击过，直接返回
        if (hasClicked) {
            return false;
        }

        // 查找所有包含node-title类的div元素
        const allTitles = document.querySelectorAll('div.node-title');
        let clicked = false;

        allTitles.forEach(div => {
            // 检查元素文本内容是否包含"个人模板"且未点击过
            if (div.textContent.trim() === '个人模板' && !div.getAttribute('data-auto-clicked')) {
                console.log('找到个人模板元素，执行单次点击操作');
                div.click();
                clicked = true;
                hasClicked = true; // 设置全局标记

                // 标记已点击，避免重复点击
                div.setAttribute('data-auto-clicked', 'true');

                // 点击成功后停止观察，释放资源
                observer.disconnect();
                console.log('单次点击完成，观察器已停止');
            }
        });

        return clicked;
    }

    // 初始尝试点击
    setTimeout(() => {
        if (clickPersonalTemplate()) {
            console.log('成功点击个人模板元素（单次）');
        } else {
            console.log('初始未找到个人模板元素，继续监听');
        }
    }, 1000);

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0 && !hasClicked) {
                setTimeout(() => {
                    const found = clickPersonalTemplate();
                    if (found) {
                        console.log('通过观察器找到并点击了个人模板（单次）');
                    }
                }, 300);
            }
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 添加手动触发快捷键（Ctrl+Shift+T）
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (clickPersonalTemplate()) {
                console.log('手动触发：成功点击个人模板（单次）');
            } else {
                console.log('手动触发：未找到个人模板元素或已点击过');
            }
        }
    });

    console.log('个人模板单次点击器已加载，等待目标元素出现...');

};

//设定共同操作保存操作住院患者参保身份审核单

  function zhuyuan() {
 'use strict';

    let hasClicked = false; // 全局标记，确保只点击一次

    // 定义点击函数
    function clickPersonalTemplate() {
        // 如果已经点击过，直接返回
        if (hasClicked) {
            return false;
        }

        // 查找所有包含node-title类的div元素
        const allTitles = document.querySelectorAll('div.node-title');
        let clicked = false;

        allTitles.forEach(div => {
            // 检查元素文本内容是否包含"个人模板"且未点击过
            if (div.textContent.trim() === '住院患者参保身份审核单' && !div.getAttribute('data-auto-clicked')) {
                console.log('找到个人模板元素，执行单次点击操作');
                div.click();
                clicked = true;
                hasClicked = true; // 设置全局标记

                // 标记已点击，避免重复点击
                div.setAttribute('data-auto-clicked', 'true');

                // 点击成功后停止观察，释放资源
                observer.disconnect();
                console.log('单次点击完成，观察器已停止');
            }
        });

        return clicked;
    }

    // 初始尝试点击
    setTimeout(() => {
        if (clickPersonalTemplate()) {
            console.log('成功点击住院患者参保身份审核单元素（单次）');
        } else {
            console.log('初始未找到住院患者参保身份审核单元素，继续监听');
        }
    }, 1000);

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0 && !hasClicked) {
                setTimeout(() => {
                    const found = clickPersonalTemplate();
                    if (found) {
                        console.log('通过观察器找到并点击了住院患者参保身份审核单（单次）');
                    }
                }, 300);
            }
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 添加手动触发快捷键（Ctrl+Shift+T）
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (clickPersonalTemplate()) {
                console.log('手动触发：成功点击住院患者参保身份审核单（单次）');
            } else {
                console.log('手动触发：未找到住院患者参保身份审核单元素或已点击过');
            }
        }
    });

    console.log('住院患者参保身份审核单单次点击器已加载，等待目标元素出现...');
};
//设定共同操作保存操作确认单+劝阻单

  function querendan() {
 'use strict';

    let hasClicked = false; // 全局标记，确保只点击一次

    // 定义点击函数
    function clickPersonalTemplate() {
        // 如果已经点击过，直接返回
        if (hasClicked) {
            return false;
        }

        // 查找所有包含node-title类的div元素
        const allTitles = document.querySelectorAll('div.node-title');
        let clicked = false;

        allTitles.forEach(div => {
            // 检查元素文本内容是否包含"个人模板"且未点击过
            if (div.textContent.trim() === '确认单+劝阻单' && !div.getAttribute('data-auto-clicked')) {
                console.log('找到确认单+劝阻单元素，执行单次点击操作');
                div.click();
                clicked = true;
                hasClicked = true; // 设置全局标记

                // 标记已点击，避免重复点击
                div.setAttribute('data-auto-clicked', 'true');

                // 点击成功后停止观察，释放资源
                observer.disconnect();
                console.log('单次点击完成，观察器已停止');
            }
        });

        return clicked;
    }

    // 初始尝试点击
    setTimeout(() => {
        if (clickPersonalTemplate()) {
            console.log('成功点击确认单+劝阻单元素（单次）');
        } else {
            console.log('初始未找到确认单+劝阻单元素，继续监听');
        }
    }, 1000);

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0 && !hasClicked) {
                setTimeout(() => {
                    const found = clickPersonalTemplate();
                    if (found) {
                        console.log('通过观察器找到并点击了确认单+劝阻单（单次）');
                    }
                }, 300);
            }
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 添加手动触发快捷键（Ctrl+Shift+T）
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (clickPersonalTemplate()) {
                console.log('手动触发：成功点击确认单+劝阻单（单次）');
            } else {
                console.log('手动触发：未找到确认单+劝阻单元素或已点击过');
            }
        }
    });

    console.log('确认单+劝阻单单次点击器已加载，等待目标元素出现...');
};

//设定共同操作保存操作yinyong
  function yinyong() {

    const TARGET_TEXT = '模板引用(含页眉、页脚)';
    let clicked = false;

    const clickSaveSpan = () => {
        if (clicked) return;

        // 主文档检测
        const spans = [...document.querySelectorAll('span')];
        const saveSpan = spans.find(span =>
            span.textContent.trim() === TARGET_TEXT &&
            getComputedStyle(span).display !== 'none' &&
            span.offsetParent !== null
        );

        if (saveSpan) {
            saveSpan.click();
            console.log('模板引用按钮已点击（仅一次）');
            clicked = true;
        }
    };

    // 初始检测
    clickSaveSpan();

    // 短时间监听DOM变化（3秒后自动停止）
    const observer = new MutationObserver(clickSaveSpan);
    observer.observe(document.body, { subtree: true, childList: true });
    setTimeout(() => observer.disconnect(), 3000);
};
//设定共同操作保存操作shuru0
  function shuru0() {
    'use strict';

    // 定义输入函数
    function inputZero() {
        const inputElement = document.getElementById('top');

        if (inputElement && inputElement.type === 'text' && !inputElement.hasAttribute('data-auto-filled')) {
            console.log('找到目标输入框，正在输入0');

            // 设置输入框值为0
            inputElement.value = '0';

            // 触发相关事件，确保值变化被正确监听
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            inputElement.dispatchEvent(new Event('blur', { bubbles: true }));

            // 标记已填充，避免重复操作
            inputElement.setAttribute('data-auto-filled', 'true');

            console.log('成功在输入框中输入0');
            return true;
        }

        return false;
    }

    // 初始尝试输入
    setTimeout(() => {
        if (inputZero()) {
            console.log('自动输入0完成');
        } else {
            console.log('初始未找到输入框，启动观察器监听');
        }
    }, 1000);

    // 使用MutationObserver监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                setTimeout(() => {
                    const found = inputZero();
                    if (found) {
                        console.log('通过观察器找到并输入了0');
                    }
                }, 500);
            }
        }
    });

    // 启动观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'id']
    });

    // 添加手动触发功能
    document.addEventListener('keydown', (e) => {
        // 按Ctrl+Shift+0手动触发输入
        if (e.ctrlKey && e.shiftKey && e.key === '0') {
            e.preventDefault();
            if (inputZero()) {
                console.log('手动触发：成功输入0');
            } else {
                console.log('手动触发：未找到目标输入框');
            }
        }
    });

    console.log('自动输入0脚本已加载');
};


// 在Tampermonkey脚本管理菜单中添加自定义命令
GM_registerMenuCommand("📊 办住院", () => {
  binglishuxie()
      setTimeout(function () {
        xinjian()
        }, 1000 );

  setTimeout(function () {
        menzhenbingli()
    //binglidianji1()
        }, 2000 );
        setTimeout(function () {
        chuangjian()
          binglidianji()
        }, 2500 );

   /* setTimeout(function () {
        document.querySelector("#pane-EmrTree > div > div.el-tree-node.is-expanded.is-focusable > div.el-tree-node__children > div > div.el-tree-node__children > div > div > div > div.node-title").click()
        }, 4300 );*/
  setTimeout(function () {
  mubanku()
    //document.querySelector("#tab-TemplateTree").click()
        }, 4000 );
    setTimeout(function () {
        gerenmuban()
        zhuyuan()
        querendan()
        }, 4500 );

      setTimeout(function () {
  yinyong()
        //shuru0()
        }, 5000 );
});
