// ==UserScript==
// @name        ustAllDownload
// @author  网络孤独行客
// @description  批量下载香港科技大学提供的香港天文台天气图
// @namespace   http://envf.ust.hk/
// @include     http://envf.ust.hk/*
// @version     1.0
// @grant		GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5603/ustAllDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/5603/ustAllDownload.meta.js
// ==/UserScript==

;(function(){
	var ajaxCount = 0;
	var nodeLength;
	
 	function GM_Ajax(link){
		GM_xmlhttpRequest({
		  method: "GET",
		  url: link.getAttribute("href"),
		  onload: function(response) {
			response.responseText.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
				link.setAttribute("href",capture);
				var p = link.parentNode.parentNode.parentNode;
				p = p.querySelector("small").innerHTML;
				link.setAttribute("download",p+".gif");
				ajaxCount += 1; 
				ajaxCount == nodeLength && downloadAll();
			});
		  }
		});
	} 
	
	function downloadAll(){
		var h3 = document.querySelector("h3");
		h3.innerHTML += "<b style='color:red'>点击这里下载全部大图</b>";
		h3.addEventListener("click",function(){
			var aNodelist = document.querySelectorAll("#icons a");
			var forEach = Array.prototype.forEach;
			forEach.call(aNodelist, function(link){
				link.click();
			});
		},false);
	}

	var target = document.querySelector("#icons");
	var MutationObserver = window.MutationObserver || window.MozMutationObserver;
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			var aNodelist = document.querySelectorAll("#icons a");
			nodeLength = aNodelist.length;
			var forEach = Array.prototype.forEach;
			forEach.call(aNodelist, function(link){
				GM_Ajax(link);
			});
		});    
	});
	var config = { attributes: true, childList: true, characterData: true };
	observer.observe(target, config);
})();