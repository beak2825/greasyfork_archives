// ==UserScript==
// @name         华师教学质量评价一键填充
// @version      0.1
// @encoding	 utf-8
// @description  适用于华南师范大学教务系统jwc.scnu.edu.cn,其他正方教务系统请自测
// @author       jjm2473@qq.com
// @match        http://jwc.scnu.edu.cn/xsjxpj.aspx*
// @run-at       document-end
// @namespace https://greasyfork.org/users/7518
// @downloadURL https://update.greasyfork.org/scripts/6917/%E5%8D%8E%E5%B8%88%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%AF%84%E4%BB%B7%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/6917/%E5%8D%8E%E5%B8%88%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%AF%84%E4%BB%B7%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function(){
	var optionsv=["","1(完全不同意)","2(基本不同意)","3(不表态）","4(基本同意)","5(完全同意)"];
	var select=document.createElement("select");
	select.onchange=function(){
		jQuery("select:[name^=DataGrid]").val(select.value);
	};
	optionsv.forEach(function(v){
		var o=document.createElement("option");
		o.value=v;
		o.text=v;
		select.appendChild(o);
	});
	var pjkc=document.getElementsByName('pjkc')[0];
	pjkc && pjkc.parentElement.insertBefore(select,pjkc.nextSibling);
})();
