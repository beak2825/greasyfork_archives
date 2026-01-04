// ==UserScript==
// @name         Mastodon Threads Ultimate (Home Fix)
// @namespace    http://tampermonkey.net/
// @version      1.29.1
// @description  修正域名跳转问题。自适应 threads.com 或 threads.net。
// @author       Gemini
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560329/Mastodon%20Threads%20Ultimate%20%28Home%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560329/Mastodon%20Threads%20Ultimate%20%28Home%20Fix%29.meta.js
// ==/UserScript==
// @license MIT
(function() {
    'use strict';

    const currentHost = window.location.hostname;
    const currentPath = window.location.pathname;

    // --- 核心跳转逻辑：动态获取当前域名 ---
    function handleFollow(handle) {
        let finalID = handle.trim();
        if (!finalID.startsWith('@')) finalID = `@${finalID}`;
        navigator.clipboard.writeText(finalID);

        // 动态识别当前在用的是 .com 还是 .net
        // 如果是在 Mastodon 触发，默认跳转到 threads.net（或你可以改成 threads.com）
        // 这里我们优先尝试 threads.com，因为你提到家中用的是这个
        const targetHost = "www.threads.com";
        window.open(`https://${targetHost}/fediverse_profile/${finalID}`, '_blank');
    }

    // --- 逻辑 A：Threads 端逻辑 ---
    if (currentHost.includes('threads.net') || currentHost.includes('threads.com')) {
        if (currentPath.includes('fediverse_profile')) {
            const targetHandle = currentPath.split('/').pop();
            const check = () => {
                if (document.body && (document.body.innerText.includes("迷路者") || document.body.innerText.includes("丢失"))) {
                    // 跳转时保持当前域名
                    window.location.replace(`https://${currentHost}/search?auto_activate=${encodeURIComponent(targetHandle)}`);
                }
            };
            setInterval(check, 1000);
        }
        if (currentPath.includes('/search')) {
            const urlParams = new URLSearchParams(window.location.search);
            const activateTarget = urlParams.get('auto_activate');
            if (activateTarget) {
                window.onload = async () => {
                    let input = null;
                    for(let i=0; i<30; i++) {
                        input = document.querySelector('input[placeholder*="搜索"], input[aria-label*="搜索"]');
                        if(input) break;
                        await new Promise(r => setTimeout(r, 400));
                    }
                    if(input) {
                        input.focus();
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        setter.call(input, activateTarget);
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        setInterval(() => {
                            const items = document.querySelectorAll('div[role="link"], div[tabindex="0"]');
                            items.forEach(item => {
                                if(item.innerText.includes(activateTarget)) {
                                    item.click();
                                    // 激活成功后跳转回个人主页，保持当前域名
                                    setTimeout(() => { window.location.href = `https://${currentHost}/fediverse_profile/${activateTarget}`; }, 6000);
                                }
                            });
                        }, 1000);
                    }
                };
            }
        }
        return;
    }

    // --- 逻辑 B：Mastodon 端逻辑 (1.29 版原封不动) ---
    function inject() {
        const isProfilePage = currentPath.startsWith('/@') && !['/@home','/@notifications','/@explore'].some(p => currentPath.includes(p));
        if (isProfilePage) {
            const profileHeader = document.querySelector('.account__header__tabs__name h1 small');
            if (profileHeader && !document.getElementById('threads-hero-inline-btn')) {
                let user = currentPath.split('/')[1].replace('@', '');
                if (!user.includes('@')) user = `${user}@${currentHost}`;
                const heroBtn = document.createElement('span');
                heroBtn.id = 'threads-hero-inline-btn';
                heroBtn.innerHTML = 'Threads 关注';
                heroBtn.style = "cursor:pointer; background:#000; color:#fff !important; padding:2px 8px; border-radius:4px; font-size:13px; font-weight:600; margin-left:8px; display:inline-block; vertical-align:middle; border:1px solid #444; line-height:1.4;";
                heroBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); handleFollow(user); };
                profileHeader.appendChild(heroBtn);
            }
        }
        const accounts = document.querySelectorAll('.status__display-name .display-name__account, .account__display-name small');
        accounts.forEach(acc => {
            if (acc.closest('.account__header__tabs__name') || acc.querySelector('.threads-mini-btn')) return;
            let h = acc.innerText.trim().replace('@', '');
            if (!h || !h.includes('@')) h = `${h}@${currentHost}`;
            const mini = document.createElement('span');
            mini.className = 'threads-mini-btn';
            mini.innerHTML = ' Threads 关注';
            mini.style = "cursor:pointer; font-size:10px; background:#000; color:#fff !important; padding:2px 5px; border-radius:4px; margin-left:5px; vertical-align:middle; opacity:0.8;";
            mini.onclick = (e) => { e.preventDefault(); e.stopPropagation(); handleFollow(h); };
            acc.appendChild(mini);
        });
    }
    setInterval(inject, 1500);
})();