// ==UserScript==
// @name         怪物之巢 (monster-nest) 下载助手
// @namespace    111111
// @version      6.4.1
// @description  AI生成的脚本，仅用于下载自己的文章
// @author       rain
// @license      MIT
// @match        *://*.monster-nest.com/*
// @icon         https://monster-nest.com/favicon.ico
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561017/%E6%80%AA%E7%89%A9%E4%B9%8B%E5%B7%A2%20%28monster-nest%29%20%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561017/%E6%80%AA%E7%89%A9%E4%B9%8B%E5%B7%A2%20%28monster-nest%29%20%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        sel: '.t_f, .t_msgfont, .postmessage',
        sub: '#thread_subject',
        hotkey: { key: 's', ctrl: true, shift: true },
        // 图鉴 API 配置
        ocrUrl: 'http://api.ttshitu.com/predict',
        ocrType: 3, // Discuz 推荐类型 (数英混合)
    };

    const patterns = {
        hidden: /display:\s*none|visibility:\s*hidden|font-size:\s*0(?![0-9.])|color:\s*transparent/i,
        badClass: /\b(jammer|y)\b/,
        breaks: /(\n\s*){3,}/g,
        badFileChars: /[\\/:*?"<>|]/g
    };

    const css = `
        /* 下载按钮 */
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

        /* 屏蔽 IP 弹窗 */
        #ip_notice, .ip_notice, .notice_ip, #pt_ip, .ip-change-alert { display: none !important; }
        * { -webkit-user-select: text !important; user-select: text !important; }
    `;

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // === 内容下载逻辑 ===
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
            fullContent = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>${fileName}</title></head><body><div>${htmlBody}</div></body></html>`;
            blob = new Blob([fullContent], { type: 'application/msword;charset=utf-8' });
            ext = '.doc';
        } else {
            fullContent = meta + cleanTxt;
            blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
            ext = '.txt';
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName + ext;
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // === 验证码 API 逻辑 ===

    function setOcrAccount() {
        const current = GM_getValue('ocr_user', '');
        const u = prompt(`请输入图鉴(Ttshitu) 用户名:\n(当前: ${current || '未设置'})`, current);
        if (u === null) return;

        const p = prompt("请输入图鉴(Ttshitu) 密码:", GM_getValue('ocr_pass', ''));
        if (u && p) {
            GM_setValue('ocr_user', u);
            GM_setValue('ocr_pass', p);
            alert("✅ 账号密码已保存！");
        }
    }

    function imgToBase64(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, "");
    }

    // 核心：触发识别
    function triggerSolve(inputElement) {
        if (inputElement.dataset.isSolving === 'true') return;

        const user = GM_getValue('ocr_user', '');
        const pass = GM_getValue('ocr_pass', '');

        if (!user || !pass) {
            if (!window.hasWarnedAccount) {
                if(confirm("⚠️ 尚未设置打码账号！\n是否现在前往设置？")) setOcrAccount();
                window.hasWarnedAccount = true;
            }
            return;
        }

        const img = document.querySelector('img[src*="mod=seccode"], .vm img, #seccodeimage');
        if (!img) return;

        // 绑定监听器，实现“换一张后自动识别”
        if (!img.dataset.hasObserver) {
            const observer = new MutationObserver(() => {
                // 图片变动后，稍微等一下加载，然后再次触发
                setTimeout(() => triggerSolve(inputElement), 500);
            });
            observer.observe(img, { attributes: true, attributeFilter: ['src'] });
            img.dataset.hasObserver = 'true';
        }

        inputElement.dataset.isSolving = 'true';
        inputElement.placeholder = '识别中...';
        // V1.4.1 去除背景色修改

        const base64Img = imgToBase64(img);

        GM_xmlhttpRequest({
            method: "POST",
            url: config.ocrUrl,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                username: user,
                password: pass,
                typeid: config.ocrType,
                image: base64Img
            }),
            onload: function(response) {
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.success) {
                        inputElement.value = res.data.result;

                        // V1.4.1 核心修复：全套模拟事件，触发后台校验
                        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                        inputElement.dispatchEvent(new Event('blur', { bubbles: true })); // 模拟失去焦点
                        inputElement.blur(); // 物理失去焦点

                        // 自动提交
                        const submitBtn = inputElement.parentElement.querySelector('button, .pn');
                        if (submitBtn) submitBtn.click();

                    } else {
                        console.log("识别失败: " + res.message);
                        inputElement.placeholder = '识别失败';
                    }
                } catch (e) {
                    console.log("接口错误");
                }
                setTimeout(() => { inputElement.dataset.isSolving = 'false'; }, 1000);
            },
            onerror: function() {
                inputElement.dataset.isSolving = 'false';
            }
        });
    }

    // === UI 管理 ===
    function toggleBtnState() {
        const visible = GM_getValue('show_btn', true);
        GM_setValue('show_btn', !visible);
        if (visible) {
            document.getElementById('dl-clean-btn')?.remove();
        } else {
            createBtn();
        }
    }

    function toggleFormat() {
        const current = GM_getValue('dl_format', 'txt');
        const next = current === 'txt' ? 'doc' : 'txt';
        GM_setValue('dl_format', next);
        alert(`已切换下载格式为: ${next.toUpperCase()}`);
    }

    function createBtn() {
        if (!GM_getValue('show_btn', true) || !document.querySelector(config.sel) || document.getElementById('dl-clean-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'dl-clean-btn';
        btn.innerHTML = '📥<span class="txt">纯净下载</span>';
        btn.title = '快捷键: Ctrl+Shift+S';
        btn.onclick = e => { e.stopPropagation(); saveText(); };
        document.body.appendChild(btn);

        document.querySelectorAll(config.sel).forEach(purify);
    }

    // === 事件监听 ===

    // 全局监听输入框点击/聚焦
    document.addEventListener('focus', (e) => {
        if (e.target && e.target.name && e.target.name.indexOf('seccodeverify') !== -1) {
            triggerSolve(e.target);
        }
    }, true);

    document.addEventListener('click', (e) => {
        if (e.target && e.target.name && e.target.name.indexOf('seccodeverify') !== -1) {
            triggerSolve(e.target);
        }
    }, true);

    addStyles();

    GM_registerMenuCommand("📥 下载当前文章", saveText);
    GM_registerMenuCommand("🔄 切换格式 (TXT/DOC)", toggleFormat);
    GM_registerMenuCommand("🔘 显示/隐藏下载按钮", toggleBtnState);
    GM_registerMenuCommand("⚙️ 设置图鉴账号(验证码识别)", setOcrAccount);

    ['copy', 'cut', 'contextmenu', 'selectstart'].forEach(e =>
        window.addEventListener(e, ev => ev.stopPropagation(), true)
    );

    document.addEventListener('keydown', e => {
        const k = config.hotkey;
        if (e.key.toLowerCase() === k.key && e.ctrlKey === k.ctrl && e.shiftKey === k.shift) {
            e.preventDefault();
            saveText();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBtn);
    } else {
        createBtn();
    }
})();