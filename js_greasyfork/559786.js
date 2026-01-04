// ==UserScript==
// @name         VS Code Marketplace Download Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 VS Code Marketplace 扩展页面的 Install 按钮旁添加 Download 按钮
// @author       inori
// @match        https://marketplace.visualstudio.com/items*
// @icon         https://code.visualstudio.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559786/VS%20Code%20Marketplace%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/559786/VS%20Code%20Marketplace%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('VS Code Marketplace Download Button 脚本已加载');

    function addDownloadButton() {
        // 防止重复添加
        if (document.querySelector('.custom-download-button')) {
            console.log('Download 按钮已存在');
            return;
        }

        // 从 URL 或隐藏的 input 获取扩展信息
        let itemName = new URLSearchParams(window.location.search).get('itemName');

        if (!itemName) {
            const fqnInput = document.querySelector('#FQN');
            if (fqnInput) {
                itemName = fqnInput.value;
            }
        }

        if (!itemName) {
            console.log('未找到扩展名称');
            return;
        }

        console.log('扩展名称:', itemName);
        const [publisher, extensionName] = itemName.split('.');

        // 查找 Install 按钮
        const installButton = document.querySelector('.ux-oneclick-install-button-container a, .ux-oneclick-install-button-container button');

        if (!installButton) {
            console.log('未找到 Install 按钮');
            return;
        }

        console.log('找到 Install 按钮');

        // 创建 Download 按钮容器
        const downloadSpan = document.createElement('span');
        downloadSpan.className = 'custom-download-button ux-oneclick-install-button-container';
        downloadSpan.style.cssText = 'margin-left: 10px; display: inline-block; vertical-align: top;';

        // 创建 Download 按钮（完全复制 Install 按钮的结构和类）
        const downloadButton = document.createElement('a');

        // 复制所有类名，但排除特定的状态类
        const classList = Array.from(installButton.classList).filter(cls =>
            cls !== 'install' && !cls.startsWith('is-')
        );
        downloadButton.className = classList.join(' ');

        // 复制所有属性（除了 href）
        Array.from(installButton.attributes).forEach(attr => {
            if (attr.name !== 'href' && attr.name !== 'class') {
                downloadButton.setAttribute(attr.name, attr.value);
            }
        });

        // 设置下载链接
        const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/latest/vspackage`;
        downloadButton.href = downloadUrl;
        downloadButton.download = `${itemName}.vsix`;

        // 复制按钮内部 HTML 结构
        downloadButton.innerHTML = installButton.innerHTML;

        // 修改文本内容
        const labelElement = downloadButton.querySelector('.ms-Button-label');
        if (labelElement) {
            labelElement.textContent = 'Download VSIX';
        }

        // 设置蓝色样式
        downloadButton.style.cssText = `
            background-color: #0078d4 !important;
            border: 1px solid #0078d4 !important;
            color: white !important;
        `;

        // 添加悬停效果
        downloadButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#005a9e';
            this.style.borderColor = '#005a9e';
        });

        downloadButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#0078d4';
            this.style.borderColor = '#0078d4';
        });

        // 添加按钮到容器
        downloadSpan.appendChild(downloadButton);

        // 插入到 Install 按钮的父容器后面
        const installContainer = installButton.closest('.ux-oneclick-install-button-container');
        if (installContainer && installContainer.parentNode) {
            installContainer.parentNode.insertBefore(downloadSpan, installContainer.nextSibling);
            console.log('✅ Download 按钮添加成功！');
        } else {
            console.log('❌ 无法找到合适的插入位置');
        }
    }

    // 使用 MutationObserver 监听 DOM 变化
    function observeAndAddButton() {
        let attempts = 0;
        const maxAttempts = 30;

        const intervalId = setInterval(function() {
            attempts++;
            console.log(`尝试添加按钮 (${attempts}/${maxAttempts})`);

            const installButton = document.querySelector('.ux-oneclick-install-button-container a, .ux-oneclick-install-button-container button');
            if (installButton) {
                addDownloadButton();
                clearInterval(intervalId);
                startObserver();
            } else if (attempts >= maxAttempts) {
                console.log('❌ 达到最大尝试次数');
                clearInterval(intervalId);
            }
        }, 300);
    }

    // 监听按钮容器的父元素，如果按钮被移除则重新添加
    function startObserver() {
        const targetNode = document.querySelector('.installButtonContainer, .ms-Fabric');

        if (!targetNode) {
            console.log('无法启动观察器');
            return;
        }

        const observer = new MutationObserver(function(mutations) {
            // 检查我们的按钮是否还在
            const hasButton = document.querySelector('.custom-download-button');
            const hasInstall = document.querySelector('.ux-oneclick-install-button-container');

            if (!hasButton && hasInstall) {
                console.log('检测到按钮被移除，重新添加...');
                setTimeout(addDownloadButton, 100);
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        console.log('✅ DOM 监听器已启动');
    }

    // 页面可见性变化时重新检查
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            setTimeout(function() {
                if (!document.querySelector('.custom-download-button')) {
                    console.log('页面重新可见，重新添加按钮');
                    addDownloadButton();
                }
            }, 500);
        }
    });

    observeAndAddButton();
})();