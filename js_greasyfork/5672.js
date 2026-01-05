// ==UserScript==
// @name         Aria2 RPC
// @namespace    moe.jixun
// @version      0.1
// @license      MIT
// ==/UserScript==

// Public Class Aria2 ( options )

var Aria2 = (function (_isGM, _arrFn, _merge, _format, _isFunction) {
	var jsonrpc_ver = '2.0';

	if (_isGM) {
		var doRequest = function ( opts ) {
			console.warn ([
				'Warning: You are now using an simple implementation of GM_xmlhttpRequest',
				'Cross-domain request are not avilible unless configured correctly @ target server.',
				'',
				'Some of its features are not avilible, such as `username` and `password` field.'
			].join('\n'));

			var oReq = new XMLHttpRequest ();
			var cbCommon = function (cb) {
				return (function () {
					cb ({
						readyState: oReq.readyState,
						responseHeaders: opts.getHeader ? oReq.getAllResponseHeaders() : null,
						getHeader: oReq.getResponseHeader.bind (oReq),
						responseText: oReq.responseText,
						status: oReq.status,
						statusText: oReq.statusText
					});
				}).bind (opts);
			};

			if (opts.onload)  oReq.onload   = cbCommon (opts.onload);
			if (opts.onerror) oReq.onerror  = cbCommon (opts.onerror);

			oReq.open(opts.method || 'GET', opts.url, !opts.synchronous);

			if (opts.headers) {
				Object.keys(opts.headers).forEach (function (key) {
					oReq.setRequestHeader (key, opts.headers[key]);
				});
			}
			return oReq.send(opts.data || null);
		};
	} else {
		var doRequest = GM_xmlhttpRequest;
	}

	var AriaBase = function ( options ) {
		this.options = _merge ({
			auth: {
				type: AriaBase.AUTH.noAuth,
				user: '',
				pass: ''
			},
			host: '127.0.0.1',
			port: 6800
		}, options || {});

		this.id = parseInt (options, 10) || (+ new Date());
	};
	
	// 静态常量
	AriaBase.AUTH = {
		noAuth: 0,
		basic:  1,
		secret: 2
	};

	// public 函数
	AriaBase.prototype = {
		getBasicAuth: function () {
			return btoa (_format('%s:%s', this.options.auth.user, this.options.auth.pass));
		},

		send: function ( bIsDataBatch, data, cbSuccess, cbError ) {
			var srcTaskObj = { jsonrpc: jsonrpc_ver, id: this.id };

			var payload = {

				method: 'POST',
				url: _format('http://%s:%s/jsonrpc', this.options.host, this.options.port),
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: bIsDataBatch
					? data.map (function (e) { return _merge ({}, srcTaskObj, e); })
					: _merge ({}, srcTaskObj, data),
				onload: function (r) {
					var repData = JSON.parse (r.responseText);
					if (repData.error) {
						cbError && cbError (false, repData);
					} else {
						cbSuccess && cbSuccess (repData);
					}
				},
				onerror: cbError ? cbError.bind(null, false) : null
			};

			switch ( parseInt (this.options.auth.type, 10) ) {
				case AriaBase.AUTH.noAuth:
					// DO NOTHING
					break;

				case AriaBase.AUTH.basic:
					payload.headers.Authorization = 'Basic ' + this.getBasicAuth();
					break;

				case AriaBase.AUTH.secret:
					(function (sToken) {
						if (bIsDataBatch) {
							for (var i = 0; i < payload.data.length; i++) {
								payload.data[i].params.splice(0, 0, sToken);
							}
						} else {
							if (!payload.data.params)
								payload.data.params = [];
							payload.data.params.splice(0, 0, sToken);
						}
					})(_format('token:%s', this.options.auth.pass));
					break;

				default:
					throw new Error('Undefined auth type: ' + this.options.auth.type);
			}

			payload.data = JSON.stringify ( payload.data );

			return doRequest (payload);
		},

		// batchAddUri ( foo, { uri: 'http://example.com/xxx', options: { ... } } )
		batchAddUri: function (fCallback) {
			console.warn (
				'This function [%s] has deprecated! Consider use %s instead.',
				'batchAddUri', 'AriaBase.BATCH'
			);

			// { url, name }
			var payload = [].slice.call (arguments, 1).map (function (arg) {
				return {
					method: 'aria2.addUri',
					params: [ arg.uri.map ? arg.uri : [ arg.uri ] ].concat (arg.options || [])
				};
			});
			
			return this.send (true, payload, fCallback, fCallback);
		}
	};


	// 添加各类函数
	AriaBase.fn = {};
	_arrFn.forEach (function (sMethod) {
		// 函数链表
		AriaBase.fn[sMethod] = sMethod;

		// arg1, arg2, ... , [cbSuccess, [cbError]]
		AriaBase.prototype[sMethod] = function ( ) {
			var args = [].slice.call (arguments);

			var cbSuccess, cbError;
			if (args.length && _isFunction(args[args.length - 1])) {
				cbSuccess = args[args.length - 1];
				args.splice (-1, 1);

				if (args.length && _isFunction(args[args.length - 1])) {
					cbError = cbSuccess;
					cbSuccess = args[args.length - 1];
					args.splice (-1, 1);
				}
			}

			return this.send (false, {
				method: 'aria2.' + sMethod,
				params: args
			}, cbSuccess, cbError);
		};
	});

	AriaBase.BATCH = function ( parent, cbSuccess, cbFail ) {
		if (!(parent instanceof AriaBase))
			throw new Error ('Parent is not AriaBase!');

		this.parent = parent;
		this.data = [];

		this.onSuccess = cbSuccess;
		this.onFail = cbFail;
	};

	AriaBase.BATCH.prototype = {
		addRaw: function (fn, args) {
			this.data.push ({
				method: 'aria2.' + fn,
				params: args
			});
			return this;
		},

		add: function (fn) {
			// People can add more without edit source.
			if (!AriaBase.fn[fn])
				throw new Error ('Unknown function: ' + fn + ', please check if you had a typo.');

			return this.addRaw (fn, [].slice.call(arguments, 1));
		},

		send: function () {
			// bIsDataBatch, data, cbSuccess, cbError
			var ret = this.parent.send ( true, this.data, this.onSuccess, this.onFail );
			this.reset ();
			return ret;
		},

		getActions: function () {
			return this.data.slice();
		},

		setActions: function (actions) {
			if (!actions || !actions.map) return ;

			this.data = actions;
		},

		reset: function () {
			this.onSuccess = this.onFail = null;
			this.setActions ( [] );
		}
	};
	
	return AriaBase;
})
// const 变量
('undefined' == typeof GM_xmlhttpRequest, [
	"addUri", "addTorrent", "addMetalink", "remove", "forceRemove",
	"pause", "pauseAll", "forcePause", "forcePauseAll", "unpause",
	"unpauseAll", "tellStatus", "getUris", "getFiles", "getPeers",
	"getServers", "tellActive", "tellWaiting", "tellStopped",
	"changePosition", "changeUri", "getOption", "changeOption",
	"getGlobalOption", "changeGlobalOption", "getGlobalStat",
	"purgeDownloadResult", "removeDownloadResult", "getVersion",
	"getSessionInfo", "shutdown", "forceShutdown", "saveSession"
], 
// private 函数
(function (base) {
	var _isObject = function (obj) {
		return obj instanceof Object;
	};
	var _merge = function (base) {
		var args = arguments,
			argL = args.length;
		for ( var i = 1; i < argL; i++ ) {
			Object.keys (args[i]).forEach (function (key) {
				if (_isObject(args[i][key]) && _isObject(base[key])) {
					base[key] = _merge (base[key], args[i][key]);
				} else {
					base[key] = args[i][key];
				}
			});
		}
		return base;
	};
	return _merge;
})(), function (src) {
	var args = arguments,
		argL = args.length;

	var ret = src.slice ();
	for ( var i = 1; i < argL; i++ )
		ret = ret.replace ('%s', args[i]);
	return ret;
}, function (foo) {
	return typeof foo === 'function'
});
