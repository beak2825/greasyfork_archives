// ==UserScript==
// @name         Add to Shaarli
// @namespace    http://tampermonkey.net/
// @version      2025-09-28
// @description  按下 Ctrl+5 将当前网页添加到 Shaarli（v2.1), 首次使用需填写一次域名(如: http://www.domain.com:8000),更改域名请可按下Ctrl+Shift+5。
// @author       Leo Bi
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/550923/Add%20to%20Shaarli.user.js
// @updateURL https://update.greasyfork.org/scripts/550923/Add%20to%20Shaarli.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    const STORAGE_KEY = 'shaarli_domain';

    /* ---------- 域名存取 ---------- */
    function getDomain() {
        return GM_getValue(STORAGE_KEY);
    }
    function saveDomain(raw) {
        let d = raw.trim().replace(/\/+$/, '');
        if (!/^https?:\/\//i.test(d)) d = 'http://' + d;
        GM_setValue(STORAGE_KEY, d);
        return d;
    }

    /* ---------- 弹窗填写 ---------- */
    function promptDomain() {
        const domain = prompt(
            '首次使用 Add to Shaarli\n请输入 Shaarli 域名\n（例如：http://www.domain.com:8000）',
            ''
        );
        return (domain && domain.trim()) ? saveDomain(domain) : null;
    }

    /* ---------- 打开分享页 ---------- */
    function openShaarli() {
        let domain = getDomain();
        if (!domain) {
            domain = promptDomain();
            if (!domain) return;          // 用户取消
        }
        const shareURL = domain + '/admin/shaare?post=' + encodeURIComponent(location.href);
        window.open(shareURL, '_blank');
    }

    /* ---------- 快捷键 ---------- */
    $(document).on('keydown', function (e) {
        if (e.ctrlKey && e.keyCode === 53 && !e.shiftKey) {        // Ctrl+5
            e.preventDefault();
            openShaarli();
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode === 53) {        // Ctrl+Shift+5
            e.preventDefault();
            const d = promptDomain();
            if (d) alert('Shaarli 域名已更新为：' + d);
        }
    });
})(jQuery);