// ==UserScript==
// @id             TiebaRedirect@jiayiming
// @name           百度贴吧重定向
// @version        1.2.2
// @namespace      jiayiming
// @author         jiayiming
// @description    重定向各类同素异形体到更科学的主域名tieba.baidu.com
// @include        http://tieba.baidu.com.cn/*
// @include        http://tieba.baidu.cn/*
// @include        http://post.baidu.*
// @include        http://xingqu.baidu.com/*
// @homepageURL    https://greasyfork.org/scripts/780/

// updateURL      https://userscripts.org/scripts/source/155728.meta.js
// downloadURL    https://userscripts.org/scripts/source/155728.user.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/780/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/780/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

//目前发现以下同素异形体
//http://tieba.baidu.com.cn
//http://tieba.baidu.cn
//http://post.baidu.cn
//http://post.baidu.com

document.location.host = "tieba.baidu.com";