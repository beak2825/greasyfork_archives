// ==UserScript==
// @name        sg farmkit
// @namespace   com.sgamer.bbs.farmkit
// @description SG伐木助手
// @include     http://bbs.sgamer.com/forum-*.html
// @include     http://bbs.sgamer.com/thread-*.html
// @include     http://bbs.sgamer.com/*mod=viewthread*
// @include     http://bbs.sgamer.com/*mod=forumdisplay*
// @version     3.3.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7268/sg%20farmkit.user.js
// @updateURL https://update.greasyfork.org/scripts/7268/sg%20farmkit.meta.js
// ==/UserScript==

var devmode = false;
if (devmode) {
	var timestamp = new Date();
}

// iframe不会触发
if (window == window.top) {

var pcrr = {
	"枪": "&#x67AA;",
	"弹": "&#x5F39;",
	"性": "&#x6027;",
	"毒": "&#x6BD2;",
	"裸": "&#x88F8;",
	"仇": "&#x4EC7;",
	"奸": "&#x5978;",
	"淫": "&#x6DEB;",
	"毛": "&#x6BDB;",
	"邓": "&#x9093;",
	"江": "&#x6C5F;",
	"胡": "&#x80E1;",
	"习": "&#x4E60;",
	"泡面": "&#x6CE1;&#x9762;",
	"鸡巴": "&#x9E21;&#x5DF4;",
	"进口": "&#x8FDB;&#x53E3;",
	"轮子": "&#x8F6E;&#x5B50;",
	"电棍": "&#x7535;&#x68CD;"
}

var rrr = {
	"(不共戴天之|复|报)\\*": "$1仇",
	"(显示器)\\*\\*": "$1杀手",
	"\\*(幕)": "弹$1",
	"(躺|火)\\*": "$1枪",
	"(核|炸)\\*": "$1弹",
	"(剧|为什么这么)\\*": "$1毒",
	"(意)\\*": "$1淫",
	"(汉)\\*": "$1奸",
	"(练)\\*": "$1习",
	"\\*(情|格|感|别|取向|质)": "性$1",
	"\\*(龙|镖|瘤|奶|狗|素)": "毒$1",
	"\\*(恨)": "仇$1",
	"\\*(照)": "裸$1",
	"\\*(妇|荡)": "淫$1",
	"\\*(臣)": "奸$1",
	"\\*(苏|湖|西)": "江$1",
	"(瞎)\\*\\*": "$1鸡巴",
	"\\*(惯)": "习$1",
	"\\*\\*(妈)": "轮子$1",
	"(任|可能|世界|历史|人|个|男|女|属|理|局限|专业|进攻|本|选择|关键|重要|习惯|灵|观赏|记|惰|理|品|惯|秉|魔)\\*": "$1性",
	"电\\*\\*棍": "电棍",
	"信\\*\\*仰": "信仰",
	"命\\*\\*运": "命运"
}

var fastFormNames = ["fastpostform", "vfastpostform"];

function createCommentButtonByReplyButton(fastre) {
	var a = document.createElement("a");
	a.className = "cmmnt";
	var tid = fastre.href.match(/tid=[0-9]+/);
	var pid = fastre.href.match(/repquote=[0-9]+/)[0].replace("repquote","pid");
	a.setAttribute("onclick", 
		"showWindow('comment', this.href, 'get', 1);\n" +
		"setTimeout(function () {\n" +
			"var commentform = document.getElementById(\"commentform\");\n" +
			"var action = commentform.action;\n" +
			"action = action.replace(/tid=[0-9]+/, \"" + tid + "\");\n" +
			"action = action.replace(/pid=[0-9]+/, \"" + pid + "\");\n" +
			"commentform.action = action;\n" +
		"}, 500);"
	);
	a.href = "forum.php?mod=misc&action=comment&tid=12360082&pid=30553315&extra=page%3D1&page=1";
	a.appendChild(document.createTextNode("点评"));
	return a;
}

function createImageString(uri) {
	return "[img]" + uri + "[/img]";
}

// 回复主题
function fastfarm(replyStr) {
	if (getCookie("SG_farmkit_ifPostTimeLimit")) {
		onNeedMoreTime();
		return;
	}
	document.getElementById("fastpostmessage").value = precensore(recoverText(replyStr));
	setTimeLimit();
	document.getElementById("fastpostform").submit();
}

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) { 
			c_start = c_start + c_name.length + 1 ;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start, c_end));
		} 
	}
	return "";
}

