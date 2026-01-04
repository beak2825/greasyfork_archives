// ==UserScript==
// @name         PWA Installer for Any Site
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制移动端网页支持 PWA 安装
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549521/PWA%20Installer%20for%20Any%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/549521/PWA%20Installer%20for%20Any%20Site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 创建 Manifest
    let webManifest = {
        "name": "My PWA",
        "short_name": "PWA",
        "start_url": window.location.href,
        "display": "standalone",
        "theme_color": "#ff0000",
        "background_color": "#ffffff",
        "icons": [
            {
                "src": "https://via.placeholder.com/192.png",
                "sizes": "192x192",
                "type": "image/png"
            }
        ]
    };

    let manifestElem = document.createElement('link');
    manifestElem.setAttribute('rel', 'manifest');
    manifestElem.setAttribute('href', 'data:application/manifest+json;base64,' + btoa(JSON.stringify(webManifest)));
    document.head.prepend(manifestElem);

    // 2. 注册简单 Service Worker
    if ('serviceWorker' in navigator) {
        // 简单 SW：缓存当前页面
        const swCode = `
            self.addEventListener('install', event => { self.skipWaiting(); });
            self.addEventListener('activate', event => { event.waitUntil(clients.claim()); });
            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.open('pwa-cache').then(cache => 
                        cache.match(event.request).then(resp => resp || fetch(event.request))
                    )
                );
            });
        `;
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);

        navigator.serviceWorker.register(swUrl)
            .then(() => console.log('Service Worker registered for PWA'))
            .catch(console.error);
    }

})();