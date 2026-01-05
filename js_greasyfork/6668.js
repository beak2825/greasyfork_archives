// ==UserScript==
// @name         navigator.plugins spoofing
// @namespace    aaaa007cn 
// @author      aaaa007cn 
// @include     http://play.baidu.com/*
// @include     http://fm.baidu.com/*
// @include     *://www.baidu.com/
// @include     http://5sing.kugou.com/*
// @include     http://www.beiwo.ac/*
// @include     http://www.dongting.com/*
// @include     http://fm.dongting.com/*
// @include     http://www.duole.com/*
// @include     *://music.douban.com/*
// @include     http://papa.me/*
// @include    http://www.1ting.com/*
// @include    http://www.9ku.com/*
// @include    http://www.666ccc.com/*
// @include    http://www.yue365.com/*
// @include    http://dict.cn/*
// @include    *://www.duonao.tv/*
// @include    http://www.webtoons.com/*
// @include    http://v.rongkuai.com/play.html?course_id=*
// @include    http://www.panda.tv/*
// @exclude    http://www.panda.tv/roomframe/*
// @include     http://www.kafan.cn/*
// @exclude   http://www.kafan.cn/home.php?mod=spacecp&ac=avatar
// @description    去除网站的flash插件检测，实现html5播放。
// @homepage    https://www.firefox.net.cn/read-49979-1#read_341320
// @version     4
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/6668/navigatorplugins%20spoofing.user.js
// @updateURL https://update.greasyfork.org/scripts/6668/navigatorplugins%20spoofing.meta.js
// ==/UserScript==
if (typeof wrappedJSObject === 'undefined') {
    Object.defineProperty(navigator, 'plugins', {
        get: function() {
            return {
                length: 0
            };
        }
    });
} else {
    Object.defineProperty(wrappedJSObject.navigator, 'plugins', {
        value: 0
    });
}