// ==UserScript==
// @name         newapi2ccswitch 配置导入 ccswitch
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  点击火箭自动显示 Key 并导入，homepage 设为 /console/log
// @author       Gemini
// @match        *://*/console/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561788/newapi2ccswitch%20%E9%85%8D%E7%BD%AE%E5%AF%BC%E5%85%A5%20ccswitch.user.js
// @updateURL https://update.greasyfork.org/scripts/561788/newapi2ccswitch%20%E9%85%8D%E7%BD%AE%E5%AF%BC%E5%85%A5%20ccswitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runLogic() {
        // 只有在令牌页面才注入按钮
        if (!window.location.pathname.endsWith('/console/token')) return;
        injectImportButtons();
    }

    function injectImportButtons() {
        const copyButtons = document.querySelectorAll('button[aria-label="copy token key"]');
        
        copyButtons.forEach(copyBtn => {
            // 避免重复注入
            if (copyBtn.nextSibling && copyBtn.nextSibling.classList && copyBtn.nextSibling.classList.contains('cc-import-btn')) return;

            const importBtn = document.createElement('button');
            importBtn.className = 'cc-import-btn semi-button semi-button-tertiary semi-button-size-small semi-button-borderless semi-button-with-icon';
            importBtn.type = 'button';
            importBtn.style.cssText = 'cursor: pointer; margin-left: 4px; background: transparent; border: none; padding: 4px;';
            importBtn.innerHTML = `<span class="semi-button-content" style="font-size: 16px;">🚀</span>`;
            
            importBtn.onclick = async function(e) {
                e.preventDefault();
                
                const wrapper = copyBtn.closest('.semi-input-wrapper');
                const input = wrapper ? wrapper.querySelector('input.semi-input') : null;
                const eyeBtn = wrapper ? wrapper.querySelector('button[aria-label="toggle token visibility"]') : null;

                if (!input) return;

                // 1. 如果是星号，先点眼睛
                if (input.value.includes('*')) {
                    if (eyeBtn) {
                        eyeBtn.click();
                        // 给页面 150ms 响应时间更新 input 的 value
                        await new Promise(resolve => setTimeout(resolve, 150));
                    }
                }

                const apiKey = input.value.trim();
                
                // 2. 最终检查
                if (apiKey.includes('*')) {
                    alert('无法自动读取明文 Key，请手动点击眼睛图标后再点击火箭。');
                    return;
                }

                // 3. 构建参数
                const pageTitle = encodeURIComponent(document.title);
                const domain = window.location.origin; // 例如 https://api.daiju.live
                
                // 按照要求：homepage 加上 /console/log
                const homepage = encodeURIComponent(domain + '/console/log');
                const endpoint = encodeURIComponent(domain);

                // 4. 构建 ccswitch 协议并跳转
                const url = `ccswitch://v1/import?resource=provider&app=claude&name=${pageTitle}&homepage=${homepage}&endpoint=${endpoint}&apiKey=${encodeURIComponent(apiKey)}`;
                
                window.location.href = url;
            };

            copyBtn.parentNode.insertBefore(importBtn, copyBtn.nextSibling);
        });
    }

    // --- 运行与监听 ---
    runLogic();

    const observer = new MutationObserver(() => {
        runLogic();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();