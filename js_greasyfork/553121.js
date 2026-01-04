// ==UserScript==
// @name         考试宝自动显示AI解析+去广告+答题音效+键盘翻题
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  移除answer-analysis-row元素中的hide-height类，显示被隐藏的内容
// @author       You
// @match        https://www.kaoshibao.com/online/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553121/%E8%80%83%E8%AF%95%E5%AE%9D%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BAAI%E8%A7%A3%E6%9E%90%2B%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E7%AD%94%E9%A2%98%E9%9F%B3%E6%95%88%2B%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/553121/%E8%80%83%E8%AF%95%E5%AE%9D%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BAAI%E8%A7%A3%E6%9E%90%2B%E5%8E%BB%E5%B9%BF%E5%91%8A%2B%E7%AD%94%E9%A2%98%E9%9F%B3%E6%95%88%2B%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主要处理函数
    function removeHideEffect() {
        // 查找所有包含answer-analysis-row和hide-height类的元素
        const elements = document.querySelectorAll('.answer-analysis-row.hide-height');

        if (elements.length > 0) {
            console.log(`找到 ${elements.length} 个需要处理的元素`);

            elements.forEach(element => {
                // 移除hide-height类，显示被隐藏的内容
                element.classList.remove('hide-height');
                console.log('已移除hide-height类，内容现在可见');

                // 可选：添加一个视觉反馈
                element.style.transition = 'all 0.3s ease';
                element.style.backgroundColor = 'rgba(144, 238, 144, 0.1)'; // 浅绿色背景作为视觉反馈
            });
        }
    }

    // 初始执行
    removeHideEffect();

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 检查新增的节点是否包含目标元素
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        if (node.classList && node.classList.contains('answer-analysis-row') && node.classList.contains('hide-height')) {
                            shouldProcess = true;
                        }
                        // 检查子节点
                        if (node.querySelectorAll('.answer-analysis-row.hide-height').length > 0) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });

        if (shouldProcess) {
            setTimeout(removeHideEffect, 100);
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后再次检查
    window.addEventListener('load', function() {
        setTimeout(removeHideEffect, 1000);
    });

    // 添加手动触发按钮到答案解析标题后面
    function addManualButton() {
        // 查找所有包含"答案解析"的标题
        const analysisTitles = document.querySelectorAll('.p-tit');

        analysisTitles.forEach(title => {
            if (title.textContent.includes('答案解析')) {
                // 检查是否已存在按钮
                const existingBtn = title.parentNode.querySelector('.show-analysis-btn');
                if (existingBtn) return;

                const button = document.createElement('button');
                button.className = 'show-analysis-btn';
                button.innerHTML = '显示AI解析';
                button.style.marginLeft = '10px';
                button.style.padding = '2px 8px';
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.borderRadius = '3px';
                button.style.cursor = 'pointer';
                button.style.fontSize = '12px';
                button.style.verticalAlign = 'middle';

                button.addEventListener('click', function() {
                    removeHideEffect();
                    button.innerHTML = '已显示解析';
                    button.style.backgroundColor = '#2196F3';
                    setTimeout(() => {
                        button.innerHTML = '显示AI解析';
                        button.style.backgroundColor = '#4CAF50';
                    }, 2000);
                });

                // 关键修改：将按钮插入到标题后面，但在同一个mb16容器内
                // 找到标题后面的第一个元素，在它之前插入按钮
                const nextElement = title.nextElementSibling;
                if (nextElement) {
                    title.parentNode.insertBefore(button, nextElement);
                } else {
                    // 如果没有下一个元素，直接添加到父容器末尾
                    title.parentNode.appendChild(button);
                }

                console.log('已添加显示AI解析按钮');
            }
        });
    }

    // 延迟添加手动按钮
    setTimeout(addManualButton, 2000);

    // 监听DOM变化，动态添加按钮
    const buttonObserver = new MutationObserver(function(mutations) {
        let shouldAddButton = false;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // 检查新增节点是否包含答案解析区域
                        if (node.querySelector && node.querySelector('.p-tit')) {
                            const titles = node.querySelectorAll('.p-tit');
                            titles.forEach(title => {
                                if (title.textContent.includes('答案解析')) {
                                    shouldAddButton = true;
                                }
                            });
                        }
                        // 或者节点本身就是标题
                        if (node.classList && node.classList.contains('p-tit') && node.textContent.includes('答案解析')) {
                            shouldAddButton = true;
                        }
                    }
                });
            }
        });

        if (shouldAddButton) {
            setTimeout(addManualButton, 100);
        }
    });

    // 开始观察答案解析区域的变化
    buttonObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Alt + A 显示所有AI解析
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            removeHideEffect();
            console.log('快捷键触发：显示所有AI解析');
        }
    });
})();
(function() {
    'use strict';

    setInterval(function() {
        document.querySelectorAll('div.vip-quanyi[style="cursor: pointer;"]').forEach(el => el.remove());
    }, 500);
    // 精确匹配版本
function removeAnswerAnalysisExact() {
    const elements = document.querySelectorAll('p');
    elements.forEach(element => {
        if (element.getAttribute('style') === '' &&
            element.getAttribute('class') === 'answer-analysis') {
            element.remove();
        }
    });
}
})();
(function() {
    'use strict';

    setInterval(function() {
        document.querySelectorAll('div.vip-quanyi[style="cursor: pointer;"]').forEach(el => el.remove());
    }, 500);
    // 精确匹配版本
function removeAnswerAnalysisExact() {
    const elements = document.querySelectorAll('p');
    elements.forEach(element => {
        if (element.getAttribute('style') === '' &&
            element.getAttribute('class') === 'answer-analysis') {
            element.remove();
        }
    });
}
})();
(function() {
    'use strict';

    // 删除指定元素的函数
    function removeElements() {
        // 删除第一个元素：查看全部按钮
        const viewAllButton = document.querySelector('button.el-button--warning.el-button--mini span');
        if (viewAllButton && viewAllButton.textContent === '查看全部') {
            const button = viewAllButton.closest('button');
            if (button) {
                button.remove();
                console.log('已删除"查看全部"按钮');
            }
        }

        // 删除第二个元素：DeepSeek解析提示
        const deepseekRows = document.querySelectorAll('.deepseek-row');
        deepseekRows.forEach(row => {
            const content = row.querySelector('.content');
            if (content && content.textContent.includes('本解析由AI生成')) {
                row.remove();
                console.log('已删除DeepSeek解析提示');
            }
        });
    }

    // 初始删除
    removeElements();

    // 使用MutationObserver监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        let shouldRemove = false;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // 检查是否添加了目标元素
                        if (node.querySelector && (
                            node.querySelector('button.el-button--warning.el-button--mini span') ||
                            node.querySelector('.deepseek-row')
                        )) {
                            shouldRemove = true;
                        }
                        // 如果节点本身就是目标元素
                        if (node.classList && (
                            node.classList.contains('deepseek-row') ||
                            (node.classList.contains('el-button') && node.classList.contains('el-button--warning'))
                        )) {
                            shouldRemove = true;
                        }
                    }
                });
            }
        });

        if (shouldRemove) {
            setTimeout(removeElements, 100);
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后再次检查
    window.addEventListener('load', function() {
        setTimeout(removeElements, 500);
    });

    console.log('考试宝元素清理脚本已加载');
})();

