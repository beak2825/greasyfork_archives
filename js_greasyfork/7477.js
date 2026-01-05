// ==UserScript==
// @name     Gmail Compactor
// @description     Click the text at the bottom of the table or press (t) to compact the size of gmail.
// @namespace     https://greasyfork.org/users/3159 
// @include     http://mail.google.com/mail/*
// @include     https://mail.google.com/mail/*
// @grant     GM_getValue
// @grant     GM_setValue
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/7477/Gmail%20Compactor.user.js
// @updateURL https://update.greasyfork.org/scripts/7477/Gmail%20Compactor.meta.js
// ==/UserScript==
a = ".nH.w-asV.aiw, .nH.oy8Mbf.nn.aeN, .Bu.y3, .AT{display:none !important}.ar4{margin:.5vw;width:99vw !important}.if{margin:0 !important}.aeJ{padding:0 !important;overflow-y: auto !important}.G-atb{padding: 0 0 9px 400px !important}.l2{padding-top: 12px !important;padding-bottom: 12px !important;margin:0 !important}.l6{padding: 0 !important}.fY{margin-right:16px !important}";

function csc(n) {
	cnc = document.getElementsByClassName('css');
	for (i = 0; i < cnc.length; i++) {
		cnc[i].innerText = n;
	}
	window.dispatchEvent(new Event('resize'));
}

function cst() {
	if (GM_getValue("cssave")) {
		csc("");
		GM_setValue("cssave", 0);
	} else {
		csc(a);
		GM_setValue("cssave", 1);
	}
}

function start() {

	css = document.createElement("style");
	css.className = "css";
	document.head.appendChild(css);

	if (GM_getValue("cssave")) {
		csc(a);
	} else {
		csc("");
	}

	document.addEventListener("keydown", function (e) {
		if (e.which == 84 && !document.activeElement.getAttribute('aria-label')) {
			cst();
		}
	});

	document.getElementById(':3').onclick = cst;
	document.getElementById(':2').addEventListener('mouseover', function () {
		document.getElementsByClassName('nH Gn')[0].onclick = cst;
	});
}

itr=setInterval(function(){"Gmail"!=document.title&&""!=document.title&&(clearInterval(itr),start())},1E3);setTimeout(function(){clearInterval(itr)},12E4);