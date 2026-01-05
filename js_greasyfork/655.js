// ==UserScript==
// @name        短网址快速跳转
// @namespace   http://jixun.org/
// @description 快速进入目标地址 GO!
// @version     1.0.0
// @grant       GM_xmlhttpRequest
// @run-at      document-start

/// 骑牛 CDN
// @require        http://cdn.staticfile.org/jquery/2.1.1-beta1/jquery.min.js

// ---
// @include     http://gxp.so/*
// @include     http://*.gxp.so/*
// ---
// @include     http://dd.ma/*
// @include     http://*.dd.ma/*
// ---
// @include     http://dc2.us/*
// @include     http://www.dc2.us/*
// ---
// @include     http://wzzq.me/*
// @include     http://www.wzzq.me/*
// ---
// @include     http://ref.so/*
// @include     http://www.ref.so/*
// ---
// @include     http://upan.so/*
// @include     http://www.upan.so/*
// @downloadURL https://update.greasyfork.org/scripts/655/%E7%9F%AD%E7%BD%91%E5%9D%80%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/655/%E7%9F%AD%E7%BD%91%E5%9D%80%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

console.log ('短址快速跳转 v1.0.0');

// 清 Cookie
function clearCookie () {
	var timeExpire = (new Date(0)).toGMTString();

	var cookies = document.cookie.split(';'),
		tmpCookieExchange;

	if (cookies) {
		for (var thisCookie in cookies) {
			tmpCookieExchange = thisCookie.split('=')[0];

			[	'', 
				tmpCookieExchange + '=; expires=' + timeExpire + '; path=/; domain=' + document.domain,
				tmpCookieExchange + '=; expires=' + timeExpire + '; path=/; domain=.' + document.domain,
				tmpCookieExchange + '=; expires=' + timeExpire + '; domain=.' + document.domain,
				tmpCookieExchange + '=; expires=' + timeExpire + '; domain=' + document.domain,
				tmpCookieExchange + '=; expires=' + timeExpire + '; path=/',
				tmpCookieExchange + '=; expires=' + timeExpire
			].forEach (function (setCookie) {
				document.cookie = setCookie;
			});
		}
	}
}

function getUrlParam (rawUrl) {
	var ret = {},
		rawParams = rawUrl.substr(rawUrl.indexOf("?") + 1);

	if (rawParams) {
		var qParam = rawParams.split("&");

		for (var i = 0; i < qParam.length; i++) {
			var queryStr = qParam[i].toString(),
				posEqual = queryStr.indexOf("=");
			ret[decodeURIComponent(queryStr.substr(0, posEqual))] = decodeURIComponent(queryStr.substr(posEqual + 1));
		}
	}
	return ret;
}

function reDirWithRef (targetUrl) {
	console.log ('reDirWithRef: %s', targetUrl);
	// Invalid Url
	if (!targetUrl) return ;

	clearCookie ();
	var GET = getUrlParam(targetUrl),
		form = $('<form>')
			.attr('action', targetUrl.replace(/\?.*$/, ''))
			.text('正在跳转: ' + targetUrl).prependTo(document.body)
			.css ({fontSize: 12});

	for (var g in GET)
		form.append($('<input>').attr({
			name: g,
			type: 'hidden'
		}).val(GET[g]));

	form.submit();
	return 1;
}

var host = location.host.match(/\w+\.\w+$/)[0].toLowerCase();

var _ = function () {
	return jQuery.apply ({}, arguments)[0] || document.body;
}

var $winFuncs = {};
['open', 'alert', 'confirm'].forEach (function (foo) {
	$winFuncs = unsafeWindow[foo];
	unsafeWindow[foo] = function () {
		return true;
	};
});

jQuery (function ($) {
	switch (host) {
		case 'upan.so':
		case 'gxp.so':
			reDirWithRef (_('.td_line a').href);
			break;
		case 'dd.ma':
			var $m = _('#mainframe,#btn_open a');
			if ($m) reDirWithRef ($m.src || $m.href);
			break;
		case 'dc2.us':
			reDirWithRef($('#skip_button').attr('href') || $('#mainframe').attr('src'));
			break;
		case 'wzzq.me':
			reDirWithRef(_('.wz_img_hit a').href);
			break;
		case 'ref.so':
			reDirWithRef (_('#btn_open a').href);
			break;

		default:
			console.log ('匹配域名 %s 失败, 请联系作者修正 orz', host);
	}
});