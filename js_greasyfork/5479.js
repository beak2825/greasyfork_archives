// ==UserScript==
// @name       Stack Snippets Console
// @namespace  http://stackexchange.com/users/3846032/scimonster
// @version    1.1.0
// @description  Add a console to "Stack Snippets" executable code on StackExchange
// @include    http://*.stackexchange.com/*
// @include    http://stackoverflow.com/*
// @include    http://*.stackoverflow.com/*
// @include    http://stacksnippets.net/*
// @copyright  2014+, Scimonster
// @downloadURL https://update.greasyfork.org/scripts/5479/Stack%20Snippets%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/5479/Stack%20Snippets%20Console.meta.js
// ==/UserScript==

if (!window.postMessage) {
	console.log('postMessage not supported; Snippets Console cannot work');
	return;
}

if (location.hostname == 'stacksnippets.net') {
(function(){

	// define some functions

	function isSEDomainName(dname) {
		return !!~["stackoverflow.com", "stackexchange.com"].indexOf(dname.split('.').slice(-2).join('.'));
	}

	function URLparser(href) {
		var p = document.createElement('a');
		p.href = href;
		return p;
	}

	// listen for the ping

	this.addEventListener('message', function(ev){
		if (isSEDomainName(URLparser(ev.origin).hostname) && ev.data == 'console ping') {
			// passes the test
			listen(ev);
		}
	}, false);

	// listen for console.log()s

	function listen(ev) {

		var oldLog = console.log;

		function log(firstArg) {
			var args = [].slice.call(arguments);

			oldLog.apply(console, args); // use the default console.log()

			if (typeof firstArg == 'string') { // might require replacing
				if (~firstArg.indexOf('%s') || ~firstArg.indexOf('%d') || ~firstArg.indexOf('%i') || ~firstArg.indexOf('%f')) {
					// there is something to be replaced
					args.shift();
					firstArg = firstArg.replace(/%[sdif]/g, function(match){
						switch (match) {
							case '%s': return args.shift().toString();
							case '%d': case '%i': return parseInt(args.shift());
							case '%f': return parseFloat(args.shift());
							default: return match;
						}
					});
					args.unshift(firstArg);
				}
			}
			// replacements done, ready for concat
			var text = args.map(function(a){
				if (typeof a == 'object') {
					try {
						return JSON.stringify(a);
					} catch(e) {
						return "{bad object}";
					}
				}
				return a.toString();
			});

			postMessage('log', text.join(''));
		}

		this.console.log = log;

		this.addEventListener('error', function(ev){
			postMessage('err', ev.message);
		}, false);

		function postMessage(type, message) {
			ev.source.postMessage({
				type: type,
				message: message,
				time: new Date,
				snippet: this.name // the iframe
			}, ev.origin);
		}

	}

})();
} else {
(function(){

	function padNum(num, length) {
		num = num.toString();
		return num.length < length ? padNum('0' + num, length) : num;
	}

	$(document).on('click', 'div.snippet-result input[type=button]', function(){
		var container = $(this).parent().parent();
		container.children('.snippet-console').remove();
		if (!this.className) { // the run button
			$('<div class="snippet-console"><h6><a href="http://stackapps.com/q/4931/28683" target="_blank">Snippet Console</a> <small>v1.1.0</small></h6><ul></ul></div>').appendTo(container).css({
				position: 'relative',
				width: '100%',
				maxHeight: 200,
				borderTopWidth: 1,
				borderTopStyle: 'solid',
				borderTopColor: 'rgb(170, 170, 170)',
				overflow: 'auto',
				display: 'none'
			}).children('ul').css({
				listStyleType: 'none',
				fontFamily: 'monospace'
			});

			var snippet = container.find('iframe')[0];

			snippet.onload = function(){
				setTimeout(function(){
					snippet.contentWindow.postMessage('console ping', "*");
					// need to accept all because the iframe has no URL
				}, 100);
			};
		}
	});

	window.addEventListener('message', function(ev){
		if (ev.origin == 'null' && ev.data.snippet) { // seems to be a snippet
			var time = padNum(ev.data.time.getHours(),2)+':'+padNum(ev.data.time.getMinutes(),2)+':'+padNum(ev.data.time.getSeconds(),2)+'.'+padNum(ev.data.time.getMilliseconds(),3);
			var li = $('<li data-type="'+ev.data.type+'"><span style="color:gray">'+time+':</span> <span></span></li>');
			li.find('span').last().text(ev.data.message);
			if (ev.data.type == 'err') {
				li.find('span').last().css('color', 'red');
			}
			var snCons = $('iframe[name="'+ev.data.snippet+'"]').parent().siblings('.snippet-console').show();
			snCons.children('ul').append(li);
			snCons.scrollTop(snCons.children('ul').height()); // scroll to bottom
		}
	}, false);
})();
}