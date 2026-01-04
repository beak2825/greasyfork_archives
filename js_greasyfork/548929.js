// ==UserScript==
// @name          B站消息中心，完全显示自己发布的评论信息。
// @description   B站消息中心，完全显示自己发布的评论信息，修复只能看到一部分问题。
// @version       1.0.0
// @namespace     B站消息中心，完全显示自己发布的评论信息。
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *message.bilibili.com/*
// @require       https://cdn.jsdelivr.net/npm/jquery@1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/548929/B%E7%AB%99%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83%EF%BC%8C%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA%E8%87%AA%E5%B7%B1%E5%8F%91%E5%B8%83%E7%9A%84%E8%AF%84%E8%AE%BA%E4%BF%A1%E6%81%AF%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/548929/B%E7%AB%99%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83%EF%BC%8C%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA%E8%87%AA%E5%B7%B1%E5%8F%91%E5%B8%83%E7%9A%84%E8%AF%84%E8%AE%BA%E4%BF%A1%E6%81%AF%E3%80%82.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

function init() {
    var append_html = '<style type="text/css">'+
	'.interaction-item__cover {'+
	' margin-top: 10px;'+
	' position: initial;'+
	' width: auto;'+
	' height: auto;'+
	'}'+
	'.interaction-item__cover div {'+
	' line-height: 24px;'+
	'}'+
	'.b-img__inner img {'+
	' line-height: 24px;'+
	' width: auto;'+
	' height: auto;'+
	'}'+
	'</style>';
	$('body').append(append_html);
}
