// ==UserScript==
// @name        Yays! (Yet Another Youtube Script)
// @namespace   youtube
// @description A lightweight and non-intrusive userscript that control video playback and set the preferred player size and playback quality on YouTube.
// @version     1.15.1
// @author      Eugene Nouvellieu <eugenox_gmail_com>
// @license     MIT License
// @include     http*://*.youtube.com/*
// @include     http*://youtube.com/*
// @run-at      document-end
// @noframes
// @grant       unsafeWindow
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @homepageURL https://eugenox.appspot.com/script/yays
// @icon        https://eugenox.appspot.com/blob/yays/yays.icon.png
// @downloadURL https://update.greasyfork.org/scripts/593/Yays%21%20%28Yet%20Another%20Youtube%20Script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/593/Yays%21%20%28Yet%20Another%20Youtube%20Script%29.meta.js
// ==/UserScript==

// Copyright (c) 2012-2015 Eugene Nouvellieu <eugenox_gmail_com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function YAYS(unsafeWindow) {

'use strict';

/*
 * Meta.
 */

var Meta = {
	title:       'Yays! (Yet Another Youtube Script)',
	version:     '1.15.1',
	releasedate: 'Aug 16, 2015',
	site:        'https://eugenox.appspot.com/script/yays',
	ns:          'yays'
};

/*
 * Utility functions.
 */

function each(iterable, callback, scope) {
	if ('length' in iterable) {
		for (var i = 0, len = iterable.length; i < len; ++i) {
			callback.call(scope, i, iterable[i]);
		}
	}
	else {
		for (var key in iterable) {
			if (iterable.hasOwnProperty(key)) {
				callback.call(scope, key, iterable[key]);
			}
		}
	}
}

function map() {
	var
		args = Array.prototype.constructor.apply([], arguments),
		callback = args.shift() || bind(Array.prototype.constructor, []),
		results = [],
		i, len;

	if (args.length > 1) {
		var getter = function(arg) { return arg[i]; };
		len = Math.max.apply(Math, map(function(arg) { return arg.length; }, args));

		for (i = 0; i < len; ++i) {
			results.push(callback.apply(null, map(getter, args)));
		}
	}
	else {
		var arg = args[0];
		len = arg.length;

		for (i = 0; i < len; ++i) {
			results.push(callback(arg[i]));
		}
	}

	return results;
}

function unique(values) {
	values.sort();

	for (var i = 0, j; i < values.length; ) {
		j = i;

		while (values[j] === values[j - 1]) {
			j++;
		}

		if (j - i) {
			values.splice(i, j - i);
		}
		else {
			++i;
		}
	}

	return values;
}

function combine(keys, values) {
	var object = {};

	map(function(key, value) { object[key] = value; }, keys, values);

	return object;
}

function merge(target, source, override) {
	override = override === undefined || override;

	for (var key in source) {
		if (override || ! target.hasOwnProperty(key)) {
			target[key] = source[key];
		}
	}

	return target;
}

function extend(base, proto) {
	function T() {}
	T.prototype = base.prototype;

	return merge(new T(), proto);
}

function noop() {
	return;
}

function bind(func, scope, args) {
	if (args && args.length > 0) {
		return func.bind.apply(func, [scope].concat(args));
	}

	return func.bind(scope);
}

function intercept(original, extension) {
	original = original || noop;

	return function() {
		extension.apply(this, arguments);

		return original.apply(this, arguments);
	};
}

function asyncCall(func, scope, args) {
	window.setTimeout(bind(func, scope, args), 0);
}

function asyncProxy(func) {
	return function() {
		asyncCall(func, this, Array.prototype.slice.call(arguments));
	};
}

function buildURL(path, parameters) {
	var query = [];
	each(parameters, function(key, value) { query.push(key.concat('=', encodeURIComponent(value))); });

	return path.concat('?', query.join('&'));
}

function parseJSON(data) {
	if (typeof JSON != 'undefined') {
		return JSON.parse(data);
	}

	return eval('(' + data + ')');
}

/*
 * Script context.
 */

var Context = (function() {
	function BasicContext(context, namespace) {
		if (context) {
			this._scope = this._createNamespace(context._scope, namespace);
			this._ns = context._ns + '.' + namespace;
		}
		else {
			this._scope = unsafeWindow;
			this._ns = 'window';
		}
	}

	BasicContext.prototype = {
		_scope: null,
		_ns: null,

		_createNamespace: function(scope, name) {
			return scope[name] = {};
		},

		protect: function(entity) {
			return entity;
		},

		publish: function(name, entity) {
			this._scope[name] = this.protect(entity);

			return this._ns + '.' + name;
		},

		revoke: function(name) {
			delete this._scope[name];
		}
	};

	var Context;

	if (typeof exportFunction == 'function') {
		Context = function(context, namespace) {
			BasicContext.call(this, context, namespace);
		};

		Context.prototype = extend(BasicContext, {
			_createNamespace: function(scope, name) {
				return createObjectIn(scope, {defineAs: name});
			},

			protect: function(entity) {
				switch (typeof entity) {
					case 'function':
						return exportFunction(entity, this._scope);

					case 'object':
						return cloneInto(entity, this._scope);
				}
			}
		});
	}
	else {
		Context = BasicContext;
	}

	return Context;
})();

var
	pageContext = new Context(),
	scriptContext = new Context(pageContext, Meta.ns);

/*
 * Console singleton.
 */

var Console = {
	debug: function() {
		unsafeWindow.console.debug('[' + Meta.ns + ']' + Array.prototype.join.call(arguments, ' '));
	}
};

/*
 * DOM Helper singleton.
 */

