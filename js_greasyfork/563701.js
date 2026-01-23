// ==UserScript==
// @name         U2种子链接添加复制按钮
// @namespace    http://github.com/Zhuoy3
// @version      0.1.0
// @description  为U2种子链接添加复制按钮，方便复制到下载器
// @author       Zhuoy3
// @match        https://u2.dmhy.org/details.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmhy.org
// @grant        none
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/563701/U2%E7%A7%8D%E5%AD%90%E9%93%BE%E6%8E%A5%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/563701/U2%E7%A7%8D%E5%AD%90%E9%93%BE%E6%8E%A5%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('td.rowfollow[width="87%"]').forEach(td => {
        if (td.querySelector('.copy-http-btn')) {
            return;
        }

        const httpLink = td.querySelector('a.index[href*="https=1"]');
        if (!httpLink) return;

        const httpUrl = httpLink.href;

        const copyBtn = document.createElement('a');
        copyBtn.className = 'index copy-http-btn';
        copyBtn.href = 'javascript:void(0)';
        copyBtn.textContent = '[复制]';
        copyBtn.title = '复制 HTTPS 下载链接';
        copyBtn.style.cursor = 'pointer';

        copyBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                await navigator.clipboard.writeText(httpUrl);
                copyBtn.textContent = '[已复制]';
                setTimeout(() => { copyBtn.textContent = '[复制]'; }, 1500);
            } catch (err) {
                const ta = document.createElement('textarea');
                ta.value = httpUrl;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                copyBtn.textContent = '[已复制]';
                setTimeout(() => { copyBtn.textContent = '[复制]'; }, 1500);
            }
        });

        td.appendChild(document.createTextNode('\u00A0'));
        td.appendChild(copyBtn);
    });


})();