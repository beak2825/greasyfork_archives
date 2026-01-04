// ==UserScript==
// @name         裁判文书网文书快速复制增强版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速复制中国裁判文书网的文书内容，支持一键复制、格式化和多种导出选项
// @author       You
// @match        https://wenshu.court.gov.cn/website/wenshu/*
// @icon         https://wenshu.court.gov.cn/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558218/%E8%A3%81%E5%88%A4%E6%96%87%E4%B9%A6%E7%BD%91%E6%96%87%E4%B9%A6%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558218/%E8%A3%81%E5%88%A4%E6%96%87%E4%B9%A6%E7%BD%91%E6%96%87%E4%B9%A6%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 添加自定义样式
    GM_addStyle(`
        .copy-toolkit {
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 99999;
        }

        .copy-main-btn {
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .copy-main-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }

        .copy-main-btn:active {
            transform: translateY(-1px);
        }

        .copy-options-panel {
            margin-top: 15px;
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: none;
            min-width: 260px;
        }

        .copy-options-panel.show {
            display: block;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .option-group {
            margin-bottom: 15px;
        }

        .option-group-title {
            font-size: 13px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
        }

        .option-item {
            display: flex;
            align-items: center;
            margin: 8px 0;
            cursor: pointer;
            padding: 5px;
            border-radius: 5px;
            transition: background 0.2s;
        }

        .option-item:hover {
            background: #f5f5f5;
        }

        .option-item input[type="checkbox"] {
            margin-right: 10px;
            cursor: pointer;
            width: 16px;
            height: 16px;
        }

        .option-item label {
            cursor: pointer;
            font-size: 14px;
            color: #555;
            flex: 1;
        }

        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .action-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn-copy {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-copy:hover {
            opacity: 0.9;
            transform: scale(1.02);
        }

        .btn-download {
            background: #f0f0f0;
            color: #333;
        }

        .btn-download:hover {
            background: #e0e0e0;
        }

        .copy-toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            font-size: 16px;
            z-index: 100000;
            display: none;
            animation: fadeInOut 2s ease-in-out;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .copy-toast.show {
            display: block;
        }

        .copy-toast.success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .copy-toast.error {
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }

        .toggle-options-btn {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.2s;
        }

        .toggle-options-btn:hover {
            background: #667eea;
            color: white;
        }
    `);
    // 创建工具包容器
    const toolkit = document.createElement('div');
    toolkit.className = 'copy-toolkit';
    toolkit.innerHTML = `
        <button class="copy-main-btn">
            📋 一键复制文书
        </button>
        <button class="toggle-options-btn">⚙️ 复制选项</button>
        <div class="copy-options-panel">
            <div class="option-group">
                <div class="option-group-title">📄 内容选择</div>
                <div class="option-item">
                    <input type="checkbox" id="opt-title" checked>
                    <label for="opt-title">包含标题</label>
                </div>
                <div class="option-item">
                    <input type="checkbox" id="opt-caseinfo" checked>
                    <label for="opt-caseinfo">包含案件信息</label>
                </div>
                <div class="option-item">
                    <input type="checkbox" id="opt-content" checked>
                    <label for="opt-content">包含正文内容</label>
                </div>
            </div>

            <div class="option-group">
                <div class="option-group-title">✨ 格式选项</div>
                <div class="option-item">
                    <input type="checkbox" id="opt-format" checked>
                    <label for="opt-format">保留段落格式</label>
                </div>
                <div class="option-item">
                    <input type="checkbox" id="opt-clean" checked>
                    <label for="opt-clean">清理多余空格</label>
                </div>
                <div class="option-item">
                    <input type="checkbox" id="opt-indent">
                    <label for="opt-indent">保留缩进（2空格）</label>
                </div>
            </div>

            <div class="action-buttons">
                <button class="action-btn btn-copy">📋 复制</button>
                <button class="action-btn btn-download">💾 下载</button>
            </div>
        </div>
    `;

    document.body.appendChild(toolkit);
    // 创建提示框
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
    // 获取DOM元素
    const mainBtn = toolkit.querySelector('.copy-main-btn');
    const toggleBtn = toolkit.querySelector('.toggle-options-btn');
    const optionsPanel = toolkit.querySelector('.copy-options-panel');
    const copyBtn = toolkit.querySelector('.btn-copy');
    const downloadBtn = toolkit.querySelector('.btn-download');
    // 显示提示信息
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `copy-toast show ${type}`;
        setTimeout(() => {
            toast.className = 'copy-toast';
        }, 2000);
    }
    // 切换选项面板
    toggleBtn.addEventListener('click', () => {
        optionsPanel.classList.toggle('show');
    });
    // 点击其他地方关闭面板
    document.addEventListener('click', (e) => {
        if (!toolkit.contains(e.target)) {
            optionsPanel.classList.remove('show');
        }
    });
    // 提取文书内容的核心函数
    function extractDocumentContent() {
        let content = '';

        // 获取选项
        const includeTitle = document.getElementById('opt-title').checked;
        const includeCaseInfo = document.getElementById('opt-caseinfo').checked;
        const includeContent = document.getElementById('opt-content').checked;
        const formatText = document.getElementById('opt-format').checked;
        const cleanSpace = document.getElementById('opt-clean').checked;
        const keepIndent = document.getElementById('opt-indent').checked;
        // 1. 提取标题
        if (includeTitle) {
            const titleElement = document.querySelector('.PDF_title');
            if (titleElement) {
                let title = titleElement.textContent.trim();
                content += title + '\n\n';
            }
        }
        // 2. 提取案件基本信息
        if (includeCaseInfo) {
            const caseType = document.getElementById('aydiv');
            const caseNumber = document.getElementById('ahdiv');

            if (caseType && caseType.textContent.trim()) {
                content += '案由：' + caseType.textContent.trim() + '\n';
            }
            if (caseNumber && caseNumber.textContent.trim()) {
                content += '案号：' + caseNumber.textContent.trim() + '\n';
            }

            // 获取发布日期
            const dfTable = document.querySelector('.dftable');
            if (dfTable) {
                const rows = dfTable.querySelectorAll('tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    for (let i = 0; i < cells.length; i += 2) {
                        if (cells[i] && cells[i + 1]) {
                            const label = cells[i].textContent.trim();
                            const value = cells[i + 1].textContent.trim();
                            if (label && value && label !== '浏览次数') {
                                content += label + '：' + value + '\n';
                            }
                        }
                    }
                });
            }

            content += '\n' + '='.repeat(60) + '\n\n';
        }
        // 3. 提取正文内容
        if (includeContent) {
            const pdfContent = document.querySelector('.PDF_pox');
            if (pdfContent) {
                // 获取所有div段落
                const paragraphs = pdfContent.querySelectorAll('div');

                paragraphs.forEach(para => {
                    let text = para.textContent.trim();

                    // 跳过空内容和title标签
                    if (!text || text === '' || para.querySelector('title')) {
                        return;
                    }

                    // 清理多余空格
                    if (cleanSpace) {
                        text = text.replace(/\s+/g, ' ');
                        text = text.replace(/\u3000+/g, '');
                    }

                    // 获取当前段落的样式 - 修复：将style定义在forEach内部
                    const paraStyle = para.getAttribute('style') || '';

                    // 处理缩进
                    if (keepIndent) {
                        // 检查是否有缩进样式
                        if (paraStyle.includes('TEXT-INDENT')) {
                            text = '  ' + text;
                        }
                    }

                    // 添加段落
                    if (formatText) {
                        content += text + '\n';

                        // 标题和重要段落后额外换行
                        if (paraStyle && (paraStyle.includes('FONT-SIZE: 18pt') ||
                                     paraStyle.includes('TEXT-ALIGN: center'))) {
                            content += '\n';
                        }
                    } else {
                        content += text + ' ';
                    }
                });
            }
        }
        // 最后清理
        if (cleanSpace) {
            content = content.replace(/\n{3,}/g, '\n\n'); // 最多保留两个换行
            content = content.trim();
        }
        return content;
    }
    // 复制到剪贴板
    function copyToClipboard() {
        try {
            const content = extractDocumentContent();

            if (!content) {
                showToast('❌ 未找到可复制的内容', 'error');
                return;
            }
            // 使用 GM_setClipboard 复制
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(content, 'text');
                showToast('✅ 复制成功！共 ' + content.length + ' 字符', 'success');
            } else {
                // 备用方案：使用原生API
                navigator.clipboard.writeText(content).then(() => {
                    showToast('✅ 复制成功！共 ' + content.length + ' 字符', 'success');
                }).catch(() => {
                    // 再备用方案：创建临时文本框
                    const textarea = document.createElement('textarea');
                    textarea.value = content;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    showToast('✅ 复制成功！共 ' + content.length + ' 字符', 'success');
                });
            }
        } catch (error) {
            console.error('复制失败：', error);
            showToast('❌ 复制失败：' + error.message, 'error');
        }
    }
    // 下载为文本文件
    function downloadAsText() {
        try {
            const content = extractDocumentContent();

            if (!content) {
                showToast('❌ 未找到可下载的内容', 'error');
                return;
            }
            // 获取文件名（使用案号或标题）
            let filename = '裁判文书';
            const caseNumber = document.getElementById('ahdiv');
            if (caseNumber && caseNumber.textContent.trim()) {
                filename = caseNumber.textContent.trim().replace(/[\/\\:*?"<>|]/g, '-');
            }
            filename += '.txt';
            // 创建下载
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('✅ 下载成功！', 'success');
        } catch (error) {
            console.error('下载失败：', error);
            showToast('❌ 下载失败：' + error.message, 'error');
        }
    }
    // 绑定事件
    mainBtn.addEventListener('click', copyToClipboard);
    copyBtn.addEventListener('click', () => {
        copyToClipboard();
        optionsPanel.classList.remove('show');
    });
    downloadBtn.addEventListener('click', () => {
        downloadAsText();
        optionsPanel.classList.remove('show');
    });
    // 快捷键支持：Ctrl+Shift+C
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyToClipboard();
        }
    });
    console.log('✅ 裁判文书网快速复制插件已加载');
    console.log('💡 使用说明：');
    console.log('   - 点击"一键复制文书"按钮直接复制');
    console.log('   - 点击"复制选项"调整复制设置');
    console.log('   - 快捷键 Ctrl+Shift+C 快速复制');
})();