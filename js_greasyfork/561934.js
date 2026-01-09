// ==UserScript==
// @name         酷安自动重定向
// @description  获取参数中的链接并进行跳转
// @namespace    https://www.tampermonkey.net/
// @version      1.0
// @author       Gemini
// @match        https://www.coolapk.com/link?url*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561934/%E9%85%B7%E5%AE%89%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/561934/%E9%85%B7%E5%AE%89%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        current_href: window.location.href
    };

    const utils = {
        set_no_referrer() {
            let meta = document.querySelector('meta[name="referrer"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'referrer';
                document.head.appendChild(meta);
            }
            meta.content = 'no-referrer';
        },
        extract_target() {
            try {
                const params = new URL(config.current_href).searchParams;
                return params.get('url');
            } catch (e) {
                return null;
            }
        },
        execute() {
            const target = this.extract_target();
            if (target) {
                this.set_no_referrer();
                window.location.replace(target);
            }
        }
    };

    utils.execute();
})();