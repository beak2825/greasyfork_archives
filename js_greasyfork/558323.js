// ==UserScript==
// @name         B站自己评论自动删除
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Auto delete + auto close tab (safe method)
// @author       TESV2
// @license MIT
// @match        https://www.bilibili.com/h5/comment/sub?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558323/B%E7%AB%99%E8%87%AA%E5%B7%B1%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/558323/B%E7%AB%99%E8%87%AA%E5%B7%B1%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForComment = () => {
        return new Promise((resolve) => {
            const check = () => {
                const comment = document.querySelector('.reply-item');
                if (comment) {
                    resolve(comment);
                } else {
                    setTimeout(check, 500);
                }
            };
            check();
        });
    };

    const findConfirmButton = () => {
        const modalFooter = document.querySelector('.bilibili-modal-footer');
        if (modalFooter) {
            const buttons = Array.from(modalFooter.querySelectorAll('button'));
            const confirmBtn = buttons.find(btn =>
                btn.textContent.replace(/\s+/g, '') === '确认'
            );
            if (confirmBtn) return confirmBtn;
        }

        const allButtons = Array.from(document.querySelectorAll('button'))
            .filter(btn => btn.offsetParent !== null);

        return allButtons.find(btn =>
            btn.textContent.replace(/\s+/g, '') === '确认'
        );
    };

    const deleteComment = async () => {
        try {
            const comment = await waitForComment();
            console.log('[Auto Delete] Comment found!');

            const moreBtn = comment.querySelector('.more .iconMore');
            if (!moreBtn) throw new Error('More button not found');
            moreBtn.click();
            console.log('[Auto Delete] Clicked more button');

            await new Promise(resolve => setTimeout(resolve, 600));

            const opsList = document.querySelector('.ops-list');
            if (!opsList) throw new Error('Ops list not found');

            const deleteBtn = Array.from(opsList.querySelectorAll('li'))
                .find(li => li.textContent.trim() === '删除');

            if (!deleteBtn) throw new Error('Delete option not found');
            deleteBtn.click();
            console.log('[Auto Delete] Clicked delete option');

            await new Promise(resolve => setTimeout(resolve, 1800));

            const confirmBtn = findConfirmButton();
            if (!confirmBtn) throw new Error('Confirm button not found');

            confirmBtn.click();
            console.log('[Auto Delete] Confirmed deletion! (with flexible "确认" match)');

            // ✅ 最终方案：安全关闭标签页
            console.log('[Auto Delete] Auto-closing tab in 2 seconds...');
            setTimeout(() => {
                window.location.href = 'about:blank';
                setTimeout(() => window.close(), 200);
            }, 2000);
        } catch (error) {
            console.error('[Auto Delete] Fatal error:', error.message);
            if (error.message.includes('not found')) {
                console.log('[Auto Delete] Retrying...');
                setTimeout(deleteComment, 2000);
            }
        }
    };

    deleteComment();
})();