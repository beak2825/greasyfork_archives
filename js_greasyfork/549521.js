// ==UserScript==
// @name            网页速记
// @namespace    http://tampermonkey.net/
// @version          2.5
// @description    跨页面持久化的网页速记工具，支持空白和Esc隐藏、可另存为TXT，新增划词保存
// @author          晶痕
// @match        *://*/*
// @match        file:///*
// @exclude      file:///D:/%E5%B7%A5%E5%85%B具有/01%E5%B0%8F%E5%B7%A5%E5%85%B7/%E4%B8%BB%E9%A1%B5/zy/%E6%97%B6%E9%97%B4.html
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549521/%E7%BD%91%E9%A1%B5%E9%80%9F%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/549521/%E7%BD%91%E9%A1%B5%E9%80%9F%E8%AE%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 原生防抖函数实现
    function debounce(func, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 创建主按钮
    const btn = document.createElement('button');
    Object.assign(btn.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: '2147483647',
        padding: '5px 10px',
        width: '55px',
        height: '30px',
        boxSizing: 'border-box',
        background: 'rgba(241, 241, 241, 0.45)',
        backdropFilter: 'blur(8px)',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: 'all 0.3s',
        fontFamily: 'MiSans Medium, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: '1.2',
        textAlign: 'center',
        overflow: 'hidden'
    });
    btn.textContent = '速记';

    // 添加关闭图标
    const closeIcon = document.createElement('span');
    Object.assign(closeIcon.style, {
        position: 'absolute',
        top: '2px',
        right: '2px',
        width: '12px',
        height: '12px',
        //background: 'rgba(241, 241, 241, 0.5)',
        color: '#C1757B',
        fontSize: '11px',
        fontWeight: 'bold',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        cursor: 'pointer',
        userSelect: 'none'
    });
    closeIcon.textContent = '×';
    btn.appendChild(closeIcon);

    // 鼠标悬停效果
    btn.addEventListener('mouseenter', () => {
        btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
        closeIcon.style.display = 'flex';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        closeIcon.style.display = 'none';
    });

    // 创建弹出框
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed',
        right: '20px',
        bottom: '80px',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '7px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
        padding: '6px 6px 3px 6px',
        display: 'none',
        zIndex: '2147483647',
        boxSizing: 'border-box',
        transition: 'all 0.3s',
        flexDirection: 'column'
    });

    // 弹出框鼠标悬停效果
    modal.addEventListener('mouseenter', () => {
        modal.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
    });

    modal.addEventListener('mouseleave', () => {
        modal.style.boxShadow = '0 4px 10px rgba(0,0,0,0.18)';
    });

    // 创建文本域
    const textarea = document.createElement('textarea');
    Object.assign(textarea.style, {
        width: '100%',
        flex: 1,
        border: '0px solid #FEFEFE',
        outline: 'none',
        resize: 'none',
        padding: '12px',
        boxSizing: 'border-box',
        borderRadius: '7px',
        fontSize: '16px',
        fontFamily: 'MiSans Medium, sans-serif',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
    });

    // 数据持久化策略
    const STORAGE_KEY = 'global_quick_note';
    let isSyncing = false;

    // 初始化数据
    const init = async () => {
        const savedNote = await GM_getValue(STORAGE_KEY, '');
        textarea.value = savedNote;

        GM_addValueChangeListener(STORAGE_KEY, (name, oldVal, newVal) => {
            if (!isSyncing) {
                textarea.value = newVal;
            }
        });
    };

    // 保存函数
    const saveNote = (value) => {
        isSyncing = true;
        GM_setValue(STORAGE_KEY, value)
            .then(() => {
                setTimeout(() => {
                    isSyncing = false;
                }, 100);
            })
            .catch(err => console.error('保存失败:', err));
    };

    // 使用原生防抖
    const debouncedSave = debounce(saveNote, 200);

    // 创建并添加“保存为 TXT”按钮
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾';
    Object.assign(saveBtn.style, {
        padding: '6px 8px',
        margin: '2px 0 0 0',
        background: 'rgba(241, 241, 241, 0.3)',
        border: 'none',
        borderRadius: '7px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'MiSans Medium, sans-serif',
        alignSelf: 'flex-end',
        boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
        transition: 'background 0.3s, box-shadow 0.3s',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
    });

    saveBtn.addEventListener('mouseenter', () => {
        saveBtn.style.boxShadow = '0 8px 20px rgba(0,0,0,0.45)';
    });

    saveBtn.addEventListener('mouseleave', () => {
        saveBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.25)';
    });

    // 保存为 TXT 文件
    saveBtn.addEventListener('click', () => {
        const content = textarea.value.trim();
        if (!content) {
            alert('内容为空，无法保存！');
            return;
        }

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getSafeFileName() + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 生成安全文件名
    function getSafeFileName() {
        const title = document.title || '网页速记';
        return title
            .replace(/[\\/:*?"<>|]/g, '_')
            .substring(0, 50);
    }

    // 新增：创建悬浮按钮（用于保存选中文字）
    const floatBtn = document.createElement('button');
    Object.assign(floatBtn.style, {
        position: 'absolute',
        zIndex: '2147483647',
        background: 'rgba(241, 241, 241, 0.45)',
        backdropFilter: 'blur(8px)',
        border: 'none',
        borderRadius: '6px',
        padding: '8px',
        fontSize: '14px',
        fontFamily: 'MiSans Medium, sans-serif',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
        transition: 'all 0.3s',
        display: 'none',
        whiteSpace: 'nowrap'
    });
    floatBtn.textContent = '📝速记';
    document.documentElement.appendChild(floatBtn);

     // to速记鼠标悬停效果
    floatBtn.addEventListener('mouseenter', () => {
        floatBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.45)';
    });

    floatBtn.addEventListener('mouseleave', () => {
        floatBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.25)';
    });

    // 新增：创建保存提示框
    const saveToast = document.createElement('div');
    Object.assign(saveToast.style, {
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '2147483646',
        background: 'rgba(241, 241, 241, 0.45)',
        backdropFilter: 'blur(8px)',
        color: 'black',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '16px',
        fontFamily: 'MiSans Medium, sans-serif',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'all 0.3s'
    });
    saveToast.textContent = '🎉Bingo!';
    document.documentElement.appendChild(saveToast);

    // 新增：显示保存提示
    function showSaveToast() {
        saveToast.style.opacity = '1';
        setTimeout(() => {
            saveToast.style.opacity = '0';
        }, 3000);
    }

    // 新增：监听选中事件并显示按钮
    let selectionTimer = null;
    let currentSelection = null;

    document.addEventListener('mouseup', (e) => {
        const selection = window.getSelection();
        if (!selection.toString().trim()) return;

        currentSelection = selection;

        // 取消之前的定时器
        clearTimeout(selectionTimer);

        // 延迟 0.1s 显示按钮
        selectionTimer = setTimeout(() => {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // 定位到选中区域右上角
            floatBtn.style.top = `${rect.top + window.scrollY - 17}px`;
            floatBtn.style.left = `${rect.right + window.scrollX + 2.5}px`;
            floatBtn.style.display = 'block';
        }, 100);
    });

    // 新增：点击其他地方隐藏按钮
    document.addEventListener('mousedown', (e) => {
        if (!floatBtn.contains(e.target)) {
            floatBtn.style.display = 'none';
        }
    });

    // 新增：点击按钮将选中内容追加到速记
    floatBtn.addEventListener('click', () => {
        const selectedText = currentSelection.toString().trim();
        if (!selectedText) return;

        // 生成时间+网页标题前缀
        const now = new Date();
        const timeStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const title = document.title || '未知页面';
        const prefix = `—————————————\n🕒${timeStr}  🌐${title}\n📑`;

        // 追加内容并保存
        const currentValue = textarea.value;
        textarea.value = currentValue + prefix + selectedText + '\n\n';
        debouncedSave(textarea.value);

        // 显示提示并隐藏按钮
        showSaveToast();
        floatBtn.style.display = 'none';
    });

    // 组装元素
    modal.appendChild(textarea);
    modal.appendChild(saveBtn);
    document.documentElement.appendChild(btn);
    document.documentElement.appendChild(modal);

    // Esc 键隐藏弹窗
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    // 点击外部关闭弹出框
    document.addEventListener('click', (event) => {
        if (
            modal.style.display === 'flex' &&
            !modal.contains(event.target) &&
            !btn.contains(event.target)
        ) {
            modal.style.display = 'none';
        }
    });

    // 按钮点击事件
    btn.addEventListener('click', (event) => {
        const rect = btn.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const closeAreaWidth = 15;
        const closeAreaHeight = 15;

        if (
            clickX > btn.offsetWidth - closeAreaWidth &&
            clickY < closeAreaHeight
        ) {
            event.stopPropagation();
            btn.style.display = 'none';
            return;
        }

        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    });

    // 文本输入事件
    textarea.addEventListener('input', (e) => {
        debouncedSave(e.target.value);
    });

    // 页面卸载前强制保存
    window.addEventListener('beforeunload', () => {
        if (!isSyncing) {
            saveNote(textarea.value);
        }
    });

    // 初始化
    init();
})();