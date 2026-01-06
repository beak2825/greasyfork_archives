// ==UserScript==
// @name         Gemini Activity Details Saver
// @namespace    https://github.com/lixiaolin94
// @version      1.0.0
// @description  Save Gemini activity details to local text file
// @author       lixiaolin94
// @license      CC BY-NC-ND 4.0
// @match        https://myactivity.google.com/product/gemini*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561590/Gemini%20Activity%20Details%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/561590/Gemini%20Activity%20Details%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const SELECTORS = {
        CONTAINER: '.T64ol', // 顶部按钮栏容器
        CONTENT: '.pFTsBb.KTW5Zd', // 详情内容区域
        TITLE_EL: '.QTGV3c', // 标题所在的元素
        FOOTER_KEYWORD: '为何收集此活动？', // 裁剪内容的关键词
        BUTTON_CLASS: 'VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ mN1ivc', 
        ICON_CLASS: 'google-material-icons notranslate' 
    };

    // 下载文件工具
    function downloadTextFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 文件名处理逻辑
    function getCleanFilename() {
        let title = "未命名项目";
        const titleEl = document.querySelector(SELECTORS.TITLE_EL);
        if (titleEl) {
            let rawText = titleEl.innerText || "";
            // 去除 "提示 " 或 "Prompt "
            rawText = rawText.replace(/^(提示|Prompt)[:：]?\s*/i, '');
            if (rawText.trim() !== "") {
                title = rawText.trim();
            }
        }
        // 替换非法字符为下划线，并将连续空格合并
        const safeTitle = title.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ');
        const finalTitle = safeTitle.length > 60 ? safeTitle.substring(0, 60) : safeTitle;
        return `Gemini_Activity_${finalTitle}.txt`;
    }

    // 内容提取与清洗逻辑
    function getCleanContent() {
        const contentEl = document.querySelector(SELECTORS.CONTENT);
        if (!contentEl) return null;

        const clone = contentEl.cloneNode(true);

        // 查找并移除页脚无关信息
        const headers = clone.querySelectorAll('h3');
        headers.forEach(h3 => {
            if (h3.innerText.includes(SELECTORS.FOOTER_KEYWORD)) {
                const sectionContainer = h3.closest('.ETHINc');
                if (sectionContainer) {
                    const prevSibling = sectionContainer.previousElementSibling;
                    if (prevSibling && prevSibling.getAttribute('role') === 'separator') {
                        prevSibling.remove();
                    }
                    sectionContainer.remove();
                }
            }
        });
        return clone.innerText.trim();
    }

    function handleSave() {
        const cleanText = getCleanContent();
        if (!cleanText) {
            alert('内容提取失败，请重试');
            return;
        }
        const filename = getCleanFilename();
        const separator = "\n" + "-".repeat(40) + "\n";
        const header = `File: ${filename}\nSaved: ${new Date().toLocaleString()}\n` + separator;
        downloadTextFile(filename, header + cleanText);
    }

    // ★★★ 核心修复：使用纯 DOM API 创建按钮，不使用 innerHTML ★★★
    function createSaveButton() {
        // 1. 创建 Wrapper (防止布局挤压)
        const wrapper = document.createElement('div');
        wrapper.id = 'tm-gemini-save-wrapper';
        wrapper.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto; /* 禁止被压缩 */
            margin-right: 0px; 
            vertical-align: middle;
            height: 48px; /* 强制高度与兄弟元素一致 */
            width: 48px;  /* 强制宽度 */
        `;

        // 2. 创建 Button 元素
        const btn = document.createElement('button');
        btn.className = SELECTORS.BUTTON_CLASS;
        btn.setAttribute('aria-label', '保存到本地');
        btn.setAttribute('data-tooltip', '保存到本地');
        
        // 强制样式覆盖
        btn.style.cssText = `
            background-color: transparent !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        `;

        // 3. 逐个创建内部元素 (绕过 TrustedHTML 限制)
        
        // 涟漪层 1
        const ripple1 = document.createElement('div');
        ripple1.className = 'VfPpkd-Bz112c-Jh9lGc';
        
        // 涟漪层 2
        const ripple2 = document.createElement('div');
        ripple2.className = 'VfPpkd-Bz112c-J1Ukfc-LhBDec';
        
        // 图标层
        const icon = document.createElement('i');
        icon.className = SELECTORS.ICON_CLASS;
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = 'save'; // 这里的 'save' 会自动被 Material Icons 字体渲染为图标
        
        // 组装 DOM
        btn.appendChild(ripple1);
        btn.appendChild(ripple2);
        btn.appendChild(icon);
        
        // 事件绑定
        btn.addEventListener('mouseenter', () => btn.style.backgroundColor = 'rgba(60,64,67,0.08)');
        btn.addEventListener('mouseleave', () => btn.style.backgroundColor = 'transparent');
        btn.addEventListener('click', handleSave);

        wrapper.appendChild(btn);
        return wrapper;
    }

    // 观察器
    const observer = new MutationObserver((mutations) => {
        const container = document.querySelector(SELECTORS.CONTAINER);
        
        if (container) {
            // 布局强制修复 (防止关闭按钮消失)
            // 强制父容器不换行，且宽度自适应内容
            if (container.style.flexWrap !== 'nowrap') {
                 container.style.flexWrap = 'nowrap';
                 container.style.width = 'auto'; 
                 container.style.minWidth = 'max-content'; // 关键：撑开宽度
            }

            // 检查按钮是否已存在
            if (!document.getElementById('tm-gemini-save-wrapper')) {
                const saveWrapper = createSaveButton();
                container.prepend(saveWrapper);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
