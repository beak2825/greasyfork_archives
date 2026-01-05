// ==UserScript==
// @name           MAGgogo
// @description    MAG磁力站快速切换
// @include        http://cili1*.com/*
// @include        http://oabt*.com/*
// @include        http://www.cili1*.com/*
// @icon           http://imgsrc.baidu.com/forum/pic/item/6fd108fb43166d229cb84fac452309f79152d2e2.png
// @author         congxz6688
// @version        2018.3.28.0
// @grant          unsafeWindow
// @namespace https://greasyfork.org/users/39
// @downloadURL https://update.greasyfork.org/scripts/8023/MAGgogo.user.js
// @updateURL https://update.greasyfork.org/scripts/8023/MAGgogo.meta.js
// ==/UserScript==


//此处供用户添加美剧的名称
//中英文名皆可，英文单词之间别用空格用小写的点，每个剧名都要用小写的双引号括起来，相互之间用小写的逗号隔开
var addByUser = ["群英.Clique", "天赋异禀.The.Gifted", "零异频道", "路西法", "天蝎", "致命武器", "罪恶黑名单", "Elementary", "僵尸国度", "冰血暴", "行尸之惧", "女作家", "传教士", "MacGyver", "Deception", "福尔摩斯探案集",  "两世奇人", "全境通告", "沉默天使", "贵族侦探"];

/**********************以下部分不要随意修改**********************/
function addStyle(css) {
	document.head.appendChild(document.createElement("style")).textContent = css;
}

var signCSS = "";
signCSS += ".link-list-wrapper{float:none !important; margin:0 auto !important} .useColor{color:#000000;} .gogoTd{line-height:22px; padding:0px 8px;} .gogo{text-decoration:none} .gogo:hover{text-decoration:underline}";
signCSS += "#floatGogo{border:1px solid grey; z-index:999; padding:8px 6px; background-color:white; color: blue;}";
signCSS += "#MAG_gogo{cursor:pointer; color:#000000; background_color:grey; height:28px; width:30px; padding:1px 3px 9px 5px; position:fixed; top:200px; left:2px; z-index:99999; border: solid 1px #000000;}"
addStyle(signCSS);

//函数 绝对定位
function getElementLeft(element) {
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while (current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}
//函数 绝对定位
function getElementTop(element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while (current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}
var Tds1 = [];
//建表函数
function creaseTable(UrlLength) {
	Tds1 = [];
	cons = 2;
	var tablepp = document.createElement("table");
	tablepp.setAttribute("width", "100%");
	var trs = [];
	for (ly = 0; ly < Math.ceil(UrlLength / cons); ly++) {
		var tr = document.createElement("tr");
		mmd = trs.push(tr);
		tablepp.appendChild(tr);
	}
	for (ls = 0; ls < UrlLength; ls++) {
		var td = document.createElement("td")
			td.setAttribute("class", "gogoTd");
		wq = Tds1.push(td);
		trs[Math.floor(ls / cons)].appendChild(td);
	}
	return tablepp
}

//悬浮列表窗创建函数http://oabt004.com/index/index?c=&k=%E5%A4%A9%E8%9D%8E
function openGogoList(e) {
	if (!document.getElementById("floatGogo")) {
		if (e.target.id == "MAG_gogo") {
			var jjue = e.target;
			var thisTop = getElementTop(jjue) + 25;
		}
		var thisLeft = getElementLeft(jjue);
		addStyle("#floatGogo{position:" + ((e.target.id == "MAG_gogo") ? "fixed" : "absolute") + "; left:" + thisLeft + "px; top:" + (thisTop+2) + "px}");
		var floatGogo = document.createElement("div");
		floatGogo.id = "floatGogo";
		var fTable = creaseTable(addByUser.length);
		floatGogo.appendChild(fTable);
		if (addByUser.length > 0) {
			for (vv = 0; vv < addByUser.length; vv++) {
				var anch = document.createElement("a");
				anch.href = "http://" + window.location.host + "/index?c=&k=" + addByUser[vv];
				anch.title = addByUser[vv];
				anch.className = "gogo";
				anch.target = "_blank";
				anch.innerHTML = '<fon class="useColor">' + addByUser[vv] + '</fon>';
				Tds1[vv].appendChild(anch);
			}
		}
		floatGogo.addEventListener("mouseleave", closeGogoList, false)
		document.body.appendChild(floatGogo);
	}
}
function closeGogoList() {
	document.getElementById("floatGogo").parentNode.removeChild(document.getElementById("floatGogo"));
}

//创建按钮
var gogoDiv = document.createElement("div");
gogoDiv.innerHTML = "go";
gogoDiv.id = "MAG_gogo";
gogoDiv.addEventListener("mouseover", openGogoList, false);
gogoDiv.addEventListener("click", function () {
	window.location = "http://" + window.location.host + "/";
}, false);
document.body.appendChild(gogoDiv);

//剧集右侧的快速下载链接
if (document.getElementsByClassName("link-list")) {
	var allDDs = document.querySelectorAll(".link-list>li");
	for (var i = 0; i < allDDs.length; i++) {
		var ed2k = allDDs[i].getAttribute("data-ed2k");
		var magnet = allDDs[i].getAttribute("data-magnet");
		var spp = document.createElement("span");
		var cm = document.createElement("a");
		cm.className = "cm";
		cm.href = magnet;
		cm.innerHTML = "[MEG]"
			spp.appendChild(cm);
		var ce = document.createElement("a");
		ce.className = "ce";
		ce.href = ed2k;
		ce.innerHTML = "[ed2k]"
			spp.appendChild(ce);
		allDDs[i].appendChild(spp);
	}
}