var DH = {
	ELEMENT_NODE: 1,

	build: function(def) {
		switch (Object.prototype.toString.call(def)) {
			case '[object Object]':
				var node = this.createElement(def.tag || 'div');

				if ('style' in def) {
					this.style(node, def.style);
				}

				if ('attributes' in def) {
					this.attributes(node, def.attributes);
				}

				if ('listeners' in def) {
					this.listeners(node, def.listeners);
				}

				if ('children' in def) {
					this.append(node, def.children);
				}

				return node;

			case '[object String]':
				return this.createTextNode(def);

			default:
				return def;
		}
	},

	id: bind(document.getElementById, document),
	query: bind(document.querySelectorAll, document),
	createElement: bind(document.createElement, document),
	createTextNode: bind(document.createTextNode, document),

	style: function(node, style) {
		each(style, node.style.setProperty, node.style);
	},

	append: function(node, children) {
		each([].concat(children), function(i, child) { node.appendChild(this.build(child)); }, this);
		node.normalize();
	},

	insertAfter: function(node, children) {
		var parent = node.parentNode, sibling = node.nextSibling;
		if (sibling) {
			each([].concat(children), function(i, child) { parent.insertBefore(this.build(child), sibling); }, this);
			parent.normalize();
		}
		else {
			this.append(parent, children);
		}
	},

	prepend: function(node, children) {
		if (node.hasChildNodes()) {
			each([].concat(children), function(i, child) { node.insertBefore(this.build(child), node.firstChild); }, this);
		}
		else {
			this.append(node, children);
		}
	},

	remove: function(node) {
		node.parentNode.removeChild(node);
	},

	attributes: function(node, attributes) {
		each(attributes, node.setAttribute, node);
	},

	hasClass: function(node, cls) {
		return node.hasAttribute('class') && new RegExp('\\b' + cls + '\\b').test(node.getAttribute('class'));
	},

	addClass: function(node, clss) {
		node.setAttribute('class', node.hasAttribute('class') ? unique(node.getAttribute('class').concat(' ', clss).trim().split(/ +/)).join(' ') : clss);
	},

	delClass: function(node, clss) {
		if (node.hasAttribute('class')) {
			node.setAttribute('class', node.getAttribute('class').replace(new RegExp('\\s*\\b(?:' + clss.replace(/ +/g, '|') + ')\\b\\s*', 'g'), ' ').trim());
		}
	},

	listeners: function(node, listeners) {
		each(listeners, function(type, listener) { this.on(node, type, listener); }, this);
	},

	on: function(node, type, listener) {
		node.addEventListener(type, listener, false);
	},

	un: function(node, type, listener) {
		node.removeEventListener(type, listener, false);
	},

	unwrap: function(element) {
		try {
			return XPCNativeWrapper.unwrap(element);
		}
		catch (e) {
			return element;
		}
	},

	walk: function(node, path) {
		var steps = path.split('/'), step = null;

		while (node && (step = steps.shift())) {
			if (step == '..') {
				node = node.parentNode;
				continue;
			}

			var selector = /^(\w*)(?:\[(\d+)\])?$/.exec(step), name = selector[1], index = Number(selector[2]) || 0;

			for (var i = 0, j = 0, nodes = node.childNodes; node = nodes.item(i); ++i) {
				if (node.nodeType == this.ELEMENT_NODE && (! name || node.tagName.toLowerCase() == name) && j++ == index) {
					break;
				}
			}
		}

		return node;
	},

	closest: function(node, predicate) {
		do {
			if (predicate(node)) {
				return node;
			}
		} while ((node = node.parentNode) && node.nodeType == this.ELEMENT_NODE);

		return null;
	}
};

/*
 * i18n
 */

