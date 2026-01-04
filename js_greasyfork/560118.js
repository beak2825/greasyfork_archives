// ==UserScript==
// @name         好医生自动差评助手_V4(静默版)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  自动差评、清空标签、自动提交、拦截"评价成功"弹窗
// @author       GGBond
// @license      MIT
// @icon         https://img.icons8.com/?size=100&id=6910&format=png&color=000000
// @match        https://www.cmechina.net/cme/apply.jsp*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560118/%E5%A5%BD%E5%8C%BB%E7%94%9F%E8%87%AA%E5%8A%A8%E5%B7%AE%E8%AF%84%E5%8A%A9%E6%89%8B_V4%28%E9%9D%99%E9%BB%98%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560118/%E5%A5%BD%E5%8C%BB%E7%94%9F%E8%87%AA%E5%8A%A8%E5%B7%AE%E8%AF%84%E5%8A%A9%E6%89%8B_V4%28%E9%9D%99%E9%BB%98%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAlert = window.alert;
    window.alert = function(message) {
        if (message && message.includes('评价成功')) {
            return true;
        }
        return true; 
    };

    const config = {
        starLevel: "1",
        targetRadioText: "不满意", 
        delayTime: 1500
    };

    function autoRate() {
        const popup = document.querySelector('.popup-body') || document.querySelector('.pj-popup');

        if (!popup || popup.getAttribute('data-status') === 'submitted') {
            return;
        }
        if (popup.getAttribute('data-status') === 'filling') {
            return; 
        }
        
        popup.setAttribute('data-status', 'filling');

        const starContainer = popup.querySelector('#star_score');
        if (starContainer) {
            const oneStar = starContainer.querySelector(`img[alt="${config.starLevel}"]`);
            if (oneStar) oneStar.click();
        }

        const labels = popup.querySelectorAll('label');
        labels.forEach(label => {
            if (label.textContent.includes(config.targetRadioText)) {
                label.click();
                const input = label.querySelector('input');
                if(input) input.click();
            }
        });

        function clearTags() {
            const activeTags = popup.querySelectorAll('ul li.active');
            activeTags.forEach(tag => {
                tag.click();
                tag.classList.remove('active'); 
            });
        }
        clearTags();

        const textarea = popup.querySelector('textarea');
        if(textarea && textarea.value === '') {
            textarea.value = '无'; 
        }

        setTimeout(() => {
            clearTags();

            const allBtns = document.querySelectorAll('button, a, div.btn, span.layui-layer-btn0'); 
            let targetBtn = null;

            for (let btn of allBtns) {
                if (btn.textContent.trim().includes('确定') && btn.offsetParent !== null) {
                    targetBtn = btn;
                    break;
                }
            }

            if (targetBtn) {
                targetBtn.click();
                popup.setAttribute('data-status', 'submitted');
            }
        }, config.delayTime);
    }

    setInterval(autoRate, 500);

})();