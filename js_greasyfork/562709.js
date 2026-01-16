// ==UserScript==
// @name         X to (Sotwe/Nitter/Twstalker) Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  تحويل روابط تويتر إلى بدائل مختلفة مع إمكانية التغيير من قائمة الإضافة
// @author
// @match        *://*/*
// @exclude      *://x.com/*
// @exclude      *://twitter.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/562709/X%20to%20%28SotweNitterTwstalker%29%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/562709/X%20to%20%28SotweNitterTwstalker%29%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. قائمة المواقع البديلة
    const VIEWER_LIST = [
        { name: "Sotwe", urlPrefix: "https://www.sotwe.com/", supportPosts: false },
        { name: "Nitter", urlPrefix: "https://nitter.net/", supportPosts: true },
        { name: "Twstalker", urlPrefix: "https://twstalker.com/", supportPosts: false }
    ];

    const DEFAULT_VIEWER_NAME = "Sotwe";
    let currentViewer = GM_getValue("currentViewer", VIEWER_LIST.find(v => v.name === DEFAULT_VIEWER_NAME));

    // 2. تسجيل الأوامر في القائمة
    VIEWER_LIST.forEach(viewer => {
        const isSelected = currentViewer.name === viewer.name;
        const menuLabel = isSelected ? `✅ ${viewer.name}` : `🔗 Use ${viewer.name}`;
        GM_registerMenuCommand(menuLabel, () => {
            if (!isSelected) {
                GM_setValue("currentViewer", viewer);
                location.reload();
            }
        });
    });

    const reservedKeywords = new Set([
        'home', 'explore', 'notifications', 'messages', 'search', 'settings',
        'i', 'compose', 'about', 'privacy', 'tos', 'business', 'help', 'personalization'
    ]);

    // 3. دالة تحويل الرابط الذكية
    function getRedirectUrl(originalUrl) {
        try {
            if (!originalUrl) return null;
            const url = new URL(originalUrl);
            const host = url.hostname.toLowerCase();

            if (host.includes('x.com') || host.includes('twitter.com')) {
                const parts = url.pathname.split('/').filter(Boolean);
                if (parts.length > 0) {
                    const username = parts[0];

                    // التحقق من أن الجزء الأول هو اسم مستخدم صالح
                    if (!reservedKeywords.has(username.toLowerCase()) && /^[A-Za-z0-9_]{1,30}$/.test(username)) {

                        // الحالة الأولى: إذا كان المشغل هو Nitter (يدعم الروابط كاملة)
                        if (currentViewer.supportPosts) {
                            return `${currentViewer.urlPrefix}${url.pathname.substring(1)}${url.search}`;
                        }

                        // الحالة الثانية: المواقع الأخرى (تحويل لاسم المستخدم فقط)
                        return `${currentViewer.urlPrefix}${username}`;
                    }
                }
            }
        } catch (e) { return null; }
        return null;
    }

    // 4. دالة معالجة الروابط (خاصة بجوجل والنتائج الديناميكية)
    function processAllLinks() {
        const anchors = document.querySelectorAll('a[href*="x.com"], a[href*="twitter.com"]');
        anchors.forEach(a => {
            const newHref = getRedirectUrl(a.href);
            if (newHref && a.href !== newHref) {
                a.href = newHref;
                a.setAttribute('data-jsarnt', '1'); // منع اعتراض جوجل
            }
        });
    }

    // 5. مراقبة التغيرات (لنتائج البحث)
    const observer = new MutationObserver(processAllLinks);

    if (document.body) {
        processAllLinks();
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            processAllLinks();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // 6. اعتراض النقرات والفتح التلقائي
    document.addEventListener('mousedown', function(e) {
        const anchor = e.target.closest('a');
        if (anchor && anchor.href) {
            const newTarget = getRedirectUrl(anchor.href);
            if (newTarget) anchor.href = newTarget;
        }
    }, true);

    const originalOpen = window.open;
    window.open = function(url, name, specs) {
        const newUrl = getRedirectUrl(url);
        return originalOpen.call(window, newUrl || url, name, specs);
    };

})();