var _ = (function() {
	var vocabulary = ["Playback", "START", "PAUSE", "STOP", "AUTO PAUSE", "AUTO STOP", "Set default playback state", "Quality", "AUTO", "ORIGINAL", "Set default video quality", "Size", "AUTO", "WIDE", "Set default player size", "Player settings", "Help"];
	function translation(language) {
		switch (language) {
			// Hungarian - eugenox
			case 'hu':
				return ["Lej\u00e1tsz\u00e1s", "ELIND\u00cdTVA", "SZ\u00dcNETELTETVE", "MEG\u00c1LL\u00cdTVA", "AUTOMATIKUS SZ\u00dcNETELTET\u00c9S", "AUTOMATIKUS MEG\u00c1LL\u00cdT\u00c1S", "Lej\u00e1tsz\u00e1s alap\u00e9rtelmezett \u00e1llapota", "Min\u0151s\u00e9g", "AUTO", "EREDETI", "Vide\u00f3k alap\u00e9rtelmezett felbont\u00e1sa", "M\u00e9ret", "AUTO", "SZ\u00c9LES", "Lej\u00e1tsz\u00f3 alap\u00e9rtelmezett m\u00e9rete", "Lej\u00e1tsz\u00f3 be\u00e1ll\u00edt\u00e1sai", "S\u00fag\u00f3"];
			// Dutch - Mike-RaWare
			case 'nl':
				return [null, null, null, null, null, null, null, "Kwaliteit", "AUTOMATISCH", null, "Stel standaard videokwaliteit in", null, null, null, null, null, null];
			// Spanish - yonane, Dinepada, jdarlan
			case 'es':
				return ["Reproducci\u00f3n autom\u00e1tica", "Iniciar", "Pausar", "Detener", "Auto pausa", "Auto detener", "Fijar reproducci\u00f3n autom\u00e1tica", "Calidad", "Auto", "Original", "Calidad por defecto", "Tama\u00f1o", "Autom\u00e1tico", "Ancho", "Tama\u00f1o del reproductor predeterminado", "Configuraci\u00f3n", "Ayuda"];
			// German - xemino, ich01
			case 'de':
				return ["Wiedergabe", "Start", "Pause", "Stop", "Auto-Pause", "Auto-Stop", "Standardm\u00e4\u00dfigen Wiedergabezustand setzen", "Qualit\u00e4t", "Auto", "Original", "Standard Video Qualit\u00e4t setzen", "Gr\u00f6\u00dfe", "Auto", "Breit", "Standard Player Gr\u00f6\u00dfe setzen", "Einstellungen", "Hilfe"];
			// Portuguese - Pitukinha
			case 'pt':
				return [null, null, null, null, null, null, null, "Qualidade", "AUTOM\u00c1TICO", null, "Defini\u00e7\u00e3o padr\u00e3o de v\u00eddeo", null, null, null, null, "Configura\u00e7\u00e3o do usu\u00e1rio", null];
			// Greek - TastyTeo
			case 'el':
				return ["\u0391\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ae", null, "\u03a0\u0391\u03a5\u03a3\u0397", "\u03a3\u03a4\u0391\u039c\u0391\u03a4\u0397\u039c\u0391", "\u0391\u03a5\u03a4\u039f\u039c\u0391\u03a4\u0397 \u03a0\u0391\u03a5\u03a3\u0397", "\u0391\u03a5\u03a4\u039f\u039c\u0391\u03a4\u039f \u03a3\u03a4\u0391\u039c\u0391\u03a4\u0397\u039c\u0391", "\u039f\u03c1\u03b9\u03c3\u03bc\u03cc\u03c2 \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7\u03c2 \u03ba\u03b1\u03c4\u03ac\u03c3\u03c4\u03b1\u03c3\u03b7\u03c2 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ae\u03c2", "\u03a0\u03bf\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1", "\u0391\u03a5\u03a4\u039f\u039c\u0391\u03a4\u039f", "\u03a0\u03a1\u039f\u0395\u03a0\u0399\u039b\u039f\u0393\u0397", "\u039f\u03c1\u03b9\u03c3\u03bc\u03cc\u03c2 \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7\u03c2 \u03c0\u03bf\u03b9\u03cc\u03c4\u03b7\u03c4\u03b1\u03c2 \u03b2\u03af\u03bd\u03c4\u03b5\u03bf", "\u039c\u03ad\u03b3\u03b5\u03b8\u03bf\u03c2", "\u0391\u03a5\u03a4\u039f\u039c\u0391\u03a4\u039f", "\u03a0\u039b\u0391\u03a4\u03a5", "\u039f\u03c1\u03b9\u03c3\u03bc\u03cc\u03c2 \u03c0\u03c1\u03bf\u03b5\u03c0\u03b9\u03bb\u03b5\u03b3\u03bc\u03ad\u03bd\u03b7\u03c2 \u03b1\u03bd\u03ac\u03bb\u03c5\u03c3\u03b7\u03c2 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ad\u03b1", "\u0395\u03c0\u03b9\u03bb\u03bf\u03b3\u03ad\u03c2 \u03b1\u03bd\u03b1\u03c0\u03b1\u03c1\u03b1\u03b3\u03c9\u03b3\u03ad\u03b1", "\u0392\u03bf\u03ae\u03b8\u03b5\u03b9\u03b1"];
			// French - eXa
			case 'fr':
				return [null, null, null, null, null, null, null, "Qualit\u00e9", "AUTO", "ORIGINAL", "Qualit\u00e9 par d\u00e9faut", "Taille", "AUTO", "LARGE", "Taille par d\u00e9faut du lecteur", "Options du lecteur", "Aide"];
			// Slovenian - Paranoia.Com
			case 'sl':
				return [null, null, null, null, null, null, null, "Kakovost", "Samodejno", null, "Nastavi privzeto kakovost videa", null, null, null, null, "Nastavitve predvajalnika", "Pomo\u010d"];
			// Russian - an1k3y
			case 'ru':
				return [null, null, null, null, null, null, null, "\u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e", "\u0410\u0412\u0422\u041e", null, "\u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e \u0432\u0438\u0434\u0435\u043e \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e", "\u0420\u0410\u0417\u041c\u0415\u0420", null, "\u0420\u0410\u0417\u0412\u0415\u0420\u041d\u0423\u0422\u042c", "\u0420\u0430\u0437\u043c\u0435\u0440 \u0432\u0438\u0434\u0435\u043e \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e", "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u043f\u043b\u0435\u0435\u0440\u0430", "\u041f\u043e\u043c\u043e\u0449\u044c"];
			// Hebrew - baryoni
			case 'iw':
				return [null, null, null, null, null, null, null, "\u05d0\u05d9\u05db\u05d5\u05ea", "\u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea", null, "\u05d4\u05d2\u05d3\u05e8 \u05d0\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05d1\u05e8\u05d9\u05e8\u05ea \u05d4\u05de\u05d7\u05d3\u05dc \u05e9\u05dc \u05d4\u05d5\u05d9\u05d3\u05d0\u05d5", "\u05d2\u05d5\u05d3\u05dc", null, "\u05e8\u05d7\u05d1", "\u05d4\u05d2\u05d3\u05e8 \u05d0\u05ea \u05d2\u05d5\u05d3\u05dc \u05d1\u05e8\u05d9\u05e8\u05ea \u05d4\u05de\u05d7\u05d3\u05dc \u05e9\u05dc \u05d4\u05e0\u05d2\u05df", "\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05e0\u05d2\u05df", "\u05e2\u05d6\u05e8\u05d4"];
			// Chinese - blankhang
			case 'zh':
				return ["\u64ad\u653e\u6a21\u5f0f", "\u64ad\u653e", "\u6682\u505c", "\u505c\u6b62", "\u81ea\u52a8\u6682\u505c", "\u81ea\u52a8\u505c\u6b62", "\u8bbe\u7f6e\u9ed8\u8ba4\u64ad\u653e\u6a21\u5f0f", "\u89c6\u9891\u8d28\u91cf", "\u81ea\u52a8", "\u539f\u753b", "\u8bbe\u7f6e\u9ed8\u8ba4\u89c6\u9891\u8d28\u91cf", "\u64ad\u653e\u5668\u5927\u5c0f", "\u81ea\u52a8", "\u5bbd\u5c4f", "\u8bbe\u7f6e\u64ad\u653e\u5668\u9ed8\u8ba4\u5927\u5c0f", "\u64ad\u653e\u5668\u8bbe\u7f6e", "\u5e2e\u52a9"];
			// Polish - mkvs
			case 'pl':
				return ["Odtwarzanie", "URUCHOM", "WSTRZYMAJ", "ZATRZYMAJ", "AUTOMATYCZNIE WSTRZYMAJ", "AUTOMATYCZNIE ZATRZYMAJ", "Ustaw domy\u015blny stan odtwarzania", "Jako\u015b\u0107", "AUTOMATYCZNA", "ORYGINALNA", "Ustaw domy\u015bln\u0105 jako\u015b\u0107 film\u00f3w", "Rozmiar", "AUTOMATYCZNY", "SZEROKI", "Ustaw domy\u015blny rozmiar odtwarzacza", "Ustawienia odtwarzacza", "Pomoc"];
			// Swedish - eson
			case 'sv':
				return ["Uppspelning", "START", "PAUS", "STOPP", "AUTOPAUS", "AUTOSTOPP", "Ange uppspelningsl\u00e4ge", "Kvalitet", "AUTO", "ORIGINAL", "Ange standardkvalitet", "Storlek", "AUTO", "BRED", "Ange standardstorlek", "Inst\u00e4llningar", "Hj\u00e4lp"];
			// Ukrainian - mukolah
			case 'uk':
				return ["\u0421\u0442\u0430\u043d \u043f\u0440\u043e\u0433\u0440\u0430\u0432\u0430\u0447\u0430", "\u0412\u0406\u0414\u0422\u0412\u041e\u0420\u0418\u0422\u0418", "\u041f\u0420\u0418\u0417\u0423\u041f\u0418\u041d\u0418\u0422\u0418", "\u0417\u0423\u041f\u0418\u041d\u0418\u0422\u0418", "\u0410\u0412\u0422\u041e\u041c\u0410\u0422\u0418\u0427\u041d\u0415 \u041f\u0420\u0418\u0417\u0423\u041f\u0418\u041d\u0415\u041d\u041d\u042f", "\u0410\u0412\u0422\u041e\u041c\u0410\u0422\u0418\u0427\u041d\u0415 \u0417\u0423\u041f\u0418\u041d\u0415\u041d\u041d\u042f", "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0438\u0439 \u0441\u0442\u0430\u043d \u0432\u0456\u0434\u0442\u0432\u043e\u0440\u0435\u043d\u043d\u044f", "\u042f\u043a\u0456\u0441\u0442\u044c", "\u0410\u0412\u0422\u041e\u041c\u0410\u0422\u0418\u0427\u041d\u041e", "\u041e\u0420\u0418\u0413\u0406\u041d\u0410\u041b\u042c\u041d\u0410", "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0443 \u044f\u043a\u0456\u0441\u0442\u044c \u0432\u0456\u0434\u0442\u0432\u043e\u0440\u0435\u043d\u043d\u044f", "\u0420\u043e\u0437\u043c\u0456\u0440", "\u0410\u0412\u0422\u041e\u041c\u0410\u0422\u0418\u0427\u041d\u0418\u0419", "\u0428\u0418\u0420\u041e\u041a\u0418\u0419", "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044c \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0438\u0439 \u0440\u043e\u0437\u043c\u0456\u0440 \u043f\u0440\u043e\u0433\u0440\u0430\u0432\u0430\u0447\u0430", "\u041d\u0430\u043b\u0430\u0448\u0442\u0443\u0432\u0430\u043d\u043d\u044f \u043f\u0440\u043e\u0433\u0440\u0430\u0432\u0430\u0447\u0430", "\u0414\u043e\u043f\u043e\u043c\u043e\u0433\u0430"];
		}

		return [];
	}

	var dictionary = combine(vocabulary, translation((document.documentElement.lang || 'en').substr(0, 2)));

	return function(text) {
		return dictionary[text] || text;
	};
})();

