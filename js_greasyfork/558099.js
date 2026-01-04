// ==UserScript==
// @name         Pinterest Quick Pin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用Ctrl+V自动从剪贴板中上传Pin图
// @author       Tz
// @license      MIT
// @match        https://*.pinterest.com/*
// @match        https://pinterest.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinterest.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558099/Pinterest%20Quick%20Pin.user.js
// @updateURL https://update.greasyfork.org/scripts/558099/Pinterest%20Quick%20Pin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置常量 ===
    const CFG = {
        uploadUrl: 'https://www.pinterest.com/pin-creation-tool/',
        key: 'gemini_pin_cache',
        width: '1500px' // 上传窗口宽度
    };

    // === 通用工具函数 ===
    const setStyle = (el, styles) => Object.assign(el.style, styles);

    // 黑白纯文本提示框
    const showToast = (msg) => {
        let t = document.getElementById('g-toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'g-toast';
            setStyle(t, {
                position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '8px 20px',
                borderRadius: '4px', zIndex: '9999999', fontSize: '14px', pointerEvents: 'none',
                transition: 'opacity 0.2s', opacity: '0', fontFamily: 'sans-serif'
            });
            document.body.appendChild(t);
        }
        t.innerText = msg;
        t.style.opacity = '1';
        clearTimeout(t.timer);
        t.timer = setTimeout(() => { t.style.opacity = '0'; }, 2000);
    };

    // =================================================================
    // 逻辑 A：主页面 (监听 Ctrl+V)
    // =================================================================
    if (window.top === window.self) {
        let modal, iframe;

        // 1. 状态指示灯 (左下角小灰点)
        const dot = document.createElement('div');
        setStyle(dot, {
            position: 'fixed', bottom: '10px', left: '10px', width: '6px', height: '6px',
            borderRadius: '50%', background: '#999', zIndex: '9999', opacity: '0.4', pointerEvents: 'none'
        });
        document.body.appendChild(dot);

        // 2. 弹出上传窗口
        const openModal = () => {
            if (!modal) {
                // 背景遮罩
                modal = document.createElement('div');
                setStyle(modal, {
                    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.75)', zIndex: '999999', display: 'flex',
                    justifyContent: 'center', alignItems: 'center'
                });

                // 容器
                const box = document.createElement('div');
                setStyle(box, {
                    width: CFG.width, maxWidth: '98vw', height: '92vh', background: '#fff',
                    borderRadius: '20px', overflow: 'hidden', position: 'relative'
                });

                // Iframe
                iframe = document.createElement('iframe');
                iframe.src = CFG.uploadUrl;
                setStyle(iframe, { width: '100%', height: '100%', border: 'none' });

                box.appendChild(iframe);
                modal.appendChild(box);
                document.body.appendChild(modal);

                // 点击背景关闭
                modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
            }
            modal.style.display = 'flex';
            // 强制刷新 iframe 以触发自动填入逻辑
            if (iframe.contentWindow.location.href !== 'about:blank') iframe.contentWindow.location.reload();
        };

        // 3. 监听粘贴事件
        window.addEventListener('paste', (e) => {
            const tag = document.activeElement.tagName;
            if (['INPUT', 'TEXTAREA'].includes(tag) || document.activeElement.isContentEditable) return;

            const item = Array.from(e.clipboardData.items).find(i => i.kind === 'file' && i.type.startsWith('image/'));

            if (item) {
                e.preventDefault();
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        localStorage.setItem(CFG.key, reader.result);
                        openModal(); // 打开弹窗
                    } catch (err) { showToast('图片过大，无法缓存'); }
                };
                reader.readAsDataURL(item.getAsFile());
            } else {
                showToast('剪贴板中无图片');
            }
        });

        // 4. 监听 ESC 键退出
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal) modal.style.display = 'none';
        });
    }

    // =================================================================
    // 逻辑 B：Iframe 内部 (自动填入)
    // =================================================================
    else if (window.location.href.includes('pin-creation-tool') || window.location.href.includes('pin-builder')) {

        //隐藏滚动条
        const style = document.createElement('style');
        style.innerHTML = `body { overflow: hidden !important; }`; // 强制隐藏 body 的滚动条
        document.head.appendChild(style);

        //轮询检测并填入
        const timer = setInterval(() => {
            const b64 = localStorage.getItem(CFG.key);
            const input = document.querySelector('input[type="file"]');

            if (b64 && input) {
                clearInterval(timer);
                // Base64 转 File
                const arr = b64.split(','), bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
                const file = new File([u8arr], "pasted_image.png", { type: arr[0].match(/:(.*?);/)[1] });

                // 触发上传
                const dt = new DataTransfer(); dt.items.add(file);
                input.files = dt.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));

                localStorage.removeItem(CFG.key); // 清除缓存
                showToast('图片已自动填入');
            }
        }, 300);
    }
})();