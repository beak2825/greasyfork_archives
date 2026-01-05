// ==UserScript==
// @id             demo_XuiteDownloader
// @name           XuiteDownloader
// @namespace      demoshop
// @description    專為 Xuite 網路硬碟下載頁面設計可以不需要按廣告就下載
// @include        http://webhd.xuite.net/_oops/*
// @include        http://sync.hamicloud.net/_oops/*
// @exclude        http://webhd.xuite.net/*@*	
// @version        2.0-個人修改版
//
// @downloadURL https://update.greasyfork.org/scripts/6824/XuiteDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/6824/XuiteDownloader.meta.js
// ==/UserScript==
(function(){

var $jq;

function init(){
	$jq = unsafeWindow.jQuery;
	if(typeof $jq == 'undefined' || $jq("#global").data() == null){
		unsafeWindow.setTimeout(init, 100);
	}
	else{
		openADframe();
		clickDownloadButton();
		setDelayTime();
	}
}

function openADframe(){
	$jq('#footer').after("<iframe id='showAD' width='0' height='0'></iframe>");
	$jq('#showAD').attr('src', $jq('#share-download-ad a').attr('href'));
}

function clickDownloadButton(){
	unsafeWindow.isClick = 1;
	$jq('#global').data('isClick', 1);
	unsafeWindow.setTimeout(function(){
		$jq('#share-download-func-submit').click();
	}, 800);
}

function setDelayTime(){
	if($jq('#delayTime').length > 0){
		unsafeWindow.setTimeout(function(){
			$jq("#global").data("time", 10);
		}, 800);
	}
}

init();

})();