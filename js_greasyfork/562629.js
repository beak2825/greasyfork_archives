// ==UserScript==
// @name         M-Team屏蔽指定关键词种子
// @namespace    m-teamblock
// @version      20260117
// @author       Badge8305@M-Team
// @description  自动删除包含指定关键字的 <tr> 行
// @match        https://*.m-team.cc/*
// @grant        none
// @icon         https://i.imgant.com/v2/czc7P0J.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562629/M-Team%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E5%85%B3%E9%94%AE%E8%AF%8D%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/562629/M-Team%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E5%85%B3%E9%94%AE%E8%AF%8D%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PATH_REGEX = /^\/browse\/adult/;

    // 屏蔽关键词
    const KEYWORDS = [
        '男娘',
        '大屌萌妹',
        '男の娘',
        'HSM-',
        'hsm-',
        '伪娘人妖',
        '变性',
        '喝尿',
        '重口味',
        '圣水',
        '大便',
        '神棍优选',
        '屎'
    ];

    let observer = null;
    let active = false;

    function isTargetPage() {
        return PATH_REGEX.test(location.pathname);
    }

    function removeRows() {
        if (!isTargetPage()) return;

        const rows = document.querySelectorAll('tr');
        rows.forEach(tr => {
            const text = tr.innerText || '';
            if (KEYWORDS.some(k => text.includes(k))) {
                tr.remove();
            }
        });
    }

    function start() {
        if (active) return;
        active = true;

        removeRows();

        observer = new MutationObserver(() => {
            removeRows();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[Tampermonkey] adult browse ON');
    }

    function stop() {
        if (!active) return;
        active = false;

        if (observer) {
            observer.disconnect();
            observer = null;
        }

        console.log('[Tampermonkey] adult browse OFF');
    }

    function checkRoute() {
        if (isTargetPage()) {
            start();
        } else {
            stop();
        }
    }

    checkRoute();

    const _pushState = history.pushState;
    history.pushState = function () {
        _pushState.apply(this, arguments);
        setTimeout(checkRoute, 0);
    };

    const _replaceState = history.replaceState;
    history.replaceState = function () {
        _replaceState.apply(this, arguments);
        setTimeout(checkRoute, 0);
    };

    window.addEventListener('popstate', () => {
        setTimeout(checkRoute, 0);
    });

})();