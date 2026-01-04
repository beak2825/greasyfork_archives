// ==UserScript==
// @name         ESJ文章点赞动画自动注入脚本
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  通过自动或手动方式，将一个可交互的点赞动画HTML代码块精确注入到ESJ文章编辑器中。
// @author       Lilyyu & Gemini
// @match        *://*.esjzone.one/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548484/ESJ%E6%96%87%E7%AB%A0%E7%82%B9%E8%B5%9E%E5%8A%A8%E7%94%BB%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%85%A5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548484/ESJ%E6%96%87%E7%AB%A0%E7%82%B9%E8%B5%9E%E5%8A%A8%E7%94%BB%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%85%A5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 动画HTML代码 (保持不变)
    const animationHtml = `
<section>
    <img src="none" alt="点赞提示动画" onerror="
        window.addEventListener('load', (e) => {
            const btn = document.querySelector('.btn.btn-likes.btn-secondary');
            if(!btn) return;
            const originalBtnStyle = {
                position: btn.style.position,
                overflow: btn.style.overflow
            };
            btn.style.position = 'relative';
            btn.style.overflow = 'visible';
            const arrowTip = document.createElement('div');
            arrowTip.innerHTML = '⇩ 点赞谢谢喵';
            arrowTip.style.cssText = 'position:absolute; bottom:100%; left:50%; transform:translateX(-50%); margin-bottom:1px; color:#ff69b4; font-size:12px; animation:bounceUp 1s infinite; white-space:nowrap;';
            btn.appendChild(arrowTip);
            const pulseElements = [];
            for(let i = 0; i < 2; i++) {
                const pulse = document.createElement('div');
                pulse.style.cssText = 'position:absolute; border:2px solid rgba(255, 105, 180, 0.8); border-radius:50%; width:0; height:0; left:50%; top:50%; transform:translate(-50%, -50%); opacity:0; pointer-events:none;';
                btn.appendChild(pulse);
                pulseElements.push(pulse);
                pulse.animate([
                    { width: '0', height: '0', opacity: 0.8 },
                    { width: '120%', height: '120%', opacity: 0 }
                ], {
                    duration: 2000,
                    delay: i * 1000,
                    iterations: Infinity,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                });
            }
            const style = document.createElement('style');
            style.textContent = \`
                @keyframes bounceUp {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-5px); }
                }\`;
            document.head.appendChild(style);
            btn.addEventListener('click', function handleClick() {
                if (arrowTip.parentNode === btn) btn.removeChild(arrowTip);
                pulseElements.forEach(pulse => { if (pulse.parentNode === btn) btn.removeChild(pulse); });
                const btnRect = btn.getBoundingClientRect();
                const btnCenterX = btnRect.left + btnRect.width / 2;
                const btnCenterY = btnRect.top + btnRect.height / 2;
                const thankYou = document.createElement('div');
                thankYou.textContent = '（づ￣3￣）づ❤️喜欢你';
                thankYou.style.cssText = \`position:fixed; left:\${btnCenterX}px; top:\${btnCenterY}px; transform:translate(-50%, -50%); color:white; font-weight:bold; font-size:14px; pointer-events:none; z-index:999999; text-shadow:0 0 5px #ff69b4, 1px 1px 1px #ffb4d9, -1px 1px 1px #ffb4d9, 1px -1px 1px #ffb4d9, -1px -1px 1px #ffb4d9; white-space:nowrap;\`;
                document.body.appendChild(thankYou);
                thankYou.animate([
                    { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 0 },
                    { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 1, offset: 0.2 },
                    { transform: 'translate(-50%, -50%) scale(0.95)', offset: 0.4 },
                    { transform: 'translate(-50%, -50%) scale(1.05)', offset: 0.6 },
                    { transform: 'translate(-50%, -50%) scale(0.98)', offset: 0.8 },
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
                ], { duration: 1000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
                setTimeout(() => {
                    thankYou.animate([
                        { transform: 'translate(-50%, -50%)', opacity: 1 },
                        { transform: 'translate(-50%, -200%)', opacity: 0 }
                    ], { duration: 1200, easing: 'ease-out' }).onfinish = () => { if (thankYou.parentNode === document.body) document.body.removeChild(thankYou); };
                }, 1000);
                if (style.parentNode === document.head) document.head.removeChild(style);
                btn.removeEventListener('click', handleClick);
                btn.style.position = originalBtnStyle.position;
                btn.style.overflow = originalBtnStyle.overflow;
            }, { once: true });
        });
        if(this?.parentNode?.parentNode?.className !== undefined){
            if(this.parentNode.parentNode.className !== 'fr-element fr-view'){
                this.parentNode.removeChild(this);
            }
        }
    ">
</section>
    `;

    // 2. 注入功能 (已更新选择器)
    function injectContent(isAuto = false) {
        // 使用ID选择器 `#artEditor .fr-element.fr-view` 来精确定位小说编辑器
        const editor = document.querySelector('#artEditor .fr-element.fr-view');

        if (!editor) {
            if (!isAuto) {
                alert('未找到小说编辑器！\n请确认你正在文章编辑页面。');
            }
            return;
        }

        if (editor.innerHTML.includes('alt="点赞提示动画"')) {
            console.log('检测到动画代码已存在，取消注入。');
            if (!isAuto) {
                alert('动画代码已存在，无需重复注入！');
            }
            return;
        }

        editor.innerHTML += animationHtml;
        console.log('动画代码已成功注入。');
        if (!isAuto) {
            alert('动画代码已成功注入到文章末尾！\n请检查后保存文章。');
        }
    }

    // --- 脚本设置与执行逻辑 ---

    const currentMode = GM_getValue('injectionMode', 'auto');
    const currentModeText = currentMode === 'auto' ? '自动' : '手动';

    GM_registerMenuCommand(`模式切换 (当前: ${currentModeText})`, () => {
        const newMode = currentMode === 'auto' ? 'manual' : 'auto';
        const newModeText = newMode === 'auto' ? '自动' : '手动';
        GM_setValue('injectionMode', newMode);
        alert(`模式已切换为: ${newModeText}。\n页面将刷新以应用设置。`);
        location.reload();
    });

    GM_registerMenuCommand('✅ 手动注入动画到文章', () => injectContent(false), 'i');

    if (currentMode === 'auto') {
        window.addEventListener('load', () => injectContent(true));
    } else {
        console.log('文章内嵌动画脚本处于手动模式。请点击油猴菜单执行注入。');
    }

})();