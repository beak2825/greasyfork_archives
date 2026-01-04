// ==UserScript==
// @name         播放器快捷键扩展
// @namespace    https://greasyfork.org/users/726822
// @version      1.0.3
// @description  腾讯视频、优酷、爱奇艺播放器添加快捷键支持，F=全屏切换, D=弹幕开关
// @author       nosora
// @match        *://*.qq.com/*
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.nosora.me/*
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556209/%E6%92%AD%E6%94%BE%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/556209/%E6%92%AD%E6%94%BE%E5%99%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickButton(selectors) {
        for (const sel of selectors) {
            const btn = document.querySelector(sel);
            if (btn) {
                btn.click();
                return btn;
            }
        }
        return null;
    }

    const tipCache = { '开启': null, '关闭': null };

    function showTip(container, text) {
        if (!container) return;

        if (text.includes('开启') && tipCache['关闭']) {
            tipCache['关闭'].remove();
            tipCache['关闭'] = null;
        }
        if (text.includes('关闭') && tipCache['开启']) {
            tipCache['开启'].remove();
            tipCache['开启'] = null;
        }

        const tip = document.createElement('div');
        tip.textContent = text;
        tip.style.position = 'absolute';
        tip.style.background = 'rgba(0,0,0,0.5)';
        tip.style.color = '#fff';
        tip.style.padding = '6px 12px';
        tip.style.borderRadius = '4px';
        tip.style.fontSize = '14px';
        tip.style.zIndex = '9999';
        tip.style.pointerEvents = 'none';
        tip.style.opacity = '0';
        tip.style.transition = 'opacity 0.2s';
        tip.style.left = '50%';
        tip.style.top = '50%';
        tip.style.transform = 'translate(-50%, -50%)';

        const style = getComputedStyle(container);
        if (style.position === 'static') container.style.position = 'relative';

        container.appendChild(tip);

        if (text.includes('开启')) tipCache['开启'] = tip;
        if (text.includes('关闭')) tipCache['关闭'] = tip;

        requestAnimationFrame(() => { tip.style.opacity = '1'; });
        setTimeout(() => {
            tip.style.opacity = '0';
            tip.addEventListener('transitionend', () => {
                tip.remove();
                if (text.includes('开启')) tipCache['开启'] = null;
                if (text.includes('关闭')) tipCache['关闭'] = null;
            });
        }, 1000);
    }

    document.addEventListener('keydown', function(e) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;

        switch (e.key) {

            // F:全屏切换
            case 'f':
            case 'F': {
                clickButton([
                    // 腾讯、优酷
                    '.txp_btn_fullscreen',
                    '#fullscreen-icon',
                    // nosora.me
                    '.art-control-fullscreen'
                ]);
                break;
            }

            // D：弹幕开关
            case 'd':
            case 'D': {
                // 腾讯
                {
                    const tencentBtn = clickButton(['.barrage-switch']);
                    if (tencentBtn) {
                        const title = tencentBtn.getAttribute('title');
                        let status = '';
                        if (title === '开启弹幕') status = '弹幕已开启';
                        else if (title === '关闭弹幕') status = '弹幕已关闭';
                        else return;

                        const iframe = document.querySelector('#magicdanmaku-iframe-wrapper');
                        const container = iframe ? iframe.parentElement : document.body;
                        showTip(container, status);
                        break;
                    }
                }

                // 优酷
                {
                    const youkuBtn = document.querySelector('#barrage-switch');
                    if (youkuBtn) {
                        const isOpen = youkuBtn.classList.contains('turn-on_3h6RT');
                        youkuBtn.click();
                        const player = document.querySelector('.player-container') || document.body;
                        showTip(player, isOpen ? '弹幕已关闭' : '弹幕已开启');
                        break;
                    }
                }

                // 爱奇艺
                {
                    const iqiyiBtn = document.querySelector(
                        '.player-buttons_danmu_on__MoE7i, .player-buttons_danmu_off__qpF6V, .player-buttons_danmu_simple__aS7of'
                    );
                    if (iqiyiBtn) {
                        iqiyiBtn.click();
                    }
                }
                break;
            }
        }
    });

})();
