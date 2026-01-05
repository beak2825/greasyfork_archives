// ==UserScript==
// @name        FuckTiebaLoginLimit
// @description 解除贴吧必需登录才能浏览的限制
// @namespace   不知道
// @version     1.1
// @include     http://tieba.baidu.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8853/FuckTiebaLoginLimit.user.js
// @updateURL https://update.greasyfork.org/scripts/8853/FuckTiebaLoginLimit.meta.js
// ==/UserScript==
//unsafeWindow.PageData.user.is_login = 1; 此方法已失效
var islogin = document.createElement('script');
islogin.innerHTML = "PageData.user.is_login = true;";
document.head.appendChild(islogin);