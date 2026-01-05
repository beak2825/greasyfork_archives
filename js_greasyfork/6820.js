// ==UserScript==
// @author         Eucaly61
// @version        0.8
// @name           Mobile01 Topic Highlight
// @namespace      Eucaly61
// @include        http://www.mobile01.com/*
// @description Mobile01 自動加入文章人氣。
// @downloadURL https://update.greasyfork.org/scripts/6820/Mobile01%20Topic%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/6820/Mobile01%20Topic%20Highlight.meta.js
// ==/UserScript==

// this script was originally based on http://userscripts.org/scripts/review/7671

// check latest version at http://userscripts.org/scripts/show/42879

/*

version history

v0.8 on 2012-04-29
* 1st release

*/
///// preference section /////

var myHighLights = [
{bgcolor: '#e0ffe0', keys: ['家電綜合','居家綜合','空間設計與裝潢','木工DIY']},		/* 淺綠 */
{bgcolor: '#f0f0ff', keys: ['庭院園藝樂','消費經驗分享']},			/* 淺藍 */
{bgcolor: '#fffff0', keys: ['桃園縣','商品買賣']}		/* 淺黃 */
];

var showTitle = true;
//var showTitle = false;

var titleColor = '#A0A0A0';

var debugLevel = 0;

///// code section /////

var alltags = document.getElementsByClassName('tablelist forumlist');

for(var t=0;t<alltags.length;t++){

	o=alltags[t];
	tr_rows = o.getElementsByTagName('tr');	

if (debugLevel>0) {
GM_log('rows: ' + tr_rows.length);  
}	
	for (var j=0;j<tr_rows.length;j++) {
		tr_this = tr_rows[j];
if (debugLevel>0) {
GM_log('loop: ' + j);
}
		td_subject = tr_this.getElementsByClassName('subject')[0];
		a_topics =  td_subject.getElementsByClassName('topic_gen');

		for (var p=0;p<a_topics.length;p++) {
        a_this = a_topics[p];
if (debugLevel>=2) {
GM_log(a_this.innerHTML);
GM_log(a_this.title);
}
		if (showTitle) 
			td_subject.innerHTML += '<span style="color:' + titleColor + ';">　[ ' + a_this.title + ' ]</span>';
		
		for (var n in myHighLights) {
			keys = myHighLights[n].keys;
			bgcolor = myHighLights[n].bgcolor;
			for (var k in keys) {
				if  (a_this.title.search(keys[k])>=0) {
if (debugLevel>0) {
GM_log(a_this.innerHTML);
GM_log(a_this.title);
GM_log(bgcolor + ' / ' + keys[k]);
}
					tr_this.style.backgroundColor	= bgcolor;
					break;
if (debugLevel>=3) {
GM_log(tr_this.style);
GM_log(tr_this.innerHTML);
}
				}
			}
		}
      }
   }
}
