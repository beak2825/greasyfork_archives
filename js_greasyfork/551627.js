// ==UserScript==
// @name         在新标签页打开链接(无开关按钮版)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  默认自动执行，在新标签页打开链接，排除系统文件夹及特殊链接
// @author       晚风知我意
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551627/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%28%E6%97%A0%E5%BC%80%E5%85%B3%E6%8C%89%E9%92%AE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551627/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%28%E6%97%A0%E5%BC%80%E5%85%B3%E6%8C%89%E9%92%AE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isSystemFolderLink = (href) => {
        if (/^file:\/\/\/[a-zA-Z]:\//.test(href)) return true;
        if (/^file:\/\/\/(Users|home|etc|var|opt)\//.test(href)) return true;
        if (/^file:\/\/\/\/[^\/]+\//.test(href)) return true;
        return false;
    };

    const handleLinkClick = (event) => {
        const link = event.target.closest('a');
        if (!link || !link.href) return;

        if (link.hasAttribute('download') || 
            link.href.startsWith('javascript:') || 
            link.href.startsWith('mailto:') ||
            link.href.startsWith('tel:') ||
            isSystemFolderLink(link.href)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        window.open(link.href, '_blank');
    };

    GM_registerMenuCommand('当前已默认启用：链接新标签页打开', () => {
        alert('脚本已默认启用，点击普通链接会自动在新标签页打开（已排除下载、邮件、本地文件等特殊链接）');
    });

    const init = () => {
        document.addEventListener('click', handleLinkClick, true);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
