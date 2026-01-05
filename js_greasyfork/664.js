// ==UserScript==
// @name			去掉Google搜索的跳转
// @namespace		https://greasyfork.org/scripts/664
// @version			1.1
// @description		来源：http://www.nowamagic.net/librarys/veda/detail/389    		
// @include			*www.google.com*
// @downloadURL https://update.greasyfork.org/scripts/664/%E5%8E%BB%E6%8E%89Google%E6%90%9C%E7%B4%A2%E7%9A%84%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/664/%E5%8E%BB%E6%8E%89Google%E6%90%9C%E7%B4%A2%E7%9A%84%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	var ires = document.getElementById('ires');
	var h3s = ires.getElementsByTagName('h3');
	for (var i = 0, l = h3s.length; i < l; ++ i) {
		var h3 = h3s[i];
		var as = h3.getElementsByTagName('a');
		for (var j = 0, m = as.length; j < m; ++ j) {
			var a = as[j];
			a.removeAttribute('onmousedown');
		}
	}
}, false);
