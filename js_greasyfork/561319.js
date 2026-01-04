// ==UserScript==
// @name         Dify Excel 转提示词 (Lexical 专用版 - 抽屉式)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  针对 Dify 的 Lexical 富文本编辑器进行精准 Markdown 插入 - 抽屉式设计
// @author       Monica Assistant
// @match        *://*/*
// @grant        none
// @require      https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/561319/Dify%20Excel%20%E8%BD%AC%E6%8F%90%E7%A4%BA%E8%AF%8D%20%28Lexical%20%E4%B8%93%E7%94%A8%E7%89%88%20-%20%E6%8A%BD%E5%B1%89%E5%BC%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561319/Dify%20Excel%20%E8%BD%AC%E6%8F%90%E7%A4%BA%E8%AF%8D%20%28Lexical%20%E4%B8%93%E7%94%A8%E7%89%88%20-%20%E6%8A%BD%E5%B1%89%E5%BC%8F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .excel-drawer-trigger {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px 0 0 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: -2px 2px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9999;
            border: none;
            outline: none;
        }
        
        .excel-drawer-trigger:hover {
            width: 56px;
            box-shadow: -4px 4px 20px rgba(102, 126, 234, 0.4);
        }
        
        .excel-drawer-trigger svg {
            width: 24px;
            height: 24px;
            fill: white;
            transition: transform 0.3s ease;
        }
        
        .excel-drawer-trigger:hover svg {
            transform: scale(1.1);
        }
        
        .excel-drawer-panel {
            position: fixed;
            right: -320px;
            top: 50%;
            transform: translateY(-50%);
            width: 320px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 16px 0 0 16px;
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
            transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 9998;
            padding: 32px 24px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .excel-drawer-panel.open {
            right: 0;
        }
        
        .excel-drawer-header {
            margin-bottom: 24px;
        }
        
        .excel-drawer-title {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .excel-drawer-subtitle {
            font-size: 13px;
            color: #666;
            margin: 0;
            line-height: 1.5;
        }
        
        .excel-upload-area {
            border: 2px dashed #ddd;
            border-radius: 12px;
            padding: 32px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
        }
        
        .excel-upload-area:hover {
            border-color: #667eea;
            background: linear-gradient(135deg, #fafbff 0%, #f5f7ff 100%);
        }
        
        .excel-upload-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 12px;
            fill: #667eea;
        }
        
        .excel-upload-text {
            font-size: 14px;
            color: #333;
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .excel-upload-hint {
            font-size: 12px;
            color: #999;
        }
        
        .excel-close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            border: none;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .excel-close-btn:hover {
            background: rgba(0, 0, 0, 0.1);
        }
        
        .excel-close-btn svg {
            width: 16px;
            height: 16px;
            fill: #666;
        }
        
        .excel-drawer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(2px);
            z-index: 9997;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        
        .excel-drawer-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);

    // 创建触发按钮
    const trigger = document.createElement('button');
    trigger.className = 'excel-drawer-trigger';
    trigger.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
    `;
    document.body.appendChild(trigger);

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'excel-drawer-overlay';
    document.body.appendChild(overlay);

    // 创建抽屉面板
    const panel = document.createElement('div');
    panel.className = 'excel-drawer-panel';
    panel.innerHTML = `
        <button class="excel-close-btn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        </button>
        <div class="excel-drawer-header">
            <h3 class="excel-drawer-title">
                📊 Excel 导入
            </h3>
            <p class="excel-drawer-subtitle">将 Excel 表格转换为 Markdown 并插入到 Lexical 编辑器</p>
        </div>
        <div class="excel-upload-area">
            <svg class="excel-upload-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            <div class="excel-upload-text">点击或拖拽上传文件</div>
            <div class="excel-upload-hint">支持 .xlsx, .xls, .csv 格式</div>
        </div>
    `;
    document.body.appendChild(panel);

    // 创建文件输入
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls, .csv';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // 事件监听
    let isOpen = false;

    trigger.onclick = () => {
        isOpen = true;
        panel.classList.add('open');
        overlay.classList.add('visible');
    };

    const closeDrawer = () => {
        isOpen = false;
        panel.classList.remove('open');
        overlay.classList.remove('visible');
    };

    panel.querySelector('.excel-close-btn').onclick = closeDrawer;
    overlay.onclick = closeDrawer;

    const uploadArea = panel.querySelector('.excel-upload-area');
    uploadArea.onclick = () => fileInput.click();

    // 拖拽上传
    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = 'linear-gradient(135deg, #fafbff 0%, #f5f7ff 100%)';
    };

    uploadArea.ondragleave = () => {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%)';
    };

    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%)';
        
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
        fileInput.value = '';
    };

    function processFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            if (jsonData.length > 0) {
                const mdTable = arrayToMarkdown(jsonData);
                insertIntoLexical(mdTable);
                closeDrawer();
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function arrayToMarkdown(data) {
        if (data.length === 0) return "";
        const header = data[0];
        const rows = data.slice(1);
        let md = `| ${header.map(h => (h || '').toString().replace(/\|/g, '\\|')).join(' | ')} |\n`;
        md += `| ${header.map(() => '---').join(' | ')} |\n`;
        rows.forEach(row => {
            const fullRow = Array.from({ length: header.length }, (_, i) => row[i] || '');
            md += `| ${fullRow.map(c => c.toString().replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ')} |\n`;
        });
        return md;
    }

    function insertIntoLexical(text) {
        const editors = Array.from(document.querySelectorAll('div[data-lexical-editor="true"]'));

        let target = editors.find(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 200 && rect.height > 100 && el.offsetParent !== null;
        });

        if (!target && editors.length > 0) target = editors[0];

        if (target) {
            target.focus();

            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            if (!target.contains(selection.anchorNode)) {
                const range = document.createRange();
                range.selectNodeContents(target);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            const success = document.execCommand('insertText', false, "\n" + text + "\n");

            if (success) {
                console.log('Lexical 插入成功');
                target.dispatchEvent(new Event('input', { bubbles: true }));
                
                // 成功提示
                showNotification('✅ 已成功插入 Markdown 表格！', 'success');
            } else {
                showNotification('❌ 插入失败，请先点击输入框再尝试', 'error');
            }
        } else {
            showNotification('❌ 未找到 Lexical 编辑器', 'error');
        }
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        const keyframes = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        if (!document.querySelector('#notificationKeyframes')) {
            const style = document.createElement('style');
            style.id = 'notificationKeyframes';
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'all 0.3s ease';
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
})();