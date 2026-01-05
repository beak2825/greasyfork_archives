// ==UserScript==
// @name         mn下载助手 Mac适配版
// @namespace    111111
// @version      6.4.1
// @description  适配 macOS，快捷键改为 Cmd+Shift+S，修复下载拦截问题
// @author       rain
// @license      MIT
// @match        *://*.monster-nest.com/*
// @icon         https://monster-nest.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561487/mn%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20Mac%E9%80%82%E9%85%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561487/mn%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20Mac%E9%80%82%E9%85%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断是否为 Mac 系统
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    const config = {
        sel: '.t_f, .t_msgfont, .postmessage',
        sub: '#thread_subject',
        // 逻辑修改：在 Mac 上匹配 Cmd，在 Win 上保持 Ctrl
        hotkey: { key: 's', modKey: true, shift: true },
        ocrUrl: 'http://api.ttshitu.com/predict',
        ocrType: 3,
    };

    const patterns = {
        hidden: /display:\s*none|visibility:\s*hidden|font-size:\s*0(?![0-9.])|color:\s*transparent/i,
        badClass: /\b(jammer|y)\b/,
        breaks: /(\n\s*){3,}/g,
        badFileChars: /[\\/:*?"<>|]/g
    };

    const css = `
        #dl-clean-btn {
            position: fixed; bottom: 40px; right: 30px; z-index: 999999;
            height: 25px; width: 25px; border-radius: 50%;
            background: #28a745; color: #fff; border: none; cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2); opacity: 0.3;
            transition: all 0.2s ease-out; overflow: hidden;
            display: flex; align-items: center; justify-content: center;
            font-family: system-ui, sans-serif; font-size: 12px;
        }
        #dl-clean-btn:hover { width: 90px; opacity: 1; border-radius: 15px; box-shadow: 0 3px 8px rgba(40,167,69,0.4); }
        #dl-clean-btn span.txt { display: none; margin-left: 5px; white-space: nowrap; font-weight: bold; }
        #dl-clean-btn:hover span.txt { display: inline-block; }
        #ip_notice, .ip_notice, .notice_ip, #pt_ip, .ip-change-alert { display: none !important; }
        * { -webkit-user-select: text !important; user-select: text !important; }
    `;

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function purify(node) {
        if (!node) return;
        const walker = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
        let el;
        while (el = walker.nextNode()) {
            const s = el.getAttribute('style');
            if ((s && patterns.hidden.test(s)) ||
                patterns.badClass.test(el.className) ||
                (el.style.textIndent && parseInt(el.style.textIndent) < -500)) {
                el.remove();
            }
        }
    }

    function getTitle() {
        const el = document.querySelector(config.sub);
        return (el ? el.innerText : document.title).replace(patterns.badFileChars, '_').trim();
    }

    function saveText() {
        const src = document.querySelector(config.sel);
        if (!src) return alert('未找到正文内容，无法下载');

        const clone = src.cloneNode(true);
        purify(clone);

        clone.querySelectorAll('br, p, div').forEach(el => {
            if (el.tagName.toLowerCase() === 'br') {
                el.replaceWith('\n');
            } else {
                el.append('\n');
            }
        });

        const cleanTxt = clone.innerText
            .replace(/\r\n|\r/g, '\n')
            .replace(patterns.breaks, '\n\n')
            .trim();

        const format = GM_getValue('dl_format', 'txt');
        const fileName = getTitle();
        const meta = `标题：${fileName}\n地址：${location.href}\n时间：${new Date().toLocaleString()}\n${'-'.repeat(20)}\n\n`;

        let blob, fullContent, ext;
        if (format === 'doc') {
            const htmlBody = (meta + cleanTxt).replace(/\n/g, '<br>');
            fullContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>${htmlBody}</body></html>`;
            blob = new Blob([fullContent], { type: 'application/msword;charset=utf-8' });
            ext = '.doc';
        } else {
            fullContent = meta + cleanTxt;
            blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
            ext = '.txt';
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // --- Mac 兼容性修复逻辑 ---
        a.style.display = 'none';
        a.href = url;
        a.download = fileName + ext;
        document.body.appendChild(a); // 必须挂载到 DOM 树
        a.click();                    // 触发点击
        setTimeout(() => {
            document.body.removeChild(a); // 触发后移除
            URL.revokeObjectURL(url);
        }, 100);
    }

    // === UI 管理 ===
    function createBtn() {
        if (!GM_getValue('show_btn', true) || !document.querySelector(config.sel) || document.getElementById('dl-clean-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'dl-clean-btn';
        btn.innerHTML = '📥<span class="txt">纯净下载</span>';
        btn.title = isMac ? '快捷键: Cmd+Shift+S' : '快捷键: Ctrl+Shift+S';
        btn.onclick = e => { e.stopPropagation(); saveText(); };
        document.body.appendChild(btn);
        document.querySelectorAll(config.sel).forEach(purify);
    }

    // === 事件监听 (已适配双平台) ===
    document.addEventListener('keydown', e => {
        const k = config.hotkey;
        // 关键修复：Mac 检查 metaKey (Cmd)，Win 检查 ctrlKey (Ctrl)
        const modPressed = isMac ? e.metaKey : e.ctrlKey;

        if (e.key.toLowerCase() === k.key && modPressed && e.shiftKey === k.shift) {
            e.preventDefault();
            saveText();
        }
    });

    // 保持原有的 OCR 和 菜单逻辑不变
    addStyles();
    GM_registerMenuCommand("📥 下载当前文章", saveText);
    GM_registerMenuCommand("🔄 切换格式 (TXT/DOC)", () => {
        const current = GM_getValue('dl_format', 'txt');
        const next = current === 'txt' ? 'doc' : 'txt';
        GM_setValue('dl_format', next);
        alert(`已切换下载格式为: ${next.toUpperCase()}`);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBtn);
    } else {
        createBtn();
    }

    // 原有的解禁逻辑
    ['copy', 'cut', 'contextmenu', 'selectstart'].forEach(e =>
        window.addEventListener(e, ev => ev.stopPropagation(), true)
    );
})();