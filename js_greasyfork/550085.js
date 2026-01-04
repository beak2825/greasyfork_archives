// ==UserScript==
// @name         South-plus MTF Killer
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  荷包蛋自用净化南+论坛贴文的脚本，全自动隐藏MTF相关贴文
// @author       Ayase
// @match        *://*.south-plus.net/thread.php*
// @match        *://*.south-plus.net/search.php*
// @match        *://*.south-plus.net/simple/*
// @match        *://*.blue-plus.net/thread.php*
// @match        *://*.blue-plus.net/search.php*
// @match        *://*.blue-plus.net/simple/*
// @match        *://*.north-plus.net/thread.php*
// @match        *://*.north-plus.net/search.php*
// @match        *://*.north-plus.net/simple/*
// @match        *://*.spring-plus.net/thread.php*
// @match        *://*.spring-plus.net/search.php*
// @match        *://*.spring-plus.net/simple/*
// @match        *://*.level-plus.net/thread.php*
// @match        *://*.level-plus.net/search.php*
// @match        *://*.level-plus.net/simple/*
// @match        *://*.white-plus.net/thread.php*
// @match        *://*.white-plus.net/search.php*
// @match        *://*.white-plus.net/simple/*
// @match        *://*.east-plus.net/thread.php*
// @match        *://*.east-plus.net/search.php*
// @match        *://*.east-plus.net/simple/*
// @match        *://*.summer-plus.net/thread.php*
// @match        *://*.summer-plus.net/search.php*
// @match        *://*.summer-plus.net/simple/*
// @match        *://*.bbs.imoutolove.me/thread.php*
// @match        *://*.bbs.imoutolove.me/search.php*
// @match        *://*.bbs.imoutolove.me/simple/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550085/South-plus%20MTF%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/550085/South-plus%20MTF%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywords = [
        '伪娘',
        '药娘',
        '扶她',
        '男+',
        '性转',
        '男同',
        '男娘',
        'mtf',
        '🏳️‍⚧️',
        '🏳️‍🌈',
        '跨性别',
        'futa',
        'LGBT',
        '🍥',
        'furry',
        '男童',
        '福瑞'
    ];


    function showNotification(message, duration = 1500) {
        const notification = document.createElement('div');
        notification.textContent = message;

        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 15px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            borderRadius: '5px',
            zIndex: '99999',
            fontSize: '14px',
            opacity: '0',
            transition: 'opacity 0.4s ease-in-out',
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, duration);
    }


    function filterPosts() {
        const lowerCaseKeywords = keywords.map(k => k.toLowerCase());

        const postRows = document.querySelectorAll(
            '#ajaxtable tr.tr3, #main div.t table tr.tr3, div.threadlist > ul > li'
        );

        let blockedCount = 0;

        postRows.forEach(row => {
            let titleText = '';
            let authorText = '';
            let titleForLog = '';
            let authorForLog = 'N/A';

            const desktopTitle = row.querySelector('h3 > a, th.y-style > a');
            const desktopAuthor = row.querySelector('a.bl, td.smalltxt.y-style > a');

            const mobileLink = row.querySelector('a');
            const mobileAuthorSpan = mobileLink ? mobileLink.querySelector('span.by') : null;

            if (desktopTitle) { 
                titleForLog = desktopTitle.textContent.trim();
                titleText = titleForLog.toLowerCase();
                if (desktopAuthor) {
                    authorForLog = desktopAuthor.textContent.trim();
                    authorText = authorForLog.toLowerCase();
                }
            } else if (mobileAuthorSpan) {
                titleForLog = mobileLink.firstChild.textContent.trim();
                titleText = titleForLog.toLowerCase();
                authorForLog = mobileAuthorSpan.textContent.split('-')[0].trim();
                authorText = authorForLog.toLowerCase();
            }

            if (titleText) {
                const shouldBeBlocked = lowerCaseKeywords.some(keyword =>
                    titleText.includes(keyword) || authorText.includes(keyword)
                );

                if (shouldBeBlocked) {
                    row.style.display = 'none';
                    blockedCount++;
                    console.log(`已屏蔽帖子: "${titleForLog}" (作者: ${authorForLog})`);
                }
            }
        });

        if (blockedCount > 0) {
            console.log(`[论坛屏蔽脚本] 本次运行共屏蔽了 ${blockedCount} 个帖子。`);
            showNotification(`已屏蔽 ${blockedCount} 个帖子`, 1000);
        }
    }

    filterPosts();

})();