/**
 * @class ScopedStorage
 */
function ScopedStorage(scope, namespace) {
	this._scope = scope;
	this._ns = namespace;
}

ScopedStorage.prototype = {
	_scope: null,
	_ns: null,

	getItem: function(key) {
		return this._scope.getItem(this._ns + '.' + key);
	},

	setItem: function(key, value) {
		this._scope.setItem(this._ns + '.' + key, value);
	},

	removeItem: function(key) {
		this._scope.removeItem(this._ns + '.' + key);
	}
};

var scriptStorage = new ScopedStorage(unsafeWindow.localStorage, Meta.ns);

/*
 * Configuration handler singleton.
 */

var Config = (function() {
	// Greasemonkey compatible
	if (typeof GM_getValue == 'function') {
		return {
			get: GM_getValue,
			set: GM_setValue,
			del: GM_deleteValue
		};
	}

	var configStorage = new ScopedStorage(scriptStorage, 'config');

	// HTML5
	return {
		get: function(key) {
			return configStorage.getItem(key);
		},

		set: function(key, value) {
			configStorage.setItem(key, value);
		},

		del: function(key) {
			configStorage.removeItem(key);
		}
	};
})();

/**
 * @class JSONRequest
 * Create XHR or JSONP requests.
 */
var JSONRequest = (function() {
	var Request = null;

	// XHR
	if (typeof GM_xmlhttpRequest == 'function') {
		Request = function(url, parameters, callback) {
			this._callback = callback;

			GM_xmlhttpRequest({
				method: 'GET',
				url: buildURL(url, parameters),
				onload: bind(this._onLoad, this)
			});
		};

		Request.prototype = {
			_onLoad: function(response) {
				this._callback(parseJSON(response.responseText));
			}
		};
	}
	// JSONP
	else {
		Request = function(url, parameters, callback) {
			this._callback = callback;
			this._id = 'jsonp_' + Request.counter++;

			parameters.callback = scriptContext.publish(this._id, bind(this._onLoad, this));

			this._scriptNode = document.body.appendChild(DH.build({
				tag: 'script',
				attributes: {
					'type': 'text/javascript',
					'src': buildURL(url, parameters)
				}
			}));
		};

		Request.counter = 0;

		Request.prototype = {
			_callback: null,
			_id: null,
			_scriptNode: null,

			_onLoad: function(response) {
				this._callback(response);

				scriptContext.revoke(this._id);

				document.body.removeChild(this._scriptNode);
			}
		};
	}

	return Request;
})();

/*
 * Update checker.
 */

(function() {
	if (new Date().valueOf() - Number(scriptStorage.getItem('update_checked_at')) < 86400000) { // 1 day
		return;
	}

	var popup = null;

	new JSONRequest(Meta.site + '/changelog', {version: Meta.version}, function(changelog) {
		scriptStorage.setItem('update_checked_at', new Date().valueOf().toFixed());

		if (changelog && changelog.length) {
			popup = renderPopup(changelog);
		}
	});

	function renderPopup(changelog) {
		return document.body.appendChild(DH.build({
			style: {
				'position': 'fixed',
				'bottom': '0',
				'width': '100%',
				'z-index': '1000',
				'background-color': '#f1f1f1',
				'border-top': '1px solid #cccccc'
			},
			children: {
				style: {
					'margin': '15px'
				},
				children: [{
					tag: 'strong',
					children: ['There is an update available for ', Meta.title, '.']
				}, {
					tag: 'p',
					style: {
						'margin': '10px 0'
					},
					children: [
						'You are using version ', {
							tag: 'strong',
							children: Meta.version
						}, ', released on ', {
							tag: 'em',
							children: Meta.releasedate
						}, '. Please consider updating to the latest version.'
					]
				}, {
					style: {
						'margin': '10px 0',
						'max-height': '150px',
						'overflow-y': 'auto'
					},
					children: {
						tag: 'a',
						children: 'Show changes',
						listeners: {
							click: function(e) {
								e.preventDefault();

								DH.insertAfter(e.target, map(function(entry) {
									return {
										style: {
											'margin-bottom': '5px'
										},
										children: [{
											tag: 'strong',
											children: entry.version
										}, ' ', {
											tag: 'em',
											children: ['(', entry.date, ')']
										}, {
											style: {
												'padding': '0 0 2px 10px',
												'white-space': 'pre'
											},
											children: [].concat(entry.note).join('\n')
										}]
									};
								}, [].concat(changelog)));

								DH.remove(e.target);
							}
						}
					}
				}, {
					children: map(function(text, handler) {
						return DH.build({
							tag: 'button',
							attributes: {
								'type': 'button',
								'class': 'yt-uix-button yt-uix-button-default'
							},
							style: {
								'margin-right': '10px',
								'padding': '5px 15px'
							},
							children: text,
							listeners: {
								'click': handler
							}
						});
					}, ['Update', 'Dismiss'], [openDownloadSite, removePopup])
				}]
			}
		}));
	}

	function removePopup() {
		document.body.removeChild(popup);
	}

	function openDownloadSite() {
		removePopup();
		unsafeWindow.open(buildURL(Meta.site + '/download', {version: Meta.version}));
	}
})();

/*
 * Migrations.
 */

