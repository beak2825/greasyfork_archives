// ==UserScript==
// @name            防止支付宝转账给其他人
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			0.3
// @description     支付宝转账默认页居然是历史列表…… 很容易转错啊
// @require         http://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @include         https://shenghuo.alipay.com/send/payment*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/6891/%E9%98%B2%E6%AD%A2%E6%94%AF%E4%BB%98%E5%AE%9D%E8%BD%AC%E8%B4%A6%E7%BB%99%E5%85%B6%E4%BB%96%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/6891/%E9%98%B2%E6%AD%A2%E6%94%AF%E4%BB%98%E5%AE%9D%E8%BD%AC%E8%B4%A6%E7%BB%99%E5%85%B6%E4%BB%96%E4%BA%BA.meta.js
// ==/UserScript==

	var j = jQuery.noConflict();
j("#ipt-search-key").val("173784276@qq.com");