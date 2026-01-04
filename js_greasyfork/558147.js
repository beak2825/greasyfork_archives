// ==UserScript==
// @name                SuperRedirect 超级重定向
// @name:zh-CN          超级重定向 SuperRedirect
// @name:zh-TW          超級重定向 SuperRedirect
// @namespace           http://tampermonkey.net/
// @version             2.1.2
// @description         URL and locale optimization for some Chinese websites. Original scripts: greasyfork.org/scripts/410244 & greasyfork.org/scripts/418430.
// @description:zh-CN   萌娘百科（镜像）、贴吧、NGA、虎扑和Bangumi的域名一致化，及萌百、中文维基百科的去语言变体。修改自：greasyfork.org/scripts/410244 & greasyfork.org/scripts/418430。
// @description:zh-TW   萌娘百科（鏡像）、貼吧、NGA、虎撲和Bangumi的網域一致化，及萌百、中文維基百科的去語言變體。修改自：greasyfork.org/scripts/410244 & greasyfork.org/scripts/418430。
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYYAAB2GAV2iE4EAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAABh2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+PHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj48L3JkZjpEZXNjcmlwdGlvbj48L3JkZjpSREY+PC94OnhtcG1ldGE+DQo8P3hwYWNrZXQgZW5kPSd3Jz8+LJSYCwAAAStJREFUWEe1lUFyAyEMBJt9QL7j/x/znXxAOclFFAEa7XpOLiHRbRfgQSNmZrEGMMYYsXaKPODwyHInVUJqXsE9HYly4wnuUSVKTVW4R5E4Nuzg9v0FwHj9xKWyxHaxAvd0JZYLCtzTkUiLHbhHlbhioQLPIJ5M0PfKHrA/AnfhHkXiLfAU3FOVGHPhCXgEZ3PzmRhPwj2KxMUBHj93ks07c5iZRYFsgPBNYs9uzRN/CTP7fw13WW18J6lANJ3TlVjteTEdiDmrARoS2V7vQ+jPoypRTbbHfA39FnxEIpud4cxn4CmJ3dsR4ZD8G1YeplOqcDIBbkoocFYCNCVUODsBRIkOnJMARYkunIoAB4ksVThVAQQJBY4iQEFChaMKsJHowOkIMEnEqHCAX3A+GzI6bJQlAAAAAElFTkSuQmCC
// @license             MIT
// @author              Kennnnnnji;黑田光;willyiam84
// @include             *://mzh.moegirl.org.cn/*
// @include             *://zh.moegirl.org.cn/*
// @include             *://zh.moegirl.tw/*
// @include             *://moegirl.icu/zh-*
// @include             *://m.hupu.com/zone*
// @include             *://jump2.bdimg.com/p/*
// @include             *://nga.178.com/*
// @include             *://yues.org/*
// @include             *://ngabbs.com/*
// @include             *://wuu.wikipedia.org/*
// @include             *://zh-classical.wikipedia.org/*
// @include             *://zh-yue.wikipedia.org/*
// @include             *://zh.wikipedia.org/zh-*
// @include             *://bangumi.tv/*
// @include             *://chii.in/*
// @include             *://bgm.tv/m/*
// @grant               none
// @run-at             	document-start
// @downloadURL https://update.greasyfork.org/scripts/558147/SuperRedirect%20%E8%B6%85%E7%BA%A7%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/558147/SuperRedirect%20%E8%B6%85%E7%BA%A7%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

document.location.href = document.location.href.
//replace(/zh.moegirl.(org|tw)\/zh-(cn|hk|mo|tw|sg|my|hans|hant)/i, 'moegirl.icu/').
/*replace('mzh.moegirl.org.cn.cc', 'moegirl.icu').
replace('mzh.moegirl.org.cn', 'moegirl.icu').
replace('zh.moegirl.org.cn', 'moegirl.icu').
replace('zh.moegirl.tw', 'moegirl.icu').*/
//replace(/mzh.moegirl.org.cn.cc|mzh.moegirl.org.cn|zh.moegirl.org.cn|zh.moegirl.tw/, 'moegirl.icu').
replace(/(m*zh\.)*moegirl\.(org\.cn|tw)(\/zh-(cn|hk|mo|tw|sg|my|hans|hant))*/i, 'moegirl.icu').
replace(/moegirl.icu\/zh-(cn|hk|mo|tw|sg|my|hans|hant)/i, 'moegirl.icu').
replace('m.hupu.com/zone', 'bbs.hupu.com').
replace('jump2.bdimg.com/p/', 'tieba.baidu.com/p/').
//replace('www.bilibili.com/s/', 'www.bilibili.com/').
//replace('ngabbs.com/', 'bbs.nga.cn/').
//replace('yues.org/', 'bbs.nga.cn/').
//replace('nga.178.com/', 'bbs.nga.cn/').
replace(/ngabbs\.com|nga\.178.com/, 'bbs.nga.cn').
replace(/(wuu|zh-classical|zh-yue)\.wikipedia\.org/, 'zh.wikipedia.org').
replace(/zh\.wikipedia\.org\/zh-(cn|hk|mo|tw|sg|my|hans|hant)/i, 'zh.wikipedia.org/wiki').
/*replace('zh-tw', 'wiki').
replace('zh-hk', 'wiki').
replace('zh-mo', 'wiki').
replace('zh-sg', 'wiki').
replace('zh-my', 'wiki').
replace('zh-hant', 'wiki');*/
/*replace(/zh\.wikipedia\.org\/zh-(tw|hk|mo|sg|my|hans|hant)/, 'zh.wikipedia.org/zh-cn');*/
/*replace('zh-tw', 'zh-cn').
replace('zh-hk', 'zh-cn').
replace('zh-mo', 'zh-cn').
replace('zh-sg', 'zh-cn').
replace('zh-my', 'zh-cn').
replace('zh-hant', 'zh-cn');*/
/*replace(/zh-(tw|hk|mo|sg|my|hans|hant)/i, 'zh-cn');*/
replace(/(bangumi.tv|chii.in|bgm.tv)\/m/, 'bgm.tv/rakuen').
replace(/(bangumi.tv|chii.in)/, 'bgm.tv');
