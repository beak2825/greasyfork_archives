// ==UserScript==
// @name           indicator_zarplaty
// @version        0.2
// @description:ru Адаптация скрипта индикатора зарплат под наличие знака $
// @namespace      http://virtonomic*.*/*/main/unit/view/*
// @include        http://virtonomic*.*/*/main/unit/view/*
// @exclude        http://virtonomic*.*/*/main/unit/view/*/*
// @description Адаптация скрипта индикатора зарплат под наличие знака $
// @downloadURL https://update.greasyfork.org/scripts/8425/indicator_zarplaty.user.js
// @updateURL https://update.greasyfork.org/scripts/8425/indicator_zarplaty.meta.js
// ==/UserScript==
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$=win.$;
if(!(/(?:Склад)/.test($('div.officePlace').prop('textContent')))) {
	aaa=$('tr:gt(0)>td.title:contains("Зарплата")').next();
	bbb=aaa.prop('textContent').replace("$", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
	//console.log(bbb);
	zarp = parseFloat(bbb)
	//console.log(zarp);
	var n= bbb.indexOf("$");
	//console.log("n="+n);
	var str = bbb.substr(n+1);
	//console.log(str);
	zzz = Math.round( 100*zarp/parseFloat(str) );
	//console.log(zzz);
	//zarp=bbb.match(/\d[.\s\d]*(?=\$)/g);
	//console.log("zarp="+zarp[0]);
	color=zzz<80?'red':'green';
	color=zzz>80?'blue':color;
	aaa.prop('textContent',aaa.prop('textContent') +" ----> "+zzz+'%').css('color',color).css('fontWeight',(zzz==80?'':'bold'));
	//console.log("---------");

}