// ==UserScript==
// @name        autoPage
// @namespace   "vinsai"
// @description auto load next page
// @include     *
// @version     1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6827/autoPage.user.js
// @updateURL https://update.greasyfork.org/scripts/6827/autoPage.meta.js
// ==/UserScript==
(function()
{
//===============================================================================
//			- Auto Page -
//===============================================================================
function autoPage(linkXPath, contentXPath) {
	var scrollY = 0;
	var index = 1;
	var linkNode = null;
	var firstRun = true;
	var linkP = null;
	var contentP = null;
	
	var btnTri = '<span style="text-align:center;border:1px solid rgb(0,0,0);background:rgba(240,240,240,0.7);padding:2px;cursor:pointer;position:fixed;left:10px;width:120px;font-size:110%;font-weight:bold" id="triggerAutoPage">Stop Auto Page</span>';
	btnTri += '<span style="text-align:center;border:1px solid rgb(0,0,0);background:rgba(0,128,64,0.7);padding:2px;position:fixed;left:10px;width:120px;font-size:110%;font-weight:bold;display:none;" id="loadNotice">Loading...</span>';
	document.body.insertAdjacentHTML('beforeEnd',btnTri);
	document.getElementById("triggerAutoPage").style.top = window.innerHeight - 45 + "px";
	document.getElementById("triggerAutoPage").style.left = window.innerWidth - 150 + "px";
	document.getElementById("loadNotice").style.top = window.innerHeight - 25 + "px";
	document.getElementById("loadNotice").style.left = window.innerWidth - 150 + "px";

	function page() {
			var srcollCurrentY = window.scrollMaxY;
			if ((srcollCurrentY > scrollY + 100)&& (srcollCurrentY < window.scrollY + 400)) {
				scrollY = srcollCurrentY;

				if (firstRun) {
					for (var i = 0; i < contentXPath.length; ++i) {
						var contentNode = document.evaluate( contentXPath[i], document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
						var result = contentNode.iterateNext();
						var preNode = result;
						while(result) {
							preNode = result;
							result = contentNode.iterateNext();
						}

						contentNode = preNode;
						if (contentNode == null) {
							continue;
						}
		
						linkNode = document.evaluate( linkXPath[i], document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
						linkNode = linkNode.iterateNext();

						/*
						result = linkNode.iterateNext();
						preNode = result;
						while (result) {
							preNode = result;
							result = linkNode.iterateNext();
						}
						linkNode = preNode;
*/
						if (linkNode != null){
							contentP = contentXPath[i];
							linkP = linkXPath[i];
							break;
						}
					}
				}
				else {
					var contentNode = document.evaluate( contentP, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
					var result = contentNode.iterateNext();
					var preNode = result;
					while(result) {
						preNode = result;
						result = contentNode.iterateNext();
					}
					contentNode = preNode;
				}
//alert(linkP + "\n" + contentP);
//alert(linkNode + "\n" + linkNode.tagName);
//alert(contentNode.tagName + "\n" + contentNode.id);
				if (linkNode == null || linkNode.tagName != "A"){
					window.onscroll = null;
					return;
				}

				var newdiv = '<div class="AppendTool" id="tool' + index + '" style="background-color:#E5E5E5;margin:5px 0px;"><div class="load" style="text-align:center;font-weight:bold;font-size:150%;"background:#E5E5E5;>Loading...</div></div>'

				contentNode.insertAdjacentHTML('afterEnd', newdiv);
				$("#loadNotice").show();

				var xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function()
				  {
				  if (xmlhttp.readyState==4 && xmlhttp.status==200)
					{
						// parse text to document
						parser = new DOMParser();  
						doc = parser.parseFromString(xmlhttp.responseText, "text/html");
	
						// find contentXPath node
						var targetNode = doc.evaluate( contentP, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
						var targetNode =targetNode.iterateNext();
						var p = contentNode.parentNode;

						// find next link node
						linkNode = doc.evaluate( linkP, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
						var result = linkNode.iterateNext();						
						var preNode = result;
						while (result) {
							preNode = result;
							result = linkNode.iterateNext();
						}
						linkNode = preNode;

/*
						if(firstRun) {
							// find header
							var header = doc.evaluate( "//head/meta", doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
							result = header.iterateNext();						
							while (result) {
								p.insertBefore(result,p.firstChild);
								break;
								result = header.iterateNext();
							}							
							/*
							var header = doc.evaluate( "//head", doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
							result = header.iterateNext();
							header = result.childNodes;

							for (var i = 0; i < header.length; ++i) {
								p.insertBefore(header[i],p.firstChild);
							}

						}

*/
//document.getElementById("gg").innerHTML
						// append after the tool
						if (targetNode,contentNode.nextSibling.nextSibling != null) {
							p.insertBefore(targetNode,contentNode.nextSibling.nextSibling);							
						}
						else {
							p.appendChild(targetNode);
						}
						// Change Notice
						var o = contentNode.nextSibling.childNodes[0].innerHTML = "Loaded";
						$("#loadNotice").hide();
						
//						document.querySelector().childNodes
//						p.removeChild(o);
						firstRun = false;
					}
				  }

				xmlhttp.open("GET",linkNode, true);
//				xmlhttp.setContentType( "text/xml" );
//				xmlhttp.setCharacterEncoding( "UTF-8" );
//				xmlhttp.setRequestHeader("Content-Type",document.contentType + "; charset=gbk" /*+ document.characterSet*/);
//				xmlhttp.setRequestHeader("Content-Type","text/html; charset=gbk");
				xmlhttp.send();

				index++;
			}
	};

	window.onscroll = page;
	
	$("#triggerAutoPage").click(function() {
		if (window.onscroll != null) {
			window.onscroll = null;
			$(this).html("Start Auto Page");
		}
		else {
			page();
			window.onscroll = page;
			$(this).html("Stop Auto Page");
		}
	});	
}

//===============================================================================
//			- Auto Page -
//===============================================================================
var linkXPath = new Array();
var contentXPath = new Array();
//Pixiv
if (location.href.match("pixiv.+[illust|bookmark|ranking].php\?.")) {
	linkXPath.push("//a[@rel='next']");
	contentXPath.push("//div[@class='two_column_body']|//div[@class='one_column_body']|//section[@class='articles autopagerize_page_element']|//section[@id='search-result']");
}
//動漫花園
if (location.href.match("share.dmhy.*")) {
	linkXPath.push("//a[contains(text(),'下一頁')]|//div[@class='clear']/div[@class='nav_title']/a");
	contentXPath.push("//div[@class='table clear' and div[1]/@class='nav_title' and div[2]/@class='clear']");
}
//極影
if (location.href.match("bt.ktxp.*")) {
	linkXPath.push("//body/div/div/div/*[(position()=count(../span[last()]/preceding-sibling::*)+3) and name()='A']");
	contentXPath.push("//div[@class='table clear' and div[1]/@class='nav_title s' and div[2]/@class='clear']");
}
//漫遊
if (location.href.match("http://share.popgo.org*")) {
	linkXPath.push("//p[@id='page']/a");
	contentXPath.push("//table[@id='index_maintable']");
}
//Google search
if (location.href.match("https://www.google.com/search*")) {
	linkXPath.push("//a[@id='pnnext']");
	contentXPath.push("//div[@id='main']");
}
//Yahoo search
if (location.href.match("http://*.*.yahoo.com/*")) {
	linkXPath.push("//a[@id='pg-next']");
	contentXPath.push("//div[@id='results']");
}
/*
//Amazon search
if (location.href.match("(http://www.amazon.co.jp/s/*)|(^https?://www\.amazon\.(?:c(?:a|o(?:m|\.(?:jp|uk)))|de|fr|cn)/(?:[^/]+/)?(?:[bs]|(?:gp|exec/obidos)/search))")) {
	linkXPath.push("//a[@id='pagnNextLink']");
	contentXPath.push('//div[@id="btfResults" and @class="list results "]|id("rightResults atfResults btfResults Results")//div[@class="listView"] |  id("rightResults atfResults btfResults Results")[not(//div[@class="listView"])]//div[@class="defaultView" or contains(@class,"result")]');
}
//dm5.com
if (location.href.match("dm5.com/*")) {
	linkXPath.push("//body/div[@class='view_fy hui6']/span[@class='view_yan2']/a");
	contentXPath.push("//div[@id='showimage']");
}*/
//9gal(PHPWind 3.X)
if (location.href.match("http://bbs.9gal.com/thread.php*")) {
	linkXPath.push("//div[@id='page']/b[1]/following-sibling::a[1]");
	contentXPath.push("//table[@class='thread1']");
}
//9gal(PHPWind 3.X)
if (location.href.match("http://bbs.9gal.com/read.php*")) {
	linkXPath.push("//div[@id='page']/b[1]/following-sibling::a[1]");
	contentXPath.push("//body");
}
//PHPWind 5.3.0 / 6.0.0 / 6.3.2 / 7.0.0 / 7.5.0 / 8.5.0 - View Forum
if (location.href.match("^https?://.+/thread\.php\?.*fid((=[0-9]+.*)|(-[0-9]+.*\.html?))$")) {
	linkXPath.push("//a[contains(text(),'«') or contains(text(),'<<')]/following-sibling::b/following-sibling::a[1][not(contains(text(),'»') or contains(text(),'>>'))]|//a[contains(text(),'«') or contains(text(),'<<')]/../following-sibling::li/b/../following-sibling::li[1]/a[not(contains(text(),'»') or contains(text(),'<<'))]");
	contentXPath.push("//table[@id='ajaxtable']|//div[@id='ajaxtable']");
}
//PHPWind 5.3.0 / 6.0.0 / 6.3.2 / 7.0.0 / 7.5.0 / 8.5.0 - View Thread
if (location.href.match("^https?://.+/read\.php\?.*tid((=[0-9]+.*)|(-[0-9]+.*\.html?))$")) {
	linkXPath.push("//a[contains(text(),'«') or contains(text(),'<<')]/following-sibling::b/following-sibling::a[1][not(contains(text(),'»') or contains(text(),'>>'))]|//a[contains(text(),'«') or contains(text(),'<<')]/../following-sibling::li/b/../following-sibling::li[1]/a[not(contains(text(),'»') or contains(text(),'<<'))]");
	contentXPath.push("//form[@name='delatc']");
}
/*
//PHPWind 8.5.0 - View Fourm
if (location.href.match("^https?://.+/thread\.php\?.*fid((=[0-9]+.*)|(-[0-9]+.*\.html?))$")) {
	linkXPath.push("//a[text()='«']/following-sibling::b/following-sibling::a[1][not(text()='»')]|//a[text()='«']/../following-sibling::li/b/../following-sibling::li[1]/a[not(text()='»')]");
	contentXPath.push("//div[@id='ajaxtable']");
}*/
//discuz 7.X / X2 View Forum
if (location.href.match("(/forum/forumdisplay.php\?.fid=)|(forum.php\?.mod=forumdisplay&fid=)|(forum-[0-9]+-[0-9]+\.html?)|(forum-[0-9]+/[0-9].html)")) {
	linkXPath.push("//a[@class='next']|//a[@class='nxt']");
	contentXPath.push("//div[@id='threadlist']");
}
//discuz 7.X / X2 View Thread
if (location.href.match("(/forum/viewthread.php\?.tid=)|(forum.php?\.mod=viewthread&tid=)|(thread-[0-9]+-[0-9]+-[0-9]+\.html?)|(thread-[0-9]+/[0-9]+-[0-9]+\.html?)")) {
	linkXPath.push("//a[@class='next']|//a[@class='nxt']");
	contentXPath.push("//div[@id='postlist']");
}
//Discuz 5.5.0 / 6.0.0 / 6.0.1 / 7.0.0 / 7.1.0 / 7.2.0 / X1 - View Forum
if (location.href.match("^https?://.+/(forumdisplay\.php\?.*fid=[0-9]+.*)|(forum-[0-9]+-[0-9]+\.html?)|(forum\.php\?.*mod=forumdisplay.*&fid=[0-9]+.*)|(digest\.php.*)|(tag\.php\?.*name=.+)|(search\.php\?.*searchid=[0-9]+.*)$")) {
	linkXPath.push("//a[@class='next']|//a[@class='p_redirect' and (text()='››')]|//a[@class='nxt']");
	contentXPath.push("//div[@class='mainbox threadlist']/form[@name='moderate']|//div[@class='mainbox threadlist']/table|//form[@name='moderate']|//div[@class='wrap']/form[@name='modactions']|//table[@class='row']|//div[@class='spaceborder']//tr[@class='row']|//div[@class='spaceborder spacebottom']//tr[@class='row']|//form[@id='moderate']|//table[@class='datatable']");
}
//Discuz 5.5.0 / 6.0.0 / 6.0.1 / 7.0.0 / 7.1.0 / 7.2.0 / X1 - View Thread
if (location.href.match("^https?://.+/((viewthread\.php\?.*tid=[0-9]+.*)|(thread-[0-9]+-[0-9]+-[0-9]+\.html?)|(forum\.php\?.*mod=viewthread.*&tid=[0-9]+.*)|(digest\.php.*)|(tag\.php\?.*name=.+)|(search\.php\?.*searchid=[0-9]+.*))$")) {
	linkXPath.push("//a[@class='next']|//a[@class='p_redirect' and (text()='››')]|//a[@class='nxt']");
	contentXPath.push("//div[@class='mainbox postlist']/form[@name='moderate']|//div[@class='mainbox postlist']/table|//form[@name='moderate']|//div[@class='wrap']/form[@name='modactions']|//table[@class='row']|//div[@class='spaceborder']//tr[@class='row']|//div[@class='spaceborder spacebottom']//tr[@class='row']|//form[@id='moderate']|//table[@class='datatable']");
}

if (linkXPath.length > 0) {
	autoPage(linkXPath, contentXPath);
}
})();