(function(currentVersion) {
	var previousVersion = Config.get('version') || scriptStorage.getItem('version') || '1.0';

	if (previousVersion == currentVersion) {
		return;
	}

	previousVersion = map(Number, previousVersion.split('.'));

	each([
		{
			// Added "144p" to the quality levels.
			version: '1.7', apply: function() {
				var videoQuality = Number(Config.get('video_quality'));
				if (videoQuality > 0 && videoQuality < 7) {
					Config.set('video_quality', ++videoQuality);
				}
			}
		},
		{
			// Autoplay reworked.
			version: '1.8', apply: function() {
				switch (Number(Config.get('auto_play'))) {
					case 1: // OFF > PAUSE
						Config.set('video_playback', 1);
						break;

					case 2: // AUTO > AUTO PAUSE
						Config.set('video_playback', 3);
						break;
				}

				Config.del('auto_play');
			}
		},
		{
			// Added "1440p" to the quality levels.
			version: '1.10', apply: function() {
				var videoQuality = Number(Config.get('video_quality'));
				if (videoQuality > 6) {
					Config.set('video_quality', ++videoQuality);
				}
			}
		},
		{
			// Introduced the ScopedStorage class.
			version: '1.14', apply: function() {
				// Using a unique ScopedStorage for config outside of GM.
				each(['video_playback', 'video_quality', 'player_size', 'version'], function(i, key) {
					var value = scriptStorage.getItem(key);

					if (value) {
						Config.set(key, value);

						scriptStorage.removeItem(key);
					}
				});

				// Removed from the config.
				Config.del('update_checked_at');
			}
		},
		{
			// Removed "FIT" from player sizes.
			version: '1.15', apply: function() {
				if (Number(Config.get('player_size')) == 2) {
					Config.set('player_size', 1);
				}
			}
		}
	], function(i, migration) {
		var migrationVersion = map(Number, migration.version.split('.'));

		for (var j = 0, parts = Math.max(previousVersion.length, migrationVersion.length); j < parts; ++j) {
			if ((previousVersion[j] || 0) < (migrationVersion[j] || 0)) {
				Console.debug('Applying migration', migration.version);

				migration.apply();

				break;
			}
		}
	});

	Config.set('version', currentVersion);
})(Meta.version);

/**
 * @class Player
 */
function Player(element) {
	this._element = element;
	this._context = new Context(scriptContext, 'player' + Player._elements.indexOf(element));

	this._exportApiInterface();

	Console.debug('Player ready');

	this._muted = Number(this.isMuted() && ! Number(Player._storage.getItem('muted')));

	this._addStateChangeListener();
}

merge(Player, {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5,

	_elements: [],

	_storage: new ScopedStorage(scriptStorage, 'player'),

	test: function(element) {
		return typeof element.getApiInterface == 'function';
	},

	create: function(element) {
		switch (element.tagName) {
			case 'EMBED':
				return new FlashPlayer(element);
			case 'DIV':
				return new HTML5Player(element);
		}

		throw 'Unknown player type';
	},

	initialize: function(element) {
		if (this._elements.indexOf(element) > -1) {
			throw 'Player already initialized';
		}

		var index = this._elements.indexOf(null);

		if (index > -1) {
			this._elements[index] = element;
		}
		else {
			this._elements.push(element);
		}

		return this.create(element);
	},

	invalidate: function(player) {
		this._elements[this._elements.indexOf(player._element)] = null;

		player.invalidate();
	}
});

Player.prototype = {
	_element: null,
	_context: null,
	_muted: 0,

	_exportApiInterface: function() {
		each(this._element.getApiInterface(), function(i, method) {
			if (! (method in this)) {
				this[method] = bind(this._element[method], this._element);
			}
		}, this);
	},

	_unexportApiInterface: function() {
		each(this._element.getApiInterface(), function(i, method) {
			if (this.hasOwnProperty(method)) {
				delete this[method];
			}
		}, this);
	},

	_onStateChange: function(state) {
		Console.debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering', undefined, 'cued'][state + 1]);

		this.onStateChange(state);
	},

	_addStateChangeListener: function() {
		this.addEventListener('onStateChange', this._context.publish('onPlayerStateChange', asyncProxy(bind(this._onStateChange, this))));
	},

	_removeStateChangeListener: function() {
		this.removeEventListener('onStateChange', this._context.publish('onPlayerStateChange', noop));
	},

	invalidate: function() {
		this._removeStateChangeListener();
		this._unexportApiInterface();

		delete this.onStateChange;
		delete this._element;

		Console.debug('Player invalidated');

		this.invalidate = noop;
	},

	onStateChange: noop,

	isPlayerState: function() {
		return Array.prototype.indexOf.call(arguments, this.getPlayerState()) > -1;
	},

	getVideoId: function() {
		try {
			return this.getVideoData().video_id;
		}
		catch (e) {
			return (this.getVideoUrl().match(/\bv=([\w-]+)/) || [, undefined])[1];
		}
	},

	restartPlayback: function() {
		if (this.getCurrentTime() > 60) {
			Console.debug('Restart threshold exceeded');

			return;
		}

		var
			code = (location.hash + location.search).match(/\bt=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/) || new Array(4),
			seconds = (Number(code[1]) || 0) * 3600 + (Number(code[2]) || 0) * 60 + (Number(code[3]) || 0);

		this.seekTo(seconds, true);
	},

	resetState: function() {
		this.seekTo(this.getCurrentTime(), true);
	},

	mute: function() {
		if (! this._muted++) {
			this._element.mute();

			Player._storage.setItem('muted', '1');

			Console.debug('Player muted');
		}
	},

	unMute: function() {
		if (! --this._muted) {
			this._element.unMute();

			Player._storage.setItem('muted', '0');

			Console.debug('Player unmuted');
		}
	},

	playVideo: function() {
		this._element.playVideo();

		Console.debug('Playback started');
	},

	pauseVideo: function() {
		this._element.pauseVideo();

		Console.debug('Playback paused');
	},

	stopVideo: function() {
		this._element.stopVideo();

		Console.debug('Playback stopped');
	},

	setPlaybackQuality: function(quality) {
		this._element.setPlaybackQuality(quality);

		Console.debug('Quality changed to', quality);
	},

	setStageMode: noop
};

/**
 * @class FlashPlayer
 */
function FlashPlayer(element) {
	Player.call(this, element);
}

FlashPlayer.prototype = extend(Player, {
	_exportApiInterface: function() {
		try {
			Player.prototype._exportApiInterface.call(this);
		}
		catch (e) {
			throw 'Player has not loaded yet';
		}
	},

	_unexportApiInterface: function() {
		try {
			Player.prototype._unexportApiInterface.call(this);
		}
		catch (e) {
			Console.debug('Player has unloaded');
		}
	},

	_removeStateChangeListener: function() {
		try {
			Player.prototype._removeStateChangeListener.call(this);
		}
		catch (e) {
			Console.debug('Player has unloaded');
		}
	}
});

/**
 * @class HTML5Player
 */
function HTML5Player(element) {
	Player.call(this, element);
}

HTML5Player.prototype = extend(Player, {
	restartPlayback: function() {
		Player.prototype.restartPlayback.call(this);

		this.restartPlayback = noop;
	},

	setStageMode: function(enable) {
		this.setSizeStyle(true, enable);
	}
});

/**
 * @class Button
 */
function Button(label, tooltip) {
	this._node = DH.build(this._def(tooltip, label, this._indicator = DH.build('-')));
}

