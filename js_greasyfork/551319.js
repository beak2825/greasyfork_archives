// ==UserScript==
// @name         Gemini 内容导出器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面上添加一个按钮，用于点击后遍历所有 immersive-entry-chip，提取内容并整合成一个文件下载。
// @author       ccyd
// @include      *://gemini.google.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551319/Gemini%20%E5%86%85%E5%AE%B9%E5%AF%BC%E5%87%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551319/Gemini%20%E5%86%85%E5%AE%B9%E5%AF%BC%E5%87%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 异步等待函数
     * @param {number} ms - 等待的毫秒数
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 主导出函数
     */
    async function exportContent() {
        console.log('导出流程开始...');
        const exportButton = document.getElementById('gemini-export-button');
        if (!exportButton) return;

        exportButton.textContent = '正在导出...';
        exportButton.disabled = true;

        let fullContent = `# Gemini 导出内容\n\n* 导出时间: ${new Date().toLocaleString()}\n\n---\n\n`;
        const chips = document.querySelectorAll('immersive-entry-chip');
        const totalChips = chips.length;

        if (totalChips === 0) {
            alert('页面上未找到可导出的项目 (immersive-entry-chip)。');
            resetButtonState(exportButton);
            return;
        }

        console.log(`发现 ${totalChips} 个项目需要处理。`);

        // 从上到下遍历所有项目
        for (let i = 0; i < totalChips; i++) {
            const chip = chips[i];
            exportButton.textContent = `正在导出... (${i + 1}/${totalChips})`;

            // 找到并点击项目中的“打开”按钮
            const openButton = chip.querySelector('button[data-test-id="view-report-button"]');
            if (openButton) {
                openButton.click();
                console.log(`已点击第 ${i + 1} 个项目的打开按钮。`);

                // 等待内容加载，这个时间可能需要根据您的网络情况调整
                await sleep(1500);

                // 获取编辑器容器中的内容
                const editor = document.querySelector('.immersive-editor-container .ProseMirror');
                if (editor) {
                    const titleElement = chip.querySelector('[data-test-id="artifact-text"]');
                    const title = titleElement ? titleElement.innerText.trim() : `条目 ${i + 1}`;
                    const content = editor.innerHTML; // 使用 innerHTML 保留格式

                    fullContent += `## ${title}\n\n`;
                    fullContent += content.replace(/<p><\/p>/g, '\n'); // 将空的p标签转换成换行
                    fullContent += '\n\n---\n\n';
                    console.log(`已成功提取标题为 "${title}" 的内容。`);
                } else {
                    console.warn(`未能为第 ${i + 1} 个项目找到编辑器内容。`);
                    fullContent += `## 条目 ${i + 1}\n\n[错误: 点击后未能找到内容编辑器。]\n\n---\n\n`;
                }
            } else {
                console.warn(`未能为第 ${i + 1} 个项目找到“打开”按钮。`);
            }
        }

        console.log('所有项目处理完毕。');
        saveContentToFile(fullContent);
        resetButtonState(exportButton);
    }

    /**
     * 将收集到的内容保存为文件并触发下载
     * @param {string} content - 要保存的完整文本内容
     */
    function saveContentToFile(content) {
        if (!content) {
            alert('没有提取到任何内容。');
            return;
        }

        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        // 生成文件名，例如：gemini-export-2025-08-24.md
        link.download = `gemini-export-${new Date().toISOString().slice(0, 10)}.md`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        console.log('文件下载已触发。');
    }

    /**
     * 重置按钮状态
     * @param {HTMLButtonElement} button - 按钮元素
     */
    function resetButtonState(button) {
        if (button) {
            button.textContent = '导出所有内容';
            button.disabled = false;
        }
    }

    /**
     * 创建并添加导出按钮到页面上
     */
    function addExportButton() {
        const exportButton = document.createElement('button');
        exportButton.id = 'gemini-export-button';
        exportButton.textContent = '导出所有内容';

        // 设置按钮样式
        Object.assign(exportButton.style, {
            position: 'fixed',
            top: '15px',
            right: '50px',
            zIndex: '9999',
            padding: '10px 20px',
            backgroundColor: '#4285F4', // Google 蓝色
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s'
        });

        // 添加鼠标悬停效果
        exportButton.onmouseover = () => { exportButton.style.backgroundColor = '#357AE8'; };
        exportButton.onmouseout = () => { exportButton.style.backgroundColor = '#4285F4'; };

        document.body.appendChild(exportButton);
        exportButton.addEventListener('click', exportContent);
    }

    // 脚本主入口
    window.addEventListener('load', () => {
        // 延迟一会再添加按钮，确保页面元素加载完毕
        setTimeout(addExportButton, 1000);
    });

})();
