// ==UserScript==
// @name         StackEdit一键格式化内容
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  为 StackEdit 添加“一键格式化内容”和“格式化表格”按钮，自动格式化输入区内容（换行、LaTeX、表格等）
// @author       damu
// @match        https://stackedit.io/app*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550482/StackEdit%E4%B8%80%E9%94%AE%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/550482/StackEdit%E4%B8%80%E9%94%AE%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ---------- 读取编辑器内容（优先 CodeMirror） ---------- */
    function getEditorContent() {
        try {
            const cmHost = document.querySelector('.CodeMirror');
            if (cmHost && cmHost.CodeMirror) {
                return cmHost.CodeMirror.getValue();
            }
        } catch (e) { /* ignore */ }

        const pre = document.querySelector('pre.editor__inner, pre.editor__inner.markdown-highlighting');
        if (pre) {
            return pre.innerText || pre.textContent || '';
        }

        const ta = document.querySelector('textarea, .editormd-markdown-textarea');
        if (ta) return ta.value || '';

        return '';
    }

    /** ---------- 写回编辑器内容（多重策略） ---------- */
    function setEditorContent(content) {
        // 1) CodeMirror 写回
        try {
            const cmHost = document.querySelector('.CodeMirror');
            if (cmHost && cmHost.CodeMirror) {
                cmHost.CodeMirror.setValue(content);
                cmHost.CodeMirror.refresh && cmHost.CodeMirror.refresh();
                return true;
            }
        } catch (e) {/* ignore */ }

        // 2) contenteditable 的 pre.editor__inner 写回（尽量被编辑器识别）
        const pre = document.querySelector('pre.editor__inner, pre.editor__inner.markdown-highlighting');
        if (pre) {
            try {
                // 使用 execCommand 插入（大多数浏览器/编辑器会把它当作用户输入）
                const sel = window.getSelection();
                sel.removeAllRanges();
                const r2 = document.createRange();
                r2.selectNodeContents(pre);
                r2.deleteContents();
                const tn = document.createTextNode(content);
                r2.insertNode(tn);

                // 触发事件告知编辑器已改变
                pre.dispatchEvent(new Event('input', { bubbles: true }));
                pre.dispatchEvent(new Event('keyup', { bubbles: true }));
                pre.dispatchEvent(new Event('change', { bubbles: true }));

                // 少许延时以保证编辑器内部同步
                setTimeout(() => {
                    try {pre.blur(); } catch (e) { /* ignore */ }
                }, 60);

                return true;
            } catch (e) {
                // fallback 到直接 textContent
                try {
                    pre.textContent = content;
                    pre.dispatchEvent(new Event('input', { bubbles: true }));
                    return true;
                } catch (ee) {/* ignore */ }
            }
        }

        // 3) textarea 回退
        const ta = document.querySelector('textarea, .editormd-markdown-textarea');
        if (ta) {
            ta.value = content;
            ta.dispatchEvent(new Event('input', { bubbles: true }));
            ta.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        return false;
    }

    /** ---------- 表格格式化函数（沿用你提供的逻辑） ---------- */
    const formatTableLine = (line) => {
        const cells = line.split('|');
        let result = '|';

        for (let i = 1; i < cells.length - 1; i++) {
            const content = cells[i].trim() === '' ? '  ' : ` ${cells[i].trim()} `;
            result += content + '|';
        }

        return result;
    };

    const formatSeparatorLine = (line) => {
        const cells = line.split('|').map(cell => cell.trim());
        let result = '|';

        for (let i = 1; i < cells.length - 1; i++) {
            result += ' --- |';
        }

        return result;
    };


    const formatTable = (content) => {
        const lines = content.split('\n');
        let tableStart = -1;
        let tableEnd = -1;
        const tables = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('|') && line.endsWith('|')) {
                if (tableStart === -1) tableStart = i;
                tableEnd = i;
            } else if (tableStart !== -1) {
                if (i === tableStart + 1 && line.includes('|') && line.replace(/[^|-]/g, '').length > 0) {
                    tableEnd = i;
                } else {
                    if (tableEnd - tableStart >= 1) {
                        tables.push({ start: tableStart, end: tableEnd });
                    }
                    tableStart = -1;
                    tableEnd = -1;
                }
            }
        }

        if (tableStart !== -1 && tableEnd - tableStart >= 1) {
            tables.push({ start: tableStart, end: tableEnd });
        }

        if (tables.length === 0) return content;

        const newLines = [...lines];
        tables.forEach(({ start, end }) => {
            newLines[start] = formatTableLine(newLines[start]);
            if (start + 1 <= end) {
                newLines[start + 1] = formatSeparatorLine(newLines[start + 1]);
            }
            for (let i = start + 2; i <= end; i++) {
                newLines[i] = formatTableLine(newLines[i]);
            }
        });

        return newLines.join('\n');
    };

    /** ---------- 主格式化流程 ---------- */
    function formatAllContent() {
        let content = getEditorContent();
        if (content == null) {
            showToast('未获取到编辑器内容，无法格式化!', 2);
            return;
        }
        console.log("=================格式化前==============");
        console.log(content);
        console.log("===============================================");
        // 判断是否需要格式化
        const needFormat =
            content.includes('\\n') || // 字面量换行
            /\\\\\[/.test(content) || // \\[ 公式
            /\\\\\(/.test(content) || // \\( 公式
            /\\\\\]/.test(content) || // \\] 公式
            /\\\\\)/.test(content); // \\) 公式

        if (!needFormat) {
            showToast('内容无需格式化!', 3);
            return;
        }

        // 只替换字面量 \n
        if (content.includes('\\n')) {
            content = content.replace(/\\n/g, '\n');
        }
        content = content.replace(/\\\\\[/g, () => '$$ ');
        content = content.replace(/\\\\\(/g, () => '$$');
        content = content.replace(/\\\\\]/g, () => ' $$');
        content = content.replace(/\\\\\)/g, () => '$$');
        content = content.replace(/\\\\/g, '\\');
        content = formatTable(content);

        // 去掉首尾空格和换行
        content = content.trim();
        console.log("=================格式化后==============");
        console.log(content);
        console.log("===============================================");
        const ok = setEditorContent(content);
        if (!ok) {
            showToast('写回编辑器失败!', 1);
        } else {
            showToast('一键格式化完成！');
        }
    }

    /** ---------- 创建按钮并安装快捷键 ---------- */
    function createButtonIfMissing() {
        let nav = document.querySelector('.navigation-bar__inner.navigation-bar__inner--edit-pagedownButtons') || document.querySelector('.navigation-bar__inner');
        if (!nav || document.getElementById('stackedit-format-one-click')) return;

        const btn = document.createElement('button');
        btn.id = 'stackedit-format-one-click';
        btn.title = '一键格式化内容 – alt+Shift+F';
        btn.innerText = '一键格式化内容';
        btn.style.cssText = 'margin-left:4px;padding:2px 6px;font-size:13px;cursor:pointer;border:1px solid #ccc;border-radius:3px;background:#f0f0f0;color:#333;white-space:nowrap;';

        btn.addEventListener('click', formatAllContent);

        // 插入到按钮组最后，不覆盖原有按钮
        nav.appendChild(btn);
    }


    /** ---------- 新增单独格式化表格按钮 ---------- */
    function createFormatTableButton() {
        const nav = document.querySelector('.navigation-bar__inner.navigation-bar__inner--edit-pagedownButtons')
            || document.querySelector('.navigation-bar__inner');
        if (!nav || document.getElementById('stackedit-format-table')) return;

        const btn = document.createElement('button');
        btn.id = 'stackedit-format-table';
        btn.title = '仅格式化表格';
        btn.innerText = '格式化表格';
        btn.style.cssText = 'margin-left:4px;padding:2px 6px;font-size:13px;cursor:pointer;border:1px solid #ccc;border-radius:3px;background:#f9f9f9;color:#333;white-space:nowrap;';

        btn.addEventListener('click', () => {
            let content = getEditorContent();
            if (!content) return showToast('未获取到编辑器内容', 2);

            // 判断是否需要格式化表格
            const needFormat = /\|.*\|/.test(content); // \\) 公式
            if (!needFormat) {
                showToast('内容无需格式化!', 3);
                return;
            }

            const formatted = formatTable(content);
            if (formatted === content) {
                showToast('没有发现表格需要格式化', 2);
                return;
            }

            setEditorContent(formatted);
            showToast('表格已格式化', 1);
        });

        nav.appendChild(btn);
    }

    // 在现有按钮安装逻辑里也加调用
    const checker = setInterval(() => {
        const navExists = !!document.querySelector('.navigation-bar__inner, .navigation-bar__inner.navigation-bar__inner--edit-pagedownButtons');
        const editorExists = !!document.querySelector('pre.editor__inner, .CodeMirror, textarea');
        if (navExists && editorExists) {
            createButtonIfMissing(); // 原“一键格式化内容”
            createFormatTableButton(); // 新增“格式化表格”
            clearInterval(checker);
        }
    }, 150);

    const mo = new MutationObserver(() => {
        createButtonIfMissing();
        createFormatTableButton(); // 确保切换页面也创建按钮
    });
    mo.observe(document.body, { childList: true, subtree: true });


    document.addEventListener('keydown', (e) => {
        if ((e.altKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
            e.preventDefault();
            formatAllContent();
        }
    });



    /**
    * 显示一个轻量通知（Toast）
    * @param {string} msg - 显示的文本
    * @param {string} [type=0] - 通知类型，可选：0-'success'（成功,绿色）、1-'error'（错误,红色）、2-'info'（灰色）、3-'light'（白色）
    * @param {number} [duration=1500] - 显示时间（毫秒）
    */
    function showToast(msg, type = 0, duration = 1500) {
        const div = document.createElement('div');
        div.textContent = msg;

        // 根据 type 设置背景色
        let bgColor = '#4caf50'; // success 默认绿色
        switch (type) {
            case 1: bgColor = '#f44336'; break; // 红色
            case 2: bgColor = '#9e9e9e'; break; // 灰色
            case 3: bgColor = '#ffffff'; break; // 白色
            // success 已经是默认绿色
        }

        div.style.cssText = `
        position: fixed;
        top: 50px;
        right: 50px;
        background: ${bgColor};
        color: ${type === 3 ? '#333' : 'white'};
        padding: 6px 12px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        z-index: 9999;
        font-size: 14px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        `;

        document.body.appendChild(div);

        // 动画显示
        requestAnimationFrame(() => div.style.opacity = 1);

        // 自动消失
        setTimeout(() => {
            div.style.opacity = 0;
            setTimeout(() => div.remove(), 200);
        }, duration);
    }

})();