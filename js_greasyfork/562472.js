// ==UserScript==
// @name         VikACG 外链跳转器
// @namespace    https://greasyfork.org/users/1559531-tnoir
// @version      0.1.2
// @description  捕获 VikACG 中转页面中的下载地址并直接跳转
// @match        https://www.vikacg.com/external*
// @run-at       document-start
// @grant        GM_openInTab
// @license      MIT
// @icon         https://www.vikacg.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/562472/VikACG%20%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562472/VikACG%20%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // true  = 当前标签页跳转
    // false = 新标签页打开（默认）
    const OPEN_IN_CURRENT_TAB = false;

    // 防止同一链接被多次触发
    let hasRedirected = false;

    /* ==================== 下载站点白名单 ==================== */

    // 国内站点
    const CN_NETDISK_DOMAINS = [
        'pan.baidu.com',
        'yun.baidu.com',
        'pan.xunlei.com',
        'cloud.189.cn',
        'pan.quark.cn',
        'drive.uc.cn',
        'www.aliyundrive.com',
        'www.alipan.com',
        'pan.123pan.com',
        'www.123pan.com',
        'www.lanzoui.com',
        'www.lanzoux.com',
        'www.lanzouy.com',
        'www.lanzoue.com',
        'www.lanzouo.com',
        'www.lanzoui.net',
        'www.lanzoub.com'
    ];

    // 国际站点
    const GLOBAL_NETDISK_DOMAINS = [
        'drive.google.com',
        'mega.nz',
        'mega.io',
        'www.mediafire.com',
        'www.dropbox.com',
        'onedrive.live.com',
        '1drv.ms',
        'pixeldrain.com',
        'www.pixeldrain.com',
        'gofile.io',
        'www.gofile.io',
        'krakenfiles.com',
        'www.krakenfiles.com',
        'uploadhaven.com',
        'www.uploadhaven.com',
        'filecrypt.cc',
        'www.filecrypt.cc',
        'rapidgator.net',
        'nitroflare.com',
        'www.nitroflare.com',
        'turbobit.net',
        'www.turbobit.net',
        'ddownload.com',
        'www.ddownload.com',
        'zippyshare.com',
        'www.zippyshare.com'
    ];

    // 私有云盘
    const PRIVATE_FILE_HOSTS = [
        'vikingfile.com',
        'vik1ngfile.site',
        'anonfiles.com',
        'bayfiles.com',
        'letsupload.io',
        'send.cm',
        'filechan.org',
        'files.fm',
        'fex.net'
    ];

    const ALL_NETDISK_DOMAINS = [
        ...CN_NETDISK_DOMAINS,
        ...GLOBAL_NETDISK_DOMAINS,
        ...PRIVATE_FILE_HOSTS
    ];

    /* ======================================================== */

    function isRealDownloadUrl(url) {
        if (typeof url !== 'string') return false;

        try {
            const host = new URL(url).hostname;
            return ALL_NETDISK_DOMAINS.some(domain =>
                host === domain || host.endsWith('.' + domain)
            );
        } catch {
            return false;
        }
    }

    function redirect(url) {
        if (hasRedirected) return;
        hasRedirected = true;

        console.log('[VikACG] 捕获下载链接：', url);

        if (OPEN_IN_CURRENT_TAB) {
            location.replace(url);
        } else {
            GM_openInTab(url, { active: true, insert: true, setParent: true });
        }
    }

    // Hook XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (isRealDownloadUrl(url)) {
            redirect(url);
        }
        return originalXHROpen.apply(this, arguments);
    };

    // Hook fetch（备用）
    if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function (input) {
            const url = typeof input === 'string' ? input : input && input.url;
            if (isRealDownloadUrl(url)) {
                redirect(url);
            }
            return originalFetch.apply(this, arguments);
        };
    }

})();
