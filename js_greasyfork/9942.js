// ==UserScript==
// @name        Kej YouTube DL Helper
// @author      DickyT
// @license     GPL version 3
// @encoding    utf-8
// @date        17/05/2015
// @modified    22/05/2015
// @include     http://kej.tw/*
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @version     0.0.6
// @description download extension for kej.tw/flvretriever
// @namespace   ytbkejhelper
// @downloadURL https://update.greasyfork.org/scripts/9942/Kej%20YouTube%20DL%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/9942/Kej%20YouTube%20DL%20Helper.meta.js
// ==/UserScript==


exportFunction(function() {
	unsafeWindow.document.getElementById('videoInfo').value = '請求中... Requesting data...';
	GM_xmlhttpRequest({
		method: 'GET',
		url: unsafeWindow.document.getElementById('linkVideoInfoURL').href,
		onload: function(data) {
			if (data.status == 200) {
				unsafeWindow.document.getElementById('videoInfo').value = data.responseText;
				unsafeWindow.getYouTubeUrl();
			}
			else {
				unsafeWindow.document.getElementById('videoInfo').value = '請求失敗 請重試 Request Fail, please try again';
			}
		}
	});
}, unsafeWindow, {defineAs: 'getVideoInfo'});

var dlAnchor = document.getElementById('linkVideoInfoURL');
dlAnchor.innerHTML = '重新請求 Request again';
unsafeWindow.window.getVideoInfo();
dlAnchor.addEventListener('click', function(e) {
	e.preventDefault();
	unsafeWindow.window.getVideoInfo();
});

var authorData = document.createElement('span');
authorData.innerHTML = '<br><a href="http://kej.tw/flvretriever/" class="tdnone">Kej\'s YouTube FLV Retriever Helper (Userscript Extension)</a> is powered by <a href="http://me.idickyt.com/" class="tdnone">Dicky Tsang</a><br>';
unsafeWindow.document.getElementsByClassName('setcenter')[0].appendChild(authorData);