// ==UserScript==
// @name         百度网盘文件直链解析助手尊享版
// @namespace    https://www.qyccc.com/
// @version      0.20
// @description  百度网盘免会员文件直链解析满速下载。脚本会将用户复制的百度网盘分享链接发送至解析服务以自动填充，仅用于实现直链解析功能，不会保存或收集任何用户数据，用户需手动点击“同意”后才会继续下一步操作。
// @author       清语尘
// @match        *://pan.baidu.com/*
// @icon         https://android-artworks.25pp.com/fs08/2025/09/05/3/110_a434d925c0416fd0188b2d7fea68d7fb_con.png
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @antifeature  tracking  仅用于将用户复制的链接发送到解析服务进行自动填充，不做任何形式的记录或统计
// @downloadURL https://update.greasyfork.org/scripts/552029/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E7%9B%B4%E9%93%BE%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B%E5%B0%8A%E4%BA%AB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552029/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E7%9B%B4%E9%93%BE%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B%E5%B0%8A%E4%BA%AB%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_IFRAME_ORIGIN = 'https://p.pupp.top';
    const TARGET_IFRAME_URL = `${TARGET_IFRAME_ORIGIN}/user/parse`;

    GM_addStyle(`
        #tm_proxy_overlay {
            position:fixed;inset:0;
            background:rgba(0,0,0,0.45);
            z-index:2147483646;
            display:flex;
            align-items:center;
            justify-content:center;
        }
        #tm_proxy_modal {
            width:92%;
            max-width:1100px;
            height:90vh;
            background:#fff;
            border-radius:10px;
            display:flex;
            flex-direction:column;
            box-shadow:0 4px 20px rgba(0,0,0,0.2);
            overflow:hidden;
        }
        #tm_modal_header {
            height:48px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:0 16px;
            background:#f7f7f7;
            border-bottom:1px solid #eee;
            font-weight:600;
            color:#333;
        }
        #tm_modal_content {
            flex:1;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#fff;
            overflow:hidden;
        }
        #tm_modal_iframe {
            width:100%;
            height:100%;
            border:0;
            display:none;
        }
        .tm_btn {
            padding:8px 16px;
            border-radius:6px;
            cursor:pointer;
            font-size:13px;
        }
        #tm_agree_btn { background:#2d8cf0; color:#fff; border:none; }
        #tm_decline_btn, #tm_close_btn { background:#fff; border:1px solid #ccc; color:#555; }
        #tm_decline_btn:hover, #tm_close_btn:hover { background:#f3f3f3; }
        #tm_agree_btn:hover { background:#1b6ed1; }
        #tm_modal_footer {
            height:46px;
            display:flex;
            align-items:center;
            justify-content:flex-end;
            padding:0 16px;
            border-top:1px solid #eee;
            background:#fafafa;
        }
    `);

    function looksLikePanShare(text) {
        return text && /https?:\/\/pan\.baidu\.com\/s\/[A-Za-z0-9_-]+/.test(text);
    }

    function showModalWithIframe(link) {
        document.getElementById('tm_proxy_overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'tm_proxy_overlay';

        const modal = document.createElement('div');
        modal.id = 'tm_proxy_modal';

        const header = document.createElement('div');
        header.id = 'tm_modal_header';
        header.innerHTML = `
            <div>文件直链解析助手尊享版</div>
            <button id="tm_close_btn" class="tm_btn">关闭 ✕</button>
        `;

        const content = document.createElement('div');
        content.id = 'tm_modal_content';

        const privacyCard = document.createElement('div');
        privacyCard.innerHTML = `
            <div style="
                background:#fff;
                border:1px solid #e0e0e0;
                border-radius:10px;
                box-shadow:0 2px 10px rgba(0,0,0,0.05);
                max-width:680px;
                padding:28px 24px;
                color:#333;
                line-height:1.6;
                text-align:center;
            ">
                <div style="font-size:16px;font-weight:600;margin-bottom:10px;color:#2d8cf0;">隐私与使用说明</div>
                <div style="font-size:13px;color:#555;">
                    本脚本将在您点击 <strong>「同意并继续」</strong> 后，
                    将复制的百度网盘分享链接发送至 <strong>解析服务</strong>，
                    仅用于自动填充操作，填充完毕即销毁，<strong>服务不会保存、记录或传播任何用户信息。</strong>
                </div>
                <div style="margin-top:20px;display:flex;justify-content:center;gap:14px;">
                    <button id="tm_decline_btn" class="tm_btn">取消</button>
                    <button id="tm_agree_btn" class="tm_btn">同意并继续</button>
                </div>
            </div>
        `;

        const iframe = document.createElement('iframe');
        iframe.id = 'tm_modal_iframe';
        iframe.src = TARGET_IFRAME_URL;
        iframe.sandbox = 'allow-scripts allow-forms allow-same-origin allow-popups';

        content.appendChild(privacyCard);
        content.appendChild(iframe);

        const footer = document.createElement('div');
        footer.id = 'tm_modal_footer';
        footer.innerHTML = `<div style="font-size:12px;color:#888;">公众号「干货老周」</div>`;

        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('tm_close_btn').onclick = () => overlay.remove();
        document.getElementById('tm_decline_btn').onclick = () => overlay.remove();

        // 同意后直接进入解析界面
        document.getElementById('tm_agree_btn').onclick = () => {
            privacyCard.remove();
            iframe.style.display = 'block';
            postLink();
        };

        // 链接传递逻辑
        function postLink() {
            const iframeEl = document.getElementById('tm_modal_iframe');
            if (!iframeEl) return;

            // 最大重试次数 & 间隔
            const INTERVAL = 500;
            const MAX_ATTEMPTS = 40;

            let attempts = 0;
            let timer = null;

            // 发送填充消息
            function trySend() {
                try {
                    iframeEl.contentWindow.postMessage({ cmd: 'fill_link', link }, TARGET_IFRAME_ORIGIN);
                } catch (e) {}
            }

            // 启动周期性发送
            function startSending() {
                if (timer) return;
                trySend();
                timer = setInterval(() => {
                    attempts++;
                    if (attempts >= MAX_ATTEMPTS) {
                        clearInterval(timer);
                        timer = null;
                        return;
                    }
                    trySend();
                }, INTERVAL);
            }

            // 停止并清理
            function stopSending() {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }

            // 监听来自 iframe 的回报消息
            function onMessageFromIframe(e) {
                if (e.origin !== TARGET_IFRAME_ORIGIN) return;
                const d = e.data || {};
                if (d.cmd === 'link_filled') {
                    stopSending();
                    window.removeEventListener('message', onMessageFromIframe);
                } else if (d.cmd === 'code_verified') {
                    try {
                        iframeEl.src = iframeEl.src;
                    } catch (err) {}
                    startSending();
                }
            }

            window.addEventListener('message', onMessageFromIframe);

            // 当 iframe 真正 load 后开始发送
            iframeEl.addEventListener('load', () => {
                setTimeout(() => startSending(), 200);
            });
            setTimeout(() => { if (!timer) startSending(); }, 700);
        }
    }

    function handleShareLink(rawText) {
        const shareLink = rawText.trim();
        if (!looksLikePanShare(shareLink)) return;
        showModalWithIframe(shareLink);
    }

    // 监听复制动作
    document.addEventListener('copy', e => {
        const copied = e.clipboardData?.getData('text/plain') || window.getSelection()?.toString() || '';
        if (looksLikePanShare(copied)) handleShareLink(copied);
    }, true);

    // 验证码通过后刷新
    window.addEventListener('message', e => {
        if (e.data?.cmd === 'code_verified') {
            const iframe = document.getElementById('tm_modal_iframe');
            if (iframe) iframe.src = iframe.src;
        }
    });

    // 页面动态检测
    let triggered = false;
    const observer = new MutationObserver(muts => {
        if (triggered) return;
        for (const m of muts) {
            if (!m.addedNodes) continue;
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                const text = (node.textContent || '').trim();
                if (looksLikePanShare(text)) { triggered = true; handleShareLink(text); return; }
                const inputs = node.querySelectorAll ? node.querySelectorAll('input,textarea,div,span') : [];
                for (const el of inputs) {
                    const v = (el.value || el.textContent || '').trim();
                    if (looksLikePanShare(v)) { triggered = true; handleShareLink(v); return; }
                }
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });

})();