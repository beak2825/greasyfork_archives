// ==UserScript==
// @name         交互式二维码识别器（草料API + 快捷键）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  按 Q 键激活选择模式，点击图片解析二维码，弹窗显示结果（可跳转/复制）
// @author       BOS
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      api.2dcode.biz
// @downloadURL https://update.greasyfork.org/scripts/557862/%E4%BA%A4%E4%BA%92%E5%BC%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E5%99%A8%EF%BC%88%E8%8D%89%E6%96%99API%20%2B%20%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557862/%E4%BA%A4%E4%BA%92%E5%BC%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E5%99%A8%EF%BC%88%E8%8D%89%E6%96%99API%20%2B%20%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let selectionMode = false;
    let overlay = null;
    let modal = null;

    // 创建高亮边框样式（动态注入）
    const style = document.createElement('style');
    style.textContent = `
        .qr-highlight {
            outline: 3px solid #4CAF50 !important;
            cursor: pointer !important;
            transition: outline 0.2s;
        }
        .qr-modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
        }
        .qr-modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 90%;
            width: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .qr-modal-content h3 {
            margin-top: 0;
            color: #333;
        }
        .qr-result {
            margin: 12px 0;
            padding: 10px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
            word-break: break-all;
            font-size: 14px;
            color: #0066cc;
            cursor: pointer;
        }
        .qr-result:hover {
            background: #eef5ff;
        }
        .qr-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .qr-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .qr-btn-copy {
            background: #4CAF50;
            color: white;
        }
        .qr-btn-copy:hover {
            background: #45a049;
        }
    `;
    document.head.appendChild(style);

    // 关闭弹窗
    function closeModal() {
        if (overlay) {
            document.body.removeChild(overlay);
            overlay = null;
            modal = null;
        }
        disableSelectionMode();
    }

    // 显示结果弹窗
    function showModal(content) {
        closeModal(); // 确保只存在一个弹窗

        overlay = document.createElement('div');
        overlay.className = 'qr-modal-backdrop';
        modal = document.createElement('div');
        modal.className = 'qr-modal-content';

        const isUrl = /^https?:\/\//i.test(content.trim());

        let resultEl;
        if (isUrl) {
            resultEl = document.createElement('div');
            resultEl.className = 'qr-result';
            resultEl.title = '点击在新标签页打开';
            resultEl.textContent = content;
            resultEl.onclick = () => {
                window.open(content, '_blank');
                closeModal();
            };
        } else {
            resultEl = document.createElement('div');
            resultEl.style.padding = '10px';
            resultEl.style.background = '#f9f9f9';
            resultEl.style.borderRadius = '4px';
            resultEl.style.wordBreak = 'break-all';
            resultEl.textContent = content;
        }

        const copyBtn = document.createElement('button');
        copyBtn.className = 'qr-btn qr-btn-copy';
        copyBtn.textContent = '复制内容';
        copyBtn.onclick = () => {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(content);
            } else {
                // fallback: 使用现代 Clipboard API（需 HTTPS 或 localhost）
                navigator.clipboard?.writeText(content).catch(err => {
                    console.warn('复制失败:', err);
                });
            }
            closeModal();
        };

        modal.innerHTML = '<h3>二维码识别结果</h3>';
        modal.appendChild(resultEl);

        const btns = document.createElement('div');
        btns.className = 'qr-buttons';
        btns.appendChild(copyBtn);
        modal.appendChild(btns);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 点击遮罩关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal();
        };
    }

    // 调用草料 API 解析
    function decodeQRCode(imgUrl) {
        const apiUrl = 'https://api.2dcode.biz/v1/read-qr-code?file_url=' + encodeURIComponent(imgUrl);

        showModal('正在识别中...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.code === 0 && data.data?.contents?.length > 0) {
                        const content = data.data.contents[0]; // 取第一个结果
                        showModal(content);
                    } else {
                        showModal('❌ 未识别到二维码');
                    }
                } catch (e) {
                    console.error('解析失败:', e);
                    showModal('❌ 解析失败');
                }
            },
            onerror: function () {
                showModal('❌ 网络请求失败');
            }
        });
    }

    // 启用选择模式
    function enableSelectionMode() {
        if (selectionMode) return;
        selectionMode = true;
        document.body.style.cursor = 'crosshair';

        // 悬停高亮
        document.addEventListener('mouseover', highlightHandler, true);
        document.addEventListener('click', clickHandler, true);
    }

    // 禁用选择模式
    function disableSelectionMode() {
        if (!selectionMode) return;
        selectionMode = false;
        document.body.style.cursor = '';

        document.querySelectorAll('.qr-highlight').forEach(el => {
            el.classList.remove('qr-highlight');
        });

        document.removeEventListener('mouseover', highlightHandler, true);
        document.removeEventListener('click', clickHandler, true);
    }

    // 鼠标悬停高亮逻辑
    function highlightHandler(e) {
        if (selectionMode && e.target.tagName === 'IMG') {
            // 移除其他高亮
            document.querySelectorAll('.qr-highlight').forEach(el => {
                if (el !== e.target) el.classList.remove('qr-highlight');
            });
            e.target.classList.add('qr-highlight');
        }
    }

    // 点击处理
    function clickHandler(e) {
        if (!selectionMode) return;
        e.preventDefault();
        e.stopPropagation();

        if (e.target.tagName === 'IMG' && e.target.src && e.target.src.startsWith('http')) {
            decodeQRCode(e.target.src);
        } else {
            // 点击非图片区域，取消选择模式
            disableSelectionMode();
        }
    }

    // 快捷键监听：按 Q 键激活
    document.addEventListener('keydown', (e) => {
        // 避免在输入框中触发
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        if (e.key.toLowerCase() === 'q' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            if (selectionMode) {
                disableSelectionMode();
            } else {
                enableSelectionMode();
            }
        }
    });

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        disableSelectionMode();
        closeModal();
    });
})();