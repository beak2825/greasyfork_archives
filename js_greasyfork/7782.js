// ==UserScript==
// @name        东东空间CSS助手
// @author      枫谷剑仙
// @namespace   http://www.mapaler.com/
// @description 让动漫东东空间CSS可自定义
// @icon        http://www.mapaler.com/images/comicdd_logo_64x48.png
// @include     http://*/*space*diy=yes*
// @run-at      document-end
// @version     1.0.1
// @date        29/1/2015
// @modified    29/1/2015
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7782/%E4%B8%9C%E4%B8%9C%E7%A9%BA%E9%97%B4CSS%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/7782/%E4%B8%9C%E4%B8%9C%E7%A9%BA%E9%97%B4CSS%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function (){
	var pdiv = document.getElementById("controlnav");
	var navcssc = document.createElement('li'); //顶部列表
	navcssc.id = 'navcssc';
		//输入框
		var cssinput = document.createElement('input');
		cssinput.value = document.getElementById('diy_style').innerHTML;
		cssinput.className="px vm";
		cssinput.style.cssText = [
				 ''
		,'font-size:12px'
		,'padding:2px'
				,''
		].join(';');
		cssinput.id = 'cssinput';
		//提交按钮
		var cssbutton = document.createElement('button');
		cssbutton.className="pn";
		cssbutton.style.cssText = [
				 ''
				,'top:0px'
				,''
		].join(';');
		cssbutton.onclick= function(e){
			var mycss = document.getElementById('cssinput').value;
			document.getElementById('diy_style').innerHTML = mycss;
			spaceDiy.save = function () {
			  drag.clearClose();
			  document.diyform.spacecss.value = mycss;
			  document.diyform.style.value = this.style;
			  document.diyform.layoutdata.value = drag.getPositionStr();
			  document.diyform.currentlayout.value = this.currentLayout;
			  document.diyform.submit();
			}
		}
		cssbutton.innerHTML = "设置CSS";
		cssbutton.id = 'sumbitbg_button';
	navcssc.appendChild(cssinput);
	navcssc.appendChild(cssbutton);
	pdiv.appendChild(navcssc);
})();