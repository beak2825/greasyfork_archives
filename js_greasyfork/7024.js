// ==UserScript==
// @id HabrPercentageRing
// @name Habr Percentage Ring
// @version 11.2014.11.11
// @namespace github.com/spmbt
// @author spmbt0
// @contributor KOLANICH
// @description Percentage Rings around numbers which show grades (for with userstyles)
// @icon http://habrahabr.ru/favicon.ico
// @update 0.81 bug + подгонка эллипсов
// @include /^https?://(m\.|webcache\.googleusercontent\.com\/search\?q=cache(:|%3A|%3a)(http(:|%3A|%3a)(\/|%2F|%2f)(\/|%2F|%2f))?)?(habrahabr|geektimes).ru(?!\/special|\/api)/
// @include http://habrahabr.ru*
// @exclude http://habrahabr.ru/api*
// @radius 14
// @magic_offsets [46, 99, 26, 56, 14, 18, 9, 12, 17, 43, 11, 4]
// @delay 2999
// @pos_vote_color #1b1
// @neg_vote_color #a24
// @downloadURL https://update.greasyfork.org/scripts/7024/Habr%20Percentage%20Ring.user.js
// @updateURL https://update.greasyfork.org/scripts/7024/Habr%20Percentage%20Ring.meta.js
// ==/UserScript==
// работает автономно или как модуль для HabrAjax
"use strict";
const mo=new Int8Array(JSON.parse(GM_getMetadata("magic_offsets")[0]));
const r2=GM_getMetadata("radius")[0];
const baseOpacity=0.25;
const pvc=GM_getMetadata("pos_vote_color")[0];
const nvc=GM_getMetadata("neg_vote_color")[0];

function writePercRound(aP, aM) {
	var aPM = Number(aP) + Number(aM);
	if (aPM == 0)
		return document.createElement('div');
	var c = document.createElement('canvas'), ell = 1 - 1 / 3.6;
	c.width = c.height = r2 * 2;
	c.style.backgroundColor = 'transparent';
	c.style.position = 'absolute';
	c.style.left = (-r2 + mo[7]) + 'px';
	c.style.top = (-r2 + 1 + 8) + 'px';
	var q = c.getContext("2d"),
	log = Math.log(aPM) / 1.6 + 1;
	c.style.opacity = baseOpacity + log * 0.1;
	c.style.zIndex = 1;
	
	q.lineWidth = log;
	q.strokeStyle = pvc;
	var perc = (0.5 - aM / aPM) * Math.PI, perc2 = (0.5 + aM / aPM) * Math.PI;
	q.beginPath();
	q.scale(1, ell);
	q.arc(r2, r2 / ell, r2 - 1, perc, perc2 + 2 * (perc == perc2 && aP != 0) * Math.PI, aP == 0 || aM != 0);
	q.stroke();
	q.beginPath();
	q.strokeStyle = nvc;
	q.arc(r2, r2 / ell, r2 - 1, perc, perc2 + 2 * (perc == perc2 && aM != 0) * Math.PI, !1);
	q.stroke();
	return c;
}

function setUpdateHandlers (oP,oPM, oPP) {
	var ff = function () {
		setTimeout(function () {
			habrPercentageRing(oP)
		}, GM_getMetadata("delay")[0])
	};
	oPM && oPM.addEventListener('click', ff, !1);
	oPP && oPP.addEventListener('click', ff, !1);
};
function getPositionCenter(obj) { //
	var x = 0,
	y = 0,
	w2 = Math.floor(obj.offsetWidth / 2),
	h2 = Math.floor(obj.offsetHeight / 2);
	while (obj) {
		x += obj.offsetLeft;
		y += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return {x : x, y : y, w2 : w2, h2 : h2};
};


function habrPercentageRing(blck) {
	var marks = blck && blck.childNodes && blck.querySelectorAll('.mark'),
	isC2 = blck && / c2/.test(blck.className),
	isQa = /\/qa\//.test(location.href);
	function $q(q, f) {
		return (f || document).querySelector(q)
	};
	if (!marks)
		return;
	for (var i in marks) {
		var o = marks[i],
		oP = o.parentNode;
		if (!o || !o.attributes)
			continue;
		o.style.position = 'relative';
		if (/\/users\//.test(location.href)) {
			oP.style.marginRight = mo[4]+'px';
			oP.style.marginTop = '2px';
		}
		var oXS = $q('span', o);
		if (oXS && oXS.getAttribute('title')) {
			let oXSt = oXS.getAttribute('title').match(/[\d\.]+/g),
			oC = $q('canvas', o);
			if (oC)
				oC.parentNode.removeChild(oC);
			if (oXSt && oXSt.length && !$q('canvas', o)) {
				var aP = oXSt[1], aM = oXSt[2];
				let c = writePercRound(aP, aM);
				//getPositionCenter(o);
				var oPM = $q('.minus', oP), oPP = $q('.plus', oP), oPPI = /infopanel/.test(oP.parentNode.className);
				if (oPM && (-aP - aM))
					oPM.style.left = (oPPI ? mo[0] : mo[2] + 6 * (Math.abs(aP - aM) > mo[6])) + 'px';
				oXS.style.left = '-1px';
				if (oPPI) { //new layout
					c.style.left = (Math.abs(aP - aM) > mo[1] ? -r2 + mo[8] : (aP == aM ? -r2 + 3 : -r2 + mo[10] - mo[11] * (Math.abs(aP - aM) <= mo[6]))) + 'px';
					c.style.top = '-5px';
				} else if (oP.parentNode.parentNode.className == 'entry-info vote_holder') { //old layout
					c.style.left = (Math.abs(aP - aM) > mo[1] ? -r2 + mo[3] : (aP == aM ? -r2 + mo[9] : -r2 + mo[0] + mo[11] * (Math.abs(aP - aM) > mo[6]))) + 'px';
					c.style.top = isC2 ? '-6px' : '-4px';
				} else { //comments
					c.style.left = (Math.abs(aP - aM) > mo[1] ? -r2 + mo[5] : (aP == aM ? -r2 + 8 : -r2 + mo[6] + mo[11] * (Math.abs(aP - aM) > mo[6]))) - (isC2 && !isQa ? 3 : 0) + 'px';
					oXS.style.top = 0;
					oXS.style.left = (aP == aM ? 7 : -1) + 'px';
					c.style.top = isC2 ? '-8px' : '-6px';
				}
				oXS.style.position = 'relative';
				o.insertBefore(c, oXS);
				if (oPPI && Math.abs(aP - aM) > mo[1])
					o.style.left = (-mo[6])+'px';
				oXS.style.zIndex = 2;
				setUpdateHandlers(oP,oPM, oPP);
			}
		}
	}
};
habrPercentageRing(document);

window.addEventListener('chgDom', function (ev) { //проверить блок по событию от модулей (Fx6+, Chrome,Safari)
	habrPercentageRing(ev.detail);
}, !1);
