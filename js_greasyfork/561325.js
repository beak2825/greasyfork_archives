// ==UserScript==
// @name         Bypass Instagram Login Redirects
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skip the Instagram login page and use the websites Imginn and Pixnoy.
// @author       you
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/561325/Bypass%20Instagram%20Login%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/561325/Bypass%20Instagram%20Login%20Redirects.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const instaProfile = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:accounts\/login\/\?next=)?(?:\/)?(?!accounts|explore|developer|reels|p|static|legal)([a-zA-Z._0-9]{3,})/i;
    const instaPost = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:accounts\/login\/\?next=)?(?:\/)?(?:p|reel|tv)\/([a-zA-Z._0-9-]+)/i;

    //  
    const VIEWER_LIST = [
        {
            name: "Imginn",
            profilePrefix: "https://imginn.com/",
            postPrefix: "https://imginn.com/p/",
        },
        {
            name: "Pixnoy",
            profilePrefix: "https://www.pixnoy.com/profile/",
            postPrefix: "https://www.pixnoy.com/post/",
        }
    ];

    // جلب المشغل المختار حالياً أو تعيين الأول كافتراضي
    let savedViewer = await GM_getValue("currentViewer");
    let currentViewer = VIEWER_LIST.find(v => v.name === savedViewer?.name) || VIEWER_LIST[0];

    // تسجيل القائمة في Tampermonkey لتغيير المشغل يدوياً
    VIEWER_LIST.forEach(viewer => {
        const label = currentViewer.name === viewer.name ? `✅ ${viewer.name}` : viewer.name;
        GM_registerMenuCommand(label, async () => {
            await GM_setValue("currentViewer", viewer);
            location.reload();
        });
    });

    function getRedirectUrl(url) {
        const profileMatch = url.match(instaProfile);
        const postMatch = url.match(instaPost);

        if (postMatch) {
            return currentViewer.postPrefix + postMatch[1];
        } else if (profileMatch) {
            return currentViewer.profilePrefix + profileMatch[1];
        }
        return null;
    }

    // التحقق من الرابط الحالي (توجيه فوري إذا كان في صفحة الدخول)
    if (window.location.href.includes("instagram.com/accounts/login")) {
        const redirected = getRedirectUrl(decodeURIComponent(window.location.href));
        if (redirected) window.location.replace(redirected);
    }

    // معالجة الروابط الموجودة في الصفحة
    const processLinks = (scope) => {
        const links = scope.querySelectorAll('a[href*="instagram.com"], a[href*="instagr.am"]');
        links.forEach(link => {
            if (link.hasAttribute('data-v-processed')) return;

            const newHref = getRedirectUrl(link.href);
            if (newHref) {
                link.href = newHref;
                link.addEventListener("click", e => e.stopPropagation(), true);
                link.setAttribute('data-v-processed', 'true');
            }
        });
    };

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) processLinks(node);
            });
        }
    });

    const startObservation = () => {
        if (document.body) {
            processLinks(document.body);
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            setTimeout(startObservation, 10);
        }
    };

    startObservation();
})();