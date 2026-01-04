// ==UserScript==
// @name         强制你看广告
// @version      1.0
// @description  只显示Google广告
// @author       LangYa466
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1526786
// @downloadURL https://update.greasyfork.org/scripts/553447/%E5%BC%BA%E5%88%B6%E4%BD%A0%E7%9C%8B%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/553447/%E5%BC%BA%E5%88%B6%E4%BD%A0%E7%9C%8B%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟1秒执行，等待页面上的脚本执行，特别是那些动态插入广告的脚本
    setTimeout(() => {
        const googleAdSelectors = [
            '.adsbygoogle',
            'ins[data-ad-client]',
            'div[id^="google_ads_iframe_"]',
            'iframe[id^="google_ads_iframe_"]',
            'div[data-google-query-id]',
            'div[id^="google-center-div"]',
            'div[aria-label="Advertisement"]'
        ];

        // 检查页面是否存在Google广告脚本
        const hasGoogleAdScript = Array.from(document.scripts).some(s =>
            s.src && s.src.includes('pagead2.googlesyndication.com')
        );

        // 查找所有匹配的Google广告元素
        let googleAdElements = [];
        googleAdSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => googleAdElements.push(el));
        });

        // 判断条件：页面上必须有可见的Google广告元素，或者至少有Google广告的脚本
        if (googleAdElements.length > 0 || hasGoogleAdScript) {
            // 如果只检测到脚本但没找到元素，可能是元素还没渲染出来，再多等1.5秒
            if (googleAdElements.length === 0) {
                setTimeout(isolateGoogleAds, 1500);
            } else {
                isolateGoogleAds();
            }
        } else {
            // 如果连Google的广告脚本都找不到，直接判定为无广告
            showFailureMessage();
        }

        function isolateGoogleAds() {
            // 再次查找广告元素，以捕获延迟加载的广告
            googleAdElements = [];
            googleAdSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    // 确保元素在DOM中并且是可见的
                    if (document.body.contains(el) && el.offsetParent !== null) {
                         googleAdElements.push(el);
                    }
                });
            });

            // 如果等待后依然没有找到任何可见的广告元素，则显示失败信息
            if (googleAdElements.length === 0) {
                showFailureMessage();
                return;
            }

            // 创建一个全新的容器来存放所有广告
            const adContainer = document.createElement('div');
            adContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: start;
                width: 100%;
                min-height: 100vh;
                padding: 20px;
                box-sizing: border-box;
                gap: 20px;
                background-color: #f0f0f0;
            `;

            // 将所有找到的广告元素移动到新容器中
            googleAdElements.forEach(ad => {
                adContainer.appendChild(ad);
            });

            // 清理旧页面内容
            document.head.innerHTML = '<meta charset="UTF-8"><title>广告</title>';
            document.body.innerHTML = '';
            document.body.style.cssText = 'margin:0; padding:0;';

            // 将只包含广告的容器放入页面
            document.body.appendChild(adContainer);
        }

        function showFailureMessage() {
            // 彻底替换页面内容为提示信息
            document.head.innerHTML = '<meta charset="UTF-8"><title>没有广告</title>';
            document.body.innerHTML = `
                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    height:100vh;
                    font-size:2em;
                    color:red;
                    background-color:#fff;
                ">
                    没有广告不能看！
                </div>
            `;
            document.body.style.cssText = 'margin:0; padding:0;';
        }

    }, 1000);

})();