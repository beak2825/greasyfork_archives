// ==UserScript==
// @name        access_to_erep
// @namespace   eChina_Victory
// @description 用https://访问游戏时，各个功能正常
// @include     https://www.erepublik.com/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5956/access_to_erep.user.js
// @updateURL https://update.greasyfork.org/scripts/5956/access_to_erep.meta.js
// ==/UserScript==

(function(){
	// 必须载入reward.js，否则每日任务奖励无法领取
	var scriptElement = document.createElement( "script" );
	scriptElement.type = "text/javascript";
	scriptElement.src = "https://www.erepublik.com/js/citizen/reward.js";
	document.body.appendChild( scriptElement );

	// 载入recaptcha
	var scriptElement = document.createElement( "script" );
	scriptElement.type = "text/javascript";
	scriptElement.src = "https://www.google.com/recaptcha/api/js/recaptcha_ajax.js";
	document.body.appendChild( scriptElement );

	// 将所有<a> http://链接替换成https://
	var links = document.getElementsByTagName("a");
	var tl;
	for(var i = 0; i < links.length; i++) 	{
		tl = links[i];
		tl.href = tl.href.replace("http://www.erepublik.com", "https://www.erepublik.com");
	}

	// 将所有<form> http://链接替换成https://
	var forms = document.getElementsByTagName("form");
	var tf;
	for(var i = 0; i < forms.length; i++) 	{
		tf = forms[i];
		tf.action = tf.action.replace("http://www.erepublik.com", "https://www.erepublik.com");
	}

	// 无头鸡还使用了get()和post()，需要先把参数中的http替换成https，再
	// 调用正常的函数。
	var f_post = unsafeWindow.jQuery.post;
	unsafeWindow.jQuery.post = function () {
		arguments[0] = arguments[0].replace('http://www.erepublik.com', 'https://www.erepublik.com');
		f_post.apply(unsafeWindow.jQuery, arguments);
	}

	var f_get = unsafeWindow.jQuery.get;
	unsafeWindow.jQuery.get = function () {
		arguments[0] = arguments[0].replace('http://www.erepublik.com', 'https://www.erepublik.com');
		f_get.apply(unsafeWindow.jQuery, arguments);
	}

})();