function isParent(obj, parentObj){
	while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
		if (obj == parentObj){
			return true;
		}
		obj = obj.parentNode;
	}
	return false;
}

function onNeedMoreTime() {
	if (document.getElementById('ntcwin')) {
		var ntcwin = document.getElementById('ntcwin');
	} else {
		var ntcwin = document.createElement('div');
		ntcwin.id = "ntcwin";
		ntcwin.className = "popuptext";
		ntcwin.style.cssText = "position: fixed; z-index: 501; left: 466.5px; top: 30px; display: none;";
		document.getElementById("append_parent").appendChild(ntcwin);
		var table = document.createElement("table");
		table.className = "popupcredit";
		table.cellspacing = "0";
		table.cellpadding = "0";
		ntcwin.appendChild(table);
		var tr = document.createElement("tr");
		table.appendChild(tr);
		var tdl = document.createElement("td");
		tdl.className = "pc_l";
		tr.appendChild(tdl);
		var tdc = document.createElement("td");
		tdc.className = "pc_c";
		tr.appendChild(tdc);
		var tdr = document.createElement("td");
		tdr.className = "pc_r";
		tr.appendChild(tdr);
		var div_inner = document.createElement("div");
		div_inner.className = "pc_inner";
		tdc.appendChild(div_inner);
		var i_text = document.createElement("i");
		i_text.innerHTML = "抱歉，您两次发表间隔少于 15 秒，请稍候再发表";
		div_inner.appendChild(i_text);
	}
	document.getElementById('ntcwin').style.display = "block";
	setTimeout(function () {
		document.getElementById('ntcwin').style.display = "none";
	}, 2500);
}

function precensore (str) {
	if (str) {
		for (var ch in pcrr) {
			str = str.replace(new RegExp(ch, "ig"), pcrr[ch]);
		}
	}
	if (str.length < 10) {
		str = str + "          ";
	}
	return str;
}

function precensoreFastForm(formName) {
	var form = document.getElementById(formName);
	if (form) {
		form.onsubmit = function (e) {
			this.message.value = parseurl(precensore(this.message.value));
			setTimeLimit();
			ajaxpost(formName, 'return_reply', 'return_reply', 'onerror');
			return false;
		}
	}
}

function recoverText (str) {
	if (str) {
		for (var ch in rrr) {
			str = str.replace(new RegExp(ch, "ig"), rrr[ch]);
		}
	}
	return str;
}

function replaceFace(e) {
	var nodes = e.childNodes;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeName && nodes[i].nodeName.toLowerCase() == "img") {
			var smilieid = nodes[i].getAttribute("smilieid");
			if (smilieid >= 85 && smilieid <= 137) {
				e.replaceChild(document.createTextNode("{:" + smilieid + ":}"), nodes[i]);
			} else if (smilieid >= 343 && smilieid <= 419) {
				e.replaceChild(document.createTextNode("{:6_" + smilieid + ":}"), nodes[i]);
			} else if (smilieid == 169 || smilieid == 177 || smilieid == 170 || smilieid == 178) {
				e.replaceChild(document.createTextNode("{:3_" + smilieid + ":}"), nodes[i]);
			} else if (smilieid >= 171 && smilieid <= 176 || smilieid >= 179 && smilieid <= 181) {
				e.replaceChild(document.createTextNode("{:7_" + smilieid + ":}"), nodes[i]);
			} else if (smilieid >= 168 && smilieid <= 276) {
				e.replaceChild(document.createTextNode("{:5_" + smilieid + ":}"), nodes[i]);
			} else {
				e.replaceChild(document.createTextNode("[img=" + nodes[i].width + "," + nodes[i].height + "]" + nodes[i].src + "[/img]"), nodes[i]);
			}
		}
	}
}

