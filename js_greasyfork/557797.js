// ==UserScript==
// @name         GitCode 页面优化
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  优化GitCode页面显示，删除广告，修改git命令，添加暗黑模式和返回顶部
// @author 小明
// @license MIT
// @icon         chrome://favicon/https://www.gitcode.com/
// @match        https://gitcode.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557797/GitCode%20%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/557797/GitCode%20%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储暗黑模式状态
    let darkModeEnabled = false;

    // 在DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initScript, 4000); // DOM加载完成后4秒执行
        });
    } else {
        setTimeout(initScript, 4000); // 页面已加载，直接延迟4秒执行
    }

    function initScript() {
        console.log('GitCode优化脚本开始执行');

        // 添加控制按钮
        addControlButtons();

        // 第一：删除广告元素（如果没有找到也不报错）
        removeAds();

        // 判断页面类型并执行相应操作
        if (isRepoPage1()) {
            console.log('检测到仓库页面1');
            handleRepoPage1();
        } else if (isRepoPage2()) {
            console.log('检测到仓库页面2');
            handleRepoPage2();
        } else {
            console.log('未检测到特定仓库页面');
        }

        // 通用处理：在整个页面中查找并替换global和main
        replaceGlobalAndMainInPage();
    }

    // 添加控制按钮（返回顶部和暗黑模式）
    function addControlButtons() {
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'gitcode-controls';
        buttonContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // 创建暗黑模式按钮
        const darkModeButton = document.createElement('button');
        darkModeButton.id = 'gitcode-dark-mode-btn';
        darkModeButton.textContent = '🌙 暗黑模式';
        darkModeButton.style.cssText = `
            padding: 10px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
        `;

        // 添加悬停效果
        darkModeButton.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        };
        darkModeButton.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        };

        // 暗黑模式切换功能
        darkModeButton.onclick = function() {
            darkModeEnabled = !darkModeEnabled;
            toggleDarkMode(darkModeEnabled);

            // 更新按钮文本
            this.textContent = darkModeEnabled ? '☀️ 明亮模式' : '🌙 暗黑模式';

            // 保存状态到localStorage
            localStorage.setItem('gitcode_dark_mode', darkModeEnabled ? 'enabled' : 'disabled');
        };

        // 创建返回顶部按钮
        const backToTopButton = document.createElement('button');
        backToTopButton.id = 'gitcode-back-to-top';
        backToTopButton.textContent = '⬆️ 返回顶部';
        backToTopButton.style.cssText = `
            padding: 10px 16px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            opacity: 0;
            transform: translateY(20px);
        `;

        // 添加悬停效果
        backToTopButton.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        };
        backToTopButton.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        };

        // 返回顶部功能
        backToTopButton.onclick = function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // 添加按钮到容器
        buttonContainer.appendChild(darkModeButton);
        buttonContainer.appendChild(backToTopButton);
        document.body.appendChild(buttonContainer);

        // 检查并恢复暗黑模式状态
        const savedDarkMode = localStorage.getItem('gitcode_dark_mode');
        if (savedDarkMode === 'enabled') {
            darkModeEnabled = true;
            toggleDarkMode(true);
            darkModeButton.textContent = '☀️ 明亮模式';
        }

        // 监听滚动事件，显示/隐藏返回顶部按钮
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.style.opacity = '1';
                backToTopButton.style.transform = 'translateY(0)';
            } else {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.transform = 'translateY(20px)';
            }
        });

        // 添加暗黑模式样式
        addDarkModeStyles();
    }

    // 切换暗黑模式
    function toggleDarkMode(enabled) {
        const appElement = document.getElementById('app');
        if (!appElement) return;

        if (enabled) {
            appElement.classList.add('gitcode-dark-mode');
            document.body.classList.add('gitcode-dark-mode-body');
        } else {
            appElement.classList.remove('gitcode-dark-mode');
            document.body.classList.remove('gitcode-dark-mode-body');
        }
    }

    // 添加暗黑模式样式
    function addDarkModeStyles() {
        const style = document.createElement('style');
        style.id = 'gitcode-dark-mode-styles';
        style.textContent = `
            /* 暗黑模式样式 */
            #app.gitcode-dark-mode {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
                filter: brightness(0.9) contrast(1.1);
            }

            .gitcode-dark-mode-body {
                background-color: #121212 !important;
            }

            #app.gitcode-dark-mode * {
                background-color: inherit !important;
                color: inherit !important;
                border-color: #444 !important;
            }

            #app.gitcode-dark-mode a {
                color: #4dabf7 !important;
            }

            #app.gitcode-dark-mode code,
            #app.gitcode-dark-mode pre {
                background-color: #2d2d2d !important;
                border-color: #444 !important;
            }

            #app.gitcode-dark-mode .devui-modal,
            #app.gitcode-dark-mode .devui-modal__body {
                background-color: #2d2d2d !important;
                border-color: #444 !important;
            }

            #app.gitcode-dark-mode input,
            #app.gitcode-dark-mode textarea,
            #app.gitcode-dark-mode select {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
                border-color: #555 !important;
            }

            #app.gitcode-dark-mode button {
                background-color: #333 !important;
                color: #e0e0e0 !important;
                border-color: #555 !important;
            }

            #app.gitcode-dark-mode .gitcode-dark-mode-btn {
                background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%) !important;
                color: #333 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 删除广告元素的函数
    function removeAds() {
        const selectors = [
            '#app > div > div.home-nav-right',
            '.announce-wrapper',
            '.devui-badge--count',
            '.g-header-search-recommend-placeholder'
        ];

        selectors.forEach(selector => {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    element.remove();
                    console.log(`已删除: ${selector}`);
                }
            } catch (error) {
                // 静默失败，不报错
            }
        });
    }

    // 判断是否为仓库页面1
    function isRepoPage1() {
        return document.getElementById('readme') !== null;
    }

    // 判断是否为仓库页面2
    function isRepoPage2() {
        const hasCreateRepoWrapper = document.querySelector('.create-repo-wrapper') !== null;
        const hasEmptyRepoText = document.body.innerText.includes('当前项目代码仓是空仓库');
        return hasCreateRepoWrapper || hasEmptyRepoText;
    }

    // 处理仓库页面1
    function handleRepoPage1() {
        // 监听Clone按钮点击
        const cloneButton = document.querySelector('.cus-button-clone');
        if (cloneButton) {
            cloneButton.addEventListener('click', function() {
                // 等待弹窗出现
                setTimeout(() => {
                    handleCloneModal();
                }, 500);
            });
        }

        // 初始检查（如果弹窗已经存在）
        if (document.querySelector('.devui-modal__body')) {
            handleCloneModal();
        }
    }

    // 处理Clone弹窗
    function handleCloneModal() {
        const modalBody = document.querySelector('.devui-modal__body');
        if (!modalBody) return;

        // 1. 删除global
        replaceGlobalInElement(modalBody);

        // 2. 自动切换SSH
        autoSwitchToSSH();

        // 3. 修改复制按钮行为
        modifyCopyButtons(modalBody);
    }

    // 自动切换SSH
    function autoSwitchToSSH() {
        // 页面1的SSH切换
        const sshTabs = document.querySelectorAll('.repo-clone-tab-item');
        if (sshTabs.length >= 2) {
            // 点击第二个tab（SSH）
            sshTabs[1].click();
            console.log('已切换到SSH');
        }

        // 页面2的SSH切换
        const sshRadio = document.querySelector('input[value="SSH"]');
        if (sshRadio) {
            sshRadio.click();
            console.log('已切换到SSH（页面2）');
        }
    }

    // 修改复制按钮行为
    function modifyCopyButtons(container) {
        const copyButtons = container.querySelectorAll('.custom-icon-container, [xlink\\:href="#gt-line-copy"]');

        copyButtons.forEach(button => {
            // 移除旧的事件监听器
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // 添加新的事件监听器
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // 找到要复制的文本
                const textContainer = this.closest('.devui-row')?.querySelector('.whitespace-pre-wrap');
                if (textContainer) {
                    let text = textContainer.textContent;

                    // 删除global
                    text = text.replace(/--global /g, '');

                    // 复制到剪贴板
                    navigator.clipboard.writeText(text).then(() => {
                        console.log('已复制修改后的命令:', text);

                        // 显示复制成功的提示
                        showToast('命令已复制（已移除global）');
                    }).catch(err => {
                        console.error('复制失败:', err);
                    });
                }
            });
        });
    }

    // 处理仓库页面2
    function handleRepoPage2() {
        // 1. 自动切换SSH
        autoSwitchToSSH();

        // 2. 删除global
        replaceGlobalInElement(document.body);

        // 3. 把main改为master
        replaceMainToMasterInElement(document.body);
    }

    // 在整个页面中替换global和main
    function replaceGlobalAndMainInPage() {
        replaceGlobalInElement(document.body);
        replaceMainToMasterInElement(document.body);
    }

    // 在指定元素中删除global
    function replaceGlobalInElement(element) {
        const textNodes = getTextNodes(element);

        textNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('--global')) {
                const newText = node.textContent.replace(/--global /g, '');
                if (newText !== node.textContent) {
                    node.textContent = newText;
                    console.log('已删除global:', newText);
                }
            }
        });
    }

    // 在指定元素中将main替换为master
    function replaceMainToMasterInElement(element) {
        const textNodes = getTextNodes(element);

        textNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                let newText = node.textContent;

                // 替换 git branch -m main 为 git branch -m master
                newText = newText.replace(/git branch -m main/g, 'git branch -m master');

                // 替换 git push -u origin main 为 git push -u origin master
                newText = newText.replace(/git push -u origin main/g, 'git push -u origin master');

                // 替换其他可能的main引用（但确保是git命令中的）
                newText = newText.replace(/origin main(\s|$)/g, 'origin master$1');

                if (newText !== node.textContent) {
                    node.textContent = newText;
                    console.log('已将main替换为master');
                }
            }
        });
    }

    // 获取元素中的所有文本节点
    function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        return textNodes;
    }

    // 显示提示消息
    function showToast(message) {
        // 移除现有的提示
        const existingToast = document.querySelector('.gitcode-optimizer-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的提示
        const toast = document.createElement('div');
        toast.className = 'gitcode-optimizer-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${darkModeEnabled ? '#333' : '#4CAF50'};
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: fadeInOut 3s ease-in-out;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);

        toast.textContent = message;
        document.body.appendChild(toast);

        // 3秒后自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // 检查新添加的节点中是否有弹窗
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('devui-modal__body')) {
                            setTimeout(() => {
                                handleCloneModal();
                            }, 100);
                        }

                        // 检查是否包含需要处理的元素
                        if (node.querySelector && (
                            node.querySelector('.devui-modal__body') ||
                            node.querySelector('.create-repo-wrapper') ||
                            node.querySelector('.repo-clone-tab')
                        )) {
                            replaceGlobalInElement(node);
                            replaceMainToMasterInElement(node);
                        }
                    }
                });
            }
        });
    });

    // 开始观察DOM变化（在脚本初始化后开始观察）
    setTimeout(() => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('开始监听DOM变化');
    }, 5000); // 延迟一点开始观察，确保脚本主体已执行

    console.log('GitCode优化脚本已加载，将在页面加载完成后4秒执行');
})();