Button.prototype = {
	_indicator: null,
	_node: null,

	_def: function(tooltip, label, indicator) {
		return {
			tag: 'button',
			attributes: {
				'type': 'button',
				'class': 'yt-uix-button yt-uix-button-default yt-uix-tooltip',
				'title': tooltip
			},
			listeners: {
				'click': bind(this._onClick, this)
			},
			style: {
				'margin': '0 0.5%'
			},
			children: [{
				tag: 'span',
				attributes: {
					'class': 'yt-uix-button-content'
				},
				children: label
			}, {
				tag: 'span',
				style: {
					'font-size': '14px',
					'margin-left': '5px'
				},
				attributes: {
					'class': 'yt-uix-button-content'
				},
				children: indicator
			}]
		};
	},

	_onClick: function() {
		this.handler();
		this.refresh();
	},

	refresh: function() {
		this._indicator.data = this.display();
	},

	render: function() {
		this.refresh();
		return this._node;
	},

	handler: noop,
	display: noop
};

/**
 * @class PlayerOption
 */
function PlayerOption(player, key) {
	this._player = player;
	this._key = key;
}

PlayerOption.prototype = {
	_player: null,
	_key: null,

	get: function() {
		return Number(Config.get(this._key) || '0');
	},

	set: function(value) {
		Config.set(this._key, Number(value));
	},

	apply: noop,
	cease: noop
};

/**
 * @class PlayerOption.Button
 */
PlayerOption.Button = function(option) {
	Button.call(this, this.label, this.tooltip);

	this._option = option;
};

PlayerOption.Button.extend = function(attributes) {
	var superclass = this;

	function Button(option) {
		superclass.call(this, option);
	}

	Button.prototype = extend(superclass, attributes);

	return Button;
};

PlayerOption.Button.prototype = extend(Button, {
	_option: null,

	label: null,
	tooltip: null,
	states: null,

	handler: function() {
		this._option.set((this._option.get() + 1) % this.states.length);
	},

	display: function() {
		return this.states[this._option.get()];
	}
});

/**
 * @class SilentPlayerOption
 */
function SilentPlayerOption(player, key) {
	PlayerOption.call(this, player, key);
}

SilentPlayerOption.prototype = extend(PlayerOption, {
	_muted: false,

	mute: function(state) {
		if (this._muted != state) {
			if (state) {
				this._player.mute();
			}
			else {
				this._player.unMute();
			}

			this._muted = state;
		}
	},

	cease: function() {
		this.mute(false);
	}
});

/**
 * @class VideoPlayback
 */
function VideoPlayback(player) {
	SilentPlayerOption.call(this, player, 'video_playback');

	switch (this.get()) {
		case 0: // PLAY
			this._applied = true;
			break;

		case 3: // AUTO PAUSE
		case 4: // AUTO STOP
			// Video is visible or opened in the same window.
			if (this._isVisible() || unsafeWindow.history.length > 1) {
				this._applied = true;
			}
			// Video is opened in a background tab.
			else {
				this._handler = pageContext.protect(bind(this._handler, this));

				DH.on(unsafeWindow, 'focus', this._handler);
				DH.on(unsafeWindow, 'blur', this._handler);
			}
			break;
	}
}

VideoPlayback.prototype = extend(SilentPlayerOption, {
	_applied: false,
	_timer: null,

	_handler: function(e) {
		switch (e.type) {
			case 'focus':
				if (this._timer === null) {
					this._timer = window.setTimeout(bind(function() {
						if (this._applied) {
							this._player.resetState();
							this._player.playVideo();

							Console.debug('Playback autostarted');
						}
						else {
							this._applied = true;

							Console.debug('Playback not affected');

							this.mute(false);
						}

						DH.un(unsafeWindow, 'focus', this._handler);
						DH.un(unsafeWindow, 'blur', this._handler);

						this._timer = null;
					}, this), 500);
				}
				break;

			case 'blur':
				if (this._timer !== null) {
					clearTimeout(this._timer);

					this._timer = null;
				}
				break;
		}
	},

	// @see http://www.w3.org/TR/page-visibility/
	_isVisible: function() {
		var doc = unsafeWindow.document;
		return doc.hidden === false || doc.mozHidden === false || doc.webkitHidden === false;
	},

	apply: function() {
		if (! this._applied) {
			this.mute(true);

			if (this._player.isPlayerState(Player.PLAYING)) {
				this._applied = true;

				this._player.restartPlayback();

				if (this.get() % 2) { // (AUTO) PAUSE
					this._player.pauseVideo();
				}
				else { // (AUTO) STOP
					this._player.stopVideo();
				}

				this.mute(false);
			}
		}
	}
});

/**
 * @class VideoPlayback.Button
 */
VideoPlayback.Button = PlayerOption.Button.extend({
	label: _('Playback'),
	tooltip: _('Set default playback state'),
	states: [_('START'), _('PAUSE'), _('STOP'), _('AUTO PAUSE'), _('AUTO STOP')]
});

/**
 * @class VideoQuality
 */
function VideoQuality(player) {
	SilentPlayerOption.call(this, player, 'video_quality');

	this._applied = ! this.get();
}

VideoQuality.prototype = extend(SilentPlayerOption, {
	_applied: false,

	apply: function() {
		if (! this._applied) {
			this.mute(true);

			if (this._player.isPlayerState(Player.PLAYING, Player.PAUSED)) {
				this._applied = true;

				var quality = ['tiny', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'highres'][this.get() - 1];

				if (quality != this._player.getPlaybackQuality()) {
					this._player.restartPlayback();
					this._player.setPlaybackQuality(quality);
				}

				asyncCall(this.apply, this);
			}
		} else if (this._player.isPlayerState(Player.PLAYING, Player.CUED)) {
			this.mute(false);
		}
	}
});

/**
 * @class VideoQuality.Button
 */
VideoQuality.Button = PlayerOption.Button.extend({
	label: _('Quality'),
	tooltip: _('Set default video quality'),
	states: [_('AUTO'), '144p', '240p', '360p', '480p', '720p', '1080p', '1440p', _('ORIGINAL')]
});

/**
 * @class PlayerSize
 */
function PlayerSize(player) {
	PlayerOption.call(this, player, 'player_size');
}

