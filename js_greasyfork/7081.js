// ==UserScript==
// @name        UserScript Translation Engine
// @namespace   org.jixun.us.translation
// @description Translate strings by given translations
// @version     1.0
// @run-at      document-start
// @grant       none
// ==/UserScript==

var Translation = (function () {
	var _each = function (arr, eachCb, defValue) {
		if (!arr || !arr.length) return ;

		for (var i = arr.length, ret; i-- ; )
			// If there's something to return, then return it.
			if (ret = eachCb (arr[i], i))
				return ret;

		return defValue ;
	};
	var _filterPop = function (arr, fn) {
		if (arr && arr.length)
			for (var i = arr.length; i--; )
				if (fn(arr[i]))
					return arr[i];
	};

	var extend = function (src) {
		var args = arguments, argl = args.length;
		for (var i = 1; i < argl; i++) {
			for (var x in args[i]) {
				if (args[i].hasOwnProperty(x)) {
					if (src[x] instanceof Object) {
						extend (src[x], args[i][x]);
					} else {
						src[x] = args[i][x];
					}
				}
			}
		}

		return src;
	};

	var Translation = function (lang) {
		this.resetLang ();
		this.setLang (lang);
	};

	// 获取浏览器预设语言
	Translation.getLang = function (lang) {
		var x = _filterPop(navigator.languages.slice().reverse(), function (x) { return lang[x] });
		return lang[x] || {};
	};

	Translation.prototype = {
		run: function (node) {
			var self = this;
			node = node || document.body || document;

			this.mo = new MutationObserver (function (m) {
				_each (m, function (q) {
					_each (q.addedNodes, function (e) {
						// Firebug keep injects their stuff, ignore
						if (e.className && e.className.indexOf ('firebug') != -1)
							return ;

						self.translateNode (e);
					});

					if (q.type == 'attributes') {
						var x = self.findAttrTranslation (q.target, q.attributeName, q.target.getAttribute(q.attributeName));
						if (x) {
							q.target.setAttribute (q.attributeName, x);
						}
					}
				});
			});

			this.mo.observe (node, {
				childList: true,
				subtree: true,
				characterData: true,
				attributes: true
			});

			this.translateNode (node);
		},

		excludeTags: ['code', 'pre', 'script', 'style', 'link', 'meta'],
		excludeFromTag: function (node, tagName) {
			var n = node;
			while (n = n.parentNode)
				if (-1 != this.excludeTags.indexOf(n))
					return true;

			return false;

		},

		translateNode: function (node) {
			_each(node.getElementsByTagName('*'), this.applyAttr.bind(this));

			var self = this;

			var walker = document.createTreeWalker (node, 4 /* NodeFilter.SHOW_TEXT */, function (textNode) {
				return (
					self.excludeFromTag(textNode.parentNode)
					|| textNode.nodeValue.trim() === ''
					? 2 /* NodeFilter.FILTER_REJECT */
					: 1 /* NodeFilter.FILTER_ACCEPT */
				);
			}, false);

			// Loop through text nodes.
			while (node = walker.nextNode())
				this.applyNode (node);
		},

		applyNode: function (node) {
			this.applyText (node);
			this.applyAttr (node.parentNode);
		},

		findTranslation: function (lang, str) {
			var args = arguments;
			var stack = [ lang ];
			var r = lang;
			for (var i = 2; i < args.length; i++) {
				r = r[args[i]];
				if (!r) break;

				stack.push (r);
			}

			if (stack.length) {
				for (i = stack.length; i--; ) {
					if (stack[i][str] && 'string' == typeof stack[i][str]) {
						return stack[i][str];
					}

					if (stack[i].regex) {
						r = _filterPop(stack[i].regex, function (re) {
							return re[0].test( str );
						});
						if (r) return str.replace(r[0], r[1]);
					}
				}
			}
		},

		applyText: function (node) {
			var self = this;
			var v = node.nodeValue.trim();
			if (!v) return ;

			var l = (this.findTranslation (this.lang.node, v, 'tag', node.parentNode.tagName)
				||	this.findTranslation (this.lang.node, v, 'str'));

			if (l) node.nodeValue = l;
		},

		findAttrTranslation: function (node, attrName, attrVal) {
			return (this.findTranslation (this.lang.attr, attrVal, 'tag', node.tagName, attrName)
				|| this.findTranslation (this.lang.attr, attrVal, 'str', attrName))
		},

		applyAttr: function (node) {
			var self = this;
			var tag = node.tagName;
			var l;

			_each(node.attributes, function (attr) {
				l = self.findAttrTranslation (node, attr.name, attr.value);

				if (l) attr.value = l;
			});
		},

		/**
		 * Set translation profile
		 * @param {Object} lang Language translation hashmap.
		 */
		setLang: function (lang) {
			if (lang instanceof Object)
				extend (this.lang, lang);
		},

		/**
		 * Get translation
		 * @return {Object} Language Translation hashmap
		 */
		getLang: function () {
			return extend({}, this.lang);
		},

		resetLang: function () {
			this.lang = {node: {tag: {}, str: {}}, attr: {tag: {}, str: {}}};
		}
	};

	return Translation;
})();