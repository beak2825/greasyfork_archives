// ==UserScript==
// @name         1024magnet_magnet
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license MI
// @description  1024 mobile version copy magnet 
// @author       You
// @match        *://*/htm_mob/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557870/1024magnet_magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/557870/1024magnet_magnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('a').forEach(function(anchor) {
    // 检查链接中是否包含指定字符串
    if (anchor.href.indexOf('link.php?hash=') !== -1) {

        // 提取 hash (保持了你原本 +8 的逻辑，如果是纯 'hash=' 其实长度是5，请根据实际情况确认)
        var startIndex = anchor.href.lastIndexOf('hash=') + 8;
        var hash = anchor.href.substr(startIndex, 40);

        // 创建 textarea
        var ss = document.createElement('textarea');
        ss.readOnly = true;

        // 生成磁力链接
        var magnetLink = 'magnet:?xt=urn:btih:' + hash;
        ss.value = magnetLink; // textarea 推荐用 value

        // 修改原链接的 href
        anchor.href = magnetLink;

        // 点击复制功能
        ss.addEventListener('click', function() {
            ss.select();
            document.execCommand('copy');
            // 可选：复制后给个提示，例如 console.log('已复制');
        });

        // 将 textarea 插入到 a 标签后面
        // Element.after() 是现代浏览器支持的原生方法，等同于 jQuery 的 .after()
        anchor.after(ss);
    }
});
    
})();