PlayerSize.prototype = extend(PlayerOption, {
	apply: function() {
		var mode = this.get(), rules = [];

		switch (mode) {
			case 4: // 1080p
				rules.push(
					'.watch-stage-mode .player-width {',
						'left: -960.0px !important;',
						'width: 1920px !important;',
					'}',

					'.watch-stage-mode .player-height {',
						'height: 1110px !important;',
					'}',

					'.watch-stage-mode .html5-video-content[style*="640"], .watch-stage-mode .html5-video-content[style*="360"], .watch-stage-mode .html5-main-video[style*="640"], .watch-stage-mode .html5-main-video[style*="360"]', '{',
						'transform: matrix(3, 0, 0, 3, 640, 360) !important; -o-transform: matrix(3, 0, 0, 3, 640, 360) !important; -moz-transform: matrix(3, 0, 0, 3, 640, 360) !important; -webkit-transform: matrix(3, 0, 0, 3, 640, 360) !important;',
					'}',

					'.watch-stage-mode .html5-video-content[style*="854"], .watch-stage-mode .html5-video-content[style*="480"], .watch-stage-mode .html5-main-video[style*="854"], .watch-stage-mode .html5-main-video[style*="480"]', '{',
						'transform: matrix(2.24824, 0, 0, 2.24824, 533, 299.578) !important; -o-transform: matrix(2.24824, 0, 0, 2.24824, 533, 299.578) !important; -moz-transform: matrix(2.24824, 0, 0, 2.24824, 533, 299.578) !important; -webkit-transform: matrix(2.24824, 0, 0, 2.24824, 533, 299.578) !important;',
					'}',

					'.watch-stage-mode .html5-video-content[style*="1280"], .watch-stage-mode .html5-video-content[style*="720"], .watch-stage-mode .html5-main-video[style*="1280"], .watch-stage-mode .html5-main-video[style*="720"]', '{',
						'transform: matrix(1.5, 0, 0, 1.5, 320, 180) !important; -o-transform: matrix(1.5, 0, 0, 1.5, 320, 180) !important; -moz-transform: matrix(1.5, 0, 0, 1.5, 320, 180) !important; -webkit-transform: matrix(1.5, 0, 0, 1.5, 320, 180) !important;',
					'}'
				);

				break;

			case 3: // 720p
				rules.push(
					'.watch-stage-mode .player-width {',
						'left: -640.0px !important;',
						'width: 1280px !important;',
					'}',

					'.watch-stage-mode .player-height {',
						'height: 750px !important;',
					'}',

					'.watch-stage-mode .html5-video-content[style*="640"], .watch-stage-mode .html5-video-content[style*="360"], .watch-stage-mode .html5-main-video[style*="640"], .watch-stage-mode .html5-main-video[style*="360"]', '{',
						'transform: matrix(2, 0, 0, 2, 320, 180) !important; -o-transform: matrix(2, 0, 0, 2, 320, 180) !important; -moz-transform: matrix(2, 0, 0, 2, 320, 180) !important; -webkit-transform: matrix(2, 0, 0, 2, 320, 180) !important;',
					'}',

					'.watch-stage-mode .html5-video-content[style*="854"], .watch-stage-mode .html5-video-content[style*="480"], .watch-stage-mode .html5-main-video[style*="854"], .watch-stage-mode .html5-main-video[style*="480"]', '{',
						'transform: matrix(1.49883, 0, 0, 1.49883, 213, 119.719) !important; -o-transform: matrix(1.49883, 0, 0, 1.49883, 213, 119.719) !important; -moz-transform: matrix(1.49883, 0, 0, 1.49883, 213, 119.719) !important; -webkit-transform: matrix(1.49883, 0, 0, 1.49883, 213, 119.719) !important;',
					'}'
				);

				break;

			case 2: // 480p
				rules.push(
					'.watch-stage-mode .player-width {',
						'left: -427.0px !important;',
						'width: 854px !important;',
					'}',

					'.watch-stage-mode .player-height {',
						'height: 510px !important;',
					'}',

					'.watch-stage-mode .html5-video-content[style*="640"], .watch-stage-mode .html5-video-content[style*="360"], .watch-stage-mode .html5-main-video[style*="640"], .watch-stage-mode .html5-main-video[style*="360"]', '{',
						'transform: matrix(1.33438, 0, 0, 1.33438, 107, 60.1875) !important; -o-transform: matrix(1.33438, 0, 0, 1.33438, 107, 60.1875) !important; -moz-transform: matrix(1.33438, 0, 0, 1.33438, 107, 60.1875) !important; -webkit-transform: matrix(1.33438, 0, 0, 1.33438, 107, 60.1875) !important;',
					'}',

					'.watch-stage-mode .html5-video-content[style*="1280"], .watch-stage-mode .html5-video-content[style*="720"], .watch-stage-mode .html5-main-video[style*="1280"], .watch-stage-mode .html5-main-video[style*="720"]', '{',
						'transform: matrix(0.667188, 0, 0, 0.667188, -213, -119.812) !important; -o-transform: matrix(0.667188, 0, 0, 0.667188, -213, -119.812) !important; -moz-transform: matrix(0.667188, 0, 0, 0.667188, -213, -119.812) !important; -webkit-transform: matrix(0.667188, 0, 0, 0.667188, -213, -119.812) !important;',
					'}'
				);

				break;

			case 1: // WIDE
				break;

			default:
				return;
		}

		if (rules.length) {
			rules.push(
				'.watch-stage-mode .html5-main-video {',
					'z-index: -1;',
				'}'
			);

			DH.id('yays-player-size') || DH.append(document.body, {
				tag: 'style',
				attributes: {
					'id': 'yays-player-size',
					'type': 'text/css'
				},
				children: rules
			});
		}

		var page = DH.id('page');

		DH.delClass(page, 'watch-non-stage-mode');
		DH.addClass(page, 'watch-stage-mode watch-wide');

		this._player.setStageMode(true);

		Console.debug('Size set to', ['wide', '480p', '720p', '1080p'][mode - 1]);
	}
});

/**
 * @class PlayerSize.Button
 */
PlayerSize.Button = PlayerOption.Button.extend({
	label: _('Size'),
	tooltip: _('Set default player size'),
	states: [_('AUTO'), _('WIDE'), '480p', '720p', '1080p']
});

/**
 * @class UI
 * Abstract UI class.
 */
function UI(content) {
	this.content = content;
	this.button = DH.build(this._def.button(bind(this.toggle, this)));
	this.panel = DH.build(this._def.panel(content));
}

merge(UI, {
	instance: null,

	initialize: function(type, content) {
		if (this.instance) {
			this.instance.destroy();
		}

		return this.instance = new type(content);
	}
});

UI.prototype = {
	_def: {
		icon: function(def) {
			def = merge({tag: 'img', attributes: {}}, def);

			def.attributes.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAs0lEQVQoz4VRuRGDQAxcQDNLeKEzl2BCl+CQkIyjA3dCCYQugxJowWQ4AocEnnPAWTxjhlUirUar0y2wAGs6Otb4DyZ0PpKZjQAmcpVOMjwQezaTlzzlJvGnA8BGJ7fRABHvsNjDSd4hLloOKMZgDFBgUO48v91RlWg9U6/K1UU6EuIAIYD8Jzyv8EkOgKUe1U8NWvbKlYJW1QwqVpsN7eFHTR6kNCvhnpaG6dKTXbNwZPcX5uNiEvATXN0AAAAASUVORK5CYII=';

			return def;
		},

		button: function(click) {
			return {
				listeners: {
					'click': click
				}
			};
		},

		panel: function(content) {
			return [{
				style: {
					'margin-bottom': '10px'
				},
				children: [{
					tag: 'strong',
					children: _('Player settings')
				}, {
					tag: 'a',
					attributes: {
						'href': Meta.site,
						'target': '_blank'
					},
					style: {
						'margin-left': '4px',
						'vertical-align': 'super',
						'font-size': '10px'
					},
					children: _('Help')
				}]
			}, {
				style: {
					'text-align': 'center'
				},
				children: content.render()
			}];
		}
	},

	content: null,
	button: null,
	panel: null,

	destroy: function() {
		DH.remove(this.button);
		DH.remove(this.panel);
	},

	toggle: function() {
		this.content.refresh();
	}
};

