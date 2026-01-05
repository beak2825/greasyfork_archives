// ==UserScript==
// @name        Fimfiction Events API (ref FimfictionAdvanced, Nosey Hound)
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     4.2.2
// @match       *://www.fimfiction.net/*
// @grant       none
// @run-at      document-start
// ==/UserScript==

function RunScript(func, immediate, params) {
	const pars = Array.apply(null, arguments);
	pars.slice(0, 2);
	RunScript.build(func.toString(), pars).run(immediate);
}
RunScript.ready = function(func, immediate, params) {
	window.addEventListener('DOMContentLoaded', () => RunScript(func, immediate, params));
};
RunScript.build = (functionText, params) => {
	return {
		run: function(immediate) {
			if (!document.body) return window.addEventListener('DOMContentLoaded', () => this.run(immediate));
			const scr = document.createElement('SCRIPT');
			scr.innerHTML = immediate ? `(${functionText}).apply(this, ${params ? JSON.stringify(params) : ''});` : functionText;
			document.body.appendChild(scr);
			scr.parentNode.removeChild(scr);
		}
	};
};

(_ => {
	function initialise() {
		const win = this['unsafeWindow'] || window;
		const VERSION = 4.2;
		
		if (window !== win && (!window.FimFicEvents || window.FimFicEvents.version() < VERSION)) {
			window.FimFicEvents = {
				on: (name, func) => (name, func) => {
					name.split(' ').forEach(a => document.addEventListener(a, func));
					return func;
				},
				off: (name, func) => name.split(' ').forEach(a => document.removeEventListener(a, func)),
				trigger: (name, e) => RunScript.build(`() => FimFicEvents.trigger("${name}", ${JSON.stringify(e)})`).run(true),
				subscribe: func => RunScript.build(`() => FimFicEvents.subscribe(${func.toString()})`).run(true),
				getEventObject: win.FimFicEvents.getEventObject,
				version: win.FimFicEvents.version,
			};
		}
		if (!win.FimFicEvents || win.FimFicEvents.version() < VERSION) {
			if (win === window) return scriptBody(VERSION);
			RunScript(scriptBody, true, VERSION);
		}
	}
	
	try {
		initialise();
	} catch (e) {console.error(e);}
	
	function scriptBody(ver) {
		const some = a => a;
		const eventMap = {
			'/ajax/bbcode/html': 'previewcontent',
			'/ajax/notifications/mark-all-read': 'note_markread',
			'/ajax/private-messages/mark-all-read': 'pm_markread',
			'/ajax/notifications/list/drop-down': 'listnotes',
			'/ajax/private-messages/list/drop-down': 'listpms',
			'/ajax/feed': 'loadfeed',
			'/ajax/emoticons/list': 'listemoticons',
			'/ajax/toolbar/stories': _ => some({ eventName: 'toolbar', type: 'stories' }),
			'/ajax/toolbar/blog-posts': _ => some({ eventName: 'toolbar', type: 'blogs' })
		};
		const complexEventMap = [
			{
				test: /\/ajax\/users\/([^\/]+)\/infocard/, func: match => some({
					eventName: 'infocard',
					user: { id: match[1], name: decodeURIComponent(/\/user\/[0-9]+\/([^\/]*)$/.exec(document.querySelector('a:hover').href)[1]) }
				})
			}, {
				test: /\/ajax\/private-messages\/new/, func: (match,url) => {
					let event = {eventName: 'composepm', recipient: '', subject: ''};
					if (match = /reciever=([^&]+)/.exec(url)) event.recipient = match[1];
					if (match = /subject=([^&]+)/.exec(url)) event.subject = match[1];
					return event;
				}
			}, {
				test: /\/ajax\/comments/, func: (match,url) => some({
					eventName: url.split('/').length == 5 ? 'editcomment' : 'pagechange'
				})
			}, {
				test: /\/ajax\/([^\/]+)\/([0-9]+)\/comments/, func: match => some({
					eventName: 'addcomment', type: match[1], id: match[2]
				})
			}, {
				test: /\/ajax\/users\/modules\/([^\/]+)(\/edit|\/modules|)/, func: match => some({
					eventName: match[2] == '/edit' ? 'editmodule' : 'savemodule', box: match[1]
				})
			}
		];
		let eventRegister = url => {
			let o = eventMap[url];
			if (o) return typeof(o) === 'string' ? { eventName: o } : o(url);
			for (let i = 0; i < complexEventMap.length; i++) {
				let match = complexEventMap[i].test.exec(url);
				if (match) return complexEventMap[i].func(match, url);
			}
			console.log(`Unhandled method ignored: "${url}"`);
			return null;
		};
		
		function getEventObject(a, callback) {
			if (a.__fimficevents__ || typeof(a.url) !== 'string') return;
			const o = eventRegister(a.url);
			a.__fimficevents__ = 1;
			if (!o) return;
			o.url = a.url;
			o.data = a.data;
			callback(o);
		}
		
		function override(obj, name, func) {
			const sup = obj[name];
			obj[name] = function(...pars) {return func(this, pars, sup);};
		}
		
		window.FimFicEvents = {
			on: (name, func) => {
				name.split(' ').forEach(a => document.addEventListener(a, func));
				return func;
			},
      one: (name, func) => {
        const f = window.FimFicEvents.on(name, function() {
          window.FimFicEvents.off(name, f);
          return func.apply(this, arguments);
        });
        return f;
      },
			off: (name, func) => name.split(' ').forEach(a => document.removeEventListener(a, func)),
			trigger: (name, event) => {
				name = new CustomEvent(name);
				name.event = event;
				document.dispatchEvent(name);
			},
			subscribe: evFunc => {
				const old = eventRegister;
				eventRegister = url => evFunc(url) || old(url);
			},
			PROXY: function(sender, func, args, m) {
        let prevented = false;
				let a = args[0];
				if (typeof a === 'string') a = args[0] = {url: a};
				getEventObject(a, event => {
          event.preventDefault = _ => prevented = true;
          this.trigger(`early${event.eventName}`, event);
					override(a, 'success', (self, pars, sup) => {
						let result = undefined;
						event.result = pars[0];
						event.request = pars[1];
						this.trigger(`before${event.eventName}`, event);
						pars[0] = event.result;
						if (sup) result = sup.apply(self, pars);
						event.result = pars[0];
						this.trigger(`after${event.eventName}`, event);
						return result;
					});
				});
        if (prevented) return;
				return func.apply(sender, args);
			},
			getEventObject: getEventObject,
			version: _ => ver
		};
		window.FimFicEvents.version.toString = window.FimFicEvents.version;
		
		const inject = () => ((obj, parent, child) => {
			child.super = obj[parent].super || obj[parent];
			child.prototype = child.super.prototype;
			Object.keys(child.super).forEach(k => child[k] = child.super[k]);
			obj[parent] = child;
		})(window, 'AjaxRequest', function() {
			return window.FimFicEvents.PROXY(this, window.AjaxRequest.super, arguments, false);
		});
		
		if (!window.AjaxRequest) return window.addEventListener('DOMContentLoaded', () => {
      if (window.AjaxRequest) inject();
    });
		inject();
	}
})();
