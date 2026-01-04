// ==UserScript==
// @name         FitGirl一键复制制作说明
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在FitGirl页面顶部的固定导航栏添加一键复制按钮
// @author       WhiteLycoris and DeepSeek
// @match        https://fitgirl-repacks.site/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557275/FitGirl%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%88%B6%E4%BD%9C%E8%AF%B4%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/557275/FitGirl%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%88%B6%E4%BD%9C%E8%AF%B4%E6%98%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 尝试添加按钮到标题旁边
        if (!addCopyButtonToTitle()) {
            // 如果失败，尝试添加到导航栏
            setTimeout(addCopyButtonToNavbar, 500);
        }
    }

    // 创建复制按钮的共用函数
    function createCopyButton() {
        const copyButton = document.createElement('button');
        copyButton.className = 'fg-copy-button';
        copyButton.textContent = '复制制作说明';
        copyButton.style.marginLeft = '15px';
        copyButton.style.padding = '6px 12px';
        copyButton.style.backgroundColor = '#4CAF50';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '3px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '12px';
        copyButton.style.fontWeight = 'bold';

        copyButton.addEventListener('click', copyContentToClipboard);
        return copyButton;
    }

    // 方式1：添加到标题旁边
    function addCopyButtonToTitle() {
        const siteTitle = document.querySelector('.site-title');
        if (!siteTitle) return false;

        // 检查是否已经添加了按钮
        if (document.querySelector('.fg-copy-button')) return true;

        const copyButton = createCopyButton();
        copyButton.style.verticalAlign = 'middle';

        // 插入到标题后面
        siteTitle.parentNode.insertBefore(copyButton, siteTitle.nextSibling);
        return true;
    }

    // 方式2：添加到导航栏
    function addCopyButtonToNavbar() {
        const primaryNav = document.querySelector('#primary-navigation');
        if (!primaryNav) return false;

        // 检查是否已经添加了按钮
        if (document.querySelector('.fg-copy-button')) return true;

        const copyButton = createCopyButton();

        // 插入到导航栏内的第一个位置
        primaryNav.insertBefore(copyButton, primaryNav.firstChild);
        return true;
    }

    // 复制内容到剪贴板
    function copyContentToClipboard() {
        try {
            const content = extractContent();
            if (content) {
                navigator.clipboard.writeText(content).then(function() {
                    showNotification('内容已复制到剪贴板！');
                }).catch(function(err) {
                    console.error('复制失败: ', err);
                    fallbackCopyTextToClipboard(content);
                });
            } else {
                showNotification('未找到需要复制的内容');
            }
        } catch (error) {
            console.error('复制过程中出错: ', error);
            showNotification('复制过程中出错');
        }
    }

    // 提取内容
    function extractContent() {
        // 检查必要的页面元素是否存在
        if (!document.querySelector('.entry-content')) {
            console.warn('无法找到页面主要内容区域');
            return null;
        }

        let content = '';

        // 第一部分：从#数字开始的标题内容
        const titleH3 = document.querySelector('.entry-content h3');
        if (titleH3) {
            const titleText = titleH3.textContent.trim();
            if (titleText.includes('#')) {
                content += '[b]' + titleText + '[/b]\n\n';
            }
        } else {
            console.warn('无法找到游戏标题');
        }

        // 添加游戏基本信息（Genres/Tags到Repack Size）
        const gameInfoP = document.querySelector('.entry-content p[style*="height: 200px"]');
        if (gameInfoP) {
            const gameInfoText = gameInfoP.textContent.trim();
            const cleanText = gameInfoText.replace(/\n\s*\n/g, '\n');
            content += cleanText + '\n';
        } else {
            console.warn('无法找到游戏基本信息');
        }

        // 添加一个换行
        content += '\n';

        // 第二部分：当前页面URL
        content += window.location.href + '\n\n[b]Repack Features[/b]\n';

        // 第三部分：Repack Features内容
        const repackFeaturesH3 = findElementByText('h3', 'Repack Features');
        if (repackFeaturesH3) {
            let nextElement = repackFeaturesH3.nextElementSibling;
            while (nextElement) {
                if (nextElement.tagName === 'UL') {
                    const listItems = nextElement.querySelectorAll('li');
                    if (listItems.length > 0) {
                        listItems.forEach(li => {
                            content += '• ' + li.textContent.trim() + '\n';
                        });
                    } else {
                        console.warn('Repack Features列表为空');
                    }
                    break;
                }
                nextElement = nextElement.nextElementSibling;
            }
        } else {
            console.warn('无法找到Repack Features部分');
        }

        content += '\n[color=#ff0000]↑ FitGirl会在倒数几行的地方说明修改游戏语言的方法或者路径：“Language can be changed in / by ...”[/color]';

        // 检查内容是否为空
        if (content.trim() === '[color=#ff0000]↑ FitGirl会在倒数几行的地方说明修改游戏语言的方法或者路径：“Language can be changed in / by ...”[/color]') {
            console.error('提取的内容为空');
            return null;
        }

        return content.trim();
    }

    // 辅助函数：通过文本内容查找元素
    function findElementByText(tagName, text) {
        const elements = document.querySelectorAll(tagName);
        for (let element of elements) {
            if (element.textContent.includes(text)) {
                return element;
            }
        }
        return null;
    }

    // 备用复制方法
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('内容已复制到剪贴板！');
            } else {
                showNotification('复制失败，请手动复制');
            }
        } catch (err) {
            console.error('备用复制方法失败: ', err);
            showNotification('复制失败，请手动复制');
        }
        document.body.removeChild(textArea);
    }

    // 显示通知
    function showNotification(message) {
        const existingNotification = document.querySelector('.fitgirl-copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'fitgirl-copy-notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.style.fontSize = '14px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        document.body.appendChild(notification);

        setTimeout(function() {
            notification.remove();
        }, 3000);
    }

    // 如果页面是动态加载的，使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        if (!document.querySelector('.fg-copy-button')) {
            init();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();