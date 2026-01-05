// ==UserScript==
// @name         GoTo115
// @namespace    http://bbs.fuli.ba/?fromuser=benbenben
// @version      0.2
// @description  选择115礼包码后直接打开接收界面
// @author       benbenben
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9545/GoTo115.user.js
// @updateURL https://update.greasyfork.org/scripts/9545/GoTo115.meta.js
// ==/UserScript==

var $imgLink = "http://ww3.sinaimg.cn/mw690/61ceb008jw1ereg3uqk73j206e06eq2s.jpg";
var $goTo115LB = function(eleGotoUI, eleContainer) {
    var re = /5lb[a-z0-9]{5,9}/ig;
	var eleTitle = document.getElementsByTagName("title")[0];
	eleContainer = eleContainer || document;
	var funGetSelectTxt = function() {
		var txt = "";
		if(document.selection) {
			txt = document.selection.createRange().text;	// IE
		} else {
			txt = document.getSelection();
		}
        return txt.toString();
	};
	eleContainer.onmouseup = function(e) {
		e = e || window.event;
		var txt = funGetSelectTxt(), sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		var left = (e.clientX - 40 < 0) ? e.clientX + 20 : e.clientX - 40, top = (e.clientY - 40 < 0) ? e.clientY + sh + 20 : e.clientY + sh - 40;
		if (re.test(txt)) {
			eleGotoUI.style.display = "inline";
			eleGotoUI.style.left = left + "px";
			eleGotoUI.style.top = top + "px";
		} else {
			eleGotoUI.style.display = "none";
		}
	};
	eleGotoUI.onclick = function() {
		var txt = funGetSelectTxt();
		if (txt) {
            var lbs = txt.match(re);
            if (lbs) {
                for (var x in lbs) {
                    window.open('http://115.com/lb/' + lbs[x]);
                }
            }
		}
	};
};

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

function init() {
    addGlobalStyle('.img_115_logo{display:none; position:absolute; cursor:pointer; z-index: 100;}');
    var logo = document.createElement("p");
    logo.innerHTML = '<img width="26px" height="26px" id="img115Logo" class="img_115_logo" title="打开礼包文件" src="' + $imgLink + '" />';
    document.body.insertBefore(logo, document.body.firstChild);
}

init();
$goTo115LB(document.getElementById("img115Logo"));