function setCookie (c_name, value, expiresecs) {
	var exdate = new Date();
	exdate.setSeconds(exdate.getSeconds() + expiresecs);
	document.cookie = c_name + "=" + escape(value) + ((expiresecs == null) ? "" : ";expires=" + exdate.toGMTString());
}

function setTimeLimit() {
	setCookie("SG_farmkit_ifPostTimeLimit", "1", 16);
}

if (new String(window.location).match("http://bbs.sgamer.com/forum-") || new String(window.location).match("mod=forumdisplay")) {
// 主题列表也处理开始

window.previewFastFarm = function (tid, message) {
	var form = document.getElementById("vfastpostform_" + tid);
	var input = document.getElementById("vmessage_" + tid);
	if (getCookie("SG_farmkit_ifPostTimeLimit")) {
		onNeedMoreTime();
		return;
	}
	input.value = precensore(recoverText(message));
	setTimeLimit();
	form.getElementsByTagName("button")[0].click();
}

window.previewThread = function(tid, tbody) {
	if(!$('threadPreviewTR_'+tid)) {
		appendscript(JSPATH + 'forum_viewthread.js?' + VERHASH);

		newTr = document.createElement('tr');
		newTr.id = 'threadPreviewTR_'+tid;
		newTr.className = 'threadpre';
		$(tbody).appendChild(newTr);
		newTd = document.createElement('td');
		newTd.colSpan = listcolspan;
		newTd.className = 'threadpretd';
		newTr.appendChild(newTd);
		newTr.style.display = 'none';

		previewTbody = tbody;
		previewTid = tid;

		newTd.innerHTML += '<div id="threadPreview_'+tid+'"></div>';
		ajaxget('forum.php?mod=viewthread&tid='+tid+'&from=preview', 'threadPreview_'+tid, null, null, null, function() {
			newTr.style.display = '';
			var dls = document.getElementById("threadPreview_" + tid).getElementsByTagName("dl");
			for (var i = 0; i < dls.length; i++) {
				var msg = null;
				var tds = dls[i].getElementsByTagName("td");
				for (var j = 0; j < tds.length; j++) {
					if (new String(tds[j].id).match("postmessage_")) {
						msg = tds[j].textContent;
					}
				}
				if (msg) {
					var spans = dls[i].getElementsByTagName("span");
					for (var k = 0; k < spans.length; k++) {
						if (spans[k].className == "y xw0") {
							var a = document.createElement("a");
							a.innerHTML = "复制伐木";
							a.style.cursor = "pointer";
							a.tid = tid;
							a.message = msg;
							a.onclick = function () {
								previewFastFarm(this.tid, this.message);
							}
							spans[k].insertBefore(a, spans[k].childNodes[0]);
						}
					}
				}
			}
		});
	} else {
		$(tbody).removeChild($('threadPreviewTR_'+tid));
		previewTbody = previewTid = null;
	}
}

// 主题列表页处理结束
} else if ((new String(window.location).match("http://bbs.sgamer.com/thread-") || new String(window.location).match("mod=viewthread"))) {
// 回帖页处理开始


// 回复栏和快速回复栏
(function () { 
	for (var i = 0; i < fastFormNames.length; i++) {
		precensoreFastForm(fastFormNames[i]);
	}
})();

// 侧边栏弹出回复栏
(function () { 
	document.getElementById("scrolltop").getElementsByTagName("a")[0].onclick = function () {
		showWindow('reply', this.href);
		setTimeout(function () {
			precensoreFastForm("postform");
		}, 500);
		return false;
	}
})();

// 页面标题
(function () {
	var tt = document.title;
	document.title = recoverText(tt);
})();

// 主题标题
(function () {
	var ih = document.getElementById("thread_subject").innerHTML;
	document.getElementById("thread_subject").innerHTML = recoverText(ih);
})();

// 帖子顶栏、内容和底部
(function () {
	var postlist = document.getElementById("postlist");
	if (postlist == null) {
		return;
	}
	var postNodes = postlist.childNodes;
	for (var i = 0, isReply = 0; i < postNodes.length; i++) {
		var postNode = postNodes[i];

		if (postNode && 
			postNode.getAttribute && 
			postNode.getAttribute("id") && 
			postNode.getAttribute("id").match("post_")) {
			var tds = postNode.getElementsByTagName("td");
			for (var k = 0; k < tds.length; k++) {
				// 内容
				if (tds[k].id && tds[k].id.match("postmessage_")) {
					tds[k].innerHTML = recoverText(tds[k].innerHTML);
				}
			}
			var fastre = null;
			var as = postNode.getElementsByTagName("a");
			var asLength = as.length;
			for (var k = 0; k < asLength; k++) {
				if (as[k].className == "fastre") {
					fastre = as[k];
					// 底部，撅腚领域功能，使用会被封
					//var firstNode = fastre.parentNode.getElementsByTagName("a")[0];
					//if (firstNode.className != "cmmnt" && fastre.href.match(/repquote=[0-9]+/))
					//{
					//	fastre.parentNode.insertBefore(createCommentButtonByReplyButton(fastre), fastre);
					//}
				}
			}
			// 顶部
			// 复制伐木
			if (isReply == 1) {
				var divs = postNode.getElementsByTagName("div");
				for (var j = 0; j < divs.length; j++) {
					if (divs[j].className == "authi" && divs[j].parentNode.className == "pti") {
						var span = document.createElement("span");
						span.className = "pipe";
						span.innerHTML = "|";
						span.style.cssFloat = "right";
						span.style.lineHeight = "16px";
						span.style.margin = "0px 2px";
						divs[j].appendChild(span);
						divs[j].appendChild(document.createTextNode("\n"));
						var farmArchor = document.createElement("a");
						farmArchor.innerHTML = "复制伐木";
						farmArchor.style.color = "green";
						farmArchor.style.cursor = "pointer";
						farmArchor.style.cssFloat = "right";
						farmArchor.style.lineHeight = "16px";
						farmArchor.style.padding = "0px 6px";
						divs[j].appendChild(farmArchor);
						farmArchor.divPElement = divs[j];
						farmArchor.onclick = function () {
							if (getCookie("SG_farmkit_ifPostTimeLimit")) {
								onNeedMoreTime();
								return false;
							}
							var postText = "伐木伐木";
							var tds = this.divPElement.parentNode.parentNode.parentNode.getElementsByTagName("td");
							for (var k = 0; k < tds.length; k++) {
								if (tds[k].getAttribute("id").match("postmessage_")) {
									replaceFace(tds[k]);
									postText = (tds[k].innerText || tds[k].textContent || tds[k].text || "").replace(/^\s*/g, "");
									if (postText[0] == "\n") {
										postText = postText.slice(1);
									}
									break;
								}
							}
							fastfarm(postText);
							return false;
						}
					}
				}
			} else {
				var divs = postNode.getElementsByTagName("div");
				for (var j = 0; j < divs.length; j++) {
					if (divs[j].className == "authi" && divs[j].parentNode.className == "pti") {
						var span = document.createElement("span");
						span.className = "pipe";
						span.innerHTML = "|";
						span.style.cssFloat = "right";
						span.style.lineHeight = "16px";
						span.style.margin = "0px 2px";
						divs[j].appendChild(span);
						divs[j].appendChild(document.createTextNode("\n"));
						var farmArchor = document.createElement("a");
						farmArchor.innerHTML = "复制伐木";
						farmArchor.style.cssText = "color: green; cursor: pointer; float: right; line-height: 16px; padding: 0px 6px; -moz-user-select:none; -webkit-user-select:none; user-select:none;";
						divs[j].appendChild(farmArchor);
						divs[j].parentNode.parentNode.style.cssText = "overflow-x: visible; overflow-y: visible;";
						farmArchor.divPElement = divs[j];
						farmArchor.onclick = function () {
							if (getCookie("SG_farmkit_ifPostTimeLimit")) {
								onNeedMoreTime();
								return false;
							}
							var postText = "伐木伐木";
							var tds = this.divPElement.parentNode.parentNode.parentNode.getElementsByTagName("td");
							var selection = window.getSelection();
							var selectionText;
							if (selection != null && !selection.isCollapsed) {
								var focusNode = selection.focusNode;
								var focusOffset = selection.focusOffset;
								var anchorNode = selection.anchorNode;
								var anchorOffset = selection.anchorOffset
								replaceFace(selection.anchorNode.parentNode);
								selection.collapse(anchorNode, anchorOffset);
								selection.extend(focusNode, focusOffset);
								selectionText = selection.toString();
							}
							if (selectionText != null && selectionText.length > 0) {
								postText = selectionText;
								fastfarm(postText);
								return false;
							}
							for (var k = 0; k < tds.length; k++) {
								if (tds[k].getAttribute("id").match("postmessage_")) {
									replaceFace(tds[k]);
									postText = (tds[k].innerText || tds[k].textContent || tds[k].text || "")
										.replace(/(^\s*)|(\s*$)/g, "").split("\n").pop();
									if (postText[0] == "\n") {
										postText = postText.slice(1);
									}
									break;
								}
							}
							fastfarm(postText);
							return false;
						}
					}
				}
				isReply = 1;
			}
		}
	}
})();

//签名复制
(function () {
	var signs = document.getElementsByClassName("sign");
	for (var i = 0; i < signs.length; i++)
	{
		var signImages = signs[i].getElementsByTagName("img");
		var signText = (signs[i].innerText || signs[i].textContent || signs[i].text || "").replace(/^\s*/g, "");
		if (signImages.length > 0)
		{
			var imageCopy = document.createElement("a");
			imageCopy.innerHTML = "复制签名图片";
			imageCopy.style.color = "green";
			imageCopy.style.cursor = "pointer";
			imageCopy.style.cssFloat = "right";
			imageCopy.style.lineHeight = "16px";
			imageCopy.style.padding = "0px 6px";
			imageCopy.signImages = signImages;
			signs[i].appendChild(imageCopy);
			imageCopy.onclick = function () {
				if (getCookie("SG_farmkit_ifPostTimeLimit")) {
					onNeedMoreTime();
					return false;
				}
				var imgStr = "";
				for (var j = 0; j < this.signImages.length; j++)
				{
					imgStr = imgStr + "[img=" + this.signImages[j].width + "," + this.signImages[j].height + "]" + this.signImages[j].src + "[/img]";
				}
				fastfarm(imgStr);
			}
		}
		if (signText)
		{
			var textCopy = document.createElement("a");
			textCopy.innerHTML = "复制签名文字";
			textCopy.style.color = "green";
			textCopy.style.cursor = "pointer";
			textCopy.style.cssFloat = "right";
			textCopy.style.lineHeight = "16px";
			textCopy.style.padding = "0px 6px";
			textCopy.signText = signText;
			signs[i].appendChild(textCopy);
			textCopy.onclick = function () {
				if (getCookie("SG_farmkit_ifPostTimeLimit")) {
					onNeedMoreTime();
					return false;
				}
				fastfarm(this.signText);
			}
		}
	}
})();

// 回帖页处理结束
}

// iframe不会触发
}


if (devmode) {
	alert("耗时：" + (new Date().getTime() - timestamp.getTime()) + "毫秒");
}