//答题音效
(function() {
    'use strict';

    // 创建音频元素
    const correctAudio = new Audio('https://img.tukuppt.com/newpreview_music/01/66/41/63c0e76601774734.mp3');
    const wrongAudio = new Audio('https://img.tukuppt.com/newpreview_music/09/00/60/5c89396f017e881994.mp3');

    // 预加载音频
    correctAudio.preload = 'auto';
    wrongAudio.preload = 'auto';

    // 创建手动检查按钮
    function createCheckButton() {
        const checkButton = document.createElement('button');
        checkButton.innerHTML = '🔊 检查答案';
        checkButton.style.cssText = `
            position: fixed;
            top: 200px;
            left: 0px;
            z-index: 9999;
            padding: 8px 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        checkButton.addEventListener('click', function() {
            checkAnswerAndPlaySound();
            // 添加点击反馈
            checkButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                checkButton.style.transform = 'scale(1)';
            }, 150);
        });

        // 添加鼠标悬停效果
        checkButton.addEventListener('mouseenter', function() {
            checkButton.style.background = '#45a049';
        });

        checkButton.addEventListener('mouseleave', function() {
            checkButton.style.background = '#4CAF50';
        });

        document.body.appendChild(checkButton);

        return checkButton;
    }

    // 监听选项点击和提交答案按钮点击
    function addClickListeners() {
        // 监听选项点击
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            if (!option.hasAttribute('data-audio-added')) {
                option.setAttribute('data-audio-added', 'true');
                option.addEventListener('click', function() {
                    // 延迟检查答案结果
                    setTimeout(() => {
                        checkAnswerAndPlaySound();
                    }, 50);
                });
            }
        });

        // 监听提交答案按钮点击
        const submitButtons = document.querySelectorAll('button');
        submitButtons.forEach(button => {
            if (button.textContent.includes('提交答案') && !button.hasAttribute('data-audio-added')) {
                button.setAttribute('data-audio-added', 'true');
                button.addEventListener('click', function() {
                    // 延迟检查答案结果
                    setTimeout(() => {
                        checkAnswerAndPlaySound();
                    }, 50);
                });
            }
        });
    }

    // 检查答案并播放对应音效
    function checkAnswerAndPlaySound() {
        // 查找错误图标
        const wrongIcon = document.querySelector('img[src="https://up.zaixiankaoshi.com/FkA2c88PrD8eR23UlL1ejyer5axl"]');
        // 查找正确图标
        const correctIcon = document.querySelector('img[src="https://up.zaixiankaoshi.com/FjteOgY4lCD4RSWPILZpiI0tHLIt"]');

        let result = '';

        if (correctIcon && correctIcon.offsetParent !== null) {
            // 播放正确音效
            result = '正确';
            correctAudio.currentTime = 0;
            correctAudio.play().catch(e => {
                console.log('正确音效播放失败:', e);
            });
        } else if (wrongIcon && wrongIcon.offsetParent !== null) {
            // 播放错误音效
            result = '错误';
            wrongAudio.currentTime = 0;
            wrongAudio.play().catch(e => {
                console.log('错误音效播放失败:', e);
            });
        } else {
            result = '未检测到答案结果';
            console.log('未找到答案图标或图标不可见');
        }

        // 显示检查结果提示
        showCheckResult(result);

        return result;
    }

    // 显示检查结果提示
    function showCheckResult(result) {
        // 移除可能存在的旧提示
        const oldTip = document.getElementById('answer-check-tip');
        if (oldTip) {
            oldTip.remove();
        }

        const tip = document.createElement('div');
        tip.id = 'answer-check-tip';
        tip.textContent = `检查结果: ${result}`;
        tip.style.cssText = `
            position: fixed;
            top: 240px;
            left: 0px;
            z-index: 9999;
            padding: 6px 10px;
            background: ${result === '正确' ? '#4CAF50' : result === '错误' ? '#f44336' : '#ff9800'};
            color: white;
            border-radius: 4px;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: opacity 0.3s;
        `;

        document.body.appendChild(tip);

        // 3秒后自动消失
        setTimeout(() => {
            tip.style.opacity = '0';
            setTimeout(() => {
                if (tip.parentNode) {
                    tip.remove();
                }
            }, 300);
        }, 3000);
    }

    // 初始化
    function init() {
        // 创建手动检查按钮
        createCheckButton();

        // 添加选项点击监听
        addClickListeners();

        console.log('答题音效脚本已加载，包含手动检查功能');
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听DOM变化（动态内容）
    const observer = new MutationObserver(function(mutations) {
        let shouldAddListeners = false;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // 检查是否有选项被添加
                        if (node.querySelectorAll && node.querySelectorAll('.option').length > 0) {
                            shouldAddListeners = true;
                        }
                        // 如果节点本身就是选项
                        if (node.classList && node.classList.contains('option')) {
                            shouldAddListeners = true;
                        }
                        // 检查是否有提交答案按钮被添加
                        if (node.querySelectorAll && node.querySelectorAll('button').length > 0) {
                            const buttons = node.querySelectorAll('button');
                            buttons.forEach(button => {
                                if (button.textContent.includes('提交答案')) {
                                    shouldAddListeners = true;
                                }
                            });
                        }
                        // 如果节点本身就是提交答案按钮
                        if (node.tagName && node.tagName.toLowerCase() === 'button' &&
                            node.textContent.includes('提交答案')) {
                            shouldAddListeners = true;
                        }
                    }
                });
            }
        });

        if (shouldAddListeners) {
            addClickListeners();
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

   //以下为精简模式
(function() {
    'use strict';

    let currentMode = 'full'; // 默认完整模式
    let removedElements = [];

    // 创建控制按钮
    function createControlButton() {
        const button = document.createElement('button');
        button.innerHTML = '📱 精简模式';
        button.id = 'mode-toggle-button';
        button.style.cssText = `
            position: fixed;
            top: 150px;
            left: 0px;
            z-index: 10000;
            padding: 10px 15px;
            background: #67c23a;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 更新按钮状态
        function updateButton() {
            if (currentMode === 'minimal') {
                button.innerHTML = '🌐 完整模式';
                button.style.background = '#f56c6c';
            } else {
                button.innerHTML = '📱 精简模式';
                button.style.background = '#67c23a';
            }
        }

        button.addEventListener('click', function() {
            if (currentMode === 'full') {
                switchToMinimalMode();
            } else {
                switchToFullMode();
            }
            updateButton();
        });

        // 添加鼠标悬停效果
        button.addEventListener('mouseenter', function() {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', function() {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        });

        // 初始状态
        updateButton();

        // 添加拖拽功能
        makeDraggable(button);

        document.body.appendChild(button);
        return button;
    }

    // 使按钮可拖拽
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 切换到精简模式
    function switchToMinimalMode() {
        console.log('切换到精简模式...');

        // 保存要删除的元素
        removedElements = [];

        // 删除header元素
        const header = document.querySelector('header.header');
        if (header) {
            console.log('找到header元素，准备删除');
            removedElements.push({
                element: header,
                parent: header.parentNode,
                nextSibling: header.nextSibling
            });
            header.remove();
        } else {
            console.log('未找到header元素');
        }

        // 删除所有breadcrumb元素
        const breadcrumbs = document.querySelectorAll('.breadcrumb');
        if (breadcrumbs.length > 0) {
            console.log(`找到 ${breadcrumbs.length} 个breadcrumb元素`);
            breadcrumbs.forEach(breadcrumb => {
                removedElements.push({
                    element: breadcrumb,
                    parent: breadcrumb.parentNode,
                    nextSibling: breadcrumb.nextSibling
                });
                breadcrumb.remove();
            });
        }

        // 释放占用的空间 - 强制设置样式
        const middleContainer = document.querySelector('.middle-container');
        if (middleContainer) {
            middleContainer.style.marginTop = '0';
            middleContainer.style.paddingTop = '0';
            console.log('已设置middle-container样式');
        }

        const appMain = document.querySelector('.app-main');
        if (appMain) {
            appMain.style.marginTop = '0';
            appMain.style.paddingTop = '0';
            console.log('已设置app-main样式');
        }

        // 强制设置body样式
        document.body.style.marginTop = '0';
        document.body.style.paddingTop = '0';

        // 添加CSS样式确保空间释放
        addMinimalModeStyles();

        currentMode = 'minimal';
        console.log('已切换到精简模式，删除了', removedElements.length, '个元素');
    }

    // 切换到完整模式
    function switchToFullMode() {
        console.log('切换到完整模式...');

        // 恢复所有删除的元素
        removedElements.forEach(item => {
            if (item.parent && item.element) {
                if (item.nextSibling) {
                    item.parent.insertBefore(item.element, item.nextSibling);
                } else {
                    item.parent.appendChild(item.element);
                }
            }
        });

        // 恢复样式
        const middleContainer = document.querySelector('.middle-container');
        if (middleContainer) {
            middleContainer.style.marginTop = '';
            middleContainer.style.paddingTop = '';
        }

        const appMain = document.querySelector('.app-main');
        if (appMain) {
            appMain.style.marginTop = '';
            appMain.style.paddingTop = '';
        }

        document.body.style.marginTop = '';
        document.body.style.paddingTop = '';

        // 移除精简模式样式
        removeMinimalModeStyles();

        removedElements = [];
        currentMode = 'full';
        console.log('已切换到完整模式');
    }

    // 添加精简模式CSS样式
    function addMinimalModeStyles() {
        const styleId = 'minimal-mode-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            header.header {
                display: none !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                visibility: hidden !important;
            }
            .breadcrumb {
                display: none !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                visibility: hidden !important;
            }
            .app-main {
                margin-top: 0 !important;
                padding-top: 0 !important;
            }
            .middle-container {
                margin-top: 0 !important;
                padding-top: 0 !important;
            }
            body {
                margin-top: 0 !important;
                padding-top: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 移除精简模式CSS样式
    function removeMinimalModeStyles() {
        const style = document.getElementById('minimal-mode-styles');
        if (style) {
            style.remove();
        }
    }

    // 初始化
    function init() {
        console.log('初始化考试宝页面模式切换脚本...');

        // 创建控制按钮
        createControlButton();

        console.log('脚本初始化完成 - 默认完整模式');
    }

    // 等待页面完全加载
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        // 如果页面已经加载，等待一小段时间确保元素存在
        setTimeout(init, 1000);
    }

    // 监听页面变化，确保按钮始终存在
    const observer = new MutationObserver(function(mutations) {
        // 检查按钮是否还在
        const button = document.getElementById('mode-toggle-button');
        if (!button) {
            console.log('按钮丢失，重新创建');
            createControlButton();
        }
    });

    // 开始观察
    setTimeout(() => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 2000);

})();
//以下为键盘翻题
(function() {
    'use strict';

    // 在多个层级添加键盘监听
    window.addEventListener('keydown', handleKeyPress, true);
    document.addEventListener('keydown', handleKeyPress, true);
    document.body.addEventListener('keydown', handleKeyPress, true);

    function handleKeyPress(event) {
        // 检查是否按下了方向键
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            showKeyPress('←');
            setTimeout(() => clickButton('上一题'), 50);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            showKeyPress('→');
            setTimeout(() => clickButton('下一题'), 50);
        }
    }

    // 显示按键提示
    function showKeyPress(text) {
        removeExistingIndicator();

        const indicator = document.createElement('div');
        indicator.id = 'key-press-indicator';
        indicator.textContent = text;
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 80px;
            font-weight: bold;
            color: rgba(64, 158, 255, 0.9);
            z-index: 10001;
            pointer-events: none;
            text-shadow: 0 0 20px rgba(64, 158, 255, 0.6);
            opacity: 0;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(indicator);

        // 显示动画
        requestAnimationFrame(() => {
            indicator.style.opacity = '1';
            indicator.style.transform = 'translate(-50%, -50%) scale(1.3)';
        });

        // 自动隐藏
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translate(-50%, -50%) scale(0.7)';
            setTimeout(removeExistingIndicator, 300);
        }, 400);
    }

    function removeExistingIndicator() {
        const existing = document.getElementById('key-press-indicator');
        if (existing) existing.remove();
    }

    // 点击按钮 - 多重查找策略
    function clickButton(buttonText) {
        // 策略1: 通过文本内容查找
        let button = findButtonByText(buttonText);

        // 策略2: 通过导航区域查找
        if (!button) {
            button = findButtonInNavArea(buttonText);
        }

        // 策略3: 通过按钮索引查找
        if (!button) {
            button = findButtonByIndex(buttonText);
        }

        if (button && !button.disabled) {
            // 多重点击方式
            button.click();
            setTimeout(() => {
                // 模拟真实点击事件
                const rect = button.getBoundingClientRect();
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                });
                button.dispatchEvent(clickEvent);
            }, 10);
        }
    }

    function findButtonByText(text) {
        const buttons = document.querySelectorAll('button');
        for (let button of buttons) {
            if (button.textContent && button.textContent.includes(text)) {
                return button;
            }
        }
        return null;
    }

    function findButtonInNavArea(text) {
        const navArea = document.querySelector('.next-preve');
        if (!navArea) return null;

        const buttons = navArea.querySelectorAll('button');
        if (buttons.length === 0) return null;

        if (text === '上一题') {
            return buttons[0];
        } else if (text === '下一题') {
            return buttons[1] || buttons[buttons.length - 1];
        }
        return null;
    }

    function findButtonByIndex(text) {
        const allButtons = document.querySelectorAll('button');
        if (text === '上一题') {
            // 假设上一题是页面中第一个相关按钮
            for (let button of allButtons) {
                if (!button.disabled && button.offsetParent !== null) {
                    return button;
                }
            }
        } else if (text === '下一题') {
            // 假设下一题是页面中最后一个相关按钮
            for (let i = allButtons.length - 1; i >= 0; i--) {
                if (!allButtons[i].disabled && allButtons[i].offsetParent !== null) {
                    return allButtons[i];
                }
            }
        }
        return null;
    }

    // 添加永久提示
    const hint = document.createElement('div');
    hint.innerHTML = '💡 使用 <kbd>←</kbd> 上一题 <kbd>→</kbd> 下一题';
    hint.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #409EFF;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold;
        cursor: move;
    `;

    // 添加键盘样式
    const style = document.createElement('style');
    style.textContent = `
        kbd {
            background: #f4f4f4;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 3px 8px;
            font-size: 12px;
            color: #333;
            box-shadow: 0 2px 0 rgba(0,0,0,0.2);
            margin: 0 5px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(hint);

    // 让提示可拖拽
    makeDraggable(hint);

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

})();