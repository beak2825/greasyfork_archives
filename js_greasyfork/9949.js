// ==UserScript==
// @name           doubanmail
// @description	   用于将豆瓣中的“私信”修改为“豆邮”
// @version 	   1.01
// @namespace      Capella
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_log
// @grant          GM_getResourceURL
// @include        http://*douban.com*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9949/doubanmail.user.js
// @updateURL https://update.greasyfork.org/scripts/9949/doubanmail.meta.js
// ==/UserScript==
	
t = $('title');
t[0].innerHTML = t[0].innerHTML.replace(/ 私信/g,"我的豆邮");
t[0].innerHTML = t[0].innerHTML.replace(/私信/g,"豆邮");


t = document.getElementById("top-nav-doumail-link");
t.innerHTML = t.innerHTML.replace(/私信/g,"豆邮");

if(location.pathname.indexOf("people")!=-1){
	
	t = document.evaluate(
	"//a[@class='a-btn mr5']",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
	if(t.snapshotLength>0){
		t.snapshotItem(0).innerHTML = t.snapshotItem(0).innerHTML.replace(/私信/g,"豆邮");
	}
}
if(location.pathname.indexOf("doumail")!=-1){
	t = document.getElementsByTagName("h1");
	for(var i=0;i<t.length;i++){
		if(t[i].innerHTML.indexOf("不影响功能使用")!=-1){
			t[i].innerHTML = "我的豆邮";		
		}
	}
	t = document.getElementsByTagName("h1");
	for(var i=0;i<t.length;i++){
		t[i].innerHTML = t[i].innerHTML.replace(/私信/g,"豆邮");
	}
	t = document.evaluate(
	"//a[@class='label']",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
	if(t.snapshotLength>0)t.snapshotItem(0).innerHTML = t.snapshotItem(0).innerHTML.replace(/私信/g,"豆邮");
	t = document.evaluate(
	"//div[@class='inbox-filter-list']",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
	if(t.snapshotLength>0)t.snapshotItem(0).innerHTML = t.snapshotItem(0).innerHTML.replace(/私信/g,"豆邮");
	t = document.evaluate(
	"//div[@class='tabs']",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
	if(t.snapshotLength>0)t.snapshotItem(0).innerHTML = t.snapshotItem(0).innerHTML.replace(/私信/g,"豆邮");
	t = document.evaluate(
	"//div[@class='aside']",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
	//alert(t.snapshotLength);
	if(t.snapshotLength>0){
		t.snapshotItem(0).innerHTML = t.snapshotItem(0).innerHTML.replace(/返回私信/g,"返回我的豆邮");
		t.snapshotItem(0).innerHTML = t.snapshotItem(0).innerHTML.replace(/私信/g,"豆邮");
	}
	t = document.evaluate(
	"//div[@class='item-submit']",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
	if(t.snapshotLength>0){
		if(t.snapshotItem(0).innerHTML.indexOf("回应")!=-1){
			t.snapshotItem(0).innerHTML = '<span class="bn-flat"><input type="submit" name="m_reply" value="回信"></span>';
		}
	}
}

t = document.getElementsByTagName("script");
for(var i=0;i<t.length;i++){
	if(t[i].innerHTML.indexOf("私信")!=-1){
		t[i].innerHTML = t[i].innerHTML.replace(/私信/g,"豆邮");
	}
}
