// ==UserScript==
// @id             to-gfycat
// @name           To Gfycat
// @version        1.0
// @description    Send any image/movie to gfycat by holding down alt/option + shift and then clicking on it.
// @namespace      https://github.com/phracker
// @author         phracker / hateradio
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA5FBMVEWh1wCl3ACm3QCn3gCn3gCn3gCm3gCm3QCr3w6/50fL62vG6l2y4iOm3gGx4h7h9Kn8/vX////+//3x+tfC6FOn3gGp3wfc8pz9/vn0++C35DK14yz2/Ofr+MjB6E/W8Iz9/vrS7oC85j77/vPR7nyk3QCy4iT1++O04yn1++To97+s4BH0+9/c8p2n3gKo3gXa8Zfz+92x4iCw4R2v4RnN7HDB6E655Tn4/Ou75j7X8I7a8Zbt+M3+//zJ62aq3wzn9rzl9bWu4Rao3gTT7oH1++L2++Tx+tbY8ZKp3wiy4iGz4iTLKqF9AAAABXRSTlMzser09ZhWmkQAAACcSURBVBgZBcG9SkNBGAXAOZvduwoBUwn2sbOLja9vZStEfAALRQhoI/6EfM5EkgCqqpIOiSo49iAtSfKNZNXkLEmSfHBqYXPeMp3GCOlk5Hedmc8NNMxpzjl9XaBhWSzL23B5hU7NmLn+ARqe+3a89LXVK9JDdkmebvJQqsNdHtFT6BV6bpO871GtcD/GOPztC5V0CAWOkSSAqqp/wy4reFmmAEsAAAAASUVORK5CYII=
// @icon64         data:image/png;base64,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
// @grant          GM_openInTab
// @include        *://*
// @downloadURL https://update.greasyfork.org/scripts/7507/To%20Gfycat.user.js
// @updateURL https://update.greasyfork.org/scripts/7507/To%20Gfycat.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var gfycat = {
		url : 'https://gfycat.com/fetch/',
		init : function () {
			if (document.URL.indexOf(this.url) !== -1) {
				this.send();
			} else {
				var i = document.getElementsByTagName('img'), b = i.length;
				while (b--) {
					i[b].addEventListener('click', gfycat.go, false);
				}
			}
		},
		go : function (e) {
			if (e.shiftKey && e.altKey) {
				e.preventDefault();
				this.removeEventListener('click', gfycat.go, false);
				gfycat.open(gfycat.url + this.src);
			}
		},
		send : function () {
			var i = document.querySelector('.input_field');
			if (i) {
				i.value = document.location.hash.substring(1);
				document.querySelector('form').submit();
			}
		},
		open : (function () {
			try {
				return GM_openInTab;
			} catch (e) {}
			return function (url) { window.open(url); window.focus(); };
		}())
	};
	gfycat.init();
}());