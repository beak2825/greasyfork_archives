// ==UserScript==
// @name         ChromeXt脚本菜单提取器
// @namespace    ChromeXt.GodMode
// @version      1.2
// @description  通过劫持Array原型链，提取ChromeXt脚本菜单，会在页面右侧生成一个"CX"的悬浮图标开启。
// @author       Aloazny
// @match        *://*/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAT7SURBVGiB1ZpRaBxFAIa/m8sl1166SWzTJJcNHkRDuYd4wYoFQeJDT6Eq0UCqKD4cDfq4L74ptA+CYB7yIlQKQrVijDScUKtYwQipLYiYfSlVUqK2l5ombW9N7kxIcuvD3tHLNbczm7s08YPhjt1/Zv6Z2Z2ZnRkfmycCPAY8nv99GNgPtEnizQBzwJ+ACfyS//2jAi9K1AOvAGPAbcCucrgNJIHXgVA1jR8CzgDZLTBdLmSBT/N5b5oAMATkHqDx0pADPsh78cRe4OI2Gi8NF/OelOgBpneA6dIwDRyQmd8FXNoBZsuFn/Iey/L+DjApC8eLDfuK/vcAPwN+txK6EY/Hicfj6LqOpmlEo1FWjh1lLayzGqgl7Q/wzcwt3jv37WazAFjGGXd+Ky3ASeBNr6npuo5hGMTjcTRNu+/+yrGj913z7Q7xd6vOq2fPcf32Ha9ZAnwEvAX3ChAGppA8X6UYhkEikdjQeIGNClDAtzuEua+N/o8/85ItwL/Ao0BK5C+8iAfzmqZx/vx5DMNwNS/Dzmbo/muKq2/007H3IS9RdwEvABQK0KcaMxqNMjExQTQa9ZKhK/6ZG/zwVIy+gz1eovWBUwABPKESQ9M0RkZGKqr1ctjZDEPhJi8tcRAQAugGpLG20nwBO5vhwpFnVOV7gW6B4oQpkUhU9bEph3/mBmOJ11TlMYHC8KzrOolEoiJjXuiev6n6KB0QQLtMVWlv4xU7m+Hzl4+oSDtrgA6ZKh6PezKgaRqhUIja2lq4cJnla79jjX3BP999rZxG62xKRdYhgEY3RbkRdiOEELS1tdHU1OSYz1PX2cX+t9+l4+QniPo9SmnZ2QzvPP+cTNYogCY3hZfab2lpWWe8lLrOLtqHPlRO7+nWZpmkSQB1bgpd15Uy0zTN1XyBus4utGeVnm/CuRVpcgIIyoypEAqpf4c3vFR+flRMzaq0AEFpC6j2/Sq1X6Cus0tJ55+5IU3Kh/ORUJZwOKyUWSql1Gt4xufzud4XOB8IZVlZkTYjAFeuXFE2pYppmjLJsgCW3BS5XE4ps9HRUTVXHkin0zLJkrQF1tbWlDI7depU1VthcnJSJlkWwF03xdKSawOto7+/v6qFGB8fl0nu+oDLwJNuqtbWVoQQbpJ1DAwMMDg4WNHs1bIsGhtdJwkAPwrgukzlpRXAeR8OHz5Me7t0nliWZDKpIpsVwDWZyrIs5Ze5GliWhWEYKtJpAVyVqWzbJpPJVGxMleHhYZUeCOCqD4gBv6qom5ubCQS8LRR7HeBM0yQWi6nKe3w4g1kGyZwInFGxpaXF0wvtpQCWZRGJRFRr/w7QLHDW4L9XiWHbNvPz81vyPliWRW9vr6p5cHrPXKEqlT+VVldXmZ2dVZ5iqGCaJpFIRGXgKuZLuLewdRbJlKIY27aZm5tjYWGhotawLIsTJ04Qi8W81Dw4Xr8CqMlfmANO43Fxd2FhgcXFRRoaGggGg8rvhmVZJJNJDMPwarzAafIziOK5aifOAu+mCQaDBINB/H4/QggCgQCpVArTNEmn00xOTjI+Pq46SLnxCGXGr+Ns/waGpw2OUoI42zjbbbJcuIRCd78P51HabrOlYSrvTYn/9TZrgQDOJvN2b3QPsYmN7mIO4Wz7P+ijBmeo8KhBKXtwDmIk2brDHmM4B0rqVU25r1m4s9Fxm2acDUM3bgK3qNJxm/8A2JAp2ALrPTkAAAAASUVORK5CYII=
// @homepageURL  https://scriptcat.org/zh-CN/users/157252
// @grant        none
// @license     GPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564114/ChromeXt%E8%84%9A%E6%9C%AC%E8%8F%9C%E5%8D%95%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/564114/ChromeXt%E8%84%9A%E6%9C%AC%E8%8F%9C%E5%8D%95%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let captured = new Set();
    const methods = ['push', 'splice', 'fill', 'unshift'];
    methods.forEach(method => {
        const original = Array.prototype[method];
        Array.prototype[method] = function(...args) {
            const result = original.apply(this, args);
            args.forEach(arg => {
                if (arg && typeof arg === 'object' && 'title' in arg && 'listener' in arg) {
                    captured.add(arg);
                }
            });
            return result;
        };
    });

    function deepScan() {
        Object.getOwnPropertySymbols(window).forEach(sym => {
            try {
                const val = window[sym];
                if (val && val.commands && Array.isArray(val.commands)) {
                    val.commands.forEach(cmd => captured.add(cmd));
                }
            } catch (e) {}
        });
        return Array.from(captured);
    }

    const initUI = () => {
        if (document.getElementById('cx-v5-container')) return;
        const host = document.createElement('div');
        host.id = 'cx-v5-container';
        host.style = 'position:fixed;top:50%;right:0;z-index:2147483647;user-select:none;';
        const shadow = host.attachShadow({mode: 'open'});
        document.body.appendChild(host);
        const style = document.createElement('style');
        style.textContent = `
            :host {
                --cx-bg: rgba(255, 255, 255, 0.85);
                --cx-item-bg: rgba(249, 249, 249, 0.7);
                --cx-text: #1a1a1a;
                --cx-accent: #0078d4;
                --cx-border: rgba(0, 0, 0, 0.1);
            }
            @media (prefers-color-scheme: dark) {
                :host {
                    --cx-bg: rgba(32, 32, 32, 0.85);
                    --cx-item-bg: rgba(45, 45, 45, 0.7);
                    --cx-text: #ffffff;
                    --cx-accent: #60cdff;
                    --cx-border: rgba(255, 255, 255, 0.1);
                }
            }
            #btn {
                position: absolute; right: 0; transform: translateY(-50%);
                width: 32px; height: 50px; background: var(--cx-accent);
                color: #fff; border-radius: 12px 0 0 12px; display: flex;
                align-items: center; justify-content: center; cursor: pointer;
                font: bold 12px "Segoe UI", system-ui; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: width 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
                backdrop-filter: blur(8px); opacity: 0.9;
            }
            #btn:hover { width: 45px; opacity: 1; }
            #btn:active { transform: translateY(-50%) scale(0.9); }
            .panel-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.4); display: flex; align-items: center;
                justify-content: center; backdrop-filter: blur(5px);
                animation: fadeIn 0.2s ease;
            }
            .content {
                width: 85%; max-width: 420px; max-height: 70vh; 
                background: var(--cx-bg); border: 1px solid var(--cx-border); 
                border-radius: 12px; padding: 16px; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                backdrop-filter: blur(25px) saturate(180%);
                display: grid; grid-template-columns: 1fr; gap: 8px;
                overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none;
                animation: slideUp 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
            }
            .content::-webkit-scrollbar { display: none; }
            @media (min-width: 768px) {
                .content { max-width: 600px; grid-template-columns: 1fr 1fr; }
            }
            .item {
                padding: 14px; background: var(--cx-item-bg); color: var(--cx-text);
                border-radius: 8px; font: 500 14px "Segoe UI", system-ui;
                text-align: center; cursor: pointer; border: 1px solid var(--cx-border);
                transition: all 0.15s; display: flex; align-items: center; justify-content: center;
            }
            .item:hover { background: var(--cx-accent); color: #fff; border-color: transparent; transform: translateY(-2px); }
            .item:active { transform: scale(0.96); }
            .close-btn {
                grid-column: 1 / -1; position: sticky; bottom: -16px; 
                margin: 8px -16px -16px -16px; padding: 12px;
                background: var(--cx-bg); border-top: 1px solid var(--cx-border);
                text-align: center; color: var(--cx-accent); font-weight: bold;
                font-size: 13px; cursor: pointer; border-radius: 0 0 12px 12px;
            }
            @keyframes fadeIn { from { opacity: 0; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } }
        `;
        shadow.appendChild(style);
        const btn = document.createElement('div');
        btn.id = 'btn';
        btn.textContent = 'CX';
        shadow.appendChild(btn);
        let isDragging = false, startY, startTop;
        btn.ontouchstart = (e) => {
            isDragging = true;
            startY = e.touches[0].clientY;
            startTop = host.offsetTop;
            btn.style.transition = 'none';
        };
        window.ontouchmove = (e) => {
            if (!isDragging) return;
            let moveY = e.touches[0].clientY - startY;
            host.style.top = (startTop + moveY) + 'px';
        };
        window.ontouchend = () => {
            if (!isDragging) return;
            isDragging = false;
            btn.style.transition = 'width 0.3s cubic-bezier(0.1, 0.9, 0.2, 1)';
            let finalTop = Math.max(50, Math.min(window.innerHeight - 50, host.offsetTop));
            host.style.top = finalTop + 'px';
        };
        btn.onclick = () => {
            if (isDragging) return;
            const menus = deepScan();
            if (menus.length === 0) return alert("未发现脚本菜单。");
            renderPanel(menus, shadow);
        };
    };

    function renderPanel(menus, shadow) {
        if (shadow.querySelector('.panel-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'panel-overlay';
        const content = document.createElement('div');
        content.className = 'content';
        menus.forEach((cmd) => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerText = typeof cmd.title === 'function' ? cmd.title() : cmd.title;
            item.onclick = (e) => { e.stopPropagation(); cmd.listener(); overlay.remove(); };
            content.appendChild(item);
        });
        const close = document.createElement('div');
        close.className = 'close-btn';
        close.innerText = "关闭菜单";
        close.onclick = () => overlay.remove();
        content.appendChild(close);
        overlay.appendChild(content);
        overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };
        shadow.appendChild(overlay);
    }

    if (document.readyState !== 'loading') initUI();
    else window.addEventListener('DOMContentLoaded', initUI);
})();