/**
 * @class UI.Content
 */
UI.Content = function(buttons) {
	this._buttons = buttons;
};

UI.Content.prototype = {
	_buttons: null,

	render: function() {
		return map(function(button) { return button.render(); }, this._buttons);
	},

	refresh: function() {
		each(this._buttons, function(i, button) { button.refresh(); });
	}
};

/**
 * @class UI.Requirement
 */
UI.Requirement = function(queries) {
	this._queries = [].concat(queries);
};

UI.Requirement.prototype = {
	_queries: null,

	test: function() {
		return DH.query(this._queries.join(', ')).length >= this._queries.length;
	}
};

/**
 * @class WatchUI
 */
function WatchUI(buttons) {
	UI.call(this, new UI.Content(buttons));
}

WatchUI.prototype = extend(UI, {
	_def: {
		panel: function(content) {
			return {
				attributes: {
					'id': 'action-panel-yays',
					'class': 'action-panel-content hid',
					'data-panel-loaded': 'true'
				},
				children: UI.prototype._def.panel(content)
			};
		}
	}
});

/**
 * @class Watch8UI
 */
function Watch8UI(buttons) {
	WatchUI.call(this, buttons);

	DH.append(DH.id('watch8-secondary-actions'), this.button);
	DH.append(DH.id('watch-action-panels'), this.panel);
}

Watch8UI.requirement = new UI.Requirement(['#page.watch #watch8-secondary-actions', '#page.watch #watch-action-panels']);

Watch8UI.prototype = extend(WatchUI, {
	_def: {
		button: function(click) {
			return {
				tag: 'span',
				children: {
					tag: 'button',
					attributes: {
						'type': 'button',
						'class': 'action-panel-trigger yt-uix-button yt-uix-button-empty yt-uix-button-has-icon yt-uix-button-opacity yt-uix-button-size-default yt-uix-tooltip',
						'data-button-toggle': 'true',
						'data-trigger-for': 'action-panel-yays',
						'data-tooltip-text': _('Player settings')
					},
					listeners: {
						'click': click
					},
					children: {
						tag: 'span',
						attributes: {
							'class': 'yt-uix-button-icon-wrapper'
						},
						children: UI.prototype._def.icon({
							attributes: {
								'class': 'yt-uix-button-icon'
							}
						})
					}
				}
			};
		},

		panel: WatchUI.prototype._def.panel
	}
});

/**
 * @class ChannelUI
 */
function ChannelUI(buttons) {
	UI.call(this, new UI.Content(buttons));

	DH.append(DH.id('channel-navigation-menu'), {
		tag: 'li',
		children: [this.button, this.panel]
	});
}

ChannelUI.requirement = new UI.Requirement('#channel-navigation-menu');

ChannelUI.prototype = extend(UI, {
	_def: {
		button: function(click) {
			return {
				tag: 'button',
				attributes: {
					'type': 'button',
					'role': 'button',
					'class': 'yt-uix-button yt-uix-button-empty yt-uix-button-epic-nav-item yt-uix-tooltip flip',
					'data-button-menu-id': 'yays-panel-dropdown',
					'data-tooltip-text': _('Player settings')
				},
				style: {
					'position': 'absolute',
					'right': '20px',
					'width': '30px'
				},
				listeners: {
					'click': click
				},
				children: {
					tag: 'span',
					attributes: {
						'class': 'yt-uix-button-icon-wrapper'
					},
					style: {
						'opacity': '0.75'
					},
					children: UI.prototype._def.icon()
				}
			};
		},

		panel: function(content) {
			return {
				attributes: {
					'id': 'yays-panel-dropdown',
					'class': 'epic-nav-item-dropdown hid'
				},
				style: {
					'padding': '5px 10px 10px',
					'width': '450px'
				},
				children: UI.prototype._def.panel(content)
			};
		}
	}
});

/*
 * Ready callbacks.
 */

function onReady(player) {
	var
		videoPlayback = new VideoPlayback(player),
		videoQuality = new VideoQuality(player),
		playerSize = new PlayerSize(player),
		previousVideo = player.getVideoId();

	player.onStateChange = function() {
		try {
			var currentVideo = player.getVideoId();

			if (currentVideo == previousVideo) {
				videoQuality.apply();
				videoPlayback.apply();
			}
			else {
				videoQuality.cease();
				videoPlayback.cease();

				throw null;
			}
		}
		catch (e) {
			Player.invalidate(player);

			asyncCall(onPlayerReady);
		}
	};

	videoQuality.apply();
	videoPlayback.apply();

	if (Watch8UI.requirement.test()) {
		playerSize.apply();

		UI.initialize(Watch8UI, [
			new VideoQuality.Button(videoQuality),
			new PlayerSize.Button(playerSize),
			new VideoPlayback.Button(videoPlayback)
		]);
	}
	else if (ChannelUI.requirement.test()) {
		UI.initialize(ChannelUI, [
			new VideoQuality.Button(videoQuality),
			new VideoPlayback.Button(videoPlayback)
		]);
	}
}

function onPlayerReady() {
	each(DH.query('video, embed'), function(i, node) {
		var player = DH.closest(node, function(node) { return Player.test(DH.unwrap(node)); });

		if (player) {
			try {
				player = Player.initialize(DH.unwrap(player));

				onReady(player);

				Console.debug('Initialization finished');
			}
			catch (e) {
				Console.debug(e);
			}
		}
	});
}

onPlayerReady();

// FIXME: The call to an exported function is rejected if a function (or an
// object with methods) is passed as argument.
//
// This restriction can be lifted in FF 33+ by setting the 'allowCallbacks'
// option when exporting the function.

var node = DH.build({
	tag: 'script',
	attributes: {
		'type': 'text/javascript'
	}
});

node.text = 'function onYouTubePlayerReady() { ' + scriptContext.publish('onPlayerReady', intercept(unsafeWindow.onYouTubePlayerReady, asyncProxy(onPlayerReady))) + '(); }';

document.documentElement.appendChild(node);
document.documentElement.removeChild(node);

} // YAYS

if (window.top === window.self) {
	if (this.unsafeWindow) { // Greasemonkey.
		YAYS(unsafeWindow);
	}
	else {
		var node = document.createElement('script');
		node.setAttribute('type', 'text/javascript');
		node.text = '(' + YAYS.toString() + ')(window);';

		document.documentElement.appendChild(node);
		document.documentElement.removeChild(node);
	}
}