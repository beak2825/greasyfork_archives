// ==UserScript==
// @name         Twitter/X to Sotwe Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert Twitter and X links to Sotwe quickly and intelligently.
// @author       you
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sotwe.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561320/TwitterX%20to%20Sotwe%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/561320/TwitterX%20to%20Sotwe%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // التعبير النمطي لاستهداف النطاق بدقة
    const targetRegex = /https?:\/\/(www\.)?(twitter\.com|x\.com)/gi;
    const replacement = "https://www.sotwe.com";

    function updateLinks(node = document) {
        // البحث عن الروابط التي لم يتم تعديلها بعد
        const links = node.querySelectorAll('a[href*="twitter.com"], a[href*="x.com"]');

        links.forEach(link => {
            if (targetRegex.test(link.href)) {
                // تحديث الرابط الفعلي
                link.href = link.href.replace(targetRegex, replacement);

                // تحديث النص الظاهر إذا كان يحتوي على الرابط القديم
                if (targetRegex.test(link.textContent)) {
                    link.textContent = link.textContent.replace(targetRegex, replacement);
                }

                // وضع علامة لعدم معالجة هذا الرابط مرة أخرى
                link.setAttribute('data-sotwe-processed', 'true');
            }
        });
    }

    // مراقب التغييرات لضمان العمل مع الصفحات التي تحمل محتوى بشكل مستمر (Scroll)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // التأكد من أنه عنصر (Element)
                    if (node.tagName === 'A') {
                        updateLinks(node.parentElement || document);
                    } else {
                        updateLinks(node);
                    }
                }
            });
        });
    });

    // تشغيل أولي
    updateLinks();

    // بدء المراقبة
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();