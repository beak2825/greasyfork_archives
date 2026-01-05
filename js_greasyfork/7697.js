// ==UserScript==
// @name        facebook tag list enabler
// @description just comment tag like plain text
// @match       https://www.facebook.com/*
// @version     2
// @grant       none
// @namespace https://greasyfork.org/users/4947
// @downloadURL https://update.greasyfork.org/scripts/7697/facebook%20tag%20list%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/7697/facebook%20tag%20list%20enabler.meta.js
// ==/UserScript==

__d("getMentionsTextForContentState", ["ComposedEntityType", "DocumentCharacters", "DocumentEntity", "emptyFunction"], function (a, b, c, d, e, f, g, h, i, j) {
	var k = j.thatReturnsTrue,
		l = /[\\\]:]/g;

	function m(n) {
		var o = n.getBlockMap().map(function (p) {
			var q = p.getText(),
				r = '';
			p.findEntityRanges(j.thatReturnsTrue, function (s, t) {
				var u = p.getEntityAt(s);
				if (u === null) {
					r += q.slice(s, t);
				} else {
					var v = i.get(u);
					if (v.getType() === k) {
						r += v.getData().originalEmoticon;
					} else r += q.slice(s, t);
				}
			});
			return r;
		});
		return o.join(l);
	}

	function n(o, p) {
		if (p) {
			var q = i.get(p);
			if (q.getType() === g.MENTION) {
				o = o.replace(l, function (r) {
					return '\\' + r;
				});
				return '@[' + q.getData().id + ':' + o + ']';
			} else if (q.getType() === g.EMOTICON) return q.getData().originalEmoticon;
		}
		return o.replace('@[', '@ [');
	}
	e.exports = m;
}, null);
