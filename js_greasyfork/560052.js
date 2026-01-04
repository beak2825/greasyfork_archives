// ==UserScript==
// @name         好医生-拦截突破补丁 (v4.3)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  v1.2.4 主脚本的附属补丁。自动处理“名师讲堂”选课、“乡村医生验证”等拦截页面，自动跳转。
// @author       GGBond & Buyo
// @license      MIT
// @match        *://hanmi.haoyisheng.com/*
// @match        *://brahmspct.haoyisheng.com/*
// @match        *://*.haoyisheng.com/pc/*
// @match        *://*.cmechina.net/cme/xyzs.jsp*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560052/%E5%A5%BD%E5%8C%BB%E7%94%9F-%E6%8B%A6%E6%88%AA%E7%AA%81%E7%A0%B4%E8%A1%A5%E4%B8%81%20%28v43%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560052/%E5%A5%BD%E5%8C%BB%E7%94%9F-%E6%8B%A6%E6%88%AA%E7%AA%81%E7%A0%B4%E8%A1%A5%E4%B8%81%20%28v43%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const buyoIconUrl = "https://i.ibb.co/VY4ZddwP/buyoicon-no-backg.png";

    const showPatchTip = (text, type = 'normal') => {
        let tip = document.getElementById('buyo-patch-tip');
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'buyo-patch-tip';
            tip.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                z-index: 999999; background: rgba(30, 30, 30, 0.95); border: 2px solid #FFB74D;
                color: #FFB74D; padding: 8px 20px; border-radius: 30px; font-size: 13px; font-weight: bold;
                pointer-events: none; box-shadow: 0 4px 15px rgba(255, 183, 77, 0.4);
                display: flex; align-items: center; gap: 8px; transition: all 0.3s ease;
            `;
            const img = document.createElement('img');
            img.src = buyoIconUrl;
            img.style.cssText = "width: 24px; height: 24px; border-radius: 50%; border: 1px solid #FFB74D;";
            const span = document.createElement('span');
            span.id = 'buyo-patch-text';
            tip.appendChild(img);
            tip.appendChild(span);
            document.body.appendChild(tip);
        }
        const textSpan = document.getElementById('buyo-patch-text');
        if(textSpan) textSpan.innerText = text;
        if (type === 'success') {
            tip.style.borderColor = '#66BB6A';
            tip.style.color = '#66BB6A';
            tip.style.boxShadow = '0 4px 15px rgba(102, 187, 106, 0.4)';
        }
    };

    showPatchTip('😺 咘哟正在全域巡逻...');

    setInterval(() => {
        const allLinks = document.querySelectorAll('a');
        let targetLink = null;
        let actionName = "进入课程";

        const lectureKeywords = ['开始学习', '进入学习', '立即学习'];

        for (let link of allLinks) {
            if (!link.innerText) continue;
            const txt = link.innerText;

            if (lectureKeywords.some(key => txt.includes(key))) {
                if (link.href && link.href.includes('http') && !link.href.includes('javascript')) {
                    targetLink = link.href;
                    actionName = "名师讲堂传送";
                    break;
                }
            }

            if (txt.includes('不是乡村医生') && txt.includes('进入学习')) {
                targetLink = link;
                actionName = "跳过身份验证";
                break;
            }
        }

        if (targetLink) {
            showPatchTip(`🚀 ${actionName}，走起！`, 'success');

            setTimeout(() => {
                if (typeof targetLink === 'string') {
                    window.location.href = targetLink;
                } else {
                    targetLink.click();
                    try {
                        const touchEvent = new Event('touchend', { bubbles: true, cancelable: true });
                        targetLink.dispatchEvent(touchEvent);
                    } catch(e){}
                }
            }, 500);
        }
    }, 1500);

})();