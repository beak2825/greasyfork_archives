// ==UserScript==
// @name         筛选包名
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  仅显示com.开头包名+超大复制按钮屏幕居中
// @author       喃哓盐主
// @license      MIT
// @match        *://dl.yxhapi.com/android/box/game/v6.2/apk.html?id=*
// @match        https://api.3839app.com/cdn/android/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551037/%E7%AD%9B%E9%80%89%E5%8C%85%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/551037/%E7%AD%9B%E9%80%89%E5%8C%85%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 提取并去重com.开头包名
    const pageText = document.body.innerText;
    const packageReg = /com\.[a-zA-Z0-9_\.]+/g;
    const matchedPackages = [...new Set(pageText.match(packageReg) || [])];

    // 2. 页面基础样式：确保按钮全屏居中
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin: 0; padding: 0; min-height: 100vh; display: flex; justify-content: center; align-items: center; background: #f5f5f5;';
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = 'text-align: center; padding: 40px 20px; background: #fff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);';

    // 3. 渲染包名与超大复制按钮
    if (matchedPackages.length > 0) {
        // 包名放大：配合超大按钮，提升整体协调性
        const pkgEl = document.createElement('div');
        pkgEl.textContent = '匹配到的包名：' + matchedPackages[0];
        pkgEl.style.cssText = 'font-size: 24px; margin-bottom: 40px; color: #333; font-weight: 500;';
        mainContainer.appendChild(pkgEl);

        // 超大复制按钮：尺寸显著放大，视觉突出
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '一键复制包名';
        copyBtn.style.cssText = `
            padding: 70px 120px; /* 上下内边距70px，左右120px，按钮整体放大 */
            font-size: 50px; /* 字体放大至50px */
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px; /* 圆角同步放大，更协调 */
            cursor: pointer;
            display: inline-block;
            transition: all 0.2s; /* 过渡效果更流畅 */
            box-shadow: 0 3px 0 #3d8b40; /* 加下阴影，增强立体感 */
        `;

        // 按钮交互优化：点击时轻微下沉，模拟按压感
        copyBtn.onmousedown = function() {
            this.style.boxShadow = '0 1px 0 #3d8b40';
            this.style.transform = 'translateY(2px)';
        };
        copyBtn.onmouseup = copyBtn.onmouseleave = function() {
            this.style.boxShadow = '0 3px 0 #3d8b40';
            this.style.transform = 'translateY(0)';
        };

        // 复制逻辑
        copyBtn.onclick = function() {
            const textarea = document.createElement('textarea');
            textarea.value = matchedPackages[0];
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            copyBtn.textContent = '复制成功！';
            copyBtn.style.background = '#45a049';
            setTimeout(() => {
                copyBtn.textContent = '一键复制包名';
                copyBtn.style.background = '#4CAF50';
            }, 2000);
        };

        mainContainer.appendChild(copyBtn);
    } else {
        // 无包名提示：同步放大字体，保持视觉统一
        const tipEl = document.createElement('div');
        tipEl.textContent = '未找到com.开头的包名';
        tipEl.style.cssText = 'font-size: 24px; color: #ff0000; padding: 30px;';
        mainContainer.appendChild(tipEl);
    }

    document.body.appendChild(mainContainer);
})();
